/*! mocha-favicon - v0.0.1 - 2013-04-26 - George Erickson*/
/* http://mit-license.org/ */
/* from https://github.com/Dlom/favicon.js */

(function(global) {
    if (global["favicon"]) {
        return;
    }

    /*\
    |*| Private
    \*/

    var head = global.document.getElementsByTagName("head")[0];
    var sequencePause;
    var iconSequence;
    var iconIndex;
    var loopTimeout = null;
    var preloadIcons = function(icons) {
        var image = new Image();
        for (var i = 0; i < icons.length; i++) {
            image.src = icons[i];
        }
    };
    var addLink = function(iconUrl) {
        var newLink = document.createElement("link");
        newLink.type = "image/x-icon";
        newLink.rel = "icon";
        newLink.href = iconUrl;
        removeLinkIfExists();
        head.appendChild(newLink);
    };
    var removeLinkIfExists = function() {
        var links = head.getElementsByTagName("link");
        var l = links.length;
        for (; --l >= 0; /\bicon\b/i.test(links[l].getAttribute("rel")) && head.removeChild(links[l])) {}
    };

    /*\
    |*| Public
    \*/

    global["favicon"] = {
        "defaultPause": 2000,
        "change": function(iconURL, optionalDocTitle) {
            clearTimeout(loopTimeout);
            if (optionalDocTitle) {
                document.title = optionalDocTitle;
            }
            if (iconURL !== "") {
                addLink(iconURL);
            }
        },
        "animate": function(icons, optionalDelay) {
            clearTimeout(loopTimeout);
            var that = this;
            preloadIcons(icons);
            iconSequence = icons;
            sequencePause = (optionalDelay) ? optionalDelay : that["defaultPause"];
            iconIndex = 0;
            that["change"](iconSequence[0]);
            loopTimeout = setTimeout(function animateFunc() {
                iconIndex = (iconIndex + 1) % iconSequence.length;
                addLink(iconSequence[iconIndex]);
                loopTimeout = setTimeout(animateFunc, sequencePause);
            }, sequencePause);
        },
        "stopAnimate": function() {
            clearTimeout(loopTimeout);
        }
    };
})(this);

(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.MochaFavicon = function(runner) {
    var icons, url;

    url = function(u) {
      return u;
    };
    icons = {
      fail: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAVFBMVEX///+AAADMAACqAACSAACfAADNAADMAADKAADIAADMAADMAADMAADLAADMAADMAADLAADJAADKAADMAADKAADMAADMAADLAADKAADKAADMAADMAACTp2L9AAAAG3RSTlMABAUGBwh1eHl+gYaVl5qgoam2vcDCw8TFxsiFO5zWAAAAmUlEQVQYGa3BSULCQAAAwUZwQRFBEJf+/z9NZjJrkhtV3NEjtT96uqPQX1oOdiQOvqkZbIkMbhROHhg5uZGYbQCzK5GVDVauBK76IXLFF4mLLhQu+KTmzJmWnRM9G+/M2GDGDh1naLiAiovIXMHEVQRvVg5YI3g1OwAWTPZOjoxMyPYGRyIjKi8OPkgc0XjWE4VK5+lMTe7mHxQDMdCbJ1M7AAAAAElFTkSuQmCC'),
      pass: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAASFBMVEX///8A/wAA//8A/6oA/8wA1bMA2LEA1K0A0bMA1rAA0a4A1q4A07EA1rAA17IA1K8A1rEA1rAA17EA1rIA1rIA1LAA1rIA1rK6jUPZAAAAF3RSTlMAAQEDBR4nNUNKX3uGlJ6sra7E6/Hz/kQklvsAAAB0SURBVDjLtdM3DsNADERRyjln693/pi4kV5aWBhbLisB8DBgjGsUTzOsa61Grb+BWYbBO9IA+A1oY7N2H5DENgN03W/wCW7AqlHgcp9PjPFnbeyAKPYKuNARjLOeAg//u6FWx57hkQOBaBLrEICIF4tTijT/Uow53R9nCkQAAAABJRU5ErkJggg=='),
      pending: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAh1BMVEX///8A//8AgP8AgIAAmcwAgKoAgNUAgJ8AgK8AlLwAmbMAl8YElMEJk8EGk8EGlcEHlcQJmMQKk8EKlsUKlsQIlsMLmMIKlsIIlsIIlsMLlMMLl8MJlsQKlcQJlcIJl8IJl8UJlcQKl8QJlcQKlsMLlsQLl8QJl8QJl8QJlcIJl8IJlcQLl8QZb/IfAAAALHRSTlMAAQIEBQYGCBATFDE+V1pbbHSAg4WIj6CipampsbTIycnK0tvn6fL5+vv8/ROxWxQAAACvSURBVBgZrcFXQsJAAAXAZ0HF3hv2Xub+5zMLEROy/jGTJTvRuMg/XvzJ0JmetyzQuE/rWCM9Gul4QjowSc8YmbvmPAvWkV/IwCmjzHyQCmSGq1SskBlSxSTFI6lCCqTqkBTcpWpECu5SNSIF36naJcUnqXomxQ6p4itTjFPDZqaQinfSYj9D3KaFDCBzyAKkA1vpwkG6NDL3ir30KW7WktVLRQaOdDykZkNrO8v0A0kPIWM0HLDMAAAAAElFTkSuQmCC')
    };
    favicon.change(icons.pending, "Running");
    return runner.on('end', function() {
      if (runner.failures) {
        return favicon.change(icons.fail, "Fail " + runner.failures);
      } else {
        return favicon.change(icons.pass, "Pass " + (runner.total - runner.failures));
      }
    });
  };

}).call(this);
