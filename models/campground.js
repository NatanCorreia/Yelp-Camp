const mongoose = require('mongoose');
const joi = require('joi');
const review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema(
    {
        url:String,
        filename: String
    }
)

//Necessary to pass virtuals into the resulting instance of the Schema
const opts = {toJSON:{virtuals:true}};

ImageSchema.virtual('thumbnail').get(function (){
    return this.url.replace('/upload', '/upload/w_200')
});

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
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
},opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return`<a href="/campgrounds/${this._id}">${this.title}</a><p>
    ${this.description.substring(0,20)}...</p>`
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
