// ==UserScript==
// @name           twitter
// @include        https://hackaday.io/*
// @description    
// ==/UserScript==

opera.addEventListener('BeforeExternalScript', function(js) {
  // opera.postError(js.element)
  js.preventDefault()
}, false)

opera.addEventListener('BeforeScript', function(js) {
  // opera.postError(js.element)
  js.preventDefault()
}, false)

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
      onDOMReady(function() {
        setProtoExpando()
        
        var log = 1 ? logRaw : logNull
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
