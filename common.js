// ==UserScript==
// @name           common
// @description    common api
// ==/UserScript==

!(function(global) {
  var $null = null
  
  if(window.Bga == null) {
    window.Bga = {}
  }
  
  Bga.xpath = Bga.xPath = function(expr, root) {
    if(root == null) {
      root = document.documentElement
    }
    var vs = document.evaluate(expr, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null)
    var i = vs.snapshotLength
    var ret = []
    
    while(i--) {
      ret[i] = vs.snapshotItem(i)
    }
    
    return ret
  }
  
  Bga.disableAllScripts = function() {
    opera.addEventListener('BeforeExternalScript', function(js) {
      js.preventDefault()
    }, false)
    opera.addEventListener('BeforeScript', function(js) {
      js.preventDefault()
    }, false)
  }
  
  // opera has some issue with DOMContentLoaded
  Bga.onDOMReady = (function() {
    var _isLoaded = (
      'readyState' in document && function() { // stupid opera
        return document.readyState == 'loaded' || document.readyState == 'complete'
      }
      || function() {
        return document.body
      }
    ) 
    var _attachEvent = (
      'onreadystatechange' in document && function(_fn)
      {
        document.addEventListener('readystatechange', _fn, false)
      } ||
      function(_fn)
      {
        document.addEventListener('DOMContentLoaded', _fn, false);
      }
    )
  
    return function(_fn) {
      if(_isLoaded())
        _fn()
      else
        _attachEvent(_fn)
    }
  })();
  
  Bga.de = function(s) {
    var div = document.createElement("div")
    div.innerHTML = s
    if(div.childNodes.length <= 1) {
      return div.firstChild
    }
    else {
      var de = document.createDocumentFragment()
      var i = div.childNodes.length; while(i--) {
        de.appendChild(div.firstChild)
      }
      return de
    }
  }
  
  Bga.logNull = function() {  }
  Bga.logRaw = function() {
    if(window.opera) {
      opera.postError([].join.call(arguments, " "))
    }
    else if(window.console) {
      console.log([].join.call(arguments, " "))
    }
  }
  
  document.__defineGetter__("head",  function() { return this.getElementsByTagName("head")[0] }) 
  
  Array.prototype.each = function(_fn) { var thi$ = this;
    var i = -1; while(++i < thi$.length)
    {
      var ret = _fn(thi$[i], i)
      if(ret != null)
        return ret
    }
  }
  
  Array.prototype.put = function(v) {
    if(this.indexOf(v) == -1) {
      this.push(v)
    }
    else {
      
    }
    return this
  }

  Array.prototype.remove = function(v) {
    var k = this.indexOf(v)
    if(k != -1) {
      this.splice(k, 1)
    }
    else {
      
    }
    return this
  }
  
  
  /*
  Array.prototype.filter = function(_fn) { var thi$ = this;
    var ret = []
    var i = -1; while(++i < thi$.length)
    {
      if(_fn(thi$[i]) {
        ret.push(thi$[i])
      }
    }
    return ret
  }
  */
  ;[NodeList, StyleSheetList, CSSRuleList].each(function(Class) {
    Class.prototype.each = function(fn) {
      return [].slice.call(this, 0).each(fn)
    }
  })
  
  Node.prototype.__defineGetter__("firstElement",  function() { 
    var v = this.firstChild
    for(;;) {
      if(v == null) {
        break
      }
      else if(v.nodeType == 1) {
        break
      }
      else {
        v = v.nextSibling
      }
    }
    return v
  })
  Node.prototype.prependChild = function(v) {
    this.insertBefore(v, this.firstChild)
    return this
  }
  
  if(0) {
    img.wrap(de("".concat('<a href="', img.src, '" ><content /></a>')))
    //# short form in case only one node
    img.wrap(de("".concat('<a href="', img.src, '" />')))
  }
  Node.prototype.wrap = function(newParent) { var $this = this
    $this.parentNode.insertBefore(newParent, $this)
    var possiblePlace = newParent.getElementsByTagName("content")[0]
    if(possiblePlace == null) {
      newParent.appendChild($this)
    }
    else {
      possiblePlace.replace($this)
    }
    
    return $this
  }
  
  Node.prototype.hasClass = function(className) { var thi$ = this
    return (" " + thi$.className + " ").indexOf(" " + className + " ") !== -1
  }
  Node.prototype.addClass = function(className) { var thi$ = this
    if(!thi$.hasClass(className)) {
      if(thi$.className.length > 0) {
        thi$.className += " " + className
      }
      else {
        thi$.className = className
      }
    }
  }
  Node.prototype.delClass = function(className) { var thi$ = this
    if(thi$.hasClass(className)) {
      thi$.className = (" " + thi$.className + " ").replace(" " + className + " ", " ")
    }
  }
  Node.prototype.toggleClass = function(className) { var thi$ = this
    if(thi$.hasClass(className)) {
      thi$.className = (" " + thi$.className + " ").replace(" " + className + " ", " ")
    }
    else {
      if(thi$.className.length > 0) {
        thi$.className += " " + className
      }
      else {
        thi$.className = className
      }
    }
  }
  Node.prototype.up = function(className) { var thi$ = this
    var predicate = null; {
      if(Object(className) instanceof Function) {
        predicate = className
      }
      //# assume its real className, also for back compatibility
      else if(Object(className) instanceof String) {
        predicate = function(v) {
          return v.hasClass(className)
        }
      }
      else {
        throw "".concat("Unsupported predicate type ", predicate) 
      }
    }
    
    var v = thi$
    for(;;) {
      if(predicate(v)) {
        break
      }
      v = v.parentNode
      if(v == $null) {
        break
      }
    }
    return v
  }
  Node.prototype.next = function(predicate) { var thi$ = this
    var v = thi$.nextSibling
    for(;;) {
      if(v == $null) {
        break
      }
      if(predicate(v)) {
        break
      }
      v = v.nextSibling
      
    }
    return v
  }
  Node.prototype.prev = function(predicate) { var thi$ = this
    var v = thi$.prevSibling
    for(;;) {
      if(v == $null) {
        break
      }
      if(predicate(v)) {
        break
      }
      v = v.prevSibling
      
    }
    return v
  }
  
  Node.prototype.remove = function() { var thi$ = this
    thi$.parentNode.removeChild(thi$)
    return thi$
  }
  Node.prototype.replace = function(newNode) { var thi$ = this
    thi$.parentNode.insertBefore(newNode, thi$)
    thi$.parentNode.removeChild(thi$)
    return thi$
  }
  
  Bga.parseQueryString = function(s) {
    var $r = {  }
    s.split("&").each(function(kAndV) {
      var k = kAndV.split("=")[0]
      var v = kAndV.split("=")[1]
      $r[k] = decodeURIComponent(v)
    })
    return $r
  }
  
  Bga.parseJson = function(s) {
    try {
      return JSON.parse(s)
      return Function("".concat("return (", s, ")"))()
    }
    catch(err) {
      return null
    }
  }
  
  Bga.assert = function(expr) {
    if(!expr) {
      throw new Error("Assert failed")
    }
    else {
        
    }
  }
  
  Bga.inspect = function(v) {
    Bga.log(v)
    return v
  }
  Bga.inspectSize = function(v) {
    Bga.log(v.length)
    return v
  }
  
  Bga.SkipError = function() {
    
  }
  Bga.skip = function() {
    throw new Bga.SkipError()
  }
  
  Bga.buildAndAttachHandleEvent = function(domNode, obj) {
    var eventNames = []; for(var name in obj) if(true || obj.hasOwnProperty(name)) {
      var m = name.split(/\s/)
      //# { "on .ok-button click" }
      if(m[0] == "on") {
        eventNames.push({
          className: m[1], 
          type: m[2]
        })
      }
      else {
        
      }
    } 
    obj.handleEvent = function(event) { var p = obj //# weirdly in Opera { this == window } :/
      var className = event.target.className
      if(className.length != 0) {
        className.split(" ").forEach(function(className){
          var eventName = "".concat("on .", className, " ", event.type) 
          if(eventName in p) {
            p[eventName](event, className)
          }
          else {
          }
        })
      }
      else {
        
      }
    }
    
    //# [https://stackoverflow.com/a/14438954]
    function onlyUnique(value, index, self) { 
      return self.indexOf(value) === index;
    }
    
    eventNames.map(function(name) { return name.type }).filter(onlyUnique).forEach(function(type) {
      domNode.addEventListener(type, obj, false)
    })
    
    //# memory cleanup
    eventNames = null
  }
    
  if(0) {
    var TableWidget = function(domNode) {
      // generates { this.handleEvent } and calls { domNode.addEventListener(type, this, false) } each event type
      Bga.buildAndAttachHandleEvent(domNode, this)
    }
    TableWidget.prototype["on .tr click"] = function(event, className) {
      
    } 
    TableWidget.prototype.onTdClick = function(event, className) {
      
    } 
    TableWidget.prototype.onThClick = function(event, className) {
      
    }
  }
  if(0) {
    Bga.buildAndAttachHandleEvent(document.documentElement, {
      "on .ok click": function() {
        
      }
    })
  }
  
  if(0) Object.prototype.inspect = function() {
    console.log(this)
    return this
  }
  
  if(0) {
    fetch("/foo.php").then(function(response) { 
      if(response.ok) {
        a.innerHTML = response.body.text()
      }
    })
    fetch("/foo.php", { method: "POST", body: "data" }).then(function(response) { 
    })
    fetch("/foo.php", { headersMap: { "X-Auth": "password" } }).then(function(response) { 
    })
  }
  Bga.fetch = function(url, options) {
    ;(options != null) || (options = {  })
    
    var method = options.method || "GET"
    var headersMap = options.headersMap || {  }
    var sendBody = options.sendBody || null
    
    var onResponses = []
    
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var response = {
          status: xhr.status, 
          statusText: xhr.statusText, 
          url: url, 
          body: null, 
          bodyUsed: false
        }
        
        if(xhr.status != 200) {
          response.ok = false
        }
        else {
          var responseText = xhr.responseText
          response.ok = true
          
          response.bodyUsed = true
          response.body = { 
            json: function() {
              return JSON.parse(responseText)
            }, 
            text: function() {
              return responseText
            }
          }
        }

        xhr = null

        for(var obj = response, i = 0; i != onResponses.length; i += 1) {
          var onResponse = onResponses[i]
          obj = onResponse(obj)
        }
      }
    }
    
    xhr.open(method, url, true);
    Object.keys(headersMap).each(function(headerName) {
      xhr.setRequestHeader(headerName, headersMap[headerName])
    })
    xhr.send(sendBody)
    
    return ({
      then: function(onResponse) {
        onResponses.push(onResponse)
        return this
      }
    })
  }
})(this)
