const KafkaAvro = require("kafka-avro");
const config = require("./config");
const kafkaAvro = new KafkaAvro(config.avroConfigurations);
const bunyanLog = require("bunyan-format");

const kafkaLog = KafkaAvro.getLogger();

kafkaLog.addStream({
	type: "stream",
	stream: bunyanLog({
		outputMode: "short",
		levelInString: true
	}),
	level: config.avroLogLevel
});

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
						console.log("producer", producerData);
						producer = producerData;
						producerData.on("delivery-report", function(err, report) {
							console.log("delivery-report: " + JSON.stringify(report), err);
							// counter++;
						});
						producerData.on("producer error", err => {
							console.log(err, "producer error");
							process.exit(1);
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

// console.log(producer, "outer producer");
function produceMessage(producer, topicName, partition = -1, message = {}) {
	try {
		console.log("Sending data to kafka topic");

		// const type = kafkaAvro.sr.valueSchemas[topicName];
		// const schemaId = kafkaAvro.sr.schemaMeta[topicName].id;
		// console.log(type, schemaId);
		//kafkaAvro.serialize("record",2, avrotest);
		// const key = topicName + new Date();
		let key = { id: Math.random().toString() };
		let value = { id: Math.random().toString(), name: "Thanos" };
		// kafkaAvro.serialize(type, schemaId, messageData);

		// if partition is set to -1, librdkafka will use the default partitioner
		// const partition = -1;
		// console.log(topicName);
		setInterval(function() {
			console.log("produce message");
			producer.produce(topicName, partition, value, key, Date.now());
		}, 10000);
		// console.log("jsf");
	} catch (e) {
		console.log(e);
	}
}
let counter = 0;
// setInterval(async function() {
// 	// console.log(producer, "int");
const messageData = { id: Math.random().toString(), name: "Test" };
// 	console.log(counter++);
// 	await produceMessage(producer, config.topicName, -1, messageData);
// }, 10000);
try {
	initKafkaAvro(config.kafkaConfig)
		.then(producer => {
			// console.log(producer);
			producer.on("disconnected", function(arg) {
				console.log("producer disconnected. " + JSON.stringify(arg));
			});
			producer.on("error", function(err) {
				console.log("error from producer", err);
			});
			producer.on("event.log", function(log) {
				console.log("eventlog", log);
			});
			producer.on("event.error", function(err) {
				console.log("Error from producer in event error");
				console.log(err);
			});

			producer.on("ready", function(err, success) {
				console.log("in ready");
			});
			produceMessage(producer, config.topicName, -1, messageData);
		})
		.catch(err => {
			console.log(err, "error outer");
			// throw new Error(err);
			initErrorHandler(err);
		});
} catch (e) {
	console.log(e, "in catch");
}

function initErrorHandler(err) {
	console.log("in init");
	//can add custom logic to handle errors
}
// const t = setInterval(function() {
// 	if (producer) {
// 		clearInterval(t);
// 		producer.on("error", function(err) {
// 			console.log("Error from producer:", err);
// 		});
// 		producer.on("disconnected", function(arg) {
// 			console.log("producer disconnected. " + JSON.stringify(arg));
// 		});
// 		producer.on("error", function(err) {
// 			console.log("error from producer", err);
// 		});
// 		producer.on("event.log", function(log) {
// 			console.log(log);
// 		});
// 		producer.on("event.error", function(err) {
// 			console.log("Error from producer");
// 			console.log(err);
// 		});
// 		producer.on("delivery-report", function(err, report) {
// 			console.log("delivery-report: " + JSON.stringify(report), err);
// 			// counter++;
// 		});
// 	}
// }, 1000);
