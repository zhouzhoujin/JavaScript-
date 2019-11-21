/*  构造函数 ，是一种特殊的方法。主要用来在创建对象时初始化对象， 
    即为对象成员变量赋初始值，总与new运算符一起使用在创建对象的语句中。
    特别的一个类可以有多个构造函数 ，可根据其参数个数的不同或参数类型
    的不同来区分它们 即构造函数的重载。*/
// 1-创建对象的方法
/*  1-1.工厂模式 2.构造函数模式 3.原型模式 4.构造函数与原型组合 
    5.寄生构造函数 6.动态原型 7.稳妥构造函数*/

//工厂模式
function createPerson(name){
    var o  = new Object()
    o.name = name;
    o.sayName = function(){
        console.log(this.name)
    }
    return o 
}
var person1 = createPerson('zjf')
person1.sayName()
//构造函数模式
function Person(name){
    this.name = name
    this.sayName = function(){
        console.log(this.name)
    }
}
var Person2 = new Person('zjf1')
Person2.sayName()

//原型模式
function Person1(){

}
Person1.prototype= {
    constructor : Person1,
    name: 'zjf3',
    sayName: function(){
        console.log(this.name)
    }
}
var person3 = new Person1()
person3.sayName()
//组合使用构造与原型
function PersonX(name){
    this.name = name
}
PersonX.prototype= {
    constructor : PersonX,
    sayName: function(){
        console.log(this.name)
    }
}
 var person4 = new PersonX('zjf4')
 person4.sayName()
 //动态原型：略
 //寄生构造
 function Personjisheng(name){
     var o = new Object()
     o.name = name
     o.sayName = function(){
         console.log(this.name)
     }
     return o 
 }
 var person5 = new Personjisheng('zjf5')
person5.sayName()
//稳妥构造函数：略

 //2-继承的方法
 //1.实现原型链
 function SuperType(){
     this.prototype = true
 }
 SuperType.prototype.getSuperValue = function(){
     console.log(this.prototype)
 }
 function SubType(){
     this.subPrototype = false
 }
 SubType.prototype = new SuperType()
 SubType.prototype.getSubValue = function(){
     console.log(this.prototype)
 }
var i = new SubType();
var k = new SuperType()
i.getSuperValue()
console.log(i instanceof Object)
//包含引用类型值的原型会被所有实例共享，不能向超类型的构造函数传递参数
//2.借用构造函数
function Super(name){
    this.color = ['1','2','3'],
    this.name = name
}
function Sub(){
    Super.call(this,'zjf')
}
var s1 = new Sub()
s1.color.push('4')
var s2  = new Sub()
console.log(s1.color,s2.name,s2.color)
//可以在子类型构造函数中向超类型构造函数传递参数，不能复用函数，因为都在构造函数中定义
//3.组合继承(常用)
function Super1(name){
    this.name = name;
    this.color = ['1','2','3']
}
Super1.prototype.sayName = function(){
    console.log(this.name)
}
function Sub1(name,age){
    //继承属性
    Super1.call(this,name)//第二次
    this.age = age
}
//继承方法
Sub1.prototype = new Super1()//第一次
Sub1.prototype.constructor = Sub1
Sub1.prototype.sayAge = function(){
    console.log(this.age)
}
var o = new Sub1('zjf',22)
o.color.push('4')
o.sayName()
o.sayAge()
var o1 = new Sub1()
console.log(o.color,o1.color)
//instanceof 和isPrototypeOf（）能识别对象，不足：调用两次超类型构造函数，一次是在创建子类型原型
//的时候，另一次是在子类型构造函数的内部
//4.原型式继承
var personyuanxingshi = {
    name: 'zjf',
    friends: ['girls','many']
}
var anotherPerson = Object.create(personyuanxingshi)
anotherPerson.friends.push('boys')
var yetanotherPerson = Object.create(personyuanxingshi)
console.log(anotherPerson.friends,yetanotherPerson.friends)
//引用类型值也会共享
//5.寄生式继承
function createAnother(original){
    var clone = Object(original);
    clone.sayHi = function(){
        console.log('hi')
    };
    return clone
}
var personxx = {
    name:'zjff',
    friends:['1','2','3']
}
var xx = createAnother(personxx)
xx.sayHi()
//函数不能复用
//6.寄生组合式继承（最理想）
function init(subType,superType){
    var prototype = Object(superType.prototype)
    prototype.constructor = subType
    subType.prototype = prototype
}
function SuperXX(name){
    this.name = name
    this.color = [1,2,3]
}
SuperXX.prototype.sayName = function(){
    console.log(this.name)
}
function SubXX(name){
    SuperXX.call(this,name)
}
init(SubXX,SuperXX)
var xxx = new SubXX('zjfxxx')
xxx.sayName()
console.log(SubXX.prototype.constructor)
//只调用一次super的构造函数