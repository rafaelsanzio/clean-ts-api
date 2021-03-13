import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  client: (null as unknown) as MongoClient,

  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(String(process.env.MONGO_URL), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },

  async disconnect(): Promise<void> {
    await this.client.close();
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  },

  map: (collection: any): any => {
    const { _id, ...collectionWithoutId } = collection;
    return { id: _id, ...collectionWithoutId };
  },
};