### http:（超文本传输协议）

---
含义：是一个在计算机世界里专门两点之间传输文字，图片，音频及视频等的超文本数据的约定和规范。

http是灵活可扩展的，是一个‘可靠’的传输协议，是应用层协议，使用了请求-应答模式，客户主动发起，本质上是无状态的，每个请求都是相互独立，毫无关联的。
明文传输，不安全

---
版本：
* http/0.9：只有一个命令get，没有header等描述数据的信息，服务器发送数据完毕之后就关闭tco连接
* http/1.0：增加了head，post一些新命令，状态码，还有header等
* http/1.1： 增加了put，delete等新方法，增加了缓存管理和控制，允许持久连接（默认开启，connection：keep-alive，使用同一个tcp连接来发送和接收多个http请求与应答，而不是为每一个新的请求打开一个新的tcp，较少的cpu和内存的使用，降低了拥塞控制，后续无需进行tcp握手），强制要求host头，让主机托管成为可能
* http/2.0：以二进制传输文件数据，多路复用，头部压缩，服务器推送

---
HTTP2.0的多路复用和HTTP1.X中的长连接复用有什么区别？

* HTTP/1.* 一次请求-响应，建立一个连接，用完关闭；每一个请求都要建立一个连接；

* HTTP/1.1 Pipeling解决方式为，若干个请求排队串行化单线程处理，后面的请求等待前面请求的返回才能获得执行机会，一旦有某请求超时等，后续请求只能被阻塞，毫无办法，也就是人们常说的线头阻塞；

* HTTP/2多个请求可同时在一个连接上并行执行。某个请求任务耗时严重，不会影响到其它连接的正常执行

服务器推送到底是什么？
* 服务端推送能把客户端所需要的资源伴随着index.html一起发送到客户端，省去了客户端重复请求的步骤。正因为没有发起请求，建立连接等操作，所以静态资源通过服务端推送的方式可以极大地提升速度。

---

http的请求报文和响应报文的结构基本相同

首行 | **
---|---
首部 | -------------
空行 | -------------
主体 | -------------



------

### 缓存：

第一次请求：

![image](../img/1.jpg)

第二次请求相同网页：

![image](../img/2.jpg)

缓存的类别
浏览器缓存分为强缓存和协商缓存

#### 强缓存：

浏览器不会像服务器发送任何请求，直接从本地缓存中读取文件并返回Status Code: 200 OK

* 200 form memory cache :
不访问服务器，一般已经加载过该资源且缓存在了内存当中，直接从内存中读取缓存。浏览器关闭后，数据将不存在（资源被释放掉了），再次打开相同的页面时，不会出现from memory cache。
* 200 from disk cache：
不访问服务器，已经在之前的某个时间加载过该资源，直接从硬盘中读取缓存，关闭浏览器后，数据依然存在，此资源不会随着该页面的关闭而释放掉下次打开仍然会是from disk cache。
* 优先访问memory cache,其次是disk cache，最后是请求网络资源

协商缓存: 向服务器发送请求，服务器会根据这个请求的request header的一些参数来判断是否命中协商缓存，如果命中，则返回304状态码并带上新的response header通知浏览器从缓存中读取资源

强缓存：
Expires：过期时间，如果设置了时间，则浏览器会在设置的时间内直接读取缓存，不再请求
Cache-Control：当值设为max-age=30时，则代表在这个请求正确返回时间（浏览器也会记录下来）的30s内再次加载资源，就会命中强缓存。

