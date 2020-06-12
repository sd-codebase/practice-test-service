import express from 'express';
import bodyParser from 'body-parser';
import { enableRoutes } from './src/routes';
import mongoose from 'mongoose';

// initialize our express app
const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
  });

// Set up mongoose connection
let dev_db_url = 'mongodb://127.0.0.1:27017/quiz';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

enableRoutes(app);

let port = 3000;

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});