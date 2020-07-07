// ==UserScript==
// @include        https://invidio.us/*
// @name
// @author Bga
// @version 0.1
// @description play video via WMP plugin. Plugin here http://www.chip.de/downloads/Windows-Media-Player-Firefox-Plug-in_25565274.html
// ==/UserScript==

if(1) location.replace(String(location).replace("/invidio.us/", "/www.youtube.com/"));

;(function(undefined) {

var volume = 0;

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

  //# allows to use WMP browser plugin for viewing videos
  waitCommon(function() {
    with(Bga) {
      setProtoExpando()
      document.documentElement.removeInlineEvents()

      var log = (1 ? logRaw : logNull)

      onDOMReady(function() {
        var queryParamMap = parseQueryString(location.search.slice(1))

        //# lowercase title
        if(1) {
          document.title = document.title.replace(/(^|\s)([\s\S]+?)(?=\s|$)/g, function(m, pred, word, post) {
            return pred + ((word.toUpperCase() == word) ? word.toLowerCase() : word)
          })
        }


        //# play video using WMPlayer plugin
        if(location.search.match("v=([a-zA-Z0-9-_]+)") != null) (function() {
          // var player = document.getElementById("default-language-message") || document.getElementById("player-api-legacy") || document.getElementById("player")
          var player = document.getElementById("player-container")
          playerVideo = player.getElementsByTagName("VIDEO")[0]
          var W = 640 * 0.7;
          var H = 480 * 0.7;

          var showMediaPlayer = function(url, w, h) {
            //# ui height
            h += 72

            //# player.lastChild.innerHTML = "".concat('<embed src="', url, '" autostart="true" showcontrols="true" showstatusbar="1" type="application/x-mplayer2" bgcolor="white" width="', w, 'px" height="', h, 'px" volume="', volume, '">')
            if(0) debugger
            playerVideo.replace(de("".concat('<embed src="', url, '" autostart="true" showcontrols="true" showstatusbar="1" type="application/x-mplayer2" bgcolor="white" style="width: ', w, 'px; height: ', h, 'px" volume="', volume, '">')))

          }


          playerVideo.getElementsByTagName("SOURCE").each(function(v) {
            var url = v.getAttribute("src")
            var t = v.getAttribute("label")
            var link = de("".concat('<a href="', v.src, '" title="', t,  '">', t, '</a> '))

            link.childNodes[0].onclick = function() {
              showMediaPlayer(url, W, H)
              return false
            }

            link.childNodes[0].setAttribute("accesskey", ({
              'video/mp4; codecs="avc1.42001E, mp4a.40.2"': "4",
              'video/mp4; codecs="avc1.64001F, mp4a.40.2"': "7",
            })[v.getAttribute("type")] || null)

            player.appendChild(link)
          })
          // var src = [].slice.call(playerVideo.getElementsByTagName("SOURCE")).map(function(v) { return v.src }).filter(function(url) { return url.match(/\&itag=22/) })[0]
          // log(src)
          // var videoDom = de("".concat('<embed src="', src, '" autostart="true" showcontrols="true" showstatusbar="1" type="application/x-mplayer2" bgcolor="white" style="width: ', w, 'px; height: ', h, 'px" volume="', volume, '">'))
        })()
      })
    }
  })
})(this)

})()

