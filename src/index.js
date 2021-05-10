const express = require('express')
const morgan = require('morgan')
const fileUpload = require('express-fileupload')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const rateLimit = require('express-rate-limit')

/* Configure MongoDB. */
//Get the default connection
const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/memebike', {useNewUrlParser: true});
mongoose.connect('mongodb://mongo/memebike', {useNewUrlParser: true});
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', console.error.bind(console, 'Mongoose: Connected to DB.'))

// Configure routes.
const routes = require('./routes/index.js')

// Logging to console.
app.use(morgan('short'))

// Rate limiting
const mins = 60
app.use(rateLimit({
    window: mins * 60 * 1000,
    max: 15,
}))

// Allow easy uploading of files.
app.use(fileUpload({createParentPath: true, debug: true}))

// Body decoding.
app.use(bodyParser.urlencoded({extended: true}))

// Configure CORS.
const corsOptions = {origin: 'https://memecycle.finalatomicbuster.net'}
app.use(cors(corsOptions))

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
