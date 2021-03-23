const express = require('express');
const router = express.Router();
const User = require("../model/user");
var jwt = require('jsonwebtoken');
const config = require('../config/');

router.post('/login', function(req, res) {
  const { email, password } = req.body;

  if(!email) {
    // Invalid error
    return res.status(422).send({errors: [{title: 'User error', detail:'Plese fill email!'}]});
  }
  if(!password) {
    // Invalid error
    return res.status(422).send({errors: [{title: 'User error', detail:'Plese fill password!'}]});
  }

  User.findOne({email}, function(err, foundUser) {
    if(err) {
      return res.status(422).send({errors: [{title: 'User error', detail:'Something went wrong!'}]});
    }
    if(!foundUser) {
      // Invalid error
      return res.status(422).send({errors: [{title: 'User error', detail:'User is not exist!'}]});
    }

    if(!foundUser.hasSamePassword(password)) {
      // Invalid error
      return res.status(422).send({errors: [{title: 'User error', detail:'Incorrect password!'}]});
    }

    const token = jwt.sign({
      userId: foundUser.id,
      username: foundUser.username
    }, config.SECRET, { expiresIn: '1h' });
    return res.json(token);
  });
});

router.post('/register', function(req, res) {

  const { username, email, password, confirmPassword } = req.body;

  // 左と右の名前が同じ場合は、上のように書くことができる。
  // const username = req.body.username;
  // const email = req.body.email;
  // const password = req.body.password;
  // const confirmPassword = req.body.confirmPassword;

  if(!username) {
    // Invalid error
    return res.status(422).send({errors: [{title: 'User error', detail:'Plese fill username!'}]});
  }
  if(!email) {
    // Invalid error
    return res.status(422).send({errors: [{title: 'User error', detail:'Plese fill email!'}]});
  }
  if(!password) {
    // Invalid error
    return res.status(422).send({errors: [{title: 'User error', detail:'Plese fill password!'}]});
  }
  if(password !== confirmPassword) {
    // Invalid error
    return res.status(422).send({errors: [{title: 'User error', detail:'Plese check passwords!'}]});
  }

  User.findOne({email}, function(err, foundUser) {
    if(err) {
        return res.status(422).send({errors: [{title: 'User error', detail:'Something went wrong!'}]});
      }
    if(foundUser) {
      // Invalid error
      return res.status(422).send({errors: [{title: 'User error', detail:'User already exist!'}]});
    }

    const user = new User({username, email, password});
    user.save(function(err) {
      if(err) {
        return res.status(422).send({errors: [{title: 'User error', detail:'Something went wrong!'}]});
      }
      return res.json({"registerd": true});
    })
  });

  // User.findById(productId, function(err, foundProduct) {

  //   if(err) {
  //     return res.status(422).send({errors: [{title: 'Product error', detail:'Product not found!'}]});
  //   }
    // return res.json({ username, email, password });
  // }) ;
});

module.exports = router;
