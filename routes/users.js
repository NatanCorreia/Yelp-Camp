const express = require('express');
const router = express.Router({mergeParams: true});
const passport = require('passport');
const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/ExpressError');
const User = require('../models/user');

const {userSchema} = require('../schemas.js');




// Middleware created to use the Joi object to validate the determined conditions, not necessary 
//in this case because of passport the runs its validations.
// const validateUser = async (req,res,next) => {
//     const {error} = userSchema.validate(req.body);
//     if(error){
//         const msg = error.details.map(el => el.message).join(',');
//         throw new ExpressError(msg, 400);
//     }
//     else{
//         next();
//     }
// }


router.get('/register' , (req,res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async(req,res,next) =>{
    try{
    const {username, email, password} = req.body;
    const user = new User({username,email});
    const registeredUser = await User.register(user,password);
    req.login(registeredUser, (err) =>{
    if(err){
        next(err);
    }})
    req.flash('success', 'User registration was a success');
    res.redirect('/campgrounds');}
    catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
}))

router.get('/login', (req,res) =>{
    res.render('users/login');
})
router.post('/login', passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}), (req,res) =>{
    req.flash('success', 'Welcome Back!');
    res.redirect('/campgrounds');   
})

router.get('/logout', (req,res) =>{
    req.logOut();
    req.flash('success', 'Goodbye');
    res.redirect('/campgrounds');
})
module.exports = router;