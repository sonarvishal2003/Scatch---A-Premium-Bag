require('dotenv').config();

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const expressSession = require('express-session');
const flash = require('connect-flash');
const port = process.env.PORT || 10000;
const mongoose = require('./config/mongooseConnection');

const ownersRouter = require('./routes/ownersRouter');
const usersRouter = require('./routes/usersRoutes');
const productsRouter = require('./routes/productsRoutes');
const indexRouter = require('./routes/index');



app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(expressSession({
    secret: process.env.JWT_KEY,
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use("/", indexRouter);
app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});