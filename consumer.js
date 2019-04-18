const config = require("./config");
const KafkaAvro = require("./kafka_avro");
const Avro = new KafkaAvro(config);

Avro.then(avroObj => {
	const consumer = avroObj.consumer;
	// 	console.log("in then");
	// })
	// 	.then(consumer => {
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
}).catch(err => {
	console.log(err, "consumer error catch");
});
