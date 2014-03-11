var mongoose = require('mongoose');

var lotterySchema = exports.LotterySchema = new mongoose.Schema({
    index: {
        type: Number,
        min: 0,
        max: 1999,
        required: true,
        unique: true,
        default: 1
    },
    ///抽奖号码
    number: {
        type: Number,
        min: 10000000,
        max: 99999999,
        required: true,
        unique: true,
        default: 10000000
    },
    ///中奖奖项
    awards: {
        type: String,
        enum: [0, 20, 50, 100],
        default: 0
    },
    ///微信号码
    weixin: {
        type: String,
        required: false,
        unique: false,
        default: null
    },
    ///手机号码
    mobile: {
        type: String,
        required: false,
        default: null
    },
    ///姓名
    name: {
        type: String,
        required: false
    },
    ///性别
    gender: {
        type: String,
        enum: [null, 'F', 'M'],
        default: null
    },
    ///使用时间
    date: {
        type: Date,
        required: false,
        default: null
    },
    ///状态
    status: {
        type: String,
        enum: ['未激活', '已激活未使用', '已使用', '已删除'],
        default: '未激活'
    }
});
exports.Lottery = mongoose.model('Lottery', lotterySchema);
