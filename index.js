const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

//Mongodb

const uri = "mongodb+srv://random:random@cluster0.ihj8n.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){

    try{
    await client.connect();
    const database = client.db("blogs");
    const blogsCollection = database.collection("blog");
    
    // GET DATA
    app.get('/blogs',async(req,res)=>{
        const cursor = blogsCollection.find({});
        const result = await cursor.toArray();
        res.send(result);
    })

    // GET Single DATA
    app.get('/blog/:id',async(req,res)=>{
        const id = req.params.id;
        const query = { _id:ObjectId(id) };
        const blog = await blogsCollection.findOne(query);
        res.send(blog);
    })


    // Update
    app.put('/blog/:id', async(req,res)=>{
        const id = req.params.id;
        const blog = req.body;
        const filter = { _id:ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
            $set: blog
          };
          const result = await blogsCollection.updateOne(filter, updateDoc, options);
          res.send(result);
    })

    //Add Product
    app.post('/blogs', async(req,res)=>{
        const blog = req.body;
        const doc ={
            title:blog.title,
            body:blog.body
        }
        const result = await blogsCollection.insertOne(doc);
        res.send(result);
    })

  

    }
    finally{
    // await client.close();
    }
}

run().catch(console.dir)

app.get('/',(req,res)=>{
    res.send('This is the server')
})

app.listen(port,()=>{
    console.log('listening to port',port)
})