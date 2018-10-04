const router = require("express").Router()
const { body, validationResult, } = require('express-validator/check')
const { sanitizeBody, } = require('express-validator/filter')
const Book = require('../models/Book')
const ObjectId = require('mongoose').Types.ObjectId


module.exports = () => {

  ///////////////////////////////////////////////////////////
  // Utility Endpoints
  ///////////////////////////////////////////////////////////
  router.get("/wipebooks", (req, res) => {
    Book.deleteMany({}, err => {
      if (err) return Error(err.message)
      const message = "Successfully wiped 'books' collection"
      res.json({ success: true, message, })
    })
  })


  ///////////////////////////////////////////////////////////
  // Validations
  ///////////////////////////////////////////////////////////
  const book_form_validation = [
    body('book_title')
      .trim()
      .isLength({ min: 1, })
      .withMessage('Book Title missing')
      .isAscii()
      .withMessage('Book Title should include only valid ascii characters'),

    sanitizeBody('book_title').trim(),
  ]

  const book_id_validation = [
    body('_id')
      .trim()
      .isLength({ min: 1, })
      .withMessage('Book ID missing')
      .isAscii()
      .withMessage('Book ID should include only valid ascii characters')
      .isMongoId()
      .withMessage('Book ID is not a valid MongoID'),

    sanitizeBody('_id').trim(),
  ]


  ///////////////////////////////////////////////////////////
  // Manage Books Add/Update/Delete
  ///////////////////////////////////////////////////////////
  router.route('/api/books')

    // ** GET ** request
    .get((req, res, next) => {

      const {project_name} = req.params

      const query = { project_name, ...req.query }
      Book.find(query, {'__v': 0}, (err, books) => {
        if (err) { 
          return Error(err.message)
        }
        res.json(books)
      })
    })


    // ** POST ** request
    .post(book_form_validation, (req, res, next) => {

      // Check validation and exit early if unsuccessful 
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(Error(errors.array()[0].msg))
      }

      const { book_title } = req.body

      const book = new Book({
        book_title,
      })

      // book.save((err, doc) => {
      //   if (err) { return next(Error(err)) }

      //   const response = doc.toObject({ versionKey: false })
      //   res.json(response)
      // })
    })


    // ** DELETE ** request
    .delete(book_id_validation, (req, res, next) => {
      if (!req.body._id) {
        return next(Error('_id error'))
      }

      if (!validationResult(req).isEmpty()) {
        return next(Error(`could not delete ${req.body._id}`))
      }

      Book.findOneAndRemove({_id: req.body._id}, (err, book) => {

        if (err || !book) {
          return next(Error(`could not delete ${req.body._id}`))
        }

        res.send(`deleted ${req.body._id}`)
      })
    })


  router.route('/api/books/:id')


    // ** GET ** request
    .get((req, res, next) => {
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })


    // ** POST ** request
    .post(book_form_validation, (req, res, next) => {
      
      // Check validation and exit early if unsuccessful 
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(Error(errors.array()[0].msg))
      }
      //json res format same as .get
    })

    // ** DELETE ** request
    .delete(book_id_validation, (req, res, next) => {
      if (!req.body._id) {
        return next(Error('_id error'))
      }

      if (!validationResult(req).isEmpty()) {
        return next(Error(`could not delete ${req.body._id}`))
      }

      Book.findOneAndRemove({_id: req.body._id}, (err, book) => {

        if (err || !book) {
          return next(Error(`could not delete ${req.body._id}`))
        }

        res.send('delete successful')
      })
    })

  return router
  
}