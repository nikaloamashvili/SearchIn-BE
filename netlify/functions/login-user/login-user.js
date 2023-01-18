const { MongoClient } = require("mongodb");
const { json } = require("stream/consumers");
require('dotenv').config()
const bcrypt = require("bcryptjs");

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const jwt = require("jsonwebtoken");

const JWT_SECRET =process.env.JWT_SECRET

const clientPromise = mongoClient.connect();

const handler = async (event) => {
    try {

      console.log(event.body)

        const { email, password } = JSON.parse(event.body);

        const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
        const collection = database.collection(process.env.MONGODB_COLLECTION);
        // const results = await collection.find({}).limit(5).toArray();

        
  const user = await collection.findOne({ email });
  console.log(user);
    if (!user) {
    return res.json({ error: "User Not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    console.log("work")
    const token = jwt.sign({ email: user.email }, JWT_SECRET);
    console.log(token)
    return{
      statusCode:200,
      body:JSON.stringify({ status: "ok", data: token }),
      headers: {
        "access-control-allow-origin": "*",
      }
    }

  }else{
    return{
      statusCode:401,
      body:JSON.stringify({ status: "error",  error: "InvAlid Password" }),
      headers: {
        "access-control-allow-origin": "*",
      }
    }
  }
        // Function logic here ...
    } catch (error) {
        return { statusCode: 500, body: error.toString() }
    }
}

module.exports = { handler }
        // collection.insertOne({ item: "card", qty: 15 })
