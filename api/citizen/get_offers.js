const db = require('../../utils/connect_db')

exports.get_offers = async(req,res,next)=>{
    var sql = `SELECT * FROM tasks WHERE type="offer" AND citizen_id = ${req.user.user_id}`;
    db.query(sql,(err,results)=>{
        if (err){
            throw err;
        }
        res.status(200).send(results)
    })
}