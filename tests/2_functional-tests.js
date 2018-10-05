/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const Book = require('../models/Book')
const ObjectId = require('mongoose').Types.ObjectId

chai.use(chaiHttp);

before((done) => {
  Book.deleteMany({}, (err) => {
    if (err) {
      return done(err)
    }
    console.log("Successfully wiped 'books' collection")
    done()
  })
})

suite('Functional Tests', function() {

  let id
  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'Hatchet'
          })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.property(res.body, '_id', 'Book should contain _id')
            id = res.body._id
            assert.property(res.body, 'title', 'Book should contain title')
            assert.isTrue(ObjectId.isValid(id), '_id should be valid ObjectId')
            assert.equal(res.body.title, 'Hatchet')
            done();
          })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.property(res.body, 'success', 'Error response should have \'success\' property')
            assert.property(res.body, 'error', 'Error response should have \'error\' property')
            assert.isFalse(res.body.success)
            assert.equal(res.body.error, 'Book Title missing', 'Book title must be passed in body')
            done();
          })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.isArray(res.body, `Response should be type 'array', received '${typeof res.body}'`)
            assert.property(res.body[0], '_id', 'Books in array should contain _id')
            assert.property(res.body[0], 'title', 'Books in array should contain title')
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount')
            assert.isTrue(ObjectId.isValid(res.body[0]._id), '_id should be valid ObjectId')
            done();
          })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/111111111111111111111111')
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.property(res.body, 'success', 'Error response should have \'success\' property')
            assert.property(res.body, 'error', 'Error response should have \'error\' property')
            assert.isFalse(res.body.success)
            assert.equal(res.body.error, 'Book with _id 111111111111111111111111 not found')
            done();
          })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get(`/api/books/${id}`)
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.property(res.body, '_id', 'Book should contain _id')
            assert.property(res.body, 'title', 'Book should contain title')
            assert.property(res.body, 'comments', 'Book should contain comments array')
            assert.isTrue(ObjectId.isValid(res.body._id), '_id should be valid ObjectId')
            assert.isArray(res.body.comments, `comments should be type 'array', received '${typeof res.body.comments}'`)
            assert.equal(res.body.title, 'Hatchet')
            assert.equal(res.body.comments.length, 0, 'comments should be an empty array')
            assert.equal(res.body._id, id)
            done();
          })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .post('/api/books/111111111111111111111111')
          .send({
            comment: 'Favorite childhood book!'
          })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.property(res.body, 'success', 'Error response should have \'success\' property')
            assert.property(res.body, 'error', 'Error response should have \'error\' property')
            assert.isFalse(res.body.success)
            assert.equal(res.body.error, 'Book with _id 111111111111111111111111 not found')
            done();
          })
      });

      test('Test POST /api/books/[id] with no comment',  function(done){
        chai.request(server)
          .post(`/api/books/${id}`)
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.property(res.body, 'success', 'Error response should have \'success\' property')
            assert.property(res.body, 'error', 'Error response should have \'error\' property')
            assert.isFalse(res.body.success)
            assert.equal(res.body.error, 'Book Comment missing', 'comment must be passed in body')
            done();
          })
      });

      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post(`/api/books/${id}`)
          .send({
            comment: 'Favorite childhood book!'
          })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.property(res.body, '_id', 'Book should contain _id')
            assert.property(res.body, 'title', 'Book should contain title')
            assert.property(res.body, 'comments', 'Book should contain comments array')
            assert.isTrue(ObjectId.isValid(res.body._id), '_id should be valid ObjectId')
            assert.isArray(res.body.comments, `comments should be type 'array', received '${typeof res.body.comments}'`)
            assert.equal(res.body.title, 'Hatchet')
            assert.equal(res.body.comments.length, 1, 'comments should contain a single entry')
            assert.equal(res.body.comments[0], 'Favorite childhood book!')
            assert.equal(res.body._id, id)
            done();
          })
      });
      
    });

  });

});
