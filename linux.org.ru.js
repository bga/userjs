// ==UserScript==
// @include        https://www.linux.org.ru/*
// @name LOR correct pagePrev/Next
// @author Bga
// @version 0.1
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


//# annoying [#comments] anchor.  
if(location.hash == "#comments") {
  //# set "#" instead, jumps to top
  // location.hash = ""
  location.replace(location.protocol + "//" + location.hostname + location.pathname + location.search)
}

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
      //# disable logging
      var opera = { postError: function() {  } }
      
      var main = function(e) {
        
        //# Alt+Left/Right jumps by comments, not by topics
        if(1) {
          var prevHref = xPath("//a[@class='page-number' and position() = 1]").each(function(v) {
            opera.postError("prev " + v.href)
            return v.href
          })
          var nextHref = xPath("//a[@class='page-number' and position() = count(../a)]").each(function(v) {
            opera.postError("next " + v.href)
            return v.href
          })

          var prevs = xPath("//*[@rel='prev' or @rel='Prev']")
          if(prevs.length == 0) {
            if(prevHref != null) {
              document.head.appendChild(de("<link rel=prev href='" + prevHref + "'/>"))
            }
          }
          else {
            prevs.each(function(v) {
              opera.postError("del " + v.href)
              if(v.tagName == "LINK") {
                v.href = prevHref 
              }
              else {
                v.removeAttribute("rel")
              }
            })
          }

          var nexts = xPath("//*[@rel='next' or @rel='Next']")
          if(nexts.length == 0) {
            if(nextHref != null) {
              document.head.appendChild(de("<link rel=next href='" + nextHref + "'/>"))
            }
          }
          else {
            nexts.each(function(v) {
              opera.postError("del " + v.href)
              if(v.tagName == "LINK") {
                v.href = nextHref 
              }
              else {
                v.removeAttribute("rel")
              }
            })
          }  
        }
      }
      
      onDOMReady(main)
    }
  })
})(this)
