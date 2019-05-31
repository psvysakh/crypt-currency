const {createServer} = require('http');
const express= require('express');

const path = require('path');

const bodyParser = require('body-parser');
const Pusher = require('pusher');

const normalizePort=port=>parseInt(port,10);
const PORT = normalizePort(process.env.PORT || 5000);

const app = express();



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
//initialize Pusher with your appId, key, secret and cluster
const pusher = new Pusher({
    appId: '789987',
    key: 'f31d140bd4740042a0f7',
    secret: '6b9a526bb7adc92d669f',
    cluster: 'ap2',
    encrypted: true
})

app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*')
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true)
    // Pass to next layer of middleware
    next()
})

// API route in which the price information will be sent to from the clientside
app.post('/prices/new', (req, res) => {
    // Trigger the 'prices' event to the 'coin-prices' channel
    pusher.trigger( 'coin-prices', 'prices', {
        prices: req.body.prices
    });
    res.sendStatus(200);
})
if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
  }
   

const server = createServer(app);

server.listen(PORT, err=>{
    if(err) throw err;
    console.log(`Listening on port `);
})