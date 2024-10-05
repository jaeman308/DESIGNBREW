const mongoose = require('mongoose');

const boardSchema = mongoose.Schema ({
    room:  {
        type: String, 
        required: true,
    },
    category: {
        type: String,
        enum: [ 'Modern', 'Contemporary', 'Traditional', 'Rustic', 'Industrial', 'Scandinavian', 
        'Bohemian', 'Mid-Century Modern', 'Transitional', 'Art Deco', 'Farmhouse', 'Mediterranean',
        'Eclectic', 'Vintage', 'Orangic Modern', 'Minimalist'],
        require: true,
    },

    image: {
        type: String,
        required: true, 
    },
    description: {
        type: String, 
        required: true,

    },
});

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  
  name: {
    type: String,
    required: true,
  }, 

  password: {
    type: String,
    required: true,
  },
  email: {
    type: String, 
    required: true, 
  },
  profilePicture: {
    type: String,
    required: true, 
  },
  
  boards: [boardSchema],

});

const User = mongoose.model('User', userSchema);

module.exports = User;
