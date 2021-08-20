const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT || 3400;
const ObjectId = require('mongodb').ObjectId;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v9gjy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection err finded', err);
  const pdCollection = client.db("myshop").collection("products");
  const orderCollection = client.db("myshop").collection("orders");


  app.get('/products', (req, res) => {
    pdCollection.find({})
      .toArray((err, items) => {
        res.send(items);
      })
  })

  app.get('/products/:id', (req, res) => {

    const id = req.params.id;

    pdCollection.find({ _id: ObjectId(id) })
      .toArray((err, item) => {
        res.send(item[0])
      })
  })

  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    console.log('added a product: ', newProduct);
    pdCollection.insertOne(newProduct)
      .then(result => {
        console.log('one inserted', result.insertedCount)
        res.send(res.insertedCount > 0)
      })
  })

  ///PostToCheckOut
  app.post('/addOrder', (req, res) => {
    const newOrder = req.body;
    console.log('added a product: ', newOrder);
    orderCollection.insertOne(newOrder)
      .then(result => {
        console.log('one inserted', result.insertedCount)
        res.send(res.insertedCount > 0)
      })
  })

  app.get('/orderlist', (req, res) => {
    orderCollection.find({})
      .toArray((err, items) => {
        res.send(items);
      })
  })

  app.get('/orderlist/:email', (req, res) => {
    const email = req.params.email;
    orderCollection.find({email: email})
      .toArray((err, items) => {
        res.send(items);
      })
  })

  
  //   client.close();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})