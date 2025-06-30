import express from "express"

const app = express();

app.get("/*" , (req , res)=>{
    const host = req.hostname
    
})

app.listen(3001);