const db = require('../../utils/connect_db')
const jwt = require("jsonwebtoken")

exports.get_rescuer_map_info = async(req,res,next)=>{
    const userId = req.user.user_id

    const sql = `SELECT t.id AS task_id,r.id as rescuer_id,i.id AS item_id,i.name AS item_name,t.quantity,t.type,t.status,t.date_submited,t.date_assigned,r.latitude AS rescuer_latitude, 
    r.longitude AS rescuer_longitude,c.latitude AS citizen_latitude, c.longitude AS citizen_longitude, 
    r.username AS rescuer,concat(c.first_name,' ', c.last_name) AS citizen,c.phone_number AS citizen_phone_number 
    FROM tasks t
    JOIN items i ON t.item_id = i.id 
    LEFT JOIN users u ON t.rescuer_id = u.id 
    LEFT JOIN users c ON t.citizen_id = c.id
    LEFT JOIN users r ON r.id = ?
    WHERE (u.id = ? AND status != 'complete') OR ( t.rescuer_id IS NULL AND status = 'not_assigned')`

    db.query(sql,[userId,userId],(err,results)=>{
        if (err){
            return next(err)
        }
        res.status(200).send(JSON.stringify(results))
    })
}