const express = require('express');
const router = express.Router();
const Notification = require('../models/Notifications');
const User = require('../models/Users');
const SenderPost = require('../models/SendersPosts');
const CarrierPost = require('../models/CarriersPosts');

// router.get('/', (req, res) => {
//     console.log('inside get notification');
//     res.send('hello notification get');
// })

router.get('/getListing', async (req, res) => {
    const NotificationList = await Notification.find({recieverName: req.session.user.username});
    // for(let i=0; i<NotificationList.length; i++){
    //     const senderPost = await SenderPost.findOne({_id: NotificationList[i]._id})
    //     console.log(senderPost)
    //     NotificationList[i].post = senderPost;
    //     const carrierPost = await SenderPost.findOne({_id: NotificationList[i]._id})
    //     console.log(carrierPost)
    //     NotificationList[i].post = carrierPost;
    // }
    console.log(NotificationList)
    res.send(JSON.stringify({NotificationList}));
})

router.post('/create', async (req, res) => {
    console.log(req.body)
    req.body.senderName = req.session.user.username;
    req.body.senderEmail = req.session.user.email;
    req.body.isRead = false;
    const user =  await User.findOne({username: req.session.user.username});
    req.body.senderPhone = user.email
    console.log(req.body);
    newNotification = new Notification(req.body);
    const notification = await newNotification.save();
    res.send(JSON.stringify({notification}));
})

router.post('/markRead', async (req, res) => {
    console.log(`inside update`)
    console.log(req.body);
    try{
        const editedNotification = await Notification.findByIdAndUpdate({_id: req.body._id}, {$set: {
            'isRead' : true,
        }});
        console.log(editedNotification)
        res.send(JSON.stringify({editedNotification:req.body}));}
    catch(e){
        if (e.message.indexOf('validation failed') !== -1) {
            e = Object.values(e.errors)[0].message
        }
    }
})

router.get('/delete/:id', async (req, res) => {
    const result = await Notification.findByIdAndDelete({_id:req.params.id});
    res.send(JSON.stringify({message: `deleted`}));
})

module.exports = router;