import { MongoClient, ServerApiVersion } from "mongodb";

export async function POST(request: Request) {
  const { level } = await request.json();

  await recordDesiredLevel(level);

  return Response.json({ message: "Level recorded" });
}

const password = process.env.MONGO_PASSWORD;

const uri = `mongodb+srv://ilyanice:${password}@fms-24-interested.fkrxvem.mongodb.net/?retryWrites=true&w=majority&appName=fms-24-interested`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function recordDesiredLevel(level: string) {
  try {
    await client.connect();

    const database = client.db("fms-interested");
    const collection = database.collection("interested");
    const query = { level };
    const update = { $inc: { count: 1 } };
    const options = { upsert: true };
    await collection.updateOne(query, update, options);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
