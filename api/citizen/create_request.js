const db = require('../../utils/connect_db')

exports.create_request = async(req,res,next)=>{
    var citizen_id = req.user.user_id
    var item_id = req.body.item_id
    var number_of_people = req.body.number_of_people
    var quantity = req.body.quantity

    const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var sql = 'INSERT INTO tasks (citizen_id,item_id,quantity,status,type,date_submited,number_of_people) VALUES (?,?,?,?,?,?,?)'

    const values = [citizen_id,item_id,quantity,'not_assigned','request',currentDateTime,number_of_people]
    db.query(sql,values,(err)=>{
        if (err){
            throw err
        }
        res.status(200).send("Tasks created successfully!")
    })
}