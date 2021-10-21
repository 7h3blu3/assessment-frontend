// const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
// const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
// const flash = require('connect-flash');

// const errorController = require('./controllers/error');
// const User = require('./models/user');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/Mean-Assessment'

const app = express()
// const store = new MongoDBStore({
//   uri: MONGODB_URI,
//   collection: 'sessions'
// })

const csrfProtection = csrf();

// app.set('view engine', 'ejs');
// app.set('views', 'views');

// const adminRoutes = require("./routes/admin");
// const authRoutes = require("./routes/auth");
// const userRoutes = require("./routes/user")

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(
//   session({
//     secret: 'my secret',
//     resave: false,
//     saveUninitialized: false,
//     store: store
//   })
// );
// app.use(csrfProtection);
// app.use(flash());

// app.use((req, res, next) => {
//   if (!req.session.user) {
//     return next();
//   }
//   User.findById(req.session.user._id)
//     .then(user => {
//       req.user = user;
//       next();
//     })
//     .catch(err => console.log(err));
// });


// app.use((req, res, next) => {
//   res.locals.isAuthenticated = req.session.isLoggedIn
//   res.locals.csrfToken = req.csrfToken()
//   if (req.session.isLoggedIn)
//   res.locals.isRole = req.user.userType
//   next();
// });

// app.use('/admin', adminRoutes);
// app.use(userRoutes)
// app.use(authRoutes)

// app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(result => {
    console.log("Connected to database!");
    // app.listen(3000);
  })
  .catch(err => {
    console.log(err + " Connection to database failed!");
  });
