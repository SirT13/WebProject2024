const db = require('../../utils/connect_db')

exports.get_vehicles = async(req,res,next)=>{   

    var sql="SELECT * from vehicles";
    db.query(sql,function(err,results){
        if(err) {
            return next(err);
        };
        
        res.status(200).send(JSON.stringify(results));
    })
}