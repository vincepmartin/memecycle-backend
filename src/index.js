const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// Configure routes.
const routes = require('./routes/index.js')
app.use(routes)

// Handle errors.
app.use( (req, res, next) => {
    res.status(404).send('<h1>Wrong place buddeh.</h1>')
})

// Start server.
app.listen(8080, () => {
    console.log('Listening...')
})