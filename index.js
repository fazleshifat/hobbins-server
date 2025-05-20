const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER, process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.knw8z6m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        // create database and inserting data
        const usersCollection = client.db("hobbins").collection("users");
        const groupsCollection = client.db("hobbins").collection("groups");

        // sending data with post method
        app.post('/users', async (req, res) => {
            const userProfile = req.body;
            console.log(userProfile)
            const result = await usersCollection.insertOne(userProfile);
            res.send(result);
        })


        app.post('/groups', async (req, res) => {
            const allGroups = req.body;
            console.log(allGroups);
            const result = await groupsCollection.insertOne(allGroups);
            res.send(result);
        })


        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        })

        app.get('/groups', async (req, res) => {
            const result = await groupsCollection.find().toArray();
            res.send(result);
        })

        app.get('/group/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await groupsCollection.findOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hobbins is coming soon')
})

app.listen(port, () => {
    console.log(`Hobbins server is running on port${port}`)
})