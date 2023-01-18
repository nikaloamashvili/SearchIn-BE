const { MongoClient } = require("mongodb");
const { json } = require("stream/consumers");
require('dotenv').config()

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const jwt = require("jsonwebtoken");

const JWT_SECRET =process.env.JWT_SECRET
const clientPromise = mongoClient.connect();

const handler = async (event) => {
    try {
      console.log("here")

      console.log(event.body)

        const { token } = JSON.parse(event.body);

        const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
        const collection = database.collection(process.env.MONGODB_COLLECTION2);
        // const results = await collection.find({}).limit(5).toArray();

        const user = jwt.verify(token, JWT_SECRET, (err, res) => {
          if (err) {
            console.log( "token expired")
            return "token expired";
          }
          console.log("go")
          return res;
        });
        console.log(user);
        if (user == "token expired") {
          console.log( "token expired2")
          return{
            statusCode:500,
            body:JSON.stringify({ status: "error", data: "token expired" }),
            headers: {
              "access-control-allow-origin": "*",
            }
          }
        }else{
        const useremail = user.email;
  const ans=await collection.find({ email:useremail }).toArray();
       console.log(JSON.stringify(ans))
    return{

      statusCode:200,
      body:JSON.stringify({ status: "ok", data: JSON.stringify(ans)}),
      headers: {
        "access-control-allow-origin": "*",
      }
    }}


        // Function logic here ...
    } catch (error) {
      console.log(error.toString())

        return { statusCode: 500, data: error.toString() }
    }
}

module.exports = { handler }
