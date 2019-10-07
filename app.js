const path = require('path');
const express = require('express');
const app = express();

//import error controller
const errorController = require('./controllers/errorController');

//setting EJS template engine
app.set('view engine', 'ejs');
app.set('views', 'views');

//import routes
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

app.use(errorController.get404);

// read from heroku env process
console.log('Port: ' + process.env.PORT);
app.listen(process.env.PORT || 3000);
