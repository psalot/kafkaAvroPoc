module.exports = {
	avroConfigurations: {
		kafkaBroker: "172.16.27.78:9092",
		schemaRegistry: "http://172.16.27.78:8081",
		topics: ["avrotest"]
		// parseOptions: { wrapUnions: true }
	},
	avroLogLevel: "info",
	kafkaConfig: {
		dr_cb: true,
		debug: "all",
		"metadata.broker.list": "172.16.27.78:9092"
	},
	topicName: "avrotest"
};
