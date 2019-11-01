function objectNew(){
    //1.new 一个新对象，
    //2.将构造函数的作用域赋给新对象（this指向这个新对象）
    //3.执行构造函数中的代码
    //4.返回这个新对象
    var obj = new Object();
    //删除第一个元素，返回第一个元素
    //var Constructor = [].shift.call(arguments);
    var Constructor = arguments[0]
    console.log(Constructor)
    //对象的原型对象链接到构造函数的原型
    obj._proto_ = Constructor.prototype;
    //执行构造函数的代码（为这个新对象添加属性）
    Constructor.apply(obj,arguments);
    return obj;
}
function Person(name,age){
    this.name = name;
    this.age = age;
    this.syaName = function(){
        console.log(this.name)
    };
}
var person1 = objectNew(Person,'zjf',22)
person1.syaName()