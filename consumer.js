const KafkaAvro = require("kafka-avro");

// If running on host machine instead of inside docker, make sure to add
// hostnames 'kafka', 'schema-registry', 'zookeeper', etc to 127.0.0.1
const schemaRegistryUrl = "http://172.16.27.78:8081";
const broker = "172.16.27.78:9092";
const topicName = "avrotest";

// Ensure schema is in registry. See producer.js.

let kafkaAvro = new KafkaAvro({
	kafkaBroker: broker,
	schemaRegistry: schemaRegistryUrl,
	topics: [topicName],
	fetchAllVersions: true
});
kafkaAvro
	.init()
	.then(() => {
		console.log("Ready to use");
		return kafkaAvro.getConsumerStream(
			{
				"group.id": "avrotest",
				"socket.keepalive.enable": true,
				"enable.auto.commit": true
			},
			{
				"request.required.acks": 1
			},
			{ topics: topicName }
		);

		// return kafkaAvro.getConsumerStream(
		// 	{
		// 		"group.id": "avrotest",
		// 		"socket.keepalive.enable": true,
		// 		"enable.auto.commit": true
		// 	},
		// 	{ "enable.auto.commit": true },
		// 	{ topics: [topicName] }
		// );
	})
	.then(consumerStream => {
		console.log(
			"ready before",
			consumerStream,
			"=============",
			consumerStream.on
		);
		consumerStream.on("ready", function(ready) {
			console.log(ready, "ready state");
		});
		consumerStream.on("error", function(err) {
			console.log(err, "consumer error");
		});

		consumerStream.on("data", function(dataRaw) {
			console.log(dataRaw, "data response");
		});
		consumerStream.consumer.on("event.error", function(err) {
			console.log(err, "event error");
		});
	})
	.catch(err => {
		console.error("A problem occurred");
		console.error(err);
		process.exit(1);
	});
