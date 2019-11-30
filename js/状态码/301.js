const http = require('http');


http.createServer(function (req, res) { 
  
	if (req.url === '/')  {
     	res.writeHead(301, { // 301 - 永久重定向 第一次访问 /，还是经过服务器跳转到 /new ，第二次访问的时候，因为已经永久重定向了，在浏览器访问/， 由浏览器直接跳转到 /new，不需要经过服务器， 需要极其注意的是， 使用了 301 之后，访问 / 下面的数据就会被缓存下来，造成你下次更改 访问/ 的数据，也没有用，因为 访问/ 会直接拿缓存里面的数据， 除非用户清除缓存， 否则，数据永远是 第一次缓存下来的数据
            'Location': '/300' 
        });

        res.end('');
 	};
    if (req.url === '/301') {
        res.writeHead(200, {
            'Content-Type': 'text/html',
        });
        res.end('<div> / 301 change/new</div>')
    }
    console.log('request comming',req.url);

}).listen(8081); 

//二者在不同HTTP协议下的状态信息不同。

//在HTTP/1.0 302 状态为 Moved Temporarily

//The requested resource resides temporarily under a different URL. 
//Since the redirection may be altered on occasion, the client should continue 
//to use the Request-URI for future requests.
//在HTTP/1.1 302 状态为 Found

//The requested resource resides temporarily under a different URI. 
//Since the redirection might be altered on occasion, the client SHOULD 
//continue to use the Request-URI for future requests. 
//This response is only cacheable if indicated by a Cache-Control or Expires header field.