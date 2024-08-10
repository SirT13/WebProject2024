const db = require('../services/connect_db')

exports.get_citizens = async(req,res,next)=>{
    values = ['citizen']
    var sql = 'SELECT * FROM users WHERE role = ?'
    db.query(sql,values,(err,results)=>{
        if (err){
            console.log("Something went wrong")
        }
        console.log(results)
        res.send(JSON.stringify(results))
    })
}