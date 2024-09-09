const db = require('../../utils/connect_db')

exports.get_offers = async(req,res,next)=>{
    var sql = `SELECT * FROM tasks t
    JOIN items i ON t.item_id = i.id           
    WHERE t.type="offer" AND t.citizen_id = ${req.user.user_id}`;
    db.query(sql,(err,results)=>{
        if (err){
            throw err;
        }
        res.status(200).send(results)
    })
}