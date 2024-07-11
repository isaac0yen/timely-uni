const bcrypt = require("bcrypt")

const Crypt = {
  cipherPass: (password) => {
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, salt)
  },

  comparePass: (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword)
  }
}

module.exports = Crypt;