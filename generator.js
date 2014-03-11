require('./dao');
var Lottery = require('./model/lottery');

var max = 2000;

var generate = function (model, callback) {
    var lottery = new Lottery.Lottery();
    lottery.number = rand.value(10000000, 99999999);
    lottery.model = model;

    lottery.model.find().count(function (err, count1) {
        if (count1 < max) {
            lottery.index = count1;
            lottery.save(function (err) {
                console.log('[生成号码][' + count1 + ']' + (err ? '保存失败，' : '保存成功，') + '[ ' + lottery.number + ' ]');

                model.find().count(function (err, count2) {
                    generate(model, callback);
                });
            });
        } else {
            console.log('[生成号码]抽奖号码已经超过指定生成为 ' + max + ' 张了 （共 ' + count1 + ' 张）');
            if (callback){
                callback();
            }
        }
    });
}

var rand = {
    value: function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
};

///生成抽奖号码
exports.make = function (count, callback) {
    max = count;
    generate(Lottery.Lottery, callback);
}

var set = exports.set = function (awards, count, callback) {
    Lottery.Lottery.find({awards: awards}).count(function (err, count2) {
        var _count = count - count2;
        if (count2 < count) {
            Lottery.Lottery.find({awards: '0'}, function (err, lotteries) {
//                console.log(lotteries.length);
//                console.log(lotteries);
                var index = rand.value(0, lotteries.length-1);
//                console.log(index);
                if (index >= 0){
                lotteries[index].awards = awards;
                lotteries[index].save(function (err, lottery) {
                    if (err) {
                        console.log('[设置奖券]' + err);
                    } else {
                        console.log('[设置奖券]' + _count + '.生成一张面值 ' + awards + ' 元的抽奖号码: ' + lottery.number + ' [ ' + lottery.index + ' ]');
                    }
                    set(awards, count, callback);
                });
                }else{
                    console.log('[设置奖券]没有剩余的抽奖号码用来生成面值 ' + awards + ' 的奖券了，还差 ' + _count + ' 个，请再生成不少于 ' + _count + ' 个抽奖号码');
                }
            });
        }
        else {
            console.log('[设置奖券]面值为 ' + awards + ' 元的抽奖号码数量已经够 ' + count + ' 张了（共 ' + count2 + ' 张）');
            if (callback){
                callback();
            }
        }
    });
}

///生成抽奖号码的文件
exports.file = function (file, sort, awards) {
    var fs = require('fs');
    var path = 'data';

    if (!fs.exists(path)) {
        fs.mkdir(path, function (err) {
            if (!file) {
                file = 'lottery_numbers.txt';
            }
            file = fs.realpathSync('.') + '/' + path + '/' + file;

            var content = '抽奖号码如下：\r\n';
            Lottery.Lottery.
                find().
                sort(sort).
                exec(function (err, lottories) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('需要生成包含有 ' + lottories.length + ' 个抽奖号码的文件');
                        for (var i = 0; i < lottories.length; i++) {
                            content = content +
                                lottories[i].number + '[' +
                                (lottories[i].index < 10 ? ('000' + lottories[i].index.toString()) : (
                                    lottories[i].index < 100 ? ('00' + lottories[i].index.toString()) : (
                                        lottories[i].index < 1000 ? ('0' + lottories[i].index.toString()) : lottories[i].index))) + ']';
                            if (awards) {
                                content = content + '[' + lottories[i].awards + ']';
                            }
                            content = content + '\r\n';
                        }

                        fs.writeFile(file, content, function (err) {
                            if (err) {
                                console.log('生成抽奖号码文件时失败，' + err);
                            } else {
                                console.log('抽奖号码保存完成，参见文件：' + file);
                            }
                        });
                    }
                }
            );
        });
    }
};
 