const express = require("express");
const app= express();
const bodyParser = require("body-parser");
const connection =require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");
//database
connection
.authenticate()
.then(()=>{
  console.log("conexao realizaoda")
})
.catch((msgErro)=>{
  console.log(msgErro);
})

//estou dizendo para o express usar o ejs
app.set('view engine','ejs');
app.use(express.static('public'));
//config bodyparse
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//rotas

app.get("/",(req,res)=>{
  Pergunta.findAll({raw: true,order:[
    ['titulo','ASC']//ASC =crescente || DESC decrescente
  ]}).then(perguntas=>{
    res.render("index",{
      perguntas : perguntas
    });
  });
});

app.get("/perguntar",(req,res)=>{
  res.render("perguntar");
});

app.post("/salvarperguntar",(req,res)=>{
  var titulo= req.body.titulo;
  var desc= req.body.descricao;
  Pergunta.create({
    titulo:titulo,
    descricao: desc
  }).then(()=>{
    res.redirect("/");
  });
});

app.get("/pergunta/:id",(req ,res) => {
  var id = req.params.id;//procurar po um valor no banco
  Pergunta.findOne({
    where:{id: id}
  }).then(pergunta => {
    if(pergunta != undefined){    //pergunta achada

      Resposta.findAll({//listas respostas
        where:  {perguntaId: pergunta.id},
        order: [ ['id','DESC'] ]

      }).then(respostas=> {
        res.render("pergunta",{
          pergunta: pergunta,
          respostas: respostas

        });
      });
    }else{    //não encontrado
      res.redirect("/");
    }
  });
});

app.post("/responder",(req, res)=> {
  var corpo= req.body.corpo;
  var perguntaId =req.body.pergunta;
  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId
  }).then(()=>{
    res.redirect("/pergunta/"+perguntaId);
  });
});

app.listen(8080,()=>{  console.log("APP rodando");});
