
const FileMiddleware = require('../../common/middlewares/files.middleware')

exports.routesConfig = function (app) {

    app.post('/file', FileMiddleware.download)

    app.post('/file/delete', FileMiddleware.deleteOne)
    
}