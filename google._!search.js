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

        //# hotkeys
        if(0) (function() {
          var tabsDom = document.getElementById("hdtb-msb").querySelectorAll("*[role=tab]")
          var setAccessKey = function(title, accesskey, description) {
            (description == null) || (description = title)
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
            var hashText = function(t) {
              return t.replace(/\s+/, " ").trim().toLowerCase()
            }
            var titleHash = hashText(title)
            var tabDom = [].slice.call(tabsDom).filter(function(v) { return hashText(v.textContent) == titleHash })[0]
            withAnchor(tabDom.getElementsByTagName("A")[0], function(v) {
              v.accessKey = accesskey
              v.title = description
            })
          }
          setAccessKey("All", "A")
          setAccessKey("Images", "I")
          setAccessKey("Videos", "V")
        })()

        //# hotkeys
        if(1) (function() {
          var setAccessKey = function(description, accesskey, url) {
            var v = de("<a />")
            v.href = url
            v.accessKey = accesskey
            v.title = description
            document.body.appendChild(v)
          }
          setAccessKey("All", "A", location.toString().replace(/([?&])tbm=[^&]*(?=&)/g, "$1"))
          log(location.toString().replace(/([?&])tbm=[^&]*(?=&)/g, "$1tbm=isch"))
          setAccessKey("Images", "I", ((location.toString().match(/([?&])tbm=[^&]*(?=&)/g)) ? location.toString().replace(/([?&])tbm=[^&]*(?=&)/g, "$1tbm=isch") : location.toString() + "&tbm=isch"))
          setAccessKey("Videos", "V", ((location.toString().match(/([?&])tbm=[^&]*(?=&)/g)) ? location.toString().replace(/([?&])tbm=[^&]*(?=&)/g, "$1tbm=vid") : location.toString() + "&tbm=vid"))
        })()

        //# search images
        if(locationQueryParams["tbm"] == "isch") (function() {
          document.getElementById("rg_s").style.display = ""
          document.getElementById("rg_s").style.visibility = "visible"

          var loadMore = function() {
            var rg_s = document.getElementById("rg_s")

            var i = 20
            document.getElementsByClassName("rg_add_chunk")[0].getElementsByClassName("rg_di").each(function(v) {
              --i >= 0 && rg_s.insertBefore(v, rg_s.lastChild)
            })
          }

          //# styles was stealed from YouTube channel's videos Load More button
          document.getElementById("rg_s").appendChild(de("".concat("<center><button id=loadMoreButton accesskey=L title='Load more' style='outline: #767676 solid 1px; width: 82px; height: 28px; border-radius: 2px; box-shadow: 0px 0px 0px 2px rgba(27, 127, 204, 0.400);'>Load More</button></center>")))
          document.getElementById("loadMoreButton").addEventListener("click", function(ev) {
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

        //# lazy loading images
        if(1) (function() {
          var descriptionJson = null
          try {
            descriptionJson = JSON.parse(document.getElementById("xfoot").getElementsByTagName("script")[0].text.match(/\bgoogle\.ldi\s*\=\s*([\s\S]*?(?:\}\;))/)[1].slice(0, -1))
          }
          catch(err) {
            log(err)
          }

          if(descriptionJson == null) {

          }
          else {
            Object.keys(descriptionJson).forEach(function(domId) {
              ;(document.getElementById(domId) || { src: "" }).src = descriptionJson[domId]
            })
          }
        })() 

        //# lazy loading images
        if(1) (function() {
          ;([].slice.call(document.getElementsByTagName("script"))
            .filter(function(v) {
              return v.text != ""
            })
            .map(function(v) {
              return v.text.matchAll(/\bvar\s+s\s*\=s*\'([\s\S]+?)\';\s*var\s+ii\s*\=\s*\[\'([\s\S]+?)\'\];\s*_setImagesSrc\(ii\,s\);/)
            })
            .flat()
            .forEach(function(match) {
              ;(document.getElementById(match[2]) || { src: "" }).src = match[1]
            })
          )
        })()
      })
    }
  })
})(this)
