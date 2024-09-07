const db = require('../../utils/connect_db')

exports.create_task = async(req,res,next)=>{
    var type = req.body.type
    var citizen_id = req.body.citizen_id
    var items = req.body.items
    const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var sql = 'INSERT INTO tasks (citizen_id,item_id,quantity,status,type,date_sumbited) VALUES (?,?,?,?,?,?)'
    items.forEach(item => {
        const values = [citizen_id,item.item_id,item.quantity,'not_assigned',type,currentDateTime]
        db.query(sql,values,(err)=>{
            if (err){
                throw next(err)
            }
        })
    })
    res.status(200).send("Tasks created successfully!")
}