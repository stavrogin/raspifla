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

//graphql
const graphqlHttp = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || 'An error occurred.';
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    }
  })
);

app.use(errorController.get404);

//Mongo DB
const config = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

mongoose
    .connect('mongodb+srv://flavio:3fCDs5SLU0vXAxsk@cluster0-o9gnp.mongodb.net/raspifla?retryWrites=true&w=majority', config)
    .then(result => {
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => {
        console.log(err);
    });




