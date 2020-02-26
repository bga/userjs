// ==UserScript==
// @include        https://invidio.us/*
// @name
// @author Bga
// @version 0.1
// @description play video via WMP plugin. Plugin here http://www.chip.de/downloads/Windows-Media-Player-Firefox-Plug-in_25565274.html
// ==/UserScript==

;(function(undefined) {

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
          var w = 640 * 0.7;
          var h = 480 * 0.7;
          var volume = 0
          var src = [].slice.call(playerVideo.getElementsByTagName("SOURCE")).map(function(v) { return v.src }).filter(function(url) { return url.match(/\&itag=18/) })[0]
          log(src)
          var videoDom = de("".concat('<embed src="', src, '" autostart="true" showcontrols="true" showstatusbar="1" type="application/x-mplayer2" bgcolor="white" style="width: ', w, 'px; height: ', h, 'px" volume="', volume, '">'))

          playerVideo.replace(videoDom);
        })()
      })
    }
  })
})(this)

})()

