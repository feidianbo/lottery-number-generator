
var gen = require('./generator');

///需要生成抽奖号码的数量
gen.make(2000);

///以下语句需要单独、多次运行！
///需要生成面值20元抽奖号码的数量
gen.set('20', 50);
//gen.set('20', 600);

///需要生成面值50元抽奖号码的数量
gen.set('50', 200);

///需要生成面值100元抽奖号码的数量
gen.set('100', 100);

///生成号码数据文件
gen.file();
gen.file('lottery_number_by_index.txt');
gen.file('lottery_number_by_number.txt','number');
gen.file('lottery_number_by_number-awards.txt','-awards', 1);

//console.log('测试')