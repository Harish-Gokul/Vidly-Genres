const express = require("express");
const geners = require("./rotues/geners")
const app = express(); 
const lowerCaseConverter = require("./middleware/nameLowerCase")

app.use(express.json())
app.use(lowerCaseConverter)

app.use("/api/geners",geners);

app.get("/",(req,res)=>{
    res.send("Connection success")
})

const port =  process.env.PORT||3000;
app.listen(port , ()=>{
    console.log("App Working fine in port "+port)
})
