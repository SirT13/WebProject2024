const db = require('../utils/connect_db')
const jwt = require("jsonwebtoken")
var bcrypt = require('bcrypt');
exports.login = async(req,res,next)=>{  
    var username=req.body.username
    var password=req.body.password
    var sql = 'SELECT * FROM users WHERE username=?'

    db.query(sql,[username],function(err,user){

        if(err) {
            return next(err)
        };
        if(user[0]){ //no user err handling
            bcrypt.compare(password,user[0].password,(err,response)=>{
                if(response){
                    const user_data = {user_id:user[0].id,username: username,role:user[0].role}
                    const token=jwt.sign(user_data,process.env.SECRET_KEY)
                    console.log(token)
                    res.header('auth-token',token).status(200).send({ token, role: user[0].role });
                }
                else res.status(403).send({message:"Τα στοιχεία σύνδεσης είναι λάθος"})
            })
        }
        else res.status(404).send({message:"Ο χρήστης δε βρέθηκε"})
    })
}