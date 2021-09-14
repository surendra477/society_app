const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, default: null },
    room_number: { type: String, default: null },
    build_number: { type: String, default: null },
    password: { type: String },
    email:{ type: String,unique:true},
    token: { type: String },
});

module.exports = mongoose.model("user", userSchema);
