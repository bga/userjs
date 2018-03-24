// ==UserScript==
// @name           twitter
// @include        https://hackaday.io/*
// @description    
// ==/UserScript==

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
      disableAllScripts()
      onDOMReady(function() {
        //# lazy imgs to real
        document.getElementsByTagName("IMG").each(function(img) {
          if(img.hasClass("lazy")) {
            img.src = img.getAttribute("data-src")
          }
          else {
            
          }
        })
      })
    }
  })
})(this)
