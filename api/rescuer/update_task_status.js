const db = require('../../utils/connect_db')

exports.update_task_status = async(req,res,next)=>{
    var type = req.body.task_type
    var taskId = req.body.task_id
    var status = req.body.status
    var quantity = req.body.quantity
    var itemId = req.body.item_id

    const task_sql = 'UPDATE tasks SET status = ? where id = ?'
    
    db.query(task_sql,[status,taskId],(err)=>{
        if (err){
            return next(err)
        }
    })
    if(status === 'complete')
    {
        if(type === 'request'){
            var warehouse_sql = `UPDATE items SET quantity = quantity - ${quantity} where id = ${itemId}`
        }
        else{
            var warehouse_sql = `UPDATE items SET quantity = quantity + ${quantity} where id = ${itemId}`
        }
        
        db.query(warehouse_sql,(err)=>{
            if (err){
                return next(err)
            }
        })
    }

    res.status(200).send("Task completed and warehouse updated!")
}