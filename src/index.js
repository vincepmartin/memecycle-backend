const express = require('express')
const morgan = require('morgan')
const fileUpload = require('express-fileupload')
const app = express()

// Configure routes.
const routes = require('./routes/index.js')

// Logging to console.
app.use(morgan('short'))

// Allow easy uploading of files.
app.use(fileUpload({createParentPath: true, debug: true}))

// Routes.
app.use(routes)

// Handle errors.
app.use( (request, response, next) => {
    response.status(404).send('<h1>Wrong place buddeh.</h1>')
})

// Start server.
app.listen(8080, () => {
    console.log('Listening...')
})