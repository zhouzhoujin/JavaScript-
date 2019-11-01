Function.prototype.call2 = function (context) {
    var context = context || window;
    context.fn = this;
    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }
    var result = eval('context.fn(' + args +')');
    delete context.fn
    return result;
}

//原生JavaScript封装apply方法，第四版
Function.prototype.applyFour = function(context) {
    var context = context || window
    var args = arguments[1] //获取传入的数组参数
    var fn = Symbol()
    context[fn] = this //假想context对象预先不存在名为fn的属性
    if (args == void 0) { //没有传入参数直接执行
        return context[fn]()
    }
    var fnStr = 'context[fn]('
    for (var i = 0; i < args.length; i++) {
        //得到"context.fn(arg1,arg2,arg3...)"这个字符串在，最后用eval执行
        fnStr += i == args.length - 1 ? args[i] : args[i] + ','
    }
    fnStr += ')'
    var returnValue = eval(fnStr) //还是eval强大
    delete context[fn] //执行完毕之后删除这个属性
    return returnValue
}

Function.prototype.callOne = function(context) {
    return this.applyFour(([].shift.applyFour(arguments)), arguments)
    //巧妙地运用上面已经实现的applyFive函数
}

//简单模拟bind函数
Function.prototype.bind = Function.prototype.bind || function (context) {
    var me = this;
    var args = Array.prototype.slice.call2(arguments, 1);
    var F = function () {};
    F.prototype = this.prototype;
    var bound = function () {
        var innerArgs = Array.prototype.slice.call2(arguments);
        var finalArgs = args.concat(innerArgs);
        return me.applyFour(this instanceof F ? this : context || this, finalArgs);
    }
    bound.prototype = new F();
    return bound;
}
var obj = {
    name: 'jawil'
}

function sayHello(age) {
    return {
        name: this.name,
        age: age
    }
}

console.log(sayHello.applyFour(obj,[24]));// 完美输出{name: "jawil", age: 24}
console.log(sayHello.callOne(obj,24));// 完美输出{name: "jawil", age: 24}
console.log(sayHello.call2(obj,24))
console.log(sayHello.bind(obj,24)())