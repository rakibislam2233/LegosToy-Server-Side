const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const cors = require("cors");
//middelware
app.use(express.json());
app.use(cors());
//mongodb code

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.inzz8jh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const AllToyCollection = client.db("legosToyDB").collection("Toy");
    app.get("/allToy", async (req, res) => {
      const result = await AllToyCollection.find().sort({date:1}).toArray();
      res.send(result);
    });
    // get data limit
    app.get("/allToy/:limit", async (req, res) => {
      const limit = parseInt(req.params.limit);
      console.log(typeof limit);
      const result = await AllToyCollection.find().sort({date:1}).limit(limit).toArray();
      res.send(result);

    })
    //get data categories in server
    app.get("/getCategories/:category", async (req, res) =>{
      const subCategory = req.params.category.toLowerCase();
      if(subCategory =="lego-city" || subCategory=="lego-car" || subCategory == "lego-architecture"){
        const result = await AllToyCollection.find({category:subCategory}).toArray()
        res.send(result)
      }
    })
    //get index for data 
    app.get('/searchByToyName/:name',async(req,res)=>{
        const name = req.params.name;
        const AllToy = await AllToyCollection.find().toArray();
        const result = AllToy.filter((data) => data.toyName.toLowerCase().includes(name.toLowerCase()));
        res.send(result)
    })
    //get single toy
    app.get("/singleToy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await AllToyCollection.findOne(query);
      res.send(result);
    });
    app.get("/myToyEmail/", async (req, res) => {
      const email = req.query.email;
      const sort = req.query.sort;
      const query = {sellerEmail: email};
      const sorting = {price:sort}
      const result = await AllToyCollection.find(query).sort(sorting).toArray();
      res.send(result);

    })
    app.post("/addedToy", async (req, res) => {
      const toy = req.body;
      toy.date = new Date()
      const result = await AllToyCollection.insertOne(toy);
      res.send(result);
    });
    // updated toy in server
    app.put("/updateToy/:id", async (req, res)=>{
      const id = req.params.id;
      const updateInfo = req.body;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updateDoc = {
        $set:{
          description:updateInfo.description,
          quantity:updateInfo.quantity,
          price:updateInfo.price,
        }
      }

      const result = await AllToyCollection.updateOne(filter,updateDoc,options);
      res.send(result)
    })
    // removed toy in server
    app.delete("/deleteSingelToy/:id", async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await AllToyCollection.deleteOne(query)
        res.send(result);
    })

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.log);

app.get("/", (req, res) => {
  res.send("welcome to my server");
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
