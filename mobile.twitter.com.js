// ==UserScript==
// @name           twitter
// @include        https://mobile.twitter.com/*
// @description    expand links
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
        var log = 1 ? logRaw : logNull
        //# pagination
        if(0) {
          var nextHref = document.body.getElementsByClassName("w-button-more")[0].getElementsByTagName("a")[0].href
          var nexts = xPath("//*[@rel='next' or @rel='Next']")
          log(nexts.length)
          if(nexts.length == 0) {
            if(nextHref != null) {
              document.head.appendChild(de("<link rel=next href='" + nextHref + "'/>"))
            }
          }
          else {
            nexts.each(function(v) {
              log("del " + v.href)
              if(v.tagName == "LINK") {
                v.href = nextHref 
              }
              else {
                v.removeAttribute("rel")
              }
            })
          }
        }
        else {
          if(document.body.getElementsByClassName("w-button-more").length == 1) {
            document.head.appendChild(de("".concat(
              "<link rel=next title='' href='", 
              document.body.getElementsByClassName("w-button-more")[0].getElementsByTagName("a")[0].href, 
              "'/>"
            )))
          }
          else {
          }
        }

        xpath("//a[@data-url]").each(function(v) {
          v.href = v.getAttribute("data-url")
        })
        xpath("//a").each(function(v) {
          if(v.href.indexOf("https://twitter.com/") == 0) {
            v.href = "".concat("https://mobile.twitter.com/", v.href.slice("https://twitter.com/".length))
          }
        })
        var form = document.getElementsByClassName("tweetform")[0]
        //opera.postError(form != null)
        if(form) {
          var input = form.getElementsByClassName("tweetbox")[0]
          if(location.pathname == "/compose/tweet" || location.pathname.match(/^\/\w+\/reply\/\d+$/)) {
            input.value = top.name
            setInterval(function() {
              top.name = input.value
            }, 1000)
            input.onkeypress = function() {
              setTimeout(function() {
                form.getElementsByClassName("counter")[0].innerText = input.value.length
              }, 0)
            }
            input.onkeypress()
          }
          else {
            
          }
        }
        // remove ad
        document.getElementsByClassName("badge").each(function(v) {
          v.up("tweet") && v.up("tweet").remove()
        })
        //? move to usercss as { .tweet > *[content~=lodash] { display: none !important } }
        var badWordsRE = RegExp("\\b" + ["lodash", "lo-dash", "@?WebPlatform", "@?starthq", "hyperHTML", "viperHTML"].join("|") + "\\b", "i")
        document.getElementsByClassName("tweet-text").each(function(v) {
          if(v.innerText.match(badWordsRE)) {
            v.up("tweet").remove()
          }
        })
        
        var conversationsTweets = document.getElementsByClassName("conversation-tweet")
        if(conversationsTweets.length > 0) {
          var ks = [-1]
          conversationsTweets.each(function(v, k) {
            if(!v.hasClass("conversation-tweet-not-last")) {
              ks.push(k)
            }
          })
          conversationsTweets.each(function(v) {
            v.style.marginLeft = "20px"
          })
          log(ks.length)
          log(conversationsTweets.length)
          
          ks.slice(0, -1).each(function(k) {
            conversationsTweets[k + 1].style.marginLeft = ""
          })
        }
        
        //# better quality images
        document.getElementsByClassName("card-photo").each(function(v) {
          var img = v.getElementsByClassName("media")[0].getElementsByTagName("img")[0]
          img.src = img.src.replace(/:\w+?$/, "") + ":large"
          var anchor = de("".concat("<a href=", img.src, "></a>"))
          img.replace(anchor)
          anchor.appendChild(img)
        })
        
        //# right url in bio
        try {
          var bioAnchor = (document.getElementsByClassName("bio")[0]
            .next(function(v) { return v.hasClass("url") })
            .getElementsByTagName("A")[0]
          )
          var bioUrl = bioAnchor.getAttribute("href")
          if(bioUrl.match(/^http(s?)\:/) == null) {
            bioUrl = "http://" + bioUrl  
            bioAnchor.setAttribute("href", bioUrl)
          }
          else {
            
          }
          if(0) log(bioAnchor.getAttribute("href"))
        }
        catch(err) {
          
        }
         
      })
    }
  })
})(this)
