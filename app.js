const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

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


app.use(errorController.get404);

// read from heroku env process
console.log('Port: ' + process.env.PORT);
app.listen(process.env.PORT || 3000);
