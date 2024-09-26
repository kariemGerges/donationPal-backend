const mongoose =require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

// create a user schema
const UserSchema = new Schema({

    gender: {
        type : String,
        trim : true
    },
    name: {
        title: {
            type : String,
            trim : true
        },
        first : {
            type : String,
            // required : true,
            trim : true
        },
        last : {
            type : String,
            // required : true,
            trim : true
        }
    },
    location: {
        street : {
            number : {
                type : Number,
                trim : true
            },
            name : {
                type : String,
                trim : true
            }
        },
        city : {
            type : String,
            trim : true
        },
        state : {
            type : String,
            trim : true
        },
        country : {
            type : String,
            trim : true
        },
        postcode : {
            type : Number,
            trim : true
        },
        coordinates : {
            latitude : {
                type : String,
                trim : true
            },
            longitude : {
                type : String,
                trim : true
            }
        },
        timezone : {
            offset : {
                type : String,
                trim : true
            },
            description : {
                type : String,
                trim : true
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    dob: {
        date : {
            type : Date
        },
        age : {
            type : Number
        }
    },
    phone: {
        type : String,
        trim : true
    },
    picture: {
        large : {
            type : String
        },
        medium : {
            type : String
        },
        thumbnail : {
            type : String
        }
    },
    nat: {
        type : String,
        trim : true
    },
    password: {
        type : String,
        required : true
    }
});

// Create a pre hook that will run auto with this router
UserSchema.pre('save', async function (next) {

    if (this.isModified('password')) {
        try {
            const saltRounds = 10;
            const hash = await bcrypt.hash(this.password, saltRounds);
            this.password = hash;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }

});

// decrypt so the web can read it and check it
UserSchema.methods.isValidPassword = async function (encryptPassword) {
    try {
        return await bcrypt.compare(encryptPassword, this.password);
    } catch (error) {
        throw error;
    }
}

mongoose.model('users', UserSchema)