var KafkaAvro = require("kafka-avro");
// var fmt = require("bunyan-format");

// var kafkaLog = KafkaAvro.getLogger();

// kafkaLog.addStream({
// 	type: "stream",
// 	stream: fmt({
// 		outputMode: "short",
// 		levelInString: true
// 	}),
// 	level: "info"
// });
var kafkaAvro = new KafkaAvro({
	kafkaBroker: "172.16.27.78zscd:9092",
	schemaRegistry: "http://172.16.27.78:8081",
	topics: ["testNodeKafkaAvroTwo"]
});

// console.log(KafkaAvro.CODES);

// Query the Schema Registry for all topic-schema's
// fetch them and evaluate them.
try {
	kafkaAvro
		.init()
		.then(function() {
			kafkaAvro
				.getProducer({
					dr_cb: true
					// Options listed bellow
				})
				.then(function(producer) {
					try {
						var topicName = "testNodeKafkaAvroTwo";
						producer.on("disconnected", function(arg) {
							console.log("producer disconnected. " + JSON.stringify(arg));
						});
						producer.on("error", function(err) {
							console.log("error from producer", err);
						});

						// console.log("Sending data to kafka topic", producer);
						var messageData = {
							name: "Message",
							long: 23543546,
							test: "nulldata"
						};
						var type = kafkaAvro.sr.valueSchemas[topicName];
						var schemaId = kafkaAvro.sr.schemaMeta[topicName].id;
						console.log(type, schemaId);
						//kafkaAvro.serialize("record",2, testNodeKafkaAvroTwo);
						var key = "testNodeKafkaAvroTwo" + new Date();
						// const serialized = kafkaAvro.serialize(type, schemaId, messageData);

						// if partition is set to -1, librdkafka will use the default partitioner
						var partition = -1;

						setInterval(function() {
							producer.produce(
								topicName,
								partition,
								messageData,
								key,
								Date.now()
							);
						}, 15000);
						// console.log("jsf");
					} catch (e) {
						console.log(e);
					}
				});

			console.log("Ready to use");
		})
		.catch(err => {
			console.log(err, "before catch eerrr");
		});
} catch (e) {
	console.log(e);
}
