if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const expressLayouts = require('express-ejs-layouts')

let port = (process.env.PORT != undefined) ? process.env.PORT : 3000; 
const indexRouter = require('./routes/index')
const authorsRouter = require('./routes/authors')

app.set("view engine", "ejs")
app.set('layout', 'layouts/layout')

app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({extended: false, limit: '10mb'}))

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', ()=> console.log("Connected to Mongoose"))


app.use('/', indexRouter)
app.use('/authors', authorsRouter)

app.listen(port, function(){
    console.log("Running on port " +port)
});