const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ride = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    rideData: { type: String},
    // TODO: Maybe make this an array.
    image1: { type: Buffer },
    image2: { type: Buffer },
    image3: { type: Buffer },
    image4: { type: Buffer },
})

module.exports = mongoose.model('ride', ride)