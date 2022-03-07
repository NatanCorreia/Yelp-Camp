const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./helpers/ExpressError');

const reviews = require('./routes/reviews');
const campgrounds = require('./routes/campgrounds');

const sessionConfig = {
    secret: 'loveupatricia',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000* 60 * 60 *24 *7,
        maxAge:1000* 60 * 60 *24 *7
    }
}


mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(session(sessionConfig));
app.use(flash());

app.use((req,res,next) =>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds/:id/reviews', reviews);
app.use('/campgrounds', campgrounds);

app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req,res,next) =>{
    next(new ExpressError('Not Found', 404));
})

app.use((err,req,res,next) =>{
    const {statusCode = 500} = err;
    if(!err.message) err.messa = 'Something went wrong';
    res.status(statusCode).render('error',{err});
   
})
app.listen(3000, () => {
    console.log('Serving on port 3000');
})