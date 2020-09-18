const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ride = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    rideData: { type: Schema.Types.Mixed},
    // TODO: Maybe make this an array.
    // I know this is a bit hacky...
    image1: {
        name: {type: String},
        data: {type: Buffer},
    },
    image2: {
        name: {type: String},
        data: {type: Buffer},
    },
    image3: {
        name: {type: String},
        data: {type: Buffer},
    },
    image4: {
        name: {type: String},
        data: {type: Buffer},
    },
})

module.exports = mongoose.model('ride', ride)