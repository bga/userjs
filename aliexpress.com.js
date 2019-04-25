// ==UserScript==
// @include        https://*.aliexpress.com/*
// @name some helpers
// @author Bga
// @version 0.1
// @description 
// ==/UserScript==

opera.addEventListener('BeforeExternalScript', function(js) {
  if(0) opera.postError("block external")
  js.preventDefault()
}, false)
opera.addEventListener('BeforeScript', function(js) {
  if(0) opera.postError("block inline")
  js.preventDefault()
}, false)

if(location.pathname.match(/\/wholesale$/) || location.pathname.match(/\/w\//)) (function() {
  var newQuery = location.search
  //# sort by price from lowest to highest by default
  newQuery.match(/(^|&|\?)SortType=.*?(&|$)/) || (newQuery += "&SortType=price_asc")
  //# free shipping by default
  newQuery.match(/(^|&|\?)isFreeShip=.*?(&|$)/) || (newQuery += "&isFreeShip=y")
  if(newQuery != location.search) {
    location.search = (location.search == "" ? "?" + newQuery.slice(1): newQuery)
  }
  else {
    
  }
})()

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
        //# adds "Short Url" garbage free link near "Show in english"
        var multiLanguageSwitch = document.getElementsByClassName("multi-language-switch")[0] || document.getElementsByClassName("product-name")[0] 
        if(multiLanguageSwitch != null) {
          var shortUrl = "".concat(location.protocol, "//", [].concat(["www"], location.host.split(".").slice(1)).join("."), location.pathname)
          multiLanguageSwitch.appendChild(de("".concat('<a href="', shortUrl, '">Short URL</a>')))
        }
        else {
          
        }
        
        //# show lazy loading images
        document.getElementsByClassName("picCore").each(function(v) {
          if(v.src == "") {
            v.src = v.getAttribute("image-src")
            v.addClass("pic-Core-v")
          }
          else {
            
          }
          
        })
        
        //# show description
        if(1) (function() {  
          var descriptionUrl = document.getElementsByTagName("script").each(function(script) {
            var $r = null
            do {
              if(script.text == "") {
                break
              }
              
              var urlMatch = script.text.match(/\bwindow\.runParams\.detailDesc\s*\=\s*([^;\n\r]*)/)
              if(urlMatch == null) {
                break
              }
              $r = unescapeCString(urlMatch[1])
            } while(0);
            
            return $r
          })
          if(descriptionUrl == null) {
            
          }
          else {
            log("descriptionUrl", descriptionUrl)
            fetch(descriptionUrl).then(function(response) { 
              if(response.ok) {
                document.getElementsByClassName("description-content")[0].innerHTML = response.body.text()
              }
            })
          }
        })()
      })
    }
  })
})(this)  

