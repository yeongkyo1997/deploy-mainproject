import { BigQuery } from '@google-cloud/bigquery';
import {
  EntitySubscriberInterface,
  InsertEvent,
  Connection,
  EventSubscriber,
} from 'typeorm';
import { Product } from './product.entity';

@EventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface<Product> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Product;
  }

  afterInsert(event: InsertEvent<Product>): void | Promise<any> {
    console.log(event);

    const bigQuery = new BigQuery({
      keyFilename: process.env.KEY_BIGQUERY_NAME,
      projectId: process.env.PROJECT_ID,
    });
    bigQuery
      .dataset('mybigquery')
      .table('productlog')
      .insert([
        {
          id: event.entity.id,
          name: event.entity.name,
          description: event.entity.description,
          price: event.entity.price,
          isSoldout: event.entity.isSoldout,
        },
      ]);
  }
}
