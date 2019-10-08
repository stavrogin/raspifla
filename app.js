const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// include static resources in HTML (e.g.: js and css files)
app.use(express.static(path.join(__dirname, 'static')));

//import error controller
const errorController = require('./controllers/errorController');

//setting EJS template engine
app.set('view engine', 'ejs');
app.set('views', 'views');

//import routes
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

const meteoRoutes = require('./routes/meteo');
app.use('/meteo', meteoRoutes);

const chartRoutes = require('./routes/chart');
app.use('/chart', chartRoutes);

app.use(errorController.get404);

//Mongo DB
mongoose
    .connect('mongodb+srv://flavio:3fCDs5SLU0vXAxsk@cluster0-o9gnp.mongodb.net/raspifla?retryWrites=true&w=majority')
    .then(result => {
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => {
        console.log(err);
    });




