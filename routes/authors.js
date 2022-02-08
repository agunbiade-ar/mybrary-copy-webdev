const express = require('express')
const router = express.Router()
const Author = require('../models/author')

//all authors route
router.get("/", async function(req, res){
    // let reg = new RegExp(req.body.name)
    let searchOptions = {}
    
    if( req.query.name !== '' || req.query.name !== null){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }

    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', {authors: authors, searchOptions: req.query})
    } catch (error) {
        res.redirect('/')
    }
    
})

// new author route
router.get("/new", function(req, res){
    res.render('authors/new', {author: new Author()})
})

//create author route
router.post("/", async function(req, res){
    // console.log(req.body.name) 
    const author = new Author({
        name: req.body.name
    })

    try 
    {
        await author.save()
        res.redirect('/')
    } catch (error) {
        res.render('authors/new', 
        {author: author, errorMessage: "Error Creating author...Invalid Author Detail(s)"})
    }
})

module.exports = router