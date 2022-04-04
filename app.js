if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const app = express();
const path = require('path');
const multer  = require('multer')
const helmet = require('helmet')
const upload = multer({ dest: 'uploads/' })
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const ExpressError = require('./helpers/ExpressError');

const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');
const campgroundRoutes = require('./routes/campgrounds');


const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
const secret = process.env.SECRET ||'loveupatricia' ;
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
    crypto:{
        secret,
    }
});
store.on("error", function(e){
    console.log("session store error", e)
})
const sessionConfig = {
    store,
    name:'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000* 60 * 60 *24 *7,
        maxAge:1000* 60 * 60 *24 *7
    }
}



mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

// app.use(helmet());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://res.cloudinary.com/dysjklkza/",
    "https://code.jquery.com/",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://res.cloudinary.com/dysjklkza/",
    "https://cdnjs.cloudflare.com/ajax/libs/prism/1.16.0/themes/prism.min.css",
    
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
    `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
];
const fontSrcUrls = [];


app.use( 
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`, //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
            mediaSrc   : [ `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/` ],
            childSrc   : [ "blob:" ]
        },
       
    })
);


app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(mongoSanitize());
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) =>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/', userRoutes);

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
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`'Serving on port ${port}`);
})