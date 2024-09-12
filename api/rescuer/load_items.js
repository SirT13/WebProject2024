const db = require('../../utils/connect_db')
const jwt = require("jsonwebtoken")

exports.load_items = async(req,res,next)=>{
    var items = req.body.items;
    const userId = req.user.user_id
    const sql2 = "SELECT `load` from vehicles WHERE rescuer_id = ?"
    const sql1 = "UPDATE vehicles SET `load` = ? WHERE rescuer_id = ?"
    var existingLoad = []
    db.query(sql2,[userId],(err,results) =>{

        if(results[0].load != '')
        {
            existingLoad = JSON.parse(results[0].load)
        }
        
        if(existingLoad.length > 0)
        {
            items.forEach(item =>{
                const existingItemIndex = existingLoad.findIndex(l => l.id === item.id);

                if (existingItemIndex > -1) {
                    existingLoad[existingItemIndex].load_quantity += item.load_quantity;
                } else {
                    existingLoad.push({
                        id: item.id,
                        item: item.item,
                        load_quantity: item.load_quantity
                    });
                }
            })
            existingLoad = JSON.stringify(existingLoad)
        }
        else
        {
            existingLoad = JSON.stringify(items)
        }

        db.query(sql1,[existingLoad,userId],(err,results)=>{
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
    })
    
    res.status(200).send({message: "Load updated"})
}