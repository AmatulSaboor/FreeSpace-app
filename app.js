console.log(`inside server`)
const express = require('express');
const app = express();
const session = require('express-session');
const bcrypt = require('bcryptjs');
const MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors');
const port = process.env.PORT || 9000;
const http = require('http').Server(app);
const { Server } = require('socket.io');
const io = new Server(http);
const carrierRouter = require('./routes/carrier');
const senderRouter = require('./routes/sender');
const uri = "mongodb+srv://FS-developers:Password123@cluster0.vzs9g.mongodb.net/FreeSpace?retryWrites=true&w=majority";
const User = require('./models/Users');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
const cookieParser = require('cookie-parser');
const cookieSession = require("cookie-session");
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
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure = false,
        httpOnly: true,
        sameSite: 'none',
        }
    }
));
app.use(cookieParser());
// app.use(
//     cookieSession({
//       name: "__session",
//       keys: ["key1"],
//       maxAge: 24 * 60 * 60 * 100,
//       secure: true,
//       httpOnly: true,
//       sameSite: 'none'
//     })
// );
// app.use((req, res, next)=>{
//     console.log(`inside cookie middleware`)
//     console.log(req.session.cookies)
//     if(req.cookies['connect.sid']){
//         console.log(req.cookies['connect.sid'])
//         res.cookie('connect.sid', ['connect.sid'], { sameSite: 'none', secure: true });
//     }
//     next();
// })
// app.use(cors({origin : 'http://localhost:3000', credentials:true}));
app.use(cors({origin: 'https://freespace-app.herokuapp.com', credentials:true}));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/carrier', carrierRouter);
app.use('/sender', senderRouter);


app.get('/', (req, res) => {
    console.log('I am here');
    // console.log(req.session);
    res.send(JSON.stringify('hello world'));
})

app.get('/checkOnline/:username', (req, res) => {
    console.log('I am here');
    // console.log(req.session);
    let isOnline = null;
    let socketId = null;
    client.connect((err) => {
        if (err)
          throw err;
        const mySessions = client.db('FreeSpace').collection('mySessions');
        mySessions.findOne({'session.user.username':req.params.username}, (err, data) => {
            if (err) throw err;
            // console.log(data)
            if(data){
                console.log('i am inside if')
                isOnline = true;
                socketId = data.session.user.socketId
                console.log(`online : ${isOnline} | Id ${socketId}`)
            }
            else{
                console.log('i am inside else')
                isOnline = false;
            }
            res.send(JSON.stringify({isOnline, socketId}));
        })
    })
    
})
// =============================================== checks authentication ====================================
app.get('/session', (req, res) => {
    console.log(`i am inside session`)
    console.log(req.session)
    if (req.session.isAuthenticated)
        res.send(JSON.stringify({isAuthenticated: true, error: null, username: req.session.user.username, email:req.session.user.email}));
    else
        res.send(JSON.stringify({isAuthenticated: false, error: 'Some Error Occured, Try Again!!!'}));
})

// ================================================== login post ======================================================
app.post('/login', (req, res) => {
    console.log('I am inside login....')
    console.log(req.session);
    try{
        User.findOne({username:req.body.username}, async (err, result) => {
            if (err) throw err;
            console.log(result);
            if (result){
                const isValidPassword = await bcrypt.compare(req.body.password, result.password);
                if(isValidPassword){
                    req.session.isAuthenticated = true;
                    req.body.password = await bcrypt.hash(req.body.password, 10);
                    req.body.email = result.email;
                    req.session.user = req.body;
                    res.send(JSON.stringify({message: 'Welcome ' + req.body.username, username: req.body.username, email:result.email}));
                }
                else{
                    res.send(JSON.stringify({error: 'Incorrect Password'}));
                }
            }
            else{
                res.send(JSON.stringify({error: "Username doesn't exist"}));
            }
        });
    }catch(e){
        console.error(e.message)
    }
});
  
// ================================================= register ===================================================
app.post('/register', async (req, res) => {
    console.log(req.body);
    console.log('inside register post')
    let newUser = await User.findOne({email: req.body.email});
    if (newUser){
      return res.send(JSON.stringify({error: 'You already have an account (email), sign in now!', username: newUser.username}));
    }
    newUser = await User.findOne({username: req.body.username});
    if (newUser){
      return res.send(JSON.stringify({error: 'You already have an account (username), sign in now!', username: newUser.username}));
    }
    try{
      req.body.password = await bcrypt.hash(req.body.password, 10);
      req.body.confirmPassword = await bcrypt.hash(req.body.confirmPassword, 10);
      newUser = new User(req.body);
      await newUser.save();
      req.session.isAuthenticated = true;
      req.session.user = req.body;
      res.send(JSON.stringify({message: req.body.username + ' is successfully registered', username: req.body.username, email:req.body.email}));
    }catch(e){
      if (e.message.indexOf('validation failed') !== -1) {
        // e = Object.values(e.errors).reduce((a, i)=> a+'<br>'+i);
        e = Object.values(e.errors)[0].message
      }
      return res.send(JSON.stringify({error: e, username: req.body.username, email:req.body.email}));
    }
});

// ================================================== logout ======================================================
app.get('/logout', (req, res) =>
{
  req.session.destroy(err =>
    {
      if (err) throw err;
      res.clearCookie('connect.sid');
      res.send(JSON.stringify({logout: true}));
    });
});

// ============================================ WEBSOCKETS ====================================

// io.on('connection', socket =>
// {
//     const socketId = socket.id;
//     if(socket.handshake.headers.cookie){
//         const sessionId = socket.handshake.headers.cookie.slice(16, 48)
//         client.connect((err) => {
//             if (err)
//             throw err;
//             const mySessions = client.db('FreeSpace').collection('mySessions');
//             mySessions.findOneAndUpdate({_id:sessionId},  {$set: {'session.user.socketId':socketId}}, (err, data) => {
//                 if (err) throw err;
//                 // console.log(data)
//             })
//         })
//     }
//     else{
//         socket.disconnect();
//         console.log(socket);
//         return;
//     }
//     socket.send(`hi world`);
//     console.log(`${socket.id} is online`);
//     socket.on('msg', msg =>
//     {
//         console.log(msg);
//         console.log(`inside message listener`)
//         io.emit('msg', {message:`hello my client ${socketId}`})
//     });
//     socket.on('sendMessage', msg =>
//     {
//         console.log(`sender ID : ${socket.id}`);
//         console.log(`reciever ID : ${msg.postOwnerSocketId}`);
//         console.log(`inside message listener`)
//         io.to(msg.postOwnerSocketId).emit("recieveMessage", {msgSenderSocketId:socket.id , message:msg.message});
//         console.log(`after sent messsage`)
//     });
// });

http.listen(port, () => {`Example app listening on port ${port}`});
