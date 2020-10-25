const express = require('express')
const router = express.Router()

// Process ride files (.fit and .gpx)
const FitParser = require('fit-file-parser').default
const toGeoJSON = require('togeojson')
const DOMParser = require('xmldom').DOMParser

const Ride = require('../../models/ride')


const processRideFile = (file) => {
    console.log('PROCESSING FILE')
    console.log(file.name)

    if(file.name.endsWith('gpx')) {
        return processGPXPromise(file)
    } else {
        return processFitPromise(file)
    }
}

const processGPXPromise = (file) => {
    return new Promise((resolve, reject) => {
        console.log(`Processing GPX file: ${file.name}`)  
        // Load my GPX file into the dom?
        const gpxDom = new DOMParser().parseFromString(file.data.toString())
        const results = toGeoJSON.gpx(gpxDom)

        if(results) {
            resolve({type: 'gpx', data: results})
        } else {
            console.log('Problem parsing GPX file.')
            reject('Error processing GPX')
        }
    })
}

const processFitPromise = (file) => {
    return new Promise((resolve, reject) => {
        console.log(`Processing FIT file: ${file.name}`)  
        const fitParser = new FitParser({
            force: true,
            speedUnit: 'mph',
            lengthUnit: 'mi',
            temperatureUnit: 'farhenheit',
        })

        // TODO: Changed file to file.data
        fitParser.parse(file.data, (error, data) => {
            if(error) {
                console.log('Error processing FIT file.') 
                console.log(error)
                reject(new Error('Problem processing fit file.'))
            } else {
                resolve({type: 'fit', data: data})
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

// Allow the following:
//  Device File: .FIT file for ride.
//  Device File: .GPX file for the ride.
//  Title: String
//  Description: String
//  Images: Jpeg. 

router.post('/', (request, response) => {
    // Store ride data in a mongoose obj.
    const ride = new Ride({
        title: (request.body.title) ? request.body.title : 'Default Title.',
        description: (request.body.description) ? request.body.description : 'This is a test ride.',
        rideType: null,
        rideData: null,
        image1: (request.files.image1) ? {name: request.files.image1.name, data: request.files.image1.data}: null,
        image2: (request.files.image2) ? {name: request.files.image2.name, data: request.files.image2.data}: null,
        image3: (request.files.image3) ? {name: request.files.image3.name, data: request.files.image3.data}: null,
        image4: (request.files.image4) ? {name: request.files.image4.name, data: request.files.image4.data}: null,
    })

    if (!request.files || Object.keys(request.files).length === 0) {
        return response.status(400).send('No files were attached.')
    } 
    // We have a ride file.  Let's do stuff to it.  
    else if(request.files.rideFile) {
        processRideFile(request.files.rideFile)
            .then(processedRideFile => {
                ride.rideType = processedRideFile.type
                ride.rideData = processedRideFile.data
            })
            .then(() => {
                // I was hoping I could just do .then(ride.save()) and have that chain to the next then.
                // Does not seem to work for me right now...
                return ride.save()
            })
            .then(doc => {
                response.send(doc._id)
            })
            .catch((error) => {
                console.log('Error hit while processing ride file')
                console.log(error)
                response.status(400).send(error)
            })
    }
    // We have no file, this is our last resort.  Save without the file.
    else {
        ride.save().then(doc => response.send(doc)).catch(error => {
            console.log('Error hit while processing without a ride file')
            console.log(error)
            response.status(400).send(error)
        })
    }
})

module.exports = router 