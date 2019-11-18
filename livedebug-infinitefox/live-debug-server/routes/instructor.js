const express = require('express')
const InstructorController = require('../controllers/instructor')
const authentication = require('../middlewares/auth')

const router = express.Router()

router.use(authentication)
router.get('/', InstructorController.readAll)
router.post('/', InstructorController.create)
router.get('/:id', InstructorController.readOne)
router.put('/:id', InstructorController.update)
router.delete('/:id', InstructorController.delete)
