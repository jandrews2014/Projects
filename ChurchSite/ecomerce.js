/* Prototype JavaScript framework, version 1.6.0.3
 * (c) 2005-2008 Sam Stephenson
 *
 * Prototype is freely distributable under the terms of an MIT-style license.
 * For details, see the Prototype web site: http://www.prototypejs.org/
 *
 *--------------------------------------------------------------------------*/

var Prototype = {
 Version: '1.6.0.3',

 Browser: {
 IE: !!(window.attachEvent &&
 navigator.userAgent.indexOf('Opera') === -1),
 Opera: navigator.userAgent.indexOf('Opera') > -1,
 WebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
 Gecko: navigator.userAgent.indexOf('Gecko') > -1 &&
 navigator.userAgent.indexOf('KHTML') === -1,
 MobileSafari: !!navigator.userAgent.match(/Apple.*Mobile.*Safari/)
 },

 BrowserFeatures: {
 XPath: !!document.evaluate,
 SelectorsAPI: !!document.querySelector,
 ElementExtensions: !!window.HTMLElement,
 SpecificElementExtensions:
 document.createElement('div')['__proto__'] &&
 document.createElement('div')['__proto__'] !==
 document.createElement('form')['__proto__']
 },

 ScriptFragment: '<script[^>]*>([\\S\\s]*?)<\/script>',
 JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,

 emptyFunction: function() { },
 K: function(x) { return x }
};

if (Prototype.Browser.MobileSafari)
 Prototype.BrowserFeatures.SpecificElementExtensions = false;


/* Based on Alex Arnell's inheritance implementation. */
var Class = {
 create: function() {
 var parent = null, properties = $A(arguments);
 if (Object.isFunction(properties[0]))
 parent = properties.shift();

 function klass() {
 this.initialize.apply(this, arguments);
 }

 Object.extend(klass, Class.Methods);
 klass.superclass = parent;
 klass.subclasses = [];

 if (parent) {
 var subclass = function() { };
 subclass.prototype = parent.prototype;
 klass.prototype = new subclass;
 parent.subclasses.push(klass);
 }

 for (var i = 0; i < properties.length; i++)
 klass.addMethods(properties[i]);

 if (!klass.prototype.initialize)
 klass.prototype.initialize = Prototype.emptyFunction;

 klass.prototype.constructor = klass;

 return klass;
 }
};

Class.Methods = {
 addMethods: function(source) {
 var ancestor = this.superclass && this.superclass.prototype;
 var properties = Object.keys(source);

 if (!Object.keys({ toString: true }).length)
 properties.push("toString", "valueOf");

 for (var i = 0, length = properties.length; i < length; i++) {
 var property = properties[i], value = source[property];
 if (ancestor && Object.isFunction(value) &&
 value.argumentNames().first() == "$super") {
 var method = value;
 value = (function(m) {
 return function() { return ancestor[m].apply(this, arguments) };
 })(property).wrap(method);

 value.valueOf = method.valueOf.bind(method);
 value.toString = method.toString.bind(method);
 }
 this.prototype[property] = value;
 }

 return this;
 }
};

var Abstract = { };

Object.extend = function(destination, source) {
 for (var property in source)
 destination[property] = source[property];
 return destination;
};

Object.extend(Object, {
 inspect: function(object) {
 try {
 if (Object.isUndefined(object)) return 'undefined';
 if (object === null) return 'null';
 return object.inspect ? object.inspect() : String(object);
 } catch (e) {
 if (e instanceof RangeError) return '...';
 throw e;
 }
 },

 toJSON: function(object) {
 var type = typeof object;
 switch (type) {
 case 'undefined':
 case 'function':
 case 'unknown': return;
 case 'boolean': return object.toString();
 }

 if (object === null) return 'null';
 if (object.toJSON) return object.toJSON();
 if (Object.isElement(object)) return;

 var results = [];
 for (var property in object) {
 var value = Object.toJSON(object[property]);
 if (!Object.isUndefined(value))
 results.push(property.toJSON() + ': ' + value);
 }

 return '{' + results.join(', ') + '}';
 },

 toQueryString: function(object) {
 return $H(object).toQueryString();
 },

 toHTML: function(object) {
 return object && object.toHTML ? object.toHTML() : String.interpret(object);
 },

 keys: function(object) {
 var keys = [];
 for (var property in object)
 keys.push(property);
 return keys;
 },

 values: function(object) {
 var values = [];
 for (var property in object)
 values.push(object[property]);
 return values;
 },

 clone: function(object) {
 return Object.extend({ }, object);
 },

 isElement: function(object) {
 return !!(object && object.nodeType == 1);
 },

 isArray: function(object) {
 return object != null && typeof object == "object" &&
 'splice' in object && 'join' in object;
 },

 isHash: function(object) {
 return object instanceof Hash;
 },

 isFunction: function(object) {
 return typeof object == "function";
 },

 isString: function(object) {
 return typeof object == "string";
 },

 isNumber: function(object) {
 return typeof object == "number";
 },

 isUndefined: function(object) {
 return typeof object == "undefined";
 }
});

Object.extend(Function.prototype, {
 argumentNames: function() {
 var names = this.toString().match(/^[\s\(]*function[^(]*\(([^\)]*)\)/)[1]
 .replace(/\s+/g, '').split(',');
 return names.length == 1 && !names[0] ? [] : names;
 },

 bind: function() {
 if (arguments.length < 2 && Object.isUndefined(arguments[0])) return this;
 var __method = this, args = $A(arguments), object = args.shift();
 return function() {
 return __method.apply(object, args.concat($A(arguments)));
 }
 },

 bindAsEventListener: function() {
 var __method = this, args = $A(arguments), object = args.shift();
 return function(event) {
 return __method.apply(object, [event || window.event].concat(args));
 }
 },

 curry: function() {
 if (!arguments.length) return this;
 var __method = this, args = $A(arguments);
 return function() {
 return __method.apply(this, args.concat($A(arguments)));
 }
 },

 delay: function() {
 var __method = this, args = $A(arguments), timeout = args.shift() * 1000;
 return window.setTimeout(function() {
 return __method.apply(__method, args);
 }, timeout);
 },

 defer: function() {
 var args = [0.01].concat($A(arguments));
 return this.delay.apply(this, args);
 },

 wrap: function(wrapper) {
 var __method = this;
 return function() {
 return wrapper.apply(this, [__method.bind(this)].concat($A(arguments)));
 }
 },

 methodize: function() {
 if (this._methodized) return this._methodized;
 var __method = this;
 return this._methodized = function() {
 return __method.apply(null, [this].concat($A(arguments)));
 };
 }
});

Date.prototype.toJSON = function() {
 return '"' + this.getUTCFullYear() + '-' +
 (this.getUTCMonth() + 1).toPaddedString(2) + '-' +
 this.getUTCDate().toPaddedString(2) + 'T' +
 this.getUTCHours().toPaddedString(2) + ':' +
 this.getUTCMinutes().toPaddedString(2) + ':' +
 this.getUTCSeconds().toPaddedString(2) + 'Z"';
};

var Try = {
 these: function() {
 var returnValue;

 for (var i = 0, length = arguments.length; i < length; i++) {
 var lambda = arguments[i];
 try {
 returnValue = lambda();
 break;
 } catch (e) { }
 }

 return returnValue;
 }
};

RegExp.prototype.match = RegExp.prototype.test;

RegExp.escape = function(str) {
 return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
};

/*--------------------------------------------------------------------------*/

var PeriodicalExecuter = Class.create({
 initialize: function(callback, frequency) {
 this.callback = callback;
 this.frequency = frequency;
 this.currentlyExecuting = false;

 this.registerCallback();
 },

 registerCallback: function() {
 this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
 },

 execute: function() {
 this.callback(this);
 },

 stop: function() {
 if (!this.timer) return;
 clearInterval(this.timer);
 this.timer = null;
 },

 onTimerEvent: function() {
 if (!this.currentlyExecuting) {
 try {
 this.currentlyExecuting = true;
 this.execute();
 } finally {
 this.currentlyExecuting = false;
 }
 }
 }
});
Object.extend(String, {
 interpret: function(value) {
 return value == null ? '' : String(value);
 },
 specialChar: {
 '\b': '\\b',
 '\t': '\\t',
 '\n': '\\n',
 '\f': '\\f',
 '\r': '\\r',
 '\\': '\\\\'
 }
});

Object.extend(String.prototype, {
 gsub: function(pattern, replacement) {
 var result = '', source = this, match;
 replacement = arguments.callee.prepareReplacement(replacement);

 while (source.length > 0) {
 if (match = source.match(pattern)) {
 result += source.slice(0, match.index);
 result += String.interpret(replacement(match));
 source = source.slice(match.index + match[0].length);
 } else {
 result += source, source = '';
 }
 }
 return result;
 },

 sub: function(pattern, replacement, count) {
 replacement = this.gsub.prepareReplacement(replacement);
 count = Object.isUndefined(count) ? 1 : count;

 return this.gsub(pattern, function(match) {
 if (--count < 0) return match[0];
 return replacement(match);
 });
 },

 scan: function(pattern, iterator) {
 this.gsub(pattern, iterator);
 return String(this);
 },

 truncate: function(length, truncation) {
 length = length || 30;
 truncation = Object.isUndefined(truncation) ? '...' : truncation;
 return this.length > length ?
 this.slice(0, length - truncation.length) + truncation : String(this);
 },

 strip: function() {
 return this.replace(/^\s+/, '').replace(/\s+$/, '');
 },

 stripTags: function() {
 return this.replace(/<\/?[^>]+>/gi, '');
 },

 stripScripts: function() {
 return this.replace(new RegExp(Prototype.ScriptFragment, 'img'), '');
 },

 extractScripts: function() {
 var matchAll = new RegExp(Prototype.ScriptFragment, 'img');
 var matchOne = new RegExp(Prototype.ScriptFragment, 'im');
 return (this.match(matchAll) || []).map(function(scriptTag) {
 return (scriptTag.match(matchOne) || ['', ''])[1];
 });
 },

 evalScripts: function() {
 return this.extractScripts().map(function(script) { return eval(script) });
 },

 escapeHTML: function() {
 var self = arguments.callee;
 self.text.data = this;
 return self.div.innerHTML;
 },

 unescapeHTML: function() {
 var div = new Element('div');
 div.innerHTML = this.stripTags();
 return div.childNodes[0] ? (div.childNodes.length > 1 ?
 $A(div.childNodes).inject('', function(memo, node) { return memo+node.nodeValue }) :
 div.childNodes[0].nodeValue) : '';
 },

 toQueryParams: function(separator) {
 var match = this.strip().match(/([^?#]*)(#.*)?$/);
 if (!match) return { };

 return match[1].split(separator || '&').inject({ }, function(hash, pair) {
 if ((pair = pair.split('='))[0]) {
 var key = decodeURIComponent(pair.shift());
 var value = pair.length > 1 ? pair.join('=') : pair[0];
 if (value != undefined) value = decodeURIComponent(value);

 if (key in hash) {
 if (!Object.isArray(hash[key])) hash[key] = [hash[key]];
 hash[key].push(value);
 }
 else hash[key] = value;
 }
 return hash;
 });
 },

 toArray: function() {
 return this.split('');
 },

 succ: function() {
 return this.slice(0, this.length - 1) +
 String.fromCharCode(this.charCodeAt(this.length - 1) + 1);
 },

 times: function(count) {
 return count < 1 ? '' : new Array(count + 1).join(this);
 },

 camelize: function() {
 var parts = this.split('-'), len = parts.length;
 if (len == 1) return parts[0];

 var camelized = this.charAt(0) == '-'
 ? parts[0].charAt(0).toUpperCase() + parts[0].substring(1)
 : parts[0];

 for (var i = 1; i < len; i++)
 camelized += parts[i].charAt(0).toUpperCase() + parts[i].substring(1);

 return camelized;
 },

 capitalize: function() {
 return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
 },

 underscore: function() {
 return this.gsub(/::/, '/').gsub(/([A-Z]+)([A-Z][a-z])/,'#{1}_#{2}').gsub(/([a-z\d])([A-Z])/,'#{1}_#{2}').gsub(/-/,'_').toLowerCase();
 },

 dasherize: function() {
 return this.gsub(/_/,'-');
 },

 inspect: function(useDoubleQuotes) {
 var escapedString = this.gsub(/[\x00-\x1f\\]/, function(match) {
 var character = String.specialChar[match[0]];
 return character ? character : '\\u00' + match[0].charCodeAt().toPaddedString(2, 16);
 });
 if (useDoubleQuotes) return '"' + escapedString.replace(/"/g, '\\"') + '"';
 return "'" + escapedString.replace(/'/g, '\\\'') + "'";
 },

 toJSON: function() {
 return this.inspect(true);
 },

 unfilterJSON: function(filter) {
 return this.sub(filter || Prototype.JSONFilter, '#{1}');
 },

 isJSON: function() {
 var str = this;
 if (str.blank()) return false;
 str = this.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '');
 return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);
 },

 evalJSON: function(sanitize) {
 var json = this.unfilterJSON();
 try {
 if (!sanitize || json.isJSON()) return eval('(' + json + ')');
 } catch (e) { }
 throw new SyntaxError('Badly formed JSON string: ' + this.inspect());
 },

 include: function(pattern) {
 return this.indexOf(pattern) > -1;
 },

 startsWith: function(pattern) {
 return this.indexOf(pattern) === 0;
 },

 endsWith: function(pattern) {
 var d = this.length - pattern.length;
 return d >= 0 && this.lastIndexOf(pattern) === d;
 },

 empty: function() {
 return this == '';
 },

 blank: function() {
 return /^\s*$/.test(this);
 },

 interpolate: function(object, pattern) {
 return new Template(this, pattern).evaluate(object);
 }
});

if (Prototype.Browser.WebKit || Prototype.Browser.IE) Object.extend(String.prototype, {
 escapeHTML: function() {
 return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
 },
 unescapeHTML: function() {
 return this.stripTags().replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
 }
});

String.prototype.gsub.prepareReplacement = function(replacement) {
 if (Object.isFunction(replacement)) return replacement;
 var template = new Template(replacement);
 return function(match) { return template.evaluate(match) };
};

String.prototype.parseQuery = String.prototype.toQueryParams;

Object.extend(String.prototype.escapeHTML, {
 div: document.createElement('div'),
 text: document.createTextNode('')
});

String.prototype.escapeHTML.div.appendChild(String.prototype.escapeHTML.text);

var Template = Class.create({
 initialize: function(template, pattern) {
 this.template = template.toString();
 this.pattern = pattern || Template.Pattern;
 },

 evaluate: function(object) {
 if (Object.isFunction(object.toTemplateReplacements))
 object = object.toTemplateReplacements();

 return this.template.gsub(this.pattern, function(match) {
 if (object == null) return '';

 var before = match[1] || '';
 if (before == '\\') return match[2];

 var ctx = object, expr = match[3];
 var pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
 match = pattern.exec(expr);
 if (match == null) return before;

 while (match != null) {
 var comp = match[1].startsWith('[') ? match[2].gsub('\\\\]', ']') : match[1];
 ctx = ctx[comp];
 if (null == ctx || '' == match[3]) break;
 expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
 match = pattern.exec(expr);
 }

 return before + String.interpret(ctx);
 });
 }
});
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;

var $break = { };

var Enumerable = {
 each: function(iterator, context) {
 var index = 0;
 try {
 this._each(function(value) {
 iterator.call(context, value, index++);
 });
 } catch (e) {
 if (e != $break) throw e;
 }
 return this;
 },

 eachSlice: function(number, iterator, context) {
 var index = -number, slices = [], array = this.toArray();
 if (number < 1) return array;
 while ((index += number) < array.length)
 slices.push(array.slice(index, index+number));
 return slices.collect(iterator, context);
 },

 all: function(iterator, context) {
 iterator = iterator || Prototype.K;
 var result = true;
 this.each(function(value, index) {
 result = result && !!iterator.call(context, value, index);
 if (!result) throw $break;
 });
 return result;
 },

 any: function(iterator, context) {
 iterator = iterator || Prototype.K;
 var result = false;
 this.each(function(value, index) {
 if (result = !!iterator.call(context, value, index))
 throw $break;
 });
 return result;
 },

 collect: function(iterator, context) {
 iterator = iterator || Prototype.K;
 var results = [];
 this.each(function(value, index) {
 results.push(iterator.call(context, value, index));
 });
 return results;
 },

 detect: function(iterator, context) {
 var result;
 this.each(function(value, index) {
 if (iterator.call(context, value, index)) {
 result = value;
 throw $break;
 }
 });
 return result;
 },

 findAll: function(iterator, context) {
 var results = [];
 this.each(function(value, index) {
 if (iterator.call(context, value, index))
 results.push(value);
 });
 return results;
 },

 grep: function(filter, iterator, context) {
 iterator = iterator || Prototype.K;
 var results = [];

 if (Object.isString(filter))
 filter = new RegExp(filter);

 this.each(function(value, index) {
 if (filter.match(value))
 results.push(iterator.call(context, value, index));
 });
 return results;
 },

 include: function(object) {
 if (Object.isFunction(this.indexOf))
 if (this.indexOf(object) != -1) return true;

 var found = false;
 this.each(function(value) {
 if (value == object) {
 found = true;
 throw $break;
 }
 });
 return found;
 },

 inGroupsOf: function(number, fillWith) {
 fillWith = Object.isUndefined(fillWith) ? null : fillWith;
 return this.eachSlice(number, function(slice) {
 while(slice.length < number) slice.push(fillWith);
 return slice;
 });
 },

 inject: function(memo, iterator, context) {
 this.each(function(value, index) {
 memo = iterator.call(context, memo, value, index);
 });
 return memo;
 },

 invoke: function(method) {
 var args = $A(arguments).slice(1);
 return this.map(function(value) {
 return value[method].apply(value, args);
 });
 },

 max: function(iterator, context) {
 iterator = iterator || Prototype.K;
 var result;
 this.each(function(value, index) {
 value = iterator.call(context, value, index);
 if (result == null || value >= result)
 result = value;
 });
 return result;
 },

 min: function(iterator, context) {
 iterator = iterator || Prototype.K;
 var result;
 this.each(function(value, index) {
 value = iterator.call(context, value, index);
 if (result == null || value < result)
 result = value;
 });
 return result;
 },

 partition: function(iterator, context) {
 iterator = iterator || Prototype.K;
 var trues = [], falses = [];
 this.each(function(value, index) {
 (iterator.call(context, value, index) ?
 trues : falses).push(value);
 });
 return [trues, falses];
 },

 pluck: function(property) {
 var results = [];
 this.each(function(value) {
 results.push(value[property]);
 });
 return results;
 },

 reject: function(iterator, context) {
 var results = [];
 this.each(function(value, index) {
 if (!iterator.call(context, value, index))
 results.push(value);
 });
 return results;
 },

 sortBy: function(iterator, context) {
 return this.map(function(value, index) {
 return {
 value: value,
 criteria: iterator.call(context, value, index)
 };
 }).sort(function(left, right) {
 var a = left.criteria, b = right.criteria;
 return a < b ? -1 : a > b ? 1 : 0;
 }).pluck('value');
 },

 toArray: function() {
 return this.map();
 },

 zip: function() {
 var iterator = Prototype.K, args = $A(arguments);
 if (Object.isFunction(args.last()))
 iterator = args.pop();

 var collections = [this].concat(args).map($A);
 return this.map(function(value, index) {
 return iterator(collections.pluck(index));
 });
 },

 size: function() {
 return this.toArray().length;
 },

 inspect: function() {
 return '#<Enumerable:' + this.toArray().inspect() + '>';
 }
};

Object.extend(Enumerable, {
 map: Enumerable.collect,
 find: Enumerable.detect,
 select: Enumerable.findAll,
 filter: Enumerable.findAll,
 member: Enumerable.include,
 entries: Enumerable.toArray,
 every: Enumerable.all,
 some: Enumerable.any
});
function $A(iterable) {
 if (!iterable) return [];
 if (iterable.toArray) return iterable.toArray();
 var length = iterable.length || 0, results = new Array(length);
 while (length--) results[length] = iterable[length];
 return results;
}

if (Prototype.Browser.WebKit) {
 $A = function(iterable) {
 if (!iterable) return [];
 // In Safari, only use the `toArray` method if it's not a NodeList.
 // A NodeList is a function, has an function `item` property, and a numeric
 // `length` property. Adapted from Google Doctype.
 if (!(typeof iterable === 'function' && typeof iterable.length ===
 'number' && typeof iterable.item === 'function') && iterable.toArray)
 return iterable.toArray();
 var length = iterable.length || 0, results = new Array(length);
 while (length--) results[length] = iterable[length];
 return results;
 };
}

Array.from = $A;

Object.extend(Array.prototype, Enumerable);

if (!Array.prototype._reverse) Array.prototype._reverse = Array.prototype.reverse;

Object.extend(Array.prototype, {
 _each: function(iterator) {
 for (var i = 0, length = this.length; i < length; i++)
 iterator(this[i]);
 },

 clear: function() {
 this.length = 0;
 return this;
 },

 first: function() {
 return this[0];
 },

 last: function() {
 return this[this.length - 1];
 },

 compact: function() {
 return this.select(function(value) {
 return value != null;
 });
 },

 flatten: function() {
 return this.inject([], function(array, value) {
 return array.concat(Object.isArray(value) ?
 value.flatten() : [value]);
 });
 },

 without: function() {
 var values = $A(arguments);
 return this.select(function(value) {
 return !values.include(value);
 });
 },

 reverse: function(inline) {
 return (inline !== false ? this : this.toArray())._reverse();
 },

 reduce: function() {
 return this.length > 1 ? this : this[0];
 },

 uniq: function(sorted) {
 return this.inject([], function(array, value, index) {
 if (0 == index || (sorted ? array.last() != value : !array.include(value)))
 array.push(value);
 return array;
 });
 },

 intersect: function(array) {
 return this.uniq().findAll(function(item) {
 return array.detect(function(value) { return item === value });
 });
 },

 clone: function() {
 return [].concat(this);
 },

 size: function() {
 return this.length;
 },

 inspect: function() {
 return '[' + this.map(Object.inspect).join(', ') + ']';
 },

 toJSON: function() {
 var results = [];
 this.each(function(object) {
 var value = Object.toJSON(object);
 if (!Object.isUndefined(value)) results.push(value);
 });
 return '[' + results.join(', ') + ']';
 }
});

// use native browser JS 1.6 implementation if available
if (Object.isFunction(Array.prototype.forEach))
 Array.prototype._each = Array.prototype.forEach;

if (!Array.prototype.indexOf) Array.prototype.indexOf = function(item, i) {
 i || (i = 0);
 var length = this.length;
 if (i < 0) i = length + i;
 for (; i < length; i++)
 if (this[i] === item) return i;
 return -1;
};

if (!Array.prototype.lastIndexOf) Array.prototype.lastIndexOf = function(item, i) {
 i = isNaN(i) ? this.length : (i < 0 ? this.length + i : i) + 1;
 var n = this.slice(0, i).reverse().indexOf(item);
 return (n < 0) ? n : i - n - 1;
};

Array.prototype.toArray = Array.prototype.clone;

function $w(string) {
 if (!Object.isString(string)) return [];
 string = string.strip();
 return string ? string.split(/\s+/) : [];
}

if (Prototype.Browser.Opera){
 Array.prototype.concat = function() {
 var array = [];
 for (var i = 0, length = this.length; i < length; i++) array.push(this[i]);
 for (var i = 0, length = arguments.length; i < length; i++) {
 if (Object.isArray(arguments[i])) {
 for (var j = 0, arrayLength = arguments[i].length; j < arrayLength; j++)
 array.push(arguments[i][j]);
 } else {
 array.push(arguments[i]);
 }
 }
 return array;
 };
}
Object.extend(Number.prototype, {
 toColorPart: function() {
 return this.toPaddedString(2, 16);
 },

 succ: function() {
 return this + 1;
 },

 times: function(iterator, context) {
 $R(0, this, true).each(iterator, context);
 return this;
 },

 toPaddedString: function(length, radix) {
 var string = this.toString(radix || 10);
 return '0'.times(length - string.length) + string;
 },

 toJSON: function() {
 return isFinite(this) ? this.toString() : 'null';
 }
});

$w('abs round ceil floor').each(function(method){
 Number.prototype[method] = Math[method].methodize();
});
function $H(object) {
 return new Hash(object);
};

var Hash = Class.create(Enumerable, (function() {

 function toQueryPair(key, value) {
 if (Object.isUndefined(value)) return key;
 return key + '=' + encodeURIComponent(String.interpret(value));
 }

 return {
 initialize: function(object) {
 this._object = Object.isHash(object) ? object.toObject() : Object.clone(object);
 },

 _each: function(iterator) {
 for (var key in this._object) {
 var value = this._object[key], pair = [key, value];
 pair.key = key;
 pair.value = value;
 iterator(pair);
 }
 },

 set: function(key, value) {
 return this._object[key] = value;
 },

 get: function(key) {
 // simulating poorly supported hasOwnProperty
 if (this._object[key] !== Object.prototype[key])
 return this._object[key];
 },

 unset: function(key) {
 var value = this._object[key];
 delete this._object[key];
 return value;
 },

 toObject: function() {
 return Object.clone(this._object);
 },

 keys: function() {
 return this.pluck('key');
 },

 values: function() {
 return this.pluck('value');
 },

 index: function(value) {
 var match = this.detect(function(pair) {
 return pair.value === value;
 });
 return match && match.key;
 },

 merge: function(object) {
 return this.clone().update(object);
 },

 update: function(object) {
 return new Hash(object).inject(this, function(result, pair) {
 result.set(pair.key, pair.value);
 return result;
 });
 },

 toQueryString: function() {
 return this.inject([], function(results, pair) {
 var key = encodeURIComponent(pair.key), values = pair.value;

 if (values && typeof values == 'object') {
 if (Object.isArray(values))
 return results.concat(values.map(toQueryPair.curry(key)));
 } else results.push(toQueryPair(key, values));
 return results;
 }).join('&');
 },

 inspect: function() {
 return '#<Hash:{' + this.map(function(pair) {
 return pair.map(Object.inspect).join(': ');
 }).join(', ') + '}>';
 },

 toJSON: function() {
 return Object.toJSON(this.toObject());
 },

 clone: function() {
 return new Hash(this);
 }
 }
})());

Hash.prototype.toTemplateReplacements = Hash.prototype.toObject;
Hash.from = $H;
var ObjectRange = Class.create(Enumerable, {
 initialize: function(start, end, exclusive) {
 this.start = start;
 this.end = end;
 this.exclusive = exclusive;
 },

 _each: function(iterator) {
 var value = this.start;
 while (this.include(value)) {
 iterator(value);
 value = value.succ();
 }
 },

 include: function(value) {
 if (value < this.start)
 return false;
 if (this.exclusive)
 return value < this.end;
 return value <= this.end;
 }
});

var $R = function(start, end, exclusive) {
 return new ObjectRange(start, end, exclusive);
};

var Ajax = {
 getTransport: function() {
 return Try.these(
 function() {return new XMLHttpRequest()},
 function() {return new ActiveXObject('Msxml2.XMLHTTP')},
 function() {return new ActiveXObject('Microsoft.XMLHTTP')}
 ) || false;
 },

 activeRequestCount: 0
};

Ajax.Responders = {
 responders: [],

 _each: function(iterator) {
 this.responders._each(iterator);
 },

 register: function(responder) {
 if (!this.include(responder))
 this.responders.push(responder);
 },

 unregister: function(responder) {
 this.responders = this.responders.without(responder);
 },

 dispatch: function(callback, request, transport, json) {
 this.each(function(responder) {
 if (Object.isFunction(responder[callback])) {
 try {
 responder[callback].apply(responder, [request, transport, json]);
 } catch (e) { }
 }
 });
 }
};

Object.extend(Ajax.Responders, Enumerable);

Ajax.Responders.register({
 onCreate: function() { Ajax.activeRequestCount++ },
 onComplete: function() { Ajax.activeRequestCount-- }
});

Ajax.Base = Class.create({
 initialize: function(options) {
 this.options = {
 method: 'post',
 asynchronous: true,
 contentType: 'application/x-www-form-urlencoded',
 encoding: 'UTF-8',
 parameters: '',
 evalJSON: true,
 evalJS: true
 };
 Object.extend(this.options, options || { });

 this.options.method = this.options.method.toLowerCase();

 if (Object.isString(this.options.parameters))
 this.options.parameters = this.options.parameters.toQueryParams();
 else if (Object.isHash(this.options.parameters))
 this.options.parameters = this.options.parameters.toObject();
 }
});

Ajax.Request = Class.create(Ajax.Base, {
 _complete: false,

 initialize: function($super, url, options) {
 $super(options);
 this.transport = Ajax.getTransport();
 this.request(url);
 },

 request: function(url) {
 this.url = url;
 this.method = this.options.method;
 var params = Object.clone(this.options.parameters);

 if (!['get', 'post'].include(this.method)) {
 // simulate other verbs over post
 params['_method'] = this.method;
 this.method = 'post';
 }

 this.parameters = params;

 if (params = Object.toQueryString(params)) {
 // when GET, append parameters to URL
 if (this.method == 'get')
 this.url += (this.url.include('?') ? '&' : '?') + params;
 else if (/Konqueror|Safari|KHTML/.test(navigator.userAgent))
 params += '&_=';
 }

 try {
 var response = new Ajax.Response(this);
 if (this.options.onCreate) this.options.onCreate(response);
 Ajax.Responders.dispatch('onCreate', this, response);

 this.transport.open(this.method.toUpperCase(), this.url,
 this.options.asynchronous);

 if (this.options.asynchronous) this.respondToReadyState.bind(this).defer(1);

 this.transport.onreadystatechange = this.onStateChange.bind(this);
 this.setRequestHeaders();

 this.body = this.method == 'post' ? (this.options.postBody || params) : null;
 this.transport.send(this.body);

 /* Force Firefox to handle ready state 4 for synchronous requests */
 if (!this.options.asynchronous && this.transport.overrideMimeType)
 this.onStateChange();

 }
 catch (e) {
 this.dispatchException(e);
 }
 },

 onStateChange: function() {
 var readyState = this.transport.readyState;
 if (readyState > 1 && !((readyState == 4) && this._complete))
 this.respondToReadyState(this.transport.readyState);
 },

 setRequestHeaders: function() {
 var headers = {
 'X-Requested-With': 'XMLHttpRequest',
 'X-Prototype-Version': Prototype.Version,
 'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
 };

 if (this.method == 'post') {
 headers['Content-type'] = this.options.contentType +
 (this.options.encoding ? '; charset=' + this.options.encoding : '');

 /* Force "Connection: close" for older Mozilla browsers to work
 * around a bug where XMLHttpRequest sends an incorrect
 * Content-length header. See Mozilla Bugzilla #246651.
 */
 if (this.transport.overrideMimeType &&
 (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005)
 headers['Connection'] = 'close';
 }

 // user-defined headers
 if (typeof this.options.requestHeaders == 'object') {
 var extras = this.options.requestHeaders;

 if (Object.isFunction(extras.push))
 for (var i = 0, length = extras.length; i < length; i += 2)
 headers[extras[i]] = extras[i+1];
 else
 $H(extras).each(function(pair) { headers[pair.key] = pair.value });
 }

 for (var name in headers)
 this.transport.setRequestHeader(name, headers[name]);
 },

 success: function() {
 var status = this.getStatus();
 return !status || (status >= 200 && status < 300);
 },

 getStatus: function() {
 try {
 return this.transport.status || 0;
 } catch (e) { return 0 }
 },

 respondToReadyState: function(readyState) {
 var state = Ajax.Request.Events[readyState], response = new Ajax.Response(this);

 if (state == 'Complete') {
 try {
 this._complete = true;
 (this.options['on' + response.status]
 || this.options['on' + (this.success() ? 'Success' : 'Failure')]
 || Prototype.emptyFunction)(response, response.headerJSON);
 } catch (e) {
 this.dispatchException(e);
 }

 var contentType = response.getHeader('Content-type');
 if (this.options.evalJS == 'force'
 || (this.options.evalJS && this.isSameOrigin() && contentType
 && contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i)))
 this.evalResponse();
 }

 try {
 (this.options['on' + state] || Prototype.emptyFunction)(response, response.headerJSON);
 Ajax.Responders.dispatch('on' + state, this, response, response.headerJSON);
 } catch (e) {
 this.dispatchException(e);
 }

 if (state == 'Complete') {
 // avoid memory leak in MSIE: clean up
 this.transport.onreadystatechange = Prototype.emptyFunction;
 }
 },

 isSameOrigin: function() {
 var m = this.url.match(/^\s*https?:\/\/[^\/]*/);
 return !m || (m[0] == '#{protocol}//#{domain}#{port}'.interpolate({
 protocol: location.protocol,
 domain: document.domain,
 port: location.port ? ':' + location.port : ''
 }));
 },

 getHeader: function(name) {
 try {
 return this.transport.getResponseHeader(name) || null;
 } catch (e) { return null }
 },

 evalResponse: function() {
 try {
 return eval((this.transport.responseText || '').unfilterJSON());
 } catch (e) {
 this.dispatchException(e);
 }
 },

 dispatchException: function(exception) {
 (this.options.onException || Prototype.emptyFunction)(this, exception);
 Ajax.Responders.dispatch('onException', this, exception);
 }
});

Ajax.Request.Events =
 ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];

Ajax.Response = Class.create({
 initialize: function(request){
 this.request = request;
 var transport = this.transport = request.transport,
 readyState = this.readyState = transport.readyState;

 if((readyState > 2 && !Prototype.Browser.IE) || readyState == 4) {
 this.status = this.getStatus();
 this.statusText = this.getStatusText();
 this.responseText = String.interpret(transport.responseText);
 this.headerJSON = this._getHeaderJSON();
 }

 if(readyState == 4) {
 var xml = transport.responseXML;
 this.responseXML = Object.isUndefined(xml) ? null : xml;
 this.responseJSON = this._getResponseJSON();
 }
 },

 status: 0,
 statusText: '',

 getStatus: Ajax.Request.prototype.getStatus,

 getStatusText: function() {
 try {
 return this.transport.statusText || '';
 } catch (e) { return '' }
 },

 getHeader: Ajax.Request.prototype.getHeader,

 getAllHeaders: function() {
 try {
 return this.getAllResponseHeaders();
 } catch (e) { return null }
 },

 getResponseHeader: function(name) {
 return this.transport.getResponseHeader(name);
 },

 getAllResponseHeaders: function() {
 return this.transport.getAllResponseHeaders();
 },

 _getHeaderJSON: function() {
 var json = this.getHeader('X-JSON');
 if (!json) return null;
 json = decodeURIComponent(escape(json));
 try {
 return json.evalJSON(this.request.options.sanitizeJSON ||
 !this.request.isSameOrigin());
 } catch (e) {
 this.request.dispatchException(e);
 }
 },

 _getResponseJSON: function() {
 var options = this.request.options;
 if (!options.evalJSON || (options.evalJSON != 'force' &&
 !(this.getHeader('Content-type') || '').include('application/json')) ||
 this.responseText.blank())
 return null;
 try {
 return this.responseText.evalJSON(options.sanitizeJSON ||
 !this.request.isSameOrigin());
 } catch (e) {
 this.request.dispatchException(e);
 }
 }
});

Ajax.Updater = Class.create(Ajax.Request, {
 initialize: function($super, container, url, options) {
 this.container = {
 success: (container.success || container),
 failure: (container.failure || (container.success ? null : container))
 };

 options = Object.clone(options);
 var onComplete = options.onComplete;
 options.onComplete = (function(response, json) {
 this.updateContent(response.responseText);
 if (Object.isFunction(onComplete)) onComplete(response, json);
 }).bind(this);

 $super(url, options);
 },

 updateContent: function(responseText) {
 var receiver = this.container[this.success() ? 'success' : 'failure'],
 options = this.options;

 if (!options.evalScripts) responseText = responseText.stripScripts();

 if (receiver = $(receiver)) {
 if (options.insertion) {
 if (Object.isString(options.insertion)) {
 var insertion = { }; insertion[options.insertion] = responseText;
 receiver.insert(insertion);
 }
 else options.insertion(receiver, responseText);
 }
 else receiver.update(responseText);
 }
 }
});

Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
 initialize: function($super, container, url, options) {
 $super(options);
 this.onComplete = this.options.onComplete;

 this.frequency = (this.options.frequency || 2);
 this.decay = (this.options.decay || 1);

 this.updater = { };
 this.container = container;
 this.url = url;

 this.start();
 },

 start: function() {
 this.options.onComplete = this.updateComplete.bind(this);
 this.onTimerEvent();
 },

 stop: function() {
 this.updater.options.onComplete = undefined;
 clearTimeout(this.timer);
 (this.onComplete || Prototype.emptyFunction).apply(this, arguments);
 },

 updateComplete: function(response) {
 if (this.options.decay) {
 this.decay = (response.responseText == this.lastText ?
 this.decay * this.options.decay : 1);

 this.lastText = response.responseText;
 }
 this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency);
 },

 onTimerEvent: function() {
 this.updater = new Ajax.Updater(this.container, this.url, this.options);
 }
});
function $(element) {
 if (arguments.length > 1) {
 for (var i = 0, elements = [], length = arguments.length; i < length; i++)
 elements.push($(arguments[i]));
 return elements;
 }
 if (Object.isString(element))
 element = document.getElementById(element);
 return Element.extend(element);
}

if (Prototype.BrowserFeatures.XPath) {
 document._getElementsByXPath = function(expression, parentElement) {
 var results = [];
 var query = document.evaluate(expression, $(parentElement) || document,
 null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
 for (var i = 0, length = query.snapshotLength; i < length; i++)
 results.push(Element.extend(query.snapshotItem(i)));
 return results;
 };
}

/*--------------------------------------------------------------------------*/

if (!window.Node) var Node = { };

if (!Node.ELEMENT_NODE) {
 // DOM level 2 ECMAScript Language Binding
 Object.extend(Node, {
 ELEMENT_NODE: 1,
 ATTRIBUTE_NODE: 2,
 TEXT_NODE: 3,
 CDATA_SECTION_NODE: 4,
 ENTITY_REFERENCE_NODE: 5,
 ENTITY_NODE: 6,
 PROCESSING_INSTRUCTION_NODE: 7,
 COMMENT_NODE: 8,
 DOCUMENT_NODE: 9,
 DOCUMENT_TYPE_NODE: 10,
 DOCUMENT_FRAGMENT_NODE: 11,
 NOTATION_NODE: 12
 });
}

(function() {
 var element = this.Element;
 this.Element = function(tagName, attributes) {
 attributes = attributes || { };
 tagName = tagName.toLowerCase();
 var cache = Element.cache;
 if (Prototype.Browser.IE && attributes.name) {
 tagName = '<' + tagName + ' name="' + attributes.name + '">';
 delete attributes.name;
 return Element.writeAttribute(document.createElement(tagName), attributes);
 }
 if (!cache[tagName]) cache[tagName] = Element.extend(document.createElement(tagName));
 return Element.writeAttribute(cache[tagName].cloneNode(false), attributes);
 };
 Object.extend(this.Element, element || { });
 if (element) this.Element.prototype = element.prototype;
}).call(window);

Element.cache = { };

Element.Methods = {
 visible: function(element) {
 return $(element).style.display != 'none';
 },

 toggle: function(element) {
 element = $(element);
 Element[Element.visible(element) ? 'hide' : 'show'](element);
 return element;
 },

 hide: function(element) {
 element = $(element);
 element.style.display = 'none';
 return element;
 },

 show: function(element) {
 element = $(element);
 element.style.display = '';
 return element;
 },

 remove: function(element) {
 element = $(element);
 element.parentNode.removeChild(element);
 return element;
 },

 update: function(element, content) {
 element = $(element);
 if (content && content.toElement) content = content.toElement();
 if (Object.isElement(content)) return element.update().insert(content);
 content = Object.toHTML(content);
 element.innerHTML = content.stripScripts();
 content.evalScripts.bind(content).defer();
 return element;
 },

 replace: function(element, content) {
 element = $(element);
 if (content && content.toElement) content = content.toElement();
 else if (!Object.isElement(content)) {
 content = Object.toHTML(content);
 var range = element.ownerDocument.createRange();
 range.selectNode(element);
 content.evalScripts.bind(content).defer();
 content = range.createContextualFragment(content.stripScripts());
 }
 element.parentNode.replaceChild(content, element);
 return element;
 },

 insert: function(element, insertions) {
 element = $(element);

 if (Object.isString(insertions) || Object.isNumber(insertions) ||
 Object.isElement(insertions) || (insertions && (insertions.toElement || insertions.toHTML)))
 insertions = {bottom:insertions};

 var content, insert, tagName, childNodes;

 for (var position in insertions) {
 content = insertions[position];
 position = position.toLowerCase();
 insert = Element._insertionTranslations[position];

 if (content && content.toElement) content = content.toElement();
 if (Object.isElement(content)) {
 insert(element, content);
 continue;
 }

 content = Object.toHTML(content);

 tagName = ((position == 'before' || position == 'after')
 ? element.parentNode : element).tagName.toUpperCase();

 childNodes = Element._getContentFromAnonymousElement(tagName, content.stripScripts());

 if (position == 'top' || position == 'after') childNodes.reverse();
 childNodes.each(insert.curry(element));

 content.evalScripts.bind(content).defer();
 }

 return element;
 },

 wrap: function(element, wrapper, attributes) {
 element = $(element);
 if (Object.isElement(wrapper))
 $(wrapper).writeAttribute(attributes || { });
 else if (Object.isString(wrapper)) wrapper = new Element(wrapper, attributes);
 else wrapper = new Element('div', wrapper);
 if (element.parentNode)
 element.parentNode.replaceChild(wrapper, element);
 wrapper.appendChild(element);
 return wrapper;
 },

 inspect: function(element) {
 element = $(element);
 var result = '<' + element.tagName.toLowerCase();
 $H({'id': 'id', 'className': 'class'}).each(function(pair) {
 var property = pair.first(), attribute = pair.last();
 var value = (element[property] || '').toString();
 if (value) result += ' ' + attribute + '=' + value.inspect(true);
 });
 return result + '>';
 },

 recursivelyCollect: function(element, property) {
 element = $(element);
 var elements = [];
 while (element = element[property])
 if (element.nodeType == 1)
 elements.push(Element.extend(element));
 return elements;
 },

 ancestors: function(element) {
 return $(element).recursivelyCollect('parentNode');
 },

 descendants: function(element) {
 return $(element).select("*");
 },

 firstDescendant: function(element) {
 element = $(element).firstChild;
 while (element && element.nodeType != 1) element = element.nextSibling;
 return $(element);
 },

 immediateDescendants: function(element) {
 if (!(element = $(element).firstChild)) return [];
 while (element && element.nodeType != 1) element = element.nextSibling;
 if (element) return [element].concat($(element).nextSiblings());
 return [];
 },

 previousSiblings: function(element) {
 return $(element).recursivelyCollect('previousSibling');
 },

 nextSiblings: function(element) {
 return $(element).recursivelyCollect('nextSibling');
 },

 siblings: function(element) {
 element = $(element);
 return element.previousSiblings().reverse().concat(element.nextSiblings());
 },

 match: function(element, selector) {
 if (Object.isString(selector))
 selector = new Selector(selector);
 return selector.match($(element));
 },

 up: function(element, expression, index) {
 element = $(element);
 if (arguments.length == 1) return $(element.parentNode);
 var ancestors = element.ancestors();
 return Object.isNumber(expression) ? ancestors[expression] :
 Selector.findElement(ancestors, expression, index);
 },

 down: function(element, expression, index) {
 element = $(element);
 if (arguments.length == 1) return element.firstDescendant();
 return Object.isNumber(expression) ? element.descendants()[expression] :
 Element.select(element, expression)[index || 0];
 },

 previous: function(element, expression, index) {
 element = $(element);
 if (arguments.length == 1) return $(Selector.handlers.previousElementSibling(element));
 var previousSiblings = element.previousSiblings();
 return Object.isNumber(expression) ? previousSiblings[expression] :
 Selector.findElement(previousSiblings, expression, index);
 },

 next: function(element, expression, index) {
 element = $(element);
 if (arguments.length == 1) return $(Selector.handlers.nextElementSibling(element));
 var nextSiblings = element.nextSiblings();
 return Object.isNumber(expression) ? nextSiblings[expression] :
 Selector.findElement(nextSiblings, expression, index);
 },

 select: function() {
 var args = $A(arguments), element = $(args.shift());
 return Selector.findChildElements(element, args);
 },

 adjacent: function() {
 var args = $A(arguments), element = $(args.shift());
 return Selector.findChildElements(element.parentNode, args).without(element);
 },

 identify: function(element) {
 element = $(element);
 var id = element.readAttribute('id'), self = arguments.callee;
 if (id) return id;
 do { id = 'anonymous_element_' + self.counter++ } while ($(id));
 element.writeAttribute('id', id);
 return id;
 },

 readAttribute: function(element, name) {
 element = $(element);
 if (Prototype.Browser.IE) {
 var t = Element._attributeTranslations.read;
 if (t.values[name]) return t.values[name](element, name);
 if (t.names[name]) name = t.names[name];
 if (name.include(':')) {
 return (!element.attributes || !element.attributes[name]) ? null :
 element.attributes[name].value;
 }
 }
 return element.getAttribute(name);
 },

 writeAttribute: function(element, name, value) {
 element = $(element);
 var attributes = { }, t = Element._attributeTranslations.write;

 if (typeof name == 'object') attributes = name;
 else attributes[name] = Object.isUndefined(value) ? true : value;

 for (var attr in attributes) {
 name = t.names[attr] || attr;
 value = attributes[attr];
 if (t.values[attr]) name = t.values[attr](element, value);
 if (value === false || value === null)
 element.removeAttribute(name);
 else if (value === true)
 element.setAttribute(name, name);
 else element.setAttribute(name, value);
 }
 return element;
 },

 getHeight: function(element) {
 return $(element).getDimensions().height;
 },

 getWidth: function(element) {
 return $(element).getDimensions().width;
 },

 classNames: function(element) {
 return new Element.ClassNames(element);
 },

 hasClassName: function(element, className) {
 if (!(element = $(element))) return;
 var elementClassName = element.className;
 return (elementClassName.length > 0 && (elementClassName == className ||
 new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName)));
 },

 addClassName: function(element, className) {
 if (!(element = $(element))) return;
 if (!element.hasClassName(className))
 element.className += (element.className ? ' ' : '') + className;
 return element;
 },

 removeClassName: function(element, className) {
 if (!(element = $(element))) return;
 element.className = element.className.replace(
 new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' ').strip();
 return element;
 },

 toggleClassName: function(element, className) {
 if (!(element = $(element))) return;
 return element[element.hasClassName(className) ?
 'removeClassName' : 'addClassName'](className);
 },

 // removes whitespace-only text node children
 cleanWhitespace: function(element) {
 element = $(element);
 var node = element.firstChild;
 while (node) {
 var nextNode = node.nextSibling;
 if (node.nodeType == 3 && !/\S/.test(node.nodeValue))
 element.removeChild(node);
 node = nextNode;
 }
 return element;
 },

 empty: function(element) {
 return $(element).innerHTML.blank();
 },

 descendantOf: function(element, ancestor) {
 element = $(element), ancestor = $(ancestor);

 if (element.compareDocumentPosition)
 return (element.compareDocumentPosition(ancestor) & 8) === 8;

 if (ancestor.contains)
 return ancestor.contains(element) && ancestor !== element;

 while (element = element.parentNode)
 if (element == ancestor) return true;

 return false;
 },

 scrollTo: function(element) {
 element = $(element);
 var pos = element.cumulativeOffset();
 window.scrollTo(pos[0], pos[1]);
 return element;
 },

 getStyle: function(element, style) {
 element = $(element);
 style = style == 'float' ? 'cssFloat' : style.camelize();
 var value = element.style[style];
 if (!value || value == 'auto') {
 var css = document.defaultView.getComputedStyle(element, null);
 value = css ? css[style] : null;
 }
 if (style == 'opacity') return value ? parseFloat(value) : 1.0;
 return value == 'auto' ? null : value;
 },

 getOpacity: function(element) {
 return $(element).getStyle('opacity');
 },

 setStyle: function(element, styles) {
 element = $(element);
 var elementStyle = element.style, match;
 if (Object.isString(styles)) {
 element.style.cssText += ';' + styles;
 return styles.include('opacity') ?
 element.setOpacity(styles.match(/opacity:\s*(\d?\.?\d*)/)[1]) : element;
 }
 for (var property in styles)
 if (property == 'opacity') element.setOpacity(styles[property]);
 else
 elementStyle[(property == 'float' || property == 'cssFloat') ?
 (Object.isUndefined(elementStyle.styleFloat) ? 'cssFloat' : 'styleFloat') :
 property] = styles[property];

 return element;
 },

 setOpacity: function(element, value) {
 element = $(element);
 element.style.opacity = (value == 1 || value === '') ? '' :
 (value < 0.00001) ? 0 : value;
 return element;
 },

 getDimensions: function(element) {
 element = $(element);
 var display = element.getStyle('display');
 if (display != 'none' && display != null) // Safari bug
 return {width: element.offsetWidth, height: element.offsetHeight};

 // All *Width and *Height properties give 0 on elements with display none,
 // so enable the element temporarily
 var els = element.style;
 var originalVisibility = els.visibility;
 var originalPosition = els.position;
 var originalDisplay = els.display;
 els.visibility = 'hidden';
 els.position = 'absolute';
 els.display = 'block';
 var originalWidth = element.clientWidth;
 var originalHeight = element.clientHeight;
 els.display = originalDisplay;
 els.position = originalPosition;
 els.visibility = originalVisibility;
 return {width: originalWidth, height: originalHeight};
 },

 makePositioned: function(element) {
 element = $(element);
 var pos = Element.getStyle(element, 'position');
 if (pos == 'static' || !pos) {
 element._madePositioned = true;
 element.style.position = 'relative';
 // Opera returns the offset relative to the positioning context, when an
 // element is position relative but top and left have not been defined
 if (Prototype.Browser.Opera) {
 element.style.top = 0;
 element.style.left = 0;
 }
 }
 return element;
 },

 undoPositioned: function(element) {
 element = $(element);
 if (element._madePositioned) {
 element._madePositioned = undefined;
 element.style.position =
 element.style.top =
 element.style.left =
 element.style.bottom =
 element.style.right = '';
 }
 return element;
 },

 makeClipping: function(element) {
 element = $(element);
 if (element._overflow) return element;
 element._overflow = Element.getStyle(element, 'overflow') || 'auto';
 if (element._overflow !== 'hidden')
 element.style.overflow = 'hidden';
 return element;
 },

 undoClipping: function(element) {
 element = $(element);
 if (!element._overflow) return element;
 element.style.overflow = element._overflow == 'auto' ? '' : element._overflow;
 element._overflow = null;
 return element;
 },

 cumulativeOffset: function(element) {
 var valueT = 0, valueL = 0;
 do {
 valueT += element.offsetTop || 0;
 valueL += element.offsetLeft || 0;
 element = element.offsetParent;
 } while (element);
 return Element._returnOffset(valueL, valueT);
 },

 positionedOffset: function(element) {
 var valueT = 0, valueL = 0;
 do {
 valueT += element.offsetTop || 0;
 valueL += element.offsetLeft || 0;
 element = element.offsetParent;
 if (element) {
 if (element.tagName.toUpperCase() == 'BODY') break;
 var p = Element.getStyle(element, 'position');
 if (p !== 'static') break;
 }
 } while (element);
 return Element._returnOffset(valueL, valueT);
 },

 absolutize: function(element) {
 element = $(element);
 if (element.getStyle('position') == 'absolute') return element;
 // Position.prepare(); // To be done manually by Scripty when it needs it.

 var offsets = element.positionedOffset();
 var top = offsets[1];
 var left = offsets[0];
 var width = element.clientWidth;
 var height = element.clientHeight;

 element._originalLeft = left - parseFloat(element.style.left || 0);
 element._originalTop = top - parseFloat(element.style.top || 0);
 element._originalWidth = element.style.width;
 element._originalHeight = element.style.height;

 element.style.position = 'absolute';
 element.style.top = top + 'px';
 element.style.left = left + 'px';
 element.style.width = width + 'px';
 element.style.height = height + 'px';
 return element;
 },

 relativize: function(element) {
 element = $(element);
 if (element.getStyle('position') == 'relative') return element;
 // Position.prepare(); // To be done manually by Scripty when it needs it.

 element.style.position = 'relative';
 var top = parseFloat(element.style.top || 0) - (element._originalTop || 0);
 var left = parseFloat(element.style.left || 0) - (element._originalLeft || 0);

 element.style.top = top + 'px';
 element.style.left = left + 'px';
 element.style.height = element._originalHeight;
 element.style.width = element._originalWidth;
 return element;
 },

 cumulativeScrollOffset: function(element) {
 var valueT = 0, valueL = 0;
 do {
 valueT += element.scrollTop || 0;
 valueL += element.scrollLeft || 0;
 element = element.parentNode;
 } while (element);
 return Element._returnOffset(valueL, valueT);
 },

 getOffsetParent: function(element) {
 if (element.offsetParent) return $(element.offsetParent);
 if (element == document.body) return $(element);

 while ((element = element.parentNode) && element != document.body)
 if (Element.getStyle(element, 'position') != 'static')
 return $(element);

 return $(document.body);
 },

 viewportOffset: function(forElement) {
 var valueT = 0, valueL = 0;

 var element = forElement;
 do {
 valueT += element.offsetTop || 0;
 valueL += element.offsetLeft || 0;

 // Safari fix
 if (element.offsetParent == document.body &&
 Element.getStyle(element, 'position') == 'absolute') break;

 } while (element = element.offsetParent);

 element = forElement;
 do {
 if (!Prototype.Browser.Opera || (element.tagName && (element.tagName.toUpperCase() == 'BODY'))) {
 valueT -= element.scrollTop || 0;
 valueL -= element.scrollLeft || 0;
 }
 } while (element = element.parentNode);

 return Element._returnOffset(valueL, valueT);
 },

 clonePosition: function(element, source) {
 var options = Object.extend({
 setLeft: true,
 setTop: true,
 setWidth: true,
 setHeight: true,
 offsetTop: 0,
 offsetLeft: 0
 }, arguments[2] || { });

 // find page position of source
 source = $(source);
 var p = source.viewportOffset();

 // find coordinate system to use
 element = $(element);
 var delta = [0, 0];
 var parent = null;
 // delta [0,0] will do fine with position: fixed elements,
 // position:absolute needs offsetParent deltas
 if (Element.getStyle(element, 'position') == 'absolute') {
 parent = element.getOffsetParent();
 delta = parent.viewportOffset();
 }

 // correct by body offsets (fixes Safari)
 if (parent == document.body) {
 delta[0] -= document.body.offsetLeft;
 delta[1] -= document.body.offsetTop;
 }

 // set position
 if (options.setLeft) element.style.left = (p[0] - delta[0] + options.offsetLeft) + 'px';
 if (options.setTop) element.style.top = (p[1] - delta[1] + options.offsetTop) + 'px';
 if (options.setWidth) element.style.width = source.offsetWidth + 'px';
 if (options.setHeight) element.style.height = source.offsetHeight + 'px';
 return element;
 }
};

Element.Methods.identify.counter = 1;

Object.extend(Element.Methods, {
 getElementsBySelector: Element.Methods.select,
 childElements: Element.Methods.immediateDescendants
});

Element._attributeTranslations = {
 write: {
 names: {
 className: 'class',
 htmlFor: 'for'
 },
 values: { }
 }
};

if (Prototype.Browser.Opera) {
 Element.Methods.getStyle = Element.Methods.getStyle.wrap(
 function(proceed, element, style) {
 switch (style) {
 case 'left': case 'top': case 'right': case 'bottom':
 if (proceed(element, 'position') === 'static') return null;
 case 'height': case 'width':
 // returns '0px' for hidden elements; we want it to return null
 if (!Element.visible(element)) return null;

 // returns the border-box dimensions rather than the content-box
 // dimensions, so we subtract padding and borders from the value
 var dim = parseInt(proceed(element, style), 10);

 if (dim !== element['offset' + style.capitalize()])
 return dim + 'px';

 var properties;
 if (style === 'height') {
 properties = ['border-top-width', 'padding-top',
 'padding-bottom', 'border-bottom-width'];
 }
 else {
 properties = ['border-left-width', 'padding-left',
 'padding-right', 'border-right-width'];
 }
 return properties.inject(dim, function(memo, property) {
 var val = proceed(element, property);
 return val === null ? memo : memo - parseInt(val, 10);
 }) + 'px';
 default: return proceed(element, style);
 }
 }
 );

 Element.Methods.readAttribute = Element.Methods.readAttribute.wrap(
 function(proceed, element, attribute) {
 if (attribute === 'title') return element.title;
 return proceed(element, attribute);
 }
 );
}

else if (Prototype.Browser.IE) {
 // IE doesn't report offsets correctly for static elements, so we change them
 // to "relative" to get the values, then change them back.
 Element.Methods.getOffsetParent = Element.Methods.getOffsetParent.wrap(
 function(proceed, element) {
 element = $(element);
 // IE throws an error if element is not in document
 try { element.offsetParent }
 catch(e) { return $(document.body) }
 var position = element.getStyle('position');
 if (position !== 'static') return proceed(element);
 element.setStyle({ position: 'relative' });
 var value = proceed(element);
 element.setStyle({ position: position });
 return value;
 }
 );

 $w('positionedOffset viewportOffset').each(function(method) {
 Element.Methods[method] = Element.Methods[method].wrap(
 function(proceed, element) {
 element = $(element);
 try { element.offsetParent }
 catch(e) { return Element._returnOffset(0,0) }
 var position = element.getStyle('position');
 if (position !== 'static') return proceed(element);
 // Trigger hasLayout on the offset parent so that IE6 reports
 // accurate offsetTop and offsetLeft values for position: fixed.
 var offsetParent = element.getOffsetParent();
 if (offsetParent && offsetParent.getStyle('position') === 'fixed')
 offsetParent.setStyle({ zoom: 1 });
 element.setStyle({ position: 'relative' });
 var value = proceed(element);
 element.setStyle({ position: position });
 return value;
 }
 );
 });

 Element.Methods.cumulativeOffset = Element.Methods.cumulativeOffset.wrap(
 function(proceed, element) {
 try { element.offsetParent }
 catch(e) { return Element._returnOffset(0,0) }
 return proceed(element);
 }
 );

 Element.Methods.getStyle = function(element, style) {
 element = $(element);
 style = (style == 'float' || style == 'cssFloat') ? 'styleFloat' : style.camelize();
 var value = element.style[style];
 if (!value && element.currentStyle) value = element.currentStyle[style];

 if (style == 'opacity') {
 if (value = (element.getStyle('filter') || '').match(/alpha\(opacity=(.*)\)/))
 if (value[1]) return parseFloat(value[1]) / 100;
 return 1.0;
 }

 if (value == 'auto') {
 if ((style == 'width' || style == 'height') && (element.getStyle('display') != 'none'))
 return element['offset' + style.capitalize()] + 'px';
 return null;
 }
 return value;
 };

 Element.Methods.setOpacity = function(element, value) {
 function stripAlpha(filter){
 return filter.replace(/alpha\([^\)]*\)/gi,'');
 }
 element = $(element);
 var currentStyle = element.currentStyle;
 if ((currentStyle && !currentStyle.hasLayout) ||
 (!currentStyle && element.style.zoom == 'normal'))
 element.style.zoom = 1;

 var filter = element.getStyle('filter'), style = element.style;
 if (value == 1 || value === '') {
 (filter = stripAlpha(filter)) ?
 style.filter = filter : style.removeAttribute('filter');
 return element;
 } else if (value < 0.00001) value = 0;
 style.filter = stripAlpha(filter) +
 'alpha(opacity=' + (value * 100) + ')';
 return element;
 };

 Element._attributeTranslations = {
 read: {
 names: {
 'class': 'className',
 'for': 'htmlFor'
 },
 values: {
 _getAttr: function(element, attribute) {
 return element.getAttribute(attribute, 2);
 },
 _getAttrNode: function(element, attribute) {
 var node = element.getAttributeNode(attribute);
 return node ? node.value : "";
 },
 _getEv: function(element, attribute) {
 attribute = element.getAttribute(attribute);
 return attribute ? attribute.toString().slice(23, -2) : null;
 },
 _flag: function(element, attribute) {
 return $(element).hasAttribute(attribute) ? attribute : null;
 },
 style: function(element) {
 return element.style.cssText.toLowerCase();
 },
 title: function(element) {
 return element.title;
 }
 }
 }
 };

 Element._attributeTranslations.write = {
 names: Object.extend({
 cellpadding: 'cellPadding',
 cellspacing: 'cellSpacing'
 }, Element._attributeTranslations.read.names),
 values: {
 checked: function(element, value) {
 element.checked = !!value;
 },

 style: function(element, value) {
 element.style.cssText = value ? value : '';
 }
 }
 };

 Element._attributeTranslations.has = {};

 $w('colSpan rowSpan vAlign dateTime accessKey tabIndex ' +
 'encType maxLength readOnly longDesc frameBorder').each(function(attr) {
 Element._attributeTranslations.write.names[attr.toLowerCase()] = attr;
 Element._attributeTranslations.has[attr.toLowerCase()] = attr;
 });

 (function(v) {
 Object.extend(v, {
 href: v._getAttr,
 src: v._getAttr,
 type: v._getAttr,
 action: v._getAttrNode,
 disabled: v._flag,
 checked: v._flag,
 readonly: v._flag,
 multiple: v._flag,
 onload: v._getEv,
 onunload: v._getEv,
 onclick: v._getEv,
 ondblclick: v._getEv,
 onmousedown: v._getEv,
 onmouseup: v._getEv,
 onmouseover: v._getEv,
 onmousemove: v._getEv,
 onmouseout: v._getEv,
 onfocus: v._getEv,
 onblur: v._getEv,
 onkeypress: v._getEv,
 onkeydown: v._getEv,
 onkeyup: v._getEv,
 onsubmit: v._getEv,
 onreset: v._getEv,
 onselect: v._getEv,
 onchange: v._getEv
 });
 })(Element._attributeTranslations.read.values);
}

else if (Prototype.Browser.Gecko && /rv:1\.8\.0/.test(navigator.userAgent)) {
 Element.Methods.setOpacity = function(element, value) {
 element = $(element);
 element.style.opacity = (value == 1) ? 0.999999 :
 (value === '') ? '' : (value < 0.00001) ? 0 : value;
 return element;
 };
}

else if (Prototype.Browser.WebKit) {
 Element.Methods.setOpacity = function(element, value) {
 element = $(element);
 element.style.opacity = (value == 1 || value === '') ? '' :
 (value < 0.00001) ? 0 : value;

 if (value == 1)
 if(element.tagName.toUpperCase() == 'IMG' && element.width) {
 element.width++; element.width--;
 } else try {
 var n = document.createTextNode(' ');
 element.appendChild(n);
 element.removeChild(n);
 } catch (e) { }

 return element;
 };

 // Safari returns margins on body which is incorrect if the child is absolutely
 // positioned. For performance reasons, redefine Element#cumulativeOffset for
 // KHTML/WebKit only.
 Element.Methods.cumulativeOffset = function(element) {
 var valueT = 0, valueL = 0;
 do {
 valueT += element.offsetTop || 0;
 valueL += element.offsetLeft || 0;
 if (element.offsetParent == document.body)
 if (Element.getStyle(element, 'position') == 'absolute') break;

 element = element.offsetParent;
 } while (element);

 return Element._returnOffset(valueL, valueT);
 };
}

if (Prototype.Browser.IE || Prototype.Browser.Opera) {
 // IE and Opera are missing .innerHTML support for TABLE-related and SELECT elements
 Element.Methods.update = function(element, content) {
 element = $(element);

 if (content && content.toElement) content = content.toElement();
 if (Object.isElement(content)) return element.update().insert(content);

 content = Object.toHTML(content);
 var tagName = element.tagName.toUpperCase();

 if (tagName in Element._insertionTranslations.tags) {
 $A(element.childNodes).each(function(node) { element.removeChild(node) });
 Element._getContentFromAnonymousElement(tagName, content.stripScripts())
 .each(function(node) { element.appendChild(node) });
 }
 else element.innerHTML = content.stripScripts();

 content.evalScripts.bind(content).defer();
 return element;
 };
}

if ('outerHTML' in document.createElement('div')) {
 Element.Methods.replace = function(element, content) {
 element = $(element);

 if (content && content.toElement) content = content.toElement();
 if (Object.isElement(content)) {
 element.parentNode.replaceChild(content, element);
 return element;
 }

 content = Object.toHTML(content);
 var parent = element.parentNode, tagName = parent.tagName.toUpperCase();

 if (Element._insertionTranslations.tags[tagName]) {
 var nextSibling = element.next();
 var fragments = Element._getContentFromAnonymousElement(tagName, content.stripScripts());
 parent.removeChild(element);
 if (nextSibling)
 fragments.each(function(node) { parent.insertBefore(node, nextSibling) });
 else
 fragments.each(function(node) { parent.appendChild(node) });
 }
 else element.outerHTML = content.stripScripts();

 content.evalScripts.bind(content).defer();
 return element;
 };
}

Element._returnOffset = function(l, t) {
 var result = [l, t];
 result.left = l;
 result.top = t;
 return result;
};

Element._getContentFromAnonymousElement = function(tagName, html) {
 var div = new Element('div'), t = Element._insertionTranslations.tags[tagName];
 if (t) {
 div.innerHTML = t[0] + html + t[1];
 t[2].times(function() { div = div.firstChild });
 } else div.innerHTML = html;
 return $A(div.childNodes);
};

Element._insertionTranslations = {
 before: function(element, node) {
 element.parentNode.insertBefore(node, element);
 },
 top: function(element, node) {
 element.insertBefore(node, element.firstChild);
 },
 bottom: function(element, node) {
 element.appendChild(node);
 },
 after: function(element, node) {
 element.parentNode.insertBefore(node, element.nextSibling);
 },
 tags: {
 TABLE: ['<table>', '</table>', 1],
 TBODY: ['<table><tbody>', '</tbody></table>', 2],
 TR: ['<table><tbody><tr>', '</tr></tbody></table>', 3],
 TD: ['<table><tbody><tr><td>', '</td></tr></tbody></table>', 4],
 SELECT: ['<select>', '</select>', 1]
 }
};

(function() {
 Object.extend(this.tags, {
 THEAD: this.tags.TBODY,
 TFOOT: this.tags.TBODY,
 TH: this.tags.TD
 });
}).call(Element._insertionTranslations);

Element.Methods.Simulated = {
 hasAttribute: function(element, attribute) {
 attribute = Element._attributeTranslations.has[attribute] || attribute;
 var node = $(element).getAttributeNode(attribute);
 return !!(node && node.specified);
 }
};

Element.Methods.ByTag = { };

Object.extend(Element, Element.Methods);

if (!Prototype.BrowserFeatures.ElementExtensions &&
 document.createElement('div')['__proto__']) {
 window.HTMLElement = { };
 window.HTMLElement.prototype = document.createElement('div')['__proto__'];
 Prototype.BrowserFeatures.ElementExtensions = true;
}

Element.extend = (function() {
 if (Prototype.BrowserFeatures.SpecificElementExtensions)
 return Prototype.K;

 var Methods = { }, ByTag = Element.Methods.ByTag;

 var extend = Object.extend(function(element) {
 if (!element || element._extendedByPrototype ||
 element.nodeType != 1 || element == window) return element;

 var methods = Object.clone(Methods),
 tagName = element.tagName.toUpperCase(), property, value;

 // extend methods for specific tags
 if (ByTag[tagName]) Object.extend(methods, ByTag[tagName]);

 for (property in methods) {
 value = methods[property];
 if (Object.isFunction(value) && !(property in element))
 element[property] = value.methodize();
 }

 element._extendedByPrototype = Prototype.emptyFunction;
 return element;

 }, {
 refresh: function() {
 // extend methods for all tags (Safari doesn't need this)
 if (!Prototype.BrowserFeatures.ElementExtensions) {
 Object.extend(Methods, Element.Methods);
 Object.extend(Methods, Element.Methods.Simulated);
 }
 }
 });

 extend.refresh();
 return extend;
})();

Element.hasAttribute = function(element, attribute) {
 if (element.hasAttribute) return element.hasAttribute(attribute);
 return Element.Methods.Simulated.hasAttribute(element, attribute);
};

Element.addMethods = function(methods) {
 var F = Prototype.BrowserFeatures, T = Element.Methods.ByTag;

 if (!methods) {
 Object.extend(Form, Form.Methods);
 Object.extend(Form.Element, Form.Element.Methods);
 Object.extend(Element.Methods.ByTag, {
 "FORM": Object.clone(Form.Methods),
 "INPUT": Object.clone(Form.Element.Methods),
 "SELECT": Object.clone(Form.Element.Methods),
 "TEXTAREA": Object.clone(Form.Element.Methods)
 });
 }

 if (arguments.length == 2) {
 var tagName = methods;
 methods = arguments[1];
 }

 if (!tagName) Object.extend(Element.Methods, methods || { });
 else {
 if (Object.isArray(tagName)) tagName.each(extend);
 else extend(tagName);
 }

 function extend(tagName) {
 tagName = tagName.toUpperCase();
 if (!Element.Methods.ByTag[tagName])
 Element.Methods.ByTag[tagName] = { };
 Object.extend(Element.Methods.ByTag[tagName], methods);
 }

 function copy(methods, destination, onlyIfAbsent) {
 onlyIfAbsent = onlyIfAbsent || false;
 for (var property in methods) {
 var value = methods[property];
 if (!Object.isFunction(value)) continue;
 if (!onlyIfAbsent || !(property in destination))
 destination[property] = value.methodize();
 }
 }

 function findDOMClass(tagName) {
 var klass;
 var trans = {
 "OPTGROUP": "OptGroup", "TEXTAREA": "TextArea", "P": "Paragraph",
 "FIELDSET": "FieldSet", "UL": "UList", "OL": "OList", "DL": "DList",
 "DIR": "Directory", "H1": "Heading", "H2": "Heading", "H3": "Heading",
 "H4": "Heading", "H5": "Heading", "H6": "Heading", "Q": "Quote",
 "INS": "Mod", "DEL": "Mod", "A": "Anchor", "IMG": "Image", "CAPTION":
 "TableCaption", "COL": "TableCol", "COLGROUP": "TableCol", "THEAD":
 "TableSection", "TFOOT": "TableSection", "TBODY": "TableSection", "TR":
 "TableRow", "TH": "TableCell", "TD": "TableCell", "FRAMESET":
 "FrameSet", "IFRAME": "IFrame"
 };
 if (trans[tagName]) klass = 'HTML' + trans[tagName] + 'Element';
 if (window[klass]) return window[klass];
 klass = 'HTML' + tagName + 'Element';
 if (window[klass]) return window[klass];
 klass = 'HTML' + tagName.capitalize() + 'Element';
 if (window[klass]) return window[klass];

 window[klass] = { };
 window[klass].prototype = document.createElement(tagName)['__proto__'];
 return window[klass];
 }

 if (F.ElementExtensions) {
 copy(Element.Methods, HTMLElement.prototype);
 copy(Element.Methods.Simulated, HTMLElement.prototype, true);
 }

 if (F.SpecificElementExtensions) {
 for (var tag in Element.Methods.ByTag) {
 var klass = findDOMClass(tag);
 if (Object.isUndefined(klass)) continue;
 copy(T[tag], klass.prototype);
 }
 }

 Object.extend(Element, Element.Methods);
 delete Element.ByTag;

 if (Element.extend.refresh) Element.extend.refresh();
 Element.cache = { };
};

document.viewport = {
 getDimensions: function() {
 var dimensions = { }, B = Prototype.Browser;
 $w('width height').each(function(d) {
 var D = d.capitalize();
 if (B.WebKit && !document.evaluate) {
 // Safari <3.0 needs self.innerWidth/Height
 dimensions[d] = self['inner' + D];
 } else if (B.Opera && parseFloat(window.opera.version()) < 9.5) {
 // Opera <9.5 needs document.body.clientWidth/Height
 dimensions[d] = document.body['client' + D]
 } else {
 dimensions[d] = document.documentElement['client' + D];
 }
 });
 return dimensions;
 },

 getWidth: function() {
 return this.getDimensions().width;
 },

 getHeight: function() {
 return this.getDimensions().height;
 },

 getScrollOffsets: function() {
 return Element._returnOffset(
 window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
 window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop);
 }
};
/* Portions of the Selector class are derived from Jack Slocum's DomQuery,
 * part of YUI-Ext version 0.40, distributed under the terms of an MIT-style
 * license. Please see http://www.yui-ext.com/ for more information. */

var Selector = Class.create({
 initialize: function(expression) {
 this.expression = expression.strip();

 if (this.shouldUseSelectorsAPI()) {
 this.mode = 'selectorsAPI';
 } else if (this.shouldUseXPath()) {
 this.mode = 'xpath';
 this.compileXPathMatcher();
 } else {
 this.mode = "normal";
 this.compileMatcher();
 }

 },

 shouldUseXPath: function() {
 if (!Prototype.BrowserFeatures.XPath) return false;

 var e = this.expression;

 // Safari 3 chokes on :*-of-type and :empty
 if (Prototype.Browser.WebKit &&
 (e.include("-of-type") || e.include(":empty")))
 return false;

 // XPath can't do namespaced attributes, nor can it read
 // the "checked" property from DOM nodes
 if ((/(\[[\w-]*?:|:checked)/).test(e))
 return false;

 return true;
 },

 shouldUseSelectorsAPI: function() {
 if (!Prototype.BrowserFeatures.SelectorsAPI) return false;

 if (!Selector._div) Selector._div = new Element('div');

 // Make sure the browser treats the selector as valid. Test on an
 // isolated element to minimize cost of this check.
 try {
 Selector._div.querySelector(this.expression);
 } catch(e) {
 return false;
 }

 return true;
 },

 compileMatcher: function() {
 var e = this.expression, ps = Selector.patterns, h = Selector.handlers,
 c = Selector.criteria, le, p, m;

 if (Selector._cache[e]) {
 this.matcher = Selector._cache[e];
 return;
 }

 this.matcher = ["this.matcher = function(root) {",
 "var r = root, h = Selector.handlers, c = false, n;"];

 while (e && le != e && (/\S/).test(e)) {
 le = e;
 for (var i in ps) {
 p = ps[i];
 if (m = e.match(p)) {
 this.matcher.push(Object.isFunction(c[i]) ? c[i](m) :
 new Template(c[i]).evaluate(m));
 e = e.replace(m[0], '');
 break;
 }
 }
 }

 this.matcher.push("return h.unique(n);\n}");
 eval(this.matcher.join('\n'));
 Selector._cache[this.expression] = this.matcher;
 },

 compileXPathMatcher: function() {
 var e = this.expression, ps = Selector.patterns,
 x = Selector.xpath, le, m;

 if (Selector._cache[e]) {
 this.xpath = Selector._cache[e]; return;
 }

 this.matcher = ['.//*'];
 while (e && le != e && (/\S/).test(e)) {
 le = e;
 for (var i in ps) {
 if (m = e.match(ps[i])) {
 this.matcher.push(Object.isFunction(x[i]) ? x[i](m) :
 new Template(x[i]).evaluate(m));
 e = e.replace(m[0], '');
 break;
 }
 }
 }

 this.xpath = this.matcher.join('');
 Selector._cache[this.expression] = this.xpath;
 },

 findElements: function(root) {
 root = root || document;
 var e = this.expression, results;

 switch (this.mode) {
 case 'selectorsAPI':
 // querySelectorAll queries document-wide, then filters to descendants
 // of the context element. That's not what we want.
 // Add an explicit context to the selector if necessary.
 if (root !== document) {
 var oldId = root.id, id = $(root).identify();
 e = "#" + id + " " + e;
 }

 results = $A(root.querySelectorAll(e)).map(Element.extend);
 root.id = oldId;

 return results;
 case 'xpath':
 return document._getElementsByXPath(this.xpath, root);
 default:
 return this.matcher(root);
 }
 },

 match: function(element) {
 this.tokens = [];

 var e = this.expression, ps = Selector.patterns, as = Selector.assertions;
 var le, p, m;

 while (e && le !== e && (/\S/).test(e)) {
 le = e;
 for (var i in ps) {
 p = ps[i];
 if (m = e.match(p)) {
 // use the Selector.assertions methods unless the selector
 // is too complex.
 if (as[i]) {
 this.tokens.push([i, Object.clone(m)]);
 e = e.replace(m[0], '');
 } else {
 // reluctantly do a document-wide search
 // and look for a match in the array
 return this.findElements(document).include(element);
 }
 }
 }
 }

 var match = true, name, matches;
 for (var i = 0, token; token = this.tokens[i]; i++) {
 name = token[0], matches = token[1];
 if (!Selector.assertions[name](element, matches)) {
 match = false; break;
 }
 }

 return match;
 },

 toString: function() {
 return this.expression;
 },

 inspect: function() {
 return "#<Selector:" + this.expression.inspect() + ">";
 }
});

Object.extend(Selector, {
 _cache: { },

 xpath: {
 descendant: "//*",
 child: "/*",
 adjacent: "/following-sibling::*[1]",
 laterSibling: '/following-sibling::*',
 tagName: function(m) {
 if (m[1] == '*') return '';
 return "[local-name()='" + m[1].toLowerCase() +
 "' or local-name()='" + m[1].toUpperCase() + "']";
 },
 className: "[contains(concat(' ', @class, ' '), ' #{1} ')]",
 id: "[@id='#{1}']",
 attrPresence: function(m) {
 m[1] = m[1].toLowerCase();
 return new Template("[@#{1}]").evaluate(m);
 },
 attr: function(m) {
 m[1] = m[1].toLowerCase();
 m[3] = m[5] || m[6];
 return new Template(Selector.xpath.operators[m[2]]).evaluate(m);
 },
 pseudo: function(m) {
 var h = Selector.xpath.pseudos[m[1]];
 if (!h) return '';
 if (Object.isFunction(h)) return h(m);
 return new Template(Selector.xpath.pseudos[m[1]]).evaluate(m);
 },
 operators: {
 '=': "[@#{1}='#{3}']",
 '!=': "[@#{1}!='#{3}']",
 '^=': "[starts-with(@#{1}, '#{3}')]",
 '$=': "[substring(@#{1}, (string-length(@#{1}) - string-length('#{3}') + 1))='#{3}']",
 '*=': "[contains(@#{1}, '#{3}')]",
 '~=': "[contains(concat(' ', @#{1}, ' '), ' #{3} ')]",
 '|=': "[contains(concat('-', @#{1}, '-'), '-#{3}-')]"
 },
 pseudos: {
 'first-child': '[not(preceding-sibling::*)]',
 'last-child': '[not(following-sibling::*)]',
 'only-child': '[not(preceding-sibling::* or following-sibling::*)]',
 'empty': "[count(*) = 0 and (count(text()) = 0)]",
 'checked': "[@checked]",
 'disabled': "[(@disabled) and (@type!='hidden')]",
 'enabled': "[not(@disabled) and (@type!='hidden')]",
 'not': function(m) {
 var e = m[6], p = Selector.patterns,
 x = Selector.xpath, le, v;

 var exclusion = [];
 while (e && le != e && (/\S/).test(e)) {
 le = e;
 for (var i in p) {
 if (m = e.match(p[i])) {
 v = Object.isFunction(x[i]) ? x[i](m) : new Template(x[i]).evaluate(m);
 exclusion.push("(" + v.substring(1, v.length - 1) + ")");
 e = e.replace(m[0], '');
 break;
 }
 }
 }
 return "[not(" + exclusion.join(" and ") + ")]";
 },
 'nth-child': function(m) {
 return Selector.xpath.pseudos.nth("(count(./preceding-sibling::*) + 1) ", m);
 },
 'nth-last-child': function(m) {
 return Selector.xpath.pseudos.nth("(count(./following-sibling::*) + 1) ", m);
 },
 'nth-of-type': function(m) {
 return Selector.xpath.pseudos.nth("position() ", m);
 },
 'nth-last-of-type': function(m) {
 return Selector.xpath.pseudos.nth("(last() + 1 - position()) ", m);
 },
 'first-of-type': function(m) {
 m[6] = "1"; return Selector.xpath.pseudos['nth-of-type'](m);
 },
 'last-of-type': function(m) {
 m[6] = "1"; return Selector.xpath.pseudos['nth-last-of-type'](m);
 },
 'only-of-type': function(m) {
 var p = Selector.xpath.pseudos; return p['first-of-type'](m) + p['last-of-type'](m);
 },
 nth: function(fragment, m) {
 var mm, formula = m[6], predicate;
 if (formula == 'even') formula = '2n+0';
 if (formula == 'odd') formula = '2n+1';
 if (mm = formula.match(/^(\d+)$/)) // digit only
 return '[' + fragment + "= " + mm[1] + ']';
 if (mm = formula.match(/^(-?\d*)?n(([+-])(\d+))?/)) { // an+b
 if (mm[1] == "-") mm[1] = -1;
 var a = mm[1] ? Number(mm[1]) : 1;
 var b = mm[2] ? Number(mm[2]) : 0;
 predicate = "[((#{fragment} - #{b}) mod #{a} = 0) and " +
 "((#{fragment} - #{b}) div #{a} >= 0)]";
 return new Template(predicate).evaluate({
 fragment: fragment, a: a, b: b });
 }
 }
 }
 },

 criteria: {
 tagName: 'n = h.tagName(n, r, "#{1}", c); c = false;',
 className: 'n = h.className(n, r, "#{1}", c); c = false;',
 id: 'n = h.id(n, r, "#{1}", c); c = false;',
 attrPresence: 'n = h.attrPresence(n, r, "#{1}", c); c = false;',
 attr: function(m) {
 m[3] = (m[5] || m[6]);
 return new Template('n = h.attr(n, r, "#{1}", "#{3}", "#{2}", c); c = false;').evaluate(m);
 },
 pseudo: function(m) {
 if (m[6]) m[6] = m[6].replace(/"/g, '\\"');
 return new Template('n = h.pseudo(n, "#{1}", "#{6}", r, c); c = false;').evaluate(m);
 },
 descendant: 'c = "descendant";',
 child: 'c = "child";',
 adjacent: 'c = "adjacent";',
 laterSibling: 'c = "laterSibling";'
 },

 patterns: {
 // combinators must be listed first
 // (and descendant needs to be last combinator)
 laterSibling: /^\s*~\s*/,
 child: /^\s*>\s*/,
 adjacent: /^\s*\+\s*/,
 descendant: /^\s/,

 // selectors follow
 tagName: /^\s*(\*|[\w\-]+)(\b|$)?/,
 id: /^#([\w\-\*]+)(\b|$)/,
 className: /^\.([\w\-\*]+)(\b|$)/,
 pseudo:
/^:((first|last|nth|nth-last|only)(-child|-of-type)|empty|checked|(en|dis)abled|not)(\((.*?)\))?(\b|$|(?=\s|[:+~>]))/,
 attrPresence: /^\[((?:[\w]+:)?[\w]+)\]/,
 attr: /\[((?:[\w-]*:)?[\w-]+)\s*(?:([!^$*~|]?=)\s*((['"])([^\4]*?)\4|([^'"][^\]]*?)))?\]/
 },

 // for Selector.match and Element#match
 assertions: {
 tagName: function(element, matches) {
 return matches[1].toUpperCase() == element.tagName.toUpperCase();
 },

 className: function(element, matches) {
 return Element.hasClassName(element, matches[1]);
 },

 id: function(element, matches) {
 return element.id === matches[1];
 },

 attrPresence: function(element, matches) {
 return Element.hasAttribute(element, matches[1]);
 },

 attr: function(element, matches) {
 var nodeValue = Element.readAttribute(element, matches[1]);
 return nodeValue && Selector.operators[matches[2]](nodeValue, matches[5] || matches[6]);
 }
 },

 handlers: {
 // UTILITY FUNCTIONS
 // joins two collections
 concat: function(a, b) {
 for (var i = 0, node; node = b[i]; i++)
 a.push(node);
 return a;
 },

 // marks an array of nodes for counting
 mark: function(nodes) {
 var _true = Prototype.emptyFunction;
 for (var i = 0, node; node = nodes[i]; i++)
 node._countedByPrototype = _true;
 return nodes;
 },

 unmark: function(nodes) {
 for (var i = 0, node; node = nodes[i]; i++)
 node._countedByPrototype = undefined;
 return nodes;
 },

 // mark each child node with its position (for nth calls)
 // "ofType" flag indicates whether we're indexing for nth-of-type
 // rather than nth-child
 index: function(parentNode, reverse, ofType) {
 parentNode._countedByPrototype = Prototype.emptyFunction;
 if (reverse) {
 for (var nodes = parentNode.childNodes, i = nodes.length - 1, j = 1; i >= 0; i--) {
 var node = nodes[i];
 if (node.nodeType == 1 && (!ofType || node._countedByPrototype)) node.nodeIndex = j++;
 }
 } else {
 for (var i = 0, j = 1, nodes = parentNode.childNodes; node = nodes[i]; i++)
 if (node.nodeType == 1 && (!ofType || node._countedByPrototype)) node.nodeIndex = j++;
 }
 },

 // filters out duplicates and extends all nodes
 unique: function(nodes) {
 if (nodes.length == 0) return nodes;
 var results = [], n;
 for (var i = 0, l = nodes.length; i < l; i++)
 if (!(n = nodes[i])._countedByPrototype) {
 n._countedByPrototype = Prototype.emptyFunction;
 results.push(Element.extend(n));
 }
 return Selector.handlers.unmark(results);
 },

 // COMBINATOR FUNCTIONS
 descendant: function(nodes) {
 var h = Selector.handlers;
 for (var i = 0, results = [], node; node = nodes[i]; i++)
 h.concat(results, node.getElementsByTagName('*'));
 return results;
 },

 child: function(nodes) {
 var h = Selector.handlers;
 for (var i = 0, results = [], node; node = nodes[i]; i++) {
 for (var j = 0, child; child = node.childNodes[j]; j++)
 if (child.nodeType == 1 && child.tagName != '!') results.push(child);
 }
 return results;
 },

 adjacent: function(nodes) {
 for (var i = 0, results = [], node; node = nodes[i]; i++) {
 var next = this.nextElementSibling(node);
 if (next) results.push(next);
 }
 return results;
 },

 laterSibling: function(nodes) {
 var h = Selector.handlers;
 for (var i = 0, results = [], node; node = nodes[i]; i++)
 h.concat(results, Element.nextSiblings(node));
 return results;
 },

 nextElementSibling: function(node) {
 while (node = node.nextSibling)
 if (node.nodeType == 1) return node;
 return null;
 },

 previousElementSibling: function(node) {
 while (node = node.previousSibling)
 if (node.nodeType == 1) return node;
 return null;
 },

 // TOKEN FUNCTIONS
 tagName: function(nodes, root, tagName, combinator) {
 var uTagName = tagName.toUpperCase();
 var results = [], h = Selector.handlers;
 if (nodes) {
 if (combinator) {
 // fastlane for ordinary descendant combinators
 if (combinator == "descendant") {
 for (var i = 0, node; node = nodes[i]; i++)
 h.concat(results, node.getElementsByTagName(tagName));
 return results;
 } else nodes = this[combinator](nodes);
 if (tagName == "*") return nodes;
 }
 for (var i = 0, node; node = nodes[i]; i++)
 if (node.tagName.toUpperCase() === uTagName) results.push(node);
 return results;
 } else return root.getElementsByTagName(tagName);
 },

 id: function(nodes, root, id, combinator) {
 var targetNode = $(id), h = Selector.handlers;
 if (!targetNode) return [];
 if (!nodes && root == document) return [targetNode];
 if (nodes) {
 if (combinator) {
 if (combinator == 'child') {
 for (var i = 0, node; node = nodes[i]; i++)
 if (targetNode.parentNode == node) return [targetNode];
 } else if (combinator == 'descendant') {
 for (var i = 0, node; node = nodes[i]; i++)
 if (Element.descendantOf(targetNode, node)) return [targetNode];
 } else if (combinator == 'adjacent') {
 for (var i = 0, node; node = nodes[i]; i++)
 if (Selector.handlers.previousElementSibling(targetNode) == node)
 return [targetNode];
 } else nodes = h[combinator](nodes);
 }
 for (var i = 0, node; node = nodes[i]; i++)
 if (node == targetNode) return [targetNode];
 return [];
 }
 return (targetNode && Element.descendantOf(targetNode, root)) ? [targetNode] : [];
 },

 className: function(nodes, root, className, combinator) {
 if (nodes && combinator) nodes = this[combinator](nodes);
 return Selector.handlers.byClassName(nodes, root, className);
 },

 byClassName: function(nodes, root, className) {
 if (!nodes) nodes = Selector.handlers.descendant([root]);
 var needle = ' ' + className + ' ';
 for (var i = 0, results = [], node, nodeClassName; node = nodes[i]; i++) {
 nodeClassName = node.className;
 if (nodeClassName.length == 0) continue;
 if (nodeClassName == className || (' ' + nodeClassName + ' ').include(needle))
 results.push(node);
 }
 return results;
 },

 attrPresence: function(nodes, root, attr, combinator) {
 if (!nodes) nodes = root.getElementsByTagName("*");
 if (nodes && combinator) nodes = this[combinator](nodes);
 var results = [];
 for (var i = 0, node; node = nodes[i]; i++)
 if (Element.hasAttribute(node, attr)) results.push(node);
 return results;
 },

 attr: function(nodes, root, attr, value, operator, combinator) {
 if (!nodes) nodes = root.getElementsByTagName("*");
 if (nodes && combinator) nodes = this[combinator](nodes);
 var handler = Selector.operators[operator], results = [];
 for (var i = 0, node; node = nodes[i]; i++) {
 var nodeValue = Element.readAttribute(node, attr);
 if (nodeValue === null) continue;
 if (handler(nodeValue, value)) results.push(node);
 }
 return results;
 },

 pseudo: function(nodes, name, value, root, combinator) {
 if (nodes && combinator) nodes = this[combinator](nodes);
 if (!nodes) nodes = root.getElementsByTagName("*");
 return Selector.pseudos[name](nodes, value, root);
 }
 },

 pseudos: {
 'first-child': function(nodes, value, root) {
 for (var i = 0, results = [], node; node = nodes[i]; i++) {
 if (Selector.handlers.previousElementSibling(node)) continue;
 results.push(node);
 }
 return results;
 },
 'last-child': function(nodes, value, root) {
 for (var i = 0, results = [], node; node = nodes[i]; i++) {
 if (Selector.handlers.nextElementSibling(node)) continue;
 results.push(node);
 }
 return results;
 },
 'only-child': function(nodes, value, root) {
 var h = Selector.handlers;
 for (var i = 0, results = [], node; node = nodes[i]; i++)
 if (!h.previousElementSibling(node) && !h.nextElementSibling(node))
 results.push(node);
 return results;
 },
 'nth-child': function(nodes, formula, root) {
 return Selector.pseudos.nth(nodes, formula, root);
 },
 'nth-last-child': function(nodes, formula, root) {
 return Selector.pseudos.nth(nodes, formula, root, true);
 },
 'nth-of-type': function(nodes, formula, root) {
 return Selector.pseudos.nth(nodes, formula, root, false, true);
 },
 'nth-last-of-type': function(nodes, formula, root) {
 return Selector.pseudos.nth(nodes, formula, root, true, true);
 },
 'first-of-type': function(nodes, formula, root) {
 return Selector.pseudos.nth(nodes, "1", root, false, true);
 },
 'last-of-type': function(nodes, formula, root) {
 return Selector.pseudos.nth(nodes, "1", root, true, true);
 },
 'only-of-type': function(nodes, formula, root) {
 var p = Selector.pseudos;
 return p['last-of-type'](p['first-of-type'](nodes, formula, root), formula, root);
 },

 // handles the an+b logic
 getIndices: function(a, b, total) {
 if (a == 0) return b > 0 ? [b] : [];
 return $R(1, total).inject([], function(memo, i) {
 if (0 == (i - b) % a && (i - b) / a >= 0) memo.push(i);
 return memo;
 });
 },

 // handles nth(-last)-child, nth(-last)-of-type, and (first|last)-of-type
 nth: function(nodes, formula, root, reverse, ofType) {
 if (nodes.length == 0) return [];
 if (formula == 'even') formula = '2n+0';
 if (formula == 'odd') formula = '2n+1';
 var h = Selector.handlers, results = [], indexed = [], m;
 h.mark(nodes);
 for (var i = 0, node; node = nodes[i]; i++) {
 if (!node.parentNode._countedByPrototype) {
 h.index(node.parentNode, reverse, ofType);
 indexed.push(node.parentNode);
 }
 }
 if (formula.match(/^\d+$/)) { // just a number
 formula = Number(formula);
 for (var i = 0, node; node = nodes[i]; i++)
 if (node.nodeIndex == formula) results.push(node);
 } else if (m = formula.match(/^(-?\d*)?n(([+-])(\d+))?/)) { // an+b
 if (m[1] == "-") m[1] = -1;
 var a = m[1] ? Number(m[1]) : 1;
 var b = m[2] ? Number(m[2]) : 0;
 var indices = Selector.pseudos.getIndices(a, b, nodes.length);
 for (var i = 0, node, l = indices.length; node = nodes[i]; i++) {
 for (var j = 0; j < l; j++)
 if (node.nodeIndex == indices[j]) results.push(node);
 }
 }
 h.unmark(nodes);
 h.unmark(indexed);
 return results;
 },

 'empty': function(nodes, value, root) {
 for (var i = 0, results = [], node; node = nodes[i]; i++) {
 // IE treats comments as element nodes
 if (node.tagName == '!' || node.firstChild) continue;
 results.push(node);
 }
 return results;
 },

 'not': function(nodes, selector, root) {
 var h = Selector.handlers, selectorType, m;
 var exclusions = new Selector(selector).findElements(root);
 h.mark(exclusions);
 for (var i = 0, results = [], node; node = nodes[i]; i++)
 if (!node._countedByPrototype) results.push(node);
 h.unmark(exclusions);
 return results;
 },

 'enabled': function(nodes, value, root) {
 for (var i = 0, results = [], node; node = nodes[i]; i++)
 if (!node.disabled && (!node.type || node.type !== 'hidden'))
 results.push(node);
 return results;
 },

 'disabled': function(nodes, value, root) {
 for (var i = 0, results = [], node; node = nodes[i]; i++)
 if (node.disabled) results.push(node);
 return results;
 },

 'checked': function(nodes, value, root) {
 for (var i = 0, results = [], node; node = nodes[i]; i++)
 if (node.checked) results.push(node);
 return results;
 }
 },

 operators: {
 '=': function(nv, v) { return nv == v; },
 '!=': function(nv, v) { return nv != v; },
 '^=': function(nv, v) { return nv == v || nv && nv.startsWith(v); },
 '$=': function(nv, v) { return nv == v || nv && nv.endsWith(v); },
 '*=': function(nv, v) { return nv == v || nv && nv.include(v); },
 '$=': function(nv, v) { return nv.endsWith(v); },
 '*=': function(nv, v) { return nv.include(v); },
 '~=': function(nv, v) { return (' ' + nv + ' ').include(' ' + v + ' '); },
 '|=': function(nv, v) { return ('-' + (nv || "").toUpperCase() +
 '-').include('-' + (v || "").toUpperCase() + '-'); }
 },

 split: function(expression) {
 var expressions = [];
 expression.scan(/(([\w#:.~>+()\s-]+|\*|\[.*?\])+)\s*(,|$)/, function(m) {
 expressions.push(m[1].strip());
 });
 return expressions;
 },

 matchElements: function(elements, expression) {
 var matches = $$(expression), h = Selector.handlers;
 h.mark(matches);
 for (var i = 0, results = [], element; element = elements[i]; i++)
 if (element._countedByPrototype) results.push(element);
 h.unmark(matches);
 return results;
 },

 findElement: function(elements, expression, index) {
 if (Object.isNumber(expression)) {
 index = expression; expression = false;
 }
 return Selector.matchElements(elements, expression || '*')[index || 0];
 },

 findChildElements: function(element, expressions) {
 expressions = Selector.split(expressions.join(','));
 var results = [], h = Selector.handlers;
 for (var i = 0, l = expressions.length, selector; i < l; i++) {
 selector = new Selector(expressions[i].strip());
 h.concat(results, selector.findElements(element));
 }
 return (l > 1) ? h.unique(results) : results;
 }
});

if (Prototype.Browser.IE) {
 Object.extend(Selector.handlers, {
 // IE returns comment nodes on getElementsByTagName("*").
 // Filter them out.
 concat: function(a, b) {
 for (var i = 0, node; node = b[i]; i++)
 if (node.tagName !== "!") a.push(node);
 return a;
 },

 // IE improperly serializes _countedByPrototype in (inner|outer)HTML.
 unmark: function(nodes) {
 for (var i = 0, node; node = nodes[i]; i++)
 node.removeAttribute('_countedByPrototype');
 return nodes;
 }
 });
}

function $$() {
 return Selector.findChildElements(document, $A(arguments));
}
var Form = {
 reset: function(form) {
 $(form).reset();
 return form;
 },

 serializeElements: function(elements, options) {
 if (typeof options != 'object') options = { hash: !!options };
 else if (Object.isUndefined(options.hash)) options.hash = true;
 var key, value, submitted = false, submit = options.submit;

 var data = elements.inject({ }, function(result, element) {
 if (!element.disabled && element.name) {
 key = element.name; value = $(element).getValue();
 if (value != null && element.type != 'file' && (element.type != 'submit' || (!submitted &&
 submit !== false && (!submit || key == submit) && (submitted = true)))) {
 if (key in result) {
 // a key is already present; construct an array of values
 if (!Object.isArray(result[key])) result[key] = [result[key]];
 result[key].push(value);
 }
 else result[key] = value;
 }
 }
 return result;
 });

 return options.hash ? data : Object.toQueryString(data);
 }
};

Form.Methods = {
 serialize: function(form, options) {
 return Form.serializeElements(Form.getElements(form), options);
 },

 getElements: function(form) {
 return $A($(form).getElementsByTagName('*')).inject([],
 function(elements, child) {
 if (Form.Element.Serializers[child.tagName.toLowerCase()])
 elements.push(Element.extend(child));
 return elements;
 }
 );
 },

 getInputs: function(form, typeName, name) {
 form = $(form);
 var inputs = form.getElementsByTagName('input');

 if (!typeName && !name) return $A(inputs).map(Element.extend);

 for (var i = 0, matchingInputs = [], length = inputs.length; i < length; i++) {
 var input = inputs[i];
 if ((typeName && input.type != typeName) || (name && input.name != name))
 continue;
 matchingInputs.push(Element.extend(input));
 }

 return matchingInputs;
 },

 disable: function(form) {
 form = $(form);
 Form.getElements(form).invoke('disable');
 return form;
 },

 enable: function(form) {
 form = $(form);
 Form.getElements(form).invoke('enable');
 return form;
 },

 findFirstElement: function(form) {
 var elements = $(form).getElements().findAll(function(element) {
 return 'hidden' != element.type && !element.disabled;
 });
 var firstByIndex = elements.findAll(function(element) {
 return element.hasAttribute('tabIndex') && element.tabIndex >= 0;
 }).sortBy(function(element) { return element.tabIndex }).first();

 return firstByIndex ? firstByIndex : elements.find(function(element) {
 return ['input', 'select', 'textarea'].include(element.tagName.toLowerCase());
 });
 },

 focusFirstElement: function(form) {
 form = $(form);
 form.findFirstElement().activate();
 return form;
 },

 request: function(form, options) {
 form = $(form), options = Object.clone(options || { });

 var params = options.parameters, action = form.readAttribute('action') || '';
 if (action.blank()) action = window.location.href;
 options.parameters = form.serialize(true);

 if (params) {
 if (Object.isString(params)) params = params.toQueryParams();
 Object.extend(options.parameters, params);
 }

 if (form.hasAttribute('method') && !options.method)
 options.method = form.method;

 return new Ajax.Request(action, options);
 }
};

/*--------------------------------------------------------------------------*/

Form.Element = {
 focus: function(element) {
 $(element).focus();
 return element;
 },

 select: function(element) {
 $(element).select();
 return element;
 }
};

Form.Element.Methods = {
 serialize: function(element) {
 element = $(element);
 if (!element.disabled && element.name) {
 var value = element.getValue();
 if (value != undefined) {
 var pair = { };
 pair[element.name] = value;
 return Object.toQueryString(pair);
 }
 }
 return '';
 },

 getValue: function(element) {
 element = $(element);
 var method = element.tagName.toLowerCase();
 return Form.Element.Serializers[method](element);
 },

 setValue: function(element, value) {
 element = $(element);
 var method = element.tagName.toLowerCase();
 Form.Element.Serializers[method](element, value);
 return element;
 },

 clear: function(element) {
 $(element).value = '';
 return element;
 },

 present: function(element) {
 return $(element).value != '';
 },

 activate: function(element) {
 element = $(element);
 try {
 element.focus();
 if (element.select && (element.tagName.toLowerCase() != 'input' ||
 !['button', 'reset', 'submit'].include(element.type)))
 element.select();
 } catch (e) { }
 return element;
 },

 disable: function(element) {
 element = $(element);
 element.disabled = true;
 return element;
 },

 enable: function(element) {
 element = $(element);
 element.disabled = false;
 return element;
 }
};

/*--------------------------------------------------------------------------*/

var Field = Form.Element;
var $F = Form.Element.Methods.getValue;

/*--------------------------------------------------------------------------*/

Form.Element.Serializers = {
 input: function(element, value) {
 switch (element.type.toLowerCase()) {
 case 'checkbox':
 case 'radio':
 return Form.Element.Serializers.inputSelector(element, value);
 default:
 return Form.Element.Serializers.textarea(element, value);
 }
 },

 inputSelector: function(element, value) {
 if (Object.isUndefined(value)) return element.checked ? element.value : null;
 else element.checked = !!value;
 },

 textarea: function(element, value) {
 if (Object.isUndefined(value)) return element.value;
 else element.value = value;
 },

 select: function(element, value) {
 if (Object.isUndefined(value))
 return this[element.type == 'select-one' ?
 'selectOne' : 'selectMany'](element);
 else {
 var opt, currentValue, single = !Object.isArray(value);
 for (var i = 0, length = element.length; i < length; i++) {
 opt = element.options[i];
 currentValue = this.optionValue(opt);
 if (single) {
 if (currentValue == value) {
 opt.selected = true;
 return;
 }
 }
 else opt.selected = value.include(currentValue);
 }
 }
 },

 selectOne: function(element) {
 var index = element.selectedIndex;
 return index >= 0 ? this.optionValue(element.options[index]) : null;
 },

 selectMany: function(element) {
 var values, length = element.length;
 if (!length) return null;

 for (var i = 0, values = []; i < length; i++) {
 var opt = element.options[i];
 if (opt.selected) values.push(this.optionValue(opt));
 }
 return values;
 },

 optionValue: function(opt) {
 // extend element because hasAttribute may not be native
 return Element.extend(opt).hasAttribute('value') ? opt.value : opt.text;
 }
};

/*--------------------------------------------------------------------------*/

Abstract.TimedObserver = Class.create(PeriodicalExecuter, {
 initialize: function($super, element, frequency, callback) {
 $super(callback, frequency);
 this.element = $(element);
 this.lastValue = this.getValue();
 },

 execute: function() {
 var value = this.getValue();
 if (Object.isString(this.lastValue) && Object.isString(value) ?
 this.lastValue != value : String(this.lastValue) != String(value)) {
 this.callback(this.element, value);
 this.lastValue = value;
 }
 }
});

Form.Element.Observer = Class.create(Abstract.TimedObserver, {
 getValue: function() {
 return Form.Element.getValue(this.element);
 }
});

Form.Observer = Class.create(Abstract.TimedObserver, {
 getValue: function() {
 return Form.serialize(this.element);
 }
});

/*--------------------------------------------------------------------------*/

Abstract.EventObserver = Class.create({
 initialize: function(element, callback) {
 this.element = $(element);
 this.callback = callback;

 this.lastValue = this.getValue();
 if (this.element.tagName.toLowerCase() == 'form')
 this.registerFormCallbacks();
 else
 this.registerCallback(this.element);
 },

 onElementEvent: function() {
 var value = this.getValue();
 if (this.lastValue != value) {
 this.callback(this.element, value);
 this.lastValue = value;
 }
 },

 registerFormCallbacks: function() {
 Form.getElements(this.element).each(this.registerCallback, this);
 },

 registerCallback: function(element) {
 if (element.type) {
 switch (element.type.toLowerCase()) {
 case 'checkbox':
 case 'radio':
 Event.observe(element, 'click', this.onElementEvent.bind(this));
 break;
 default:
 Event.observe(element, 'change', this.onElementEvent.bind(this));
 break;
 }
 }
 }
});

Form.Element.EventObserver = Class.create(Abstract.EventObserver, {
 getValue: function() {
 return Form.Element.getValue(this.element);
 }
});

Form.EventObserver = Class.create(Abstract.EventObserver, {
 getValue: function() {
 return Form.serialize(this.element);
 }
});
if (!window.Event) var Event = { };

Object.extend(Event, {
 KEY_BACKSPACE: 8,
 KEY_TAB: 9,
 KEY_RETURN: 13,
 KEY_ESC: 27,
 KEY_LEFT: 37,
 KEY_UP: 38,
 KEY_RIGHT: 39,
 KEY_DOWN: 40,
 KEY_DELETE: 46,
 KEY_HOME: 36,
 KEY_END: 35,
 KEY_PAGEUP: 33,
 KEY_PAGEDOWN: 34,
 KEY_INSERT: 45,

 cache: { },

 relatedTarget: function(event) {
 var element;
 switch(event.type) {
 case 'mouseover': element = event.fromElement; break;
 case 'mouseout': element = event.toElement; break;
 default: return null;
 }
 return Element.extend(element);
 }
});

Event.Methods = (function() {
 var isButton;

 if (Prototype.Browser.IE) {
 var buttonMap = { 0: 1, 1: 4, 2: 2 };
 isButton = function(event, code) {
 return event.button == buttonMap[code];
 };

 } else if (Prototype.Browser.WebKit) {
 isButton = function(event, code) {
 switch (code) {
 case 0: return event.which == 1 && !event.metaKey;
 case 1: return event.which == 1 && event.metaKey;
 default: return false;
 }
 };

 } else {
 isButton = function(event, code) {
 return event.which ? (event.which === code + 1) : (event.button === code);
 };
 }

 return {
 isLeftClick: function(event) { return isButton(event, 0) },
 isMiddleClick: function(event) { return isButton(event, 1) },
 isRightClick: function(event) { return isButton(event, 2) },

 element: function(event) {
 event = Event.extend(event);

 var node = event.target,
 type = event.type,
 currentTarget = event.currentTarget;

 if (currentTarget && currentTarget.tagName) {
 // Firefox screws up the "click" event when moving between radio buttons
 // via arrow keys. It also screws up the "load" and "error" events on images,
 // reporting the document as the target instead of the original image.
 if (type === 'load' || type === 'error' ||
 (type === 'click' && currentTarget.tagName.toLowerCase() === 'input'
 && currentTarget.type === 'radio'))
 node = currentTarget;
 }
 if (node) {
 if (node.nodeType == Node.TEXT_NODE) node = node.parentNode;
 return Element.extend(node);
 } else return false;
 },

 findElement: function(event, expression) {
 var element = Event.element(event);
 if (!expression) return element;
 var elements = [element].concat(element.ancestors());
 return Selector.findElement(elements, expression, 0);
 },

 pointer: function(event) {
 var docElement = document.documentElement,
 body = document.body || { scrollLeft: 0, scrollTop: 0 };
 return {
 x: event.pageX || (event.clientX +
 (docElement.scrollLeft || body.scrollLeft) -
 (docElement.clientLeft || 0)),
 y: event.pageY || (event.clientY +
 (docElement.scrollTop || body.scrollTop) -
 (docElement.clientTop || 0))
 };
 },

 pointerX: function(event) { return Event.pointer(event).x },
 pointerY: function(event) { return Event.pointer(event).y },

 stop: function(event) {
 Event.extend(event);
 event.preventDefault();
 event.stopPropagation();
 event.stopped = true;
 }
 };
})();

Event.extend = (function() {
 var methods = Object.keys(Event.Methods).inject({ }, function(m, name) {
 m[name] = Event.Methods[name].methodize();
 return m;
 });

 if (Prototype.Browser.IE) {
 Object.extend(methods, {
 stopPropagation: function() { this.cancelBubble = true },
 preventDefault: function() { this.returnValue = false },
 inspect: function() { return "[object Event]" }
 });

 return function(event) {
 if (!event) return false;
 if (event._extendedByPrototype) return event;

 event._extendedByPrototype = Prototype.emptyFunction;
 var pointer = Event.pointer(event);
 Object.extend(event, {
 target: event.srcElement,
 relatedTarget: Event.relatedTarget(event),
 pageX: pointer.x,
 pageY: pointer.y
 });
 return Object.extend(event, methods);
 };

 } else {
 Event.prototype = Event.prototype || document.createEvent("HTMLEvents")['__proto__'];
 Object.extend(Event.prototype, methods);
 return Prototype.K;
 }
})();

Object.extend(Event, (function() {
 var cache = Event.cache;

 function getEventID(element) {
 try {
 if (element._prototypeEventID) return element._prototypeEventID[0];
 arguments.callee.id = arguments.callee.id || 1;
 return element._prototypeEventID = [++arguments.callee.id];
 } catch (error) {
 return false;
 }
 }

 function getDOMEventName(eventName) {
 if (eventName && eventName.include(':')) return "dataavailable";
 return eventName;
 }

 function getCacheForID(id) {
 return cache[id] = cache[id] || { };
 }

 function getWrappersForEventName(id, eventName) {
 var c = getCacheForID(id);
 return c[eventName] = c[eventName] || [];
 }

 function createWrapper(element, eventName, handler) {
 var id = getEventID(element);
 var c = getWrappersForEventName(id, eventName);
 if (c.pluck("handler").include(handler)) return false;

 var wrapper = function(event) {
 if (!Event || !Event.extend ||
 (event.eventName && event.eventName != eventName))
 return false;

 Event.extend(event);
 handler.call(element, event);
 };

 wrapper.handler = handler;
 c.push(wrapper);
 return wrapper;
 }

 function findWrapper(id, eventName, handler) {
 var c = getWrappersForEventName(id, eventName);
 return c.find(function(wrapper) { return wrapper.handler == handler });
 }

 function destroyWrapper(id, eventName, handler) {
 var c = getCacheForID(id);
 if (!c[eventName]) return false;
 c[eventName] = c[eventName].without(findWrapper(id, eventName, handler));
 }

 function destroyCache() {
 for (var id in cache)
 for (var eventName in cache[id])
 cache[id][eventName] = null;
 }


 // Internet Explorer needs to remove event handlers on page unload
 // in order to avoid memory leaks.
 if (window.attachEvent) {
 window.attachEvent("onunload", destroyCache);
 }

 // Safari has a dummy event handler on page unload so that it won't
 // use its bfcache. Safari <= 3.1 has an issue with restoring the "document"
 // object when page is returned to via the back button using its bfcache.
 if (Prototype.Browser.WebKit) {
 window.addEventListener('unload', Prototype.emptyFunction, false);
 }

 return {
 observe: function(element, eventName, handler) {
 element = $(element);
 var name = getDOMEventName(eventName);

 var wrapper = createWrapper(element, eventName, handler);
 if (!wrapper) return element;

 if (element.addEventListener) {
 element.addEventListener(name, wrapper, false);
 } else {
 element.attachEvent("on" + name, wrapper);
 }

 return element;
 },

 stopObserving: function(element, eventName, handler) {
 element = $(element);
 var id = getEventID(element), name = getDOMEventName(eventName);

 if (!handler && eventName) {
 getWrappersForEventName(id, eventName).each(function(wrapper) {
 element.stopObserving(eventName, wrapper.handler);
 });
 return element;

 } else if (!eventName) {
 Object.keys(getCacheForID(id)).each(function(eventName) {
 element.stopObserving(eventName);
 });
 return element;
 }

 var wrapper = findWrapper(id, eventName, handler);
 if (!wrapper) return element;

 if (element.removeEventListener) {
 element.removeEventListener(name, wrapper, false);
 } else {
 element.detachEvent("on" + name, wrapper);
 }

 destroyWrapper(id, eventName, handler);

 return element;
 },

 fire: function(element, eventName, memo) {
 element = $(element);
 if (element == document && document.createEvent && !element.dispatchEvent)
 element = document.documentElement;

 var event;
 if (document.createEvent) {
 event = document.createEvent("HTMLEvents");
 event.initEvent("dataavailable", true, true);
 } else {
 event = document.createEventObject();
 event.eventType = "ondataavailable";
 }

 event.eventName = eventName;
 event.memo = memo || { };

 if (document.createEvent) {
 element.dispatchEvent(event);
 } else {
 element.fireEvent(event.eventType, event);
 }

 return Event.extend(event);
 }
 };
})());

Object.extend(Event, Event.Methods);

Element.addMethods({
 fire: Event.fire,
 observe: Event.observe,
 stopObserving: Event.stopObserving
});

Object.extend(document, {
 fire: Element.Methods.fire.methodize(),
 observe: Element.Methods.observe.methodize(),
 stopObserving: Element.Methods.stopObserving.methodize(),
 loaded: false
});

(function() {
 /* Support for the DOMContentLoaded event is based on work by Dan Webb,
 Matthias Miller, Dean Edwards and John Resig. */

 var timer;

 function fireContentLoadedEvent() {
 if (document.loaded) return;
 if (timer) window.clearInterval(timer);
 document.fire("dom:loaded");
 document.loaded = true;
 }

 if (document.addEventListener) {
 if (Prototype.Browser.WebKit) {
 timer = window.setInterval(function() {
 if (/loaded|complete/.test(document.readyState))
 fireContentLoadedEvent();
 }, 0);

 Event.observe(window, "load", fireContentLoadedEvent);

 } else {
 document.addEventListener("DOMContentLoaded",
 fireContentLoadedEvent, false);
 }

 } else {
 document.write("<script id=__onDOMContentLoaded defer src=//:><\/script>");
 $("__onDOMContentLoaded").onreadystatechange = function() {
 if (this.readyState == "complete") {
 this.onreadystatechange = null;
 fireContentLoadedEvent();
 }
 };
 }
})();
/*------------------------------- DEPRECATED -------------------------------*/

Hash.toQueryString = Object.toQueryString;

var Toggle = { display: Element.toggle };

Element.Methods.childOf = Element.Methods.descendantOf;

var Insertion = {
 Before: function(element, content) {
 return Element.insert(element, {before:content});
 },

 Top: function(element, content) {
 return Element.insert(element, {top:content});
 },

 Bottom: function(element, content) {
 return Element.insert(element, {bottom:content});
 },

 After: function(element, content) {
 return Element.insert(element, {after:content});
 }
};

var $continue = new Error('"throw $continue" is deprecated, use "return" instead');

// This should be moved to script.aculo.us; notice the deprecated methods
// further below, that map to the newer Element methods.
var Position = {
 // set to true if needed, warning: firefox performance problems
 // NOT neeeded for page scrolling, only if draggable contained in
 // scrollable elements
 includeScrollOffsets: false,

 // must be called before calling withinIncludingScrolloffset, every time the
 // page is scrolled
 prepare: function() {
 this.deltaX = window.pageXOffset
 || document.documentElement.scrollLeft
 || document.body.scrollLeft
 || 0;
 this.deltaY = window.pageYOffset
 || document.documentElement.scrollTop
 || document.body.scrollTop
 || 0;
 },

 // caches x/y coordinate pair to use with overlap
 within: function(element, x, y) {
 if (this.includeScrollOffsets)
 return this.withinIncludingScrolloffsets(element, x, y);
 this.xcomp = x;
 this.ycomp = y;
 this.offset = Element.cumulativeOffset(element);

 return (y >= this.offset[1] &&
 y < this.offset[1] + element.offsetHeight &&
 x >= this.offset[0] &&
 x < this.offset[0] + element.offsetWidth);
 },

 withinIncludingScrolloffsets: function(element, x, y) {
 var offsetcache = Element.cumulativeScrollOffset(element);

 this.xcomp = x + offsetcache[0] - this.deltaX;
 this.ycomp = y + offsetcache[1] - this.deltaY;
 this.offset = Element.cumulativeOffset(element);

 return (this.ycomp >= this.offset[1] &&
 this.ycomp < this.offset[1] + element.offsetHeight &&
 this.xcomp >= this.offset[0] &&
 this.xcomp < this.offset[0] + element.offsetWidth);
 },

 // within must be called directly before
 overlap: function(mode, element) {
 if (!mode) return 0;
 if (mode == 'vertical')
 return ((this.offset[1] + element.offsetHeight) - this.ycomp) /
 element.offsetHeight;
 if (mode == 'horizontal')
 return ((this.offset[0] + element.offsetWidth) - this.xcomp) /
 element.offsetWidth;
 },

 // Deprecation layer -- use newer Element methods now (1.5.2).

 cumulativeOffset: Element.Methods.cumulativeOffset,

 positionedOffset: Element.Methods.positionedOffset,

 absolutize: function(element) {
 Position.prepare();
 return Element.absolutize(element);
 },

 relativize: function(element) {
 Position.prepare();
 return Element.relativize(element);
 },

 realOffset: Element.Methods.cumulativeScrollOffset,

 offsetParent: Element.Methods.getOffsetParent,

 page: Element.Methods.viewportOffset,

 clone: function(source, target, options) {
 options = options || { };
 return Element.clonePosition(target, source, options);
 }
};

/*--------------------------------------------------------------------------*/

if (!document.getElementsByClassName) document.getElementsByClassName = function(instanceMethods){
 function iter(name) {
 return name.blank() ? null : "[contains(concat(' ', @class, ' '), ' " + name + " ')]";
 }

 instanceMethods.getElementsByClassName = Prototype.BrowserFeatures.XPath ?
 function(element, className) {
 className = className.toString().strip();
 var cond = /\s/.test(className) ? $w(className).map(iter).join('') : iter(className);
 return cond ? document._getElementsByXPath('.//*' + cond, element) : [];
 } : function(element, className) {
 className = className.toString().strip();
 var elements = [], classNames = (/\s/.test(className) ? $w(className) : null);
 if (!classNames && !className) return elements;

 var nodes = $(element).getElementsByTagName('*');
 className = ' ' + className + ' ';

 for (var i = 0, child, cn; child = nodes[i]; i++) {
 if (child.className && (cn = ' ' + child.className + ' ') && (cn.include(className) ||
 (classNames && classNames.all(function(name) {
 return !name.toString().blank() && cn.include(' ' + name + ' ');
 }))))
 elements.push(Element.extend(child));
 }
 return elements;
 };

 return function(className, parentElement) {
 return $(parentElement || document.body).getElementsByClassName(className);
 };
}(Element.Methods);

/*--------------------------------------------------------------------------*/

Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
 initialize: function(element) {
 this.element = $(element);
 },

 _each: function(iterator) {
 this.element.className.split(/\s+/).select(function(name) {
 return name.length > 0;
 })._each(iterator);
 },

 set: function(className) {
 this.element.className = className;
 },

 add: function(classNameToAdd) {
 if (this.include(classNameToAdd)) return;
 this.set($A(this).concat(classNameToAdd).join(' '));
 },

 remove: function(classNameToRemove) {
 if (!this.include(classNameToRemove)) return;
 this.set($A(this).without(classNameToRemove).join(' '));
 },

 toString: function() {
 return $A(this).join(' ');
 }
};

Object.extend(Element.ClassNames.prototype, Enumerable);

/*--------------------------------------------------------------------------*/

Element.addMethods();
/*
* Really easy field validation with Prototype
* http://tetlaw.id.au/view/javascript/really-easy-field-validation
* Andrew Tetlaw
* Version 1.5.4.1 (2007-01-05)
*
* Copyright (c) 2007 Andrew Tetlaw
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use, copy,
* modify, merge, publish, distribute, sublicense, and/or sell copies
* of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
* BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
* ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
* CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
*/
var Validator = Class.create();

Validator.prototype = {
 initialize : function(className, error, test, options) {
 if(typeof test == 'function'){
 this.options = $H(options);
 this._test = test;
 } else {
 this.options = $H(test);
 this._test = function(){return true};
 }
 this.error = error || 'Validation failed.';
 this.className = className;
 },
 test : function(v, elm) {
 return (this._test(v,elm) && this.options.all(function(p){
 return Validator.methods[p.key] ? Validator.methods[p.key](v,elm,p.value) : true;
 }));
 }
}
Validator.methods = {
 pattern : function(v,elm,opt) {return Validation.get('IsEmpty').test(v) || opt.test(v)},
 minLength : function(v,elm,opt) {return v.length >= opt},
 maxLength : function(v,elm,opt) {return v.length <= opt},
 min : function(v,elm,opt) {return v >= parseFloat(opt)},
 max : function(v,elm,opt) {return v <= parseFloat(opt)},
 notOneOf : function(v,elm,opt) {return $A(opt).all(function(value) {
 return v != value;
 })},
 oneOf : function(v,elm,opt) {return $A(opt).any(function(value) {
 return v == value;
 })},
 is : function(v,elm,opt) {return v == opt},
 isNot : function(v,elm,opt) {return v != opt},
 equalToField : function(v,elm,opt) {return v == $F(opt)},
 notEqualToField : function(v,elm,opt) {return v != $F(opt)},
 include : function(v,elm,opt) {return $A(opt).all(function(value) {
 return Validation.get(value).test(v,elm);
 })}
}

var Validation = Class.create();
Validation.defaultOptions = {
 onSubmit : true,
 stopOnFirst : false,
 immediate : false,
 focusOnError : true,
 useTitles : false,
 addClassNameToContainer: false,
 containerClassName: '.input-box',
 onFormValidate : function(result, form) {},
 onElementValidate : function(result, elm) {}
};

Validation.prototype = {
 initialize : function(form, options){
 this.form = $(form);
 if (!this.form) {
 return;
 }
 this.options = Object.extend({
 onSubmit : Validation.defaultOptions.onSubmit,
 stopOnFirst : Validation.defaultOptions.stopOnFirst,
 immediate : Validation.defaultOptions.immediate,
 focusOnError : Validation.defaultOptions.focusOnError,
 useTitles : Validation.defaultOptions.useTitles,
 onFormValidate : Validation.defaultOptions.onFormValidate,
 onElementValidate : Validation.defaultOptions.onElementValidate
 }, options || {});
 if(this.options.onSubmit) Event.observe(this.form,'submit',this.onSubmit.bind(this),false);
 if(this.options.immediate) {
 Form.getElements(this.form).each(function(input) { // Thanks Mike! 
 if (input.tagName.toLowerCase() == 'select') {
 Event.observe(input, 'blur', this.onChange.bindAsEventListener(this));
 }
 Event.observe(input, 'change', this.onChange.bindAsEventListener(this));
 }, this);
 }
 },
 onChange : function (ev) {
 Validation.isOnChange = true;
 Validation.validate(Event.element(ev),{
 useTitle : this.options.useTitles, 
 onElementValidate : this.options.onElementValidate
 });
 Validation.isOnChange = false; 
 },
 onSubmit : function(ev){
 if(!this.validate()) Event.stop(ev);
 },
 validate : function() {
 var result = false;
 var useTitles = this.options.useTitles;
 var callback = this.options.onElementValidate;
 try {
 if(this.options.stopOnFirst) {
 result = Form.getElements(this.form).all(function(elm) { return Validation.validate(elm,{useTitle : useTitles, onElementValidate : callback}); });
 } else {
 result = Form.getElements(this.form).collect(function(elm) { return Validation.validate(elm,{useTitle : useTitles, onElementValidate : callback}); }).all();
 }
 } catch (e) {

 }
 if(!result && this.options.focusOnError) {
 try{
 Form.getElements(this.form).findAll(function(elm){return $(elm).hasClassName('validation-failed')}).first().focus()
 }
 catch(e){

 }
 }
 this.options.onFormValidate(result, this.form);
 return result;
 },
 reset : function() {
 Form.getElements(this.form).each(Validation.reset);
 }
}

Object.extend(Validation, {
 validate : function(elm, options){
 options = Object.extend({
 useTitle : false,
 onElementValidate : function(result, elm) {}
 }, options || {});
 elm = $(elm);

 var cn = $w(elm.className);
 return result = cn.all(function(value) {
 var test = Validation.test(value,elm,options.useTitle);
 options.onElementValidate(test, elm);
 return test;
 });
 },
 insertAdvice : function(elm, advice){
 var container = $(elm).up('.field-row');
 if(container){
 Element.insert(container, {after: advice});
 } else if (elm.up('td.value')) {
 elm.up('td.value').insert({bottom: advice});
 } else if (elm.advaiceContainer && $(elm.advaiceContainer)) {
 $(elm.advaiceContainer).update(advice);
 }
 else {
 switch (elm.type.toLowerCase()) {
 case 'checkbox':
 case 'radio':
 var p = elm.parentNode;
 if(p) {
 Element.insert(p, {'bottom': advice});
 } else {
 Element.insert(elm, {'after': advice});
 }
 break;
 default:
 Element.insert(elm, {'after': advice});
 }
 }
 },
 showAdvice : function(elm, advice, adviceName){
 if(!elm.advices){
 elm.advices = new Hash();
 }
 else{
 elm.advices.each(function(pair){
 this.hideAdvice(elm, pair.value);
 }.bind(this));
 }
 elm.advices.set(adviceName, advice);
 if(typeof Effect == 'undefined') {
 advice.style.display = 'block';
 } else {
 if(!advice._adviceAbsolutize) {
 new Effect.Appear(advice, {duration : 1 });
 } else {
 Position.absolutize(advice);
 advice.show();
 advice.setStyle({
 'top':advice._adviceTop,
 'left': advice._adviceLeft,
 'width': advice._adviceWidth,
 'z-index': 1000
 });
 advice.addClassName('advice-absolute');
 }
 }
 },
 hideAdvice : function(elm, advice){
 if(advice != null) advice.hide();
 },
 updateCallback : function(elm, status) {
 if (typeof elm.callbackFunction != 'undefined') {
 eval(elm.callbackFunction+'(\''+elm.id+'\',\''+status+'\')');
 }
 },
 ajaxError : function(elm, errorMsg) {
 var name = 'validate-ajax';
 var advice = Validation.getAdvice(name, elm);
 if (advice == null) {
 advice = this.createAdvice(name, elm, false, errorMsg);
 }
 this.showAdvice(elm, advice, 'validate-ajax');
 this.updateCallback(elm, 'failed');

 elm.addClassName('validation-failed');
 elm.addClassName('validate-ajax');
 if (Validation.defaultOptions.addClassNameToContainer && Validation.defaultOptions.containerClassName != '') {
 var container = elm.up(Validation.defaultOptions.containerClassName);
 if (container && this.allowContainerClassName(elm)) {
 container.removeClassName('validation-passed');
 container.addClassName('validation-error');
 }
 }
 },
 allowContainerClassName: function (elm) {
 if (elm.type == 'radio' || elm.type == 'checkbox') {
 return elm.hasClassName('change-container-classname');
 }
 
 return true;
 },
 test : function(name, elm, useTitle) {
 var v = Validation.get(name);
 var prop = '__advice'+name.camelize();
 try {
 if(Validation.isVisible(elm) && !v.test($F(elm), elm)) {
 //if(!elm[prop]) {
 var advice = Validation.getAdvice(name, elm);
 if (advice == null) {
 advice = this.createAdvice(name, elm, useTitle);
 }
 this.showAdvice(elm, advice, name);
 this.updateCallback(elm, 'failed');
 //}
 elm[prop] = 1;
 if (!elm.advaiceContainer) {
 elm.removeClassName('validation-passed');
 elm.addClassName('validation-failed');
 } 
 
 if (Validation.defaultOptions.addClassNameToContainer && Validation.defaultOptions.containerClassName != '') {
 var container = elm.up(Validation.defaultOptions.containerClassName);
 if (container && this.allowContainerClassName(elm)) {
 container.removeClassName('validation-passed');
 container.addClassName('validation-error');
 }
 }
 return false;
 } else {
 var advice = Validation.getAdvice(name, elm);
 this.hideAdvice(elm, advice);
 this.updateCallback(elm, 'passed');
 elm[prop] = '';
 elm.removeClassName('validation-failed');
 elm.addClassName('validation-passed');
 if (Validation.defaultOptions.addClassNameToContainer && Validation.defaultOptions.containerClassName != '') {
 var container = elm.up(Validation.defaultOptions.containerClassName);
 if (container && !container.down('.validation-failed') && this.allowContainerClassName(elm)) {
 if (!Validation.get('IsEmpty').test(elm.value) || !this.isVisible(elm)) { 
 container.addClassName('validation-passed');
 } else {
 container.removeClassName('validation-passed');
 }
 container.removeClassName('validation-error');
 }
 }
 return true;
 }
 } catch(e) {
 throw(e)
 }
 },
 isVisible : function(elm) {
 while(elm.tagName != 'BODY') {
 if(!$(elm).visible()) return false;
 elm = elm.parentNode;
 }
 return true;
 },
 getAdvice : function(name, elm) {
 return $('advice-' + name + '-' + Validation.getElmID(elm)) || $('advice-' + Validation.getElmID(elm));
 },
 createAdvice : function(name, elm, useTitle, customError) {
 var v = Validation.get(name);
 var errorMsg = useTitle ? ((elm && elm.title) ? elm.title : v.error) : v.error;
 if (customError) {
 errorMsg = customError;
 }
 try {
 if (Translator){
 errorMsg = Translator.translate(errorMsg);
 }
 }
 catch(e){}

 advice = '<div class="validation-advice" id="advice-' + name + '-' + Validation.getElmID(elm) +'" style="display:none">' + errorMsg + '</div>'


 Validation.insertAdvice(elm, advice);
 advice = Validation.getAdvice(name, elm);
 if($(elm).hasClassName('absolute-advice')) {
 var dimensions = $(elm).getDimensions();
 var originalPosition = Position.cumulativeOffset(elm);

 advice._adviceTop = (originalPosition[1] + dimensions.height) + 'px';
 advice._adviceLeft = (originalPosition[0]) + 'px';
 advice._adviceWidth = (dimensions.width) + 'px';
 advice._adviceAbsolutize = true;
 }
 return advice;
 },
 getElmID : function(elm) {
 return elm.id ? elm.id : elm.name;
 },
 reset : function(elm) {
 elm = $(elm);
 var cn = $w(elm.className);
 cn.each(function(value) {
 var prop = '__advice'+value.camelize();
 if(elm[prop]) {
 var advice = Validation.getAdvice(value, elm);
 if (advice) {
 advice.hide();
 }
 elm[prop] = '';
 }
 elm.removeClassName('validation-failed');
 elm.removeClassName('validation-passed');
 if (Validation.defaultOptions.addClassNameToContainer && Validation.defaultOptions.containerClassName != '') {
 var container = elm.up(Validation.defaultOptions.containerClassName);
 if (container) {
 container.removeClassName('validation-passed');
 container.removeClassName('validation-error');
 }
 }
 });
 },
 add : function(className, error, test, options) {
 var nv = {};
 nv[className] = new Validator(className, error, test, options);
 Object.extend(Validation.methods, nv);
 },
 addAllThese : function(validators) {
 var nv = {};
 $A(validators).each(function(value) {
 nv[value[0]] = new Validator(value[0], value[1], value[2], (value.length > 3 ? value[3] : {}));
 });
 Object.extend(Validation.methods, nv);
 },
 get : function(name) {
 return Validation.methods[name] ? Validation.methods[name] : Validation.methods['_LikeNoIDIEverSaw_'];
 },
 methods : {
 '_LikeNoIDIEverSaw_' : new Validator('_LikeNoIDIEverSaw_','',{})
 }
});

Validation.add('IsEmpty', '', function(v) {
 return (v == '' || (v == null) || (v.length == 0) || /^\s+$/.test(v)); // || /^\s+$/.test(v));
});

Validation.addAllThese([
 ['validate-select', 'Please select an option.', function(v) {
 return ((v != "none") && (v != null) && (v.length != 0));
 }],
 ['required-entry', 'This is a required field.', function(v) {
 return !Validation.get('IsEmpty').test(v);
 }],
 ['validate-number', 'Please enter a valid number in this field.', function(v) {
 return Validation.get('IsEmpty').test(v) || (!isNaN(parseNumber(v)) && !/^\s+$/.test(parseNumber(v)));
 }],
 ['validate-digits', 'Please use numbers only in this field. please avoid spaces or other characters such as dots or commas.', function(v) {
 return Validation.get('IsEmpty').test(v) || !/[^\d]/.test(v);
 }],
 ['validate-alpha', 'Please use letters only (a-z or A-Z) in this field.', function (v) {
 return Validation.get('IsEmpty').test(v) || /^[a-zA-Z]+$/.test(v)
 }],
 ['validate-code', 'Please use only letters (a-z), numbers (0-9) or underscore(_) in this field, first character should be a letter.', function (v) {
 return Validation.get('IsEmpty').test(v) || /^[a-z]+[a-z0-9_]+$/.test(v)
 }],
 ['validate-alphanum', 'Please use only letters (a-z or A-Z) or numbers (0-9) only in this field. No spaces or other characters are allowed.', function(v) {
 return Validation.get('IsEmpty').test(v) || /^[a-zA-Z0-9]+$/.test(v) /*!/\W/.test(v)*/
 }],
 ['validate-street', 'Please use only letters (a-z or A-Z) or numbers (0-9) or spaces and # only in this field.', function(v) {
 return Validation.get('IsEmpty').test(v) || /^[ \w]{3,}([A-Za-z]\.)?([ \w]*\#\d+)?(\r\n| )[ \w]{3,}/.test(v)
 }],
 ['validate-phoneStrict', 'Please enter a valid phone number. For example (123) 456-7890 or 123-456-7890.', function(v) {
 return Validation.get('IsEmpty').test(v) || /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/.test(v);
 }],
 ['validate-phoneLax', 'Please enter a valid phone number. For example (123) 456-7890 or 123-456-7890.', function(v) {
 return Validation.get('IsEmpty').test(v) || /^((\d[-. ]?)?((\(\d{3}\))|\d{3}))?[-. ]?\d{3}[-. ]?\d{4}$/.test(v);
 }],
 ['validate-fax', 'Please enter a valid fax number. For example (123) 456-7890 or 123-456-7890.', function(v) {
 return Validation.get('IsEmpty').test(v) || /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/.test(v);
 }],
 ['validate-date', 'Please enter a valid date.', function(v) {
 var test = new Date(v);
 return Validation.get('IsEmpty').test(v) || !isNaN(test);
 }],
 ['validate-email', 'Please enter a valid email address. For example johndoe@domain.com.', function (v) {
 //return Validation.get('IsEmpty').test(v) || /\w{1,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/.test(v)
 //return Validation.get('IsEmpty').test(v) || /^[\!\#$%\*/?|\^\{\}`~&\'\+\-=_a-z0-9][\!\#$%\*/?|\^\{\}`~&\'\+\-=_a-z0-9\.]{1,30}[\!\#$%\*/?|\^\{\}`~&\'\+\-=_a-z0-9]@([a-z0-9_-]{1,30}\.){1,5}[a-z]{2,4}$/i.test(v)
// iv , remove single quote for minify to work
 return Validation.get('IsEmpty').test(v) || /^[a-z0-9,!\#\$%&\*\+/=\?\^_`\{\|}~-]+(\.[a-z0-9,!#\$%&'\*\+/=\?\^_`\{\|}~-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*\.([a-z]{2,})/i.test(v)
 }],
 ['validate-emailSender', 'Please use only letters (a-z or A-Z), numbers (0-9) , underscore(_) or spaces in this field.', function (v) {
 return Validation.get('IsEmpty').test(v) || /^[a-zA-Z0-9_\s]+$/.test(v)
 }],
 ['validate-password', 'Please enter 6 or more characters. Leading or trailing spaces will be ignored.', function(v) {
 var pass=v.strip(); /*strip leading and trailing spaces*/
 return !(pass.length>0 && pass.length < 6);
 }],
 ['validate-admin-password', 'Please enter 7 or more characters. Password should contain both numeric and alphabetic characters.', function(v) {
 var pass=v.strip();
 if (0 == pass.length) {
 return true;
 }
 if (!(/[a-z]/i.test(v)) || !(/[0-9]/.test(v))) {
 return false;
 }
 return !(pass.length < 7);
 }],
 ['validate-cpassword', 'Please make sure your passwords match.', function(v) {
 if ($('password')) {
 var pass = $('password');
 }
 else {
 var pass = $$('.validate-password').length ? $$('.validate-password')[0] : $$('.validate-admin-password')[0];
 }
 var conf = $('confirmation') ? $('confirmation') : $$('.validate-cpassword')[0];
 return (pass.value == conf.value);
 }],
 ['validate-url', 'Please enter a valid URL. http:// is required', function (v) {
 return Validation.get('IsEmpty').test(v) || /^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i.test(v)
 }],
 ['validate-clean-url', 'Please enter a valid URL. For example http://www.example.com or www.example.com', function (v) {
 return Validation.get('IsEmpty').test(v) || /^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+.(com|org|net|dk|at|us|tv|info|uk|co.uk|biz|se)$)(:(\d+))?\/?/i.test(v) || /^(www)((\.[A-Z0-9][A-Z0-9_-]*)+.(com|org|net|dk|at|us|tv|info|uk|co.uk|biz|se)$)(:(\d+))?\/?/i.test(v)
 }],
 ['validate-identifier', 'Please enter a valid Identifier. For example example-page, example-page.html or anotherlevel/example-page', function (v) {
 return Validation.get('IsEmpty').test(v) || /^[A-Z0-9][A-Z0-9_\/-]+(\.[A-Z0-9_-]+)*$/i.test(v)
 }],
 ['validate-xml-identifier', 'Please enter a valid XML-identifier. For example something_1, block5, id-4', function (v) {
 return Validation.get('IsEmpty').test(v) || /^[A-Z][A-Z0-9_\/-]*$/i.test(v)
 }],
 ['validate-ssn', 'Please enter a valid social security number. For example 123-45-6789.', function(v) {
 return Validation.get('IsEmpty').test(v) || /^\d{3}-?\d{2}-?\d{4}$/.test(v);
 }],
 ['validate-zip', 'Please enter a valid zip code. For example 90602 or 90602-1234.', function(v) {
 return Validation.get('IsEmpty').test(v) || /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(v);
 }],
 ['validate-zip-international', 'Please enter a valid zip code.', function(v) {
 //return Validation.get('IsEmpty').test(v) || /(^[A-z0-9]{2,10}([\s]{0,1}|[\-]{0,1})[A-z0-9]{2,10}$)/.test(v);
 return true;
 }],
 ['validate-date-au', 'Please use this date format: dd/mm/yyyy. For example 17/03/2006 for the 17th of March, 2006.', function(v) {
 if(Validation.get('IsEmpty').test(v)) return true;
 var regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
 if(!regex.test(v)) return false;
 var d = new Date(v.replace(regex, '$2/$1/$3'));
 return ( parseInt(RegExp.$2, 10) == (1+d.getMonth()) ) &&
 (parseInt(RegExp.$1, 10) == d.getDate()) &&
 (parseInt(RegExp.$3, 10) == d.getFullYear() );
 }],
 ['validate-currency-dollar', 'Please enter a valid $ amount. For example $100.00.', function(v) {
 // [$]1[##][,###]+[.##]
 // [$]1###+[.##]
 // [$]0.##
 // [$].##
 return Validation.get('IsEmpty').test(v) || /^\$?\-?([1-9]{1}[0-9]{0,2}(\,[0-9]{3})*(\.[0-9]{0,2})?|[1-9]{1}\d*(\.[0-9]{0,2})?|0(\.[0-9]{0,2})?|(\.[0-9]{1,2})?)$/.test(v)
 }],
 ['validate-one-required', 'Please select one of the above options.', function (v,elm) {
 var p = elm.parentNode;
 var options = p.getElementsByTagName('INPUT');
 return $A(options).any(function(elm) {
 return $F(elm);
 });
 }],
 ['validate-one-required-by-name', 'Please select one of the options.', function (v,elm) {
 var inputs = $$('input[name="' + elm.name.replace(/([\\"])/g, '\\$1') + '"]');
 
 var error = 1;
 for(var i=0;i<inputs.length;i++) {
 if((inputs[i].type == 'checkbox' || inputs[i].type == 'radio') && inputs[i].checked == true) {
 error = 0;
 }
 
 if(Validation.isOnChange && (inputs[i].type == 'checkbox' || inputs[i].type == 'radio')) {
 Validation.reset(inputs[i]);
 }
 }

 if( error == 0 ) {
 return true;
 } else {
 return false;
 }
 }],
 ['validate-not-negative-number', 'Please enter a valid number in this field.', function(v) {
 v = parseNumber(v);
 return (!isNaN(v) && v>=0);
 }],
 ['validate-state', 'Please select State/Province.', function(v) {
 return (v!=0 || v == '');
 }],

 ['validate-new-password', 'Please enter 6 or more characters. Leading or trailing spaces will be ignored.', function(v) {
 if (!Validation.get('validate-password').test(v)) return false;
 if (Validation.get('IsEmpty').test(v) && v != '') return false;
 return true;
 }],
 ['validate-greater-than-zero', 'Please enter a number greater than 0 in this field.', function(v) {
 if(v.length)
 return parseFloat(v) > 0;
 else
 return true;
 }],
 ['validate-zero-or-greater', 'Please enter a number 0 or greater in this field.', function(v) {
 if(v.length)
 return parseFloat(v) >= 0;
 else
 return true;
 }],
 ['validate-cc-number', 'Please enter a valid credit card number.', function(v, elm) {
 // remove non-numerics
 var ccTypeContainer = $(elm.id.substr(0,elm.id.indexOf('_cc_number')) + '_cc_type');
 if (ccTypeContainer && typeof Validation.creditCartTypes.get(ccTypeContainer.value) != 'undefined'
 && Validation.creditCartTypes.get(ccTypeContainer.value)[2] == false) {
 if (!Validation.get('IsEmpty').test(v) && Validation.get('validate-digits').test(v)) {
 return true;
 } else {
 return false;
 }
 }
 return validateCreditCard(v);
 }],
 ['validate-cc-type', 'Credit card number doesn\'t match credit card type', function(v, elm) {
 // remove credit card number delimiters such as "-" and space
 elm.value = removeDelimiters(elm.value);
 v = removeDelimiters(v);

 var ccTypeContainer = $(elm.id.substr(0,elm.id.indexOf('_cc_number')) + '_cc_type');
 if (!ccTypeContainer) {
 return true;
 }
 var ccType = ccTypeContainer.value;

 if (typeof Validation.creditCartTypes.get(ccType) == 'undefined') {
 return false;
 }

 // Other card type or switch or solo card
 if (Validation.creditCartTypes.get(ccType)[0]==false) {
 return true;
 }

 // Matched credit card type
 var ccMatchedType = '';

 Validation.creditCartTypes.each(function (pair) {
 if (pair.value[0] && v.match(pair.value[0])) {
 ccMatchedType = pair.key;
 throw $break;
 }
 });

 if(ccMatchedType != ccType) {
 return false;
 }
 
 if (ccTypeContainer.hasClassName('validation-failed') && Validation.isOnChange) {
 Validation.validate(ccTypeContainer);
 }

 return true;
 }],
 ['validate-cc-type-select', 'Card type doesn\'t match credit card number', function(v, elm) {
 var ccNumberContainer = $(elm.id.substr(0,elm.id.indexOf('_cc_type')) + '_cc_number');
 if (Validation.isOnChange && Validation.get('IsEmpty').test(ccNumberContainer.value)) {
 return true;
 }
 if (Validation.get('validate-cc-type').test(ccNumberContainer.value, ccNumberContainer)) {
 Validation.validate(ccNumberContainer);
 }
 return Validation.get('validate-cc-type').test(ccNumberContainer.value, ccNumberContainer);
 }],
 ['validate-cc-exp', 'Incorrect credit card expiration date', function(v, elm) {
 var ccExpMonth = v;
 var ccExpYear = $('ccsave_expiration_yr').value;
 var currentTime = new Date();
 var currentMonth = currentTime.getMonth() + 1;
 var currentYear = currentTime.getFullYear();
 if (ccExpMonth < currentMonth && ccExpYear == currentYear) {
 return false;
 }
 return true;
 }],
 ['validate-cc-cvn', 'Please enter a valid credit card verification number.', function(v, elm) {
 var ccTypeContainer = $(elm.id.substr(0,elm.id.indexOf('_cc_cid')) + '_cc_type');
 if (!ccTypeContainer) {
 return true;
 }
 var ccType = ccTypeContainer.value;

 if (typeof Validation.creditCartTypes.get(ccType) == 'undefined') {
 return false;
 }

 var re = Validation.creditCartTypes.get(ccType)[1];

 if (v.match(re)) {
 return true;
 }

 return false;
 }],
 ['validate-ajax', '', function(v, elm) { return true; }],
 ['validate-data', 'Please use only letters (a-z or A-Z), numbers (0-9) or underscore(_) in this field, first character should be a letter.', function (v) {
 if(v != '' && v) {
 return /^[A-Za-z]+[A-Za-z0-9_]+$/.test(v);
 }
 return true;
 }],
 ['validate-css-length', 'Please input a valid CSS-length. For example 100px or 77pt or 20em or .5ex or 50%', function (v) {
 if (v != '' && v) {
 return /^[0-9\.]+(px|pt|em|ex|%)?$/.test(v) && (!(/\..*\./.test(v))) && !(/\.$/.test(v));
 }
 return true;
 }],
 ['validate-length', 'Maximum length exceeded.', function (v, elm) {
 var re = new RegExp(/^maximum-length-[0-9]+$/);
 var result = true;
 $w(elm.className).each(function(name, index) {
 if (name.match(re) && result) {
 var length = name.split('-')[2];
 result = (v.length <= length);
 }
 });
 return result;
 }]
]);


// Credit Card Validation Javascript
// copyright 12th May 2003, by Stephen Chapman, Felgall Pty Ltd

// You have permission to copy and use this javascript provided that
// the content of the script is not changed in any way.

function validateCreditCard(s) {
 // remove non-numerics
 var v = "0123456789";
 var w = "";
 for (i=0; i < s.length; i++) {
 x = s.charAt(i);
 if (v.indexOf(x,0) != -1)
 w += x;
 }
 // validate number
 j = w.length / 2;
 k = Math.floor(j);
 m = Math.ceil(j) - k;
 c = 0;
 for (i=0; i<k; i++) {
 a = w.charAt(i*2+m) * 2;
 c += a > 9 ? Math.floor(a/10 + a%10) : a;
 }
 for (i=0; i<k+m; i++) c += w.charAt(i*2+1-m) * 1;
 return (c%10 == 0);
}

function removeDelimiters (v) {
 v = v.replace(/\s/g, '');
 v = v.replace(/\-/g, '');
 return v;
}

function parseNumber(v)
{
 if (typeof v != 'string') {
 return parseFloat(v);
 }

 var isDot = v.indexOf('.');
 var isComa = v.indexOf(',');

 if (isDot != -1 && isComa != -1) {
 if (isComa > isDot) {
 v = v.replace('.', '').replace(',', '.');
 }
 else {
 v = v.replace(',', '');
 }
 }
 else if (isComa != -1) {
 v = v.replace(',', '.');
 }

 return parseFloat(v);
}

/**
 * Hash with credit card types wich can be simply extended in payment modules
 * 0 - regexp for card number
 * 1 - regexp for cvn
 * 2 - check or not credit card number trough Luhn algorithm by
 * function validateCreditCard wich you can find above in this file
 */
Validation.creditCartTypes = $H({
 'VI': [new RegExp('^4[0-9]{12}([0-9]{3})?$'), new RegExp('^[0-9]{3}$'), true],
 'MC': [new RegExp('^5[1-5][0-9]{14}$'), new RegExp('^[0-9]{3}$'), true],
 'AE': [new RegExp('^3[47][0-9]{13}$'), new RegExp('^[0-9]{4}$'), true],
 'DI': [new RegExp('^6011[0-9]{12}$'), new RegExp('^[0-9]{3}$'), true],
 'SS': [new RegExp('^((6759[0-9]{12})|(49[013][1356][0-9]{13})|(633[34][0-9]{12})|(633110[0-9]{10})|(564182[0-9]{10}))([0-9]{2,3})?$'), new RegExp('^([0-9]{3}|[0-9]{4})?$'), true],
 'OT': [false, new RegExp('^([0-9]{3}|[0-9]{4})?$'), false]
});

// script.aculo.us builder.js v1.7.1_beta3, Fri May 25 17:19:41 +0200 2007

// Copyright (c) 2005-2007 Thomas Fuchs (http://script.aculo.us, http://mir.aculo.us)
//
// script.aculo.us is freely distributable under the terms of an MIT-style license.
// For details, see the script.aculo.us web site: http://script.aculo.us/

var Builder = {
 NODEMAP: {
 AREA: 'map',
 CAPTION: 'table',
 COL: 'table',
 COLGROUP: 'table',
 LEGEND: 'fieldset',
 OPTGROUP: 'select',
 OPTION: 'select',
 PARAM: 'object',
 TBODY: 'table',
 TD: 'table',
 TFOOT: 'table',
 TH: 'table',
 THEAD: 'table',
 TR: 'table'
 },
 // note: For Firefox < 1.5, OPTION and OPTGROUP tags are currently broken,
 // due to a Firefox bug
 node: function(elementName) {
 elementName = elementName.toUpperCase();
 
 // try innerHTML approach
 var parentTag = this.NODEMAP[elementName] || 'div';
 var parentElement = document.createElement(parentTag);
 try { // prevent IE "feature": http://dev.rubyonrails.org/ticket/2707
 parentElement.innerHTML = "<" + elementName + "></" + elementName + ">";
 } catch(e) {}
 var element = parentElement.firstChild || null;
 
 // see if browser added wrapping tags
 if(element && (element.tagName.toUpperCase() != elementName))
 element = element.getElementsByTagName(elementName)[0];
 
 // fallback to createElement approach
 if(!element) element = document.createElement(elementName);
 
 // abort if nothing could be created
 if(!element) return;

 // attributes (or text)
 if(arguments[1])
 if(this._isStringOrNumber(arguments[1]) ||
 (arguments[1] instanceof Array) ||
 arguments[1].tagName) {
 this._children(element, arguments[1]);
 } else {
 var attrs = this._attributes(arguments[1]);
 if(attrs.length) {
 try { // prevent IE "feature": http://dev.rubyonrails.org/ticket/2707
 parentElement.innerHTML = "<" +elementName + " " +
 attrs + "></" + elementName + ">";
 } catch(e) {}
 element = parentElement.firstChild || null;
 // workaround firefox 1.0.X bug
 if(!element) {
 element = document.createElement(elementName);
 for(attr in arguments[1]) 
 element[attr == 'class' ? 'className' : attr] = arguments[1][attr];
 }
 if(element.tagName.toUpperCase() != elementName)
 element = parentElement.getElementsByTagName(elementName)[0];
 }
 } 

 // text, or array of children
 if(arguments[2])
 this._children(element, arguments[2]);

 return element;
 },
 _text: function(text) {
 return document.createTextNode(text);
 },

 ATTR_MAP: {
 'className': 'class',
 'htmlFor': 'for'
 },

 _attributes: function(attributes) {
 var attrs = [];
 for(attribute in attributes)
 attrs.push((attribute in this.ATTR_MAP ? this.ATTR_MAP[attribute] : attribute) +
 '="' + attributes[attribute].toString().escapeHTML().gsub(/"/,'&quot;') + '"');
 return attrs.join(" ");
 },
 _children: function(element, children) {
 if(children.tagName) {
 element.appendChild(children);
 return;
 }
 if(typeof children=='object') { // array can hold nodes and text
 children.flatten().each( function(e) {
 if(typeof e=='object')
 element.appendChild(e)
 else
 if(Builder._isStringOrNumber(e))
 element.appendChild(Builder._text(e));
 });
 } else
 if(Builder._isStringOrNumber(children))
 element.appendChild(Builder._text(children));
 },
 _isStringOrNumber: function(param) {
 return(typeof param=='string' || typeof param=='number');
 },
 build: function(html) {
 var element = this.node('div');
 $(element).update(html.strip());
 return element.down();
 },
 dump: function(scope) { 
 if(typeof scope != 'object' && typeof scope != 'function') scope = window; //global scope 
 
 var tags = ("A ABBR ACRONYM ADDRESS APPLET AREA B BASE BASEFONT BDO BIG BLOCKQUOTE BODY " +
 "BR BUTTON CAPTION CENTER CITE CODE COL COLGROUP DD DEL DFN DIR DIV DL DT EM FIELDSET " +
 "FONT FORM FRAME FRAMESET H1 H2 H3 H4 H5 H6 HEAD HR HTML I IFRAME IMG INPUT INS ISINDEX "+
 "KBD LABEL LEGEND LI LINK MAP MENU META NOFRAMES NOSCRIPT OBJECT OL OPTGROUP OPTION P "+
 "PARAM PRE Q S SAMP SCRIPT SELECT SMALL SPAN STRIKE STRONG STYLE SUB SUP TABLE TBODY TD "+
 "TEXTAREA TFOOT TH THEAD TITLE TR TT U UL VAR").split(/\s+/);
 
 tags.each( function(tag){ 
 scope[tag] = function() { 
 return Builder.node.apply(Builder, [tag].concat($A(arguments))); 
 } 
 });
 }
}

// script.aculo.us effects.js v1.7.1_beta3, Fri May 25 17:19:41 +0200 2007

// Copyright (c) 2005-2007 Thomas Fuchs (http://script.aculo.us, http://mir.aculo.us)
// Contributors:
// Justin Palmer (http://encytemedia.com/)
// Mark Pilgrim (http://diveintomark.org/)
// Martin Bialasinki
// 
// script.aculo.us is freely distributable under the terms of an MIT-style license.
// For details, see the script.aculo.us web site: http://script.aculo.us/ 

// converts rgb() and #xxx to #xxxxxx format, 
// returns self (or first argument) if not convertable 
String.prototype.parseColor = function() { 
 var color = '#';
 if(this.slice(0,4) == 'rgb(') { 
 var cols = this.slice(4,this.length-1).split(','); 
 var i=0; do { color += parseInt(cols[i]).toColorPart() } while (++i<3); 
 } else { 
 if(this.slice(0,1) == '#') { 
 if(this.length==4) for(var i=1;i<4;i++) color += (this.charAt(i) + this.charAt(i)).toLowerCase(); 
 if(this.length==7) color = this.toLowerCase(); 
 } 
 } 
 return(color.length==7 ? color : (arguments[0] || this)); 
}

/*--------------------------------------------------------------------------*/

Element.collectTextNodes = function(element) { 
 return $A($(element).childNodes).collect( function(node) {
 return (node.nodeType==3 ? node.nodeValue : 
 (node.hasChildNodes() ? Element.collectTextNodes(node) : ''));
 }).flatten().join('');
}

Element.collectTextNodesIgnoreClass = function(element, className) { 
 return $A($(element).childNodes).collect( function(node) {
 return (node.nodeType==3 ? node.nodeValue : 
 ((node.hasChildNodes() && !Element.hasClassName(node,className)) ? 
 Element.collectTextNodesIgnoreClass(node, className) : ''));
 }).flatten().join('');
}

Element.setContentZoom = function(element, percent) {
 element = $(element); 
 element.setStyle({fontSize: (percent/100) + 'em'}); 
 if(Prototype.Browser.WebKit) window.scrollBy(0,0);
 return element;
}

Element.getInlineOpacity = function(element){
 return $(element).style.opacity || '';
}

Element.forceRerendering = function(element) {
 try {
 element = $(element);
 var n = document.createTextNode(' ');
 element.appendChild(n);
 element.removeChild(n);
 } catch(e) { }
};

/*--------------------------------------------------------------------------*/

Array.prototype.call = function() {
 var args = arguments;
 this.each(function(f){ f.apply(this, args) });
}

/*--------------------------------------------------------------------------*/

var Effect = {
 _elementDoesNotExistError: {
 name: 'ElementDoesNotExistError',
 message: 'The specified DOM element does not exist, but is required for this effect to operate'
 },
 tagifyText: function(element) {
 if(typeof Builder == 'undefined')
 throw("Effect.tagifyText requires including script.aculo.us' builder.js library");
 
 var tagifyStyle = 'position:relative';
 if(Prototype.Browser.IE) tagifyStyle += ';zoom:1';
 
 element = $(element);
 $A(element.childNodes).each( function(child) {
 if(child.nodeType==3) {
 child.nodeValue.toArray().each( function(character) {
 element.insertBefore(
 Builder.node('span',{style: tagifyStyle},
 character == ' ' ? String.fromCharCode(160) : character), 
 child);
 });
 Element.remove(child);
 }
 });
 },
 multiple: function(element, effect) {
 var elements;
 if(((typeof element == 'object') || 
 (typeof element == 'function')) && 
 (element.length))
 elements = element;
 else
 elements = $(element).childNodes;
 
 var options = Object.extend({
 speed: 0.1,
 delay: 0.0
 }, arguments[2] || {});
 var masterDelay = options.delay;

 $A(elements).each( function(element, index) {
 new effect(element, Object.extend(options, { delay: index * options.speed + masterDelay }));
 });
 },
 PAIRS: {
 'slide': ['SlideDown','SlideUp'],
 'blind': ['BlindDown','BlindUp'],
 'appear': ['Appear','Fade']
 },
 toggle: function(element, effect) {
 element = $(element);
 effect = (effect || 'appear').toLowerCase();
 var options = Object.extend({
 queue: { position:'end', scope:(element.id || 'global'), limit: 1 }
 }, arguments[2] || {});
 Effect[element.visible() ? 
 Effect.PAIRS[effect][1] : Effect.PAIRS[effect][0]](element, options);
 }
};

var Effect2 = Effect; // deprecated

/* ------------- transitions ------------- */

Effect.Transitions = {
 linear: Prototype.K,
 sinoidal: function(pos) {
 return (-Math.cos(pos*Math.PI)/2) + 0.5;
 },
 reverse: function(pos) {
 return 1-pos;
 },
 flicker: function(pos) {
 var pos = ((-Math.cos(pos*Math.PI)/4) + 0.75) + Math.random()/4;
 return (pos > 1 ? 1 : pos);
 },
 wobble: function(pos) {
 return (-Math.cos(pos*Math.PI*(9*pos))/2) + 0.5;
 },
 pulse: function(pos, pulses) { 
 pulses = pulses || 5; 
 return (
 Math.round((pos % (1/pulses)) * pulses) == 0 ? 
 ((pos * pulses * 2) - Math.floor(pos * pulses * 2)) : 
 1 - ((pos * pulses * 2) - Math.floor(pos * pulses * 2))
 );
 },
 none: function(pos) {
 return 0;
 },
 full: function(pos) {
 return 1;
 }
};

/* ------------- core effects ------------- */

Effect.ScopedQueue = Class.create();
Object.extend(Object.extend(Effect.ScopedQueue.prototype, Enumerable), {
 initialize: function() {
 this.effects = [];
 this.interval = null; 
 },
 _each: function(iterator) {
 this.effects._each(iterator);
 },
 add: function(effect) {
 var timestamp = new Date().getTime();
 
 var position = (typeof effect.options.queue == 'string') ? 
 effect.options.queue : effect.options.queue.position;
 
 switch(position) {
 case 'front':
 // move unstarted effects after this effect 
 this.effects.findAll(function(e){ return e.state=='idle' }).each( function(e) {
 e.startOn += effect.finishOn;
 e.finishOn += effect.finishOn;
 });
 break;
 case 'with-last':
 timestamp = this.effects.pluck('startOn').max() || timestamp;
 break;
 case 'end':
 // start effect after last queued effect has finished
 timestamp = this.effects.pluck('finishOn').max() || timestamp;
 break;
 }
 
 effect.startOn += timestamp;
 effect.finishOn += timestamp;

 if(!effect.options.queue.limit || (this.effects.length < effect.options.queue.limit))
 this.effects.push(effect);
 
 if(!this.interval)
 this.interval = setInterval(this.loop.bind(this), 15);
 },
 remove: function(effect) {
 this.effects = this.effects.reject(function(e) { return e==effect });
 if(this.effects.length == 0) {
 clearInterval(this.interval);
 this.interval = null;
 }
 },
 loop: function() {
 var timePos = new Date().getTime();
 for(var i=0, len=this.effects.length;i<len;i++) 
 this.effects[i] && this.effects[i].loop(timePos);
 }
});

Effect.Queues = {
 instances: $H(),
 get: function(queueName) {
 if(typeof queueName != 'string') return queueName;
 
 if(!this.instances[queueName])
 this.instances[queueName] = new Effect.ScopedQueue();
 
 return this.instances[queueName];
 }
}
Effect.Queue = Effect.Queues.get('global');

Effect.DefaultOptions = {
 transition: Effect.Transitions.sinoidal,
 duration: 1.0, // seconds
 fps: 100, // 100= assume 66fps max.
 sync: false, // true for combining
 from: 0.0,
 to: 1.0,
 delay: 0.0,
 queue: 'parallel'
}

Effect.Base = function() {};
Effect.Base.prototype = {
 position: null,
 start: function(options) {
 function codeForEvent(options,eventName){
 return (
 (options[eventName+'Internal'] ? 'this.options.'+eventName+'Internal(this);' : '') +
 (options[eventName] ? 'this.options.'+eventName+'(this);' : '')
 );
 }
 if(options.transition === false) options.transition = Effect.Transitions.linear;
 this.options = Object.extend(Object.extend({},Effect.DefaultOptions), options || {});
 this.currentFrame = 0;
 this.state = 'idle';
 this.startOn = this.options.delay*1000;
 this.finishOn = this.startOn+(this.options.duration*1000);
 this.fromToDelta = this.options.to-this.options.from;
 this.totalTime = this.finishOn-this.startOn;
 this.totalFrames = this.options.fps*this.options.duration;
 
 eval('this.render = function(pos){ '+
 'if(this.state=="idle"){this.state="running";'+
 codeForEvent(options,'beforeSetup')+
 (this.setup ? 'this.setup();':'')+ 
 codeForEvent(options,'afterSetup')+
 '};if(this.state=="running"){'+
 'pos=this.options.transition(pos)*'+this.fromToDelta+'+'+this.options.from+';'+
 'this.position=pos;'+
 codeForEvent(options,'beforeUpdate')+
 (this.update ? 'this.update(pos);':'')+
 codeForEvent(options,'afterUpdate')+
 '}}');
 
 this.event('beforeStart');
 if(!this.options.sync)
 Effect.Queues.get(typeof this.options.queue == 'string' ? 
 'global' : this.options.queue.scope).add(this);
 },
 loop: function(timePos) {
 if(timePos >= this.startOn) {
 if(timePos >= this.finishOn) {
 this.render(1.0);
 this.cancel();
 this.event('beforeFinish');
 if(this.finish) this.finish(); 
 this.event('afterFinish');
 return; 
 }
 var pos = (timePos - this.startOn) / this.totalTime,
 frame = Math.round(pos * this.totalFrames);
 if(frame > this.currentFrame) {
 this.render(pos);
 this.currentFrame = frame;
 }
 }
 },
 cancel: function() {
 if(!this.options.sync)
 Effect.Queues.get(typeof this.options.queue == 'string' ? 
 'global' : this.options.queue.scope).remove(this);
 this.state = 'finished';
 },
 event: function(eventName) {
 if(this.options[eventName + 'Internal']) this.options[eventName + 'Internal'](this);
 if(this.options[eventName]) this.options[eventName](this);
 },
 inspect: function() {
 var data = $H();
 for(property in this)
 if(typeof this[property] != 'function') data[property] = this[property];
 return '#<Effect:' + data.inspect() + ',options:' + $H(this.options).inspect() + '>';
 }
}

Effect.Parallel = Class.create();
Object.extend(Object.extend(Effect.Parallel.prototype, Effect.Base.prototype), {
 initialize: function(effects) {
 this.effects = effects || [];
 this.start(arguments[1]);
 },
 update: function(position) {
 this.effects.invoke('render', position);
 },
 finish: function(position) {
 this.effects.each( function(effect) {
 effect.render(1.0);
 effect.cancel();
 effect.event('beforeFinish');
 if(effect.finish) effect.finish(position);
 effect.event('afterFinish');
 });
 }
});

Effect.Event = Class.create();
Object.extend(Object.extend(Effect.Event.prototype, Effect.Base.prototype), {
 initialize: function() {
 var options = Object.extend({
 duration: 0
 }, arguments[0] || {});
 this.start(options);
 },
 update: Prototype.emptyFunction
});

Effect.Opacity = Class.create();
Object.extend(Object.extend(Effect.Opacity.prototype, Effect.Base.prototype), {
 initialize: function(element) {
 this.element = $(element);
 if(!this.element) throw(Effect._elementDoesNotExistError);
 // make this work on IE on elements without 'layout'
 if(Prototype.Browser.IE && (!this.element.currentStyle.hasLayout))
 this.element.setStyle({zoom: 1});
 var options = Object.extend({
 from: this.element.getOpacity() || 0.0,
 to: 1.0
 }, arguments[1] || {});
 this.start(options);
 },
 update: function(position) {
 this.element.setOpacity(position);
 }
});

Effect.Move = Class.create();
Object.extend(Object.extend(Effect.Move.prototype, Effect.Base.prototype), {
 initialize: function(element) {
 this.element = $(element);
 if(!this.element) throw(Effect._elementDoesNotExistError);
 var options = Object.extend({
 x: 0,
 y: 0,
 mode: 'relative'
 }, arguments[1] || {});
 this.start(options);
 },
 setup: function() {
 // Bug in Opera: Opera returns the "real" position of a static element or
 // relative element that does not have top/left explicitly set.
 // ==> Always set top and left for position relative elements in your stylesheets 
 // (to 0 if you do not need them) 
 this.element.makePositioned();
 this.originalLeft = parseFloat(this.element.getStyle('left') || '0');
 this.originalTop = parseFloat(this.element.getStyle('top') || '0');
 if(this.options.mode == 'absolute') {
 // absolute movement, so we need to calc deltaX and deltaY
 this.options.x = this.options.x - this.originalLeft;
 this.options.y = this.options.y - this.originalTop;
 }
 },
 update: function(position) {
 this.element.setStyle({
 left: Math.round(this.options.x * position + this.originalLeft) + 'px',
 top: Math.round(this.options.y * position + this.originalTop) + 'px'
 });
 }
});

// for backwards compatibility
Effect.MoveBy = function(element, toTop, toLeft) {
 return new Effect.Move(element, 
 Object.extend({ x: toLeft, y: toTop }, arguments[3] || {}));
};

Effect.Scale = Class.create();
Object.extend(Object.extend(Effect.Scale.prototype, Effect.Base.prototype), {
 initialize: function(element, percent) {
 this.element = $(element);
 if(!this.element) throw(Effect._elementDoesNotExistError);
 var options = Object.extend({
 scaleX: true,
 scaleY: true,
 scaleContent: true,
 scaleFromCenter: false,
 scaleMode: 'box', // 'box' or 'contents' or {} with provided values
 scaleFrom: 100.0,
 scaleTo: percent
 }, arguments[2] || {});
 this.start(options);
 },
 setup: function() {
 this.restoreAfterFinish = this.options.restoreAfterFinish || false;
 this.elementPositioning = this.element.getStyle('position');
 
 this.originalStyle = {};
 ['top','left','width','height','fontSize'].each( function(k) {
 this.originalStyle[k] = this.element.style[k];
 }.bind(this));
 
 this.originalTop = this.element.offsetTop;
 this.originalLeft = this.element.offsetLeft;
 
 var fontSize = this.element.getStyle('font-size') || '100%';
 ['em','px','%','pt'].each( function(fontSizeType) {
 if(fontSize.indexOf(fontSizeType)>0) {
 this.fontSize = parseFloat(fontSize);
 this.fontSizeType = fontSizeType;
 }
 }.bind(this));
 
 this.factor = (this.options.scaleTo - this.options.scaleFrom)/100;
 
 this.dims = null;
 if(this.options.scaleMode=='box')
 this.dims = [this.element.offsetHeight, this.element.offsetWidth];
 if(/^content/.test(this.options.scaleMode))
 this.dims = [this.element.scrollHeight, this.element.scrollWidth];
 if(!this.dims)
 this.dims = [this.options.scaleMode.originalHeight,
 this.options.scaleMode.originalWidth];
 },
 update: function(position) {
 var currentScale = (this.options.scaleFrom/100.0) + (this.factor * position);
 if(this.options.scaleContent && this.fontSize)
 this.element.setStyle({fontSize: this.fontSize * currentScale + this.fontSizeType });
 this.setDimensions(this.dims[0] * currentScale, this.dims[1] * currentScale);
 },
 finish: function(position) {
 if(this.restoreAfterFinish) this.element.setStyle(this.originalStyle);
 },
 setDimensions: function(height, width) {
 var d = {};
 if(this.options.scaleX) d.width = Math.round(width) + 'px';
 if(this.options.scaleY) d.height = Math.round(height) + 'px';
 if(this.options.scaleFromCenter) {
 var topd = (height - this.dims[0])/2;
 var leftd = (width - this.dims[1])/2;
 if(this.elementPositioning == 'absolute') {
 if(this.options.scaleY) d.top = this.originalTop-topd + 'px';
 if(this.options.scaleX) d.left = this.originalLeft-leftd + 'px';
 } else {
 if(this.options.scaleY) d.top = -topd + 'px';
 if(this.options.scaleX) d.left = -leftd + 'px';
 }
 }
 this.element.setStyle(d);
 }
});

Effect.Highlight = Class.create();
Object.extend(Object.extend(Effect.Highlight.prototype, Effect.Base.prototype), {
 initialize: function(element) {
 this.element = $(element);
 if(!this.element) throw(Effect._elementDoesNotExistError);
 var options = Object.extend({ startcolor: '#ffff99' }, arguments[1] || {});
 this.start(options);
 },
 setup: function() {
 // Prevent executing on elements not in the layout flow
 if(this.element.getStyle('display')=='none') { this.cancel(); return; }
 // Disable background image during the effect
 this.oldStyle = {};
 if (!this.options.keepBackgroundImage) {
 this.oldStyle.backgroundImage = this.element.getStyle('background-image');
 this.element.setStyle({backgroundImage: 'none'});
 }
 if(!this.options.endcolor)
 this.options.endcolor = this.element.getStyle('background-color').parseColor('#ffffff');
 if(!this.options.restorecolor)
 this.options.restorecolor = this.element.getStyle('background-color');
 // init color calculations
 this._base = $R(0,2).map(function(i){ return parseInt(this.options.startcolor.slice(i*2+1,i*2+3),16) }.bind(this));
 this._delta = $R(0,2).map(function(i){ return parseInt(this.options.endcolor.slice(i*2+1,i*2+3),16)-this._base[i] }.bind(this));
 },
 update: function(position) {
 this.element.setStyle({backgroundColor: $R(0,2).inject('#',function(m,v,i){
 return m+(Math.round(this._base[i]+(this._delta[i]*position)).toColorPart()); }.bind(this)) });
 },
 finish: function() {
 this.element.setStyle(Object.extend(this.oldStyle, {
 backgroundColor: this.options.restorecolor
 }));
 }
});

Effect.ScrollTo = Class.create();
Object.extend(Object.extend(Effect.ScrollTo.prototype, Effect.Base.prototype), {
 initialize: function(element) {
 this.element = $(element);
 this.start(arguments[1] || {});
 },
 setup: function() {
 Position.prepare();
 var offsets = Position.cumulativeOffset(this.element);
 if(this.options.offset) offsets[1] += this.options.offset;
 var max = window.innerHeight ? 
 window.height - window.innerHeight :
 document.body.scrollHeight - 
 (document.documentElement.clientHeight ? 
 document.documentElement.clientHeight : document.body.clientHeight);
 this.scrollStart = Position.deltaY;
 this.delta = (offsets[1] > max ? max : offsets[1]) - this.scrollStart;
 },
 update: function(position) {
 Position.prepare();
 window.scrollTo(Position.deltaX, 
 this.scrollStart + (position*this.delta));
 }
});

/* ------------- combination effects ------------- */

Effect.Fade = function(element) {
 element = $(element);
 var oldOpacity = element.getInlineOpacity();
 var options = Object.extend({
 from: element.getOpacity() || 1.0,
 to: 0.0,
 afterFinishInternal: function(effect) { 
 if(effect.options.to!=0) return;
 effect.element.hide().setStyle({opacity: oldOpacity}); 
 }}, arguments[1] || {});
 return new Effect.Opacity(element,options);
}

Effect.Appear = function(element) {
 element = $(element);
 var options = Object.extend({
 from: (element.getStyle('display') == 'none' ? 0.0 : element.getOpacity() || 0.0),
 to: 1.0,
 // force Safari to render floated elements properly
 afterFinishInternal: function(effect) {
 effect.element.forceRerendering();
 },
 beforeSetup: function(effect) {
 effect.element.setOpacity(effect.options.from).show(); 
 }}, arguments[1] || {});
 return new Effect.Opacity(element,options);
}

Effect.Puff = function(element) {
 element = $(element);
 var oldStyle = { 
 opacity: element.getInlineOpacity(), 
 position: element.getStyle('position'),
 top: element.style.top,
 left: element.style.left,
 width: element.style.width,
 height: element.style.height
 };
 return new Effect.Parallel(
 [ new Effect.Scale(element, 200, 
 { sync: true, scaleFromCenter: true, scaleContent: true, restoreAfterFinish: true }), 
 new Effect.Opacity(element, { sync: true, to: 0.0 } ) ], 
 Object.extend({ duration: 1.0, 
 beforeSetupInternal: function(effect) {
 Position.absolutize(effect.effects[0].element)
 },
 afterFinishInternal: function(effect) {
 effect.effects[0].element.hide().setStyle(oldStyle); }
 }, arguments[1] || {})
 );
}

Effect.BlindUp = function(element) {
 element = $(element);
 element.makeClipping();
 return new Effect.Scale(element, 0,
 Object.extend({ scaleContent: false, 
 scaleX: false, 
 restoreAfterFinish: true,
 afterFinishInternal: function(effect) {
 effect.element.hide().undoClipping();
 } 
 }, arguments[1] || {})
 );
}

Effect.BlindDown = function(element) {
 element = $(element);
 var elementDimensions = element.getDimensions();
 return new Effect.Scale(element, 100, Object.extend({ 
 scaleContent: false, 
 scaleX: false,
 scaleFrom: 0,
 scaleMode: {originalHeight: elementDimensions.height, originalWidth: elementDimensions.width},
 restoreAfterFinish: true,
 afterSetup: function(effect) {
 effect.element.makeClipping().setStyle({height: '0px'}).show(); 
 }, 
 afterFinishInternal: function(effect) {
 effect.element.undoClipping();
 }
 }, arguments[1] || {}));
}

Effect.SwitchOff = function(element) {
 element = $(element);
 var oldOpacity = element.getInlineOpacity();
 return new Effect.Appear(element, Object.extend({
 duration: 0.4,
 from: 0,
 transition: Effect.Transitions.flicker,
 afterFinishInternal: function(effect) {
 new Effect.Scale(effect.element, 1, { 
 duration: 0.3, scaleFromCenter: true,
 scaleX: false, scaleContent: false, restoreAfterFinish: true,
 beforeSetup: function(effect) { 
 effect.element.makePositioned().makeClipping();
 },
 afterFinishInternal: function(effect) {
 effect.element.hide().undoClipping().undoPositioned().setStyle({opacity: oldOpacity});
 }
 })
 }
 }, arguments[1] || {}));
}

Effect.DropOut = function(element) {
 element = $(element);
 var oldStyle = {
 top: element.getStyle('top'),
 left: element.getStyle('left'),
 opacity: element.getInlineOpacity() };
 return new Effect.Parallel(
 [ new Effect.Move(element, {x: 0, y: 100, sync: true }), 
 new Effect.Opacity(element, { sync: true, to: 0.0 }) ],
 Object.extend(
 { duration: 0.5,
 beforeSetup: function(effect) {
 effect.effects[0].element.makePositioned(); 
 },
 afterFinishInternal: function(effect) {
 effect.effects[0].element.hide().undoPositioned().setStyle(oldStyle);
 } 
 }, arguments[1] || {}));
}

Effect.Shake = function(element) {
 element = $(element);
 var oldStyle = {
 top: element.getStyle('top'),
 left: element.getStyle('left') };
 return new Effect.Move(element, 
 { x: 20, y: 0, duration: 0.05, afterFinishInternal: function(effect) {
 new Effect.Move(effect.element,
 { x: -40, y: 0, duration: 0.1, afterFinishInternal: function(effect) {
 new Effect.Move(effect.element,
 { x: 40, y: 0, duration: 0.1, afterFinishInternal: function(effect) {
 new Effect.Move(effect.element,
 { x: -40, y: 0, duration: 0.1, afterFinishInternal: function(effect) {
 new Effect.Move(effect.element,
 { x: 40, y: 0, duration: 0.1, afterFinishInternal: function(effect) {
 new Effect.Move(effect.element,
 { x: -20, y: 0, duration: 0.05, afterFinishInternal: function(effect) {
 effect.element.undoPositioned().setStyle(oldStyle);
 }}) }}) }}) }}) }}) }});
}

Effect.SlideDown = function(element) {
 element = $(element).cleanWhitespace();
 // SlideDown need to have the content of the element wrapped in a container element with fixed height!
 var oldInnerBottom = element.down().getStyle('bottom');
 var elementDimensions = element.getDimensions();
 return new Effect.Scale(element, 100, Object.extend({ 
 scaleContent: false, 
 scaleX: false, 
 scaleFrom: window.opera ? 0 : 1,
 scaleMode: {originalHeight: elementDimensions.height, originalWidth: elementDimensions.width},
 restoreAfterFinish: true,
 afterSetup: function(effect) {
 effect.element.makePositioned();
 effect.element.down().makePositioned();
 if(window.opera) effect.element.setStyle({top: ''});
 effect.element.makeClipping().setStyle({height: '0px'}).show(); 
 },
 afterUpdateInternal: function(effect) {
 effect.element.down().setStyle({bottom:
 (effect.dims[0] - effect.element.clientHeight) + 'px' }); 
 },
 afterFinishInternal: function(effect) {
 effect.element.undoClipping().undoPositioned();
 effect.element.down().undoPositioned().setStyle({bottom: oldInnerBottom}); }
 }, arguments[1] || {})
 );
}

Effect.SlideUp = function(element) {
 element = $(element).cleanWhitespace();
 var oldInnerBottom = element.down().getStyle('bottom');
 return new Effect.Scale(element, window.opera ? 0 : 1,
 Object.extend({ scaleContent: false, 
 scaleX: false, 
 scaleMode: 'box',
 scaleFrom: 100,
 restoreAfterFinish: true,
 beforeStartInternal: function(effect) {
 effect.element.makePositioned();
 effect.element.down().makePositioned();
 if(window.opera) effect.element.setStyle({top: ''});
 effect.element.makeClipping().show();
 }, 
 afterUpdateInternal: function(effect) {
 effect.element.down().setStyle({bottom:
 (effect.dims[0] - effect.element.clientHeight) + 'px' });
 },
 afterFinishInternal: function(effect) {
 effect.element.hide().undoClipping().undoPositioned().setStyle({bottom: oldInnerBottom});
 effect.element.down().undoPositioned();
 }
 }, arguments[1] || {})
 );
}

// Bug in opera makes the TD containing this element expand for a instance after finish 
Effect.Squish = function(element) {
 return new Effect.Scale(element, window.opera ? 1 : 0, { 
 restoreAfterFinish: true,
 beforeSetup: function(effect) {
 effect.element.makeClipping(); 
 }, 
 afterFinishInternal: function(effect) {
 effect.element.hide().undoClipping(); 
 }
 });
}

Effect.Grow = function(element) {
 element = $(element);
 var options = Object.extend({
 direction: 'center',
 moveTransition: Effect.Transitions.sinoidal,
 scaleTransition: Effect.Transitions.sinoidal,
 opacityTransition: Effect.Transitions.full
 }, arguments[1] || {});
 var oldStyle = {
 top: element.style.top,
 left: element.style.left,
 height: element.style.height,
 width: element.style.width,
 opacity: element.getInlineOpacity() };

 var dims = element.getDimensions(); 
 var initialMoveX, initialMoveY;
 var moveX, moveY;
 
 switch (options.direction) {
 case 'top-left':
 initialMoveX = initialMoveY = moveX = moveY = 0; 
 break;
 case 'top-right':
 initialMoveX = dims.width;
 initialMoveY = moveY = 0;
 moveX = -dims.width;
 break;
 case 'bottom-left':
 initialMoveX = moveX = 0;
 initialMoveY = dims.height;
 moveY = -dims.height;
 break;
 case 'bottom-right':
 initialMoveX = dims.width;
 initialMoveY = dims.height;
 moveX = -dims.width;
 moveY = -dims.height;
 break;
 case 'center':
 initialMoveX = dims.width / 2;
 initialMoveY = dims.height / 2;
 moveX = -dims.width / 2;
 moveY = -dims.height / 2;
 break;
 }
 
 return new Effect.Move(element, {
 x: initialMoveX,
 y: initialMoveY,
 duration: 0.01, 
 beforeSetup: function(effect) {
 effect.element.hide().makeClipping().makePositioned();
 },
 afterFinishInternal: function(effect) {
 new Effect.Parallel(
 [ new Effect.Opacity(effect.element, { sync: true, to: 1.0, from: 0.0, transition: options.opacityTransition }),
 new Effect.Move(effect.element, { x: moveX, y: moveY, sync: true, transition: options.moveTransition }),
 new Effect.Scale(effect.element, 100, {
 scaleMode: { originalHeight: dims.height, originalWidth: dims.width }, 
 sync: true, scaleFrom: window.opera ? 1 : 0, transition: options.scaleTransition, restoreAfterFinish: true})
 ], Object.extend({
 beforeSetup: function(effect) {
 effect.effects[0].element.setStyle({height: '0px'}).show(); 
 },
 afterFinishInternal: function(effect) {
 effect.effects[0].element.undoClipping().undoPositioned().setStyle(oldStyle); 
 }
 }, options)
 )
 }
 });
}

Effect.Shrink = function(element) {
 element = $(element);
 var options = Object.extend({
 direction: 'center',
 moveTransition: Effect.Transitions.sinoidal,
 scaleTransition: Effect.Transitions.sinoidal,
 opacityTransition: Effect.Transitions.none
 }, arguments[1] || {});
 var oldStyle = {
 top: element.style.top,
 left: element.style.left,
 height: element.style.height,
 width: element.style.width,
 opacity: element.getInlineOpacity() };

 var dims = element.getDimensions();
 var moveX, moveY;
 
 switch (options.direction) {
 case 'top-left':
 moveX = moveY = 0;
 break;
 case 'top-right':
 moveX = dims.width;
 moveY = 0;
 break;
 case 'bottom-left':
 moveX = 0;
 moveY = dims.height;
 break;
 case 'bottom-right':
 moveX = dims.width;
 moveY = dims.height;
 break;
 case 'center': 
 moveX = dims.width / 2;
 moveY = dims.height / 2;
 break;
 }
 
 return new Effect.Parallel(
 [ new Effect.Opacity(element, { sync: true, to: 0.0, from: 1.0, transition: options.opacityTransition }),
 new Effect.Scale(element, window.opera ? 1 : 0, { sync: true, transition: options.scaleTransition, restoreAfterFinish: true}),
 new Effect.Move(element, { x: moveX, y: moveY, sync: true, transition: options.moveTransition })
 ], Object.extend({ 
 beforeStartInternal: function(effect) {
 effect.effects[0].element.makePositioned().makeClipping(); 
 },
 afterFinishInternal: function(effect) {
 effect.effects[0].element.hide().undoClipping().undoPositioned().setStyle(oldStyle); }
 }, options)
 );
}

Effect.Pulsate = function(element) {
 element = $(element);
 var options = arguments[1] || {};
 var oldOpacity = element.getInlineOpacity();
 var transition = options.transition || Effect.Transitions.sinoidal;
 var reverser = function(pos){ return transition(1-Effect.Transitions.pulse(pos, options.pulses)) };
 reverser.bind(transition);
 return new Effect.Opacity(element, 
 Object.extend(Object.extend({ duration: 2.0, from: 0,
 afterFinishInternal: function(effect) { effect.element.setStyle({opacity: oldOpacity}); }
 }, options), {transition: reverser}));
}

Effect.Fold = function(element) {
 element = $(element);
 var oldStyle = {
 top: element.style.top,
 left: element.style.left,
 width: element.style.width,
 height: element.style.height };
 element.makeClipping();
 return new Effect.Scale(element, 5, Object.extend({ 
 scaleContent: false,
 scaleX: false,
 afterFinishInternal: function(effect) {
 new Effect.Scale(element, 1, { 
 scaleContent: false, 
 scaleY: false,
 afterFinishInternal: function(effect) {
 effect.element.hide().undoClipping().setStyle(oldStyle);
 } });
 }}, arguments[1] || {}));
};

Effect.Morph = Class.create();
Object.extend(Object.extend(Effect.Morph.prototype, Effect.Base.prototype), {
 initialize: function(element) {
 this.element = $(element);
 if(!this.element) throw(Effect._elementDoesNotExistError);
 var options = Object.extend({
 style: {}
 }, arguments[1] || {});
 if (typeof options.style == 'string') {
 if(options.style.indexOf(':') == -1) {
 var cssText = '', selector = '.' + options.style;
 $A(document.styleSheets).reverse().each(function(styleSheet) {
 if (styleSheet.cssRules) cssRules = styleSheet.cssRules;
 else if (styleSheet.rules) cssRules = styleSheet.rules;
 $A(cssRules).reverse().each(function(rule) {
 if (selector == rule.selectorText) {
 cssText = rule.style.cssText;
 throw $break;
 }
 });
 if (cssText) throw $break;
 });
 this.style = cssText.parseStyle();
 options.afterFinishInternal = function(effect){
 effect.element.addClassName(effect.options.style);
 effect.transforms.each(function(transform) {
 if(transform.style != 'opacity')
 effect.element.style[transform.style] = '';
 });
 }
 } else this.style = options.style.parseStyle();
 } else this.style = $H(options.style)
 this.start(options);
 },
 setup: function(){
 function parseColor(color){
 if(!color || ['rgba(0, 0, 0, 0)','transparent'].include(color)) color = '#ffffff';
 color = color.parseColor();
 return $R(0,2).map(function(i){
 return parseInt( color.slice(i*2+1,i*2+3), 16 ) 
 });
 }
 this.transforms = this.style.map(function(pair){
 var property = pair[0], value = pair[1], unit = null;

 if(value.parseColor('#zzzzzz') != '#zzzzzz') {
 value = value.parseColor();
 unit = 'color';
 } else if(property == 'opacity') {
 value = parseFloat(value);
 if(Prototype.Browser.IE && (!this.element.currentStyle.hasLayout))
 this.element.setStyle({zoom: 1});
 } else if(Element.CSS_LENGTH.test(value)) {
 var components = value.match(/^([\+\-]?[0-9\.]+)(.*)$/);
 value = parseFloat(components[1]);
 unit = (components.length == 3) ? components[2] : null;
 }

 var originalValue = this.element.getStyle(property);
 return { 
 style: property.camelize(), 
 originalValue: unit=='color' ? parseColor(originalValue) : parseFloat(originalValue || 0), 
 targetValue: unit=='color' ? parseColor(value) : value,
 unit: unit
 };
 }.bind(this)).reject(function(transform){
 return (
 (transform.originalValue == transform.targetValue) ||
 (
 transform.unit != 'color' &&
 (isNaN(transform.originalValue) || isNaN(transform.targetValue))
 )
 )
 });
 },
 update: function(position) {
 var style = {}, transform, i = this.transforms.length;
 while(i--)
 style[(transform = this.transforms[i]).style] = 
 transform.unit=='color' ? '#'+
 (Math.round(transform.originalValue[0]+
 (transform.targetValue[0]-transform.originalValue[0])*position)).toColorPart() +
 (Math.round(transform.originalValue[1]+
 (transform.targetValue[1]-transform.originalValue[1])*position)).toColorPart() +
 (Math.round(transform.originalValue[2]+
 (transform.targetValue[2]-transform.originalValue[2])*position)).toColorPart() :
 transform.originalValue + Math.round(
 ((transform.targetValue - transform.originalValue) * position) * 1000)/1000 + transform.unit;
 this.element.setStyle(style, true);
 }
});

Effect.Transform = Class.create();
Object.extend(Effect.Transform.prototype, {
 initialize: function(tracks){
 this.tracks = [];
 this.options = arguments[1] || {};
 this.addTracks(tracks);
 },
 addTracks: function(tracks){
 tracks.each(function(track){
 var data = $H(track).values().first();
 this.tracks.push($H({
 ids: $H(track).keys().first(),
 effect: Effect.Morph,
 options: { style: data }
 }));
 }.bind(this));
 return this;
 },
 play: function(){
 return new Effect.Parallel(
 this.tracks.map(function(track){
 var elements = [$(track.ids) || $$(track.ids)].flatten();
 return elements.map(function(e){ return new track.effect(e, Object.extend({ sync:true }, track.options)) });
 }).flatten(),
 this.options
 );
 }
});

Element.CSS_PROPERTIES = $w(
 'backgroundColor backgroundPosition borderBottomColor borderBottomStyle ' + 
 'borderBottomWidth borderLeftColor borderLeftStyle borderLeftWidth ' +
 'borderRightColor borderRightStyle borderRightWidth borderSpacing ' +
 'borderTopColor borderTopStyle borderTopWidth bottom clip color ' +
 'fontSize fontWeight height left letterSpacing lineHeight ' +
 'marginBottom marginLeft marginRight marginTop markerOffset maxHeight '+
 'maxWidth minHeight minWidth opacity outlineColor outlineOffset ' +
 'outlineWidth paddingBottom paddingLeft paddingRight paddingTop ' +
 'right textIndent top width wordSpacing zIndex');
 
Element.CSS_LENGTH = /^(([\+\-]?[0-9\.]+)(em|ex|px|in|cm|mm|pt|pc|\%))|0$/;

String.prototype.parseStyle = function(){
 var element = document.createElement('div');
 element.innerHTML = '<div style="' + this + '"></div>';
 var style = element.childNodes[0].style, styleRules = $H();
 
 Element.CSS_PROPERTIES.each(function(property){
 if(style[property]) styleRules[property] = style[property]; 
 });
 if(Prototype.Browser.IE && this.indexOf('opacity') > -1) {
 styleRules.opacity = this.match(/opacity:\s*((?:0|1)?(?:\.\d*)?)/)[1];
 }
 return styleRules;
};

Element.morph = function(element, style) {
 new Effect.Morph(element, Object.extend({ style: style }, arguments[2] || {}));
 return element;
};

['getInlineOpacity','forceRerendering','setContentZoom',
 'collectTextNodes','collectTextNodesIgnoreClass','morph'].each( 
 function(f) { Element.Methods[f] = Element[f]; }
);

Element.Methods.visualEffect = function(element, effect, options) {
 s = effect.dasherize().camelize();
 effect_class = s.charAt(0).toUpperCase() + s.substring(1);
 new Effect[effect_class](element, options);
 return $(element);
};

Element.addMethods();
// script.aculo.us dragdrop.js v1.7.1_beta3, Fri May 25 17:19:41 +0200 2007

// Copyright (c) 2005-2007 Thomas Fuchs (http://script.aculo.us, http://mir.aculo.us)
// (c) 2005-2007 Sammi Williams (http://www.oriontransfer.co.nz, sammi@oriontransfer.co.nz)
//
// script.aculo.us is freely distributable under the terms of an MIT-style license.
// For details, see the script.aculo.us web site: http://script.aculo.us/

if(typeof Effect == 'undefined')
 throw("dragdrop.js requires including script.aculo.us' effects.js library");

var Droppables = {
 drops: [],

 remove: function(element) {
 this.drops = this.drops.reject(function(d) { return d.element==$(element) });
 },

 add: function(element) {
 element = $(element);
 var options = Object.extend({
 greedy: true,
 hoverclass: null,
 tree: false
 }, arguments[1] || {});

 // cache containers
 if(options.containment) {
 options._containers = [];
 var containment = options.containment;
 if((typeof containment == 'object') &&
 (containment.constructor == Array)) {
 containment.each( function(c) { options._containers.push($(c)) });
 } else {
 options._containers.push($(containment));
 }
 }

 if(options.accept) options.accept = [options.accept].flatten();

 Element.makePositioned(element); // fix IE
 options.element = element;

 this.drops.push(options);
 },

 findDeepestChild: function(drops) {
 deepest = drops[0];

 for (i = 1; i < drops.length; ++i)
 if (Element.isParent(drops[i].element, deepest.element))
 deepest = drops[i];

 return deepest;
 },

 isContained: function(element, drop) {
 var containmentNode;
 if(drop.tree) {
 containmentNode = element.treeNode;
 } else {
 containmentNode = element.parentNode;
 }
 return drop._containers.detect(function(c) { return containmentNode == c });
 },

 isAffected: function(point, element, drop) {
 return (
 (drop.element!=element) &&
 ((!drop._containers) ||
 this.isContained(element, drop)) &&
 ((!drop.accept) ||
 (Element.classNames(element).detect(
 function(v) { return drop.accept.include(v) } ) )) &&
 Position.within(drop.element, point[0], point[1]) );
 },

 deactivate: function(drop) {
 if(drop.hoverclass)
 Element.removeClassName(drop.element, drop.hoverclass);
 this.last_active = null;
 },

 activate: function(drop) {
 if(drop.hoverclass)
 Element.addClassName(drop.element, drop.hoverclass);
 this.last_active = drop;
 },

 show: function(point, element) {
 if(!this.drops.length) return;
 var affected = [];

 if(this.last_active) this.deactivate(this.last_active);
 this.drops.each( function(drop) {
 if(Droppables.isAffected(point, element, drop))
 affected.push(drop);
 });

 if(affected.length>0) {
 drop = Droppables.findDeepestChild(affected);
 Position.within(drop.element, point[0], point[1]);
 if(drop.onHover)
 drop.onHover(element, drop.element, Position.overlap(drop.overlap, drop.element));

 Droppables.activate(drop);
 }
 },

 fire: function(event, element) {
 if(!this.last_active) return;
 Position.prepare();

 if (this.isAffected([Event.pointerX(event), Event.pointerY(event)], element, this.last_active))
 if (this.last_active.onDrop) {
 this.last_active.onDrop(element, this.last_active.element, event);
 return true;
 }
 },

 reset: function() {
 if(this.last_active)
 this.deactivate(this.last_active);
 }
}

var Draggables = {
 drags: [],
 observers: [],

 register: function(draggable) {
 if(this.drags.length == 0) {
 this.eventMouseUp = this.endDrag.bindAsEventListener(this);
 this.eventMouseMove = this.updateDrag.bindAsEventListener(this);
 this.eventKeypress = this.keyPress.bindAsEventListener(this);

 Event.observe(document, "mouseup", this.eventMouseUp);
 Event.observe(draggable.element, "mousemove", this.eventMouseMove);
 Event.observe(document, "keypress", this.eventKeypress);
 }
 this.drags.push(draggable);
 },

 unregister: function(draggable) {
 this.drags = this.drags.reject(function(d) { return d==draggable });
 if(this.drags.length == 0) {
 Event.stopObserving(document, "mouseup", this.eventMouseUp);
 Event.stopObserving(draggable.element, "mousemove", this.eventMouseMove);
 Event.stopObserving(document, "keypress", this.eventKeypress);
 }
 },

 activate: function(draggable) {
 if(draggable.options.delay) {
 this._timeout = setTimeout(function() {
 Draggables._timeout = null;
 window.focus();
 Draggables.activeDraggable = draggable;
 }.bind(this), draggable.options.delay);
 } else {
 window.focus(); // allows keypress events if window isn't currently focused, fails for Safari
 this.activeDraggable = draggable;
 }
 },

 deactivate: function() {
 this.activeDraggable = null;
 },

 updateDrag: function(event) {
 if(!this.activeDraggable) return;
 var pointer = [Event.pointerX(event), Event.pointerY(event)];
 // Mozilla-based browsers fire successive mousemove events with
 // the same coordinates, prevent needless redrawing (moz bug?)
 if(this._lastPointer && (this._lastPointer.inspect() == pointer.inspect())) return;
 this._lastPointer = pointer;

 this.activeDraggable.updateDrag(event, pointer);
 },

 endDrag: function(event) {
 if(this._timeout) {
 clearTimeout(this._timeout);
 this._timeout = null;
 }
 if(!this.activeDraggable) return;
 this._lastPointer = null;
 this.activeDraggable.endDrag(event);
 this.activeDraggable = null;
 },

 keyPress: function(event) {
 if(this.activeDraggable)
 this.activeDraggable.keyPress(event);
 },

 addObserver: function(observer) {
 this.observers.push(observer);
 this._cacheObserverCallbacks();
 },

 removeObserver: function(element) { // element instead of observer fixes mem leaks
 this.observers = this.observers.reject( function(o) { return o.element==element });
 this._cacheObserverCallbacks();
 },

 notify: function(eventName, draggable, event) { // 'onStart', 'onEnd', 'onDrag'
 if(this[eventName+'Count'] > 0)
 this.observers.each( function(o) {
 if(o[eventName]) o[eventName](eventName, draggable, event);
 });
 if(draggable.options[eventName]) draggable.options[eventName](draggable, event);
 },

 _cacheObserverCallbacks: function() {
 ['onStart','onEnd','onDrag'].each( function(eventName) {
 Draggables[eventName+'Count'] = Draggables.observers.select(
 function(o) { return o[eventName]; }
 ).length;
 });
 }
}

/*--------------------------------------------------------------------------*/

var Draggable = Class.create();
Draggable._dragging = {};

Draggable.prototype = {
 initialize: function(element) {
 var defaults = {
 handle: false,
 reverteffect: function(element, top_offset, left_offset) {
 var dur = Math.sqrt(Math.abs(top_offset^2)+Math.abs(left_offset^2))*0.02;
 new Effect.Move(element, { x: -left_offset, y: -top_offset, duration: dur,
 queue: {scope:'_draggable', position:'end'}
 });
 },
 endeffect: function(element) {
 var toOpacity = typeof element._opacity == 'number' ? element._opacity : 1.0;
 new Effect.Opacity(element, {duration:0.2, from:0.7, to:toOpacity,
 queue: {scope:'_draggable', position:'end'},
 afterFinish: function(){
 Draggable._dragging[element] = false
 }
 });
 },
 zindex: 1000,
 revert: false,
 quiet: false,
 scroll: false,
 scrollSensitivity: 20,
 scrollSpeed: 15,
 snap: false, // false, or xy or [x,y] or function(x,y){ return [x,y] }
 delay: 0
 };

 if(!arguments[1] || typeof arguments[1].endeffect == 'undefined')
 Object.extend(defaults, {
 starteffect: function(element) {
 element._opacity = Element.getOpacity(element);
 Draggable._dragging[element] = true;
 new Effect.Opacity(element, {duration:0.2, from:element._opacity, to:0.7});
 }
 });

 var options = Object.extend(defaults, arguments[1] || {});

 this.element = $(element);

 if(options.handle && (typeof options.handle == 'string'))
 this.handle = this.element.down('.'+options.handle, 0);

 if(!this.handle) this.handle = $(options.handle);
 if(!this.handle) this.handle = this.element;

 if(options.scroll && !options.scroll.scrollTo && !options.scroll.outerHTML) {
 options.scroll = $(options.scroll);
 this._isScrollChild = Element.childOf(this.element, options.scroll);
 }

 Element.makePositioned(this.element); // fix IE

 this.delta = this.currentDelta();
 this.options = options;
 this.dragging = false;

 this.eventMouseDown = this.initDrag.bindAsEventListener(this);
 Event.observe(this.handle, "mousedown", this.eventMouseDown);

 Draggables.register(this);
 },

 destroy: function() {
 Event.stopObserving(this.handle, "mousedown", this.eventMouseDown);
 Draggables.unregister(this);
 },

 currentDelta: function() {
 return([
 parseInt(Element.getStyle(this.element,'left') || '0'),
 parseInt(Element.getStyle(this.element,'top') || '0')]);
 },

 initDrag: function(event) {
 if(typeof Draggable._dragging[this.element] != 'undefined' &&
 Draggable._dragging[this.element]) return;
 if(Event.isLeftClick(event)) {
 // abort on form elements, fixes a Firefox issue
 var src = Event.element(event);
 if((tag_name = src.tagName.toUpperCase()) && (
 tag_name=='INPUT' ||
 tag_name=='SELECT' ||
 tag_name=='OPTION' ||
 tag_name=='BUTTON' ||
 tag_name=='TEXTAREA')) return;

 var pointer = [Event.pointerX(event), Event.pointerY(event)];
 var pos = Position.cumulativeOffset(this.element);
 this.offset = [0,1].map( function(i) { return (pointer[i] - pos[i]) });

 Draggables.activate(this);
 Event.stop(event);
 }
 },

 startDrag: function(event) {
 this.dragging = true;

 if(this.options.zindex) {
 this.originalZ = parseInt(Element.getStyle(this.element,'z-index') || 0);
 this.element.style.zIndex = this.options.zindex;
 }

 if(this.options.ghosting) {
 this._clone = this.element.cloneNode(true);
 Position.absolutize(this.element);
 this.element.parentNode.insertBefore(this._clone, this.element);
 }

 if(this.options.scroll) {
 if (this.options.scroll == window) {
 var where = this._getWindowScroll(this.options.scroll);
 this.originalScrollLeft = where.left;
 this.originalScrollTop = where.top;
 } else {
 this.originalScrollLeft = this.options.scroll.scrollLeft;
 this.originalScrollTop = this.options.scroll.scrollTop;
 }
 }

 Draggables.notify('onStart', this, event);

 if(this.options.starteffect) this.options.starteffect(this.element);
 },

 updateDrag: function(event, pointer) {
 if(!this.dragging) this.startDrag(event);

 if(!this.options.quiet){
 Position.prepare();
 Droppables.show(pointer, this.element);
 }

 Draggables.notify('onDrag', this, event);

 this.draw(pointer);
 if(this.options.change) this.options.change(this);

 if(this.options.scroll) {
 this.stopScrolling();

 var p;
 if (this.options.scroll == window) {
 with(this._getWindowScroll(this.options.scroll)) { p = [ left, top, left+width, top+height ]; }
 } else {
 p = Position.page(this.options.scroll);
 p[0] += this.options.scroll.scrollLeft + Position.deltaX;
 p[1] += this.options.scroll.scrollTop + Position.deltaY;
 p.push(p[0]+this.options.scroll.offsetWidth);
 p.push(p[1]+this.options.scroll.offsetHeight);
 }
 var speed = [0,0];
 if(pointer[0] < (p[0]+this.options.scrollSensitivity)) speed[0] = pointer[0]-(p[0]+this.options.scrollSensitivity);
 if(pointer[1] < (p[1]+this.options.scrollSensitivity)) speed[1] = pointer[1]-(p[1]+this.options.scrollSensitivity);
 if(pointer[0] > (p[2]-this.options.scrollSensitivity)) speed[0] = pointer[0]-(p[2]-this.options.scrollSensitivity);
 if(pointer[1] > (p[3]-this.options.scrollSensitivity)) speed[1] = pointer[1]-(p[3]-this.options.scrollSensitivity);
 this.startScrolling(speed);
 }

 // fix AppleWebKit rendering
 if(Prototype.Browser.WebKit) window.scrollBy(0,0);

 Event.stop(event);
 },

 finishDrag: function(event, success) {
 this.dragging = false;

 if(this.options.quiet){
 Position.prepare();
 var pointer = [Event.pointerX(event), Event.pointerY(event)];
 Droppables.show(pointer, this.element);
 }

 if(this.options.ghosting) {
 Position.relativize(this.element);
 Element.remove(this._clone);
 this._clone = null;
 }

 var dropped = false;
 if(success) {
 dropped = Droppables.fire(event, this.element);
 if (!dropped) dropped = false;
 }
 if(dropped && this.options.onDropped) this.options.onDropped(this.element);
 Draggables.notify('onEnd', this, event);

 var revert = this.options.revert;
 if(revert && typeof revert == 'function') revert = revert(this.element);

 var d = this.currentDelta();
 if(revert && this.options.reverteffect) {
 if (dropped == 0 || revert != 'failure')
 this.options.reverteffect(this.element,
 d[1]-this.delta[1], d[0]-this.delta[0]);
 } else {
 this.delta = d;
 }

 if(this.options.zindex)
 this.element.style.zIndex = this.originalZ;

 if(this.options.endeffect)
 this.options.endeffect(this.element);

 Draggables.deactivate(this);
 Droppables.reset();
 },

 keyPress: function(event) {
 if(event.keyCode!=Event.KEY_ESC) return;
 this.finishDrag(event, false);
 Event.stop(event);
 },

 endDrag: function(event) {
 if(!this.dragging) return;
 this.stopScrolling();
 this.finishDrag(event, true);
 Event.stop(event);
 },

 draw: function(point) {
 var pos = Position.cumulativeOffset(this.element);
 if(this.options.ghosting) {
 var r = Position.realOffset(this.element);
 pos[0] += r[0] - Position.deltaX; pos[1] += r[1] - Position.deltaY;
 }

 var d = this.currentDelta();
 pos[0] -= d[0]; pos[1] -= d[1];

 if(this.options.scroll && (this.options.scroll != window && this._isScrollChild)) {
 pos[0] -= this.options.scroll.scrollLeft-this.originalScrollLeft;
 pos[1] -= this.options.scroll.scrollTop-this.originalScrollTop;
 }

 var p = [0,1].map(function(i){
 return (point[i]-pos[i]-this.offset[i])
 }.bind(this));

 if(this.options.snap) {
 if(typeof this.options.snap == 'function') {
 p = this.options.snap(p[0],p[1],this);
 } else {
 if(this.options.snap instanceof Array) {
 p = p.map( function(v, i) {
 return Math.round(v/this.options.snap[i])*this.options.snap[i] }.bind(this))
 } else {
 p = p.map( function(v) {
 return Math.round(v/this.options.snap)*this.options.snap }.bind(this))
 }
 }}

 var style = this.element.style;
 if((!this.options.constraint) || (this.options.constraint=='horizontal'))
 style.left = p[0] + "px";
 if((!this.options.constraint) || (this.options.constraint=='vertical'))
 style.top = p[1] + "px";

 if(style.visibility=="hidden") style.visibility = ""; // fix gecko rendering
 },

 stopScrolling: function() {
 if(this.scrollInterval) {
 clearInterval(this.scrollInterval);
 this.scrollInterval = null;
 Draggables._lastScrollPointer = null;
 }
 },

 startScrolling: function(speed) {
 if(!(speed[0] || speed[1])) return;
 this.scrollSpeed = [speed[0]*this.options.scrollSpeed,speed[1]*this.options.scrollSpeed];
 this.lastScrolled = new Date();
 this.scrollInterval = setInterval(this.scroll.bind(this), 10);
 },

 scroll: function() {
 var current = new Date();
 var delta = current - this.lastScrolled;
 this.lastScrolled = current;
 if(this.options.scroll == window) {
 with (this._getWindowScroll(this.options.scroll)) {
 if (this.scrollSpeed[0] || this.scrollSpeed[1]) {
 var d = delta / 1000;
 this.options.scroll.scrollTo( left + d*this.scrollSpeed[0], top + d*this.scrollSpeed[1] );
 }
 }
 } else {
 this.options.scroll.scrollLeft += this.scrollSpeed[0] * delta / 1000;
 this.options.scroll.scrollTop += this.scrollSpeed[1] * delta / 1000;
 }

 Position.prepare();
 Droppables.show(Draggables._lastPointer, this.element);
 Draggables.notify('onDrag', this);
 if (this._isScrollChild) {
 Draggables._lastScrollPointer = Draggables._lastScrollPointer || $A(Draggables._lastPointer);
 Draggables._lastScrollPointer[0] += this.scrollSpeed[0] * delta / 1000;
 Draggables._lastScrollPointer[1] += this.scrollSpeed[1] * delta / 1000;
 if (Draggables._lastScrollPointer[0] < 0)
 Draggables._lastScrollPointer[0] = 0;
 if (Draggables._lastScrollPointer[1] < 0)
 Draggables._lastScrollPointer[1] = 0;
 this.draw(Draggables._lastScrollPointer);
 }

 if(this.options.change) this.options.change(this);
 },

 _getWindowScroll: function(w) {
 var T, L, W, H;
 with (w.document) {
 if (w.document.documentElement && documentElement.scrollTop) {
 T = documentElement.scrollTop;
 L = documentElement.scrollLeft;
 } else if (w.document.body) {
 T = body.scrollTop;
 L = body.scrollLeft;
 }
 if (w.innerWidth) {
 W = w.innerWidth;
 H = w.innerHeight;
 } else if (w.document.documentElement && documentElement.clientWidth) {
 W = documentElement.clientWidth;
 H = documentElement.clientHeight;
 } else {
 W = body.offsetWidth;
 H = body.offsetHeight
 }
 }
 return { top: T, left: L, width: W, height: H };
 }
}

/*--------------------------------------------------------------------------*/

var SortableObserver = Class.create();
SortableObserver.prototype = {
 initialize: function(element, observer) {
 this.element = $(element);
 this.observer = observer;
 this.lastValue = Sortable.serialize(this.element);
 },

 onStart: function() {
 this.lastValue = Sortable.serialize(this.element);
 },

 onEnd: function() {
 Sortable.unmark();
 if(this.lastValue != Sortable.serialize(this.element))
 this.observer(this.element)
 }
}

var Sortable = {
 SERIALIZE_RULE: /^[^_\-](?:[A-Za-z0-9\-\_]*)[_](.*)$/,

 sortables: {},

 _findRootElement: function(element) {
 while (element.tagName.toUpperCase() != "BODY") {
 if(element.id && Sortable.sortables[element.id]) return element;
 element = element.parentNode;
 }
 },

 options: function(element) {
 element = Sortable._findRootElement($(element));
 if(!element) return;
 return Sortable.sortables[element.id];
 },

 destroy: function(element){
 var s = Sortable.options(element);

 if(s) {
 Draggables.removeObserver(s.element);
 s.droppables.each(function(d){ Droppables.remove(d) });
 s.draggables.invoke('destroy');

 delete Sortable.sortables[s.element.id];
 }
 },

 create: function(element) {
 element = $(element);
 var options = Object.extend({
 element: element,
 tag: 'li', // assumes li children, override with tag: 'tagname'
 dropOnEmpty: false,
 tree: false,
 treeTag: 'ul',
 overlap: 'vertical', // one of 'vertical', 'horizontal'
 constraint: 'vertical', // one of 'vertical', 'horizontal', false
 containment: element, // also takes array of elements (or id's); or false
 handle: false, // or a CSS class
 only: false,
 delay: 0,
 hoverclass: null,
 ghosting: false,
 quiet: false,
 scroll: false,
 scrollSensitivity: 20,
 scrollSpeed: 15,
 format: this.SERIALIZE_RULE,

 // these take arrays of elements or ids and can be
 // used for better initialization performance
 elements: false,
 handles: false,

 onChange: Prototype.emptyFunction,
 onUpdate: Prototype.emptyFunction
 }, arguments[1] || {});

 // clear any old sortable with same element
 this.destroy(element);

 // build options for the draggables
 var options_for_draggable = {
 revert: true,
 quiet: options.quiet,
 scroll: options.scroll,
 scrollSpeed: options.scrollSpeed,
 scrollSensitivity: options.scrollSensitivity,
 delay: options.delay,
 ghosting: options.ghosting,
 constraint: options.constraint,
 handle: options.handle };

 if(options.starteffect)
 options_for_draggable.starteffect = options.starteffect;

 if(options.reverteffect)
 options_for_draggable.reverteffect = options.reverteffect;
 else
 if(options.ghosting) options_for_draggable.reverteffect = function(element) {
 element.style.top = 0;
 element.style.left = 0;
 };

 if(options.endeffect)
 options_for_draggable.endeffect = options.endeffect;

 if(options.zindex)
 options_for_draggable.zindex = options.zindex;

 // build options for the droppables
 var options_for_droppable = {
 overlap: options.overlap,
 containment: options.containment,
 tree: options.tree,
 hoverclass: options.hoverclass,
 onHover: Sortable.onHover
 }

 var options_for_tree = {
 onHover: Sortable.onEmptyHover,
 overlap: options.overlap,
 containment: options.containment,
 hoverclass: options.hoverclass
 }

 // fix for gecko engine
 Element.cleanWhitespace(element);

 options.draggables = [];
 options.droppables = [];

 // drop on empty handling
 if(options.dropOnEmpty || options.tree) {
 Droppables.add(element, options_for_tree);
 options.droppables.push(element);
 }

 (options.elements || this.findElements(element, options) || []).each( function(e,i) {
 var handle = options.handles ? $(options.handles[i]) :
 (options.handle ? $(e).getElementsByClassName(options.handle)[0] : e);
 options.draggables.push(
 new Draggable(e, Object.extend(options_for_draggable, { handle: handle })));
 Droppables.add(e, options_for_droppable);
 if(options.tree) e.treeNode = element;
 options.droppables.push(e);
 });

 if(options.tree) {
 (Sortable.findTreeElements(element, options) || []).each( function(e) {
 Droppables.add(e, options_for_tree);
 e.treeNode = element;
 options.droppables.push(e);
 });
 }

 // keep reference
 this.sortables[element.id] = options;

 // for onupdate
 Draggables.addObserver(new SortableObserver(element, options.onUpdate));

 },

 // return all suitable-for-sortable elements in a guaranteed order
 findElements: function(element, options) {
 return Element.findChildren(
 element, options.only, options.tree ? true : false, options.tag);
 },

 findTreeElements: function(element, options) {
 return Element.findChildren(
 element, options.only, options.tree ? true : false, options.treeTag);
 },

 onHover: function(element, dropon, overlap) {
 if(Element.isParent(dropon, element)) return;

 if(overlap > .33 && overlap < .66 && Sortable.options(dropon).tree) {
 return;
 } else if(overlap>0.5) {
 Sortable.mark(dropon, 'before');
 if(dropon.previousSibling != element) {
 var oldParentNode = element.parentNode;
 element.style.visibility = "hidden"; // fix gecko rendering
 dropon.parentNode.insertBefore(element, dropon);
 if(dropon.parentNode!=oldParentNode)
 Sortable.options(oldParentNode).onChange(element);
 Sortable.options(dropon.parentNode).onChange(element);
 }
 } else {
 Sortable.mark(dropon, 'after');
 var nextElement = dropon.nextSibling || null;
 if(nextElement != element) {
 var oldParentNode = element.parentNode;
 element.style.visibility = "hidden"; // fix gecko rendering
 dropon.parentNode.insertBefore(element, nextElement);
 if(dropon.parentNode!=oldParentNode)
 Sortable.options(oldParentNode).onChange(element);
 Sortable.options(dropon.parentNode).onChange(element);
 }
 }
 },

 onEmptyHover: function(element, dropon, overlap) {
 var oldParentNode = element.parentNode;
 var droponOptions = Sortable.options(dropon);

 if(!Element.isParent(dropon, element)) {
 var index;

 var children = Sortable.findElements(dropon, {tag: droponOptions.tag, only: droponOptions.only});
 var child = null;

 if(children) {
 var offset = Element.offsetSize(dropon, droponOptions.overlap) * (1.0 - overlap);

 for (index = 0; index < children.length; index += 1) {
 if (offset - Element.offsetSize (children[index], droponOptions.overlap) >= 0) {
 offset -= Element.offsetSize (children[index], droponOptions.overlap);
 } else if (offset - (Element.offsetSize (children[index], droponOptions.overlap) / 2) >= 0) {
 child = index + 1 < children.length ? children[index + 1] : null;
 break;
 } else {
 child = children[index];
 break;
 }
 }
 }

 dropon.insertBefore(element, child);

 Sortable.options(oldParentNode).onChange(element);
 droponOptions.onChange(element);
 }
 },

 unmark: function() {
 if(Sortable._marker) Sortable._marker.hide();
 },

 mark: function(dropon, position) {
 // mark on ghosting only
 var sortable = Sortable.options(dropon.parentNode);
 if(sortable && !sortable.ghosting) return;

 if(!Sortable._marker) {
 Sortable._marker =
 ($('dropmarker') || Element.extend(document.createElement('DIV'))).
 hide().addClassName('dropmarker').setStyle({position:'absolute'});
 document.getElementsByTagName("body").item(0).appendChild(Sortable._marker);
 }
 var offsets = Position.cumulativeOffset(dropon);
 Sortable._marker.setStyle({left: offsets[0]+'px', top: offsets[1] + 'px'});

 if(position=='after')
 if(sortable.overlap == 'horizontal')
 Sortable._marker.setStyle({left: (offsets[0]+dropon.clientWidth) + 'px'});
 else
 Sortable._marker.setStyle({top: (offsets[1]+dropon.clientHeight) + 'px'});

 Sortable._marker.show();
 },

 _tree: function(element, options, parent) {
 var children = Sortable.findElements(element, options) || [];

 for (var i = 0; i < children.length; ++i) {
 var match = children[i].id.match(options.format);

 if (!match) continue;

 var child = {
 id: encodeURIComponent(match ? match[1] : null),
 element: element,
 parent: parent,
 children: [],
 position: parent.children.length,
 container: $(children[i]).down(options.treeTag)
 }

 /* Get the element containing the children and recurse over it */
 if (child.container)
 this._tree(child.container, options, child)

 parent.children.push (child);
 }

 return parent;
 },

 tree: function(element) {
 element = $(element);
 var sortableOptions = this.options(element);
 var options = Object.extend({
 tag: sortableOptions.tag,
 treeTag: sortableOptions.treeTag,
 only: sortableOptions.only,
 name: element.id,
 format: sortableOptions.format
 }, arguments[1] || {});

 var root = {
 id: null,
 parent: null,
 children: [],
 container: element,
 position: 0
 }

 return Sortable._tree(element, options, root);
 },

 /* Construct a [i] index for a particular node */
 _constructIndex: function(node) {
 var index = '';
 do {
 if (node.id) index = '[' + node.position + ']' + index;
 } while ((node = node.parent) != null);
 return index;
 },

 sequence: function(element) {
 element = $(element);
 var options = Object.extend(this.options(element), arguments[1] || {});

 return $(this.findElements(element, options) || []).map( function(item) {
 return item.id.match(options.format) ? item.id.match(options.format)[1] : '';
 });
 },

 setSequence: function(element, new_sequence) {
 element = $(element);
 var options = Object.extend(this.options(element), arguments[2] || {});

 var nodeMap = {};
 this.findElements(element, options).each( function(n) {
 if (n.id.match(options.format))
 nodeMap[n.id.match(options.format)[1]] = [n, n.parentNode];
 n.parentNode.removeChild(n);
 });

 new_sequence.each(function(ident) {
 var n = nodeMap[ident];
 if (n) {
 n[1].appendChild(n[0]);
 delete nodeMap[ident];
 }
 });
 },

 serialize: function(element) {
 element = $(element);
 var options = Object.extend(Sortable.options(element), arguments[1] || {});
 var name = encodeURIComponent(
 (arguments[1] && arguments[1].name) ? arguments[1].name : element.id);

 if (options.tree) {
 return Sortable.tree(element, arguments[1]).children.map( function (item) {
 return [name + Sortable._constructIndex(item) + "[id]=" +
 encodeURIComponent(item.id)].concat(item.children.map(arguments.callee));
 }).flatten().join('&');
 } else {
 return Sortable.sequence(element, arguments[1]).map( function(item) {
 return name + "[]=" + encodeURIComponent(item);
 }).join('&');
 }
 }
}

// Returns true if child is contained within element
Element.isParent = function(child, element) {
 if (!child.parentNode || child == element) return false;
 if (child.parentNode == element) return true;
 return Element.isParent(child.parentNode, element);
}

Element.findChildren = function(element, only, recursive, tagName) {
 if(!element.hasChildNodes()) return null;
 tagName = tagName.toUpperCase();
 if(only) only = [only].flatten();
 var elements = [];
 $A(element.childNodes).each( function(e) {
 if(e.tagName && e.tagName.toUpperCase()==tagName &&
 (!only || (Element.classNames(e).detect(function(v) { return only.include(v) }))))
 elements.push(e);
 if(recursive) {
 var grandchildren = Element.findChildren(e, only, recursive, tagName);
 if(grandchildren) elements.push(grandchildren);
 }
 });

 return (elements.length>0 ? elements.flatten() : []);
}

Element.offsetSize = function (element, type) {
 return element['offset' + ((type=='vertical' || type=='height') ? 'Height' : 'Width')];
}

// script.aculo.us controls.js v1.7.1_beta3, Fri May 25 17:19:41 +0200 2007

// Copyright (c) 2005-2007 Thomas Fuchs (http://script.aculo.us, http://mir.aculo.us)
// (c) 2005-2007 Ivan Krstic (http://blogs.law.harvard.edu/ivan)
// (c) 2005-2007 Jon Tirsen (http://www.tirsen.com)
// Contributors:
// Richard Livsey
// Rahul Bhargava
// Rob Wills
// 
// script.aculo.us is freely distributable under the terms of an MIT-style license.
// For details, see the script.aculo.us web site: http://script.aculo.us/

// Autocompleter.Base handles all the autocompletion functionality 
// that's independent of the data source for autocompletion. This
// includes drawing the autocompletion menu, observing keyboard
// and mouse events, and similar.
//
// Specific autocompleters need to provide, at the very least, 
// a getUpdatedChoices function that will be invoked every time
// the text inside the monitored textbox changes. This method 
// should get the text for which to provide autocompletion by
// invoking this.getToken(), NOT by directly accessing
// this.element.value. This is to allow incremental tokenized
// autocompletion. Specific auto-completion logic (AJAX, etc)
// belongs in getUpdatedChoices.
//
// Tokenized incremental autocompletion is enabled automatically
// when an autocompleter is instantiated with the 'tokens' option
// in the options parameter, e.g.:
// new Ajax.Autocompleter('id','upd', '/url/', { tokens: ',' });
// will incrementally autocomplete with a comma as the token.
// Additionally, ',' in the above example can be replaced with
// a token array, e.g. { tokens: [',', '\n'] } which
// enables autocompletion on multiple tokens. This is most 
// useful when one of the tokens is \n (a newline), as it 
// allows smart autocompletion after linebreaks.

if(typeof Effect == 'undefined')
 throw("controls.js requires including script.aculo.us' effects.js library");

var Autocompleter = {}
Autocompleter.Base = function() {};
Autocompleter.Base.prototype = {
 baseInitialize: function(element, update, options) {
 element = $(element)
 this.element = element; 
 this.update = $(update); 
 this.hasFocus = false; 
 this.changed = false; 
 this.active = false; 
 this.index = 0; 
 this.entryCount = 0;

 if(this.setOptions)
 this.setOptions(options);
 else
 this.options = options || {};

 this.options.paramName = this.options.paramName || this.element.name;
 this.options.tokens = this.options.tokens || [];
 this.options.frequency = this.options.frequency || 0.4;
 this.options.minChars = this.options.minChars || 1;
 this.options.onShow = this.options.onShow || 
 function(element, update){ 
 if(!update.style.position || update.style.position=='absolute') {
 update.style.position = 'absolute';
 Position.clone(element, update, {
 setHeight: false, 
 offsetTop: element.offsetHeight
 });
 }
 Effect.Appear(update,{duration:0.15});
 };
 this.options.onHide = this.options.onHide || 
 function(element, update){ new Effect.Fade(update,{duration:0.15}) };

 if(typeof(this.options.tokens) == 'string') 
 this.options.tokens = new Array(this.options.tokens);

 this.observer = null;
 
 this.element.setAttribute('autocomplete','off');

 Element.hide(this.update);

 Event.observe(this.element, 'blur', this.onBlur.bindAsEventListener(this));
 Event.observe(this.element, 'keypress', this.onKeyPress.bindAsEventListener(this));

 // Turn autocomplete back on when the user leaves the page, so that the
 // field's value will be remembered on Mozilla-based browsers.
 Event.observe(window, 'beforeunload', function(){ 
 element.setAttribute('autocomplete', 'on'); 
 });
 },

 show: function() {
 if(Element.getStyle(this.update, 'display')=='none') this.options.onShow(this.element, this.update);
 if(!this.iefix && 
 (Prototype.Browser.IE) &&
 (Element.getStyle(this.update, 'position')=='absolute')) {
 new Insertion.After(this.update, 
 '<iframe id="' + this.update.id + '_iefix" '+
 'style="display:none;position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);" ' +
 'src="javascript:false;" frameborder="0" scrolling="no"></iframe>');
 this.iefix = $(this.update.id+'_iefix');
 }
 if(this.iefix) setTimeout(this.fixIEOverlapping.bind(this), 50);
 },
 
 fixIEOverlapping: function() {
 Position.clone(this.update, this.iefix, {setTop:(!this.update.style.height)});
 this.iefix.style.zIndex = 1;
 this.update.style.zIndex = 2;
 Element.show(this.iefix);
 },

 hide: function() {
 this.stopIndicator();
 if(Element.getStyle(this.update, 'display')!='none') this.options.onHide(this.element, this.update);
 if(this.iefix) Element.hide(this.iefix);
 },

 startIndicator: function() {
 if(this.options.indicator) Element.show(this.options.indicator);
 },

 stopIndicator: function() {
 if(this.options.indicator) Element.hide(this.options.indicator);
 },

 onKeyPress: function(event) {
 if(this.active)
 switch(event.keyCode) {
 case Event.KEY_TAB:
 case Event.KEY_RETURN:
 this.selectEntry();
 Event.stop(event);
 case Event.KEY_ESC:
 this.hide();
 this.active = false;
 Event.stop(event);
 return;
 case Event.KEY_LEFT:
 case Event.KEY_RIGHT:
 return;
 case Event.KEY_UP:
 this.markPrevious();
 this.render();
 if(Prototype.Browser.WebKit) Event.stop(event);
 return;
 case Event.KEY_DOWN:
 this.markNext();
 this.render();
 if(Prototype.Browser.WebKit) Event.stop(event);
 return;
 }
 else 
 if(event.keyCode==Event.KEY_TAB || event.keyCode==Event.KEY_RETURN || 
 (Prototype.Browser.WebKit > 0 && event.keyCode == 0)) return;

 this.changed = true;
 this.hasFocus = true;

 if(this.observer) clearTimeout(this.observer);
 this.observer = 
 setTimeout(this.onObserverEvent.bind(this), this.options.frequency*1000);
 },

 activate: function() {
 this.changed = false;
 this.hasFocus = true;
 this.getUpdatedChoices();
 },

 onHover: function(event) {
 var element = Event.findElement(event, 'LI');
 if(this.index != element.autocompleteIndex) 
 {
 this.index = element.autocompleteIndex;
 this.render();
 }
 Event.stop(event);
 },
 
 onClick: function(event) {
 var element = Event.findElement(event, 'LI');
 this.index = element.autocompleteIndex;
 this.selectEntry();
 this.hide();
 },
 
 onBlur: function(event) {
 // needed to make click events working
 setTimeout(this.hide.bind(this), 250);
 this.hasFocus = false;
 this.active = false; 
 }, 
 
 render: function() {
 if(this.entryCount > 0) {
 for (var i = 0; i < this.entryCount; i++)
 this.index==i ? 
 Element.addClassName(this.getEntry(i),"selected") : 
 Element.removeClassName(this.getEntry(i),"selected");
 if(this.hasFocus) { 
 this.show();
 this.active = true;
 }
 } else {
 this.active = false;
 this.hide();
 }
 },
 
 markPrevious: function() {
 if(this.index > 0) this.index--
 else this.index = this.entryCount-1;
 this.getEntry(this.index).scrollIntoView(true);
 },
 
 markNext: function() {
 if(this.index < this.entryCount-1) this.index++
 else this.index = 0;
 this.getEntry(this.index).scrollIntoView(false);
 },
 
 getEntry: function(index) {
 return this.update.firstChild.childNodes[index];
 },
 
 getCurrentEntry: function() {
 return this.getEntry(this.index);
 },
 
 selectEntry: function() {
 this.active = false;
 this.updateElement(this.getCurrentEntry());
 },

 updateElement: function(selectedElement) {
 if (this.options.updateElement) {
 this.options.updateElement(selectedElement);
 return;
 }
 var value = '';
 if (this.options.select) {
 var nodes = document.getElementsByClassName(this.options.select, selectedElement) || [];
 if(nodes.length>0) value = Element.collectTextNodes(nodes[0], this.options.select);
 } else
 value = Element.collectTextNodesIgnoreClass(selectedElement, 'informal');
 
 var lastTokenPos = this.findLastToken();
 if (lastTokenPos != -1) {
 var newValue = this.element.value.substr(0, lastTokenPos + 1);
 var whitespace = this.element.value.substr(lastTokenPos + 1).match(/^\s+/);
 if (whitespace)
 newValue += whitespace[0];
 this.element.value = newValue + value;
 } else {
 this.element.value = value;
 }
 this.element.focus();
 
 if (this.options.afterUpdateElement)
 this.options.afterUpdateElement(this.element, selectedElement);
 },

 updateChoices: function(choices) {
 if(!this.changed && this.hasFocus) {
 this.update.innerHTML = choices;
 Element.cleanWhitespace(this.update);
 Element.cleanWhitespace(this.update.down());

 if(this.update.firstChild && this.update.down().childNodes) {
 this.entryCount = 
 this.update.down().childNodes.length;
 for (var i = 0; i < this.entryCount; i++) {
 var entry = this.getEntry(i);
 entry.autocompleteIndex = i;
 this.addObservers(entry);
 }
 } else { 
 this.entryCount = 0;
 }

 this.stopIndicator();
 this.index = 0;
 
 if(this.entryCount==1 && this.options.autoSelect) {
 this.selectEntry();
 this.hide();
 } else {
 this.render();
 }
 }
 },

 addObservers: function(element) {
 Event.observe(element, "mouseover", this.onHover.bindAsEventListener(this));
 Event.observe(element, "click", this.onClick.bindAsEventListener(this));
 },

 onObserverEvent: function() {
 this.changed = false; 
 if(this.getToken().length>=this.options.minChars) {
 this.getUpdatedChoices();
 } else {
 this.active = false;
 this.hide();
 }
 },

 getToken: function() {
 var tokenPos = this.findLastToken();
 if (tokenPos != -1)
 var ret = this.element.value.substr(tokenPos + 1).replace(/^\s+/,'').replace(/\s+$/,'');
 else
 var ret = this.element.value;

 return /\n/.test(ret) ? '' : ret;
 },

 findLastToken: function() {
 var lastTokenPos = -1;

 for (var i=0; i<this.options.tokens.length; i++) {
 var thisTokenPos = this.element.value.lastIndexOf(this.options.tokens[i]);
 if (thisTokenPos > lastTokenPos)
 lastTokenPos = thisTokenPos;
 }
 return lastTokenPos;
 }
}

Ajax.Autocompleter = Class.create();
Object.extend(Object.extend(Ajax.Autocompleter.prototype, Autocompleter.Base.prototype), {
 initialize: function(element, update, url, options) {
 this.baseInitialize(element, update, options);
 this.options.asynchronous = true;
 this.options.onComplete = this.onComplete.bind(this);
 this.options.defaultParams = this.options.parameters || null;
 this.url = url;
 },

 getUpdatedChoices: function() {
 this.startIndicator();
 
 var entry = encodeURIComponent(this.options.paramName) + '=' + 
 encodeURIComponent(this.getToken());

 this.options.parameters = this.options.callback ?
 this.options.callback(this.element, entry) : entry;

 if(this.options.defaultParams) 
 this.options.parameters += '&' + this.options.defaultParams;
 
 new Ajax.Request(this.url, this.options);
 },

 onComplete: function(request) {
 this.updateChoices(request.responseText);
 }

});

// The local array autocompleter. Used when you'd prefer to
// inject an array of autocompletion options into the page, rather
// than sending out Ajax queries, which can be quite slow sometimes.
//
// The constructor takes four parameters. The first two are, as usual,
// the id of the monitored textbox, and id of the autocompletion menu.
// The third is the array you want to autocomplete from, and the fourth
// is the options block.
//
// Extra local autocompletion options:
// - choices - How many autocompletion choices to offer
//
// - partialSearch - If false, the autocompleter will match entered
// text only at the beginning of strings in the 
// autocomplete array. Defaults to true, which will
// match text at the beginning of any *word* in the
// strings in the autocomplete array. If you want to
// search anywhere in the string, additionally set
// the option fullSearch to true (default: off).
//
// - fullSsearch - Search anywhere in autocomplete array strings.
//
// - partialChars - How many characters to enter before triggering
// a partial match (unlike minChars, which defines
// how many characters are required to do any match
// at all). Defaults to 2.
//
// - ignoreCase - Whether to ignore case when autocompleting.
// Defaults to true.
//
// It's possible to pass in a custom function as the 'selector' 
// option, if you prefer to write your own autocompletion logic.
// In that case, the other options above will not apply unless
// you support them.

Autocompleter.Local = Class.create();
Autocompleter.Local.prototype = Object.extend(new Autocompleter.Base(), {
 initialize: function(element, update, array, options) {
 this.baseInitialize(element, update, options);
 this.options.array = array;
 },

 getUpdatedChoices: function() {
 this.updateChoices(this.options.selector(this));
 },

 setOptions: function(options) {
 this.options = Object.extend({
 choices: 10,
 partialSearch: true,
 partialChars: 2,
 ignoreCase: true,
 fullSearch: false,
 selector: function(instance) {
 var ret = []; // Beginning matches
 var partial = []; // Inside matches
 var entry = instance.getToken();
 var count = 0;

 for (var i = 0; i < instance.options.array.length && 
 ret.length < instance.options.choices ; i++) { 

 var elem = instance.options.array[i];
 var foundPos = instance.options.ignoreCase ? 
 elem.toLowerCase().indexOf(entry.toLowerCase()) : 
 elem.indexOf(entry);

 while (foundPos != -1) {
 if (foundPos == 0 && elem.length != entry.length) { 
 ret.push("<li><strong>" + elem.substr(0, entry.length) + "</strong>" + 
 elem.substr(entry.length) + "</li>");
 break;
 } else if (entry.length >= instance.options.partialChars && 
 instance.options.partialSearch && foundPos != -1) {
 if (instance.options.fullSearch || /\s/.test(elem.substr(foundPos-1,1))) {
 partial.push("<li>" + elem.substr(0, foundPos) + "<strong>" +
 elem.substr(foundPos, entry.length) + "</strong>" + elem.substr(
 foundPos + entry.length) + "</li>");
 break;
 }
 }

 foundPos = instance.options.ignoreCase ? 
 elem.toLowerCase().indexOf(entry.toLowerCase(), foundPos + 1) : 
 elem.indexOf(entry, foundPos + 1);

 }
 }
 if (partial.length)
 ret = ret.concat(partial.slice(0, instance.options.choices - ret.length))
 return "<ul>" + ret.join('') + "</ul>";
 }
 }, options || {});
 }
});

// AJAX in-place editor
//
// see documentation on http://wiki.script.aculo.us/scriptaculous/show/Ajax.InPlaceEditor

// Use this if you notice weird scrolling problems on some browsers,
// the DOM might be a bit confused when this gets called so do this
// waits 1 ms (with setTimeout) until it does the activation
Field.scrollFreeActivate = function(field) {
 setTimeout(function() {
 Field.activate(field);
 }, 1);
}

Ajax.InPlaceEditor = Class.create();
Ajax.InPlaceEditor.defaultHighlightColor = "#FFFF99";
Ajax.InPlaceEditor.prototype = {
 initialize: function(element, url, options) {
 this.url = url;
 this.element = $(element);

 this.options = Object.extend({
 paramName: "value",
 okButton: true,
 okLink: false,
 okText: "ok",
 cancelButton: false,
 cancelLink: true,
 cancelText: "cancel",
 textBeforeControls: '',
 textBetweenControls: '',
 textAfterControls: '',
 savingText: "Saving...",
 clickToEditText: "Click to edit",
 okText: "ok",
 rows: 1,
 onComplete: function(transport, element) {
 new Effect.Highlight(element, {startcolor: this.options.highlightcolor});
 },
 onFailure: function(transport) {
 alert("Error communicating with the server: " + transport.responseText.stripTags());
 },
 callback: function(form) {
 return Form.serialize(form);
 },
 handleLineBreaks: true,
 loadingText: 'Loading...',
 savingClassName: 'inplaceeditor-saving',
 loadingClassName: 'inplaceeditor-loading',
 formClassName: 'inplaceeditor-form',
 highlightcolor: Ajax.InPlaceEditor.defaultHighlightColor,
 highlightendcolor: "#FFFFFF",
 externalControl: null,
 submitOnBlur: false,
 ajaxOptions: {},
 evalScripts: false
 }, options || {});

 if(!this.options.formId && this.element.id) {
 this.options.formId = this.element.id + "-inplaceeditor";
 if ($(this.options.formId)) {
 // there's already a form with that name, don't specify an id
 this.options.formId = null;
 }
 }
 
 if (this.options.externalControl) {
 this.options.externalControl = $(this.options.externalControl);
 }
 
 this.originalBackground = Element.getStyle(this.element, 'background-color');
 if (!this.originalBackground) {
 this.originalBackground = "transparent";
 }
 
 this.element.title = this.options.clickToEditText;
 
 this.onclickListener = this.enterEditMode.bindAsEventListener(this);
 this.mouseoverListener = this.enterHover.bindAsEventListener(this);
 this.mouseoutListener = this.leaveHover.bindAsEventListener(this);
 Event.observe(this.element, 'click', this.onclickListener);
 Event.observe(this.element, 'mouseover', this.mouseoverListener);
 Event.observe(this.element, 'mouseout', this.mouseoutListener);
 if (this.options.externalControl) {
 Event.observe(this.options.externalControl, 'click', this.onclickListener);
 Event.observe(this.options.externalControl, 'mouseover', this.mouseoverListener);
 Event.observe(this.options.externalControl, 'mouseout', this.mouseoutListener);
 }
 },
 enterEditMode: function(evt) {
 if (this.saving) return;
 if (this.editing) return;
 this.editing = true;
 this.onEnterEditMode();
 if (this.options.externalControl) {
 Element.hide(this.options.externalControl);
 }
 Element.hide(this.element);
 this.createForm();
 this.element.parentNode.insertBefore(this.form, this.element);
 if (!this.options.loadTextURL) Field.scrollFreeActivate(this.editField);
 // stop the event to avoid a page refresh in Safari
 if (evt) {
 Event.stop(evt);
 }
 return false;
 },
 createForm: function() {
 this.form = document.createElement("form");
 this.form.id = this.options.formId;
 Element.addClassName(this.form, this.options.formClassName)
 this.form.onsubmit = this.onSubmit.bind(this);

 this.createEditField();

 if (this.options.textarea) {
 var br = document.createElement("br");
 this.form.appendChild(br);
 }
 
 if (this.options.textBeforeControls)
 this.form.appendChild(document.createTextNode(this.options.textBeforeControls));

 if (this.options.okButton) {
 var okButton = document.createElement("input");
 okButton.type = "submit";
 okButton.value = this.options.okText;
 okButton.className = 'editor_ok_button';
 this.form.appendChild(okButton);
 }
 
 if (this.options.okLink) {
 var okLink = document.createElement("a");
 okLink.href = "#";
 okLink.appendChild(document.createTextNode(this.options.okText));
 okLink.onclick = this.onSubmit.bind(this);
 okLink.className = 'editor_ok_link';
 this.form.appendChild(okLink);
 }
 
 if (this.options.textBetweenControls && 
 (this.options.okLink || this.options.okButton) && 
 (this.options.cancelLink || this.options.cancelButton))
 this.form.appendChild(document.createTextNode(this.options.textBetweenControls));
 
 if (this.options.cancelButton) {
 var cancelButton = document.createElement("input");
 cancelButton.type = "submit";
 cancelButton.value = this.options.cancelText;
 cancelButton.onclick = this.onclickCancel.bind(this);
 cancelButton.className = 'editor_cancel_button';
 this.form.appendChild(cancelButton);
 }

 if (this.options.cancelLink) {
 var cancelLink = document.createElement("a");
 cancelLink.href = "#";
 cancelLink.appendChild(document.createTextNode(this.options.cancelText));
 cancelLink.onclick = this.onclickCancel.bind(this);
 cancelLink.className = 'editor_cancel editor_cancel_link'; 
 this.form.appendChild(cancelLink);
 }
 
 if (this.options.textAfterControls)
 this.form.appendChild(document.createTextNode(this.options.textAfterControls));
 },
 hasHTMLLineBreaks: function(string) {
 if (!this.options.handleLineBreaks) return false;
 return string.match(/<br/i) || string.match(/<p>/i);
 },
 convertHTMLLineBreaks: function(string) {
 return string.replace(/<br>/gi, "\n").replace(/<br\/>/gi, "\n").replace(/<\/p>/gi, "\n").replace(/<p>/gi, "");
 },
 createEditField: function() {
 var text;
 if(this.options.loadTextURL) {
 text = this.options.loadingText;
 } else {
 text = this.getText();
 }

 var obj = this;
 
 if (this.options.rows == 1 && !this.hasHTMLLineBreaks(text)) {
 this.options.textarea = false;
 var textField = document.createElement("input");
 textField.obj = this;
 textField.type = "text";
 textField.name = this.options.paramName;
 textField.value = text;
 textField.style.backgroundColor = this.options.highlightcolor;
 textField.className = 'editor_field';
 var size = this.options.size || this.options.cols || 0;
 if (size != 0) textField.size = size;
 if (this.options.submitOnBlur)
 textField.onblur = this.onSubmit.bind(this);
 this.editField = textField;
 } else {
 this.options.textarea = true;
 var textArea = document.createElement("textarea");
 textArea.obj = this;
 textArea.name = this.options.paramName;
 textArea.value = this.convertHTMLLineBreaks(text);
 textArea.rows = this.options.rows;
 textArea.cols = this.options.cols || 40;
 textArea.className = 'editor_field'; 
 if (this.options.submitOnBlur)
 textArea.onblur = this.onSubmit.bind(this);
 this.editField = textArea;
 }
 
 if(this.options.loadTextURL) {
 this.loadExternalText();
 }
 this.form.appendChild(this.editField);
 },
 getText: function() {
 return this.element.innerHTML;
 },
 loadExternalText: function() {
 Element.addClassName(this.form, this.options.loadingClassName);
 this.editField.disabled = true;
 new Ajax.Request(
 this.options.loadTextURL,
 Object.extend({
 asynchronous: true,
 onComplete: this.onLoadedExternalText.bind(this)
 }, this.options.ajaxOptions)
 );
 },
 onLoadedExternalText: function(transport) {
 Element.removeClassName(this.form, this.options.loadingClassName);
 this.editField.disabled = false;
 this.editField.value = transport.responseText.stripTags();
 Field.scrollFreeActivate(this.editField);
 },
 onclickCancel: function() {
 this.onComplete();
 this.leaveEditMode();
 return false;
 },
 onFailure: function(transport) {
 this.options.onFailure(transport);
 if (this.oldInnerHTML) {
 this.element.innerHTML = this.oldInnerHTML;
 this.oldInnerHTML = null;
 }
 return false;
 },
 onSubmit: function() {
 // onLoading resets these so we need to save them away for the Ajax call
 var form = this.form;
 var value = this.editField.value;
 
 // do this first, sometimes the ajax call returns before we get a chance to switch on Saving...
 // which means this will actually switch on Saving... *after* we've left edit mode causing Saving...
 // to be displayed indefinitely
 this.onLoading();
 
 if (this.options.evalScripts) {
 new Ajax.Request(
 this.url, Object.extend({
 parameters: this.options.callback(form, value),
 onComplete: this.onComplete.bind(this),
 onFailure: this.onFailure.bind(this),
 asynchronous:true, 
 evalScripts:true
 }, this.options.ajaxOptions));
 } else {
 new Ajax.Updater(
 { success: this.element,
 // don't update on failure (this could be an option)
 failure: null }, 
 this.url, Object.extend({
 parameters: this.options.callback(form, value),
 onComplete: this.onComplete.bind(this),
 onFailure: this.onFailure.bind(this)
 }, this.options.ajaxOptions));
 }
 // stop the event to avoid a page refresh in Safari
 if (arguments.length > 1) {
 Event.stop(arguments[0]);
 }
 return false;
 },
 onLoading: function() {
 this.saving = true;
 this.removeForm();
 this.leaveHover();
 this.showSaving();
 },
 showSaving: function() {
 this.oldInnerHTML = this.element.innerHTML;
 this.element.innerHTML = this.options.savingText;
 Element.addClassName(this.element, this.options.savingClassName);
 this.element.style.backgroundColor = this.originalBackground;
 Element.show(this.element);
 },
 removeForm: function() {
 if(this.form) {
 if (this.form.parentNode) Element.remove(this.form);
 this.form = null;
 }
 },
 enterHover: function() {
 if (this.saving) return;
 this.element.style.backgroundColor = this.options.highlightcolor;
 if (this.effect) {
 this.effect.cancel();
 }
 Element.addClassName(this.element, this.options.hoverClassName)
 },
 leaveHover: function() {
 if (this.options.backgroundColor) {
 this.element.style.backgroundColor = this.oldBackground;
 }
 Element.removeClassName(this.element, this.options.hoverClassName)
 if (this.saving) return;
 this.effect = new Effect.Highlight(this.element, {
 startcolor: this.options.highlightcolor,
 endcolor: this.options.highlightendcolor,
 restorecolor: this.originalBackground
 });
 },
 leaveEditMode: function() {
 Element.removeClassName(this.element, this.options.savingClassName);
 this.removeForm();
 this.leaveHover();
 this.element.style.backgroundColor = this.originalBackground;
 Element.show(this.element);
 if (this.options.externalControl) {
 Element.show(this.options.externalControl);
 }
 this.editing = false;
 this.saving = false;
 this.oldInnerHTML = null;
 this.onLeaveEditMode();
 },
 onComplete: function(transport) {
 this.leaveEditMode();
 this.options.onComplete.bind(this)(transport, this.element);
 },
 onEnterEditMode: function() {},
 onLeaveEditMode: function() {},
 dispose: function() {
 if (this.oldInnerHTML) {
 this.element.innerHTML = this.oldInnerHTML;
 }
 this.leaveEditMode();
 Event.stopObserving(this.element, 'click', this.onclickListener);
 Event.stopObserving(this.element, 'mouseover', this.mouseoverListener);
 Event.stopObserving(this.element, 'mouseout', this.mouseoutListener);
 if (this.options.externalControl) {
 Event.stopObserving(this.options.externalControl, 'click', this.onclickListener);
 Event.stopObserving(this.options.externalControl, 'mouseover', this.mouseoverListener);
 Event.stopObserving(this.options.externalControl, 'mouseout', this.mouseoutListener);
 }
 }
};

Ajax.InPlaceCollectionEditor = Class.create();
Object.extend(Ajax.InPlaceCollectionEditor.prototype, Ajax.InPlaceEditor.prototype);
Object.extend(Ajax.InPlaceCollectionEditor.prototype, {
 createEditField: function() {
 if (!this.cached_selectTag) {
 var selectTag = document.createElement("select");
 var collection = this.options.collection || [];
 var optionTag;
 collection.each(function(e,i) {
 optionTag = document.createElement("option");
 optionTag.value = (e instanceof Array) ? e[0] : e;
 if((typeof this.options.value == 'undefined') && 
 ((e instanceof Array) ? this.element.innerHTML == e[1] : e == optionTag.value)) optionTag.selected = true;
 if(this.options.value==optionTag.value) optionTag.selected = true;
 optionTag.appendChild(document.createTextNode((e instanceof Array) ? e[1] : e));
 selectTag.appendChild(optionTag);
 }.bind(this));
 this.cached_selectTag = selectTag;
 }

 this.editField = this.cached_selectTag;
 if(this.options.loadTextURL) this.loadExternalText();
 this.form.appendChild(this.editField);
 this.options.callback = function(form, value) {
 return "value=" + encodeURIComponent(value);
 }
 }
});

// Delayed observer, like Form.Element.Observer, 
// but waits for delay after last key input
// Ideal for live-search fields

Form.Element.DelayedObserver = Class.create();
Form.Element.DelayedObserver.prototype = {
 initialize: function(element, delay, callback) {
 this.delay = delay || 0.5;
 this.element = $(element);
 this.callback = callback;
 this.timer = null;
 this.lastValue = $F(this.element); 
 Event.observe(this.element,'keyup',this.delayedListener.bindAsEventListener(this));
 },
 delayedListener: function(event) {
 if(this.lastValue == $F(this.element)) return;
 if(this.timer) clearTimeout(this.timer);
 this.timer = setTimeout(this.onTimerEvent.bind(this), this.delay * 1000);
 this.lastValue = $F(this.element);
 },
 onTimerEvent: function() {
 this.timer = null;
 this.callback(this.element, $F(this.element));
 }
};

// script.aculo.us slider.js v1.7.1_beta3, Fri May 25 17:19:41 +0200 2007

// Copyright (c) 2005-2007 Marty Haught, Thomas Fuchs
//
// script.aculo.us is freely distributable under the terms of an MIT-style license.
// For details, see the script.aculo.us web site: http://script.aculo.us/

if(!Control) var Control = {};
Control.Slider = Class.create();

// options:
// axis: 'vertical', or 'horizontal' (default)
//
// callbacks:
// onChange(value)
// onSlide(value)
Control.Slider.prototype = {
 initialize: function(handle, track, options) {
 var slider = this;

 if(handle instanceof Array) {
 this.handles = handle.collect( function(e) { return $(e) });
 } else {
 this.handles = [$(handle)];
 }

 this.track = $(track);
 this.options = options || {};

 this.axis = this.options.axis || 'horizontal';
 this.increment = this.options.increment || 1;
 this.step = parseInt(this.options.step || '1');
 this.range = this.options.range || $R(0,1);

 this.value = 0; // assure backwards compat
 this.values = this.handles.map( function() { return 0 });
 this.spans = this.options.spans ? this.options.spans.map(function(s){ return $(s) }) : false;
 this.options.startSpan = $(this.options.startSpan || null);
 this.options.endSpan = $(this.options.endSpan || null);

 this.restricted = this.options.restricted || false;

 this.maximum = this.options.maximum || this.range.end;
 this.minimum = this.options.minimum || this.range.start;

 // Will be used to align the handle onto the track, if necessary
 this.alignX = parseInt(this.options.alignX || '0');
 this.alignY = parseInt(this.options.alignY || '0');

 this.trackLength = this.maximumOffset() - this.minimumOffset();

 this.handleLength = this.isVertical() ?
 (this.handles[0].offsetHeight != 0 ?
 this.handles[0].offsetHeight : this.handles[0].style.height.replace(/px$/,"")) :
 (this.handles[0].offsetWidth != 0 ? this.handles[0].offsetWidth :
 this.handles[0].style.width.replace(/px$/,""));

 this.active = false;
 this.dragging = false;
 this.disabled = false;

 if(this.options.disabled) this.setDisabled();

 // Allowed values array
 this.allowedValues = this.options.values ? this.options.values.sortBy(Prototype.K) : false;
 if(this.allowedValues) {
 this.minimum = this.allowedValues.min();
 this.maximum = this.allowedValues.max();
 }

 this.eventMouseDown = this.startDrag.bindAsEventListener(this);
 this.eventMouseUp = this.endDrag.bindAsEventListener(this);
 this.eventMouseMove = this.update.bindAsEventListener(this);

 // Initialize handles in reverse (make sure first handle is active)
 this.handles.each( function(h,i) {
 i = slider.handles.length-1-i;
 slider.setValue(parseFloat(
 (slider.options.sliderValue instanceof Array ?
 slider.options.sliderValue[i] : slider.options.sliderValue) ||
 slider.range.start), i);
 Element.makePositioned(h); // fix IE
 Event.observe(h, "mousedown", slider.eventMouseDown);
 });

 Event.observe(this.track, "mousedown", this.eventMouseDown);
 Event.observe(document, "mouseup", this.eventMouseUp);
 Event.observe(this.track.parentNode.parentNode, "mousemove", this.eventMouseMove);

 this.initialized = true;
 },
 dispose: function() {
 var slider = this;
 Event.stopObserving(this.track, "mousedown", this.eventMouseDown);
 Event.stopObserving(document, "mouseup", this.eventMouseUp);
 Event.stopObserving(this.track.parentNode.parentNode, "mousemove", this.eventMouseMove);
 this.handles.each( function(h) {
 Event.stopObserving(h, "mousedown", slider.eventMouseDown);
 });
 },
 setDisabled: function(){
 this.disabled = true;
 },
 setEnabled: function(){
 this.disabled = false;
 },
 getNearestValue: function(value){
 if(this.allowedValues){
 if(value >= this.allowedValues.max()) return(this.allowedValues.max());
 if(value <= this.allowedValues.min()) return(this.allowedValues.min());

 var offset = Math.abs(this.allowedValues[0] - value);
 var newValue = this.allowedValues[0];
 this.allowedValues.each( function(v) {
 var currentOffset = Math.abs(v - value);
 if(currentOffset <= offset){
 newValue = v;
 offset = currentOffset;
 }
 });
 return newValue;
 }
 if(value > this.range.end) return this.range.end;
 if(value < this.range.start) return this.range.start;
 return value;
 },
 setValue: function(sliderValue, handleIdx){
 if(!this.active) {
 this.activeHandleIdx = handleIdx || 0;
 this.activeHandle = this.handles[this.activeHandleIdx];
 this.updateStyles();
 }
 handleIdx = handleIdx || this.activeHandleIdx || 0;
 if(this.initialized && this.restricted) {
 if((handleIdx>0) && (sliderValue<this.values[handleIdx-1]))
 sliderValue = this.values[handleIdx-1];
 if((handleIdx < (this.handles.length-1)) && (sliderValue>this.values[handleIdx+1]))
 sliderValue = this.values[handleIdx+1];
 }
 sliderValue = this.getNearestValue(sliderValue);
 this.values[handleIdx] = sliderValue;
 this.value = this.values[0]; // assure backwards compat

 this.handles[handleIdx].style[this.isVertical() ? 'top' : 'left'] =
 this.translateToPx(sliderValue);

 this.drawSpans();
 if(!this.dragging || !this.event) this.updateFinished();
 },
 setValueBy: function(delta, handleIdx) {
 this.setValue(this.values[handleIdx || this.activeHandleIdx || 0] + delta,
 handleIdx || this.activeHandleIdx || 0);
 },
 translateToPx: function(value) {
 return Math.round(
 ((this.trackLength-this.handleLength)/(this.range.end-this.range.start)) *
 (value - this.range.start)) + "px";
 },
 translateToValue: function(offset) {
 return ((offset/(this.trackLength-this.handleLength) *
 (this.range.end-this.range.start)) + this.range.start);
 },
 getRange: function(range) {
 var v = this.values.sortBy(Prototype.K);
 range = range || 0;
 return $R(v[range],v[range+1]);
 },
 minimumOffset: function(){
 return(this.isVertical() ? this.alignY : this.alignX);
 },
 maximumOffset: function(){
 return(this.isVertical() ?
 (this.track.offsetHeight != 0 ? this.track.offsetHeight :
 this.track.style.height.replace(/px$/,"")) - this.alignY :
 (this.track.offsetWidth != 0 ? this.track.offsetWidth :
 this.track.style.width.replace(/px$/,"")) - this.alignY);
 },
 isVertical: function(){
 return (this.axis == 'vertical');
 },
 drawSpans: function() {
 var slider = this;
 if(this.spans)
 $R(0, this.spans.length-1).each(function(r) { slider.setSpan(slider.spans[r], slider.getRange(r)) });
 if(this.options.startSpan)
 this.setSpan(this.options.startSpan,
 $R(0, this.values.length>1 ? this.getRange(0).min() : this.value ));
 if(this.options.endSpan)
 this.setSpan(this.options.endSpan,
 $R(this.values.length>1 ? this.getRange(this.spans.length-1).max() : this.value, this.maximum));
 },
 setSpan: function(span, range) {
 if(this.isVertical()) {
 span.style.top = this.translateToPx(range.start);
 span.style.height = this.translateToPx(range.end - range.start + this.range.start);
 } else {
 span.style.left = this.translateToPx(range.start);
 span.style.width = this.translateToPx(range.end - range.start + this.range.start);
 }
 },
 updateStyles: function() {
 this.handles.each( function(h){ Element.removeClassName(h, 'selected') });
 Element.addClassName(this.activeHandle, 'selected');
 },
 startDrag: function(event) {
 if(Event.isLeftClick(event)) {
 if(!this.disabled){
 this.active = true;

 var handle = Event.element(event);
 var pointer = [Event.pointerX(event), Event.pointerY(event)];
 var track = handle;
 if(track==this.track) {
 var offsets = Position.cumulativeOffset(this.track);
 this.event = event;
 this.setValue(this.translateToValue(
 (this.isVertical() ? pointer[1]-offsets[1] : pointer[0]-offsets[0])-(this.handleLength/2)
 ));
 var offsets = Position.cumulativeOffset(this.activeHandle);
 this.offsetX = (pointer[0] - offsets[0]);
 this.offsetY = (pointer[1] - offsets[1]);
 } else {
 // find the handle (prevents issues with Safari)
 while((this.handles.indexOf(handle) == -1) && handle.parentNode)
 handle = handle.parentNode;

 if(this.handles.indexOf(handle)!=-1) {
 this.activeHandle = handle;
 this.activeHandleIdx = this.handles.indexOf(this.activeHandle);
 this.updateStyles();

 var offsets = Position.cumulativeOffset(this.activeHandle);
 this.offsetX = (pointer[0] - offsets[0]);
 this.offsetY = (pointer[1] - offsets[1]);
 }
 }
 }
 Event.stop(event);
 }
 },
 update: function(event) {
 if(this.active) {
 if(!this.dragging) this.dragging = true;
 this.draw(event);
 if(Prototype.Browser.WebKit) window.scrollBy(0,0);
 Event.stop(event);
 }
 },
 draw: function(event) {
 var pointer = [Event.pointerX(event), Event.pointerY(event)];
 var offsets = Position.cumulativeOffset(this.track);
 pointer[0] -= this.offsetX + offsets[0];
 pointer[1] -= this.offsetY + offsets[1];
 this.event = event;
 this.setValue(this.translateToValue( this.isVertical() ? pointer[1] : pointer[0] ));
 if(this.initialized && this.options.onSlide)
 this.options.onSlide(this.values.length>1 ? this.values : this.value, this);
 },
 endDrag: function(event) {
 if(this.active && this.dragging) {
 this.finishDrag(event, true);
 Event.stop(event);
 }
 this.active = false;
 this.dragging = false;
 },
 finishDrag: function(event, success) {
 this.active = false;
 this.dragging = false;
 this.updateFinished();
 },
 updateFinished: function() {
 if(this.initialized && this.options.onChange)
 this.options.onChange(this.values.length>1 ? this.values : this.value, this);
 this.event = null;
 }
}
/**
 * Magento
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License (AFL 3.0)
 * that is bundled with this package in the file LICENSE_AFL.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/afl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@magentocommerce.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Magento to newer
 * versions in the future. If you wish to customize Magento for your
 * needs please refer to http://www.magentocommerce.com for more information.
 *
 * @copyright Copyright (c) 2008 Irubin Consulting Inc. DBA Varien (http://www.varien.com)
 * @license http://opensource.org/licenses/afl-3.0.php Academic Free License (AFL 3.0)
 */
function popWin(url,win,para) {
 var win = window.open(url,win,para);
 win.focus();
}

function setLocation(url){
 window.location.href = url;
}

function setPLocation(url, setFocus){
 if( setFocus ) {
 window.opener.focus();
 }
 window.opener.location.href = url;
}

function setLanguageCode(code, fromCode){
 //TODO: javascript cookies have different domain and path than php cookies
 var href = window.location.href;
 var after = '', dash;
 if (dash = href.match(/\#(.*)$/)) {
 href = href.replace(/\#(.*)$/, '');
 after = dash[0];
 }

 if (href.match(/[?]/)) {
 var re = /([?&]store=)[a-z0-9_]*/;
 if (href.match(re)) {
 href = href.replace(re, '$1'+code);
 } else {
 href += '&store='+code;
 }

 var re = /([?&]from_store=)[a-z0-9_]*/;
 if (href.match(re)) {
 href = href.replace(re, '');
 }
 } else {
 href += '?store='+code;
 }
 if (typeof(fromCode) != 'undefined') {
 href += '&from_store='+fromCode;
 }
 href += after;

 setLocation(href);
}

/**
 * Add classes to specified elements.
 * Supported classes are: 'odd', 'even', 'first', 'last'
 *
 * @param elements - array of elements to be decorated
 * [@param decorateParams] - array of classes to be set. If omitted, all available will be used
 */
function decorateGeneric(elements, decorateParams)
{
 var allSupportedParams = ['odd', 'even', 'first', 'last'];
 var _decorateParams = {};
 var total = elements.length;

 if (total) {
 // determine params called
 if (typeof(decorateParams) == 'undefined') {
 decorateParams = allSupportedParams;
 }
 if (!decorateParams.length) {
 return;
 }
 for (var k in allSupportedParams) {
 _decorateParams[allSupportedParams[k]] = false;
 }
 for (var k in decorateParams) {
 _decorateParams[decorateParams[k]] = true;
 }

 // decorate elements
 // elements[0].addClassName('first'); // will cause bug in IE (#5587)
 if (_decorateParams.first) {
 Element.addClassName(elements[0], 'first');
 }
 if (_decorateParams.last) {
 Element.addClassName(elements[total-1], 'last');
 }
 for (var i = 0; i < total; i++) {
 if ((i + 1) % 2 == 0) {
 if (_decorateParams.even) {
 Element.addClassName(elements[i], 'even');
 }
 }
 else {
 if (_decorateParams.odd) {
 Element.addClassName(elements[i], 'odd');
 }
 }
 }
 }
}

/**
 * Decorate table rows and cells, tbody etc
 * @see decorateGeneric()
 */
function decorateTable(table, options) {
 var table = $(table);
 if (table) {
 // set default options
 var _options = {
 'tbody' : false,
 'tbody tr' : ['odd', 'even', 'first', 'last'],
 'thead tr' : ['first', 'last'],
 'tfoot tr' : ['first', 'last'],
 'tr td' : ['last']
 };
 // overload options
 if (typeof(options) != 'undefined') {
 for (var k in options) {
 _options[k] = options[k];
 }
 }
 // decorate
 if (_options['tbody']) {
 decorateGeneric(table.select('tbody'), _options['tbody']);
 }
 if (_options['tbody tr']) {
 decorateGeneric(table.select('tbody tr'), _options['tbody tr']);
 }
 if (_options['thead tr']) {
 decorateGeneric(table.select('thead tr'), _options['thead tr']);
 }
 if (_options['tfoot tr']) {
 decorateGeneric(table.select('tfoot tr'), _options['tfoot tr']);
 }
 if (_options['tr td']) {
 var allRows = table.select('tr');
 if (allRows.length) {
 for (var i = 0; i < allRows.length; i++) {
 decorateGeneric(allRows[i].getElementsByTagName('TD'), _options['tr td']);
 }
 }
 }
 }
}

/**
 * Set "odd", "even" and "last" CSS classes for list items
 * @see decorateGeneric()
 */
function decorateList(list, nonRecursive) {
 if ($(list)) {
 if (typeof(nonRecursive) == 'undefined') {
 var items = $(list).select('li')
 }
 else {
 var items = $(list).childElements();
 }
 decorateGeneric(items, ['odd', 'even', 'last']);
 }
}

/**
 * Set "odd", "even" and "last" CSS classes for list items
 * @see decorateGeneric()
 */
function decorateDataList(list) {
 list = $(list);
 if (list) {
 decorateGeneric(list.select('dt'), ['odd', 'even', 'last']);
 decorateGeneric(list.select('dd'), ['odd', 'even', 'last']);
 }
}

/**
 * Formats currency using patern
 * format - JSON (pattern, decimal, decimalsDelimeter, groupsDelimeter)
 * showPlus - true (always show '+'or '-'),
 * false (never show '-' even if number is negative)
 * null (show '-' if number is negative)
 */

function formatCurrency(price, format, showPlus){
 precision = isNaN(format.precision = Math.abs(format.precision)) ? 2 : format.precision;
 requiredPrecision = isNaN(format.requiredPrecision = Math.abs(format.requiredPrecision)) ? 2 : format.requiredPrecision;

 //precision = (precision > requiredPrecision) ? precision : requiredPrecision;
 //for now we don't need this difference so precision is requiredPrecision
 precision = requiredPrecision;

 integerRequired = isNaN(format.integerRequired = Math.abs(format.integerRequired)) ? 1 : format.integerRequired;

 decimalSymbol = format.decimalSymbol == undefined ? "," : format.decimalSymbol;
 groupSymbol = format.groupSymbol == undefined ? "." : format.groupSymbol;
 groupLength = format.groupLength == undefined ? 3 : format.groupLength;

 if (showPlus == undefined || showPlus == true) {
 s = price < 0 ? "-" : ( showPlus ? "+" : "");
 } else if (showPlus == false) {
 s = '';
 }

 i = parseInt(price = Math.abs(+price || 0).toFixed(precision)) + "";
 pad = (i.length < integerRequired) ? (integerRequired - i.length) : 0;
 while (pad) { i = '0' + i; pad--; }

 j = (j = i.length) > groupLength ? j % groupLength : 0;
 re = new RegExp("(\\d{" + groupLength + "})(?=\\d)", "g");

 /**
 * replace(/-/, 0) is only for fixing Safari bug which appears
 * when Math.abs(0).toFixed() executed on "0" number.
 * Result is "0.-0" :(
 */
 r = (j ? i.substr(0, j) + groupSymbol : "") + i.substr(j).replace(re, "$1" + groupSymbol) + (precision ? decimalSymbol + Math.abs(price - i).toFixed(precision).replace(/-/, 0).slice(2) : "")

 if (format.pattern.indexOf('{sign}') == -1) {
 pattern = s + format.pattern;
 } else {
 pattern = format.pattern.replace('{sign}', s);
 }

 return pattern.replace('%s', r).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

function expandDetails(el, childClass) {
 if (Element.hasClassName(el,'show-details')) {
 $$(childClass).each(function(item){item.hide()});
 Element.removeClassName(el,'show-details');
 }
 else {
 $$(childClass).each(function(item){item.show()});
 Element.addClassName(el,'show-details');
 }
}

// Version 1.0
var isIE = navigator.appVersion.match(/MSIE/) == "MSIE";

if (!window.Varien)
 var Varien = new Object();

Varien.showLoading = function(){
 Element.show('loading-process');
}
Varien.hideLoading = function(){
 Element.hide('loading-process');
}
Varien.GlobalHandlers = {
 onCreate: function() {
 Varien.showLoading();
 },

 onComplete: function() {
 if(Ajax.activeRequestCount == 0) {
 Varien.hideLoading();
 }
 }
};

Ajax.Responders.register(Varien.GlobalHandlers);

/**
 * Quick Search form client model
 */
Varien.searchForm = Class.create();
Varien.searchForm.prototype = {
 initialize : function(form, field, emptyText){
 this.form = $(form);
 this.field = $(field);
 this.emptyText = emptyText;

 Event.observe(this.form, 'submit', this.submit.bind(this));
 Event.observe(this.field, 'focus', this.focus.bind(this));
 Event.observe(this.field, 'blur', this.blur.bind(this));
 this.blur();
 },

 submit : function(event){
 if (this.field.value == this.emptyText || this.field.value == ''){
 Event.stop(event);
 return false;
 }
 return true;
 },

 focus : function(event){
 if(this.field.value==this.emptyText){
 this.field.value='';
 }

 },

 blur : function(event){
 if(this.field.value==''){
 this.field.value=this.emptyText;
 }
 },

 initAutocomplete : function(url, destinationElement){
 new Ajax.Autocompleter(
 this.field,
 destinationElement,
 url,
 {
 paramName: this.field.name,
 minChars: 2,
 updateElement: this._selectAutocompleteItem.bind(this),
 onShow : function(element, update) { 
 if(!update.style.position || update.style.position=='absolute') {
 update.style.position = 'absolute';
 Position.clone(element, update, {
 setHeight: false, 
 offsetTop: element.offsetHeight
 });
 }
 Effect.Appear(update,{duration:0});
 }

 }
 );
 },

 _selectAutocompleteItem : function(element){
 if(element.title){
 this.field.value = element.title;
 }
 this.form.submit();
 }
}

Varien.Tabs = Class.create();
Varien.Tabs.prototype = {
 initialize: function(selector) {
 var self=this;
 $$(selector+' a').each(this.initTab.bind(this));
 },

 initTab: function(el) {
 el.href = 'javascript:void(0)';
 if ($(el.parentNode).hasClassName('active')) {
 this.showContent(el);
 }
 el.observe('click', this.showContent.bind(this, el));
 },

 showContent: function(a) {
 var li = $(a.parentNode), ul = $(li.parentNode);
 ul.getElementsBySelector('li', 'ol').each(function(el){
 var contents = $(el.id+'_contents');
 if (el==li) {
 el.addClassName('active');
 contents.show();
 } else {
 el.removeClassName('active');
 contents.hide();
 }
 });
 }
}

Varien.DOB = Class.create();
Varien.DOB.prototype = {
 initialize: function(selector, required, format) {
 var el = $$(selector)[0];
 this.day = Element.select($(el), '.dob-day input')[0];
 this.month = Element.select($(el), '.dob-month input')[0];
 this.year = Element.select($(el), '.dob-year input')[0];
 this.dob = Element.select($(el), '.dob-full input')[0];
 this.advice = Element.select($(el), '.validation-advice')[0];
 this.required = required;
 this.format = format;

 this.day.validate = this.validate.bind(this);
 this.month.validate = this.validate.bind(this);
 this.year.validate = this.validate.bind(this);

 this.advice.hide();
 },

 validate: function() {
 var error = false;

 if (this.day.value=='' && this.month.value=='' && this.year.value=='') {
 if (this.required) {
 error = 'This date is a required value.';
 } else {
 this.dob.value = '';
 }
 } else if (this.day.value=='' || this.month.value=='' || this.year.value=='') {
 error = 'Please enter a valid full date.';
 } else {
 var date = new Date();
 if (this.day.value<1 || this.day.value>31) {
 error = 'Please enter a valid day (1-31).';
 } else if (this.month.value<1 || this.month.value>12) {
 error = 'Please enter a valid month (1-12).';
 } else if (this.year.value<1900 || this.year.value>date.getFullYear()) {
 error = 'Please enter a valid year (1900-'+date.getFullYear()+').';
 } else {
 this.dob.value = this.format.replace(/(%m|%b)/i, this.month.value).replace(/(%d|%e)/i, this.day.value).replace(/%y/i, this.year.value);
 var testDOB = this.month.value + '/' + this.day.value + '/'+ this.year.value;
 var test = new Date(testDOB);
 if (isNaN(test)) {
 error = 'Please enter a valid date.';
 }
 }
 }

 if (error !== false) {
 try {
 this.advice.innerHTML = Translator.translate(error);
 }
 catch (e) {
 this.advice.innerHTML = error;
 }
 this.advice.show();
 return false;
 }

 this.advice.hide();
 return true;
 }
}

Validation.addAllThese([
 ['validate-custom', ' ', function(v,elm) {
 return elm.validate();
 }]
]);

function truncateOptions() {
 $$('.truncated').each(function(element){
 Event.observe(element, 'mouseover', function(){
 if (element.down('div.truncated_full_value')) {
 element.down('div.truncated_full_value').addClassName('show')
 }
 });
 Event.observe(element, 'mouseout', function(){
 if (element.down('div.truncated_full_value')) {
 element.down('div.truncated_full_value').removeClassName('show')
 }
 });

 });
}
Event.observe(window, 'load', function(){
 truncateOptions();
});
/**
 * Magento
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License (AFL 3.0)
 * that is bundled with this package in the file LICENSE_AFL.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/afl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@magentocommerce.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Magento to newer
 * versions in the future. If you wish to customize Magento for your
 * needs please refer to http://www.magentocommerce.com for more information.
 *
 * @copyright Copyright (c) 2008 Irubin Consulting Inc. DBA Varien (http://www.varien.com)
 * @license http://opensource.org/licenses/afl-3.0.php Academic Free License (AFL 3.0)
 */
VarienForm = Class.create();
VarienForm.prototype = {
 initialize: function(formId, firstFieldFocus){
 this.form = $(formId);
 if (!this.form) {
 return;
 }
 this.cache = $A();
 this.currLoader = false;
 this.currDataIndex = false;
 this.validator = new Validation(this.form);
 this.elementFocus = this.elementOnFocus.bindAsEventListener(this);
 this.elementBlur = this.elementOnBlur.bindAsEventListener(this);
 this.childLoader = this.onChangeChildLoad.bindAsEventListener(this);
 this.highlightClass = 'highlight';
 this.extraChildParams = '';
 this.firstFieldFocus= firstFieldFocus || false;
 this.bindElements();
 if(this.firstFieldFocus){
 try{
 Form.Element.focus(Form.findFirstElement(this.form))
 }
 catch(e){}
 }
 },

 submit : function(url){
 if(this.validator && this.validator.validate()){
 this.form.submit();
 }
 return false;
 },

 bindElements:function (){
 var elements = Form.getElements(this.form);
 for (var row in elements) {
 if (elements[row].id) {
 Event.observe(elements[row],'focus',this.elementFocus);
 Event.observe(elements[row],'blur',this.elementBlur);
 }
 }
 },

 elementOnFocus: function(event){
 var element = Event.findElement(event, 'fieldset');
 if(element){
 Element.addClassName(element, this.highlightClass);
 }
 },

 elementOnBlur: function(event){
 var element = Event.findElement(event, 'fieldset');
 if(element){
 Element.removeClassName(element, this.highlightClass);
 }
 },

 setElementsRelation: function(parent, child, dataUrl, first){
 if (parent=$(parent)) {
 // TODO: array of relation and caching
 if (!this.cache[parent.id]){
 this.cache[parent.id] = $A();
 this.cache[parent.id]['child'] = child;
 this.cache[parent.id]['dataUrl'] = dataUrl;
 this.cache[parent.id]['data'] = $A();
 this.cache[parent.id]['first'] = first || false;
 }
 Event.observe(parent,'change',this.childLoader);
 }
 },

 onChangeChildLoad: function(event){
 element = Event.element(event);
 this.elementChildLoad(element);
 },

 elementChildLoad: function(element, callback){
 this.callback = callback || false;
 if (element.value) {
 this.currLoader = element.id;
 this.currDataIndex = element.value;
 if (this.cache[element.id]['data'][element.value]) {
 this.setDataToChild(this.cache[element.id]['data'][element.value]);
 }
 else{
 new Ajax.Request(this.cache[this.currLoader]['dataUrl'],{
 method: 'post',
 parameters: {"parent":element.value},
 onComplete: this.reloadChildren.bind(this)
 });
 }
 }
 },

 reloadChildren: function(transport){
 var data = eval('(' + transport.responseText + ')');
 this.cache[this.currLoader]['data'][this.currDataIndex] = data;
 this.setDataToChild(data);
 },

 setDataToChild: function(data){
 if (data.length) {
 var child = $(this.cache[this.currLoader]['child']);
 if (child){
 var html = '<select name="'+child.name+'" id="'+child.id+'" class="'+child.className+'" title="'+child.title+'" '+this.extraChildParams+'>';
 if(this.cache[this.currLoader]['first']){
 html+= '<option value="">'+this.cache[this.currLoader]['first']+'</option>';
 }
 for (var i in data){
 if(data[i].value) {
 html+= '<option value="'+data[i].value+'"';
 if(child.value && (child.value == data[i].value || child.value == data[i].label)){
 html+= ' selected';
 }
 html+='>'+data[i].label+'</option>';
 }
 }
 html+= '</select>';
 Element.insert(child, {before: html});
 Element.remove(child);
 }
 }
 else{
 var child = $(this.cache[this.currLoader]['child']);
 if (child){
 var html = '<input type="text" name="'+child.name+'" id="'+child.id+'" class="'+child.className+'" title="'+child.title+'" '+this.extraChildParams+'>';
 Element.insert(child, {before: html});
 Element.remove(child);
 }
 }

 this.bindElements();
 if (this.callback) {
 this.callback();
 }
 }
}

RegionUpdater = Class.create();
RegionUpdater.prototype = {
 initialize: function (countryEl, regionTextEl, regionSelectEl, regions, disableAction)
 {
 this.countryEl = $(countryEl);
 this.regionTextEl = $(regionTextEl);
 this.regionSelectEl = $(regionSelectEl);
 this.regions = regions;

 this.disableAction = (typeof disableAction=='undefined') ? 'hide' : disableAction;

 if (this.regionSelectEl.options.length<=1) {
 this.update();
 }

 Event.observe(this.countryEl, 'change', this.update.bind(this));
 },

 update: function()
 {
 if (this.regions[this.countryEl.value]) {
 var i, option, region, def;

 if (this.regionTextEl) {
 def = this.regionTextEl.value.toLowerCase();
 this.regionTextEl.value = '';
 }
 if (!def) {
 def = this.regionSelectEl.getAttribute('defaultValue');
 }

 this.regionSelectEl.options.length = 1;
 for (regionId in this.regions[this.countryEl.value]) {
 region = this.regions[this.countryEl.value][regionId];

 option = document.createElement('OPTION');
 option.value = regionId;
 option.text = region.name;

 if (this.regionSelectEl.options.add) {
 this.regionSelectEl.options.add(option);
 } else {
 this.regionSelectEl.appendChild(option);
 }

 if (regionId==def || region.name.toLowerCase()==def || region.code.toLowerCase()==def) {
 this.regionSelectEl.value = regionId;
 }
 }

 if (this.disableAction=='hide') {
 if (this.regionTextEl) {
 this.regionTextEl.style.display = 'none';
 }

 this.regionSelectEl.style.display = '';
 } else if (this.disableAction=='disable') {
 if (this.regionTextEl) {
 this.regionTextEl.disabled = true;
 }
 this.regionSelectEl.disabled = false;
 }
 this.setMarkDisplay(this.regionSelectEl, true);
 } else {
 if (this.disableAction=='hide') {
 if (this.regionTextEl) {
 this.regionTextEl.style.display = '';
 }
 this.regionSelectEl.style.display = 'none';
 Validation.reset(this.regionSelectEl);
 } else if (this.disableAction=='disable') {
 if (this.regionTextEl) {
 this.regionTextEl.disabled = false;
 }
 this.regionSelectEl.disabled = true;
 } else if (this.disableAction=='nullify') {
 this.regionSelectEl.options.length = 1;
 this.regionSelectEl.value = '';
 this.regionSelectEl.selectedIndex = 0;
 this.lastCountryId = '';
 }
 this.setMarkDisplay(this.regionSelectEl, false);
 }
 },

 setMarkDisplay: function(elem, display){
 elem = $(elem);
 var labelElement = elem.up(1).down('label > span.required') || 
 elem.up(2).down('label > span.required') ||
 elem.up(1).down('label.required > em') ||
 elem.up(2).down('label.required > em');
 if(labelElement) {
 display ? labelElement.show() : labelElement.hide();
 }
 }
}
/**
 * Magento
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License (AFL 3.0)
 * that is bundled with this package in the file LICENSE_AFL.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/afl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@magentocommerce.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Magento to newer
 * versions in the future. If you wish to customize Magento for your
 * needs please refer to http://www.magentocommerce.com for more information.
 *
 * @copyright Copyright (c) 2008 Irubin Consulting Inc. DBA Varien (http://www.varien.com)
 * @license http://opensource.org/licenses/afl-3.0.php Academic Free License (AFL 3.0)
 */
function toggleMenu(el, over)
{
 if (over) {
 Element.addClassName(el, 'over');
 }
 else {
 Element.removeClassName(el, 'over');
 }
}

/**
 * Magento
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License (AFL 3.0)
 * that is bundled with this package in the file LICENSE_AFL.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/afl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@magentocommerce.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Magento to newer
 * versions in the future. If you wish to customize Magento for your
 * needs please refer to http://www.magentocommerce.com for more information.
 *
 * @category Mage
 * @package Js
 * @copyright Copyright (c) 2008 Irubin Consulting Inc. DBA Varien (http://www.varien.com)
 * @license http://opensource.org/licenses/afl-3.0.php Academic Free License (AFL 3.0)
 */

var Translate = Class.create();
Translate.prototype = {
 initialize: function(data){
 this.data = $H(data);
 },

 translate : function(){
 var args = arguments;
 var text = arguments[0];

 if(this.data.get(text)){
 return this.data.get(text);
 }
 return text;
 },
 add : function() {
 if (arguments.length > 1) {
 this.data.set(arguments[0], arguments[1]);
 } else if (typeof arguments[0] =='object') {
 $H(arguments[0]).each(function (pair){
 this.data.set(pair.key, pair.value);
 }.bind(this));
 }
 }
}
/**
 * Magento
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License (AFL 3.0)
 * that is bundled with this package in the file LICENSE_AFL.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/afl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@magentocommerce.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Magento to newer
 * versions in the future. If you wish to customize Magento for your
 * needs please refer to http://www.magentocommerce.com for more information.
 *
 * @copyright Copyright (c) 2008 Irubin Consulting Inc. DBA Varien (http://www.varien.com)
 * @license http://opensource.org/licenses/afl-3.0.php Academic Free License (AFL 3.0)
 */
// old school cookie functions grabbed off the web

if (!window.Mage) var Mage = {};

Mage.Cookies = {};
Mage.Cookies.set = function(name, value){
 var argv = arguments;
 var argc = arguments.length;
 var expires = (argc > 2) ? argv[2] : null;
 var path = (argc > 3) ? argv[3] : '/';
 var domain = (argc > 4) ? argv[4] : null;
 var secure = (argc > 5) ? argv[5] : false;
 document.cookie = name + "=" + escape (value) +
 ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
 ((path == null) ? "" : ("; path=" + path)) +
 ((domain == null) ? "" : ("; domain=" + domain)) +
 ((secure == true) ? "; secure" : "");
};

Mage.Cookies.get = function(name){
 var arg = name + "=";
 var alen = arg.length;
 var clen = document.cookie.length;
 var i = 0;
 var j = 0;
 while(i < clen){
 j = i + alen;
 if (document.cookie.substring(i, j) == arg)
 return Mage.Cookies.getCookieVal(j);
 i = document.cookie.indexOf(" ", i) + 1;
 if(i == 0)
 break;
 }
 return null;
};

Mage.Cookies.clear = function(name) {
 if(Mage.Cookies.get(name)){
 document.cookie = name + "=" +
 "; expires=Thu, 01-Jan-70 00:00:01 GMT";
 }
};

Mage.Cookies.getCookieVal = function(offset){
 var endstr = document.cookie.indexOf(";", offset);
 if(endstr == -1){
 endstr = document.cookie.length;
 }
 return unescape(document.cookie.substring(offset, endstr));
};
/*
 * jQuery JavaScript Library v1.3.2
 * http://jquery.com/
 *
 * Copyright (c) 2009 John Resig
 * Dual licensed under the MIT and GPL licenses.
 * http://docs.jquery.com/License
 *
 * Date: 2009-02-19 17:34:21 -0500 (Thu, 19 Feb 2009)
 * Revision: 6246
 */
(function(){var l=this,g,y=l.jQuery,p=l.$,o=l.jQuery=l.$=function(E,F){return new o.fn.init(E,F)},D=/^[^<]*(<(.|\s)+>)[^>]*$|^#([\w-]+)$/,f=/^.[^:#\[\.,]*$/;o.fn=o.prototype={init:function(E,H){E=E||document;if(E.nodeType){this[0]=E;this.length=1;this.context=E;return this}if(typeof E==="string"){var G=D.exec(E);if(G&&(G[1]||!H)){if(G[1]){E=o.clean([G[1]],H)}else{var I=document.getElementById(G[3]);if(I&&I.id!=G[3]){return o().find(E)}var F=o(I||[]);F.context=document;F.selector=E;return F}}else{return o(H).find(E)}}else{if(o.isFunction(E)){return o(document).ready(E)}}if(E.selector&&E.context){this.selector=E.selector;this.context=E.context}return this.setArray(o.isArray(E)?E:o.makeArray(E))},selector:"",jquery:"1.3.2",size:function(){return this.length},get:function(E){return E===g?Array.prototype.slice.call(this):this[E]},pushStack:function(F,H,E){var G=o(F);G.prevObject=this;G.context=this.context;if(H==="find"){G.selector=this.selector+(this.selector?" ":"")+E}else{if(H){G.selector=this.selector+"."+H+"("+E+")"}}return G},setArray:function(E){this.length=0;Array.prototype.push.apply(this,E);return this},each:function(F,E){return o.each(this,F,E)},index:function(E){return o.inArray(E&&E.jquery?E[0]:E,this)},attr:function(F,H,G){var E=F;if(typeof F==="string"){if(H===g){return this[0]&&o[G||"attr"](this[0],F)}else{E={};E[F]=H}}return this.each(function(I){for(F in E){o.attr(G?this.style:this,F,o.prop(this,E[F],G,I,F))}})},css:function(E,F){if((E=="width"||E=="height")&&parseFloat(F)<0){F=g}return this.attr(E,F,"curCSS")},text:function(F){if(typeof F!=="object"&&F!=null){return this.empty().append((this[0]&&this[0].ownerDocument||document).createTextNode(F))}var E="";o.each(F||this,function(){o.each(this.childNodes,function(){if(this.nodeType!=8){E+=this.nodeType!=1?this.nodeValue:o.fn.text([this])}})});return E},wrapAll:function(E){if(this[0]){var F=o(E,this[0].ownerDocument).clone();if(this[0].parentNode){F.insertBefore(this[0])}F.map(function(){var G=this;while(G.firstChild){G=G.firstChild}return G}).append(this)}return this},wrapInner:function(E){return this.each(function(){o(this).contents().wrapAll(E)})},wrap:function(E){return this.each(function(){o(this).wrapAll(E)})},append:function(){return this.domManip(arguments,true,function(E){if(this.nodeType==1){this.appendChild(E)}})},prepend:function(){return this.domManip(arguments,true,function(E){if(this.nodeType==1){this.insertBefore(E,this.firstChild)}})},before:function(){return this.domManip(arguments,false,function(E){this.parentNode.insertBefore(E,this)})},after:function(){return this.domManip(arguments,false,function(E){this.parentNode.insertBefore(E,this.nextSibling)})},end:function(){return this.prevObject||o([])},push:[].push,sort:[].sort,splice:[].splice,find:function(E){if(this.length===1){var F=this.pushStack([],"find",E);F.length=0;o.find(E,this[0],F);return F}else{return this.pushStack(o.unique(o.map(this,function(G){return o.find(E,G)})),"find",E)}},clone:function(G){var E=this.map(function(){if(!o.support.noCloneEvent&&!o.isXMLDoc(this)){var I=this.outerHTML;if(!I){var J=this.ownerDocument.createElement("div");J.appendChild(this.cloneNode(true));I=J.innerHTML}return o.clean([I.replace(/ jQuery\d+="(?:\d+|null)"/g,"").replace(/^\s*/,"")])[0]}else{return this.cloneNode(true)}});if(G===true){var H=this.find("*").andSelf(),F=0;E.find("*").andSelf().each(function(){if(this.nodeName!==H[F].nodeName){return}var I=o.data(H[F],"events");for(var K in I){for(var J in I[K]){o.event.add(this,K,I[K][J],I[K][J].data)}}F++})}return E},filter:function(E){return this.pushStack(o.isFunction(E)&&o.grep(this,function(G,F){return E.call(G,F)})||o.multiFilter(E,o.grep(this,function(F){return F.nodeType===1})),"filter",E)},closest:function(E){var G=o.expr.match.POS.test(E)?o(E):null,F=0;return this.map(function(){var H=this;while(H&&H.ownerDocument){if(G?G.index(H)>-1:o(H).is(E)){o.data(H,"closest",F);return H}H=H.parentNode;F++}})},not:function(E){if(typeof E==="string"){if(f.test(E)){return this.pushStack(o.multiFilter(E,this,true),"not",E)}else{E=o.multiFilter(E,this)}}var F=E.length&&E[E.length-1]!==g&&!E.nodeType;return this.filter(function(){return F?o.inArray(this,E)<0:this!=E})},add:function(E){return this.pushStack(o.unique(o.merge(this.get(),typeof E==="string"?o(E):o.makeArray(E))))},is:function(E){return !!E&&o.multiFilter(E,this).length>0},hasClass:function(E){return !!E&&this.is("."+E)},val:function(K){if(K===g){var E=this[0];if(E){if(o.nodeName(E,"option")){return(E.attributes.value||{}).specified?E.value:E.text}if(o.nodeName(E,"select")){var I=E.selectedIndex,L=[],M=E.options,H=E.type=="select-one";if(I<0){return null}for(var F=H?I:0,J=H?I+1:M.length;F<J;F++){var G=M[F];if(G.selected){K=o(G).val();if(H){return K}L.push(K)}}return L}return(E.value||"").replace(/\r/g,"")}return g}if(typeof K==="number"){K+=""}return this.each(function(){if(this.nodeType!=1){return}if(o.isArray(K)&&/radio|checkbox/.test(this.type)){this.checked=(o.inArray(this.value,K)>=0||o.inArray(this.name,K)>=0)}else{if(o.nodeName(this,"select")){var N=o.makeArray(K);o("option",this).each(function(){this.selected=(o.inArray(this.value,N)>=0||o.inArray(this.text,N)>=0)});if(!N.length){this.selectedIndex=-1}}else{this.value=K}}})},html:function(E){return E===g?(this[0]?this[0].innerHTML.replace(/ jQuery\d+="(?:\d+|null)"/g,""):null):this.empty().append(E)},replaceWith:function(E){return this.after(E).remove()},eq:function(E){return this.slice(E,+E+1)},slice:function(){return this.pushStack(Array.prototype.slice.apply(this,arguments),"slice",Array.prototype.slice.call(arguments).join(","))},map:function(E){return this.pushStack(o.map(this,function(G,F){return E.call(G,F,G)}))},andSelf:function(){return this.add(this.prevObject)},domManip:function(J,M,L){if(this[0]){var I=(this[0].ownerDocument||this[0]).createDocumentFragment(),F=o.clean(J,(this[0].ownerDocument||this[0]),I),H=I.firstChild;if(H){for(var G=0,E=this.length;G<E;G++){L.call(K(this[G],H),this.length>1||G>0?I.cloneNode(true):I)}}if(F){o.each(F,z)}}return this;function K(N,O){return M&&o.nodeName(N,"table")&&o.nodeName(O,"tr")?(N.getElementsByTagName("tbody")[0]||N.appendChild(N.ownerDocument.createElement("tbody"))):N}}};o.fn.init.prototype=o.fn;function z(E,F){if(F.src){o.ajax({url:F.src,async:false,dataType:"script"})}else{o.globalEval(F.text||F.textContent||F.innerHTML||"")}if(F.parentNode){F.parentNode.removeChild(F)}}function e(){return +new Date}o.extend=o.fn.extend=function(){var J=arguments[0]||{},H=1,I=arguments.length,E=false,G;if(typeof J==="boolean"){E=J;J=arguments[1]||{};H=2}if(typeof J!=="object"&&!o.isFunction(J)){J={}}if(I==H){J=this;--H}for(;H<I;H++){if((G=arguments[H])!=null){for(var F in G){var K=J[F],L=G[F];if(J===L){continue}if(E&&L&&typeof L==="object"&&!L.nodeType){J[F]=o.extend(E,K||(L.length!=null?[]:{}),L)}else{if(L!==g){J[F]=L}}}}}return J};var b=/z-?index|font-?weight|opacity|zoom|line-?height/i,q=document.defaultView||{},s=Object.prototype.toString;o.extend({noConflict:function(E){l.$=p;if(E){l.jQuery=y}return o},isFunction:function(E){return s.call(E)==="[object Function]"},isArray:function(E){return s.call(E)==="[object Array]"},isXMLDoc:function(E){return E.nodeType===9&&E.documentElement.nodeName!=="HTML"||!!E.ownerDocument&&o.isXMLDoc(E.ownerDocument)},globalEval:function(G){if(G&&/\S/.test(G)){var F=document.getElementsByTagName("head")[0]||document.documentElement,E=document.createElement("script");E.type="text/javascript";if(o.support.scriptEval){E.appendChild(document.createTextNode(G))}else{E.text=G}F.insertBefore(E,F.firstChild);F.removeChild(E)}},nodeName:function(F,E){return F.nodeName&&F.nodeName.toUpperCase()==E.toUpperCase()},each:function(G,K,F){var E,H=0,I=G.length;if(F){if(I===g){for(E in G){if(K.apply(G[E],F)===false){break}}}else{for(;H<I;){if(K.apply(G[H++],F)===false){break}}}}else{if(I===g){for(E in G){if(K.call(G[E],E,G[E])===false){break}}}else{for(var J=G[0];H<I&&K.call(J,H,J)!==false;J=G[++H]){}}}return G},prop:function(H,I,G,F,E){if(o.isFunction(I)){I=I.call(H,F)}return typeof I==="number"&&G=="curCSS"&&!b.test(E)?I+"px":I},className:{add:function(E,F){o.each((F||"").split(/\s+/),function(G,H){if(E.nodeType==1&&!o.className.has(E.className,H)){E.className+=(E.className?" ":"")+H}})},remove:function(E,F){if(E.nodeType==1){E.className=F!==g?o.grep(E.className.split(/\s+/),function(G){return !o.className.has(F,G)}).join(" "):""}},has:function(F,E){return F&&o.inArray(E,(F.className||F).toString().split(/\s+/))>-1}},swap:function(H,G,I){var E={};for(var F in G){E[F]=H.style[F];H.style[F]=G[F]}I.call(H);for(var F in G){H.style[F]=E[F]}},css:function(H,F,J,E){if(F=="width"||F=="height"){var L,G={position:"absolute",visibility:"hidden",display:"block"},K=F=="width"?["Left","Right"]:["Top","Bottom"];function I(){L=F=="width"?H.offsetWidth:H.offsetHeight;if(E==="border"){return}o.each(K,function(){if(!E){L-=parseFloat(o.curCSS(H,"padding"+this,true))||0}if(E==="margin"){L+=parseFloat(o.curCSS(H,"margin"+this,true))||0}else{L-=parseFloat(o.curCSS(H,"border"+this+"Width",true))||0}})}if(H.offsetWidth!==0){I()}else{o.swap(H,G,I)}return Math.max(0,Math.round(L))}return o.curCSS(H,F,J)},curCSS:function(I,F,G){var L,E=I.style;if(F=="opacity"&&!o.support.opacity){L=o.attr(E,"opacity");return L==""?"1":L}if(F.match(/float/i)){F=w}if(!G&&E&&E[F]){L=E[F]}else{if(q.getComputedStyle){if(F.match(/float/i)){F="float"}F=F.replace(/([A-Z])/g,"-$1").toLowerCase();var M=q.getComputedStyle(I,null);if(M){L=M.getPropertyValue(F)}if(F=="opacity"&&L==""){L="1"}}else{if(I.currentStyle){var J=F.replace(/\-(\w)/g,function(N,O){return O.toUpperCase()});L=I.currentStyle[F]||I.currentStyle[J];if(!/^\d+(px)?$/i.test(L)&&/^\d/.test(L)){var H=E.left,K=I.runtimeStyle.left;I.runtimeStyle.left=I.currentStyle.left;E.left=L||0;L=E.pixelLeft+"px";E.left=H;I.runtimeStyle.left=K}}}}return L},clean:function(F,K,I){K=K||document;if(typeof K.createElement==="undefined"){K=K.ownerDocument||K[0]&&K[0].ownerDocument||document}if(!I&&F.length===1&&typeof F[0]==="string"){var H=/^<(\w+)\s*\/?>$/.exec(F[0]);if(H){return[K.createElement(H[1])]}}var G=[],E=[],L=K.createElement("div");o.each(F,function(P,S){if(typeof S==="number"){S+=""}if(!S){return}if(typeof S==="string"){S=S.replace(/(<(\w+)[^>]*?)\/>/g,function(U,V,T){return T.match(/^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i)?U:V+"></"+T+">"});var O=S.replace(/^\s+/,"").substring(0,10).toLowerCase();var Q=!O.indexOf("<opt")&&[1,"<select multiple='multiple'>","</select>"]||!O.indexOf("<leg")&&[1,"<fieldset>","</fieldset>"]||O.match(/^<(thead|tbody|tfoot|colg|cap)/)&&[1,"<table>","</table>"]||!O.indexOf("<tr")&&[2,"<table><tbody>","</tbody></table>"]||(!O.indexOf("<td")||!O.indexOf("<th"))&&[3,"<table><tbody><tr>","</tr></tbody></table>"]||!O.indexOf("<col")&&[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"]||!o.support.htmlSerialize&&[1,"div<div>","</div>"]||[0,"",""];L.innerHTML=Q[1]+S+Q[2];while(Q[0]--){L=L.lastChild}if(!o.support.tbody){var R=/<tbody/i.test(S),N=!O.indexOf("<table")&&!R?L.firstChild&&L.firstChild.childNodes:Q[1]=="<table>"&&!R?L.childNodes:[];for(var M=N.length-1;M>=0;--M){if(o.nodeName(N[M],"tbody")&&!N[M].childNodes.length){N[M].parentNode.removeChild(N[M])}}}if(!o.support.leadingWhitespace&&/^\s/.test(S)){L.insertBefore(K.createTextNode(S.match(/^\s*/)[0]),L.firstChild)}S=o.makeArray(L.childNodes)}if(S.nodeType){G.push(S)}else{G=o.merge(G,S)}});if(I){for(var J=0;G[J];J++){if(o.nodeName(G[J],"script")&&(!G[J].type||G[J].type.toLowerCase()==="text/javascript")){E.push(G[J].parentNode?G[J].parentNode.removeChild(G[J]):G[J])}else{if(G[J].nodeType===1){G.splice.apply(G,[J+1,0].concat(o.makeArray(G[J].getElementsByTagName("script"))))}I.appendChild(G[J])}}return E}return G},attr:function(J,G,K){if(!J||J.nodeType==3||J.nodeType==8){return g}var H=!o.isXMLDoc(J),L=K!==g;G=H&&o.props[G]||G;if(J.tagName){var F=/href|src|style/.test(G);if(G=="selected"&&J.parentNode){J.parentNode.selectedIndex}if(G in J&&H&&!F){if(L){if(G=="type"&&o.nodeName(J,"input")&&J.parentNode){throw"type property can't be changed"}J[G]=K}if(o.nodeName(J,"form")&&J.getAttributeNode(G)){return J.getAttributeNode(G).nodeValue}if(G=="tabIndex"){var I=J.getAttributeNode("tabIndex");return I&&I.specified?I.value:J.nodeName.match(/(button|input|object|select|textarea)/i)?0:J.nodeName.match(/^(a|area)$/i)&&J.href?0:g}return J[G]}if(!o.support.style&&H&&G=="style"){return o.attr(J.style,"cssText",K)}if(L){J.setAttribute(G,""+K)}var E=!o.support.hrefNormalized&&H&&F?J.getAttribute(G,2):J.getAttribute(G);return E===null?g:E}if(!o.support.opacity&&G=="opacity"){if(L){J.zoom=1;J.filter=(J.filter||"").replace(/alpha\([^)]*\)/,"")+(parseInt(K)+""=="NaN"?"":"alpha(opacity="+K*100+")")}return J.filter&&J.filter.indexOf("opacity=")>=0?(parseFloat(J.filter.match(/opacity=([^)]*)/)[1])/100)+"":""}G=G.replace(/-([a-z])/ig,function(M,N){return N.toUpperCase()});if(L){J[G]=K}return J[G]},trim:function(E){return(E||"").replace(/^\s+|\s+$/g,"")},makeArray:function(G){var E=[];if(G!=null){var F=G.length;if(F==null||typeof G==="string"||o.isFunction(G)||G.setInterval){E[0]=G}else{while(F){E[--F]=G[F]}}}return E},inArray:function(G,H){for(var E=0,F=H.length;E<F;E++){if(H[E]===G){return E}}return -1},merge:function(H,E){var F=0,G,I=H.length;if(!o.support.getAll){while((G=E[F++])!=null){if(G.nodeType!=8){H[I++]=G}}}else{while((G=E[F++])!=null){H[I++]=G}}return H},unique:function(K){var F=[],E={};try{for(var G=0,H=K.length;G<H;G++){var J=o.data(K[G]);if(!E[J]){E[J]=true;F.push(K[G])}}}catch(I){F=K}return F},grep:function(F,J,E){var G=[];for(var H=0,I=F.length;H<I;H++){if(!E!=!J(F[H],H)){G.push(F[H])}}return G},map:function(E,J){var F=[];for(var G=0,H=E.length;G<H;G++){var I=J(E[G],G);if(I!=null){F[F.length]=I}}return F.concat.apply([],F)}});var C=navigator.userAgent.toLowerCase();o.browser={version:(C.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)||[0,"0"])[1],safari:/webkit/.test(C),opera:/opera/.test(C),msie:/msie/.test(C)&&!/opera/.test(C),mozilla:/mozilla/.test(C)&&!/(compatible|webkit)/.test(C)};o.each({parent:function(E){return E.parentNode},parents:function(E){return o.dir(E,"parentNode")},next:function(E){return o.nth(E,2,"nextSibling")},prev:function(E){return o.nth(E,2,"previousSibling")},nextAll:function(E){return o.dir(E,"nextSibling")},prevAll:function(E){return o.dir(E,"previousSibling")},siblings:function(E){return o.sibling(E.parentNode.firstChild,E)},children:function(E){return o.sibling(E.firstChild)},contents:function(E){return o.nodeName(E,"iframe")?E.contentDocument||E.contentWindow.document:o.makeArray(E.childNodes)}},function(E,F){o.fn[E]=function(G){var H=o.map(this,F);if(G&&typeof G=="string"){H=o.multiFilter(G,H)}return this.pushStack(o.unique(H),E,G)}});o.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(E,F){o.fn[E]=function(G){var J=[],L=o(G);for(var K=0,H=L.length;K<H;K++){var I=(K>0?this.clone(true):this).get();o.fn[F].apply(o(L[K]),I);J=J.concat(I)}return this.pushStack(J,E,G)}});o.each({removeAttr:function(E){o.attr(this,E,"");if(this.nodeType==1){this.removeAttribute(E)}},addClass:function(E){o.className.add(this,E)},removeClass:function(E){o.className.remove(this,E)},toggleClass:function(F,E){if(typeof E!=="boolean"){E=!o.className.has(this,F)}o.className[E?"add":"remove"](this,F)},remove:function(E){if(!E||o.filter(E,[this]).length){o("*",this).add([this]).each(function(){o.event.remove(this);o.removeData(this)});if(this.parentNode){this.parentNode.removeChild(this)}}},empty:function(){o(this).children().remove();while(this.firstChild){this.removeChild(this.firstChild)}}},function(E,F){o.fn[E]=function(){return this.each(F,arguments)}});function j(E,F){return E[0]&&parseInt(o.curCSS(E[0],F,true),10)||0}var h="jQuery"+e(),v=0,A={};o.extend({cache:{},data:function(F,E,G){F=F==l?A:F;var H=F[h];if(!H){H=F[h]=++v}if(E&&!o.cache[H]){o.cache[H]={}}if(G!==g){o.cache[H][E]=G}return E?o.cache[H][E]:H},removeData:function(F,E){F=F==l?A:F;var H=F[h];if(E){if(o.cache[H]){delete o.cache[H][E];E="";for(E in o.cache[H]){break}if(!E){o.removeData(F)}}}else{try{delete F[h]}catch(G){if(F.removeAttribute){F.removeAttribute(h)}}delete o.cache[H]}},queue:function(F,E,H){if(F){E=(E||"fx")+"queue";var G=o.data(F,E);if(!G||o.isArray(H)){G=o.data(F,E,o.makeArray(H))}else{if(H){G.push(H)}}}return G},dequeue:function(H,G){var E=o.queue(H,G),F=E.shift();if(!G||G==="fx"){F=E[0]}if(F!==g){F.call(H)}}});o.fn.extend({data:function(E,G){var H=E.split(".");H[1]=H[1]?"."+H[1]:"";if(G===g){var F=this.triggerHandler("getData"+H[1]+"!",[H[0]]);if(F===g&&this.length){F=o.data(this[0],E)}return F===g&&H[1]?this.data(H[0]):F}else{return this.trigger("setData"+H[1]+"!",[H[0],G]).each(function(){o.data(this,E,G)})}},removeData:function(E){return this.each(function(){o.removeData(this,E)})},queue:function(E,F){if(typeof E!=="string"){F=E;E="fx"}if(F===g){return o.queue(this[0],E)}return this.each(function(){var G=o.queue(this,E,F);if(E=="fx"&&G.length==1){G[0].call(this)}})},dequeue:function(E){return this.each(function(){o.dequeue(this,E)})}});
/*
 * Sizzle CSS Selector Engine - v0.9.3
 * Copyright 2009, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 * More information: http://sizzlejs.com/
 */
(function(){var R=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?/g,L=0,H=Object.prototype.toString;var F=function(Y,U,ab,ac){ab=ab||[];U=U||document;if(U.nodeType!==1&&U.nodeType!==9){return[]}if(!Y||typeof Y!=="string"){return ab}var Z=[],W,af,ai,T,ad,V,X=true;R.lastIndex=0;while((W=R.exec(Y))!==null){Z.push(W[1]);if(W[2]){V=RegExp.rightContext;break}}if(Z.length>1&&M.exec(Y)){if(Z.length===2&&I.relative[Z[0]]){af=J(Z[0]+Z[1],U)}else{af=I.relative[Z[0]]?[U]:F(Z.shift(),U);while(Z.length){Y=Z.shift();if(I.relative[Y]){Y+=Z.shift()}af=J(Y,af)}}}else{var ae=ac?{expr:Z.pop(),set:E(ac)}:F.find(Z.pop(),Z.length===1&&U.parentNode?U.parentNode:U,Q(U));af=F.filter(ae.expr,ae.set);if(Z.length>0){ai=E(af)}else{X=false}while(Z.length){var ah=Z.pop(),ag=ah;if(!I.relative[ah]){ah=""}else{ag=Z.pop()}if(ag==null){ag=U}I.relative[ah](ai,ag,Q(U))}}if(!ai){ai=af}if(!ai){throw"Syntax error, unrecognized expression: "+(ah||Y)}if(H.call(ai)==="[object Array]"){if(!X){ab.push.apply(ab,ai)}else{if(U.nodeType===1){for(var aa=0;ai[aa]!=null;aa++){if(ai[aa]&&(ai[aa]===true||ai[aa].nodeType===1&&K(U,ai[aa]))){ab.push(af[aa])}}}else{for(var aa=0;ai[aa]!=null;aa++){if(ai[aa]&&ai[aa].nodeType===1){ab.push(af[aa])}}}}}else{E(ai,ab)}if(V){F(V,U,ab,ac);if(G){hasDuplicate=false;ab.sort(G);if(hasDuplicate){for(var aa=1;aa<ab.length;aa++){if(ab[aa]===ab[aa-1]){ab.splice(aa--,1)}}}}}return ab};F.matches=function(T,U){return F(T,null,null,U)};F.find=function(aa,T,ab){var Z,X;if(!aa){return[]}for(var W=0,V=I.order.length;W<V;W++){var Y=I.order[W],X;if((X=I.match[Y].exec(aa))){var U=RegExp.leftContext;if(U.substr(U.length-1)!=="\\"){X[1]=(X[1]||"").replace(/\\/g,"");Z=I.find[Y](X,T,ab);if(Z!=null){aa=aa.replace(I.match[Y],"");break}}}}if(!Z){Z=T.getElementsByTagName("*")}return{set:Z,expr:aa}};F.filter=function(ad,ac,ag,W){var V=ad,ai=[],aa=ac,Y,T,Z=ac&&ac[0]&&Q(ac[0]);while(ad&&ac.length){for(var ab in I.filter){if((Y=I.match[ab].exec(ad))!=null){var U=I.filter[ab],ah,af;T=false;if(aa==ai){ai=[]}if(I.preFilter[ab]){Y=I.preFilter[ab](Y,aa,ag,ai,W,Z);if(!Y){T=ah=true}else{if(Y===true){continue}}}if(Y){for(var X=0;(af=aa[X])!=null;X++){if(af){ah=U(af,Y,X,aa);var ae=W^!!ah;if(ag&&ah!=null){if(ae){T=true}else{aa[X]=false}}else{if(ae){ai.push(af);T=true}}}}}if(ah!==g){if(!ag){aa=ai}ad=ad.replace(I.match[ab],"");if(!T){return[]}break}}}if(ad==V){if(T==null){throw"Syntax error, unrecognized expression: "+ad}else{break}}V=ad}return aa};var I=F.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF_-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF_-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*_-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF_-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(T){return T.getAttribute("href")}},relative:{"+":function(aa,T,Z){var X=typeof T==="string",ab=X&&!/\W/.test(T),Y=X&&!ab;if(ab&&!Z){T=T.toUpperCase()}for(var W=0,V=aa.length,U;W<V;W++){if((U=aa[W])){while((U=U.previousSibling)&&U.nodeType!==1){}aa[W]=Y||U&&U.nodeName===T?U||false:U===T}}if(Y){F.filter(T,aa,true)}},">":function(Z,U,aa){var X=typeof U==="string";if(X&&!/\W/.test(U)){U=aa?U:U.toUpperCase();for(var V=0,T=Z.length;V<T;V++){var Y=Z[V];if(Y){var W=Y.parentNode;Z[V]=W.nodeName===U?W:false}}}else{for(var V=0,T=Z.length;V<T;V++){var Y=Z[V];if(Y){Z[V]=X?Y.parentNode:Y.parentNode===U}}if(X){F.filter(U,Z,true)}}},"":function(W,U,Y){var V=L++,T=S;if(!U.match(/\W/)){var X=U=Y?U:U.toUpperCase();T=P}T("parentNode",U,V,W,X,Y)},"~":function(W,U,Y){var V=L++,T=S;if(typeof U==="string"&&!U.match(/\W/)){var X=U=Y?U:U.toUpperCase();T=P}T("previousSibling",U,V,W,X,Y)}},find:{ID:function(U,V,W){if(typeof V.getElementById!=="undefined"&&!W){var T=V.getElementById(U[1]);return T?[T]:[]}},NAME:function(V,Y,Z){if(typeof Y.getElementsByName!=="undefined"){var U=[],X=Y.getElementsByName(V[1]);for(var W=0,T=X.length;W<T;W++){if(X[W].getAttribute("name")===V[1]){U.push(X[W])}}return U.length===0?null:U}},TAG:function(T,U){return U.getElementsByTagName(T[1])}},preFilter:{CLASS:function(W,U,V,T,Z,aa){W=" "+W[1].replace(/\\/g,"")+" ";if(aa){return W}for(var X=0,Y;(Y=U[X])!=null;X++){if(Y){if(Z^(Y.className&&(" "+Y.className+" ").indexOf(W)>=0)){if(!V){T.push(Y)}}else{if(V){U[X]=false}}}}return false},ID:function(T){return T[1].replace(/\\/g,"")},TAG:function(U,T){for(var V=0;T[V]===false;V++){}return T[V]&&Q(T[V])?U[1]:U[1].toUpperCase()},CHILD:function(T){if(T[1]=="nth"){var U=/(-?)(\d*)n((?:\+|-)?\d*)/.exec(T[2]=="even"&&"2n"||T[2]=="odd"&&"2n+1"||!/\D/.test(T[2])&&"0n+"+T[2]||T[2]);T[2]=(U[1]+(U[2]||1))-0;T[3]=U[3]-0}T[0]=L++;return T},ATTR:function(X,U,V,T,Y,Z){var W=X[1].replace(/\\/g,"");if(!Z&&I.attrMap[W]){X[1]=I.attrMap[W]}if(X[2]==="~="){X[4]=" "+X[4]+" "}return X},PSEUDO:function(X,U,V,T,Y){if(X[1]==="not"){if(X[3].match(R).length>1||/^\w/.test(X[3])){X[3]=F(X[3],null,null,U)}else{var W=F.filter(X[3],U,V,true^Y);if(!V){T.push.apply(T,W)}return false}}else{if(I.match.POS.test(X[0])||I.match.CHILD.test(X[0])){return true}}return X},POS:function(T){T.unshift(true);return T}},filters:{enabled:function(T){return T.disabled===false&&T.type!=="hidden"},disabled:function(T){return T.disabled===true},checked:function(T){return T.checked===true},selected:function(T){T.parentNode.selectedIndex;return T.selected===true},parent:function(T){return !!T.firstChild},empty:function(T){return !T.firstChild},has:function(V,U,T){return !!F(T[3],V).length},header:function(T){return/h\d/i.test(T.nodeName)},text:function(T){return"text"===T.type},radio:function(T){return"radio"===T.type},checkbox:function(T){return"checkbox"===T.type},file:function(T){return"file"===T.type},password:function(T){return"password"===T.type},submit:function(T){return"submit"===T.type},image:function(T){return"image"===T.type},reset:function(T){return"reset"===T.type},button:function(T){return"button"===T.type||T.nodeName.toUpperCase()==="BUTTON"},input:function(T){return/input|select|textarea|button/i.test(T.nodeName)}},setFilters:{first:function(U,T){return T===0},last:function(V,U,T,W){return U===W.length-1},even:function(U,T){return T%2===0},odd:function(U,T){return T%2===1},lt:function(V,U,T){return U<T[3]-0},gt:function(V,U,T){return U>T[3]-0},nth:function(V,U,T){return T[3]-0==U},eq:function(V,U,T){return T[3]-0==U}},filter:{PSEUDO:function(Z,V,W,aa){var U=V[1],X=I.filters[U];if(X){return X(Z,W,V,aa)}else{if(U==="contains"){return(Z.textContent||Z.innerText||"").indexOf(V[3])>=0}else{if(U==="not"){var Y=V[3];for(var W=0,T=Y.length;W<T;W++){if(Y[W]===Z){return false}}return true}}}},CHILD:function(T,W){var Z=W[1],U=T;switch(Z){case"only":case"first":while(U=U.previousSibling){if(U.nodeType===1){return false}}if(Z=="first"){return true}U=T;case"last":while(U=U.nextSibling){if(U.nodeType===1){return false}}return true;case"nth":var V=W[2],ac=W[3];if(V==1&&ac==0){return true}var Y=W[0],ab=T.parentNode;if(ab&&(ab.sizcache!==Y||!T.nodeIndex)){var X=0;for(U=ab.firstChild;U;U=U.nextSibling){if(U.nodeType===1){U.nodeIndex=++X}}ab.sizcache=Y}var aa=T.nodeIndex-ac;if(V==0){return aa==0}else{return(aa%V==0&&aa/V>=0)}}},ID:function(U,T){return U.nodeType===1&&U.getAttribute("id")===T},TAG:function(U,T){return(T==="*"&&U.nodeType===1)||U.nodeName===T},CLASS:function(U,T){return(" "+(U.className||U.getAttribute("class"))+" ").indexOf(T)>-1},ATTR:function(Y,W){var V=W[1],T=I.attrHandle[V]?I.attrHandle[V](Y):Y[V]!=null?Y[V]:Y.getAttribute(V),Z=T+"",X=W[2],U=W[4];return T==null?X==="!=":X==="="?Z===U:X==="*="?Z.indexOf(U)>=0:X==="~="?(" "+Z+" ").indexOf(U)>=0:!U?Z&&T!==false:X==="!="?Z!=U:X==="^="?Z.indexOf(U)===0:X==="$="?Z.substr(Z.length-U.length)===U:X==="|="?Z===U||Z.substr(0,U.length+1)===U+"-":false},POS:function(X,U,V,Y){var T=U[2],W=I.setFilters[T];if(W){return W(X,V,U,Y)}}}};var M=I.match.POS;for(var O in I.match){I.match[O]=RegExp(I.match[O].source+/(?![^\[]*\])(?![^\(]*\))/.source)}var E=function(U,T){U=Array.prototype.slice.call(U);if(T){T.push.apply(T,U);return T}return U};try{Array.prototype.slice.call(document.documentElement.childNodes)}catch(N){E=function(X,W){var U=W||[];if(H.call(X)==="[object Array]"){Array.prototype.push.apply(U,X)}else{if(typeof X.length==="number"){for(var V=0,T=X.length;V<T;V++){U.push(X[V])}}else{for(var V=0;X[V];V++){U.push(X[V])}}}return U}}var G;if(document.documentElement.compareDocumentPosition){G=function(U,T){var V=U.compareDocumentPosition(T)&4?-1:U===T?0:1;if(V===0){hasDuplicate=true}return V}}else{if("sourceIndex" in document.documentElement){G=function(U,T){var V=U.sourceIndex-T.sourceIndex;if(V===0){hasDuplicate=true}return V}}else{if(document.createRange){G=function(W,U){var V=W.ownerDocument.createRange(),T=U.ownerDocument.createRange();V.selectNode(W);V.collapse(true);T.selectNode(U);T.collapse(true);var X=V.compareBoundaryPoints(Range.START_TO_END,T);if(X===0){hasDuplicate=true}return X}}}}(function(){var U=document.createElement("form"),V="script"+(new Date).getTime();U.innerHTML="<input name='"+V+"'/>";var T=document.documentElement;T.insertBefore(U,T.firstChild);if(!!document.getElementById(V)){I.find.ID=function(X,Y,Z){if(typeof Y.getElementById!=="undefined"&&!Z){var W=Y.getElementById(X[1]);return W?W.id===X[1]||typeof W.getAttributeNode!=="undefined"&&W.getAttributeNode("id").nodeValue===X[1]?[W]:g:[]}};I.filter.ID=function(Y,W){var X=typeof Y.getAttributeNode!=="undefined"&&Y.getAttributeNode("id");return Y.nodeType===1&&X&&X.nodeValue===W}}T.removeChild(U)})();(function(){var T=document.createElement("div");T.appendChild(document.createComment(""));if(T.getElementsByTagName("*").length>0){I.find.TAG=function(U,Y){var X=Y.getElementsByTagName(U[1]);if(U[1]==="*"){var W=[];for(var V=0;X[V];V++){if(X[V].nodeType===1){W.push(X[V])}}X=W}return X}}T.innerHTML="<a href='#'></a>";if(T.firstChild&&typeof T.firstChild.getAttribute!=="undefined"&&T.firstChild.getAttribute("href")!=="#"){I.attrHandle.href=function(U){return U.getAttribute("href",2)}}})();if(document.querySelectorAll){(function(){var T=F,U=document.createElement("div");U.innerHTML="<p class='TEST'></p>";if(U.querySelectorAll&&U.querySelectorAll(".TEST").length===0){return}F=function(Y,X,V,W){X=X||document;if(!W&&X.nodeType===9&&!Q(X)){try{return E(X.querySelectorAll(Y),V)}catch(Z){}}return T(Y,X,V,W)};F.find=T.find;F.filter=T.filter;F.selectors=T.selectors;F.matches=T.matches})()}if(document.getElementsByClassName&&document.documentElement.getElementsByClassName){(function(){var T=document.createElement("div");T.innerHTML="<div class='test e'></div><div class='test'></div>";if(T.getElementsByClassName("e").length===0){return}T.lastChild.className="e";if(T.getElementsByClassName("e").length===1){return}I.order.splice(1,0,"CLASS");I.find.CLASS=function(U,V,W){if(typeof V.getElementsByClassName!=="undefined"&&!W){return V.getElementsByClassName(U[1])}}})()}function P(U,Z,Y,ad,aa,ac){var ab=U=="previousSibling"&&!ac;for(var W=0,V=ad.length;W<V;W++){var T=ad[W];if(T){if(ab&&T.nodeType===1){T.sizcache=Y;T.sizset=W}T=T[U];var X=false;while(T){if(T.sizcache===Y){X=ad[T.sizset];break}if(T.nodeType===1&&!ac){T.sizcache=Y;T.sizset=W}if(T.nodeName===Z){X=T;break}T=T[U]}ad[W]=X}}}function S(U,Z,Y,ad,aa,ac){var ab=U=="previousSibling"&&!ac;for(var W=0,V=ad.length;W<V;W++){var T=ad[W];if(T){if(ab&&T.nodeType===1){T.sizcache=Y;T.sizset=W}T=T[U];var X=false;while(T){if(T.sizcache===Y){X=ad[T.sizset];break}if(T.nodeType===1){if(!ac){T.sizcache=Y;T.sizset=W}if(typeof Z!=="string"){if(T===Z){X=true;break}}else{if(F.filter(Z,[T]).length>0){X=T;break}}}T=T[U]}ad[W]=X}}}var K=document.compareDocumentPosition?function(U,T){return U.compareDocumentPosition(T)&16}:function(U,T){return U!==T&&(U.contains?U.contains(T):true)};var Q=function(T){return T.nodeType===9&&T.documentElement.nodeName!=="HTML"||!!T.ownerDocument&&Q(T.ownerDocument)};var J=function(T,aa){var W=[],X="",Y,V=aa.nodeType?[aa]:aa;while((Y=I.match.PSEUDO.exec(T))){X+=Y[0];T=T.replace(I.match.PSEUDO,"")}T=I.relative[T]?T+"*":T;for(var Z=0,U=V.length;Z<U;Z++){F(T,V[Z],W)}return F.filter(X,W)};o.find=F;o.filter=F.filter;o.expr=F.selectors;o.expr[":"]=o.expr.filters;F.selectors.filters.hidden=function(T){return T.offsetWidth===0||T.offsetHeight===0};F.selectors.filters.visible=function(T){return T.offsetWidth>0||T.offsetHeight>0};F.selectors.filters.animated=function(T){return o.grep(o.timers,function(U){return T===U.elem}).length};o.multiFilter=function(V,T,U){if(U){V=":not("+V+")"}return F.matches(V,T)};o.dir=function(V,U){var T=[],W=V[U];while(W&&W!=document){if(W.nodeType==1){T.push(W)}W=W[U]}return T};o.nth=function(X,T,V,W){T=T||1;var U=0;for(;X;X=X[V]){if(X.nodeType==1&&++U==T){break}}return X};o.sibling=function(V,U){var T=[];for(;V;V=V.nextSibling){if(V.nodeType==1&&V!=U){T.push(V)}}return T};return;l.Sizzle=F})();o.event={add:function(I,F,H,K){if(I.nodeType==3||I.nodeType==8){return}if(I.setInterval&&I!=l){I=l}if(!H.guid){H.guid=this.guid++}if(K!==g){var G=H;H=this.proxy(G);H.data=K}var E=o.data(I,"events")||o.data(I,"events",{}),J=o.data(I,"handle")||o.data(I,"handle",function(){return typeof o!=="undefined"&&!o.event.triggered?o.event.handle.apply(arguments.callee.elem,arguments):g});J.elem=I;o.each(F.split(/\s+/),function(M,N){var O=N.split(".");N=O.shift();H.type=O.slice().sort().join(".");var L=E[N];if(o.event.specialAll[N]){o.event.specialAll[N].setup.call(I,K,O)}if(!L){L=E[N]={};if(!o.event.special[N]||o.event.special[N].setup.call(I,K,O)===false){if(I.addEventListener){I.addEventListener(N,J,false)}else{if(I.attachEvent){I.attachEvent("on"+N,J)}}}}L[H.guid]=H;o.event.global[N]=true});I=null},guid:1,global:{},remove:function(K,H,J){if(K.nodeType==3||K.nodeType==8){return}var G=o.data(K,"events"),F,E;if(G){if(H===g||(typeof H==="string"&&H.charAt(0)==".")){for(var I in G){this.remove(K,I+(H||""))}}else{if(H.type){J=H.handler;H=H.type}o.each(H.split(/\s+/),function(M,O){var Q=O.split(".");O=Q.shift();var N=RegExp("(^|\\.)"+Q.slice().sort().join(".*\\.")+"(\\.|$)");if(G[O]){if(J){delete G[O][J.guid]}else{for(var P in G[O]){if(N.test(G[O][P].type)){delete G[O][P]}}}if(o.event.specialAll[O]){o.event.specialAll[O].teardown.call(K,Q)}for(F in G[O]){break}if(!F){if(!o.event.special[O]||o.event.special[O].teardown.call(K,Q)===false){if(K.removeEventListener){K.removeEventListener(O,o.data(K,"handle"),false)}else{if(K.detachEvent){K.detachEvent("on"+O,o.data(K,"handle"))}}}F=null;delete G[O]}}})}for(F in G){break}if(!F){var L=o.data(K,"handle");if(L){L.elem=null}o.removeData(K,"events");o.removeData(K,"handle")}}},trigger:function(I,K,H,E){var G=I.type||I;if(!E){I=typeof I==="object"?I[h]?I:o.extend(o.Event(G),I):o.Event(G);if(G.indexOf("!")>=0){I.type=G=G.slice(0,-1);I.exclusive=true}if(!H){I.stopPropagation();if(this.global[G]){o.each(o.cache,function(){if(this.events&&this.events[G]){o.event.trigger(I,K,this.handle.elem)}})}}if(!H||H.nodeType==3||H.nodeType==8){return g}I.result=g;I.target=H;K=o.makeArray(K);K.unshift(I)}I.currentTarget=H;var J=o.data(H,"handle");if(J){J.apply(H,K)}if((!H[G]||(o.nodeName(H,"a")&&G=="click"))&&H["on"+G]&&H["on"+G].apply(H,K)===false){I.result=false}if(!E&&H[G]&&!I.isDefaultPrevented()&&!(o.nodeName(H,"a")&&G=="click")){this.triggered=true;try{H[G]()}catch(L){}}this.triggered=false;if(!I.isPropagationStopped()){var F=H.parentNode||H.ownerDocument;if(F){o.event.trigger(I,K,F,true)}}},handle:function(K){var J,E;K=arguments[0]=o.event.fix(K||l.event);K.currentTarget=this;var L=K.type.split(".");K.type=L.shift();J=!L.length&&!K.exclusive;var I=RegExp("(^|\\.)"+L.slice().sort().join(".*\\.")+"(\\.|$)");E=(o.data(this,"events")||{})[K.type];for(var G in E){var H=E[G];if(J||I.test(H.type)){K.handler=H;K.data=H.data;var F=H.apply(this,arguments);if(F!==g){K.result=F;if(F===false){K.preventDefault();K.stopPropagation()}}if(K.isImmediatePropagationStopped()){break}}}},props:"altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),fix:function(H){if(H[h]){return H}var F=H;H=o.Event(F);for(var G=this.props.length,J;G;){J=this.props[--G];H[J]=F[J]}if(!H.target){H.target=H.srcElement||document}if(H.target.nodeType==3){H.target=H.target.parentNode}if(!H.relatedTarget&&H.fromElement){H.relatedTarget=H.fromElement==H.target?H.toElement:H.fromElement}if(H.pageX==null&&H.clientX!=null){var I=document.documentElement,E=document.body;H.pageX=H.clientX+(I&&I.scrollLeft||E&&E.scrollLeft||0)-(I.clientLeft||0);H.pageY=H.clientY+(I&&I.scrollTop||E&&E.scrollTop||0)-(I.clientTop||0)}if(!H.which&&((H.charCode||H.charCode===0)?H.charCode:H.keyCode)){H.which=H.charCode||H.keyCode}if(!H.metaKey&&H.ctrlKey){H.metaKey=H.ctrlKey}if(!H.which&&H.button){H.which=(H.button&1?1:(H.button&2?3:(H.button&4?2:0)))}return H},proxy:function(F,E){E=E||function(){return F.apply(this,arguments)};E.guid=F.guid=F.guid||E.guid||this.guid++;return E},special:{ready:{setup:B,teardown:function(){}}},specialAll:{live:{setup:function(E,F){o.event.add(this,F[0],c)},teardown:function(G){if(G.length){var E=0,F=RegExp("(^|\\.)"+G[0]+"(\\.|$)");o.each((o.data(this,"events").live||{}),function(){if(F.test(this.type)){E++}});if(E<1){o.event.remove(this,G[0],c)}}}}}};o.Event=function(E){if(!this.preventDefault){return new o.Event(E)}if(E&&E.type){this.originalEvent=E;this.type=E.type}else{this.type=E}this.timeStamp=e();this[h]=true};function k(){return false}function u(){return true}o.Event.prototype={preventDefault:function(){this.isDefaultPrevented=u;var E=this.originalEvent;if(!E){return}if(E.preventDefault){E.preventDefault()}E.returnValue=false},stopPropagation:function(){this.isPropagationStopped=u;var E=this.originalEvent;if(!E){return}if(E.stopPropagation){E.stopPropagation()}E.cancelBubble=true},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=u;this.stopPropagation()},isDefaultPrevented:k,isPropagationStopped:k,isImmediatePropagationStopped:k};var a=function(F){var E=F.relatedTarget;while(E&&E!=this){try{E=E.parentNode}catch(G){E=this}}if(E!=this){F.type=F.data;o.event.handle.apply(this,arguments)}};o.each({mouseover:"mouseenter",mouseout:"mouseleave"},function(F,E){o.event.special[E]={setup:function(){o.event.add(this,F,a,E)},teardown:function(){o.event.remove(this,F,a)}}});o.fn.extend({bind:function(F,G,E){return F=="unload"?this.one(F,G,E):this.each(function(){o.event.add(this,F,E||G,E&&G)})},one:function(G,H,F){var E=o.event.proxy(F||H,function(I){o(this).unbind(I,E);return(F||H).apply(this,arguments)});return this.each(function(){o.event.add(this,G,E,F&&H)})},unbind:function(F,E){return this.each(function(){o.event.remove(this,F,E)})},trigger:function(E,F){return this.each(function(){o.event.trigger(E,F,this)})},triggerHandler:function(E,G){if(this[0]){var F=o.Event(E);F.preventDefault();F.stopPropagation();o.event.trigger(F,G,this[0]);return F.result}},toggle:function(G){var E=arguments,F=1;while(F<E.length){o.event.proxy(G,E[F++])}return this.click(o.event.proxy(G,function(H){this.lastToggle=(this.lastToggle||0)%F;H.preventDefault();return E[this.lastToggle++].apply(this,arguments)||false}))},hover:function(E,F){return this.mouseenter(E).mouseleave(F)},ready:function(E){B();if(o.isReady){E.call(document,o)}else{o.readyList.push(E)}return this},live:function(G,F){var E=o.event.proxy(F);E.guid+=this.selector+G;o(document).bind(i(G,this.selector),this.selector,E);return this},die:function(F,E){o(document).unbind(i(F,this.selector),E?{guid:E.guid+this.selector+F}:null);return this}});function c(H){var E=RegExp("(^|\\.)"+H.type+"(\\.|$)"),G=true,F=[];o.each(o.data(this,"events").live||[],function(I,J){if(E.test(J.type)){var K=o(H.target).closest(J.data)[0];if(K){F.push({elem:K,fn:J})}}});F.sort(function(J,I){return o.data(J.elem,"closest")-o.data(I.elem,"closest")});o.each(F,function(){if(this.fn.call(this.elem,H,this.fn.data)===false){return(G=false)}});return G}function i(F,E){return["live",F,E.replace(/\./g,"`").replace(/ /g,"|")].join(".")}o.extend({isReady:false,readyList:[],ready:function(){if(!o.isReady){o.isReady=true;if(o.readyList){o.each(o.readyList,function(){this.call(document,o)});o.readyList=null}o(document).triggerHandler("ready")}}});var x=false;function B(){if(x){return}x=true;if(document.addEventListener){document.addEventListener("DOMContentLoaded",function(){document.removeEventListener("DOMContentLoaded",arguments.callee,false);o.ready()},false)}else{if(document.attachEvent){document.attachEvent("onreadystatechange",function(){if(document.readyState==="complete"){document.detachEvent("onreadystatechange",arguments.callee);o.ready()}});if(document.documentElement.doScroll&&l==l.top){(function(){if(o.isReady){return}try{document.documentElement.doScroll("left")}catch(E){setTimeout(arguments.callee,0);return}o.ready()})()}}}o.event.add(l,"load",o.ready)}o.each(("blur,focus,load,resize,scroll,unload,click,dblclick,mousedown,mouseup,mousemove,mouseover,mouseout,mouseenter,mouseleave,change,select,submit,keydown,keypress,keyup,error").split(","),function(F,E){o.fn[E]=function(G){return G?this.bind(E,G):this.trigger(E)}});o(l).bind("unload",function(){for(var E in o.cache){if(E!=1&&o.cache[E].handle){o.event.remove(o.cache[E].handle.elem)}}});(function(){o.support={};var F=document.documentElement,G=document.createElement("script"),K=document.createElement("div"),J="script"+(new Date).getTime();K.style.display="none";K.innerHTML=' <link/><table></table><a href="/a" style="color:red;float:left;opacity:.5;">a</a><select><option>text</option></select><object><param/></object>';var H=K.getElementsByTagName("*"),E=K.getElementsByTagName("a")[0];if(!H||!H.length||!E){return}o.support={leadingWhitespace:K.firstChild.nodeType==3,tbody:!K.getElementsByTagName("tbody").length,objectAll:!!K.getElementsByTagName("object")[0].getElementsByTagName("*").length,htmlSerialize:!!K.getElementsByTagName("link").length,style:/red/.test(E.getAttribute("style")),hrefNormalized:E.getAttribute("href")==="/a",opacity:E.style.opacity==="0.5",cssFloat:!!E.style.cssFloat,scriptEval:false,noCloneEvent:true,boxModel:null};G.type="text/javascript";try{G.appendChild(document.createTextNode("window."+J+"=1;"))}catch(I){}F.insertBefore(G,F.firstChild);if(l[J]){o.support.scriptEval=true;delete l[J]}F.removeChild(G);if(K.attachEvent&&K.fireEvent){K.attachEvent("onclick",function(){o.support.noCloneEvent=false;K.detachEvent("onclick",arguments.callee)});K.cloneNode(true).fireEvent("onclick")}o(function(){var L=document.createElement("div");L.style.width=L.style.paddingLeft="1px";document.body.appendChild(L);o.boxModel=o.support.boxModel=L.offsetWidth===2;document.body.removeChild(L).style.display="none"})})();var w=o.support.cssFloat?"cssFloat":"styleFloat";o.props={"for":"htmlFor","class":"className","float":w,cssFloat:w,styleFloat:w,readonly:"readOnly",maxlength:"maxLength",cellspacing:"cellSpacing",rowspan:"rowSpan",tabindex:"tabIndex"};o.fn.extend({_load:o.fn.load,load:function(G,J,K){if(typeof G!=="string"){return this._load(G)}var I=G.indexOf(" ");if(I>=0){var E=G.slice(I,G.length);G=G.slice(0,I)}var H="GET";if(J){if(o.isFunction(J)){K=J;J=null}else{if(typeof J==="object"){J=o.param(J);H="POST"}}}var F=this;o.ajax({url:G,type:H,dataType:"html",data:J,complete:function(M,L){if(L=="success"||L=="notmodified"){F.html(E?o("<div/>").append(M.responseText.replace(/<script(.|\s)*?\/script>/g,"")).find(E):M.responseText)}if(K){F.each(K,[M.responseText,L,M])}}});return this},serialize:function(){return o.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?o.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||/select|textarea/i.test(this.nodeName)||/text|hidden|password|search/i.test(this.type))}).map(function(E,F){var G=o(this).val();return G==null?null:o.isArray(G)?o.map(G,function(I,H){return{name:F.name,value:I}}):{name:F.name,value:G}}).get()}});o.each("ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(","),function(E,F){o.fn[F]=function(G){return this.bind(F,G)}});var r=e();o.extend({get:function(E,G,H,F){if(o.isFunction(G)){H=G;G=null}return o.ajax({type:"GET",url:E,data:G,success:H,dataType:F})},getScript:function(E,F){return o.get(E,null,F,"script")},getJSON:function(E,F,G){return o.get(E,F,G,"json")},post:function(E,G,H,F){if(o.isFunction(G)){H=G;G={}}return o.ajax({type:"POST",url:E,data:G,success:H,dataType:F})},ajaxSetup:function(E){o.extend(o.ajaxSettings,E)},ajaxSettings:{url:location.href,global:true,type:"GET",contentType:"application/x-www-form-urlencoded",processData:true,async:true,xhr:function(){return l.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest()},accepts:{xml:"application/xml, text/xml",html:"text/html",script:"text/javascript, application/javascript",json:"application/json, text/javascript",text:"text/plain",_default:"*/*"}},lastModified:{},ajax:function(M){M=o.extend(true,M,o.extend(true,{},o.ajaxSettings,M));var W,F=/=\?(&|$)/g,R,V,G=M.type.toUpperCase();if(M.data&&M.processData&&typeof M.data!=="string"){M.data=o.param(M.data)}if(M.dataType=="jsonp"){if(G=="GET"){if(!M.url.match(F)){M.url+=(M.url.match(/\?/)?"&":"?")+(M.jsonp||"callback")+"=?"}}else{if(!M.data||!M.data.match(F)){M.data=(M.data?M.data+"&":"")+(M.jsonp||"callback")+"=?"}}M.dataType="json"}if(M.dataType=="json"&&(M.data&&M.data.match(F)||M.url.match(F))){W="jsonp"+r++;if(M.data){M.data=(M.data+"").replace(F,"="+W+"$1")}M.url=M.url.replace(F,"="+W+"$1");M.dataType="script";l[W]=function(X){V=X;I();L();l[W]=g;try{delete l[W]}catch(Y){}if(H){H.removeChild(T)}}}if(M.dataType=="script"&&M.cache==null){M.cache=false}if(M.cache===false&&G=="GET"){var E=e();var U=M.url.replace(/(\?|&)_=.*?(&|$)/,"$1_="+E+"$2");M.url=U+((U==M.url)?(M.url.match(/\?/)?"&":"?")+"_="+E:"")}if(M.data&&G=="GET"){M.url+=(M.url.match(/\?/)?"&":"?")+M.data;M.data=null}if(M.global&&!o.active++){o.event.trigger("ajaxStart")}var Q=/^(\w+:)?\/\/([^\/?#]+)/.exec(M.url);if(M.dataType=="script"&&G=="GET"&&Q&&(Q[1]&&Q[1]!=location.protocol||Q[2]!=location.host)){var H=document.getElementsByTagName("head")[0];var T=document.createElement("script");T.src=M.url;if(M.scriptCharset){T.charset=M.scriptCharset}if(!W){var O=false;T.onload=T.onreadystatechange=function(){if(!O&&(!this.readyState||this.readyState=="loaded"||this.readyState=="complete")){O=true;I();L();T.onload=T.onreadystatechange=null;H.removeChild(T)}}}H.appendChild(T);return g}var K=false;var J=M.xhr();if(M.username){J.open(G,M.url,M.async,M.username,M.password)}else{J.open(G,M.url,M.async)}try{if(M.data){J.setRequestHeader("Content-Type",M.contentType)}if(M.ifModified){J.setRequestHeader("If-Modified-Since",o.lastModified[M.url]||"Thu, 01 Jan 1970 00:00:00 GMT")}J.setRequestHeader("X-Requested-With","XMLHttpRequest");J.setRequestHeader("Accept",M.dataType&&M.accepts[M.dataType]?M.accepts[M.dataType]+", */*":M.accepts._default)}catch(S){}if(M.beforeSend&&M.beforeSend(J,M)===false){if(M.global&&!--o.active){o.event.trigger("ajaxStop")}J.abort();return false}if(M.global){o.event.trigger("ajaxSend",[J,M])}var N=function(X){if(J.readyState==0){if(P){clearInterval(P);P=null;if(M.global&&!--o.active){o.event.trigger("ajaxStop")}}}else{if(!K&&J&&(J.readyState==4||X=="timeout")){K=true;if(P){clearInterval(P);P=null}R=X=="timeout"?"timeout":!o.httpSuccess(J)?"error":M.ifModified&&o.httpNotModified(J,M.url)?"notmodified":"success";if(R=="success"){try{V=o.httpData(J,M.dataType,M)}catch(Z){R="parsererror"}}if(R=="success"){var Y;try{Y=J.getResponseHeader("Last-Modified")}catch(Z){}if(M.ifModified&&Y){o.lastModified[M.url]=Y}if(!W){I()}}else{o.handleError(M,J,R)}L();if(X){J.abort()}if(M.async){J=null}}}};if(M.async){var P=setInterval(N,13);if(M.timeout>0){setTimeout(function(){if(J&&!K){N("timeout")}},M.timeout)}}try{J.send(M.data)}catch(S){o.handleError(M,J,null,S)}if(!M.async){N()}function I(){if(M.success){M.success(V,R)}if(M.global){o.event.trigger("ajaxSuccess",[J,M])}}function L(){if(M.complete){M.complete(J,R)}if(M.global){o.event.trigger("ajaxComplete",[J,M])}if(M.global&&!--o.active){o.event.trigger("ajaxStop")}}return J},handleError:function(F,H,E,G){if(F.error){F.error(H,E,G)}if(F.global){o.event.trigger("ajaxError",[H,F,G])}},active:0,httpSuccess:function(F){try{return !F.status&&location.protocol=="file:"||(F.status>=200&&F.status<300)||F.status==304||F.status==1223}catch(E){}return false},httpNotModified:function(G,E){try{var H=G.getResponseHeader("Last-Modified");return G.status==304||H==o.lastModified[E]}catch(F){}return false},httpData:function(J,H,G){var F=J.getResponseHeader("content-type"),E=H=="xml"||!H&&F&&F.indexOf("xml")>=0,I=E?J.responseXML:J.responseText;if(E&&I.documentElement.tagName=="parsererror"){throw"parsererror"}if(G&&G.dataFilter){I=G.dataFilter(I,H)}if(typeof I==="string"){if(H=="script"){o.globalEval(I)}if(H=="json"){I=l["eval"]("("+I+")")}}return I},param:function(E){var G=[];function H(I,J){G[G.length]=encodeURIComponent(I)+"="+encodeURIComponent(J)}if(o.isArray(E)||E.jquery){o.each(E,function(){H(this.name,this.value)})}else{for(var F in E){if(o.isArray(E[F])){o.each(E[F],function(){H(F,this)})}else{H(F,o.isFunction(E[F])?E[F]():E[F])}}}return G.join("&").replace(/%20/g,"+")}});var m={},n,d=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]];function t(F,E){var G={};o.each(d.concat.apply([],d.slice(0,E)),function(){G[this]=F});return G}o.fn.extend({show:function(J,L){if(J){return this.animate(t("show",3),J,L)}else{for(var H=0,F=this.length;H<F;H++){var E=o.data(this[H],"olddisplay");this[H].style.display=E||"";if(o.css(this[H],"display")==="none"){var G=this[H].tagName,K;if(m[G]){K=m[G]}else{var I=o("<"+G+" />").appendTo("body");K=I.css("display");if(K==="none"){K="block"}I.remove();m[G]=K}o.data(this[H],"olddisplay",K)}}for(var H=0,F=this.length;H<F;H++){this[H].style.display=o.data(this[H],"olddisplay")||""}return this}},hide:function(H,I){if(H){return this.animate(t("hide",3),H,I)}else{for(var G=0,F=this.length;G<F;G++){var E=o.data(this[G],"olddisplay");if(!E&&E!=="none"){o.data(this[G],"olddisplay",o.css(this[G],"display"))}}for(var G=0,F=this.length;G<F;G++){this[G].style.display="none"}return this}},_toggle:o.fn.toggle,toggle:function(G,F){var E=typeof G==="boolean";return o.isFunction(G)&&o.isFunction(F)?this._toggle.apply(this,arguments):G==null||E?this.each(function(){var H=E?G:o(this).is(":hidden");o(this)[H?"show":"hide"]()}):this.animate(t("toggle",3),G,F)},fadeTo:function(E,G,F){return this.animate({opacity:G},E,F)},animate:function(I,F,H,G){var E=o.speed(F,H,G);return this[E.queue===false?"each":"queue"](function(){var K=o.extend({},E),M,L=this.nodeType==1&&o(this).is(":hidden"),J=this;for(M in I){if(I[M]=="hide"&&L||I[M]=="show"&&!L){return K.complete.call(this)}if((M=="height"||M=="width")&&this.style){K.display=o.css(this,"display");K.overflow=this.style.overflow}}if(K.overflow!=null){this.style.overflow="hidden"}K.curAnim=o.extend({},I);o.each(I,function(O,S){var R=new o.fx(J,K,O);if(/toggle|show|hide/.test(S)){R[S=="toggle"?L?"show":"hide":S](I)}else{var Q=S.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),T=R.cur(true)||0;if(Q){var N=parseFloat(Q[2]),P=Q[3]||"px";if(P!="px"){J.style[O]=(N||1)+P;T=((N||1)/R.cur(true))*T;J.style[O]=T+P}if(Q[1]){N=((Q[1]=="-="?-1:1)*N)+T}R.custom(T,N,P)}else{R.custom(T,S,"")}}});return true})},stop:function(F,E){var G=o.timers;if(F){this.queue([])}this.each(function(){for(var H=G.length-1;H>=0;H--){if(G[H].elem==this){if(E){G[H](true)}G.splice(H,1)}}});if(!E){this.dequeue()}return this}});o.each({slideDown:t("show",1),slideUp:t("hide",1),slideToggle:t("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"}},function(E,F){o.fn[E]=function(G,H){return this.animate(F,G,H)}});o.extend({speed:function(G,H,F){var E=typeof G==="object"?G:{complete:F||!F&&H||o.isFunction(G)&&G,duration:G,easing:F&&H||H&&!o.isFunction(H)&&H};E.duration=o.fx.off?0:typeof E.duration==="number"?E.duration:o.fx.speeds[E.duration]||o.fx.speeds._default;E.old=E.complete;E.complete=function(){if(E.queue!==false){o(this).dequeue()}if(o.isFunction(E.old)){E.old.call(this)}};return E},easing:{linear:function(G,H,E,F){return E+F*G},swing:function(G,H,E,F){return((-Math.cos(G*Math.PI)/2)+0.5)*F+E}},timers:[],fx:function(F,E,G){this.options=E;this.elem=F;this.prop=G;if(!E.orig){E.orig={}}}});o.fx.prototype={update:function(){if(this.options.step){this.options.step.call(this.elem,this.now,this)}(o.fx.step[this.prop]||o.fx.step._default)(this);if((this.prop=="height"||this.prop=="width")&&this.elem.style){this.elem.style.display="block"}},cur:function(F){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null)){return this.elem[this.prop]}var E=parseFloat(o.css(this.elem,this.prop,F));return E&&E>-10000?E:parseFloat(o.curCSS(this.elem,this.prop))||0},custom:function(I,H,G){this.startTime=e();this.start=I;this.end=H;this.unit=G||this.unit||"px";this.now=this.start;this.pos=this.state=0;var E=this;function F(J){return E.step(J)}F.elem=this.elem;if(F()&&o.timers.push(F)&&!n){n=setInterval(function(){var K=o.timers;for(var J=0;J<K.length;J++){if(!K[J]()){K.splice(J--,1)}}if(!K.length){clearInterval(n);n=g}},13)}},show:function(){this.options.orig[this.prop]=o.attr(this.elem.style,this.prop);this.options.show=true;this.custom(this.prop=="width"||this.prop=="height"?1:0,this.cur());o(this.elem).show()},hide:function(){this.options.orig[this.prop]=o.attr(this.elem.style,this.prop);this.options.hide=true;this.custom(this.cur(),0)},step:function(H){var G=e();if(H||G>=this.options.duration+this.startTime){this.now=this.end;this.pos=this.state=1;this.update();this.options.curAnim[this.prop]=true;var E=true;for(var F in this.options.curAnim){if(this.options.curAnim[F]!==true){E=false}}if(E){if(this.options.display!=null){this.elem.style.overflow=this.options.overflow;this.elem.style.display=this.options.display;if(o.css(this.elem,"display")=="none"){this.elem.style.display="block"}}if(this.options.hide){o(this.elem).hide()}if(this.options.hide||this.options.show){for(var I in this.options.curAnim){o.attr(this.elem.style,I,this.options.orig[I])}}this.options.complete.call(this.elem)}return false}else{var J=G-this.startTime;this.state=J/this.options.duration;this.pos=o.easing[this.options.easing||(o.easing.swing?"swing":"linear")](this.state,J,0,1,this.options.duration);this.now=this.start+((this.end-this.start)*this.pos);this.update()}return true}};o.extend(o.fx,{speeds:{slow:600,fast:200,_default:400},step:{opacity:function(E){o.attr(E.elem.style,"opacity",E.now)},_default:function(E){if(E.elem.style&&E.elem.style[E.prop]!=null){E.elem.style[E.prop]=E.now+E.unit}else{E.elem[E.prop]=E.now}}}});if(document.documentElement.getBoundingClientRect){o.fn.offset=function(){if(!this[0]){return{top:0,left:0}}if(this[0]===this[0].ownerDocument.body){return o.offset.bodyOffset(this[0])}var G=this[0].getBoundingClientRect(),J=this[0].ownerDocument,F=J.body,E=J.documentElement,L=E.clientTop||F.clientTop||0,K=E.clientLeft||F.clientLeft||0,I=G.top+(self.pageYOffset||o.boxModel&&E.scrollTop||F.scrollTop)-L,H=G.left+(self.pageXOffset||o.boxModel&&E.scrollLeft||F.scrollLeft)-K;return{top:I,left:H}}}else{o.fn.offset=function(){if(!this[0]){return{top:0,left:0}}if(this[0]===this[0].ownerDocument.body){return o.offset.bodyOffset(this[0])}o.offset.initialized||o.offset.initialize();var J=this[0],G=J.offsetParent,F=J,O=J.ownerDocument,M,H=O.documentElement,K=O.body,L=O.defaultView,E=L.getComputedStyle(J,null),N=J.offsetTop,I=J.offsetLeft;while((J=J.parentNode)&&J!==K&&J!==H){M=L.getComputedStyle(J,null);N-=J.scrollTop,I-=J.scrollLeft;if(J===G){N+=J.offsetTop,I+=J.offsetLeft;if(o.offset.doesNotAddBorder&&!(o.offset.doesAddBorderForTableAndCells&&/^t(able|d|h)$/i.test(J.tagName))){N+=parseInt(M.borderTopWidth,10)||0,I+=parseInt(M.borderLeftWidth,10)||0}F=G,G=J.offsetParent}if(o.offset.subtractsBorderForOverflowNotVisible&&M.overflow!=="visible"){N+=parseInt(M.borderTopWidth,10)||0,I+=parseInt(M.borderLeftWidth,10)||0}E=M}if(E.position==="relative"||E.position==="static"){N+=K.offsetTop,I+=K.offsetLeft}if(E.position==="fixed"){N+=Math.max(H.scrollTop,K.scrollTop),I+=Math.max(H.scrollLeft,K.scrollLeft)}return{top:N,left:I}}}o.offset={initialize:function(){if(this.initialized){return}var L=document.body,F=document.createElement("div"),H,G,N,I,M,E,J=L.style.marginTop,K='<div style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;"><div></div></div><table style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;" cellpadding="0" cellspacing="0"><tr><td></td></tr></table>';M={position:"absolute",top:0,left:0,margin:0,border:0,width:"1px",height:"1px",visibility:"hidden"};for(E in M){F.style[E]=M[E]}F.innerHTML=K;L.insertBefore(F,L.firstChild);H=F.firstChild,G=H.firstChild,I=H.nextSibling.firstChild.firstChild;this.doesNotAddBorder=(G.offsetTop!==5);this.doesAddBorderForTableAndCells=(I.offsetTop===5);H.style.overflow="hidden",H.style.position="relative";this.subtractsBorderForOverflowNotVisible=(G.offsetTop===-5);L.style.marginTop="1px";this.doesNotIncludeMarginInBodyOffset=(L.offsetTop===0);L.style.marginTop=J;L.removeChild(F);this.initialized=true},bodyOffset:function(E){o.offset.initialized||o.offset.initialize();var G=E.offsetTop,F=E.offsetLeft;if(o.offset.doesNotIncludeMarginInBodyOffset){G+=parseInt(o.curCSS(E,"marginTop",true),10)||0,F+=parseInt(o.curCSS(E,"marginLeft",true),10)||0}return{top:G,left:F}}};o.fn.extend({position:function(){var I=0,H=0,F;if(this[0]){var G=this.offsetParent(),J=this.offset(),E=/^body|html$/i.test(G[0].tagName)?{top:0,left:0}:G.offset();J.top-=j(this,"marginTop");J.left-=j(this,"marginLeft");E.top+=j(G,"borderTopWidth");E.left+=j(G,"borderLeftWidth");F={top:J.top-E.top,left:J.left-E.left}}return F},offsetParent:function(){var E=this[0].offsetParent||document.body;while(E&&(!/^body|html$/i.test(E.tagName)&&o.css(E,"position")=="static")){E=E.offsetParent}return o(E)}});o.each(["Left","Top"],function(F,E){var G="scroll"+E;o.fn[G]=function(H){if(!this[0]){return null}return H!==g?this.each(function(){this==l||this==document?l.scrollTo(!F?H:o(l).scrollLeft(),F?H:o(l).scrollTop()):this[G]=H}):this[0]==l||this[0]==document?self[F?"pageYOffset":"pageXOffset"]||o.boxModel&&document.documentElement[G]||document.body[G]:this[0][G]}});o.each(["Height","Width"],function(I,G){var E=I?"Left":"Top",H=I?"Right":"Bottom",F=G.toLowerCase();o.fn["inner"+G]=function(){return this[0]?o.css(this[0],F,false,"padding"):null};o.fn["outer"+G]=function(K){return this[0]?o.css(this[0],F,false,K?"margin":"border"):null};var J=G.toLowerCase();o.fn[J]=function(K){return this[0]==l?document.compatMode=="CSS1Compat"&&document.documentElement["client"+G]||document.body["client"+G]:this[0]==document?Math.max(document.documentElement["client"+G],document.body["scroll"+G],document.documentElement["scroll"+G],document.body["offset"+G],document.documentElement["offset"+G]):K===g?(this.length?o.css(this[0],J):null):this.css(J,typeof K==="string"?K:K+"px")}})})();
// -----------------------------------------------------------------------------
// Utility functions for menu & menuwidget widgets. This file is meant to be
// compatible with published sites as well as within the editor (i.e. this
// file is a way to share/re-use code for menu widgets on published sites or
// within the editor).
// -----------------------------------------------------------------------------
(function($) {
 if (!($.iv)) { $.extend({ iv: {} }); }

 $.fn.iv_menu_util = function(options) {
 return this.each(function() {
 new jQuery.iv.menu_util(this, options);
 });
 };

 $.fn.iv_menu_util_show_sub_menu = function(menu, parent_menu) {
 return this.each(function() {
 jQuery.data(this, 'menu_util').show_sub_menu(menu, parent_menu);
 });
 };

 $.fn.iv_menu_util_hide_sub_menus = function(args) {
 return this.each(function() {
 jQuery.data(this, 'menu_util').hide_sub_menus(args);
 });
 };

 $.fn.iv_menu_util_expand = function(args) {
 return this.each(function() {
 jQuery.data(this, 'menu_util').expand(args);
 });
 };

 $.fn.iv_menu_util_collapse = function(args) {
 return this.each(function() {
 jQuery.data(this, 'menu_util').collapse(args);
 });
 };

 $.fn.iv_menu_util_menu_type = function() {
 return jQuery.data(this[0], 'menu_util').menu_type();
 };

 $.fn.iv_menu_util_in_editor = function(in_editor) {
 return this.each(function() {
 jQuery.data(this, 'menu_util').in_editor(in_editor);
 });
 };

 // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 // Menu Util
 // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 $.iv.menu_util = function(el, options) {
 jQuery.data(el, 'menu_util', this);

 options = $.extend({
 auto_hide: true, // auto-hide menu items
 in_editor: false,
 globals: {
 open_sub_menus: [],
 current_menu_item: null,
 current_parent_menu: null,
 hide_timeouts: []
 }
 }, options);

 var $$ = $(el); // the menu widget
 var $sub_menus = null;
 var next_submenu_index = 0;
 var prev_menu_type = null;
 var menu_types = {
 phone: 'box_menu'
 };

 // public methods
 this.show_sub_menu = _show_sub_menu;
 this.hide_sub_menus = _hide_sub_menus;
 this.expand = _expand;
 this.collapse = _collapse;
 this.menu_type = _menu_type;
 this.in_editor = _in_editor;

 // ---------------------------------------------------------------------------
 function _in_editor(in_editor) {
 if (typeof(in_editor) !== 'undefined') {
 options.in_editor = in_editor;
 }

 return options.in_editor;
 }

 // ---------------------------------------------------------------------------
 function _get_doc_height() {
 if (!options.in_editor) {
 var D = document;
 return Math.max(
 Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
 Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
 Math.max(D.body.clientHeight, D.documentElement.clientHeight)
 );
 }

 return $('#editor_page').height();
 }

 // ---------------------------------------------------------------------------
 function _get_doc_width() {
 if (!options.in_editor) {
 return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
 }

 return $('#editor_content').width() - $.iv.scrollbar_width();
 }

 // ---------------------------------------------------------------------------
 function _menu_type() {
 if ($('#__res_main_nav_label', $$).css('display') != 'none') {
 return 'box_menu';
 }

 return 'default';
 }

 // ---------------------------------------------------------------------------
 function _is_using_responsive_menu() {
 if ($$.hasClass('b_menu')) {
 var $breakpoints = jQuery('head meta[name="breakpoints"]');
 
 if ($breakpoints.length == 1) {
 var widths = $breakpoints.prop('content').split(',');
 var $res_menu = jQuery('#__res_main_nav_label'); // responsive menu label
 
 for (var i=0; i<widths.length; i++) {
 var doc_width = _get_doc_width();
 
 if (doc_width <= widths[i]) {
 if ($res_menu &&
 $res_menu.length == 1 &&
 $res_menu.css('display') != 'none') {
 $$.removeClass('default_menu').addClass('box_menu');
 return true;
 }
 }
 }
 }
 }

 $$.removeClass('box_menu').addClass('default_menu');
 
 return false;
 }

 // ---------------------------------------------------------------------------
 function _show_sub_menu(menu, parent_menu) {
 // TODO: Fix this line. Menuwidget submenus do not show!
 if (_is_using_responsive_menu()) { return; }
 
 // clear all timeouts
 while (options.globals.hide_timeouts.length) {
 clearTimeout(options.globals.hide_timeouts.pop());
 }

// COMMENTED: Now using CSS to show/hide submenus
// // auto-hide menu items
// if (options.auto_hide) {
// if (options.globals.open_sub_menus.length) {
// if (parent_menu == options.globals.current_parent_menu) {
// var open_sub_menu = options.globals.open_sub_menus.pop();
// open_sub_menu.css("visibility", "hidden");
// }
// else if (!parent_menu) {
// while (options.globals.open_sub_menus.length) {
// var open_sub_menu = options.globals.open_sub_menus.pop();
// open_sub_menu.css("visibility", "hidden");
// }
// }
// }
// }
 
 // track the current parent menu
 options.globals.current_parent_menu = parent_menu;

 var id = jQuery(menu).attr("id");
 var ul = jQuery("#sub_"+id);
 var div_parent = ul.parents("div:first");
 var padding_left = parseInt(jQuery(menu).css("padding-left").replace(/px/, ""));
 var padding_right = parseInt(jQuery(menu).css("padding-right").replace(/px/, ""));
 var padding_top = parseInt(jQuery(menu).css("padding-top").replace(/px/, ""));
 var padding_bottom = parseInt(jQuery(menu).css("padding-bottom").replace(/px/, ""));
 var ul_padding_left = parseInt(ul.css("padding-left").replace(/px/, ""));
 var ul_padding_right = parseInt(ul.css("padding-right").replace(/px/, ""));
 var ul_padding_top = parseInt(ul.css("padding-top").replace(/px/, ""));
 var ul_padding_bottom = parseInt(ul.css("padding-bottom").replace(/px/, ""));
 var menu_position = (ul.attr('menu_position'))?ul.attr('menu_position'):null;

// COMMENTED: Now using CSS to show/hide submenus
// if (options.auto_hide) {
// options.globals.open_sub_menus.push(ul);
// }
 
 if (menu_position == 'top') {
 if (parent_menu) {
 // Sub sub menu & beyond
 
 // if submenu will expand past bottom of the page, move up instead
 if (jQuery(menu).offset().top + jQuery(menu).height() + ul_padding_top + ul_padding_bottom + ul.height() > _get_doc_height()) {
 ul.css("top", jQuery(menu).position().top - ul.height() + jQuery(menu).height() + padding_top + padding_bottom);
 } else {
 ul.css("top", jQuery(menu).position().top - ul_padding_top);
 }
 
 // If submenu goes off screen, move left instead.
 if (jQuery(menu).offset().left + jQuery(menu).width() + padding_left + padding_right + ul.width() > _get_doc_width()) {
 ul.css("left", jQuery(menu).position().left - ul.width());
 }
 else {
 ul.css("left", jQuery(menu).position().left + jQuery(menu).width() + padding_left + padding_right);
 }
 } else {
 // Initial submenu
 var ul_top;
 if (div_parent.css('position')) {
 var li = jQuery(menu);
 // Add 35 from activation bar
 if (li.position().top + li.height() + padding_top + padding_bottom + ul.height() + 35 > _get_doc_height()) {
 ul_top = li.position().top - ul.height();
 } else {
 // Get li height, not div
 ul_top = li.position().top + li.height() + padding_top + padding_bottom;
 }
 }
 
 ul.css("top", ul_top);
 if (jQuery(menu).offset().left - ul_padding_left + ul.width() > _get_doc_width()) {
 // If submenu goes off screen, move left instead.
 ul.css("left", _get_doc_width() - ul.width());
 }
 else {
 ul.css("left", jQuery(menu).position().left - ul_padding_left);
 }
 }
 }
 else if (menu_position == 'left') {
 if (parent_menu) {
 if (jQuery(menu).offset().top + ul_padding_bottom + ul_padding_top + ul.height() > _get_doc_height()) {
 ul.css("top", jQuery(menu).position().top - ul.height() + jQuery(menu).height() + padding_top + padding_bottom);
 } else {
 ul.css("top", jQuery(menu).position().top - ul_padding_top);
 }
 }
 else {
 // Initial submenu
 if (jQuery(menu).position().top - padding_top + ul.height() > _get_doc_height()) {
 ul.css("top", _get_doc_height() - ul.height() - padding_top); 
 } else {
 ul.css("top", jQuery(menu).position().top);
 }
 }
 if (jQuery(menu).offset().left + jQuery(menu).width() + padding_left + padding_right + ul.width() > _get_doc_width()) {
 ul.css("left", jQuery(menu).position().left - ul.width());
 if (ul.offset().left < 0) { ul.css("left", 0); }
 }
 else {
 ul.css("left", jQuery(menu).position().left + jQuery(menu).width() + padding_left + padding_right);
 if (ul.offset().left + ul.width() > _get_doc_width()) {
 ul.css("left", jQuery(menu).position().left - ul.width());
 if (ul.offset().left < 0) { ul.css("left", 0); }
 }
 }
 //ul.css("left", jQuery(menu).position().left + jQuery(menu).width() + padding_left + padding_right);
 }
 else if (menu_position == 'right') {
 var ul_width = jQuery(ul).width();
 var max_width = 400;
 if (ul_width >= max_width) { ul_width = max_width; jQuery(ul).width(max_width) }
 ul.css("top", jQuery(menu).position().top - ul_padding_top);
 var left;
 if (jQuery(menu).offset().left - ul_width - ul_padding_left - ul_padding_right < 0) {
 left = jQuery(menu).position().left + ul_width + ul_padding_left + ul_padding_right;
 } else {
 left = jQuery(menu).position().left - ul_width - ul_padding_left - ul_padding_right;
 }
 ul.css("left", left);
 }
 else if (menu_position == 'bottom') {
 if (parent_menu) {
 // Sub sub menu & beyond
 ul.css("top", jQuery(menu).position().top - ul.height() + jQuery(menu).height());
 // If submenu goes off screen, move left instead.
 if (jQuery(menu).offset().left + jQuery(menu).width() + padding_left + padding_right + ul.width() > _get_doc_width()) {
 ul.css("left", jQuery(menu).position().left - ul.width());
 }
 else {
 ul.css("left", jQuery(menu).position().left + jQuery(menu).width() + padding_left + padding_right);
 }
 } else {
 // Initial submenu
 var ul_top;
 if (div_parent.css('position')) {
 var li = jQuery(menu);
 ul_top = li.position().top - padding_top - ul.height();
 }
 
 ul.css("top", ul_top);
 if (jQuery(menu).offset().left - ul_padding_left + ul.width() > _get_doc_width()) {
 // If submenu goes off screen, move left instead.
 ul.css("left", _get_doc_width() - ul.width());
 }
 else {
 ul.css("left", jQuery(menu).position().left - ul_padding_left);
 }
 }
 }

// COMMENTED: Now using CSS to show/hide submenus
// ul.css("visibility", "visible")
 ul.css("position", "absolute")
 .css("z-index", 50000)
 .show();
 
 jQuery('a', ul).css('float', 'none');

 // Handle menus that overlap video widgets
 // ---------------------------------------
 var $sub_menu = jQuery('.sub_menu', parent_menu);
 var sub_menu_rect = ($sub_menu[0]) ? $sub_menu[0].getBoundingClientRect() : undefined;

 jQuery('div[block_type="video"] video').each(function() {
 var overlap = false;
 if (sub_menu_rect) {
 // Check for overlapping. If video/menu overlap then
 // force pause.
 var video_rect = this.getBoundingClientRect();
 overlap = !(sub_menu_rect.right < video_rect.left ||
 sub_menu_rect.left > video_rect.right ||
 sub_menu_rect.bottom < video_rect.top ||
 sub_menu_rect.top > video_rect.bottom);
 }
 if (overlap) {
 jQuery(this).get(0).pause();
 }
 });

 if (!jQuery('div[block_type="video"] video').hasClass('vjs-tech')) {
 jQuery('div[block_type="video"] video').addClass('hidden');
 jQuery('div[block_type="video"] img.video_preview').removeClass('hidden');
 }
 // ---------------------------------------
 }

 // ---------------------------------------------------------------------------
 function _hide_sub_menus(args) {
// COMMENTED: Now using CSS to show/hide submenus
// if (_is_using_responsive_menu()) { return; }
//
// args = args || {};
//
// var now = args['now'];
// var time = (now)?1:500;
//
// options.globals.hide_timeouts.push(setTimeout(function () {
// if (!options.globals.current_menu_item) {
// while (options.globals.open_sub_menus.length) {
// var open_sub_menu = options.globals.open_sub_menus.pop();
// open_sub_menu.css("visibility", "hidden");
// jQuery('.video video').removeClass('hidden');
// jQuery('.video img.video_preview').addClass('hidden');
// }
// }
// }, time));
 }

 // -------------------------------------------------------------------------
 function _expand(args) {
 args = args || {};

 var menu_type = _menu_type();

 if (prev_menu_type !== menu_type) {
 _collapse(args);
 prev_menu_type = menu_type;
 }

 switch(menu_type) {
 case 'box_menu':
 _expand_for_box_menu(args);
 break;
 default:
 _expand_for_default(args);
 }
 }

 // -------------------------------------------------------------------------
 function _expand_for_box_menu(args) {
 args = args || {};

 var $menu = $$;
 var menu_type = _menu_type();

 if (!$sub_menus) {
 $sub_menus = $('ul', $menu);
 next_submenu_index = 0;
 }

 var $ul = null;
 var $prev_ul = null;
 var prev_index = next_submenu_index - 1;

 // the next ul to show
 if ($sub_menus.length) {
 if ($sub_menus.length - 1 < next_submenu_index) {
 _collapse({
 menu_type: menu_type,
 keep_submenus: true
 });
 }

 $ul = $($sub_menus[next_submenu_index]);
 }
 else {
 return _collapse({ menu_type: menu_type });
 }

 // the previous ul
 if ($sub_menus.length - 2 >= prev_index) {
 $prev_ul = $($sub_menus[prev_index]);
 }

 if ($ul) {
 var ul_id = $ul[0].id;
 var $parent_ul = ($ul.hasClass('sub_menu'))?$ul.parents('ul'):null;

 if ($parent_ul && $parent_ul.length > 0) {
 // if the previous ul exists and is not the root ul and is not the
 // same as the parent ul, we need to hide the previous ul and possibly
 // its parents
 if (prev_index !== 0 &&
 $prev_ul &&
 $prev_ul.length > 0 &&
 $parent_ul[0].id !== $prev_ul[0].id) {
 var $cb = $($prev_ul.prevAll('input[type="checkbox"]')[0]);
 $cb.removeAttr('checked');

 var parents = $prev_ul.parents('ul.sub_menu');
 for (var idx=0; idx<parents.length; idx++) {
 if (parents[idx].id !== $parent_ul[0].id) {
 var $cb = $($(parents[idx]).prevAll('input[type="checkbox"]')[0]);
 $cb.removeAttr('checked');
 }
 else {
 break;
 }
 }
 }
 }

 // clear inline styles
 $ul.removeAttr('style');

 // show the next sub menu
 var $cb = $($ul.prevAll('input[type="checkbox"]')[0]);
 $cb.attr('checked', 'checked');

 // show the sub view
 $ul.css('visibility', 'visible');

 next_submenu_index += 1;
 }
 }

 // -------------------------------------------------------------------------
 function _expand_for_default(args) {
 args = args || {};

 var $menu = $$;

 if (!$sub_menus) {
 $sub_menus = $('ul.sub_menu', $menu);
 next_submenu_index = 0;
 }

 var $ul = null;
 var $prev_ul = null;
 var prev_index = next_submenu_index - 1;

 // the next ul to show
 if ($sub_menus.length) {
 if ($sub_menus.length - 1 < next_submenu_index) {
 _collapse({ keep_submenus: true });
 }

 $ul = $($sub_menus[next_submenu_index]);
 }
 else {
 return _collapse();
 }

 // the previous ul
 if ($sub_menus.length - 2 >= prev_index) {
 $prev_ul = $($sub_menus[prev_index]);
 }

 if ($ul) {
 var ul_id = $ul[0].id;
 var a_id = ul_id.replace('sub_', '');
 var $submenu = $('#'+a_id, $menu);
 var parent_menu = null;
 var $parent_ul = $submenu.parents('ul');

 if ($parent_ul.length > 0) {
 // if the previous ul exists and is not the same as the parent ul,
 // we need to hide the previous ul and possibly its parents
 if ($prev_ul && $prev_ul.length > 0 && $parent_ul[0].id !== $prev_ul[0].id) {
 $prev_ul.hide().css('visibility', '');
 var parents = $prev_ul.parents('ul.sub_menu');
 for (var idx=0; idx<parents.length; idx++) {
 if (parents[idx].id !== $parent_ul[0].id) {
 $(parents[idx]).hide().css('visibility', '');
 }
 else {
 break;
 }
 }
 }

 // get the actual parent element
 if ($parent_ul.hasClass('sub_menu')) {
 var parent_id = $parent_ul[0].id.replace('sub_', '');
 var $parent_menu = $('#'+parent_id, $menu);
 parent_menu = $parent_menu[0];
 }
 }

 // position the next sub menu
 _show_sub_menu($submenu[0], parent_menu);

 // show the sub view
 $ul.css('visibility', 'visible');

 next_submenu_index += 1;
 }
 }

 // -------------------------------------------------------------------------
 function _collapse(args) {
 args = args || {};

 var menu_type = _menu_type();

 switch(menu_type) {
 case 'box_menu':
 _collapse_for_box_menu(args);
 break;
 default:
 _collapse_for_default(args);
 }
 }

 // -------------------------------------------------------------------------
 function _collapse_for_box_menu(args) {
 args = args || {};

 var $menu = $$;

 $('input[type="checkbox"]', $menu).each(function() {
 $(this).removeAttr('checked');
 });

 $('ul li ul', $menu).each(function() {
 $(this).hide().css('visibility', '');
 });

 if (!args['keep_submenus']) { $sub_menus = null; }

 next_submenu_index = 0;
 }

 // -------------------------------------------------------------------------
 function _collapse_for_default(args) {
 args = args || {};

 var $menu = $$;

 // Don't collapse menu trees
 if ($('div.menuwidget_vertical_tree', $menu)[0]) {
 return;
 }
 
 $('ul li ul', $menu).each(function() {
 $(this).hide().css('visibility', '');
 });

 if (!args['keep_submenus']) { $sub_menus = null; }

 next_submenu_index = 0;
 }

 // ---------------------------------------------------------------------------
 };

})(jQuery);

// -------------------------------------------
// This file is for website menu blocks
// It is needed for the display on published sites
// This only works for single menus. Will need to be changed for menu widgets
// -------------------------------------------

var _iv_menu_globals = {
 open_sub_menus: [],
 current_menu_item: null,
 current_parent_menu: null,
 hide_timeouts: [],
 prev_window_width: 0
};

// wait until the DOM is ready before creating objects
jQuery(document).ready(function() {
 // all menu and menuwidget widgets should have menu_util objects
 jQuery('div.b_menu').iv_menu_util({ globals: _iv_menu_globals });
 jQuery('div.b_menuwidget').iv_menu_util({ globals: _iv_menu_globals });
});

// Helper function used by the dimensions and offset modules
function num(elem, prop) {
 return elem[0] && parseInt( jQuery.css(elem[0], prop, true), 10 ) || 0;
}

function _on_responsive_resize() {
 var $res_menu = jQuery('#__res_main_nav_label'); // responsive menu label

 if ($res_menu && $res_menu.length == 1 && _iv_menu_globals.prev_window_width != jQuery(window).width()) {
 jQuery('ul li ul', $res_menu.parent()).hide();
 jQuery('input[type="checkbox"]:checked', $res_menu.parent()).prop('checked', false);
 }
}

function _init_responsive_menu() {
 var $res_menu = jQuery('#__res_main_nav_label'); // responsive menu label

 _iv_menu_globals.prev_window_width = jQuery(window).width();

 if ($res_menu && $res_menu.length == 1) {
 jQuery(window).unbind('resize', _on_responsive_resize).resize(_on_responsive_resize);

 var clear_styles = function($obj) {
 $obj.parent().find('ul').removeAttr('style');
 $obj.parent().find('ul li').removeAttr('style');
 $obj.parent().find('ul li a').removeAttr('style');
 };

 $res_menu.unbind().click(function() { clear_styles(jQuery(this)); });

 jQuery('.res_main_nav_label_child', $res_menu.parent()).unbind().click(function() {
 clear_styles(jQuery(this));
 });
 }
}

function _show_sub_menu(menu, parent_menu) {
 var widget_div = (jQuery(menu).parents('.b_menu')[0])
 ?jQuery(menu).parents('.b_menu')[0]
 :jQuery(menu).parents('.b_menuwidget')[0];
 jQuery(widget_div).iv_menu_util_show_sub_menu(menu, parent_menu);
}

function _hide_sub_menus(now) {
 jQuery('div.b_menu').each(function() {
 jQuery(this).iv_menu_util_hide_sub_menus({
 now: now
 });
 });
 jQuery('div.b_menuwidget').each(function() {
 jQuery(this).iv_menu_util_hide_sub_menus({
 now: now
 });
 });
}

// ===========================================================
// NOTE: ALL JQUERY IN THIS FILE MUST BE NO CONFLICT
// ===========================================================
(function(jQuery) {
 if(!(jQuery.iv)){
 jQuery.extend({ iv: {} });
 }

 // ===========================================================
 // START PHOTOGALLERY
 // ===========================================================
 jQuery.fn.iv_photogallery = function(options) {
 return this.each(function() {
 new jQuery.iv.photogallery(this, options);
 });
 }

 jQuery.iv.photogallery = function(el, options) {

/*
 options = jQuery.extend({ 
 // gallery id
 photogallery_id : null,
 
 // Data Vars
 display_options : null,
 image_list : null,
 gallery_dropdowns : null,

 // Button Names
 left_button_name : null,
 right_button_name : null,
 pause_button_name : null, 

 // Container names
 order_num_container_name : null,
 images_container_name : null,
 ul_name : null,
 description_container_name : null,
 p_name : null,
 loading_container_name : null,

 current_page_num_name : null,
 max_page_num_name : null,
 show_description : null,
 autoplay : null,
 type : null,

 txtImage : null,
 txtOf : null

 }, options);

*/

 photogallery_id : null;
 display_options : null;
 image_list : null;
 gallery_dropdowns : null;
 left_button_name : null;
 right_button_name : null;
 pause_button_name : null;
 order_num_container_name : null;
 images_container_name : null;
 ul_name : null;
 description_container_name : null;
 p_name : null;
 loading_container_name : null;
 current_page_num_name : null;
 max_page_num_name : null;
 show_description : null;
 autoplay : null;
 type : null;
 txtImage : null;
 txtOf : null;


 // This will append it to the overall div.
 jQuery.data(el, 'photogallery_' + options.photogallery_id, this);

 // Start vars
 var $$ = jQuery(el);

 // rot_ctr1_bod_ctr3_bod_wrp1_blk3_blk2 
 var $parent_div = $$.parent().parent();

 // Containers
 var $images_container = jQuery('div.' + options.images_container_name, $$);
 var $ul_container = jQuery('ul.' + options.ul_name, $$);
 var $description_container = jQuery('div.' + options.description_container_name, $$);
 var $p_container = jQuery('p.' + options.p_name, $$);
 var $loading_container = jQuery('div.' + options.loading_container_name, $$);
 var $order_num_container = jQuery('#' + options.order_num_container_name, $$);

 // Need to know current_page_number and total_pages
 var $pagination_container = jQuery('div.pagination_container', $$);
 var $pagination_current_container = jQuery('span.pagination_current', $$);
 var $pagination_total_container = jQuery('span.pagination_total', $$);

 var $current_page_num_container = jQuery('#' + options.current_page_num_name, $$);
 var $max_page_num_container = jQuery('#' + options.max_page_num_name, $$);

 var $pagination_controls_container = jQuery('div.pagination_controls', $$);
 var $images_showing_start_container = jQuery('span.images_showing_start', $$);
 var $images_showing_end_container = jQuery('span.images_showing_end', $$);
 var $main_image_container = jQuery('div.images_container', $$);

 // Buttons
 var $left_button = jQuery('span.' + options.left_button_name, $$);
 var $right_button = jQuery('span.' + options.right_button_name, $$);
 var $pause_button = jQuery('span.' + options.pause_button_name, $$);

 // Data 
 var photogallery_id = options.photogallery_id;
 var display_options = JSON.parse(options.display_options);
 var image_list = JSON.parse(options.image_list);
 var gallery_dropdowns = JSON.parse(options.gallery_dropdowns);

 // 1 == Yes, 2 == No
 var show_description = options.show_description;
 var autoplay = options.autoplay;

 //------------------------------------------------
 // Figure out the base uri to use
 //------------------------------------------------
 var type = options.type;
 var base_uri; 
 var mode = '_unpublished/';

 if(image_list.length > 0){
 var first_hash = image_list[0];

 if(type == 'live'){
 base_uri = first_hash['publish_url'];
 mode = '';
 }

 if(type == 'preview'){
 base_uri = first_hash['preview_url'];
 mode = '_preview/';
 }

 if(type == 'final_design'){
 base_uri = first_hash['final_design_url'];
 mode = '_finaldesign/';
 }

 }
 //------------------------------------------------


/*
 // Debug area, used to see if the list can handle 1 item.
 var temp_image_list = new Array(); 
 jQuery.each(image_list, function(cnt, image_hash) { 
 //if(cnt != 0){
 if(cnt < 7){
 temp_image_list[cnt] = image_list[cnt];
 }
 });
 image_list = temp_image_list;
*/

 // Other Vars
 var max_order_num = image_list.length || 0; 
 var current_order_num = $order_num_container.val();
 var current_page_num = $current_page_num_container.val();
 var max_page_num = $max_page_num_container.val();
 var locked = 0;
 var $preview_window = null;
 var paused = 1; // We start off paused
 var images_showing_start = parseInt($images_showing_start_container.html());
 var images_showing_end = parseInt($images_showing_end_container.html());

 // Find the gallery name
 var gallery_type_selected = display_options['gallery_type_selected'];
 var gallery_type_display_name = gallery_dropdowns['gallery_types'][gallery_type_selected].toLowerCase();
 var regex = new RegExp(/\s+/g);
 var gallery_name = gallery_type_display_name.replace(regex, "_");

 // -----------------------------------------------------------------------------
 // LIGHTBOX SECTION
 // Please note that this plugin has been modified slightly from the original
 // plugin that is available at: http://leandrovieira.com/projects/jquery/lightbox/
 // I took out all the english text. so Next/Back are arrows, Close is an X .. ect..
 // -----------------------------------------------------------------------------
 var raw_gallery_name = gallery_dropdowns['gallery_types'][gallery_type_selected];
 var large_image_style = display_options[raw_gallery_name]['large_image_style'];

 // Init the photogallery
 switch(gallery_name){

 case ('single_image') :
 init_single_image();
 break;
 
 case ('grid') :
 init_grid();
 break;

 case ('filmstrip_1') :
 init_filmstrip(gallery_name);
 break;

 case ('filmstrip_2') :
 init_filmstrip(gallery_name);
 break;
 
 case ('slideshow_2') :
 // Placeholder - this is actually taken care of in the mason file.
 break;

 case ('slideshow_1') :
 init_slideshow_1();
 if(autoplay == '1'){

 // this is to get the initial autoplay to pause long enough to see first image.
 var delay_seconds = display_options[raw_gallery_name]['delay'] || '5'; // 5 secs default.
 var delay_milliseconds = delay_seconds * 1000;
 if(delay_milliseconds < 850){ delay_milliseconds = '850'; }
 setTimeout( function() { _start(); }, delay_milliseconds);
 }
 break;
 }

 // ========================================================================= 
 // SINGLE IMAGE
 // ========================================================================= 
 function init_single_image(){
 _reset_position();

 // We hide the gallery with the loading screen.
 $loading_container.show();

 // We'll see if there is an image list
 if(image_list.length > 0){

 // Set button triggers
 // ---------------------------------------------------------------------------
 $left_button.unbind('click').click( function() {
 _move('left', 'single_image');
 return false;
 });

 $right_button.unbind('click').click( function() {
 _move('right', 'single_image');
 return false;
 });

 // Decide if we show the buttons right away
 // ---------------------------------------------------------------------------
 if(current_order_num > 0 && max_order_num > 1){
 $right_button.show()
 }

 if( (current_order_num < (max_order_num - 1)) && (!(current_order_num == 0)) ){
 $left_button.show()
 }
 }

 $loading_container.hide();
 };

 // ========================================================================= 
 // GRID
 // ========================================================================= 
 function init_grid() {
 _reset_position();

 // We hide the gallery with the loading screen.
 //$loading_container.show();

 if(large_image_style == 1){
 // Set the pop-up type
 jQuery("img", $images_container).each(function(cnt) {
 var image_hash = image_list[cnt];
 jQuery(this).click(function() { 
 _preview(image_hash); 
 return false;
 });
 });
 }
 else{
 // This will use animated lightbox.
 jQuery(function() {
 // jQuery('#photogallery_container_<% $photogallery_id %> img[rel*="lightbox"]').lightBox(lightbox_hash); 
 var lightbox_hash = {
 txtImage : options.txtImage,
 txtOf : options.txtOf,
 showDescription : show_description,
 parent_div_id : 'photogallery_' + options.photogallery_id
 };
 jQuery('img[rel*="lightbox"]', $$).lightBox(lightbox_hash);
 });
 }

 // Now we need to know which controls to activate
 var $current_page = jQuery('li.page_selected', $ul_container);

 if($current_page.next().length){
 $right_button.unbind('click').css("color" , "blue").click( function() {
 _move_grid('right');
 return false;
 });
 }
 else{
 $right_button.css("color" , "black");
 $right_button.unbind('click');
 }

 if($current_page.prev().length){
 $left_button.unbind('click').css("color" , "blue").click( function() {
 _move_grid('left');
 return false;
 });
 }
 else{
 $left_button.css("color", "black");
 $left_button.unbind('click');
 }

 $loading_container.hide();
 }

 // ========================================================================= 
 // SLIDESHOW
 // ========================================================================= 
 function init_slideshow_1(){
 _reset_position();

 // We hide the gallery with the loading screen.
 $loading_container.show();

 // We'll see if there is an image list
 if(image_list.length > 0){

 // Set button triggers
 // ---------------------------------------------------------------------------
 $pause_button.unbind('click').click( function() {
 _pause();
 return false;
 });

 $right_button.unbind('click').click( function() {
 _start();
 return false;
 });

/*
 // If we're not on the first image, we'll scroll to it. 
 // ---------------------------------------------------------------------------
 if(current_order_num != 0){
 var find_list_item = "li:eq(" + current_order_num + ")";
 var $selected_image = jQuery(find_list_item, $ul_container);

 // This is to make sure the images are hidden till 
 // we've scrolled to the selected image.
 var loading_function = function(){
 $loading_container.hide();
 }
 $images_container.scrollTo( $selected_image, 800, loading_function); 
 }
*/
 }

 $loading_container.hide();

 };

 // ========================================================================= 
 // FILMSTRIP 1 & 2
 // ========================================================================= 
 function init_filmstrip(gallery_name) {
 _reset_position();
 $loading_container.show();

 if(image_list.length > 0){

 if(gallery_name == 'filmstrip_1'){

 // Set the pop-up type
 jQuery("img", $images_container).each(function(cnt) {
 var image_hash = image_list[cnt];

 jQuery(this).click(function() { 
 // This will show the large picture on the top frame 
 _filmstrip_1_preview(image_hash); 

 // Move the selected image class to the new image 
 jQuery('li.img_selected', $$).removeClass('img_selected');

 // Set the new img selected 
 jQuery(this).parent().parent().addClass('img_selected');
 $order_num_container.val(cnt);

 return false;
 });
 });
 }
 else if (gallery_name == 'filmstrip_2'){

 // Set the pop-up type
 // Testing purposes, large image style #2 doesn't work yet
 // large_image_style = 1;

 if(large_image_style == 1){

 jQuery("img", $images_container).each(function(cnt) {
 var image_hash = image_list[cnt];
 jQuery(this).click(function() { 

 _filmstrip_2_preview(image_hash); 

 // Move the selected image class to the new image 
 jQuery('li.img_selected', $$).removeClass('img_selected');

 // Set the new img selected 
 jQuery(this).parent().parent().addClass('img_selected');
 $order_num_container.val(cnt);

 return false;
 });
 });

 }
 else{
 // This will use animated lightbox.
 jQuery(function() {
 // jQuery('#photogallery_container_<% $photogallery_id %> img[rel*="lightbox"]').lightBox(lightbox_hash); 
 var lightbox_hash = {
 txtImage : options.txtImage,
 txtOf : options.txtOf,
 showDescription : show_description,
 parent_div_id : 'photogallery_' + options.photogallery_id
 };
 
 jQuery('img[rel*="lightbox"]', $$).lightBox(lightbox_hash); 
 });
 }
 }


 // Now we need to know which controls to activate
 var $current_page = jQuery('li.page_selected', $ul_container);

 // Right Button
 if($current_page.next().length){
 $right_button.unbind('click').click( function() {
 _move_grid('right');
 return false;
 });
 }
 else{
 $right_button.unbind('click');
 }

 // Left Button
 if($current_page.prev().length){
 $left_button.unbind('click').click( function() {
 _move_grid('left');
 return false;
 });
 }
 else{
 $left_button.unbind('click');
 }

 // $pagination_controls_container.show();
 }

 $loading_container.hide();
 }

 // ======================================================================== 
 // FUNCTIONS
 // ========================================================================= 
 function _reset_position(){
 current_page_num = 1;
 $current_page_num_container.val(current_page_num);
 current_order_num = 0;
 $order_num_container.val(current_order_num);
 }

 function _start(){
 // Unbind the start button, to stop start spamming.
 $right_button.unbind('click');

 // Set our flag
 paused = 0;

 // Switch the button icons
 $right_button.hide();
 $pause_button.show();

 // When a user hits the play button, we want to move to the next pic right away.
 // We just have to see if we're at the last image, or not.
 if($order_num_container.val() < max_order_num - 1){
 _move('right', 'slideshow_1');
 }
 else{
 _move_to_first(); 
 }

 // This sets the timer for the rotation. 
 var delay_seconds = display_options[raw_gallery_name]['delay'] || '5'; // 5 secs default.
 var delay_milliseconds = delay_seconds * 1000; 

 // Bug fix for setting delay to zero
 if(delay_milliseconds < 850){ delay_milliseconds = '850'; }

 setInterval( function() {
 if(paused == 0){
 // We want to make sure they don't click anything while we're in the process of moving
 $pause_button.unbind('click');

 // Decide where to move to 
 if($order_num_container.val() == max_order_num - 1){
 _move_to_first();
 }
 else{
 _move('right', 'slideshow_1');
 }

 // Now that we're out the movement, set the click event again. 
 $pause_button.click( function() {
 _pause();
 return false;
 }); 

 };

 }, delay_milliseconds);
 }

 // --------------------------------------------------------------------------
 function _move_to_first(){
 // clear the selected class 
 var current_image = jQuery('li.img_selected', $ul_container);
 current_image.removeClass('img_selected');

 // set the order num back to zero
 $order_num_container.val(0);

 // find the first li container
 var $selected_image = jQuery("li:eq(0)", $ul_container);

 // reassign the selected class to new image 
 $selected_image.addClass('img_selected');

 // Set the image description if there is any.
 var image_hash = image_list[0];

 // Set the description 
 if(image_hash.description){
 $p_container.fadeOut('slow', function() {
 $p_container.html(image_hash.description)
 }).fadeIn('slow');
 }
 else{
 $p_container.fadeOut('slow', function(){
 $p_container.empty();
 });
 }

 var loading_function = function(){
 $loading_container.hide();
 }

 // now we scroll to the first item.
 $loading_container.show();
 $images_container.scrollTo( $selected_image, 800, loading_function);
 }

 // --------------------------------------------------------------------------
 function _pause(){
 // unbind the pause button, to keep from spamming it.
 $pause_button.unbind('click');

 $right_button.unbind('click').click( function() {
 _unpause();
 return false;
 });

 // Set our flag
 paused = 1;
 
 // Switch the button icons 
 $pause_button.hide();
 $right_button.show(); 
 }

 // --------------------------------------------------------------------------
 function _unpause(){
 // unbind the pause button, to keep from spamming it.
 $right_button.unbind('click');

 $pause_button.unbind('click').click( function() {
 _pause();
 return false;
 });

 // Set our flag
 paused = 0;

 // Switch the button icons 
 $pause_button.show();
 $right_button.hide();
 }


 // --------------------------------------------------------------------------
 function _move_grid(dir){
 // alert("locked: " + locked);
 // alert("dir: " + dir);
 // alert("current_page_num / max_page_num: " + current_page_num + "/" + max_page_num);

 // While we're trying to load pictures, we'll need to lock people out of moving around. 
 if( 
 (locked) ||
 ( current_page_num == 1 && dir == 'left') || 
 ( (max_page_num == current_page_num) && dir == 'right') 
 ){
 return(1);
 }

 // Set the lock.
 locked = 1;

 // see what page number we're current on.
 var $next_page = null;
 var new_page_num = current_page_num;

 // Get the current selected item (with selected class), if none was found, get the first item 
 // var current_page = jQuery('li.page_selected', $ul_container).length ? jQuery('li.selected', $ul_container) : jQuery('li:first', $ul_container); 
 var $current_page = jQuery('li.page_selected', $ul_container); 

 var new_images_showing_start = 0;
 var new_images_showing_end = 0;
 
 // use prev and next to determine increment or decrement 
 // because the controls disappear, i don't do checking to see if there is a next or prev.
 if (dir == 'left') { 
 $next_page = $current_page.prev();
 new_page_num--;

 // Find out how many images are showing.
 var img_array = jQuery('img', $next_page);
 new_images_showing_start = parseInt(images_showing_start) - img_array.length; 
 new_images_showing_end = parseInt(images_showing_start) - 1;
 } 
 else { 
 $next_page = $current_page.next(); 
 new_page_num++;

 var img_array = jQuery('img', $next_page);
 new_images_showing_start = parseInt(images_showing_end) + 1;
 new_images_showing_end = parseInt(images_showing_end) + img_array.length;
 } 
 
 // Set the number of images 
 $images_showing_start_container.html(new_images_showing_start);
 images_showing_start = new_images_showing_start;

 $images_showing_end_container.html(new_images_showing_end);
 images_showing_end = new_images_showing_end;
 
 // Set our new array number
 $current_page_num_container.val(new_page_num);
 current_page_num = new_page_num

 //clear the selected class 
 $current_page.removeClass('page_selected'); 

 //reassign the selected class to new image 
 $next_page.addClass('page_selected'); 

 // We scroll to the next image, and We use the function to 
 // make sure that the lock isn't set to zero before it's finished scrolling.
 var lock_function = function(){ locked = 0; };
 $images_container.scrollTo($next_page, 800, lock_function);

 // Set the buttons again
 if($next_page.next().length){
 $right_button.unbind('click').css("color" , "blue").click( function() {
 _move_grid('right');
 return false;
 });
 }
 else{
 $right_button.css("color" , "black");
 $right_button.unbind('click');
 }

 if($next_page.prev().length){
 $left_button.unbind('click').css("color" , "blue").click( function() {
 _move_grid('left');
 return false;
 });
 }
 else{
 $left_button.unbind('click').css("color", "black");
 }
 }

 // --------------------------------------------------------------------------
 function _filmstrip_1_preview(image_hash) {

 var src = null;
 var publish_url = image_hash.publish_url;
 var original_image_path = image_hash.original_image_path;

 // console.log(display_options);

 var widget_height = display_options['Filmstrip 1']['widget_height'];
 var widget_widget = display_options['Filmstrip 1']['widget_width'];

 var max_image_height = display_options['Filmstrip 1']['max_image_height'];
 var max_image_width = display_options['Filmstrip 1']['max_image_width'];
 var bg_color = display_options['Filmstrip 1']['bg_color'];
 var preexisting = display_options['preexisting'];
 var regex = new RegExp(/#/);
 bg_color = bg_color.replace(regex, "");

 //console.log(display_options);

 var new_image_name = image_hash.original_image_name;
 var file_extension = new_image_name.split('.').pop();

 if(preexisting == 1){
 var regx = new RegExp('.' + file_extension);
 new_image_name = new_image_name.replace(regx, ".png");
 }

 if(original_image_path != ''){
 src = publish_url + mode + original_image_path + '/_imagecache/P=W' + max_image_width + ',H' + max_image_height + ',F,B' + bg_color + '/' + image_hash.original_image_name;
 if(preexisting == 1){
 src = publish_url + mode + original_image_path + '/_imagecache/P=W' + max_image_width + ',H' + max_image_height + ',F,O' + file_extension + '/' + new_image_name;
 }
 }
 else{
 src = publish_url + mode + '_imagecache/P=W' + max_image_width + ',H' + max_image_height + ',F,B' + bg_color + '/' + image_hash.original_image_name;
 if(preexisting == 1){
 src = publish_url + mode + '_imagecache/P=W' + max_image_width + ',H' + max_image_height + ',F,O' + file_extension + '/' + new_image_name;
 }
 }

 if(image_hash.filecabinet_file_id.match(/^l_/)){
 src = publish_url +'_imagecache/P=W' + max_image_width + ',H' + max_image_height + ',L,F,B' + bg_color + '/' + image_hash.original_image_name;
 }
 
 var description = image_hash.description;
 var image_url_link = image_hash.image_url_link;

 var image_attributes ={
 id : "photogallery_image_" + image_hash.filecabinet_file_id,
 src : src
 };

 // Create the image! 
 var $img = jQuery('<img style="padding:0px; margin:0px; max-height:' + max_image_height + 'px;max-width:' + max_image_width + 'px" height="' + max_image_height + 'px" width="' + max_image_width + 'px"></img>').attr(image_attributes);

 var $top_main_image_container = jQuery('div.main_image_container', $$);

 // JH - 12/04/2009 - Had to do a quick switcharoo to populate the inner container instead of the main one..
 var $main_image_container = jQuery('div.sub_image_container', $top_main_image_container);

 // target Links
 if(image_url_link){
 var url_link = image_url_link;
 var prefix = '';
 var target = '_self';

 if(!(image_url_link.match(/http:\/\//) || image_url_link.match(/https:\/\//))){
 prefix = 'http://';
 }

 if(image_hash.click_option == 2){
 target = '_blank'; 
 }

 var $anchor = jQuery('<a style="text-decoration:none;" href="' + prefix + url_link + '" target="' + target + '"></a>'); 

 // do a switcharoo
 $anchor.html($img);
 $img = $anchor;
 }
 else{
 //$img.appendTo($align_div);
 }

 $main_image_container.empty();
 $main_image_container.html($img);

 // Set the description if there is one.
 if(description && (show_description == 1)){
 $description_container.empty();
 $description_container.html('<p style="padding:0px; height:30px; overflow-x: hidden; overflow-y: auto; margin:0px;">' + description + '</p>');
 }
 else{
 if(show_description == 1){
 $description_container.html('<p style="padding:0px; margin:0px; height:30px; overflow-x: hidden; overflow-y: auto;"></p>');
 }
 else{
 $description_container.html('<p style="padding:0px; margin:0px; height:30px; overflow-x: hidden; overflow-y: auto; display:none;"></p>');
 }
 }
 }

 // --------------------------------------------------------------------------
 function _filmstrip_2_preview(image_hash) {
 // Fix eventually.
 _preview(image_hash);
 }


 // --------------------------------------------------------------------------
 function _preview(image_hash) {
 // This function creates the pop-up window that shows the full image
 var img_loader = new Image();

 if(base_uri == null){ base_uri = first_hash['publish_url'] + "_unpublished/"; }

 img_loader.onload = function() { _center_preview(image_hash, img_loader); };

 if(image_hash.original_image_path){
 img_loader.src = base_uri + image_hash.original_image_path + '/_imagecache/' + image_hash.original_image_name;
 }
 else{
 img_loader.src = base_uri + '_imagecache/' + image_hash.original_image_name;
 }

 if(image_hash.filecabinet_file_id.match(/^l_/)){
 img_loader.src = base_uri + '_imagecache/P=L/' + image_hash.original_image_name;
 } 

 jQuery('<div></div>').addClass('photogallery_overlay').addClass('photogallery_thumbnail_overlay').css('z-index', 10100).appendTo('body').unbind('click').click(_close_preview);
 }

 // --------------------------------------------------------------------------
 function _center_preview(image_hash, img_loader) {

 if(base_uri == null){ base_uri = first_hash['publish_url'] + "/_unpublished/"; }

 img_loader.onload = null;

 var image_path = base_uri + '_imagecache/' + image_hash.original_image_name;

 if(image_hash.original_image_path){
 image_path = base_uri + image_hash.original_image_path + "/_imagecache/" + image_hash.original_image_name;
 }

 if(image_hash.filecabinet_file_id.match(/^l_/)){
 image_path = base_uri + '_imagecache/P=L/' + image_hash.original_image_name;
 }

 var description = image_hash.description;

 // Hack to force preview window to be recreated
 if($preview_window){ $preview_window == null; }

 // If the preview div doesn't exist, lets create it
 if(!$preview_window) {

 $preview_window = jQuery('<div class="photogallery_preview_window" style="font-size:0px"><img></img></div>').appendTo('body');
 var $preview_close = jQuery('<div class="photogallery_preview_close"></div>');
 var $description_container = jQuery('<div class="photogallery_preview_description"></div>');

 // Pull all the global css 
 var d_font = $parent_div.css('font-family');
 var d_font_color = $parent_div.css('color');
 var d_font_size = $parent_div.css('font-size');
 var d_font_weight = $parent_div.css('font-weight');
 var d_font_style = $parent_div.css('font-style');
 var d_font_variant = $parent_div.css('font-variant');
 var d_text_align = $parent_div.css('text-align');
 var d_text_decor = $parent_div.css('text-decoration');
 var d_text_trans = $parent_div.css('text-transform');
 var d_white_space = $parent_div.css('white-space');
 
 if(d_font) { $description_container.css('font-family', d_font); }
 if(d_font_color) { $description_container.css('color', d_font_color);}
 if(d_font_size) { $description_container.css('font-size', d_font_size);}
 if(d_font_weight) { $description_container.css('font-weight', d_font_weight);}
 if(d_font_style) { $description_container.css('font-style', d_font_style);}
 if(d_font_variant){ $description_container.css('font-variant', d_font_variant);}
 if(d_text_align) { $description_container.css('text-align', d_text_align);}
 if(d_text_decor) { $description_container.css('text-decoration', d_text_decor);}
 if(d_text_trans) { $description_container.css('text-transform', d_text_trans);}
 if(d_white_space) { $description_container.css('white-space', d_white_space);}

 // assemble the divs
 $preview_close.appendTo($preview_window);
 $description_container.appendTo($preview_window);

 // Assign the close button
 jQuery('div.photogallery_preview_close', $preview_window).unbind('click').click(_close_preview);
 }

 var div_width = img_loader.width - 20;

 // Set the description
 if(description && show_description == 1){
 jQuery('div.photogallery_preview_description', $preview_window).html('<p style="padding:0px; width:' + div_width + 'px; height:auto; margin:0px;">' + description + '</p>');
 }
 else{
 if(show_description == 1){
 jQuery('div.photogallery_preview_description', $preview_window).html('<p style="padding:0px; width:' + div_width + 'px; height:auto; margin:0px;"></p>');
 }
 else{
 jQuery('div.photogallery_preview_description', $preview_window).html('<p style="padding:0px; width:' + div_width + 'px; height:auto; margin:0px; display:none;"></p>');
 }
 }

 var img_x = img_loader.width;
 var img_y = img_loader.height;

 if(img_x == null){ img_x = 400; }
 if(img_y == null){ img_y = 400; }

 var x = jQuery(window).width();
 var y = jQuery(window).height();

 if(img_y > y) {
 img_y = y - 40;
 } 

 jQuery('img', $preview_window).attr('src', image_path).unbind('click').click(_close_preview).attr('height', img_y);
 // jQuery('img', $preview_window).attr('src', image_path).unbind('click').click(_close_preview);

 var left = 0 - (parseInt($preview_window.width()) / 2);
 var top = 0 - (parseInt($preview_window.height()) / 2);

 if(jQuery.browser.msie && (jQuery.browser.version < 7)) {
 top += jQuery(window).scrollTop();
 jQuery('select').hide();
 }

 $preview_window.css({ 'margin-top': top + 'px', 'margin-left': left + 'px' }).show();
 }

 // --------------------------------------------------------------------------
 function _close_preview() {
 if($preview_window){
 $preview_window.hide();
 }
 jQuery('div.photogallery_thumbnail_overlay').remove();
 }

 // function to produce full size images
 // --------------------------------------------------------------------------
 function generate_image(image_hash) {

 // Fix the path
 var src = base_uri + "/" + image_hash.original_image_path + "/" + image_hash.original_image_name;

 var image_hash ={
 id : "photogallery_image_" + image_hash.filecabinet_file_id,
 // alt : image_hash.original_image_name,
 src : src
 };

 // Create the image!
 var $img = jQuery('<img style="padding:5px;"></img>').attr(image_hash); 

 return($img);
 }

 // function to produce the thumbnails 
 // --------------------------------------------------------------------------
 function generate_thumbnail(image_hash) {

 // Fix the path
 var src = base_uri + image_hash.thumbnail_thumb_path;
 var image_name = image_hash.original_image_name;
 var image_desc = image_hash.description;
 var image_path = base_uri + image_hash.original_image_path + "/" + image_hash.original_image_name;
 var image_id = "photogallery_image_" + image_hash.filecabinet_file_id;

 var image_attributes ={
 id : image_id,
 src : src
 };

 if(image_desc){
 image_attributes['title'] = image_desc; 
 }
 else{
 image_attributes['title'] = image_name; 
 } 
 
 // altered href to be https
 var $img = jQuery('<img rel="lightbox[gallery]" href="' + image_path + '"></img>').attr(image_attributes);

 return($img);
 }

 // --------------------------------------------------------------------------
 function _move(dir, gallery_type) {
 //window.console.log("-----------------------------------");
 //window.console.log(dir);
 //window.console.log(locked);
 //window.console.log(gallery_type);
 //window.console.log(current_order_num);
 //window.console.log(max_order_num);
 //window.console.log("-----------------------------------");

 // While we're trying to load pictures, we'll need to lock people out of moving around. 
 if( 
 (locked) ||
 ( current_order_num == 0 && dir == 'left') || 
 ( (max_order_num == current_order_num) && dir == 'right') 
 ){
 //window.console.log("got caught!");
 return(1);
 }

 // Set the lock.
 locked = 1;

 // see what image number we're current on.
 current_order_num = $order_num_container.val();
 var next_image = null;
 var new_order_num = current_order_num;

 // Get the current selected item (with selected class), if none was found, get the first item 
 // var current_image = jQuery('li.selected', $ul_container).length ? jQuery('li.selected', $ul_container) : jQuery('li:first', $ul_container); 
 var current_image = jQuery('li.img_selected', $ul_container); 
 
 // use prev and next to determine increment or decrement 
 // because the controls disappear, i don't do checking to see if there is a next or prev.
 if (dir == 'left') { 
 next_image = current_image.prev();
 new_order_num--;
 current_order_num--;
 } 
 else { 
 next_image = current_image.next(); 
 new_order_num++;
 current_order_num++;
 } 
 
 // Set our new array number
 $order_num_container.val(new_order_num);

 //clear the selected class 
 current_image.removeClass('img_selected'); 

 //reassign the selected class to new image 
 next_image.addClass('img_selected'); 

 // We scroll to the next image, and We use the function to 
 // make sure that the lock isn't set to zero before it's finished scrolling.
 var lock_function = function(){ locked = 0; };
 $images_container.scrollTo(next_image, 800, lock_function);

 // Set the image description if there is any.
 var image_hash = image_list[new_order_num];

 // Set the description 
 if(gallery_type != 'grid'){
 if(image_hash.description){
 if(show_description == 1){
 $p_container.fadeOut('slow', function() {
 $p_container.html(image_hash.description)
 }).fadeIn('slow');
 }
 }
 else{
 $p_container.fadeOut('slow', function(){ 
 $p_container.empty(); 
 });
 }
 }

 // Set the buttons again
 if( (gallery_type != 'slideshow_1') && (gallery_type != 'grid') ){
 if(next_image.next().length){
 $right_button.show(); 
 }
 else{
 $right_button.hide();
 }

 if(next_image.prev().length){
 $left_button.show();
 }
 else{
 $left_button.hide();
 }
 }
 } 
 }
 // ==========================================================
 // END PHOTOGALLERY
 // ==========================================================


 // ===========================================================
 // START SOCIALNETWORK
 // ===========================================================
 jQuery.fn.iv_socialnetwork = function(options) {
 return this.each(function() {
 new jQuery.iv.socialnetwork(this, options);
 });
 }

 jQuery.iv.socialnetwork = function(el, options) {

 options = jQuery.extend({
 name : null,
 id : null,
 url : null,
 path : null,
 title : null,
 browser : null,
 ws_name : null
 }, options);

 // This will append it to the overall div.
 jQuery.data(el, options.name + '_' + options.id, this);

 var $$ = jQuery(el);
 var socialnetwork_id = options.id;
 var name = options.name;
 var url = options.url;
 var path = options.path;
 var $img = jQuery('img', $$);
 var div_ident = options.name + '_' + options.id;
 //var title = jQuery('title').text();
 var title = options.title;
 var ws_name = options.ws_name;


 // this is the list of following social networks:
 // socialnetwork : Share on Facebook
 // socialnetwork5 : Buzz This
 // socialnetwork3 : Share on Twitter
 // socialnetwork6 : Share on Plurk


 // SHARE ON FACEBOOK
 if( (name == 'socialnetwork') || (name == 'socialnetwork5') ){

 var target = '_blank';
 //var target = 'new';

 if(name == 'socialnetwork'){
 var $anchor = jQuery('<a target="' + target + '" style="text-decoration:none; padding:0px; margin:0px; border:0px; display:block;" href="http://www.facebook.com/share.php?u=' + url + '"></a>'); 
 $anchor.html($img);
 $$.empty();
 $$.html($anchor);
 }
 else{ // Buzz This

 //alert("title: " + title);
 //alert("url: " + url); 
 //alert("ws_name: " + ws_name);

 // fixes a bug with ie.
 //if(!(title)){
 // title = options.title;
 // alert("title changed to: " + title);
 //}

 // Remove slash for path.
 var regex = /\//;
 path = path.replace(regex, ""); 

 // Format will be ( websitename - pagename - url+path )
 var append = 'url=' + url;
 append = append + '&srcURL=' + url;

 if(title){
 if(title.match(ws_name)){
 append = append + '&title=' + title;
 append = append + '&srcTitle=' + title;
 }
 else{
 append = append + '&title=' + ws_name + ' - ' + title;
 append = append + '&srcTitle=' + ws_name + ' - ' + title;
 }
 }
 else{
 if(ws_name){
 append = append + '&title=' + ws_name;
 append = append + '&srcTitle=' + ws_name;
 }
 else{
 append = append + '&title=' + url;
 append = append + '&srcTitle=' + url;
 }
 }



 //var $anchor = jQuery('<a target="_blank" style="text-decoration:none; padding:0px; margin:0px; border:0px; display:block;" href="http://www.google.com/reader/link?' + append + '"></a>');
 var $anchor = jQuery('<a target="_blank" style="text-decoration:none; padding:0px; margin:0px; border:0px; display:block;" href="http://www.google.com/buzz/post?' + append + '"></a>');

 $anchor.html($img);
 $$.empty();
 $$.html($anchor);
 }
 }
 else{ 

 url = decodeURI(url);

 // This section contains socialnetworks that require 
 // bitly to shorten thier urls 
 // ----------------------------------------------------
 // Generate the bit.ly url
 // if you need login into to the account, ask Bryan
 // you can find the api key by going to: http://bit.ly/account/your_api_key
 // ----------------------------------------------------
 var defaults = {
 version: '2.0.1',
 login: 'ivenue',
 apiKey: 'R_064320bbb6b53267e152fa2317b0e72b',
 history: '0',
 longUrl: url
 };

 // create the url.
 var daurl = "http://api.bit.ly/shorten?"
 +"version="+defaults.version
 +"&longUrl="+defaults.longUrl
 +"&login="+defaults.login
 +"&apiKey="+defaults.apiKey
 +"&history="+defaults.history
 +"&format=json&callback=?";

 // get the data!
 jQuery.getJSON(daurl, function(data){

 var data_errorCode = data.errorCode;
 var error_message;
 var short_url;

 // Lets see if there are any errors.
 if(data_errorCode > 0){
 var error_message = data.errorMessage;
 } 
 else{
 var results_errorCode = data.results[defaults.longUrl].errorCode;

 if(results_errorCode > 0){
 error_message = data.results[defaults.longUrl].errorMessage; 
 } 
 else{
 short_url = data.results[defaults.longUrl].shortUrl;
 }
 }

 // Now generate the html 
 if(error_message){
 // If for some reason we hit errors, we'll set it as a click function. :(
 $img.click( function() {
 alert(error_message);
 return false;
 });
 }
 else{
 var target = '_blank';
 var $anchor = null;
 //var target = 'new';

 // SHARE ON TWITTER
 if(name == 'socialnetwork3'){
 // If we have no errors, and we get our short url, we'll go ahead and set the anchor.
 var $anchor = jQuery('<a target="' + target + '" style="text-decoration:none; padding:0px; margin:0px; border:0px; display:block;" href="http://twitter.com/home/?status=' + short_url + '"></a>');
 }
 else{
 // SHARE ON PLURK
 // socialnetwork6 
 //var $anchor = jQuery('<a target="' + target + '" style="text-decoration:none; padding:0px; margin:0px; border:0px; display:block;" href="http://www.plurk.com/?qualifier=shares&status=' + short_url + '"></a>');
 var $anchor = jQuery('<a target="' + target + '" style="text-decoration:none; padding:0px; margin:0px; border:0px; display:block;" href="http://www.plurk.com/m?qualifier=shares&content=' + short_url + '"></a>');
 }

 $anchor.html($img);
 $$.empty();
 $$.html($anchor);
 }

 });

 }
 }
 // ===========================================================
 // END SOCIALNETWORK
 // ===========================================================
 jQuery.fn.iv_unselectable = function() {
 return(this.each(function() {
 jQuery(this)
 .css('-moz-user-select', 'none') // FF
 .css('-khtml-user-select', 'none') // Safari, Google Chrome
 .css('-o-user-select', 'none') // Opera
 .css('user-select', 'none'); // CSS 3

 if (jQuery.browser.msie) { // IE
 jQuery(this).each(function() {
 this.ondrag = function() { return(false); };
 this.onselectstart = function() { return(false); };
 });
 }
 else if(jQuery.browser.opera) {
 jQuery(this).attr('unselectable', 'on');
 }
 }));
 };
 //---------------------------------------------------------------------------
 // Sets an initial text to a text input area. Once the text area receives
 // focus the text will be cleared.
 //---------------------------------------------------------------------------
 // Use placeholder attribute instead
 //---------------------------------------------------------------------------
/* jQuery.fn.iv_initial_text = function(options) {
 return(this.each(function() {
 new jQuery.iv.initial_text(this, options);
 }));
 } 

 jQuery.iv.initial_text = function(el, options) {
 var options = jQuery.extend({
 initial_text: ''
 }, options);

 var $$ = jQuery(el);

 $$.focus(function() {
 if($$.val() == options.initial_text) { $$.val(''); }
 });

 $$.blur(function() {
 if($$.val() == '') { $$.val(options.initial_text); }
 }).trigger('blur');
 }*/
 //---------------------------------------------------------------------------
})(jQuery);


/**
 * jQuery.ScrollTo - Easy element scrolling using jQuery.
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 5/25/2009
 * @author Ariel Flesler
 * @version 1.4.2
 *
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 */
;(function(d){var k=d.scrollTo=function(a,i,e){d(window).scrollTo(a,i,e)};k.defaults={axis:'xy',duration:parseFloat(d.fn.jquery)>=1.3?0:1};k.window=function(a){return d(window)._scrollable()};d.fn._scrollable=function(){return this.map(function(){var a=this,i=!a.nodeName||d.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!i)return a;var e=(a.contentWindow||a).document||a.ownerDocument||a;return d.browser.safari||e.compatMode=='BackCompat'?e.body:e.documentElement})};d.fn.scrollTo=function(n,j,b){if(typeof j=='object'){b=j;j=0}if(typeof b=='function')b={onAfter:b};if(n=='max')n=9e9;b=d.extend({},k.defaults,b);j=j||b.speed||b.duration;b.queue=b.queue&&b.axis.length>1;if(b.queue)j/=2;b.offset=p(b.offset);b.over=p(b.over);return this._scrollable().each(function(){var q=this,r=d(q),f=n,s,g={},u=r.is('html,body');switch(typeof f){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)){f=p(f);break}f=d(f,this);case'object':if(f.is||f.style)s=(f=d(f)).offset()}d.each(b.axis.split(''),function(a,i){var e=i=='x'?'Left':'Top',h=e.toLowerCase(),c='scroll'+e,l=q[c],m=k.max(q,i);if(s){g[c]=s[h]+(u?0:l-r.offset()[h]);if(b.margin){g[c]-=parseInt(f.css('margin'+e))||0;g[c]-=parseInt(f.css('border'+e+'Width'))||0}g[c]+=b.offset[h]||0;if(b.over[h])g[c]+=f[i=='x'?'width':'height']()*b.over[h]}else{var o=f[h];g[c]=o.slice&&o.slice(-1)=='%'?parseFloat(o)/100*m:o}if(/^\d+$/.test(g[c]))g[c]=g[c]<=0?0:Math.min(g[c],m);if(!a&&b.queue){if(l!=g[c])t(b.onAfterFirst);delete g[c]}});t(b.onAfter);function t(a){r.animate(g,j,b.easing,a&&function(){a.call(this,n,b)})}}).end()};k.max=function(a,i){var e=i=='x'?'Width':'Height',h='scroll'+e;if(!d(a).is('html,body'))return a[h]-d(a)[e.toLowerCase()]();var c='client'+e,l=a.ownerDocument.documentElement,m=a.ownerDocument.body;return Math.max(l[h],m[h])-Math.min(l[c],m[c])};function p(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);
/*
 json2.js
 2007-11-02

 Public Domain
 See http://www.JSON.org/js.html
*/

/*jslint evil: true */
/*extern JSON */

if (!this.JSON) {

 JSON = function () {

 function f(n) { // Format integers to have at least two digits.
 return n < 10 ? '0' + n : n;
 }

 Date.prototype.toJSON = function () {

// Eventually, this method will be based on the date.toISOString method.

 return this.getUTCFullYear() + '-' +
 f(this.getUTCMonth() + 1) + '-' +
 f(this.getUTCDate()) + 'T' +
 f(this.getUTCHours()) + ':' +
 f(this.getUTCMinutes()) + ':' +
 f(this.getUTCSeconds()) + 'Z';
 };


 var m = { // table of character substitutions
 '\b': '\\b',
 '\t': '\\t',
 '\n': '\\n',
 '\f': '\\f',
 '\r': '\\r',
 '"' : '\\"',
 '\\': '\\\\'
 };

 function stringify(value, whitelist) {
 var a, // The array holding the partial texts.
 i, // The loop counter.
 k, // The member key.
 l, // Length.
 v; // The member value.

 switch (typeof value) {
 case 'string':


 return /["\\\x00-\x1f]/.test(value) ?
 '"' + value.replace(/[\x00-\x1f\\"]/g, function (a) {
 var c = m[a];
 if (c) {
 return c;
 }
 c = a.charCodeAt();
 return '\\u00' + Math.floor(c / 16).toString(16) +
 (c % 16).toString(16);
 }) + '"' :
 '"' + value + '"';

 case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

 return isFinite(value) ? String(value) : 'null';

 case 'boolean':
 return String(value);

 case 'null':
 return 'null';

 case 'object':

// Due to a specification blunder in ECMAScript,
// typeof null is 'object', so watch out for that case.

 if (!value) {
 return 'null';
 }

// If the object has a toJSON method, call it, and stringify the result.

 if (typeof value.toJSON === 'function') {
 return stringify(value.toJSON());
 }
 a = [];
 if (typeof value.length === 'number' &&
 !(value.propertyIsEnumerable('length'))) {

// The object is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

 l = value.length;
 for (i = 0; i < l; i += 1) {
 a.push(stringify(value[i], whitelist) || 'null');
 }

// Join all of the elements together and wrap them in brackets.

 return '[' + a.join(',') + ']';
 }
 if (whitelist) {

// If a whitelist (array of keys) is provided, use it to select the components
// of the object.

 l = whitelist.length;
 for (i = 0; i < l; i += 1) {
 k = whitelist[i];
 if (typeof k === 'string') {
 v = stringify(value[k], whitelist);
 if (v) {
 a.push(stringify(k) + ':' + v);
 }
 }
 }
 } else {

// Otherwise, iterate through all of the keys in the object.

 for (k in value) {
 if (typeof k === 'string') {
 v = stringify(value[k], whitelist);
 if (v) {
 a.push(stringify(k) + ':' + v);
 }
 }
 }
 }

// Join all of the member texts together and wrap them in braces.

 return '{' + a.join(',') + '}';
 }
 }

 return {
 stringify: stringify,
 parse: function (text, filter) {
 var j;

 function walk(k, v) {
 var i, n;
 if (v && typeof v === 'object') {
 for (i in v) {
 if (Object.prototype.hasOwnProperty.apply(v, [i])) {
 n = walk(i, v[i]);
 if (n !== undefined) {
 v[i] = n;
 }
 }
 }
 }
 return filter(k, v);
 }



 if (/^[\],:{}\s]*$/.test(text.replace(/\\./g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(:?[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

 j = eval('(' + text + ')');

 return typeof filter === 'function' ? walk('', j) : j;
 }

 throw new SyntaxError('parseJSON');
 }
 };
 }();
}
