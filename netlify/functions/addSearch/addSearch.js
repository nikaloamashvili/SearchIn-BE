const { MongoClient } = require("mongodb");
const { json } = require("stream/consumers");
require('dotenv').config()
const bcrypt = require("bcryptjs");

const mongoClient = new MongoClient(process.env.MONGODB_URI);

const clientPromise = mongoClient.connect();

const handler = async (event) => {
    try {

        const { email, name, url, conector } = JSON.parse(event.body);
        const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
        const collection = database.collection(process.env.MONGODB_COLLECTION2);
        collection.insertOne({ email:email, name:name, url:url, conector:conector})

        return{
          statusCode:200,
          body:JSON.stringify({status:"ok"}),
          headers: {
            "access-control-allow-origin": "*",
          }
        }

        // Function logic here ...
    } catch (error) {
        return { statusCode: 500, body: error.toString() }
    }
}

module.exports = { handler }
        // collection.insertOne({ item: "card", qty: 15 })