```
（1）max-age：用来设置资源（representations）可以被缓存多长时间，单位为秒；
（2）s-maxage：和max-age是一样的，不过它只针对代理服务器缓存而言；
（3）public：指示响应可被任何缓存区缓存；
（4）private：只能针对个人用户，而不能被代理服务器缓存；
（5）no-cache：强制客户端直接向服务器发送请求,也就是说每次请求都必须向服务器发送。服务器接收到     请求，然后判断资源是否变更，是则返回新内容，否则返回304，未变更。这个很容易让人产生误解，使人误     以为是响应不被缓存。实际上Cache-Control:     no-cache是会被缓存的，只不过每次在向客户端（浏览器）提供响应数据时，缓存都要向服务器评估缓存响应的有效性。
（6）no-store：禁止一切缓存（这个才是响应不被缓存的意思）。
```
cache-control是http1.1的头字段，expires是http1.0的头字段,如果expires和cache-control同时存在，cache-control会覆盖expires，建议两个都写。

---
#### 协商缓存：

Last-Modifued/If-Modified-Since和Etag/If-None-Match是分别成对出现的，呈一一对应关系
##### Etag/If-None-Match：
Etag：

- Etag是属于HTTP 1.1属性，它是由服务器（Apache或者其他工具）生成返回给前端，用来帮助服务器控制Web端的缓存验证。
- Apache中，ETag的值，默认是对文件的索引节（INode），大小（Size）和最后修改时间（MTime）进行Hash后得到的。

If-None-Match:

- 当资源过期时，浏览器发现响应头里有Etag,则再次向服务器请求时带上请求头if-none-match(值是Etag的值)。服务器收到请求进行比对，决定返回200或304


##### Last-Modified/If-Modified-Since：
Last-Modified：

- 浏览器向服务器发送资源最后的修改时间

If-Modified-Since：


- 当资源过期时（浏览器判断Cache-Control标识的max-age过期），发现响应头具有Last-Modified声明，则再次向服务器请求时带上头if-modified-since，表示请求时间。服务器收到请求后发现有if-modified-since则与被请求资源的最后修改时间进行对比（Last-Modified）,若最后修改时间较新（大），说明资源又被改过，则返回最新资源，HTTP 200 OK;若最后修改时间较旧（小），说明资源无新修改，响应HTTP 304 走缓存。

```
Last-Modifued/If-Modified-Since的时间精度是秒，而Etag可以更精确。
Etag优先级是高于Last-Modifued的，所以服务器会优先验证Etag
Last-Modifued/If-Modified-Since是http1.0的头字段
```

