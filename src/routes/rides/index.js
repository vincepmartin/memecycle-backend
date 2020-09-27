const express = require('express')
const router = express.Router()
const FitParser = require('fit-file-parser').default
const Ride = require('../../models/ride')

const processFitPromise = (file) => {
    // console.log(`***** processFitPromise running with file: ${file.name}`)

    return new Promise((resolve, reject) => {
        const fitParser = new FitParser({
            force: true,
            speedUnit: 'mph',
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
                console.log(`***** Success processing ${file.name}`)
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
            console.log('ERROR HIT!')
            console.log(error)
            response.send(error)
        } else {
            console.log('SENDING A RESPONSE!')
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
    // Store ride data in a mongoose obj.
    const ride = new Ride({
        title: (request.body.title) ? request.body.title : 'Default Title.',
        description: (request.body.description) ? request.body.description : 'This is a test ride.',
        rideData: null,
        image1: (request.files.image1) ? {name: request.files.image1.name, data: request.files.image1.data}: null,
        image2: (request.files.image2) ? {name: request.files.image2.name, data: request.files.image2.data}: null,
        image3: (request.files.image3) ? {name: request.files.image3.name, data: request.files.image3.data}: null,
        image4: (request.files.image4) ? {name: request.files.image4.name, data: request.files.image4.data}: null,
    })

    if (!request.files || Object.keys(request.files).length === 0) {
        return response.status(400).send('No files were attached.')
    } else {
        if(request.files.rideFile) {
            // We have a rideFile, go ahead and process it.
            processFitPromise(request.files.rideFile).then(rideData => {
                ride.rideData = JSON.stringify(rideData)
            }).then(() => (ride.save())).then(doc => {
                // TODO: Print out the ride obj.
                response.send(doc._id)
            })
            .catch(error => {
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