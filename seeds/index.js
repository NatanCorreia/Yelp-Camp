const mongoose = require('mongoose');
const Campground = require('../models/campground');
const{descriptors,places} = require('./seedHelper');
const cities = require('./cities');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open", () => {
    console.log("Database connected");
})
const sample = array => array[Math.floor(Math.random() *array.length)];

const seedDB = async () =>{
    await Campground.deleteMany({});
    for(let i= 0; i<200; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20) +10;
        const camp = new Campground({
            author: '622940db6d3c8856ddbd50db',
            title: `${sample(descriptors)}  ${sample(places)}`,
            location:`${cities[random1000].city} ${cities[random1000].state}`,
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Alias perferendis vero iure, delectus aperiam nisi quam. Quis id iure amet sequi, fuga sapiente. Explicabo placeat eveniet praesentium? Optio, voluptates maxime!',
            price,
            geometry:{ "type" : "Point", "coordinates" : [cities[random1000].longitude,cities[random1000].latitude]},
            images:[
                {
                  url: 'https://res.cloudinary.com/dysjklkza/image/upload/v1647867008/scott-goodwill-y8Ngwq34_Ak-unsplash_mbpauo.jpg',
                  filename: 'scott-goodwill-y8Ngwq34_Ak-unsplash_mbpauo',
                  
                },
                {
                  url: 'https://res.cloudinary.com/dysjklkza/image/upload/v1647867008/ben-duchac-3fJOXw1RbPo-unsplash_lomixb.jpg',
                  filename: 'ben-duchac-3fJOXw1RbPo-unsplash_lomixb',
                  
                }
              ],
            
        })
        await camp.save()
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})