const express = require('express')
const router = express.Router()
const FitParser = require('fit-file-parser').default
const Ride = require('../../models/ride')

// Convert the fit file to some usable JSON.
// Upload to DB.
const processFitFile = ((file, callback) => {
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
        callback(data)
    })
})

// Return a ride based on its document ID in the DB.
router.get('/:id', (request, response) => {
    // Attempt to get this id from the database.
    console.log(`Attempting to get ride id: ${request.params.id}`)
    Ride.findById(request.params.id, (error, ride) => {
        if(error) {
            response.send(error)
        } else {
            response.send(ride)
        }
    }) 
})

// TODO: Upload ride to DB.
// Allow the following:
//  Device File: .FIT file for ride.
//  Title: String
//  Description: String
//  Images: Jpeg. 

router.post('/', (request, response) => {
    if (!request.files || Object.keys(request.files).length === 0) {
        return response.status(400).send('No files were uploaded.');
    } else {
        processFitFile(request.files.rideFile.data, (data) => {
            const ride = new Ride({
                title: 'Test ride.',
                description: 'This is a test ride.',
                rideData: JSON.stringify(data)
            })

            ride.save((error, ride) => {
                if(error) {
                    console.error(error)
                    response.status(400).send(error)
                    return(error)
                }

                response.send(ride._id)})
                console.log(ride)
            })
    }
})

module.exports = router 