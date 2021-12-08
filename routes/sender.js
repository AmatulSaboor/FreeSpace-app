const { Router } = require('express');
const router = Router();
const SenderPost = require('../models/SendersPosts');

router.get('/', (req, res) => {
    console.log(`${req.body} inside get sender`);
    res.send('hello sender get');
})

router.get('/getListing', async (req, res) => {
    res.send(JSON.stringify({senderPostList : await SenderPost.find({createdBy: req.session.user.username})}));
})

router.get('/getAllListing', async (req, res) => {
    res.send(JSON.stringify({senderPostList : await SenderPost.find({})}));
})

router.post('/search', async (req, res) => {
    console.log(`inside sender search`)
    console.log(req.body)
    const params = {};
    params["weight"] = {$gte:req.body.weight};
    // ,$cond: [ req.body.expiresOn !== null, {expiresOn: req.body.expiresOn}, ]
    // res.send(JSON.stringify({filteredPosts : await SenderPost.find({weight: {$gte:req.body.weight}})}));
    res.send(JSON.stringify({filteredPosts : await SenderPost.find(params)}));
})

router.post('/create', async (req, res) => {
    req.body.createdBy = req.session.user.username;
    newSenderPost = new SenderPost(req.body);
    const senderPost = await newSenderPost.save();
    res.send(JSON.stringify({senderPost}));
})

router.post('/update', async (req, res) => {
    console.log(`inside update`)
    console.log(req.body);
    const editedSenderPost = await SenderPost.findByIdAndUpdate({_id: req.body._id}, {$set: {originCountry: req.body.originCountry, originCity: req.body.originCity}});
    res.send(JSON.stringify({editedSenderPost}));
})

router.get('/delete/:id', async (req, res) => {
    // const result = await SenderPost.findByIdAndDelete({_id:req.params.id});
    await SenderPost.findByIdAndDelete({_id:req.params.id});
    res.send(JSON.stringify({message: `deleted`}));
})

module.exports = router;