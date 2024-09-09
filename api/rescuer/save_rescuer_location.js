const db = require('../../utils/connect_db')
const jwt = require("jsonwebtoken")

exports.save_rescuer_location = async(req,res,next)=>{   
    var latitude=req.body.latitude
    var longitude=req.body.longitude
    const userId = req.user.user_id
    
    var sql="UPDATE users SET latitude = ?, longitude = ? WHERE id = ?";

    db.query(sql,[latitude,longitude,userId],function(err,record){

        if(err) {
            return next(err);
        };
        
        res.status(200).send("Rescuer location updated!");
    })
}