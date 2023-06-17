import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import fs from 'fs';
import crypto from 'crypto';
import * as  dotenv from 'dotenv';
import { error } from 'console';

dotenv.config();

const app = express();
const port = 3000;
const API_KEY = process.env.API_KEY;
const URL = 'https://api.openai.com/v1/images/generations'

app.use(cors());
app.use(express.json());
app.use(express.static("public"));


app.get("/test",  (req, res)=>{
    res.send("Hola mundo")
});

app.post('/generate-image', async (req, res)=> {
    const prompt = req.body.prompt;
    const headers = {
        'Content-type': 'application/json',
        Authorization : `Bearer ${API_KEY}`,
   };
   try{
      if(!!! prompt){
        throw Error('prompt not found');
    }
    const response = await fetch(URL,{
        method: 'POST',
        headers: headers,
        body: JSON.stringify({prompt, size:'256x256'}),
    });
    const data = await response.json();
    console.log(data);

   const imgURL = data.data[0].url;
   console.log(imgURL);
   const imageResponse = await fetch(imgURL);
   const imgBuffer = await imageResponse.arrayBuffer();
   const buffer = Buffer.from(imgBuffer);

   const id = crypto.randomBytes(20).toString('hex');
   const fileName = `${id}.jpg`;
   const pathName = 'public/images/';

   fs.writeFileSync(`${pathName}${fileName}`,buffer);
   console.log("imagen guardada de forma local");

   res.setHeader("Content-Type", "application/json");
   res.json({fileName})

   
   }catch(error){
    console.log('error image generated', error.message);
    res.sendStatus(500);
   }


})

app.listen(port, ()=>{
    console.log("El servidor esta iniciando...")
})
