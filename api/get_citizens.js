const db = require('../utils/connect_db')

exports.get_citizens = async(req,res,next)=>{
    values = ['citizen']
    var sql = 'SELECT * FROM users WHERE role = ?'
    db.query(sql,values,(err,results)=>{
        if (err){
            return next(err)
        }
        console.log(results)
        res.status(200).send(JSON.stringify(results))
    })
}