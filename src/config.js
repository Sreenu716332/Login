const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/Login");

connect.then(()=>{
    console.log("Database connected Successfully");
})
.catch(()=>{
    console.log("Database cannot be connected");
})

const LoginSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const collection=new mongoose.model("User", LoginSchema);
module.exports = collection;

