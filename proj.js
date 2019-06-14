// Carregando módulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const mongoose = require('mongoose')
    const app = express()
    const session = require('express-session')
    const flash = require('connect-flash')
    const multer = require('multer')
    const upload = multer({dest: 'uploads/'})


    require('./models/cadastro')
    require('./models/login')
    require('./models/postagem')
    const Cadastro = mongoose.model('cadastro')
    const Postagem = mongoose.model('postagem')
    const Login = mongoose.model('login')

// Configurações
    // Sessão
    app.use(session({
      secret: 'jaumeprin',
      resave: true,
      saveUninitialized: true
    }))
    // flash
    app.use(flash())
    // Middleware
    app.use(function(req, res, next){
      res.locals.success_msg = req.flash("success_msg")
      res.locals.error_msg = req.flash("error_msg")
      next()
    })
    // Body parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    // Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')
    // Mongoose
    mongoose.Promise = global.Promise
    mongoose.connect('mongodb://localhost/pinterest').then(function(){
        console.log('Mongo conectado!')
      }).catch(function (err){
       console.log("Houve um erro na conexão com o Mongo: "+error)
      })

// Rotas
    // Página inicial do website
    app.get('/', function(req, res){
    res.render('PROJETO 1 AQUI')
                //Mandar para /cadastro se clicar criar conta
                //Mandar para /login se já estiver conta
    })
    // Página de cadastro
    app.get('/cadastro', function(req, res){
    res.render('formcadastro')//FORMULARIO HTML DE CADASTRO
    })
    app.post('/cadastro/novo', function (req, res) {

    // VALIDAÇÕES DOS DADOS
      var erros = []
      // Validação do cadastro

      if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null ){
          erros.push({texto: "Nome inválido "})
      }
      if(req.body.nome.length < 4 ){
          erros.push({texto: "Tamanho de nome muito pequeno"})
      }
      if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null ){
          erros.push({texto: "Senha vazia "})
      }
      if(req.body.senha.length < 6){
        erros.push({texto: "Senha muito curta"})
      }
      if(req.body.senha != req.body.senha2){
        erros.push({texto: "As senhas são diferentes, tente novamente!"})
      }
      if(!req.body.email || typeof req.body.email == undefined || req.body.email == null ){
          erros.push({texto: "E-mail vazio "})
      }

      if(erros.length > 0){
        res.render('formcadastro', {erros: erros})
      }else {

        Cadastro.findOne({email: req.body.email}).then(function(cadastro){
          if(cadastro){
            req.flash('error_msg', "Já existe uma conta com este e-mail")
            res.redirect('/cadastro')

          }else {
            const novoCadastro = {
              nome: req.body.nome,
              email: req.body.email,
              senha: req.body.senha,
              senha2: req.body.senha2
            }
            new Cadastro(novoCadastro).save().then(function(){
                res.render('homepass')
              }).catch(function(erro){
                console.log("Houve um erro: "+error)
              })

          }
        }).catch(function(err){
          req.flash('error_msg',"Houve erro interno")
          res.redirect('/')
        })

      }
   })

    //renderizar html
    app.get('/', (req,res) =>{
      res.sendFile('index.html', {
        root: path.join(__dirname, './')
      })
    })

    // Página de login
    app.get('/login', function(req, res){
    res.render('formlogin')//FORMULARIO HTML DE LOGIN
    })

    // Receber o login
    app.post('/login/novo', function(req, res){

      var errosLogin = []
      // Validação do login

      if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null ){
          errosLogin.push({texto: "Senha inválida "})
      }
      if(req.body.senha.length < 6){
        errosLogin.push({texto: "Senha muito curta"})
      }
      if(!req.body.email || typeof req.body.email == undefined || req.body.email == null ){
          errosLogin.push({texto: "E-mail inválido "})
      }
          if(errosLogin.length > 0){
            res.render('formlogin', {errosLogin: errosLogin})
          }else {
              /*Login.findOne({email: req.body.email}).then(function(email){
                if(!email){
                  res.redirect('/cadastro')
                }
              })
              Login.findOne({senha: req.body.senha}).then(function(senha){
                if(!senha){
                  res.redirect('/login')
                } else{res.render('homepass')}
              })*/


              Login.findOne({email: req.body.email}).then(function(email){
                if(email){
                  Login.findOne({senha: req.body.senha}).then(function(senha){
                    if(senha){
                      res.render('homepass')
                    } else if(!senha){
                      res.redirect('/cadastro')
                    }
                  })
                }
              })
          }

    })

    // Publicar conteúdos
    app.post('/home', function(req, res){
    res.render('home')//FORMULARIO HTML PARA POSTS
    })


    //UPLOAD IMAGEM/VIDEO
    //app.use(express.static('public'))

    // rota indicado no atributo action do formulário
    app.post('/file/upload', upload.single('file'), 
    (req, res) => res.send('<h2>Upload realizado com sucesso</h2>'))
    
    /* TESTE
    app.get('/teste', upload.single('file'), function (req, res) {
      res.send("upload feito")

    } )*/

    // Recebendo os posts
    
    

      app.post('/home/postagens', upload.single('file'), function(req, res){
      res.send("Upload realizado")
      var errosPostagem = []
      
      // Validação da postagem

      if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null ){
          errosPostagem.push({texto: "Título inválido "})
      }
      if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null ){
          errosPostagem.push({texto: "Conteudo invalido "})
      }
          if(errosPostagem.length > 0){
            res.render('home', {errosPostagem: errosPostagem})
          }else {
                const novaPostagem = {
                titulo: req.body.titulo,
                conteudo: req.body.conteudo
                }
                new Postagem(novaPostagem).save().then(function(){
                  res.redirect('/posts')
                }).catch(function (erro){
                  res.send("Houve um erro: "+error)
                })
          }


      })

    // Mostrar os posts
    app.get('/posts', function (req, res) {
      Postagem.find().then(function (posts) {
        res.render('listpost', {posts: posts})//FORMULARIO HTML LISTAR POSTS
      })


     //busca
      /* GET home page. 
      router.get('/posts', function(req, res, next) {
      res.render('index', { results: false })

       GET search page. 
      router.get('/search', function (req, res, next) {
      var searchParams = req.query.query.toUpperCase().split(' ');
      var db = require('../db');
      var Customer = db.Mongoose.model('customers', db.CustomerSchema, 'customers');
      Customer.find({ tags: { $all: searchParams } }, function (e, docs) {
        res.render('index', { results: true, search: req.query.query, list: docs });
      });
  }); */










});
  //  })

// Outros
  const PORT = process.env.PORT || 8180
  app.listen(PORT, function(){
    console.log("Servidor rodando na porta 8180!");
  })