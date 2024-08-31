const db = require('../../utils/connect_db')

exports.assign_task = async(req,res,next)=>{
    var taskId = req.body.task_id
    var rescuerId = req.body.rescuer_id
    const sql = "UPDATE tasks SET rescuer_id = ?, status = 'in_progress' WHERE id = ?"

    db.query(sql,[rescuerId,taskId],(err,results)=>{

        if (err){
            return next(err)
        }

        res.status(200).send(JSON.stringify(results))
    })
    
}