const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const { Instructor, User } = require('../models')
const { sign } = require('../helpers/jwt')

chai.use(chaiHttp)
const expect = chai.expect

let initialInstructor = {}
let initialToken = ''

// for check error, create falseId & invalidToken
let falseId = '5d63b24530a316a809302c57'
let invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

// HOOKS: middleware testing
before(function(done) {
  // generateToken for initial data
  User.create({
    name: 'sakura',
    email: 'sakura@gmail.com',
    password: 'sarada'
  })
    .then(user => {
      initialToken = sign({
        _id: user._id,
        name: user.name,
        email: user.email
      })
      console.log('success generate token')
      return Instructor.create({
        firstName: 'naruto',
        lastName: 'uzumaki',
        email: 'naruto@gmail.com'
      })
    })
    .then(instructor => {
      initialInstructor = instructor
      done()
    })
    .catch(console.log)
})

// HOOKS: delete data after testing
after(function(done) {
  if(process.env.NODE_ENV === 'testing') {
    Instructor.deleteMany({})
      .then(_ => {
        console.log('testing: delete data instructor success!')
        return Instructor.deleteMany({})
      })
      .then(_ => {
        console.log('testing: delete data user success!')
        done()
      })
      .catch(console.log)
  }
})

describe('Instructor CRUD', function() {
  // Data for CRUD
  let newInstructor = {
    firstName: 'sasuke',
    lastName: 'uchiha',
    email: 'sasuke@gmail.com'
  }
  this.timeout(10000)

  // testing POST /instructors; 1 success & 7 error
  describe('POST /instructors', function() {
    describe('success process', function() {
      it('should send an object (_id, firstName, lastName, email) with 201 status code', function(done) {
        chai.request(app)
        .post('/instructors')
        .send(newInstructor)
        .set('token', initialToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(201)
          expect(res.body).to.be.an('object').to.have.any.keys('_id', 'firstName', 'lastName', 'email')
          expect(res.body).to.includes({ firstName: newInstructor.firstName, lastName: newInstructor.lastName, email: newInstructor.email})
          done()
        })
      })
    })
    describe('errors process', function() {
      it('should send an error with 400 status code because missing first name value', function(done) {
        const withoutFirstname = { ...newInstructor }
        delete withoutFirstname.firstName
        chai.request(app)
        .post('/instructors')
        .send(withoutFirstname)
        .set('token', initialToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object').to.have.any.keys('message', 'errors')
          expect(res.body.message).to.equal('validation error')
          expect(res.body.errors).to.be.an('array').that.includes('First name required')
          done()
        })
      })
      it('should send an error with 400 status code because missing last name value', function(done) {
        const withoutLastname = { ...newInstructor }
        delete withoutLastname.lastName
        chai.request(app)
        .post('/instructors')
        .send(withoutLastname)
        .set('token', initialToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object').to.have.any.keys('message', 'errors')
          expect(res.body.message).to.equal('validation error')
          expect(res.body.errors).to.be.an('array').that.includes('Last name required')
          done()
        })
      })
      it('should send an error with 400 status code because missing email value', function(done) {
        const withoutEmail = { ...newInstructor }
        delete withoutEmail.email
        chai.request(app)
        .post('/instructors')
        .send(withoutEmail)
        .set('token', initialToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object').to.have.any.keys('message', 'errors')
          expect(res.body.message).to.equal('validation error')
          expect(res.body.errors).to.be.an('array').that.includes('Email required')
          done()
        })
      })
      it('should send an error with 400 status code because format email invalid', function(done) {
        const falseEmailFormat = { ...newInstructor, email: 'salahformat.com' }
        chai.request(app)
        .post('/instructors')
        .send(falseEmailFormat)
        .set('token', initialToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object').to.have.any.keys('message', 'errors')
          expect(res.body.message).to.equal('validation error')
          expect(res.body.errors).to.be.an('array').that.includes('Email invalid format')
          done()
        })
      })
      it('should send an error with 400 status code because duplicate data', function(done) {
        chai.request(app)
        .post('/instructors')
        .send(newInstructor)
        .set('token', initialToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object').to.have.any.keys('message', 'errors')
          expect(res.body.message).to.equal('validation error')
          expect(res.body.errors).to.be.an('array').that.includes('Email instructor is already registered!')
          done()
        })
      })
      it('should send an error with 403 status code because token undefined', function(done) {
        chai.request(app)
        .post('/instructors')
        .send(newInstructor)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(403)
          expect(res.body).to.be.an('object').to.have.any.keys('message')
          expect(res.body.message).to.equal('jwt must be provided')
          done()
        })
      })
      it('should send an error with 403 status code because invalid token', function(done) {
        chai.request(app)
        .post('/instructors')
        .send(newInstructor)
        .set('token', invalidToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(403)
          expect(res.body).to.be.an('object').to.have.any.keys('message')
          expect(res.body.message).to.equal('invalid signature')
          done()
        })
      })
    })
  })

  // testing GET /instructors; 1 success & 2 error
  describe('GET /instructors', function() {
    describe('success process', function() {
      it('should send an array of object with 200 status code', function(done) {
        chai.request(app)
        .get('/instructors')
        .set('token', initialToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          done()
        })
      })
    })
    describe('error process', function() {
      it('should send an error with 403 status code because token undefined', function(done) {
        chai.request(app)
        .get('/instructors')
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(403)
          expect(res.body).to.be.an('object').to.have.any.keys('message')
          expect(res.body.message).to.equal('jwt must be provided')
          done()
        })
      })
      it('should send an error with 403 status code because invalid token', function(done) {
        chai.request(app)
        .get('/instructors')
        .send(newInstructor)
        .set('token', invalidToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(403)
          expect(res.body).to.be.an('object').to.have.any.keys('message')
          expect(res.body.message).to.equal('invalid signature')
          done()
        })
      })
    })
  })

  // testing GET /instructors/:id; 1 success & 3 error
  describe('GET /instructors/:id', function() {
    describe('errors process', function() {
      it('should send an object with message instructor not found and 404 status code because _id', function(done) {
        chai.request(app)
        .get('/instructors/' + falseId)
        .set('token', initialToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(404)
          expect(res.body).to.be.an('object').to.have.any.keys('message')
          expect(res.body.message).to.equal('instructor not found')
          done()
        })
      })
      it('should send an error with 403 status code because token undefined', function(done) {
        chai.request(app)
        .get('/instructors/' + falseId)
        .send(newInstructor)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(403)
          expect(res.body).to.be.an('object').to.have.any.keys('message')
          expect(res.body.message).to.equal('jwt must be provided')
          done()
        })
      })
      it('should send an error with 403 status code because invalid token', function(done) {
        chai.request(app)
        .get('/instructors/' + falseId)
        .send(newInstructor)
        .set('token', invalidToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(403)
          expect(res.body).to.be.an('object').to.have.any.keys('message')
          expect(res.body.message).to.equal('invalid signature')
          done()
        })
      })
    })
    describe('success process', function() {
      it('should send correct data with 200 status code', function(done) {
        chai.request(app)
        .get('/instructors/' + initialInstructor._id)
        .set('token', initialToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object').to.have.any.keys('_id', 'firstName', 'lastName', 'email')
          expect(res.body).to.includes({ _id: String(initialInstructor._id), firstName: initialInstructor.firstName, lastName: initialInstructor.lastName, email: initialInstructor.email})
          done()
        })
      })
    })
  })

  // testing DELETE /instructors/:id; 1 success & 3 error
  describe('DELETE /instructors/:id', function() {
    describe('errors process', function() {
      it('should send an object with message instructor not found and 404 status code because _id', function(done) {
        chai.request(app)
        .delete('/instructors/' + falseId)
        .set('token', initialToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(404)
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('instructor not found')
          done()
        })
      })
      it('should send an error with 403 status code because token undefined', function(done) {
        chai.request(app)
        .delete('/instructors/' + initialInstructor._id)
        .send(newInstructor)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(403)
          expect(res.body).to.be.an('object').to.have.any.keys('message')
          expect(res.body.message).to.equal('jwt must be provided')
          done()
        })
      })
      it('should send an error with 403 status code because invalid token', function(done) {
        chai.request(app)
        .delete('/instructors/' + initialInstructor._id)
        .send(newInstructor)
        .set('token', invalidToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(403)
          expect(res.body).to.be.an('object').to.have.any.keys('message')
          expect(res.body.message).to.equal('invalid signature')
          done()
        })
      })
    })
    describe('success process', function() {
      it('should send 204 status code', function(done) {
        chai.request(app)
        .delete('/instructors/' + initialInstructor._id)
        .set('token', initialToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(204)
          done()
        })
      })
    })
  })
})