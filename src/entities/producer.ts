import * as Kafka from 'node-rdkafka';

// if partition is set to -1, librdkafka will use the default partitioner
const partition = -1;

export class KafkaProducer {
  private producer: Kafka.Producer
  private topic: string;

  constructor(topic: string) {
    this.topic = topic;
    console.log(this.topic, process.env.KAFKA_URL);
    this.producer = new Kafka.Producer({
      //'debug' : 'all',
      'metadata.broker.list': process.env.KAFKA_URL,
      'dr_cb': true  //delivery report callback
    },{});
    this.producer.connect();
  }

  public sendMessage = async (message: any) => {
    try {
      this.producer.on('ready',async (arg: string) => {
        console.log(`producer ready ${JSON.stringify(arg)}`);
        const value = Buffer.from(JSON.stringify(message));
        const timestamp = new Date().getTime();
        console.log(message);
        await this.producer.produce(this.topic, partition, value, null, timestamp);
        await this.producer.poll();
      }).on('disconnected', (arg: string) => {
        console.log(`producer disconnected ${JSON.stringify(arg)}`);
      }).on('delivery-report', (err: string, report: string) => {
        console.log(err,`Delivery report ${JSON.stringify(report)}`);
      });
    }catch(error) {
      console.log(error);
    }
  }
  public disconnect = () => {
    this.producer.disconnect();
  }
}