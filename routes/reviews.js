const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/ExpressError');
const {validateReview, isLoggedIn} = require('../middleware');
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviewController = require('../controllers/reviews')

const { reviewSchema} = require('../schemas.js');



router.post('/', validateReview,isLoggedIn, catchAsync(reviewController.createReview))

router.delete('/:reviewId', catchAsync(reviewController.deleteReview))


module.exports = router;