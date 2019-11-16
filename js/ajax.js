//0:未初始化，未调用open方法，1：启动，调用open，没有用send，
//3：接收，已经接收到部分数据，4：完成，可以在客户端使用
//get

var xml = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("microsoft.XMLHTTP")
xml.open("GET",'/',true);
xml.send()
xml.onreadystatechange = () =>{
    if(xml.readyStatus == 4 && xml.status ==200){
        var data = xml.responseText
        return data
    }
}
//postPOST请求的两种编码格式：application/x-www-urlencoded是浏览器默认的编码格式，
//用于键值对参数，参数之间用&间隔；
//multipart/form-data常用于文件等二进制，也可用于键值对参数，
//最后连接成一串字符传输(参考Java OK HTTP)。
//除了这两个编码格式，还有application/json也经常使用。

var xml1 = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("microsoft.XMLHTTP");
xml.open("POST","/",true);
xml.setRequestHeader("content-type","application/x-www-form-urlencoded");
xml.send("xxxx=xxx");

