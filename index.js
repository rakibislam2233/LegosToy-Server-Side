const express = require('express');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
const cors = require('cors');
//middelware 
app.use(express.json());
app.use(cors());
//mongodb code 

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.inzz8jh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
   
    const AllToyCollection = client.db('legosToyDB').collection('Toy');
    //get allToy in server 
    app.get('/allToy',async(req,res)=>{
        const result = await AllToyCollection.find().toArray();
        res.send(result);
    })
    //get single toy 
    app.get('/singleToy/:id',async(req,res)=>{
        const id = req.params.id;
        const query ={_id:new ObjectId(id)};
        const result = await AllToyCollection.findOne(query);
        res.send(result)

    })
    //added toy in server
    app.post('/allToy',async(req,res)=>{
        const toy = req.body;
        const result = await AllToyCollection.insertOne(toy);
        res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);











app.get('/',(req,res)=>{
   res.send('welcome to my server')
})

app.listen(port,()=>{
    console.log(`server listening on port ${port}`);
});