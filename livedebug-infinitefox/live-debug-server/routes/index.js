const express = require('express')
const userRoutes = require('./user')
const instructorRoutes = require('./instructor')

const router = express.Router()

router.get('/', function(req, res, next) {
  res.status(200).json({
    message: 'welcome to liveServer, please check api documentation'
  })
})

router.use('/users', userRoutes)
router.use('/instructors', instructorRoutes)

router.get('/*', function(req, res, next) {
  res.status(404).json({
    message: '404, routes not found'
  })
})
