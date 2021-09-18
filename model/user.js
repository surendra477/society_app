const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, default: null },
    room_number: { type: String, default: null },
    building_number: { type: String, default: null },
    password: { type: String },
    email:{ type: String,unique:true,
          trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']},
    token: { type: String },
});

module.exports = mongoose.model("user", userSchema);
