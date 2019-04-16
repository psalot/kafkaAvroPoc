var KafkaAvro = require("kafka-avro");
const config = require("./config");
var kafkaAvro = new KafkaAvro(config.avroConfigurations);

// Query the Schema Registry for all topic-schema's
// fetch them and evaluate them.
kafkaAvro.init().then(function() {
	console.log("Ready to use");

	startConsumer();
});

function startConsumer() {
	kafkaAvro
		.getConsumer({
			"group.id": config.topicName,
			"socket.keepalive.enable": true,
			"enable.auto.commit": true
		})
		// the "getConsumer()" method will return a bluebird promise.
		.then(function(consumer) {
			// Perform a consumer.connect()
			return new Promise(function(resolve, reject) {
				consumer.on("ready", function() {
					console.log("ready");
					resolve(consumer);
				});

				consumer.connect({}, function(err) {
					if (err) {
						console.log("connected");
						reject(err);
						return;
					}
					resolve(consumer); // depend on Promises' single resolve contract.
				});
			});
		})
		.then(function(consumer) {
			// Subscribe and consume.
			// var topicName = "testNodeKafkaAvro";
			consumer.subscribe([config.topicName]);
			// setInterval(function() {
			consumer.consume();
			// }, 3000);
			consumer.on("error", function(err) {
				console.log(err, "avro error consumer");
			});
			consumer.on("data", function(rawData) {
				console.log("data:", rawData);
				// console.log("data", JSON.parse(rawData.value));
			});
		})
		.catch(err => {
			console.log(err, "consumer error catch");
		});
}
