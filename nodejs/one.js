var http = require('http');
http.createServer(function (req,res){
    res.writeHead(200,{'content-type':'text/plain','cache-control':'max-age=5'})
    res.end('hello,world')
}).listen(8081)
console.log('Server running at http://127.0.0.1:8081/');
