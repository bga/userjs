// ==UserScript==
// @name           twitter
// @include        https://mobile.twitter.com/*
// @description    expand links
// ==/UserScript==

if(1) document.cookie = "app_shell_visited=1;path=/;max-age=5000;secure"
// if(document.cookie.match(/\bapp_shell_visited\=")) {


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
        
        //# informative page title
        if(1) {
          var match = location.pathname.slice(1).split("/")
          if(match.length != 3 || match[1] != "status") {
            
          }
          else {
            var userName = match[0]
            var tweetId = match[2]
            var tweetText = [].slice.call(document.getElementsByClassName("tweet-text")).filter(function(divNode) {
              return divNode.getAttribute("data-id") == tweetId
            })[0].firstElement.firstChild.data
            document.title = "".concat("@", userName, ' "', tweetText.slice(0, 20).trim(), '..."', " - Twitter")
          }
        }

        //# twitter video support
        if(0) {
          
          var json = null; fetch("https://api.twitter.com/2/timeline/conversation/", tweetId, ".json?include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_composer_source=true&include_ext_alt_text=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true&send_error_codes=true&count=20&ext=mediaStats%2ChighlightedLabel%2CcameraMoment", {
            headersMap: {
              "x-twitter-active-user": "yes", 
              "x-twitter-auth-type": "OAuth2Session", 
              "x-twitter-client-language": "en", 
              "authorization": "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA" 
            }
          }).then(function(response) {
            if(response.ok) {
              log(response.text())
            }
            else {
              log(JSON.stringify(response, null, 2))
            }
          })
        }

        //# preloader skip
        if(0) if(document.body.hasClass("tweets-page") == false) {
          location.reload()
        }
        else {
          
        }
        
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

        //# replace t.co link to original one
        xpath("//a[@data-url]").each(function(v) {
          v.href = v.getAttribute("data-url")
        })
        
        //# replace all twitter.com/* links to mobile.twitter.com/*
        xpath("//a").each(function(v) {
          if(v.href.indexOf("https://twitter.com/") == 0) {
            v.href = "".concat("https://mobile.twitter.com/", v.href.slice("https://twitter.com/".length))
          }
        })
        
        //# save tweet message from occasional lost
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
                if(0) form.getElementsByClassName("counter")[0].innerText = input.value.length
                ;(document.getElementsByClassName("tweettable")[0].rows[0].cells[0].getElementsByTagName("h1")[0] || document.getElementById("top").getElementsByClassName("title")[0]).innerText = "".concat(input.value.length, "/280")
              }, 0)
            }
            input.onkeypress()
          }
          else {
            
          }
        }
        
        //# remove extra spaces before tweet text
        var trimLeft = function(s) {
          return s.slice(s.match(/^\s*/)[0].length)
        }
        document.getElementsByClassName("tweet-text").each(function(v) {
          var x = v.firstElement.firstChild
          x.textContent = trimLeft(x.textContent)
        })
        
        //# remove ad
        document.getElementsByClassName("badge").each(function(v) {
          v.up("tweet") && v.up("tweet").remove()
        })
        
        //# tweet blacklist. Hide tweet if it contains following words
        //? move to usercss as { .tweet > *[content~=lodash] { display: none !important } }
        var badWordsRE = RegExp("\\b" + ["lodash", "lo-dash", "@?WebPlatform", "@?starthq", "hyperHTML", "viperHTML"].join("|") + "\\b", "i")
        document.getElementsByClassName("tweet-text").each(function(v) {
          if(v.innerText.match(badWordsRE)) {
            v.up("tweet").remove()
          }
        })
        
        //# tree style conversation
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
