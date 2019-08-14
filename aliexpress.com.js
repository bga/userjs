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

//# without product path modification we can not show product' description 
if(location.pathname.match(/\/item\/\d+.html$/)) (function() {
  if(0) location.pathname = location.pathname.replace("/item/", "/item/product/")
})()


//# redirect to non locale website version
if(location.hostname != "www.aliexpress.com") (function() {
  var region = "RU"
  var currency = "USD"
  
  document.cookie = "intl_locale=en_US;path=/;max-age=5000;domain=.aliexpress.com"
  document.cookie = "xman_us_f=x_locale=en_US&x_l=0;path=/;max-age=5000;domain=.aliexpress.com"
  document.cookie = "".concat("aep_usuc_f=site=glo&c_tp=", currency, "&region=", region, "&b_locale=en_US;path=/;max-age=5000;domain=.aliexpress.com")
  location.hostname = "www.aliexpress.com"
})()

//# if search page
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
      setProtoExpando()
      document.documentElement.removeInlineEvents()
      
      var log = 1 ? logRaw : logNull
      //log("aliexpress")
      
      onDOMReady(function() {

      //# adds "Short Url" garbage free link near "Show in english" 
        var multiLanguageSwitch = document.getElementsByClassName("multi-language-switch")[0] || document.getElementsByClassName("product-name")[0] 
        if(multiLanguageSwitch != null) {
          var shortUrl = "".concat(location.protocol, "//", [].concat(["www"], location.host.split(".").slice(1)).join("."), location.pathname)
          multiLanguageSwitch.appendChild(de("".concat('<br><a href="', shortUrl, '">Short URL</a>')))
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
        
        //# show description. New style
        if(1) (function() {  
          var descriptionJsonText = document.getElementsByTagName("script").each(function(script) {
            var $r = null
            do {
              if(script.text == "") {
                break
              }
              
              var urlMatch = script.text.match(/\bwindow\.runParams\s*\=\s*([\s\S]*?(?:\}\;))/)
              if(urlMatch == null) {
                break
              }
              $r = unescapeCString(urlMatch[1])
            } while(0);
            
            return $r
          })
          if(descriptionJsonText == null) {
            
          }
          else {
            var descriptionJson = null
            try {
              descriptionJson = JSON.parse(descriptionJsonText.match(/data\:\s([\s\S]*?),\n/)[1])
            }
            catch(err) {
              log(err)
            }
            
            if(descriptionJson == null) {
              
            }
            else {
              var price = descriptionJson.priceModule.formatedPrice
              var descriptionUrl = descriptionJson.descriptionModule.descriptionUrl
              log("descriptionUrl", descriptionUrl)
              fetch(descriptionUrl).then(function(response) { 
                if(response.ok) {
                  document.getElementById("root").innerHTML = ""
                  document.getElementById("root").appendChild(de("".concat(
                    "<h2>", document.title, "</h2>", 
                    "<h2>", price, "</h2>", 
                    response.body.text()
                  )).removeScripts().removeInlineEvents())
                }
              })
            }
          }
        })()
        
        //# show description. Old style
        if(0) (function() {  
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

