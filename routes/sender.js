const { Router } = require('express');
const router = Router();
const SenderPost = require('../models/SendersPosts');

// router.get('/', (req, res) => {
//     console.log(`${req.body} inside get sender`);
//     res.send('hello sender get');
// })

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
    if(req.body.weight) params["weight"] = {$gte:req.body.weight};
    if(req.body.expiresOn) params["expiresOn"] = {$lte:req.body.expiresOn};
    if(req.body.originCity) params["originCity"] = req.body.originCity;
    if(req.body.destinationCity) params["destinationCity"] = req.body.destinationCity;
    console.log(params);
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
    // SenderPost.findByIdAndUpdate(req.body._id, {$set: {'weight':req.body.weight, 'vloume':req.body.volume}}, (err, result) => {
    //     if (err) throw err;
    //     console.log('just to check')
    //     console.log(result)
    //     res.send(JSON.stringify({editedSenderPost: 'dont know yet'}));
    // });
    const modifiedSenderPost = await SenderPost.findByIdAndUpdate(req.body._id, {$set: {
        'originCountry' : req.body.originCountry,
        'originCity' : req.body.originCity,
        'destinationCity' : req.body.destinationCity,
        'destinationCountry' : req.body.destinationCountry,
        'expiresOn' : req.body.expiresOn,
        'weight' : req.body.weight,
        'volume' : req.body.volume,
        'willingToPayPerKg' : req.body.willingToPayPerKg,
        'items' : req.body.items,
        'comments' : req.body.comments}});
        console.log(modifiedSenderPost)
    res.send(JSON.stringify({editedSenderPost:req.body}));
})

router.get('/delete/:id', async (req, res) => {
    // const result = await SenderPost.findByIdAndDelete({_id:req.params.id});
    await SenderPost.findByIdAndDelete({_id:req.params.id});
    res.send(JSON.stringify({message: `deleted`}));
})

module.exports = router;