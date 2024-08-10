const db = require('../services/connect_db')
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

exports.register_citizen = async(req,res,next)=>{   
    var username=req.body.username
    var password=req.body.password
    var reppass=req.body.reppass
    var first_name = req.body.first_name
    var last_name = req.body.last_name
    var phone_number = req.body.phone_number
    var longtitude = req.body.longtitude
    var latitude = req.body.latitude

    if(password == reppass) {
        console.log("mikeee")
        password = await bcrypt.hash(password, 10);
        var values = [username,password,'citizen',first_name,last_name,phone_number,longtitude,latitude];
        var sql="INSERT INTO users (username, password, role, first_name, last_name, phone_number,longtitude,latitude) VALUES (?,?,?,?,?,?,?,?)";
        db.query(sql,values,function(err,record){
            
            if(err) {
                return next(err);
            };
            console.log("1 record inserted");
            
            res.send("Resister Successfull!!!");
        })
    
    }
    else
        res.send("Password does not match the requirements")
}