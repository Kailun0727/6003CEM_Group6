const mongoose = require('mongoose');

const db = "mongodb+srv://kailun:kailun@webapi.ynqnsvg.mongodb.net/6003CEM?retryWrites=true&w=majority";

mongoose.connect(db).then (()=>{
    console.log("Connected to database");

})

.catch(()=>{
    console.log("Can't connect to database");

})

const weatherSchema = new mongoose.Schema({
    Longitude :{type: String},
    Latitude : {type: String},
    City : {type: String},
    Temp : {type: String},
    Weather : {type: String},
    Restaurant : {type: String},
});





const connect = mongoose.model('weatherLocation',weatherSchema);


module.exports = connect;