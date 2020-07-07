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

        //# lazy imgs to real
        document.getElementsByTagName("IMG").each(function(img) {
          if(img.getAttribute("data-src") != null) {
            img.src = img.getAttribute("data-src")
          }
          else {
            
          }
        })
        
        //# show video
        if(1) (function() {
          var replaceExt = function(path, newExt) {
            var pathWithoutExt = path.slice(0, path.indexOf(".", path.lastIndexOf("/")) >>> 0)
            
            return pathWithoutExt + newExt
          }
          
          assert.eq(replaceExt("test.jpg", ".png"), "test.png")
          assert.eq(replaceExt("/test", ".png"), "/test.png")
          
          document.getElementsByClassName("player").each(function(player) {
            var src = player.getAttribute("data-source")
            if(src.match(".youtube.com/")) {
              player.replace(de("".concat("<iframe src='", src, "' width='", player.getAttribute("data-width"), "' height='", player.getAttribute("data-height"), "'>")))
            }
            else {
              src = replaceExt(src, ".mp4")
              log("embed1")
              
              var w = 640
              var h = 480
              var volume = 0
              var videoDom = de("".concat('<embed src="', src, '" autostart="false" showcontrols="true" showstatusbar="1" type="application/x-mplayer2" bgcolor="white" style="width: ', w, 'px; height: ', h, 'px" volume="', volume, '">'))
              
              if(0) {
                var videoDom = de("".concat("<video controls width='", player.getAttribute("data-width"), "' height='", player.getAttribute("data-width"), "'/>"))
                
                if(player.getAttribute("data-size-webm")) {
                  videoDom.appendChild(de("".concat("<source src='", replaceExt(src, ".webm"), "' type=video/webm />")))
                }
                if(player.getAttribute("data-size-mp4")) {
                  videoDom.appendChild(de("".concat("<source src='", replaceExt(src, ".mp4"), "' type=video/mp4 />")))
                }
                
                videoDom.appendChild(de("".concat("<source src='", replaceExt(src, ".mp4"), "' type=video/mp4 />")))
                videoDom.appendChild(de("".concat("<source src='", replaceExt(src, ".webm"), "' type=video/webm />")))
              }
              
              player.replace(videoDom)
            }
          })
        })()
        
      })
    }
  })
})(this)
