const { schema, model } = require('mongoose')

const instructorSchema = new schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    unique: true,
  }
}, {
  timestamps: true
})

// validation
instructorSchema.path('email').validate(function(value) {
  return Instructor.findOne({ email: value })
    .then(instructor => {
      if(instructor) return true
    })
}, 'Email instructor is already registered!')

const Instructor = model('Instructor', instructorSchema)

module.exports = Instructor
