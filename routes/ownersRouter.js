const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ownerModel = require('../models/ownerModel');
const productModel = require('../models/productModel');
const verifyAdmin = require('../middlewares/auth');

const secret = "jsknkjsvnkjsnjnsn"; 

//  Create owner only in development
if (process.env.NODE_ENV === "development") {
    router.post('/create', async (req, res) => {
        let owners = await ownerModel.find();
        if (owners.length > 0) {
            return res.status(501).send("You don't have permission to create an owner.");
        }

        let { fullname, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        let createdOwner = await ownerModel.create({
            fullname,
            email,
            password: hashedPassword,
        });

        res.status(201).send(createdOwner);
    });
}

//  Admin Login Route
router.post('/owner-login', async (req, res) => {
    const { email, password } = req.body;

    const owner = await ownerModel.findOne({ email });
    if (!owner) {
        return res.status(404).json({ message: "Admin not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, owner.password);
    if (!isPasswordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: owner._id, role: "admin" }, secret, { expiresIn: "1d" });
    res.status(200).json({ message: "Login successful", token });
});

//  Admin Pages
router.get('/admin',verifyAdmin , (req, res) => {
    let success = req.flash("success");
    res.render("createProducts", { success });
});

router.get('/admin/products',verifyAdmin, async (req, res) => {
    const products = await productModel.find();
    const success = req.flash("success");
    res.render('allProducts', { products, success });
});

router.get('/admin/delete/:id', async (req, res) => {
    await productModel.findByIdAndDelete(req.params.id);
    req.flash("success", "Product deleted successfully");
    res.redirect('/owners/admin/products');
});

router.get('/admin/delete-all', async (req, res) => {
    await productModel.deleteMany();
    req.flash("success", "All products deleted successfully");
    res.redirect('/owners/admin/products');
});

//  Final single export
module.exports = router;
