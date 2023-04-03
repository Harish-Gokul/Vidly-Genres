const express = require("express")
const { object } = require("joi")
const routes = express.Router()
const Joi = require("joi")
const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/VidlyDB")
.then( ()=> console.log("Connected Succesfully"))

const genreSchema = mongoose.Schema({
    name: {
        type:String,
        minlength: 3,
        required:true,
        lowercase : true
    }
})

const GenresCollections = mongoose.model("GenresCollection",genreSchema);

 

const schema = Joi.object({
    name: Joi.string().min(3).required()
})


routes.get("/", async (req,res)=>{
    let geners = await GenresCollections.find().sort("name");
    res.send(geners)
})

routes.get("/:id", async (req,res)=>{

    try{
        let genre = await GenresCollections.find({_id : req.params.id});
        res.send(genre);
        return;
    }
    catch (err){
        res.status(400).send(err);
        return;
    }
})

routes.post("/", async (req,res)=>{
    let validationStatus = schema.validate(req.body);

    if(validationStatus.error)return res.status(400).send({errorMsg:validationStatus.error.details[0].message});
 
     let queryResult = await GenresCollections.find({"name": req.body.name})
     if(queryResult.length >0)
      
     return res.status(400).send({msg:"Name Already Exits"})
     
     let newGenre = await createGenre(req.body.name)
     newGenre.save()
     res.send(newGenre)
})

async function createGenre(name){
    const genre = new GenresCollections({
        name :name
    })
    return genre;
}

routes.put("/:id",async (req,res)=>{
    let validationStatus = schema.validate(req.body);
    if(validationStatus.error)
    return res.status(400).send({errorMsg:validationStatus.error.details[0].message});
    
    let isNameAlreadyExist = await GenresCollections.find({name : req.body.name})
    if(isNameAlreadyExist.length >0) return res.status(400).send({errorMsg:"Name Already Present"})
    
     
     let genre = await GenresCollections.findByIdAndUpdate(req.params.id, {name: req.body.name},{ new:true})
     if(!genre)
     res.status(404).send({msg:"Genre with the given id is not Found"})
     res.send(genre)
})

routes.delete("/:id", async(req,res)=>{

    const genre = await GenresCollections.findByIdAndDelete(req.params.id);
    if(!genre){
        res.status(404).send({msg:"could not Find"})
        return
    }
    
 
    res.send({Status:"Deleted Sucessfully"});
})


function isPropertyAndValuePresent(property,value,array){
    for(let object of array){
        if(object[property].toLowerCase() == value.toLowerCase()){
            return true;
        } 
    }
    return false;
} 

module.exports = routes;