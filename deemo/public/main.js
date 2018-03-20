

  exports.writeInput function(){
  var fs = require("fs");

  /*
  fs.readFile('input.txt', function (err, data) {
      if (err) return console.error(err);
      console.log(data.toString());
  });

  console.log("程序执行结束!");
  */

  console.log("准备写入文件");
  fs.writeFile('input.txt', '我是通过写入的文件内容！',  function(err) {
     if (err) {
         return console.error(err);
     }
     console.log("数据写入成功！");
     console.log("--------我是分割线-------------")
     console.log("读取写入的数据！");
     fs.readFile('input.txt', function (err, data) {
        if (err) {
           return console.error(err);
        }
        console.log("异步读取文件数据: " + data.toString());
     });
  });
}
