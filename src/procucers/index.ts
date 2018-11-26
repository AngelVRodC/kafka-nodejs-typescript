import * as Kafka from "node-rdkafka";
declare const Buffer;
const producer = new Kafka.Producer({
  //'debug' : 'all',
  'metadata.broker.list': 'localhost:9092',
  'dr_cb': true  //delivery report callback
},{});

const topicName = 'test';

//logging debug messages, if debug is enabled
producer.on('event.log', (log: string) => {
  console.log(log);
});

//logging all errors
producer.on('event.error', (err: string) => {
  console.error('Error from producer');
  console.error(err);
});

//counter to stop this sample after maxMessages are sent
let counter = 0;
const maxMessages = 10;

producer.on('delivery-report', (err: string, report: string) => {
  console.log(err,`Delivery report ${JSON.stringify(report)}`);
  counter += 1;
});

//Wait for the ready event before producing
producer.on('ready', (arg: string) => {
  console.log(`producer ready ${JSON.stringify(arg)}`);

  for (let i = 0; i < maxMessages; i += 1) {
    const value = Buffer.from(`value-${i}`);
    const key = `key-${i}`;
    // if partition is set to -1, librdkafka will use the default partitioner
    const partition = -1;
    producer.produce(topicName, partition, value, key);
  }

  //need to keep polling for a while to ensure the delivery reports are received
  const pollLoop = setInterval(() => {
      producer.poll();
      if (counter === maxMessages) {
        clearInterval(pollLoop);
        producer.disconnect();
      }
    }, 1000);

});

producer.on('disconnected', (arg: string) => {
  console.log(`producer disconnected ${JSON.stringify(arg)}`);
});

//starting the producer
producer.connect();