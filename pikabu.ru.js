// ==UserScript==
// @name           twitter
// @include        https://pikabu.ru/*
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
        document.documentElement.removeInlineEvents()
        
        var log = 1 ? logRaw : logNull

        //# show video
        if(1) (function() {
          var replaceExt = function(path, newExt) {
            var pathWithoutExt = path.slice(0, path.lastIndexOf("."))
            
            return pathWithoutExt + newExt
          }
          
          assert.eq(replaceExt("test.jpg", ".png"), "test.png")
          
          document.getElementsByClassName("player").each(function(player) {
            var src = player.getAttribute("data-source")
            var videoDom = de("".concat("<video controls width='", player.getAttribute("data-width"), "' height='", player.getAttribute("data-width"), "'/>"))
            
            if(player.getAttribute("data-size-webm")) {
              videoDom.appendChild(de("".concat("<source src='", replaceExt(src, ".webm"), "' type=video/webm />")))
            }
            if(player.getAttribute("data-size-mp4")) {
              videoDom.appendChild(de("".concat("<source src='", replaceExt(src, ".mp4"), "' type=video/mp4 />")))
            }
            player.replace(videoDom)
          })
        })()
        
      })
    }
  })
})(this)
