
require("dotenv").config(); //server.js loads it at the very beginning.
const express = require("express");
const cors = require("cors")
const db = require('./db')  //the .env variables are available for db.js
const authRoutes = require('./routes/auth')
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);


app.listen(process.env.PORT,() => {
    console.log("connected to the port",process.env.PORT)
})