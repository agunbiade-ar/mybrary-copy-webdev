const express = require('express')
const router = express.Router()
const multer = require('multer')
const Book = require('../models/book')
const Author = require('../models/author')

const fs = require('fs')
const path = require('path')
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['images/jpeg', 'images/png', 'images/gif']

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadPath)
    },
    filename: (req, file, callback) =>{
        callback(null, Date.now() + '...' + file.originalname)
    },
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

const upload = multer({storage: fileStorageEngine})

//all books route
router.get("/", async function(req, res){
    let query = Book.find()
    
    if( req.query.title != '' && req.query.title != null){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if( req.query.publishedBefore != '' && req.query.publishedBefore != null){
        query = query.lte('publishDate', req.query.publishedBefore)
    }    
    if( req.query.publishedAfter != '' && req.query.publishedAfter != null){
        query = query.gte('publishDate', req.query.publishedAfter)
    }    

    try {
        const books = await query.exec()
        res.render('books/index', 
        {
            books: books,
            searchOptions: req.query
        })      
    } catch (error) {
        res.redirect('/')
    }
})

// new book route
router.get("/new", async function(req, res){
    renderNewPage(res, new Book())
})

//create book route
router.post("/", upload.single('cover'), async function(req, res){
    
    const fileName = req.file != null ? req.file.filename : null 
    // console.log(fileName)

    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount, 
        description: req.body.description,
        coverImageName: fileName
    })

    try {
        await book.save()
        res.redirect('/books')
    } catch (error) {
        if(book.coverImageName != null)
            {
                removeBookCover(book.coverImageName)
            }
        renderNewPage(res, book, true)
    }
})

function removeBookCover(filename){
    fs.unlink(path.join(uploadPath, filename), err => { 
        if(err) console.error(err)
    })
}

async function renderNewPage(res, book, hasError = false){
    try {
        const authors = await Author.find({})
        const params = {authors: authors, book: book}
        
        if(hasError){
            params.errorMessage = "Error Creating New Book" 
        }
        res.render('books/new', params)    
    } catch (error) {
        res.redirect('/books')
    }
}

module.exports = router