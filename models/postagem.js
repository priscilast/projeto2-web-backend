//Model - tabela - Postagem
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Postagem = new Schema({
  titulo: {
    type: String,
    require: true
  },
  conteudo: {
    type: String,
    require: true
  }
})
mongoose.model('postagem', Postagem)