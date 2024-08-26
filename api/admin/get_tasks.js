const db = require('../../utils/connect_db')

exports.get_tasks = async(req,res,next)=>{   

    var sql="SELECT * from tasks where status in ('in_progress','not_assigned')";
    db.query(sql,function(err,results){
        if(err) {
            return next(err);
        };
        
        res.status(200).send(JSON.stringify(results));
    })
}