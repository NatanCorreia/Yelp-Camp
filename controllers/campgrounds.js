const ExpressError = require('../helpers/ExpressError');
const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({accessToken: process.env.MAPBOX_TOKEN});

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res,next) => {

    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit:1
    }).send();  
    const newCampground = new Campground(req.body.campground);
    newCampground.geometry = geoData.body.features[0].geometry;
    newCampground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    newCampground.author = req.user._id;
    await newCampground.save();
    console.log(newCampground);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);
}

module.exports.showCampground = async (req, res) => {
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
}

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    
    res.render('campgrounds/edit', {campground });

}
module.exports.editCampground = async (req,res) => {
    const {id} = req.params;
    
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    const imgs = req.files.map( f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        console.log(req.body.deleteImages);
       const deletedCamp = await campground.updateOne({$pull:{images:{filename:{$in: req.body.deleteImages}}}})
        
       console.log(deletedCamp);
        for( let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
            console.log(req.body);
        }

    }
    req.flash('success', 'Successfully updated a campground!');
    res.redirect(`/campgrounds/${campground._id}`);
 }

 module.exports.deleteCampground = async(req,res)=>{
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted a campground!');
    res.redirect('/campgrounds');
}