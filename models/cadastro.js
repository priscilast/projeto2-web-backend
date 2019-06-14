//Model - tabela - Cadastro
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Cadastro = new Schema({
  nome: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  senha: {
    type: String,
    require: true
  },
  senha2: {
    type: String,
    require: true
  }
})

mongoose.model('cadastro', Cadastro)
