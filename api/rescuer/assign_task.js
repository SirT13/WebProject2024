const db = require('../../utils/connect_db')

exports.assign_task = async(req,res,next)=>{
    var taskId = req.body.task_id
    const userId = req.user.user_id
    const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = "UPDATE tasks SET rescuer_id = ?, status = 'in_progress', date_assigned = ? WHERE id = ?"
    const sql2 = "UPDATE vehicles SET number_of_tasks = number_of_tasks + 1 WHERE rescuer_id = ?"
    const vehicle_sql = "SELECT number_of_tasks FROM vehicles WHERE rescuer_id = ?"
    db.query(vehicle_sql,[userId],(err,results)=>{
        let number_of_tasks = results[0].number_of_tasks
        if(err)
        {
            return next(err)
        }

        if(number_of_tasks >= 4)
        {
            return res.status(200).json({ message: "You have exceeded the task limit (4) and cannot take more." });
        }
        db.query(sql,[userId,currentDateTime,taskId],(err,results)=>{

            if (err){
                return next(err)
            }
            db.query(sql2,[userId],(err,results)=>{
                if (err){
                    return next(err)
                }
            })
            res.status(200).json({message: "Task Assigned Successfully"})
        })
    })

    
}