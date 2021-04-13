const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/inventory_app').catch((err) => {
  console.log(err);
})

module.exports = mongoose;
