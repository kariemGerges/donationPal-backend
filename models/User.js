const mongoose =require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

// create a user schema
const UserSchema = new Schema({
    
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    nat: {
        type : String,
        required: true
    }
});

// Create a pre hook that will run auto with this router
UserSchema.pre('save', async function (next) {
    const user = this;
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

// decrybet so the web can read it
UserSchema.methods.isValidPassword = async function (encryptePassword) {
    const user = this;
    const compare = await bcrypt.compare(encryptePassword, user.password);
    return compare;
}

mongoose.model('users', UserSchema)