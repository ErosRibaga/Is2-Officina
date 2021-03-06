const express = require('express');
const router = express.Router();
const User = require('./models/user'); // get our mongoose model
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

// ---------------------------------------------------------
// route to authenticate and get a new token
// ---------------------------------------------------------
router.post('/login', async function (req, res) {
  // find the user
  let user = await User.findOne({
    email: req.body.email,
  }).exec();

  // user not found
  if (!user || user == null) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Email not found.',
    });
  }

  // check if password matches
  if (user.password != req.body.password) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Wrong password.',
    });
  }

  // if user is found and password is right create a token
  var payload = {
    email: user.email,
    id: user._id,
    admin: user.admin,
  };

  var options = {
    expiresIn: 86400, // expires in 24 hours
  };

  //process.env.SUPER_SECRET (process.env.SUPER_SECRET) --> token che serve per la criptazione e decriptazione
  var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

  res.status(200).json({
    success: true,
    message: 'Enjoy your token!',
    token: token,
    email: user.email,
    id: user._id,
    admin: user.admin,
    self: 'api/v2/users/' + user._id,
  });
});

router.post('/logout', async (req, res) => {

  var token = jwt.sign({ id: 'logout' }, process.env.SUPER_SECRET, {
    expiresIn: 0, 
  });

  res.status(200).json({
    token: token
  });

});

module.exports = router;
