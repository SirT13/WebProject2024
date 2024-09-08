const db = require('../../utils/connect_db')
const jwt = require("jsonwebtoken")

exports.load_items = async(req,res,next)=>{
    var items = JSON.stringify(req.body.items);
    const auth_headers = req.header('Authorization');
    var token = auth_headers && auth_headers.split(' ')[1]
    const user = jwt.verify(token, process.env.SECRET_KEY);
    const userId = user.user_id
    const sql = "UPDATE vehicles SET load = ? WHERE rescuer_id = ?"

    db.query(sql,[items,userId],(err,results)=>{

        if (err){
            return next(err)
        }

        res.status(200).send(JSON.stringify(results))
    })
}