#### 状态码：
- 100	Continue	继续。客户端应继续其请求
- 101	Switching Protocols	切换协议。服务器根据客户端的请求切换协议。只能切换到更高级的协议，例如，切换到HTTP的新版本协议
- 200	OK	请求成功。一般用于GET与POST请求
- 201	Created	已创建。成功请求并创建了新的资源
- 202	Accepted	已接受。已经接受请求，但未处理完成
- 203	Non-Authoritative Information	非授权信息。请求成功。但返回的meta信息不在原始的服务器，而是一个副本
- 204	No Content	无内容。服务器成功处理，但未返回内容。在未更新网页的情况下，可确保浏览器继续显示当前文档
- 205	Reset Content	重置内容。服务器处理成功，用户终端（例如：浏览器）应重置文档视图。可通过此返回码清除浏览器的表单域
- 206	Partial Content	部分内容。服务器成功处理了部分GET请求
- 300	Multiple Choices	多种选择。请求的资源可包括多个位置，相应可返回一个资源特征与地址的列表用于用户终端（例如：浏览器）选择
- 301	Moved Permanently	永久移动。请求的资源已被永久的移动到新URI，返回信息会包括新的URI，浏览器会自动定向到新URI。今后任何新的请求都应使用新的URI代替
- 302	Found	临时移动。与301类似。但资源只是临时被移动。客户端应继续使用原有URI
- 303	See Other	查看其它地址。与301类似。使用GET和POST请求查看
- 304	Not Modified	未修改。所请求的资源未修改，服务器返回此状态码时，不会返回任何资源。客户端通常会缓存访问过的资源，通过提供一个头信息指出客户端希望只返回在指定日期之后修改的资源
- 305	Use Proxy	使用代理。所请求的资源必须通过代理访问
- 306	Unused	已经被废弃的HTTP状态码
- 307	Temporary Redirect	临时重定向。与302类似。使用GET请求重定向
- 400	Bad Request	客户端请求的语法错误，服务器无法理解
- 401	Unauthorized	请求要求用户的身份认证
- 402	Payment Required	保留，将来使用
- 403	Forbidden	服务器理解请求客户端的请求，但是拒绝执行此请求
- 404	Not Found	服务器无法根据客户端的请求找到资源（网页）。通过此代码，网站设计人员可设置"您所请求的资源无法找到"的个性页面
- 405	Method Not Allowed	客户端请求中的方法被禁止
- 406	Not Acceptable	服务器无法根据客户端请求的内容特性完成请求
- 407	Proxy Authentication Required	请求要求代理的身份认证，与401类似，但请求者应当使用代理进行授权
- 408	Request Time-out	服务器等待客户端发送的请求时间过长，超时
- 409	Conflict	服务器完成客户端的 PUT 请求时可能返回此代码，服务器处理请求时发生了冲突
- 410	Gone	客户端请求的资源已经不存在。410不同于404，如果资源以前有现在被永久删除了可使用410代码，网站设计人员可通过301代码指定资源的新位置
- 411	Length Required	服务器无法处理客户端发送的不带Content-Length的请求信息
- 412	Precondition Failed	客户端请求信息的先决条件错误
- 413	Request Entity Too Large	由于请求的实体过大，服务器无法处理，因此拒绝请求。为防止客户端的连续请求，服务器可能会关闭连接。如果只是服务器暂时无法处理，则会包含一个Retry-After的响应信息
- 414	Request-URI Too Large	请求的URI过长（URI通常为网址），服务器无法处理
- 415	Unsupported Media Type	服务器无法处理请求附带的媒体格式
- 416	Requested range not satisfiable	客户端请求的范围无效
- 417	Expectation Failed	服务器无法满足Expect的请求头信息
- 500	Internal Server Error	服务器内部错误，无法完成请求
- 501	Not Implemented	服务器不支持请求的功能，无法完成请求
- 502	Bad Gateway	作为网关或者代理工作的服务器尝试执行请求时，从远程服务器接收到了一个无效的响应
- 503	Service Unavailable	由于超载或系统维护，服务器暂时的无法处理客户端的请求。延时的长度可包含在服务器的Retry-After头信息中
- 504	Gateway Time-out	充当网关或代理的服务器，未及时从远端服务器获取请求
- 505	HTTP Version not supported	服务器不支持请求的HTTP协议的版本，无法完成处理

---

### HTTPS协议
#### 概念
- 超文本传输安全协议（英语：Hypertext Transfer Protocol Secure，缩写：HTTPS，常称为HTTP over TLS，HTTP over SSL或HTTP Secure）是一种通过计算机网络进行安全通信的传输协议。
- HTTPS经由HTTP进行通信，但利用SSL/TLS来加密数据包。
- HTTPS开发的主要目的，是提供对网站服务器的身份认证，保护交换数据的隐私与完整性。
- 简而言之: HTTPS是在HTTP上建立SSL加密层，并对传输数据进行加密，是HTTP协议的安全版。

#### HTTPS比HTTP多了一层TLS/SSL协议

- TLS/SSL全称安全传输层协议Transport Layer Security, 是介于TCP和HTTP之间的一层安全协议，不影响原有的TCP协议和HTTP协议，所以使用HTTPS基本上不需要对HTTP页面进行太多的改造。
- HTTPS原理
- 这部分细说起来,真的很多.这里我归纳简单说一下:
- 
- 客户端向服务器端索要并验证公钥。这一阶段使用的是非对称加密传输(RSA),服务端将数字证书发给客户端.其中数字证书包括:公钥和数字签名.客户端在拿到后对两者进行校验.
- 在非对称加密传输中,两端协商生成"对话密钥"。
- 双方采用"对话密钥"进行对称加密通信。
- 
- 受限于篇幅,我就不展开了.要不然就太多太多了.这里我推荐几篇文章大家全面理解:

