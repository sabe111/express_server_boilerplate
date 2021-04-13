const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user_name: {type: String, required: true},
  user_type: {type: String, enum: ['User', 'Admin'], default: 'User'},
  user_email: {type: String, required: true},
  user_googleID: {type: String, required: true},
  user_profilePicture: String,
  user_items: {type: Array, default: []}
});


module.exports = mongoose.model('User', userSchema);
