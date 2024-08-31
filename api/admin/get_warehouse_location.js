const db = require('../../utils/connect_db')

exports.get_warehouse_location = async(req,res,next)=>{   

    var sql="SELECT latitude,longitude FROM users WHERE role='admin'";
    db.query(sql,function(err,results){
        if(err) {
            return next(err);
        };
        res.status(200).send(JSON.stringify(results));
    })
}