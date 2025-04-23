const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    image: {
        type: String, // store image path as string
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    isNewArrival: {
        type: Boolean,
        default: false,
    },
    bgcolor: String,
    panelcolor: String,
    textcolor: String,
});

module.exports = mongoose.model("product", productSchema);
