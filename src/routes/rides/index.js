const express = require('express')
const router = express.Router()
const EasyFit = require('easy-fit/dist/easy-fit.js').default;

// Convert the fit file to some usable JSON.
const processFile = ((file, callback) => {
    const easyFit = new EasyFit({
        force: true,
        speeddUnit: 'mph',
        lengthUnit: 'mi',
        temperatureUnit: 'farhenheit'
    })

    return easyFit.parse(file, (error, data) => {
        if(error) {
            throw(`Problem processing fit file ${file}`)
        } 
        callback(data)
    })
})

router.get('/', (request, response) => {
    response.send({
        title: 'Ride 1',
        description: 'This is ride number 1.',
        data: {miles: 10, feet: 200}
    })
})

router.post('/', (request, response) => {
    console.log('File upload request.') 
    
    if (!request.files || Object.keys(request.files).length === 0) {
        return response.status(400).send('No files were uploaded.');
    } else {
        processFile(request.files.rideFile.data, (data) => {response.send(data)})
    }
})

module.exports = router 