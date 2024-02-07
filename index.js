const express= require("express");
const patientspath=require("./routes/patients");
const LogUserPath =require("./routes/LogUser");
const UsersPath =require("./routes/updateUser");
const passwordpath =require("./routes/password");
const upload=require("./routes/upload");
const logger= require("./middlewares/logger");
const { notFound,errorHandler } = require("./middlewares/error");
require("dotenv").config();
const path= require('path');
const helmet =require("helmet");
const cors = require("cors");
const connectToDB =require("./config/db")

//connection ToDB
connectToDB();

//init app
const app = express();

//static folder
app.use(express.static(path.join(__dirname,"images")));

//apply middleware 
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(logger);

//Helmet
app.use(helmet());

//cors policy 
app.use (cors());

//set view engine 
app.set('view engine' , 'ejs');

//Routes
app.use("/api/patients",patientspath);
app.use("/api/auth",LogUserPath);
app.use("/api/users",UsersPath);
app.use("/password",passwordpath);
app.use('/api/upload',upload);

//error hanlder middleware
app.use(notFound );
app.use(errorHandler);







//running server
const PORT = process.env.PORT||5000;
app.listen(PORT,() => console.log(`server is running in ${process.env.NODE_ENV} on port ${PORT}`));
