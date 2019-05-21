module.exports = {
	avroConfigurations: {
		kafkaBroker: "172.21.0.1:9092",
		schemaRegistry: "http://172.21.0.1:8081",
		topics: ["avrotest"],
		parseOptions: { wrapUnions: true }
	},
	avroLogLevel: "info",
	kafkaConfigurations: {
		dr_cb: true,
		debug: "all",
		"metadata.broker.list": "172.21.0.1:9092"
	},
	kafkaPollInterval: 3000,
	topicName: "avrotest"
};
