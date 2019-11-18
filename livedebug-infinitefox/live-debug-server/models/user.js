const { schema, model } = require('mongoose')
const { hashPassword } = require('../helpers/bcryptjs')

const userSchema = new schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  timestamps: true
})

// validation
userSchema.path('email').validate(function(value) {
  return User.findOne({ email: value })
    .then(user => {
      if(user) return true
    })
}, 'Email user is already registered!')

// hashPassword
userSchema.pre('save', function(next) {
  // kalo udah ke save
  this.password = hashPassword(this.password)
  next()
})

const User = model('User', userSchema)

module.exports = User
