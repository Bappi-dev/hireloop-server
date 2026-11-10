import express from "express";
import { MongoClient, ObjectId } from 'mongodb';
import cors from "cors";
import 'dotenv/config'

const app = express()
const PORT = 5000;


const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
const connectedClient = await connectToMongoDB()
const db = connectedClient.db("hireloop-db")
const users = db.collection('user')
const jobs = db.collection("jobs")

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send({msg:"hire loop is looping....!!"})
})

app.get("/users", async(req, res) => {
     const cursor = users.find({})
     const result = await cursor.toArray();
     res.send(result)
})

app.get('/jobs', async (req, res) =>{
     const cursor = jobs.find()
     const result = await cursor.toArray()
     res.send(result);
})

app.post("/jobs", async(req, res) =>{
     const job = req.body;
     const result = await jobs.insertOne(job)
     res.send (result)
})

app.patch('jobs/:id', async (req, res) =>{
      const id = req.params.id
      const result = await jobs.updateOne({_id: new ObjectId(id)})
      res.send(result)
})

app.delete('/jobs/:id', async (req, res) =>{
        const {id} = req.params
        const result = await jobs.deleteOne({_id: new ObjectId(id)})
        res.send(result)
})

app.listen(PORT, ()=>{
     console.log(`Hire loop is running on port: ${PORT}`);
})