// Load dependencies.
const babelMinify = require('babel-minify');
const babel = require('@babel/standalone');

babel.transformSync = babel.transform;

// URI-encode only a subset of characters. Most user agents are permissive with
// non-reserved characters, so don't obfuscate more than we have to.
const specialCharacters = [ '%', '"', '<', '>', '#', '@', ' ', '\\&', '\\?' ];

// CDN URL for jQuery.
const jqueryURL = 'https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js';

// Default minimum jQuery version.
const jqueryMinVersion = 1.7;

// Check if given version is valid
const isValidVersion = version => {
  const nums = version.split('.');
  return nums.every(num => Number.isInteger(Number(num)) && Number(num) >= 0);
};

// Create a bookmarklet.
module.exports = (code, options = {}) => {
  // Validate options
  if (typeof options !== 'object') {
    throw new Error('Options must be an object');
  }

  // Validate jQuery version
  if (options.jQueryVersion && !isValidVersion(options.jQueryVersion)) {
    throw new Error('Invalid jQuery version');
  }

  // Add jQuery? (also adds IIFE wrapper).
  if (options.addjQuery || options.addjquery) {
    options.addjQuery = true;

    // Validate jQuery version
    if (options.jQueryVersion) {
      if (!isValidVersion(options.jQueryVersion)) {
        throw new Error('Invalid jQuery version');
      }

      code = jquery(code, options.jQueryVersion);
    } else {
      code = jquery(code, jqueryMinVersion);
    }
  }

  // Add IIFE wrapper?
  if ((options.addIIFE || options.addAnonymize) && !options.addjQuery) {
    code = iife(code);
  }

  // Transpile?
  if (options.transpile) {
    code = transpile(code);
  }

  // Minify by default
  try {
    code = minify(code, options.mangleVars);
  } catch (err) {
    console.error('Error minifying code:', err);
  }

  // If code minifies down to nothing, stop processing.
  if ('' === code.replace(/^"use strict";/, '').replace(/^void function\(\){}\(\);$/, '')) {
    return null;
  }

  // URL-encode by default.
  if (options.urlEncode || typeof options.urlEncode === 'undefined') {
    code = urlencode(code);
  }

  // Add javascript prefix.
  return prefix(code);
};

// jQuery wrapper
const jquery = (code, version) => {
  const jqueryCode = `
    void function ($) {
      var loadBookmarklet = function ($) {${code}};
      if($ && $.fn && parseFloat($.fn.jquery) >= ${version}) {
        load($);
        return;
      }

      var s = document.createElement('script');
      s.src = '${jqueryURL}';
      s.onload = s.onreadystatechange = function () {
        var state = this.readyState;
        if(!state || state === 'loaded' || state === 'complete') {
          loadBookmarklet(jQuery.noConflict());
        }
      };

      document.getElementsByTagName('head')[0].appendChild(s);
    }(window.jQuery);
  `;

  return jqueryCode;
};

// IIFE wrapper
const iife = code => `void function () {${code}\n}();`;

// Minify code
const minify = (code, mangle) => {
  try {
    return babelMinify(code, { mangle, deadcode: mangle }, { babel, comments: false }).code;
  } catch (err) {
    console.error('Error minifying code:', err);
  }
};

// Transpile code
const transpile = code =>
  babel.transform(code, {
    comments: false,
    filename: 'bookmarklet.js',
    presets: ['env'],
    targets: '> 2%, not dead',
  }).code;

// URL encode code
const urlencode = code =>
  code.replace(new RegExp(specialCharacters.join('|'), 'g'), encodeURIComponent);

// Add javascript prefix
const prefix = code => `javascript:${code}`;
