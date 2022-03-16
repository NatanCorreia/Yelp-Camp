const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email : {type: String,
    required: [true, 'Username cannot be blank'],
    unique: true}
   
})
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema );



//< Older way to create a schema with mongooose, without passport >>>>> 

// userSchema.statics.findAndValidate = async function (username, password){
//     const user = await this.findOne({username});
//     const isValid = await bcrypt.compare(password,user.password);
//     return isValid ? user: false;
// }


    // A mongoose midleware that runs before the user is saved in db, so i can hash the passwoord with bcrypt
// userSchema.pre('save', async function(next){
// if(!this.isModified('password')){
//     return next();
// }
// this.password = await bcrypt.hash(this.password, 12)
// next();
// })
