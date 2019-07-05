// ==UserScript==
// @include        https://ibb.co/*
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
      setProtoExpando()
      document.documentElement.removeInlineEvents()
      
      var log = 1 ? logRaw : logNull
      opera.postError("here")
      onDOMReady(function() {
        //# direct image url
        imgUrl = null
        document.head.getElementsByTagName("meta").each(function(meta) {
          if(meta.getAttribute("property") == "og:image") {
            imgUrl = meta.getAttribute("content")
          }
        })
        if(imgUrl != null) {
          location.replace(imgUrl)
        }
        else {
          
        }
      })
    }
  })
})(this)
