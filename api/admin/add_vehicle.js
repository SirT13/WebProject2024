const db = require('../../utils/connect_db')

exports.add_vehicle = async(req,res,next)=>{
    var rescuer_id = req.body.rescuer_id
    var username = req.body.username

    var sql="INSERT INTO vehicles (username,rescuer_id,load) VALUES (?,?,?)";
    db.query(sql,[username,rescuer_id,''],function(err,res2){
        
        if(err) {
            return next(err);
        };
        
        res.status(200).send(JSON.stringify(res2));
    })
}