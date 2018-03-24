// ==UserScript==
// @include        http://forum.ixbt.com/*
// @name anti doc.write 
// @author Bga
// @version 0.1
// @description 
// ==/UserScript==

;(function(undefined) {

window.t_top1 = function() {
  
}
window.t_top2 = function() {
  document.write("<pre style='text-align: left; white-space: pre-wrap'>")
}
window.t_post = function(id, userName, userHash, time, msg) {
  var d = new Date(time * 1000)
  var pad = function(s) {
    return ("0" + s).slice(-2)
  }
  document.write("".concat(
    "[", 
        d.getFullYear(), 
        "/", 
        pad(d.getMonth()), 
        "/", d.getDate(), 
      " ", 
        pad(d.getHours()), 
        ":", 
        pad(d.getMinutes()), 
        ":", 
        pad(d.getSeconds()), 
    "] ",
    "<", userName, "> ", 
    msg, 
    "<br>"
  ))
}
window.t_bottom = function() {
  document.write("</pre>")
}
window.t_bottom2 = function() {
  
}


opera.addEventListener('BeforeExternalScript', function(js) {
  // opera.postError(js.element)
  js.preventDefault()
}, false)

// opera.addEventListener('BeforeScript', function(js) {
  // js.preventDefault()
  // if(js.element.text.indexOf("\\u003cembed") < 0 && js.element.text.indexOf("yt.playerConfig =") < 0) {
  // }
// }, false)


!(function(global) {
  var waitCommon = function(fn) {
    if(global.Bga) {
      fn()
    }
    else {
      setTimeout(function() {
        waitCommon(fn)
      }, 0)
    }
  }
  
  waitCommon(function() {
    with(Bga) {
      var log = function() {  }
      
      onDOMReady(function() {
  
      })
    }
  })
})(this)  

})()

