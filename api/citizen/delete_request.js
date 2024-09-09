const db = require('../../utils/connect_db')

exports.delete_request = async(req,res,next)=>{
    var sql = `DELETE FROM tasks WHERE type="request" AND id=${req.params.id}`;
    db.query(sql,(err,results)=>{
        if (err){
            throw err;
        }
        res.status(204).send(results)
    })
}