const mongoose = require('mongoose');
const joi = require('Joi');
const review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }]
});

// post middleware that triggers after the deletion of one campground, deleting all reviews associated with it, like a cascade on sql.
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
})


module.exports = mongoose.model('Campground', CampgroundSchema);
