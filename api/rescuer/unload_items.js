const db = require('../../utils/connect_db')
const jwt = require("jsonwebtoken")

exports.unload_items = async(req,res,next)=>{

    const userId = req.user.user_id
    const sql1 = "SELECT `load` FROM vehicles WHERE rescuer_id = ?"
    const sql2 = "UPDATE vehicles SET `load` = '' WHERE rescuer_id = ?"
    let items = []
    db.query(sql1,[userId],(err,results)=>{

        if (err){
            return next(err)
        }
        if (results[0].load != '')
        {
            items = JSON.parse(results[0].load)
            db.query(sql2,[userId],(err,results)=>{

                if (err){
                    return next(err)
                }
                items.forEach(item => {
                    const sql3 = `UPDATE items SET quantity = quantity + ${item.load_quantity} WHERE id = ?`
                    db.query(sql3,[item.id],(err,results)=>{
        
                        if (err){
                            return next(err)
                        }
                    })
                });
            })
        }
    })




    res.status(200).send({message: "Load updated"})
}