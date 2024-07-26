const express = require("express");
const app = express();
const router = require("./routes/route");
require("dotenv").config();

app.use(express.json());

app.use(router);

app.listen(process.env.PORT,()=>{
    console.log("Server started on port "+process.env.PORT);
})