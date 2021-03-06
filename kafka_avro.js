const KafkaAvro = require("kafka-avro");

class Avro {
	constructor(connectionConfig, producerOrConsumer, logEnable = 1) {
		if (!connectionConfig) {
			throw new Error(
				`'Connection config' is either missing or not in the specified format`
			);
		}
		const kafkaAvro = new KafkaAvro(connectionConfig.avroConfigurations);
		if (logEnable == 1) {
			const bunyanLog = require("bunyan-format");
			const kafkaLog = KafkaAvro.getLogger();
			kafkaLog.addStream({
				type: "stream",
				stream: bunyanLog({
					outputMode: "short",
					levelInString: true
				}),
				level: connectionConfig.avroLogLevel
			});
		}
		return new Promise((resolve, reject) => {
			const thisObj = this;
			kafkaAvro
				.init()
				.then(async function() {
					if (producerOrConsumer == "producer") {
						const producer = await thisObj.startProducer(
							kafkaAvro,
							connectionConfig
						);
						resolve({ producer: producer });
					} else if (producerOrConsumer == "consumer") {
						const consumer = await thisObj.startConsumer(
							kafkaAvro,
							connectionConfig
						);
						resolve({ consumer: consumer });
					} else {
						const producer = await thisObj.startProducer(
							kafkaAvro,
							connectionConfig
						);
						const consumer = await thisObj.startConsumer(
							kafkaAvro,
							connectionConfig
						);

						resolve({ producer: producer, consumer: consumer });
					}
					// console.log(consumer, "resolve");
				})
				.catch(err => {
					// console.log(err, "catch second");
					reject(err);
				});
		});
	}

	startProducer(kafkaAvro, connectionConfig) {
		return new Promise((resolve, reject) => {
			kafkaAvro
				.getProducer(connectionConfig.kafkaConfigurations)
				.then(function(producerData) {
					console.log("Producer Connected");
					resolve(producerData);
				})
				.catch(err => {
					// console.log(err, "catch first");
					reject(err);
				});
		});
	}
	startConsumer(kafkaAvro, connectionConfig) {
		return new Promise((resolve, reject) => {
			kafkaAvro
				.getConsumer({
					"group.id": connectionConfig.topicName,
					"socket.keepalive.enable": true,
					"enable.auto.commit": true
				})
				.then(consumer => {
					// console.log("in then consumer");
					consumer.on("ready", function() {
						resolve(consumer);
					});

					consumer.connect({}, function(err) {
						if (err) {
							console.log("not connected");
							reject(err);
						}
						console.log("Consumer connected");
					});
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	produceMessage(topicName, partition = -1, message = {}, key) {
		try {
			producer.produce(topicName, partition, message, key, Date.now());
			// }, 10000);
		} catch (e) {
			console.log(e);
		}
	}

	// initErrorHandler(err) {
	// 	console.log("in init");
	// }
}
module.exports = Avro;
