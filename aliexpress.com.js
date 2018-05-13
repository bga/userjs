// ==UserScript==
// @include        https://ru.aliexpress.com/*
// @name some helpers
// @author Bga
// @version 0.1
// @description 
// ==/UserScript==

/*
opera.addEventListener('BeforeExternalScript', function(js) {
  js.preventDefault()
}, false)
opera.addEventListener('BeforeScript', function(js) {
  js.preventDefault()
}, false)
*/

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
      var log = 1 ? logRaw : logNull
      //log("aliexpress")
      
      onDOMReady(function() {
        var multiLanguageSwitch = document.getElementsByClassName("multi-language-switch")[0]
        if(multiLanguageSwitch != null) {
          var shortUrl = "".concat(location.protocol, "//", [].concat(["www"], location.host.split(".").slice(1)).join("."), location.pathname)
          multiLanguageSwitch.appendChild(de("".concat('<a href="', shortUrl, '">Short URL</a>')))
        }
        else {
          
        }
      })
    }
  })
})(this)  

