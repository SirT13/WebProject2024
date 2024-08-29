const db = require('../../utils/connect_db')
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

exports.register_rescuer = async(req,res,next)=>{   
    var username=req.body.username
    var password=req.body.password
    console.log(req.body)
    console.log(password)
    password = await bcrypt.hash(password, 10);
    var values = [username,password,'rescuer'];
    var sql="INSERT INTO users (username, password, role) VALUES (?,?,?)";
    db.query(sql,values,function(err,record){
        
        if(err) {
            return next(err);
        };
        console.log("1 record inserted");
        
        res.status(200).send("Resister Successfull!!!");
    })
}