const express = require('express');
const router = express.Router();

const checkAuth = require ('../auth/check-auth')

const UserController =require("../controllers/user");

router.post('/login', UserController.user_login)


router.get('/', checkAuth, UserController.user_get_allUsers);

router.get('/:userID', checkAuth, UserController.user_get_singleUser);

module.exports = router;

/*
//Verschieben nach users
router.get('/:objectID', (req, res, next) => {
  const id = req.params.objectID;

  User.findById(id)
  .exec()
  .then( doc => {
    console.log(doc);
    if(doc){
      res.status(200).json(doc);
    } else {
      res.status(404).json({
        message: 'No valid entry found for provided ID'
      })
    }

  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      error: error
    })
  })
})
*/
//Nur zum Verständnis
/*
router.get('/:userId', (req, res, next) => {
  const id = req.params.userId;
  if(id === 'special'){
    res.status(200).json({
      message: 'you discovered the special id'
    })
  } else {
    res.status(200).json({
      message: 'you passed an id'
    })
  }
})

//PATCH-Method
router.patch('/:userId', (req, res, next) => {
  const id = req.params.userId;
  if(id === 'special'){
    res.status(200).json({
      message: 'you discovered the special id'
    })
  } else {
    res.status(200).json({
      message: 'you passed an id'
    })
  }
})

//DELETE-Method
router.delete('/:userId', (req, res, next) => {
  const id = req.params.userId;
  if(id === 'special'){
    res.status(200).json({
      message: 'you discovered the special id'
    })
  } else {
    res.status(200).json({
      message: 'you passed an id'
    })
  }
})
*/
