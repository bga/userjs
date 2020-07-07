// ==UserScript==
// @include        https://aliexpress.ru/*
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


;(function() {
  opera.postError("here");
  var newLocation = String(location);
  
  newLocation = newLocation.replace("//aliexpress.ru/", "//www.aliexpress.com/");
  
  //# without product path modification we can not show product' description
  if(newLocation.match(/\/item\/\d+.html$/)) (function() {
    if(1) newLocation = newLocation.replace("/item/", "/i/");
  })()
  
  location.replace(newLocation);
})();

