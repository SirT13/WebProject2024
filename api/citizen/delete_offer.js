const db = require('../../utils/connect_db')

exports.delete_offer = async(req,res,next)=>{
    var sql = `DELETE FROM tasks WHERE type="offer" AND id=${req.params.id}`;
    db.query(sql,(err,results)=>{
        if (err){
            throw err;
        }
        res.status(204).send(results)
    })
}