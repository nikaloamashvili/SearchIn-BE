const { MongoClient } = require("mongodb");
const { json } = require("stream/consumers");
require('dotenv').config()

const mongoClient = new MongoClient(process.env.MONGODB_URI);

const clientPromise = mongoClient.connect();

const handler = async (event) => {
    try {
      console.log(event.body)
        const { name } = JSON.parse(event.body);
        const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
        const collection = database.collection(process.env.MONGODB_COLLECTION2);
        collection.deleteMany({ name:name})
        return{
          statusCode:200,
          body:JSON.stringify({status:"ok"}),
          headers: {
            "access-control-allow-origin": "*",
          }
        }
    } catch (error) {
        return { statusCode: 500, body: error.toString() }
    }
}

module.exports = { handler }
