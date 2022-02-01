if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-layouts')
const mongoose = require('mongoose')
const indexRouter = require('./routes/index')

const port = (process.env.PORT == undefined) ? 3000 : process.env.PORT 

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection

db.on('error', error => console.error(error))
db.once('open', _ => console.log('Connected to mongoose'))

app.set("view engine", "ejs")
app.set(express.static("public"))
app.set('layout', "layouts/layout")

app.use(expressLayouts)
app.use('/', indexRouter)

app.listen(port)