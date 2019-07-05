// ==UserScript==
// @include        http://www.google.ru/*
// @include        https://www.google.ru/*
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
        
        var locationQueryParams = parseQueryString(location.search.slice(1))
        
        //# search images
        if(locationQueryParams["tbm"] == "isch") (function() {
          document.getElementById("rg_s").style.display = ""
          document.getElementById("rg_s").style.visibility = "visible"
          
          var loadMore = function() {
            var rg_s = document.getElementById("rg_s")
            
            var i = 20
            document.getElementsByClassName("rg_add_chunk")[0].getElementsByClassName("rg_di").each(function(v) {
              --i >= 0 && rg_s.appendChild(v)
            })
          }
          
          document.body.appendChild(de("<a href=# accesskey=L title='Load more'>")).addEventListener("click", function(ev) {
            loadMore()
            ev.preventDefault()
            return false
          }, false)
          
          document.getElementsByClassName("rg_di").each(function(v) {
            try {
              var meta = JSON.parse(v.getElementsByClassName("rg_meta")[0].textContent)
              
              var image = v.getElementsByClassName("rg_i")[0]
              image.src = meta["tu"]
              image.width = meta["tw"]
              image.height = meta["th"]
              
              var anchor = v.getElementsByClassName("rg_l")[0]
              anchor.href = meta["ou"]

              var webSiteAnchor = v.getElementsByClassName("iKjWAf")[0]
              webSiteAnchor.href = meta["ru"]
              
              v.getElementsByClassName("THL2l")[0].remove()
            }
            catch(err) {
              console.error(err, v)
            }
          })
        })()
        
        //# hotkeys 
        if(1) (function() {
          var tabsDom = document.getElementById("hdtb-msb").querySelectorAll("*[role=tab]")
          var setAccessKey = function(tabDom, accesskey, description) {
            var withAnchor = function(v, f) {
              if(v) {
                f(v)
              }
              else {
                v = de("<a />")
                f(v)
                document.body.appendChild(v)
              }
            }
            withAnchor(tabDom.getElementsByTagName("A")[0], function(v) {
              v.accessKey = accesskey
              v.title = description
            })
          }
          setAccessKey(tabsDom[0], "A", "All")
          setAccessKey(tabsDom[1], "I", "Images")
          setAccessKey(tabsDom[2], "V", "Videos")
        })()
      })
    }
  })
})(this)
