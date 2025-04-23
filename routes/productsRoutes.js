const express = require('express');
const router = express.Router();
const upload = require('../config/multer-config');
const productModel = require('../models/productModel');

// router.post('/create', upload.single("image"), async (req, res) => {
//     try {
//         let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

//         let product = await productModel.create({
//             image: req.file.buffer,
//             name,
//             price: Number(price),
//             discount: Number(discount),
//             bgcolor,
//             panelcolor,
//             textcolor,
//         });
//         req.flash("success", "Product created successfully.");
//         res.redirect("/owners/admin");
//     } catch (err) {
//         res.send(err.message);t
//     }
// });

router.post('/create', upload.single("image"), async (req, res) => {
    try {
        const { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

        const imagePath = req.file ? "/uploads/" + req.file.filename : "";

        const product = await productModel.create({
            image: imagePath, // save path, not buffer
            name,
            price: Number(price),
            discount: Number(discount),
            bgcolor,
            panelcolor,
            textcolor,
        });

        req.flash("success", "Product created successfully.");
        res.redirect("/owners/admin");
    } catch (err) {
        res.send(err.message);
    }
});


module.exports = router; 