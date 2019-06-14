//Model - tabela - login
const mongoose = require('mongoose')
const Schema = mongoose.Schema

  const Login = new Schema({
    email: {
      type: String,
      require: true
    },
    senha: {
      type: String,
      require: true
    }
  })

  mongoose.model('login', Login)