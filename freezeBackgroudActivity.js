// ==UserScript==
// @name           freezeBackgroudActivity
// @include        https://*/*
// @include        http://*/*
// @description    freeze backgroud activity when tab is inactive
// ==/UserScript==

//# because modern websites do alot of backgroud "useful" job (hope its not mining *coins) and keep cpu busy, fan periodically blows and thats annoyong especially at night
!(function(global) {
  var log = function() {
    if(1) console.log.apply(console, arguments)
  }
  var trackActivity = function(msg) {
    if(1) console.log.apply(console, arguments)
  }
  
  var yes = !0, no = !1
  var CAPTURE_PHASE = yes
  var CLONE_NODE_DEEP = true
  //# assime setTimeout/setInterval ids get increments and share one counter
  //# get last id
  
  //# make { patchedFn } looks like { nativeFn }
  var natify = function(patchedFn, nativeFn) {
    var nativeCodeString = nativeFn.toString()
    var toStringNativeCodeString = nativeFn.toString.toString()
    patchedFn.toString = function() {
      return nativeCodeString
    }
    patchedFn.toString.toString = function() {
      return toStringNativeCodeString
    }
    patchedFn.toString.toString.toString = patchedFn.toString.toString
    
    return patchedFn
  }

  if(0) (function() {
    var x = "".bold.toString() 
    var y = "".bold.toString.toString() 
    String.prototype.bold = natify(function() {
      return "*" + this + "*"
    }, String.prototype.bold)
    console.assert("a".bold() == "*a*")
    console.assert("".bold.toString() == x)
    console.assert("".bold.toString.toString() == y)
    console.assert("".bold.toString.toString.toString() == y)
    console.assert("".bold.toString.toString.toString.toString() == y)
    //# etc
  })()
  
  ;if(0) (function() {
    var log = function() {
      if(0) console.log.apply(console, arguments)
    }
    
    // opera has some issue with DOMContentLoaded
    var onDOMReady = (function() {
      var _isLoaded = (
        ('readyState' in document) && function() { // stupid opera
          return document.readyState == 'loaded' || document.readyState == 'complete'
        }
        || function() {
          return document.body
        }
      ) 
      var _attachEvent = (
        ('onreadystatechange' in document) && function(_fn)
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
    })()
    
    var pendingScripts = []
    window.addEventListener("focus", function(e) {
      var v = null
      while(v = pendingScripts.shift()) {
        log("unblock script", v.node.src)
        /*
        var scriptDomNode = document.createElement("script")
        
        scriptDomNode.src = v.src
        scriptDomNode.async = v.async
        scriptDomNode.defer = v.defer
        document.head.appendChild(scriptDomNode)
        */
        var oldNode = v.node
        oldNode.parentNode.insertBefore(oldNode.cloneNode(CLONE_NODE_DEEP), oldNode)
        oldNode.parentNode.removeChild(oldNode)
      }
    }, CAPTURE_PHASE)

    onDOMReady(function() {
      log("BeforeExternalScript")
      opera.addEventListener('BeforeExternalScript', function(js) {
        if(document.hidden == no) {
          var src = js.element.src
          log("pass script", src)
        }
        else if(1 || js.element.async) {
          var src = js.element.src
          log("block script", src)
          trackActivity("async script", src)
          pendingScripts.push({ node: js.element })
          js.preventDefault()
        }
        else {
          
        }
      }, false
    )

    })
  })()

  
  if(0) var nextThreadId = (function() {
    var lastId = setTimeout("")
    
    return function() {
      return ++lastId
    }
  })()
  
  if(1) (function() {
    var CANCEL_TIMEOUT_ID = null
    var queue = []
    
    var nativeClearTimeout = Window.prototype.clearTimeout
    var nativeSetTimeout = Window.prototype.setTimeout
    
    Window.prototype.clearTimeout = natify(function(id) {
      var i = -1; while(queue[++i] != null) {
        if(queue[i].id == id) {
          queue[i].id = CANCEL_TIMEOUT_ID
        }
        else {
          
        }
      }
      return nativeClearTimeout.apply(this, arguments)
    }, nativeClearTimeout)

    Window.prototype.setTimeout = natify(function(threadFn, timeout) {
      //# tab is active => pass as is
      if(document.hidden == no || timeout == 0) {
        log("setTimeout pass")
        return nativeSetTimeout.apply(this, arguments)
      }
      // tab inactive, push to queue and execute when tab get focused again
      else {
        log("setTimeout freeze")
        //# get real id
        var id = nativeSetTimeout.apply(this, ["", 0])
        queue.push({ id: id, self: this, args: Array.prototype.slice.call(arguments) })
        return id
      }
    }, nativeSetTimeout)
    
    window.addEventListener("focus", function(e) {
      var v = null; while(v = queue.shift()) {
        log("setTimeout unfreeze", v.args.join("\t"))
        if(v.id == CANCEL_TIMEOUT_ID) {
          
        }
        else {
          nativeSetTimeout.apply(v.self, v.args)
        }
      }
    }, CAPTURE_PHASE)
    
  })()

  Window.prototype.setInterval = (function() {
    var hookedFn = Window.prototype.setInterval
    
    return natify(function(threadFn, intervalMs) {
      //? { natify }
      return hookedFn.apply(this, [function() {
        if(document.hidden) {
        }
        else {
          //? or call via { setTimeout(threadFn, 0) }
          try { threadFn.apply(this, arguments) } catch(err) {  }
        }
      }, intervalMs])
    }, hookedFn)
  })()
  
  
  if(0) if(Window.prototype.postMessage != null) Window.prototype.postMessage = (function() {
    var log = function() {
      if(1) console.log.apply(console, arguments)
    }

    var hookedFn = Window.prototype.postMessage
    var queue = []
    
    window.addEventListener("focus", function(e) {
      var v = null
      while(v = queue.shift()) {
        trackActivity("postMessage unfreeze", v.args.join("\t"))
        hookedFn.apply(v.self, v.args)
      }
    }, CAPTURE_PHASE)
    
    return natify(function() {
      //# tab is active => pass as is
      if(document.hidden == no) {
        trackActivity("postMessage pass")
        return hookedFn.apply(this, arguments)
      }
      // tab inactive, push to queue and execute when tab get focused again
      else {
        trackActivity("postMessage freeze")
        queue.push({ self: this, args: Array.prototype.slice.call(arguments) })
        return void 0;
      }
    }, hookedFn)
  })()
})(this)
