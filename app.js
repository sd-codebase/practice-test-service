import express from 'express';
import bodyParser from 'body-parser';
import { enableRoutes } from './src/routes';
import mongoose from 'mongoose';
import { MONGO_URI, ENV } from './config';
import { handleAuth } from './src/utils/auth';

// initialize our express app
const app = express();

const environment = process.env.ENV || ENV;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});


mongoose.connect(process.env.MONGO_URI || MONGO_URI);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

handleAuth(app);

enableRoutes(app);

let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});