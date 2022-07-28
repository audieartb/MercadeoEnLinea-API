var express = require('express')
var app = express();
const cors = require('cors')
const logger = require('./utils/logger'); ///importar para hacer logs
const morgan = require('morgan');
router = express.Router();
const AuthorizationRouter = require('./authorization/routes.config');
const UserRouter = require('./api/users/users.routes');
const EventRouter = require('./api/events/events.routes');
const NotificationsRouter = require('./api/notifications/notifications.routes');
const ProjectsRouter = require('./api/Projects/projects.routes');
const ActivityLog = require('./api/activityLog/activityLogs.routes');
const TaskRouter = require('./api/Task/tasks.routes');
const FileRouter = require('./api/filesDownload/file.routes');

app.use(morgan('tiny'));

app.use(express.json());
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', 'http://localhost:8081');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }else{
        return next();
    }
})

app.use(cors());
AuthorizationRouter.routesConfig(router);
UserRouter.routesConfig(router);
EventRouter.routesConfig(router);
NotificationsRouter.routesConfig(router);
ProjectsRouter.routesConfig(router);
ActivityLog.routesConfig(router);
TaskRouter.routesConfig(router);
FileRouter.routesConfig(router);

const PORT = 3000;

router.get('/', function(req, res){
	res.send('It\'s alive');
})

app.use('/api',router);

app.listen(PORT, ()=>{
    logger.info(`Server running on http://localhost:${PORT}`) //insertar en los logs
});
