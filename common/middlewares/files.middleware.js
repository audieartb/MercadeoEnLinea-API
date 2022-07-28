const multer = require('multer');
const fs = require('fs')
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./storage");
    },
    filename: (req, file, cb) => {
        let filename = Date.now()+"--"+file.originalname;
        cb(null, filename);
    },
});


exports.upload = multer({storage: fileStorage})



exports.download = (req, res, next) => {
    try {

        const path = req.body.path
        const file = fs.createReadStream(path)
        const filename = (new Date()).toISOString()
        res.setHeader('Content-Disposition', 'attachment: filename="' + filename + '"')
        file.pipe(res)
    } catch (error) {
        next()
    }
 
}
exports.getdownload = (req, res, next) => {
    try {
 
        const path = req.params.filepath
        const file = fs.createReadStream(path)
        const filename = (new Date()).toISOString()
        res.setHeader('Content-Disposition', 'attachment: filename="' + filename + '"')
        file.pipe(res)
    } catch (error) {
        next()
    }
}

exports.deleteOne = (req, res) =>{
    fs.unlink(req.body.path, (err)=>{
        if(err){
            return
        }
    })
    
}
