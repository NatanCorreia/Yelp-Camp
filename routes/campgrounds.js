const express = require('express');
const router = express.Router();
const {campgroundSchema} = require('../schemas.js');
const campgroundsController = require('../controllers/campgrounds')
const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/ExpressError');
const Campground = require('../models/campground');
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware');

// for parsing multipart form-data and storing in cloudnary
const {cloudnary, storage} = require('../cloudinary')
const multer = require('multer');
const upload = multer({storage})

router.route('/')
.get(campgroundsController.index)
.post(isLoggedIn,upload.array('image'), validateCampground,catchAsync(campgroundsController.createCampground))

router.get('/teste',(req,res) =>{
    console.log('entrou')
    res.render('campgrounds/teste')
})


router.get('/new', isLoggedIn, campgroundsController.renderNewForm);

router.route('/:id')
.get(catchAsync(campgroundsController.showCampground))
.put(isLoggedIn ,isAuthor,upload.array('image'),validateCampground,catchAsync(campgroundsController.editCampground))
.delete(isLoggedIn,isAuthor,catchAsync(campgroundsController.deleteCampground))




router.get('/:id/edit',isLoggedIn, isAuthor ,catchAsync(campgroundsController.renderEditForm))


module.exports = router;