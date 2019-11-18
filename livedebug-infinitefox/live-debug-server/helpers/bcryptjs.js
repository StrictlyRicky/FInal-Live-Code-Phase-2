const bcryptjs = require('bcryptjs')

module.exports = {
  hashPassword: function(input) {
    return bcryptjs.hashSync(input, bcryptjs.genSalt(10))
  },
  compareHash: function(password, hash) {
    return bcryptjs.compareSync(password, hash)
  }
}
