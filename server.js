require('dotenv').config(); // for loading enviroment variables

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const usersRoute = require('./routes/api/users');
const postsRoute = require('./routes/api/posts');

const PORT = process.env.PORT || 5000;
const app = express();

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
require('./middleware/passport')(passport);

// db configuration
const MONGO_URL = process.env.MONGO_URL;
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connected !!!'))
  .catch(err => console.log(err));

mongoose.set('useFindAndModify', false);

app.use('/api/users', usersRoute);
app.use('/api/posts', postsRoute);

app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
});
