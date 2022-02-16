const mongoose = require('mongoose')
const path = require('path')
const coverImageBasePath = 'uploads/bookCovers'

const bookSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String},
    publishDate: {type: Date, required: true},
    pageCount: {type: Number, required: true},
    createdDate: {type: Date, required: true, default: Date.now},
    coverImageName: {type: String, required: true},
    //the ref should match the model name in the author.js file
    author: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Author'}

})

bookSchema.virtual('coverImagePath').get( function(){
    //we use a function here so we can refer to the bookSchema itself
    if(this.coverImageName != null){
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
})

module.exports = mongoose.model('Book', bookSchema)
module.exports.coverImageBasePath = coverImageBasePath