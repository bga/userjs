// ==UserScript==
// @name           freezeBackgroudActivity
// @include        https://*/*
// @include        http://*/*
// @description    freeze backgroud activity when tab is inactive
// ==/UserScript==

//# because modern websites do alot of backgroud "useful" job (hope its not mining *coins) and keep cpu busy, fan periodically blows and thats annoyong especially at night
!(function(global) {
  var log = function() {
    if(0) console.log.apply(console, arguments)
  }
  
  var yes = !0, no = !1
  var CAPTURE_PHASE = yes
  //# assime setTimeout/setInterval ids get increments and share one counter
  //# get last id
  
  var nextThreadId = (function() {
    var lastId = setTimeout("")
    
    return function() {
      return ++lastId
    }
  })()
  
  global.setTimeout = (function() {
    var hookedFn = global.setTimeout
    var queue = []
    
    window.addEventListener("focus", function(e) {
      var v = null
      while(v = queue.shift()) {
        log("setTimeout unfreeze", v.args.join("\t"))
        hookedFn.apply(global, v.args)
      }
    }, CAPTURE_PHASE)
    
    return function() {
      //# tab is active => pass as is
      if(document.hidden == no) {
        log("setTimeout pass")
        return hookedFn.apply(global, arguments)
      }
      // tab inactive, push to queue and execute when tab get focused again
      else {
        log("setTimeout freeze")
        queue.push({ args: Array.prototype.slice.call(arguments) })
        return nextThreadId();
      }
    }
  })()

  global.setInterval = (function() {
    var hookedFn = global.setInterval
    var queue = []
    
    window.addEventListener("focus", function(e) {
      var v = null
      while(v = queue.shift()) {
        log("setInterval unfreeze", v.args.join("\t"))
        hookedFn.apply(global, v.args)
      }
    }, CAPTURE_PHASE)
    
    return function() {
      //# tab is active => pass as is
      if(document.hidden == no) {
        log("setInterval pass")
        return hookedFn.apply(global, arguments)
      }
      // tab inactive, push to queue and execute when tab get focused again
      else {
        log("setInterval freeze")
        queue.push({ args: Array.prototype.slice.call(arguments) })
        return nextThreadId();
      }
    }
  })()
  
  if(global.setImmediate != null) global.setImmediate = (function() {
    var hookedFn = global.setImmediate
    var queue = []
    
    window.addEventListener("focus", function(e) {
      var v = null
      while(v = queue.shift()) {
        log("setImmediate unfreeze", v.args.join("\t"))
        hookedFn.apply(global, v.args)
      }
    }, CAPTURE_PHASE)
    
    return function() {
      //# tab is active => pass as is
      if(document.hidden == no) {
        log("setImmediate pass")
        return hookedFn.apply(global, arguments)
      }
      // tab inactive, push to queue and execute when tab get focused again
      else {
        log("setImmediatel freeze")
        queue.push({ args: Array.prototype.slice.call(arguments) })
        return nextThreadId();
      }
    }
  })()
})(this)
