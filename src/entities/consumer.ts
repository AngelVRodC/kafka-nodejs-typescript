import * as Kafka from 'node-rdkafka';
import { Observable, Subscriber } from 'rxjs';


export class KafkaConsumer {

  private consumer: Kafka.KafkaConsumer;
  private channels: string[];

  constructor(channels: string[]) {
    this.channels = channels;
    this.consumer = new Kafka.KafkaConsumer({
      'group.id': 'kafka',
      'metadata.broker.list': process.env.KAFKA_URL,
      'offset_commit_cb': (err: string, topicPartitions: string) => {

        if (err) {
          // There was an error committing
          console.error(err);
        } else {
          // Commit went through. Let's log the topic partitions
          console.log(topicPartitions);
        }

      }
    },{})
    this.consumer.connect();
  }

  public request = new Observable((observer: Subscriber<string>) => {
    this.consumer.on('ready',() => {
      this.consumer.subscribe(this.channels);
      console.log('ready');
      this.consumer.consume();
    })
    .on('data', (data: any) => {
      const result = data.value.toString();
      observer.next(result);
    });
  });
}