#### HTTP 与 HTTPS 的区别

- HTTP 是明文传输，HTTPS 通过 SSL\TLS 进行了加密
- HTTP 的端口号是 80，HTTPS 是 443
- HTTPS 需要到 CA 申请证书，一般免费证书很少，需要交费
- HTTP 的连接很简单，是无状态的；HTTPS 协议是由 SSL+HTTP 协议构建的可进行加密传输、身份认证的网络协议，比 HTTP 协议安全。
#### HTTPS主要作用是：

对数据进行加密，并建立一个信息安全通道，来保证传输过程中的数据安全
对网站服务器进行真实身份认证

#### HTTPS缺点


```
HTTPS协议握手阶段比较费时，会使页面的加载时间延长近50%，增加10%到20%的耗电；
https连接缓存不如http高效，如果是大流量网站,则会造成流量成本太高。
https连接服务器端资源占用高很多，支持访客稍多的网站需要投入更大的成本，如果全部采用https，基于大部分计算资源闲置的假设的VPS的平均成本会上去。
SSL证书需要钱，功能越强大的证书费用越高，个人网站、小网站没有必要一般不会用。
SSL证书通常需要绑定IP，不能再同一IP上绑定多个域名，IPv4资源不可能支撑这个消耗(SSL有扩展可以部分解决这个问题，但是比较麻烦，而且要求浏览器、操作系统支持，Windows XP就不支持这个扩展，考虑到XP的装机量，这个特性几乎没用)。
```


#### HTTPS接入优化
 CDN接入
- HTTPS 增加的延时主要是传输延时 RTT，RTT 的特点是节点越近延时越小，CDN 天然离用户最近，因此选择使用 CDN 作为 HTTPS 接入的入口，将能够极大减少接入延时。CDN 节点通过和业务服务器维持长连接、会话复用和链路质量优化等可控方法，极大减少 HTTPS 带来的延时。

会话缓存
- 虽然前文提到 HTTPS 即使采用会话缓存也要至少1*RTT的延时，但是至少延时已经减少为原来的一半，明显的延时优化;同时，基于会话缓存建立的 HTTPS 连接不需要服务器使用RSA私钥解密获取 Pre-master 信息，可以省去CPU 的消耗。如果业务访问连接集中，缓存命中率高，则HTTPS的接入能力讲明显提升。当前TRP平台的缓存命中率高峰时期大于30%，10k/s的接入资源实际可以承载13k/的接入，收效非常可观。

硬件加速
- 为接入服务器安装专用的SSL硬件加速卡，作用类似 GPU，释放 CPU，能够具有更高的 HTTPS 接入能力且不影响业务程序的。测试某硬件加速卡单卡可以提供35k的解密能力，相当于175核 CPU，至少相当于7台24核的服务器，考虑到接入服务器其它程序的开销，一张硬件卡可以实现接近10台服务器的接入能力。

远程解密
- 本地接入消耗过多的 CPU 资源，浪费了网卡和硬盘等资源，考虑将最消耗 CPU 资源的RSA解密计算任务转移到其它服务器，如此则可以充分发挥服务器的接入能力，充分利用带宽与网卡资源。远程解密服务器可以选择 CPU 负载较低的机器充当，实现机器资源复用，也可以是专门优化的高计算性能的服务器。当前也是 CDN 用于大规模HTTPS接入的解决方案之一。
#### SPDY/HTTP2

```
前面的方法分别从减少传输延时和单机负载的方法提高 HTTPS;
接入性能，但是方法都基于不改变 HTTP;
协议的基础上提出的优化方法，SPDY/HTTP2 利用 TLS/SSL;
带来的优势，通过修改协议的方法来提升 HTTPS 的性能，提高下载速度等
```

