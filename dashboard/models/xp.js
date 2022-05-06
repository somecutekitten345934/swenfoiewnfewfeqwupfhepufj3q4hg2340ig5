const mongoose = require('mongoose')
balSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userBal: String,
    bal: Number
});
module.exports = mongoose.model("Bal",balSchema)