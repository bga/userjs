// ==UserScript==
// @name           mysku redirect free
// @include        https://mysku.ru/*
// @description    decode links
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
  
        document.getElementsByTagName("A").each(function(a) {
          var hrefMatch = a.href.match(/^http(s?)\:\/\/go(\.mysku\.ru|\.promostack\.ru)\/\?(.*)$/)
          if(hrefMatch != null) {
            if(0) log(hrefMatch[2])
            a.href = parseQueryString(hrefMatch[3])["r"]
          }
          else {
            
          }
        })
        document.getElementsByTagName("IMG").each(function(img) {
          if(100 <= img.offsetWidth && 100 <= img.offsetHeight) {
            img.wrap(de("".concat('<a href="', img.src, '" ><content /></a>')))
          }
          else {
            
          }
        })
        
      })
    }
  })
})(this)
