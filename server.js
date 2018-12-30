var http = require('http');
var qs = require('querystring');


http.createServer(function (req, res) {
  var fs = require('fs');
  var postData = "";
    /**
     * 因为post方式的数据不太一样可能很庞大复杂，
     * 所以要添加监听来获取传递的数据
     * 也可写作 req.on("data",function(data){});
     */
    req.addListener("data", function (data) {
        postData += data;
    });
    /**
     * 这个是如果数据读取完毕就会执行的监听方法
     */
    req.addListener("end", function () {
        var writedata = qs.parse(postData);
        console.log(writedata);
        fs.readFile('./src/info.json', (err, prevData) => {
          if (prevData == "") prevData = "[]";
          var jsonArray = JSON.parse(prevData.toString());
          jsonArray.push(writedata);
          fs.writeFile('./src/info.json', JSON.stringify(jsonArray), (err)=> {
            if (err) {
              return console.error(err);
            }
          })
        });
    });
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('write success!\n');
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
