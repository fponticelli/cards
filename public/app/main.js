(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var __moduleName = "client/main";
var Stream = require('streamy/stream').Stream;
var Fragment = require('ui/fragment').Fragment;
var $__0 = require('ui/dom'),
    Dom = $__0.Dom,
    Query = $__0.Query;
var StringValue = require('streamy/value').StringValue;
var $__0 = require('ui/properties/types'),
    TextProperty = $__0.TextProperty,
    ValueProperty = $__0.ValueProperty,
    VisibleProperty = $__0.VisibleProperty,
    LinkProperty = $__0.LinkProperty,
    StrongProperty = $__0.StrongProperty,
    EmphasisProperty = $__0.EmphasisProperty,
    StrikeProperty = $__0.StrikeProperty,
    NumericFormatProperty = $__0.NumericFormatProperty,
    TooltipProperty = $__0.TooltipProperty,
    TextEditorProperty = $__0.TextEditorProperty,
    BoolEditorProperty = $__0.BoolEditorProperty,
    HtmlProperty = $__0.HtmlProperty,
    IconProperty = $__0.IconProperty;
var $__0 = require('ui/modelview'),
    ModelView = $__0.ModelView,
    SchemaWrapper = $__0.SchemaWrapper;
var Model = require('ui/model').Model;
var Schema = require('ui/schema').Schema;
var Field = require('ui/Field').Field;
var Paragraph = require('ui/paragraph').Paragraph;
Dom.ready((function() {
  var $card = Query.first('.card'),
      $doc = Query.first('.doc', $card),
      $doc_header = Query.first('header', $doc),
      $doc_article = Query.first('article', $doc),
      $doc_footer = Query.first('footer', $doc),
      $aside = Query.first('aside', $card),
      $context = Query.first('.context', $aside),
      $context_header = Query.first('header', $context),
      $context_article = Query.first('article', $context),
      $model = Query.first('.model', $aside),
      $model_header = Query.first('header', $model),
      $model_article = Query.first('article', $model),
      p = new Paragraph(),
      editor = p.createFragment(),
      text = new TextProperty(),
      stringValue = new ValueProperty("String"),
      numberValue = new ValueProperty("Number"),
      visible = new VisibleProperty(),
      strong = new StrongProperty(),
      emphasis = new EmphasisProperty(),
      strike = new StrikeProperty(),
      formatNumber = new NumericFormatProperty(),
      link = new LinkProperty(),
      tooltip = new TooltipProperty("tooltip text goes here"),
      textEditor = new TextEditorProperty();
  editor.properties.add(text);
  editor.properties.add(strong);
  editor.properties.add(emphasis);
  editor.properties.add(strike);
  editor.properties.add(textEditor);
  editor.editor.value.feed(editor.text);
  editor.editor = "select me...";
  editor.editor.focus();
  var field = new Field();
  field.attachTo($context_article);
  field.key.properties.add(new TextProperty('text'));
  field.value.properties.add(new TextProperty());
  field.value.properties.add(new TextEditorProperty());
  field.value.editor.value.feed(field.value.text);
  field.value.editor.value = '$.varname';
  var field = new Field();
  field.attachTo($context_article);
  field.key.properties.add(new TextProperty('link'));
  field.value.properties.add(new TextProperty());
  field.value.properties.add(new TextEditorProperty());
  field.value.editor.value.feed(field.value.text);
  field.value.editor.value = 'http://www.google.com';
  var field = new Field();
  field.attachTo($context_article);
  field.key.properties.add(new IconProperty('bold'));
  field.value.properties.add(new BoolEditorProperty());
  field.value.editor.value.feed(editor.strong);
  p.attachTo($doc_article);
  var field = new Field();
  field.attachTo($context_article);
  field.key.properties.add(new IconProperty('italic'));
  field.value.properties.add(new BoolEditorProperty());
  field.value.editor.value.feed(editor.emphasis);
  p.attachTo($doc_article);
  var field = new Field();
  field.attachTo($context_article);
  field.key.properties.add(new IconProperty('strikethrough'));
  field.value.properties.add(new BoolEditorProperty());
  field.value.editor.value.feed(editor.strike);
  p.attachTo($doc_article);
  var schema = new Schema(),
      view = new ModelView(),
      model = new Model(),
      wrapper = new SchemaWrapper(schema, view);
  view.attachTo($model_article);
  schema.stream.feed(model.schema);
  view.data.feed(model.data);
  model.stream.map(JSON.stringify).log('model');
  schema.reset([{
    name: 'name',
    type: 'String'
  }, {
    name: 'lastname',
    type: 'String'
  }, {
    name: 'alive',
    type: 'Bool'
  }]);
}));


},{"streamy/stream":23,"streamy/value":24,"ui/Field":25,"ui/dom":28,"ui/fragment":32,"ui/model":34,"ui/modelview":36,"ui/paragraph":38,"ui/properties/types":51,"ui/schema":59}],2:[function(require,module,exports){
/**
 * The buffer module from node.js, for the browser.
 *
 * Author:   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * License:  MIT
 *
 * `npm install buffer`
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

},{"base64-js":3,"ieee754":4}],3:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var ZERO   = '0'.charCodeAt(0)
	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS)
			return 62 // '+'
		if (code === SLASH)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	module.exports.toByteArray = b64ToByteArray
	module.exports.fromByteArray = uint8ToBase64
}())

},{}],4:[function(require,module,exports){
exports.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],5:[function(require,module,exports){
var Buffer = require('buffer').Buffer;
var intSize = 4;
var zeroBuffer = new Buffer(intSize); zeroBuffer.fill(0);
var chrsz = 8;

function toArray(buf, bigEndian) {
  if ((buf.length % intSize) !== 0) {
    var len = buf.length + (intSize - (buf.length % intSize));
    buf = Buffer.concat([buf, zeroBuffer], len);
  }

  var arr = [];
  var fn = bigEndian ? buf.readInt32BE : buf.readInt32LE;
  for (var i = 0; i < buf.length; i += intSize) {
    arr.push(fn.call(buf, i));
  }
  return arr;
}

function toBuffer(arr, size, bigEndian) {
  var buf = new Buffer(size);
  var fn = bigEndian ? buf.writeInt32BE : buf.writeInt32LE;
  for (var i = 0; i < arr.length; i++) {
    fn.call(buf, arr[i], i * 4, true);
  }
  return buf;
}

function hash(buf, fn, hashSize, bigEndian) {
  if (!Buffer.isBuffer(buf)) buf = new Buffer(buf);
  var arr = fn(toArray(buf, bigEndian), buf.length * chrsz);
  return toBuffer(arr, hashSize, bigEndian);
}

module.exports = { hash: hash };

},{"buffer":2}],6:[function(require,module,exports){
var Buffer = require('buffer').Buffer
var sha = require('./sha')
var sha256 = require('./sha256')
var rng = require('./rng')
var md5 = require('./md5')

var algorithms = {
  sha1: sha,
  sha256: sha256,
  md5: md5
}

var blocksize = 64
var zeroBuffer = new Buffer(blocksize); zeroBuffer.fill(0)
function hmac(fn, key, data) {
  if(!Buffer.isBuffer(key)) key = new Buffer(key)
  if(!Buffer.isBuffer(data)) data = new Buffer(data)

  if(key.length > blocksize) {
    key = fn(key)
  } else if(key.length < blocksize) {
    key = Buffer.concat([key, zeroBuffer], blocksize)
  }

  var ipad = new Buffer(blocksize), opad = new Buffer(blocksize)
  for(var i = 0; i < blocksize; i++) {
    ipad[i] = key[i] ^ 0x36
    opad[i] = key[i] ^ 0x5C
  }

  var hash = fn(Buffer.concat([ipad, data]))
  return fn(Buffer.concat([opad, hash]))
}

function hash(alg, key) {
  alg = alg || 'sha1'
  var fn = algorithms[alg]
  var bufs = []
  var length = 0
  if(!fn) error('algorithm:', alg, 'is not yet supported')
  return {
    update: function (data) {
      if(!Buffer.isBuffer(data)) data = new Buffer(data)
        
      bufs.push(data)
      length += data.length
      return this
    },
    digest: function (enc) {
      var buf = Buffer.concat(bufs)
      var r = key ? hmac(fn, key, buf) : fn(buf)
      bufs = null
      return enc ? r.toString(enc) : r
    }
  }
}

function error () {
  var m = [].slice.call(arguments).join(' ')
  throw new Error([
    m,
    'we accept pull requests',
    'http://github.com/dominictarr/crypto-browserify'
    ].join('\n'))
}

exports.createHash = function (alg) { return hash(alg) }
exports.createHmac = function (alg, key) { return hash(alg, key) }
exports.randomBytes = function(size, callback) {
  if (callback && callback.call) {
    try {
      callback.call(this, undefined, new Buffer(rng(size)))
    } catch (err) { callback(err) }
  } else {
    return new Buffer(rng(size))
  }
}

function each(a, f) {
  for(var i in a)
    f(a[i], i)
}

// the least I can do is make error messages for the rest of the node.js/crypto api.
each(['createCredentials'
, 'createCipher'
, 'createCipheriv'
, 'createDecipher'
, 'createDecipheriv'
, 'createSign'
, 'createVerify'
, 'createDiffieHellman'
, 'pbkdf2'], function (name) {
  exports[name] = function () {
    error('sorry,', name, 'is not implemented yet')
  }
})

},{"./md5":7,"./rng":8,"./sha":9,"./sha256":10,"buffer":2}],7:[function(require,module,exports){
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

var helpers = require('./helpers');

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

module.exports = function md5(buf) {
  return helpers.hash(buf, core_md5, 16);
};

},{"./helpers":5}],8:[function(require,module,exports){
// Original code adapted from Robert Kieffer.
// details at https://github.com/broofa/node-uuid
(function() {
  var _global = this;

  var mathRNG, whatwgRNG;

  // NOTE: Math.random() does not guarantee "cryptographic quality"
  mathRNG = function(size) {
    var bytes = new Array(size);
    var r;

    for (var i = 0, r; i < size; i++) {
      if ((i & 0x03) == 0) r = Math.random() * 0x100000000;
      bytes[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return bytes;
  }

  if (_global.crypto && crypto.getRandomValues) {
    whatwgRNG = function(size) {
      var bytes = new Uint8Array(size);
      crypto.getRandomValues(bytes);
      return bytes;
    }
  }

  module.exports = whatwgRNG || mathRNG;

}())

},{}],9:[function(require,module,exports){
/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

var helpers = require('./helpers');

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function core_sha1(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;

    for(var j = 0; j < 80; j++)
    {
      if(j < 16) w[j] = x[i + j];
      else w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
      var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = rol(b, 30);
      b = a;
      a = t;
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);

}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d)
{
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

module.exports = function sha1(buf) {
  return helpers.hash(buf, core_sha1, 20, true);
};

},{"./helpers":5}],10:[function(require,module,exports){

/**
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 *
 */

var helpers = require('./helpers');

var safe_add = function(x, y) {
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
};

var S = function(X, n) {
  return (X >>> n) | (X << (32 - n));
};

var R = function(X, n) {
  return (X >>> n);
};

var Ch = function(x, y, z) {
  return ((x & y) ^ ((~x) & z));
};

var Maj = function(x, y, z) {
  return ((x & y) ^ (x & z) ^ (y & z));
};

var Sigma0256 = function(x) {
  return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
};

var Sigma1256 = function(x) {
  return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
};

var Gamma0256 = function(x) {
  return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
};

var Gamma1256 = function(x) {
  return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
};

var core_sha256 = function(m, l) {
  var K = new Array(0x428A2F98,0x71374491,0xB5C0FBCF,0xE9B5DBA5,0x3956C25B,0x59F111F1,0x923F82A4,0xAB1C5ED5,0xD807AA98,0x12835B01,0x243185BE,0x550C7DC3,0x72BE5D74,0x80DEB1FE,0x9BDC06A7,0xC19BF174,0xE49B69C1,0xEFBE4786,0xFC19DC6,0x240CA1CC,0x2DE92C6F,0x4A7484AA,0x5CB0A9DC,0x76F988DA,0x983E5152,0xA831C66D,0xB00327C8,0xBF597FC7,0xC6E00BF3,0xD5A79147,0x6CA6351,0x14292967,0x27B70A85,0x2E1B2138,0x4D2C6DFC,0x53380D13,0x650A7354,0x766A0ABB,0x81C2C92E,0x92722C85,0xA2BFE8A1,0xA81A664B,0xC24B8B70,0xC76C51A3,0xD192E819,0xD6990624,0xF40E3585,0x106AA070,0x19A4C116,0x1E376C08,0x2748774C,0x34B0BCB5,0x391C0CB3,0x4ED8AA4A,0x5B9CCA4F,0x682E6FF3,0x748F82EE,0x78A5636F,0x84C87814,0x8CC70208,0x90BEFFFA,0xA4506CEB,0xBEF9A3F7,0xC67178F2);
  var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
    var W = new Array(64);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;
  /* append padding */
  m[l >> 5] |= 0x80 << (24 - l % 32);
  m[((l + 64 >> 9) << 4) + 15] = l;
  for (var i = 0; i < m.length; i += 16) {
    a = HASH[0]; b = HASH[1]; c = HASH[2]; d = HASH[3]; e = HASH[4]; f = HASH[5]; g = HASH[6]; h = HASH[7];
    for (var j = 0; j < 64; j++) {
      if (j < 16) {
        W[j] = m[j + i];
      } else {
        W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
      }
      T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
      T2 = safe_add(Sigma0256(a), Maj(a, b, c));
      h = g; g = f; f = e; e = safe_add(d, T1); d = c; c = b; b = a; a = safe_add(T1, T2);
    }
    HASH[0] = safe_add(a, HASH[0]); HASH[1] = safe_add(b, HASH[1]); HASH[2] = safe_add(c, HASH[2]); HASH[3] = safe_add(d, HASH[3]);
    HASH[4] = safe_add(e, HASH[4]); HASH[5] = safe_add(f, HASH[5]); HASH[6] = safe_add(g, HASH[6]); HASH[7] = safe_add(h, HASH[7]);
  }
  return HASH;
};

module.exports = function sha256(buf) {
  return helpers.hash(buf, core_sha256, 32, true);
};

},{"./helpers":5}],11:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.once = noop;
process.off = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],12:[function(require,module,exports){
(function (process,global){
(function(global) {
  'use strict';
  if (global.$traceurRuntime) {
    return;
  }
  var $Object = Object;
  var $TypeError = TypeError;
  var $create = $Object.create;
  var $defineProperties = $Object.defineProperties;
  var $defineProperty = $Object.defineProperty;
  var $freeze = $Object.freeze;
  var $getOwnPropertyDescriptor = $Object.getOwnPropertyDescriptor;
  var $getOwnPropertyNames = $Object.getOwnPropertyNames;
  var $getPrototypeOf = $Object.getPrototypeOf;
  var $hasOwnProperty = $Object.prototype.hasOwnProperty;
  var $toString = $Object.prototype.toString;
  function nonEnum(value) {
    return {
      configurable: true,
      enumerable: false,
      value: value,
      writable: true
    };
  }
  var types = {
    void: function voidType() {},
    any: function any() {},
    string: function string() {},
    number: function number() {},
    boolean: function boolean() {}
  };
  var method = nonEnum;
  var counter = 0;
  function newUniqueString() {
    return '__$' + Math.floor(Math.random() * 1e9) + '$' + ++counter + '$__';
  }
  var symbolInternalProperty = newUniqueString();
  var symbolDescriptionProperty = newUniqueString();
  var symbolDataProperty = newUniqueString();
  var symbolValues = $create(null);
  function isSymbol(symbol) {
    return typeof symbol === 'object' && symbol instanceof SymbolValue;
  }
  function typeOf(v) {
    if (isSymbol(v))
      return 'symbol';
    return typeof v;
  }
  function Symbol(description) {
    var value = new SymbolValue(description);
    if (!(this instanceof Symbol))
      return value;
    throw new TypeError('Symbol cannot be new\'ed');
  }
  $defineProperty(Symbol.prototype, 'constructor', nonEnum(Symbol));
  $defineProperty(Symbol.prototype, 'toString', method(function() {
    var symbolValue = this[symbolDataProperty];
    if (!getOption('symbols'))
      return symbolValue[symbolInternalProperty];
    if (!symbolValue)
      throw TypeError('Conversion from symbol to string');
    var desc = symbolValue[symbolDescriptionProperty];
    if (desc === undefined)
      desc = '';
    return 'Symbol(' + desc + ')';
  }));
  $defineProperty(Symbol.prototype, 'valueOf', method(function() {
    var symbolValue = this[symbolDataProperty];
    if (!symbolValue)
      throw TypeError('Conversion from symbol to string');
    if (!getOption('symbols'))
      return symbolValue[symbolInternalProperty];
    return symbolValue;
  }));
  function SymbolValue(description) {
    var key = newUniqueString();
    $defineProperty(this, symbolDataProperty, {value: this});
    $defineProperty(this, symbolInternalProperty, {value: key});
    $defineProperty(this, symbolDescriptionProperty, {value: description});
    $freeze(this);
    symbolValues[key] = this;
  }
  $defineProperty(SymbolValue.prototype, 'constructor', nonEnum(Symbol));
  $defineProperty(SymbolValue.prototype, 'toString', {
    value: Symbol.prototype.toString,
    enumerable: false
  });
  $defineProperty(SymbolValue.prototype, 'valueOf', {
    value: Symbol.prototype.valueOf,
    enumerable: false
  });
  $freeze(SymbolValue.prototype);
  Symbol.iterator = Symbol();
  function toProperty(name) {
    if (isSymbol(name))
      return name[symbolInternalProperty];
    return name;
  }
  function getOwnPropertyNames(object) {
    var rv = [];
    var names = $getOwnPropertyNames(object);
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      if (!symbolValues[name])
        rv.push(name);
    }
    return rv;
  }
  function getOwnPropertyDescriptor(object, name) {
    return $getOwnPropertyDescriptor(object, toProperty(name));
  }
  function getOwnPropertySymbols(object) {
    var rv = [];
    var names = $getOwnPropertyNames(object);
    for (var i = 0; i < names.length; i++) {
      var symbol = symbolValues[names[i]];
      if (symbol)
        rv.push(symbol);
    }
    return rv;
  }
  function hasOwnProperty(name) {
    return $hasOwnProperty.call(this, toProperty(name));
  }
  function getOption(name) {
    return global.traceur && global.traceur.options[name];
  }
  function setProperty(object, name, value) {
    var sym,
        desc;
    if (isSymbol(name)) {
      sym = name;
      name = name[symbolInternalProperty];
    }
    object[name] = value;
    if (sym && (desc = $getOwnPropertyDescriptor(object, name)))
      $defineProperty(object, name, {enumerable: false});
    return value;
  }
  function defineProperty(object, name, descriptor) {
    if (isSymbol(name)) {
      if (descriptor.enumerable) {
        descriptor = $create(descriptor, {enumerable: {value: false}});
      }
      name = name[symbolInternalProperty];
    }
    $defineProperty(object, name, descriptor);
    return object;
  }
  function polyfillObject(Object) {
    $defineProperty(Object, 'defineProperty', {value: defineProperty});
    $defineProperty(Object, 'getOwnPropertyNames', {value: getOwnPropertyNames});
    $defineProperty(Object, 'getOwnPropertyDescriptor', {value: getOwnPropertyDescriptor});
    $defineProperty(Object.prototype, 'hasOwnProperty', {value: hasOwnProperty});
    Object.getOwnPropertySymbols = getOwnPropertySymbols;
    function is(left, right) {
      if (left === right)
        return left !== 0 || 1 / left === 1 / right;
      return left !== left && right !== right;
    }
    $defineProperty(Object, 'is', method(is));
    function assign(target, source) {
      var props = $getOwnPropertyNames(source);
      var p,
          length = props.length;
      for (p = 0; p < length; p++) {
        target[props[p]] = source[props[p]];
      }
      return target;
    }
    $defineProperty(Object, 'assign', method(assign));
    function mixin(target, source) {
      var props = $getOwnPropertyNames(source);
      var p,
          descriptor,
          length = props.length;
      for (p = 0; p < length; p++) {
        descriptor = $getOwnPropertyDescriptor(source, props[p]);
        $defineProperty(target, props[p], descriptor);
      }
      return target;
    }
    $defineProperty(Object, 'mixin', method(mixin));
  }
  function exportStar(object) {
    for (var i = 1; i < arguments.length; i++) {
      var names = $getOwnPropertyNames(arguments[i]);
      for (var j = 0; j < names.length; j++) {
        (function(mod, name) {
          $defineProperty(object, name, {
            get: function() {
              return mod[name];
            },
            enumerable: true
          });
        })(arguments[i], names[j]);
      }
    }
    return object;
  }
  function toObject(value) {
    if (value == null)
      throw $TypeError();
    return $Object(value);
  }
  function spread() {
    var rv = [],
        k = 0;
    for (var i = 0; i < arguments.length; i++) {
      var valueToSpread = toObject(arguments[i]);
      for (var j = 0; j < valueToSpread.length; j++) {
        rv[k++] = valueToSpread[j];
      }
    }
    return rv;
  }
  function getPropertyDescriptor(object, name) {
    while (object !== null) {
      var result = $getOwnPropertyDescriptor(object, name);
      if (result)
        return result;
      object = $getPrototypeOf(object);
    }
    return undefined;
  }
  function superDescriptor(homeObject, name) {
    var proto = $getPrototypeOf(homeObject);
    if (!proto)
      throw $TypeError('super is null');
    return getPropertyDescriptor(proto, name);
  }
  function superCall(self, homeObject, name, args) {
    var descriptor = superDescriptor(homeObject, name);
    if (descriptor) {
      if ('value' in descriptor)
        return descriptor.value.apply(self, args);
      if (descriptor.get)
        return descriptor.get.call(self).apply(self, args);
    }
    throw $TypeError("super has no method '" + name + "'.");
  }
  function superGet(self, homeObject, name) {
    var descriptor = superDescriptor(homeObject, name);
    if (descriptor) {
      if (descriptor.get)
        return descriptor.get.call(self);
      else if ('value' in descriptor)
        return descriptor.value;
    }
    return undefined;
  }
  function superSet(self, homeObject, name, value) {
    var descriptor = superDescriptor(homeObject, name);
    if (descriptor && descriptor.set) {
      descriptor.set.call(self, value);
      return value;
    }
    throw $TypeError("super has no setter '" + name + "'.");
  }
  function getDescriptors(object) {
    var descriptors = {},
        name,
        names = $getOwnPropertyNames(object);
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      descriptors[name] = $getOwnPropertyDescriptor(object, name);
    }
    return descriptors;
  }
  function createClass(ctor, object, staticObject, superClass) {
    $defineProperty(object, 'constructor', {
      value: ctor,
      configurable: true,
      enumerable: false,
      writable: true
    });
    if (arguments.length > 3) {
      if (typeof superClass === 'function')
        ctor.__proto__ = superClass;
      ctor.prototype = $create(getProtoParent(superClass), getDescriptors(object));
    } else {
      ctor.prototype = object;
    }
    $defineProperty(ctor, 'prototype', {
      configurable: false,
      writable: false
    });
    return $defineProperties(ctor, getDescriptors(staticObject));
  }
  function getProtoParent(superClass) {
    if (typeof superClass === 'function') {
      var prototype = superClass.prototype;
      if ($Object(prototype) === prototype || prototype === null)
        return superClass.prototype;
    }
    if (superClass === null)
      return null;
    throw new TypeError();
  }
  function defaultSuperCall(self, homeObject, args) {
    if ($getPrototypeOf(homeObject) !== null)
      superCall(self, homeObject, 'constructor', args);
  }
  var ST_NEWBORN = 0;
  var ST_EXECUTING = 1;
  var ST_SUSPENDED = 2;
  var ST_CLOSED = 3;
  var END_STATE = -2;
  var RETHROW_STATE = -3;
  function addIterator(object) {
    return defineProperty(object, Symbol.iterator, nonEnum(function() {
      return this;
    }));
  }
  function getInternalError(state) {
    return new Error('Traceur compiler bug: invalid state in state machine: ' + state);
  }
  function GeneratorContext() {
    this.state = 0;
    this.GState = ST_NEWBORN;
    this.storedException = undefined;
    this.finallyFallThrough = undefined;
    this.sent_ = undefined;
    this.returnValue = undefined;
    this.tryStack_ = [];
  }
  GeneratorContext.prototype = {
    pushTry: function(catchState, finallyState) {
      if (finallyState !== null) {
        var finallyFallThrough = null;
        for (var i = this.tryStack_.length - 1; i >= 0; i--) {
          if (this.tryStack_[i].catch !== undefined) {
            finallyFallThrough = this.tryStack_[i].catch;
            break;
          }
        }
        if (finallyFallThrough === null)
          finallyFallThrough = RETHROW_STATE;
        this.tryStack_.push({
          finally: finallyState,
          finallyFallThrough: finallyFallThrough
        });
      }
      if (catchState !== null) {
        this.tryStack_.push({catch: catchState});
      }
    },
    popTry: function() {
      this.tryStack_.pop();
    },
    get sent() {
      this.maybeThrow();
      return this.sent_;
    },
    set sent(v) {
      this.sent_ = v;
    },
    get sentIgnoreThrow() {
      return this.sent_;
    },
    maybeThrow: function() {
      if (this.action === 'throw') {
        this.action = 'next';
        throw this.sent_;
      }
    },
    end: function() {
      switch (this.state) {
        case END_STATE:
          return this;
        case RETHROW_STATE:
          throw this.storedException;
        default:
          throw getInternalError(this.state);
      }
    }
  };
  function getNextOrThrow(ctx, moveNext, action) {
    return function(x) {
      switch (ctx.GState) {
        case ST_EXECUTING:
          throw new Error(("\"" + action + "\" on executing generator"));
        case ST_CLOSED:
          throw new Error(("\"" + action + "\" on closed generator"));
        case ST_NEWBORN:
          if (action === 'throw') {
            ctx.GState = ST_CLOSED;
            throw x;
          }
          if (x !== undefined)
            throw $TypeError('Sent value to newborn generator');
        case ST_SUSPENDED:
          ctx.GState = ST_EXECUTING;
          ctx.action = action;
          ctx.sent = x;
          var value = moveNext(ctx);
          var done = value === ctx;
          if (done)
            value = ctx.returnValue;
          ctx.GState = done ? ST_CLOSED : ST_SUSPENDED;
          return {
            value: value,
            done: done
          };
      }
    };
  }
  function generatorWrap(innerFunction, self) {
    var moveNext = getMoveNext(innerFunction, self);
    var ctx = new GeneratorContext();
    return addIterator({
      next: getNextOrThrow(ctx, moveNext, 'next'),
      throw: getNextOrThrow(ctx, moveNext, 'throw')
    });
  }
  function AsyncFunctionContext() {
    GeneratorContext.call(this);
    this.err = undefined;
    var ctx = this;
    ctx.result = new Promise(function(resolve, reject) {
      ctx.resolve = resolve;
      ctx.reject = reject;
    });
  }
  AsyncFunctionContext.prototype = Object.create(GeneratorContext.prototype);
  AsyncFunctionContext.prototype.end = function() {
    switch (this.state) {
      case END_STATE:
        return;
      case RETHROW_STATE:
        this.reject(this.storedException);
      default:
        this.reject(getInternalError(this.state));
    }
  };
  function asyncWrap(innerFunction, self) {
    var moveNext = getMoveNext(innerFunction, self);
    var ctx = new AsyncFunctionContext();
    ctx.createCallback = function(newState) {
      return function(value) {
        ctx.state = newState;
        ctx.value = value;
        moveNext(ctx);
      };
    };
    ctx.createErrback = function(newState) {
      return function(err) {
        ctx.state = newState;
        ctx.err = err;
        moveNext(ctx);
      };
    };
    moveNext(ctx);
    return ctx.result;
  }
  function getMoveNext(innerFunction, self) {
    return function(ctx) {
      while (true) {
        try {
          return innerFunction.call(self, ctx);
        } catch (ex) {
          ctx.storedException = ex;
          var last = ctx.tryStack_[ctx.tryStack_.length - 1];
          if (!last) {
            ctx.GState = ST_CLOSED;
            ctx.state = END_STATE;
            throw ex;
          }
          ctx.state = last.catch !== undefined ? last.catch : last.finally;
          if (last.finallyFallThrough !== undefined)
            ctx.finallyFallThrough = last.finallyFallThrough;
        }
      }
    };
  }
  function setupGlobals(global) {
    global.Symbol = Symbol;
    polyfillObject(global.Object);
  }
  setupGlobals(global);
  global.$traceurRuntime = {
    asyncWrap: asyncWrap,
    createClass: createClass,
    defaultSuperCall: defaultSuperCall,
    exportStar: exportStar,
    generatorWrap: generatorWrap,
    setProperty: setProperty,
    setupGlobals: setupGlobals,
    spread: spread,
    superCall: superCall,
    superGet: superGet,
    superSet: superSet,
    toObject: toObject,
    toProperty: toProperty,
    type: types,
    typeof: typeOf
  };
})(typeof global !== 'undefined' ? global : this);
(function() {
  function buildFromEncodedParts(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
    var out = [];
    if (opt_scheme) {
      out.push(opt_scheme, ':');
    }
    if (opt_domain) {
      out.push('//');
      if (opt_userInfo) {
        out.push(opt_userInfo, '@');
      }
      out.push(opt_domain);
      if (opt_port) {
        out.push(':', opt_port);
      }
    }
    if (opt_path) {
      out.push(opt_path);
    }
    if (opt_queryData) {
      out.push('?', opt_queryData);
    }
    if (opt_fragment) {
      out.push('#', opt_fragment);
    }
    return out.join('');
  }
  ;
  var splitRe = new RegExp('^' + '(?:' + '([^:/?#.]+)' + ':)?' + '(?://' + '(?:([^/?#]*)@)?' + '([\\w\\d\\-\\u0100-\\uffff.%]*)' + '(?::([0-9]+))?' + ')?' + '([^?#]+)?' + '(?:\\?([^#]*))?' + '(?:#(.*))?' + '$');
  var ComponentIndex = {
    SCHEME: 1,
    USER_INFO: 2,
    DOMAIN: 3,
    PORT: 4,
    PATH: 5,
    QUERY_DATA: 6,
    FRAGMENT: 7
  };
  function split(uri) {
    return (uri.match(splitRe));
  }
  function removeDotSegments(path) {
    if (path === '/')
      return '/';
    var leadingSlash = path[0] === '/' ? '/' : '';
    var trailingSlash = path.slice(-1) === '/' ? '/' : '';
    var segments = path.split('/');
    var out = [];
    var up = 0;
    for (var pos = 0; pos < segments.length; pos++) {
      var segment = segments[pos];
      switch (segment) {
        case '':
        case '.':
          break;
        case '..':
          if (out.length)
            out.pop();
          else
            up++;
          break;
        default:
          out.push(segment);
      }
    }
    if (!leadingSlash) {
      while (up-- > 0) {
        out.unshift('..');
      }
      if (out.length === 0)
        out.push('.');
    }
    return leadingSlash + out.join('/') + trailingSlash;
  }
  function joinAndCanonicalizePath(parts) {
    var path = parts[ComponentIndex.PATH] || '';
    path = removeDotSegments(path);
    parts[ComponentIndex.PATH] = path;
    return buildFromEncodedParts(parts[ComponentIndex.SCHEME], parts[ComponentIndex.USER_INFO], parts[ComponentIndex.DOMAIN], parts[ComponentIndex.PORT], parts[ComponentIndex.PATH], parts[ComponentIndex.QUERY_DATA], parts[ComponentIndex.FRAGMENT]);
  }
  function canonicalizeUrl(url) {
    var parts = split(url);
    return joinAndCanonicalizePath(parts);
  }
  function resolveUrl(base, url) {
    var parts = split(url);
    var baseParts = split(base);
    if (parts[ComponentIndex.SCHEME]) {
      return joinAndCanonicalizePath(parts);
    } else {
      parts[ComponentIndex.SCHEME] = baseParts[ComponentIndex.SCHEME];
    }
    for (var i = ComponentIndex.SCHEME; i <= ComponentIndex.PORT; i++) {
      if (!parts[i]) {
        parts[i] = baseParts[i];
      }
    }
    if (parts[ComponentIndex.PATH][0] == '/') {
      return joinAndCanonicalizePath(parts);
    }
    var path = baseParts[ComponentIndex.PATH];
    var index = path.lastIndexOf('/');
    path = path.slice(0, index + 1) + parts[ComponentIndex.PATH];
    parts[ComponentIndex.PATH] = path;
    return joinAndCanonicalizePath(parts);
  }
  function isAbsolute(name) {
    if (!name)
      return false;
    if (name[0] === '/')
      return true;
    var parts = split(name);
    if (parts[ComponentIndex.SCHEME])
      return true;
    return false;
  }
  $traceurRuntime.canonicalizeUrl = canonicalizeUrl;
  $traceurRuntime.isAbsolute = isAbsolute;
  $traceurRuntime.removeDotSegments = removeDotSegments;
  $traceurRuntime.resolveUrl = resolveUrl;
})();
(function(global) {
  'use strict';
  var $__2 = $traceurRuntime,
      canonicalizeUrl = $__2.canonicalizeUrl,
      resolveUrl = $__2.resolveUrl,
      isAbsolute = $__2.isAbsolute;
  var moduleInstantiators = Object.create(null);
  var baseURL;
  if (global.location && global.location.href)
    baseURL = resolveUrl(global.location.href, './');
  else
    baseURL = '';
  var UncoatedModuleEntry = function UncoatedModuleEntry(url, uncoatedModule) {
    this.url = url;
    this.value_ = uncoatedModule;
  };
  ($traceurRuntime.createClass)(UncoatedModuleEntry, {}, {});
  var UncoatedModuleInstantiator = function UncoatedModuleInstantiator(url, func) {
    $traceurRuntime.superCall(this, $UncoatedModuleInstantiator.prototype, "constructor", [url, null]);
    this.func = func;
  };
  var $UncoatedModuleInstantiator = UncoatedModuleInstantiator;
  ($traceurRuntime.createClass)(UncoatedModuleInstantiator, {getUncoatedModule: function() {
      if (this.value_)
        return this.value_;
      return this.value_ = this.func.call(global);
    }}, {}, UncoatedModuleEntry);
  function getUncoatedModuleInstantiator(name) {
    if (!name)
      return;
    var url = ModuleStore.normalize(name);
    return moduleInstantiators[url];
  }
  ;
  var moduleInstances = Object.create(null);
  var liveModuleSentinel = {};
  function Module(uncoatedModule) {
    var isLive = arguments[1];
    var coatedModule = Object.create(null);
    Object.getOwnPropertyNames(uncoatedModule).forEach((function(name) {
      var getter,
          value;
      if (isLive === liveModuleSentinel) {
        var descr = Object.getOwnPropertyDescriptor(uncoatedModule, name);
        if (descr.get)
          getter = descr.get;
      }
      if (!getter) {
        value = uncoatedModule[name];
        getter = function() {
          return value;
        };
      }
      Object.defineProperty(coatedModule, name, {
        get: getter,
        enumerable: true
      });
    }));
    Object.preventExtensions(coatedModule);
    return coatedModule;
  }
  var ModuleStore = {
    normalize: function(name, refererName, refererAddress) {
      if (typeof name !== "string")
        throw new TypeError("module name must be a string, not " + typeof name);
      if (isAbsolute(name))
        return canonicalizeUrl(name);
      if (/[^\.]\/\.\.\//.test(name)) {
        throw new Error('module name embeds /../: ' + name);
      }
      if (name[0] === '.' && refererName)
        return resolveUrl(refererName, name);
      return canonicalizeUrl(name);
    },
    get: function(normalizedName) {
      var m = getUncoatedModuleInstantiator(normalizedName);
      if (!m)
        return undefined;
      var moduleInstance = moduleInstances[m.url];
      if (moduleInstance)
        return moduleInstance;
      moduleInstance = Module(m.getUncoatedModule(), liveModuleSentinel);
      return moduleInstances[m.url] = moduleInstance;
    },
    set: function(normalizedName, module) {
      normalizedName = String(normalizedName);
      moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, (function() {
        return module;
      }));
      moduleInstances[normalizedName] = module;
    },
    get baseURL() {
      return baseURL;
    },
    set baseURL(v) {
      baseURL = String(v);
    },
    registerModule: function(name, func) {
      var normalizedName = ModuleStore.normalize(name);
      if (moduleInstantiators[normalizedName])
        throw new Error('duplicate module named ' + normalizedName);
      moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, func);
    },
    bundleStore: Object.create(null),
    register: function(name, deps, func) {
      if (!deps || !deps.length) {
        this.registerModule(name, func);
      } else {
        this.bundleStore[name] = {
          deps: deps,
          execute: func
        };
      }
    },
    getAnonymousModule: function(func) {
      return new Module(func.call(global), liveModuleSentinel);
    },
    getForTesting: function(name) {
      var $__0 = this;
      if (!this.testingPrefix_) {
        Object.keys(moduleInstances).some((function(key) {
          var m = /(traceur@[^\/]*\/)/.exec(key);
          if (m) {
            $__0.testingPrefix_ = m[1];
            return true;
          }
        }));
      }
      return this.get(this.testingPrefix_ + name);
    }
  };
  ModuleStore.set('@traceur/src/runtime/ModuleStore', new Module({ModuleStore: ModuleStore}));
  var setupGlobals = $traceurRuntime.setupGlobals;
  $traceurRuntime.setupGlobals = function(global) {
    setupGlobals(global);
  };
  $traceurRuntime.ModuleStore = ModuleStore;
  global.System = {
    register: ModuleStore.register.bind(ModuleStore),
    get: ModuleStore.get,
    set: ModuleStore.set,
    normalize: ModuleStore.normalize
  };
  $traceurRuntime.getModuleImpl = function(name) {
    var instantiator = getUncoatedModuleInstantiator(name);
    return instantiator && instantiator.getUncoatedModule();
  };
})(typeof global !== 'undefined' ? global : this);
System.register("traceur-runtime@0.0.32/src/runtime/polyfills/utils", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.32/src/runtime/polyfills/utils";
  var toObject = $traceurRuntime.toObject;
  function toUint32(x) {
    return x | 0;
  }
  return {
    get toObject() {
      return toObject;
    },
    get toUint32() {
      return toUint32;
    }
  };
});
System.register("traceur-runtime@0.0.32/src/runtime/polyfills/ArrayIterator", [], function() {
  "use strict";
  var $__4;
  var __moduleName = "traceur-runtime@0.0.32/src/runtime/polyfills/ArrayIterator";
  var $__5 = System.get("traceur-runtime@0.0.32/src/runtime/polyfills/utils"),
      toObject = $__5.toObject,
      toUint32 = $__5.toUint32;
  var ARRAY_ITERATOR_KIND_KEYS = 1;
  var ARRAY_ITERATOR_KIND_VALUES = 2;
  var ARRAY_ITERATOR_KIND_ENTRIES = 3;
  var ArrayIterator = function ArrayIterator() {};
  ($traceurRuntime.createClass)(ArrayIterator, ($__4 = {}, Object.defineProperty($__4, "next", {
    value: function() {
      var iterator = toObject(this);
      var array = iterator.iteratorObject_;
      if (!array) {
        throw new TypeError('Object is not an ArrayIterator');
      }
      var index = iterator.arrayIteratorNextIndex_;
      var itemKind = iterator.arrayIterationKind_;
      var length = toUint32(array.length);
      if (index >= length) {
        iterator.arrayIteratorNextIndex_ = Infinity;
        return createIteratorResultObject(undefined, true);
      }
      iterator.arrayIteratorNextIndex_ = index + 1;
      if (itemKind == ARRAY_ITERATOR_KIND_VALUES)
        return createIteratorResultObject(array[index], false);
      if (itemKind == ARRAY_ITERATOR_KIND_ENTRIES)
        return createIteratorResultObject([index, array[index]], false);
      return createIteratorResultObject(index, false);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, Symbol.iterator, {
    value: function() {
      return this;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), $__4), {});
  function createArrayIterator(array, kind) {
    var object = toObject(array);
    var iterator = new ArrayIterator;
    iterator.iteratorObject_ = object;
    iterator.arrayIteratorNextIndex_ = 0;
    iterator.arrayIterationKind_ = kind;
    return iterator;
  }
  function createIteratorResultObject(value, done) {
    return {
      value: value,
      done: done
    };
  }
  function entries() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_ENTRIES);
  }
  function keys() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_KEYS);
  }
  function values() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_VALUES);
  }
  return {
    get entries() {
      return entries;
    },
    get keys() {
      return keys;
    },
    get values() {
      return values;
    }
  };
});
System.register("traceur-runtime@0.0.32/node_modules/rsvp/lib/rsvp/asap", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.32/node_modules/rsvp/lib/rsvp/asap";
  var $__default = function asap(callback, arg) {
    var length = queue.push([callback, arg]);
    if (length === 1) {
      scheduleFlush();
    }
  };
  var browserGlobal = (typeof window !== 'undefined') ? window : {};
  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
  function useNextTick() {
    return function() {
      process.nextTick(flush);
    };
  }
  function useMutationObserver() {
    var iterations = 0;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, {characterData: true});
    return function() {
      node.data = (iterations = ++iterations % 2);
    };
  }
  function useSetTimeout() {
    return function() {
      setTimeout(flush, 1);
    };
  }
  var queue = [];
  function flush() {
    for (var i = 0; i < queue.length; i++) {
      var tuple = queue[i];
      var callback = tuple[0],
          arg = tuple[1];
      callback(arg);
    }
    queue = [];
  }
  var scheduleFlush;
  if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
    scheduleFlush = useNextTick();
  } else if (BrowserMutationObserver) {
    scheduleFlush = useMutationObserver();
  } else {
    scheduleFlush = useSetTimeout();
  }
  return {get default() {
      return $__default;
    }};
});
System.register("traceur-runtime@0.0.32/src/runtime/polyfills/Promise", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.32/src/runtime/polyfills/Promise";
  var async = System.get("traceur-runtime@0.0.32/node_modules/rsvp/lib/rsvp/asap").default;
  function isPromise(x) {
    return x && typeof x === 'object' && x.status_ !== undefined;
  }
  function chain(promise) {
    var onResolve = arguments[1] !== (void 0) ? arguments[1] : (function(x) {
      return x;
    });
    var onReject = arguments[2] !== (void 0) ? arguments[2] : (function(e) {
      throw e;
    });
    var deferred = getDeferred(promise.constructor);
    switch (promise.status_) {
      case undefined:
        throw TypeError;
      case 'pending':
        promise.onResolve_.push([deferred, onResolve]);
        promise.onReject_.push([deferred, onReject]);
        break;
      case 'resolved':
        promiseReact(deferred, onResolve, promise.value_);
        break;
      case 'rejected':
        promiseReact(deferred, onReject, promise.value_);
        break;
    }
    return deferred.promise;
  }
  function getDeferred(C) {
    var result = {};
    result.promise = new C((function(resolve, reject) {
      result.resolve = resolve;
      result.reject = reject;
    }));
    return result;
  }
  var Promise = function Promise(resolver) {
    var $__6 = this;
    this.status_ = 'pending';
    this.onResolve_ = [];
    this.onReject_ = [];
    resolver((function(x) {
      promiseResolve($__6, x);
    }), (function(r) {
      promiseReject($__6, r);
    }));
  };
  ($traceurRuntime.createClass)(Promise, {
    catch: function(onReject) {
      return this.then(undefined, onReject);
    },
    then: function() {
      var onResolve = arguments[0] !== (void 0) ? arguments[0] : (function(x) {
        return x;
      });
      var onReject = arguments[1];
      var $__6 = this;
      var constructor = this.constructor;
      return chain(this, (function(x) {
        x = promiseCoerce(constructor, x);
        return x === $__6 ? onReject(new TypeError) : isPromise(x) ? x.then(onResolve, onReject) : onResolve(x);
      }), onReject);
    }
  }, {
    resolve: function(x) {
      return new this((function(resolve, reject) {
        resolve(x);
      }));
    },
    reject: function(r) {
      return new this((function(resolve, reject) {
        reject(r);
      }));
    },
    cast: function(x) {
      if (x instanceof this)
        return x;
      if (isPromise(x)) {
        var result = getDeferred(this);
        chain(x, result.resolve, result.reject);
        return result.promise;
      }
      return this.resolve(x);
    },
    all: function(values) {
      var deferred = getDeferred(this);
      var count = 0;
      var resolutions = [];
      try {
        for (var i = 0; i < values.length; i++) {
          ++count;
          this.cast(values[i]).then(function(i, x) {
            resolutions[i] = x;
            if (--count === 0)
              deferred.resolve(resolutions);
          }.bind(undefined, i), (function(r) {
            if (count > 0)
              count = 0;
            deferred.reject(r);
          }));
        }
        if (count === 0)
          deferred.resolve(resolutions);
      } catch (e) {
        deferred.reject(e);
      }
      return deferred.promise;
    },
    race: function(values) {
      var deferred = getDeferred(this);
      try {
        for (var i = 0; i < values.length; i++) {
          this.cast(values[i]).then((function(x) {
            deferred.resolve(x);
          }), (function(r) {
            deferred.reject(r);
          }));
        }
      } catch (e) {
        deferred.reject(e);
      }
      return deferred.promise;
    }
  });
  function promiseResolve(promise, x) {
    promiseDone(promise, 'resolved', x, promise.onResolve_);
  }
  function promiseReject(promise, r) {
    promiseDone(promise, 'rejected', r, promise.onReject_);
  }
  function promiseDone(promise, status, value, reactions) {
    if (promise.status_ !== 'pending')
      return;
    for (var i = 0; i < reactions.length; i++) {
      promiseReact(reactions[i][0], reactions[i][1], value);
    }
    promise.status_ = status;
    promise.value_ = value;
    promise.onResolve_ = promise.onReject_ = undefined;
  }
  function promiseReact(deferred, handler, x) {
    async((function() {
      try {
        var y = handler(x);
        if (y === deferred.promise)
          throw new TypeError;
        else if (isPromise(y))
          chain(y, deferred.resolve, deferred.reject);
        else
          deferred.resolve(y);
      } catch (e) {
        deferred.reject(e);
      }
    }));
  }
  var thenableSymbol = '@@thenable';
  function promiseCoerce(constructor, x) {
    if (isPromise(x)) {
      return x;
    } else if (x && typeof x.then === 'function') {
      var p = x[thenableSymbol];
      if (p) {
        return p;
      } else {
        var deferred = getDeferred(constructor);
        x[thenableSymbol] = deferred.promise;
        try {
          x.then(deferred.resolve, deferred.reject);
        } catch (e) {
          deferred.reject(e);
        }
        return deferred.promise;
      }
    } else {
      return x;
    }
  }
  return {get Promise() {
      return Promise;
    }};
});
System.register("traceur-runtime@0.0.32/src/runtime/polyfills/String", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.32/src/runtime/polyfills/String";
  var $toString = Object.prototype.toString;
  var $indexOf = String.prototype.indexOf;
  var $lastIndexOf = String.prototype.lastIndexOf;
  function startsWith(search) {
    var string = String(this);
    if (this == null || $toString.call(search) == '[object RegExp]') {
      throw TypeError();
    }
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var position = arguments.length > 1 ? arguments[1] : undefined;
    var pos = position ? Number(position) : 0;
    if (isNaN(pos)) {
      pos = 0;
    }
    var start = Math.min(Math.max(pos, 0), stringLength);
    return $indexOf.call(string, searchString, pos) == start;
  }
  function endsWith(search) {
    var string = String(this);
    if (this == null || $toString.call(search) == '[object RegExp]') {
      throw TypeError();
    }
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var pos = stringLength;
    if (arguments.length > 1) {
      var position = arguments[1];
      if (position !== undefined) {
        pos = position ? Number(position) : 0;
        if (isNaN(pos)) {
          pos = 0;
        }
      }
    }
    var end = Math.min(Math.max(pos, 0), stringLength);
    var start = end - searchLength;
    if (start < 0) {
      return false;
    }
    return $lastIndexOf.call(string, searchString, start) == start;
  }
  function contains(search) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var position = arguments.length > 1 ? arguments[1] : undefined;
    var pos = position ? Number(position) : 0;
    if (isNaN(pos)) {
      pos = 0;
    }
    var start = Math.min(Math.max(pos, 0), stringLength);
    return $indexOf.call(string, searchString, pos) != -1;
  }
  function repeat(count) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var n = count ? Number(count) : 0;
    if (isNaN(n)) {
      n = 0;
    }
    if (n < 0 || n == Infinity) {
      throw RangeError();
    }
    if (n == 0) {
      return '';
    }
    var result = '';
    while (n--) {
      result += string;
    }
    return result;
  }
  function codePointAt(position) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var size = string.length;
    var index = position ? Number(position) : 0;
    if (isNaN(index)) {
      index = 0;
    }
    if (index < 0 || index >= size) {
      return undefined;
    }
    var first = string.charCodeAt(index);
    var second;
    if (first >= 0xD800 && first <= 0xDBFF && size > index + 1) {
      second = string.charCodeAt(index + 1);
      if (second >= 0xDC00 && second <= 0xDFFF) {
        return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
      }
    }
    return first;
  }
  function raw(callsite) {
    var raw = callsite.raw;
    var len = raw.length >>> 0;
    if (len === 0)
      return '';
    var s = '';
    var i = 0;
    while (true) {
      s += raw[i];
      if (i + 1 === len)
        return s;
      s += arguments[++i];
    }
  }
  function fromCodePoint() {
    var codeUnits = [];
    var floor = Math.floor;
    var highSurrogate;
    var lowSurrogate;
    var index = -1;
    var length = arguments.length;
    if (!length) {
      return '';
    }
    while (++index < length) {
      var codePoint = Number(arguments[index]);
      if (!isFinite(codePoint) || codePoint < 0 || codePoint > 0x10FFFF || floor(codePoint) != codePoint) {
        throw RangeError('Invalid code point: ' + codePoint);
      }
      if (codePoint <= 0xFFFF) {
        codeUnits.push(codePoint);
      } else {
        codePoint -= 0x10000;
        highSurrogate = (codePoint >> 10) + 0xD800;
        lowSurrogate = (codePoint % 0x400) + 0xDC00;
        codeUnits.push(highSurrogate, lowSurrogate);
      }
    }
    return String.fromCharCode.apply(null, codeUnits);
  }
  return {
    get startsWith() {
      return startsWith;
    },
    get endsWith() {
      return endsWith;
    },
    get contains() {
      return contains;
    },
    get repeat() {
      return repeat;
    },
    get codePointAt() {
      return codePointAt;
    },
    get raw() {
      return raw;
    },
    get fromCodePoint() {
      return fromCodePoint;
    }
  };
});
System.register("traceur-runtime@0.0.32/src/runtime/polyfills/polyfills", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.32/src/runtime/polyfills/polyfills";
  var Promise = System.get("traceur-runtime@0.0.32/src/runtime/polyfills/Promise").Promise;
  var $__9 = System.get("traceur-runtime@0.0.32/src/runtime/polyfills/String"),
      codePointAt = $__9.codePointAt,
      contains = $__9.contains,
      endsWith = $__9.endsWith,
      fromCodePoint = $__9.fromCodePoint,
      repeat = $__9.repeat,
      raw = $__9.raw,
      startsWith = $__9.startsWith;
  var $__9 = System.get("traceur-runtime@0.0.32/src/runtime/polyfills/ArrayIterator"),
      entries = $__9.entries,
      keys = $__9.keys,
      values = $__9.values;
  function maybeDefineMethod(object, name, value) {
    if (!(name in object)) {
      Object.defineProperty(object, name, {
        value: value,
        configurable: true,
        enumerable: false,
        writable: true
      });
    }
  }
  function maybeAddFunctions(object, functions) {
    for (var i = 0; i < functions.length; i += 2) {
      var name = functions[i];
      var value = functions[i + 1];
      maybeDefineMethod(object, name, value);
    }
  }
  function polyfillPromise(global) {
    if (!global.Promise)
      global.Promise = Promise;
  }
  function polyfillString(String) {
    maybeAddFunctions(String.prototype, ['codePointAt', codePointAt, 'contains', contains, 'endsWith', endsWith, 'startsWith', startsWith, 'repeat', repeat]);
    maybeAddFunctions(String, ['fromCodePoint', fromCodePoint, 'raw', raw]);
  }
  function polyfillArray(Array, Symbol) {
    maybeAddFunctions(Array.prototype, ['entries', entries, 'keys', keys, 'values', values]);
    if (Symbol && Symbol.iterator) {
      Object.defineProperty(Array.prototype, Symbol.iterator, {
        value: values,
        configurable: true,
        enumerable: false,
        writable: true
      });
    }
  }
  function polyfill(global) {
    polyfillPromise(global);
    polyfillString(global.String);
    polyfillArray(global.Array, global.Symbol);
  }
  polyfill(this);
  var setupGlobals = $traceurRuntime.setupGlobals;
  $traceurRuntime.setupGlobals = function(global) {
    setupGlobals(global);
    polyfill(global);
  };
  return {};
});
System.register("traceur-runtime@0.0.32/src/runtime/polyfill-import", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.32/src/runtime/polyfill-import";
  var $__11 = System.get("traceur-runtime@0.0.32/src/runtime/polyfills/polyfills");
  return {};
});
System.get("traceur-runtime@0.0.32/src/runtime/polyfill-import" + '');

}).call(this,require("/Users/francoponticelli/projects/cards/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"/Users/francoponticelli/projects/cards/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":11}],13:[function(require,module,exports){
"use strict";
exports.test = function () {
    return false;
};
},{}],14:[function(require,module,exports){
"use strict";
var types = [
    require("./nextTick"),
    require("./mutation"),
    require("./postMessage"),
    require("./messageChannel"),
    require("./stateChange"),
    require("./timeout")
];
var handlerQueue = [];
function drainQueue() {
    var i = 0,
        task,
        innerQueue = handlerQueue;
	handlerQueue = [];
	/*jslint boss: true */
	while (task = innerQueue[i++]) {
		task();
	}
}
var nextTick;
var i = -1;
var len = types.length;
while (++ i < len) {
    if (types[i].test()) {
        nextTick = types[i].install(drainQueue);
        break;
    }
}
module.exports = function (task) {
    var len, i, args;
    var nTask = task;
    if (arguments.length > 1 && typeof task === "function") {
        args = new Array(arguments.length - 1);
        i = 0;
        while (++i < arguments.length) {
            args[i - 1] = arguments[i];
        }
        nTask = function () {
            task.apply(undefined, args);
        };
    }
    if ((len = handlerQueue.push(nTask)) === 1) {
        nextTick(drainQueue);
    }
    return len;
};
module.exports.clear = function (n) {
    if (n <= handlerQueue.length) {
        handlerQueue[n - 1] = function () {};
    }
    return this;
};

},{"./messageChannel":15,"./mutation":16,"./nextTick":13,"./postMessage":17,"./stateChange":18,"./timeout":19}],15:[function(require,module,exports){
(function (global){
"use strict";

exports.test = function () {
    return typeof global.MessageChannel !== "undefined";
};

exports.install = function (func) {
    var channel = new global.MessageChannel();
    channel.port1.onmessage = func;
    return function () {
        channel.port2.postMessage(0);
    };
};
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],16:[function(require,module,exports){
(function (global){
"use strict";
//based off rsvp
//https://github.com/tildeio/rsvp.js/blob/master/lib/rsvp/async.js

var MutationObserver = global.MutationObserver || global.WebKitMutationObserver;

exports.test = function () {
    return MutationObserver;
};

exports.install = function (handle) {
    var observer = new MutationObserver(handle);
    var element = global.document.createElement("div");
    observer.observe(element, { attributes: true });

    // Chrome Memory Leak: https://bugs.webkit.org/show_bug.cgi?id=93661
    global.addEventListener("unload", function () {
        observer.disconnect();
        observer = null;
    }, false);
    return function () {
        element.setAttribute("drainQueue", "drainQueue");
    };
};
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],17:[function(require,module,exports){
(function (global){
"use strict";
exports.test = function () {
    // The test against `importScripts` prevents this implementation from being installed inside a web worker,
    // where `global.postMessage` means something completely different and can"t be used for this purpose.

    if (!global.postMessage || global.importScripts) {
        return false;
    }

    var postMessageIsAsynchronous = true;
    var oldOnMessage = global.onmessage;
    global.onmessage = function () {
        postMessageIsAsynchronous = false;
    };
    global.postMessage("", "*");
    global.onmessage = oldOnMessage;

    return postMessageIsAsynchronous;
};

exports.install = function (func) {
    var codeWord = "com.calvinmetcalf.setImmediate" + Math.random();
    function globalMessage(event) {
        if (event.source === global && event.data === codeWord) {
            func();
        }
    }
    if (global.addEventListener) {
        global.addEventListener("message", globalMessage, false);
    } else {
        global.attachEvent("onmessage", globalMessage);
    }
    return function () {
        global.postMessage(codeWord, "*");
    };
};
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],18:[function(require,module,exports){
(function (global){
"use strict";

exports.test = function () {
    return "document" in global && "onreadystatechange" in global.document.createElement("script");
};

exports.install = function (handle) {
    return function () {

        // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
        // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
        var scriptEl = global.document.createElement("script");
        scriptEl.onreadystatechange = function () {
            handle();

            scriptEl.onreadystatechange = null;
            scriptEl.parentNode.removeChild(scriptEl);
            scriptEl = null;
        };
        global.document.documentElement.appendChild(scriptEl);

        return handle;
    };
};
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],19:[function(require,module,exports){
"use strict";
exports.test = function () {
    return true;
};

exports.install = function (t) {
    return function () {
        setTimeout(t, 0);
    };
};
},{}],20:[function(require,module,exports){
(function (global){
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.jade=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = merge(attrs, a[i]);
    }
    return attrs;
  }
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    a['class'] = ac.concat(bc).filter(nulls);
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== '';
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 */
exports.joinClasses = joinClasses;
function joinClasses(val) {
  return Array.isArray(val) ? val.map(joinClasses).filter(nulls).join(' ') : val;
}

/**
 * Render the given classes.
 *
 * @param {Array} classes
 * @param {Array.<Boolean>} escaped
 * @return {String}
 */
exports.cls = function cls(classes, escaped) {
  var buf = [];
  for (var i = 0; i < classes.length; i++) {
    if (escaped && escaped[i]) {
      buf.push(exports.escape(joinClasses([classes[i]])));
    } else {
      buf.push(joinClasses(classes[i]));
    }
  }
  var text = joinClasses(buf);
  if (text.length) {
    return ' class="' + text + '"';
  } else {
    return '';
  }
};

/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = function attr(key, val, escaped, terse) {
  if ('boolean' == typeof val || null == val) {
    if (val) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    } else {
      return '';
    }
  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
  } else if (escaped) {
    return ' ' + key + '="' + exports.escape(val) + '"';
  } else {
    return ' ' + key + '="' + val + '"';
  }
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 */
exports.attrs = function attrs(obj, terse){
  var buf = [];

  var keys = Object.keys(obj);

  if (keys.length) {
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('class' == key) {
        if (val = joinClasses(val)) {
          buf.push(' ' + key + '="' + val + '"');
        }
      } else {
        buf.push(exports.attr(key, val, false, terse));
      }
    }
  }

  return buf.join('');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  var result = String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  if (result === '' + html) return html;
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str =  str || _dereq_('fs').readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

},{"fs":2}],2:[function(_dereq_,module,exports){

},{}]},{},[1])
(1)
});
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],21:[function(require,module,exports){
(function (Buffer){
//     uuid.js
//
//     Copyright (c) 2010-2012 Robert Kieffer
//     MIT License - http://opensource.org/licenses/mit-license.php

(function() {
  var _global = this;

  // Unique ID creation requires a high quality random # generator.  We feature
  // detect to determine the best RNG source, normalizing to a function that
  // returns 128-bits of randomness, since that's what's usually required
  var _rng;

  // Node.js crypto-based RNG - http://nodejs.org/docs/v0.6.2/api/crypto.html
  //
  // Moderately fast, high quality
  if (typeof(require) == 'function') {
    try {
      var _rb = require('crypto').randomBytes;
      _rng = _rb && function() {return _rb(16);};
    } catch(e) {}
  }

  if (!_rng && _global.crypto && crypto.getRandomValues) {
    // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
    //
    // Moderately fast, high quality
    var _rnds8 = new Uint8Array(16);
    _rng = function whatwgRNG() {
      crypto.getRandomValues(_rnds8);
      return _rnds8;
    };
  }

  if (!_rng) {
    // Math.random()-based (RNG)
    //
    // If all else fails, use Math.random().  It's fast, but is of unspecified
    // quality.
    var  _rnds = new Array(16);
    _rng = function() {
      for (var i = 0, r; i < 16; i++) {
        if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
        _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
      }

      return _rnds;
    };
  }

  // Buffer class to use
  var BufferClass = typeof(Buffer) == 'function' ? Buffer : Array;

  // Maps for number <-> hex string conversion
  var _byteToHex = [];
  var _hexToByte = {};
  for (var i = 0; i < 256; i++) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
    _hexToByte[_byteToHex[i]] = i;
  }

  // **`parse()` - Parse a UUID into it's component bytes**
  function parse(s, buf, offset) {
    var i = (buf && offset) || 0, ii = 0;

    buf = buf || [];
    s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
      if (ii < 16) { // Don't overflow!
        buf[i + ii++] = _hexToByte[oct];
      }
    });

    // Zero out remaining bytes if string was short
    while (ii < 16) {
      buf[i + ii++] = 0;
    }

    return buf;
  }

  // **`unparse()` - Convert UUID byte array (ala parse()) into a string**
  function unparse(buf, offset) {
    var i = offset || 0, bth = _byteToHex;
    return  bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]];
  }

  // **`v1()` - Generate time-based UUID**
  //
  // Inspired by https://github.com/LiosK/UUID.js
  // and http://docs.python.org/library/uuid.html

  // random #'s we need to init node and clockseq
  var _seedBytes = _rng();

  // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
  var _nodeId = [
    _seedBytes[0] | 0x01,
    _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
  ];

  // Per 4.2.2, randomize (14 bit) clockseq
  var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

  // Previous uuid creation time
  var _lastMSecs = 0, _lastNSecs = 0;

  // See https://github.com/broofa/node-uuid for API details
  function v1(options, buf, offset) {
    var i = buf && offset || 0;
    var b = buf || [];

    options = options || {};

    var clockseq = options.clockseq != null ? options.clockseq : _clockseq;

    // UUID timestamps are 100 nano-second units since the Gregorian epoch,
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
    var msecs = options.msecs != null ? options.msecs : new Date().getTime();

    // Per 4.2.1.2, use count of uuid's generated during the current clock
    // cycle to simulate higher resolution clock
    var nsecs = options.nsecs != null ? options.nsecs : _lastNSecs + 1;

    // Time since last uuid creation (in msecs)
    var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

    // Per 4.2.1.2, Bump clockseq on clock regression
    if (dt < 0 && options.clockseq == null) {
      clockseq = clockseq + 1 & 0x3fff;
    }

    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
    // time interval
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs == null) {
      nsecs = 0;
    }

    // Per 4.2.1.2 Throw error if too many uuids are requested
    if (nsecs >= 10000) {
      throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
    }

    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;

    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    msecs += 12219292800000;

    // `time_low`
    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    b[i++] = tl >>> 24 & 0xff;
    b[i++] = tl >>> 16 & 0xff;
    b[i++] = tl >>> 8 & 0xff;
    b[i++] = tl & 0xff;

    // `time_mid`
    var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
    b[i++] = tmh >>> 8 & 0xff;
    b[i++] = tmh & 0xff;

    // `time_high_and_version`
    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
    b[i++] = tmh >>> 16 & 0xff;

    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    b[i++] = clockseq >>> 8 | 0x80;

    // `clock_seq_low`
    b[i++] = clockseq & 0xff;

    // `node`
    var node = options.node || _nodeId;
    for (var n = 0; n < 6; n++) {
      b[i + n] = node[n];
    }

    return buf ? buf : unparse(b);
  }

  // **`v4()` - Generate random UUID**

  // See https://github.com/broofa/node-uuid for API details
  function v4(options, buf, offset) {
    // Deprecated - 'format' argument, as supported in v1.2
    var i = buf && offset || 0;

    if (typeof(options) == 'string') {
      buf = options == 'binary' ? new BufferClass(16) : null;
      options = null;
    }
    options = options || {};

    var rnds = options.random || (options.rng || _rng)();

    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;

    // Copy bytes to buffer, if provided
    if (buf) {
      for (var ii = 0; ii < 16; ii++) {
        buf[i + ii] = rnds[ii];
      }
    }

    return buf || unparse(rnds);
  }

  // Export public API
  var uuid = v4;
  uuid.v1 = v1;
  uuid.v4 = v4;
  uuid.parse = parse;
  uuid.unparse = unparse;
  uuid.BufferClass = BufferClass;

  if (typeof define === 'function' && define.amd) {
    // Publish as AMD module
    define(function() {return uuid;});
  } else if (typeof(module) != 'undefined' && module.exports) {
    // Publish as node.js module
    module.exports = uuid;
  } else {
    // Publish as global (in browsers)
    var _previousRoot = _global.uuid;

    // **`noConflict()` - (browser only) to reset global 'uuid' var**
    uuid.noConflict = function() {
      _global.uuid = _previousRoot;
      return uuid;
    };

    _global.uuid = uuid;
  }
}).call(this);

}).call(this,require("buffer").Buffer)
},{"buffer":2,"crypto":6}],22:[function(require,module,exports){
/*!
 * numeral.js
 * version : 1.5.3
 * author : Adam Draper
 * license : MIT
 * http://adamwdraper.github.com/Numeral-js/
 */

(function () {

    /************************************
        Constants
    ************************************/

    var numeral,
        VERSION = '1.5.3',
        // internal storage for language config files
        languages = {},
        currentLanguage = 'en',
        zeroFormat = null,
        defaultFormat = '0,0',
        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports);


    /************************************
        Constructors
    ************************************/


    // Numeral prototype object
    function Numeral (number) {
        this._value = number;
    }

    /**
     * Implementation of toFixed() that treats floats more like decimals
     *
     * Fixes binary rounding issues (eg. (0.615).toFixed(2) === '0.61') that present
     * problems for accounting- and finance-related software.
     */
    function toFixed (value, precision, roundingFunction, optionals) {
        var power = Math.pow(10, precision),
            optionalsRegExp,
            output;
            
        //roundingFunction = (roundingFunction !== undefined ? roundingFunction : Math.round);
        // Multiply up by precision, round accurately, then divide and use native toFixed():
        output = (roundingFunction(value * power) / power).toFixed(precision);

        if (optionals) {
            optionalsRegExp = new RegExp('0{1,' + optionals + '}$');
            output = output.replace(optionalsRegExp, '');
        }

        return output;
    }

    /************************************
        Formatting
    ************************************/

    // determine what type of formatting we need to do
    function formatNumeral (n, format, roundingFunction) {
        var output;

        // figure out what kind of format we are dealing with
        if (format.indexOf('$') > -1) { // currency!!!!!
            output = formatCurrency(n, format, roundingFunction);
        } else if (format.indexOf('%') > -1) { // percentage
            output = formatPercentage(n, format, roundingFunction);
        } else if (format.indexOf(':') > -1) { // time
            output = formatTime(n, format);
        } else { // plain ol' numbers or bytes
            output = formatNumber(n._value, format, roundingFunction);
        }

        // return string
        return output;
    }

    // revert to number
    function unformatNumeral (n, string) {
        var stringOriginal = string,
            thousandRegExp,
            millionRegExp,
            billionRegExp,
            trillionRegExp,
            suffixes = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            bytesMultiplier = false,
            power;

        if (string.indexOf(':') > -1) {
            n._value = unformatTime(string);
        } else {
            if (string === zeroFormat) {
                n._value = 0;
            } else {
                if (languages[currentLanguage].delimiters.decimal !== '.') {
                    string = string.replace(/\./g,'').replace(languages[currentLanguage].delimiters.decimal, '.');
                }

                // see if abbreviations are there so that we can multiply to the correct number
                thousandRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.thousand + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');
                millionRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.million + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');
                billionRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.billion + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');
                trillionRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.trillion + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');

                // see if bytes are there so that we can multiply to the correct number
                for (power = 0; power <= suffixes.length; power++) {
                    bytesMultiplier = (string.indexOf(suffixes[power]) > -1) ? Math.pow(1024, power + 1) : false;

                    if (bytesMultiplier) {
                        break;
                    }
                }

                // do some math to create our number
                n._value = ((bytesMultiplier) ? bytesMultiplier : 1) * ((stringOriginal.match(thousandRegExp)) ? Math.pow(10, 3) : 1) * ((stringOriginal.match(millionRegExp)) ? Math.pow(10, 6) : 1) * ((stringOriginal.match(billionRegExp)) ? Math.pow(10, 9) : 1) * ((stringOriginal.match(trillionRegExp)) ? Math.pow(10, 12) : 1) * ((string.indexOf('%') > -1) ? 0.01 : 1) * (((string.split('-').length + Math.min(string.split('(').length-1, string.split(')').length-1)) % 2)? 1: -1) * Number(string.replace(/[^0-9\.]+/g, ''));

                // round if we are talking about bytes
                n._value = (bytesMultiplier) ? Math.ceil(n._value) : n._value;
            }
        }
        return n._value;
    }

    function formatCurrency (n, format, roundingFunction) {
        var symbolIndex = format.indexOf('$'),
            openParenIndex = format.indexOf('('),
            minusSignIndex = format.indexOf('-'),
            space = '',
            spliceIndex,
            output;

        // check for space before or after currency
        if (format.indexOf(' $') > -1) {
            space = ' ';
            format = format.replace(' $', '');
        } else if (format.indexOf('$ ') > -1) {
            space = ' ';
            format = format.replace('$ ', '');
        } else {
            format = format.replace('$', '');
        }

        // format the number
        output = formatNumber(n._value, format, roundingFunction);

        // position the symbol
        if (symbolIndex <= 1) {
            if (output.indexOf('(') > -1 || output.indexOf('-') > -1) {
                output = output.split('');
                spliceIndex = 1;
                if (symbolIndex < openParenIndex || symbolIndex < minusSignIndex){
                    // the symbol appears before the "(" or "-"
                    spliceIndex = 0;
                }
                output.splice(spliceIndex, 0, languages[currentLanguage].currency.symbol + space);
                output = output.join('');
            } else {
                output = languages[currentLanguage].currency.symbol + space + output;
            }
        } else {
            if (output.indexOf(')') > -1) {
                output = output.split('');
                output.splice(-1, 0, space + languages[currentLanguage].currency.symbol);
                output = output.join('');
            } else {
                output = output + space + languages[currentLanguage].currency.symbol;
            }
        }

        return output;
    }

    function formatPercentage (n, format, roundingFunction) {
        var space = '',
            output,
            value = n._value * 100;

        // check for space before %
        if (format.indexOf(' %') > -1) {
            space = ' ';
            format = format.replace(' %', '');
        } else {
            format = format.replace('%', '');
        }

        output = formatNumber(value, format, roundingFunction);
        
        if (output.indexOf(')') > -1 ) {
            output = output.split('');
            output.splice(-1, 0, space + '%');
            output = output.join('');
        } else {
            output = output + space + '%';
        }

        return output;
    }

    function formatTime (n) {
        var hours = Math.floor(n._value/60/60),
            minutes = Math.floor((n._value - (hours * 60 * 60))/60),
            seconds = Math.round(n._value - (hours * 60 * 60) - (minutes * 60));
        return hours + ':' + ((minutes < 10) ? '0' + minutes : minutes) + ':' + ((seconds < 10) ? '0' + seconds : seconds);
    }

    function unformatTime (string) {
        var timeArray = string.split(':'),
            seconds = 0;
        // turn hours and minutes into seconds and add them all up
        if (timeArray.length === 3) {
            // hours
            seconds = seconds + (Number(timeArray[0]) * 60 * 60);
            // minutes
            seconds = seconds + (Number(timeArray[1]) * 60);
            // seconds
            seconds = seconds + Number(timeArray[2]);
        } else if (timeArray.length === 2) {
            // minutes
            seconds = seconds + (Number(timeArray[0]) * 60);
            // seconds
            seconds = seconds + Number(timeArray[1]);
        }
        return Number(seconds);
    }

    function formatNumber (value, format, roundingFunction) {
        var negP = false,
            signed = false,
            optDec = false,
            abbr = '',
            abbrK = false, // force abbreviation to thousands
            abbrM = false, // force abbreviation to millions
            abbrB = false, // force abbreviation to billions
            abbrT = false, // force abbreviation to trillions
            abbrForce = false, // force abbreviation
            bytes = '',
            ord = '',
            abs = Math.abs(value),
            suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            min,
            max,
            power,
            w,
            precision,
            thousands,
            d = '',
            neg = false;

        // check if number is zero and a custom zero format has been set
        if (value === 0 && zeroFormat !== null) {
            return zeroFormat;
        } else {
            // see if we should use parentheses for negative number or if we should prefix with a sign
            // if both are present we default to parentheses
            if (format.indexOf('(') > -1) {
                negP = true;
                format = format.slice(1, -1);
            } else if (format.indexOf('+') > -1) {
                signed = true;
                format = format.replace(/\+/g, '');
            }

            // see if abbreviation is wanted
            if (format.indexOf('a') > -1) {
                // check if abbreviation is specified
                abbrK = format.indexOf('aK') >= 0;
                abbrM = format.indexOf('aM') >= 0;
                abbrB = format.indexOf('aB') >= 0;
                abbrT = format.indexOf('aT') >= 0;
                abbrForce = abbrK || abbrM || abbrB || abbrT;

                // check for space before abbreviation
                if (format.indexOf(' a') > -1) {
                    abbr = ' ';
                    format = format.replace(' a', '');
                } else {
                    format = format.replace('a', '');
                }

                if (abs >= Math.pow(10, 12) && !abbrForce || abbrT) {
                    // trillion
                    abbr = abbr + languages[currentLanguage].abbreviations.trillion;
                    value = value / Math.pow(10, 12);
                } else if (abs < Math.pow(10, 12) && abs >= Math.pow(10, 9) && !abbrForce || abbrB) {
                    // billion
                    abbr = abbr + languages[currentLanguage].abbreviations.billion;
                    value = value / Math.pow(10, 9);
                } else if (abs < Math.pow(10, 9) && abs >= Math.pow(10, 6) && !abbrForce || abbrM) {
                    // million
                    abbr = abbr + languages[currentLanguage].abbreviations.million;
                    value = value / Math.pow(10, 6);
                } else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3) && !abbrForce || abbrK) {
                    // thousand
                    abbr = abbr + languages[currentLanguage].abbreviations.thousand;
                    value = value / Math.pow(10, 3);
                }
            }

            // see if we are formatting bytes
            if (format.indexOf('b') > -1) {
                // check for space before
                if (format.indexOf(' b') > -1) {
                    bytes = ' ';
                    format = format.replace(' b', '');
                } else {
                    format = format.replace('b', '');
                }

                for (power = 0; power <= suffixes.length; power++) {
                    min = Math.pow(1024, power);
                    max = Math.pow(1024, power+1);

                    if (value >= min && value < max) {
                        bytes = bytes + suffixes[power];
                        if (min > 0) {
                            value = value / min;
                        }
                        break;
                    }
                }
            }

            // see if ordinal is wanted
            if (format.indexOf('o') > -1) {
                // check for space before
                if (format.indexOf(' o') > -1) {
                    ord = ' ';
                    format = format.replace(' o', '');
                } else {
                    format = format.replace('o', '');
                }

                ord = ord + languages[currentLanguage].ordinal(value);
            }

            if (format.indexOf('[.]') > -1) {
                optDec = true;
                format = format.replace('[.]', '.');
            }

            w = value.toString().split('.')[0];
            precision = format.split('.')[1];
            thousands = format.indexOf(',');

            if (precision) {
                if (precision.indexOf('[') > -1) {
                    precision = precision.replace(']', '');
                    precision = precision.split('[');
                    d = toFixed(value, (precision[0].length + precision[1].length), roundingFunction, precision[1].length);
                } else {
                    d = toFixed(value, precision.length, roundingFunction);
                }

                w = d.split('.')[0];

                if (d.split('.')[1].length) {
                    d = languages[currentLanguage].delimiters.decimal + d.split('.')[1];
                } else {
                    d = '';
                }

                if (optDec && Number(d.slice(1)) === 0) {
                    d = '';
                }
            } else {
                w = toFixed(value, null, roundingFunction);
            }

            // format number
            if (w.indexOf('-') > -1) {
                w = w.slice(1);
                neg = true;
            }

            if (thousands > -1) {
                w = w.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + languages[currentLanguage].delimiters.thousands);
            }

            if (format.indexOf('.') === 0) {
                w = '';
            }

            return ((negP && neg) ? '(' : '') + ((!negP && neg) ? '-' : '') + ((!neg && signed) ? '+' : '') + w + d + ((ord) ? ord : '') + ((abbr) ? abbr : '') + ((bytes) ? bytes : '') + ((negP && neg) ? ')' : '');
        }
    }

    /************************************
        Top Level Functions
    ************************************/

    numeral = function (input) {
        if (numeral.isNumeral(input)) {
            input = input.value();
        } else if (input === 0 || typeof input === 'undefined') {
            input = 0;
        } else if (!Number(input)) {
            input = numeral.fn.unformat(input);
        }

        return new Numeral(Number(input));
    };

    // version number
    numeral.version = VERSION;

    // compare numeral object
    numeral.isNumeral = function (obj) {
        return obj instanceof Numeral;
    };

    // This function will load languages and then set the global language.  If
    // no arguments are passed in, it will simply return the current global
    // language key.
    numeral.language = function (key, values) {
        if (!key) {
            return currentLanguage;
        }

        if (key && !values) {
            if(!languages[key]) {
                throw new Error('Unknown language : ' + key);
            }
            currentLanguage = key;
        }

        if (values || !languages[key]) {
            loadLanguage(key, values);
        }

        return numeral;
    };
    
    // This function provides access to the loaded language data.  If
    // no arguments are passed in, it will simply return the current
    // global language object.
    numeral.languageData = function (key) {
        if (!key) {
            return languages[currentLanguage];
        }
        
        if (!languages[key]) {
            throw new Error('Unknown language : ' + key);
        }
        
        return languages[key];
    };

    numeral.language('en', {
        delimiters: {
            thousands: ',',
            decimal: '.'
        },
        abbreviations: {
            thousand: 'k',
            million: 'm',
            billion: 'b',
            trillion: 't'
        },
        ordinal: function (number) {
            var b = number % 10;
            return (~~ (number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
        },
        currency: {
            symbol: '$'
        }
    });

    numeral.zeroFormat = function (format) {
        zeroFormat = typeof(format) === 'string' ? format : null;
    };

    numeral.defaultFormat = function (format) {
        defaultFormat = typeof(format) === 'string' ? format : '0.0';
    };

    /************************************
        Helpers
    ************************************/

    function loadLanguage(key, values) {
        languages[key] = values;
    }

    /************************************
        Floating-point helpers
    ************************************/

    // The floating-point helper functions and implementation
    // borrows heavily from sinful.js: http://guipn.github.io/sinful.js/

    /**
     * Array.prototype.reduce for browsers that don't support it
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#Compatibility
     */
    if ('function' !== typeof Array.prototype.reduce) {
        Array.prototype.reduce = function (callback, opt_initialValue) {
            'use strict';
            
            if (null === this || 'undefined' === typeof this) {
                // At the moment all modern browsers, that support strict mode, have
                // native implementation of Array.prototype.reduce. For instance, IE8
                // does not support strict mode, so this check is actually useless.
                throw new TypeError('Array.prototype.reduce called on null or undefined');
            }
            
            if ('function' !== typeof callback) {
                throw new TypeError(callback + ' is not a function');
            }

            var index,
                value,
                length = this.length >>> 0,
                isValueSet = false;

            if (1 < arguments.length) {
                value = opt_initialValue;
                isValueSet = true;
            }

            for (index = 0; length > index; ++index) {
                if (this.hasOwnProperty(index)) {
                    if (isValueSet) {
                        value = callback(value, this[index], index, this);
                    } else {
                        value = this[index];
                        isValueSet = true;
                    }
                }
            }

            if (!isValueSet) {
                throw new TypeError('Reduce of empty array with no initial value');
            }

            return value;
        };
    }

    
    /**
     * Computes the multiplier necessary to make x >= 1,
     * effectively eliminating miscalculations caused by
     * finite precision.
     */
    function multiplier(x) {
        var parts = x.toString().split('.');
        if (parts.length < 2) {
            return 1;
        }
        return Math.pow(10, parts[1].length);
    }

    /**
     * Given a variable number of arguments, returns the maximum
     * multiplier that must be used to normalize an operation involving
     * all of them.
     */
    function correctionFactor() {
        var args = Array.prototype.slice.call(arguments);
        return args.reduce(function (prev, next) {
            var mp = multiplier(prev),
                mn = multiplier(next);
        return mp > mn ? mp : mn;
        }, -Infinity);
    }        


    /************************************
        Numeral Prototype
    ************************************/


    numeral.fn = Numeral.prototype = {

        clone : function () {
            return numeral(this);
        },

        format : function (inputString, roundingFunction) {
            return formatNumeral(this, 
                  inputString ? inputString : defaultFormat, 
                  (roundingFunction !== undefined) ? roundingFunction : Math.round
              );
        },

        unformat : function (inputString) {
            if (Object.prototype.toString.call(inputString) === '[object Number]') { 
                return inputString; 
            }
            return unformatNumeral(this, inputString ? inputString : defaultFormat);
        },

        value : function () {
            return this._value;
        },

        valueOf : function () {
            return this._value;
        },

        set : function (value) {
            this._value = Number(value);
            return this;
        },

        add : function (value) {
            var corrFactor = correctionFactor.call(null, this._value, value);
            function cback(accum, curr, currI, O) {
                return accum + corrFactor * curr;
            }
            this._value = [this._value, value].reduce(cback, 0) / corrFactor;
            return this;
        },

        subtract : function (value) {
            var corrFactor = correctionFactor.call(null, this._value, value);
            function cback(accum, curr, currI, O) {
                return accum - corrFactor * curr;
            }
            this._value = [value].reduce(cback, this._value * corrFactor) / corrFactor;            
            return this;
        },

        multiply : function (value) {
            function cback(accum, curr, currI, O) {
                var corrFactor = correctionFactor(accum, curr);
                return (accum * corrFactor) * (curr * corrFactor) /
                    (corrFactor * corrFactor);
            }
            this._value = [this._value, value].reduce(cback, 1);
            return this;
        },

        divide : function (value) {
            function cback(accum, curr, currI, O) {
                var corrFactor = correctionFactor(accum, curr);
                return (accum * corrFactor) / (curr * corrFactor);
            }
            this._value = [this._value, value].reduce(cback);            
            return this;
        },

        difference : function (value) {
            return Math.abs(numeral(this._value).subtract(value).value());
        }

    };

    /************************************
        Exposing Numeral
    ************************************/

    // CommonJS module is defined
    if (hasModule) {
        module.exports = numeral;
    }

    /*global ender:false */
    if (typeof ender === 'undefined') {
        // here, `this` means `window` in the browser, or `global` on the server
        // add `numeral` as a global object via a string identifier,
        // for Closure Compiler 'advanced' mode
        this['numeral'] = numeral;
    }

    /*global define:false */
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return numeral;
        });
    }
}).call(this);

},{}],23:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/streamy/stream";
var Timer = require('ui/timer').default;
var _listeners = Symbol(),
    _cancel = Symbol();
var Stream = function Stream(callback) {
  var $__0 = this;
  this[_listeners] = [];
  var sink = (function(value) {
    Timer.immediate((function() {
      $__0[_listeners].map((function(ƒ) {
        return ƒ(value);
      }));
    }));
  });
  callback(sink);
};
var $Stream = Stream;
($traceurRuntime.createClass)(Stream, {
  cancel: function() {
    this[_listeners] = [];
  },
  cancelOn: function(source) {
    var $__0 = this;
    var ƒ;
    ƒ = (function() {
      source.unsubscribe(ƒ);
      $__0.cancel();
    });
    source.subscribe(ƒ);
    return this;
  },
  subscribe: function(ƒ) {
    this[_listeners].push(ƒ);
    return this;
  },
  unsubscribe: function(ƒ) {
    this[_listeners].splice(this[_listeners].indexOf(ƒ), 1);
  },
  map: function(ƒ) {
    return $Stream.map(this, ƒ);
  },
  filter: function(ƒ) {
    return $Stream.filter(this, ƒ);
  },
  unique: function(ƒ) {
    return $Stream.unique(this, ƒ);
  },
  log: function(prefix) {
    return $Stream.log(this, prefix);
  },
  toBool: function() {
    return $Stream.toBool(this);
  },
  negate: function() {
    return $Stream.negate(this);
  },
  zip: function() {
    var $__7;
    for (var others = [],
        $__2 = 0; $__2 < arguments.length; $__2++)
      others[$__2] = arguments[$__2];
    return ($__7 = $Stream).zip.apply($__7, $traceurRuntime.spread([this], others));
  },
  spread: function(ƒ) {
    return $Stream.spread(this, ƒ);
  },
  flatMap: function() {
    return $Stream.flatMap(this);
  },
  merge: function() {
    var $__7;
    for (var others = [],
        $__3 = 0; $__3 < arguments.length; $__3++)
      others[$__3] = arguments[$__3];
    return ($__7 = $Stream).merge.apply($__7, $traceurRuntime.spread([this], others));
  },
  reduce: function(acc, ƒ) {
    return $Stream.reduce(this, acc, ƒ);
  },
  feed: function(destValue) {
    return $Stream.feed(this, destValue);
  },
  wrap: function(ƒ) {
    ƒ(this);
    return this;
  },
  debounce: function(delay) {
    return $Stream.debounce(this, delay);
  }
}, {});
var PushStream = function PushStream() {
  var $__0 = this;
  $traceurRuntime.superCall(this, $PushStream.prototype, "constructor", [(function(sink) {
    return $__0.push = sink;
  })]);
};
var $PushStream = PushStream;
($traceurRuntime.createClass)(PushStream, {}, {}, Stream);
var CancelableStream = function CancelableStream(cancelƒ) {
  $traceurRuntime.superCall(this, $CancelableStream.prototype, "constructor", []);
  this[_cancel] = cancelƒ.bind(this);
};
var $CancelableStream = CancelableStream;
($traceurRuntime.createClass)(CancelableStream, {cancel: function() {
    this[_cancel]();
    $traceurRuntime.superCall(this, $CancelableStream.prototype, "cancel", []);
  }}, {}, PushStream);
Stream.subscribe = function(source, ƒ) {
  var bƒ,
      stream = new CancelableStream(function() {
        source.unsubscribe(bƒ);
      });
  bƒ = ƒ.bind(null, stream);
  source.subscribe(bƒ);
  return stream;
};
Stream.map = function(source, ƒ) {
  return this.subscribe(source, (function(stream, value) {
    return stream.push(ƒ(value));
  }));
};
Stream.filter = function(source, ƒ) {
  return this.subscribe(source, (function(stream, value) {
    if (ƒ(value))
      stream.push(value);
  }));
};
Stream.unique = function(source) {
  var ƒ = arguments[1] !== (void 0) ? arguments[1] : (function(i) {
    i;
  });
  return this.filter(source, (function() {
    var last,
        t;
    return function(v) {
      t = ƒ(v);
      if (last !== t) {
        last = t;
        return true;
      } else {
        return false;
      }
    };
  })());
};
Stream.toBool = function(source) {
  return this.map(source, (function(v) {
    return !!v;
  }));
};
Stream.negate = function(source) {
  return this.map(source, (function(v) {
    return !v;
  }));
};
Stream.log = function(source, prefix) {
  return this.map(source, (function(v) {
    if (prefix)
      console.log(prefix, v);
    else
      console.log(v);
    return v;
  }));
};
Stream.zip = function() {
  for (var sources = [],
      $__4 = 0; $__4 < arguments.length; $__4++)
    sources[$__4] = arguments[$__4];
  var length = sources.length,
      unsubs = [],
      stream = new CancelableStream((function() {
        unsubs.map((function(source, i) {
          return sources[i].unsubscribe(unsubs[i]);
        }));
      })),
      values = new Array(length),
      flags = new Array(length),
      update = (function() {
        if (flags.filter((function(v) {
          return v;
        })).length === length) {
          update = (function() {
            return stream.push(values);
          });
          update();
        }
      });
  for (var i = 0; i < length; i++) {
    ((function(i) {
      sources[i].subscribe(unsubs[i] = (function(v) {
        values[i] = v;
        flags[i] = true;
        update();
      }));
    }))(i);
  }
  return stream;
};
Stream.debounce = function(source, delay) {
  var stream = new PushStream(),
      delaying = false,
      t;
  source.subscribe((function(v) {
    t = v;
    if (delaying)
      return;
    delaying = true;
    setTimeout(function() {
      delaying = false;
      stream.push(t);
    }, delay);
  }));
  return stream;
};
Stream.spread = function(source, ƒ) {
  return this.subscribe(source, (function(stream, arr) {
    return stream.push(ƒ.apply(null, arr));
  }));
};
Stream.flatMap = function(source) {
  return this.subscribe(source, (function(stream, arr) {
    for (var $v in arr) {
      try {
        throw undefined;
      } catch (v) {
        v = $v;
        stream.push(v);
      }
    }
  }));
};
Stream.merge = function() {
  for (var sources = [],
      $__5 = 0; $__5 < arguments.length; $__5++)
    sources[$__5] = arguments[$__5];
  var stream,
      ƒ = (function(v) {
        return stream.push(v);
      });
  stream = new CancelableStream((function() {
    sources.map((function(source) {
      return source.unsubscribe(ƒ);
    }));
  }));
  sources.map((function(source) {
    return source.subscribe(ƒ);
  }));
  return stream;
};
Stream.interval = function(ms, value) {
  var id,
      stream = new CancelableStream(function() {
        clearInterval(id);
      });
  id = setInterval((function() {
    return stream.push(value);
  }), ms);
  return stream;
};
Stream.delay = function(ms, value) {
  var id,
      stream = new CancelableStream(function() {
        clearTimeout(id);
      });
  id = setTimeout((function() {
    stream.push(value);
    Timer.immediate(stream.cancel.bind(stream));
  }), ms);
  return stream;
};
Stream.reduce = function(source, acc, ƒ) {
  return this.subscribe(source, (function(stream, value) {
    return stream.push(acc = ƒ(acc, value));
  }));
};
Stream.feed = function(source, dest) {
  return this.subscribe(source, (function(stream, value) {
    stream.push(value);
    dest.push(value);
  }));
};
Stream.fromArray = function(values) {
  var stream = new PushStream();
  values.map((function(v) {
    return stream.push(v);
  }));
  return stream;
};
Stream.sequence = function(values, interval) {
  var repeat = arguments[2] !== (void 0) ? arguments[2] : false;
  var $__0 = this;
  var id,
      stream = new CancelableStream(function() {
        clearInterval(id);
      }),
      index = 0;
  id = setInterval((function() {
    if (index === values.length) {
      if (repeat) {
        index = 0;
      } else {
        clearInterval(id);
        $__0.cancel();
        return;
      }
    }
    stream.push(values[index++]);
  }), interval);
  return stream;
};
;
module.exports = {
  get Stream() {
    return Stream;
  },
  get PushStream() {
    return PushStream;
  },
  __esModule: true
};


},{"ui/timer":60}],24:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/streamy/value";
var Stream = require('./stream').Stream;
var _value = Symbol(),
    _defaultValue = Symbol(),
    _update = Symbol();
var Value = function Value(value, defaultValue) {
  var $__0 = this;
  var callback = (function(sink) {
    $__0[_update] = sink;
  });
  $traceurRuntime.superCall(this, $Value.prototype, "constructor", [callback]);
  this[_defaultValue] = defaultValue;
  this[_value] = value;
};
var $Value = Value;
($traceurRuntime.createClass)(Value, {
  subscribe: function(ƒ) {
    ƒ(this[_value]);
    $traceurRuntime.superCall(this, $Value.prototype, "subscribe", [ƒ]);
    return this;
  },
  push: function(value) {
    if (value === this[_value])
      return;
    this[_value] = value;
    this[_update](value);
  },
  get value() {
    return this[_value];
  },
  set value(v) {
    this.push(v);
  },
  get isDefault() {
    return this[_value] === this[_defaultValue];
  },
  reset: function() {
    this.value = this[_defaultValue];
  }
}, {}, Stream);
var StringValue = function StringValue() {
  var value = arguments[0] !== (void 0) ? arguments[0] : "";
  var defaultValue = arguments[1] !== (void 0) ? arguments[1] : value;
  $traceurRuntime.superCall(this, $StringValue.prototype, "constructor", [value, defaultValue]);
};
var $StringValue = StringValue;
($traceurRuntime.createClass)(StringValue, {push: function(value) {
    $traceurRuntime.superCall(this, $StringValue.prototype, "push", [(value && value.toString && value.toString()) || (value && ("" + value)) || ""]);
  }}, {}, Value);
var BoolValue = function BoolValue() {
  var value = arguments[0] !== (void 0) ? arguments[0] : false;
  var defaultValue = arguments[1] !== (void 0) ? arguments[1] : value;
  $traceurRuntime.superCall(this, $BoolValue.prototype, "constructor", [value, defaultValue]);
};
var $BoolValue = BoolValue;
($traceurRuntime.createClass)(BoolValue, {
  push: function(value) {
    $traceurRuntime.superCall(this, $BoolValue.prototype, "push", [!!value]);
  },
  toggle: function() {
    this.push(!this.value);
  }
}, {}, Value);
var NumberValue = function NumberValue() {
  var value = arguments[0] !== (void 0) ? arguments[0] : 0.0;
  var defaultValue = arguments[1] !== (void 0) ? arguments[1] : value;
  $traceurRuntime.superCall(this, $NumberValue.prototype, "constructor", [value, defaultValue]);
};
var $NumberValue = NumberValue;
($traceurRuntime.createClass)(NumberValue, {push: function(value) {
    $traceurRuntime.superCall(this, $NumberValue.prototype, "push", [+new Number(value)]);
  }}, {}, Value);
var defaultDate = new Date(null);
var DateValue = function DateValue() {
  var value = arguments[0] !== (void 0) ? arguments[0] : defaultDate;
  var defaultValue = arguments[1] !== (void 0) ? arguments[1] : value;
  $traceurRuntime.superCall(this, $DateValue.prototype, "constructor", [value, defaultValue]);
};
var $DateValue = DateValue;
($traceurRuntime.createClass)(DateValue, {push: function(value) {
    $traceurRuntime.superCall(this, $DateValue.prototype, "push", [new Date(value)]);
  }}, {}, Value);
module.exports = {
  get Value() {
    return Value;
  },
  get StringValue() {
    return StringValue;
  },
  get BoolValue() {
    return BoolValue;
  },
  get NumberValue() {
    return NumberValue;
  },
  get DateValue() {
    return DateValue;
  },
  __esModule: true
};


},{"./stream":23}],25:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/Field";
var Component = require('./component').Component;
var Fragment = require('./fragment').Fragment;
var Query = require('ui/dom').Query;
var template = require('./field.jade')(),
    _p = Symbol();
var Field = function Field() {
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  if (!('template' in options))
    options.template = template;
  $traceurRuntime.superCall(this, $Field.prototype, "constructor", [options]);
  var key = new Fragment(),
      value = new Fragment();
  key.attachTo(Query.first('.key', this.el));
  value.attachTo(Query.first('.value', this.el));
  this[_p] = {
    key: key,
    value: value
  };
};
var $Field = Field;
($traceurRuntime.createClass)(Field, {
  get key() {
    return this[_p].key;
  },
  get value() {
    return this[_p].value;
  }
}, {}, Component);
module.exports = {
  get Field() {
    return Field;
  },
  __esModule: true
};


},{"./component":27,"./field.jade":29,"./fragment":32,"ui/dom":28}],26:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/block";
var Component = require('./component').Component;
var Block = function Block(options) {
  $traceurRuntime.superCall(this, $Block.prototype, "constructor", [options]);
};
var $Block = Block;
($traceurRuntime.createClass)(Block, {}, {}, Component);
;
module.exports = {
  get Block() {
    return Block;
  },
  __esModule: true
};


},{"./component":27}],27:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/component";
var Html = require('ui/dom').Html;
var Properties = require('./properties').Properties;
var createId = require('node-uuid').v4;
var _p = Symbol();
var Component = function Component() {
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  new Properties(this);
  this[_p] = {
    el: Html.parse(options.template),
    attached: false,
    uuid: options.uuid || createId()
  };
};
($traceurRuntime.createClass)(Component, {
  attachTo: function(container) {
    container.appendChild(this.el);
    this[_p].attached = true;
  },
  detach: function() {
    if (!this.isAttached)
      throw new Error('Component is not attached');
    this.el.parentNode.removeChild(this.el);
    this[_p].attached = false;
  },
  destroy: function() {
    if (this.isAttached)
      this.detach();
    this.properties.removeAll();
  },
  get el() {
    return this[_p].el;
  },
  get uuid() {
    return this[_p].uuid;
  },
  get isAttached() {
    return this[_p].attached;
  },
  toString: function() {
    return ("component: " + this.uuid);
  }
}, {});
;
module.exports = {
  get Component() {
    return Component;
  },
  __esModule: true
};


},{"./properties":42,"node-uuid":21,"ui/dom":28}],28:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/dom";
var p = Symbol(),
    Html = {
      parseAll: function(html) {
        var el = document.createElement('div');
        el.innerHTML = html;
        return Array.prototype.slice.apply(el.childNodes);
      },
      parse: function(html) {
        return this.parseAll(html)[0];
      }
    };
var DomStream = function DomStream(source) {
  this[p] = source;
};
($traceurRuntime.createClass)(DomStream, {
  applyDisplay: function(el) {
    var display = arguments[1] !== (void 0) ? arguments[1] : "";
    var $__0 = this;
    var old = el.style.display,
        ƒ = (function(v) {
          return el.style.display = v ? display : "none";
        });
    this[p].subscribe(ƒ);
    return (function() {
      $__0[p].unsubscribe(ƒ);
      el.style.display = old;
    });
  },
  applyText: function(el) {
    var $__0 = this;
    var old = el.innerText,
        ƒ = (function(v) {
          return el.innerText = v || "";
        });
    this[p].subscribe(ƒ);
    return (function() {
      $__0[p].unsubscribe(ƒ);
      ƒ(old);
    });
  },
  applyHtml: function(el) {
    var $__0 = this;
    var old = el.innerHTML,
        ƒ = (function(v) {
          return el.innerHTML = v || "";
        });
    this[p].subscribe(ƒ);
    return (function() {
      $__0[p].unsubscribe(ƒ);
      ƒ(old);
    });
  },
  applyAttribute: function(name, el) {
    var $__0 = this;
    var old = el.getAttribute(name),
        ƒ = (function(v) {
          v == null ? el.removeAttribute(name) : el.setAttribute(name, v);
        });
    this[p].subscribe(ƒ);
    return (function() {
      $__0[p].unsubscribe(ƒ);
      ƒ(old);
    });
  },
  applySwapClass: function(el, className) {
    var $__0 = this;
    var has = el.classList.contains(className),
        ƒ = (function(v) {
          return v ? el.classList.add(className) : el.classList.remove(className);
        });
    this[p].subscribe(ƒ);
    return (function() {
      $__0[p].unsubscribe(ƒ);
      ƒ(has);
    });
  }
}, {});
var Dom = {
  stream: function(source) {
    return new DomStream(source);
  },
  ready: function(ƒ) {
    if (ƒ)
      document.addEventListener("DOMContentLoaded", ƒ, false);
    else
      return new Promise((function(resolve) {
        return document.addEventListener("DOMContentLoaded", resolve, false);
      }));
  }
};
var Query = {
  first: function(selector, ctx) {
    return (ctx || document).querySelector(selector);
  },
  all: function(selector, ctx) {
    return (ctx || document).query(selector);
  }
};
;
module.exports = {
  get Html() {
    return Html;
  },
  get Query() {
    return Query;
  },
  get Dom() {
    return Dom;
  },
  __esModule: true
};


},{}],29:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"field-container\"><div class=\"field\"><div class=\"key\"></div><div class=\"value\"></div></div><div class=\"calculated\"></div><hr/></div>");;return buf.join("");
};
},{"jade/runtime":20}],30:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/field";
var Component = require('./component').Component;
var Fragment = require('./fragment').Fragment;
var Query = require('ui/dom').Query;
var template = require('./field.jade')(),
    _p = Symbol();
var Field = function Field() {
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  if (!('template' in options))
    options.template = template;
  $traceurRuntime.superCall(this, $Field.prototype, "constructor", [options]);
  var key = new Fragment(),
      value = new Fragment();
  key.attachTo(Query.first('.key', this.el));
  value.attachTo(Query.first('.value', this.el));
  this[_p] = {
    key: key,
    value: value
  };
};
var $Field = Field;
($traceurRuntime.createClass)(Field, {
  get key() {
    return this[_p].key;
  },
  get value() {
    return this[_p].value;
  }
}, {}, Component);
module.exports = {
  get Field() {
    return Field;
  },
  __esModule: true
};


},{"./component":27,"./field.jade":29,"./fragment":32,"ui/dom":28}],31:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<span class=\"fragment\"><span class=\"content\"></span></span>");;return buf.join("");
};
},{"jade/runtime":20}],32:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/fragment";
var Component = require('./component').Component;
var template = require('./fragment.jade')();
var Fragment = function Fragment() {
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  if (!('template' in options))
    options.template = template;
  $traceurRuntime.superCall(this, $Fragment.prototype, "constructor", [options]);
};
var $Fragment = Fragment;
($traceurRuntime.createClass)(Fragment, {}, {}, Component);
;
module.exports = {
  get Fragment() {
    return Fragment;
  },
  __esModule: true
};


},{"./component":27,"./fragment.jade":31}],33:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/fragmentblock";
var Block = require('./block').Block;
var Fragment = require('./fragment').Fragment;
var _fragments = Symbol();
var FragmentBlock = function FragmentBlock() {
  for (var args = [],
      $__1 = 0; $__1 < arguments.length; $__1++)
    args[$__1] = arguments[$__1];
  $traceurRuntime.superCall(this, $FragmentBlock.prototype, "constructor", $traceurRuntime.spread(args));
  this[_fragments] = [];
};
var $FragmentBlock = FragmentBlock;
($traceurRuntime.createClass)(FragmentBlock, {createFragment: function() {
    var fragment = new Fragment();
    this[_fragments].push(fragment);
    fragment.attachTo(this.el);
    return fragment;
  }}, {}, Block);
;
module.exports = {
  get FragmentBlock() {
    return FragmentBlock;
  },
  __esModule: true
};


},{"./block":26,"./fragment":32}],34:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/model";
var PushStream = require('streamy/stream').PushStream;
var _data = Symbol(),
    _schema = Symbol(),
    _stream = Symbol(),
    _o = Symbol(),
    identity = (function() {
      return false;
    });
function resolveSetter(target, path) {
  if (path in target) {
    return (function(v) {
      target[path] = v;
      return true;
    });
  } else {
    return identity;
  }
}
function resolveInitializer(target, path) {
  return (function(v) {
    target[path] = v;
    return true;
  });
}
function resolveDeleter(target, path) {
  return (function() {
    delete target[path];
    return true;
  });
}
function resolveRenamer(target, path) {
  return (function(newname) {
    var old = target[path];
    delete target[path];
    target[newname] = old;
    return true;
  });
}
var Model = function Model() {
  var $__0 = this;
  var data = this[_data] = new PushStream(),
      schema = this[_schema] = new PushStream(),
      stream = new PushStream(),
      o = this[_o] = {};
  this[_stream] = stream.debounce(100).unique(JSON.stringify);
  data.subscribe((function(e) {
    if (resolveSetter(o, e.path)(e.value))
      stream.push(o);
  }));
  schema.subscribe((function(e) {
    switch (e.event) {
      case 'list':
        o = $__0[_o] = {};
        var res = e.data.map((function(pair) {
          return resolveInitializer(o, pair.name)(null);
        }));
        if (res.filter((function(r) {
          return r;
        })).length === res.length)
          stream.push(o);
        break;
      case 'add':
        if (resolveInitializer(o, e.name)(null))
          stream.push(o);
        break;
      case 'delete':
        if (resolveDeleter(o, e.name)())
          stream.push(o);
        break;
      case 'rename':
        if (resolveRenamer(o, e.oldname)(e.newname))
          stream.push(o);
        break;
    }
  }));
};
($traceurRuntime.createClass)(Model, {
  get data() {
    return this[_data];
  },
  get schema() {
    return this[_schema];
  },
  get stream() {
    return this[_stream];
  },
  toJSON: function() {
    return this[_o];
  }
}, {});
module.exports = {
  get Model() {
    return Model;
  },
  __esModule: true
};


},{"streamy/stream":23}],35:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"modelview\"></div>");;return buf.join("");
};
},{"jade/runtime":20}],36:[function(require,module,exports){
"use strict";
var $__2;
var __moduleName = "node_modules/ui/modelview";
var Component = require('./component').Component;
var $__3 = require('./properties/types'),
    TextProperty = $__3.TextProperty,
    TextEditorProperty = $__3.TextEditorProperty,
    EditorProperty = $__3.EditorProperty;
var Field = require('./field').Field;
var PushStream = require('streamy/stream').PushStream;
var template = require('./modelview.jade')(),
    _fields = Symbol(),
    _data = Symbol(),
    _schema = Symbol();
var ModelView = function ModelView() {
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  if (!('template' in options))
    options.template = template;
  $traceurRuntime.superCall(this, $ModelView.prototype, "constructor", [options]);
  this[_fields] = {};
  this[_data] = new PushStream();
  this[_schema] = new PushStream();
};
var $ModelView = ModelView;
($traceurRuntime.createClass)(ModelView, ($__2 = {}, Object.defineProperty($__2, "reset", {
  value: function() {
    var $__0 = this;
    this.array.map((function(key) {
      return $__0.deleteField(name);
    }));
  },
  configurable: true,
  enumerable: true,
  writable: true
}), Object.defineProperty($__2, "addField", {
  value: function(name, type) {
    var $__0 = this;
    var field = new Field();
    field.attachTo(this.el);
    field.key.properties.add(new TextProperty());
    field.key.properties.add(new TextEditorProperty());
    field.key.editor.value.feed(field.key.text);
    var last;
    field.key.editor.value.map((function(v) {
      $__0[_schema].push({
        event: 'rename',
        oldname: last,
        newname: v
      });
      last = v;
    }));
    field.key.editor.value = name;
    field.value.properties.add(EditorProperty.create(type));
    var stream = field.value.editor.value.map((function(v) {
      return ({
        path: field.key.editor.value.value,
        value: v
      });
    }));
    stream.feed(this[_data]);
    this[_fields][name] = {
      field: field,
      stream: stream
    };
  },
  configurable: true,
  enumerable: true,
  writable: true
}), Object.defineProperty($__2, "deleteField", {
  value: function(name) {
    var pair = this.getPair(name);
    pair.field.destroy();
    pair.stream.cancel();
    delete this[_fields][name];
  },
  configurable: true,
  enumerable: true,
  writable: true
}), Object.defineProperty($__2, "renameField", {
  value: function(oldname, newname) {
    var pair = this.getPair(oldname);
    delete this[_fields][oldname];
    this[_fields][newname] = pair;
    pair.field.key.editor.value = newname;
  },
  configurable: true,
  enumerable: true,
  writable: true
}), Object.defineProperty($__2, "retypeField", {
  value: function(name, type) {
    var pair = this.getPair(name);
    pair.stream.cancel();
    pair.field.value.properties.remove('editor');
    pair.field.value.properties.add(EditorProperty.create(type));
    var stream = pair.field.value.editor.value.map((function(v) {
      return ({
        path: name,
        value: v
      });
    }));
    stream.feed(this[_data]);
    pair.field.value.editor.value.feed(pair.field.value.text);
  },
  configurable: true,
  enumerable: true,
  writable: true
}), Object.defineProperty($__2, "toString", {
  value: function() {
    return ("ModelView: " + this.uuid);
  },
  configurable: true,
  enumerable: true,
  writable: true
}), Object.defineProperty($__2, "getPair", {
  value: function(name) {
    var pair = this[_fields][name];
    if (!pair)
      throw new Error(("field '" + name + " not found in ModelView'"));
    return pair;
  },
  configurable: true,
  enumerable: true,
  writable: true
}), Object.defineProperty($__2, "getField", {
  value: function(name) {
    return this.getPair(name).field;
  },
  configurable: true,
  enumerable: true,
  writable: true
}), Object.defineProperty($__2, Symbol.iterator, {
  value: function() {
    return this.array;
  },
  configurable: true,
  enumerable: true,
  writable: true
}), Object.defineProperty($__2, "array", {
  get: function() {
    return Object.keys(this[_fields]);
  },
  configurable: true,
  enumerable: true
}), Object.defineProperty($__2, "data", {
  get: function() {
    return this[_data];
  },
  configurable: true,
  enumerable: true
}), Object.defineProperty($__2, "schema", {
  get: function() {
    return this[_schema];
  },
  configurable: true,
  enumerable: true
}), $__2), {}, Component);
var SchemaWrapper = function SchemaWrapper(schema, view) {
  this.schema = schema;
  this.view = view;
  schema.stream.subscribe(this.handler.bind(this));
  view.schema.subscribe((function(e) {
    switch (e.event) {
      case 'rename':
        if (e.oldname) {
          schema.rename(e.oldname, e.newname);
        }
        break;
    }
  }));
};
($traceurRuntime.createClass)(SchemaWrapper, {
  handler: function(message) {
    switch (message.event) {
      case 'list':
        return this.handleList(message.data);
      case 'add':
        return this.handleAdd(message.name, message.type);
      case 'delete':
        return this.handleDelete(message.name);
      case 'rename':
        return this.handleRename(message.oldname, message.newname);
      case 'retype':
        return this.handleRetype(message.name, message.type);
      default:
        throw new Error(("invalid message '" + message + "'"));
    }
  },
  handleList: function(data) {
    var $__0 = this;
    this.view.reset();
    data.map((function(pair) {
      return $__0.handleAdd(pair.name, pair.type);
    }));
  },
  handleAdd: function(name, type) {
    this.view.addField(name, type);
  },
  handleDelete: function(name) {
    this.view.deleteField(name);
  },
  handleRename: function(oldname, newname) {
    this.view.renameField(oldname, newname);
  },
  handleRetype: function(name, type) {
    this.view.retypeField(name, type);
  }
}, {});
module.exports = {
  get ModelView() {
    return ModelView;
  },
  get SchemaWrapper() {
    return SchemaWrapper;
  },
  __esModule: true
};


},{"./component":27,"./field":30,"./modelview.jade":35,"./properties/types":51,"streamy/stream":23}],37:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<p class=\"block\"></p>");;return buf.join("");
};
},{"jade/runtime":20}],38:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/paragraph";
var FragmentBlock = require('./fragmentblock').FragmentBlock;
var template = require('./paragraph.jade')();
var Paragraph = function Paragraph() {
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  if (!('template' in options))
    options.template = template;
  $traceurRuntime.superCall(this, $Paragraph.prototype, "constructor", [options]);
};
var $Paragraph = Paragraph;
($traceurRuntime.createClass)(Paragraph, {}, {}, FragmentBlock);
;
module.exports = {
  get Paragraph() {
    return Paragraph;
  },
  __esModule: true
};


},{"./fragmentblock":33,"./paragraph.jade":37}],39:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/properties/base";
var _name = Symbol();
var BaseInjector = function BaseInjector() {};
($traceurRuntime.createClass)(BaseInjector, {
  inject: function(target) {
    throw new Error("abstract method: inject");
  },
  defineProperty: function(target, name, getter, setter) {
    Object.defineProperty(target, name, {
      configurable: true,
      enumerable: true,
      writeable: false,
      get: getter,
      set: setter
    });
  }
}, {});
var BaseProperty = function BaseProperty(name) {
  this[_name] = name;
};
($traceurRuntime.createClass)(BaseProperty, {get name() {
    return this[_name];
  }}, {}, BaseInjector);
;
module.exports = {
  get BaseProperty() {
    return BaseProperty;
  },
  get BaseInjector() {
    return BaseInjector;
  },
  __esModule: true
};


},{}],40:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/properties/behavior";
var BaseProperty = require('./base').BaseProperty;
var _ƒ = Symbol();
var BehaviorProperty = function BehaviorProperty(name, ƒ) {
  $traceurRuntime.superCall(this, $BehaviorProperty.prototype, "constructor", [name]);
  this[_ƒ] = ƒ;
};
var $BehaviorProperty = BehaviorProperty;
($traceurRuntime.createClass)(BehaviorProperty, {inject: function(target) {
    var ƒ = this[_ƒ](target).bind(target);
    this.defineProperty(target, this.name, (function() {
      return ƒ;
    }));
    return (function() {});
  }}, {}, BaseProperty);
;
module.exports = {
  get BehaviorProperty() {
    return BehaviorProperty;
  },
  __esModule: true
};


},{"./base":39}],41:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/properties/container";
var BaseProperty = require('./base').BaseProperty;
var Properties = require('./properties').Properties;
var _p = Symbol();
var PropertyContainer = function PropertyContainer(parent) {
  this[_p] = parent;
  new Properties(this);
};
($traceurRuntime.createClass)(PropertyContainer, {get parent() {
    return this[_p];
  }}, {});
var ContainerProperty = function ContainerProperty(name, defaultField, wireƒ) {
  $traceurRuntime.superCall(this, $ContainerProperty.prototype, "constructor", [name]);
  wireƒ = wireƒ || ((function() {}));
  this[_p] = {
    defaultField: defaultField,
    wireƒ: wireƒ
  };
};
var $ContainerProperty = ContainerProperty;
($traceurRuntime.createClass)(ContainerProperty, {inject: function(target) {
    var $__0 = this;
    var container = new PropertyContainer(target),
        setter = (this[_p].defaultField) ? (function(v) {
          return container[$__0[_p].defaultField].push(v);
        }) : undefined;
    this.defineProperty(target, this.name, (function() {
      return container;
    }), setter);
    return this[_p].wireƒ(target) || ((function() {}));
  }}, {}, BaseProperty);
;
module.exports = {
  get ContainerProperty() {
    return ContainerProperty;
  },
  __esModule: true
};


},{"./base":39,"./properties":43}],42:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/properties/index";
var $__node_95_modules_47_ui_47_properties_47_properties__ = require('./properties');
module.exports = $traceurRuntime.exportStar({__esModule: true}, $__node_95_modules_47_ui_47_properties_47_properties__);


},{"./properties":43}],43:[function(require,module,exports){
"use strict";
var $__2;
var __moduleName = "node_modules/ui/properties/properties";
var _p = Symbol;
var Properties = function Properties(target) {
  var $__0 = this;
  this[_p] = {
    target: target,
    properties: {},
    disposables: {}
  };
  Object.defineProperty(target, "properties", {
    configurable: true,
    enumerable: true,
    writeable: false,
    get: (function() {
      return $__0;
    })
  });
};
($traceurRuntime.createClass)(Properties, ($__2 = {}, Object.defineProperty($__2, "add", {
  value: function(property) {
    var name = property.name;
    if (name in this[_p].target)
      throw new Error("property 'name' already exists");
    this[_p].properties[name] = property;
    this[_p].disposables[name] = property.inject(this[_p].target);
  },
  configurable: true,
  enumerable: true,
  writable: true
}), Object.defineProperty($__2, "remove", {
  value: function(property) {
    var name = property.name || property;
    if (!(name in this[_p].properties))
      throw new Error("property 'name' doesn't exist");
    this[_p].disposables[name]();
    delete this[_p].disposables[name];
    delete this[_p].properties[name];
  },
  configurable: true,
  enumerable: true,
  writable: true
}), Object.defineProperty($__2, "get", {
  value: function(name) {
    return this[_p].properties[name];
  },
  configurable: true,
  enumerable: true,
  writable: true
}), Object.defineProperty($__2, "removeAll", {
  value: function() {
    for (var $__3 = this[Symbol.iterator](),
        $__4; !($__4 = $__3.next()).done; ) {
      try {
        throw undefined;
      } catch (name) {
        name = $__4.value;
        {
          this.remove(name);
        }
      }
    }
  },
  configurable: true,
  enumerable: true,
  writable: true
}), Object.defineProperty($__2, Symbol.iterator, {
  value: function() {
    return this.array;
  },
  configurable: true,
  enumerable: true,
  writable: true
}), Object.defineProperty($__2, "array", {
  get: function() {
    return Object.keys(this[_p].properties);
  },
  configurable: true,
  enumerable: true
}), Object.defineProperty($__2, "copyTo", {
  value: function(target) {
    for (var $__3 = this.array[Symbol.iterator](),
        $__4; !($__4 = $__3.next()).done; ) {
      try {
        throw undefined;
      } catch (key) {
        key = $__4.value;
        {
          target.properties.add(this.get(key));
        }
      }
    }
  },
  configurable: true,
  enumerable: true,
  writable: true
}), $__2), {});
;
module.exports = {
  get Properties() {
    return Properties;
  },
  __esModule: true
};


},{}],44:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/properties/types/attribute";
var StringValue = require('streamy/value').StringValue;
var ValueStreamProperty = require('../valuestream').ValueStreamProperty;
var Dom = require('ui/dom').Dom;
var AttributeProperty = function AttributeProperty(name, attribute) {
  var text = arguments[2] !== (void 0) ? arguments[2] : "";
  $traceurRuntime.superCall(this, $AttributeProperty.prototype, "constructor", [name, (function() {
    return new StringValue(text);
  }), (function(target, value) {
    return Dom.stream(value).applyAttribute(attribute, target.el);
  })]);
};
var $AttributeProperty = AttributeProperty;
($traceurRuntime.createClass)(AttributeProperty, {}, {}, ValueStreamProperty);
var TooltipProperty = function TooltipProperty() {
  var defaultValue = arguments[0] !== (void 0) ? arguments[0] : false;
  $traceurRuntime.superCall(this, $TooltipProperty.prototype, "constructor", ["tooltip", "title", defaultValue]);
};
var $TooltipProperty = TooltipProperty;
($traceurRuntime.createClass)(TooltipProperty, {}, {}, AttributeProperty);
;
module.exports = {
  get TooltipProperty() {
    return TooltipProperty;
  },
  get AttributeProperty() {
    return AttributeProperty;
  },
  __esModule: true
};


},{"../valuestream":58,"streamy/value":24,"ui/dom":28}],45:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (undefined) {
buf.push("<input type=\"checkbox\"" + (jade.attr("checked", (true===false ? "checked" : undefined), true, false)) + " class=\"bool editor\"/>");}("undefined" in locals_for_with?locals_for_with.undefined:typeof undefined!=="undefined"?undefined:undefined));;return buf.join("");
};
},{"jade/runtime":20}],46:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/properties/types/booleditor";
var ContainerProperty = require('../container').ContainerProperty;
var BehaviorProperty = require('../behavior').BehaviorProperty;
var ValueProperty = require('./value').ValueProperty;
var $__1 = require('ui/dom'),
    Dom = $__1.Dom,
    Query = $__1.Query,
    Html = $__1.Html;
var template = require('./booleditor.jade');
var _bound = Symbol(),
    _bindƒ = Symbol(),
    _unbindƒ = Symbol(),
    valueProperty = new ValueProperty('Bool', (function(editor, value) {
      var el = editor.parent.el,
          content = Query.first('.content', el),
          listenƒ = (function() {
            value.push(input.checked);
          }),
          input = Html.parse(template({checked: value.value}));
      content.appendChild(input);
      input.addEventListener("change", listenƒ, false);
      return function() {
        input.removeEventListener("change", listenƒ, false);
      };
    })),
    focusProperty = new BehaviorProperty('focus', (function(target) {
      var content = Query.first('.content', target.parent.el);
      return function() {
        content.focus();
      };
    }));
var BoolEditorProperty = function BoolEditorProperty() {
  $traceurRuntime.superCall(this, $BoolEditorProperty.prototype, "constructor", ['editor', 'value']);
};
var $BoolEditorProperty = BoolEditorProperty;
($traceurRuntime.createClass)(BoolEditorProperty, {inject: function(target) {
    var ƒ = $traceurRuntime.superCall(this, $BoolEditorProperty.prototype, "inject", [target]),
        editor = target.editor;
    editor.properties.add(valueProperty);
    editor.properties.add(focusProperty);
    return (function() {
      editor.properties.remove(focusProperty);
      ƒ();
    });
  }}, {}, ContainerProperty);
;
module.exports = {
  get BoolEditorProperty() {
    return BoolEditorProperty;
  },
  __esModule: true
};


},{"../behavior":40,"../container":41,"./booleditor.jade":45,"./value":56,"ui/dom":28}],47:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/properties/types/classname";
var ValueStreamProperty = require('../valuestream').ValueStreamProperty;
var BoolValue = require('streamy/value').BoolValue;
var Dom = require('ui/dom').Dom;
var SwapClassProperty = function SwapClassProperty(name) {
  var className = arguments[1] !== (void 0) ? arguments[1] : name;
  var defaultValue = arguments[2] !== (void 0) ? arguments[2] : false;
  $traceurRuntime.superCall(this, $SwapClassProperty.prototype, "constructor", [name, (function() {
    return new BoolValue(defaultValue);
  }), (function(target, value) {
    return Dom.stream(value).applySwapClass(target.el, className);
  })]);
};
var $SwapClassProperty = SwapClassProperty;
($traceurRuntime.createClass)(SwapClassProperty, {}, {}, ValueStreamProperty);
var StrongProperty = function StrongProperty() {
  var defaultValue = arguments[0] !== (void 0) ? arguments[0] : false;
  $traceurRuntime.superCall(this, $StrongProperty.prototype, "constructor", ["strong", "strong", defaultValue]);
};
var $StrongProperty = StrongProperty;
($traceurRuntime.createClass)(StrongProperty, {}, {}, SwapClassProperty);
var EmphasisProperty = function EmphasisProperty() {
  var defaultValue = arguments[0] !== (void 0) ? arguments[0] : false;
  $traceurRuntime.superCall(this, $EmphasisProperty.prototype, "constructor", ["emphasis", "emphasis", defaultValue]);
};
var $EmphasisProperty = EmphasisProperty;
($traceurRuntime.createClass)(EmphasisProperty, {}, {}, SwapClassProperty);
var StrikeProperty = function StrikeProperty() {
  var defaultValue = arguments[0] !== (void 0) ? arguments[0] : false;
  $traceurRuntime.superCall(this, $StrikeProperty.prototype, "constructor", ["strike", "strike", defaultValue]);
};
var $StrikeProperty = StrikeProperty;
($traceurRuntime.createClass)(StrikeProperty, {}, {}, SwapClassProperty);
;
module.exports = {
  get StrongProperty() {
    return StrongProperty;
  },
  get EmphasisProperty() {
    return EmphasisProperty;
  },
  get StrikeProperty() {
    return StrikeProperty;
  },
  get SwapClassProperty() {
    return SwapClassProperty;
  },
  __esModule: true
};


},{"../valuestream":58,"streamy/value":24,"ui/dom":28}],48:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/properties/types/editor";
var BoolEditorProperty = require('./booleditor').BoolEditorProperty;
var TextEditorProperty = require('./texteditor').TextEditorProperty;
var EditorProperty = {create: function(type) {
    for (var args = [],
        $__0 = 1; $__0 < arguments.length; $__0++)
      args[$__0 - 1] = arguments[$__0];
    switch (type) {
      case 'String':
        return new (Function.prototype.bind.apply(TextEditorProperty, $traceurRuntime.spread([null], args)))();
      case 'Bool':
        return new (Function.prototype.bind.apply(BoolEditorProperty, $traceurRuntime.spread([null], args)))();
      default:
        throw new Error(("Invalid editor type '" + type + "'"));
    }
  }};
module.exports = {
  get EditorProperty() {
    return EditorProperty;
  },
  __esModule: true
};


},{"./booleditor":46,"./texteditor":55}],49:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/properties/types/html";
var ValueStreamProperty = require('../valuestream').ValueStreamProperty;
var StringValue = require('streamy/value').StringValue;
var $__1 = require('ui/dom'),
    Dom = $__1.Dom,
    Query = $__1.Query;
var HtmlProperty = function HtmlProperty(html) {
  $traceurRuntime.superCall(this, $HtmlProperty.prototype, "constructor", ["html", (function() {
    return new StringValue(html);
  }), this.assignHtml]);
};
var $HtmlProperty = HtmlProperty;
($traceurRuntime.createClass)(HtmlProperty, {assignHtml: function(target, value) {
    Dom.stream(value).applyHtml(Query.first('.content', target.el));
  }}, {}, ValueStreamProperty);
module.exports = {
  get HtmlProperty() {
    return HtmlProperty;
  },
  __esModule: true
};


},{"../valuestream":58,"streamy/value":24,"ui/dom":28}],50:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/properties/types/icon";
var HtmlProperty = require('./html').HtmlProperty;
var StringValue = require('streamy/value').StringValue;
var $__1 = require('ui/dom'),
    Dom = $__1.Dom,
    Query = $__1.Query;
var IconProperty = function IconProperty() {
  $traceurRuntime.defaultSuperCall(this, $IconProperty.prototype, arguments);
};
var $IconProperty = IconProperty;
($traceurRuntime.createClass)(IconProperty, {assignHtml: function(target, value) {
    var transform = value.map((function(icon) {
      return ("<i class=\"fa fa-" + icon + "\"></i>");
    })),
        ƒ = $traceurRuntime.superCall(this, $IconProperty.prototype, "assignHtml", [target, transform]);
    return (function() {
      transform.cancel();
      ƒ();
    });
  }}, {}, HtmlProperty);
module.exports = {
  get IconProperty() {
    return IconProperty;
  },
  __esModule: true
};


},{"./html":49,"streamy/value":24,"ui/dom":28}],51:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/properties/types/index";
var $__node_95_modules_47_ui_47_properties_47_types_47_attribute__ = require('./attribute');
var $__node_95_modules_47_ui_47_properties_47_types_47_booleditor__ = require('./booleditor');
var $__node_95_modules_47_ui_47_properties_47_types_47_classname__ = require('./classname');
var $__node_95_modules_47_ui_47_properties_47_types_47_editor__ = require('./editor');
var $__node_95_modules_47_ui_47_properties_47_types_47_html__ = require('./html');
var $__node_95_modules_47_ui_47_properties_47_types_47_icon__ = require('./icon');
var $__node_95_modules_47_ui_47_properties_47_types_47_texteditor__ = require('./texteditor');
var $__node_95_modules_47_ui_47_properties_47_types_47_numericformat__ = require('./numericformat');
var $__node_95_modules_47_ui_47_properties_47_types_47_link__ = require('./link');
var $__node_95_modules_47_ui_47_properties_47_types_47_text__ = require('./text');
var $__node_95_modules_47_ui_47_properties_47_types_47_value__ = require('./value');
var $__node_95_modules_47_ui_47_properties_47_types_47_visible__ = require('./visible');
module.exports = $traceurRuntime.exportStar({__esModule: true}, $__node_95_modules_47_ui_47_properties_47_types_47_attribute__, $__node_95_modules_47_ui_47_properties_47_types_47_booleditor__, $__node_95_modules_47_ui_47_properties_47_types_47_classname__, $__node_95_modules_47_ui_47_properties_47_types_47_editor__, $__node_95_modules_47_ui_47_properties_47_types_47_html__, $__node_95_modules_47_ui_47_properties_47_types_47_icon__, $__node_95_modules_47_ui_47_properties_47_types_47_texteditor__, $__node_95_modules_47_ui_47_properties_47_types_47_numericformat__, $__node_95_modules_47_ui_47_properties_47_types_47_link__, $__node_95_modules_47_ui_47_properties_47_types_47_text__, $__node_95_modules_47_ui_47_properties_47_types_47_value__, $__node_95_modules_47_ui_47_properties_47_types_47_visible__);


},{"./attribute":44,"./booleditor":46,"./classname":47,"./editor":48,"./html":49,"./icon":50,"./link":52,"./numericformat":53,"./text":54,"./texteditor":55,"./value":56,"./visible":57}],52:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/properties/types/link";
var ValueStreamProperty = require('../valuestream').ValueStreamProperty;
var StringValue = require('streamy/value').StringValue;
var LinkProperty = function LinkProperty() {
  var url = arguments[0] !== (void 0) ? arguments[0] : "";
  $traceurRuntime.superCall(this, $LinkProperty.prototype, "constructor", ["link", (function() {
    return new StringValue(url);
  }), (function(target, value) {
    var a = document.createElement('a'),
        el = target.el,
        ƒ = (function(url) {
          return a.href = url;
        });
    a.target = "_blank";
    {
      try {
        throw undefined;
      } catch ($i) {
        $i = 0;
        for (; $i < el.childNodes.length; $i++) {
          try {
            throw undefined;
          } catch (i) {
            i = $i;
            try {
              a.appendChild(el.childNodes[i]);
            } finally {
              $i = i;
            }
          }
        }
      }
    }
    el.appendChild(a);
    value.subscribe(ƒ);
    return (function() {
      value.unsubscribe(ƒ);
      el.removeChild(a);
      {
        try {
          throw undefined;
        } catch ($i) {
          $i = 0;
          for (; $i < a.childNodes.length; $i++) {
            try {
              throw undefined;
            } catch (i) {
              i = $i;
              try {
                el.appendChild(a.childNodes[i]);
              } finally {
                $i = i;
              }
            }
          }
        }
      }
    });
  })]);
};
var $LinkProperty = LinkProperty;
($traceurRuntime.createClass)(LinkProperty, {}, {}, ValueStreamProperty);
;
module.exports = {
  get LinkProperty() {
    return LinkProperty;
  },
  __esModule: true
};


},{"../valuestream":58,"streamy/value":24}],53:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/properties/types/numericformat";
var StringValue = require('streamy/value').StringValue;
var ValueStreamProperty = require('../valuestream').ValueStreamProperty;
var numeral = require('numeral');
var NumericFormatProperty = function NumericFormatProperty() {
  var defaultFormat = arguments[0] !== (void 0) ? arguments[0] : "";
  $traceurRuntime.superCall(this, $NumericFormatProperty.prototype, "constructor", ["format", (function() {
    return new StringValue(defaultFormat);
  }), (function(target, format) {
    var value = target.value,
        text = target.text;
    if (!value) {
      throw new Error("'format' requires the property 'value'");
    }
    if (!text) {
      throw new Error("'format' requires the property 'text'");
    }
    var stream = value.zip(format);
    stream.spread((function(value, format) {
      if (format === "") {
        format = Math.floor(value) === value ? "0,0" : "0,0.000";
      }
      text.value = numeral(value).format(format);
    }));
    return stream.cancel.bind(stream);
  })]);
};
var $NumericFormatProperty = NumericFormatProperty;
($traceurRuntime.createClass)(NumericFormatProperty, {}, {}, ValueStreamProperty);
;
module.exports = {
  get NumericFormatProperty() {
    return NumericFormatProperty;
  },
  __esModule: true
};


},{"../valuestream":58,"numeral":22,"streamy/value":24}],54:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/properties/types/text";
var ValueStreamProperty = require('../valuestream').ValueStreamProperty;
var StringValue = require('streamy/value').StringValue;
var $__1 = require('ui/dom'),
    Dom = $__1.Dom,
    Query = $__1.Query;
var TextProperty = function TextProperty(text) {
  $traceurRuntime.superCall(this, $TextProperty.prototype, "constructor", ["text", (function() {
    return new StringValue(text);
  }), (function(target, value) {
    return Dom.stream(value).applyText(Query.first('.content', target.el));
  })]);
};
var $TextProperty = TextProperty;
($traceurRuntime.createClass)(TextProperty, {}, {}, ValueStreamProperty);
;
module.exports = {
  get TextProperty() {
    return TextProperty;
  },
  __esModule: true
};


},{"../valuestream":58,"streamy/value":24,"ui/dom":28}],55:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/properties/types/texteditor";
var ContainerProperty = require('../container').ContainerProperty;
var BehaviorProperty = require('../behavior').BehaviorProperty;
var ValueProperty = require('./value').ValueProperty;
var $__1 = require('ui/dom'),
    Dom = $__1.Dom,
    Query = $__1.Query;
var _bound = Symbol(),
    _bindƒ = Symbol(),
    _unbindƒ = Symbol(),
    valueProperty = new ValueProperty('String', (function(editor, value) {
      var el = editor.parent.el,
          content = Query.first('.content', el),
          stream = value.map((function(s) {
            return s.length === 0;
          })).unique(),
          cancelƒ = Dom.stream(stream).applySwapClass(content, 'empty'),
          listenƒ = (function(e) {
            value.push(el.innerText);
          });
      editor[_bound] = false;
      editor[_bindƒ] = (function() {
        if (editor[_bound])
          return;
        content.setAttribute("contenteditable", true);
        content.addEventListener("input", listenƒ, false);
        editor[_bound] = true;
      }), editor[_unbindƒ] = (function() {
        if (!editor[_bound])
          return;
        content.removeEventListener("input", listenƒ, false);
        content.removeAttribute("contenteditable");
        editor[_bound] = false;
      });
      var focusƒ = (function() {
        return editor.focus();
      });
      content.setAttribute('tabindex', '0');
      content.addEventListener("focus", focusƒ, false);
      content.addEventListener("blur", (function() {
        return editor[_unbindƒ]();
      }));
      return function() {
        cancelƒ();
        editor[_unbindƒ]();
        delete editor[_unbindƒ];
        delete editor[_bindƒ];
        delete editor[_bound];
        content.removeEventListener("focus", focusƒ, false);
        content.removeEventListener("input", listenƒ, false);
        content.removeAttribute("contenteditable");
      };
    })),
    focusProperty = new BehaviorProperty('focus', (function(target) {
      var content = Query.first('.content', target.parent.el);
      return function() {
        target[_bindƒ]();
        content.focus();
      };
    })),
    getSelectionProperty = new BehaviorProperty('getSelection', (function(target) {
      var content = Query.first('.content', target.parent.el);
      return function() {
        var selection = window.getSelection();
        if (!selection.baseNode in content.childNodes)
          throw new Error("not found!");
        return {
          start: selection.anchorOffset,
          end: selection.focusOffset,
          text: selection.toString()
        };
      };
    })),
    setSelectionProperty = new BehaviorProperty('setSelection', (function(target) {
      var content = Query.first('.content', target.parent.el);
      return function(start, end) {
        var node = content.firstChild,
            range = document.createRange(),
            sel = window.getSelection();
        target.focus();
        if (!node) {
          return;
        }
        range.setStart(node, Math.max(start, 0));
        range.setEnd(node, Math.min(end, node.wholeText.length));
        sel.removeAllRanges();
        sel.addRange(range);
      };
    }));
var TextEditorProperty = function TextEditorProperty() {
  $traceurRuntime.superCall(this, $TextEditorProperty.prototype, "constructor", ['editor', 'value']);
};
var $TextEditorProperty = TextEditorProperty;
($traceurRuntime.createClass)(TextEditorProperty, {inject: function(target) {
    var ƒ = $traceurRuntime.superCall(this, $TextEditorProperty.prototype, "inject", [target]),
        editor = target.editor;
    editor.properties.add(valueProperty);
    editor.properties.add(focusProperty);
    editor.properties.add(getSelectionProperty);
    editor.properties.add(setSelectionProperty);
    return (function() {
      editor.properties.remove(focusProperty);
      editor.properties.remove(getSelectionProperty);
      editor.properties.remove(setSelectionProperty);
      ƒ();
    });
  }}, {}, ContainerProperty);
;
module.exports = {
  get TextEditorProperty() {
    return TextEditorProperty;
  },
  __esModule: true
};


},{"../behavior":40,"../container":41,"./value":56,"ui/dom":28}],56:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/properties/types/value";
var ValueStreamProperty = require('../valuestream').ValueStreamProperty;
var $__3 = require('streamy/value'),
    StringValue = $__3.StringValue,
    BoolValue = $__3.BoolValue,
    FloatValue = $__3.FloatValue,
    DateValue = $__3.DateValue;
function valueFunctor(type) {
  for (var args = [],
      $__1 = 1; $__1 < arguments.length; $__1++)
    args[$__1 - 1] = arguments[$__1];
  switch (type) {
    case "String":
      return new (Function.prototype.bind.apply(StringValue, $traceurRuntime.spread([null], args)))();
    case "Bool":
      return new (Function.prototype.bind.apply(BoolValue, $traceurRuntime.spread([null], args)))();
    case "Float":
      return new (Function.prototype.bind.apply(FloatValue, $traceurRuntime.spread([null], args)))();
    case "Date":
      return new (Function.prototype.bind.apply(DateValue, $traceurRuntime.spread([null], args)))();
    default:
      throw new Error(("type '" + type + "' not found"));
  }
}
var ValueProperty = function ValueProperty(type, wireƒ) {
  for (var args = [],
      $__2 = 2; $__2 < arguments.length; $__2++)
    args[$__2 - 2] = arguments[$__2];
  $traceurRuntime.superCall(this, $ValueProperty.prototype, "constructor", ["value", (function() {
    return typeof type === 'string' ? valueFunctor.apply(null, $traceurRuntime.spread([type], args)) : type;
  }), wireƒ || ((function() {
    return ((function() {}));
  }))]);
};
var $ValueProperty = ValueProperty;
($traceurRuntime.createClass)(ValueProperty, {}, {}, ValueStreamProperty);
;
module.exports = {
  get ValueProperty() {
    return ValueProperty;
  },
  __esModule: true
};


},{"../valuestream":58,"streamy/value":24}],57:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/properties/types/visible";
var ValueStreamProperty = require('../valuestream').ValueStreamProperty;
var BoolValue = require('streamy/value').BoolValue;
var Dom = require('ui/dom').Dom;
var VisibleProperty = function VisibleProperty() {
  var defaultValue = arguments[0] !== (void 0) ? arguments[0] : true;
  $traceurRuntime.superCall(this, $VisibleProperty.prototype, "constructor", ["visible", (function() {
    return new BoolValue(defaultValue);
  }), (function(target, value) {
    return Dom.stream(value).applyDisplay(target.el);
  })]);
};
var $VisibleProperty = VisibleProperty;
($traceurRuntime.createClass)(VisibleProperty, {}, {}, ValueStreamProperty);
;
module.exports = {
  get VisibleProperty() {
    return VisibleProperty;
  },
  __esModule: true
};


},{"../valuestream":58,"streamy/value":24,"ui/dom":28}],58:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/properties/valuestream";
var BaseProperty = require('./base').BaseProperty;
var ƒ = require('util/ƒ').ƒ;
var _p = Symbol();
var ValueStreamProperty = function ValueStreamProperty(name, valueƒ, wireƒ) {
  $traceurRuntime.superCall(this, $ValueStreamProperty.prototype, "constructor", [name]);
  this[_p] = {
    valueƒ: valueƒ,
    wireƒ: wireƒ
  };
};
var $ValueStreamProperty = ValueStreamProperty;
($traceurRuntime.createClass)(ValueStreamProperty, {inject: function(target) {
    var value = this[_p].valueƒ();
    this.defineProperty(target, this.name, (function() {
      return value;
    }), value.push.bind(value));
    return ƒ.join(this[_p].wireƒ(target, value), (function() {
      return value.cancel();
    }));
  }}, {}, BaseProperty);
;
module.exports = {
  get ValueStreamProperty() {
    return ValueStreamProperty;
  },
  __esModule: true
};


},{"./base":39,"util/ƒ":61}],59:[function(require,module,exports){
"use strict";
var $__2;
var __moduleName = "node_modules/ui/schema";
var PushStream = require('streamy/stream').PushStream;
var _fields = Symbol(),
    _stream = Symbol();
var Schema = function Schema() {
  var $__0 = this;
  this[_fields] = {};
  this[_stream] = new PushStream();
  var subscribe = this[_stream].subscribe.bind(this[_stream]);
  this[_stream].subscribe = (function(ƒ) {
    subscribe(ƒ);
    ƒ({
      event: 'list',
      data: $__0.pairs
    });
  });
};
($traceurRuntime.createClass)(Schema, ($__2 = {}, Object.defineProperty($__2, "add", {
  value: function(name, type) {
    if (name in this[_fields])
      throw new Error(("Schema already contains a field '" + name + "'"));
    this[_fields][name] = type;
    this[_stream].push({
      event: 'add',
      name: name,
      type: type
    });
  },
  configurable: true,
  enumerable: true,
  writable: true
}), Object.defineProperty($__2, "reset", {
  value: function() {
    var list = arguments[0] !== (void 0) ? arguments[0] : [];
    var $__0 = this;
    this[_fields] = {};
    list.map((function(v) {
      return $__0[_fields][v.name] = v.type;
    }));
    this[_stream].push({
      event: 'list',
      data: list.slice(0)
    });
  },
  configurable: true,
  enumerable: true,
  writable: true
}), Object.defineProperty($__2, "delete", {
  value: function(name) {
    if (!(name in this[_fields]))
      throw new Error(("Schema does not contain a field '" + name + "'"));
    delete this[_fields][name];
    this[_stream].push({
      event: 'delete',
      name: name
    });
  },
  configurable: true,
  enumerable: true,
  writable: true
}), Object.defineProperty($__2, "rename", {
  value: function(oldname, newname) {
    if (!(oldname in this[_fields]))
      throw new Error(("Schema does not contain a field '" + oldname + "'"));
    var type = this[_fields][oldname];
    delete this[_fields][oldname];
    this[_fields][newname] = type;
    this[_stream].push({
      event: 'rename',
      oldname: oldname,
      newname: newname
    });
  },
  configurable: true,
  enumerable: true,
  writable: true
}), Object.defineProperty($__2, "retype", {
  value: function(name, type) {
    if (!(name in this[_fields]))
      throw new Error(("Schema doesn't container field '" + name + "' for retype()"));
    this[_fields][name];
    this[_fields][name] = type;
    this[_stream].push({
      event: 'retype',
      name: name,
      type: type
    });
  },
  configurable: true,
  enumerable: true,
  writable: true
}), Object.defineProperty($__2, "get", {
  value: function(name) {
    return this[_fields][name];
  },
  configurable: true,
  enumerable: true,
  writable: true
}), Object.defineProperty($__2, "has", {
  value: function(name) {
    return name in this[_fields];
  },
  configurable: true,
  enumerable: true,
  writable: true
}), Object.defineProperty($__2, Symbol.iterator, {
  value: function() {
    return this.array;
  },
  configurable: true,
  enumerable: true,
  writable: true
}), Object.defineProperty($__2, "array", {
  get: function() {
    return Object.keys(this[_fields]);
  },
  configurable: true,
  enumerable: true
}), Object.defineProperty($__2, "pairs", {
  get: function() {
    return Object.keys(this[_fields]).map(function(k) {
      return {
        key: k,
        value: this[_fields][key]
      };
    });
  },
  configurable: true,
  enumerable: true
}), Object.defineProperty($__2, "stream", {
  get: function() {
    return this[_stream];
  },
  configurable: true,
  enumerable: true
}), Object.defineProperty($__2, "toString", {
  value: function() {
    return JSON.stringify(this[_fields]);
  },
  configurable: true,
  enumerable: true,
  writable: true
}), $__2), {});
module.exports = {
  get Schema() {
    return Schema;
  },
  __esModule: true
};


},{"streamy/stream":23}],60:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/timer";
var immediate = require('immediate'),
    Timer = {
      delay: function(ms, ƒ) {
        if (ƒ)
          return setTimeout(ƒ, ms);
        else
          return new Promise((function(resolve) {
            return setTimeout(resolve, ms);
          }));
      },
      immediate: function(ƒ) {
        if (ƒ)
          return immediate(ƒ);
        else
          return new Promise((function(resolve) {
            return immediate(resolve);
          }));
      },
      debounce: function(ƒ) {
        var ms = arguments[1] !== (void 0) ? arguments[1] : 0;
        var tid,
            context,
            args,
            laterƒ;
        return function() {
          context = this;
          args = arguments;
          laterƒ = function() {
            if (!immediate)
              ƒ.apply(context, args);
          };
          clearTimeout(tid);
          tid = setTimeout(laterƒ, ms);
        };
      },
      reduce: function(ƒ) {
        var ms = arguments[1] !== (void 0) ? arguments[1] : 0;
        var tid,
            context,
            args;
        return function() {
          context = this;
          args = arguments;
          if (tid)
            return;
          tid = setTimeout(function() {
            tid = null;
            ƒ.apply(context, args);
          }, ms);
        };
      }
    };
var $__default = Timer;
module.exports = {
  get default() {
    return $__default;
  },
  __esModule: true
};


},{"immediate":14}],61:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/util/ƒ";
var ƒ = {
  compose: function(ƒ1, ƒ2) {
    return function() {
      return ƒ1(ƒ2.apply(undefined, arguments));
    };
  },
  join: function(ƒ1, ƒ2) {
    return function() {
      ƒ1.apply(undefined, arguments);
      ƒ2.apply(undefined, arguments);
    };
  }
};
module.exports = {
  get ƒ() {
    return ƒ;
  },
  __esModule: true
};


},{}]},{},[12,1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvY2xpZW50L21haW4uanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL25vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2NyeXB0by1icm93c2VyaWZ5L2hlbHBlcnMuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvY3J5cHRvLWJyb3dzZXJpZnkvaW5kZXguanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvY3J5cHRvLWJyb3dzZXJpZnkvbWQ1LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2NyeXB0by1icm93c2VyaWZ5L3JuZy5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9jcnlwdG8tYnJvd3NlcmlmeS9zaGEuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvY3J5cHRvLWJyb3dzZXJpZnkvc2hhMjU2LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2luc2VydC1tb2R1bGUtZ2xvYmFscy9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2VzNmlmeS9ub2RlX21vZHVsZXMvdHJhY2V1ci9iaW4vdHJhY2V1ci1ydW50aW1lLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2ltbWVkaWF0ZS9saWIvZmFrZU5leHRUaWNrLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2ltbWVkaWF0ZS9saWIvaW5kZXguanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvaW1tZWRpYXRlL2xpYi9tZXNzYWdlQ2hhbm5lbC5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9pbW1lZGlhdGUvbGliL211dGF0aW9uLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2ltbWVkaWF0ZS9saWIvcG9zdE1lc3NhZ2UuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvaW1tZWRpYXRlL2xpYi9zdGF0ZUNoYW5nZS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9pbW1lZGlhdGUvbGliL3RpbWVvdXQuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvamFkZS9ydW50aW1lLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL25vZGUtdXVpZC91dWlkLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL251bWVyYWwvbnVtZXJhbC5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9zdHJlYW15L3N0cmVhbS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9zdHJlYW15L3ZhbHVlLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL0ZpZWxkLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL2Jsb2NrLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL2NvbXBvbmVudC5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9kb20uanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvZmllbGQuamFkZSIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9maWVsZC5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9mcmFnbWVudC5qYWRlIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL2ZyYWdtZW50LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL2ZyYWdtZW50YmxvY2suanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvbW9kZWwuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvbW9kZWx2aWV3LmphZGUiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvbW9kZWx2aWV3LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3BhcmFncmFwaC5qYWRlIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3BhcmFncmFwaC5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9wcm9wZXJ0aWVzL2Jhc2UuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvcHJvcGVydGllcy9iZWhhdmlvci5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9wcm9wZXJ0aWVzL2NvbnRhaW5lci5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9wcm9wZXJ0aWVzL2luZGV4LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3Byb3BlcnRpZXMvcHJvcGVydGllcy5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9wcm9wZXJ0aWVzL3R5cGVzL2F0dHJpYnV0ZS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9wcm9wZXJ0aWVzL3R5cGVzL2Jvb2xlZGl0b3IuamFkZSIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9wcm9wZXJ0aWVzL3R5cGVzL2Jvb2xlZGl0b3IuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvcHJvcGVydGllcy90eXBlcy9jbGFzc25hbWUuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvcHJvcGVydGllcy90eXBlcy9lZGl0b3IuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvcHJvcGVydGllcy90eXBlcy9odG1sLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3Byb3BlcnRpZXMvdHlwZXMvaWNvbi5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9wcm9wZXJ0aWVzL3R5cGVzL2luZGV4LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3Byb3BlcnRpZXMvdHlwZXMvbGluay5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9wcm9wZXJ0aWVzL3R5cGVzL251bWVyaWNmb3JtYXQuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvcHJvcGVydGllcy90eXBlcy90ZXh0LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3Byb3BlcnRpZXMvdHlwZXMvdGV4dGVkaXRvci5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9wcm9wZXJ0aWVzL3R5cGVzL3ZhbHVlLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3Byb3BlcnRpZXMvdHlwZXMvdmlzaWJsZS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9wcm9wZXJ0aWVzL3ZhbHVlc3RyZWFtLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3NjaGVtYS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS90aW1lci5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91dGlsL8aSLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O3FCQUF1QixnQkFBZ0I7dUJBQ2QsYUFBYTttQkFDWCxRQUFROzs7MEJBQ1AsZUFBZTttQkFLcEMscUJBQXFCOzs7Ozs7Ozs7Ozs7OzttQkFFYSxjQUFjOzs7b0JBQ2pDLFVBQVU7cUJBQ1QsV0FBVztvQkFFWixVQUFVO3dCQUVOLGNBQWM7QUFFeEMsQ0FBQSxFQUFHLE1BQU07S0FDSixDQUFBLEtBQUssRUFBYyxDQUFBLEtBQUssTUFBTSxDQUFDLE9BQU8sQ0FB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QU8sSUFBSSxDQUFDLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUU5QyxDQUFBLE9BQU0sTUFBTSxDQUFDLENBQ1o7QUFBQyxDQUFBLE9BQUksQ0FBQyxPQUFNO0FBQUMsQ0FBQSxPQUFJLENBQUMsU0FBUTtDQUFBLEVBQUMsQ0FDM0I7QUFBQyxDQUFBLE9BQUksQ0FBQyxXQUFVO0FBQUMsQ0FBQSxPQUFJLENBQUMsU0FBUTtDQUFBLEVBQUMsQ0FDL0I7QUFBQyxDQUFBLE9BQUksQ0FBQyxRQUFPO0FBQUMsQ0FBQSxPQUFJLENBQUMsT0FBTTtDQUFBLEVBQUMsQ0FDMUIsQ0FBQyxDQUFDO0dBeUJGLENBQUM7Q0FBQTs7O0FDOUlIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdmxDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzl6Q0E7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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Ozs7O0NBQUM7OztBQ3hDckI7O0dBQVcsQ0FBQSxDQUFDLEVBQUc7Q0FDZCxRQUFPLENBQVAsVUFBUSxFQUFFLENBQUUsQ0FBQSxFQUFFLENBQUU7Q0FDZixTQUFPLFVBQVMsQ0FBRTtDQUNqQixXQUFPLENBQUEsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBRSxVQUFTLENBQUMsQ0FBQyxDQUFDO0tBQzFDLENBQUM7R0FDRjtDQUNELEtBQUksQ0FBSixVQUFLLEVBQUUsQ0FBRSxDQUFBLEVBQUUsQ0FBRTtDQUNaLFNBQU8sVUFBUyxDQUFFO0FBQ2pCLENBQUEsT0FBRSxNQUFNLENBQUMsU0FBUyxDQUFFLFVBQVMsQ0FBQyxDQUFDO0FBQy9CLENBQUEsT0FBRSxNQUFNLENBQUMsU0FBUyxDQUFFLFVBQVMsQ0FBQyxDQUFDO0tBQy9CLENBQUE7R0FDRDtDQUFBLEFBQ0Q7Ozs7Ozs7Q0FBQyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHsgU3RyZWFtIH0gZnJvbSAnc3RyZWFteS9zdHJlYW0nO1xuaW1wb3J0IHsgRnJhZ21lbnQgfSBmcm9tICd1aS9mcmFnbWVudCc7XG5pbXBvcnQgeyBEb20sIFF1ZXJ5IH0gZnJvbSAndWkvZG9tJztcbmltcG9ydCB7IFN0cmluZ1ZhbHVlIH0gZnJvbSAnc3RyZWFteS92YWx1ZSc7XG5pbXBvcnQge1xuXHRUZXh0UHJvcGVydHksIFZhbHVlUHJvcGVydHksIFZpc2libGVQcm9wZXJ0eSwgTGlua1Byb3BlcnR5LFxuXHRTdHJvbmdQcm9wZXJ0eSwgRW1waGFzaXNQcm9wZXJ0eSwgU3RyaWtlUHJvcGVydHksIE51bWVyaWNGb3JtYXRQcm9wZXJ0eSwgVG9vbHRpcFByb3BlcnR5LFxuXHRUZXh0RWRpdG9yUHJvcGVydHksIEJvb2xFZGl0b3JQcm9wZXJ0eSwgSHRtbFByb3BlcnR5LCBJY29uUHJvcGVydHlcbn0gZnJvbSAndWkvcHJvcGVydGllcy90eXBlcyc7XG5cbmltcG9ydCB7IE1vZGVsVmlldywgU2NoZW1hV3JhcHBlciB9IGZyb20gJ3VpL21vZGVsdmlldyc7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gJ3VpL21vZGVsJztcbmltcG9ydCB7IFNjaGVtYSB9IGZyb20gJ3VpL3NjaGVtYSc7XG5cbmltcG9ydCB7IEZpZWxkIH0gZnJvbSAndWkvRmllbGQnO1xuXG5pbXBvcnQgeyBQYXJhZ3JhcGggfSBmcm9tICd1aS9wYXJhZ3JhcGgnO1xuXG5Eb20ucmVhZHkoKCkgPT4ge1xuXHRsZXQgJGNhcmQgICAgICAgICAgICA9IFF1ZXJ5LmZpcnN0KCcuY2FyZCcpLFxuXHRcdCRkb2MgICAgICAgICAgICAgPSBRdWVyeS5maXJzdCgnLmRvYycsICRjYXJkKSxcblx0XHQkZG9jX2hlYWRlciAgICAgID0gUXVlcnkuZmlyc3QoJ2hlYWRlcicsICRkb2MpLFxuXHRcdCRkb2NfYXJ0aWNsZSAgICAgPSBRdWVyeS5maXJzdCgnYXJ0aWNsZScsICRkb2MpLFxuXHRcdCRkb2NfZm9vdGVyICAgICAgPSBRdWVyeS5maXJzdCgnZm9vdGVyJywgJGRvYyksXG5cdFx0JGFzaWRlICAgICAgICAgICA9IFF1ZXJ5LmZpcnN0KCdhc2lkZScsICRjYXJkKSxcblx0XHQkY29udGV4dCAgICAgICAgID0gUXVlcnkuZmlyc3QoJy5jb250ZXh0JywgJGFzaWRlKSxcblx0XHQkY29udGV4dF9oZWFkZXIgID0gUXVlcnkuZmlyc3QoJ2hlYWRlcicsICRjb250ZXh0KSxcblx0XHQkY29udGV4dF9hcnRpY2xlID0gUXVlcnkuZmlyc3QoJ2FydGljbGUnLCAkY29udGV4dCksXG5cdFx0JG1vZGVsICAgICAgICAgICA9IFF1ZXJ5LmZpcnN0KCcubW9kZWwnLCAkYXNpZGUpLFxuXHRcdCRtb2RlbF9oZWFkZXIgICAgPSBRdWVyeS5maXJzdCgnaGVhZGVyJywgJG1vZGVsKSxcblx0XHQkbW9kZWxfYXJ0aWNsZSAgID0gUXVlcnkuZmlyc3QoJ2FydGljbGUnLCAkbW9kZWwpLFxuXHRcdHAgICAgICAgICAgICAgICAgPSBuZXcgUGFyYWdyYXBoKCksXG5cdFx0ZWRpdG9yICAgICAgICAgICA9IHAuY3JlYXRlRnJhZ21lbnQoKSxcblx0XHR0ZXh0ICAgICAgICAgICAgID0gbmV3IFRleHRQcm9wZXJ0eSgpLFxuXHRcdHN0cmluZ1ZhbHVlICAgICAgPSBuZXcgVmFsdWVQcm9wZXJ0eShcIlN0cmluZ1wiKSxcblx0XHRudW1iZXJWYWx1ZSAgICAgID0gbmV3IFZhbHVlUHJvcGVydHkoXCJOdW1iZXJcIiksXG5cdFx0dmlzaWJsZSAgICAgICAgICA9IG5ldyBWaXNpYmxlUHJvcGVydHkoKSxcblx0XHRzdHJvbmcgICAgICAgICAgID0gbmV3IFN0cm9uZ1Byb3BlcnR5KCksXG5cdFx0ZW1waGFzaXMgICAgICAgICA9IG5ldyBFbXBoYXNpc1Byb3BlcnR5KCksXG5cdFx0c3RyaWtlICAgICAgICAgICA9IG5ldyBTdHJpa2VQcm9wZXJ0eSgpLFxuXHRcdGZvcm1hdE51bWJlciAgICAgPSBuZXcgTnVtZXJpY0Zvcm1hdFByb3BlcnR5KCksXG5cdFx0bGluayAgICAgICAgICAgICA9IG5ldyBMaW5rUHJvcGVydHkoKSxcblx0XHR0b29sdGlwICAgICAgICAgID0gbmV3IFRvb2x0aXBQcm9wZXJ0eShcInRvb2x0aXAgdGV4dCBnb2VzIGhlcmVcIiksXG5cdFx0dGV4dEVkaXRvciAgICAgICA9IG5ldyBUZXh0RWRpdG9yUHJvcGVydHkoKTtcblxuXG5cdC8vIGFkZCB0ZXh0IHByb3BlcnR5IGFuZCByZW5kZXJpbmdcblx0ZWRpdG9yLnByb3BlcnRpZXMuYWRkKHRleHQpO1xuXHRlZGl0b3IucHJvcGVydGllcy5hZGQoc3Ryb25nKTtcblx0ZWRpdG9yLnByb3BlcnRpZXMuYWRkKGVtcGhhc2lzKTtcblx0ZWRpdG9yLnByb3BlcnRpZXMuYWRkKHN0cmlrZSk7XG5cdC8vZWRpdG9yLnByb3BlcnRpZXMuYWRkKGxpbmspO1xuXG5cdC8vIGFkZCB0ZXh0IGVkaXRvclxuXHRlZGl0b3IucHJvcGVydGllcy5hZGQodGV4dEVkaXRvcik7XG5cdGVkaXRvci5lZGl0b3IudmFsdWUuZmVlZChlZGl0b3IudGV4dCk7XG5cdGVkaXRvci5lZGl0b3IgPSBcInNlbGVjdCBtZS4uLlwiO1xuXHRlZGl0b3IuZWRpdG9yLmZvY3VzKCk7XG5cblxuXG5cblx0bGV0IGZpZWxkID0gbmV3IEZpZWxkKCk7XG5cdGZpZWxkLmF0dGFjaFRvKCRjb250ZXh0X2FydGljbGUpO1xuXHRmaWVsZC5rZXkucHJvcGVydGllcy5hZGQobmV3IFRleHRQcm9wZXJ0eSgndGV4dCcpKTtcblx0ZmllbGQudmFsdWUucHJvcGVydGllcy5hZGQobmV3IFRleHRQcm9wZXJ0eSgpKTtcblx0ZmllbGQudmFsdWUucHJvcGVydGllcy5hZGQobmV3IFRleHRFZGl0b3JQcm9wZXJ0eSgpKTtcblx0ZmllbGQudmFsdWUuZWRpdG9yLnZhbHVlLmZlZWQoZmllbGQudmFsdWUudGV4dCk7XG5cdGZpZWxkLnZhbHVlLmVkaXRvci52YWx1ZSA9ICckLnZhcm5hbWUnO1xuXG5cdGxldCBmaWVsZCA9IG5ldyBGaWVsZCgpO1xuXHRmaWVsZC5hdHRhY2hUbygkY29udGV4dF9hcnRpY2xlKTtcblx0ZmllbGQua2V5LnByb3BlcnRpZXMuYWRkKG5ldyBUZXh0UHJvcGVydHkoJ2xpbmsnKSk7XG5cdGZpZWxkLnZhbHVlLnByb3BlcnRpZXMuYWRkKG5ldyBUZXh0UHJvcGVydHkoKSk7XG5cdGZpZWxkLnZhbHVlLnByb3BlcnRpZXMuYWRkKG5ldyBUZXh0RWRpdG9yUHJvcGVydHkoKSk7XG5cdGZpZWxkLnZhbHVlLmVkaXRvci52YWx1ZS5mZWVkKGZpZWxkLnZhbHVlLnRleHQpO1xuXHQvL2ZpZWxkLnZhbHVlLmVkaXRvci52YWx1ZS5mZWVkKGVkaXRvci5saW5rKTtcblx0ZmllbGQudmFsdWUuZWRpdG9yLnZhbHVlID0gJ2h0dHA6Ly93d3cuZ29vZ2xlLmNvbSc7XG5cblx0bGV0IGZpZWxkID0gbmV3IEZpZWxkKCk7XG5cdGZpZWxkLmF0dGFjaFRvKCRjb250ZXh0X2FydGljbGUpO1xuXHRmaWVsZC5rZXkucHJvcGVydGllcy5hZGQobmV3IEljb25Qcm9wZXJ0eSgnYm9sZCcpKTtcblx0ZmllbGQudmFsdWUucHJvcGVydGllcy5hZGQobmV3IEJvb2xFZGl0b3JQcm9wZXJ0eSgpKTtcblx0ZmllbGQudmFsdWUuZWRpdG9yLnZhbHVlLmZlZWQoZWRpdG9yLnN0cm9uZyk7XG5cdHAuYXR0YWNoVG8oJGRvY19hcnRpY2xlKTtcblxuXHRsZXQgZmllbGQgPSBuZXcgRmllbGQoKTtcblx0ZmllbGQuYXR0YWNoVG8oJGNvbnRleHRfYXJ0aWNsZSk7XG5cdGZpZWxkLmtleS5wcm9wZXJ0aWVzLmFkZChuZXcgSWNvblByb3BlcnR5KCdpdGFsaWMnKSk7XG5cdGZpZWxkLnZhbHVlLnByb3BlcnRpZXMuYWRkKG5ldyBCb29sRWRpdG9yUHJvcGVydHkoKSk7XG5cdGZpZWxkLnZhbHVlLmVkaXRvci52YWx1ZS5mZWVkKGVkaXRvci5lbXBoYXNpcyk7XG5cdHAuYXR0YWNoVG8oJGRvY19hcnRpY2xlKTtcblxuXHRsZXQgZmllbGQgPSBuZXcgRmllbGQoKTtcblx0ZmllbGQuYXR0YWNoVG8oJGNvbnRleHRfYXJ0aWNsZSk7XG5cdGZpZWxkLmtleS5wcm9wZXJ0aWVzLmFkZChuZXcgSWNvblByb3BlcnR5KCdzdHJpa2V0aHJvdWdoJykpO1xuXHRmaWVsZC52YWx1ZS5wcm9wZXJ0aWVzLmFkZChuZXcgQm9vbEVkaXRvclByb3BlcnR5KCkpO1xuXHRmaWVsZC52YWx1ZS5lZGl0b3IudmFsdWUuZmVlZChlZGl0b3Iuc3RyaWtlKTtcblx0cC5hdHRhY2hUbygkZG9jX2FydGljbGUpO1xuXG5cblx0bGV0IHNjaGVtYSAgPSBuZXcgU2NoZW1hKCksXG5cdFx0dmlldyAgICA9IG5ldyBNb2RlbFZpZXcoKSxcblx0XHRtb2RlbCAgID0gbmV3IE1vZGVsKCksXG5cdFx0d3JhcHBlciA9IG5ldyBTY2hlbWFXcmFwcGVyKHNjaGVtYSwgdmlldyk7XG5cblx0dmlldy5hdHRhY2hUbygkbW9kZWxfYXJ0aWNsZSk7XG5cblx0c2NoZW1hLnN0cmVhbS5mZWVkKG1vZGVsLnNjaGVtYSk7XG5cdHZpZXcuZGF0YS5mZWVkKG1vZGVsLmRhdGEpO1xuXG5cdG1vZGVsLnN0cmVhbS5tYXAoSlNPTi5zdHJpbmdpZnkpLmxvZygnbW9kZWwnKTtcblxuXHRzY2hlbWEucmVzZXQoW1xuXHRcdHtuYW1lOiduYW1lJyx0eXBlOidTdHJpbmcnfSxcblx0XHR7bmFtZTonbGFzdG5hbWUnLHR5cGU6J1N0cmluZyd9LFxuXHRcdHtuYW1lOidhbGl2ZScsdHlwZTonQm9vbCd9XG5cdF0pO1xuXG5cdC8qXG5cdGxldCBmaWVsZCA9IG5ldyBGaWVsZCgpO1xuXG5cdGZpZWxkLmF0dGFjaFRvKCRtb2RlbF9hcnRpY2xlKTtcblx0ZmllbGQua2V5LnByb3BlcnRpZXMuYWRkKG5ldyBUZXh0UHJvcGVydHkoJ3Zhcm5hbWUnKSk7XG5cdGZpZWxkLmtleS5wcm9wZXJ0aWVzLmFkZChuZXcgVGV4dEVkaXRvclByb3BlcnR5KCkpO1xuXHRmaWVsZC52YWx1ZS5wcm9wZXJ0aWVzLmFkZChuZXcgVGV4dFByb3BlcnR5KCkpO1xuXHRmaWVsZC52YWx1ZS5wcm9wZXJ0aWVzLmFkZChuZXcgVGV4dEVkaXRvclByb3BlcnR5KCkpO1xuXHRmaWVsZC52YWx1ZS5lZGl0b3IudmFsdWUuZmVlZChmaWVsZC52YWx1ZS50ZXh0KTtcblx0Ki9cblxuXG5cblx0Ly9sZXQgY29weSA9IG5ldyBGcmFnbWVudCgpO1xuXHQvL2VkaXRvci5wcm9wZXJ0aWVzLmNvcHlUbyhjb3B5KTtcblx0Ly9jb3B5LmF0dGFjaFRvKGNvbnRhaW5lcik7XG5cblx0Ly8gdGVzdCBjYW5jZWxcblx0Ly8gbGV0IHMgPSBTdHJlYW0uc2VxdWVuY2UoWzEsMiwzXSwgMjAwLCB0cnVlKS5jYW5jZWxPbihTdHJlYW0uZGVsYXkoNTAwMCkpO1xuXHQvLyBzLmxvZyhcIlNcIik7XG5cdC8vIGxldCBtID0gcy5tYXAoKHYpID0+IC12ICogOSkuY2FuY2VsT24oU3RyZWFtLmRlbGF5KDI1MDApKTtcblx0Ly8gbS5sb2coXCJNXCIpO1xuXG59KTsiLCIvKipcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEF1dGhvcjogICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogTGljZW5zZTogIE1JVFxuICpcbiAqIGBucG0gaW5zdGFsbCBidWZmZXJgXG4gKi9cblxudmFyIGJhc2U2NCA9IHJlcXVpcmUoJ2Jhc2U2NC1qcycpXG52YXIgaWVlZTc1NCA9IHJlcXVpcmUoJ2llZWU3NTQnKVxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTJcblxuLyoqXG4gKiBJZiBgQnVmZmVyLl91c2VUeXBlZEFycmF5c2A6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChjb21wYXRpYmxlIGRvd24gdG8gSUU2KVxuICovXG5CdWZmZXIuX3VzZVR5cGVkQXJyYXlzID0gKGZ1bmN0aW9uICgpIHtcbiAgLy8gRGV0ZWN0IGlmIGJyb3dzZXIgc3VwcG9ydHMgVHlwZWQgQXJyYXlzLiBTdXBwb3J0ZWQgYnJvd3NlcnMgYXJlIElFIDEwKywgRmlyZWZveCA0KyxcbiAgLy8gQ2hyb21lIDcrLCBTYWZhcmkgNS4xKywgT3BlcmEgMTEuNissIGlPUyA0LjIrLiBJZiB0aGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGFkZGluZ1xuICAvLyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsIHRoZW4gdGhhdCdzIHRoZSBzYW1lIGFzIG5vIGBVaW50OEFycmF5YCBzdXBwb3J0XG4gIC8vIGJlY2F1c2Ugd2UgbmVlZCB0byBiZSBhYmxlIHRvIGFkZCBhbGwgdGhlIG5vZGUgQnVmZmVyIEFQSSBtZXRob2RzLiBUaGlzIGlzIGFuIGlzc3VlXG4gIC8vIGluIEZpcmVmb3ggNC0yOS4gTm93IGZpeGVkOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzhcbiAgdHJ5IHtcbiAgICB2YXIgYnVmID0gbmV3IEFycmF5QnVmZmVyKDApXG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KGJ1ZilcbiAgICBhcnIuZm9vID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfVxuICAgIHJldHVybiA0MiA9PT0gYXJyLmZvbygpICYmXG4gICAgICAgIHR5cGVvZiBhcnIuc3ViYXJyYXkgPT09ICdmdW5jdGlvbicgLy8gQ2hyb21lIDktMTAgbGFjayBgc3ViYXJyYXlgXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufSkoKVxuXG4vKipcbiAqIENsYXNzOiBCdWZmZXJcbiAqID09PT09PT09PT09PT1cbiAqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGFyZSBhdWdtZW50ZWRcbiAqIHdpdGggZnVuY3Rpb24gcHJvcGVydGllcyBmb3IgYWxsIHRoZSBub2RlIGBCdWZmZXJgIEFQSSBmdW5jdGlvbnMuIFdlIHVzZVxuICogYFVpbnQ4QXJyYXlgIHNvIHRoYXQgc3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXQgcmV0dXJuc1xuICogYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogQnkgYXVnbWVudGluZyB0aGUgaW5zdGFuY2VzLCB3ZSBjYW4gYXZvaWQgbW9kaWZ5aW5nIHRoZSBgVWludDhBcnJheWBcbiAqIHByb3RvdHlwZS5cbiAqL1xuZnVuY3Rpb24gQnVmZmVyIChzdWJqZWN0LCBlbmNvZGluZywgbm9aZXJvKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXIpKVxuICAgIHJldHVybiBuZXcgQnVmZmVyKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pXG5cbiAgdmFyIHR5cGUgPSB0eXBlb2Ygc3ViamVjdFxuXG4gIC8vIFdvcmthcm91bmQ6IG5vZGUncyBiYXNlNjQgaW1wbGVtZW50YXRpb24gYWxsb3dzIGZvciBub24tcGFkZGVkIHN0cmluZ3NcbiAgLy8gd2hpbGUgYmFzZTY0LWpzIGRvZXMgbm90LlxuICBpZiAoZW5jb2RpbmcgPT09ICdiYXNlNjQnICYmIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgc3ViamVjdCA9IHN0cmluZ3RyaW0oc3ViamVjdClcbiAgICB3aGlsZSAoc3ViamVjdC5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgICBzdWJqZWN0ID0gc3ViamVjdCArICc9J1xuICAgIH1cbiAgfVxuXG4gIC8vIEZpbmQgdGhlIGxlbmd0aFxuICB2YXIgbGVuZ3RoXG4gIGlmICh0eXBlID09PSAnbnVtYmVyJylcbiAgICBsZW5ndGggPSBjb2VyY2Uoc3ViamVjdClcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpXG4gICAgbGVuZ3RoID0gQnVmZmVyLmJ5dGVMZW5ndGgoc3ViamVjdCwgZW5jb2RpbmcpXG4gIGVsc2UgaWYgKHR5cGUgPT09ICdvYmplY3QnKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0Lmxlbmd0aCkgLy8gYXNzdW1lIHRoYXQgb2JqZWN0IGlzIGFycmF5LWxpa2VcbiAgZWxzZVxuICAgIHRocm93IG5ldyBFcnJvcignRmlyc3QgYXJndW1lbnQgbmVlZHMgdG8gYmUgYSBudW1iZXIsIGFycmF5IG9yIHN0cmluZy4nKVxuXG4gIHZhciBidWZcbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAvLyBQcmVmZXJyZWQ6IFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgYnVmID0gQnVmZmVyLl9hdWdtZW50KG5ldyBVaW50OEFycmF5KGxlbmd0aCkpXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBUSElTIGluc3RhbmNlIG9mIEJ1ZmZlciAoY3JlYXRlZCBieSBgbmV3YClcbiAgICBidWYgPSB0aGlzXG4gICAgYnVmLmxlbmd0aCA9IGxlbmd0aFxuICAgIGJ1Zi5faXNCdWZmZXIgPSB0cnVlXG4gIH1cblxuICB2YXIgaVxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cyAmJiB0eXBlb2Ygc3ViamVjdC5ieXRlTGVuZ3RoID09PSAnbnVtYmVyJykge1xuICAgIC8vIFNwZWVkIG9wdGltaXphdGlvbiAtLSB1c2Ugc2V0IGlmIHdlJ3JlIGNvcHlpbmcgZnJvbSBhIHR5cGVkIGFycmF5XG4gICAgYnVmLl9zZXQoc3ViamVjdClcbiAgfSBlbHNlIGlmIChpc0FycmF5aXNoKHN1YmplY3QpKSB7XG4gICAgLy8gVHJlYXQgYXJyYXktaXNoIG9iamVjdHMgYXMgYSBieXRlIGFycmF5XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpKVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0LnJlYWRVSW50OChpKVxuICAgICAgZWxzZVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0W2ldXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgYnVmLndyaXRlKHN1YmplY3QsIDAsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdudW1iZXInICYmICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmICFub1plcm8pIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ1ZltpXSA9IDBcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmXG59XG5cbi8vIFNUQVRJQyBNRVRIT0RTXG4vLyA9PT09PT09PT09PT09PVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAncmF3JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gKGIpIHtcbiAgcmV0dXJuICEhKGIgIT09IG51bGwgJiYgYiAhPT0gdW5kZWZpbmVkICYmIGIuX2lzQnVmZmVyKVxufVxuXG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGZ1bmN0aW9uIChzdHIsIGVuY29kaW5nKSB7XG4gIHZhciByZXRcbiAgc3RyID0gc3RyICsgJydcbiAgc3dpdGNoIChlbmNvZGluZyB8fCAndXRmOCcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAvIDJcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gdXRmOFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAncmF3JzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IGJhc2U2NFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGggKiAyXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIChsaXN0LCB0b3RhbExlbmd0aCkge1xuICBhc3NlcnQoaXNBcnJheShsaXN0KSwgJ1VzYWdlOiBCdWZmZXIuY29uY2F0KGxpc3QsIFt0b3RhbExlbmd0aF0pXFxuJyArXG4gICAgICAnbGlzdCBzaG91bGQgYmUgYW4gQXJyYXkuJylcblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcigwKVxuICB9IGVsc2UgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGxpc3RbMF1cbiAgfVxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdG90YWxMZW5ndGggIT09ICdudW1iZXInKSB7XG4gICAgdG90YWxMZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRvdGFsTGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZiA9IG5ldyBCdWZmZXIodG90YWxMZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldXG4gICAgaXRlbS5jb3B5KGJ1ZiwgcG9zKVxuICAgIHBvcyArPSBpdGVtLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZcbn1cblxuLy8gQlVGRkVSIElOU1RBTkNFIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIF9oZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGFzc2VydChzdHJMZW4gJSAyID09PSAwLCAnSW52YWxpZCBoZXggc3RyaW5nJylcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGJ5dGUgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgYXNzZXJ0KCFpc05hTihieXRlKSwgJ0ludmFsaWQgaGV4IHN0cmluZycpXG4gICAgYnVmW29mZnNldCArIGldID0gYnl0ZVxuICB9XG4gIEJ1ZmZlci5fY2hhcnNXcml0dGVuID0gaSAqIDJcbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gX3V0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBfYXNjaWlXcml0ZShidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gU3VwcG9ydCBib3RoIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZylcbiAgLy8gYW5kIHRoZSBsZWdhY3kgKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIGlmICghaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgfSBlbHNlIHsgIC8vIGxlZ2FjeVxuICAgIHZhciBzd2FwID0gZW5jb2RpbmdcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIG9mZnNldCA9IGxlbmd0aFxuICAgIGxlbmd0aCA9IHN3YXBcbiAgfVxuXG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG4gIHN0YXJ0ID0gTnVtYmVyKHN0YXJ0KSB8fCAwXG4gIGVuZCA9IChlbmQgIT09IHVuZGVmaW5lZClcbiAgICA/IE51bWJlcihlbmQpXG4gICAgOiBlbmQgPSBzZWxmLmxlbmd0aFxuXG4gIC8vIEZhc3RwYXRoIGVtcHR5IHN0cmluZ3NcbiAgaWYgKGVuZCA9PT0gc3RhcnQpXG4gICAgcmV0dXJuICcnXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uICh0YXJnZXQsIHRhcmdldF9zdGFydCwgc3RhcnQsIGVuZCkge1xuICB2YXIgc291cmNlID0gdGhpc1xuXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICghdGFyZ2V0X3N0YXJ0KSB0YXJnZXRfc3RhcnQgPSAwXG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgc291cmNlLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBhc3NlcnQoZW5kID49IHN0YXJ0LCAnc291cmNlRW5kIDwgc291cmNlU3RhcnQnKVxuICBhc3NlcnQodGFyZ2V0X3N0YXJ0ID49IDAgJiYgdGFyZ2V0X3N0YXJ0IDwgdGFyZ2V0Lmxlbmd0aCxcbiAgICAgICd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KHN0YXJ0ID49IDAgJiYgc3RhcnQgPCBzb3VyY2UubGVuZ3RoLCAnc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gc291cmNlLmxlbmd0aCwgJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpXG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgPCBlbmQgLSBzdGFydClcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0ICsgc3RhcnRcblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcblxuICBpZiAobGVuIDwgMTAwIHx8ICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0X3N0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICB9IGVsc2Uge1xuICAgIHRhcmdldC5fc2V0KHRoaXMuc3ViYXJyYXkoc3RhcnQsIHN0YXJ0ICsgbGVuKSwgdGFyZ2V0X3N0YXJ0KVxuICB9XG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gX3V0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXMgPSAnJ1xuICB2YXIgdG1wID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgaWYgKGJ1ZltpXSA8PSAweDdGKSB7XG4gICAgICByZXMgKz0gZGVjb2RlVXRmOENoYXIodG1wKSArIFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICAgICAgdG1wID0gJydcbiAgICB9IGVsc2Uge1xuICAgICAgdG1wICs9ICclJyArIGJ1ZltpXS50b1N0cmluZygxNilcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzICsgZGVjb2RlVXRmOENoYXIodG1wKVxufVxuXG5mdW5jdGlvbiBfYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspXG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHJldHVybiBfYXNjaWlTbGljZShidWYsIHN0YXJ0LCBlbmQpXG59XG5cbmZ1bmN0aW9uIF9oZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIF91dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIGJ5dGVzW2krMV0gKiAyNTYpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gY2xhbXAoc3RhcnQsIGxlbiwgMClcbiAgZW5kID0gY2xhbXAoZW5kLCBsZW4sIGxlbilcblxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIHJldHVybiBCdWZmZXIuX2F1Z21lbnQodGhpcy5zdWJhcnJheShzdGFydCwgZW5kKSlcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xpY2VMZW4gPSBlbmQgLSBzdGFydFxuICAgIHZhciBuZXdCdWYgPSBuZXcgQnVmZmVyKHNsaWNlTGVuLCB1bmRlZmluZWQsIHRydWUpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZUxlbjsgaSsrKSB7XG4gICAgICBuZXdCdWZbaV0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gICAgcmV0dXJuIG5ld0J1ZlxuICB9XG59XG5cbi8vIGBnZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5nZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLnJlYWRVSW50OChvZmZzZXQpXG59XG5cbi8vIGBzZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uICh2LCBvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5zZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLndyaXRlVUludDgodiwgb2Zmc2V0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgfSBlbHNlIHtcbiAgICB2YWwgPSBidWZbb2Zmc2V0XSA8PCA4XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRVSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsXG4gIGlmIChsaXR0bGVFbmRpYW4pIHtcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCA9IGJ1ZltvZmZzZXQgKyAyXSA8PCAxNlxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXSA8PCA4XG4gICAgdmFsIHw9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDMgPCBsZW4pXG4gICAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldCArIDNdIDw8IDI0ID4+PiAwKVxuICB9IGVsc2Uge1xuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDFdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDIgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDJdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgM11cbiAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldF0gPDwgMjQgPj4+IDApXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgdmFyIG5lZyA9IHRoaXNbb2Zmc2V0XSAmIDB4ODBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MTYgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MTYoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEludDMyIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbCA9IF9yZWFkVUludDMyKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIHRydWUpXG4gIHZhciBuZWcgPSB2YWwgJiAweDgwMDAwMDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmZmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEZsb2F0IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRmxvYXQodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRG91YmxlIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZilcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpIHJldHVyblxuXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgMik7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgJiAoMHhmZiA8PCAoOCAqIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpKSkpID4+PlxuICAgICAgICAgICAgKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkgKiA4XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmZmZmZmKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihsZW4gLSBvZmZzZXQsIDQpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID1cbiAgICAgICAgKHZhbHVlID4+PiAobGl0dGxlRW5kaWFuID8gaSA6IDMgLSBpKSAqIDgpICYgMHhmZlxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmLCAtMHg4MClcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgdGhpcy53cml0ZVVJbnQ4KHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgdGhpcy53cml0ZVVJbnQ4KDB4ZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZiwgLTB4ODAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQxNihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MTYoYnVmLCAweGZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICBfd3JpdGVVSW50MzIoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgX3dyaXRlVUludDMyKGJ1ZiwgMHhmZmZmZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgNyA8IGJ1Zi5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gZmlsbCh2YWx1ZSwgc3RhcnQ9MCwgZW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiAodmFsdWUsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCF2YWx1ZSkgdmFsdWUgPSAwXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCkgZW5kID0gdGhpcy5sZW5ndGhcblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHZhbHVlID0gdmFsdWUuY2hhckNvZGVBdCgwKVxuICB9XG5cbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKHZhbHVlKSwgJ3ZhbHVlIGlzIG5vdCBhIG51bWJlcicpXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdlbmQgPCBzdGFydCcpXG5cbiAgLy8gRmlsbCAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHRoaXMubGVuZ3RoLCAnc3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gdGhpcy5sZW5ndGgsICdlbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICB0aGlzW2ldID0gdmFsdWVcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBvdXQgPSBbXVxuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIG91dFtpXSA9IHRvSGV4KHRoaXNbaV0pXG4gICAgaWYgKGkgPT09IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMpIHtcbiAgICAgIG91dFtpICsgMV0gPSAnLi4uJ1xuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBvdXQuam9pbignICcpICsgJz4nXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBgQXJyYXlCdWZmZXJgIHdpdGggdGhlICpjb3BpZWQqIG1lbW9yeSBvZiB0aGUgYnVmZmVyIGluc3RhbmNlLlxuICogQWRkZWQgaW4gTm9kZSAwLjEyLiBPbmx5IGF2YWlsYWJsZSBpbiBicm93c2VycyB0aGF0IHN1cHBvcnQgQXJyYXlCdWZmZXIuXG4gKi9cbkJ1ZmZlci5wcm90b3R5cGUudG9BcnJheUJ1ZmZlciA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgICByZXR1cm4gKG5ldyBCdWZmZXIodGhpcykpLmJ1ZmZlclxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYnVmID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5sZW5ndGgpXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYnVmLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKVxuICAgICAgICBidWZbaV0gPSB0aGlzW2ldXG4gICAgICByZXR1cm4gYnVmLmJ1ZmZlclxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0J1ZmZlci50b0FycmF5QnVmZmVyIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyJylcbiAgfVxufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbnZhciBCUCA9IEJ1ZmZlci5wcm90b3R5cGVcblxuLyoqXG4gKiBBdWdtZW50IGEgVWludDhBcnJheSAqaW5zdGFuY2UqIChub3QgdGhlIFVpbnQ4QXJyYXkgY2xhc3MhKSB3aXRoIEJ1ZmZlciBtZXRob2RzXG4gKi9cbkJ1ZmZlci5fYXVnbWVudCA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgYXJyLl9pc0J1ZmZlciA9IHRydWVcblxuICAvLyBzYXZlIHJlZmVyZW5jZSB0byBvcmlnaW5hbCBVaW50OEFycmF5IGdldC9zZXQgbWV0aG9kcyBiZWZvcmUgb3ZlcndyaXRpbmdcbiAgYXJyLl9nZXQgPSBhcnIuZ2V0XG4gIGFyci5fc2V0ID0gYXJyLnNldFxuXG4gIC8vIGRlcHJlY2F0ZWQsIHdpbGwgYmUgcmVtb3ZlZCBpbiBub2RlIDAuMTMrXG4gIGFyci5nZXQgPSBCUC5nZXRcbiAgYXJyLnNldCA9IEJQLnNldFxuXG4gIGFyci53cml0ZSA9IEJQLndyaXRlXG4gIGFyci50b1N0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0xvY2FsZVN0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0pTT04gPSBCUC50b0pTT05cbiAgYXJyLmNvcHkgPSBCUC5jb3B5XG4gIGFyci5zbGljZSA9IEJQLnNsaWNlXG4gIGFyci5yZWFkVUludDggPSBCUC5yZWFkVUludDhcbiAgYXJyLnJlYWRVSW50MTZMRSA9IEJQLnJlYWRVSW50MTZMRVxuICBhcnIucmVhZFVJbnQxNkJFID0gQlAucmVhZFVJbnQxNkJFXG4gIGFyci5yZWFkVUludDMyTEUgPSBCUC5yZWFkVUludDMyTEVcbiAgYXJyLnJlYWRVSW50MzJCRSA9IEJQLnJlYWRVSW50MzJCRVxuICBhcnIucmVhZEludDggPSBCUC5yZWFkSW50OFxuICBhcnIucmVhZEludDE2TEUgPSBCUC5yZWFkSW50MTZMRVxuICBhcnIucmVhZEludDE2QkUgPSBCUC5yZWFkSW50MTZCRVxuICBhcnIucmVhZEludDMyTEUgPSBCUC5yZWFkSW50MzJMRVxuICBhcnIucmVhZEludDMyQkUgPSBCUC5yZWFkSW50MzJCRVxuICBhcnIucmVhZEZsb2F0TEUgPSBCUC5yZWFkRmxvYXRMRVxuICBhcnIucmVhZEZsb2F0QkUgPSBCUC5yZWFkRmxvYXRCRVxuICBhcnIucmVhZERvdWJsZUxFID0gQlAucmVhZERvdWJsZUxFXG4gIGFyci5yZWFkRG91YmxlQkUgPSBCUC5yZWFkRG91YmxlQkVcbiAgYXJyLndyaXRlVUludDggPSBCUC53cml0ZVVJbnQ4XG4gIGFyci53cml0ZVVJbnQxNkxFID0gQlAud3JpdGVVSW50MTZMRVxuICBhcnIud3JpdGVVSW50MTZCRSA9IEJQLndyaXRlVUludDE2QkVcbiAgYXJyLndyaXRlVUludDMyTEUgPSBCUC53cml0ZVVJbnQzMkxFXG4gIGFyci53cml0ZVVJbnQzMkJFID0gQlAud3JpdGVVSW50MzJCRVxuICBhcnIud3JpdGVJbnQ4ID0gQlAud3JpdGVJbnQ4XG4gIGFyci53cml0ZUludDE2TEUgPSBCUC53cml0ZUludDE2TEVcbiAgYXJyLndyaXRlSW50MTZCRSA9IEJQLndyaXRlSW50MTZCRVxuICBhcnIud3JpdGVJbnQzMkxFID0gQlAud3JpdGVJbnQzMkxFXG4gIGFyci53cml0ZUludDMyQkUgPSBCUC53cml0ZUludDMyQkVcbiAgYXJyLndyaXRlRmxvYXRMRSA9IEJQLndyaXRlRmxvYXRMRVxuICBhcnIud3JpdGVGbG9hdEJFID0gQlAud3JpdGVGbG9hdEJFXG4gIGFyci53cml0ZURvdWJsZUxFID0gQlAud3JpdGVEb3VibGVMRVxuICBhcnIud3JpdGVEb3VibGVCRSA9IEJQLndyaXRlRG91YmxlQkVcbiAgYXJyLmZpbGwgPSBCUC5maWxsXG4gIGFyci5pbnNwZWN0ID0gQlAuaW5zcGVjdFxuICBhcnIudG9BcnJheUJ1ZmZlciA9IEJQLnRvQXJyYXlCdWZmZXJcblxuICByZXR1cm4gYXJyXG59XG5cbi8vIHNsaWNlKHN0YXJ0LCBlbmQpXG5mdW5jdGlvbiBjbGFtcCAoaW5kZXgsIGxlbiwgZGVmYXVsdFZhbHVlKSB7XG4gIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSByZXR1cm4gZGVmYXVsdFZhbHVlXG4gIGluZGV4ID0gfn5pbmRleDsgIC8vIENvZXJjZSB0byBpbnRlZ2VyLlxuICBpZiAoaW5kZXggPj0gbGVuKSByZXR1cm4gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgaW5kZXggKz0gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gY29lcmNlIChsZW5ndGgpIHtcbiAgLy8gQ29lcmNlIGxlbmd0aCB0byBhIG51bWJlciAocG9zc2libHkgTmFOKSwgcm91bmQgdXBcbiAgLy8gaW4gY2FzZSBpdCdzIGZyYWN0aW9uYWwgKGUuZy4gMTIzLjQ1NikgdGhlbiBkbyBhXG4gIC8vIGRvdWJsZSBuZWdhdGUgdG8gY29lcmNlIGEgTmFOIHRvIDAuIEVhc3ksIHJpZ2h0P1xuICBsZW5ndGggPSB+fk1hdGguY2VpbCgrbGVuZ3RoKVxuICByZXR1cm4gbGVuZ3RoIDwgMCA/IDAgOiBsZW5ndGhcbn1cblxuZnVuY3Rpb24gaXNBcnJheSAoc3ViamVjdCkge1xuICByZXR1cm4gKEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHN1YmplY3QpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN1YmplY3QpID09PSAnW29iamVjdCBBcnJheV0nXG4gIH0pKHN1YmplY3QpXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXlpc2ggKHN1YmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXkoc3ViamVjdCkgfHwgQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpIHx8XG4gICAgICBzdWJqZWN0ICYmIHR5cGVvZiBzdWJqZWN0ID09PSAnb2JqZWN0JyAmJlxuICAgICAgdHlwZW9mIHN1YmplY3QubGVuZ3RoID09PSAnbnVtYmVyJ1xufVxuXG5mdW5jdGlvbiB0b0hleCAobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNilcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGIgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGlmIChiIDw9IDB4N0YpXG4gICAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSlcbiAgICBlbHNlIHtcbiAgICAgIHZhciBzdGFydCA9IGlcbiAgICAgIGlmIChiID49IDB4RDgwMCAmJiBiIDw9IDB4REZGRikgaSsrXG4gICAgICB2YXIgaCA9IGVuY29kZVVSSUNvbXBvbmVudChzdHIuc2xpY2Uoc3RhcnQsIGkrMSkpLnN1YnN0cigxKS5zcGxpdCgnJScpXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGgubGVuZ3RoOyBqKyspXG4gICAgICAgIGJ5dGVBcnJheS5wdXNoKHBhcnNlSW50KGhbal0sIDE2KSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoc3RyKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIHBvc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKVxuICAgICAgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBkZWNvZGVVdGY4Q2hhciAoc3RyKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChzdHIpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4RkZGRCkgLy8gVVRGIDggaW52YWxpZCBjaGFyXG4gIH1cbn1cblxuLypcbiAqIFdlIGhhdmUgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIHZhbHVlIGlzIGEgdmFsaWQgaW50ZWdlci4gVGhpcyBtZWFucyB0aGF0IGl0XG4gKiBpcyBub24tbmVnYXRpdmUuIEl0IGhhcyBubyBmcmFjdGlvbmFsIGNvbXBvbmVudCBhbmQgdGhhdCBpdCBkb2VzIG5vdFxuICogZXhjZWVkIHRoZSBtYXhpbXVtIGFsbG93ZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHZlcmlmdWludCAodmFsdWUsIG1heCkge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPj0gMCwgJ3NwZWNpZmllZCBhIG5lZ2F0aXZlIHZhbHVlIGZvciB3cml0aW5nIGFuIHVuc2lnbmVkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGlzIGxhcmdlciB0aGFuIG1heGltdW0gdmFsdWUgZm9yIHR5cGUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZnNpbnQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZklFRUU3NTQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxufVxuXG5mdW5jdGlvbiBhc3NlcnQgKHRlc3QsIG1lc3NhZ2UpIHtcbiAgaWYgKCF0ZXN0KSB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSB8fCAnRmFpbGVkIGFzc2VydGlvbicpXG59XG4iLCJ2YXIgbG9va3VwID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nO1xuXG47KGZ1bmN0aW9uIChleHBvcnRzKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuICB2YXIgQXJyID0gKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJylcbiAgICA/IFVpbnQ4QXJyYXlcbiAgICA6IEFycmF5XG5cblx0dmFyIFpFUk8gICA9ICcwJy5jaGFyQ29kZUF0KDApXG5cdHZhciBQTFVTICAgPSAnKycuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0ggID0gJy8nLmNoYXJDb2RlQXQoMClcblx0dmFyIE5VTUJFUiA9ICcwJy5jaGFyQ29kZUF0KDApXG5cdHZhciBMT1dFUiAgPSAnYScuY2hhckNvZGVBdCgwKVxuXHR2YXIgVVBQRVIgID0gJ0EnLmNoYXJDb2RlQXQoMClcblxuXHRmdW5jdGlvbiBkZWNvZGUgKGVsdCkge1xuXHRcdHZhciBjb2RlID0gZWx0LmNoYXJDb2RlQXQoMClcblx0XHRpZiAoY29kZSA9PT0gUExVUylcblx0XHRcdHJldHVybiA2MiAvLyAnKydcblx0XHRpZiAoY29kZSA9PT0gU0xBU0gpXG5cdFx0XHRyZXR1cm4gNjMgLy8gJy8nXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIpXG5cdFx0XHRyZXR1cm4gLTEgLy9ubyBtYXRjaFxuXHRcdGlmIChjb2RlIDwgTlVNQkVSICsgMTApXG5cdFx0XHRyZXR1cm4gY29kZSAtIE5VTUJFUiArIDI2ICsgMjZcblx0XHRpZiAoY29kZSA8IFVQUEVSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIFVQUEVSXG5cdFx0aWYgKGNvZGUgPCBMT1dFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBMT1dFUiArIDI2XG5cdH1cblxuXHRmdW5jdGlvbiBiNjRUb0J5dGVBcnJheSAoYjY0KSB7XG5cdFx0dmFyIGksIGosIGwsIHRtcCwgcGxhY2VIb2xkZXJzLCBhcnJcblxuXHRcdGlmIChiNjQubGVuZ3RoICUgNCA+IDApIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG5cdFx0fVxuXG5cdFx0Ly8gdGhlIG51bWJlciBvZiBlcXVhbCBzaWducyAocGxhY2UgaG9sZGVycylcblx0XHQvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XG5cdFx0Ly8gcmVwcmVzZW50IG9uZSBieXRlXG5cdFx0Ly8gaWYgdGhlcmUgaXMgb25seSBvbmUsIHRoZW4gdGhlIHRocmVlIGNoYXJhY3RlcnMgYmVmb3JlIGl0IHJlcHJlc2VudCAyIGJ5dGVzXG5cdFx0Ly8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxuXHRcdHZhciBsZW4gPSBiNjQubGVuZ3RoXG5cdFx0cGxhY2VIb2xkZXJzID0gJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDIpID8gMiA6ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAxKSA/IDEgOiAwXG5cblx0XHQvLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcblx0XHRhcnIgPSBuZXcgQXJyKGI2NC5sZW5ndGggKiAzIC8gNCAtIHBsYWNlSG9sZGVycylcblxuXHRcdC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcblx0XHRsID0gcGxhY2VIb2xkZXJzID4gMCA/IGI2NC5sZW5ndGggLSA0IDogYjY0Lmxlbmd0aFxuXG5cdFx0dmFyIEwgPSAwXG5cblx0XHRmdW5jdGlvbiBwdXNoICh2KSB7XG5cdFx0XHRhcnJbTCsrXSA9IHZcblx0XHR9XG5cblx0XHRmb3IgKGkgPSAwLCBqID0gMDsgaSA8IGw7IGkgKz0gNCwgaiArPSAzKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDE4KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDEyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpIDw8IDYpIHwgZGVjb2RlKGI2NC5jaGFyQXQoaSArIDMpKVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwMDApID4+IDE2KVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwKSA+PiA4KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdGlmIChwbGFjZUhvbGRlcnMgPT09IDIpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA+PiA0KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH0gZWxzZSBpZiAocGxhY2VIb2xkZXJzID09PSAxKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDEwKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDQpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPj4gMilcblx0XHRcdHB1c2goKHRtcCA+PiA4KSAmIDB4RkYpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFyclxuXHR9XG5cblx0ZnVuY3Rpb24gdWludDhUb0Jhc2U2NCAodWludDgpIHtcblx0XHR2YXIgaSxcblx0XHRcdGV4dHJhQnl0ZXMgPSB1aW50OC5sZW5ndGggJSAzLCAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuXHRcdFx0b3V0cHV0ID0gXCJcIixcblx0XHRcdHRlbXAsIGxlbmd0aFxuXG5cdFx0ZnVuY3Rpb24gZW5jb2RlIChudW0pIHtcblx0XHRcdHJldHVybiBsb29rdXAuY2hhckF0KG51bSlcblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuXHRcdFx0cmV0dXJuIGVuY29kZShudW0gPj4gMTggJiAweDNGKSArIGVuY29kZShudW0gPj4gMTIgJiAweDNGKSArIGVuY29kZShudW0gPj4gNiAmIDB4M0YpICsgZW5jb2RlKG51bSAmIDB4M0YpXG5cdFx0fVxuXG5cdFx0Ly8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuXHRcdGZvciAoaSA9IDAsIGxlbmd0aCA9IHVpbnQ4Lmxlbmd0aCAtIGV4dHJhQnl0ZXM7IGkgPCBsZW5ndGg7IGkgKz0gMykge1xuXHRcdFx0dGVtcCA9ICh1aW50OFtpXSA8PCAxNikgKyAodWludDhbaSArIDFdIDw8IDgpICsgKHVpbnQ4W2kgKyAyXSlcblx0XHRcdG91dHB1dCArPSB0cmlwbGV0VG9CYXNlNjQodGVtcClcblx0XHR9XG5cblx0XHQvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG5cdFx0c3dpdGNoIChleHRyYUJ5dGVzKSB7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdHRlbXAgPSB1aW50OFt1aW50OC5sZW5ndGggLSAxXVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPT0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdHRlbXAgPSAodWludDhbdWludDgubGVuZ3RoIC0gMl0gPDwgOCkgKyAodWludDhbdWludDgubGVuZ3RoIC0gMV0pXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAxMClcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA+PiA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgMikgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0fVxuXG5cdFx0cmV0dXJuIG91dHB1dFxuXHR9XG5cblx0bW9kdWxlLmV4cG9ydHMudG9CeXRlQXJyYXkgPSBiNjRUb0J5dGVBcnJheVxuXHRtb2R1bGUuZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gdWludDhUb0Jhc2U2NFxufSgpKVxuIiwiZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24oYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSxcbiAgICAgIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDEsXG4gICAgICBlTWF4ID0gKDEgPDwgZUxlbikgLSAxLFxuICAgICAgZUJpYXMgPSBlTWF4ID4+IDEsXG4gICAgICBuQml0cyA9IC03LFxuICAgICAgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwLFxuICAgICAgZCA9IGlzTEUgPyAtMSA6IDEsXG4gICAgICBzID0gYnVmZmVyW29mZnNldCArIGldO1xuXG4gIGkgKz0gZDtcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKTtcbiAgcyA+Pj0gKC1uQml0cyk7XG4gIG5CaXRzICs9IGVMZW47XG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSBlICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpO1xuXG4gIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpO1xuICBlID4+PSAoLW5CaXRzKTtcbiAgbkJpdHMgKz0gbUxlbjtcbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IG0gKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCk7XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzO1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSk7XG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKTtcbiAgICBlID0gZSAtIGVCaWFzO1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pO1xufTtcblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjLFxuICAgICAgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMSxcbiAgICAgIGVNYXggPSAoMSA8PCBlTGVuKSAtIDEsXG4gICAgICBlQmlhcyA9IGVNYXggPj4gMSxcbiAgICAgIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKSxcbiAgICAgIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKSxcbiAgICAgIGQgPSBpc0xFID8gMSA6IC0xLFxuICAgICAgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMDtcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKTtcblxuICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMDtcbiAgICBlID0gZU1heDtcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMik7XG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tO1xuICAgICAgYyAqPSAyO1xuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gYztcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpO1xuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrKztcbiAgICAgIGMgLz0gMjtcbiAgICB9XG5cbiAgICBpZiAoZSArIGVCaWFzID49IGVNYXgpIHtcbiAgICAgIG0gPSAwO1xuICAgICAgZSA9IGVNYXg7XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pO1xuICAgICAgZSA9IGUgKyBlQmlhcztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pO1xuICAgICAgZSA9IDA7XG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCk7XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbTtcbiAgZUxlbiArPSBtTGVuO1xuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpO1xuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyODtcbn07XG4iLCJ2YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xudmFyIGludFNpemUgPSA0O1xudmFyIHplcm9CdWZmZXIgPSBuZXcgQnVmZmVyKGludFNpemUpOyB6ZXJvQnVmZmVyLmZpbGwoMCk7XG52YXIgY2hyc3ogPSA4O1xuXG5mdW5jdGlvbiB0b0FycmF5KGJ1ZiwgYmlnRW5kaWFuKSB7XG4gIGlmICgoYnVmLmxlbmd0aCAlIGludFNpemUpICE9PSAwKSB7XG4gICAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGggKyAoaW50U2l6ZSAtIChidWYubGVuZ3RoICUgaW50U2l6ZSkpO1xuICAgIGJ1ZiA9IEJ1ZmZlci5jb25jYXQoW2J1ZiwgemVyb0J1ZmZlcl0sIGxlbik7XG4gIH1cblxuICB2YXIgYXJyID0gW107XG4gIHZhciBmbiA9IGJpZ0VuZGlhbiA/IGJ1Zi5yZWFkSW50MzJCRSA6IGJ1Zi5yZWFkSW50MzJMRTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBidWYubGVuZ3RoOyBpICs9IGludFNpemUpIHtcbiAgICBhcnIucHVzaChmbi5jYWxsKGJ1ZiwgaSkpO1xuICB9XG4gIHJldHVybiBhcnI7XG59XG5cbmZ1bmN0aW9uIHRvQnVmZmVyKGFyciwgc2l6ZSwgYmlnRW5kaWFuKSB7XG4gIHZhciBidWYgPSBuZXcgQnVmZmVyKHNpemUpO1xuICB2YXIgZm4gPSBiaWdFbmRpYW4gPyBidWYud3JpdGVJbnQzMkJFIDogYnVmLndyaXRlSW50MzJMRTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICBmbi5jYWxsKGJ1ZiwgYXJyW2ldLCBpICogNCwgdHJ1ZSk7XG4gIH1cbiAgcmV0dXJuIGJ1Zjtcbn1cblxuZnVuY3Rpb24gaGFzaChidWYsIGZuLCBoYXNoU2l6ZSwgYmlnRW5kaWFuKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIGJ1ZiA9IG5ldyBCdWZmZXIoYnVmKTtcbiAgdmFyIGFyciA9IGZuKHRvQXJyYXkoYnVmLCBiaWdFbmRpYW4pLCBidWYubGVuZ3RoICogY2hyc3opO1xuICByZXR1cm4gdG9CdWZmZXIoYXJyLCBoYXNoU2l6ZSwgYmlnRW5kaWFuKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IGhhc2g6IGhhc2ggfTtcbiIsInZhciBCdWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5CdWZmZXJcbnZhciBzaGEgPSByZXF1aXJlKCcuL3NoYScpXG52YXIgc2hhMjU2ID0gcmVxdWlyZSgnLi9zaGEyNTYnKVxudmFyIHJuZyA9IHJlcXVpcmUoJy4vcm5nJylcbnZhciBtZDUgPSByZXF1aXJlKCcuL21kNScpXG5cbnZhciBhbGdvcml0aG1zID0ge1xuICBzaGExOiBzaGEsXG4gIHNoYTI1Njogc2hhMjU2LFxuICBtZDU6IG1kNVxufVxuXG52YXIgYmxvY2tzaXplID0gNjRcbnZhciB6ZXJvQnVmZmVyID0gbmV3IEJ1ZmZlcihibG9ja3NpemUpOyB6ZXJvQnVmZmVyLmZpbGwoMClcbmZ1bmN0aW9uIGhtYWMoZm4sIGtleSwgZGF0YSkge1xuICBpZighQnVmZmVyLmlzQnVmZmVyKGtleSkpIGtleSA9IG5ldyBCdWZmZXIoa2V5KVxuICBpZighQnVmZmVyLmlzQnVmZmVyKGRhdGEpKSBkYXRhID0gbmV3IEJ1ZmZlcihkYXRhKVxuXG4gIGlmKGtleS5sZW5ndGggPiBibG9ja3NpemUpIHtcbiAgICBrZXkgPSBmbihrZXkpXG4gIH0gZWxzZSBpZihrZXkubGVuZ3RoIDwgYmxvY2tzaXplKSB7XG4gICAga2V5ID0gQnVmZmVyLmNvbmNhdChba2V5LCB6ZXJvQnVmZmVyXSwgYmxvY2tzaXplKVxuICB9XG5cbiAgdmFyIGlwYWQgPSBuZXcgQnVmZmVyKGJsb2Nrc2l6ZSksIG9wYWQgPSBuZXcgQnVmZmVyKGJsb2Nrc2l6ZSlcbiAgZm9yKHZhciBpID0gMDsgaSA8IGJsb2Nrc2l6ZTsgaSsrKSB7XG4gICAgaXBhZFtpXSA9IGtleVtpXSBeIDB4MzZcbiAgICBvcGFkW2ldID0ga2V5W2ldIF4gMHg1Q1xuICB9XG5cbiAgdmFyIGhhc2ggPSBmbihCdWZmZXIuY29uY2F0KFtpcGFkLCBkYXRhXSkpXG4gIHJldHVybiBmbihCdWZmZXIuY29uY2F0KFtvcGFkLCBoYXNoXSkpXG59XG5cbmZ1bmN0aW9uIGhhc2goYWxnLCBrZXkpIHtcbiAgYWxnID0gYWxnIHx8ICdzaGExJ1xuICB2YXIgZm4gPSBhbGdvcml0aG1zW2FsZ11cbiAgdmFyIGJ1ZnMgPSBbXVxuICB2YXIgbGVuZ3RoID0gMFxuICBpZighZm4pIGVycm9yKCdhbGdvcml0aG06JywgYWxnLCAnaXMgbm90IHlldCBzdXBwb3J0ZWQnKVxuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIGlmKCFCdWZmZXIuaXNCdWZmZXIoZGF0YSkpIGRhdGEgPSBuZXcgQnVmZmVyKGRhdGEpXG4gICAgICAgIFxuICAgICAgYnVmcy5wdXNoKGRhdGEpXG4gICAgICBsZW5ndGggKz0gZGF0YS5sZW5ndGhcbiAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcbiAgICBkaWdlc3Q6IGZ1bmN0aW9uIChlbmMpIHtcbiAgICAgIHZhciBidWYgPSBCdWZmZXIuY29uY2F0KGJ1ZnMpXG4gICAgICB2YXIgciA9IGtleSA/IGhtYWMoZm4sIGtleSwgYnVmKSA6IGZuKGJ1ZilcbiAgICAgIGJ1ZnMgPSBudWxsXG4gICAgICByZXR1cm4gZW5jID8gci50b1N0cmluZyhlbmMpIDogclxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBlcnJvciAoKSB7XG4gIHZhciBtID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpLmpvaW4oJyAnKVxuICB0aHJvdyBuZXcgRXJyb3IoW1xuICAgIG0sXG4gICAgJ3dlIGFjY2VwdCBwdWxsIHJlcXVlc3RzJyxcbiAgICAnaHR0cDovL2dpdGh1Yi5jb20vZG9taW5pY3RhcnIvY3J5cHRvLWJyb3dzZXJpZnknXG4gICAgXS5qb2luKCdcXG4nKSlcbn1cblxuZXhwb3J0cy5jcmVhdGVIYXNoID0gZnVuY3Rpb24gKGFsZykgeyByZXR1cm4gaGFzaChhbGcpIH1cbmV4cG9ydHMuY3JlYXRlSG1hYyA9IGZ1bmN0aW9uIChhbGcsIGtleSkgeyByZXR1cm4gaGFzaChhbGcsIGtleSkgfVxuZXhwb3J0cy5yYW5kb21CeXRlcyA9IGZ1bmN0aW9uKHNpemUsIGNhbGxiYWNrKSB7XG4gIGlmIChjYWxsYmFjayAmJiBjYWxsYmFjay5jYWxsKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNhbGxiYWNrLmNhbGwodGhpcywgdW5kZWZpbmVkLCBuZXcgQnVmZmVyKHJuZyhzaXplKSkpXG4gICAgfSBjYXRjaCAoZXJyKSB7IGNhbGxiYWNrKGVycikgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKHJuZyhzaXplKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBlYWNoKGEsIGYpIHtcbiAgZm9yKHZhciBpIGluIGEpXG4gICAgZihhW2ldLCBpKVxufVxuXG4vLyB0aGUgbGVhc3QgSSBjYW4gZG8gaXMgbWFrZSBlcnJvciBtZXNzYWdlcyBmb3IgdGhlIHJlc3Qgb2YgdGhlIG5vZGUuanMvY3J5cHRvIGFwaS5cbmVhY2goWydjcmVhdGVDcmVkZW50aWFscydcbiwgJ2NyZWF0ZUNpcGhlcidcbiwgJ2NyZWF0ZUNpcGhlcml2J1xuLCAnY3JlYXRlRGVjaXBoZXInXG4sICdjcmVhdGVEZWNpcGhlcml2J1xuLCAnY3JlYXRlU2lnbidcbiwgJ2NyZWF0ZVZlcmlmeSdcbiwgJ2NyZWF0ZURpZmZpZUhlbGxtYW4nXG4sICdwYmtkZjInXSwgZnVuY3Rpb24gKG5hbWUpIHtcbiAgZXhwb3J0c1tuYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICBlcnJvcignc29ycnksJywgbmFtZSwgJ2lzIG5vdCBpbXBsZW1lbnRlZCB5ZXQnKVxuICB9XG59KVxuIiwiLypcclxuICogQSBKYXZhU2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHRoZSBSU0EgRGF0YSBTZWN1cml0eSwgSW5jLiBNRDUgTWVzc2FnZVxyXG4gKiBEaWdlc3QgQWxnb3JpdGhtLCBhcyBkZWZpbmVkIGluIFJGQyAxMzIxLlxyXG4gKiBWZXJzaW9uIDIuMSBDb3B5cmlnaHQgKEMpIFBhdWwgSm9obnN0b24gMTk5OSAtIDIwMDIuXHJcbiAqIE90aGVyIGNvbnRyaWJ1dG9yczogR3JlZyBIb2x0LCBBbmRyZXcgS2VwZXJ0LCBZZG5hciwgTG9zdGluZXRcclxuICogRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIEJTRCBMaWNlbnNlXHJcbiAqIFNlZSBodHRwOi8vcGFqaG9tZS5vcmcudWsvY3J5cHQvbWQ1IGZvciBtb3JlIGluZm8uXHJcbiAqL1xyXG5cclxudmFyIGhlbHBlcnMgPSByZXF1aXJlKCcuL2hlbHBlcnMnKTtcclxuXHJcbi8qXHJcbiAqIFBlcmZvcm0gYSBzaW1wbGUgc2VsZi10ZXN0IHRvIHNlZSBpZiB0aGUgVk0gaXMgd29ya2luZ1xyXG4gKi9cclxuZnVuY3Rpb24gbWQ1X3ZtX3Rlc3QoKVxyXG57XHJcbiAgcmV0dXJuIGhleF9tZDUoXCJhYmNcIikgPT0gXCI5MDAxNTA5ODNjZDI0ZmIwZDY5NjNmN2QyOGUxN2Y3MlwiO1xyXG59XHJcblxyXG4vKlxyXG4gKiBDYWxjdWxhdGUgdGhlIE1ENSBvZiBhbiBhcnJheSBvZiBsaXR0bGUtZW5kaWFuIHdvcmRzLCBhbmQgYSBiaXQgbGVuZ3RoXHJcbiAqL1xyXG5mdW5jdGlvbiBjb3JlX21kNSh4LCBsZW4pXHJcbntcclxuICAvKiBhcHBlbmQgcGFkZGluZyAqL1xyXG4gIHhbbGVuID4+IDVdIHw9IDB4ODAgPDwgKChsZW4pICUgMzIpO1xyXG4gIHhbKCgobGVuICsgNjQpID4+PiA5KSA8PCA0KSArIDE0XSA9IGxlbjtcclxuXHJcbiAgdmFyIGEgPSAgMTczMjU4NDE5MztcclxuICB2YXIgYiA9IC0yNzE3MzM4Nzk7XHJcbiAgdmFyIGMgPSAtMTczMjU4NDE5NDtcclxuICB2YXIgZCA9ICAyNzE3MzM4Nzg7XHJcblxyXG4gIGZvcih2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSArPSAxNilcclxuICB7XHJcbiAgICB2YXIgb2xkYSA9IGE7XHJcbiAgICB2YXIgb2xkYiA9IGI7XHJcbiAgICB2YXIgb2xkYyA9IGM7XHJcbiAgICB2YXIgb2xkZCA9IGQ7XHJcblxyXG4gICAgYSA9IG1kNV9mZihhLCBiLCBjLCBkLCB4W2krIDBdLCA3ICwgLTY4MDg3NjkzNik7XHJcbiAgICBkID0gbWQ1X2ZmKGQsIGEsIGIsIGMsIHhbaSsgMV0sIDEyLCAtMzg5NTY0NTg2KTtcclxuICAgIGMgPSBtZDVfZmYoYywgZCwgYSwgYiwgeFtpKyAyXSwgMTcsICA2MDYxMDU4MTkpO1xyXG4gICAgYiA9IG1kNV9mZihiLCBjLCBkLCBhLCB4W2krIDNdLCAyMiwgLTEwNDQ1MjUzMzApO1xyXG4gICAgYSA9IG1kNV9mZihhLCBiLCBjLCBkLCB4W2krIDRdLCA3ICwgLTE3NjQxODg5Nyk7XHJcbiAgICBkID0gbWQ1X2ZmKGQsIGEsIGIsIGMsIHhbaSsgNV0sIDEyLCAgMTIwMDA4MDQyNik7XHJcbiAgICBjID0gbWQ1X2ZmKGMsIGQsIGEsIGIsIHhbaSsgNl0sIDE3LCAtMTQ3MzIzMTM0MSk7XHJcbiAgICBiID0gbWQ1X2ZmKGIsIGMsIGQsIGEsIHhbaSsgN10sIDIyLCAtNDU3MDU5ODMpO1xyXG4gICAgYSA9IG1kNV9mZihhLCBiLCBjLCBkLCB4W2krIDhdLCA3ICwgIDE3NzAwMzU0MTYpO1xyXG4gICAgZCA9IG1kNV9mZihkLCBhLCBiLCBjLCB4W2krIDldLCAxMiwgLTE5NTg0MTQ0MTcpO1xyXG4gICAgYyA9IG1kNV9mZihjLCBkLCBhLCBiLCB4W2krMTBdLCAxNywgLTQyMDYzKTtcclxuICAgIGIgPSBtZDVfZmYoYiwgYywgZCwgYSwgeFtpKzExXSwgMjIsIC0xOTkwNDA0MTYyKTtcclxuICAgIGEgPSBtZDVfZmYoYSwgYiwgYywgZCwgeFtpKzEyXSwgNyAsICAxODA0NjAzNjgyKTtcclxuICAgIGQgPSBtZDVfZmYoZCwgYSwgYiwgYywgeFtpKzEzXSwgMTIsIC00MDM0MTEwMSk7XHJcbiAgICBjID0gbWQ1X2ZmKGMsIGQsIGEsIGIsIHhbaSsxNF0sIDE3LCAtMTUwMjAwMjI5MCk7XHJcbiAgICBiID0gbWQ1X2ZmKGIsIGMsIGQsIGEsIHhbaSsxNV0sIDIyLCAgMTIzNjUzNTMyOSk7XHJcblxyXG4gICAgYSA9IG1kNV9nZyhhLCBiLCBjLCBkLCB4W2krIDFdLCA1ICwgLTE2NTc5NjUxMCk7XHJcbiAgICBkID0gbWQ1X2dnKGQsIGEsIGIsIGMsIHhbaSsgNl0sIDkgLCAtMTA2OTUwMTYzMik7XHJcbiAgICBjID0gbWQ1X2dnKGMsIGQsIGEsIGIsIHhbaSsxMV0sIDE0LCAgNjQzNzE3NzEzKTtcclxuICAgIGIgPSBtZDVfZ2coYiwgYywgZCwgYSwgeFtpKyAwXSwgMjAsIC0zNzM4OTczMDIpO1xyXG4gICAgYSA9IG1kNV9nZyhhLCBiLCBjLCBkLCB4W2krIDVdLCA1ICwgLTcwMTU1ODY5MSk7XHJcbiAgICBkID0gbWQ1X2dnKGQsIGEsIGIsIGMsIHhbaSsxMF0sIDkgLCAgMzgwMTYwODMpO1xyXG4gICAgYyA9IG1kNV9nZyhjLCBkLCBhLCBiLCB4W2krMTVdLCAxNCwgLTY2MDQ3ODMzNSk7XHJcbiAgICBiID0gbWQ1X2dnKGIsIGMsIGQsIGEsIHhbaSsgNF0sIDIwLCAtNDA1NTM3ODQ4KTtcclxuICAgIGEgPSBtZDVfZ2coYSwgYiwgYywgZCwgeFtpKyA5XSwgNSAsICA1Njg0NDY0MzgpO1xyXG4gICAgZCA9IG1kNV9nZyhkLCBhLCBiLCBjLCB4W2krMTRdLCA5ICwgLTEwMTk4MDM2OTApO1xyXG4gICAgYyA9IG1kNV9nZyhjLCBkLCBhLCBiLCB4W2krIDNdLCAxNCwgLTE4NzM2Mzk2MSk7XHJcbiAgICBiID0gbWQ1X2dnKGIsIGMsIGQsIGEsIHhbaSsgOF0sIDIwLCAgMTE2MzUzMTUwMSk7XHJcbiAgICBhID0gbWQ1X2dnKGEsIGIsIGMsIGQsIHhbaSsxM10sIDUgLCAtMTQ0NDY4MTQ2Nyk7XHJcbiAgICBkID0gbWQ1X2dnKGQsIGEsIGIsIGMsIHhbaSsgMl0sIDkgLCAtNTE0MDM3ODQpO1xyXG4gICAgYyA9IG1kNV9nZyhjLCBkLCBhLCBiLCB4W2krIDddLCAxNCwgIDE3MzUzMjg0NzMpO1xyXG4gICAgYiA9IG1kNV9nZyhiLCBjLCBkLCBhLCB4W2krMTJdLCAyMCwgLTE5MjY2MDc3MzQpO1xyXG5cclxuICAgIGEgPSBtZDVfaGgoYSwgYiwgYywgZCwgeFtpKyA1XSwgNCAsIC0zNzg1NTgpO1xyXG4gICAgZCA9IG1kNV9oaChkLCBhLCBiLCBjLCB4W2krIDhdLCAxMSwgLTIwMjI1NzQ0NjMpO1xyXG4gICAgYyA9IG1kNV9oaChjLCBkLCBhLCBiLCB4W2krMTFdLCAxNiwgIDE4MzkwMzA1NjIpO1xyXG4gICAgYiA9IG1kNV9oaChiLCBjLCBkLCBhLCB4W2krMTRdLCAyMywgLTM1MzA5NTU2KTtcclxuICAgIGEgPSBtZDVfaGgoYSwgYiwgYywgZCwgeFtpKyAxXSwgNCAsIC0xNTMwOTkyMDYwKTtcclxuICAgIGQgPSBtZDVfaGgoZCwgYSwgYiwgYywgeFtpKyA0XSwgMTEsICAxMjcyODkzMzUzKTtcclxuICAgIGMgPSBtZDVfaGgoYywgZCwgYSwgYiwgeFtpKyA3XSwgMTYsIC0xNTU0OTc2MzIpO1xyXG4gICAgYiA9IG1kNV9oaChiLCBjLCBkLCBhLCB4W2krMTBdLCAyMywgLTEwOTQ3MzA2NDApO1xyXG4gICAgYSA9IG1kNV9oaChhLCBiLCBjLCBkLCB4W2krMTNdLCA0ICwgIDY4MTI3OTE3NCk7XHJcbiAgICBkID0gbWQ1X2hoKGQsIGEsIGIsIGMsIHhbaSsgMF0sIDExLCAtMzU4NTM3MjIyKTtcclxuICAgIGMgPSBtZDVfaGgoYywgZCwgYSwgYiwgeFtpKyAzXSwgMTYsIC03MjI1MjE5NzkpO1xyXG4gICAgYiA9IG1kNV9oaChiLCBjLCBkLCBhLCB4W2krIDZdLCAyMywgIDc2MDI5MTg5KTtcclxuICAgIGEgPSBtZDVfaGgoYSwgYiwgYywgZCwgeFtpKyA5XSwgNCAsIC02NDAzNjQ0ODcpO1xyXG4gICAgZCA9IG1kNV9oaChkLCBhLCBiLCBjLCB4W2krMTJdLCAxMSwgLTQyMTgxNTgzNSk7XHJcbiAgICBjID0gbWQ1X2hoKGMsIGQsIGEsIGIsIHhbaSsxNV0sIDE2LCAgNTMwNzQyNTIwKTtcclxuICAgIGIgPSBtZDVfaGgoYiwgYywgZCwgYSwgeFtpKyAyXSwgMjMsIC05OTUzMzg2NTEpO1xyXG5cclxuICAgIGEgPSBtZDVfaWkoYSwgYiwgYywgZCwgeFtpKyAwXSwgNiAsIC0xOTg2MzA4NDQpO1xyXG4gICAgZCA9IG1kNV9paShkLCBhLCBiLCBjLCB4W2krIDddLCAxMCwgIDExMjY4OTE0MTUpO1xyXG4gICAgYyA9IG1kNV9paShjLCBkLCBhLCBiLCB4W2krMTRdLCAxNSwgLTE0MTYzNTQ5MDUpO1xyXG4gICAgYiA9IG1kNV9paShiLCBjLCBkLCBhLCB4W2krIDVdLCAyMSwgLTU3NDM0MDU1KTtcclxuICAgIGEgPSBtZDVfaWkoYSwgYiwgYywgZCwgeFtpKzEyXSwgNiAsICAxNzAwNDg1NTcxKTtcclxuICAgIGQgPSBtZDVfaWkoZCwgYSwgYiwgYywgeFtpKyAzXSwgMTAsIC0xODk0OTg2NjA2KTtcclxuICAgIGMgPSBtZDVfaWkoYywgZCwgYSwgYiwgeFtpKzEwXSwgMTUsIC0xMDUxNTIzKTtcclxuICAgIGIgPSBtZDVfaWkoYiwgYywgZCwgYSwgeFtpKyAxXSwgMjEsIC0yMDU0OTIyNzk5KTtcclxuICAgIGEgPSBtZDVfaWkoYSwgYiwgYywgZCwgeFtpKyA4XSwgNiAsICAxODczMzEzMzU5KTtcclxuICAgIGQgPSBtZDVfaWkoZCwgYSwgYiwgYywgeFtpKzE1XSwgMTAsIC0zMDYxMTc0NCk7XHJcbiAgICBjID0gbWQ1X2lpKGMsIGQsIGEsIGIsIHhbaSsgNl0sIDE1LCAtMTU2MDE5ODM4MCk7XHJcbiAgICBiID0gbWQ1X2lpKGIsIGMsIGQsIGEsIHhbaSsxM10sIDIxLCAgMTMwOTE1MTY0OSk7XHJcbiAgICBhID0gbWQ1X2lpKGEsIGIsIGMsIGQsIHhbaSsgNF0sIDYgLCAtMTQ1NTIzMDcwKTtcclxuICAgIGQgPSBtZDVfaWkoZCwgYSwgYiwgYywgeFtpKzExXSwgMTAsIC0xMTIwMjEwMzc5KTtcclxuICAgIGMgPSBtZDVfaWkoYywgZCwgYSwgYiwgeFtpKyAyXSwgMTUsICA3MTg3ODcyNTkpO1xyXG4gICAgYiA9IG1kNV9paShiLCBjLCBkLCBhLCB4W2krIDldLCAyMSwgLTM0MzQ4NTU1MSk7XHJcblxyXG4gICAgYSA9IHNhZmVfYWRkKGEsIG9sZGEpO1xyXG4gICAgYiA9IHNhZmVfYWRkKGIsIG9sZGIpO1xyXG4gICAgYyA9IHNhZmVfYWRkKGMsIG9sZGMpO1xyXG4gICAgZCA9IHNhZmVfYWRkKGQsIG9sZGQpO1xyXG4gIH1cclxuICByZXR1cm4gQXJyYXkoYSwgYiwgYywgZCk7XHJcblxyXG59XHJcblxyXG4vKlxyXG4gKiBUaGVzZSBmdW5jdGlvbnMgaW1wbGVtZW50IHRoZSBmb3VyIGJhc2ljIG9wZXJhdGlvbnMgdGhlIGFsZ29yaXRobSB1c2VzLlxyXG4gKi9cclxuZnVuY3Rpb24gbWQ1X2NtbihxLCBhLCBiLCB4LCBzLCB0KVxyXG57XHJcbiAgcmV0dXJuIHNhZmVfYWRkKGJpdF9yb2woc2FmZV9hZGQoc2FmZV9hZGQoYSwgcSksIHNhZmVfYWRkKHgsIHQpKSwgcyksYik7XHJcbn1cclxuZnVuY3Rpb24gbWQ1X2ZmKGEsIGIsIGMsIGQsIHgsIHMsIHQpXHJcbntcclxuICByZXR1cm4gbWQ1X2NtbigoYiAmIGMpIHwgKCh+YikgJiBkKSwgYSwgYiwgeCwgcywgdCk7XHJcbn1cclxuZnVuY3Rpb24gbWQ1X2dnKGEsIGIsIGMsIGQsIHgsIHMsIHQpXHJcbntcclxuICByZXR1cm4gbWQ1X2NtbigoYiAmIGQpIHwgKGMgJiAofmQpKSwgYSwgYiwgeCwgcywgdCk7XHJcbn1cclxuZnVuY3Rpb24gbWQ1X2hoKGEsIGIsIGMsIGQsIHgsIHMsIHQpXHJcbntcclxuICByZXR1cm4gbWQ1X2NtbihiIF4gYyBeIGQsIGEsIGIsIHgsIHMsIHQpO1xyXG59XHJcbmZ1bmN0aW9uIG1kNV9paShhLCBiLCBjLCBkLCB4LCBzLCB0KVxyXG57XHJcbiAgcmV0dXJuIG1kNV9jbW4oYyBeIChiIHwgKH5kKSksIGEsIGIsIHgsIHMsIHQpO1xyXG59XHJcblxyXG4vKlxyXG4gKiBBZGQgaW50ZWdlcnMsIHdyYXBwaW5nIGF0IDJeMzIuIFRoaXMgdXNlcyAxNi1iaXQgb3BlcmF0aW9ucyBpbnRlcm5hbGx5XHJcbiAqIHRvIHdvcmsgYXJvdW5kIGJ1Z3MgaW4gc29tZSBKUyBpbnRlcnByZXRlcnMuXHJcbiAqL1xyXG5mdW5jdGlvbiBzYWZlX2FkZCh4LCB5KVxyXG57XHJcbiAgdmFyIGxzdyA9ICh4ICYgMHhGRkZGKSArICh5ICYgMHhGRkZGKTtcclxuICB2YXIgbXN3ID0gKHggPj4gMTYpICsgKHkgPj4gMTYpICsgKGxzdyA+PiAxNik7XHJcbiAgcmV0dXJuIChtc3cgPDwgMTYpIHwgKGxzdyAmIDB4RkZGRik7XHJcbn1cclxuXHJcbi8qXHJcbiAqIEJpdHdpc2Ugcm90YXRlIGEgMzItYml0IG51bWJlciB0byB0aGUgbGVmdC5cclxuICovXHJcbmZ1bmN0aW9uIGJpdF9yb2wobnVtLCBjbnQpXHJcbntcclxuICByZXR1cm4gKG51bSA8PCBjbnQpIHwgKG51bSA+Pj4gKDMyIC0gY250KSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWQ1KGJ1Zikge1xyXG4gIHJldHVybiBoZWxwZXJzLmhhc2goYnVmLCBjb3JlX21kNSwgMTYpO1xyXG59O1xyXG4iLCIvLyBPcmlnaW5hbCBjb2RlIGFkYXB0ZWQgZnJvbSBSb2JlcnQgS2llZmZlci5cbi8vIGRldGFpbHMgYXQgaHR0cHM6Ly9naXRodWIuY29tL2Jyb29mYS9ub2RlLXV1aWRcbihmdW5jdGlvbigpIHtcbiAgdmFyIF9nbG9iYWwgPSB0aGlzO1xuXG4gIHZhciBtYXRoUk5HLCB3aGF0d2dSTkc7XG5cbiAgLy8gTk9URTogTWF0aC5yYW5kb20oKSBkb2VzIG5vdCBndWFyYW50ZWUgXCJjcnlwdG9ncmFwaGljIHF1YWxpdHlcIlxuICBtYXRoUk5HID0gZnVuY3Rpb24oc2l6ZSkge1xuICAgIHZhciBieXRlcyA9IG5ldyBBcnJheShzaXplKTtcbiAgICB2YXIgcjtcblxuICAgIGZvciAodmFyIGkgPSAwLCByOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBpZiAoKGkgJiAweDAzKSA9PSAwKSByID0gTWF0aC5yYW5kb20oKSAqIDB4MTAwMDAwMDAwO1xuICAgICAgYnl0ZXNbaV0gPSByID4+PiAoKGkgJiAweDAzKSA8PCAzKSAmIDB4ZmY7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ5dGVzO1xuICB9XG5cbiAgaWYgKF9nbG9iYWwuY3J5cHRvICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHtcbiAgICB3aGF0d2dSTkcgPSBmdW5jdGlvbihzaXplKSB7XG4gICAgICB2YXIgYnl0ZXMgPSBuZXcgVWludDhBcnJheShzaXplKTtcbiAgICAgIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnl0ZXMpO1xuICAgICAgcmV0dXJuIGJ5dGVzO1xuICAgIH1cbiAgfVxuXG4gIG1vZHVsZS5leHBvcnRzID0gd2hhdHdnUk5HIHx8IG1hdGhSTkc7XG5cbn0oKSlcbiIsIi8qXG4gKiBBIEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgdGhlIFNlY3VyZSBIYXNoIEFsZ29yaXRobSwgU0hBLTEsIGFzIGRlZmluZWRcbiAqIGluIEZJUFMgUFVCIDE4MC0xXG4gKiBWZXJzaW9uIDIuMWEgQ29weXJpZ2h0IFBhdWwgSm9obnN0b24gMjAwMCAtIDIwMDIuXG4gKiBPdGhlciBjb250cmlidXRvcnM6IEdyZWcgSG9sdCwgQW5kcmV3IEtlcGVydCwgWWRuYXIsIExvc3RpbmV0XG4gKiBEaXN0cmlidXRlZCB1bmRlciB0aGUgQlNEIExpY2Vuc2VcbiAqIFNlZSBodHRwOi8vcGFqaG9tZS5vcmcudWsvY3J5cHQvbWQ1IGZvciBkZXRhaWxzLlxuICovXG5cbnZhciBoZWxwZXJzID0gcmVxdWlyZSgnLi9oZWxwZXJzJyk7XG5cbi8qXG4gKiBDYWxjdWxhdGUgdGhlIFNIQS0xIG9mIGFuIGFycmF5IG9mIGJpZy1lbmRpYW4gd29yZHMsIGFuZCBhIGJpdCBsZW5ndGhcbiAqL1xuZnVuY3Rpb24gY29yZV9zaGExKHgsIGxlbilcbntcbiAgLyogYXBwZW5kIHBhZGRpbmcgKi9cbiAgeFtsZW4gPj4gNV0gfD0gMHg4MCA8PCAoMjQgLSBsZW4gJSAzMik7XG4gIHhbKChsZW4gKyA2NCA+PiA5KSA8PCA0KSArIDE1XSA9IGxlbjtcblxuICB2YXIgdyA9IEFycmF5KDgwKTtcbiAgdmFyIGEgPSAgMTczMjU4NDE5MztcbiAgdmFyIGIgPSAtMjcxNzMzODc5O1xuICB2YXIgYyA9IC0xNzMyNTg0MTk0O1xuICB2YXIgZCA9ICAyNzE3MzM4Nzg7XG4gIHZhciBlID0gLTEwMDk1ODk3NzY7XG5cbiAgZm9yKHZhciBpID0gMDsgaSA8IHgubGVuZ3RoOyBpICs9IDE2KVxuICB7XG4gICAgdmFyIG9sZGEgPSBhO1xuICAgIHZhciBvbGRiID0gYjtcbiAgICB2YXIgb2xkYyA9IGM7XG4gICAgdmFyIG9sZGQgPSBkO1xuICAgIHZhciBvbGRlID0gZTtcblxuICAgIGZvcih2YXIgaiA9IDA7IGogPCA4MDsgaisrKVxuICAgIHtcbiAgICAgIGlmKGogPCAxNikgd1tqXSA9IHhbaSArIGpdO1xuICAgICAgZWxzZSB3W2pdID0gcm9sKHdbai0zXSBeIHdbai04XSBeIHdbai0xNF0gXiB3W2otMTZdLCAxKTtcbiAgICAgIHZhciB0ID0gc2FmZV9hZGQoc2FmZV9hZGQocm9sKGEsIDUpLCBzaGExX2Z0KGosIGIsIGMsIGQpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgc2FmZV9hZGQoc2FmZV9hZGQoZSwgd1tqXSksIHNoYTFfa3QoaikpKTtcbiAgICAgIGUgPSBkO1xuICAgICAgZCA9IGM7XG4gICAgICBjID0gcm9sKGIsIDMwKTtcbiAgICAgIGIgPSBhO1xuICAgICAgYSA9IHQ7XG4gICAgfVxuXG4gICAgYSA9IHNhZmVfYWRkKGEsIG9sZGEpO1xuICAgIGIgPSBzYWZlX2FkZChiLCBvbGRiKTtcbiAgICBjID0gc2FmZV9hZGQoYywgb2xkYyk7XG4gICAgZCA9IHNhZmVfYWRkKGQsIG9sZGQpO1xuICAgIGUgPSBzYWZlX2FkZChlLCBvbGRlKTtcbiAgfVxuICByZXR1cm4gQXJyYXkoYSwgYiwgYywgZCwgZSk7XG5cbn1cblxuLypcbiAqIFBlcmZvcm0gdGhlIGFwcHJvcHJpYXRlIHRyaXBsZXQgY29tYmluYXRpb24gZnVuY3Rpb24gZm9yIHRoZSBjdXJyZW50XG4gKiBpdGVyYXRpb25cbiAqL1xuZnVuY3Rpb24gc2hhMV9mdCh0LCBiLCBjLCBkKVxue1xuICBpZih0IDwgMjApIHJldHVybiAoYiAmIGMpIHwgKCh+YikgJiBkKTtcbiAgaWYodCA8IDQwKSByZXR1cm4gYiBeIGMgXiBkO1xuICBpZih0IDwgNjApIHJldHVybiAoYiAmIGMpIHwgKGIgJiBkKSB8IChjICYgZCk7XG4gIHJldHVybiBiIF4gYyBeIGQ7XG59XG5cbi8qXG4gKiBEZXRlcm1pbmUgdGhlIGFwcHJvcHJpYXRlIGFkZGl0aXZlIGNvbnN0YW50IGZvciB0aGUgY3VycmVudCBpdGVyYXRpb25cbiAqL1xuZnVuY3Rpb24gc2hhMV9rdCh0KVxue1xuICByZXR1cm4gKHQgPCAyMCkgPyAgMTUxODUwMDI0OSA6ICh0IDwgNDApID8gIDE4NTk3NzUzOTMgOlxuICAgICAgICAgKHQgPCA2MCkgPyAtMTg5NDAwNzU4OCA6IC04OTk0OTc1MTQ7XG59XG5cbi8qXG4gKiBBZGQgaW50ZWdlcnMsIHdyYXBwaW5nIGF0IDJeMzIuIFRoaXMgdXNlcyAxNi1iaXQgb3BlcmF0aW9ucyBpbnRlcm5hbGx5XG4gKiB0byB3b3JrIGFyb3VuZCBidWdzIGluIHNvbWUgSlMgaW50ZXJwcmV0ZXJzLlxuICovXG5mdW5jdGlvbiBzYWZlX2FkZCh4LCB5KVxue1xuICB2YXIgbHN3ID0gKHggJiAweEZGRkYpICsgKHkgJiAweEZGRkYpO1xuICB2YXIgbXN3ID0gKHggPj4gMTYpICsgKHkgPj4gMTYpICsgKGxzdyA+PiAxNik7XG4gIHJldHVybiAobXN3IDw8IDE2KSB8IChsc3cgJiAweEZGRkYpO1xufVxuXG4vKlxuICogQml0d2lzZSByb3RhdGUgYSAzMi1iaXQgbnVtYmVyIHRvIHRoZSBsZWZ0LlxuICovXG5mdW5jdGlvbiByb2wobnVtLCBjbnQpXG57XG4gIHJldHVybiAobnVtIDw8IGNudCkgfCAobnVtID4+PiAoMzIgLSBjbnQpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzaGExKGJ1Zikge1xuICByZXR1cm4gaGVscGVycy5oYXNoKGJ1ZiwgY29yZV9zaGExLCAyMCwgdHJ1ZSk7XG59O1xuIiwiXG4vKipcbiAqIEEgSmF2YVNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgU2VjdXJlIEhhc2ggQWxnb3JpdGhtLCBTSEEtMjU2LCBhcyBkZWZpbmVkXG4gKiBpbiBGSVBTIDE4MC0yXG4gKiBWZXJzaW9uIDIuMi1iZXRhIENvcHlyaWdodCBBbmdlbCBNYXJpbiwgUGF1bCBKb2huc3RvbiAyMDAwIC0gMjAwOS5cbiAqIE90aGVyIGNvbnRyaWJ1dG9yczogR3JlZyBIb2x0LCBBbmRyZXcgS2VwZXJ0LCBZZG5hciwgTG9zdGluZXRcbiAqXG4gKi9cblxudmFyIGhlbHBlcnMgPSByZXF1aXJlKCcuL2hlbHBlcnMnKTtcblxudmFyIHNhZmVfYWRkID0gZnVuY3Rpb24oeCwgeSkge1xuICB2YXIgbHN3ID0gKHggJiAweEZGRkYpICsgKHkgJiAweEZGRkYpO1xuICB2YXIgbXN3ID0gKHggPj4gMTYpICsgKHkgPj4gMTYpICsgKGxzdyA+PiAxNik7XG4gIHJldHVybiAobXN3IDw8IDE2KSB8IChsc3cgJiAweEZGRkYpO1xufTtcblxudmFyIFMgPSBmdW5jdGlvbihYLCBuKSB7XG4gIHJldHVybiAoWCA+Pj4gbikgfCAoWCA8PCAoMzIgLSBuKSk7XG59O1xuXG52YXIgUiA9IGZ1bmN0aW9uKFgsIG4pIHtcbiAgcmV0dXJuIChYID4+PiBuKTtcbn07XG5cbnZhciBDaCA9IGZ1bmN0aW9uKHgsIHksIHopIHtcbiAgcmV0dXJuICgoeCAmIHkpIF4gKCh+eCkgJiB6KSk7XG59O1xuXG52YXIgTWFqID0gZnVuY3Rpb24oeCwgeSwgeikge1xuICByZXR1cm4gKCh4ICYgeSkgXiAoeCAmIHopIF4gKHkgJiB6KSk7XG59O1xuXG52YXIgU2lnbWEwMjU2ID0gZnVuY3Rpb24oeCkge1xuICByZXR1cm4gKFMoeCwgMikgXiBTKHgsIDEzKSBeIFMoeCwgMjIpKTtcbn07XG5cbnZhciBTaWdtYTEyNTYgPSBmdW5jdGlvbih4KSB7XG4gIHJldHVybiAoUyh4LCA2KSBeIFMoeCwgMTEpIF4gUyh4LCAyNSkpO1xufTtcblxudmFyIEdhbW1hMDI1NiA9IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIChTKHgsIDcpIF4gUyh4LCAxOCkgXiBSKHgsIDMpKTtcbn07XG5cbnZhciBHYW1tYTEyNTYgPSBmdW5jdGlvbih4KSB7XG4gIHJldHVybiAoUyh4LCAxNykgXiBTKHgsIDE5KSBeIFIoeCwgMTApKTtcbn07XG5cbnZhciBjb3JlX3NoYTI1NiA9IGZ1bmN0aW9uKG0sIGwpIHtcbiAgdmFyIEsgPSBuZXcgQXJyYXkoMHg0MjhBMkY5OCwweDcxMzc0NDkxLDB4QjVDMEZCQ0YsMHhFOUI1REJBNSwweDM5NTZDMjVCLDB4NTlGMTExRjEsMHg5MjNGODJBNCwweEFCMUM1RUQ1LDB4RDgwN0FBOTgsMHgxMjgzNUIwMSwweDI0MzE4NUJFLDB4NTUwQzdEQzMsMHg3MkJFNUQ3NCwweDgwREVCMUZFLDB4OUJEQzA2QTcsMHhDMTlCRjE3NCwweEU0OUI2OUMxLDB4RUZCRTQ3ODYsMHhGQzE5REM2LDB4MjQwQ0ExQ0MsMHgyREU5MkM2RiwweDRBNzQ4NEFBLDB4NUNCMEE5REMsMHg3NkY5ODhEQSwweDk4M0U1MTUyLDB4QTgzMUM2NkQsMHhCMDAzMjdDOCwweEJGNTk3RkM3LDB4QzZFMDBCRjMsMHhENUE3OTE0NywweDZDQTYzNTEsMHgxNDI5Mjk2NywweDI3QjcwQTg1LDB4MkUxQjIxMzgsMHg0RDJDNkRGQywweDUzMzgwRDEzLDB4NjUwQTczNTQsMHg3NjZBMEFCQiwweDgxQzJDOTJFLDB4OTI3MjJDODUsMHhBMkJGRThBMSwweEE4MUE2NjRCLDB4QzI0QjhCNzAsMHhDNzZDNTFBMywweEQxOTJFODE5LDB4RDY5OTA2MjQsMHhGNDBFMzU4NSwweDEwNkFBMDcwLDB4MTlBNEMxMTYsMHgxRTM3NkMwOCwweDI3NDg3NzRDLDB4MzRCMEJDQjUsMHgzOTFDMENCMywweDRFRDhBQTRBLDB4NUI5Q0NBNEYsMHg2ODJFNkZGMywweDc0OEY4MkVFLDB4NzhBNTYzNkYsMHg4NEM4NzgxNCwweDhDQzcwMjA4LDB4OTBCRUZGRkEsMHhBNDUwNkNFQiwweEJFRjlBM0Y3LDB4QzY3MTc4RjIpO1xuICB2YXIgSEFTSCA9IG5ldyBBcnJheSgweDZBMDlFNjY3LCAweEJCNjdBRTg1LCAweDNDNkVGMzcyLCAweEE1NEZGNTNBLCAweDUxMEU1MjdGLCAweDlCMDU2ODhDLCAweDFGODNEOUFCLCAweDVCRTBDRDE5KTtcbiAgICB2YXIgVyA9IG5ldyBBcnJheSg2NCk7XG4gICAgdmFyIGEsIGIsIGMsIGQsIGUsIGYsIGcsIGgsIGksIGo7XG4gICAgdmFyIFQxLCBUMjtcbiAgLyogYXBwZW5kIHBhZGRpbmcgKi9cbiAgbVtsID4+IDVdIHw9IDB4ODAgPDwgKDI0IC0gbCAlIDMyKTtcbiAgbVsoKGwgKyA2NCA+PiA5KSA8PCA0KSArIDE1XSA9IGw7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbS5sZW5ndGg7IGkgKz0gMTYpIHtcbiAgICBhID0gSEFTSFswXTsgYiA9IEhBU0hbMV07IGMgPSBIQVNIWzJdOyBkID0gSEFTSFszXTsgZSA9IEhBU0hbNF07IGYgPSBIQVNIWzVdOyBnID0gSEFTSFs2XTsgaCA9IEhBU0hbN107XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCA2NDsgaisrKSB7XG4gICAgICBpZiAoaiA8IDE2KSB7XG4gICAgICAgIFdbal0gPSBtW2ogKyBpXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFdbal0gPSBzYWZlX2FkZChzYWZlX2FkZChzYWZlX2FkZChHYW1tYTEyNTYoV1tqIC0gMl0pLCBXW2ogLSA3XSksIEdhbW1hMDI1NihXW2ogLSAxNV0pKSwgV1tqIC0gMTZdKTtcbiAgICAgIH1cbiAgICAgIFQxID0gc2FmZV9hZGQoc2FmZV9hZGQoc2FmZV9hZGQoc2FmZV9hZGQoaCwgU2lnbWExMjU2KGUpKSwgQ2goZSwgZiwgZykpLCBLW2pdKSwgV1tqXSk7XG4gICAgICBUMiA9IHNhZmVfYWRkKFNpZ21hMDI1NihhKSwgTWFqKGEsIGIsIGMpKTtcbiAgICAgIGggPSBnOyBnID0gZjsgZiA9IGU7IGUgPSBzYWZlX2FkZChkLCBUMSk7IGQgPSBjOyBjID0gYjsgYiA9IGE7IGEgPSBzYWZlX2FkZChUMSwgVDIpO1xuICAgIH1cbiAgICBIQVNIWzBdID0gc2FmZV9hZGQoYSwgSEFTSFswXSk7IEhBU0hbMV0gPSBzYWZlX2FkZChiLCBIQVNIWzFdKTsgSEFTSFsyXSA9IHNhZmVfYWRkKGMsIEhBU0hbMl0pOyBIQVNIWzNdID0gc2FmZV9hZGQoZCwgSEFTSFszXSk7XG4gICAgSEFTSFs0XSA9IHNhZmVfYWRkKGUsIEhBU0hbNF0pOyBIQVNIWzVdID0gc2FmZV9hZGQoZiwgSEFTSFs1XSk7IEhBU0hbNl0gPSBzYWZlX2FkZChnLCBIQVNIWzZdKTsgSEFTSFs3XSA9IHNhZmVfYWRkKGgsIEhBU0hbN10pO1xuICB9XG4gIHJldHVybiBIQVNIO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzaGEyNTYoYnVmKSB7XG4gIHJldHVybiBoZWxwZXJzLmhhc2goYnVmLCBjb3JlX3NoYTI1NiwgMzIsIHRydWUpO1xufTtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gZXYuc291cmNlO1xuICAgICAgICAgICAgaWYgKChzb3VyY2UgPT09IHdpbmRvdyB8fCBzb3VyY2UgPT09IG51bGwpICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG4iLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsKXtcbihmdW5jdGlvbihnbG9iYWwpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICBpZiAoZ2xvYmFsLiR0cmFjZXVyUnVudGltZSkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgJE9iamVjdCA9IE9iamVjdDtcbiAgdmFyICRUeXBlRXJyb3IgPSBUeXBlRXJyb3I7XG4gIHZhciAkY3JlYXRlID0gJE9iamVjdC5jcmVhdGU7XG4gIHZhciAkZGVmaW5lUHJvcGVydGllcyA9ICRPYmplY3QuZGVmaW5lUHJvcGVydGllcztcbiAgdmFyICRkZWZpbmVQcm9wZXJ0eSA9ICRPYmplY3QuZGVmaW5lUHJvcGVydHk7XG4gIHZhciAkZnJlZXplID0gJE9iamVjdC5mcmVlemU7XG4gIHZhciAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gJE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4gIHZhciAkZ2V0T3duUHJvcGVydHlOYW1lcyA9ICRPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcztcbiAgdmFyICRnZXRQcm90b3R5cGVPZiA9ICRPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIHZhciAkaGFzT3duUHJvcGVydHkgPSAkT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyICR0b1N0cmluZyA9ICRPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuICBmdW5jdGlvbiBub25FbnVtKHZhbHVlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9O1xuICB9XG4gIHZhciB0eXBlcyA9IHtcbiAgICB2b2lkOiBmdW5jdGlvbiB2b2lkVHlwZSgpIHt9LFxuICAgIGFueTogZnVuY3Rpb24gYW55KCkge30sXG4gICAgc3RyaW5nOiBmdW5jdGlvbiBzdHJpbmcoKSB7fSxcbiAgICBudW1iZXI6IGZ1bmN0aW9uIG51bWJlcigpIHt9LFxuICAgIGJvb2xlYW46IGZ1bmN0aW9uIGJvb2xlYW4oKSB7fVxuICB9O1xuICB2YXIgbWV0aG9kID0gbm9uRW51bTtcbiAgdmFyIGNvdW50ZXIgPSAwO1xuICBmdW5jdGlvbiBuZXdVbmlxdWVTdHJpbmcoKSB7XG4gICAgcmV0dXJuICdfXyQnICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMWU5KSArICckJyArICsrY291bnRlciArICckX18nO1xuICB9XG4gIHZhciBzeW1ib2xJbnRlcm5hbFByb3BlcnR5ID0gbmV3VW5pcXVlU3RyaW5nKCk7XG4gIHZhciBzeW1ib2xEZXNjcmlwdGlvblByb3BlcnR5ID0gbmV3VW5pcXVlU3RyaW5nKCk7XG4gIHZhciBzeW1ib2xEYXRhUHJvcGVydHkgPSBuZXdVbmlxdWVTdHJpbmcoKTtcbiAgdmFyIHN5bWJvbFZhbHVlcyA9ICRjcmVhdGUobnVsbCk7XG4gIGZ1bmN0aW9uIGlzU3ltYm9sKHN5bWJvbCkge1xuICAgIHJldHVybiB0eXBlb2Ygc3ltYm9sID09PSAnb2JqZWN0JyAmJiBzeW1ib2wgaW5zdGFuY2VvZiBTeW1ib2xWYWx1ZTtcbiAgfVxuICBmdW5jdGlvbiB0eXBlT2Yodikge1xuICAgIGlmIChpc1N5bWJvbCh2KSlcbiAgICAgIHJldHVybiAnc3ltYm9sJztcbiAgICByZXR1cm4gdHlwZW9mIHY7XG4gIH1cbiAgZnVuY3Rpb24gU3ltYm9sKGRlc2NyaXB0aW9uKSB7XG4gICAgdmFyIHZhbHVlID0gbmV3IFN5bWJvbFZhbHVlKGRlc2NyaXB0aW9uKTtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgU3ltYm9sKSlcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdTeW1ib2wgY2Fubm90IGJlIG5ld1xcJ2VkJyk7XG4gIH1cbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbC5wcm90b3R5cGUsICdjb25zdHJ1Y3RvcicsIG5vbkVudW0oU3ltYm9sKSk7XG4gICRkZWZpbmVQcm9wZXJ0eShTeW1ib2wucHJvdG90eXBlLCAndG9TdHJpbmcnLCBtZXRob2QoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN5bWJvbFZhbHVlID0gdGhpc1tzeW1ib2xEYXRhUHJvcGVydHldO1xuICAgIGlmICghZ2V0T3B0aW9uKCdzeW1ib2xzJykpXG4gICAgICByZXR1cm4gc3ltYm9sVmFsdWVbc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eV07XG4gICAgaWYgKCFzeW1ib2xWYWx1ZSlcbiAgICAgIHRocm93IFR5cGVFcnJvcignQ29udmVyc2lvbiBmcm9tIHN5bWJvbCB0byBzdHJpbmcnKTtcbiAgICB2YXIgZGVzYyA9IHN5bWJvbFZhbHVlW3N5bWJvbERlc2NyaXB0aW9uUHJvcGVydHldO1xuICAgIGlmIChkZXNjID09PSB1bmRlZmluZWQpXG4gICAgICBkZXNjID0gJyc7XG4gICAgcmV0dXJuICdTeW1ib2woJyArIGRlc2MgKyAnKSc7XG4gIH0pKTtcbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbC5wcm90b3R5cGUsICd2YWx1ZU9mJywgbWV0aG9kKGZ1bmN0aW9uKCkge1xuICAgIHZhciBzeW1ib2xWYWx1ZSA9IHRoaXNbc3ltYm9sRGF0YVByb3BlcnR5XTtcbiAgICBpZiAoIXN5bWJvbFZhbHVlKVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdDb252ZXJzaW9uIGZyb20gc3ltYm9sIHRvIHN0cmluZycpO1xuICAgIGlmICghZ2V0T3B0aW9uKCdzeW1ib2xzJykpXG4gICAgICByZXR1cm4gc3ltYm9sVmFsdWVbc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eV07XG4gICAgcmV0dXJuIHN5bWJvbFZhbHVlO1xuICB9KSk7XG4gIGZ1bmN0aW9uIFN5bWJvbFZhbHVlKGRlc2NyaXB0aW9uKSB7XG4gICAgdmFyIGtleSA9IG5ld1VuaXF1ZVN0cmluZygpO1xuICAgICRkZWZpbmVQcm9wZXJ0eSh0aGlzLCBzeW1ib2xEYXRhUHJvcGVydHksIHt2YWx1ZTogdGhpc30pO1xuICAgICRkZWZpbmVQcm9wZXJ0eSh0aGlzLCBzeW1ib2xJbnRlcm5hbFByb3BlcnR5LCB7dmFsdWU6IGtleX0pO1xuICAgICRkZWZpbmVQcm9wZXJ0eSh0aGlzLCBzeW1ib2xEZXNjcmlwdGlvblByb3BlcnR5LCB7dmFsdWU6IGRlc2NyaXB0aW9ufSk7XG4gICAgJGZyZWV6ZSh0aGlzKTtcbiAgICBzeW1ib2xWYWx1ZXNba2V5XSA9IHRoaXM7XG4gIH1cbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbFZhbHVlLnByb3RvdHlwZSwgJ2NvbnN0cnVjdG9yJywgbm9uRW51bShTeW1ib2wpKTtcbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbFZhbHVlLnByb3RvdHlwZSwgJ3RvU3RyaW5nJywge1xuICAgIHZhbHVlOiBTeW1ib2wucHJvdG90eXBlLnRvU3RyaW5nLFxuICAgIGVudW1lcmFibGU6IGZhbHNlXG4gIH0pO1xuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sVmFsdWUucHJvdG90eXBlLCAndmFsdWVPZicsIHtcbiAgICB2YWx1ZTogU3ltYm9sLnByb3RvdHlwZS52YWx1ZU9mLFxuICAgIGVudW1lcmFibGU6IGZhbHNlXG4gIH0pO1xuICAkZnJlZXplKFN5bWJvbFZhbHVlLnByb3RvdHlwZSk7XG4gIFN5bWJvbC5pdGVyYXRvciA9IFN5bWJvbCgpO1xuICBmdW5jdGlvbiB0b1Byb3BlcnR5KG5hbWUpIHtcbiAgICBpZiAoaXNTeW1ib2wobmFtZSkpXG4gICAgICByZXR1cm4gbmFtZVtzeW1ib2xJbnRlcm5hbFByb3BlcnR5XTtcbiAgICByZXR1cm4gbmFtZTtcbiAgfVxuICBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdCkge1xuICAgIHZhciBydiA9IFtdO1xuICAgIHZhciBuYW1lcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5hbWUgPSBuYW1lc1tpXTtcbiAgICAgIGlmICghc3ltYm9sVmFsdWVzW25hbWVdKVxuICAgICAgICBydi5wdXNoKG5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gcnY7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgbmFtZSkge1xuICAgIHJldHVybiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgdG9Qcm9wZXJ0eShuYW1lKSk7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlTeW1ib2xzKG9iamVjdCkge1xuICAgIHZhciBydiA9IFtdO1xuICAgIHZhciBuYW1lcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHN5bWJvbCA9IHN5bWJvbFZhbHVlc1tuYW1lc1tpXV07XG4gICAgICBpZiAoc3ltYm9sKVxuICAgICAgICBydi5wdXNoKHN5bWJvbCk7XG4gICAgfVxuICAgIHJldHVybiBydjtcbiAgfVxuICBmdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShuYW1lKSB7XG4gICAgcmV0dXJuICRoYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMsIHRvUHJvcGVydHkobmFtZSkpO1xuICB9XG4gIGZ1bmN0aW9uIGdldE9wdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIGdsb2JhbC50cmFjZXVyICYmIGdsb2JhbC50cmFjZXVyLm9wdGlvbnNbbmFtZV07XG4gIH1cbiAgZnVuY3Rpb24gc2V0UHJvcGVydHkob2JqZWN0LCBuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBzeW0sXG4gICAgICAgIGRlc2M7XG4gICAgaWYgKGlzU3ltYm9sKG5hbWUpKSB7XG4gICAgICBzeW0gPSBuYW1lO1xuICAgICAgbmFtZSA9IG5hbWVbc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eV07XG4gICAgfVxuICAgIG9iamVjdFtuYW1lXSA9IHZhbHVlO1xuICAgIGlmIChzeW0gJiYgKGRlc2MgPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgbmFtZSkpKVxuICAgICAgJGRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwge2VudW1lcmFibGU6IGZhbHNlfSk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwgZGVzY3JpcHRvcikge1xuICAgIGlmIChpc1N5bWJvbChuYW1lKSkge1xuICAgICAgaWYgKGRlc2NyaXB0b3IuZW51bWVyYWJsZSkge1xuICAgICAgICBkZXNjcmlwdG9yID0gJGNyZWF0ZShkZXNjcmlwdG9yLCB7ZW51bWVyYWJsZToge3ZhbHVlOiBmYWxzZX19KTtcbiAgICAgIH1cbiAgICAgIG5hbWUgPSBuYW1lW3N5bWJvbEludGVybmFsUHJvcGVydHldO1xuICAgIH1cbiAgICAkZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCBkZXNjcmlwdG9yKTtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG4gIGZ1bmN0aW9uIHBvbHlmaWxsT2JqZWN0KE9iamVjdCkge1xuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdkZWZpbmVQcm9wZXJ0eScsIHt2YWx1ZTogZGVmaW5lUHJvcGVydHl9KTtcbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnZ2V0T3duUHJvcGVydHlOYW1lcycsIHt2YWx1ZTogZ2V0T3duUHJvcGVydHlOYW1lc30pO1xuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3InLCB7dmFsdWU6IGdldE93blByb3BlcnR5RGVzY3JpcHRvcn0pO1xuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QucHJvdG90eXBlLCAnaGFzT3duUHJvcGVydHknLCB7dmFsdWU6IGhhc093blByb3BlcnR5fSk7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scztcbiAgICBmdW5jdGlvbiBpcyhsZWZ0LCByaWdodCkge1xuICAgICAgaWYgKGxlZnQgPT09IHJpZ2h0KVxuICAgICAgICByZXR1cm4gbGVmdCAhPT0gMCB8fCAxIC8gbGVmdCA9PT0gMSAvIHJpZ2h0O1xuICAgICAgcmV0dXJuIGxlZnQgIT09IGxlZnQgJiYgcmlnaHQgIT09IHJpZ2h0O1xuICAgIH1cbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnaXMnLCBtZXRob2QoaXMpKTtcbiAgICBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2UpIHtcbiAgICAgIHZhciBwcm9wcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZSk7XG4gICAgICB2YXIgcCxcbiAgICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG4gICAgICBmb3IgKHAgPSAwOyBwIDwgbGVuZ3RoOyBwKyspIHtcbiAgICAgICAgdGFyZ2V0W3Byb3BzW3BdXSA9IHNvdXJjZVtwcm9wc1twXV07XG4gICAgICB9XG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnYXNzaWduJywgbWV0aG9kKGFzc2lnbikpO1xuICAgIGZ1bmN0aW9uIG1peGluKHRhcmdldCwgc291cmNlKSB7XG4gICAgICB2YXIgcHJvcHMgPSAkZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2UpO1xuICAgICAgdmFyIHAsXG4gICAgICAgICAgZGVzY3JpcHRvcixcbiAgICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG4gICAgICBmb3IgKHAgPSAwOyBwIDwgbGVuZ3RoOyBwKyspIHtcbiAgICAgICAgZGVzY3JpcHRvciA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBwcm9wc1twXSk7XG4gICAgICAgICRkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BzW3BdLCBkZXNjcmlwdG9yKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdtaXhpbicsIG1ldGhvZChtaXhpbikpO1xuICB9XG4gIGZ1bmN0aW9uIGV4cG9ydFN0YXIob2JqZWN0KSB7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBuYW1lcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKGFyZ3VtZW50c1tpXSk7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG5hbWVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIChmdW5jdGlvbihtb2QsIG5hbWUpIHtcbiAgICAgICAgICAkZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gbW9kW25hbWVdO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkoYXJndW1lbnRzW2ldLCBuYW1lc1tqXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cbiAgZnVuY3Rpb24gdG9PYmplY3QodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbClcbiAgICAgIHRocm93ICRUeXBlRXJyb3IoKTtcbiAgICByZXR1cm4gJE9iamVjdCh2YWx1ZSk7XG4gIH1cbiAgZnVuY3Rpb24gc3ByZWFkKCkge1xuICAgIHZhciBydiA9IFtdLFxuICAgICAgICBrID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHZhbHVlVG9TcHJlYWQgPSB0b09iamVjdChhcmd1bWVudHNbaV0pO1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWx1ZVRvU3ByZWFkLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHJ2W2srK10gPSB2YWx1ZVRvU3ByZWFkW2pdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcnY7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0UHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgbmFtZSkge1xuICAgIHdoaWxlIChvYmplY3QgIT09IG51bGwpIHtcbiAgICAgIHZhciByZXN1bHQgPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgbmFtZSk7XG4gICAgICBpZiAocmVzdWx0KVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgb2JqZWN0ID0gJGdldFByb3RvdHlwZU9mKG9iamVjdCk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgZnVuY3Rpb24gc3VwZXJEZXNjcmlwdG9yKGhvbWVPYmplY3QsIG5hbWUpIHtcbiAgICB2YXIgcHJvdG8gPSAkZ2V0UHJvdG90eXBlT2YoaG9tZU9iamVjdCk7XG4gICAgaWYgKCFwcm90bylcbiAgICAgIHRocm93ICRUeXBlRXJyb3IoJ3N1cGVyIGlzIG51bGwnKTtcbiAgICByZXR1cm4gZ2V0UHJvcGVydHlEZXNjcmlwdG9yKHByb3RvLCBuYW1lKTtcbiAgfVxuICBmdW5jdGlvbiBzdXBlckNhbGwoc2VsZiwgaG9tZU9iamVjdCwgbmFtZSwgYXJncykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gc3VwZXJEZXNjcmlwdG9yKGhvbWVPYmplY3QsIG5hbWUpO1xuICAgIGlmIChkZXNjcmlwdG9yKSB7XG4gICAgICBpZiAoJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yKVxuICAgICAgICByZXR1cm4gZGVzY3JpcHRvci52YWx1ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgIGlmIChkZXNjcmlwdG9yLmdldClcbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3IuZ2V0LmNhbGwoc2VsZikuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgfVxuICAgIHRocm93ICRUeXBlRXJyb3IoXCJzdXBlciBoYXMgbm8gbWV0aG9kICdcIiArIG5hbWUgKyBcIicuXCIpO1xuICB9XG4gIGZ1bmN0aW9uIHN1cGVyR2V0KHNlbGYsIGhvbWVPYmplY3QsIG5hbWUpIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHN1cGVyRGVzY3JpcHRvcihob21lT2JqZWN0LCBuYW1lKTtcbiAgICBpZiAoZGVzY3JpcHRvcikge1xuICAgICAgaWYgKGRlc2NyaXB0b3IuZ2V0KVxuICAgICAgICByZXR1cm4gZGVzY3JpcHRvci5nZXQuY2FsbChzZWxmKTtcbiAgICAgIGVsc2UgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcilcbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3IudmFsdWU7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgZnVuY3Rpb24gc3VwZXJTZXQoc2VsZiwgaG9tZU9iamVjdCwgbmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHN1cGVyRGVzY3JpcHRvcihob21lT2JqZWN0LCBuYW1lKTtcbiAgICBpZiAoZGVzY3JpcHRvciAmJiBkZXNjcmlwdG9yLnNldCkge1xuICAgICAgZGVzY3JpcHRvci5zZXQuY2FsbChzZWxmLCB2YWx1ZSk7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIHRocm93ICRUeXBlRXJyb3IoXCJzdXBlciBoYXMgbm8gc2V0dGVyICdcIiArIG5hbWUgKyBcIicuXCIpO1xuICB9XG4gIGZ1bmN0aW9uIGdldERlc2NyaXB0b3JzKG9iamVjdCkge1xuICAgIHZhciBkZXNjcmlwdG9ycyA9IHt9LFxuICAgICAgICBuYW1lLFxuICAgICAgICBuYW1lcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5hbWUgPSBuYW1lc1tpXTtcbiAgICAgIGRlc2NyaXB0b3JzW25hbWVdID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIG5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gZGVzY3JpcHRvcnM7XG4gIH1cbiAgZnVuY3Rpb24gY3JlYXRlQ2xhc3MoY3Rvciwgb2JqZWN0LCBzdGF0aWNPYmplY3QsIHN1cGVyQ2xhc3MpIHtcbiAgICAkZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnY29uc3RydWN0b3InLCB7XG4gICAgICB2YWx1ZTogY3RvcixcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDMpIHtcbiAgICAgIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgY3Rvci5fX3Byb3RvX18gPSBzdXBlckNsYXNzO1xuICAgICAgY3Rvci5wcm90b3R5cGUgPSAkY3JlYXRlKGdldFByb3RvUGFyZW50KHN1cGVyQ2xhc3MpLCBnZXREZXNjcmlwdG9ycyhvYmplY3QpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3Rvci5wcm90b3R5cGUgPSBvYmplY3Q7XG4gICAgfVxuICAgICRkZWZpbmVQcm9wZXJ0eShjdG9yLCAncHJvdG90eXBlJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZVxuICAgIH0pO1xuICAgIHJldHVybiAkZGVmaW5lUHJvcGVydGllcyhjdG9yLCBnZXREZXNjcmlwdG9ycyhzdGF0aWNPYmplY3QpKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRQcm90b1BhcmVudChzdXBlckNsYXNzKSB7XG4gICAgaWYgKHR5cGVvZiBzdXBlckNsYXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgcHJvdG90eXBlID0gc3VwZXJDbGFzcy5wcm90b3R5cGU7XG4gICAgICBpZiAoJE9iamVjdChwcm90b3R5cGUpID09PSBwcm90b3R5cGUgfHwgcHJvdG90eXBlID09PSBudWxsKVxuICAgICAgICByZXR1cm4gc3VwZXJDbGFzcy5wcm90b3R5cGU7XG4gICAgfVxuICAgIGlmIChzdXBlckNsYXNzID09PSBudWxsKVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICB9XG4gIGZ1bmN0aW9uIGRlZmF1bHRTdXBlckNhbGwoc2VsZiwgaG9tZU9iamVjdCwgYXJncykge1xuICAgIGlmICgkZ2V0UHJvdG90eXBlT2YoaG9tZU9iamVjdCkgIT09IG51bGwpXG4gICAgICBzdXBlckNhbGwoc2VsZiwgaG9tZU9iamVjdCwgJ2NvbnN0cnVjdG9yJywgYXJncyk7XG4gIH1cbiAgdmFyIFNUX05FV0JPUk4gPSAwO1xuICB2YXIgU1RfRVhFQ1VUSU5HID0gMTtcbiAgdmFyIFNUX1NVU1BFTkRFRCA9IDI7XG4gIHZhciBTVF9DTE9TRUQgPSAzO1xuICB2YXIgRU5EX1NUQVRFID0gLTI7XG4gIHZhciBSRVRIUk9XX1NUQVRFID0gLTM7XG4gIGZ1bmN0aW9uIGFkZEl0ZXJhdG9yKG9iamVjdCkge1xuICAgIHJldHVybiBkZWZpbmVQcm9wZXJ0eShvYmplY3QsIFN5bWJvbC5pdGVyYXRvciwgbm9uRW51bShmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0pKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRJbnRlcm5hbEVycm9yKHN0YXRlKSB7XG4gICAgcmV0dXJuIG5ldyBFcnJvcignVHJhY2V1ciBjb21waWxlciBidWc6IGludmFsaWQgc3RhdGUgaW4gc3RhdGUgbWFjaGluZTogJyArIHN0YXRlKTtcbiAgfVxuICBmdW5jdGlvbiBHZW5lcmF0b3JDb250ZXh0KCkge1xuICAgIHRoaXMuc3RhdGUgPSAwO1xuICAgIHRoaXMuR1N0YXRlID0gU1RfTkVXQk9STjtcbiAgICB0aGlzLnN0b3JlZEV4Y2VwdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmZpbmFsbHlGYWxsVGhyb3VnaCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnNlbnRfID0gdW5kZWZpbmVkO1xuICAgIHRoaXMucmV0dXJuVmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy50cnlTdGFja18gPSBbXTtcbiAgfVxuICBHZW5lcmF0b3JDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBwdXNoVHJ5OiBmdW5jdGlvbihjYXRjaFN0YXRlLCBmaW5hbGx5U3RhdGUpIHtcbiAgICAgIGlmIChmaW5hbGx5U3RhdGUgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIGZpbmFsbHlGYWxsVGhyb3VnaCA9IG51bGw7XG4gICAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeVN0YWNrXy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIGlmICh0aGlzLnRyeVN0YWNrX1tpXS5jYXRjaCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBmaW5hbGx5RmFsbFRocm91Z2ggPSB0aGlzLnRyeVN0YWNrX1tpXS5jYXRjaDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZmluYWxseUZhbGxUaHJvdWdoID09PSBudWxsKVxuICAgICAgICAgIGZpbmFsbHlGYWxsVGhyb3VnaCA9IFJFVEhST1dfU1RBVEU7XG4gICAgICAgIHRoaXMudHJ5U3RhY2tfLnB1c2goe1xuICAgICAgICAgIGZpbmFsbHk6IGZpbmFsbHlTdGF0ZSxcbiAgICAgICAgICBmaW5hbGx5RmFsbFRocm91Z2g6IGZpbmFsbHlGYWxsVGhyb3VnaFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChjYXRjaFN0YXRlICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMudHJ5U3RhY2tfLnB1c2goe2NhdGNoOiBjYXRjaFN0YXRlfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBwb3BUcnk6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy50cnlTdGFja18ucG9wKCk7XG4gICAgfSxcbiAgICBnZXQgc2VudCgpIHtcbiAgICAgIHRoaXMubWF5YmVUaHJvdygpO1xuICAgICAgcmV0dXJuIHRoaXMuc2VudF87XG4gICAgfSxcbiAgICBzZXQgc2VudCh2KSB7XG4gICAgICB0aGlzLnNlbnRfID0gdjtcbiAgICB9LFxuICAgIGdldCBzZW50SWdub3JlVGhyb3coKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZW50XztcbiAgICB9LFxuICAgIG1heWJlVGhyb3c6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuYWN0aW9uID09PSAndGhyb3cnKSB7XG4gICAgICAgIHRoaXMuYWN0aW9uID0gJ25leHQnO1xuICAgICAgICB0aHJvdyB0aGlzLnNlbnRfO1xuICAgICAgfVxuICAgIH0sXG4gICAgZW5kOiBmdW5jdGlvbigpIHtcbiAgICAgIHN3aXRjaCAodGhpcy5zdGF0ZSkge1xuICAgICAgICBjYXNlIEVORF9TVEFURTpcbiAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgY2FzZSBSRVRIUk9XX1NUQVRFOlxuICAgICAgICAgIHRocm93IHRoaXMuc3RvcmVkRXhjZXB0aW9uO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IGdldEludGVybmFsRXJyb3IodGhpcy5zdGF0ZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBmdW5jdGlvbiBnZXROZXh0T3JUaHJvdyhjdHgsIG1vdmVOZXh0LCBhY3Rpb24pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oeCkge1xuICAgICAgc3dpdGNoIChjdHguR1N0YXRlKSB7XG4gICAgICAgIGNhc2UgU1RfRVhFQ1VUSU5HOlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcigoXCJcXFwiXCIgKyBhY3Rpb24gKyBcIlxcXCIgb24gZXhlY3V0aW5nIGdlbmVyYXRvclwiKSk7XG4gICAgICAgIGNhc2UgU1RfQ0xPU0VEOlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcigoXCJcXFwiXCIgKyBhY3Rpb24gKyBcIlxcXCIgb24gY2xvc2VkIGdlbmVyYXRvclwiKSk7XG4gICAgICAgIGNhc2UgU1RfTkVXQk9STjpcbiAgICAgICAgICBpZiAoYWN0aW9uID09PSAndGhyb3cnKSB7XG4gICAgICAgICAgICBjdHguR1N0YXRlID0gU1RfQ0xPU0VEO1xuICAgICAgICAgICAgdGhyb3cgeDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHggIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRocm93ICRUeXBlRXJyb3IoJ1NlbnQgdmFsdWUgdG8gbmV3Ym9ybiBnZW5lcmF0b3InKTtcbiAgICAgICAgY2FzZSBTVF9TVVNQRU5ERUQ6XG4gICAgICAgICAgY3R4LkdTdGF0ZSA9IFNUX0VYRUNVVElORztcbiAgICAgICAgICBjdHguYWN0aW9uID0gYWN0aW9uO1xuICAgICAgICAgIGN0eC5zZW50ID0geDtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBtb3ZlTmV4dChjdHgpO1xuICAgICAgICAgIHZhciBkb25lID0gdmFsdWUgPT09IGN0eDtcbiAgICAgICAgICBpZiAoZG9uZSlcbiAgICAgICAgICAgIHZhbHVlID0gY3R4LnJldHVyblZhbHVlO1xuICAgICAgICAgIGN0eC5HU3RhdGUgPSBkb25lID8gU1RfQ0xPU0VEIDogU1RfU1VTUEVOREVEO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBkb25lOiBkb25lXG4gICAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIGdlbmVyYXRvcldyYXAoaW5uZXJGdW5jdGlvbiwgc2VsZikge1xuICAgIHZhciBtb3ZlTmV4dCA9IGdldE1vdmVOZXh0KGlubmVyRnVuY3Rpb24sIHNlbGYpO1xuICAgIHZhciBjdHggPSBuZXcgR2VuZXJhdG9yQ29udGV4dCgpO1xuICAgIHJldHVybiBhZGRJdGVyYXRvcih7XG4gICAgICBuZXh0OiBnZXROZXh0T3JUaHJvdyhjdHgsIG1vdmVOZXh0LCAnbmV4dCcpLFxuICAgICAgdGhyb3c6IGdldE5leHRPclRocm93KGN0eCwgbW92ZU5leHQsICd0aHJvdycpXG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gQXN5bmNGdW5jdGlvbkNvbnRleHQoKSB7XG4gICAgR2VuZXJhdG9yQ29udGV4dC5jYWxsKHRoaXMpO1xuICAgIHRoaXMuZXJyID0gdW5kZWZpbmVkO1xuICAgIHZhciBjdHggPSB0aGlzO1xuICAgIGN0eC5yZXN1bHQgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGN0eC5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIGN0eC5yZWplY3QgPSByZWplY3Q7XG4gICAgfSk7XG4gIH1cbiAgQXN5bmNGdW5jdGlvbkNvbnRleHQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHZW5lcmF0b3JDb250ZXh0LnByb3RvdHlwZSk7XG4gIEFzeW5jRnVuY3Rpb25Db250ZXh0LnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbigpIHtcbiAgICBzd2l0Y2ggKHRoaXMuc3RhdGUpIHtcbiAgICAgIGNhc2UgRU5EX1NUQVRFOlxuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlIFJFVEhST1dfU1RBVEU6XG4gICAgICAgIHRoaXMucmVqZWN0KHRoaXMuc3RvcmVkRXhjZXB0aW9uKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMucmVqZWN0KGdldEludGVybmFsRXJyb3IodGhpcy5zdGF0ZSkpO1xuICAgIH1cbiAgfTtcbiAgZnVuY3Rpb24gYXN5bmNXcmFwKGlubmVyRnVuY3Rpb24sIHNlbGYpIHtcbiAgICB2YXIgbW92ZU5leHQgPSBnZXRNb3ZlTmV4dChpbm5lckZ1bmN0aW9uLCBzZWxmKTtcbiAgICB2YXIgY3R4ID0gbmV3IEFzeW5jRnVuY3Rpb25Db250ZXh0KCk7XG4gICAgY3R4LmNyZWF0ZUNhbGxiYWNrID0gZnVuY3Rpb24obmV3U3RhdGUpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBjdHguc3RhdGUgPSBuZXdTdGF0ZTtcbiAgICAgICAgY3R4LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIG1vdmVOZXh0KGN0eCk7XG4gICAgICB9O1xuICAgIH07XG4gICAgY3R4LmNyZWF0ZUVycmJhY2sgPSBmdW5jdGlvbihuZXdTdGF0ZSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGVycikge1xuICAgICAgICBjdHguc3RhdGUgPSBuZXdTdGF0ZTtcbiAgICAgICAgY3R4LmVyciA9IGVycjtcbiAgICAgICAgbW92ZU5leHQoY3R4KTtcbiAgICAgIH07XG4gICAgfTtcbiAgICBtb3ZlTmV4dChjdHgpO1xuICAgIHJldHVybiBjdHgucmVzdWx0O1xuICB9XG4gIGZ1bmN0aW9uIGdldE1vdmVOZXh0KGlubmVyRnVuY3Rpb24sIHNlbGYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oY3R4KSB7XG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBpbm5lckZ1bmN0aW9uLmNhbGwoc2VsZiwgY3R4KTtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICBjdHguc3RvcmVkRXhjZXB0aW9uID0gZXg7XG4gICAgICAgICAgdmFyIGxhc3QgPSBjdHgudHJ5U3RhY2tfW2N0eC50cnlTdGFja18ubGVuZ3RoIC0gMV07XG4gICAgICAgICAgaWYgKCFsYXN0KSB7XG4gICAgICAgICAgICBjdHguR1N0YXRlID0gU1RfQ0xPU0VEO1xuICAgICAgICAgICAgY3R4LnN0YXRlID0gRU5EX1NUQVRFO1xuICAgICAgICAgICAgdGhyb3cgZXg7XG4gICAgICAgICAgfVxuICAgICAgICAgIGN0eC5zdGF0ZSA9IGxhc3QuY2F0Y2ggIT09IHVuZGVmaW5lZCA/IGxhc3QuY2F0Y2ggOiBsYXN0LmZpbmFsbHk7XG4gICAgICAgICAgaWYgKGxhc3QuZmluYWxseUZhbGxUaHJvdWdoICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBjdHguZmluYWxseUZhbGxUaHJvdWdoID0gbGFzdC5maW5hbGx5RmFsbFRocm91Z2g7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIHNldHVwR2xvYmFscyhnbG9iYWwpIHtcbiAgICBnbG9iYWwuU3ltYm9sID0gU3ltYm9sO1xuICAgIHBvbHlmaWxsT2JqZWN0KGdsb2JhbC5PYmplY3QpO1xuICB9XG4gIHNldHVwR2xvYmFscyhnbG9iYWwpO1xuICBnbG9iYWwuJHRyYWNldXJSdW50aW1lID0ge1xuICAgIGFzeW5jV3JhcDogYXN5bmNXcmFwLFxuICAgIGNyZWF0ZUNsYXNzOiBjcmVhdGVDbGFzcyxcbiAgICBkZWZhdWx0U3VwZXJDYWxsOiBkZWZhdWx0U3VwZXJDYWxsLFxuICAgIGV4cG9ydFN0YXI6IGV4cG9ydFN0YXIsXG4gICAgZ2VuZXJhdG9yV3JhcDogZ2VuZXJhdG9yV3JhcCxcbiAgICBzZXRQcm9wZXJ0eTogc2V0UHJvcGVydHksXG4gICAgc2V0dXBHbG9iYWxzOiBzZXR1cEdsb2JhbHMsXG4gICAgc3ByZWFkOiBzcHJlYWQsXG4gICAgc3VwZXJDYWxsOiBzdXBlckNhbGwsXG4gICAgc3VwZXJHZXQ6IHN1cGVyR2V0LFxuICAgIHN1cGVyU2V0OiBzdXBlclNldCxcbiAgICB0b09iamVjdDogdG9PYmplY3QsXG4gICAgdG9Qcm9wZXJ0eTogdG9Qcm9wZXJ0eSxcbiAgICB0eXBlOiB0eXBlcyxcbiAgICB0eXBlb2Y6IHR5cGVPZlxuICB9O1xufSkodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB0aGlzKTtcbihmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gYnVpbGRGcm9tRW5jb2RlZFBhcnRzKG9wdF9zY2hlbWUsIG9wdF91c2VySW5mbywgb3B0X2RvbWFpbiwgb3B0X3BvcnQsIG9wdF9wYXRoLCBvcHRfcXVlcnlEYXRhLCBvcHRfZnJhZ21lbnQpIHtcbiAgICB2YXIgb3V0ID0gW107XG4gICAgaWYgKG9wdF9zY2hlbWUpIHtcbiAgICAgIG91dC5wdXNoKG9wdF9zY2hlbWUsICc6Jyk7XG4gICAgfVxuICAgIGlmIChvcHRfZG9tYWluKSB7XG4gICAgICBvdXQucHVzaCgnLy8nKTtcbiAgICAgIGlmIChvcHRfdXNlckluZm8pIHtcbiAgICAgICAgb3V0LnB1c2gob3B0X3VzZXJJbmZvLCAnQCcpO1xuICAgICAgfVxuICAgICAgb3V0LnB1c2gob3B0X2RvbWFpbik7XG4gICAgICBpZiAob3B0X3BvcnQpIHtcbiAgICAgICAgb3V0LnB1c2goJzonLCBvcHRfcG9ydCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvcHRfcGF0aCkge1xuICAgICAgb3V0LnB1c2gob3B0X3BhdGgpO1xuICAgIH1cbiAgICBpZiAob3B0X3F1ZXJ5RGF0YSkge1xuICAgICAgb3V0LnB1c2goJz8nLCBvcHRfcXVlcnlEYXRhKTtcbiAgICB9XG4gICAgaWYgKG9wdF9mcmFnbWVudCkge1xuICAgICAgb3V0LnB1c2goJyMnLCBvcHRfZnJhZ21lbnQpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0LmpvaW4oJycpO1xuICB9XG4gIDtcbiAgdmFyIHNwbGl0UmUgPSBuZXcgUmVnRXhwKCdeJyArICcoPzonICsgJyhbXjovPyMuXSspJyArICc6KT8nICsgJyg/Oi8vJyArICcoPzooW14vPyNdKilAKT8nICsgJyhbXFxcXHdcXFxcZFxcXFwtXFxcXHUwMTAwLVxcXFx1ZmZmZi4lXSopJyArICcoPzo6KFswLTldKykpPycgKyAnKT8nICsgJyhbXj8jXSspPycgKyAnKD86XFxcXD8oW14jXSopKT8nICsgJyg/OiMoLiopKT8nICsgJyQnKTtcbiAgdmFyIENvbXBvbmVudEluZGV4ID0ge1xuICAgIFNDSEVNRTogMSxcbiAgICBVU0VSX0lORk86IDIsXG4gICAgRE9NQUlOOiAzLFxuICAgIFBPUlQ6IDQsXG4gICAgUEFUSDogNSxcbiAgICBRVUVSWV9EQVRBOiA2LFxuICAgIEZSQUdNRU5UOiA3XG4gIH07XG4gIGZ1bmN0aW9uIHNwbGl0KHVyaSkge1xuICAgIHJldHVybiAodXJpLm1hdGNoKHNwbGl0UmUpKTtcbiAgfVxuICBmdW5jdGlvbiByZW1vdmVEb3RTZWdtZW50cyhwYXRoKSB7XG4gICAgaWYgKHBhdGggPT09ICcvJylcbiAgICAgIHJldHVybiAnLyc7XG4gICAgdmFyIGxlYWRpbmdTbGFzaCA9IHBhdGhbMF0gPT09ICcvJyA/ICcvJyA6ICcnO1xuICAgIHZhciB0cmFpbGluZ1NsYXNoID0gcGF0aC5zbGljZSgtMSkgPT09ICcvJyA/ICcvJyA6ICcnO1xuICAgIHZhciBzZWdtZW50cyA9IHBhdGguc3BsaXQoJy8nKTtcbiAgICB2YXIgb3V0ID0gW107XG4gICAgdmFyIHVwID0gMDtcbiAgICBmb3IgKHZhciBwb3MgPSAwOyBwb3MgPCBzZWdtZW50cy5sZW5ndGg7IHBvcysrKSB7XG4gICAgICB2YXIgc2VnbWVudCA9IHNlZ21lbnRzW3Bvc107XG4gICAgICBzd2l0Y2ggKHNlZ21lbnQpIHtcbiAgICAgICAgY2FzZSAnJzpcbiAgICAgICAgY2FzZSAnLic6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJy4uJzpcbiAgICAgICAgICBpZiAob3V0Lmxlbmd0aClcbiAgICAgICAgICAgIG91dC5wb3AoKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB1cCsrO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIG91dC5wdXNoKHNlZ21lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWxlYWRpbmdTbGFzaCkge1xuICAgICAgd2hpbGUgKHVwLS0gPiAwKSB7XG4gICAgICAgIG91dC51bnNoaWZ0KCcuLicpO1xuICAgICAgfVxuICAgICAgaWYgKG91dC5sZW5ndGggPT09IDApXG4gICAgICAgIG91dC5wdXNoKCcuJyk7XG4gICAgfVxuICAgIHJldHVybiBsZWFkaW5nU2xhc2ggKyBvdXQuam9pbignLycpICsgdHJhaWxpbmdTbGFzaDtcbiAgfVxuICBmdW5jdGlvbiBqb2luQW5kQ2Fub25pY2FsaXplUGF0aChwYXJ0cykge1xuICAgIHZhciBwYXRoID0gcGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF0gfHwgJyc7XG4gICAgcGF0aCA9IHJlbW92ZURvdFNlZ21lbnRzKHBhdGgpO1xuICAgIHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdID0gcGF0aDtcbiAgICByZXR1cm4gYnVpbGRGcm9tRW5jb2RlZFBhcnRzKHBhcnRzW0NvbXBvbmVudEluZGV4LlNDSEVNRV0sIHBhcnRzW0NvbXBvbmVudEluZGV4LlVTRVJfSU5GT10sIHBhcnRzW0NvbXBvbmVudEluZGV4LkRPTUFJTl0sIHBhcnRzW0NvbXBvbmVudEluZGV4LlBPUlRdLCBwYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXSwgcGFydHNbQ29tcG9uZW50SW5kZXguUVVFUllfREFUQV0sIHBhcnRzW0NvbXBvbmVudEluZGV4LkZSQUdNRU5UXSk7XG4gIH1cbiAgZnVuY3Rpb24gY2Fub25pY2FsaXplVXJsKHVybCkge1xuICAgIHZhciBwYXJ0cyA9IHNwbGl0KHVybCk7XG4gICAgcmV0dXJuIGpvaW5BbmRDYW5vbmljYWxpemVQYXRoKHBhcnRzKTtcbiAgfVxuICBmdW5jdGlvbiByZXNvbHZlVXJsKGJhc2UsIHVybCkge1xuICAgIHZhciBwYXJ0cyA9IHNwbGl0KHVybCk7XG4gICAgdmFyIGJhc2VQYXJ0cyA9IHNwbGl0KGJhc2UpO1xuICAgIGlmIChwYXJ0c1tDb21wb25lbnRJbmRleC5TQ0hFTUVdKSB7XG4gICAgICByZXR1cm4gam9pbkFuZENhbm9uaWNhbGl6ZVBhdGgocGFydHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJ0c1tDb21wb25lbnRJbmRleC5TQ0hFTUVdID0gYmFzZVBhcnRzW0NvbXBvbmVudEluZGV4LlNDSEVNRV07XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSBDb21wb25lbnRJbmRleC5TQ0hFTUU7IGkgPD0gQ29tcG9uZW50SW5kZXguUE9SVDsgaSsrKSB7XG4gICAgICBpZiAoIXBhcnRzW2ldKSB7XG4gICAgICAgIHBhcnRzW2ldID0gYmFzZVBhcnRzW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF1bMF0gPT0gJy8nKSB7XG4gICAgICByZXR1cm4gam9pbkFuZENhbm9uaWNhbGl6ZVBhdGgocGFydHMpO1xuICAgIH1cbiAgICB2YXIgcGF0aCA9IGJhc2VQYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXTtcbiAgICB2YXIgaW5kZXggPSBwYXRoLmxhc3RJbmRleE9mKCcvJyk7XG4gICAgcGF0aCA9IHBhdGguc2xpY2UoMCwgaW5kZXggKyAxKSArIHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdO1xuICAgIHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdID0gcGF0aDtcbiAgICByZXR1cm4gam9pbkFuZENhbm9uaWNhbGl6ZVBhdGgocGFydHMpO1xuICB9XG4gIGZ1bmN0aW9uIGlzQWJzb2x1dGUobmFtZSkge1xuICAgIGlmICghbmFtZSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICBpZiAobmFtZVswXSA9PT0gJy8nKVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgdmFyIHBhcnRzID0gc3BsaXQobmFtZSk7XG4gICAgaWYgKHBhcnRzW0NvbXBvbmVudEluZGV4LlNDSEVNRV0pXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgJHRyYWNldXJSdW50aW1lLmNhbm9uaWNhbGl6ZVVybCA9IGNhbm9uaWNhbGl6ZVVybDtcbiAgJHRyYWNldXJSdW50aW1lLmlzQWJzb2x1dGUgPSBpc0Fic29sdXRlO1xuICAkdHJhY2V1clJ1bnRpbWUucmVtb3ZlRG90U2VnbWVudHMgPSByZW1vdmVEb3RTZWdtZW50cztcbiAgJHRyYWNldXJSdW50aW1lLnJlc29sdmVVcmwgPSByZXNvbHZlVXJsO1xufSkoKTtcbihmdW5jdGlvbihnbG9iYWwpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICB2YXIgJF9fMiA9ICR0cmFjZXVyUnVudGltZSxcbiAgICAgIGNhbm9uaWNhbGl6ZVVybCA9ICRfXzIuY2Fub25pY2FsaXplVXJsLFxuICAgICAgcmVzb2x2ZVVybCA9ICRfXzIucmVzb2x2ZVVybCxcbiAgICAgIGlzQWJzb2x1dGUgPSAkX18yLmlzQWJzb2x1dGU7XG4gIHZhciBtb2R1bGVJbnN0YW50aWF0b3JzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgdmFyIGJhc2VVUkw7XG4gIGlmIChnbG9iYWwubG9jYXRpb24gJiYgZ2xvYmFsLmxvY2F0aW9uLmhyZWYpXG4gICAgYmFzZVVSTCA9IHJlc29sdmVVcmwoZ2xvYmFsLmxvY2F0aW9uLmhyZWYsICcuLycpO1xuICBlbHNlXG4gICAgYmFzZVVSTCA9ICcnO1xuICB2YXIgVW5jb2F0ZWRNb2R1bGVFbnRyeSA9IGZ1bmN0aW9uIFVuY29hdGVkTW9kdWxlRW50cnkodXJsLCB1bmNvYXRlZE1vZHVsZSkge1xuICAgIHRoaXMudXJsID0gdXJsO1xuICAgIHRoaXMudmFsdWVfID0gdW5jb2F0ZWRNb2R1bGU7XG4gIH07XG4gICgkdHJhY2V1clJ1bnRpbWUuY3JlYXRlQ2xhc3MpKFVuY29hdGVkTW9kdWxlRW50cnksIHt9LCB7fSk7XG4gIHZhciBVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvciA9IGZ1bmN0aW9uIFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKHVybCwgZnVuYykge1xuICAgICR0cmFjZXVyUnVudGltZS5zdXBlckNhbGwodGhpcywgJFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yLnByb3RvdHlwZSwgXCJjb25zdHJ1Y3RvclwiLCBbdXJsLCBudWxsXSk7XG4gICAgdGhpcy5mdW5jID0gZnVuYztcbiAgfTtcbiAgdmFyICRVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvciA9IFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yO1xuICAoJHRyYWNldXJSdW50aW1lLmNyZWF0ZUNsYXNzKShVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvciwge2dldFVuY29hdGVkTW9kdWxlOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnZhbHVlXylcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVfO1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWVfID0gdGhpcy5mdW5jLmNhbGwoZ2xvYmFsKTtcbiAgICB9fSwge30sIFVuY29hdGVkTW9kdWxlRW50cnkpO1xuICBmdW5jdGlvbiBnZXRVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcihuYW1lKSB7XG4gICAgaWYgKCFuYW1lKVxuICAgICAgcmV0dXJuO1xuICAgIHZhciB1cmwgPSBNb2R1bGVTdG9yZS5ub3JtYWxpemUobmFtZSk7XG4gICAgcmV0dXJuIG1vZHVsZUluc3RhbnRpYXRvcnNbdXJsXTtcbiAgfVxuICA7XG4gIHZhciBtb2R1bGVJbnN0YW5jZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB2YXIgbGl2ZU1vZHVsZVNlbnRpbmVsID0ge307XG4gIGZ1bmN0aW9uIE1vZHVsZSh1bmNvYXRlZE1vZHVsZSkge1xuICAgIHZhciBpc0xpdmUgPSBhcmd1bWVudHNbMV07XG4gICAgdmFyIGNvYXRlZE1vZHVsZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModW5jb2F0ZWRNb2R1bGUpLmZvckVhY2goKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciBnZXR0ZXIsXG4gICAgICAgICAgdmFsdWU7XG4gICAgICBpZiAoaXNMaXZlID09PSBsaXZlTW9kdWxlU2VudGluZWwpIHtcbiAgICAgICAgdmFyIGRlc2NyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih1bmNvYXRlZE1vZHVsZSwgbmFtZSk7XG4gICAgICAgIGlmIChkZXNjci5nZXQpXG4gICAgICAgICAgZ2V0dGVyID0gZGVzY3IuZ2V0O1xuICAgICAgfVxuICAgICAgaWYgKCFnZXR0ZXIpIHtcbiAgICAgICAgdmFsdWUgPSB1bmNvYXRlZE1vZHVsZVtuYW1lXTtcbiAgICAgICAgZ2V0dGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvYXRlZE1vZHVsZSwgbmFtZSwge1xuICAgICAgICBnZXQ6IGdldHRlcixcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSkpO1xuICAgIE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyhjb2F0ZWRNb2R1bGUpO1xuICAgIHJldHVybiBjb2F0ZWRNb2R1bGU7XG4gIH1cbiAgdmFyIE1vZHVsZVN0b3JlID0ge1xuICAgIG5vcm1hbGl6ZTogZnVuY3Rpb24obmFtZSwgcmVmZXJlck5hbWUsIHJlZmVyZXJBZGRyZXNzKSB7XG4gICAgICBpZiAodHlwZW9mIG5hbWUgIT09IFwic3RyaW5nXCIpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJtb2R1bGUgbmFtZSBtdXN0IGJlIGEgc3RyaW5nLCBub3QgXCIgKyB0eXBlb2YgbmFtZSk7XG4gICAgICBpZiAoaXNBYnNvbHV0ZShuYW1lKSlcbiAgICAgICAgcmV0dXJuIGNhbm9uaWNhbGl6ZVVybChuYW1lKTtcbiAgICAgIGlmICgvW15cXC5dXFwvXFwuXFwuXFwvLy50ZXN0KG5hbWUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbW9kdWxlIG5hbWUgZW1iZWRzIC8uLi86ICcgKyBuYW1lKTtcbiAgICAgIH1cbiAgICAgIGlmIChuYW1lWzBdID09PSAnLicgJiYgcmVmZXJlck5hbWUpXG4gICAgICAgIHJldHVybiByZXNvbHZlVXJsKHJlZmVyZXJOYW1lLCBuYW1lKTtcbiAgICAgIHJldHVybiBjYW5vbmljYWxpemVVcmwobmFtZSk7XG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKG5vcm1hbGl6ZWROYW1lKSB7XG4gICAgICB2YXIgbSA9IGdldFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKG5vcm1hbGl6ZWROYW1lKTtcbiAgICAgIGlmICghbSlcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIHZhciBtb2R1bGVJbnN0YW5jZSA9IG1vZHVsZUluc3RhbmNlc1ttLnVybF07XG4gICAgICBpZiAobW9kdWxlSW5zdGFuY2UpXG4gICAgICAgIHJldHVybiBtb2R1bGVJbnN0YW5jZTtcbiAgICAgIG1vZHVsZUluc3RhbmNlID0gTW9kdWxlKG0uZ2V0VW5jb2F0ZWRNb2R1bGUoKSwgbGl2ZU1vZHVsZVNlbnRpbmVsKTtcbiAgICAgIHJldHVybiBtb2R1bGVJbnN0YW5jZXNbbS51cmxdID0gbW9kdWxlSW5zdGFuY2U7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKG5vcm1hbGl6ZWROYW1lLCBtb2R1bGUpIHtcbiAgICAgIG5vcm1hbGl6ZWROYW1lID0gU3RyaW5nKG5vcm1hbGl6ZWROYW1lKTtcbiAgICAgIG1vZHVsZUluc3RhbnRpYXRvcnNbbm9ybWFsaXplZE5hbWVdID0gbmV3IFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKG5vcm1hbGl6ZWROYW1lLCAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgICB9KSk7XG4gICAgICBtb2R1bGVJbnN0YW5jZXNbbm9ybWFsaXplZE5hbWVdID0gbW9kdWxlO1xuICAgIH0sXG4gICAgZ2V0IGJhc2VVUkwoKSB7XG4gICAgICByZXR1cm4gYmFzZVVSTDtcbiAgICB9LFxuICAgIHNldCBiYXNlVVJMKHYpIHtcbiAgICAgIGJhc2VVUkwgPSBTdHJpbmcodik7XG4gICAgfSxcbiAgICByZWdpc3Rlck1vZHVsZTogZnVuY3Rpb24obmFtZSwgZnVuYykge1xuICAgICAgdmFyIG5vcm1hbGl6ZWROYW1lID0gTW9kdWxlU3RvcmUubm9ybWFsaXplKG5hbWUpO1xuICAgICAgaWYgKG1vZHVsZUluc3RhbnRpYXRvcnNbbm9ybWFsaXplZE5hbWVdKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2R1cGxpY2F0ZSBtb2R1bGUgbmFtZWQgJyArIG5vcm1hbGl6ZWROYW1lKTtcbiAgICAgIG1vZHVsZUluc3RhbnRpYXRvcnNbbm9ybWFsaXplZE5hbWVdID0gbmV3IFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKG5vcm1hbGl6ZWROYW1lLCBmdW5jKTtcbiAgICB9LFxuICAgIGJ1bmRsZVN0b3JlOiBPYmplY3QuY3JlYXRlKG51bGwpLFxuICAgIHJlZ2lzdGVyOiBmdW5jdGlvbihuYW1lLCBkZXBzLCBmdW5jKSB7XG4gICAgICBpZiAoIWRlcHMgfHwgIWRlcHMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJNb2R1bGUobmFtZSwgZnVuYyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmJ1bmRsZVN0b3JlW25hbWVdID0ge1xuICAgICAgICAgIGRlcHM6IGRlcHMsXG4gICAgICAgICAgZXhlY3V0ZTogZnVuY1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0QW5vbnltb3VzTW9kdWxlOiBmdW5jdGlvbihmdW5jKSB7XG4gICAgICByZXR1cm4gbmV3IE1vZHVsZShmdW5jLmNhbGwoZ2xvYmFsKSwgbGl2ZU1vZHVsZVNlbnRpbmVsKTtcbiAgICB9LFxuICAgIGdldEZvclRlc3Rpbmc6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciAkX18wID0gdGhpcztcbiAgICAgIGlmICghdGhpcy50ZXN0aW5nUHJlZml4Xykge1xuICAgICAgICBPYmplY3Qua2V5cyhtb2R1bGVJbnN0YW5jZXMpLnNvbWUoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgIHZhciBtID0gLyh0cmFjZXVyQFteXFwvXSpcXC8pLy5leGVjKGtleSk7XG4gICAgICAgICAgaWYgKG0pIHtcbiAgICAgICAgICAgICRfXzAudGVzdGluZ1ByZWZpeF8gPSBtWzFdO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5nZXQodGhpcy50ZXN0aW5nUHJlZml4XyArIG5hbWUpO1xuICAgIH1cbiAgfTtcbiAgTW9kdWxlU3RvcmUuc2V0KCdAdHJhY2V1ci9zcmMvcnVudGltZS9Nb2R1bGVTdG9yZScsIG5ldyBNb2R1bGUoe01vZHVsZVN0b3JlOiBNb2R1bGVTdG9yZX0pKTtcbiAgdmFyIHNldHVwR2xvYmFscyA9ICR0cmFjZXVyUnVudGltZS5zZXR1cEdsb2JhbHM7XG4gICR0cmFjZXVyUnVudGltZS5zZXR1cEdsb2JhbHMgPSBmdW5jdGlvbihnbG9iYWwpIHtcbiAgICBzZXR1cEdsb2JhbHMoZ2xvYmFsKTtcbiAgfTtcbiAgJHRyYWNldXJSdW50aW1lLk1vZHVsZVN0b3JlID0gTW9kdWxlU3RvcmU7XG4gIGdsb2JhbC5TeXN0ZW0gPSB7XG4gICAgcmVnaXN0ZXI6IE1vZHVsZVN0b3JlLnJlZ2lzdGVyLmJpbmQoTW9kdWxlU3RvcmUpLFxuICAgIGdldDogTW9kdWxlU3RvcmUuZ2V0LFxuICAgIHNldDogTW9kdWxlU3RvcmUuc2V0LFxuICAgIG5vcm1hbGl6ZTogTW9kdWxlU3RvcmUubm9ybWFsaXplXG4gIH07XG4gICR0cmFjZXVyUnVudGltZS5nZXRNb2R1bGVJbXBsID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBpbnN0YW50aWF0b3IgPSBnZXRVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcihuYW1lKTtcbiAgICByZXR1cm4gaW5zdGFudGlhdG9yICYmIGluc3RhbnRpYXRvci5nZXRVbmNvYXRlZE1vZHVsZSgpO1xuICB9O1xufSkodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB0aGlzKTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3V0aWxzXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3V0aWxzXCI7XG4gIHZhciB0b09iamVjdCA9ICR0cmFjZXVyUnVudGltZS50b09iamVjdDtcbiAgZnVuY3Rpb24gdG9VaW50MzIoeCkge1xuICAgIHJldHVybiB4IHwgMDtcbiAgfVxuICByZXR1cm4ge1xuICAgIGdldCB0b09iamVjdCgpIHtcbiAgICAgIHJldHVybiB0b09iamVjdDtcbiAgICB9LFxuICAgIGdldCB0b1VpbnQzMigpIHtcbiAgICAgIHJldHVybiB0b1VpbnQzMjtcbiAgICB9XG4gIH07XG59KTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL0FycmF5SXRlcmF0b3JcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyICRfXzQ7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL0FycmF5SXRlcmF0b3JcIjtcbiAgdmFyICRfXzUgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvdXRpbHNcIiksXG4gICAgICB0b09iamVjdCA9ICRfXzUudG9PYmplY3QsXG4gICAgICB0b1VpbnQzMiA9ICRfXzUudG9VaW50MzI7XG4gIHZhciBBUlJBWV9JVEVSQVRPUl9LSU5EX0tFWVMgPSAxO1xuICB2YXIgQVJSQVlfSVRFUkFUT1JfS0lORF9WQUxVRVMgPSAyO1xuICB2YXIgQVJSQVlfSVRFUkFUT1JfS0lORF9FTlRSSUVTID0gMztcbiAgdmFyIEFycmF5SXRlcmF0b3IgPSBmdW5jdGlvbiBBcnJheUl0ZXJhdG9yKCkge307XG4gICgkdHJhY2V1clJ1bnRpbWUuY3JlYXRlQ2xhc3MpKEFycmF5SXRlcmF0b3IsICgkX180ID0ge30sIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSgkX180LCBcIm5leHRcIiwge1xuICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpdGVyYXRvciA9IHRvT2JqZWN0KHRoaXMpO1xuICAgICAgdmFyIGFycmF5ID0gaXRlcmF0b3IuaXRlcmF0b3JPYmplY3RfO1xuICAgICAgaWYgKCFhcnJheSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QgaXMgbm90IGFuIEFycmF5SXRlcmF0b3InKTtcbiAgICAgIH1cbiAgICAgIHZhciBpbmRleCA9IGl0ZXJhdG9yLmFycmF5SXRlcmF0b3JOZXh0SW5kZXhfO1xuICAgICAgdmFyIGl0ZW1LaW5kID0gaXRlcmF0b3IuYXJyYXlJdGVyYXRpb25LaW5kXztcbiAgICAgIHZhciBsZW5ndGggPSB0b1VpbnQzMihhcnJheS5sZW5ndGgpO1xuICAgICAgaWYgKGluZGV4ID49IGxlbmd0aCkge1xuICAgICAgICBpdGVyYXRvci5hcnJheUl0ZXJhdG9yTmV4dEluZGV4XyA9IEluZmluaXR5O1xuICAgICAgICByZXR1cm4gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QodW5kZWZpbmVkLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIGl0ZXJhdG9yLmFycmF5SXRlcmF0b3JOZXh0SW5kZXhfID0gaW5kZXggKyAxO1xuICAgICAgaWYgKGl0ZW1LaW5kID09IEFSUkFZX0lURVJBVE9SX0tJTkRfVkFMVUVTKVxuICAgICAgICByZXR1cm4gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QoYXJyYXlbaW5kZXhdLCBmYWxzZSk7XG4gICAgICBpZiAoaXRlbUtpbmQgPT0gQVJSQVlfSVRFUkFUT1JfS0lORF9FTlRSSUVTKVxuICAgICAgICByZXR1cm4gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QoW2luZGV4LCBhcnJheVtpbmRleF1dLCBmYWxzZSk7XG4gICAgICByZXR1cm4gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QoaW5kZXgsIGZhbHNlKTtcbiAgICB9LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlXG4gIH0pLCBPYmplY3QuZGVmaW5lUHJvcGVydHkoJF9fNCwgU3ltYm9sLml0ZXJhdG9yLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZVxuICB9KSwgJF9fNCksIHt9KTtcbiAgZnVuY3Rpb24gY3JlYXRlQXJyYXlJdGVyYXRvcihhcnJheSwga2luZCkge1xuICAgIHZhciBvYmplY3QgPSB0b09iamVjdChhcnJheSk7XG4gICAgdmFyIGl0ZXJhdG9yID0gbmV3IEFycmF5SXRlcmF0b3I7XG4gICAgaXRlcmF0b3IuaXRlcmF0b3JPYmplY3RfID0gb2JqZWN0O1xuICAgIGl0ZXJhdG9yLmFycmF5SXRlcmF0b3JOZXh0SW5kZXhfID0gMDtcbiAgICBpdGVyYXRvci5hcnJheUl0ZXJhdGlvbktpbmRfID0ga2luZDtcbiAgICByZXR1cm4gaXRlcmF0b3I7XG4gIH1cbiAgZnVuY3Rpb24gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QodmFsdWUsIGRvbmUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZG9uZTogZG9uZVxuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gZW50cmllcygpIHtcbiAgICByZXR1cm4gY3JlYXRlQXJyYXlJdGVyYXRvcih0aGlzLCBBUlJBWV9JVEVSQVRPUl9LSU5EX0VOVFJJRVMpO1xuICB9XG4gIGZ1bmN0aW9uIGtleXMoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUFycmF5SXRlcmF0b3IodGhpcywgQVJSQVlfSVRFUkFUT1JfS0lORF9LRVlTKTtcbiAgfVxuICBmdW5jdGlvbiB2YWx1ZXMoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUFycmF5SXRlcmF0b3IodGhpcywgQVJSQVlfSVRFUkFUT1JfS0lORF9WQUxVRVMpO1xuICB9XG4gIHJldHVybiB7XG4gICAgZ2V0IGVudHJpZXMoKSB7XG4gICAgICByZXR1cm4gZW50cmllcztcbiAgICB9LFxuICAgIGdldCBrZXlzKCkge1xuICAgICAgcmV0dXJuIGtleXM7XG4gICAgfSxcbiAgICBnZXQgdmFsdWVzKCkge1xuICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICB9XG4gIH07XG59KTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuMzIvbm9kZV9tb2R1bGVzL3JzdnAvbGliL3JzdnAvYXNhcFwiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL25vZGVfbW9kdWxlcy9yc3ZwL2xpYi9yc3ZwL2FzYXBcIjtcbiAgdmFyICRfX2RlZmF1bHQgPSBmdW5jdGlvbiBhc2FwKGNhbGxiYWNrLCBhcmcpIHtcbiAgICB2YXIgbGVuZ3RoID0gcXVldWUucHVzaChbY2FsbGJhY2ssIGFyZ10pO1xuICAgIGlmIChsZW5ndGggPT09IDEpIHtcbiAgICAgIHNjaGVkdWxlRmx1c2goKTtcbiAgICB9XG4gIH07XG4gIHZhciBicm93c2VyR2xvYmFsID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSA/IHdpbmRvdyA6IHt9O1xuICB2YXIgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPSBicm93c2VyR2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgYnJvd3Nlckdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuICBmdW5jdGlvbiB1c2VOZXh0VGljaygpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIHVzZU11dGF0aW9uT2JzZXJ2ZXIoKSB7XG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIHZhciBvYnNlcnZlciA9IG5ldyBCcm93c2VyTXV0YXRpb25PYnNlcnZlcihmbHVzaCk7XG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7Y2hhcmFjdGVyRGF0YTogdHJ1ZX0pO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIG5vZGUuZGF0YSA9IChpdGVyYXRpb25zID0gKytpdGVyYXRpb25zICUgMik7XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiB1c2VTZXRUaW1lb3V0KCkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHNldFRpbWVvdXQoZmx1c2gsIDEpO1xuICAgIH07XG4gIH1cbiAgdmFyIHF1ZXVlID0gW107XG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB0dXBsZSA9IHF1ZXVlW2ldO1xuICAgICAgdmFyIGNhbGxiYWNrID0gdHVwbGVbMF0sXG4gICAgICAgICAgYXJnID0gdHVwbGVbMV07XG4gICAgICBjYWxsYmFjayhhcmcpO1xuICAgIH1cbiAgICBxdWV1ZSA9IFtdO1xuICB9XG4gIHZhciBzY2hlZHVsZUZsdXNoO1xuICBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHt9LnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJykge1xuICAgIHNjaGVkdWxlRmx1c2ggPSB1c2VOZXh0VGljaygpO1xuICB9IGVsc2UgaWYgKEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKSB7XG4gICAgc2NoZWR1bGVGbHVzaCA9IHVzZU11dGF0aW9uT2JzZXJ2ZXIoKTtcbiAgfSBlbHNlIHtcbiAgICBzY2hlZHVsZUZsdXNoID0gdXNlU2V0VGltZW91dCgpO1xuICB9XG4gIHJldHVybiB7Z2V0IGRlZmF1bHQoKSB7XG4gICAgICByZXR1cm4gJF9fZGVmYXVsdDtcbiAgICB9fTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvUHJvbWlzZVwiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9Qcm9taXNlXCI7XG4gIHZhciBhc3luYyA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL25vZGVfbW9kdWxlcy9yc3ZwL2xpYi9yc3ZwL2FzYXBcIikuZGVmYXVsdDtcbiAgZnVuY3Rpb24gaXNQcm9taXNlKHgpIHtcbiAgICByZXR1cm4geCAmJiB0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeC5zdGF0dXNfICE9PSB1bmRlZmluZWQ7XG4gIH1cbiAgZnVuY3Rpb24gY2hhaW4ocHJvbWlzZSkge1xuICAgIHZhciBvblJlc29sdmUgPSBhcmd1bWVudHNbMV0gIT09ICh2b2lkIDApID8gYXJndW1lbnRzWzFdIDogKGZ1bmN0aW9uKHgpIHtcbiAgICAgIHJldHVybiB4O1xuICAgIH0pO1xuICAgIHZhciBvblJlamVjdCA9IGFyZ3VtZW50c1syXSAhPT0gKHZvaWQgMCkgPyBhcmd1bWVudHNbMl0gOiAoZnVuY3Rpb24oZSkge1xuICAgICAgdGhyb3cgZTtcbiAgICB9KTtcbiAgICB2YXIgZGVmZXJyZWQgPSBnZXREZWZlcnJlZChwcm9taXNlLmNvbnN0cnVjdG9yKTtcbiAgICBzd2l0Y2ggKHByb21pc2Uuc3RhdHVzXykge1xuICAgICAgY2FzZSB1bmRlZmluZWQ6XG4gICAgICAgIHRocm93IFR5cGVFcnJvcjtcbiAgICAgIGNhc2UgJ3BlbmRpbmcnOlxuICAgICAgICBwcm9taXNlLm9uUmVzb2x2ZV8ucHVzaChbZGVmZXJyZWQsIG9uUmVzb2x2ZV0pO1xuICAgICAgICBwcm9taXNlLm9uUmVqZWN0Xy5wdXNoKFtkZWZlcnJlZCwgb25SZWplY3RdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZXNvbHZlZCc6XG4gICAgICAgIHByb21pc2VSZWFjdChkZWZlcnJlZCwgb25SZXNvbHZlLCBwcm9taXNlLnZhbHVlXyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVqZWN0ZWQnOlxuICAgICAgICBwcm9taXNlUmVhY3QoZGVmZXJyZWQsIG9uUmVqZWN0LCBwcm9taXNlLnZhbHVlXyk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfVxuICBmdW5jdGlvbiBnZXREZWZlcnJlZChDKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHJlc3VsdC5wcm9taXNlID0gbmV3IEMoKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmVzdWx0LnJlc29sdmUgPSByZXNvbHZlO1xuICAgICAgcmVzdWx0LnJlamVjdCA9IHJlamVjdDtcbiAgICB9KSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICB2YXIgUHJvbWlzZSA9IGZ1bmN0aW9uIFByb21pc2UocmVzb2x2ZXIpIHtcbiAgICB2YXIgJF9fNiA9IHRoaXM7XG4gICAgdGhpcy5zdGF0dXNfID0gJ3BlbmRpbmcnO1xuICAgIHRoaXMub25SZXNvbHZlXyA9IFtdO1xuICAgIHRoaXMub25SZWplY3RfID0gW107XG4gICAgcmVzb2x2ZXIoKGZ1bmN0aW9uKHgpIHtcbiAgICAgIHByb21pc2VSZXNvbHZlKCRfXzYsIHgpO1xuICAgIH0pLCAoZnVuY3Rpb24ocikge1xuICAgICAgcHJvbWlzZVJlamVjdCgkX182LCByKTtcbiAgICB9KSk7XG4gIH07XG4gICgkdHJhY2V1clJ1bnRpbWUuY3JlYXRlQ2xhc3MpKFByb21pc2UsIHtcbiAgICBjYXRjaDogZnVuY3Rpb24ob25SZWplY3QpIHtcbiAgICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdCk7XG4gICAgfSxcbiAgICB0aGVuOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvblJlc29sdmUgPSBhcmd1bWVudHNbMF0gIT09ICh2b2lkIDApID8gYXJndW1lbnRzWzBdIDogKGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgICB9KTtcbiAgICAgIHZhciBvblJlamVjdCA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIHZhciAkX182ID0gdGhpcztcbiAgICAgIHZhciBjb25zdHJ1Y3RvciA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICByZXR1cm4gY2hhaW4odGhpcywgKGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgeCA9IHByb21pc2VDb2VyY2UoY29uc3RydWN0b3IsIHgpO1xuICAgICAgICByZXR1cm4geCA9PT0gJF9fNiA/IG9uUmVqZWN0KG5ldyBUeXBlRXJyb3IpIDogaXNQcm9taXNlKHgpID8geC50aGVuKG9uUmVzb2x2ZSwgb25SZWplY3QpIDogb25SZXNvbHZlKHgpO1xuICAgICAgfSksIG9uUmVqZWN0KTtcbiAgICB9XG4gIH0sIHtcbiAgICByZXNvbHZlOiBmdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4gbmV3IHRoaXMoKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZXNvbHZlKHgpO1xuICAgICAgfSkpO1xuICAgIH0sXG4gICAgcmVqZWN0OiBmdW5jdGlvbihyKSB7XG4gICAgICByZXR1cm4gbmV3IHRoaXMoKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZWplY3Qocik7XG4gICAgICB9KSk7XG4gICAgfSxcbiAgICBjYXN0OiBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoeCBpbnN0YW5jZW9mIHRoaXMpXG4gICAgICAgIHJldHVybiB4O1xuICAgICAgaWYgKGlzUHJvbWlzZSh4KSkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gZ2V0RGVmZXJyZWQodGhpcyk7XG4gICAgICAgIGNoYWluKHgsIHJlc3VsdC5yZXNvbHZlLCByZXN1bHQucmVqZWN0KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5wcm9taXNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMucmVzb2x2ZSh4KTtcbiAgICB9LFxuICAgIGFsbDogZnVuY3Rpb24odmFsdWVzKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSBnZXREZWZlcnJlZCh0aGlzKTtcbiAgICAgIHZhciBjb3VudCA9IDA7XG4gICAgICB2YXIgcmVzb2x1dGlvbnMgPSBbXTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgKytjb3VudDtcbiAgICAgICAgICB0aGlzLmNhc3QodmFsdWVzW2ldKS50aGVuKGZ1bmN0aW9uKGksIHgpIHtcbiAgICAgICAgICAgIHJlc29sdXRpb25zW2ldID0geDtcbiAgICAgICAgICAgIGlmICgtLWNvdW50ID09PSAwKVxuICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc29sdXRpb25zKTtcbiAgICAgICAgICB9LmJpbmQodW5kZWZpbmVkLCBpKSwgKGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgICAgIGlmIChjb3VudCA+IDApXG4gICAgICAgICAgICAgIGNvdW50ID0gMDtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChyKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvdW50ID09PSAwKVxuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzb2x1dGlvbnMpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9LFxuICAgIHJhY2U6IGZ1bmN0aW9uKHZhbHVlcykge1xuICAgICAgdmFyIGRlZmVycmVkID0gZ2V0RGVmZXJyZWQodGhpcyk7XG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHRoaXMuY2FzdCh2YWx1ZXNbaV0pLnRoZW4oKGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoeCk7XG4gICAgICAgICAgfSksIChmdW5jdGlvbihyKSB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3Qocik7XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH1cbiAgfSk7XG4gIGZ1bmN0aW9uIHByb21pc2VSZXNvbHZlKHByb21pc2UsIHgpIHtcbiAgICBwcm9taXNlRG9uZShwcm9taXNlLCAncmVzb2x2ZWQnLCB4LCBwcm9taXNlLm9uUmVzb2x2ZV8pO1xuICB9XG4gIGZ1bmN0aW9uIHByb21pc2VSZWplY3QocHJvbWlzZSwgcikge1xuICAgIHByb21pc2VEb25lKHByb21pc2UsICdyZWplY3RlZCcsIHIsIHByb21pc2Uub25SZWplY3RfKTtcbiAgfVxuICBmdW5jdGlvbiBwcm9taXNlRG9uZShwcm9taXNlLCBzdGF0dXMsIHZhbHVlLCByZWFjdGlvbnMpIHtcbiAgICBpZiAocHJvbWlzZS5zdGF0dXNfICE9PSAncGVuZGluZycpXG4gICAgICByZXR1cm47XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZWFjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHByb21pc2VSZWFjdChyZWFjdGlvbnNbaV1bMF0sIHJlYWN0aW9uc1tpXVsxXSwgdmFsdWUpO1xuICAgIH1cbiAgICBwcm9taXNlLnN0YXR1c18gPSBzdGF0dXM7XG4gICAgcHJvbWlzZS52YWx1ZV8gPSB2YWx1ZTtcbiAgICBwcm9taXNlLm9uUmVzb2x2ZV8gPSBwcm9taXNlLm9uUmVqZWN0XyA9IHVuZGVmaW5lZDtcbiAgfVxuICBmdW5jdGlvbiBwcm9taXNlUmVhY3QoZGVmZXJyZWQsIGhhbmRsZXIsIHgpIHtcbiAgICBhc3luYygoZnVuY3Rpb24oKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgeSA9IGhhbmRsZXIoeCk7XG4gICAgICAgIGlmICh5ID09PSBkZWZlcnJlZC5wcm9taXNlKVxuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3I7XG4gICAgICAgIGVsc2UgaWYgKGlzUHJvbWlzZSh5KSlcbiAgICAgICAgICBjaGFpbih5LCBkZWZlcnJlZC5yZXNvbHZlLCBkZWZlcnJlZC5yZWplY3QpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh5KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgICAgfVxuICAgIH0pKTtcbiAgfVxuICB2YXIgdGhlbmFibGVTeW1ib2wgPSAnQEB0aGVuYWJsZSc7XG4gIGZ1bmN0aW9uIHByb21pc2VDb2VyY2UoY29uc3RydWN0b3IsIHgpIHtcbiAgICBpZiAoaXNQcm9taXNlKHgpKSB7XG4gICAgICByZXR1cm4geDtcbiAgICB9IGVsc2UgaWYgKHggJiYgdHlwZW9mIHgudGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFyIHAgPSB4W3RoZW5hYmxlU3ltYm9sXTtcbiAgICAgIGlmIChwKSB7XG4gICAgICAgIHJldHVybiBwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gZ2V0RGVmZXJyZWQoY29uc3RydWN0b3IpO1xuICAgICAgICB4W3RoZW5hYmxlU3ltYm9sXSA9IGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgeC50aGVuKGRlZmVycmVkLnJlc29sdmUsIGRlZmVycmVkLnJlamVjdCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgfVxuICByZXR1cm4ge2dldCBQcm9taXNlKCkge1xuICAgICAgcmV0dXJuIFByb21pc2U7XG4gICAgfX07XG59KTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1N0cmluZ1wiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9TdHJpbmdcIjtcbiAgdmFyICR0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG4gIHZhciAkaW5kZXhPZiA9IFN0cmluZy5wcm90b3R5cGUuaW5kZXhPZjtcbiAgdmFyICRsYXN0SW5kZXhPZiA9IFN0cmluZy5wcm90b3R5cGUubGFzdEluZGV4T2Y7XG4gIGZ1bmN0aW9uIHN0YXJ0c1dpdGgoc2VhcmNoKSB7XG4gICAgdmFyIHN0cmluZyA9IFN0cmluZyh0aGlzKTtcbiAgICBpZiAodGhpcyA9PSBudWxsIHx8ICR0b1N0cmluZy5jYWxsKHNlYXJjaCkgPT0gJ1tvYmplY3QgUmVnRXhwXScpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICB2YXIgc3RyaW5nTGVuZ3RoID0gc3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgc2VhcmNoU3RyaW5nID0gU3RyaW5nKHNlYXJjaCk7XG4gICAgdmFyIHNlYXJjaExlbmd0aCA9IHNlYXJjaFN0cmluZy5sZW5ndGg7XG4gICAgdmFyIHBvc2l0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gICAgdmFyIHBvcyA9IHBvc2l0aW9uID8gTnVtYmVyKHBvc2l0aW9uKSA6IDA7XG4gICAgaWYgKGlzTmFOKHBvcykpIHtcbiAgICAgIHBvcyA9IDA7XG4gICAgfVxuICAgIHZhciBzdGFydCA9IE1hdGgubWluKE1hdGgubWF4KHBvcywgMCksIHN0cmluZ0xlbmd0aCk7XG4gICAgcmV0dXJuICRpbmRleE9mLmNhbGwoc3RyaW5nLCBzZWFyY2hTdHJpbmcsIHBvcykgPT0gc3RhcnQ7XG4gIH1cbiAgZnVuY3Rpb24gZW5kc1dpdGgoc2VhcmNoKSB7XG4gICAgdmFyIHN0cmluZyA9IFN0cmluZyh0aGlzKTtcbiAgICBpZiAodGhpcyA9PSBudWxsIHx8ICR0b1N0cmluZy5jYWxsKHNlYXJjaCkgPT0gJ1tvYmplY3QgUmVnRXhwXScpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICB2YXIgc3RyaW5nTGVuZ3RoID0gc3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgc2VhcmNoU3RyaW5nID0gU3RyaW5nKHNlYXJjaCk7XG4gICAgdmFyIHNlYXJjaExlbmd0aCA9IHNlYXJjaFN0cmluZy5sZW5ndGg7XG4gICAgdmFyIHBvcyA9IHN0cmluZ0xlbmd0aDtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIHZhciBwb3NpdGlvbiA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChwb3NpdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHBvcyA9IHBvc2l0aW9uID8gTnVtYmVyKHBvc2l0aW9uKSA6IDA7XG4gICAgICAgIGlmIChpc05hTihwb3MpKSB7XG4gICAgICAgICAgcG9zID0gMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB2YXIgZW5kID0gTWF0aC5taW4oTWF0aC5tYXgocG9zLCAwKSwgc3RyaW5nTGVuZ3RoKTtcbiAgICB2YXIgc3RhcnQgPSBlbmQgLSBzZWFyY2hMZW5ndGg7XG4gICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gJGxhc3RJbmRleE9mLmNhbGwoc3RyaW5nLCBzZWFyY2hTdHJpbmcsIHN0YXJ0KSA9PSBzdGFydDtcbiAgfVxuICBmdW5jdGlvbiBjb250YWlucyhzZWFyY2gpIHtcbiAgICBpZiAodGhpcyA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICB9XG4gICAgdmFyIHN0cmluZyA9IFN0cmluZyh0aGlzKTtcbiAgICB2YXIgc3RyaW5nTGVuZ3RoID0gc3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgc2VhcmNoU3RyaW5nID0gU3RyaW5nKHNlYXJjaCk7XG4gICAgdmFyIHNlYXJjaExlbmd0aCA9IHNlYXJjaFN0cmluZy5sZW5ndGg7XG4gICAgdmFyIHBvc2l0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gICAgdmFyIHBvcyA9IHBvc2l0aW9uID8gTnVtYmVyKHBvc2l0aW9uKSA6IDA7XG4gICAgaWYgKGlzTmFOKHBvcykpIHtcbiAgICAgIHBvcyA9IDA7XG4gICAgfVxuICAgIHZhciBzdGFydCA9IE1hdGgubWluKE1hdGgubWF4KHBvcywgMCksIHN0cmluZ0xlbmd0aCk7XG4gICAgcmV0dXJuICRpbmRleE9mLmNhbGwoc3RyaW5nLCBzZWFyY2hTdHJpbmcsIHBvcykgIT0gLTE7XG4gIH1cbiAgZnVuY3Rpb24gcmVwZWF0KGNvdW50KSB7XG4gICAgaWYgKHRoaXMgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIHZhciBzdHJpbmcgPSBTdHJpbmcodGhpcyk7XG4gICAgdmFyIG4gPSBjb3VudCA/IE51bWJlcihjb3VudCkgOiAwO1xuICAgIGlmIChpc05hTihuKSkge1xuICAgICAgbiA9IDA7XG4gICAgfVxuICAgIGlmIChuIDwgMCB8fCBuID09IEluZmluaXR5KSB7XG4gICAgICB0aHJvdyBSYW5nZUVycm9yKCk7XG4gICAgfVxuICAgIGlmIChuID09IDApIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIHdoaWxlIChuLS0pIHtcbiAgICAgIHJlc3VsdCArPSBzdHJpbmc7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZnVuY3Rpb24gY29kZVBvaW50QXQocG9zaXRpb24pIHtcbiAgICBpZiAodGhpcyA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICB9XG4gICAgdmFyIHN0cmluZyA9IFN0cmluZyh0aGlzKTtcbiAgICB2YXIgc2l6ZSA9IHN0cmluZy5sZW5ndGg7XG4gICAgdmFyIGluZGV4ID0gcG9zaXRpb24gPyBOdW1iZXIocG9zaXRpb24pIDogMDtcbiAgICBpZiAoaXNOYU4oaW5kZXgpKSB7XG4gICAgICBpbmRleCA9IDA7XG4gICAgfVxuICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gc2l6ZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdmFyIGZpcnN0ID0gc3RyaW5nLmNoYXJDb2RlQXQoaW5kZXgpO1xuICAgIHZhciBzZWNvbmQ7XG4gICAgaWYgKGZpcnN0ID49IDB4RDgwMCAmJiBmaXJzdCA8PSAweERCRkYgJiYgc2l6ZSA+IGluZGV4ICsgMSkge1xuICAgICAgc2Vjb25kID0gc3RyaW5nLmNoYXJDb2RlQXQoaW5kZXggKyAxKTtcbiAgICAgIGlmIChzZWNvbmQgPj0gMHhEQzAwICYmIHNlY29uZCA8PSAweERGRkYpIHtcbiAgICAgICAgcmV0dXJuIChmaXJzdCAtIDB4RDgwMCkgKiAweDQwMCArIHNlY29uZCAtIDB4REMwMCArIDB4MTAwMDA7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmaXJzdDtcbiAgfVxuICBmdW5jdGlvbiByYXcoY2FsbHNpdGUpIHtcbiAgICB2YXIgcmF3ID0gY2FsbHNpdGUucmF3O1xuICAgIHZhciBsZW4gPSByYXcubGVuZ3RoID4+PiAwO1xuICAgIGlmIChsZW4gPT09IDApXG4gICAgICByZXR1cm4gJyc7XG4gICAgdmFyIHMgPSAnJztcbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIHMgKz0gcmF3W2ldO1xuICAgICAgaWYgKGkgKyAxID09PSBsZW4pXG4gICAgICAgIHJldHVybiBzO1xuICAgICAgcyArPSBhcmd1bWVudHNbKytpXTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gZnJvbUNvZGVQb2ludCgpIHtcbiAgICB2YXIgY29kZVVuaXRzID0gW107XG4gICAgdmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbiAgICB2YXIgaGlnaFN1cnJvZ2F0ZTtcbiAgICB2YXIgbG93U3Vycm9nYXRlO1xuICAgIHZhciBpbmRleCA9IC0xO1xuICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGlmICghbGVuZ3RoKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICB2YXIgY29kZVBvaW50ID0gTnVtYmVyKGFyZ3VtZW50c1tpbmRleF0pO1xuICAgICAgaWYgKCFpc0Zpbml0ZShjb2RlUG9pbnQpIHx8IGNvZGVQb2ludCA8IDAgfHwgY29kZVBvaW50ID4gMHgxMEZGRkYgfHwgZmxvb3IoY29kZVBvaW50KSAhPSBjb2RlUG9pbnQpIHtcbiAgICAgICAgdGhyb3cgUmFuZ2VFcnJvcignSW52YWxpZCBjb2RlIHBvaW50OiAnICsgY29kZVBvaW50KTtcbiAgICAgIH1cbiAgICAgIGlmIChjb2RlUG9pbnQgPD0gMHhGRkZGKSB7XG4gICAgICAgIGNvZGVVbml0cy5wdXNoKGNvZGVQb2ludCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb2RlUG9pbnQgLT0gMHgxMDAwMDtcbiAgICAgICAgaGlnaFN1cnJvZ2F0ZSA9IChjb2RlUG9pbnQgPj4gMTApICsgMHhEODAwO1xuICAgICAgICBsb3dTdXJyb2dhdGUgPSAoY29kZVBvaW50ICUgMHg0MDApICsgMHhEQzAwO1xuICAgICAgICBjb2RlVW5pdHMucHVzaChoaWdoU3Vycm9nYXRlLCBsb3dTdXJyb2dhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBjb2RlVW5pdHMpO1xuICB9XG4gIHJldHVybiB7XG4gICAgZ2V0IHN0YXJ0c1dpdGgoKSB7XG4gICAgICByZXR1cm4gc3RhcnRzV2l0aDtcbiAgICB9LFxuICAgIGdldCBlbmRzV2l0aCgpIHtcbiAgICAgIHJldHVybiBlbmRzV2l0aDtcbiAgICB9LFxuICAgIGdldCBjb250YWlucygpIHtcbiAgICAgIHJldHVybiBjb250YWlucztcbiAgICB9LFxuICAgIGdldCByZXBlYXQoKSB7XG4gICAgICByZXR1cm4gcmVwZWF0O1xuICAgIH0sXG4gICAgZ2V0IGNvZGVQb2ludEF0KCkge1xuICAgICAgcmV0dXJuIGNvZGVQb2ludEF0O1xuICAgIH0sXG4gICAgZ2V0IHJhdygpIHtcbiAgICAgIHJldHVybiByYXc7XG4gICAgfSxcbiAgICBnZXQgZnJvbUNvZGVQb2ludCgpIHtcbiAgICAgIHJldHVybiBmcm9tQ29kZVBvaW50O1xuICAgIH1cbiAgfTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvcG9seWZpbGxzXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3BvbHlmaWxsc1wiO1xuICB2YXIgUHJvbWlzZSA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9Qcm9taXNlXCIpLlByb21pc2U7XG4gIHZhciAkX185ID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1N0cmluZ1wiKSxcbiAgICAgIGNvZGVQb2ludEF0ID0gJF9fOS5jb2RlUG9pbnRBdCxcbiAgICAgIGNvbnRhaW5zID0gJF9fOS5jb250YWlucyxcbiAgICAgIGVuZHNXaXRoID0gJF9fOS5lbmRzV2l0aCxcbiAgICAgIGZyb21Db2RlUG9pbnQgPSAkX185LmZyb21Db2RlUG9pbnQsXG4gICAgICByZXBlYXQgPSAkX185LnJlcGVhdCxcbiAgICAgIHJhdyA9ICRfXzkucmF3LFxuICAgICAgc3RhcnRzV2l0aCA9ICRfXzkuc3RhcnRzV2l0aDtcbiAgdmFyICRfXzkgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvQXJyYXlJdGVyYXRvclwiKSxcbiAgICAgIGVudHJpZXMgPSAkX185LmVudHJpZXMsXG4gICAgICBrZXlzID0gJF9fOS5rZXlzLFxuICAgICAgdmFsdWVzID0gJF9fOS52YWx1ZXM7XG4gIGZ1bmN0aW9uIG1heWJlRGVmaW5lTWV0aG9kKG9iamVjdCwgbmFtZSwgdmFsdWUpIHtcbiAgICBpZiAoIShuYW1lIGluIG9iamVjdCkpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIG1heWJlQWRkRnVuY3Rpb25zKG9iamVjdCwgZnVuY3Rpb25zKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmdW5jdGlvbnMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIHZhciBuYW1lID0gZnVuY3Rpb25zW2ldO1xuICAgICAgdmFyIHZhbHVlID0gZnVuY3Rpb25zW2kgKyAxXTtcbiAgICAgIG1heWJlRGVmaW5lTWV0aG9kKG9iamVjdCwgbmFtZSwgdmFsdWUpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbFByb21pc2UoZ2xvYmFsKSB7XG4gICAgaWYgKCFnbG9iYWwuUHJvbWlzZSlcbiAgICAgIGdsb2JhbC5Qcm9taXNlID0gUHJvbWlzZTtcbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbFN0cmluZyhTdHJpbmcpIHtcbiAgICBtYXliZUFkZEZ1bmN0aW9ucyhTdHJpbmcucHJvdG90eXBlLCBbJ2NvZGVQb2ludEF0JywgY29kZVBvaW50QXQsICdjb250YWlucycsIGNvbnRhaW5zLCAnZW5kc1dpdGgnLCBlbmRzV2l0aCwgJ3N0YXJ0c1dpdGgnLCBzdGFydHNXaXRoLCAncmVwZWF0JywgcmVwZWF0XSk7XG4gICAgbWF5YmVBZGRGdW5jdGlvbnMoU3RyaW5nLCBbJ2Zyb21Db2RlUG9pbnQnLCBmcm9tQ29kZVBvaW50LCAncmF3JywgcmF3XSk7XG4gIH1cbiAgZnVuY3Rpb24gcG9seWZpbGxBcnJheShBcnJheSwgU3ltYm9sKSB7XG4gICAgbWF5YmVBZGRGdW5jdGlvbnMoQXJyYXkucHJvdG90eXBlLCBbJ2VudHJpZXMnLCBlbnRyaWVzLCAna2V5cycsIGtleXMsICd2YWx1ZXMnLCB2YWx1ZXNdKTtcbiAgICBpZiAoU3ltYm9sICYmIFN5bWJvbC5pdGVyYXRvcikge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFycmF5LnByb3RvdHlwZSwgU3ltYm9sLml0ZXJhdG9yLCB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZXMsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gcG9seWZpbGwoZ2xvYmFsKSB7XG4gICAgcG9seWZpbGxQcm9taXNlKGdsb2JhbCk7XG4gICAgcG9seWZpbGxTdHJpbmcoZ2xvYmFsLlN0cmluZyk7XG4gICAgcG9seWZpbGxBcnJheShnbG9iYWwuQXJyYXksIGdsb2JhbC5TeW1ib2wpO1xuICB9XG4gIHBvbHlmaWxsKHRoaXMpO1xuICB2YXIgc2V0dXBHbG9iYWxzID0gJHRyYWNldXJSdW50aW1lLnNldHVwR2xvYmFscztcbiAgJHRyYWNldXJSdW50aW1lLnNldHVwR2xvYmFscyA9IGZ1bmN0aW9uKGdsb2JhbCkge1xuICAgIHNldHVwR2xvYmFscyhnbG9iYWwpO1xuICAgIHBvbHlmaWxsKGdsb2JhbCk7XG4gIH07XG4gIHJldHVybiB7fTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbC1pbXBvcnRcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbC1pbXBvcnRcIjtcbiAgdmFyICRfXzExID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3BvbHlmaWxsc1wiKTtcbiAgcmV0dXJuIHt9O1xufSk7XG5TeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbC1pbXBvcnRcIiArICcnKTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvaW5zZXJ0LW1vZHVsZS1nbG9iYWxzL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy50ZXN0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWxzZTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgdHlwZXMgPSBbXG4gICAgcmVxdWlyZShcIi4vbmV4dFRpY2tcIiksXG4gICAgcmVxdWlyZShcIi4vbXV0YXRpb25cIiksXG4gICAgcmVxdWlyZShcIi4vcG9zdE1lc3NhZ2VcIiksXG4gICAgcmVxdWlyZShcIi4vbWVzc2FnZUNoYW5uZWxcIiksXG4gICAgcmVxdWlyZShcIi4vc3RhdGVDaGFuZ2VcIiksXG4gICAgcmVxdWlyZShcIi4vdGltZW91dFwiKVxuXTtcbnZhciBoYW5kbGVyUXVldWUgPSBbXTtcbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICB0YXNrLFxuICAgICAgICBpbm5lclF1ZXVlID0gaGFuZGxlclF1ZXVlO1xuXHRoYW5kbGVyUXVldWUgPSBbXTtcblx0Lypqc2xpbnQgYm9zczogdHJ1ZSAqL1xuXHR3aGlsZSAodGFzayA9IGlubmVyUXVldWVbaSsrXSkge1xuXHRcdHRhc2soKTtcblx0fVxufVxudmFyIG5leHRUaWNrO1xudmFyIGkgPSAtMTtcbnZhciBsZW4gPSB0eXBlcy5sZW5ndGg7XG53aGlsZSAoKysgaSA8IGxlbikge1xuICAgIGlmICh0eXBlc1tpXS50ZXN0KCkpIHtcbiAgICAgICAgbmV4dFRpY2sgPSB0eXBlc1tpXS5pbnN0YWxsKGRyYWluUXVldWUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0YXNrKSB7XG4gICAgdmFyIGxlbiwgaSwgYXJncztcbiAgICB2YXIgblRhc2sgPSB0YXNrO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSAmJiB0eXBlb2YgdGFzayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgICAgICBpID0gMDtcbiAgICAgICAgd2hpbGUgKCsraSA8IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgICAgIG5UYXNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGFzay5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBpZiAoKGxlbiA9IGhhbmRsZXJRdWV1ZS5wdXNoKG5UYXNrKSkgPT09IDEpIHtcbiAgICAgICAgbmV4dFRpY2soZHJhaW5RdWV1ZSk7XG4gICAgfVxuICAgIHJldHVybiBsZW47XG59O1xubW9kdWxlLmV4cG9ydHMuY2xlYXIgPSBmdW5jdGlvbiAobikge1xuICAgIGlmIChuIDw9IGhhbmRsZXJRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgaGFuZGxlclF1ZXVlW24gLSAxXSA9IGZ1bmN0aW9uICgpIHt9O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG5cInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy50ZXN0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0eXBlb2YgZ2xvYmFsLk1lc3NhZ2VDaGFubmVsICE9PSBcInVuZGVmaW5lZFwiO1xufTtcblxuZXhwb3J0cy5pbnN0YWxsID0gZnVuY3Rpb24gKGZ1bmMpIHtcbiAgICB2YXIgY2hhbm5lbCA9IG5ldyBnbG9iYWwuTWVzc2FnZUNoYW5uZWwoKTtcbiAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGZ1bmM7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZSgwKTtcbiAgICB9O1xufTtcbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuXCJ1c2Ugc3RyaWN0XCI7XG4vL2Jhc2VkIG9mZiByc3ZwXG4vL2h0dHBzOi8vZ2l0aHViLmNvbS90aWxkZWlvL3JzdnAuanMvYmxvYi9tYXN0ZXIvbGliL3JzdnAvYXN5bmMuanNcblxudmFyIE11dGF0aW9uT2JzZXJ2ZXIgPSBnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcblxuZXhwb3J0cy50ZXN0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBNdXRhdGlvbk9ic2VydmVyO1xufTtcblxuZXhwb3J0cy5pbnN0YWxsID0gZnVuY3Rpb24gKGhhbmRsZSkge1xuICAgIHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGhhbmRsZSk7XG4gICAgdmFyIGVsZW1lbnQgPSBnbG9iYWwuZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQsIHsgYXR0cmlidXRlczogdHJ1ZSB9KTtcblxuICAgIC8vIENocm9tZSBNZW1vcnkgTGVhazogaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTkzNjYxXG4gICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJ1bmxvYWRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgIG9ic2VydmVyID0gbnVsbDtcbiAgICB9LCBmYWxzZSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkcmFpblF1ZXVlXCIsIFwiZHJhaW5RdWV1ZVwiKTtcbiAgICB9O1xufTtcbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLnRlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gVGhlIHRlc3QgYWdhaW5zdCBgaW1wb3J0U2NyaXB0c2AgcHJldmVudHMgdGhpcyBpbXBsZW1lbnRhdGlvbiBmcm9tIGJlaW5nIGluc3RhbGxlZCBpbnNpZGUgYSB3ZWIgd29ya2VyLFxuICAgIC8vIHdoZXJlIGBnbG9iYWwucG9zdE1lc3NhZ2VgIG1lYW5zIHNvbWV0aGluZyBjb21wbGV0ZWx5IGRpZmZlcmVudCBhbmQgY2FuXCJ0IGJlIHVzZWQgZm9yIHRoaXMgcHVycG9zZS5cblxuICAgIGlmICghZ2xvYmFsLnBvc3RNZXNzYWdlIHx8IGdsb2JhbC5pbXBvcnRTY3JpcHRzKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyA9IHRydWU7XG4gICAgdmFyIG9sZE9uTWVzc2FnZSA9IGdsb2JhbC5vbm1lc3NhZ2U7XG4gICAgZ2xvYmFsLm9ubWVzc2FnZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyA9IGZhbHNlO1xuICAgIH07XG4gICAgZ2xvYmFsLnBvc3RNZXNzYWdlKFwiXCIsIFwiKlwiKTtcbiAgICBnbG9iYWwub25tZXNzYWdlID0gb2xkT25NZXNzYWdlO1xuXG4gICAgcmV0dXJuIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXM7XG59O1xuXG5leHBvcnRzLmluc3RhbGwgPSBmdW5jdGlvbiAoZnVuYykge1xuICAgIHZhciBjb2RlV29yZCA9IFwiY29tLmNhbHZpbm1ldGNhbGYuc2V0SW1tZWRpYXRlXCIgKyBNYXRoLnJhbmRvbSgpO1xuICAgIGZ1bmN0aW9uIGdsb2JhbE1lc3NhZ2UoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PT0gZ2xvYmFsICYmIGV2ZW50LmRhdGEgPT09IGNvZGVXb3JkKSB7XG4gICAgICAgICAgICBmdW5jKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBnbG9iYWxNZXNzYWdlLCBmYWxzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZ2xvYmFsLmF0dGFjaEV2ZW50KFwib25tZXNzYWdlXCIsIGdsb2JhbE1lc3NhZ2UpO1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoY29kZVdvcmQsIFwiKlwiKTtcbiAgICB9O1xufTtcbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMudGVzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gXCJkb2N1bWVudFwiIGluIGdsb2JhbCAmJiBcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiIGluIGdsb2JhbC5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xufTtcblxuZXhwb3J0cy5pbnN0YWxsID0gZnVuY3Rpb24gKGhhbmRsZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgLy8gQ3JlYXRlIGEgPHNjcmlwdD4gZWxlbWVudDsgaXRzIHJlYWR5c3RhdGVjaGFuZ2UgZXZlbnQgd2lsbCBiZSBmaXJlZCBhc3luY2hyb25vdXNseSBvbmNlIGl0IGlzIGluc2VydGVkXG4gICAgICAgIC8vIGludG8gdGhlIGRvY3VtZW50LiBEbyBzbywgdGh1cyBxdWV1aW5nIHVwIHRoZSB0YXNrLiBSZW1lbWJlciB0byBjbGVhbiB1cCBvbmNlIGl0J3MgYmVlbiBjYWxsZWQuXG4gICAgICAgIHZhciBzY3JpcHRFbCA9IGdsb2JhbC5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgICAgICBzY3JpcHRFbC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBoYW5kbGUoKTtcblxuICAgICAgICAgICAgc2NyaXB0RWwub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcbiAgICAgICAgICAgIHNjcmlwdEVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0RWwpO1xuICAgICAgICAgICAgc2NyaXB0RWwgPSBudWxsO1xuICAgICAgICB9O1xuICAgICAgICBnbG9iYWwuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKHNjcmlwdEVsKTtcblxuICAgICAgICByZXR1cm4gaGFuZGxlO1xuICAgIH07XG59O1xufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMudGVzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cbmV4cG9ydHMuaW5zdGFsbCA9IGZ1bmN0aW9uICh0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2V0VGltZW91dCh0LCAwKTtcbiAgICB9O1xufTsiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4hZnVuY3Rpb24oZSl7aWYoXCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMpbW9kdWxlLmV4cG9ydHM9ZSgpO2Vsc2UgaWYoXCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kKWRlZmluZShlKTtlbHNle3ZhciBmO1widW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/Zj13aW5kb3c6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGdsb2JhbD9mPWdsb2JhbDpcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZiYmKGY9c2VsZiksZi5qYWRlPWUoKX19KGZ1bmN0aW9uKCl7dmFyIGRlZmluZSxtb2R1bGUsZXhwb3J0cztyZXR1cm4gKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkoezE6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIE1lcmdlIHR3byBhdHRyaWJ1dGUgb2JqZWN0cyBnaXZpbmcgcHJlY2VkZW5jZVxuICogdG8gdmFsdWVzIGluIG9iamVjdCBgYmAuIENsYXNzZXMgYXJlIHNwZWNpYWwtY2FzZWRcbiAqIGFsbG93aW5nIGZvciBhcnJheXMgYW5kIG1lcmdpbmcvam9pbmluZyBhcHByb3ByaWF0ZWx5XG4gKiByZXN1bHRpbmcgaW4gYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGFcbiAqIEBwYXJhbSB7T2JqZWN0fSBiXG4gKiBAcmV0dXJuIHtPYmplY3R9IGFcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMubWVyZ2UgPSBmdW5jdGlvbiBtZXJnZShhLCBiKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgdmFyIGF0dHJzID0gYVswXTtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGF0dHJzID0gbWVyZ2UoYXR0cnMsIGFbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gYXR0cnM7XG4gIH1cbiAgdmFyIGFjID0gYVsnY2xhc3MnXTtcbiAgdmFyIGJjID0gYlsnY2xhc3MnXTtcblxuICBpZiAoYWMgfHwgYmMpIHtcbiAgICBhYyA9IGFjIHx8IFtdO1xuICAgIGJjID0gYmMgfHwgW107XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFjKSkgYWMgPSBbYWNdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShiYykpIGJjID0gW2JjXTtcbiAgICBhWydjbGFzcyddID0gYWMuY29uY2F0KGJjKS5maWx0ZXIobnVsbHMpO1xuICB9XG5cbiAgZm9yICh2YXIga2V5IGluIGIpIHtcbiAgICBpZiAoa2V5ICE9ICdjbGFzcycpIHtcbiAgICAgIGFba2V5XSA9IGJba2V5XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYTtcbn07XG5cbi8qKlxuICogRmlsdGVyIG51bGwgYHZhbGBzLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbnVsbHModmFsKSB7XG4gIHJldHVybiB2YWwgIT0gbnVsbCAmJiB2YWwgIT09ICcnO1xufVxuXG4vKipcbiAqIGpvaW4gYXJyYXkgYXMgY2xhc3Nlcy5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmpvaW5DbGFzc2VzID0gam9pbkNsYXNzZXM7XG5mdW5jdGlvbiBqb2luQ2xhc3Nlcyh2YWwpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsKSA/IHZhbC5tYXAoam9pbkNsYXNzZXMpLmZpbHRlcihudWxscykuam9pbignICcpIDogdmFsO1xufVxuXG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gY2xhc3Nlcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBjbGFzc2VzXG4gKiBAcGFyYW0ge0FycmF5LjxCb29sZWFuPn0gZXNjYXBlZFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmNscyA9IGZ1bmN0aW9uIGNscyhjbGFzc2VzLCBlc2NhcGVkKSB7XG4gIHZhciBidWYgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGVzY2FwZWQgJiYgZXNjYXBlZFtpXSkge1xuICAgICAgYnVmLnB1c2goZXhwb3J0cy5lc2NhcGUoam9pbkNsYXNzZXMoW2NsYXNzZXNbaV1dKSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBidWYucHVzaChqb2luQ2xhc3NlcyhjbGFzc2VzW2ldKSk7XG4gICAgfVxuICB9XG4gIHZhciB0ZXh0ID0gam9pbkNsYXNzZXMoYnVmKTtcbiAgaWYgKHRleHQubGVuZ3RoKSB7XG4gICAgcmV0dXJuICcgY2xhc3M9XCInICsgdGV4dCArICdcIic7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG59O1xuXG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gYXR0cmlidXRlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWxcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZXNjYXBlZFxuICogQHBhcmFtIHtCb29sZWFufSB0ZXJzZVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmF0dHIgPSBmdW5jdGlvbiBhdHRyKGtleSwgdmFsLCBlc2NhcGVkLCB0ZXJzZSkge1xuICBpZiAoJ2Jvb2xlYW4nID09IHR5cGVvZiB2YWwgfHwgbnVsbCA9PSB2YWwpIHtcbiAgICBpZiAodmFsKSB7XG4gICAgICByZXR1cm4gJyAnICsgKHRlcnNlID8ga2V5IDoga2V5ICsgJz1cIicgKyBrZXkgKyAnXCInKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfSBlbHNlIGlmICgwID09IGtleS5pbmRleE9mKCdkYXRhJykgJiYgJ3N0cmluZycgIT0gdHlwZW9mIHZhbCkge1xuICAgIHJldHVybiAnICcgKyBrZXkgKyBcIj0nXCIgKyBKU09OLnN0cmluZ2lmeSh2YWwpLnJlcGxhY2UoLycvZywgJyZhcG9zOycpICsgXCInXCI7XG4gIH0gZWxzZSBpZiAoZXNjYXBlZCkge1xuICAgIHJldHVybiAnICcgKyBrZXkgKyAnPVwiJyArIGV4cG9ydHMuZXNjYXBlKHZhbCkgKyAnXCInO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnICcgKyBrZXkgKyAnPVwiJyArIHZhbCArICdcIic7XG4gIH1cbn07XG5cbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBhdHRyaWJ1dGVzIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge09iamVjdH0gZXNjYXBlZFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmF0dHJzID0gZnVuY3Rpb24gYXR0cnMob2JqLCB0ZXJzZSl7XG4gIHZhciBidWYgPSBbXTtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG5cbiAgaWYgKGtleXMubGVuZ3RoKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXVxuICAgICAgICAsIHZhbCA9IG9ialtrZXldO1xuXG4gICAgICBpZiAoJ2NsYXNzJyA9PSBrZXkpIHtcbiAgICAgICAgaWYgKHZhbCA9IGpvaW5DbGFzc2VzKHZhbCkpIHtcbiAgICAgICAgICBidWYucHVzaCgnICcgKyBrZXkgKyAnPVwiJyArIHZhbCArICdcIicpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBidWYucHVzaChleHBvcnRzLmF0dHIoa2V5LCB2YWwsIGZhbHNlLCB0ZXJzZSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWYuam9pbignJyk7XG59O1xuXG4vKipcbiAqIEVzY2FwZSB0aGUgZ2l2ZW4gc3RyaW5nIG9mIGBodG1sYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaHRtbFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5lc2NhcGUgPSBmdW5jdGlvbiBlc2NhcGUoaHRtbCl7XG4gIHZhciByZXN1bHQgPSBTdHJpbmcoaHRtbClcbiAgICAucmVwbGFjZSgvJi9nLCAnJmFtcDsnKVxuICAgIC5yZXBsYWNlKC88L2csICcmbHQ7JylcbiAgICAucmVwbGFjZSgvPi9nLCAnJmd0OycpXG4gICAgLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKTtcbiAgaWYgKHJlc3VsdCA9PT0gJycgKyBodG1sKSByZXR1cm4gaHRtbDtcbiAgZWxzZSByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiBSZS10aHJvdyB0aGUgZ2l2ZW4gYGVycmAgaW4gY29udGV4dCB0byB0aGVcbiAqIHRoZSBqYWRlIGluIGBmaWxlbmFtZWAgYXQgdGhlIGdpdmVuIGBsaW5lbm9gLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVyclxuICogQHBhcmFtIHtTdHJpbmd9IGZpbGVuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gbGluZW5vXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLnJldGhyb3cgPSBmdW5jdGlvbiByZXRocm93KGVyciwgZmlsZW5hbWUsIGxpbmVubywgc3RyKXtcbiAgaWYgKCEoZXJyIGluc3RhbmNlb2YgRXJyb3IpKSB0aHJvdyBlcnI7XG4gIGlmICgodHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyB8fCAhZmlsZW5hbWUpICYmICFzdHIpIHtcbiAgICBlcnIubWVzc2FnZSArPSAnIG9uIGxpbmUgJyArIGxpbmVubztcbiAgICB0aHJvdyBlcnI7XG4gIH1cbiAgdHJ5IHtcbiAgICBzdHIgPSAgc3RyIHx8IF9kZXJlcV8oJ2ZzJykucmVhZEZpbGVTeW5jKGZpbGVuYW1lLCAndXRmOCcpXG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgcmV0aHJvdyhlcnIsIG51bGwsIGxpbmVubylcbiAgfVxuICB2YXIgY29udGV4dCA9IDNcbiAgICAsIGxpbmVzID0gc3RyLnNwbGl0KCdcXG4nKVxuICAgICwgc3RhcnQgPSBNYXRoLm1heChsaW5lbm8gLSBjb250ZXh0LCAwKVxuICAgICwgZW5kID0gTWF0aC5taW4obGluZXMubGVuZ3RoLCBsaW5lbm8gKyBjb250ZXh0KTtcblxuICAvLyBFcnJvciBjb250ZXh0XG4gIHZhciBjb250ZXh0ID0gbGluZXMuc2xpY2Uoc3RhcnQsIGVuZCkubWFwKGZ1bmN0aW9uKGxpbmUsIGkpe1xuICAgIHZhciBjdXJyID0gaSArIHN0YXJ0ICsgMTtcbiAgICByZXR1cm4gKGN1cnIgPT0gbGluZW5vID8gJyAgPiAnIDogJyAgICAnKVxuICAgICAgKyBjdXJyXG4gICAgICArICd8ICdcbiAgICAgICsgbGluZTtcbiAgfSkuam9pbignXFxuJyk7XG5cbiAgLy8gQWx0ZXIgZXhjZXB0aW9uIG1lc3NhZ2VcbiAgZXJyLnBhdGggPSBmaWxlbmFtZTtcbiAgZXJyLm1lc3NhZ2UgPSAoZmlsZW5hbWUgfHwgJ0phZGUnKSArICc6JyArIGxpbmVub1xuICAgICsgJ1xcbicgKyBjb250ZXh0ICsgJ1xcblxcbicgKyBlcnIubWVzc2FnZTtcbiAgdGhyb3cgZXJyO1xufTtcblxufSx7XCJmc1wiOjJ9XSwyOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcblxufSx7fV19LHt9LFsxXSlcbigxKVxufSk7XG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoQnVmZmVyKXtcbi8vICAgICB1dWlkLmpzXG4vL1xuLy8gICAgIENvcHlyaWdodCAoYykgMjAxMC0yMDEyIFJvYmVydCBLaWVmZmVyXG4vLyAgICAgTUlUIExpY2Vuc2UgLSBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cbihmdW5jdGlvbigpIHtcbiAgdmFyIF9nbG9iYWwgPSB0aGlzO1xuXG4gIC8vIFVuaXF1ZSBJRCBjcmVhdGlvbiByZXF1aXJlcyBhIGhpZ2ggcXVhbGl0eSByYW5kb20gIyBnZW5lcmF0b3IuICBXZSBmZWF0dXJlXG4gIC8vIGRldGVjdCB0byBkZXRlcm1pbmUgdGhlIGJlc3QgUk5HIHNvdXJjZSwgbm9ybWFsaXppbmcgdG8gYSBmdW5jdGlvbiB0aGF0XG4gIC8vIHJldHVybnMgMTI4LWJpdHMgb2YgcmFuZG9tbmVzcywgc2luY2UgdGhhdCdzIHdoYXQncyB1c3VhbGx5IHJlcXVpcmVkXG4gIHZhciBfcm5nO1xuXG4gIC8vIE5vZGUuanMgY3J5cHRvLWJhc2VkIFJORyAtIGh0dHA6Ly9ub2RlanMub3JnL2RvY3MvdjAuNi4yL2FwaS9jcnlwdG8uaHRtbFxuICAvL1xuICAvLyBNb2RlcmF0ZWx5IGZhc3QsIGhpZ2ggcXVhbGl0eVxuICBpZiAodHlwZW9mKHJlcXVpcmUpID09ICdmdW5jdGlvbicpIHtcbiAgICB0cnkge1xuICAgICAgdmFyIF9yYiA9IHJlcXVpcmUoJ2NyeXB0bycpLnJhbmRvbUJ5dGVzO1xuICAgICAgX3JuZyA9IF9yYiAmJiBmdW5jdGlvbigpIHtyZXR1cm4gX3JiKDE2KTt9O1xuICAgIH0gY2F0Y2goZSkge31cbiAgfVxuXG4gIGlmICghX3JuZyAmJiBfZ2xvYmFsLmNyeXB0byAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgLy8gV0hBVFdHIGNyeXB0by1iYXNlZCBSTkcgLSBodHRwOi8vd2lraS53aGF0d2cub3JnL3dpa2kvQ3J5cHRvXG4gICAgLy9cbiAgICAvLyBNb2RlcmF0ZWx5IGZhc3QsIGhpZ2ggcXVhbGl0eVxuICAgIHZhciBfcm5kczggPSBuZXcgVWludDhBcnJheSgxNik7XG4gICAgX3JuZyA9IGZ1bmN0aW9uIHdoYXR3Z1JORygpIHtcbiAgICAgIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMoX3JuZHM4KTtcbiAgICAgIHJldHVybiBfcm5kczg7XG4gICAgfTtcbiAgfVxuXG4gIGlmICghX3JuZykge1xuICAgIC8vIE1hdGgucmFuZG9tKCktYmFzZWQgKFJORylcbiAgICAvL1xuICAgIC8vIElmIGFsbCBlbHNlIGZhaWxzLCB1c2UgTWF0aC5yYW5kb20oKS4gIEl0J3MgZmFzdCwgYnV0IGlzIG9mIHVuc3BlY2lmaWVkXG4gICAgLy8gcXVhbGl0eS5cbiAgICB2YXIgIF9ybmRzID0gbmV3IEFycmF5KDE2KTtcbiAgICBfcm5nID0gZnVuY3Rpb24oKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgcjsgaSA8IDE2OyBpKyspIHtcbiAgICAgICAgaWYgKChpICYgMHgwMykgPT09IDApIHIgPSBNYXRoLnJhbmRvbSgpICogMHgxMDAwMDAwMDA7XG4gICAgICAgIF9ybmRzW2ldID0gciA+Pj4gKChpICYgMHgwMykgPDwgMykgJiAweGZmO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gX3JuZHM7XG4gICAgfTtcbiAgfVxuXG4gIC8vIEJ1ZmZlciBjbGFzcyB0byB1c2VcbiAgdmFyIEJ1ZmZlckNsYXNzID0gdHlwZW9mKEJ1ZmZlcikgPT0gJ2Z1bmN0aW9uJyA/IEJ1ZmZlciA6IEFycmF5O1xuXG4gIC8vIE1hcHMgZm9yIG51bWJlciA8LT4gaGV4IHN0cmluZyBjb252ZXJzaW9uXG4gIHZhciBfYnl0ZVRvSGV4ID0gW107XG4gIHZhciBfaGV4VG9CeXRlID0ge307XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyBpKyspIHtcbiAgICBfYnl0ZVRvSGV4W2ldID0gKGkgKyAweDEwMCkudG9TdHJpbmcoMTYpLnN1YnN0cigxKTtcbiAgICBfaGV4VG9CeXRlW19ieXRlVG9IZXhbaV1dID0gaTtcbiAgfVxuXG4gIC8vICoqYHBhcnNlKClgIC0gUGFyc2UgYSBVVUlEIGludG8gaXQncyBjb21wb25lbnQgYnl0ZXMqKlxuICBmdW5jdGlvbiBwYXJzZShzLCBidWYsIG9mZnNldCkge1xuICAgIHZhciBpID0gKGJ1ZiAmJiBvZmZzZXQpIHx8IDAsIGlpID0gMDtcblxuICAgIGJ1ZiA9IGJ1ZiB8fCBbXTtcbiAgICBzLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvWzAtOWEtZl17Mn0vZywgZnVuY3Rpb24ob2N0KSB7XG4gICAgICBpZiAoaWkgPCAxNikgeyAvLyBEb24ndCBvdmVyZmxvdyFcbiAgICAgICAgYnVmW2kgKyBpaSsrXSA9IF9oZXhUb0J5dGVbb2N0XTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFplcm8gb3V0IHJlbWFpbmluZyBieXRlcyBpZiBzdHJpbmcgd2FzIHNob3J0XG4gICAgd2hpbGUgKGlpIDwgMTYpIHtcbiAgICAgIGJ1ZltpICsgaWkrK10gPSAwO1xuICAgIH1cblxuICAgIHJldHVybiBidWY7XG4gIH1cblxuICAvLyAqKmB1bnBhcnNlKClgIC0gQ29udmVydCBVVUlEIGJ5dGUgYXJyYXkgKGFsYSBwYXJzZSgpKSBpbnRvIGEgc3RyaW5nKipcbiAgZnVuY3Rpb24gdW5wYXJzZShidWYsIG9mZnNldCkge1xuICAgIHZhciBpID0gb2Zmc2V0IHx8IDAsIGJ0aCA9IF9ieXRlVG9IZXg7XG4gICAgcmV0dXJuICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXTtcbiAgfVxuXG4gIC8vICoqYHYxKClgIC0gR2VuZXJhdGUgdGltZS1iYXNlZCBVVUlEKipcbiAgLy9cbiAgLy8gSW5zcGlyZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL0xpb3NLL1VVSUQuanNcbiAgLy8gYW5kIGh0dHA6Ly9kb2NzLnB5dGhvbi5vcmcvbGlicmFyeS91dWlkLmh0bWxcblxuICAvLyByYW5kb20gIydzIHdlIG5lZWQgdG8gaW5pdCBub2RlIGFuZCBjbG9ja3NlcVxuICB2YXIgX3NlZWRCeXRlcyA9IF9ybmcoKTtcblxuICAvLyBQZXIgNC41LCBjcmVhdGUgYW5kIDQ4LWJpdCBub2RlIGlkLCAoNDcgcmFuZG9tIGJpdHMgKyBtdWx0aWNhc3QgYml0ID0gMSlcbiAgdmFyIF9ub2RlSWQgPSBbXG4gICAgX3NlZWRCeXRlc1swXSB8IDB4MDEsXG4gICAgX3NlZWRCeXRlc1sxXSwgX3NlZWRCeXRlc1syXSwgX3NlZWRCeXRlc1szXSwgX3NlZWRCeXRlc1s0XSwgX3NlZWRCeXRlc1s1XVxuICBdO1xuXG4gIC8vIFBlciA0LjIuMiwgcmFuZG9taXplICgxNCBiaXQpIGNsb2Nrc2VxXG4gIHZhciBfY2xvY2tzZXEgPSAoX3NlZWRCeXRlc1s2XSA8PCA4IHwgX3NlZWRCeXRlc1s3XSkgJiAweDNmZmY7XG5cbiAgLy8gUHJldmlvdXMgdXVpZCBjcmVhdGlvbiB0aW1lXG4gIHZhciBfbGFzdE1TZWNzID0gMCwgX2xhc3ROU2VjcyA9IDA7XG5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9icm9vZmEvbm9kZS11dWlkIGZvciBBUEkgZGV0YWlsc1xuICBmdW5jdGlvbiB2MShvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICAgIHZhciBpID0gYnVmICYmIG9mZnNldCB8fCAwO1xuICAgIHZhciBiID0gYnVmIHx8IFtdO1xuXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICB2YXIgY2xvY2tzZXEgPSBvcHRpb25zLmNsb2Nrc2VxICE9IG51bGwgPyBvcHRpb25zLmNsb2Nrc2VxIDogX2Nsb2Nrc2VxO1xuXG4gICAgLy8gVVVJRCB0aW1lc3RhbXBzIGFyZSAxMDAgbmFuby1zZWNvbmQgdW5pdHMgc2luY2UgdGhlIEdyZWdvcmlhbiBlcG9jaCxcbiAgICAvLyAoMTU4Mi0xMC0xNSAwMDowMCkuICBKU051bWJlcnMgYXJlbid0IHByZWNpc2UgZW5vdWdoIGZvciB0aGlzLCBzb1xuICAgIC8vIHRpbWUgaXMgaGFuZGxlZCBpbnRlcm5hbGx5IGFzICdtc2VjcycgKGludGVnZXIgbWlsbGlzZWNvbmRzKSBhbmQgJ25zZWNzJ1xuICAgIC8vICgxMDAtbmFub3NlY29uZHMgb2Zmc2V0IGZyb20gbXNlY3MpIHNpbmNlIHVuaXggZXBvY2gsIDE5NzAtMDEtMDEgMDA6MDAuXG4gICAgdmFyIG1zZWNzID0gb3B0aW9ucy5tc2VjcyAhPSBudWxsID8gb3B0aW9ucy5tc2VjcyA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG4gICAgLy8gUGVyIDQuMi4xLjIsIHVzZSBjb3VudCBvZiB1dWlkJ3MgZ2VuZXJhdGVkIGR1cmluZyB0aGUgY3VycmVudCBjbG9ja1xuICAgIC8vIGN5Y2xlIHRvIHNpbXVsYXRlIGhpZ2hlciByZXNvbHV0aW9uIGNsb2NrXG4gICAgdmFyIG5zZWNzID0gb3B0aW9ucy5uc2VjcyAhPSBudWxsID8gb3B0aW9ucy5uc2VjcyA6IF9sYXN0TlNlY3MgKyAxO1xuXG4gICAgLy8gVGltZSBzaW5jZSBsYXN0IHV1aWQgY3JlYXRpb24gKGluIG1zZWNzKVxuICAgIHZhciBkdCA9IChtc2VjcyAtIF9sYXN0TVNlY3MpICsgKG5zZWNzIC0gX2xhc3ROU2VjcykvMTAwMDA7XG5cbiAgICAvLyBQZXIgNC4yLjEuMiwgQnVtcCBjbG9ja3NlcSBvbiBjbG9jayByZWdyZXNzaW9uXG4gICAgaWYgKGR0IDwgMCAmJiBvcHRpb25zLmNsb2Nrc2VxID09IG51bGwpIHtcbiAgICAgIGNsb2Nrc2VxID0gY2xvY2tzZXEgKyAxICYgMHgzZmZmO1xuICAgIH1cblxuICAgIC8vIFJlc2V0IG5zZWNzIGlmIGNsb2NrIHJlZ3Jlc3NlcyAobmV3IGNsb2Nrc2VxKSBvciB3ZSd2ZSBtb3ZlZCBvbnRvIGEgbmV3XG4gICAgLy8gdGltZSBpbnRlcnZhbFxuICAgIGlmICgoZHQgPCAwIHx8IG1zZWNzID4gX2xhc3RNU2VjcykgJiYgb3B0aW9ucy5uc2VjcyA9PSBudWxsKSB7XG4gICAgICBuc2VjcyA9IDA7XG4gICAgfVxuXG4gICAgLy8gUGVyIDQuMi4xLjIgVGhyb3cgZXJyb3IgaWYgdG9vIG1hbnkgdXVpZHMgYXJlIHJlcXVlc3RlZFxuICAgIGlmIChuc2VjcyA+PSAxMDAwMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd1dWlkLnYxKCk6IENhblxcJ3QgY3JlYXRlIG1vcmUgdGhhbiAxME0gdXVpZHMvc2VjJyk7XG4gICAgfVxuXG4gICAgX2xhc3RNU2VjcyA9IG1zZWNzO1xuICAgIF9sYXN0TlNlY3MgPSBuc2VjcztcbiAgICBfY2xvY2tzZXEgPSBjbG9ja3NlcTtcblxuICAgIC8vIFBlciA0LjEuNCAtIENvbnZlcnQgZnJvbSB1bml4IGVwb2NoIHRvIEdyZWdvcmlhbiBlcG9jaFxuICAgIG1zZWNzICs9IDEyMjE5MjkyODAwMDAwO1xuXG4gICAgLy8gYHRpbWVfbG93YFxuICAgIHZhciB0bCA9ICgobXNlY3MgJiAweGZmZmZmZmYpICogMTAwMDAgKyBuc2VjcykgJSAweDEwMDAwMDAwMDtcbiAgICBiW2krK10gPSB0bCA+Pj4gMjQgJiAweGZmO1xuICAgIGJbaSsrXSA9IHRsID4+PiAxNiAmIDB4ZmY7XG4gICAgYltpKytdID0gdGwgPj4+IDggJiAweGZmO1xuICAgIGJbaSsrXSA9IHRsICYgMHhmZjtcblxuICAgIC8vIGB0aW1lX21pZGBcbiAgICB2YXIgdG1oID0gKG1zZWNzIC8gMHgxMDAwMDAwMDAgKiAxMDAwMCkgJiAweGZmZmZmZmY7XG4gICAgYltpKytdID0gdG1oID4+PiA4ICYgMHhmZjtcbiAgICBiW2krK10gPSB0bWggJiAweGZmO1xuXG4gICAgLy8gYHRpbWVfaGlnaF9hbmRfdmVyc2lvbmBcbiAgICBiW2krK10gPSB0bWggPj4+IDI0ICYgMHhmIHwgMHgxMDsgLy8gaW5jbHVkZSB2ZXJzaW9uXG4gICAgYltpKytdID0gdG1oID4+PiAxNiAmIDB4ZmY7XG5cbiAgICAvLyBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGAgKFBlciA0LjIuMiAtIGluY2x1ZGUgdmFyaWFudClcbiAgICBiW2krK10gPSBjbG9ja3NlcSA+Pj4gOCB8IDB4ODA7XG5cbiAgICAvLyBgY2xvY2tfc2VxX2xvd2BcbiAgICBiW2krK10gPSBjbG9ja3NlcSAmIDB4ZmY7XG5cbiAgICAvLyBgbm9kZWBcbiAgICB2YXIgbm9kZSA9IG9wdGlvbnMubm9kZSB8fCBfbm9kZUlkO1xuICAgIGZvciAodmFyIG4gPSAwOyBuIDwgNjsgbisrKSB7XG4gICAgICBiW2kgKyBuXSA9IG5vZGVbbl07XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZiA/IGJ1ZiA6IHVucGFyc2UoYik7XG4gIH1cblxuICAvLyAqKmB2NCgpYCAtIEdlbmVyYXRlIHJhbmRvbSBVVUlEKipcblxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2Jyb29mYS9ub2RlLXV1aWQgZm9yIEFQSSBkZXRhaWxzXG4gIGZ1bmN0aW9uIHY0KG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gICAgLy8gRGVwcmVjYXRlZCAtICdmb3JtYXQnIGFyZ3VtZW50LCBhcyBzdXBwb3J0ZWQgaW4gdjEuMlxuICAgIHZhciBpID0gYnVmICYmIG9mZnNldCB8fCAwO1xuXG4gICAgaWYgKHR5cGVvZihvcHRpb25zKSA9PSAnc3RyaW5nJykge1xuICAgICAgYnVmID0gb3B0aW9ucyA9PSAnYmluYXJ5JyA/IG5ldyBCdWZmZXJDbGFzcygxNikgOiBudWxsO1xuICAgICAgb3B0aW9ucyA9IG51bGw7XG4gICAgfVxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgdmFyIHJuZHMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgX3JuZykoKTtcblxuICAgIC8vIFBlciA0LjQsIHNldCBiaXRzIGZvciB2ZXJzaW9uIGFuZCBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGBcbiAgICBybmRzWzZdID0gKHJuZHNbNl0gJiAweDBmKSB8IDB4NDA7XG4gICAgcm5kc1s4XSA9IChybmRzWzhdICYgMHgzZikgfCAweDgwO1xuXG4gICAgLy8gQ29weSBieXRlcyB0byBidWZmZXIsIGlmIHByb3ZpZGVkXG4gICAgaWYgKGJ1Zikge1xuICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IDE2OyBpaSsrKSB7XG4gICAgICAgIGJ1ZltpICsgaWldID0gcm5kc1tpaV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZiB8fCB1bnBhcnNlKHJuZHMpO1xuICB9XG5cbiAgLy8gRXhwb3J0IHB1YmxpYyBBUElcbiAgdmFyIHV1aWQgPSB2NDtcbiAgdXVpZC52MSA9IHYxO1xuICB1dWlkLnY0ID0gdjQ7XG4gIHV1aWQucGFyc2UgPSBwYXJzZTtcbiAgdXVpZC51bnBhcnNlID0gdW5wYXJzZTtcbiAgdXVpZC5CdWZmZXJDbGFzcyA9IEJ1ZmZlckNsYXNzO1xuXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBQdWJsaXNoIGFzIEFNRCBtb2R1bGVcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7cmV0dXJuIHV1aWQ7fSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mKG1vZHVsZSkgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAvLyBQdWJsaXNoIGFzIG5vZGUuanMgbW9kdWxlXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB1dWlkO1xuICB9IGVsc2Uge1xuICAgIC8vIFB1Ymxpc2ggYXMgZ2xvYmFsIChpbiBicm93c2VycylcbiAgICB2YXIgX3ByZXZpb3VzUm9vdCA9IF9nbG9iYWwudXVpZDtcblxuICAgIC8vICoqYG5vQ29uZmxpY3QoKWAgLSAoYnJvd3NlciBvbmx5KSB0byByZXNldCBnbG9iYWwgJ3V1aWQnIHZhcioqXG4gICAgdXVpZC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBfZ2xvYmFsLnV1aWQgPSBfcHJldmlvdXNSb290O1xuICAgICAgcmV0dXJuIHV1aWQ7XG4gICAgfTtcblxuICAgIF9nbG9iYWwudXVpZCA9IHV1aWQ7XG4gIH1cbn0pLmNhbGwodGhpcyk7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcikiLCIvKiFcbiAqIG51bWVyYWwuanNcbiAqIHZlcnNpb24gOiAxLjUuM1xuICogYXV0aG9yIDogQWRhbSBEcmFwZXJcbiAqIGxpY2Vuc2UgOiBNSVRcbiAqIGh0dHA6Ly9hZGFtd2RyYXBlci5naXRodWIuY29tL051bWVyYWwtanMvXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgQ29uc3RhbnRzXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgdmFyIG51bWVyYWwsXG4gICAgICAgIFZFUlNJT04gPSAnMS41LjMnLFxuICAgICAgICAvLyBpbnRlcm5hbCBzdG9yYWdlIGZvciBsYW5ndWFnZSBjb25maWcgZmlsZXNcbiAgICAgICAgbGFuZ3VhZ2VzID0ge30sXG4gICAgICAgIGN1cnJlbnRMYW5ndWFnZSA9ICdlbicsXG4gICAgICAgIHplcm9Gb3JtYXQgPSBudWxsLFxuICAgICAgICBkZWZhdWx0Rm9ybWF0ID0gJzAsMCcsXG4gICAgICAgIC8vIGNoZWNrIGZvciBub2RlSlNcbiAgICAgICAgaGFzTW9kdWxlID0gKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKTtcblxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBDb25zdHJ1Y3RvcnNcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuICAgIC8vIE51bWVyYWwgcHJvdG90eXBlIG9iamVjdFxuICAgIGZ1bmN0aW9uIE51bWVyYWwgKG51bWJlcikge1xuICAgICAgICB0aGlzLl92YWx1ZSA9IG51bWJlcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbXBsZW1lbnRhdGlvbiBvZiB0b0ZpeGVkKCkgdGhhdCB0cmVhdHMgZmxvYXRzIG1vcmUgbGlrZSBkZWNpbWFsc1xuICAgICAqXG4gICAgICogRml4ZXMgYmluYXJ5IHJvdW5kaW5nIGlzc3VlcyAoZWcuICgwLjYxNSkudG9GaXhlZCgyKSA9PT0gJzAuNjEnKSB0aGF0IHByZXNlbnRcbiAgICAgKiBwcm9ibGVtcyBmb3IgYWNjb3VudGluZy0gYW5kIGZpbmFuY2UtcmVsYXRlZCBzb2Z0d2FyZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0b0ZpeGVkICh2YWx1ZSwgcHJlY2lzaW9uLCByb3VuZGluZ0Z1bmN0aW9uLCBvcHRpb25hbHMpIHtcbiAgICAgICAgdmFyIHBvd2VyID0gTWF0aC5wb3coMTAsIHByZWNpc2lvbiksXG4gICAgICAgICAgICBvcHRpb25hbHNSZWdFeHAsXG4gICAgICAgICAgICBvdXRwdXQ7XG4gICAgICAgICAgICBcbiAgICAgICAgLy9yb3VuZGluZ0Z1bmN0aW9uID0gKHJvdW5kaW5nRnVuY3Rpb24gIT09IHVuZGVmaW5lZCA/IHJvdW5kaW5nRnVuY3Rpb24gOiBNYXRoLnJvdW5kKTtcbiAgICAgICAgLy8gTXVsdGlwbHkgdXAgYnkgcHJlY2lzaW9uLCByb3VuZCBhY2N1cmF0ZWx5LCB0aGVuIGRpdmlkZSBhbmQgdXNlIG5hdGl2ZSB0b0ZpeGVkKCk6XG4gICAgICAgIG91dHB1dCA9IChyb3VuZGluZ0Z1bmN0aW9uKHZhbHVlICogcG93ZXIpIC8gcG93ZXIpLnRvRml4ZWQocHJlY2lzaW9uKTtcblxuICAgICAgICBpZiAob3B0aW9uYWxzKSB7XG4gICAgICAgICAgICBvcHRpb25hbHNSZWdFeHAgPSBuZXcgUmVnRXhwKCcwezEsJyArIG9wdGlvbmFscyArICd9JCcpO1xuICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnJlcGxhY2Uob3B0aW9uYWxzUmVnRXhwLCAnJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgRm9ybWF0dGluZ1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8vIGRldGVybWluZSB3aGF0IHR5cGUgb2YgZm9ybWF0dGluZyB3ZSBuZWVkIHRvIGRvXG4gICAgZnVuY3Rpb24gZm9ybWF0TnVtZXJhbCAobiwgZm9ybWF0LCByb3VuZGluZ0Z1bmN0aW9uKSB7XG4gICAgICAgIHZhciBvdXRwdXQ7XG5cbiAgICAgICAgLy8gZmlndXJlIG91dCB3aGF0IGtpbmQgb2YgZm9ybWF0IHdlIGFyZSBkZWFsaW5nIHdpdGhcbiAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCckJykgPiAtMSkgeyAvLyBjdXJyZW5jeSEhISEhXG4gICAgICAgICAgICBvdXRwdXQgPSBmb3JtYXRDdXJyZW5jeShuLCBmb3JtYXQsIHJvdW5kaW5nRnVuY3Rpb24pO1xuICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdC5pbmRleE9mKCclJykgPiAtMSkgeyAvLyBwZXJjZW50YWdlXG4gICAgICAgICAgICBvdXRwdXQgPSBmb3JtYXRQZXJjZW50YWdlKG4sIGZvcm1hdCwgcm91bmRpbmdGdW5jdGlvbik7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0LmluZGV4T2YoJzonKSA+IC0xKSB7IC8vIHRpbWVcbiAgICAgICAgICAgIG91dHB1dCA9IGZvcm1hdFRpbWUobiwgZm9ybWF0KTtcbiAgICAgICAgfSBlbHNlIHsgLy8gcGxhaW4gb2wnIG51bWJlcnMgb3IgYnl0ZXNcbiAgICAgICAgICAgIG91dHB1dCA9IGZvcm1hdE51bWJlcihuLl92YWx1ZSwgZm9ybWF0LCByb3VuZGluZ0Z1bmN0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJldHVybiBzdHJpbmdcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG5cbiAgICAvLyByZXZlcnQgdG8gbnVtYmVyXG4gICAgZnVuY3Rpb24gdW5mb3JtYXROdW1lcmFsIChuLCBzdHJpbmcpIHtcbiAgICAgICAgdmFyIHN0cmluZ09yaWdpbmFsID0gc3RyaW5nLFxuICAgICAgICAgICAgdGhvdXNhbmRSZWdFeHAsXG4gICAgICAgICAgICBtaWxsaW9uUmVnRXhwLFxuICAgICAgICAgICAgYmlsbGlvblJlZ0V4cCxcbiAgICAgICAgICAgIHRyaWxsaW9uUmVnRXhwLFxuICAgICAgICAgICAgc3VmZml4ZXMgPSBbJ0tCJywgJ01CJywgJ0dCJywgJ1RCJywgJ1BCJywgJ0VCJywgJ1pCJywgJ1lCJ10sXG4gICAgICAgICAgICBieXRlc011bHRpcGxpZXIgPSBmYWxzZSxcbiAgICAgICAgICAgIHBvd2VyO1xuXG4gICAgICAgIGlmIChzdHJpbmcuaW5kZXhPZignOicpID4gLTEpIHtcbiAgICAgICAgICAgIG4uX3ZhbHVlID0gdW5mb3JtYXRUaW1lKHN0cmluZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoc3RyaW5nID09PSB6ZXJvRm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgbi5fdmFsdWUgPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAobGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uZGVsaW1pdGVycy5kZWNpbWFsICE9PSAnLicpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UoL1xcLi9nLCcnKS5yZXBsYWNlKGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmRlbGltaXRlcnMuZGVjaW1hbCwgJy4nKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBzZWUgaWYgYWJicmV2aWF0aW9ucyBhcmUgdGhlcmUgc28gdGhhdCB3ZSBjYW4gbXVsdGlwbHkgdG8gdGhlIGNvcnJlY3QgbnVtYmVyXG4gICAgICAgICAgICAgICAgdGhvdXNhbmRSZWdFeHAgPSBuZXcgUmVnRXhwKCdbXmEtekEtWl0nICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uYWJicmV2aWF0aW9ucy50aG91c2FuZCArICcoPzpcXFxcKXwoXFxcXCcgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5jdXJyZW5jeS5zeW1ib2wgKyAnKT8oPzpcXFxcKSk/KT8kJyk7XG4gICAgICAgICAgICAgICAgbWlsbGlvblJlZ0V4cCA9IG5ldyBSZWdFeHAoJ1teYS16QS1aXScgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5hYmJyZXZpYXRpb25zLm1pbGxpb24gKyAnKD86XFxcXCl8KFxcXFwnICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uY3VycmVuY3kuc3ltYm9sICsgJyk/KD86XFxcXCkpPyk/JCcpO1xuICAgICAgICAgICAgICAgIGJpbGxpb25SZWdFeHAgPSBuZXcgUmVnRXhwKCdbXmEtekEtWl0nICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uYWJicmV2aWF0aW9ucy5iaWxsaW9uICsgJyg/OlxcXFwpfChcXFxcJyArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmN1cnJlbmN5LnN5bWJvbCArICcpPyg/OlxcXFwpKT8pPyQnKTtcbiAgICAgICAgICAgICAgICB0cmlsbGlvblJlZ0V4cCA9IG5ldyBSZWdFeHAoJ1teYS16QS1aXScgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5hYmJyZXZpYXRpb25zLnRyaWxsaW9uICsgJyg/OlxcXFwpfChcXFxcJyArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmN1cnJlbmN5LnN5bWJvbCArICcpPyg/OlxcXFwpKT8pPyQnKTtcblxuICAgICAgICAgICAgICAgIC8vIHNlZSBpZiBieXRlcyBhcmUgdGhlcmUgc28gdGhhdCB3ZSBjYW4gbXVsdGlwbHkgdG8gdGhlIGNvcnJlY3QgbnVtYmVyXG4gICAgICAgICAgICAgICAgZm9yIChwb3dlciA9IDA7IHBvd2VyIDw9IHN1ZmZpeGVzLmxlbmd0aDsgcG93ZXIrKykge1xuICAgICAgICAgICAgICAgICAgICBieXRlc011bHRpcGxpZXIgPSAoc3RyaW5nLmluZGV4T2Yoc3VmZml4ZXNbcG93ZXJdKSA+IC0xKSA/IE1hdGgucG93KDEwMjQsIHBvd2VyICsgMSkgOiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYnl0ZXNNdWx0aXBsaWVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGRvIHNvbWUgbWF0aCB0byBjcmVhdGUgb3VyIG51bWJlclxuICAgICAgICAgICAgICAgIG4uX3ZhbHVlID0gKChieXRlc011bHRpcGxpZXIpID8gYnl0ZXNNdWx0aXBsaWVyIDogMSkgKiAoKHN0cmluZ09yaWdpbmFsLm1hdGNoKHRob3VzYW5kUmVnRXhwKSkgPyBNYXRoLnBvdygxMCwgMykgOiAxKSAqICgoc3RyaW5nT3JpZ2luYWwubWF0Y2gobWlsbGlvblJlZ0V4cCkpID8gTWF0aC5wb3coMTAsIDYpIDogMSkgKiAoKHN0cmluZ09yaWdpbmFsLm1hdGNoKGJpbGxpb25SZWdFeHApKSA/IE1hdGgucG93KDEwLCA5KSA6IDEpICogKChzdHJpbmdPcmlnaW5hbC5tYXRjaCh0cmlsbGlvblJlZ0V4cCkpID8gTWF0aC5wb3coMTAsIDEyKSA6IDEpICogKChzdHJpbmcuaW5kZXhPZignJScpID4gLTEpID8gMC4wMSA6IDEpICogKCgoc3RyaW5nLnNwbGl0KCctJykubGVuZ3RoICsgTWF0aC5taW4oc3RyaW5nLnNwbGl0KCcoJykubGVuZ3RoLTEsIHN0cmluZy5zcGxpdCgnKScpLmxlbmd0aC0xKSkgJSAyKT8gMTogLTEpICogTnVtYmVyKHN0cmluZy5yZXBsYWNlKC9bXjAtOVxcLl0rL2csICcnKSk7XG5cbiAgICAgICAgICAgICAgICAvLyByb3VuZCBpZiB3ZSBhcmUgdGFsa2luZyBhYm91dCBieXRlc1xuICAgICAgICAgICAgICAgIG4uX3ZhbHVlID0gKGJ5dGVzTXVsdGlwbGllcikgPyBNYXRoLmNlaWwobi5fdmFsdWUpIDogbi5fdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG4uX3ZhbHVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdEN1cnJlbmN5IChuLCBmb3JtYXQsIHJvdW5kaW5nRnVuY3Rpb24pIHtcbiAgICAgICAgdmFyIHN5bWJvbEluZGV4ID0gZm9ybWF0LmluZGV4T2YoJyQnKSxcbiAgICAgICAgICAgIG9wZW5QYXJlbkluZGV4ID0gZm9ybWF0LmluZGV4T2YoJygnKSxcbiAgICAgICAgICAgIG1pbnVzU2lnbkluZGV4ID0gZm9ybWF0LmluZGV4T2YoJy0nKSxcbiAgICAgICAgICAgIHNwYWNlID0gJycsXG4gICAgICAgICAgICBzcGxpY2VJbmRleCxcbiAgICAgICAgICAgIG91dHB1dDtcblxuICAgICAgICAvLyBjaGVjayBmb3Igc3BhY2UgYmVmb3JlIG9yIGFmdGVyIGN1cnJlbmN5XG4gICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignICQnKSA+IC0xKSB7XG4gICAgICAgICAgICBzcGFjZSA9ICcgJztcbiAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCcgJCcsICcnKTtcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtYXQuaW5kZXhPZignJCAnKSA+IC0xKSB7XG4gICAgICAgICAgICBzcGFjZSA9ICcgJztcbiAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCckICcsICcnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCckJywgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZm9ybWF0IHRoZSBudW1iZXJcbiAgICAgICAgb3V0cHV0ID0gZm9ybWF0TnVtYmVyKG4uX3ZhbHVlLCBmb3JtYXQsIHJvdW5kaW5nRnVuY3Rpb24pO1xuXG4gICAgICAgIC8vIHBvc2l0aW9uIHRoZSBzeW1ib2xcbiAgICAgICAgaWYgKHN5bWJvbEluZGV4IDw9IDEpIHtcbiAgICAgICAgICAgIGlmIChvdXRwdXQuaW5kZXhPZignKCcpID4gLTEgfHwgb3V0cHV0LmluZGV4T2YoJy0nKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnNwbGl0KCcnKTtcbiAgICAgICAgICAgICAgICBzcGxpY2VJbmRleCA9IDE7XG4gICAgICAgICAgICAgICAgaWYgKHN5bWJvbEluZGV4IDwgb3BlblBhcmVuSW5kZXggfHwgc3ltYm9sSW5kZXggPCBtaW51c1NpZ25JbmRleCl7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBzeW1ib2wgYXBwZWFycyBiZWZvcmUgdGhlIFwiKFwiIG9yIFwiLVwiXG4gICAgICAgICAgICAgICAgICAgIHNwbGljZUluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb3V0cHV0LnNwbGljZShzcGxpY2VJbmRleCwgMCwgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uY3VycmVuY3kuc3ltYm9sICsgc3BhY2UpO1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5qb2luKCcnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uY3VycmVuY3kuc3ltYm9sICsgc3BhY2UgKyBvdXRwdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAob3V0cHV0LmluZGV4T2YoJyknKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnNwbGl0KCcnKTtcbiAgICAgICAgICAgICAgICBvdXRwdXQuc3BsaWNlKC0xLCAwLCBzcGFjZSArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmN1cnJlbmN5LnN5bWJvbCk7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0LmpvaW4oJycpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQgKyBzcGFjZSArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmN1cnJlbmN5LnN5bWJvbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0UGVyY2VudGFnZSAobiwgZm9ybWF0LCByb3VuZGluZ0Z1bmN0aW9uKSB7XG4gICAgICAgIHZhciBzcGFjZSA9ICcnLFxuICAgICAgICAgICAgb3V0cHV0LFxuICAgICAgICAgICAgdmFsdWUgPSBuLl92YWx1ZSAqIDEwMDtcblxuICAgICAgICAvLyBjaGVjayBmb3Igc3BhY2UgYmVmb3JlICVcbiAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCcgJScpID4gLTEpIHtcbiAgICAgICAgICAgIHNwYWNlID0gJyAnO1xuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJyAlJywgJycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJyUnLCAnJyk7XG4gICAgICAgIH1cblxuICAgICAgICBvdXRwdXQgPSBmb3JtYXROdW1iZXIodmFsdWUsIGZvcm1hdCwgcm91bmRpbmdGdW5jdGlvbik7XG4gICAgICAgIFxuICAgICAgICBpZiAob3V0cHV0LmluZGV4T2YoJyknKSA+IC0xICkge1xuICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnNwbGl0KCcnKTtcbiAgICAgICAgICAgIG91dHB1dC5zcGxpY2UoLTEsIDAsIHNwYWNlICsgJyUnKTtcbiAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5qb2luKCcnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dCArIHNwYWNlICsgJyUnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRUaW1lIChuKSB7XG4gICAgICAgIHZhciBob3VycyA9IE1hdGguZmxvb3Iobi5fdmFsdWUvNjAvNjApLFxuICAgICAgICAgICAgbWludXRlcyA9IE1hdGguZmxvb3IoKG4uX3ZhbHVlIC0gKGhvdXJzICogNjAgKiA2MCkpLzYwKSxcbiAgICAgICAgICAgIHNlY29uZHMgPSBNYXRoLnJvdW5kKG4uX3ZhbHVlIC0gKGhvdXJzICogNjAgKiA2MCkgLSAobWludXRlcyAqIDYwKSk7XG4gICAgICAgIHJldHVybiBob3VycyArICc6JyArICgobWludXRlcyA8IDEwKSA/ICcwJyArIG1pbnV0ZXMgOiBtaW51dGVzKSArICc6JyArICgoc2Vjb25kcyA8IDEwKSA/ICcwJyArIHNlY29uZHMgOiBzZWNvbmRzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1bmZvcm1hdFRpbWUgKHN0cmluZykge1xuICAgICAgICB2YXIgdGltZUFycmF5ID0gc3RyaW5nLnNwbGl0KCc6JyksXG4gICAgICAgICAgICBzZWNvbmRzID0gMDtcbiAgICAgICAgLy8gdHVybiBob3VycyBhbmQgbWludXRlcyBpbnRvIHNlY29uZHMgYW5kIGFkZCB0aGVtIGFsbCB1cFxuICAgICAgICBpZiAodGltZUFycmF5Lmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgLy8gaG91cnNcbiAgICAgICAgICAgIHNlY29uZHMgPSBzZWNvbmRzICsgKE51bWJlcih0aW1lQXJyYXlbMF0pICogNjAgKiA2MCk7XG4gICAgICAgICAgICAvLyBtaW51dGVzXG4gICAgICAgICAgICBzZWNvbmRzID0gc2Vjb25kcyArIChOdW1iZXIodGltZUFycmF5WzFdKSAqIDYwKTtcbiAgICAgICAgICAgIC8vIHNlY29uZHNcbiAgICAgICAgICAgIHNlY29uZHMgPSBzZWNvbmRzICsgTnVtYmVyKHRpbWVBcnJheVsyXSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGltZUFycmF5Lmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgLy8gbWludXRlc1xuICAgICAgICAgICAgc2Vjb25kcyA9IHNlY29uZHMgKyAoTnVtYmVyKHRpbWVBcnJheVswXSkgKiA2MCk7XG4gICAgICAgICAgICAvLyBzZWNvbmRzXG4gICAgICAgICAgICBzZWNvbmRzID0gc2Vjb25kcyArIE51bWJlcih0aW1lQXJyYXlbMV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBOdW1iZXIoc2Vjb25kcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0TnVtYmVyICh2YWx1ZSwgZm9ybWF0LCByb3VuZGluZ0Z1bmN0aW9uKSB7XG4gICAgICAgIHZhciBuZWdQID0gZmFsc2UsXG4gICAgICAgICAgICBzaWduZWQgPSBmYWxzZSxcbiAgICAgICAgICAgIG9wdERlYyA9IGZhbHNlLFxuICAgICAgICAgICAgYWJiciA9ICcnLFxuICAgICAgICAgICAgYWJicksgPSBmYWxzZSwgLy8gZm9yY2UgYWJicmV2aWF0aW9uIHRvIHRob3VzYW5kc1xuICAgICAgICAgICAgYWJick0gPSBmYWxzZSwgLy8gZm9yY2UgYWJicmV2aWF0aW9uIHRvIG1pbGxpb25zXG4gICAgICAgICAgICBhYmJyQiA9IGZhbHNlLCAvLyBmb3JjZSBhYmJyZXZpYXRpb24gdG8gYmlsbGlvbnNcbiAgICAgICAgICAgIGFiYnJUID0gZmFsc2UsIC8vIGZvcmNlIGFiYnJldmlhdGlvbiB0byB0cmlsbGlvbnNcbiAgICAgICAgICAgIGFiYnJGb3JjZSA9IGZhbHNlLCAvLyBmb3JjZSBhYmJyZXZpYXRpb25cbiAgICAgICAgICAgIGJ5dGVzID0gJycsXG4gICAgICAgICAgICBvcmQgPSAnJyxcbiAgICAgICAgICAgIGFicyA9IE1hdGguYWJzKHZhbHVlKSxcbiAgICAgICAgICAgIHN1ZmZpeGVzID0gWydCJywgJ0tCJywgJ01CJywgJ0dCJywgJ1RCJywgJ1BCJywgJ0VCJywgJ1pCJywgJ1lCJ10sXG4gICAgICAgICAgICBtaW4sXG4gICAgICAgICAgICBtYXgsXG4gICAgICAgICAgICBwb3dlcixcbiAgICAgICAgICAgIHcsXG4gICAgICAgICAgICBwcmVjaXNpb24sXG4gICAgICAgICAgICB0aG91c2FuZHMsXG4gICAgICAgICAgICBkID0gJycsXG4gICAgICAgICAgICBuZWcgPSBmYWxzZTtcblxuICAgICAgICAvLyBjaGVjayBpZiBudW1iZXIgaXMgemVybyBhbmQgYSBjdXN0b20gemVybyBmb3JtYXQgaGFzIGJlZW4gc2V0XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gMCAmJiB6ZXJvRm9ybWF0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gemVyb0Zvcm1hdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHNlZSBpZiB3ZSBzaG91bGQgdXNlIHBhcmVudGhlc2VzIGZvciBuZWdhdGl2ZSBudW1iZXIgb3IgaWYgd2Ugc2hvdWxkIHByZWZpeCB3aXRoIGEgc2lnblxuICAgICAgICAgICAgLy8gaWYgYm90aCBhcmUgcHJlc2VudCB3ZSBkZWZhdWx0IHRvIHBhcmVudGhlc2VzXG4gICAgICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJygnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgbmVnUCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnNsaWNlKDEsIC0xKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0LmluZGV4T2YoJysnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgc2lnbmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgvXFwrL2csICcnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2VlIGlmIGFiYnJldmlhdGlvbiBpcyB3YW50ZWRcbiAgICAgICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignYScpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiBhYmJyZXZpYXRpb24gaXMgc3BlY2lmaWVkXG4gICAgICAgICAgICAgICAgYWJicksgPSBmb3JtYXQuaW5kZXhPZignYUsnKSA+PSAwO1xuICAgICAgICAgICAgICAgIGFiYnJNID0gZm9ybWF0LmluZGV4T2YoJ2FNJykgPj0gMDtcbiAgICAgICAgICAgICAgICBhYmJyQiA9IGZvcm1hdC5pbmRleE9mKCdhQicpID49IDA7XG4gICAgICAgICAgICAgICAgYWJiclQgPSBmb3JtYXQuaW5kZXhPZignYVQnKSA+PSAwO1xuICAgICAgICAgICAgICAgIGFiYnJGb3JjZSA9IGFiYnJLIHx8IGFiYnJNIHx8IGFiYnJCIHx8IGFiYnJUO1xuXG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgZm9yIHNwYWNlIGJlZm9yZSBhYmJyZXZpYXRpb25cbiAgICAgICAgICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJyBhJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICBhYmJyID0gJyAnO1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnIGEnLCAnJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJ2EnLCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGFicyA+PSBNYXRoLnBvdygxMCwgMTIpICYmICFhYmJyRm9yY2UgfHwgYWJiclQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdHJpbGxpb25cbiAgICAgICAgICAgICAgICAgICAgYWJiciA9IGFiYnIgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5hYmJyZXZpYXRpb25zLnRyaWxsaW9uO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlIC8gTWF0aC5wb3coMTAsIDEyKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFicyA8IE1hdGgucG93KDEwLCAxMikgJiYgYWJzID49IE1hdGgucG93KDEwLCA5KSAmJiAhYWJickZvcmNlIHx8IGFiYnJCKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGJpbGxpb25cbiAgICAgICAgICAgICAgICAgICAgYWJiciA9IGFiYnIgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5hYmJyZXZpYXRpb25zLmJpbGxpb247XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgLyBNYXRoLnBvdygxMCwgOSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhYnMgPCBNYXRoLnBvdygxMCwgOSkgJiYgYWJzID49IE1hdGgucG93KDEwLCA2KSAmJiAhYWJickZvcmNlIHx8IGFiYnJNKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG1pbGxpb25cbiAgICAgICAgICAgICAgICAgICAgYWJiciA9IGFiYnIgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5hYmJyZXZpYXRpb25zLm1pbGxpb247XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgLyBNYXRoLnBvdygxMCwgNik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhYnMgPCBNYXRoLnBvdygxMCwgNikgJiYgYWJzID49IE1hdGgucG93KDEwLCAzKSAmJiAhYWJickZvcmNlIHx8IGFiYnJLKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRob3VzYW5kXG4gICAgICAgICAgICAgICAgICAgIGFiYnIgPSBhYmJyICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uYWJicmV2aWF0aW9ucy50aG91c2FuZDtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSAvIE1hdGgucG93KDEwLCAzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlZSBpZiB3ZSBhcmUgZm9ybWF0dGluZyBieXRlc1xuICAgICAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCdiJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGZvciBzcGFjZSBiZWZvcmVcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJyBiJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICBieXRlcyA9ICcgJztcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJyBiJywgJycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCdiJywgJycpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvciAocG93ZXIgPSAwOyBwb3dlciA8PSBzdWZmaXhlcy5sZW5ndGg7IHBvd2VyKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbWluID0gTWF0aC5wb3coMTAyNCwgcG93ZXIpO1xuICAgICAgICAgICAgICAgICAgICBtYXggPSBNYXRoLnBvdygxMDI0LCBwb3dlcisxKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPj0gbWluICYmIHZhbHVlIDwgbWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBieXRlcyA9IGJ5dGVzICsgc3VmZml4ZXNbcG93ZXJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1pbiA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlIC8gbWluO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlZSBpZiBvcmRpbmFsIGlzIHdhbnRlZFxuICAgICAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCdvJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGZvciBzcGFjZSBiZWZvcmVcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJyBvJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICBvcmQgPSAnICc7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCcgbycsICcnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnbycsICcnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBvcmQgPSBvcmQgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5vcmRpbmFsKHZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCdbLl0nKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgb3B0RGVjID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnWy5dJywgJy4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdyA9IHZhbHVlLnRvU3RyaW5nKCkuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICAgIHByZWNpc2lvbiA9IGZvcm1hdC5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgdGhvdXNhbmRzID0gZm9ybWF0LmluZGV4T2YoJywnKTtcblxuICAgICAgICAgICAgaWYgKHByZWNpc2lvbikge1xuICAgICAgICAgICAgICAgIGlmIChwcmVjaXNpb24uaW5kZXhPZignWycpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJlY2lzaW9uID0gcHJlY2lzaW9uLnJlcGxhY2UoJ10nLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIHByZWNpc2lvbiA9IHByZWNpc2lvbi5zcGxpdCgnWycpO1xuICAgICAgICAgICAgICAgICAgICBkID0gdG9GaXhlZCh2YWx1ZSwgKHByZWNpc2lvblswXS5sZW5ndGggKyBwcmVjaXNpb25bMV0ubGVuZ3RoKSwgcm91bmRpbmdGdW5jdGlvbiwgcHJlY2lzaW9uWzFdLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZCA9IHRvRml4ZWQodmFsdWUsIHByZWNpc2lvbi5sZW5ndGgsIHJvdW5kaW5nRnVuY3Rpb24pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHcgPSBkLnNwbGl0KCcuJylbMF07XG5cbiAgICAgICAgICAgICAgICBpZiAoZC5zcGxpdCgnLicpWzFdLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBkID0gbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uZGVsaW1pdGVycy5kZWNpbWFsICsgZC5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGQgPSAnJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAob3B0RGVjICYmIE51bWJlcihkLnNsaWNlKDEpKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBkID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB3ID0gdG9GaXhlZCh2YWx1ZSwgbnVsbCwgcm91bmRpbmdGdW5jdGlvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGZvcm1hdCBudW1iZXJcbiAgICAgICAgICAgIGlmICh3LmluZGV4T2YoJy0nKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgdyA9IHcuc2xpY2UoMSk7XG4gICAgICAgICAgICAgICAgbmVnID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRob3VzYW5kcyA+IC0xKSB7XG4gICAgICAgICAgICAgICAgdyA9IHcudG9TdHJpbmcoKS5yZXBsYWNlKC8oXFxkKSg/PShcXGR7M30pKyg/IVxcZCkpL2csICckMScgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5kZWxpbWl0ZXJzLnRob3VzYW5kcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignLicpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdyA9ICcnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gKChuZWdQICYmIG5lZykgPyAnKCcgOiAnJykgKyAoKCFuZWdQICYmIG5lZykgPyAnLScgOiAnJykgKyAoKCFuZWcgJiYgc2lnbmVkKSA/ICcrJyA6ICcnKSArIHcgKyBkICsgKChvcmQpID8gb3JkIDogJycpICsgKChhYmJyKSA/IGFiYnIgOiAnJykgKyAoKGJ5dGVzKSA/IGJ5dGVzIDogJycpICsgKChuZWdQICYmIG5lZykgPyAnKScgOiAnJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIFRvcCBMZXZlbCBGdW5jdGlvbnNcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICBudW1lcmFsID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgIGlmIChudW1lcmFsLmlzTnVtZXJhbChpbnB1dCkpIHtcbiAgICAgICAgICAgIGlucHV0ID0gaW5wdXQudmFsdWUoKTtcbiAgICAgICAgfSBlbHNlIGlmIChpbnB1dCA9PT0gMCB8fCB0eXBlb2YgaW5wdXQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpbnB1dCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAoIU51bWJlcihpbnB1dCkpIHtcbiAgICAgICAgICAgIGlucHV0ID0gbnVtZXJhbC5mbi51bmZvcm1hdChpbnB1dCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IE51bWVyYWwoTnVtYmVyKGlucHV0KSk7XG4gICAgfTtcblxuICAgIC8vIHZlcnNpb24gbnVtYmVyXG4gICAgbnVtZXJhbC52ZXJzaW9uID0gVkVSU0lPTjtcblxuICAgIC8vIGNvbXBhcmUgbnVtZXJhbCBvYmplY3RcbiAgICBudW1lcmFsLmlzTnVtZXJhbCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIE51bWVyYWw7XG4gICAgfTtcblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gd2lsbCBsb2FkIGxhbmd1YWdlcyBhbmQgdGhlbiBzZXQgdGhlIGdsb2JhbCBsYW5ndWFnZS4gIElmXG4gICAgLy8gbm8gYXJndW1lbnRzIGFyZSBwYXNzZWQgaW4sIGl0IHdpbGwgc2ltcGx5IHJldHVybiB0aGUgY3VycmVudCBnbG9iYWxcbiAgICAvLyBsYW5ndWFnZSBrZXkuXG4gICAgbnVtZXJhbC5sYW5ndWFnZSA9IGZ1bmN0aW9uIChrZXksIHZhbHVlcykge1xuICAgICAgICBpZiAoIWtleSkge1xuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRMYW5ndWFnZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChrZXkgJiYgIXZhbHVlcykge1xuICAgICAgICAgICAgaWYoIWxhbmd1YWdlc1trZXldKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGxhbmd1YWdlIDogJyArIGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJyZW50TGFuZ3VhZ2UgPSBrZXk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWVzIHx8ICFsYW5ndWFnZXNba2V5XSkge1xuICAgICAgICAgICAgbG9hZExhbmd1YWdlKGtleSwgdmFsdWVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudW1lcmFsO1xuICAgIH07XG4gICAgXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBwcm92aWRlcyBhY2Nlc3MgdG8gdGhlIGxvYWRlZCBsYW5ndWFnZSBkYXRhLiAgSWZcbiAgICAvLyBubyBhcmd1bWVudHMgYXJlIHBhc3NlZCBpbiwgaXQgd2lsbCBzaW1wbHkgcmV0dXJuIHRoZSBjdXJyZW50XG4gICAgLy8gZ2xvYmFsIGxhbmd1YWdlIG9iamVjdC5cbiAgICBudW1lcmFsLmxhbmd1YWdlRGF0YSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKCFsYW5ndWFnZXNba2V5XSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGxhbmd1YWdlIDogJyArIGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBsYW5ndWFnZXNba2V5XTtcbiAgICB9O1xuXG4gICAgbnVtZXJhbC5sYW5ndWFnZSgnZW4nLCB7XG4gICAgICAgIGRlbGltaXRlcnM6IHtcbiAgICAgICAgICAgIHRob3VzYW5kczogJywnLFxuICAgICAgICAgICAgZGVjaW1hbDogJy4nXG4gICAgICAgIH0sXG4gICAgICAgIGFiYnJldmlhdGlvbnM6IHtcbiAgICAgICAgICAgIHRob3VzYW5kOiAnaycsXG4gICAgICAgICAgICBtaWxsaW9uOiAnbScsXG4gICAgICAgICAgICBiaWxsaW9uOiAnYicsXG4gICAgICAgICAgICB0cmlsbGlvbjogJ3QnXG4gICAgICAgIH0sXG4gICAgICAgIG9yZGluYWw6IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgICAgICAgICAgIHZhciBiID0gbnVtYmVyICUgMTA7XG4gICAgICAgICAgICByZXR1cm4gKH5+IChudW1iZXIgJSAxMDAgLyAxMCkgPT09IDEpID8gJ3RoJyA6XG4gICAgICAgICAgICAgICAgKGIgPT09IDEpID8gJ3N0JyA6XG4gICAgICAgICAgICAgICAgKGIgPT09IDIpID8gJ25kJyA6XG4gICAgICAgICAgICAgICAgKGIgPT09IDMpID8gJ3JkJyA6ICd0aCc7XG4gICAgICAgIH0sXG4gICAgICAgIGN1cnJlbmN5OiB7XG4gICAgICAgICAgICBzeW1ib2w6ICckJ1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBudW1lcmFsLnplcm9Gb3JtYXQgPSBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIHplcm9Gb3JtYXQgPSB0eXBlb2YoZm9ybWF0KSA9PT0gJ3N0cmluZycgPyBmb3JtYXQgOiBudWxsO1xuICAgIH07XG5cbiAgICBudW1lcmFsLmRlZmF1bHRGb3JtYXQgPSBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIGRlZmF1bHRGb3JtYXQgPSB0eXBlb2YoZm9ybWF0KSA9PT0gJ3N0cmluZycgPyBmb3JtYXQgOiAnMC4wJztcbiAgICB9O1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBIZWxwZXJzXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgZnVuY3Rpb24gbG9hZExhbmd1YWdlKGtleSwgdmFsdWVzKSB7XG4gICAgICAgIGxhbmd1YWdlc1trZXldID0gdmFsdWVzO1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgRmxvYXRpbmctcG9pbnQgaGVscGVyc1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8vIFRoZSBmbG9hdGluZy1wb2ludCBoZWxwZXIgZnVuY3Rpb25zIGFuZCBpbXBsZW1lbnRhdGlvblxuICAgIC8vIGJvcnJvd3MgaGVhdmlseSBmcm9tIHNpbmZ1bC5qczogaHR0cDovL2d1aXBuLmdpdGh1Yi5pby9zaW5mdWwuanMvXG5cbiAgICAvKipcbiAgICAgKiBBcnJheS5wcm90b3R5cGUucmVkdWNlIGZvciBicm93c2VycyB0aGF0IGRvbid0IHN1cHBvcnQgaXRcbiAgICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9SZWR1Y2UjQ29tcGF0aWJpbGl0eVxuICAgICAqL1xuICAgIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgQXJyYXkucHJvdG90eXBlLnJlZHVjZSkge1xuICAgICAgICBBcnJheS5wcm90b3R5cGUucmVkdWNlID0gZnVuY3Rpb24gKGNhbGxiYWNrLCBvcHRfaW5pdGlhbFZhbHVlKSB7XG4gICAgICAgICAgICAndXNlIHN0cmljdCc7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChudWxsID09PSB0aGlzIHx8ICd1bmRlZmluZWQnID09PSB0eXBlb2YgdGhpcykge1xuICAgICAgICAgICAgICAgIC8vIEF0IHRoZSBtb21lbnQgYWxsIG1vZGVybiBicm93c2VycywgdGhhdCBzdXBwb3J0IHN0cmljdCBtb2RlLCBoYXZlXG4gICAgICAgICAgICAgICAgLy8gbmF0aXZlIGltcGxlbWVudGF0aW9uIG9mIEFycmF5LnByb3RvdHlwZS5yZWR1Y2UuIEZvciBpbnN0YW5jZSwgSUU4XG4gICAgICAgICAgICAgICAgLy8gZG9lcyBub3Qgc3VwcG9ydCBzdHJpY3QgbW9kZSwgc28gdGhpcyBjaGVjayBpcyBhY3R1YWxseSB1c2VsZXNzLlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FycmF5LnByb3RvdHlwZS5yZWR1Y2UgY2FsbGVkIG9uIG51bGwgb3IgdW5kZWZpbmVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGNhbGxiYWNrICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaW5kZXgsXG4gICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gdGhpcy5sZW5ndGggPj4+IDAsXG4gICAgICAgICAgICAgICAgaXNWYWx1ZVNldCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBpZiAoMSA8IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG9wdF9pbml0aWFsVmFsdWU7XG4gICAgICAgICAgICAgICAgaXNWYWx1ZVNldCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoaW5kZXggPSAwOyBsZW5ndGggPiBpbmRleDsgKytpbmRleCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KGluZGV4KSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNWYWx1ZVNldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjYWxsYmFjayh2YWx1ZSwgdGhpc1tpbmRleF0sIGluZGV4LCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpc1tpbmRleF07XG4gICAgICAgICAgICAgICAgICAgICAgICBpc1ZhbHVlU2V0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFpc1ZhbHVlU2V0KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgXG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIG11bHRpcGxpZXIgbmVjZXNzYXJ5IHRvIG1ha2UgeCA+PSAxLFxuICAgICAqIGVmZmVjdGl2ZWx5IGVsaW1pbmF0aW5nIG1pc2NhbGN1bGF0aW9ucyBjYXVzZWQgYnlcbiAgICAgKiBmaW5pdGUgcHJlY2lzaW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG11bHRpcGxpZXIoeCkge1xuICAgICAgICB2YXIgcGFydHMgPSB4LnRvU3RyaW5nKCkuc3BsaXQoJy4nKTtcbiAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNYXRoLnBvdygxMCwgcGFydHNbMV0ubGVuZ3RoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHaXZlbiBhIHZhcmlhYmxlIG51bWJlciBvZiBhcmd1bWVudHMsIHJldHVybnMgdGhlIG1heGltdW1cbiAgICAgKiBtdWx0aXBsaWVyIHRoYXQgbXVzdCBiZSB1c2VkIHRvIG5vcm1hbGl6ZSBhbiBvcGVyYXRpb24gaW52b2x2aW5nXG4gICAgICogYWxsIG9mIHRoZW0uXG4gICAgICovXG4gICAgZnVuY3Rpb24gY29ycmVjdGlvbkZhY3RvcigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gYXJncy5yZWR1Y2UoZnVuY3Rpb24gKHByZXYsIG5leHQpIHtcbiAgICAgICAgICAgIHZhciBtcCA9IG11bHRpcGxpZXIocHJldiksXG4gICAgICAgICAgICAgICAgbW4gPSBtdWx0aXBsaWVyKG5leHQpO1xuICAgICAgICByZXR1cm4gbXAgPiBtbiA/IG1wIDogbW47XG4gICAgICAgIH0sIC1JbmZpbml0eSk7XG4gICAgfSAgICAgICAgXG5cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgTnVtZXJhbCBQcm90b3R5cGVcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuICAgIG51bWVyYWwuZm4gPSBOdW1lcmFsLnByb3RvdHlwZSA9IHtcblxuICAgICAgICBjbG9uZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBudW1lcmFsKHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZvcm1hdCA6IGZ1bmN0aW9uIChpbnB1dFN0cmluZywgcm91bmRpbmdGdW5jdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGZvcm1hdE51bWVyYWwodGhpcywgXG4gICAgICAgICAgICAgICAgICBpbnB1dFN0cmluZyA/IGlucHV0U3RyaW5nIDogZGVmYXVsdEZvcm1hdCwgXG4gICAgICAgICAgICAgICAgICAocm91bmRpbmdGdW5jdGlvbiAhPT0gdW5kZWZpbmVkKSA/IHJvdW5kaW5nRnVuY3Rpb24gOiBNYXRoLnJvdW5kXG4gICAgICAgICAgICAgICk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdW5mb3JtYXQgOiBmdW5jdGlvbiAoaW5wdXRTdHJpbmcpIHtcbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXRTdHJpbmcpID09PSAnW29iamVjdCBOdW1iZXJdJykgeyBcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXRTdHJpbmc7IFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHVuZm9ybWF0TnVtZXJhbCh0aGlzLCBpbnB1dFN0cmluZyA/IGlucHV0U3RyaW5nIDogZGVmYXVsdEZvcm1hdCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdmFsdWUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdmFsdWVPZiA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXQgOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gTnVtYmVyKHZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFkZCA6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIGNvcnJGYWN0b3IgPSBjb3JyZWN0aW9uRmFjdG9yLmNhbGwobnVsbCwgdGhpcy5fdmFsdWUsIHZhbHVlKTtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNiYWNrKGFjY3VtLCBjdXJyLCBjdXJySSwgTykge1xuICAgICAgICAgICAgICAgIHJldHVybiBhY2N1bSArIGNvcnJGYWN0b3IgKiBjdXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSBbdGhpcy5fdmFsdWUsIHZhbHVlXS5yZWR1Y2UoY2JhY2ssIDApIC8gY29yckZhY3RvcjtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHN1YnRyYWN0IDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgY29yckZhY3RvciA9IGNvcnJlY3Rpb25GYWN0b3IuY2FsbChudWxsLCB0aGlzLl92YWx1ZSwgdmFsdWUpO1xuICAgICAgICAgICAgZnVuY3Rpb24gY2JhY2soYWNjdW0sIGN1cnIsIGN1cnJJLCBPKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjY3VtIC0gY29yckZhY3RvciAqIGN1cnI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IFt2YWx1ZV0ucmVkdWNlKGNiYWNrLCB0aGlzLl92YWx1ZSAqIGNvcnJGYWN0b3IpIC8gY29yckZhY3RvcjsgICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIG11bHRpcGx5IDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBmdW5jdGlvbiBjYmFjayhhY2N1bSwgY3VyciwgY3VyckksIE8pIHtcbiAgICAgICAgICAgICAgICB2YXIgY29yckZhY3RvciA9IGNvcnJlY3Rpb25GYWN0b3IoYWNjdW0sIGN1cnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAoYWNjdW0gKiBjb3JyRmFjdG9yKSAqIChjdXJyICogY29yckZhY3RvcikgL1xuICAgICAgICAgICAgICAgICAgICAoY29yckZhY3RvciAqIGNvcnJGYWN0b3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSBbdGhpcy5fdmFsdWUsIHZhbHVlXS5yZWR1Y2UoY2JhY2ssIDEpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGl2aWRlIDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBmdW5jdGlvbiBjYmFjayhhY2N1bSwgY3VyciwgY3VyckksIE8pIHtcbiAgICAgICAgICAgICAgICB2YXIgY29yckZhY3RvciA9IGNvcnJlY3Rpb25GYWN0b3IoYWNjdW0sIGN1cnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAoYWNjdW0gKiBjb3JyRmFjdG9yKSAvIChjdXJyICogY29yckZhY3Rvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IFt0aGlzLl92YWx1ZSwgdmFsdWVdLnJlZHVjZShjYmFjayk7ICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBkaWZmZXJlbmNlIDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5hYnMobnVtZXJhbCh0aGlzLl92YWx1ZSkuc3VidHJhY3QodmFsdWUpLnZhbHVlKCkpO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBFeHBvc2luZyBOdW1lcmFsXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLy8gQ29tbW9uSlMgbW9kdWxlIGlzIGRlZmluZWRcbiAgICBpZiAoaGFzTW9kdWxlKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gbnVtZXJhbDtcbiAgICB9XG5cbiAgICAvKmdsb2JhbCBlbmRlcjpmYWxzZSAqL1xuICAgIGlmICh0eXBlb2YgZW5kZXIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vIGhlcmUsIGB0aGlzYCBtZWFucyBgd2luZG93YCBpbiB0aGUgYnJvd3Nlciwgb3IgYGdsb2JhbGAgb24gdGhlIHNlcnZlclxuICAgICAgICAvLyBhZGQgYG51bWVyYWxgIGFzIGEgZ2xvYmFsIG9iamVjdCB2aWEgYSBzdHJpbmcgaWRlbnRpZmllcixcbiAgICAgICAgLy8gZm9yIENsb3N1cmUgQ29tcGlsZXIgJ2FkdmFuY2VkJyBtb2RlXG4gICAgICAgIHRoaXNbJ251bWVyYWwnXSA9IG51bWVyYWw7XG4gICAgfVxuXG4gICAgLypnbG9iYWwgZGVmaW5lOmZhbHNlICovXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoW10sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBudW1lcmFsO1xuICAgICAgICB9KTtcbiAgICB9XG59KS5jYWxsKHRoaXMpO1xuIiwiaW1wb3J0IFRpbWVyIGZyb20gJ3VpL3RpbWVyJztcblxubGV0IF9saXN0ZW5lcnMgPSBTeW1ib2woKSxcblx0X2NhbmNlbCA9IFN5bWJvbCgpO1xuXG5jbGFzcyBTdHJlYW0ge1xuXHRjb25zdHJ1Y3RvcihjYWxsYmFjaykge1xuXHRcdHRoaXNbX2xpc3RlbmVyc10gPSBbXTtcblx0XHRsZXQgc2luayA9ICh2YWx1ZSkgPT4ge1xuXHRcdFx0VGltZXIuaW1tZWRpYXRlKCgpID0+IHtcblx0XHRcdFx0dGhpc1tfbGlzdGVuZXJzXS5tYXAoxpIgPT4gxpIodmFsdWUpKTtcblx0XHRcdH0pO1xuXHRcdH07XG5cdFx0Y2FsbGJhY2soc2luayk7XG5cdH1cblx0Y2FuY2VsKCkge1xuXHRcdHRoaXNbX2xpc3RlbmVyc10gPSBbXTtcblx0fVxuXHRjYW5jZWxPbihzb3VyY2UpIHtcblx0XHRsZXQgxpI7XG5cdFx0xpIgPSAoKSA9PiB7XG5cdFx0XHRzb3VyY2UudW5zdWJzY3JpYmUoxpIpO1xuXHRcdFx0dGhpcy5jYW5jZWwoKTtcblx0XHR9O1xuXHRcdHNvdXJjZS5zdWJzY3JpYmUoxpIpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cdHN1YnNjcmliZSjGkikge1xuXHRcdHRoaXNbX2xpc3RlbmVyc10ucHVzaCjGkik7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0dW5zdWJzY3JpYmUoxpIpIHtcblx0XHR0aGlzW19saXN0ZW5lcnNdLnNwbGljZSh0aGlzW19saXN0ZW5lcnNdLmluZGV4T2YoxpIpLCAxKTtcblx0fVxuXHRtYXAoxpIpIHtcblx0XHRyZXR1cm4gU3RyZWFtLm1hcCh0aGlzLCDGkik7XG5cdH1cblx0ZmlsdGVyKMaSKSB7XG5cdFx0cmV0dXJuIFN0cmVhbS5maWx0ZXIodGhpcywgxpIpO1xuXHR9XG5cdHVuaXF1ZSjGkikge1xuXHRcdHJldHVybiBTdHJlYW0udW5pcXVlKHRoaXMsIMaSKTtcblx0fVxuXHRsb2cocHJlZml4KSB7XG5cdFx0cmV0dXJuIFN0cmVhbS5sb2codGhpcywgcHJlZml4KTtcblx0fVxuXHR0b0Jvb2woKSB7XG5cdFx0cmV0dXJuIFN0cmVhbS50b0Jvb2wodGhpcyk7XG5cdH1cblx0bmVnYXRlKCkge1xuXHRcdHJldHVybiBTdHJlYW0ubmVnYXRlKHRoaXMpO1xuXHR9XG5cdHppcCguLi5vdGhlcnMpIHtcblx0XHRyZXR1cm4gU3RyZWFtLnppcCh0aGlzLCAuLi5vdGhlcnMpO1xuXHR9XG5cdHNwcmVhZCjGkikge1xuXHRcdHJldHVybiBTdHJlYW0uc3ByZWFkKHRoaXMsIMaSKTtcblx0fVxuXHRmbGF0TWFwKCkge1xuXHRcdHJldHVybiBTdHJlYW0uZmxhdE1hcCh0aGlzKTtcblx0fVxuXHRtZXJnZSguLi5vdGhlcnMpIHtcblx0XHRyZXR1cm4gU3RyZWFtLm1lcmdlKHRoaXMsIC4uLm90aGVycyk7XG5cdH1cblx0cmVkdWNlKGFjYywgxpIpIHtcblx0XHRyZXR1cm4gU3RyZWFtLnJlZHVjZSh0aGlzLCBhY2MsIMaSKTtcblx0fVxuXHRmZWVkKGRlc3RWYWx1ZSkge1xuXHRcdHJldHVybiBTdHJlYW0uZmVlZCh0aGlzLCBkZXN0VmFsdWUpO1xuXHR9XG5cdHdyYXAoxpIpIHtcblx0XHTGkih0aGlzKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHRkZWJvdW5jZShkZWxheSkge1xuXHRcdHJldHVybiBTdHJlYW0uZGVib3VuY2UodGhpcywgZGVsYXkpO1xuXHR9XG59XG5cbmNsYXNzIFB1c2hTdHJlYW0gZXh0ZW5kcyBTdHJlYW0ge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigoc2luaykgPT4gdGhpcy5wdXNoID0gc2luayk7XG5cdH1cbn1cblxuY2xhc3MgQ2FuY2VsYWJsZVN0cmVhbSBleHRlbmRzIFB1c2hTdHJlYW0ge1xuXHRjb25zdHJ1Y3RvcihjYW5jZWzGkikge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpc1tfY2FuY2VsXSA9IGNhbmNlbMaSLmJpbmQodGhpcyk7XG5cdH1cblx0Y2FuY2VsKCkge1xuXHRcdHRoaXNbX2NhbmNlbF0oKTtcblx0XHRzdXBlcigpO1xuXHR9XG59XG5cbi8vIHNob3VsZCBJIHByb3BhZ2F0ZSB0aGUgY2FuY2VsIG1ldGhvZD9cblN0cmVhbS5zdWJzY3JpYmUgPSBmdW5jdGlvbihzb3VyY2UsIMaSKSB7XG5cdGxldCBixpIsXG5cdFx0c3RyZWFtID0gbmV3IENhbmNlbGFibGVTdHJlYW0oZnVuY3Rpb24oKSB7XG5cdFx0XHRzb3VyY2UudW5zdWJzY3JpYmUoYsaSKTtcblx0XHR9KTtcblx0YsaSID0gxpIuYmluZChudWxsLCBzdHJlYW0pO1xuXHRzb3VyY2Uuc3Vic2NyaWJlKGLGkik7XG5cdHJldHVybiBzdHJlYW07XG59O1xuU3RyZWFtLm1hcCA9IGZ1bmN0aW9uKHNvdXJjZSwgxpIpIHtcblx0cmV0dXJuIHRoaXMuc3Vic2NyaWJlKHNvdXJjZSwgKHN0cmVhbSwgdmFsdWUpID0+IHN0cmVhbS5wdXNoKMaSKHZhbHVlKSkpO1xufTtcblN0cmVhbS5maWx0ZXIgPSBmdW5jdGlvbihzb3VyY2UsIMaSKSB7XG5cdHJldHVybiB0aGlzLnN1YnNjcmliZShzb3VyY2UsIChzdHJlYW0sIHZhbHVlKSA9PiB7IGlmKMaSKHZhbHVlKSkgc3RyZWFtLnB1c2godmFsdWUpIH0pO1xufTtcblN0cmVhbS51bmlxdWUgPSBmdW5jdGlvbihzb3VyY2UsIMaSID0gaSA9PiB7aX0pIHtcblx0cmV0dXJuIHRoaXMuZmlsdGVyKHNvdXJjZSwgKGZ1bmN0aW9uKCkge1xuXHRcdGxldCBsYXN0LCB0O1xuXHRcdHJldHVybiBmdW5jdGlvbih2KSB7XG5cdFx0XHR0ID0gxpIodik7XG5cdFx0XHRpZihsYXN0ICE9PSB0KSB7XG5cdFx0XHRcdGxhc3QgPSB0O1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KSgpKTtcbn07XG5TdHJlYW0udG9Cb29sID0gZnVuY3Rpb24oc291cmNlKSB7XG5cdHJldHVybiB0aGlzLm1hcChzb3VyY2UsICh2KSA9PiAhIXYpO1xufTtcblN0cmVhbS5uZWdhdGUgPSBmdW5jdGlvbihzb3VyY2UpIHtcblx0cmV0dXJuIHRoaXMubWFwKHNvdXJjZSwgKHYpID0+ICF2KTtcbn07XG5TdHJlYW0ubG9nID0gZnVuY3Rpb24oc291cmNlLCBwcmVmaXgpIHtcblx0cmV0dXJuIHRoaXMubWFwKHNvdXJjZSwgKHYpID0+IHtcblx0XHRpZihwcmVmaXgpXG5cdFx0XHRjb25zb2xlLmxvZyhwcmVmaXgsIHYpO1xuXHRcdGVsc2Vcblx0XHRcdGNvbnNvbGUubG9nKHYpO1xuXHRcdHJldHVybiB2O1xuXHR9KTtcbn07XG5TdHJlYW0uemlwID0gZnVuY3Rpb24oLi4uc291cmNlcykge1xuXHRsZXQgbGVuZ3RoID0gc291cmNlcy5sZW5ndGgsXG5cdFx0dW5zdWJzID0gW10sXG5cdFx0c3RyZWFtID0gbmV3IENhbmNlbGFibGVTdHJlYW0oKCkgPT4geyB1bnN1YnMubWFwKChzb3VyY2UsIGkpID0+IHNvdXJjZXNbaV0udW5zdWJzY3JpYmUodW5zdWJzW2ldKSkgfSksXG5cdFx0dmFsdWVzID0gbmV3IEFycmF5KGxlbmd0aCksXG5cdFx0ZmxhZ3MgID0gbmV3IEFycmF5KGxlbmd0aCksXG5cdFx0dXBkYXRlID0gKCkgPT4ge1xuXHRcdFx0aWYoZmxhZ3MuZmlsdGVyKCh2KSA9PiB2KS5sZW5ndGggPT09IGxlbmd0aCkge1xuXHRcdFx0XHR1cGRhdGUgPSAoKSA9PiBzdHJlYW0ucHVzaCh2YWx1ZXMpO1xuXHRcdFx0XHR1cGRhdGUoKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuXHRcdCgoaSkgPT4ge1xuXHRcdFx0c291cmNlc1tpXS5zdWJzY3JpYmUodW5zdWJzW2ldID0gKHYpID0+IHtcblx0XHRcdFx0dmFsdWVzW2ldID0gdjtcblx0XHRcdFx0ZmxhZ3NbaV0gPSB0cnVlO1xuXHRcdFx0XHR1cGRhdGUoKTtcblx0XHRcdH0pO1xuXHRcdH0pKGkpO1xuXHR9XG5cdHJldHVybiBzdHJlYW07XG59O1xuU3RyZWFtLmRlYm91bmNlID0gZnVuY3Rpb24oc291cmNlLCBkZWxheSkge1xuXHRsZXQgc3RyZWFtICAgPSBuZXcgUHVzaFN0cmVhbSgpLFxuXHRcdGRlbGF5aW5nID0gZmFsc2UsXG5cdFx0dDtcblx0c291cmNlLnN1YnNjcmliZSh2ID0+IHtcblx0XHR0ID0gdjtcblx0XHRpZihkZWxheWluZylcblx0XHRcdHJldHVybjtcblx0XHRkZWxheWluZyA9IHRydWU7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdGRlbGF5aW5nID0gZmFsc2U7XG5cdFx0XHRzdHJlYW0ucHVzaCh0KTtcblx0XHR9LCBkZWxheSk7XG5cdH0pO1xuXHRyZXR1cm4gc3RyZWFtO1xufTtcblN0cmVhbS5zcHJlYWQgPSBmdW5jdGlvbihzb3VyY2UsIMaSKSB7XG5cdHJldHVybiB0aGlzLnN1YnNjcmliZShzb3VyY2UsIChzdHJlYW0sIGFycikgPT4gc3RyZWFtLnB1c2goxpIuYXBwbHkobnVsbCwgYXJyKSkpO1xufTtcblN0cmVhbS5mbGF0TWFwID0gZnVuY3Rpb24oc291cmNlKSB7XG5cdHJldHVybiB0aGlzLnN1YnNjcmliZShzb3VyY2UsIChzdHJlYW0sIGFycikgPT4ge1xuXHRcdGZvcihsZXQgdiBpbiBhcnIpXG5cdFx0XHRzdHJlYW0ucHVzaCh2KTtcblx0fSk7XG59O1xuU3RyZWFtLm1lcmdlID0gZnVuY3Rpb24oLi4uc291cmNlcykge1xuXHRsZXQgc3RyZWFtLFxuXHRcdMaSID0gKHYpID0+IHN0cmVhbS5wdXNoKHYpO1xuXHRzdHJlYW0gPSBuZXcgQ2FuY2VsYWJsZVN0cmVhbSgoKSA9PiB7XG5cdFx0c291cmNlcy5tYXAoKHNvdXJjZSkgPT4gc291cmNlLnVuc3Vic2NyaWJlKMaSKSk7XG5cdH0pO1xuXHRzb3VyY2VzLm1hcCgoc291cmNlKSA9PiBzb3VyY2Uuc3Vic2NyaWJlKMaSKSk7XG5cdHJldHVybiBzdHJlYW07XG59O1xuU3RyZWFtLmludGVydmFsID0gZnVuY3Rpb24obXMsIHZhbHVlKSB7XG5cdGxldCBpZCxcblx0XHRzdHJlYW0gPSBuZXcgQ2FuY2VsYWJsZVN0cmVhbShmdW5jdGlvbigpIHsgY2xlYXJJbnRlcnZhbChpZCk7IH0pO1xuXHRpZCA9IHNldEludGVydmFsKCgpID0+IHN0cmVhbS5wdXNoKHZhbHVlKSwgbXMpO1xuXHRyZXR1cm4gc3RyZWFtO1xufTtcblN0cmVhbS5kZWxheSA9IGZ1bmN0aW9uKG1zLCB2YWx1ZSkge1xuXHRsZXQgaWQsXG5cdFx0c3RyZWFtID0gbmV3IENhbmNlbGFibGVTdHJlYW0oZnVuY3Rpb24oKSB7IGNsZWFyVGltZW91dChpZCk7IH0pO1xuXHRpZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdHN0cmVhbS5wdXNoKHZhbHVlKTtcblx0XHQvLyBjYW5jZWwgbmVlZHMgdG8gaGFwcGVuIGFmdGVyIHRoZSBwdXNoIGlzIHJlYWxpemVkXG5cdFx0VGltZXIuaW1tZWRpYXRlKHN0cmVhbS5jYW5jZWwuYmluZChzdHJlYW0pKTtcblx0fSwgbXMpO1xuXHRyZXR1cm4gc3RyZWFtO1xufTtcblN0cmVhbS5yZWR1Y2UgPSBmdW5jdGlvbihzb3VyY2UsIGFjYywgxpIpIHtcblx0cmV0dXJuIHRoaXMuc3Vic2NyaWJlKHNvdXJjZSwgKHN0cmVhbSwgdmFsdWUpID0+IHN0cmVhbS5wdXNoKGFjYyA9IMaSKGFjYywgdmFsdWUpKSk7XG59O1xuU3RyZWFtLmZlZWQgPSBmdW5jdGlvbihzb3VyY2UsIGRlc3QpIHtcblx0cmV0dXJuIHRoaXMuc3Vic2NyaWJlKHNvdXJjZSwgKHN0cmVhbSwgdmFsdWUpID0+IHtcblx0XHRzdHJlYW0ucHVzaCh2YWx1ZSk7XG5cdFx0ZGVzdC5wdXNoKHZhbHVlKTtcblx0fSk7XG59O1xuU3RyZWFtLmZyb21BcnJheSA9IGZ1bmN0aW9uKHZhbHVlcykge1xuXHRsZXQgc3RyZWFtID0gbmV3IFB1c2hTdHJlYW0oKTtcblx0dmFsdWVzLm1hcCgodikgPT4gc3RyZWFtLnB1c2godikpO1xuXHRyZXR1cm4gc3RyZWFtO1xufTtcblN0cmVhbS5zZXF1ZW5jZSA9IGZ1bmN0aW9uKHZhbHVlcywgaW50ZXJ2YWwsIHJlcGVhdCA9IGZhbHNlKSB7XG5cdGxldCBpZCxcblx0XHRzdHJlYW0gPSBuZXcgQ2FuY2VsYWJsZVN0cmVhbShmdW5jdGlvbigpIHsgY2xlYXJJbnRlcnZhbChpZCk7IH0pLFxuXHRcdGluZGV4ID0gMDtcblxuXHRpZCA9IHNldEludGVydmFsKCgpID0+IHtcblx0XHRpZihpbmRleCA9PT0gdmFsdWVzLmxlbmd0aCkge1xuXHRcdFx0aWYocmVwZWF0KSB7XG5cdFx0XHRcdGluZGV4ID0gMDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNsZWFySW50ZXJ2YWwoaWQpO1xuXHRcdFx0XHR0aGlzLmNhbmNlbCgpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHN0cmVhbS5wdXNoKHZhbHVlc1tpbmRleCsrXSk7XG5cdH0sIGludGVydmFsKTtcblx0cmV0dXJuIHN0cmVhbTtcbn07XG4vLyBUT0RPXG4vLyB1bnRpbCjGkilcbi8vIHRha2Uobilcbi8vIHNraXAobilcbi8vIHRocm90dGxlXG4vLyBmaWVsZChuYW1lKVxuLy8gbWV0aG9kKG5hbWUsIC4uLmFyZ3MpXG5cbmV4cG9ydCB7IFN0cmVhbSwgUHVzaFN0cmVhbSB9OyIsImltcG9ydCB7IFN0cmVhbSB9IGZyb20gJy4vc3RyZWFtJ1xuXG52YXIgX3ZhbHVlID0gU3ltYm9sKCksXG5cdF9kZWZhdWx0VmFsdWUgPSBTeW1ib2woKSxcblx0X3VwZGF0ZSA9IFN5bWJvbCgpO1xuXG5leHBvcnQgY2xhc3MgVmFsdWUgZXh0ZW5kcyBTdHJlYW0ge1xuXHRjb25zdHJ1Y3Rvcih2YWx1ZSwgZGVmYXVsdFZhbHVlKSB7XG5cdFx0bGV0IGNhbGxiYWNrID0gKHNpbmspID0+IHtcblx0XHRcdHRoaXNbX3VwZGF0ZV0gPSBzaW5rO1xuXHRcdH07XG5cdFx0c3VwZXIoY2FsbGJhY2spO1xuXHRcdHRoaXNbX2RlZmF1bHRWYWx1ZV0gPSBkZWZhdWx0VmFsdWU7XG5cdFx0dGhpc1tfdmFsdWVdID0gdmFsdWU7XG5cdH1cblx0c3Vic2NyaWJlKMaSKSB7XG5cdFx0xpIodGhpc1tfdmFsdWVdKTtcblx0XHRzdXBlci5zdWJzY3JpYmUoxpIpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cdHB1c2godmFsdWUpIHtcblx0XHRpZih2YWx1ZSA9PT0gdGhpc1tfdmFsdWVdKVxuXHRcdFx0cmV0dXJuO1xuXHRcdHRoaXNbX3ZhbHVlXSA9IHZhbHVlO1xuXHRcdHRoaXNbX3VwZGF0ZV0odmFsdWUpO1xuXHR9XG5cdGdldCB2YWx1ZSgpIHtcblx0XHRyZXR1cm4gdGhpc1tfdmFsdWVdO1xuXHR9XG5cdHNldCB2YWx1ZSh2KSB7XG5cdFx0dGhpcy5wdXNoKHYpO1xuXHR9XG5cdGdldCBpc0RlZmF1bHQoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3ZhbHVlXSA9PT0gdGhpc1tfZGVmYXVsdFZhbHVlXTtcblx0fVxuXHRyZXNldCgpIHtcblx0XHR0aGlzLnZhbHVlID0gdGhpc1tfZGVmYXVsdFZhbHVlXTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgU3RyaW5nVmFsdWUgZXh0ZW5kcyBWYWx1ZSB7XG5cdGNvbnN0cnVjdG9yKHZhbHVlID0gXCJcIiwgZGVmYXVsdFZhbHVlID0gdmFsdWUpIHtcblx0XHRzdXBlcih2YWx1ZSwgZGVmYXVsdFZhbHVlKTtcblx0fVxuXHRwdXNoKHZhbHVlKSB7XG5cdFx0c3VwZXIucHVzaCgodmFsdWUgJiYgdmFsdWUudG9TdHJpbmcgJiYgdmFsdWUudG9TdHJpbmcoKSkgfHwgKHZhbHVlICYmIChcIlwiICsgdmFsdWUpKSB8fCBcIlwiKTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgQm9vbFZhbHVlIGV4dGVuZHMgVmFsdWUge1xuXHRjb25zdHJ1Y3Rvcih2YWx1ZSA9IGZhbHNlLCBkZWZhdWx0VmFsdWUgPSB2YWx1ZSkge1xuXHRcdHN1cGVyKHZhbHVlLCBkZWZhdWx0VmFsdWUpO1xuXHR9XG5cdHB1c2godmFsdWUpIHtcblx0XHRzdXBlci5wdXNoKCEhdmFsdWUpO1xuXHR9XG5cdHRvZ2dsZSgpIHtcblx0XHR0aGlzLnB1c2goIXRoaXMudmFsdWUpO1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBOdW1iZXJWYWx1ZSBleHRlbmRzIFZhbHVlIHtcblx0Y29uc3RydWN0b3IodmFsdWUgPSAwLjAsIGRlZmF1bHRWYWx1ZSA9IHZhbHVlKSB7XG5cdFx0c3VwZXIodmFsdWUsIGRlZmF1bHRWYWx1ZSk7XG5cdH1cblx0cHVzaCh2YWx1ZSkge1xuXHRcdHN1cGVyLnB1c2goK25ldyBOdW1iZXIodmFsdWUpKTtcblx0fVxufVxuXG52YXIgZGVmYXVsdERhdGUgPSBuZXcgRGF0ZShudWxsKTtcbmV4cG9ydCBjbGFzcyBEYXRlVmFsdWUgZXh0ZW5kcyBWYWx1ZSB7XG5cdGNvbnN0cnVjdG9yKHZhbHVlID0gZGVmYXVsdERhdGUsIGRlZmF1bHRWYWx1ZSA9IHZhbHVlKSB7XG5cdFx0c3VwZXIodmFsdWUsIGRlZmF1bHRWYWx1ZSk7XG5cdH1cblx0cHVzaCh2YWx1ZSkge1xuXHRcdHN1cGVyLnB1c2gobmV3IERhdGUodmFsdWUpKTtcblx0fVxufSIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7IEZyYWdtZW50IH0gZnJvbSAnLi9mcmFnbWVudCc7XG5pbXBvcnQgeyBRdWVyeSB9IGZyb20gJ3VpL2RvbSc7XG5cbmxldCB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4vZmllbGQuamFkZScpKCksXG5cdF9wID0gU3ltYm9sKCk7XG5cbmV4cG9ydCBjbGFzcyBGaWVsZCBleHRlbmRzIENvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuXHRcdGlmKCEoJ3RlbXBsYXRlJyBpbiBvcHRpb25zKSlcblx0XHRcdG9wdGlvbnMudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcblx0XHRzdXBlcihvcHRpb25zKTtcblxuXHRcdGxldCBrZXkgICA9IG5ldyBGcmFnbWVudCgpLFxuXHRcdFx0dmFsdWUgPSBuZXcgRnJhZ21lbnQoKTtcblxuXHRcdGtleS5hdHRhY2hUbyhRdWVyeS5maXJzdCgnLmtleScsIHRoaXMuZWwpKTtcblx0XHR2YWx1ZS5hdHRhY2hUbyhRdWVyeS5maXJzdCgnLnZhbHVlJywgdGhpcy5lbCkpO1xuXG5cdFx0dGhpc1tfcF0gPSB7IGtleSwgdmFsdWUgfTtcblx0fVxuXG5cdGdldCBrZXkoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3BdLmtleTtcblx0fVxuXG5cdGdldCB2YWx1ZSgpIHtcblx0XHRyZXR1cm4gdGhpc1tfcF0udmFsdWU7XG5cdH1cbn0iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudCc7XG5cbmNsYXNzIEJsb2NrIGV4dGVuZHMgQ29tcG9uZW50IHtcblx0Y29uc3RydWN0b3Iob3B0aW9ucykge1xuXHRcdHN1cGVyKG9wdGlvbnMpO1xuXHR9XG59XG5cbmV4cG9ydCB7IEJsb2NrIH07IiwiaW1wb3J0IHsgSHRtbCB9IGZyb20gJ3VpL2RvbSc7XG5pbXBvcnQgeyBQcm9wZXJ0aWVzIH0gZnJvbSAnLi9wcm9wZXJ0aWVzJztcblxubGV0IGNyZWF0ZUlkID0gcmVxdWlyZSgnbm9kZS11dWlkJykudjQ7XG5cbmxldCBfcCA9IFN5bWJvbCgpO1xuXG5jbGFzcyBDb21wb25lbnQge1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcblx0XHRuZXcgUHJvcGVydGllcyh0aGlzKTtcblx0XHR0aGlzW19wXSA9IHtcblx0XHRcdGVsOiBIdG1sLnBhcnNlKG9wdGlvbnMudGVtcGxhdGUpLFxuXHRcdFx0YXR0YWNoZWQ6IGZhbHNlLFxuXHRcdFx0dXVpZDogb3B0aW9ucy51dWlkIHx8IGNyZWF0ZUlkKClcblx0XHR9O1xuXHR9XG5cblx0YXR0YWNoVG8oY29udGFpbmVyKSB7XG5cdFx0Y29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZWwpO1xuXHRcdHRoaXNbX3BdLmF0dGFjaGVkID0gdHJ1ZTtcblx0fVxuXG5cdGRldGFjaCgpIHtcblx0XHRpZighdGhpcy5pc0F0dGFjaGVkKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdDb21wb25lbnQgaXMgbm90IGF0dGFjaGVkJyk7XG5cdFx0dGhpcy5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuZWwpO1xuXHRcdHRoaXNbX3BdLmF0dGFjaGVkID0gZmFsc2U7XG5cdH1cblxuXHRkZXN0cm95KCkge1xuXHRcdGlmKHRoaXMuaXNBdHRhY2hlZClcblx0XHRcdHRoaXMuZGV0YWNoKCk7XG5cdFx0dGhpcy5wcm9wZXJ0aWVzLnJlbW92ZUFsbCgpO1xuXHR9XG5cblx0Z2V0IGVsKCkge1xuXHRcdHJldHVybiB0aGlzW19wXS5lbDtcblx0fVxuXG5cdGdldCB1dWlkKCkge1xuXHRcdHJldHVybiB0aGlzW19wXS51dWlkO1xuXHR9XG5cblx0Z2V0IGlzQXR0YWNoZWQoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3BdLmF0dGFjaGVkO1xuXHR9XG5cblx0dG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuIGBjb21wb25lbnQ6ICR7dGhpcy51dWlkfWA7XG5cdH1cbn1cblxuZXhwb3J0IHsgQ29tcG9uZW50IH07IiwibGV0IHAgPSBTeW1ib2woKSxcblx0SHRtbCA9IHtcblx0cGFyc2VBbGwoaHRtbCkge1xuXHRcdGxldCBlbCAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0ZWwuaW5uZXJIVE1MID0gaHRtbDtcblx0XHRyZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGVsLmNoaWxkTm9kZXMpO1xuXHR9LFxuXHRwYXJzZShodG1sKSB7XG5cdFx0cmV0dXJuIHRoaXMucGFyc2VBbGwoaHRtbClbMF07XG5cdH1cbn07XG5cbmNsYXNzIERvbVN0cmVhbSB7XG5cdGNvbnN0cnVjdG9yKHNvdXJjZSkge1xuXHRcdHRoaXNbcF0gPSBzb3VyY2U7XG5cdH1cblx0YXBwbHlEaXNwbGF5KGVsLCBkaXNwbGF5ID0gXCJcIikge1xuXHRcdGxldCBvbGQgPSBlbC5zdHlsZS5kaXNwbGF5LFxuXHRcdFx0xpIgPSAodikgPT4gZWwuc3R5bGUuZGlzcGxheSA9IHYgPyBkaXNwbGF5IDogXCJub25lXCI7XG5cdFx0dGhpc1twXS5zdWJzY3JpYmUoxpIpO1xuXHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHR0aGlzW3BdLnVuc3Vic2NyaWJlKMaSKTtcblx0XHRcdGVsLnN0eWxlLmRpc3BsYXkgPSBvbGQ7XG5cdFx0fTtcblx0fVxuXHRhcHBseVRleHQoZWwpIHtcblx0XHRsZXQgb2xkID0gZWwuaW5uZXJUZXh0LFxuXHRcdFx0xpIgPSAodikgPT4gZWwuaW5uZXJUZXh0ID0gdiB8fCBcIlwiO1xuXHRcdHRoaXNbcF0uc3Vic2NyaWJlKMaSKTtcblx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0dGhpc1twXS51bnN1YnNjcmliZSjGkik7XG5cdFx0XHTGkihvbGQpO1xuXHRcdH07XG5cdH1cblx0YXBwbHlIdG1sKGVsKSB7XG5cdFx0bGV0IG9sZCA9IGVsLmlubmVySFRNTCxcblx0XHRcdMaSID0gKHYpID0+IGVsLmlubmVySFRNTCA9IHYgfHwgXCJcIjtcblx0XHR0aGlzW3BdLnN1YnNjcmliZSjGkik7XG5cdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdHRoaXNbcF0udW5zdWJzY3JpYmUoxpIpO1xuXHRcdFx0xpIob2xkKTtcblx0XHR9O1xuXHR9XG5cdGFwcGx5QXR0cmlidXRlKG5hbWUsIGVsKSB7XG5cdFx0bGV0IG9sZCA9IGVsLmdldEF0dHJpYnV0ZShuYW1lKSxcblx0XHRcdMaSID0gKHYpID0+IHtcblx0XHRcdFx0diA9PSBudWxsID8gZWwucmVtb3ZlQXR0cmlidXRlKG5hbWUpIDogZWwuc2V0QXR0cmlidXRlKG5hbWUsIHYpO1xuXHRcdFx0fVxuXHRcdHRoaXNbcF0uc3Vic2NyaWJlKMaSKTtcblx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0dGhpc1twXS51bnN1YnNjcmliZSjGkik7XG5cdFx0XHTGkihvbGQpO1xuXHRcdH07XG5cdH1cblx0YXBwbHlTd2FwQ2xhc3MoZWwsIGNsYXNzTmFtZSkge1xuXHRcdGxldCBoYXMgPSBlbC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSxcblx0XHRcdMaSID0gKHYpID0+IHYgPyBlbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSkgOiBlbC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG5cdFx0dGhpc1twXS5zdWJzY3JpYmUoxpIpO1xuXHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHR0aGlzW3BdLnVuc3Vic2NyaWJlKMaSKTtcblx0XHRcdMaSKGhhcyk7XG5cdFx0fTtcblx0fVxufVxuXG5sZXQgRG9tID0ge1xuXHRzdHJlYW0oc291cmNlKSB7XG5cdFx0cmV0dXJuIG5ldyBEb21TdHJlYW0oc291cmNlKTtcblx0fSxcblx0cmVhZHkoxpIpIHtcblx0XHRpZijGkilcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIMaSLCBmYWxzZSk7XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCByZXNvbHZlLCBmYWxzZSkpO1xuXHR9XG59XG5cbmxldCBRdWVyeSA9IHtcblx0Zmlyc3Qoc2VsZWN0b3IsIGN0eCkge1xuXHRcdHJldHVybiAoY3R4IHx8IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcblx0fSxcblxuXHRhbGwoc2VsZWN0b3IsIGN0eCkge1xuXHRcdHJldHVybiAoY3R4IHx8IGRvY3VtZW50KS5xdWVyeShzZWxlY3Rvcik7XG5cdH1cbn07XG5cbmV4cG9ydCB7IEh0bWwsIFF1ZXJ5LCBEb20gfTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcblxuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJmaWVsZC1jb250YWluZXJcXFwiPjxkaXYgY2xhc3M9XFxcImZpZWxkXFxcIj48ZGl2IGNsYXNzPVxcXCJrZXlcXFwiPjwvZGl2PjxkaXYgY2xhc3M9XFxcInZhbHVlXFxcIj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJjYWxjdWxhdGVkXFxcIj48L2Rpdj48aHIvPjwvZGl2PlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQgeyBGcmFnbWVudCB9IGZyb20gJy4vZnJhZ21lbnQnO1xuaW1wb3J0IHsgUXVlcnkgfSBmcm9tICd1aS9kb20nO1xuXG5sZXQgdGVtcGxhdGUgPSByZXF1aXJlKCcuL2ZpZWxkLmphZGUnKSgpLFxuXHRfcCA9IFN5bWJvbCgpO1xuXG5leHBvcnQgY2xhc3MgRmllbGQgZXh0ZW5kcyBDb21wb25lbnQge1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcblx0XHRpZighKCd0ZW1wbGF0ZScgaW4gb3B0aW9ucykpXG5cdFx0XHRvcHRpb25zLnRlbXBsYXRlID0gdGVtcGxhdGU7XG5cdFx0c3VwZXIob3B0aW9ucyk7XG5cblx0XHRsZXQga2V5ICAgPSBuZXcgRnJhZ21lbnQoKSxcblx0XHRcdHZhbHVlID0gbmV3IEZyYWdtZW50KCk7XG5cblx0XHRrZXkuYXR0YWNoVG8oUXVlcnkuZmlyc3QoJy5rZXknLCB0aGlzLmVsKSk7XG5cdFx0dmFsdWUuYXR0YWNoVG8oUXVlcnkuZmlyc3QoJy52YWx1ZScsIHRoaXMuZWwpKTtcblxuXHRcdHRoaXNbX3BdID0geyBrZXksIHZhbHVlIH07XG5cdH1cblxuXHRnZXQga2V5KCkge1xuXHRcdHJldHVybiB0aGlzW19wXS5rZXk7XG5cdH1cblxuXHRnZXQgdmFsdWUoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3BdLnZhbHVlO1xuXHR9XG59IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG5cbmJ1Zi5wdXNoKFwiPHNwYW4gY2xhc3M9XFxcImZyYWdtZW50XFxcIj48c3BhbiBjbGFzcz1cXFwiY29udGVudFxcXCI+PC9zcGFuPjwvc3Bhbj5cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnQnO1xuXG5sZXQgdGVtcGxhdGUgPSByZXF1aXJlKCcuL2ZyYWdtZW50LmphZGUnKSgpO1xuXG5jbGFzcyBGcmFnbWVudCBleHRlbmRzIENvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuXHRcdGlmKCEoJ3RlbXBsYXRlJyBpbiBvcHRpb25zKSlcblx0XHRcdG9wdGlvbnMudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcblx0XHRzdXBlcihvcHRpb25zKTtcblx0fVxufVxuXG5leHBvcnQgeyBGcmFnbWVudCB9OyIsImltcG9ydCB7IEJsb2NrIH0gZnJvbSAnLi9ibG9jayc7XG5pbXBvcnQgeyBGcmFnbWVudCB9IGZyb20gJy4vZnJhZ21lbnQnO1xuXG5sZXQgX2ZyYWdtZW50cyA9IFN5bWJvbCgpO1xuXG5jbGFzcyBGcmFnbWVudEJsb2NrIGV4dGVuZHMgQmxvY2sge1xuXHRjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG5cdFx0c3VwZXIoLi4uYXJncyk7XG5cdFx0dGhpc1tfZnJhZ21lbnRzXSA9IFtdO1xuXHR9XG5cblx0Y3JlYXRlRnJhZ21lbnQoKSB7XG5cdFx0dmFyIGZyYWdtZW50ID0gbmV3IEZyYWdtZW50KCk7XG5cdFx0dGhpc1tfZnJhZ21lbnRzXS5wdXNoKGZyYWdtZW50KTtcblx0XHRmcmFnbWVudC5hdHRhY2hUbyh0aGlzLmVsKTtcblx0XHRyZXR1cm4gZnJhZ21lbnQ7XG5cdH1cbn1cblxuZXhwb3J0IHsgRnJhZ21lbnRCbG9jayB9OyIsImltcG9ydCB7IFB1c2hTdHJlYW0gfSBmcm9tICdzdHJlYW15L3N0cmVhbSc7XG5cbmxldCBfZGF0YSAgICA9IFN5bWJvbCgpLFxuXHRfc2NoZW1hICA9IFN5bWJvbCgpLFxuXHRfc3RyZWFtICA9IFN5bWJvbCgpLFxuXHRfbyAgICAgICA9IFN5bWJvbCgpLFxuXHRpZGVudGl0eSA9ICgpID0+IGZhbHNlO1xuXG5mdW5jdGlvbiByZXNvbHZlU2V0dGVyKHRhcmdldCwgcGF0aCkge1xuXHRpZihwYXRoIGluIHRhcmdldCkge1xuXHRcdHJldHVybiAodikgPT4ge1xuXHRcdFx0dGFyZ2V0W3BhdGhdID0gdjtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gaWRlbnRpdHk7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUluaXRpYWxpemVyKHRhcmdldCwgcGF0aCkge1xuXHRyZXR1cm4gKHYpID0+IHtcblx0XHR0YXJnZXRbcGF0aF0gPSB2O1xuXHRcdHJldHVybiB0cnVlO1xuXHR9O1xufVxuXG5mdW5jdGlvbiByZXNvbHZlRGVsZXRlcih0YXJnZXQsIHBhdGgpIHtcblx0cmV0dXJuICgpID0+IHtcblx0XHRkZWxldGUgdGFyZ2V0W3BhdGhdO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9O1xufVxuXG5mdW5jdGlvbiByZXNvbHZlUmVuYW1lcih0YXJnZXQsIHBhdGgpIHtcblx0cmV0dXJuIChuZXduYW1lKSA9PiB7XG5cdFx0bGV0IG9sZCA9IHRhcmdldFtwYXRoXTtcblx0XHRkZWxldGUgdGFyZ2V0W3BhdGhdO1xuXHRcdHRhcmdldFtuZXduYW1lXSA9IG9sZDtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fTtcbn1cblxuZXhwb3J0IGNsYXNzIE1vZGVsIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0bGV0IGRhdGEgICAgPSB0aGlzW19kYXRhXSAgID0gbmV3IFB1c2hTdHJlYW0oKSxcblx0XHRcdHNjaGVtYSAgPSB0aGlzW19zY2hlbWFdID0gbmV3IFB1c2hTdHJlYW0oKSxcblx0XHRcdHN0cmVhbSAgPSBuZXcgUHVzaFN0cmVhbSgpLFxuXHRcdFx0byAgICAgICA9IHRoaXNbX29dICAgICAgPSB7fTtcblxuXHRcdHRoaXNbX3N0cmVhbV0gPSBzdHJlYW0uZGVib3VuY2UoMTAwKS51bmlxdWUoSlNPTi5zdHJpbmdpZnkpO1xuXG5cdFx0ZGF0YS5zdWJzY3JpYmUoZSA9PiB7XG5cdFx0XHRpZihyZXNvbHZlU2V0dGVyKG8sIGUucGF0aCkoZS52YWx1ZSkpXG5cdFx0XHRcdHN0cmVhbS5wdXNoKG8pO1xuXHRcdH0pO1xuXHRcdHNjaGVtYS5zdWJzY3JpYmUoZSA9PiB7XG5cdFx0XHRzd2l0Y2goZS5ldmVudCkge1xuXHRcdFx0XHRjYXNlICdsaXN0Jzpcblx0XHRcdFx0XHRvID0gdGhpc1tfb10gPSB7fTtcblx0XHRcdFx0XHRsZXQgcmVzID0gZS5kYXRhLm1hcCgocGFpcikgPT4gcmVzb2x2ZUluaXRpYWxpemVyKG8sIHBhaXIubmFtZSkobnVsbCkpO1xuXHRcdFx0XHRcdGlmKHJlcy5maWx0ZXIociA9PiByKS5sZW5ndGggPT09IHJlcy5sZW5ndGgpXG5cdFx0XHRcdFx0XHRzdHJlYW0ucHVzaChvKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnYWRkJzpcblx0XHRcdFx0XHRpZihyZXNvbHZlSW5pdGlhbGl6ZXIobywgZS5uYW1lKShudWxsKSlcblx0XHRcdFx0XHRcdHN0cmVhbS5wdXNoKG8pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdkZWxldGUnOlxuXHRcdFx0XHRcdGlmKHJlc29sdmVEZWxldGVyKG8sIGUubmFtZSkoKSlcblx0XHRcdFx0XHRcdHN0cmVhbS5wdXNoKG8pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdyZW5hbWUnOlxuXHRcdFx0XHRcdGlmKHJlc29sdmVSZW5hbWVyKG8sIGUub2xkbmFtZSkoZS5uZXduYW1lKSlcblx0XHRcdFx0XHRcdHN0cmVhbS5wdXNoKG8pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0Z2V0IGRhdGEoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX2RhdGFdO1xuXHR9XG5cblx0Z2V0IHNjaGVtYSgpIHtcblx0XHRyZXR1cm4gdGhpc1tfc2NoZW1hXTtcblx0fVxuXG5cdGdldCBzdHJlYW0oKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3N0cmVhbV07XG5cdH1cblxuXHR0b0pTT04oKSB7XG5cdFx0cmV0dXJuIHRoaXNbX29dO1xuXHR9XG59IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG5cbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwibW9kZWx2aWV3XFxcIj48L2Rpdj5cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnQnO1xuaW1wb3J0IHsgVGV4dFByb3BlcnR5LCBUZXh0RWRpdG9yUHJvcGVydHksIEVkaXRvclByb3BlcnR5IH0gZnJvbSAnLi9wcm9wZXJ0aWVzL3R5cGVzJ1xuaW1wb3J0IHsgRmllbGQgfSBmcm9tICcuL2ZpZWxkJztcbmltcG9ydCB7IFB1c2hTdHJlYW0gfSBmcm9tICdzdHJlYW15L3N0cmVhbSc7XG5cbmxldCB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4vbW9kZWx2aWV3LmphZGUnKSgpLFxuXHRfZmllbGRzICA9IFN5bWJvbCgpLFxuXHRfZGF0YSAgICA9IFN5bWJvbCgpLFxuXHRfc2NoZW1hICA9IFN5bWJvbCgpO1xuXG5leHBvcnQgY2xhc3MgTW9kZWxWaWV3IGV4dGVuZHMgQ29tcG9uZW50IHtcblx0Y29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG5cdFx0aWYoISgndGVtcGxhdGUnIGluIG9wdGlvbnMpKVxuXHRcdFx0b3B0aW9ucy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuXHRcdHN1cGVyKG9wdGlvbnMpO1xuXHRcdHRoaXNbX2ZpZWxkc10gPSB7fTtcblx0XHR0aGlzW19kYXRhXSAgID0gbmV3IFB1c2hTdHJlYW0oKTtcblx0XHR0aGlzW19zY2hlbWFdID0gbmV3IFB1c2hTdHJlYW0oKTtcblx0fVxuXHRyZXNldCgpIHtcblx0XHR0aGlzLmFycmF5Lm1hcCgoa2V5KSA9PiB0aGlzLmRlbGV0ZUZpZWxkKG5hbWUpKTtcblx0fVxuXHRhZGRGaWVsZChuYW1lLCB0eXBlKSB7XG5cdFx0bGV0IGZpZWxkID0gbmV3IEZpZWxkKCk7XG5cdFx0ZmllbGQuYXR0YWNoVG8odGhpcy5lbCk7XG5cblx0XHRmaWVsZC5rZXkucHJvcGVydGllcy5hZGQobmV3IFRleHRQcm9wZXJ0eSgpKTtcblx0XHRmaWVsZC5rZXkucHJvcGVydGllcy5hZGQobmV3IFRleHRFZGl0b3JQcm9wZXJ0eSgpKTtcblx0XHRmaWVsZC5rZXkuZWRpdG9yLnZhbHVlLmZlZWQoZmllbGQua2V5LnRleHQpO1xuXHRcdGxldCBsYXN0O1xuXHRcdGZpZWxkLmtleS5lZGl0b3IudmFsdWUubWFwKHYgPT4ge1xuXHRcdFx0dGhpc1tfc2NoZW1hXS5wdXNoKHsgZXZlbnQ6J3JlbmFtZScsIG9sZG5hbWU6bGFzdCwgbmV3bmFtZTogdn0pO1xuXHRcdFx0bGFzdCA9IHY7XG5cdFx0fSk7XG5cdFx0ZmllbGQua2V5LmVkaXRvci52YWx1ZSA9IG5hbWU7XG5cblx0XHRmaWVsZC52YWx1ZS5wcm9wZXJ0aWVzLmFkZChFZGl0b3JQcm9wZXJ0eS5jcmVhdGUodHlwZSkpO1xuXG5cdFx0bGV0IHN0cmVhbSA9IGZpZWxkLnZhbHVlLmVkaXRvci52YWx1ZS5tYXAodiA9PiAoeyBwYXRoIDogZmllbGQua2V5LmVkaXRvci52YWx1ZS52YWx1ZSwgdmFsdWUgOiB2IH0pKTtcblx0XHRzdHJlYW0uZmVlZCh0aGlzW19kYXRhXSk7XG5cblx0XHR0aGlzW19maWVsZHNdW25hbWVdID0geyBmaWVsZCwgc3RyZWFtIH1cblx0fVxuXHRkZWxldGVGaWVsZChuYW1lKSB7XG5cdFx0bGV0IHBhaXIgPSB0aGlzLmdldFBhaXIobmFtZSk7XG5cdFx0cGFpci5maWVsZC5kZXN0cm95KCk7XG5cdFx0cGFpci5zdHJlYW0uY2FuY2VsKCk7XG5cdFx0ZGVsZXRlIHRoaXNbX2ZpZWxkc11bbmFtZV07XG5cdH1cblx0cmVuYW1lRmllbGQob2xkbmFtZSwgbmV3bmFtZSkge1xuXHRcdGxldCBwYWlyID0gdGhpcy5nZXRQYWlyKG9sZG5hbWUpO1xuXHRcdGRlbGV0ZSB0aGlzW19maWVsZHNdW29sZG5hbWVdO1xuXHRcdHRoaXNbX2ZpZWxkc11bbmV3bmFtZV0gPSBwYWlyO1xuXHRcdHBhaXIuZmllbGQua2V5LmVkaXRvci52YWx1ZSA9IG5ld25hbWU7XG5cdH1cblx0cmV0eXBlRmllbGQobmFtZSwgdHlwZSkge1xuXHRcdGxldCBwYWlyID0gdGhpcy5nZXRQYWlyKG5hbWUpO1xuXHRcdHBhaXIuc3RyZWFtLmNhbmNlbCgpO1xuXHRcdHBhaXIuZmllbGQudmFsdWUucHJvcGVydGllcy5yZW1vdmUoJ2VkaXRvcicpO1xuXHRcdHBhaXIuZmllbGQudmFsdWUucHJvcGVydGllcy5hZGQoRWRpdG9yUHJvcGVydHkuY3JlYXRlKHR5cGUpKTtcblx0XHRsZXQgc3RyZWFtID0gcGFpci5maWVsZC52YWx1ZS5lZGl0b3IudmFsdWUubWFwKHYgPT4gKHsgcGF0aCA6IG5hbWUsIHZhbHVlIDogdiB9KSk7XG5cdFx0c3RyZWFtLmZlZWQodGhpc1tfZGF0YV0pO1xuXHRcdHBhaXIuZmllbGQudmFsdWUuZWRpdG9yLnZhbHVlLmZlZWQocGFpci5maWVsZC52YWx1ZS50ZXh0KTtcblx0fVxuXG5cdHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiBgTW9kZWxWaWV3OiAke3RoaXMudXVpZH1gO1xuXHR9XG5cblx0Z2V0UGFpcihuYW1lKSB7XG5cdFx0bGV0IHBhaXIgPSB0aGlzW19maWVsZHNdW25hbWVdO1xuXHRcdGlmKCFwYWlyKSB0aHJvdyBuZXcgRXJyb3IoYGZpZWxkICcke25hbWV9IG5vdCBmb3VuZCBpbiBNb2RlbFZpZXcnYCk7XG5cdFx0cmV0dXJuIHBhaXI7XG5cdH1cblxuXHRnZXRGaWVsZChuYW1lKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0UGFpcihuYW1lKS5maWVsZDtcblx0fVxuXG5cdFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuXHRcdHJldHVybiB0aGlzLmFycmF5O1xuXHR9XG5cblx0Z2V0IGFycmF5KCkge1xuXHRcdHJldHVybiBPYmplY3Qua2V5cyh0aGlzW19maWVsZHNdKTtcblx0fVxuXG5cdGdldCBkYXRhKCkge1xuXHRcdHJldHVybiB0aGlzW19kYXRhXTtcblx0fVxuXG5cdGdldCBzY2hlbWEoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3NjaGVtYV07XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIFNjaGVtYVdyYXBwZXIge1xuXHRjb25zdHJ1Y3RvcihzY2hlbWEsIHZpZXcpIHtcblx0XHR0aGlzLnNjaGVtYSA9IHNjaGVtYTtcblx0XHR0aGlzLnZpZXcgPSB2aWV3O1xuXHRcdHNjaGVtYS5zdHJlYW0uc3Vic2NyaWJlKHRoaXMuaGFuZGxlci5iaW5kKHRoaXMpKTtcblx0XHR2aWV3LnNjaGVtYS5zdWJzY3JpYmUoZSA9PiB7XG5cdFx0XHRzd2l0Y2goZS5ldmVudCkge1xuXHRcdFx0XHRjYXNlICdyZW5hbWUnOlxuXHRcdFx0XHRcdGlmKGUub2xkbmFtZSkge1xuXHRcdFx0XHRcdFx0c2NoZW1hLnJlbmFtZShlLm9sZG5hbWUsIGUubmV3bmFtZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0aGFuZGxlcihtZXNzYWdlKSB7XG5cdFx0c3dpdGNoKG1lc3NhZ2UuZXZlbnQpIHtcblx0XHRcdGNhc2UgJ2xpc3QnOlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5oYW5kbGVMaXN0KG1lc3NhZ2UuZGF0YSk7XG5cdFx0XHRjYXNlICdhZGQnOlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5oYW5kbGVBZGQobWVzc2FnZS5uYW1lLCBtZXNzYWdlLnR5cGUpO1xuXHRcdFx0Y2FzZSAnZGVsZXRlJzpcblx0XHRcdFx0cmV0dXJuIHRoaXMuaGFuZGxlRGVsZXRlKG1lc3NhZ2UubmFtZSk7XG5cdFx0XHRjYXNlICdyZW5hbWUnOlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5oYW5kbGVSZW5hbWUobWVzc2FnZS5vbGRuYW1lLCBtZXNzYWdlLm5ld25hbWUpO1xuXHRcdFx0Y2FzZSAncmV0eXBlJzpcblx0XHRcdFx0cmV0dXJuIHRoaXMuaGFuZGxlUmV0eXBlKG1lc3NhZ2UubmFtZSwgbWVzc2FnZS50eXBlKTtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgaW52YWxpZCBtZXNzYWdlICcke21lc3NhZ2V9J2ApO1xuXHRcdH1cblx0fVxuXG5cdGhhbmRsZUxpc3QoZGF0YSkge1xuXHRcdHRoaXMudmlldy5yZXNldCgpO1xuXHRcdGRhdGEubWFwKHBhaXIgPT4gdGhpcy5oYW5kbGVBZGQocGFpci5uYW1lLCBwYWlyLnR5cGUpKTtcblx0fVxuXHRoYW5kbGVBZGQobmFtZSwgdHlwZSkge1xuXHRcdHRoaXMudmlldy5hZGRGaWVsZChuYW1lLCB0eXBlKTtcblx0fVxuXHRoYW5kbGVEZWxldGUobmFtZSkge1xuXHRcdHRoaXMudmlldy5kZWxldGVGaWVsZChuYW1lKTtcblx0fVxuXHRoYW5kbGVSZW5hbWUob2xkbmFtZSwgbmV3bmFtZSkge1xuXHRcdHRoaXMudmlldy5yZW5hbWVGaWVsZChvbGRuYW1lLCBuZXduYW1lKTtcblx0fVxuXHRoYW5kbGVSZXR5cGUobmFtZSwgdHlwZSkge1xuXHRcdHRoaXMudmlldy5yZXR5cGVGaWVsZChuYW1lLCB0eXBlKTtcblx0fVxufSIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxwIGNsYXNzPVxcXCJibG9ja1xcXCI+PC9wPlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJpbXBvcnQgeyBGcmFnbWVudEJsb2NrIH0gZnJvbSAnLi9mcmFnbWVudGJsb2NrJztcblxubGV0IHRlbXBsYXRlID0gcmVxdWlyZSgnLi9wYXJhZ3JhcGguamFkZScpKCk7XG5cbmNsYXNzIFBhcmFncmFwaCBleHRlbmRzIEZyYWdtZW50QmxvY2sge1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcblx0XHRpZighKCd0ZW1wbGF0ZScgaW4gb3B0aW9ucykpXG5cdFx0XHRvcHRpb25zLnRlbXBsYXRlID0gdGVtcGxhdGU7XG5cdFx0c3VwZXIob3B0aW9ucyk7XG5cdH1cbn1cblxuZXhwb3J0IHsgUGFyYWdyYXBoIH07IiwibGV0IF9uYW1lID0gU3ltYm9sKCk7XG5cbmNsYXNzIEJhc2VJbmplY3RvciB7XG5cdGluamVjdCh0YXJnZXQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJhYnN0cmFjdCBtZXRob2Q6IGluamVjdFwiKTtcblx0fVxuXG5cdGRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwgZ2V0dGVyLCBzZXR0ZXIpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCB7XG5cdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0d3JpdGVhYmxlOiBmYWxzZSxcblx0XHRcdGdldDogZ2V0dGVyLFxuXHRcdFx0c2V0OiBzZXR0ZXJcblx0XHR9KTtcblx0fVxufVxuXG5jbGFzcyBCYXNlUHJvcGVydHkgZXh0ZW5kcyBCYXNlSW5qZWN0b3Ige1xuXHRjb25zdHJ1Y3RvcihuYW1lKSB7XG5cdFx0dGhpc1tfbmFtZV0gPSBuYW1lO1xuXHR9XG5cblx0Z2V0IG5hbWUoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX25hbWVdO1xuXHR9XG59XG5cbmV4cG9ydCB7IEJhc2VQcm9wZXJ0eSwgQmFzZUluamVjdG9yIH07IiwiaW1wb3J0IHsgQmFzZVByb3BlcnR5IH0gZnJvbSAnLi9iYXNlJztcblxubGV0IF/GkiA9IFN5bWJvbCgpO1xuXG5jbGFzcyBCZWhhdmlvclByb3BlcnR5IGV4dGVuZHMgQmFzZVByb3BlcnR5IHtcblx0Y29uc3RydWN0b3IobmFtZSwgxpIpIHtcblx0XHRzdXBlcihuYW1lKTtcblx0XHR0aGlzW1/Gkl0gPSDGkjtcblx0fVxuXG5cdGluamVjdCh0YXJnZXQpIHtcblx0XHRsZXQgxpIgPSB0aGlzW1/Gkl0odGFyZ2V0KS5iaW5kKHRhcmdldCk7XG5cdFx0dGhpcy5kZWZpbmVQcm9wZXJ0eShcblx0XHRcdHRhcmdldCxcblx0XHRcdHRoaXMubmFtZSxcblx0XHRcdCgpID0+IMaSXG5cdFx0KTtcblx0XHRyZXR1cm4gKCkgPT4ge307XG5cdH1cbn1cblxuZXhwb3J0IHsgQmVoYXZpb3JQcm9wZXJ0eSB9OyIsImltcG9ydCB7IEJhc2VQcm9wZXJ0eSB9IGZyb20gJy4vYmFzZSc7XG5pbXBvcnQgeyBQcm9wZXJ0aWVzIH0gZnJvbSAnLi9wcm9wZXJ0aWVzJztcblxubGV0IF9wID0gU3ltYm9sKCk7XG5cbmNsYXNzIFByb3BlcnR5Q29udGFpbmVyIHtcblx0Y29uc3RydWN0b3IocGFyZW50KSB7XG5cdFx0dGhpc1tfcF0gPSBwYXJlbnQ7XG5cdFx0bmV3IFByb3BlcnRpZXModGhpcyk7XG5cdH1cblxuXHRnZXQgcGFyZW50KCkge1xuXHRcdHJldHVybiB0aGlzW19wXTtcblx0fVxufVxuXG5jbGFzcyBDb250YWluZXJQcm9wZXJ0eSBleHRlbmRzIEJhc2VQcm9wZXJ0eSB7XG5cdGNvbnN0cnVjdG9yKG5hbWUsIGRlZmF1bHRGaWVsZCwgd2lyZcaSKSB7XG5cdFx0c3VwZXIobmFtZSk7XG5cdFx0d2lyZcaSID0gd2lyZcaSIHx8ICgoKSA9PiB7fSk7XG5cdFx0dGhpc1tfcF0gPSB7IGRlZmF1bHRGaWVsZCwgd2lyZcaSIH07XG5cdH1cblxuXHRpbmplY3QodGFyZ2V0KSB7XG5cdFx0bGV0IGNvbnRhaW5lciA9IG5ldyBQcm9wZXJ0eUNvbnRhaW5lcih0YXJnZXQpLFxuXHRcdFx0c2V0dGVyID0gKHRoaXNbX3BdLmRlZmF1bHRGaWVsZCkgP1xuXHRcdFx0XHQodikgPT4gY29udGFpbmVyW3RoaXNbX3BdLmRlZmF1bHRGaWVsZF0ucHVzaCh2KSA6XG5cdFx0XHRcdHVuZGVmaW5lZDtcblxuXHRcdHRoaXMuZGVmaW5lUHJvcGVydHkoXG5cdFx0XHR0YXJnZXQsXG5cdFx0XHR0aGlzLm5hbWUsXG5cdFx0XHQoKSA9PiBjb250YWluZXIsXG5cdFx0XHRzZXR0ZXJcblx0XHQpO1xuXG5cdFx0cmV0dXJuIHRoaXNbX3BdLndpcmXGkih0YXJnZXQpIHx8ICgoKSA9PiB7fSk7XG5cdH1cbn1cblxuZXhwb3J0IHsgQ29udGFpbmVyUHJvcGVydHkgfTtcblxuLypcblx0YWRkQ29udGFpbmVyKG5hbWUsIGRlZmF1bHRGaWVsZCwgd2lyZSkge1xuXHRcdGlmKHRoaXNbdV1bbmFtZV0pXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEEgcHJvcGVydHkgJyR7bmFtZX0nIGFscmVhZHkgZXhpc3RzYCk7XG5cdFx0bGV0IGNvbnRhaW5lciA9IG5ldyBQcm9wZXJ0eUNvbnRhaW5lcih0aGlzWyRdLCB0aGlzKSxcblx0XHRcdHNldHRlciA9IChkZWZhdWx0RmllbGQpID9cblx0XHRcdFx0ZnVuY3Rpb24odikgeyBjb250YWluZXJbZGVmYXVsdEZpZWxkXS5wdXNoKHYpOyB9IDpcblx0XHRcdFx0ZnVuY3Rpb24oKSB7IHRocm93IG5ldyBFcnJvcignUHJvcGVydHkgQ29udGFpbmVyIGRvZXNuXFwndCBoYXZlIGEgZGVmYXVsdCBmaWVsZCcpOyB9LFxuXHRcdFx0dW53aXJlID0gd2lyZSAmJiB3aXJlLmNhbGwodGhpcywgdGhpc1skXSkgfHwgZnVuY3Rpb24oKXt9O1xuXHRcdHRoaXNbdV1bbmFtZV0gPSAoKSA9PiB7XG5cdFx0XHR1bndpcmUoKTtcblx0XHRcdGNvbnRhaW5lci5yZW1vdmVBbGwuY2FsbChjb250YWluZXIpO1xuXHRcdH07XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIG5hbWUsIHtcblx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHR3cml0ZWFibGU6IGZhbHNlLFxuXHRcdFx0Z2V0OiAoKSA9PiBjb250YWluZXIsXG5cdFx0XHRzZXQ6IHNldHRlclxuXHRcdH0pO1xuXHRcdHJldHVybiBjb250YWluZXI7XG5cdH1cbiovIiwiZXhwb3J0ICogZnJvbSAnLi9wcm9wZXJ0aWVzJzsiLCJ2YXIgX3AgPSBTeW1ib2w7XG5cbmNsYXNzIFByb3BlcnRpZXMge1xuXHRjb25zdHJ1Y3Rvcih0YXJnZXQpIHtcblx0XHR0aGlzW19wXSA9IHtcblx0XHRcdHRhcmdldDogdGFyZ2V0LFxuXHRcdFx0cHJvcGVydGllczoge30sXG5cdFx0XHRkaXNwb3NhYmxlczoge31cblx0XHR9O1xuXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgXCJwcm9wZXJ0aWVzXCIsIHtcblx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHR3cml0ZWFibGU6IGZhbHNlLFxuXHRcdFx0Z2V0OiAoKSA9PiB0aGlzXG5cdFx0fSk7XG5cdH1cblxuXHRhZGQocHJvcGVydHkpIHtcblx0XHRsZXQgbmFtZSA9IHByb3BlcnR5Lm5hbWU7XG5cdFx0aWYobmFtZSBpbiB0aGlzW19wXS50YXJnZXQpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYHByb3BlcnR5ICduYW1lJyBhbHJlYWR5IGV4aXN0c2ApO1xuXHRcdHRoaXNbX3BdLnByb3BlcnRpZXNbbmFtZV0gPSBwcm9wZXJ0eTtcblx0XHR0aGlzW19wXS5kaXNwb3NhYmxlc1tuYW1lXSA9IHByb3BlcnR5LmluamVjdCh0aGlzW19wXS50YXJnZXQpO1xuXHR9XG5cblx0cmVtb3ZlKHByb3BlcnR5KSB7XG5cdFx0bGV0IG5hbWUgPSBwcm9wZXJ0eS5uYW1lIHx8IHByb3BlcnR5O1xuXHRcdGlmKCEobmFtZSBpbiB0aGlzW19wXS5wcm9wZXJ0aWVzKSlcblx0XHRcdHRocm93IG5ldyBFcnJvcihgcHJvcGVydHkgJ25hbWUnIGRvZXNuJ3QgZXhpc3RgKTtcblx0XHR0aGlzW19wXS5kaXNwb3NhYmxlc1tuYW1lXSgpO1xuXHRcdGRlbGV0ZSB0aGlzW19wXS5kaXNwb3NhYmxlc1tuYW1lXTtcblx0XHRkZWxldGUgdGhpc1tfcF0ucHJvcGVydGllc1tuYW1lXTtcblx0fVxuXG5cdGdldChuYW1lKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3BdLnByb3BlcnRpZXNbbmFtZV07XG5cdH1cblxuXHRyZW1vdmVBbGwoKSB7XG5cdFx0Zm9yKGxldCBuYW1lIG9mIHRoaXMpIHtcblx0XHRcdHRoaXMucmVtb3ZlKG5hbWUpO1xuXHRcdH1cblx0fVxuXG5cdFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuXHRcdHJldHVybiB0aGlzLmFycmF5O1xuXHR9XG5cblx0Z2V0IGFycmF5KCkge1xuXHRcdHJldHVybiBPYmplY3Qua2V5cyh0aGlzW19wXS5wcm9wZXJ0aWVzKTtcblx0fVxuXG5cdGNvcHlUbyh0YXJnZXQpIHtcblx0XHRmb3IobGV0IGtleSBvZiB0aGlzLmFycmF5KSB7XG5cdFx0XHR0YXJnZXQucHJvcGVydGllcy5hZGQodGhpcy5nZXQoa2V5KSk7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCB7IFByb3BlcnRpZXMgfTsiLCJpbXBvcnQgeyBTdHJpbmdWYWx1ZSB9IGZyb20gJ3N0cmVhbXkvdmFsdWUnO1xuaW1wb3J0IHsgVmFsdWVTdHJlYW1Qcm9wZXJ0eSB9IGZyb20gJy4uL3ZhbHVlc3RyZWFtJztcbmltcG9ydCB7IERvbSB9IGZyb20gJ3VpL2RvbSc7XG5cbmNsYXNzIEF0dHJpYnV0ZVByb3BlcnR5IGV4dGVuZHMgVmFsdWVTdHJlYW1Qcm9wZXJ0eSB7XG5cdGNvbnN0cnVjdG9yKG5hbWUsIGF0dHJpYnV0ZSwgdGV4dCA9IFwiXCIpIHtcblx0XHRzdXBlcihcblx0XHRcdG5hbWUsXG5cdFx0XHQoKSA9PiBuZXcgU3RyaW5nVmFsdWUodGV4dCksXG5cdFx0XHQodGFyZ2V0LCB2YWx1ZSkgID0+XG5cdFx0XHRcdERvbS5zdHJlYW0odmFsdWUpLmFwcGx5QXR0cmlidXRlKGF0dHJpYnV0ZSwgdGFyZ2V0LmVsKVxuXHRcdCk7XG5cdH1cbn1cblxuY2xhc3MgVG9vbHRpcFByb3BlcnR5IGV4dGVuZHMgQXR0cmlidXRlUHJvcGVydHkge1xuXHRjb25zdHJ1Y3RvcihkZWZhdWx0VmFsdWUgPSBmYWxzZSkge1xuXHRcdHN1cGVyKFwidG9vbHRpcFwiLCBcInRpdGxlXCIsIGRlZmF1bHRWYWx1ZSk7XG5cdH1cbn1cblxuZXhwb3J0IHsgVG9vbHRpcFByb3BlcnR5LCBBdHRyaWJ1dGVQcm9wZXJ0eSB9OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKHVuZGVmaW5lZCkge1xuYnVmLnB1c2goXCI8aW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiXCIgKyAoamFkZS5hdHRyKFwiY2hlY2tlZFwiLCAodHJ1ZT09PWZhbHNlID8gXCJjaGVja2VkXCIgOiB1bmRlZmluZWQpLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcImJvb2wgZWRpdG9yXFxcIi8+XCIpO30oXCJ1bmRlZmluZWRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnVuZGVmaW5lZDp0eXBlb2YgdW5kZWZpbmVkIT09XCJ1bmRlZmluZWRcIj91bmRlZmluZWQ6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwiaW1wb3J0IHsgQ29udGFpbmVyUHJvcGVydHkgfSBmcm9tICcuLi9jb250YWluZXInO1xuaW1wb3J0IHsgQmVoYXZpb3JQcm9wZXJ0eSB9IGZyb20gJy4uL2JlaGF2aW9yJztcbmltcG9ydCB7IFZhbHVlUHJvcGVydHkgfSBmcm9tICcuL3ZhbHVlJztcbmltcG9ydCB7IERvbSwgUXVlcnksIEh0bWwgfSBmcm9tICd1aS9kb20nO1xuXG5sZXQgdGVtcGxhdGUgPSByZXF1aXJlKCcuL2Jvb2xlZGl0b3IuamFkZScpO1xuXG5sZXQgX2JvdW5kID0gU3ltYm9sKCksXG5cdF9iaW5kxpIgPSBTeW1ib2woKSxcblx0X3VuYmluZMaSID0gU3ltYm9sKCksXG5cdHZhbHVlUHJvcGVydHkgPSBuZXcgVmFsdWVQcm9wZXJ0eSgnQm9vbCcsIChlZGl0b3IsIHZhbHVlKSA9PiB7XG5cdFx0bGV0IGVsICAgICAgPSBlZGl0b3IucGFyZW50LmVsLFxuXHRcdFx0Y29udGVudCA9IFF1ZXJ5LmZpcnN0KCcuY29udGVudCcsIGVsKSxcblx0XHRcdGxpc3RlbsaSID0gKCkgPT4ge1xuXHRcdFx0XHR2YWx1ZS5wdXNoKGlucHV0LmNoZWNrZWQpO1xuXHRcdFx0fSxcblx0XHRcdGlucHV0ICAgPSBIdG1sLnBhcnNlKHRlbXBsYXRlKHsgY2hlY2tlZCA6IHZhbHVlLnZhbHVlIH0pKTtcblxuXHRcdGNvbnRlbnQuYXBwZW5kQ2hpbGQoaW5wdXQpO1xuXG5cdFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBsaXN0ZW7GkiwgZmFsc2UpO1xuXG5cdFx0Ly8gY2FuY2VsXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0aW5wdXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBsaXN0ZW7GkiwgZmFsc2UpO1xuXHRcdH07XG5cdH0pLFxuXHRmb2N1c1Byb3BlcnR5ID0gbmV3IEJlaGF2aW9yUHJvcGVydHkoJ2ZvY3VzJywgKHRhcmdldCkgPT4ge1xuXHRcdGxldCBjb250ZW50ID0gUXVlcnkuZmlyc3QoJy5jb250ZW50JywgdGFyZ2V0LnBhcmVudC5lbCk7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29udGVudC5mb2N1cygpO1xuXHRcdH07XG5cdH0pO1xuXG5jbGFzcyBCb29sRWRpdG9yUHJvcGVydHkgZXh0ZW5kcyBDb250YWluZXJQcm9wZXJ0eSB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCdlZGl0b3InLCAndmFsdWUnKTtcblx0fVxuXG5cdGluamVjdCh0YXJnZXQpIHtcblx0XHRsZXQgxpIgPSBzdXBlci5pbmplY3QodGFyZ2V0KSxcblx0XHRcdGVkaXRvciA9IHRhcmdldC5lZGl0b3I7XG5cblx0XHRlZGl0b3IucHJvcGVydGllcy5hZGQodmFsdWVQcm9wZXJ0eSk7XG5cdFx0ZWRpdG9yLnByb3BlcnRpZXMuYWRkKGZvY3VzUHJvcGVydHkpO1xuXG5cdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdGVkaXRvci5wcm9wZXJ0aWVzLnJlbW92ZShmb2N1c1Byb3BlcnR5KTtcblx0XHRcdMaSKCk7XG5cdFx0fTtcblx0fVxufVxuXG5leHBvcnQgeyBCb29sRWRpdG9yUHJvcGVydHkgfTsiLCJpbXBvcnQgeyBWYWx1ZVN0cmVhbVByb3BlcnR5IH0gZnJvbSAnLi4vdmFsdWVzdHJlYW0nO1xuaW1wb3J0IHsgQm9vbFZhbHVlIH0gZnJvbSAnc3RyZWFteS92YWx1ZSc7XG5pbXBvcnQgeyBEb20gfSBmcm9tICd1aS9kb20nO1xuXG5jbGFzcyBTd2FwQ2xhc3NQcm9wZXJ0eSBleHRlbmRzIFZhbHVlU3RyZWFtUHJvcGVydHkge1xuXHRjb25zdHJ1Y3RvcihuYW1lLCBjbGFzc05hbWUgPSBuYW1lLCBkZWZhdWx0VmFsdWUgPSBmYWxzZSkge1xuXHRcdHN1cGVyKFxuXHRcdFx0bmFtZSxcblx0XHRcdCgpID0+IG5ldyBCb29sVmFsdWUoZGVmYXVsdFZhbHVlKSxcblx0XHRcdCh0YXJnZXQsIHZhbHVlKSAgPT5cblx0XHRcdFx0RG9tLnN0cmVhbSh2YWx1ZSkuYXBwbHlTd2FwQ2xhc3ModGFyZ2V0LmVsLCBjbGFzc05hbWUpXG5cdFx0KTtcblx0fVxufVxuXG5jbGFzcyBTdHJvbmdQcm9wZXJ0eSBleHRlbmRzIFN3YXBDbGFzc1Byb3BlcnR5IHtcblx0Y29uc3RydWN0b3IoZGVmYXVsdFZhbHVlID0gZmFsc2UpIHtcblx0XHRzdXBlcihcInN0cm9uZ1wiLCBcInN0cm9uZ1wiLCBkZWZhdWx0VmFsdWUpO1xuXHR9XG59XG5cbmNsYXNzIEVtcGhhc2lzUHJvcGVydHkgZXh0ZW5kcyBTd2FwQ2xhc3NQcm9wZXJ0eSB7XG5cdGNvbnN0cnVjdG9yKGRlZmF1bHRWYWx1ZSA9IGZhbHNlKSB7XG5cdFx0c3VwZXIoXCJlbXBoYXNpc1wiLCBcImVtcGhhc2lzXCIsIGRlZmF1bHRWYWx1ZSk7XG5cdH1cbn1cblxuY2xhc3MgU3RyaWtlUHJvcGVydHkgZXh0ZW5kcyBTd2FwQ2xhc3NQcm9wZXJ0eSB7XG5cdGNvbnN0cnVjdG9yKGRlZmF1bHRWYWx1ZSA9IGZhbHNlKSB7XG5cdFx0c3VwZXIoXCJzdHJpa2VcIiwgXCJzdHJpa2VcIiwgZGVmYXVsdFZhbHVlKTtcblx0fVxufVxuXG5leHBvcnQgeyBTdHJvbmdQcm9wZXJ0eSwgRW1waGFzaXNQcm9wZXJ0eSwgU3RyaWtlUHJvcGVydHksIFN3YXBDbGFzc1Byb3BlcnR5IH07IiwiaW1wb3J0IHsgQm9vbEVkaXRvclByb3BlcnR5IH0gZnJvbSAnLi9ib29sZWRpdG9yJztcbmltcG9ydCB7IFRleHRFZGl0b3JQcm9wZXJ0eSB9IGZyb20gJy4vdGV4dGVkaXRvcic7XG5cbmV4cG9ydCBsZXQgRWRpdG9yUHJvcGVydHkgPSB7XG5cdGNyZWF0ZSh0eXBlLCAuLi5hcmdzKSB7XG5cdFx0c3dpdGNoKHR5cGUpIHtcblx0XHRcdGNhc2UgJ1N0cmluZyc6XG5cdFx0XHRcdHJldHVybiBuZXcgVGV4dEVkaXRvclByb3BlcnR5KC4uLmFyZ3MpO1xuXHRcdFx0Y2FzZSAnQm9vbCc6XG5cdFx0XHRcdHJldHVybiBuZXcgQm9vbEVkaXRvclByb3BlcnR5KC4uLmFyZ3MpO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGVkaXRvciB0eXBlICcke3R5cGV9J2ApO1xuXHRcdH1cblx0fVxufSIsImltcG9ydCB7IFZhbHVlU3RyZWFtUHJvcGVydHkgfSBmcm9tICcuLi92YWx1ZXN0cmVhbSc7XG5pbXBvcnQgeyBTdHJpbmdWYWx1ZSB9IGZyb20gJ3N0cmVhbXkvdmFsdWUnO1xuaW1wb3J0IHsgRG9tLCBRdWVyeSB9IGZyb20gJ3VpL2RvbSc7XG5cbmV4cG9ydCBjbGFzcyBIdG1sUHJvcGVydHkgZXh0ZW5kcyBWYWx1ZVN0cmVhbVByb3BlcnR5IHtcblx0Y29uc3RydWN0b3IoaHRtbCkge1xuXHRcdHN1cGVyKFxuXHRcdFx0XCJodG1sXCIsXG5cdFx0XHQoKSA9PiBuZXcgU3RyaW5nVmFsdWUoaHRtbCksXG5cdFx0XHR0aGlzLmFzc2lnbkh0bWxcblx0XHQpO1xuXHR9XG5cblx0YXNzaWduSHRtbCh0YXJnZXQsIHZhbHVlKSB7XG5cdFx0RG9tLnN0cmVhbSh2YWx1ZSkuYXBwbHlIdG1sKFF1ZXJ5LmZpcnN0KCcuY29udGVudCcsIHRhcmdldC5lbCkpXG5cdH1cbn0iLCJpbXBvcnQgeyBIdG1sUHJvcGVydHkgfSBmcm9tICcuL2h0bWwnO1xuaW1wb3J0IHsgU3RyaW5nVmFsdWUgfSBmcm9tICdzdHJlYW15L3ZhbHVlJztcbmltcG9ydCB7IERvbSwgUXVlcnkgfSBmcm9tICd1aS9kb20nO1xuXG5leHBvcnQgY2xhc3MgSWNvblByb3BlcnR5IGV4dGVuZHMgSHRtbFByb3BlcnR5IHtcblx0YXNzaWduSHRtbCh0YXJnZXQsIHZhbHVlKSB7XG5cdFx0bGV0IHRyYW5zZm9ybSA9IHZhbHVlLm1hcCgoaWNvbikgPT4gYDxpIGNsYXNzPVwiZmEgZmEtJHtpY29ufVwiPjwvaT5gKSxcblx0XHRcdMaSID0gc3VwZXIuYXNzaWduSHRtbCh0YXJnZXQsIHRyYW5zZm9ybSk7XG5cdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdHRyYW5zZm9ybS5jYW5jZWwoKTtcblx0XHRcdMaSKCk7XG5cdFx0fTtcblx0fVxufSIsImV4cG9ydCAqIGZyb20gJy4vYXR0cmlidXRlJztcbmV4cG9ydCAqIGZyb20gJy4vYm9vbGVkaXRvcic7XG5leHBvcnQgKiBmcm9tICcuL2NsYXNzbmFtZSc7XG5leHBvcnQgKiBmcm9tICcuL2VkaXRvcic7XG5leHBvcnQgKiBmcm9tICcuL2h0bWwnO1xuZXhwb3J0ICogZnJvbSAnLi9pY29uJztcbmV4cG9ydCAqIGZyb20gJy4vdGV4dGVkaXRvcic7XG5leHBvcnQgKiBmcm9tICcuL251bWVyaWNmb3JtYXQnO1xuZXhwb3J0ICogZnJvbSAnLi9saW5rJztcbmV4cG9ydCAqIGZyb20gJy4vdGV4dCc7XG5leHBvcnQgKiBmcm9tICcuL3ZhbHVlJztcbmV4cG9ydCAqIGZyb20gJy4vdmlzaWJsZSc7IiwiaW1wb3J0IHsgVmFsdWVTdHJlYW1Qcm9wZXJ0eSB9IGZyb20gJy4uL3ZhbHVlc3RyZWFtJztcbmltcG9ydCB7IFN0cmluZ1ZhbHVlIH0gZnJvbSAnc3RyZWFteS92YWx1ZSc7XG5cbmNsYXNzIExpbmtQcm9wZXJ0eSBleHRlbmRzIFZhbHVlU3RyZWFtUHJvcGVydHkge1xuXHRjb25zdHJ1Y3Rvcih1cmwgPSBcIlwiKSB7XG5cdFx0c3VwZXIoXG5cdFx0XHRcImxpbmtcIixcblx0XHRcdCgpID0+IG5ldyBTdHJpbmdWYWx1ZSh1cmwpLFxuXHRcdFx0KHRhcmdldCwgdmFsdWUpICA9PiB7XG5cdFx0XHRcdGxldCBhICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKSxcblx0XHRcdFx0XHRlbCA9IHRhcmdldC5lbCxcblx0XHRcdFx0XHTGkiAgPSAodXJsKSA9PiBhLmhyZWYgPSB1cmw7XG5cdFx0XHRcdGEudGFyZ2V0ID0gXCJfYmxhbmtcIjtcblx0XHRcdFx0Zm9yKGxldCBpID0gMDsgaSA8IGVsLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRhLmFwcGVuZENoaWxkKGVsLmNoaWxkTm9kZXNbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsLmFwcGVuZENoaWxkKGEpO1xuXHRcdFx0XHR2YWx1ZS5zdWJzY3JpYmUoxpIpO1xuXHRcdFx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0XHRcdHZhbHVlLnVuc3Vic2NyaWJlKMaSKTtcblx0XHRcdFx0XHRlbC5yZW1vdmVDaGlsZChhKTtcblx0XHRcdFx0XHRmb3IobGV0IGkgPSAwOyBpIDwgYS5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRlbC5hcHBlbmRDaGlsZChhLmNoaWxkTm9kZXNbaV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHQpO1xuXHR9XG59XG5cbmV4cG9ydCB7IExpbmtQcm9wZXJ0eSB9OyIsImltcG9ydCB7IFN0cmluZ1ZhbHVlIH0gZnJvbSAnc3RyZWFteS92YWx1ZSc7XG5pbXBvcnQgeyBWYWx1ZVN0cmVhbVByb3BlcnR5IH0gZnJvbSAnLi4vdmFsdWVzdHJlYW0nO1xuXG5sZXQgbnVtZXJhbCA9IHJlcXVpcmUoJ251bWVyYWwnKTtcblxuY2xhc3MgTnVtZXJpY0Zvcm1hdFByb3BlcnR5IGV4dGVuZHMgVmFsdWVTdHJlYW1Qcm9wZXJ0eSB7XG5cdGNvbnN0cnVjdG9yKGRlZmF1bHRGb3JtYXQgPSBcIlwiKSB7XG5cdFx0c3VwZXIoXG5cdFx0XHRcImZvcm1hdFwiLFxuXHRcdFx0KCkgPT4gbmV3IFN0cmluZ1ZhbHVlKGRlZmF1bHRGb3JtYXQpLFxuXHRcdFx0KHRhcmdldCwgZm9ybWF0KSA9PiB7XG5cdFx0XHRcdGxldCB2YWx1ZSA9IHRhcmdldC52YWx1ZSxcblx0XHRcdFx0XHR0ZXh0ICA9IHRhcmdldC50ZXh0O1xuXHRcdFx0XHRpZighdmFsdWUpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCInZm9ybWF0JyByZXF1aXJlcyB0aGUgcHJvcGVydHkgJ3ZhbHVlJ1wiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZighdGV4dCkge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIidmb3JtYXQnIHJlcXVpcmVzIHRoZSBwcm9wZXJ0eSAndGV4dCdcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGV0IHN0cmVhbSA9IHZhbHVlLnppcChmb3JtYXQpO1xuXHRcdFx0XHRzdHJlYW0uc3ByZWFkKCh2YWx1ZSwgZm9ybWF0KSA9PiB7XG5cdFx0XHRcdFx0aWYoZm9ybWF0ID09PSBcIlwiKSB7XG5cdFx0XHRcdFx0XHRmb3JtYXQgPSBNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUgPyBcIjAsMFwiIDogXCIwLDAuMDAwXCI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRleHQudmFsdWUgPSBudW1lcmFsKHZhbHVlKS5mb3JtYXQoZm9ybWF0KTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybiBzdHJlYW0uY2FuY2VsLmJpbmQoc3RyZWFtKTtcblx0XHRcdH1cblx0XHQpO1xuXHR9XG59XG5cbmV4cG9ydCB7IE51bWVyaWNGb3JtYXRQcm9wZXJ0eSB9OyIsImltcG9ydCB7IFZhbHVlU3RyZWFtUHJvcGVydHkgfSBmcm9tICcuLi92YWx1ZXN0cmVhbSc7XG5pbXBvcnQgeyBTdHJpbmdWYWx1ZSB9IGZyb20gJ3N0cmVhbXkvdmFsdWUnO1xuaW1wb3J0IHsgRG9tLCBRdWVyeSB9IGZyb20gJ3VpL2RvbSc7XG5cbmNsYXNzIFRleHRQcm9wZXJ0eSBleHRlbmRzIFZhbHVlU3RyZWFtUHJvcGVydHkge1xuXHRjb25zdHJ1Y3Rvcih0ZXh0KSB7XG5cdFx0c3VwZXIoXG5cdFx0XHRcInRleHRcIixcblx0XHRcdCgpID0+IG5ldyBTdHJpbmdWYWx1ZSh0ZXh0KSxcblx0XHRcdCh0YXJnZXQsIHZhbHVlKSAgPT5cblx0XHRcdFx0RG9tLnN0cmVhbSh2YWx1ZSkuYXBwbHlUZXh0KFF1ZXJ5LmZpcnN0KCcuY29udGVudCcsIHRhcmdldC5lbCkpXG5cdFx0KTtcblx0fVxufVxuXG5leHBvcnQgeyBUZXh0UHJvcGVydHkgfTsiLCJpbXBvcnQgeyBDb250YWluZXJQcm9wZXJ0eSB9IGZyb20gJy4uL2NvbnRhaW5lcic7XG5pbXBvcnQgeyBCZWhhdmlvclByb3BlcnR5IH0gZnJvbSAnLi4vYmVoYXZpb3InO1xuaW1wb3J0IHsgVmFsdWVQcm9wZXJ0eSB9IGZyb20gJy4vdmFsdWUnO1xuaW1wb3J0IHsgRG9tLCBRdWVyeSB9IGZyb20gJ3VpL2RvbSc7XG5cbmxldCBfYm91bmQgPSBTeW1ib2woKSxcblx0X2JpbmTGkiA9IFN5bWJvbCgpLFxuXHRfdW5iaW5kxpIgPSBTeW1ib2woKSxcblx0dmFsdWVQcm9wZXJ0eSA9IG5ldyBWYWx1ZVByb3BlcnR5KCdTdHJpbmcnLCAoZWRpdG9yLCB2YWx1ZSkgPT4ge1xuXHRcdGxldCBlbCAgICAgID0gZWRpdG9yLnBhcmVudC5lbCxcblx0XHRcdGNvbnRlbnQgPSBRdWVyeS5maXJzdCgnLmNvbnRlbnQnLCBlbCksXG5cdFx0XHRzdHJlYW0gID0gdmFsdWUubWFwKChzKSA9PiBzLmxlbmd0aCA9PT0gMCkudW5pcXVlKCksXG5cdFx0XHRjYW5jZWzGkiA9IERvbS5zdHJlYW0oc3RyZWFtKS5hcHBseVN3YXBDbGFzcyhjb250ZW50LCAnZW1wdHknKSxcblx0XHRcdGxpc3RlbsaSID0gKGUpID0+IHtcblx0XHRcdFx0dmFsdWUucHVzaChlbC5pbm5lclRleHQpO1xuXHRcdFx0fTtcblxuXHRcdGVkaXRvcltfYm91bmRdID0gZmFsc2U7XG5cdFx0ZWRpdG9yW19iaW5kxpJdID0gKCkgPT4ge1xuXHRcdFx0aWYoZWRpdG9yW19ib3VuZF0pIHJldHVybjtcblx0XHRcdGNvbnRlbnQuc2V0QXR0cmlidXRlKFwiY29udGVudGVkaXRhYmxlXCIsIHRydWUpO1xuXHRcdFx0Y29udGVudC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgbGlzdGVuxpIsIGZhbHNlKTtcblx0XHRcdGVkaXRvcltfYm91bmRdID0gdHJ1ZTtcblx0XHR9LFxuXHRcdGVkaXRvcltfdW5iaW5kxpJdID0gKCkgPT4ge1xuXHRcdFx0aWYoIWVkaXRvcltfYm91bmRdKSByZXR1cm47XG5cdFx0XHRjb250ZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBsaXN0ZW7GkiwgZmFsc2UpO1xuXHRcdFx0Y29udGVudC5yZW1vdmVBdHRyaWJ1dGUoXCJjb250ZW50ZWRpdGFibGVcIik7XG5cdFx0XHRlZGl0b3JbX2JvdW5kXSA9IGZhbHNlO1xuXHRcdH07XG5cblx0XHRsZXQgZm9jdXPGkiA9ICgpID0+IGVkaXRvci5mb2N1cygpO1xuXG5cdFx0Y29udGVudC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJzAnKTtcblx0XHRjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCBmb2N1c8aSLCBmYWxzZSk7XG5cblx0XHRjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsICgpID0+IGVkaXRvcltfdW5iaW5kxpJdKCkpO1xuXG5cdFx0Ly8gY2FuY2VsXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y2FuY2VsxpIoKTtcblx0XHRcdGVkaXRvcltfdW5iaW5kxpJdKCk7XG5cdFx0XHRkZWxldGUgZWRpdG9yW191bmJpbmTGkl07XG5cdFx0XHRkZWxldGUgZWRpdG9yW19iaW5kxpJdO1xuXHRcdFx0ZGVsZXRlIGVkaXRvcltfYm91bmRdO1xuXHRcdFx0Y29udGVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgZm9jdXPGkiwgZmFsc2UpO1xuXHRcdFx0Y29udGVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgbGlzdGVuxpIsIGZhbHNlKTtcblx0XHRcdGNvbnRlbnQucmVtb3ZlQXR0cmlidXRlKFwiY29udGVudGVkaXRhYmxlXCIpO1xuXHRcdH07XG5cdH0pLFxuXHRmb2N1c1Byb3BlcnR5ID0gbmV3IEJlaGF2aW9yUHJvcGVydHkoJ2ZvY3VzJywgKHRhcmdldCkgPT4ge1xuXHRcdGxldCBjb250ZW50ID0gUXVlcnkuZmlyc3QoJy5jb250ZW50JywgdGFyZ2V0LnBhcmVudC5lbCk7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0dGFyZ2V0W19iaW5kxpJdKCk7XG5cdFx0XHRjb250ZW50LmZvY3VzKCk7XG5cdFx0fTtcblx0fSksXG5cdGdldFNlbGVjdGlvblByb3BlcnR5ID0gbmV3IEJlaGF2aW9yUHJvcGVydHkoJ2dldFNlbGVjdGlvbicsICh0YXJnZXQpID0+IHtcblx0XHRsZXQgY29udGVudCA9IFF1ZXJ5LmZpcnN0KCcuY29udGVudCcsIHRhcmdldC5wYXJlbnQuZWwpO1xuXHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdGxldCBzZWxlY3Rpb24gPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG5cdFx0XHRpZighc2VsZWN0aW9uLmJhc2VOb2RlIGluIGNvbnRlbnQuY2hpbGROb2Rlcylcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwibm90IGZvdW5kIVwiKTtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHN0YXJ0OiBzZWxlY3Rpb24uYW5jaG9yT2Zmc2V0LFxuXHRcdFx0XHRlbmQ6IHNlbGVjdGlvbi5mb2N1c09mZnNldCxcblx0XHRcdFx0dGV4dDogc2VsZWN0aW9uLnRvU3RyaW5nKClcblx0XHRcdH07XG5cdFx0fTtcblx0fSksXG5cdHNldFNlbGVjdGlvblByb3BlcnR5ID0gbmV3IEJlaGF2aW9yUHJvcGVydHkoJ3NldFNlbGVjdGlvbicsICh0YXJnZXQpID0+IHtcblx0XHRsZXQgY29udGVudCA9IFF1ZXJ5LmZpcnN0KCcuY29udGVudCcsIHRhcmdldC5wYXJlbnQuZWwpO1xuXHRcdHJldHVybiBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG5cdFx0XHRsZXQgbm9kZSAgPSBjb250ZW50LmZpcnN0Q2hpbGQsXG5cdFx0XHRcdHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKSxcblx0XHRcdFx0c2VsICAgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG5cdFx0XHR0YXJnZXQuZm9jdXMoKTtcblx0XHRcdGlmKCFub2RlKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHJhbmdlLnNldFN0YXJ0KG5vZGUsIE1hdGgubWF4KHN0YXJ0LCAwKSk7XG5cdFx0XHRyYW5nZS5zZXRFbmQobm9kZSwgTWF0aC5taW4oZW5kLCBub2RlLndob2xlVGV4dC5sZW5ndGgpKTtcblx0XHRcdHNlbC5yZW1vdmVBbGxSYW5nZXMoKTtcblx0XHRcdHNlbC5hZGRSYW5nZShyYW5nZSk7XG5cdFx0fTtcblx0fSk7XG5cbmNsYXNzIFRleHRFZGl0b3JQcm9wZXJ0eSBleHRlbmRzIENvbnRhaW5lclByb3BlcnR5IHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoJ2VkaXRvcicsICd2YWx1ZScpO1xuXHR9XG5cblx0aW5qZWN0KHRhcmdldCkge1xuXHRcdGxldCDGkiA9IHN1cGVyLmluamVjdCh0YXJnZXQpLFxuXHRcdFx0ZWRpdG9yID0gdGFyZ2V0LmVkaXRvcjtcblxuXHRcdGVkaXRvci5wcm9wZXJ0aWVzLmFkZCh2YWx1ZVByb3BlcnR5KTtcblx0XHRlZGl0b3IucHJvcGVydGllcy5hZGQoZm9jdXNQcm9wZXJ0eSk7XG5cdFx0ZWRpdG9yLnByb3BlcnRpZXMuYWRkKGdldFNlbGVjdGlvblByb3BlcnR5KTtcblx0XHRlZGl0b3IucHJvcGVydGllcy5hZGQoc2V0U2VsZWN0aW9uUHJvcGVydHkpO1xuXG5cdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdGVkaXRvci5wcm9wZXJ0aWVzLnJlbW92ZShmb2N1c1Byb3BlcnR5KTtcblx0XHRcdGVkaXRvci5wcm9wZXJ0aWVzLnJlbW92ZShnZXRTZWxlY3Rpb25Qcm9wZXJ0eSk7XG5cdFx0XHRlZGl0b3IucHJvcGVydGllcy5yZW1vdmUoc2V0U2VsZWN0aW9uUHJvcGVydHkpO1xuXHRcdFx0xpIoKTtcblx0XHR9O1xuXHR9XG59XG5cbmV4cG9ydCB7IFRleHRFZGl0b3JQcm9wZXJ0eSB9OyIsImltcG9ydCB7IFZhbHVlU3RyZWFtUHJvcGVydHkgfSBmcm9tICcuLi92YWx1ZXN0cmVhbSc7XG5pbXBvcnQgeyBTdHJpbmdWYWx1ZSwgQm9vbFZhbHVlLCBGbG9hdFZhbHVlLCBEYXRlVmFsdWUgfSBmcm9tICdzdHJlYW15L3ZhbHVlJztcblxuZnVuY3Rpb24gdmFsdWVGdW5jdG9yKHR5cGUsIC4uLmFyZ3MpIHtcblx0c3dpdGNoKHR5cGUpIHtcblx0XHRjYXNlIFwiU3RyaW5nXCI6XG5cdFx0XHRyZXR1cm4gbmV3IFN0cmluZ1ZhbHVlKC4uLmFyZ3MpO1xuXHRcdGNhc2UgXCJCb29sXCI6XG5cdFx0XHRyZXR1cm4gbmV3IEJvb2xWYWx1ZSguLi5hcmdzKTtcblx0XHRjYXNlIFwiRmxvYXRcIjpcblx0XHRcdHJldHVybiBuZXcgRmxvYXRWYWx1ZSguLi5hcmdzKTtcblx0XHRjYXNlIFwiRGF0ZVwiOlxuXHRcdFx0cmV0dXJuIG5ldyBEYXRlVmFsdWUoLi4uYXJncyk7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdHRocm93IG5ldyBFcnJvcihgdHlwZSAnJHt0eXBlfScgbm90IGZvdW5kYCk7XG5cdH1cbn1cblxuY2xhc3MgVmFsdWVQcm9wZXJ0eSBleHRlbmRzIFZhbHVlU3RyZWFtUHJvcGVydHkge1xuXHRjb25zdHJ1Y3Rvcih0eXBlLCB3aXJlxpIsIC4uLmFyZ3MpIHtcblx0XHRzdXBlcihcblx0XHRcdFwidmFsdWVcIixcblx0XHRcdCgpID0+IHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJyA/IHZhbHVlRnVuY3Rvcih0eXBlLCAuLi5hcmdzKSA6IHR5cGUsXG5cdFx0XHR3aXJlxpIgfHwgKCgpICA9PiAoKCkgPT4ge30pKVxuXHRcdCk7XG5cdH1cbn1cblxuZXhwb3J0IHsgVmFsdWVQcm9wZXJ0eSB9OyIsImltcG9ydCB7IFZhbHVlU3RyZWFtUHJvcGVydHkgfSBmcm9tICcuLi92YWx1ZXN0cmVhbSc7XG5pbXBvcnQgeyBCb29sVmFsdWUgfSBmcm9tICdzdHJlYW15L3ZhbHVlJztcbmltcG9ydCB7IERvbSB9IGZyb20gJ3VpL2RvbSc7XG5cbmNsYXNzIFZpc2libGVQcm9wZXJ0eSBleHRlbmRzIFZhbHVlU3RyZWFtUHJvcGVydHkge1xuXHRjb25zdHJ1Y3RvcihkZWZhdWx0VmFsdWUgPSB0cnVlKSB7XG5cdFx0c3VwZXIoXG5cdFx0XHRcInZpc2libGVcIixcblx0XHRcdCgpID0+IG5ldyBCb29sVmFsdWUoZGVmYXVsdFZhbHVlKSxcblx0XHRcdCh0YXJnZXQsIHZhbHVlKSAgPT5cblx0XHRcdFx0RG9tLnN0cmVhbSh2YWx1ZSkuYXBwbHlEaXNwbGF5KHRhcmdldC5lbClcblx0XHQpO1xuXHR9XG59XG5cbmV4cG9ydCB7IFZpc2libGVQcm9wZXJ0eSB9OyIsImltcG9ydCB7IEJhc2VQcm9wZXJ0eSB9IGZyb20gJy4vYmFzZSc7XG5pbXBvcnQgeyDGkiB9IGZyb20gJ3V0aWwvxpInO1xuXG5sZXQgX3AgPSBTeW1ib2woKTtcblxuY2xhc3MgVmFsdWVTdHJlYW1Qcm9wZXJ0eSBleHRlbmRzIEJhc2VQcm9wZXJ0eSB7XG5cdGNvbnN0cnVjdG9yKG5hbWUsIHZhbHVlxpIsIHdpcmXGkikge1xuXHRcdHN1cGVyKG5hbWUpO1xuXHRcdHRoaXNbX3BdID0geyB2YWx1ZcaSLCB3aXJlxpIgfTtcblx0fVxuXG5cdGluamVjdCh0YXJnZXQpIHtcblx0XHRsZXQgdmFsdWUgPSB0aGlzW19wXS52YWx1ZcaSKCk7XG5cdFx0dGhpcy5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHRoaXMubmFtZSwgKCkgPT4gdmFsdWUsIHZhbHVlLnB1c2guYmluZCh2YWx1ZSkpO1xuXG5cdFx0cmV0dXJuIMaSLmpvaW4oXG5cdFx0XHR0aGlzW19wXS53aXJlxpIodGFyZ2V0LCB2YWx1ZSksXG5cdFx0XHQoKSA9PiB2YWx1ZS5jYW5jZWwoKVxuXHRcdCk7XG5cdH1cbn1cblxuZXhwb3J0IHsgVmFsdWVTdHJlYW1Qcm9wZXJ0eSB9OyIsImltcG9ydCB7IFB1c2hTdHJlYW0gfSBmcm9tICdzdHJlYW15L3N0cmVhbSc7XG5cbmxldCBfZmllbGRzID0gU3ltYm9sKCksXG5cdF9zdHJlYW0gPSBTeW1ib2woKTtcblxuZXhwb3J0IGNsYXNzIFNjaGVtYSB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXNbX2ZpZWxkc10gPSB7fTtcblx0XHR0aGlzW19zdHJlYW1dID0gbmV3IFB1c2hTdHJlYW0oKTtcblx0XHRsZXQgc3Vic2NyaWJlID0gdGhpc1tfc3RyZWFtXS5zdWJzY3JpYmUuYmluZCh0aGlzW19zdHJlYW1dKTtcblx0XHR0aGlzW19zdHJlYW1dLnN1YnNjcmliZSA9ICjGkikgPT4ge1xuXHRcdFx0c3Vic2NyaWJlKMaSKTtcblx0XHRcdMaSKHtldmVudDonbGlzdCcsZGF0YTp0aGlzLnBhaXJzfSk7XG5cdFx0fTtcblx0fVxuXG5cdGFkZChuYW1lLCB0eXBlKSB7XG5cdFx0aWYobmFtZSBpbiB0aGlzW19maWVsZHNdKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBTY2hlbWEgYWxyZWFkeSBjb250YWlucyBhIGZpZWxkICcke25hbWV9J2ApO1xuXHRcdHRoaXNbX2ZpZWxkc11bbmFtZV0gPSB0eXBlO1xuXHRcdHRoaXNbX3N0cmVhbV0ucHVzaCh7XG5cdFx0XHRldmVudDogJ2FkZCcsXG5cdFx0XHRuYW1lOiAgbmFtZSxcblx0XHRcdHR5cGU6ICB0eXBlXG5cdFx0fSk7XG5cdH1cblxuXHRyZXNldChsaXN0ID0gW10pIHtcblx0XHR0aGlzW19maWVsZHNdID0ge307XG5cdFx0bGlzdC5tYXAodiA9PiB0aGlzW19maWVsZHNdW3YubmFtZV0gPSB2LnR5cGUpO1xuXHRcdHRoaXNbX3N0cmVhbV0ucHVzaCh7XG5cdFx0XHRldmVudDogJ2xpc3QnLFxuXHRcdFx0ZGF0YTogIGxpc3Quc2xpY2UoMClcblx0XHR9KTtcblx0fVxuXG5cdGRlbGV0ZShuYW1lKSB7XG5cdFx0aWYoIShuYW1lIGluIHRoaXNbX2ZpZWxkc10pKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBTY2hlbWEgZG9lcyBub3QgY29udGFpbiBhIGZpZWxkICcke25hbWV9J2ApO1xuXHRcdGRlbGV0ZSB0aGlzW19maWVsZHNdW25hbWVdO1xuXHRcdHRoaXNbX3N0cmVhbV0ucHVzaCh7XG5cdFx0XHRldmVudDogJ2RlbGV0ZScsXG5cdFx0XHRuYW1lOiAgbmFtZVxuXHRcdH0pO1xuXHR9XG5cblx0cmVuYW1lKG9sZG5hbWUsIG5ld25hbWUpIHtcblx0XHRpZighKG9sZG5hbWUgaW4gdGhpc1tfZmllbGRzXSkpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFNjaGVtYSBkb2VzIG5vdCBjb250YWluIGEgZmllbGQgJyR7b2xkbmFtZX0nYCk7XG5cdFx0bGV0IHR5cGUgPSB0aGlzW19maWVsZHNdW29sZG5hbWVdO1xuXHRcdGRlbGV0ZSB0aGlzW19maWVsZHNdW29sZG5hbWVdO1xuXHRcdHRoaXNbX2ZpZWxkc11bbmV3bmFtZV0gPSB0eXBlO1xuXHRcdHRoaXNbX3N0cmVhbV0ucHVzaCh7XG5cdFx0XHRldmVudDogICAncmVuYW1lJyxcblx0XHRcdG9sZG5hbWU6IG9sZG5hbWUsXG5cdFx0XHRuZXduYW1lOiBuZXduYW1lXG5cdFx0fSk7XG5cdH1cblxuXHRyZXR5cGUobmFtZSwgdHlwZSkge1xuXHRcdGlmKCEobmFtZSBpbiB0aGlzW19maWVsZHNdKSlcblx0XHRcdHRocm93IG5ldyBFcnJvcihgU2NoZW1hIGRvZXNuJ3QgY29udGFpbmVyIGZpZWxkICcke25hbWV9JyBmb3IgcmV0eXBlKClgKTtcblx0XHR0aGlzW19maWVsZHNdW25hbWVdO1xuXHRcdHRoaXNbX2ZpZWxkc11bbmFtZV0gPSB0eXBlO1xuXHRcdHRoaXNbX3N0cmVhbV0ucHVzaCh7XG5cdFx0XHRldmVudDoncmV0eXBlJyxcblx0XHRcdG5hbWU6bmFtZSxcblx0XHRcdHR5cGU6dHlwZVxuXHRcdH0pO1xuXHR9XG5cblx0Z2V0KG5hbWUpIHtcblx0XHRyZXR1cm4gdGhpc1tfZmllbGRzXVtuYW1lXTtcblx0fVxuXG5cdGhhcyhuYW1lKSB7XG5cdFx0cmV0dXJuIG5hbWUgaW4gdGhpc1tfZmllbGRzXTtcblx0fVxuXG5cdFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuXHRcdHJldHVybiB0aGlzLmFycmF5O1xuXHR9XG5cblx0Z2V0IGFycmF5KCkge1xuXHRcdHJldHVybiBPYmplY3Qua2V5cyh0aGlzW19maWVsZHNdKTtcblx0fVxuXG5cdGdldCBwYWlycygpIHtcblx0XHRyZXR1cm4gT2JqZWN0LmtleXModGhpc1tfZmllbGRzXSkubWFwKGZ1bmN0aW9uKGspIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGtleTogayxcblx0XHRcdFx0dmFsdWU6IHRoaXNbX2ZpZWxkc11ba2V5XVxuXHRcdFx0fTtcblx0XHR9KTtcblx0fVxuXG5cdGdldCBzdHJlYW0oKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3N0cmVhbV07XG5cdH1cblxuXHR0b1N0cmluZygpIHtcblx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpc1tfZmllbGRzXSk7XG5cdH1cbn0iLCJsZXQgaW1tZWRpYXRlID0gcmVxdWlyZSgnaW1tZWRpYXRlJyksXG5cdFRpbWVyID0ge1xuXHRkZWxheShtcywgxpIpIHtcblx0XHRpZijGkilcblx0XHRcdHJldHVybiBzZXRUaW1lb3V0KMaSLCBtcyk7XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG5cdH0sXG5cdGltbWVkaWF0ZSjGkikge1xuXHRcdGlmKMaSKVxuXHRcdFx0cmV0dXJuIGltbWVkaWF0ZSjGkik7XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBpbW1lZGlhdGUocmVzb2x2ZSkpO1xuXHR9LFxuXHRkZWJvdW5jZSjGkiwgbXMgPSAwKSB7XG5cdFx0bGV0IHRpZCwgY29udGV4dCwgYXJncywgbGF0ZXLGkjtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRjb250ZXh0ID0gdGhpcztcblx0XHRcdGFyZ3MgPSBhcmd1bWVudHM7XG5cdFx0XHRsYXRlcsaSID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICghaW1tZWRpYXRlKSDGki5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0XHRcdH07XG5cdFx0XHRjbGVhclRpbWVvdXQodGlkKTtcblx0XHRcdHRpZCA9IHNldFRpbWVvdXQobGF0ZXLGkiwgbXMpO1xuXHRcdH07XG5cdH0sXG5cdHJlZHVjZSjGkiwgbXMgPSAwKSB7XG5cdFx0bGV0IHRpZCwgY29udGV4dCwgYXJncztcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRjb250ZXh0ID0gdGhpcztcblx0XHRcdGFyZ3MgPSBhcmd1bWVudHM7XG5cdFx0XHRpZih0aWQpIHJldHVybjtcblx0XHRcdHRpZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRpZCA9IG51bGw7XG5cdFx0XHRcdMaSLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHRcdFx0fSwgbXMpO1xuXHRcdH07XG5cdH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFRpbWVyOyIsImV4cG9ydCBsZXQgxpIgPSB7XG5cdGNvbXBvc2UoxpIxLCDGkjIpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gxpIxKMaSMi5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cykpO1xuXHRcdH07XG5cdH0sXG5cdGpvaW4oxpIxLCDGkjIpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHTGkjEuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuXHRcdFx0xpIyLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcblx0XHR9XG5cdH1cbn07Il19
