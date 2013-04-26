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

/*!
 * Tinycon - A small library for manipulating the Favicon
 * Tom Moor, http://tommoor.com
 * Copyright (c) 2012 Tom Moor
 * MIT Licensed
 * @version 0.5
*/

(function(){

	var Tinycon = {};
	var currentFavicon = null;
	var originalFavicon = null;
	var originalTitle = document.title;
	var faviconImage = null;
	var canvas = null;
	var options = {};
	var defaults = {
		width: 7,
		height: 9,
		font: '10px arial',
		colour: '#ffffff',
		background: '#F03D25',
		fallback: true,
		abbreviate: true
	};

	var ua = (function () {
		var agent = navigator.userAgent.toLowerCase();
		// New function has access to 'agent' via closure
		return function (browser) {
			return agent.indexOf(browser) !== -1;
		};
	}());

	var browser = {
		ie: ua('msie'),
		chrome: ua('chrome'),
		webkit: ua('chrome') || ua('safari'),
		safari: ua('safari') && !ua('chrome'),
		mozilla: ua('mozilla') && !ua('chrome') && !ua('safari')
	};

	// private methods
	var getFaviconTag = function(){

		var links = document.getElementsByTagName('link');

		for(var i=0, len=links.length; i < len; i++) {
			if ((links[i].getAttribute('rel') || '').match(/\bicon\b/)) {
				return links[i];
			}
		}

		return false;
	};

	var removeFaviconTag = function(){

		var links = document.getElementsByTagName('link');
		var head = document.getElementsByTagName('head')[0];

		for(var i=0, len=links.length; i < len; i++) {
			var exists = (typeof(links[i]) !== 'undefined');
			if (exists && (links[i].getAttribute('rel') || '').match(/\bicon\b/)) {
				head.removeChild(links[i]);
			}
		}
	};

	var getCurrentFavicon = function(){

		if (!originalFavicon || !currentFavicon) {
			var tag = getFaviconTag();
			originalFavicon = currentFavicon = tag ? tag.getAttribute('href') : '/favicon.ico';
		}

		return currentFavicon;
	};

	var getCanvas = function (){

		if (!canvas) {
			canvas = document.createElement("canvas");
			canvas.width = 16;
			canvas.height = 16;
		}

		return canvas;
	};

	var setFaviconTag = function(url){
		removeFaviconTag();

		var link = document.createElement('link');
		link.type = 'image/x-icon';
		link.rel = 'icon';
		link.href = url;
		document.getElementsByTagName('head')[0].appendChild(link);
	};

	var log = function(message){
		if (window.console) window.console.log(message);
	};

	var drawFavicon = function(label, colour) {

		// fallback to updating the browser title if unsupported
		if (!getCanvas().getContext || browser.ie || browser.safari || options.fallback === 'force') {
			return updateTitle(label);
		}

		var context = getCanvas().getContext("2d");
		var colour = colour || '#000000';
		var src = getCurrentFavicon();

		faviconImage = new Image();
		faviconImage.onload = function() {

			// clear canvas
			context.clearRect(0, 0, 16, 16);

			// draw original favicon
			context.drawImage(faviconImage, 0, 0, faviconImage.width, faviconImage.height, 0, 0, 16, 16);

			// draw bubble over the top
			if ((label + '').length > 0) drawBubble(context, label, colour);

			// refresh tag in page
			refreshFavicon();
		};

		// allow cross origin resource requests if the image is not a data:uri
		// as detailed here: https://github.com/mrdoob/three.js/issues/1305
		if (!src.match(/^data/)) {
			faviconImage.crossOrigin = 'anonymous';
		}

		faviconImage.src = src;
	};

	var updateTitle = function(label) {

		if (options.fallback) {
			if ((label + '').length > 0) {
				document.title = '(' + label + ') ' + originalTitle;
			} else {
				document.title = originalTitle;
			}
		}
	};

	var drawBubble = function(context, label, colour) {

		// automatic abbreviation for long (>2 digits) numbers
		if (typeof label == 'number' && label > 99 && options.abbreviate) {
			label = abbreviateNumber(label);
		}

		// bubble needs to be larger for double digits
		var len = (label + '').length-1;
		var width = options.width + (6*len);
		var w = 16-width;
		var h = 16-options.height;

		// webkit seems to render fonts lighter than firefox
		context.font = (browser.webkit ? 'bold ' : '') + options.font;
		context.fillStyle = options.background;
		context.strokeStyle = options.background;
		context.lineWidth = 1;

		// bubble
		context.fillRect(w,h,width-1,options.height);

		// rounded left
		context.beginPath();
		context.moveTo(w-0.5,h+1);
		context.lineTo(w-0.5,15);
		context.stroke();

		// rounded right
		context.beginPath();
		context.moveTo(15.5,h+1);
		context.lineTo(15.5,15);
		context.stroke();

		// bottom shadow
		context.beginPath();
		context.strokeStyle = "rgba(0,0,0,0.3)";
		context.moveTo(w,16);
		context.lineTo(15,16);
		context.stroke();

		// label
		context.fillStyle = options.colour;
		context.textAlign = "right";
		context.textBaseline = "top";

		// unfortunately webkit/mozilla are a pixel different in text positioning
		context.fillText(label, 15, browser.mozilla ? 7 : 6);
	};

	var refreshFavicon = function(){
		// check support
		if (!getCanvas().getContext) return;

		setFaviconTag(getCanvas().toDataURL());
	};

	var abbreviateNumber = function(label) {
		var metricPrefixes = [
			['G', 1000000000],
			['M',    1000000],
			['k',       1000]
		];

		for(var i = 0; i < metricPrefixes.length; ++i) {
			if (label >= metricPrefixes[i][1]) {
				label = round(label / metricPrefixes[i][1]) + metricPrefixes[i][0];
				break;
			}
		}

		return label;
	};

	var round = function (value, precision) {
		var number = new Number(value);
		return number.toFixed(precision);
	};

	// public methods
	Tinycon.setOptions = function(custom){
		options = {};

		for(var key in defaults){
			options[key] = custom.hasOwnProperty(key) ? custom[key] : defaults[key];
		}
		return this;
	};

	Tinycon.setImage = function(url){
		currentFavicon = url;
		refreshFavicon();
		return this;
	};

	Tinycon.setBubble = function(label, colour) {
		label = label || '';
		drawFavicon(label, colour);
		return this;
	};

	Tinycon.reset = function(){
		setFaviconTag(originalFavicon);
	};

	Tinycon.setOptions(defaults);
	window.Tinycon = Tinycon;
})();

