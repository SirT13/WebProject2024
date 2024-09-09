const db = require('../../utils/connect_db')
const jwt = require("jsonwebtoken")

exports.get_vehicle_load = async(req,res,next)=>{
    const userId = req.user.user_id
    const sql = "SELECT `load` FROM vehicles WHERE rescuer_id = ?"

    db.query(sql,[userId],(err,results)=>{

        if (err){
            return next(err)
        }
        res.status(200).send(JSON.stringify(results))
    })
}