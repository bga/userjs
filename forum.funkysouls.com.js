// ==UserScript==
// @include        http://forum.funkysouls.com/*
// @name 
// @author Bga
// @include        http://forum.funkysouls.com/*
// @version 0.1
// @description 
// ==/UserScript==

opera.addEventListener('BeforeExternalScript', function(js) {
  js.preventDefault()
}, false)
opera.addEventListener('BeforeScript', function(js) {
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
      
      var log = 0 ? logRaw : logNull
      //disableAllScripts()
      log("funkysouls")
      //# fix volume
      
      onDOMReady(function() {
        
        //# replace youtube iframes to links
        if(1) {
          var toYoutubeAnchor = function(vId) {
            var vHref = "http://www.youtube.com/watch?v=" + vId
            return de("".concat("<a href='", vHref, "'>", vHref, "</a>"))
          }
          document.getElementsByTagName("iframe").each(function(v) {
            v.replace(toYoutubeAnchor(v.src.match(/\/embed\/([\w\-]+)/i)[1]))
          })
          document.getElementsByTagName("object").each(function(v) {
            v.replace(toYoutubeAnchor(v.getElementsByTagName("embed")[0].src.match(/\/v\/([\w\-]+)/i)[1]))
          })
        }
      })
    }
  })
})(this)  

