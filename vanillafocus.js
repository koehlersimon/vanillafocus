/**
 * vanillafocus; version: 1.0.0
 * Author: https://simon-koehler.com/en
 * Source: https://github.com/koehlersimon/vanillafocus
 * Copyright (c) 2020 S.Köhler; MIT License
 */
( function( root, factory ) {

    var pln = 'vanillafocus';

    if (typeof define === 'function' && define.amd) {
        define([],factory(pln));
    }
    else if (typeof exports === 'object' ) {
        module.exports = factory(pln);
    }
    else {
        root[pln] = factory(pln);
    }

}( this, function(pln) {

    'use strict';

    var defaults = {
		reCalcOnWindowResize: true,
		throttleDuration: 17
	};

    /**
     * @param {Object} defaults
     * @param {Object} options
     */
    var extend = function( target, options ) {
        var prop, extended = {};
        for ( prop in defaults ) {
            if ( Object.prototype.hasOwnProperty.call( defaults, prop ) ) {
                extended[ prop ] = defaults[ prop ];
            }
        }
        for ( prop in options ) {
            if ( Object.prototype.hasOwnProperty.call( options, prop ) ) {
                extended[ prop ] = options[ prop ];
            }
        }
        return extended;
    };

    /**
     * @param {Object} options
     * @constructor
     */
    function Plugin( options ) {
        this.options = extend( defaults, options );
        this.init();
    }

    /**
     * @public
     * @constructor
     */
    Plugin.prototype = {
        init: function() {
            var selectors = document.querySelectorAll( this.options.selector );
            selectors.forEach((el, i) => {
                var fp = focusPoint(el,this.options);
                if (this.options.reCalcOnWindowResize) fp.windowOn();
            });
        },
        adjustFocus: function() {
            var selectors = document.querySelectorAll( this.options.selector );
            selectors.forEach((el, i) => {
                adjustFocus(el);
            });
        }
    };

    var setupContainer = function(focusElement) {
        let imageSrc = focusElement.querySelector('img').getAttribute('src');
        focusElement.setAttribute('data-image-src', imageSrc);
        resolveImageSize(imageSrc, function(err, dim) {
        focusElement.setAttribute('data-image-w', dim.width);
        focusElement.setAttribute('data-image-h', dim.height);
            adjustFocus(focusElement);
        });
    };

    var resolveImageSize = function(src, cb) {
        let image = document.createElement('img');
        image.src = src;
        image.addEventListener('load',function(e){
            cb(null, {
                width: e.target.width,
                height: e.target.height
            });
        });
    };

	var throttle = function(fn, ms) {
		var isRunning = false;
		return function() {
			var args = Array.prototype.slice.call(arguments, 0);
			if (isRunning) return false;
			isRunning = true;
			setTimeout(function() {
				isRunning = false;
				fn.apply(null, args);
			}, ms);
		};
	};

	var calcShift = function(conToImageRatio, size, imageSize, focusSize, toMinus) {
		var center = Math.floor(size / 2);
		var focusFactor = (focusSize + 1) / 2;
		var scaledImage = Math.floor(imageSize / conToImageRatio);
		var focus =  Math.floor(focusFactor * scaledImage);
		if (toMinus) focus = scaledImage - focus;
		var focusOffset = focus - center;
		var remainder = scaledImage - focus;
		var containerRemainder = size - center;
		if (remainder < containerRemainder) focusOffset -= containerRemainder - remainder;
		if (focusOffset < 0) focusOffset = 0;
		return (focusOffset * -100 / size)  + '%';
	};

    var adjustFocus = function(focusElement) {
        var imageW = focusElement.getAttribute('data-image-w');
        var imageH = focusElement.getAttribute('data-image-h');
        var imageSrc = focusElement.getAttribute('data-image-src');

        if (!imageW || !imageH || !imageSrc) {
        	return setupContainer(focusElement);
        }

        var containerW = focusElement.offsetWidth;
        var containerH = focusElement.offsetHeight;
        var focusX = parseFloat(focusElement.getAttribute('data-focus-x'));
        var focusY = parseFloat(focusElement.getAttribute('data-focus-y'));
        var image = focusElement.querySelector('img');

        var hShift = 0;
        var vShift = 0;

        if (!(containerW > 0 && containerH > 0 && imageW > 0 && imageH > 0)) {
        	return false;
        }

        var wR = imageW / containerW;
        var hR = imageH / containerH;

        image.style.maxWidth = '';
        image.style.maxHeight = '';

        if (imageW > containerW && imageH > containerH) {
        if((wR > hR)){
            image.style.maxHeight = '100%';
        }
        else{
            image.style.maxWidth = '100%';
        }
        }

        if (wR > hR) {
        	hShift = calcShift(hR, containerW, imageW, focusX);
        } else if (wR < hR) {
        	vShift = calcShift(wR, containerH, imageH, focusY, true);
        }

        image.style.top = vShift;
        image.style.left = hShift;

    };

    var focusPoint = function(el, options) {
		var thrAdjustFocus = options.throttleDuration ? throttle(function(){adjustFocus(el);}, options.throttleDuration) : function(){adjustFocus(el);};
		var isListening = false;
		adjustFocus(el);
		return {
			adjustFocus: function() {
				return adjustFocus(el);
			},
			windowOn: function() {
				if (isListening) return;
                window.addEventListener('resize',thrAdjustFocus);
				return isListening = true;
			},
			windowOff: function() {
				if (!isListening) return;
                window.removeEventListener('resize',thrAdjustFocus);
				isListening = false;
				return true;
			}
		};
	};

    return Plugin;

} ) );
