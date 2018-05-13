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
  
  var redirects = [
    [/^(?:https?:\/\/)?(?:www\.)?google\.(?:com|ru|co\.uk)\/url\?([\s\S]*)$/, function(match) { 
      var qso = Bga.parseQueryString(match[1])
      return qso["url"] || qso["q"]; 
    }],
    [/^(?:http:\/\/)?forum\.funkysouls\.com\/go\.php\?([^&]*)/, function(match) { 
      return decodeURIComponent(match[1]); 
    }]
  ]

  
  
  waitCommon(function() {
    with(Bga) {
      onDOMReady(function() {
        var log = 1 ? logRaw : logNull
        var as = document.links
        var a, i = -1
        
        while((a = as[++i]) != null) {
          var href = a.getAttribute('href')
          if(href.match(/^http(s?)/) == null) {
            href = "".concat(location.protocol, "//", location.host, href)
          }
          else {
            
          }
          0 && log("url", href)
          var j = -1, r = null; while((r = redirects[++j]) != null) {
            var match = r[0].exec(href)
            
            if(match != null) {  
              log("match", match)
              a.setAttribute('href', r[1](match))
            }
            else {
              
            }
          }
        }
      })
    }
  })
})(this)
