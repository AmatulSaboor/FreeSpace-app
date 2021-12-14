const express = require('express');
const router = express.Router();
const User = require('../models/Users');
console.log(`inside server`)
const session = require('express-session');
const bcrypt = require('bcryptjs');
const MongoDBStore = require('connect-mongodb-session')(session);
const uri = "mongodb+srv://FS-developers:Password123@cluster0.vzs9g.mongodb.net/FreeSpace?retryWrites=true&w=majority";
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

router.get('/checkOnline/:username', (req, res) => {
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
            if(data){
                isOnline = true;
                socketId = data.session.user.socketId
                console.log(`online : ${isOnline} | Id ${socketId}`)
            }
            else{
                console.log('i am inside else')
            }
            res.send(JSON.stringify({isOnline, socketId}));
        })
    })
    
})
// =============================================== checks authentication ====================================
router.get('/session', (req, res) => {
    console.log(`i am inside session`)
    console.log(req.session)
    if (req.session.isAuthenticated)
        res.send(JSON.stringify({isAuthenticated: true, error: null, username: req.session.user.username, email:req.session.user.email}));
    else
        res.send(JSON.stringify({isAuthenticated: false, error: 'Some Error Occured, Try Again!!!'}));
})

// ================================================== login post ======================================================
router.post('/login', (req, res) => {
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
router.post('/register', async (req, res) => {
    const regex = /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{10,16}$/;
    console.log(req.body);
    console.log('inside register post')
    let newUser = await User.findOne({email: req.body.email});
    if (newUser){
      return res.send(JSON.stringify({error: 'You already have this email address, sign in now!', username: newUser.username}));
    }
    newUser = await User.findOne({username: req.body.username});
    if (newUser){
      return res.send(JSON.stringify({error: 'You already have this username, sign in now!', username: newUser.username}));
    }
    try{
        console.log(regex.test(req.body.password));
        if (regex.test(req.body.password)){
            req.body.password = await bcrypt.hash(req.body.password, 10);
            req.body.confirmPassword = await bcrypt.hash(req.body.confirmPassword, 10);
            newUser = new User(req.body);
            await newUser.save();
            req.session.isAuthenticated = true;
            req.session.user = req.body;
            res.send(JSON.stringify({message: req.body.username + ' is successfully registered', username: req.body.username, email:req.body.email}));
        }
        else{
            console.log(`invalid password`)
        }
    }catch(e){
      if (e.message.indexOf('validation failed') !== -1) {
        e = Object.values(e.errors)[0].message
      }
      return res.send(JSON.stringify({error: e, username: req.body.username, email:req.body.email}));
    }
});

// ================================================== logout ======================================================
router.get('/logout', (req, res) =>
{
  req.session.destroy(err =>
    {
      if (err) throw err;
      res.clearCookie('connect.sid');
      res.send(JSON.stringify({logout: true}));
    });
});

module.exports = router;