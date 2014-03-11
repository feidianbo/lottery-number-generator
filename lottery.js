var gen = require('./generator');

/*需要生成抽奖号码的数量*/
gen.make(80, function () {
//    /*生成号码数据文件*/
//    gen.file();
//    gen.file('lottery_number_by_index.txt');
//    gen.file('lottery_number_by_number.txt', 'number');
//    gen.file('lottery_number_by_number-awards.txt', '-awards', 1);

//    /*需要生成面值20元抽奖号码的数量*/
//    gen.set('20', 9);
    gen.set('20', 51, function(){
        gen.set('50', 31, function(){
            gen.set('100', 54);
        });
    });
//    gen.set('20', 600);
//
//    /*需要生成面值50元抽奖号码的数量*/
//    gen.set('50', 20);
//
//    /*需要生成面值100元抽奖号码的数量*/
//    gen.set('100', 10);
});

//console.log('测试')