ECDHE 握手过程
刚才你看到的是握手过程的简要图，我又画了一个详细图，对应 Wireshark 的抓包，下面我就用这个图来仔细剖析 TLS 的握手过程。



在 TCP 建立连接之后，浏览器会首先发一个“Client Hello”消息，也就是跟服务器“打招呼”。里面有客户端的版本号、支持的密码套件，还有一个随机数（Client Random），用于后续生成会话密钥。

Handshake Protocol: Client Hello
    Version: TLS 1.2 (0x0303)
    Random: 1cbf803321fd2623408dfe…
    Cipher Suites (17 suites)
        Cipher Suite: TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 (0xc02f)
        Cipher Suite: TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 (0xc030)
这个的意思就是：“我这边有这些这些信息，你看看哪些是能用的，关键的随机数可得留着。”

作为“礼尚往来”，服务器收到“Client Hello”后，会返回一个“Server Hello”消息。把版本号对一下，也给出一个随机数（Server Random），然后从客户端的列表里选一个作为本次通信使用的密码套件，在这里它选择了“TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384”。

Handshake Protocol: Server Hello
    Version: TLS 1.2 (0x0303)
    Random: 0e6320f21bae50842e96…
    Cipher Suite: TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 (0xc030)
这个的意思就是：“版本号对上了，可以加密，你的密码套件挺多，我选一个最合适的吧，用椭圆曲线加 RSA、AES、SHA384。我也给你一个随机数，你也得留着。”

然后，服务器为了证明自己的身份，就把证书也发给了客户端（Server Certificate）。

接下来是一个关键的操作，因为服务器选择了 ECDHE 算法，所以它会在证书后发送“Server Key Exchange”消息，里面是椭圆曲线的公钥（Server Params），用来实现密钥交换算法，再加上自己的私钥签名认证。

Handshake Protocol: Server Key Exchange
    EC Diffie-Hellman Server Params
        Curve Type: named_curve (0x03)
        Named Curve: x25519 (0x001d)
        Pubkey: 3b39deaf00217894e...
        Signature Algorithm: rsa_pkcs1_sha512 (0x0601)
        Signature: 37141adac38ea4...
这相当于说：“刚才我选的密码套件有点复杂，所以再给你个算法的参数，和刚才的随机数一样有用，别丢了。为了防止别人冒充，我又盖了个章。”

之后是“Server Hello Done”消息，服务器说：“我的信息就是这些，打招呼完毕。”

这样第一个消息往返就结束了（两个 TCP 包），结果是客户端和服务器通过明文共享了三个信息：Client Random、Server Random 和 Server Params。

客户端这时也拿到了服务器的证书，那这个证书是不是真实有效的呢？

这就要用到第 25 讲里的知识了，开始走证书链逐级验证，确认证书的真实性，再用证书公钥验证签名，就确认了服务器的身份：“刚才跟我打招呼的不是骗子，可以接着往下走。”

然后，客户端按照密码套件的要求，也生成一个椭圆曲线的公钥（Client Params），用“Client Key Exchange”消息发给服务器。

Handshake Protocol: Client Key Exchange
    EC Diffie-Hellman Client Params
        Pubkey: 8c674d0e08dc27b5eaa…
现在客户端和服务器手里都拿到了密钥交换算法的两个参数（Client Params、Server Params），就用 ECDHE 算法一阵算，算出了一个新的东西，叫“Pre-Master”，其实也是一个随机数。

至于具体的计算原理和过程，因为太复杂就不细说了，但算法可以保证即使黑客截获了之前的参数，也是绝对算不出这个随机数的。

现在客户端和服务器手里有了三个随机数：Client Random、Server Random 和 Pre-Master。用这三个作为原始材料，就可以生成用于加密会 话的主密钥，叫“Master Secret”。而黑客因为拿不到“Pre-Master”，所以也就得不到主密钥。

为什么非得这么麻烦，非要三个随机数呢？

