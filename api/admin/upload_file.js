const insertData  = require('../../utils/insert_data');
const fs = require('fs');
const path = require('path');

exports.upload_file = async(req,res,next)=>{
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Error reading file' });
        }

        // Parse the JSON data
        try {
            const jsonData = JSON.parse(data);
            insertData(jsonData)
            // Delete the file after processing
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            });

            res.status(200).send({ message: 'File processed successfully', data: jsonData });
        } catch (parseErr) {
            res.status(400).send({ message: 'Invalid JSON format' });
        }
    });
}