// 相同点：这两个方法的作用是一样的。
// 都是在特定的作用域中调用函数，等于设置函数体内this对象的值，以扩充函数赖以运行的作用域。

// 一般来说，this总是指向调用某个方法的对象，但是使用call()和apply()方法时，就会改变this的指向。

/*apply()方法 接收两个参数，一个是函数运行的作用域（this），另一个是参数数组。
语法：apply([thisObj [,argArray] ]);，调用一个对象的一个方法，2另一个对象替换当前对象。
说明：如果argArray不是一个有效数组或不是arguments对象，那么将导致一个 
TypeError，如果没有提供argArray和thisObj任何一个参数，那么Global对象将用作thisObj。
call()方法 第一个参数和apply()方法的一样，但是传递给函数的参数必须列举出来。
语法：call([thisObject[,arg1 [,arg2 [,...,argn]]]]);，应用某一对象的一个方法，用另一个对象
替换当前对象。
说明： call方法可以用来代替另一个对象调用一个方法，call方法可以将一个函数的对象上下文从初始的上下文
改变为thisObj指定的新对象，
如果没有提供thisObj参数，那么Global对象被用于thisObj。*/
Function.prototype.call2 = function (context) {
    var context = context || window;
    context.fn = this;
    console.log(context,context.fn)
    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');    
        console.log(args)
    }

    var result = eval('context.fn(' + args +')');
    console.log(result)
    delete context.fn
    return result;
}
Function.prototype.call3 = function(context){
    var context = context || window;
    context.fn = this;
    var args = []
    for(let i = 1; i< arguments.length; i++){
        args.push(`arguments[${i}]`)
    }
    var result = eval(`context.fn(${args})`)
    console.log(result)
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
    console.log([].shift.apply(arguments))
    return this.applyFour(([].shift.applyFour(arguments)), arguments)
    //巧妙地运用上面已经实现的applyFive函数
}

//简单模拟bind函数
Function.prototype.newBind = function(target){
    var target = target || window;
    var self = this;
    var args = [].slice.call(arguments,1);
    var temp = function(){};
    var F = function(){
       var _args = [].slice.call(arguments,0);
       return self.apply(this instanceof temp ? this : target , args.concat(_args));
    }
    temp.prototype = this.prototype;
    F.prototype = new temp;
    return F;
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
console.log(sayHello.newBind(obj,24)())

