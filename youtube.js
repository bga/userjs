// ==UserScript==
// @include        https://www.youtube.com/*
// @name
// @author Bga
// @version 0.1
// @description play video via WMP plugin. Plugin here http://www.chip.de/downloads/Windows-Media-Player-Firefox-Plug-in_25565274.html
// ==/UserScript==

opera.addEventListener('BeforeExternalScript', function(js) {
  js.preventDefault()
}, false)

opera.addEventListener('BeforeScript', function(js) {
  js.preventDefault()
}, false)

location.host = "invidio.us"

if(0) {

  ;(function(undefined) {

  var volume = 0

  if(location.pathname.match(/^\/embed\//)) {
    location.replace("https://www.youtube.com/watch?v=" + location.pathname.slice(7))
  }
  //# that option show related videos
  else {
    location.host = "invidio.us"
  }

  })()
}

