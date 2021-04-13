const mongoose = require('mongoose');
const config = require('../../config');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(config.auth.google_clientID);
const jwt = require('jsonwebtoken');

const User = require('../models/user');


const signJWTafterLogin = (id, name, email) => {
  const token = jwt.sign({
    id: id,
    name: name,
    email: email
  },
  config.auth.JWT_SECRET,
  {
    expiresIn: '1h'
  });

  return token;
}


const user_verify = async (googleID) => {
  var userID;
  async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: googleID,
      //audience: 'bliblablub',  //Kp hat vlt iwas mit JWT zu tun
      // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  return userid;
}
await verify().then(result => userID = result);
return userID;
}

var user = new User();

exports.user_login = (req, res, next) => {
  //Verify googleID of user
  user_verify(req.body.googleID).then(googleID => {
    //If verification successful see if user is already registered in DB
    User.find({'user_googleID': googleID}).exec().then(registeredUser => {
      var token;
      //If user exists send login message
      if (registeredUser[0]) {
        //TODO Userinformationen updaten wenn sich was geändert hat
        token = signJWTafterLogin(registeredUser[0]._id, registeredUser[0].user_name, registeredUser[0].user_email);
        res.status(200).json({
          message: 'User logged in.',
          user: {
            userID: registeredUser[0]._id,
            username: registeredUser[0].user_name,
            email: registeredUser[0].user_email
          },
          token: token
        });
      } else {
        //If user doesnt exist create new user
        user._id = new mongoose.Types.ObjectId();
        user.user_name = req.body.name;
        user.user_email = req.body.email;
        user.user_googleID = googleID;
        user.user_profilePicture = req.body.profilePicture;

        //Save user to DB
        user.save().then(result => {
          token = signJWTafterLogin(user._id, user.user_name, user.user_email);
          res.status(200).json({
            message: 'User logged in.',
            user: {
              userID: user._id,
              username: user.user_name,
              email: user.user_email
            },
            token: token
          });
        }).catch(error => { //Saving error
          res.status(500).json({
            error: {
              message: 'An error occured: ' + error
            }
          });
        });
      }
    }).catch(error => { //Finding user ID error
      res.status(500).json({
        error: {
          message: 'An error occured: ' + error
        }
      });
    })
  }).catch(error => { //User verification error
    res.status(500).json({
      error: {
        message: error.message
      }
    });
  });
}


exports.user_get_allUsers = (req, res, next) => {
  User.find().exec().then(users => {
    res.status(200).json(users);
  }).catch(err => { //No users found error
    res.status(500).json({
      message: "Error" + err
    })
  });
}

exports.user_get_singleUser = (req, res, next) => {
  User.find({'_id': req.params.userID}).exec().then(user => {
    res.status(200).json(user)
  }).catch(err => res.status(500).json({error: {message: 'User not found'}}));

}
