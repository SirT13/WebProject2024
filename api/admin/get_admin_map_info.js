const db = require('../../utils/connect_db')

exports.get_admin_map_info = async(req,res,next)=>{

    const sql = `SELECT t.id AS task_id,t.rescuer_id,i.id AS item_id,i.name AS item_name,t.quantity,t.type,t.status,t.date_submited,t.date_assigned,u.latitude AS rescuer_latitude, 
    u.longitude AS rescuer_longitude,c.latitude AS citizen_latitude, c.longitude AS citizen_longitude, 
    u.username AS rescuer,concat(c.first_name,' ', c.last_name) AS citizen,c.phone_number AS citizen_phone_number 
    FROM tasks t
    JOIN items i ON t.item_id = i.id 
    LEFT JOIN users u ON t.rescuer_id = u.id 
    LEFT JOIN users c ON t.citizen_id = c.id
    WHERE t.status != 'complete'`

    db.query(sql,(err,results)=>{

        if (err){
            return next(err)
        }
        res.status(200).send(JSON.stringify(results))
    })
}