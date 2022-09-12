// ==UserScript==
// @name           common
// @description    common api
// ==/UserScript==

!(function(global) {
  var $null = null

  var document = global.document || {  }
  var opera = global.opera || {
    postError: function() {
      console.log.apply(console, arguments)
    }
  }

  var Bga = {  }

  if(global.Bga == null) {
    global.Bga = Bga
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

    var $p = function(_fn) {
      $p.fns.push(_fn)
      if(_isLoaded())
        _fn()
      else
        _attachEvent(_fn)
    }
    
    $p.fns = []
    
    $p.fireEvent = function() {
      $p.fns.forEach(function(_fn) { 
        setTimeout(_fn, 0)
      })
    }
    
    return $p
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
    if(global.opera) {
      opera.postError([].join.call(arguments, " "))
    }
    else if(global.console) {
      console.log([].join.call(arguments, " "))
    }
  }

  Bga.setProtoExpando = function() {
    document.__defineGetter__("head",  function() { return this.getElementsByTagName("head")[0] })

    Object.prototype.inspect = function() {
      Bga.logRaw((this.inspect_toString instanceof Function) ? this.inspect_toString() : this.toString())
      return this
    }

    Object.prototype.tap = function(f) {
      f(this)
      return this
    }

    String.prototype.startsWith = function(prefix, pos) { var p = this;
      pos = pos > 0 ? (0 | pos) : 0;

      return p.substring(pos, pos + prefix.length) == prefix;
    }
    String.prototype.endsWith = function(search, this_len) {
      if (this_len == null || this_len > this.length) {
        this_len = this.length;
      }
      return this.substring(this_len - search.length, this_len) === search;
    }
    String.prototype.includes = function(search, start) {
      if (search instanceof RegExp) {
        throw TypeError('first argument must not be a RegExp');
      }
      if (start == null) { start = 0; }
      return this.indexOf(search, start) !== -1;
    };

    if(0) {
      Bga.assert("a--b--c----d".hasListItem("a", "--"))  
      Bga.assert("aa--b--c----d".hasListItem("aa", "--"))  
      Bga.assert("aa-b-c--d".hasListItem("aa", "-"))  
      Bga.assert("a--b--c----d".hasListItem("b", "--"))  
      Bga.assert("a--b--c----d".hasListItem("c", "--"))  
      Bga.assert("a--b--c----d".hasListItem("d", "--"))  
      Bga.assert("a--b--c----d".hasListItem("f", "--") == false)  
    };
    String.prototype.hasListItem = function(prefix, sep) { var thi$ = this;
      return (sep + thi$ + sep).indexOf(sep + prefix + sep) !== -1
    }
    
    if(0) {
      Bga.assert.eq("a--b--c----d".removeListItem("a", "--"),  "b--c----d")  
      Bga.assert.eq("a-b-c--d".removeListItem("a", "-"),  "b-c--d")  
      Bga.assert.eq("a-b-c--d".removeListItem("b", "-"),  "a-c--d")  
      Bga.assert.eq("a-b-c--d".removeListItem("c", "-"),  "a-b--d")  
      Bga.assert.eq("a-b-c--d".removeListItem("d", "-"),  "a-b-c-")  
      Bga.assert.eq("a-b-c--d".removeListItem("", "-"),   "a-b-c-d")  
      Bga.assert.eq("-a-b-c--d".removeListItem("", "-"),   "a-b-c--d")  
      Bga.assert.eq("a-b-c-d-".removeListItem("", "-"),   "a-b-c-d")  
      Bga.assert.eq("".removeListItem("a", "-"),   "")  
      Bga.assert.eq("a".removeListItem("a", "-"),   "")  
    };
    String.prototype.removeListItem = function(prefix, sep) { var thi$ = this;
      return (sep + this + sep).replace(sep + prefix + sep, sep).slice(sep.length, -sep.length)
    }
    
    if(0) {
      Bga.assert("aa--bb--cc----dd".hasListPrefix("a", "--"))  
      Bga.assert("aa--bb--cc----dd".hasListPrefix("aa", "--"))  
      Bga.assert("aaa-bb-cc--dd".hasListPrefix("aa", "-"))  
      Bga.assert("aa--bb--cc----dd".hasListPrefix("b", "--"))  
      Bga.assert("aa--bb--cc----dd".hasListPrefix("c", "--"))  
      Bga.assert("aa--bb--cc----dd".hasListPrefix("d", "--"))  
      Bga.assert("aa--bb--cc----dd".hasListPrefix("f", "--") == false)  
    };
    String.prototype.hasListPrefix = function(prefix, sep) { var thi$ = this;
      return (sep + thi$).indexOf(sep + prefix) !== -1
    }

    if(0) {
      Bga.assert("aa--bb--cc----dd".hasListSuffix("a", "--"))  
      Bga.assert("aa--bb--cc----dd".hasListSuffix("aa", "--"))  
      Bga.assert("aaa-bb-cc--dd".hasListSuffix("aa", "-"))  
      Bga.assert("aa--bb--cc----dd".hasListSuffix("b", "--"))  
      Bga.assert("aa--bb--cc----dd".hasListSuffix("c", "--"))  
      Bga.assert("aa--bb--cc----dd".hasListSuffix("d", "--"))  
      Bga.assert("aa--bb--cc----dd".hasListSuffix("f", "--") == false)  
    };
    String.prototype.hasListSuffix = function(prefix, sep) { var thi$ = this;
      return (thi$ + sep).indexOf(prefix + sep) !== -1
    }
    
    if(0) {
      Bga.assert.eq("aa--bb--cc----dd".removeListPrefix("a", "--"),  "bb--cc----dd")  
      Bga.assert.eq("aa-bb-cc--dd".removeListPrefix("f", "-"),  "aa-bb-cc--dd")  
      Bga.assert.eq("aa-bb-cc--dd".removeListPrefix("a", "-"),  "bb-cc--dd")  
      Bga.assert.eq("aa-bb-cc--dd".removeListPrefix("b", "-"),  "aa-cc--dd")  
      Bga.assert.eq("aa-bb-cc--dd".removeListPrefix("c", "-"),  "aa-bb--dd")  
      Bga.assert.eq("aa-bb-cc--dd".removeListPrefix("d", "-"),  "aa-bb-cc-")  
      Bga.assert.eq("aa-bb-cc--dd".removeListPrefix("", "-"),   "aa-bb-cc-dd")  
      Bga.assert.eq("-aa-bb-cc--dd".removeListPrefix("", "-"),  "aa-bb-cc--dd")  
      Bga.assert.eq("aa-bb-cc-dd-".removeListPrefix("", "-"),  "aa-bb-cc-dd")  
      Bga.assert.eq("".removeListPrefix("a", "-"),   "")  
    };
    String.prototype.removeListPrefix = function(prefix, sep) { var thi$ = this;
      if(prefix.length == 0) {
        return (sep + thi$ + sep).replace(sep + sep, sep).slice(sep.length, -sep.length)
      }
      else {
        var sepPrefix = sep + prefix
        var sepStrSep = sep + thi$ + sep
        var p = sepStrSep.indexOf(sepPrefix)
        if(p == -1) {
          return this
        }
        else {
          var pEnd = sepStrSep.indexOf(sep, p + sepPrefix.length)
          sepStrSep = sepStrSep.slice(0, p) + sepStrSep.slice(pEnd)
          return sepStrSep.slice(sep.length, -sep.length) //# cut extra seps
        }
      }
    }

    if(0) {
      Bga.assert.eq("aa--bb--cc----dd".removeListSuffix("a", "--"),  "bb--cc----dd")  
      Bga.assert.eq("aa-bb-cc--dd".removeListSuffix("f", "-"),  "aa-bb-cc--dd")  
      Bga.assert.eq("aa-bb-cc--dd".removeListSuffix("a", "-"),  "bb-cc--dd")  
      Bga.assert.eq("aa-bb-cc--dd".removeListSuffix("b", "-"),  "aa-cc--dd")  
      Bga.assert.eq("aa-bb-cc--dd".removeListSuffix("c", "-"),  "aa-bb--dd")  
      Bga.assert.eq("aa-bb-cc--dd".removeListSuffix("d", "-"),  "aa-bb-cc-")  
      Bga.assert.eq("aa-bb-cc--dd".removeListSuffix("", "-"),   "aa-bb-cc-dd")  
      Bga.assert.eq("-aa-bb-cc--dd".removeListSuffix("", "-"),  "aa-bb-cc--dd")  
      Bga.assert.eq("aa-bb-cc-dd-".removeListSuffix("", "-"),  "aa-bb-cc-dd")  
      Bga.assert.eq("".removeListSuffix("a", "-"),   "")  
    };
    String.prototype.removeListSuffix = function(prefix, sep) { var thi$ = this;
      if(prefix.length == 0) {
        return (sep + thi$ + sep).replace(sep + sep, sep).slice(sep.length, -sep.length)
      }
      else {
        var prefixSep = prefix + sep
        var sepStrSep = sep + thi$ + sep
        var p = sepStrSep.indexOf(prefixSep)
        if(p == -1) {
          return this
        }
        else {
          var pStart = sepStrSep.lastIndexOf(sep, p)
          sepStrSep = sepStrSep.slice(0, pStart + sep.length) + sepStrSep.slice(p + prefixSep.length)
          return sepStrSep.slice(sep.length, -sep.length) //# cut extra seps
        }
      }
    }

    String.prototype.matchAll = function(re) { var p = this
      re.global != true && (re = RegExp(re.source, "g"))

      var $r = []
      ;p.replace(re, function() {
        var x = [].slice.apply(arguments, [0, -2])
        x.index = arguments[arguments.length - 2]
        x.input = p
        $r.push(x)
      })
      return $r
    }
    if(String.prototype.repeat == null) String.prototype.repeat = function(n) {
      if(typeof(n) != "number") {
        throw new TypeError("repeat count must be number");
      };
      if(Math.floor(n) != n || n == +Infinity) {
        throw new RangeError("repeat count must be integer");
      };
      if(n < 0) {
        throw new RangeError("repeat count must be non-negative");
      };

      var degree = String(this);
      var out = "";
      for(;;) {
        if(n == 0) {
          break;
        };
        if(n & 1) {
          out += degree;
        };
        n >>= 1;
        degree += degree;
      }
      return out;
    }

    Array.prototype.flat = function(depth) { var p = this
      depth == null && (depth = 1)
      var $r = p
      while(depth--) {
        $r = [].concat.apply([], $r)
      }
      return $r.filter(function(v) { return v != null })
    }

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
    Node.prototype.prependSibling = function(v) {
      this.parentNode.insertBefore(v, this)
      return this
    }
    Node.prototype.appendSibling = function(v) {
      this.parentNode.insertBefore(v, this.nextSibling)
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
    Node.prototype.hasClassPrefix = function(className) { var thi$ = this
      return thi$.className.hasListPrefix(className, " ")
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
    Node.prototype.delClassPrefix = function(className) { var thi$ = this
      thi$.className = thi$.className.removeListPrefix(className, " ")
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
    Node.prototype.getElementByClassPrefix = function(classPrefix) { var thi$ = this
      return [].filter.apply([thi$.querySelector("".concat("*[class*=", classPrefix, "]"))], [function(v) { return v.hasClassPrefix(classPrefix) }])[0]
    }
    Node.prototype.getElementsByClassPrefix = function(classPrefix) { var thi$ = this
      return [].filter.apply(thi$.querySelectorAll("".concat("*[class*=", classPrefix, "]")), [function(v) { return v.hasClassPrefix(classPrefix) }])
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

    var processDomOrDe = function(domOrDe, f) {
      if(domOrDe.nodeType != Node.DOCUMENT_FRAGMENT_NODE) {
        f(domOrDe)
      }
      else {
        domOrDe.childNodes.each(function(v) {
          f(v)
        })
      }

      return domOrDe
    }

    Node.prototype.removeInlineEvents = (function() {
      var getEventNames = Bga.memorize(function() {
        return Object.keys(Bga.de("<div />")).filter(function(name) { return name == name.toLocaleString() && name.slice(0, 2) == "on" })
      })

      return function() {
        var eventNames = getEventNames()

        return processDomOrDe(this, function(root) {
          if(root.getElementsByTagName == null) {

          }
          else {
            //# old style loop for speed
            var all = root.getElementsByTagName("*")
            var v = null, i = 0; while(v = all[i++]) {
              var eventName = "", j = 0; while(eventName = eventNames[j++]) {
                v.removeAttribute(eventName)
              }
            }
          }
        })
      }
    })()

    Node.prototype.removeScripts = function() {
      processDomOrDe(this, function(domNode) {
        if(domNode.getElementsByTagName == null) {
        }
        else {
          ;[].slice.call(domNode.getElementsByTagName("SCRIPT")).forEach(function(v) {
            v.remove()
          })
        }
      })

      return this
    }
  }

  //# -> standard Location object
  Bga.parseUrl = function(url) {
    return document.createElement("A").tap(function(a) {
      a.href = url
    })
  }
  
  Bga.parseQueryString = function(s) {
    var $r = {  }
    s.split("&").forEach(function(kAndV) {
      var k = kAndV.split("=")[0]
      var v = kAndV.split("=")[1]
      $r[k] = decodeURIComponent(v)
    })
    return $r
  }
  Bga.stringifyQueryString = function(map) {
    return (Object.keys(map).map(function(k) {
        return "".concat(k, "=", encodeURIComponent(map[k]))
      })
      .join("&")
    )
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
  Bga.assert.eq = function(expr, expect) {
    if(!(expr == expect)) {
      throw new Error("".concat("{ ", expr,  " } != { ", expect, " }"))
    }
  }
  Bga.assert.neq = function(expr, expect) {
    if(!(expr != expect)) {
      throw new Error("".concat("{ ", expr,  " } == { ", expect, " }"))
    }
  }
  Bga.assert.lt = function(expr, expect) {
    if(!(expr < expect)) {
      throw new Error("".concat("{ ", expr,  " } >= { ", expect, " }"))
    }
  }
  Bga.assert.lte = function(expr, expect) {
    if(!(expr <= expect)) {
      throw new Error("".concat("{ ", expr,  " } > { ", expect, " }"))
    }
  }
  Bga.assert.hasMask = function(expr, expect) {
    if(!((expr & expect) == expect)) {
      throw new Error("".concat("{ ", expr.toString(2),  " } !hasMask { ", expect.toString(2), " }"))
    }
  }

  Bga.example = function(test) {
    setTimeout(function() {
      test()
    })
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

  Bga.memorize = function(f) {
    if(f.length == 0) {
      return function self() {
        if(!self.isValueComputed) {
          self.value = f()
          self.isValueComputed = true
        }
        else {

        }

        return self.value
      }
    }
    else {
      throw "Unsupported arity"
    }
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
  
  if(typeof Object.assign !== 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.assign = function assign(target, varArgs) { // .length of function is 2
      if(target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for(var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if(nextSource !== null && nextSource !== undefined) { 
          for(var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if(Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    }
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

        if(!(xhr.status == 0 || 200 <= xhr.status && xhr.status < 300)) {
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

  if(0) {
    with(Bga) {
      assert.neq(matchCStringEnd('"123"', 0), -1) 
      assert.eq(matchCStringEnd('"123', 0), -1) 
      assert.eq(matchCStringEnd('"123\\"', 0), -1) 
      assert.neq(matchCStringEnd('"123\\\\"', 0), -1) 
      assert.eq(matchCStringEnd('"123\\\\\\"', 0), -1) 
    }
  };
  Bga.matchCStringEnd = function(s, p) {
    var quote = s[p];
    for(;;) {
      p = s.indexOf(quote, p + 1)
      if(p < 0) {
        break;
      };
      
      var p2 = p; 
      do {  
        p2 -= 1;
      }
      while(s[p2] == "\\");
      
      if((p - p2) % 2 == 1) {
        p += 1;
        break;
      };
    }
    return p;
  }

  if(0) Bga.example(function() {
    with(Bga) {
      assert.eq(unescapeCString("\"a_\\n_b\""),  "a_\n_b")
      assert.eq(unescapeCString("\"a_\\\\_b\""), "a_\\_b")
      assert.eq(unescapeCString("\"a_\\xAB_b\""),  "".concat("a_", String.fromCharCode(0xAB), "_b"))
      assert.eq(unescapeCString("\"a_\\uABCD_b\""),  "".concat("a_", String.fromCharCode(0xABCD), "_b"))
      assert.eq(unescapeCString("\"a_\\UABCDDCBA_b\""),  "".concat("a_", String.fromCharCode(0xABCDDCBA), "_b"))
      assert.eq(unescapeCString("\"a_\\123_b\""),  "".concat("a_", String.fromCharCode(123), "_b"))
    }
  })
  Bga.unescapeCString = function(t) {
    if(t[0] != "\"" && t[0] != "'") {
      return t
    }
    else {
      t = t.slice(1, -1).replace(/\\([0-9]{3,3}|x[0-9a-fA-F]{2,2}|u[0-9a-fA-F]{4,4}|U[0-9a-fA-F]{8,8}|(.))/g, function(all, ch) {
        var $r = ""
        switch(ch[0]) {
          case("a"): {
            $r = "\a"
          } break
          case("b"): {
            $r = "\b"
          } break
          case("e"): {
            $r = "\e"
          } break
          case("f"): {
            $r = "\f"
          } break
          case("n"): {
            $r = "\n"
          } break
          case("r"): {
            $r = "\r"
          } break
          case("t"): {
            $r = "\t"
          } break
          case("v"): {
            $r = "\v"
          } break
          case("x"): {
            $r = String.fromCharCode(parseInt(ch.slice(1), 16))
          } break
          case("u"): {
            $r = String.fromCharCode(parseInt(ch.slice(1), 16))
          } break
          case("U"): {
            $r = String.fromCharCode(parseInt(ch.slice(1), 16))
          } break
          case("0"):
          case("1"):
          case("2"):
          case("3"):
          case("4"):
          case("5"):
          case("6"):
          case("7"):
          case("8"):
          case("9"): {
            $r = String.fromCharCode(parseInt(ch, 10))
          } break
          default: {
            $r = ch
          }
        }
        return $r
      })
    }
    return t
  }
  
  /*! https://mths.be/he v1.1.1 by @mathias | MIT license */
  Bga.escapeHTML = (function() {
    var regexEscape = /["&'<>`]/g;
    var escapeMap = {
      '"': '&quot;',
      '&': '&amp;',
      '\'': '&#x27;',
      '<': '&lt;',
      // See https://mathiasbynens.be/notes/ambiguous-ampersands: in HTML, the
      // following is not strictly necessary unless it’s part of a tag or an
      // unquoted attribute value. We’re only escaping it to support those
      // situations, and for XML support.
      '>': '&gt;',
      // In Internet Explorer ≤ 8, the backtick character can be used
      // to break out of (un)quoted attribute values or HTML comments.
      // See http://html5sec.org/#102, http://html5sec.org/#108, and
      // http://html5sec.org/#133.
      '`': '&#x60;'
    };
    
    return function(string) {
      return string.replace(regexEscape, function($0) {
        // Note: there is no need to check `has(escapeMap, $0)` here.
        return escapeMap[$0];
      });
    }
  })()

})(this)
