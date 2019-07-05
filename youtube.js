// ==UserScript==
// @include        https://www.youtube.com/*
// @name  
// @author Bga
// @version 0.1
// @description play video via WMP plugin. Plugin here http://www.chip.de/downloads/Windows-Media-Player-Firefox-Plug-in_25565274.html 
// ==/UserScript==

;(function(undefined) {

var volume = 0
  
if(location.pathname.match(/^\/embed\//)) {
  location.replace("https://www.youtube.com/watch?v=" + location.pathname.slice(7))
}
//# that option show related videos
else if(0 && location.search.match(/(^|&|\?)nofeather=True(&|$)/) == null) {
  location.replace(location + ((location.search == "") ? "?" : "&") + "nofeather=True")
}

opera.addEventListener('BeforeExternalScript', function(js) {
  // opera.postError(js.element)
  js.preventDefault()
}, false)

window.yt = {  }
window.__ytRIL = function() { 

}

opera.addEventListener('BeforeScript', function(js) {
  // opera.postError(js.element)
  js.preventDefault()
  if(js.element.text.indexOf("\\u003cembed") < 0 && js.element.text.indexOf("yt.playerConfig =") < 0) {
    // opera.postError("blocked")
  }
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
      //# fix volume
      0 && setTimeout(function() {
        try {
          movie_player.setVolume(8)
        }
        catch(err) {
          setTimeout(arguments.callee, 100)
        }
      }, 0)
      
      onDOMReady(function() {
        var queryParamMap = parseQueryString(location.search.slice(1))
        
        //# lowercase title
        if(1) {
          document.title = document.title.replace(/(^|\s)([\s\S]+?)(?=\s|$)/g, function(m, pred, word, post) {
            return pred + ((word.toUpperCase() == word) ? word.toLowerCase() : word)
          })          
        }

        //# load more button
        if(document.getElementsByClassName("load-more-button")[0] != null) (function() {
          var bindEvent = function() {
            var button = document.getElementsByClassName("load-more-button")[0]
            button.setAttribute("onclick", null)
            var doLoadMore = function(targetNode) {
              var ajaxAppendId = targetNode.getAttribute("data-uix-load-more-target-id")
              var ajaxUrl = targetNode.getAttribute("data-uix-load-more-href")
              fetch(ajaxUrl).then(function(response) {
                if(response.ok == false) {
                }
                else {
                  var json = response.body.json()
                  var div = document.createElement("div")
                  div.innerHTML = json.load_more_widget_html
                  document.getElementById(ajaxAppendId).insertAdjacentHTML("beforeend", json.content_html)
                  var newHref = null; try { newHref = div.getElementsByClassName("load-more-button")[0].getAttribute("data-uix-load-more-href") } catch(err) { newHref = null }
                  
                  if(0) log(targetNode.getAttribute("data-uix-load-more-href"), newHref)
                  if(newHref != null && targetNode.getAttribute("data-uix-load-more-href") != newHref) {
                    targetNode.setAttribute("data-uix-load-more-href", newHref)
                  }
                  else {
                    targetNode.style.display = "none"
                  }
                }
              })
            }
            
            button.addEventListener("click", function(ev) {
              doLoadMore(ev.target)
              return false
            }, false)
            
            document.body.appendChild(de("<a href=# accesskey=L title='Load more'>")).addEventListener("click", function(ev) {
              doLoadMore(document.getElementsByClassName("load-more-button")[0])
              ev.preventDefault()
              return false
            }, false)
            
            button = null 
          }
          bindEvent()
        })() 

        //# next video in playlist
        if(queryParamMap["list"] != null) (function() {
          var getVideoId = function(href) {
            return parseQueryString(href.split("?")[1])["v"]
          }
          var currentVideoId = queryParamMap["v"]
          assert("vLxefatea1Y" == getVideoId("https://www.youtube.com/watch?v=vLxefatea1Y&list=PL0QrZvg7QIgpoLdNFnEePRrU-YJfr9Be7&index=66&t=0s&nofeather=True"))
          var playListOl = document.getElementById("playlist-autoscroll-list")
          //# lazy parsing
          var hrefs = []; playListOl.getElementsByTagName("li").each(function(li) {
            var href = li.getElementsByClassName("playlist-video")[0].href
            hrefs.push(href)
            if(3 <= hrefs.length && getVideoId(hrefs[hrefs.length - 2]) == currentVideoId) {
              return false
            }
          })
          var nextHref = hrefs[hrefs.length - 1]
          var prevHref = hrefs[hrefs.length - 3]
          
          document.body.appendChild(de("".concat("<a accesskey=p href='", prevHref, "' title=Prev></a>")))
          document.head.prependChild(de("<link rel='prev' href='" + prevHref + "'/>"))

          document.body.appendChild(de("".concat("<a accesskey=n href='", nextHref, "' title=Next></a>")))
          document.head.prependChild(de("<link rel='next' href='" + nextHref + "'/>"))
          
        })()

        //# play video using WMPlayer plugin
        if(location.search.match("v=([a-zA-Z0-9-_]+)") != null) (function() {  
          // var player = document.getElementById("default-language-message") || document.getElementById("player-api-legacy") || document.getElementById("player") 
          var player = document.getElementById("player-api")
          // var player = document.getElementById("placeholder-player").firstElement
          player.innerHTML = "<div /><div />"
          var di = function(options) {
            //log(options.title + "!")
          }
          var showMediaPlayer = function(url, w, h) {
            //# ui height
            h += 72 
            //# support video?
            if(0 && de("<video />").src != null) {
              player.lastChild.innerHTML = "".concat('<video id=bgaPlayer tabIndex=-1 src="', url, '" controls="true">')
              setTimeout(function() {
                var bgaPlayer = player.lastChild.firstChild
                bgaPlayer.style.minWidth = "".concat(w, "px")
                bgaPlayer.volume = localStorage.bgaPlayerVolume || 0.2
                bgaPlayer.play()
                bgaPlayer.focus()
                bgaPlayer.onclick = function() {
                  if(bgaPlayer.paused) {
                    bgaPlayer.play()
                  }
                  else {
                    bgaPlayer.pause()
                  }
                }
                bgaPlayer.onkeydown = function(e) {
                  if(e.shiftKey == false && e.ctrlKey == false && e.altKey == false && e.keyCode == 38) {
                    localStorage.bgaPlayerVolume = bgaPlayer.volume = Math.min(1, bgaPlayer.volume + 0.05)
                    e.preventDefault()
                  }
                  else if(e.shiftKey == false && e.ctrlKey == false && e.altKey == false && e.keyCode == 40) {
                    localStorage.bgaPlayerVolume = bgaPlayer.volume = Math.max(0, bgaPlayer.volume - 0.05)
                    e.preventDefault()
                  }
                  else {

                  }
                }
              }, 100)
            }
            else {
              //# player.lastChild.innerHTML = "".concat('<embed src="', url, '" autostart="true" showcontrols="true" showstatusbar="1" type="application/x-mplayer2" bgcolor="white" width="', w, 'px" height="', h, 'px" volume="', volume, '">')
              player.lastChild.innerHTML = "".concat('<embed src="', url, '" autostart="true" showcontrols="true" showstatusbar="1" type="application/x-mplayer2" bgcolor="white" style="width: ', w, 'px; height: ', h, 'px" volume="', volume, '">')
              
              if(0) {
                var bgaPlayer = player.lastChild.lastChild
                player.tabIndex=-1
                player.onkeydown = function(e) {
                  log("keydown")
                  if(0) {
                      
                  }
                  else if(e.shiftKey == false && e.ctrlKey == false && e.altKey == false && e.keyCode == 32) {
                    bgaPlayer.controls.pause()
                    e.preventDefault()
                  }
                  else if(e.shiftKey == false && e.ctrlKey == false && e.altKey == false && e.keyCode == 38) {
                    localStorage.bgaPlayerVolume = bgaPlayer.volume = Math.min(1, bgaPlayer.volume + 0.05)
                    e.preventDefault()
                  }
                  else if(e.shiftKey == false && e.ctrlKey == false && e.altKey == false && e.keyCode == 40) {
                    localStorage.bgaPlayerVolume = bgaPlayer.volume = Math.max(0, bgaPlayer.volume - 0.05)
                    e.preventDefault()
                  }
                  else {
    
                  }
                }
  }

            }
          }
          
          //# [keepvid.com]
          //# env emulation
          var ap = function(obj) {
            var url = obj.params.u
            var onOk = obj.callback
            var xhr = new XMLHttpRequest()
            xhr.open("GET", url, true)
            xhr.onreadystatechange = function() {
              if(xhr.readyState == 4) {
                if(200 <= xhr.status && xhr.status < 300) {
                  onOk({
                    headers: "", 
                    body: xhr.responseText
                  })
                }
                else {
                  onOk(null)
                }
              }
            }
            xhr.send(null)
          }
          var dl = function(obj) {
            var url = obj.url
            var type = obj.type
            var quality = obj.quality
            var title = obj.title
            var t = "".concat(type, "-", quality).replace(/<\/?.*?>/g, "")
            var link = de("".concat('<a href="', url, '" title="', t,  '">', t, '</a> '))
            link.childNodes[0].onclick = function() {
              var w
              var h
              var qm = quality.match(/(\d+)p$/)
              log(qm + "!")
              if(qm) {
                h = parseInt(+qm[1])
                w = h / 3 * 4
              }
              else {
                w = 640
                h = 480
              }
              log(w, h)
              showMediaPlayer(url, w, h)
              return false
            }

            link.childNodes[0].setAttribute("accesskey", (({ 
              "MP4": { 
                "(Max 480p)": "4",  
                "720p": "7"
              } 
            })[obj.type] || {  })[obj.quality] || null)

            if(obj.type == "MP4" && (obj.quality == "(Max 480p)" || obj.quality == "720p")) {
              player.firstChild.appendChild(link)
            }
            else {
              
            }
            
            log(url, type, quality, title)
          }
        ; location.search.match("v=([a-zA-Z0-9-_]+)") && (function(m) {
          log("here")
          var ua

//function: convert seconds to 1:11 readable format
function duration(secs){
    hours = parseInt(secs / 3600) % 24;
	minutes = parseInt(secs / 60) % 60;
	seconds = secs % 60;
    return (hours < 1 ? "" : hours+":")+((minutes < 10 && hours > 0) ? "0" + minutes : minutes)+":"+(seconds < 10 ? "0" + seconds : seconds);
}

          
var vid = m.match("v=([a-zA-Z0-9-_]+)")[1];
var files;

function swap16230(p1, p2) {
    var l3 = p1[0];
    var l4c = p2 % p1.length;
    var l4 = p1[l4c];
    p1[0] = l4;
    p1[p2] = l3;
    return p1
}

function clone16230(p1, p2) {
    return p1.slice(p2)
}

function reverse16230(p1) {
    return p1.reverse()
}

function decipher(sig) {
    var sigs = sig.split("");
    sigs = swap16230(sigs, 25);
    sigs = reverse16230(sigs);
    sigs = clone16230(sigs, 1);
    sigs = swap16230(sigs, 49);
    sigs = swap16230(sigs, 52);
    sig = sigs.join("");
    return sig
}
ap({
    params: {
        "u": "https://www.youtube.com/get_video_info?video_id=" + vid + "&asv=3&el=detailpage&hl=en_US&sts=16230",
        "ua": ua
    },
    "dispose": 1,
    "callback": function(da) {
        var title = "";
        var status = "";
        try {
            title = unescape(da.body.match("title=([^&]+)")[1]).replace(/\+/g, " ")
        } catch (e) {
            log("Could not get title.")
        }
        try {
            status = da.body.match("status=([^&]+)")[1]
        } catch (e) {
            log("Could not get status parameter.")
        }
        if (status != "fail") {
            di({
                title: title,
                image: "https://i.ytimg.com/vi/" + vid + "/default.jpg",
                url: "https://www.youtube.com/watch?v=" + vid,
                domain: "youtube.com",
                user: unescape(da.body.match("author=([^&]+)")[1].replace(/\+/g, " ")),
                duration: duration(da.body.match("length_seconds=([^&]+)")[1])
            });
            title = escape(title.replace(/\//g, "_").replace(/\"/g, ""));
            var order = ("18,22,37,38,160,133,134,135,136,137,264,138,83,82,85,84,139,140,141,5,6,34,35,13,17,36,43,44,45,46,242,243,244,245,246,247,248,271,272,100,101,102,171,172").split(",");
            files = {
                "18": {
                    type: "MP4",
                    quality: "(Max 480p)"
                },
                "22": {
                    type: "MP4",
                    quality: "720p"
                },
                "37": {
                    type: "MP4",
                    quality: "1080p"
                },
                "160": {
                    type: "MP4",
                    quality: "144p (Video Only)"
                },
                "133": {
                    type: "MP4",
                    quality: "240p (Video Only)"
                },
                "134": {
                    type: "MP4",
                    quality: "360p (Video Only)"
                },
                "135": {
                    type: "MP4",
                    quality: "480p (Video Only)"
                },
                "136": {
                    type: "MP4",
                    quality: "720p (Video Only)"
                },
                "137": {
                    type: "MP4",
                    quality: "1080p (Video Only)"
                },
                "264": {
                    type: "MP4",
                    quality: "1440p (Video Only)"
                },
                "138": {
                    type: "MP4",
                    quality: "2160p (Video Only)"
                },
                "139": {
                    type: "M4A",
                    quality: "48 kbps (Audio Only)"
                },
                "140": {
                    type: "M4A",
                    quality: "128 kbps (Audio Only)"
                },
                "141": {
                    type: "M4A",
                    quality: "256 kbps (Audio Only)"
                },
                "38": {
                    type: "MP4",
                    quality: "2160p"
                },
                "83": {
                    type: "MP4",
                    quality: "[3D] - 240p"
                },
                "82": {
                    type: "MP4",
                    quality: "[3D] - 360p"
                },
                "85": {
                    type: "MP4",
                    quality: "[3D] - 520p"
                },
                "84": {
                    type: "MP4",
                    quality: "[3D] - 720p"
                },
                "5": {
                    type: "FLV",
                    quality: "240p"
                },
                "6": {
                    type: "FLV",
                    quality: "270p"
                },
                "34": {
                    type: "FLV",
                    quality: "360p"
                },
                "35": {
                    type: "FLV",
                    quality: "480p"
                },
                "13": {
                    type: "3GP",
                    quality: "144p"
                },
                "17": {
                    type: "3GP",
                    quality: "144p"
                },
                "36": {
                    type: "3GP",
                    quality: "240p"
                },
                "43": {
                    type: "WEBM",
                    quality: "360p"
                },
                "44": {
                    type: "WEBM",
                    quality: "480p"
                },
                "45": {
                    type: "WEBM",
                    quality: "720p"
                },
                "46": {
                    type: "WEBM",
                    quality: "1080p"
                },
                "242": {
                    type: "WEBM",
                    quality: "240p (Video Only)"
                },
                "243": {
                    type: "WEBM",
                    quality: "360p (Video Only)"
                },
                "244": {
                    type: "WEBM",
                    quality: "480p (Video Only)"
                },
                "245": {
                    type: "WEBM",
                    quality: "480p, 110 kbps (Video Only)"
                },
                "246": {
                    type: "WEBM",
                    quality: "480p, 210 kbps (Video Only)"
                },
                "247": {
                    type: "WEBM",
                    quality: "720p (Video Only)"
                },
                "248": {
                    type: "WEBM",
                    quality: "1080p (Video Only)"
                },
                "271": {
                    type: "WEBM",
                    quality: "1440p (Video Only)"
                },
                "272": {
                    type: "WEBM",
                    quality: "2160p (Video Only)"
                },
                "100": {
                    type: "WEBM",
                    quality: "[3D] - 360p"
                },
                "101": {
                    type: "WEBM",
                    quality: "[3D] - 360p"
                },
                "102": {
                    type: "WEBM",
                    quality: "[3D] - 720p"
                },
                "171": {
                    type: "WEBM",
                    quality: "128 kbps (Audio Only)"
                },
                "172": {
                    type: "WEBM",
                    quality: "192 kbps (Audio Only)"
                }
            };
            var urlmap = unescape(da.body.match("url_encoded_fmt_stream_map=([^&]+)")[1]).split(/,/gi);
            for (i = 0; i <= urlmap.length; i++) {
                if (urlmap[i] == undefined) break;
                var itag = parseInt(urlmap[i].match("itag=([^&]+)")[1]);
                var url = unescape(urlmap[i].match("url=([^&]+)")[1]);
                if (url != "") {
                    var sign = "";
                    try {
                        sign = urlmap[i].match("sig=([^&]+)")[1]
                    } catch (e) {
                        try {
                            sign = urlmap[i].match("&s=([^&]+)")[1]
                        } catch (e) {
                            try {
                                sign = urlmap[i].match("^s=([^&]+)")[1]
                            } catch (e) {}
                        }
                    }
                    try {
                        if (sign != "") {
                            log("Itag: " + itag);
                            log("Signature length: " + sign.length);
                            log("Signature: ");
                            log(sign);
                            sign = decipher(sign);
                            log("Deciphered Signature: ");
                            log(sign);
                            url += "&signature=" + sign
                        }
                    } catch (e) {}
                    url += "&title=" + decodeURIComponent(escape(title));
                    if (files[itag] != undefined) {
                        files[itag].url = url;
                        files[itag].rclick = 0
                    }
                }
            }
            try {
                log("getting adaptive links");
                var adamap = unescape(da.body.match("adaptive_fmts=([^&]+)")[1]).split(/,/gi);
                for (i = 0; i <= adamap.length; i++) {
                    if (adamap[i] == undefined) break;
                    var itag = parseInt(adamap[i].match("itag=([^&]+)")[1]);
                    var url = unescape(adamap[i].match("url=([^&]+)")[1]);
                    var size = "";
                    try {
                        size = adamap[i].match("clen=([^&]+)")[1]
                    } catch (e) {
                        log("failed size")
                    }
                    if (url != "") {
                        var sign = "";
                        try {
                            sign = adamap[i].match("sig=([^&]+)")[1]
                        } catch (e) {
                            try {
                                sign = adamap[i].match("&s=([^&]+)")[1]
                            } catch (e) {
                                try {
                                    sign = adamap[i].match("^s=([^&]+)")[1]
                                } catch (e) {}
                            }
                        }
                        try {
                            if (sign != "") {
                                log("Itag: " + itag);
                                log("Signature length: " + sign.length);
                                log("Signature: ");
                                log(sign);
                                sign = decipher(sign);
                                log("Deciphered Signature: ");
                                log(sign);
                                url += "&signature=" + sign
                            }
                        } catch (e) {}
                        url += "&title=" + decodeURIComponent(escape(title));
                        if (files[itag] != undefined) {
                            files[itag].url = url;
                            if (!isNaN(size)) files[itag].size = size;
                            files[itag].rclick = 1
                        }
                    }
                }
            } catch (ex) {}
            for (j = 0; j < order.length; j++) {
                if (files[order[j]] != undefined) {
                    if (files[order[j]].url != undefined) {
                        dl({
                            url: files[order[j]].url,
                            title: unescape(title),
                            type: files[order[j]].type,
                            quality: files[order[j]].quality,
                            newtab: 0,
                            size: files[order[j]].size,
                            showsize: 1,
                            saveas: files[order[j]].rclick
                        })
                    }
                }
            }
            var ttsurl = "";
            try {
                ttsurl = da.body.match("ttsurl=([^&]+)")[1]
            } catch (e) {}
            if (ttsurl != "") {
                // dl({
                    // url: "http://keepvid.com/?url=" + escape("http://youtube.com/watch?v=" + vid) + "&mode=subs",
                    // type: "SRT",
                    // quality: "Subtitles"
                // })
            }
            // dl({
                // url: "http://keepvid.com/?url=" + escape("http://youtube.com/watch?v=" + vid) + "&mode=mp3",
                // type: "MP3",
                // quality: "64/128 kbps"
            // });
            var aaa = (new Date).getTime();
            var __AM = 65521;
            cc = function(a) {
                try {
                    return _cc(a)
                } catch (b) {}
                return 0
            };

            function _cc(a) {
                if ("string" != typeof a) throw Error("se");
                var b = 1,
                    c = 0,
                    d, e;
                for (e = 0; e < a.length; e++) d = a.charCodeAt(e), b = (b + d) % __AM, c = (c + b) % __AM;
                return c << 16 | b
            };
            // ap({
                // params: {
                    // "u": "http://www.youtube-mp3.org/a/itemInfo/?video_id=" + vid + "&ac=www&t=grp&r=" + aaa,
                    // "referer": "http://www.youtube-mp3.org/",
                    // "ua": ua,
                    // "request_type": "old"
                // },
                // "dispose": 1,
                // "callback": function(da) {
                    // var ha = inbtwn(da.body, '"h" : "', '"');
                    // if (ha != "") {
                        // ap({
                            // params: {
                                // "u": "http://www.youtube-mp3.org/get?ab=128&video_id=" + vid + "&h=" + ha + "&r=" + aaa + "." + cc(vid + aaa),
                                // "referer": "http://www.youtube-mp3.org/",
                                // "ua": ua,
                                // "locationonly": "yes"
                            // },
                            // "dispose": 1,
                            // "callback": function(da) {
                                // dl({
                                    // url: da.body,
                                    // type: "MP3",
                                    // quality: "128 kbps",
                                    // noref: 1
                                // })
                            // }
                        // })
                    // }
                // }
            // })
        } else if (status == "fail") {
            log("Error Reason: " + unescape(da.body.match("reason=([^&]+)")[1]).replace(/\+/g, " "));
            if (da.body.match("errorcode=([^&]+)")[1] == "2") error("Invalid YouTube URL. Please check that the link is valid.")
        }
    }
});
          })(location.search)
        })()
      })
    }
  })
})(this)  

})()

