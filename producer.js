const config = require("./config");
const KafkaAvro = require("./kafka_avro");
const Avro = new KafkaAvro(config);

Avro.then(avroObj => {
	const producerObj = avroObj.producer;
	producerObj.on("delivery-report", function(err, report) {
		console.log("delivery-report: " + JSON.stringify(report), err);
	});
	producerObj.on("producer error", err => {
		console.log(err, "producer error");
	});
	producerObj.on("event.log", function(log) {
		console.log("producer log:", log);
	});

	producerObj.on("error", function(err) {
		console.log("Error from producer:", err);
	});

	const messageData = { id: Math.random().toString(), name: "Test" };
	const key = { id: Math.random().toString() };
	//uncomment below lines if you want delivery reports
	// setInterval(() => {
	// 	producerObj.poll();
	// }, config.kafkaPollInterval);

	//call this only when you want to produce message
	setInterval(function() {
		producerObj.produce(config.topicName, -1, messageData, key, Date.now());
	}, 3000);
}).catch(err => {
	console.log(Error, err);
});
