const http = require('http');


http.createServer(function (req, res) { 
    if (req.url === '/') {  // 302 - 临时重定向,当它访问 / ,原来这里的资源移动到了 /new下面，就直接重定向到 /new, 与 301 的区别是 每次还是需要访问 /，经过服务器的跳转到 /new,  , 
        res.writeHead(302, {
            'Location': '/3021'  // 302 - 临时重定向， 因为在同域下面，所以只用写 路由名
        });

       res.end('');

    };
    if (req.url === '/302') {
        res.writeHead(200, {
            'Content-Type': 'text/html',
        });
        res.end('<div> / 302 /new</div>')
    }
    console.log('request comming',req.url);

    
}).listen(8082); 
