var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/lottery');

var db = mongoose.connection;

db.on('error', console.error.bind(console, '连接数据源时出错，请确认MongoDB数据库是否已经正常启动。错误信息:'));

db.once('open', function callback() {
//        console.log('数据库连接已经打开');
    }
);