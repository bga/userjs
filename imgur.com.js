// ==UserScript==
// @name           mysku redirect free
// @include        https://imgur.com/*
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

;(function(global, undefined) {

  var urlMatch = location.pathname.match(/^\/(\w+)$/) 
  if(urlMatch != null) {
    location.replace("".concat("https://imgur.com/", urlMatch[1], ".png"))
  }
  else {
    
  }

})(this)

;(function(global) {
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
      opera.postError("imgur.com")
      onDOMReady(function() {
        
        //# show gallery' images
        var urlMatch = location.pathname.match(/^\/a|gallery\/(\w+)$/)
        if(urlMatch == null) {
          
        }
        else {
          document.getElementsByClassName("post-images")[0].children.each(function(node) {
            if(node.tagName.toUpperCase() == "DIV" && node.id != "") {
              var div = node
              if(div.id != null) {
                div.replace(de("".concat("<img src='https://i.imgur.com/", div.id, ".png'/>")))
              }
              else {
                
              }
            }
            else {
              
            }
          })
        }
      })
    }
  })
})(this)
