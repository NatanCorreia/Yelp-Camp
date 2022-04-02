const User = require('../models/user');

module.exports.renderRegisterForm = (req,res) => {
    res.render('users/register');
}

module.exports.registerUser = async(req,res,next) =>{
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
}

module.exports.renderLoginForm = (req,res) =>{
    res.render('users/login');
}
module.exports.login = (req,res) =>{
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo;
    res.redirect(redirectUrl);   
}
module.exports.logout = (req,res) =>{
    req.logOut();
    req.flash('success', 'Goodbye');
    res.redirect('/campgrounds');
}