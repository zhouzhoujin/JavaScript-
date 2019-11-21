var http = require('http');
http.createServer(function (req, res) {
    // 获得客户端的Cookie
    var Cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function( Cookie ) {
        var parts = Cookie.split('=');
        console.log(parts)
        Cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
    console.log(req.headers.cookie)
    // 向客户端设置一个Cookie
    res.writeHead(200, {
        'Access-Control-Allow-Origin': 'http://127.0.0.1:8002',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Set-Cookie': `myCookie=test; path=/; domain=127.0.0.1`,
        'Content-Type': 'application/json;charset=utf-8'
    });
    var data = '{"name":"zjf"}'
    res.end(data);
}).listen(8000);
 
console.log('Server running at http://127.0.0.1:8000/');
