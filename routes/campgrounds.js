const express = require('express');
const router = express.Router();
const {campgroundSchema} = require('../schemas.js');
const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/ExpressError');
const Campground = require('../models/campground');
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware');

router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})

router.get('/new', isLoggedIn,(req, res) => {
    res.render('campgrounds/new');
})
router.post('/',isLoggedIn,validateCampground, catchAsync(async (req, res,next) => {
    // if(!req.body.campground) throw new ExpressError('Fill all Camps', 400);

    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);
}))

router.get('/:id',catchAsync( async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id).populate(
        {path:'reviews',
    populate:{
        path:'author'
    }}).populate('author');
  
    if(!foundCamp){
        req.flash('error', 'Cannot Find that campgroud');
        return  res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { foundCamp });
}))
router.get('/:id/edit',isLoggedIn, isAuthor ,catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    
    res.render('campgrounds/edit', {campground });

}))
router.put('/:id',isLoggedIn ,isAuthor,validateCampground,catchAsync( async (req,res) => {
    
   const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
   req.flash('success', 'Successfully updated a campground!');
   res.redirect(`/campgrounds/${campground._id}`);
}))
router.delete('/:id',isLoggedIn,isAuthor,catchAsync( async(req,res)=>{
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted a campground!');
    res.redirect('/campgrounds');
}))

module.exports = router;