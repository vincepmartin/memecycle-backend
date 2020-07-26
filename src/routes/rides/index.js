const express = require('express')
const router = express.Router()
const FitParser = require('fit-file-parser').default

// Convert the fit file to some usable JSON.
// Upload to DB.
const processFile = ((file, callback) => {
    const fitParser = new FitParser({
        force: true,
        speeddUnit: 'mph',
        lengthUnit: 'mi',
        temperatureUnit: 'farhenheit',
    })

    return fitParser.parse(file, (error, data) => {
        if(error) {
            throw(`Problem processing fit file ${file}`)
        }

        // TODO: Upload to DB.

        callback(data)
    })
})

// TODO: Return all ride ids.
router.get('/', (request, response) => {
    response.send({
        title: 'Ride 1',
        description: 'This is ride number 1.',
        data: {miles: 10, feet: 200}
    })
})

// TODO: Upload ride to DB.
// Allow the following:
//  Device File: .FIT file for ride.
//  Title: String
//  Description: String
//  Images: Jpeg. 

router.post('/', (request, response) => {
    console.log('File upload request.') 
    
    if (!request.files || Object.keys(request.files).length === 0) {
        return response.status(400).send('No files were uploaded.');
    } else {
        processFile(request.files.rideFile.data, (data) => {response.send(data)})
    }
})

module.exports = router 