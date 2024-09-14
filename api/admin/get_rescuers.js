const db = require('../../utils/connect_db')

exports.get_rescuers = async(req,res,next)=>{   

    var sql="SELECT * from users WHERE role = 'rescuer'";
    db.query(sql,function(err,results){
        if(err) {
            return next(err);
        };
        
        res.status(200).send(JSON.stringify(results));
    })
}