const {MongoClient} = require('mongodb');

const uri = require('./config/keys.js').MongoURI;


let SaveUser = (user)=>{
    return new Promise((resolve,reject)=>{
        MongoClient.connect(uri,{useNewUrlParser:true},(err,client)=>{
            if(err){
                reject('Error');
            }
        });
    });
}