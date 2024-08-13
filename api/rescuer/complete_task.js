const db = require('../../utils/connect_db')

exports.complete_task = async(req,res,next)=>{
    var type = req.body.type
    var task = req.body.task
    const task_sql = 'UPDATE tasks SET status = "complete" where id = ?'
    
    db.query(task_sql,task.id,(err)=>{
        if (err){
            return next(err)
        }
    })

    if(type == 'request'){
        var warehouse_sql = `UPDATE warehouse SET quantity = quantity - ${task.quantity} where id = ${task.item_id}`
    }
    else{
        var warehouse_sql = `UPDATE warehouse SET quantity = quantity + ${task.quantity} where id = ${task.item_id}`
    }
    
    db.query(warehouse_sql,(err)=>{
        if (err){
            return next(err)
        }
    })
    res.status(200).send("Task completed and warehouse updated!")
}