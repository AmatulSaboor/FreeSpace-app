const express = require('express');
const router = express.Router();
const CarrierPost = require('../models/CarriersPosts');

router.get('/', (req, res) => {
    console.log('inside get carrier');
    res.send('hello carrier get');
})

router.get('/getListing', async (req, res) => {
    console.log('inside carrier get listing');
    res.send(JSON.stringify({carrierPostList : await CarrierPost.find({createdBy: req.session.user.username})}));
})

router.get('/getAllListing', async (req, res) => {
    console.log('inside carrier get all listing');
    res.send(JSON.stringify({carrierPostList : await CarrierPost.find({})}));
})

router.post('/create', async (req, res) => {
    req.body.createdBy = req.session.user.username;
    newCarrierPost = new CarrierPost(req.body);
    const carrierPost = await newCarrierPost.save();
    res.send(JSON.stringify({carrierPost}));
})

router.post('/update', async (req, res) => {
    console.log(`inside update`)
    console.log(req.body);
    const editedCarrierPost = await CarrierPost.findByIdAndUpdate({_id: req.body._id}, {$set: {originCountry: req.body.originCountry, originCity: req.body.originCity}});
    console.log(editedCarrierPost)
    res.send(JSON.stringify({editedCarrierPost}));
})

router.get('/delete/:id', async (req, res) => {
    const result = await CarrierPost.findByIdAndDelete({_id:req.params.id});
    res.send(JSON.stringify({message: `deleted`}));
})

module.exports = router;