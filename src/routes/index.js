const express = require('express')
const router = express.Router()
const rideRoute = require('./ride/index.js')

router.use('/rides', rideRoute)

modules.export = router