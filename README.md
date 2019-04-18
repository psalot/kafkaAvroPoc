# kafka-avro-nodejs

> This module is used for implementing kafka-avro using node.js

The kafka-avro-nodejs library is a wrapper that combines the [kafka-avro](https://github.com/waldophotos/kafka-avro), [node-rdkafka](https://github.com/Blizzard/node-rdkafka) and [avsc](https://github.com/mtth/avsc) libraries to allow for Production and Consumption of messages on kafka validated and serialized by Avro.

## Install

Install the module using NPM:

```
npm install kafka-avro-nodejs --save
```

### Implementation

- Run the docker-compose.yml file to run schema-registry,zookeeper and kafka (optional) (make sure to replace localhost with your IP)
- Create schemas in schema registry using API's specified [here](https://docs.confluent.io/current/schema-registry/develop/api.html)
- Please refer [producer.js](https://github.com/psalot/kafkaAvroPoc/blob/master/producer.js) and [consumer.js](https://github.com/psalot/kafkaAvroPoc/blob/master/consumer.js) to use this module
- Provide all configurations in config.js as shown
- Please make sure schemas are created in the schema registry first

### Sample schema registration commands

- curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" --data '{"schema": "{\"type\": \"record\", \"name\": \"avrotest_value\", \"fields\": [{\"type\": \"string\", \"name\": \"id\"},{\"type\": \"string\", \"name\": \"name\",\"default\": \"na\"}]}"}' http://localhost:8081/subjects/avrotest-value/versions

- curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" --data '{"schema": "{\"type\": \"record\", \"name\": \"avrotest_value\", \"fields\": [{\"type\": \"string\", \"name\": \"id\"},{\"type\": \"string\", \"name\": \"name\",\"default\": \"na\"}]}"}' http://schema-registry:8081/subjects/avrotest-key/versions
