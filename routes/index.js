const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const productModel = require('../models/productModel');
const userModel = require('../models/userModel');
const ownerModel = require('../models/ownerModel');
const router = express.Router();
const verifyAdmin = require('../middlewares/auth');

router.get('/admin', verifyAdmin, (req, res) => {
    res.render("createProducts", { success: req.flash("success") });
});


router.get('/', (req, res) => {
    let error = req.flash("error");
    res.render('index', { error, loggedIn: false });
});


router.get('/shop', isLoggedIn, async (req, res) => {
    const { category } = req.query;
    let products;

    if (category === 'new') {
        products = await productModel.find({ isNewArrival: true });
    } else if (category === 'discounted') {
        products = await productModel.find({ discount: { $gt: 0 } });
    } else {
        products = await productModel.find(); // All products
    }

    let success = req.flash("success");
    res.render('shop', { products, success });
});

router.get('/cart', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate('cart');
    // const bill = (Number(user.cart[0].price) + 20) - (Number(user.cart[0].discount));
    // res.render('cart', { user, bill });
    let grandTotal = 0;

user.cart.forEach(item => {
    const price = Number(item.price) || 0;
    const discount = Number(item.discount) || 0;
    const itemTotal = price - discount + 20;
    item.itemTotal = itemTotal; // add to item object
    grandTotal += itemTotal;
});
    let success = req.flash("success");
    res.render('cart', { user, bill: grandTotal, success });
});

router.get('/addtocart/:productid', isLoggedIn, async (req, res) => {
    try {
        if (!req.user || !req.user.email) {
            req.flash("error", "User not authenticated");
            return res.redirect('/');
        }

        let user = await userModel.findOne({ email: req.user.email });

        if (!user) {
            req.flash("error", "User not found in database");
            return res.redirect('/');
        }

        user.cart.push(req.params.productid);
        await user.save();

        req.flash("success", "Product added to cart");
        res.redirect('/shop');

    } catch (err) {
        console.error("Error in /addtocart route:", err);
        req.flash("error", "Something went wrong while adding to cart");
        res.redirect('/shop');
    }
});



router.get('/removefromcart/:productid', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart = user.cart.filter(id => id.toString() !== req.params.productid);
    await user.save();
    req.flash("success", "Product removed from cart");
    res.redirect('/cart');
});

router.get('/logout', isLoggedIn, (req, res) => {
    res.render('shop');
});

module.exports = router;