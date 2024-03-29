// ==UserScript==
// @include        https://www.avito.ru/*
// @name big images
// @author Bga
// @version 0.1
// @description
// ==/UserScript==

;(function(global, undefined) {
  var yes = !0, no = !1
  
  const localCityUrl = "/sankt-peterburg";
  const localCityName = "Санкт - Петербург";
  
  //# avito profile with original js
  if(location.pathname.match(/^(\/additem|\/items|\/profile)/) != null) {
    //# inside account - do nothing
  }
  else if(0 && location.hash != "") {
    //# reload page with original js to allow user see phone or write message to seller
    window.addEventListener("load", function() {
      switch(location.hash) {
        case("#showPhone"): {
          document.getElementsByClassName("item-phone-button")[0].click()
        } break
        case("#writeMessage"): {
          document.getElementsByClassName("write-message-btn")[0].click()
        } break
        default: {

        } break
      }
    }, no)
  }
  else {
    //# disable original js
    opera.addEventListener('BeforeExternalScript', function(js) {
      //? opera.postError(js.element)
      js.preventDefault()
    }, no)
    opera.addEventListener('BeforeScript', function(js) {
      //? opera.postError(js.element)
      js.preventDefault()
    }, no)


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
        setProtoExpando()
        document.documentElement.removeInlineEvents()

        var log = 1 ? logRaw : logNull
        if(0) log("Bga")
        if(0) var log = function() {  }

        var main = function() {

          //# unhide page
          if(1) try { (function() { 
            document.getElementById("S:0").removeAttribute("hidden");
            document.getElementById("S:1").removeAttribute("hidden");
          }) } catch(err) {  }
          
          //# remove new js custom select box
          try {
            document.getElementsByClassName("search-form__change-location").each(function(v) { v.remove() })
          }
          catch(e) {

          }
          
          //# delete ad items 
          if(1) try { (function() {
            document.querySelectorAll("a[data-marker=item-link]").each(function(v) {
              v.up("js-catalog-item-enum").remove()
            })
          })() } catch(err)  {  }

          //# delete ad items 
          if(0) try { (function() {
            document.querySelectorAll("div[class*=iva-item-description-]").each(function(v) {
              v.up("js-catalog-item-enum").remove()
            })
          })() } catch(err)  {  }

          //# fix search form
          if(1) try { (function() {
            var hashText = function(s) {
              return s.trim().toUpperCase().replace(/\s+/g, " ")
            }
            
            var searchInput = document.getElementById("search");
            var form = document.body.prependChild(de("<form action=/ id=searchForm />"));
            searchInput.setAttribute("form", "searchForm");
            
            var oldSearchTextHash = hashText(searchInput.value);
            form.addEventListener("submit", function(ev) {
              ev.preventDefault();

              var newSearchText = searchInput.value.trim();
              if(newSearchText.length == 0 || hashText(newSearchText) == oldSearchTextHash) return;
              
              location.search = "?" + stringifyQueryString(parseQueryString(location.search.slice(1))
                .tap(function(queryParamsMap) { queryParamsMap["q"] = newSearchText }
              ))
              
            }, false)
          })() } catch(err) {  }

          //# global search link + hotkey
          if(1) try { (function() {
            var labelsDiv = document.querySelector("div[class^=form-part-additions-] > div[class^=filters-root-]");
            var labels = labelsDiv.getElementsByTagName("LABEL");
            var lastLabel = labels[labels.length - 1];
            var globalSearchUrl = "".concat("/rossiya", location.search)
            lastLabel.parentNode.appendChild(de("".concat("&nbsp;<a href='", globalSearchUrl, "' title=Россия accessKey=R>Россия</a>")))
            lastLabel.parentNode.appendChild(de("".concat("&nbsp;<a href='", "".concat(localCityUrl, location.search), "' title='", localCityName, "' accessKey=L>", localCityName, "</a>")))
          })() } catch(err) {  }


          //# simplified gallery
          if(document.getElementsByClassName("js-gallery-imgs-container")[0] != null) {
            var newGallery = document.createDocumentFragment()
            document.getElementsByClassName("js-gallery-img-frame").each(function(v) {
              newGallery.appendChild(de("".concat("<a href='", v.getAttribute("data-url"), "'><img src='", v.getAttribute("data-url"), "'></a>")))
            })

            document.getElementsByClassName("item-view-gallery")[0].innerHTML = ""
            document.getElementsByClassName("item-view-gallery")[0].appendChild(newGallery)
          }
          else {

          }

          //# simplified gallery v2
          if(1) try { (function() {  
            var maxImgSize = "600px"
            
            var parseDims = function(s) {
              return s.split("x").map(function(dim) { return parseInt(dim) })
            }
            var calcDimsArea = function(dims) {
              return dims[0] * dims[1]
            }
            var getMaxKey = function(v) {
              var keys = Object.keys(v).map(function(k) { return { k: k, area: calcDimsArea(parseDims(k)) } })
              return keys.sort(function(a, b) { return b.area - a.area })[0].k
            }
            
            var jsonMarker = "window.__initialData__"
            var jsonText = null;
            ;([].slice.call(document.getElementsByTagName("SCRIPT")).forEach(function(v) { 
                var t = v.innerText; 
                var p = t.indexOf(jsonMarker)
                if(p == -1) return; 

                var p2 = t.indexOf('"', p + jsonMarker.length);
                var p3 = matchCStringEnd(t, p2)
                
                // jsonText = unescapeCString(js.element.innerText.slice(p2, p3))
                //# faster alternative for very big strings
                jsonText = decodeURIComponent(Function("return " + js.element.innerText.slice(p2, p3))())
              }
            )
            var json = JSON.parse(jsonText)
            var imgUrls = json[Object.keys(json).filter(function(k) { return k.indexOf("item-view") != -1 })].buyerItem.galleryInfo.media.map(function(v) { return v.urls[getMaxKey(v.urls)] })
            
            var newGallery = document.createDocumentFragment()
            imgUrls.each(function(url) {
              newGallery.appendChild(de("".concat("<a width=", maxImgSize, " href='", url, "'><img src='", url, "'></a>")))
            })

            var galleryDom = document.getElementByClassPrefix("gallery-block-new-style-container-") 
            galleryDom.innerHTML = ""
            galleryDom.appendChild(newGallery)
          })() }
          catch(err) {
          }

          //# fix pagination
          if(1) try {
            var newSearch = stringifyQueryString(parseQueryString(location.search.slice(1)).tap(function(map) {
              delete(map["p"])
            }))
            document.getElementsByClassName("js-pages")[0].querySelectorAll("[data-marker]").each(function(v) {
              var page = (v.getAttribute("data-marker").match(/^page\((\d+)\)$/) || [])[1]
              v.wrap(de("".concat("<a href='", "".concat(location.pathname, "?", newSearch, "&p=", page), "'><content /></a>")))
            })
          } catch(err) {  }


          //# click on interactive buttons reload page with vendor scripts and than we programmatically click desired button
          //# dont know but without that code button onclick does not work
          if(0 && document.getElementsByClassName("item-phone-button")[0] != null) {
            document.getElementsByClassName("item-phone-button")[0].parentNode.innerHTML="Ololo"

            document.getElementsByClassName("item-phone-button")[0].addEventListener("click", function() {
              location.hash="#showPhone"
              location.reload()
              return no
            }, no)
            document.getElementsByClassName("write-message-btn")[0].addEventListener("click", function() {
              location.hash="#writeMessage"
              location.reload()
              return no
            }, no)
          }
          else {

          }

          try {
            //# show all images in products listing
            ;(document.getElementsByClassName("catalog")[0] || document.getElementsByClassName("catalog_table")[0] || document.getElementsByClassName("snippet-list")[0]  || skip()).getElementsByTagName("noscript").each(function(noscript) {
              // log(noscript.innerText)
              // noscript.replace(de("".concat(noscript.innerText)))
            })
          }
          catch(err) {
            if(!(err instanceof SkipError)) {
              throw err
            }
          }


          //# show 1st image of slider photos
          if(1) document.getElementsByClassName("item-slider").each(function(sliderDom) {
            if(0) sliderDom.className = "photo-wrapper js-photo-wrapper large-picture"
            var firstImage = sliderDom.getElementsByClassName("item-slider-image")[0].getElementsByTagName("IMG")[0]
            var photoUrl = firstImage.getAttribute("src")
            sliderDom.innerHTML = ""
            sliderDom.appendChild(de("".concat('<img src="', photoUrl, '" class="photo-count-show large-picture" alt="">')))
          })

          //# show 1st image of slider photos
          if(0) document.querySelectorAll("ul[class^=photo-slider-list-]").each(function(v) {
            var firstImageLi = v.children[0]
            //# { "slider-image/image-https://72.img.avito.st/208x156/DDDDDDDDDD.jpg" }
            var photoUrl = (firstImageLi.getAttribute("data-marker") || "").replace("slider-image/image-https:", "https:")
            v.parentNode.replace(de("".concat('<img src="', photoUrl, '" class="photo-count-show large-picture" alt="">')))
          })
        }

        onDOMReady(main)
      }
    })
  }

})(this)

