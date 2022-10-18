import { MongoClient } from 'mongodb';

async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;

    const client = await MongoClient.connect(
      'mongodb+srv://0x3c:IwMB11GkkHZ4LKyV@cluster0.gnlmiqz.mongodb.net/liquidity?retryWrites=true&w=majority'
    );

    const db = client.db();

    const liquidityCollcection = db.collection('liquidityChange');
    const result = await liquidityCollcection.insertOne(data);

    client.close();
    res.status(201).json({ message: ' liquidity changed!' });
  }
}
export default handler;
