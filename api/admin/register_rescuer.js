const db = require('../../utils/connect_db')
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

exports.register_rescuer = async(req,res,next)=>{   
    var username=req.body.username
    var password=req.body.password
    
    password = await bcrypt.hash(password, 10);

    var values = [username,password,'rescuer',37.9838,23.7275];
    var sql="INSERT INTO users (username, password, role,latitude,longitude) VALUES (?,?,?,?,?)";
    
    db.query(sql,values,function(err,record){
        
        if(err) {
            return next(err);
        };
        console.log("1 record inserted");
        
        res.status(200).send("Resister Successfull!!!");
    })
}