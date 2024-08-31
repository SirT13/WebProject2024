const db = require('../../utils/connect_db')

exports.save_warehouse_location = async(req,res,next)=>{   
    var latitude=req.body.latitude
    var longitude=req.body.longitude
    var sql="UPDATE users SET latitude = ?, longitude = ? WHERE role = 'admin'";
    db.query(sql,[latitude,longitude],function(err,record){
        
        if(err) {
            return next(err);
        };
        
        res.status(200).send("Warehouse location updated!");
    })
}