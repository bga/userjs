// ==UserScript==
// @include        https://startpage.com/*
// @name LOR correct pagePrev/Next
// @author Bga
// @version 0.1
// @description
// ==/UserScript==

opera.addEventListener('BeforeExternalScript', function(js) {
  // opera.postError(js.element)
  js.preventDefault()
}, false)

opera.addEventListener('BeforeScript', function(js) {
  // opera.postError(js.element)
  js.preventDefault()
}, false)

!(function(global)   // opera.postError(js.element)
{
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

      onDOMReady(function() {

        var paramMap = parseQueryString(location.search.slice(1))

        if(1) (function() {
          try {
            //# show all images in products listing
            ;document.getElementsByTagName("NOSCRIPT").each(function(noscript) {
              // log(noscript.innerText)
              noscript.replace(de("".concat(noscript.innerText)))
            })
          }
          catch(err) {
            if(!(err instanceof SkipError)) {
              throw err
            }
          }
        })()

        //# search using GET
        if(1) if(location.pathname.endsWith("/sp/search")) (function() {
          var keepParamsMap = { "q": 1, "page": 1, "cat": 1 };

          ;([].slice.call(document.getElementsByTagName("FORM"))
            .filter(function(v) {
              return v.action.endsWith(location.pathname)
            })
            .each(function(search) {
              search.setAttribute("method", "GET");
              search.elements["query"].name = "q"
              search.elements.each(function(v) {
                if(v.type == "hidden" && keepParamsMap[v.name] == null) v.remove();
              });
            })
          )
        })()

        //# hotkeys
        if(1) (function() {
          
          var createHotkey = function(category, hotkey, desc) {
            document.body.appendChild(de("<a />").tap(function(x) {
              x.href = "".concat(location.protocol, "//", location.host, location.pathname, "?", stringifyQueryString(Object.assign({  }, paramMap).tap(function(obj) {
                delete(obj, "page");
                obj["cat"] = category;
              })));
              x.accessKey = hotkey;
              x.title = desc;
            }));
          };
          
          createHotkey("web", "A", "All"); 
          createHotkey("pics", "I", "Images"); 
          createHotkey("video", "V", "Videos"); 
        })();
      
      })
    }
  })
})(this)
