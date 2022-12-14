const fastify = require("fastify")({logger: false})
const mongoose = require("mongoose")
const fastifyStatic = require("@fastify/static")
const path = require("path")
const url = require("url")
require("dotenv").config()

fastify.register(require("@fastify/formbody"))

fastify.register(require("@fastify/view"), {
  engine: {
    ejs: require("ejs")
  },
  root: path.join(__dirname, "views")
})

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
  prefix: "/public/"
})


mongoose.connect(process.env.MONGO_URI, 
  { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => console.log("Connection réussie à la base mongoDb"))
  .catch((error) => console.log(error))



fastify.register(require("./routes/url"))

fastify.setErrorHandler((error, req, reply) => {
  if(error){

    reply.view("index.ejs", {err: error.message.split(":")[2]})
  }
})


fastify.listen({port: 5000}, (err) => {
  if(err){
    fastify.log.error(err)
    process.exit(1)
  }
})