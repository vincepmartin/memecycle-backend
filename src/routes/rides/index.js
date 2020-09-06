const express = require('express')
const router = express.Router()
const FitParser = require('fit-file-parser').default
const Ride = require('../../models/ride')

const processFitPromise = (file) => {
    console.log('***** processFitPromise running with file: ')
    console.log(file)

    return new Promise((resolve, reject) => {
        const fitParser = new FitParser({
            force: true,
            speeddUnit: 'mph',
            lengthUnit: 'mi',
            temperatureUnit: 'farhenheit',
        })

        // TODO: Changed file to file.data
        fitParser.parse(file.data, (error, data) => {
            if(error) {
                console.log('***** processFitPromise: Error hit') 
                console.log(error)
                reject(new Error('Problem processing fit file.'))
            } else {
                console.log('***** processFitPromise resolve trigger.')
                resolve(data)
            }
        })
    })
}

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
    // Store ride data.
    console.log('***** REQ *****')
    console.log(request)
    console.log('***** FILES *****')
    console.log(request.files)
    const ride = new Ride({
        title: (request.title) ? request.title : 'Default Title.',
        description: (request.description) ? request.description : 'This is a test ride.',
        rideData: null,
        image1: request.files.image1,
        image2: request.files.image2,
        image3: request.files.image3,
        image4: request.files.image4,
    })

    if (!request.files || Object.keys(request.files).length === 0) {
        return response.status(400).send('No files were attached.')
    } else {
        if(request.files.rideFile) {
            // We have a rideFile, go ahead and process it.
            processFitPromise(request.files.rideFile).then(rideData => {
                ride.rideData = JSON.stringify(rideData)
            }).then(() => (ride.save())).then(doc => {
                response.send(doc._id)
            })
            .catch(error => {
                console.log(error)
                response.status(400).send(error)
            })
        } else { // No rideFile was included.  Just save the non rideData stuff.
            ride.save().then(doc => {
                response.send(doc._id)
           }).catch(error => {
                console.log(error)
                response.status(400).send(error)
           })
        }
   }
})

module.exports = router 