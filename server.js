const express = require('express');
const dotenv = require('dotenv');
const cookieParser=require('cookie-parser');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config({path:'./config/config.env'});

connectDB();

const cars = require('./routes/cars');
const bookings = require('./routes/bookings');
const auth = require('./routes/auth');


const app=express();

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials : true,
};
app.use(cors(corsOptions));

// add body parser
app.use(express.json());

//cookie parser
app.use(cookieParser());

app.use('/api/v1/cars',cars);
app.use('/api/v1/auth',auth);
app.use('/api/v1/bookings',bookings);


const PORT=process.env.PORT || 5000;
const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' on ',process.env.HOST,' : ', PORT));

process.on ("unhandledRejection", (err,promise) =>{
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});