(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.MochaFavicon = function(runner) {
    var count, icons, title, url;

    url = function(u) {
      return u;
    };
    icons = {
      fail: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAVFBMVEX///+AAADMAACqAACSAACfAADNAADMAADKAADIAADMAADMAADMAADLAADMAADMAADLAADJAADKAADMAADKAADMAADMAADLAADKAADKAADMAADMAACTp2L9AAAAG3RSTlMABAUGBwh1eHl+gYaVl5qgoam2vcDCw8TFxsiFO5zWAAAAmUlEQVQYGa3BSULCQAAAwUZwQRFBEJf+/z9NZjJrkhtV3NEjtT96uqPQX1oOdiQOvqkZbIkMbhROHhg5uZGYbQCzK5GVDVauBK76IXLFF4mLLhQu+KTmzJmWnRM9G+/M2GDGDh1naLiAiovIXMHEVQRvVg5YI3g1OwAWTPZOjoxMyPYGRyIjKi8OPkgc0XjWE4VK5+lMTe7mHxQDMdCbJ1M7AAAAAElFTkSuQmCC'),
      pass: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAASFBMVEX///8A/wAA//8A/6oA/8wA1bMA2LEA1K0A0bMA1rAA0a4A1q4A07EA1rAA17IA1K8A1rEA1rAA17EA1rIA1rIA1LAA1rIA1rK6jUPZAAAAF3RSTlMAAQEDBR4nNUNKX3uGlJ6sra7E6/Hz/kQklvsAAAB0SURBVDjLtdM3DsNADERRyjln693/pi4kV5aWBhbLisB8DBgjGsUTzOsa61Grb+BWYbBO9IA+A1oY7N2H5DENgN03W/wCW7AqlHgcp9PjPFnbeyAKPYKuNARjLOeAg//u6FWx57hkQOBaBLrEICIF4tTijT/Uow53R9nCkQAAAABJRU5ErkJggg=='),
      pending: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAh1BMVEX///8A//8AgP8AgIAAmcwAgKoAgNUAgJ8AgK8AlLwAmbMAl8YElMEJk8EGk8EGlcEHlcQJmMQKk8EKlsUKlsQIlsMLmMIKlsIIlsIIlsMLlMMLl8MJlsQKlcQJlcIJl8IJl8UJlcQKl8QJlcQKlsMLlsQLl8QJl8QJl8QJlcIJl8IJlcQLl8QZb/IfAAAALHRSTlMAAQIEBQYGCBATFDE+V1pbbHSAg4WIj6CipampsbTIycnK0tvn6fL5+vv8/ROxWxQAAACvSURBVBgZrcFXQsJAAAXAZ0HF3hv2Xub+5zMLEROy/jGTJTvRuMg/XvzJ0JmetyzQuE/rWCM9Gul4QjowSc8YmbvmPAvWkV/IwCmjzHyQCmSGq1SskBlSxSTFI6lCCqTqkBTcpWpECu5SNSIF36naJcUnqXomxQ6p4itTjFPDZqaQinfSYj9D3KaFDCBzyAKkA1vpwkG6NDL3ir30KW7WktVLRQaOdDykZkNrO8v0A0kPIWM0HLDMAAAAAElFTkSuQmCC')
    };
    title = 'Running';
    favicon.change(icons.pending, title);
    count = 0;
    runner.on('test end', function() {
      count += 1;
      return document.title = "" + title + " [" + count + "]";
    });
    runner.on('fail', function() {
      Tinycon.setBubble(runner.failures, 'red');
      return title = 'Failing';
    });
    return runner.on('end', function() {
      if (runner.failures) {
        return favicon.change(icons.fail, "Fail " + runner.failures + "/" + runner.total);
      } else {
        return favicon.change(icons.pass, "Pass " + runner.total);
      }
    });
  };

}).call(this);
