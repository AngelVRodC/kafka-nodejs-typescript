
import * as Kafka from "node-rdkafka";
const stream = Kafka.createReadStream({
  'metadata.broker.list': 'localhost:9092',
  'group.id': 'librd-test',
  'socket.keepalive.enable': true,
  'enable.auto.commit': false
}, {}, {
  topics: 'test',
  waitInterval: 0,
  objectMode: false
});

stream.on('error', (err: string) => {
  if (err) console.log(err);
  process.exit(1);
});

stream.pipe(process.stdout);


stream.consumer.on('event.error', (err: string) => {
  console.log(err);
})