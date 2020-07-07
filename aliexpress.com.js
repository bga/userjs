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
  if(1) location.pathname = location.pathname.replace("/item/", "/i/")
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
    if(global.Bga && global.he) {
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

      //# another redirect
      if(1) (function() {
        var paramMap = parseQueryString(location.search.slice(1))
        do {
          var return_url = paramMap["return_url"]; if(return_url == null) break
          if(null == return_url.match(/\/item\//)) break
          location.replace(return_url.replace("/item/", "/i/"))
        } while(0);
      })()

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

        //# show listing
        if(1) if(location.pathname.match(/\/wholesale$/) || location.pathname.match(/\/w\//)) (function() {
          var descriptionJsonText = document.getElementsByTagName("script").each(function(script) {
            var $r = null
            do {
              if(script.text == "") {
                break
              }

              var matchReg = /\bwindow\.runParams\s*\=\s*([\s\S]*?(?:\}\;))/g
              var jsonMatch = null
              for(;;) {
                jsonMatch = matchReg.exec(script.text)
                if(jsonMatch == null) {
                  break
                }
                else if(jsonMatch[1].length < 100) {

                }
                else {
                  break
                }
              }

              //var jsonMatch = script.text.match(/\bwindow\.runParams\s*\=\s*([\s\S]{100,}?(?:\}\;))/)
              if(jsonMatch == null) {
                break
              }
              $r = jsonMatch[1].slice(0, -1)
            } while(0);

            return $r
          })
          if(descriptionJsonText == null) {

          }
          else {
            var descriptionJson = null
            try {
              descriptionJson = JSON.parse(descriptionJsonText)
            }
            catch(err) {
              log(err)
            }

            if(descriptionJson == null) {

            }
            else {
              var escapeAttr = function(t) {
                return he.escape("" + t)
              }
              var escapeText = function(t) {
                return he.escape("" + t)
              }

              document.getElementById("root").innerHTML = ""
              document.getElementById("root").appendChild(de("".concat(
                '<div class="glosearch-wrap">'
                + '<div class="page-content">'
                +   '<div class="main-content">'
                +     '<div class="right-menu">'
                +       '<div class="product-container">'
                +         '<div class="gallery-wrap product-list">'
                +           '<ul class="list-items">'
                +             '<div>',
                (descriptionJson.items || []).map(function(item) {
                  return (
                    '<li class="list-item" hasctr="y">'
                      + '<div product-index="0" data-product-id="32820468940" session-id="20190815010933363961975386240000010168" ali-member-id="230908352" algo-exp-id="d4b36b95-905a-47b7-b4fc-5eb24dc0bcde-0" class="gallery product-card middle-place">'
                          + '<div class="product-img">'
                              + '<div class="place-container">'
                                  + '<a target="_blank" data-p4p="true" href="' + escapeAttr(item.productDetailUrl) + '"><img src="' + escapeAttr(item.imageUrl) + '" data-p4p="true" class="item-img" alt="' + escapeAttr(item.title) + '" width="' + escapeAttr(item.imageWidth) + '" height="' + escapeAttr(item.imageHeight) + '"></a>'
                                  //+ '<div class="report-btn-wrap"><span class="report-item" title="Report fraud item"></span></div>'
                                  + '<div class="atwl-btn-wrap"><a class="add-wishlist-btn" data-p4p="true"><i data-p4p="true" class="next-icon next-icon-favourite next-medium"></i></a></div>'
                              + '</div>'
                          + '</div>'
                          + '<div class="product-info shrink1" style="min-height: 108px;">'
                              + '<div class="hover-help">'
                                  + '<div class="item-title-wrap"><a data-p4p="true" class="item-title" href="' + escapeAttr(item.productDetailUrl) + '" title="' + escapeAttr(item.title) + '" target="_blank">' + escapeAttr(item.title) + '</a></div>'
                                  + '<div class="item-price-wrap">'
                                      + '<div class="item-price-row"><span class="price-current">' + escapeText(item.price) + '</span></div>'
                                  + '</div>'
                                  + '<div class="item-shipping-wrap"><span class="shipping-value">' + escapeAttr(item.logisticsDesc) + '</span></div>'
                                  /*
                                  + '<div class="hold-sale"></div>'
                                  + '<div class="hold-store"></div>'
                                  + '<div class="item-sale-wrap">'
                                      + '<a data-p4p="true" rel="nofollow" class="rating-info" href="' + escapeAttr(item.productDetailUrl) + '#feedback" target="_blank">'
                                          + '<div class="next-rating next-rating-small next-rating-grade-high" tabindex="0" role="group" aria-label="评分选项">'
                                              + '<div class="next-rating-base next-rating-base-disabled">'
                                                  + '<div class="next-rating-underlay" aria-hidden="true"><span class="next-rating-icon"><i class="next-icon next-icon-favorites-filling next-xs"></i></span></div>'
                                                  + '<div class="next-rating-overlay" style="width: auto;">'
                                                      + '<form action="#">'
                                                          + '<label class="next-rating-icon"><i class="next-icon next-icon-favorites-filling next-xs"></i></label>'
                                                      + '</form>'
                                                  + '</div>'
                                              + '</div>'
                                          + '</div></a>'
                                      //+ '<div class="sale-info with-star"><span class="sale-value"> <a data-p4p="true" rel="nofollow" class="sale-value-link" href="' + escapeAttr(item.productDetailUrl) + '#thf" target="_blank">1656 Sold</a> </span></div>'
                                  + '</div>'
                                  */
                                  + '<div class="item-store-wrap"><a class="store-name" href="' + escapeAttr(item.store.storeUrl) + '" title="' + escapeAttr(item.store.storeName) + '" target="_blank">' + escapeAttr(item.store.storeName) + '</a></div>'
                              + '</div>'
                          + '</div>'
                      + '</div>'
                    + '</li>'
                  )
                }).join(""),
                '</div></ul></div></div></div></div></div></div>'
              )))
            }
          }
        })()

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

