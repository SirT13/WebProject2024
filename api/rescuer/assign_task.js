const db = require('../../utils/connect_db')
const jwt = require("jsonwebtoken")

exports.assign_task = async(req,res,next)=>{
    var taskId = req.body.task_id
    const auth_headers = req.header('Authorization');
    var token = auth_headers && auth_headers.split(' ')[1]
    const user = jwt.verify(token, process.env.SECRET_KEY);
    const userId = user.user_id
    const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = "UPDATE tasks SET rescuer_id = ?, status = 'in_progress', date_assigned = ? WHERE id = ?"

    db.query(sql,[userId,currentDateTime,taskId],(err,results)=>{

        if (err){
            return next(err)
        }

        res.status(200).send(JSON.stringify(results))
    })
    
}