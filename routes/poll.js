const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Vote = require('../models/Vote');


const Pusher = require('pusher');

var pusher = new Pusher({
    appId: '928092',
    key: 'dbfb16c99181aee9816e',
    secret: 'ba03324f95f65462ba0c',
    cluster: 'eu',
    encrypted: true
  });

router.get('/', (req, res) => {
    Vote.find().then(votes => res.json({success: true, votes: votes}))
});

router.post('/', (req, res) => {
    const newVote = {
        os: req.body.os,            ////////////CHANGE
        points: 1
    };

    new Vote(newVote).save().then(vote =>{
        pusher.trigger('os-poll', 'os-vote', {  ////////////CHANGE
            points: parseInt(vote.points),      ///////////CHANGE
            os: vote.os                     ////////////CHANGE
          });
    
        return res.json({success: true, message: 'Thank you for voting.'});  ////////////CHANGE
    });
});

module.exports = router;