const db = require('../../utils/connect_db')
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

exports.register_admin = async(req,res,next)=>{   
    var username=req.body.username
    var password=req.body.password

    password = await bcrypt.hash(password, 10);
    var values = [1,username,password,'admin'];
    var sql="INSERT INTO users (id,username, password, role) VALUES (?,?,?,?)";
    db.query(sql,values,function(err,record){
        
        if(err) {
            return next(err);
        };
        console.log("1 record inserted");
        
        res.send("Resister Successfull!!!");
    })
}