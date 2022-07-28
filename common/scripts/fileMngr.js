const fs = require('fs')

exports.deleteMany = (files) => {
 
    for(let i = 0; i < files.length; i++){
      
        fs.unlink(files[i].path, (error)=>{
            if(error){
                return
            }
        })
    }
}

exports.deleteOne = (path) =>{
    fs.unlink(path, (error)=>{
        if(error){
            return
        }
    })
}