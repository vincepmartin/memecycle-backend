const express = require('express')
const router = express.Router()

router.use('/rides', require('./rides'))

module.exports = router