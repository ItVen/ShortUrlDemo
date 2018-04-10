
let express,path,favicon,logger,cookieParser,bodyParser,MongoStore,mongoose,session,fs;
express = require('express');
mongoose=require('mongoose');
path = require('path');
favicon = require('serve-favicon');
logger = require('morgan');
cookieParser = require('cookie-parser');
bodyParser = require('body-parser');
fs=require('fs');

//加载模块
let models_path=__dirname+'/api/models';
let walk=function(path){
    fs
        .readdirSync(path)
        .forEach(function(file){
            var newPath=path+'/'+file;
            var stat =fs.statSync(newPath);

            if(stat.isFile()){
                if(/(.*)\.(js|coffee)/.test(file)){
                    require(newPath)
                }
            }else if(stat.isDirectory()){
                walk(newPath);
            }
        })
}
walk(models_path);

let app = express();

let mongoPath="mongodb://localhost/shortURL";
mongoose.connect(mongoPath);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./config/routes')(app);
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
