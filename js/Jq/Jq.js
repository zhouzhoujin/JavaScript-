
(function (window) {
    var JQuery= function (selector) {
        return new JQuery.init(selector)
    } 
    
    //暴露的$.fn，用于扩展
    JQuery.fn = {
        constructor: JQuery,
        css: function () {
            console.log('css')
        }
    }
    //构造函数
    var init = JQuery.init = function(selector){
        var dom = document.querySelectorAll(selector)
    }
    //构造函数的原型等于暴露的$.fn
    init.prototype = JQuery.fn
    window.$ = JQuery

})(window)
