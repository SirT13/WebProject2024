const axios = require('axios');
const insertData  = require('../../utils/insert_data');

exports.update_warehouse = async(req,res,next)=>{
    const response = await axios.get('http://usidas.ceid.upatras.gr/web/2023/export.php');
    const data = response.data;
    insertData(data)
    res.send("Data Inserted Successfully!");
}