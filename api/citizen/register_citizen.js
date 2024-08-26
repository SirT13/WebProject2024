const db = require('../../utils/connect_db')
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

exports.register_citizen = async(req,res,next)=>{   
    var username=req.body.username
    var password=req.body.password
    var reppass=req.body.reppass
    var first_name = req.body.first_name
    var last_name = req.body.last_name
    var phone_number = req.body.phone_number
    var longitude = req.body.longitude
    var latitude = req.body.latitude

    if(password == reppass) {
        password = await bcrypt.hash(password, 10);
        var values = [username,password,'citizen',first_name,last_name,phone_number,longitude,latitude];
        var sql="INSERT INTO users (username, password, role, first_name, last_name, phone_number,longitude,latitude) VALUES (?,?,?,?,?,?,?,?)";
        db.query(sql,values,function(err,record){
            
            if(err) {
                return next(err);
            };
            console.log("1 record inserted");
            
            res.status(200).send("Resister Successfull!!!");
        })
    
    }
    else
        res.send("Password does not match the requirements")
}