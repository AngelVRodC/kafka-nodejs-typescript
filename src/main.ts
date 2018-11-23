
import * as Kafka from "node-rdkafka";
declare const Buffer
const producer = new Kafka.Producer({
  'client.id': 'kafka',
  'metadata.broker.list': 'localhost:9092',
  'compression.codec': 'gzip',
  'retry.backoff.ms': 200,
  'message.send.max.retries': 10,
  'socket.keepalive.enable': true,
  'queue.buffering.max.messages': 100000,
  'queue.buffering.max.ms': 1000,
  'batch.num.messages': 1000000,
  'dr_cb': true
},{});

producer.connect();

// Wait for the ready event before proceeding
producer.on('ready', async () => {
    try {
      await producer.produce(
        // Topic to send the message to
        'topic',
        // optionally we can manually specify a partition for the message
        // this defaults to -1 - which will use librdkafka's default partitioner (consistent random for keyed messages, random for unkeyed messages)
        null,
        // Message to send. Must be a buffer
        Buffer.from('Awesome message'),
        // for keyed messages, we also specify the key - note that this field is optional
        'Stormwind',
        // you can send a timestamp here. If your broker version supports it,
        // it will get added. Otherwise, we default to 0
        Date.now(),
        // you can send an opaque token here, which gets passed along
        // to your delivery reports
      );
      console.log('ready');
    } catch (err) {
      console.error('A problem occurred when sending our message');
      console.error(err);
    }
  });
  

  producer.on('event.error',(err: string) => {
    console.error('Error from producer');
    console.error(err);
  })
