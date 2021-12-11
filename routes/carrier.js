const express = require('express');
const router = express.Router();
const CarrierPost = require('../models/CarriersPosts');

router.get('/', (req, res) => {
    console.log('inside get carrier');
    res.send('hello carrier get');
})

router.get('/getListing', async (req, res) => {
    res.send(JSON.stringify({carrierPostList : await CarrierPost.find({createdBy: req.session.user.username})}));
})

router.get('/getAllListing', async (req, res) => {
    res.send(JSON.stringify({carrierPostList : await CarrierPost.find({})}));
})

router.post('/search', async (req, res) => {
    console.log(`inside carrier search`)
    console.log(req.body)
    const params = {};
    if(req.body.weight) params["weight"] = {$gte:req.body.weight};
    if(req.body.departureDate) params["departureDate"] = {$gte:req.body.departureDate};
    if(req.body.arrivalDate) params["arrivalDate"] = {$lte:req.body.arrivalDate};
    if(req.body.departureCity) params["departureCity"] = req.body.departureCity;
    if(req.body.arrivalCity) params["arrivalCity"] = req.body.arrivalCity;
    console.log(params);
    res.send(JSON.stringify({filteredPosts : await CarrierPost.find(params)}));
})

router.post('/create', async (req, res) => {
    console.log(req.body)
    req.body.createdBy = req.session.user.username;
    console.log(req.body);
    newCarrierPost = new CarrierPost(req.body);
    const carrierPost = await newCarrierPost.save();
    res.send(JSON.stringify({carrierPost}));
})

router.post('/update', async (req, res) => {
    console.log(`inside update`)
    console.log(req.body);
    const editedCarrierPost = await CarrierPost.findByIdAndUpdate({_id: req.body._id}, {$set: {
        'departureCountry' : req.body.departureCountry,
        'departureCity' : req.body.departureCity,
        'arrivalCity' : req.body.arrivalCity,
        'arrivalCountry' : req.body.arrivalCountry,
        'departureDate' : req.body.departureDate,
        'arrivalDate' : req.body.arrivalDate,
        'weight' : req.body.weight,
        'volume' : req.body.volume,
        'ratesPerKg' : req.body.ratesPerKg,
        'comments' : req.body.comments
    }});
    console.log(editedCarrierPost)
    res.send(JSON.stringify({editedCarrierPost}));
})

router.get('/delete/:id', async (req, res) => {
    const result = await CarrierPost.findByIdAndDelete({_id:req.params.id});
    res.send(JSON.stringify({message: `deleted`}));
})

module.exports = router;