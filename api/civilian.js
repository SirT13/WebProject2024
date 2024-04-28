const db = require('../services/connect_db')

exports.civilian = async(req,res,next)=>{
    db.query('SELECT * FROM warehouse',(err,results)=>{
        if (err){
            console.log("Something went wrong")
        }
        console.log(results)
        res.send(JSON.stringify(results))
    })
   

}