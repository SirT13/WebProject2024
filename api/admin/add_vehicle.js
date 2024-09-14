const db = require('../../utils/connect_db')

exports.add_vehicle = async(req,res,next)=>{
    var rescuer_id = req.body.rescuer_id
    var sql1="SELECT username FROM users WHERE id = ?";
    var sql2="INSERT INTO vehicles (username,rescuer_id,load) VALUES (?,?,?)";
    db.query(sql1,[rescuer_id],function(err,res1){
        if(err) {
            return next(err);
        };

        let username = res1[0].username
        db.query(sql2,[username,rescuer_id,''],function(err,res2){
            
            if(err) {
                return next(err);
            };
            
            res.status(200).send(JSON.stringify(res2));
        })
    })   

}