// ==UserScript==
// @include        https://www.avito.ru/*
// @name big images 
// @author Bga
// @version 0.1
// @description 
// ==/UserScript==

;(function(global, undefined) {
  var yes = !0, no = !1
  
  //# avito profile with original js
  if(location.pathname.match(/^(\/additem|\/items|\/profile)/) != null) {
    //# inside account - do nothing
  }
  else if(location.hash != "") {
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
          
          //# remove new js custom select box
          try {
            document.getElementsByClassName("search-form__change-location").each(function(v) { v.remove() })
          }
          catch(e) {
            
          }
          
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

          //# click on interactive buttons reload page with vendor scripts and than we programmatically click desired button
          //# dont know but without that code button onclick does not work  
          if(document.getElementsByClassName("item-phone-button")[0] != null) {
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
            ;(document.getElementsByClassName("catalog")[0] || document.getElementsByClassName("catalog_table")[0] || skip()).getElementsByTagName("noscript").each(function(noscript) {
              log(noscript.innerText)
              noscript.replace(de("".concat(noscript.innerText)))
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
        }
        
        onDOMReady(main)
      }
    })
  }
  
})(this)  

