const KafkaAvro = require("kafka-avro");
const config = require("./config");
const kafkaAvro = new KafkaAvro(config.avroConfigurations);

//uncomment line nos 6 to 15 if you want to print logs
// const bunyanLog = require("bunyan-format");
// const kafkaLog = KafkaAvro.getLogger();
// kafkaLog.addStream({
// 	type: "stream",
// 	stream: bunyanLog({
// 		outputMode: "short",
// 		levelInString: true
// 	}),
// 	level: config.avroLogLevel
// });

// console.log(KafkaAvro.CODES);

// Query the Schema Registry for all topic-schema's
// fetch them and evaluate them.

let producer;
function initKafkaAvro(kafkaConfig) {
	return new Promise((resolve, reject) => {
		return kafkaAvro
			.init()
			.then(function() {
				return kafkaAvro
					.getProducer(kafkaConfig)
					.then(function(producerData) {
						producer = producerData;
						producerData.on("delivery-report", function(err, report) {
							console.log("delivery-report: " + JSON.stringify(report), err);
							// counter++;
						});
						producerData.on("producer error", err => {
							console.log(err, "producer error");
							// process.exit(1);
						});
						producer.on("event.log", function(log) {
							console.log("producer log:", log);
						});

						//logging all errors
						producer.on("error", function(err) {
							console.log("Error from producer:", err);
						});
						resolve(producer);
					})
					.catch(err => {
						// console.log(err, "catch first");
						reject(err);
					});
			})
			.catch(err => {
				// console.log(err, "catch second");
				reject(err);
			});
	});
}
function produceMessage(producer, topicName, partition = -1, message = {}) {
	try {
		// const type = kafkaAvro.sr.valueSchemas[topicName];
		// const schemaId = kafkaAvro.sr.schemaMeta[topicName].id;
		// kafkaAvro.serialize(type, schemaId, messageData);

		let key = { id: Math.random().toString() };

		setInterval(function() {
			console.log("produce message");
			producer.produce(topicName, partition, message, key, Date.now());
		}, 10000);
	} catch (e) {
		console.log(e);
	}
}

const messageData = { id: Math.random().toString(), name: "Test" };

try {
	initKafkaAvro(config.kafkaConfig)
		.then(producer => {
			setInterval(() => {
				producer.poll();
			}, config.kafkaPollInterval);
			produceMessage(producer, config.topicName, -1, messageData);
		})
		.catch(err => {
			console.log(err, "error outer");
			initErrorHandler(err);
		});
} catch (e) {
	console.log(e, "in catch");
}

function initErrorHandler(err) {
	console.log("in init");
}
