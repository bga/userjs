// ==UserScript==
// @name           mysku redirect free
// @include        https://mysku.ru/*
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
        
        //# All shop links are referral free
        document.getElementsByTagName("A").each(function(a) {
          var hrefMatch = a.href.match(/^http(s?)\:\/\/go(\.mysku\.ru|\.promostack\.ru)\/\?(.*)$/)
          if(hrefMatch != null) {
            if(0) log(hrefMatch[2])
            a.href = parseQueryString(hrefMatch[3])["r"]
          }
          else {
            
          }
        })
        
        //# All images are clickable
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