这就必须说 TLS 的设计者考虑得非常周到了，他们不信任客户端或服务器伪随机数的可靠性，为了保证真正的“完全随机”“不可预测”，把三个不可靠的随机数混合起来，那么“随机”的程度就非常高了，足够让黑客难以猜测。

你一定很想知道“Master Secret”究竟是怎么算出来的吧，贴一下 RFC 里的公式：

master_secret = PRF(pre_master_secret, "master secret",
                    ClientHello.random + ServerHello.random)
这里的“PRF”就是伪随机数函数，它基于密码套件里的最后一个参数，比如这次的 SHA384，通过摘要算法来再一次强化“Master Secret”的随机性。

主密钥有 48 字节，但它也不是最终用于通信的会话密钥，还会再用 PRF 扩展出更多的密钥，比如客户端发送用的会话密钥（client_write_key）、服务器发送用的会话密钥（server_write_key）等等，避免只用一个密钥带来的安全隐患。

有了主密钥和派生的会话密钥，握手就快结束了。客户端发一个“Change Cipher Spec”，然后再发一个“Finished”消息，把之前所有发送的数据做个摘要，再加密一下，让服务器做个验证。

意思就是告诉服务器：“后面都改用对称算法加密通信了啊，用的就是打招呼时说的 AES，加密对不对还得你测一下。”

服务器也是同样的操作，发“Change Cipher Spec”和“Finished”消息，双方都验证加密解密 OK，握手正式结束，后面就收发被加密的 HTTP 请求和响应了。

RSA 握手过程
整个握手过程可真是够复杂的，但你可能会问了，好像这个过程和其他地方看到的不一样呢？

刚才说的其实是如今主流的 TLS 握手过程，这与传统的握手有两点不同。

第一个，使用 ECDHE 实现密钥交换，而不是 RSA，所以会在服务器端发出“Server Key Exchange”消息。

第二个，因为使用了 ECDHE，客户端可以不用等到服务器发回“Finished”确认握手完毕，立即就发出 HTTP 报文，省去了一个消息往返的时间浪费。这个叫“TLS False Start”，意思就是“抢跑”，和“TCP Fast Open”有点像，都是不等连接完全建立就提前发应用数据，提高传输的效率。

实验环境在 440 端口（https://www.chrono.com:440/26-1）实现了传统的 RSA 密钥交换，没有“False Start”，你可以课后自己抓包看一下，这里我也画了个图。



大体的流程没有变，只是“Pre-Master”不再需要用算法生成，而是客户端直接生成随机数，然后用服务器的公钥加密，通过“Client Key Exchange”消息发给服务器。服务器再用私钥解密，这样双方也实现了共享三个随机数，就可以生成主密钥。

双向认证
到这里 TLS 握手就基本讲完了。

不过上面说的是“单向认证”握手过程，只认证了服务器的身份，而没有认证客户端的身份。这是因为通常单向认证通过后已经建立了安全通信，用账号、密码等简单的手段就能够确认用户的真实身份。

但为了防止账号、密码被盗，有的时候（比如网上银行）还会使用 U 盾给用户颁发客户端证书，实现“双向认证”，这样会更加安全。

双向认证的流程也没有太多变化，只是在“Server Hello Done”之后，“Client Key Exchange”之前，客户端要发送“Client Certificate”消息，服务器收到后也把证书链走一遍，验证客户端的身份。

小结
今天我们学习了 HTTPS/TLS 的握手，内容比较多、比较难，不过记住下面四点就可以。

HTTPS 协议会先与服务器执行 TCP 握手，然后执行 TLS 握手，才能建立安全连接；
握手的目标是安全地交换对称密钥，需要三个随机数，第三个随机数“Pre-Master”必须加密传输，绝对不能让黑客破解；
“Hello”消息交换随机数，“Key Exchange”消息交换“Pre-Master”；
“Change Cipher Spec”之前传输的都是明文，之后都是对称密钥加密的密文。


