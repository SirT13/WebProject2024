const db = require('../../utils/connect_db')

exports.get_requests = async(req,res,next)=>{
    var sql = 'SELECT * FROM tasks WHERE type="request"';
    db.query(sql,(err,results)=>{
        if (err){
            throw err;
        }
        res.status(200).send(results)
    })
}