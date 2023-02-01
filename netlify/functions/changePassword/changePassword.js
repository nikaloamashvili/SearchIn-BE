
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
      console.log("here")

      console.log(event.body)

        const { token,oPassword, nPassword0 } = JSON.parse(event.body);
        const encryptedPassword = await bcrypt.hash(nPassword0, 10);

        const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
        const collection = database.collection(process.env.MONGODB_COLLECTION);

        const user = jwt.verify(token, JWT_SECRET, (err, res) => {
          if (err) {
            return "token expired";
          }
          return res;
        });
        console.log(user);
        if (user == "token expired") {
          return{
            statusCode:500,
            body:JSON.stringify({ status: "error", data: "token expired" }),
            headers: {
              "access-control-allow-origin": "*",
            }
          }
        }else{
        const useremail = user.email;

  const ans=collection.findOne({ email:useremail }).then((data)=>{
    console.log(user);
    if (!user) {
    return res.json({ error: "User Not found" });
  }
  if ( bcrypt.compare(oPassword, data.password)) {
    collection.updateOne({ email: useremail },{ $set: {"password": encryptedPassword}});
    return{
      statusCode:200,
      body:JSON.stringify({ status: "ok", data: "pass changed" }),
      headers: {
        "access-control-allow-origin": "*",
      }
    }
  }
  }).catch (error=> {
    return { statusCode: 500, body: error.toString() }
})
        }

        // Function logic here ...
    } catch (error) {
        return { statusCode: 500, body: error.toString() }
    }
}

module.exports = { handler }
        // collection.insertOne({ item: "card", qty: 15 })
