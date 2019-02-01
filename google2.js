// ==UserScript==
// @include        http://www.google.ru/*
// @include        https://www.google.ru/*
// ==/UserScript==

!(function(global) {
  var isTurnOffBlocker = false
  var blocker = function(js) {
    if(!isTurnOffBlocker) {
      opera.postError("blocking " + (js.element.src || "inline"))
      js.preventDefault()
    }
    else {
      opera.postError("passing " + (js.element.src || "inline"))
    }
  }
  opera.addEventListener('BeforeExternalScript', blocker, false)
  opera.addEventListener('BeforeScript', blocker, false)
})(this)

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
      var log = 0 ? logRaw : logNull
      opera.postError("here")
      0 && onDOMReady(function() {

        //# its all related direct links to images in [images.google.com] and currently is not working
        if(0) {
          var table = document.getElementsByClassName("images_table")[0]
          //# images
          if(table != null && table.tagName.toLowerCase() == "table") {
            var imagesPerPage = 40
            var maxResultsPerQuery = 8
            
            var queryParams = parseQueryString(location.search.slice(1))
            
            //? rename
            var contextToCallback = {  }
            
            var nextUuid = 0
            var uuid = function() {
              return nextUuid++
            }
  
            /*
            opera.addEventListener('BeforeExternalScript', function(js) {
              for(var i in contextToCallback) {
                if(contextToCallback[i].script == js.element) {
                  log("dont prevent")
                  return true
                }
              }
              js.preventDefault()
            }, false)
            */
            /*
            opera.addEventListener('BeforeExternalScript', function(js) {
              js.preventDefault()
            }, false)
            */
            opera.removeEventListener("BeforeExternalScript", blocker, false)
            opera.removeEventListener("BeforeScript", blocker, false)
            isTurnOffBlocker = true
            opera.addEventListener('BeforeScript', function(js) {
              log(js.element.src)
              for(var i in contextToCallback) {
                if(contextToCallback[i].script == js.element) {
                  log("dont prevent")
                  return true
                }
              }
              js.preventDefault()
            }, false)
            
            var fetchImages = function(range, onRet) {
              assert(0 < range[1] - range[0] && range[1] - range[0] <= maxResultsPerQuery)
              global.onImageSearch = function(context, $r, httpStatus) {
                log("context", context)
                assert(contextToCallback[context])
                if(httpStatus == 200) {
                  contextToCallback[context].onRet($r)
                }
                contextToCallback[context].script.remove()
                delete(contextToCallback[context])
              } 
              var script = document.createElement("script")
              var id = uuid()
              contextToCallback[id] = { onRet: onRet, script: script }
              script.type = "text/javascript"
              script.src = "".concat(location.protocol, "//ajax.googleapis.com/ajax/services/search/images?v=1.0",
                "&q=", encodeURIComponent(queryParams["q"]), 
                "&start=", range[0], 
                //"&rls=en", 
                "&hl=ru-RU", 
                //"&sa=N",
                //"&ei=", queryParams["ei"], 
                "&safe=", encodeURIComponent(queryParams["safe"]), 
                "&rsz=", range[1] - range[0], 
                "&callback=onImageSearch", 
                "&context=", id
              )
              script.onload = function() {
                
              }
              log(script.src)
              document.head.insertBefore(script, document.head.firstChild)
              //document.head.appendChild(script)
            }
            
            // var trTml = table.rows[0].cloneNode(true)
            
            // while(table.rows.length > 0) table.rows
            var queryStart = +(queryParams["start"] || "0")
            queryStart = Math.max(queryStart - 10, 0)
            for(var start = queryStart; start < queryStart + imagesPerPage; start += maxResultsPerQuery) with({ start: start }) {
              fetchImages([start, Math.min(start + maxResultsPerQuery, queryStart + imagesPerPage)], function($r) {
                var imgsDescs = $r.results
                log(imgsDescs.length + "!")
                //return
                for(var i = 0; i < imgsDescs.length; i += 1) {
                  var imgDesc = imgsDescs[i]
                  var id = imgDesc.imageId
                  //log(id + "")
                  var imgs = table.getElementsByTagName("img")
                  var j = 0
                  for(;;) {
                    if(j == imgs.length) {
                      break
                    }
                    if(imgs[j].src.slice(-id.length) == id) {
                      break
                    }
                    j = j + 1
                  }
                  if(j != imgs.length) {
                    var td = imgs[j].parentNode.parentNode
                    var cite = td.getElementsByTagName("cite")[0]
                    cite.replace(de("".concat("<a href='", imgs[j].parentNode.href, "'>", cite.innerHTML, "</a>")))
                    imgs[j].parentNode.href = imgsDescs[i].unescapedUrl
                  }
                }
              })
            }
  
            var i = links.length; while(i--)
            {
              var link = links[i]
              var href = link.getAttribute('href')
              if(href != null && /^\/imgres\?/.test(href))
              {  
                href = href.slice(8).replace(/&amp;/g, '&')
                var url = /(^|&)imgurl=(.*?)(&|$)/.exec(href)
                var src = /(^|&)imgrefurl=(.*?)(&|$)/.exec(href)
                if(url != null) {
                  url[2] = url[2].replace(/%25(?=\d)/g, '%')
                  link.href = url[2]
                  //link.href = unescape(url[2])
                  var cite = link.parentNode.getElementsByTagName('cite')[0]
                  cite.innerHTML = '<a href="' + unescape(src[2]) + '">' + cite.innerHTML + '</a>'
                }
              }
            }
          }
          else {
            /*
            opera.addEventListener('BeforeScript', function(js) {
              //log(js.element.src)
              js.preventDefault()
            }, false)
            opera.addEventListener('BeforeExternalScript', function(js) {
              js.preventDefault()
            }, false)
            */
          }
        }
        
        //# adds cache link to each result
        if(1) {
          document.getElementsByClassName("g").each(function(v) {
            var li = v
            try {
            var url = li.firstChild.getElementsByTagName("a")[0].href
              var kv = li.getElementsByClassName("kv")[0]
              if(kv) {
                var cite = kv.getElementsByTagName("cite")[0]
                cite.parentNode.insertBefore(de("".concat(' <a target=_blank href="http://www.google.com/search?q=cache:', url, '">cache</a>')), cite.nextSibling)
              }
            }
            catch(err) {
              
            }
          })
        }
        
        
      })
    }
  })
})(this)
