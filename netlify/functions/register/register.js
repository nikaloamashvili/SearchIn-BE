const { MongoClient } = require("mongodb");
const { json } = require("stream/consumers");
require('dotenv').config()
const bcrypt = require("bcryptjs");

const mongoClient = new MongoClient(process.env.MONGODB_URI);

const clientPromise = mongoClient.connect();

const handler = async (event) => {
    try {
        const { fname, lname, email, password } = JSON.parse(event.body);
        const encryptedPassword = await bcrypt.hash(password, 10);

        console.log(fname,"sdass")
        const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
        const collection = database.collection(process.env.MONGODB_COLLECTION);
        // const results = await collection.find({}).limit(5).toArray();

        const oldUser = await collection.findOne({ email });

        if (oldUser) {
          return{
            statusCode:500,
            body:JSON.stringify({status:"User Exists"}),
            headers: {
              "access-control-allow-origin": "*",
            }
          }
        }
        collection.insertOne({ fname:fname, lname:lname, email:email, password:encryptedPassword})

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
