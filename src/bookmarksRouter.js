
const express = require('express')
const uuid = require('uuid/v4')
const logger = require('./logger')
const data = require('./bookmarks-data')
const validUrl = require('valid-url')

const bookmarksRouter = express.Router()
const bodyParser = express.json()


bookmarksRouter
    .route('/bookmarks')
    .get((req, res) => {
        res.json(data.bookmarks)
    })
    .post(bodyParser,(req,res)=>{
        const{title,url,rating,description}=req.body

        if (!title) {
            logger.error(`${title} is required`)
            return res.status(400).send(`'${field}' is required`)
        }
        if (!url) {
            logger.error(`${url} is required`)
            return res.status(400).send(`'${url}' is required`)
        }
        if (!rating) {
            logger.error(`${rating} is required`)
            return res.status(400).send(`'${rating}' is required`)
        }

        if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
            logger.error(` rating '${rating}' not valid`)
            return res.status(400).send(`'rating' must be a number between 0 and 5`)
        }
        if(!(validUrl.isUri(url))){
            logger.error(` rating '${url}' not valid`)
            return res.status(400).send(`'url' must be a valid URL`)
        }

        const bookmark = { id: uuid(), title, url, description, rating }
        data.bookmarks.push(bookmark)
        res
            .status(201)
            .location(`http://localhost:8000/bookmarks/${bookmark.id}`)
            .json(bookmark)
    })


bookmarksRouter
    .route('/bookmarks/:bookmark_id')
    .get((req, res) => {
        const { bookmark_id } = req.params

        const bookmark = data.bookmarks.find(c => c.id == bookmark_id)

        if (!bookmark) {
            logger.error(`Bookmark with id ${bookmark_id} not found.`)
            return res
                .status(404)
                .send('Bookmark Not Found')
        }
        res.json(bookmark)
    })
    .delete((req, res) => {
        const { bookmark_id } = req.params

        const bookmarkIndex = data.bookmarks.findIndex(b => b.id === bookmark_id)

        if (bookmarkIndex === -1) {
            logger.error(`Bookmark with id ${bookmark_id} not found.`)
            return res
                .status(404)
                .send('Bookmark Not Found')
        }

        data.bookmarks.splice(bookmarkIndex, 1)

        logger.info(`Bookmark with id ${bookmark_id} deleted.`)
        res
            .status(204)
            .end()
    })


        
module.exports = bookmarksRouter

    

