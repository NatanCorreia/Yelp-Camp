const express = require('express');
const router = express.Router({mergeParams: true});
const passport = require('passport');
const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/ExpressError');
const User = require('../models/user');
const userController = require('../controllers/users');

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

router.route('/register')
.get(userController.renderRegisterForm)
.post(catchAsync( userController.registerUser))

router.route('/login')
.get(userController.renderLoginForm)
.post(passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}), userController.login)

router.get('/logout', userController.logout)
module.exports = router;