require('./dao');
var Lottery = require('./model/lottery');

var lottery = new Lottery.Lottery();
var number = lottery.number = Math.round(Math.random() * 100000000);

var max = 2000;

var generate = function (model) {

    var lottery = new Lottery.Lottery();
    number = lottery.number = Math.round(Math.random() * 100000000);
    lottery.model = model;

    lottery.model.find().count(function (err, count1) {
        if (count1 < max) {
            lottery.index = count1;
            lottery.save(function (err, lottery) {
                if (err || lottery) {
                    var lottery = new Lottery.Lottery();
                    lottery.model = model;
                    console.log(count1 + '：保存失败。' + number);
                }

                lottery.model.find().count(function (err, count2) {
                    console.log(count2 + '：保存成功。' + number);

                    generate(lottery.model);
                });
            });
        } else {
            console.log('抽奖号码已经超过指定生成为 ' + max + ' 张');
        }
    });
}

var rand = {
    value: function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
};

///生成抽奖号码
exports.make = function (count) {
    max = count;
    generate(Lottery.Lottery);
}

var set = exports.set = function (awards, count) {
    Lottery.Lottery.find({awards: awards}).count(function (err, count2) {
        var _count = count - count2;
        if (_count > 0) {
            Lottery.Lottery.find({awards: 0}, function (err, lotteries) {
//                console.log('本次需要生成面值为 ' + awards + ' 的抽奖号码共 ' + _count + '个');
//                console.log('共有 ' + lotteries.length + ' 个抽奖号码用于随机生成面值为 ' + awards + ' 的抽奖号码');
                var index = rand.value(1, lotteries.length);
                lotteries[index].awards = awards;
                lotteries[index].save(function (err, lottery) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(_count + '.已生成一张面值 ' + awards + ' 元的抽奖号码: ' + lottery.number + ' [ ' + lottery.index + ' ]');
                    }
                    set(awards, count);
                });
            });
        }
        else {
            console.log('面值为 ' + awards + ' 元的抽奖号码数量已经够 ' + count2 + ' 张了（共 ' + count2 + ' 张）');
        }
    });
}

///生成抽奖号码文件
exports.file = function (file, sort, awards) {
    var fs = require('fs');
    var path = 'data';

    if (!fs.exists(path)) {
        fs.mkdir(path, function (err) {
            if (!file) {
                file = 'lottery_numbers.txt';
            }
            file = path + '\\' + file;

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
                                console.log('抽奖号码保存完成，参见文件：' + fs.realpathSync('.').toLowerCase() + '\\' + file);
                            }
                        });
                    }
                }
            );
        });
    }
}
