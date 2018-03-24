// ==UserScript==
// @include        http://yandex.ru/yandexsearch?*
// ==/UserScript==

(function(global, undefined) {
  var console = { log: function() {  } }
  var blockJsHandlers = function(e) {
    console.log(e.target)
    if(e.target.nodeName == "A") {
      console.log(e.target.nodeName)
      e.stopImmediatePropagation()
      e.stopPropagation()
    }
    else {
      
    }
  }
  document.addEventListener("mousedown", blockJsHandlers, true)
  document.addEventListener("click", blockJsHandlers, true)
})((1, eval)("this"))