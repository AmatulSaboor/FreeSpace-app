console.log(`inside server`)
const path = require('path');
const express = require('express');
const app = express();
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors');
const port = process.env.PORT || 3000;
const http = require('http').Server(app);
const {Server} = require('socket.io');
const io = new Server(http);
const carrierRouter = require('./routes/carrier');
const senderRouter = require('./routes/sender');
const authRouter = require('./routes/auth');
const notificationRouter = require('./routes/notification');
const uri = "mongodb+srv://FS-developers:Password123@cluster0.vzs9g.mongodb.net/FreeSpace?retryWrites=true&w=majority";
const mongoose = require('mongoose');
const {MongoClient, ObjectId} = require('mongodb');
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
// connection to DB
mongoose.connect(uri).then((result)=>{
    console.log('connected to Mongo DB Atlas');
  }).catch((error)=>{
    console.error('error connecting to Mongo DB Atlas', error);
});

// creating session
const store = new MongoDBStore({
    uri: uri,
    collection: 'mySessions',
    autoRemove: 'interval',
    autoRemoveInterval: 1
});
app.use(session({
    secret: 'a very secret key',
    resave: false,
    saveUninitialized: false,
    store: store,
    }
));

// app.use(cors({origin : 'http://localhost:3000', credentials:true}));
app.use(cors({origin: 'https://freespace-travelers.herokuapp.com/', credentials:true}));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/carrier', carrierRouter);
app.use('/sender', senderRouter);
app.use('/auth', authRouter);
app.use('/notification', notificationRouter);

app.use(express.static(path.join(__dirname, "/FreeSpace-client/build")));
app.get('*', (req, res) => {
    console.log(`inside * path`)
  res.sendFile(path.join(__dirname, '/FreeSpace-client/build', 'index.html'));
});
app.get('/', (req, res) => {
    console.log('I am here');
    res.send(JSON.stringify('hello world'));
})


http.listen(port, () => {`Example app listening on port ${port}`});
