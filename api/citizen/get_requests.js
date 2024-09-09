const db = require('../../utils/connect_db')

exports.get_requests = async(req,res,next)=>{
    console.log(req.user)
    var sql = `SELECT * FROM tasks t
        JOIN items i ON t.item_id = i.id
        WHERE t.type="request" AND t.citizen_id = ${req.user.user_id}`;
    db.query(sql,(err,results)=>{
        if (err){
            throw err;
        }
        res.status(200).send(results)
    })
}