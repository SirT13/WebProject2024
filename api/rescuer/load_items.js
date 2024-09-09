const db = require('../../utils/connect_db')
const jwt = require("jsonwebtoken")

exports.load_items = async(req,res,next)=>{
    var items = req.body.items;
    const userId = req.user.user_id
    const sql1 = "UPDATE vehicles SET `load` = ? WHERE rescuer_id = ?"
    db.query(sql1,[JSON.stringify(items),userId],(err,results)=>{

        if (err){
            return next(err)
        }
        items.forEach(item => {
            const sql2 = `UPDATE items SET quantity = quantity - ${item.load_quantity} WHERE id = ?`
            db.query(sql2,[item.id],(err,results)=>{

                if (err){
                    return next(err)
                }
            })
        });
    })
    res.status(200).send({message: "Load updated"})
}