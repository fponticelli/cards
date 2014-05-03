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
var Model = require('ui/model').Model;
var Schema = require('ui/schema').Schema;
var Paragraph = require('ui/paragraph').Paragraph;
var ModelUI = require('ui/modelui').ModelUI;
Dom.ready((function() {
  var $card = Query.first('.card'),
      $doc = Query.first('.doc', $card),
      $doc_header = Query.first('header', $doc),
      $doc_article = Query.first('article', $doc),
      $doc_footer = Query.first('footer', $doc),
      $aside = Query.first('aside', $card),
      $context = Query.first('.context', $aside),
      $context_header = Query.first('header', $context),
      $context_article = Query.first('article', $context);
  var schema = new Schema(),
      model = new Model(),
      modelui = new ModelUI(model, schema);
  modelui.attachTo($aside);
}));


},{"streamy/stream":23,"streamy/value":24,"ui/dom":29,"ui/fragment":33,"ui/model":35,"ui/modelui":36,"ui/paragraph":41,"ui/properties/types":57,"ui/schema":65}],2:[function(require,module,exports){
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
  },
  sync: function(synchronizer) {
    return $Stream.sync(this, synchronizer);
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
Stream.sync = function(source, synchronizer) {
  var stream = new PushStream(),
      hasvalue = false,
      haspulse = false,
      value;
  synchronizer.subscribe((function() {
    if (hasvalue) {
      hasvalue = false;
      stream.push(value);
      value = undefined;
    } else if (!haspulse) {
      haspulse = true;
    }
  }));
  source.subscribe((function(v) {
    value = v;
    hasvalue = true;
    if (haspulse) {
      haspulse = false;
      stream.push(value);
      value = undefined;
      hasvalue = false;
    }
  }));
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


},{"ui/timer":66}],24:[function(require,module,exports){
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


},{"./component":28}],26:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<button><span class=\"content\"></span></button>");;return buf.join("");
};
},{"jade/runtime":20}],27:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/button";
var Component = require('./component').Component;
var PushStream = require('streamy/stream').PushStream;
var $__1 = require('./properties/types'),
    IconProperty = $__1.IconProperty,
    ClickProperty = $__1.ClickProperty;
var template = require('./button.jade')(),
    _click = Symbol();
var Button = function Button() {
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  if (!('template' in options))
    options.template = template;
  $traceurRuntime.superCall(this, $Button.prototype, "constructor", [options]);
  this.properties.add(new ClickProperty());
};
var $Button = Button;
($traceurRuntime.createClass)(Button, {}, {}, Component);
Button.icon = function(name, options) {
  var button = new Button(options);
  button.properties.add(new IconProperty(name));
  return button;
};
;
module.exports = {
  get Button() {
    return Button;
  },
  __esModule: true
};


},{"./button.jade":26,"./component":28,"./properties/types":57,"streamy/stream":23}],28:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/component";
var Html = require('ui/dom').Html;
var Properties = require('./properties').Properties;
var PushStream = require('streamy/stream').PushStream;
var createId = require('node-uuid').v4;
var _p = Symbol();
var Component = function Component() {
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  new Properties(this);
  this[_p] = {
    children: [],
    el: Html.parse(options.template),
    attached: false,
    uuid: options.uuid || createId(),
    focusStream: new PushStream()
  };
  if (options.classes)
    this[_p].el.classList.add(options.classes);
  if (options.parent)
    options.parent.add(this);
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
    if (this.parent)
      this.parent.remove(this);
    if (this.isAttached)
      this.detach();
    this.properties.removeAll();
  },
  add: function(child) {
    if (child.parent)
      child.parent.remove(child);
    this[_p].children.push(child);
    child[_p].parent = this;
    child[_p].__cancelFocusStream = child.focusStream.feed(this.focusStream);
  },
  remove: function(child) {
    var i = this[_p].children.indexOf(child);
    if (i < 0)
      throw new Error(("'" + child + " is not child of this'"));
    child[_p].__cancelFocusStream.cancel();
    this[_p].children.splice(i, 1);
    child[_p].parent = null;
  },
  get el() {
    return this[_p].el;
  },
  get parent() {
    return this[_p].parent;
  },
  get focusStream() {
    return this[_p].focusStream;
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


},{"./properties":45,"node-uuid":21,"streamy/stream":23,"ui/dom":29}],29:[function(require,module,exports){
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
  on: function(event, el) {
    var $__0 = this;
    var ƒ = (function(e) {
      return $__0[p].push(e);
    });
    el.addEventListener(event, ƒ, false);
    return (function() {
      el.removeEventListener(event, ƒ, false);
    });
  },
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
  applySwapAttribute: function(name, el) {
    var $__0 = this;
    var old = el.hasAttribute(name),
        ƒ = (function(v) {
          !!v ? el.setAttribute(name, name) : el.removeAttribute(name);
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
    return Array.prototype.slice.call((ctx || document).querySelectorAll(selector), 0);
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


},{}],30:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"field-container\"><div class=\"field\"><div class=\"key\"></div><div class=\"value\"></div></div><div class=\"calculated\"></div><hr/></div>");;return buf.join("");
};
},{"jade/runtime":20}],31:[function(require,module,exports){
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
  var key = new Fragment({parent: this}),
      value = new Fragment({parent: this});
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


},{"./component":28,"./field.jade":30,"./fragment":33,"ui/dom":29}],32:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<span class=\"fragment\"><span class=\"content\"></span></span>");;return buf.join("");
};
},{"jade/runtime":20}],33:[function(require,module,exports){
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


},{"./component":28,"./fragment.jade":32}],34:[function(require,module,exports){
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


},{"./block":25,"./fragment":33}],35:[function(require,module,exports){
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
function guessName(keys) {
  var prefix = arguments[1] !== (void 0) ? arguments[1] : "field ";
  var max = -1,
      value;
  for (var $__2 = keys[Symbol.iterator](),
      $__3; !($__3 = $__2.next()).done; ) {
    try {
      throw undefined;
    } catch (key) {
      key = $__3.value;
      {
        if (key.indexOf(prefix) === 0) {
          value = parseInt(key.substr(prefix.length), 10);
          if (isNaN(value) || value < 0)
            continue;
          if (value > max)
            max = value;
        }
      }
    }
  }
  return prefix + (max + 1);
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
  get keys() {
    return Object.keys(this[_o]);
  },
  nextFieldName: function() {
    return guessName(this.keys);
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


},{"streamy/stream":23}],36:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/modelui";
var _p = Symbol();
var $__1 = require('./modelview'),
    ModelView = $__1.ModelView,
    SchemaWrapper = $__1.SchemaWrapper;
var ModelViewToolbar = require('./modelviewtoolbar').ModelViewToolbar;
var Component = require('./component').Component;
var ModelUI = function ModelUI(model, schema) {
  $traceurRuntime.superCall(this, $ModelUI.prototype, "constructor", [{template: '<div class="model modelui"></div>'}]);
  var modelView = new ModelView(),
      wrapper = new SchemaWrapper(schema, modelView),
      toolbar = new ModelViewToolbar(modelView, model, schema);
  this[_p] = {
    model: model,
    schema: schema,
    modelView: modelView,
    toolbar: toolbar
  };
  toolbar.attachTo(this.el);
  modelView.attachTo(this.el);
  schema.stream.feed(model.schema);
  modelView.data.feed(model.data);
};
var $ModelUI = ModelUI;
($traceurRuntime.createClass)(ModelUI, {
  get model() {
    return this[_p].model;
  },
  get schema() {
    return this[_p].schema;
  },
  get modelView() {
    return this[_p].modelView;
  },
  get toolbar() {
    return this[_p].toolbar;
  }
}, {}, Component);
module.exports = {
  get ModelUI() {
    return ModelUI;
  },
  __esModule: true
};


},{"./component":28,"./modelview":38,"./modelviewtoolbar":39}],37:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"modelview\"></div>");;return buf.join("");
};
},{"jade/runtime":20}],38:[function(require,module,exports){
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
  this.el.addEventListener('focus', (function(e) {
    return console.log('focus', e);
  }), false);
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
    var field = new Field({parent: this});
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


},{"./component":28,"./field":31,"./modelview.jade":37,"./properties/types":57,"streamy/stream":23}],39:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/modelviewtoolbar";
var EnableProperty = require('./properties/types').EnableProperty;
var Button = require('ui/button').Button;
var Toolbar = require('./toolbar').Toolbar;
var ModelViewToolbar = function ModelViewToolbar(view, model, schema, options) {
  $traceurRuntime.superCall(this, $ModelViewToolbar.prototype, "constructor", [options]);
  var remove = Button.icon('ban', {
    parent: this,
    classes: 'alert'
  });
  remove.properties.add(new EnableProperty(false));
  this.right.add(remove);
  view.focusStream.map((function(v) {
    return !!v;
  })).debounce(200).feed(remove.enable);
  view.focusStream.filter((function(v) {
    return v !== null;
  })).sync(remove.click).map((function(fragment) {
    return fragment.parent.key.editor.value.value;
  })).subscribe((function(key) {
    return view.deleteField(key);
  }));
  var insertText = Button.icon('font', {parent: this});
  this.left.add(insertText);
  insertText.click.subscribe((function() {
    var key = model.nextFieldName();
    schema.add(key, "String");
  }));
  var insertBool = Button.icon('check-square-o', {parent: this});
  this.left.add(insertBool);
  insertBool.click.subscribe((function() {
    var key = model.nextFieldName();
    schema.add(key, "Bool");
  }));
};
var $ModelViewToolbar = ModelViewToolbar;
($traceurRuntime.createClass)(ModelViewToolbar, {}, {}, Toolbar);
module.exports = {
  get ModelViewToolbar() {
    return ModelViewToolbar;
  },
  __esModule: true
};


},{"./properties/types":57,"./toolbar":68,"ui/button":27}],40:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<p class=\"block\"></p>");;return buf.join("");
};
},{"jade/runtime":20}],41:[function(require,module,exports){
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


},{"./fragmentblock":34,"./paragraph.jade":40}],42:[function(require,module,exports){
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


},{}],43:[function(require,module,exports){
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


},{"./base":42}],44:[function(require,module,exports){
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


},{"./base":42,"./properties":46}],45:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/properties/index";
var $__node_95_modules_47_ui_47_properties_47_properties__ = require('./properties');
module.exports = $traceurRuntime.exportStar({__esModule: true}, $__node_95_modules_47_ui_47_properties_47_properties__);


},{"./properties":46}],46:[function(require,module,exports){
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
    for (var $__3 = this.array[Symbol.iterator](),
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


},{}],47:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/properties/stream";
var BaseProperty = require('./base').BaseProperty;
var ƒ = require('util/ƒ').ƒ;
var _p = Symbol();
var StreamProperty = function StreamProperty(name, streamƒ, wireƒ) {
  $traceurRuntime.superCall(this, $StreamProperty.prototype, "constructor", [name]);
  this[_p] = {
    streamƒ: streamƒ,
    wireƒ: wireƒ
  };
};
var $StreamProperty = StreamProperty;
($traceurRuntime.createClass)(StreamProperty, {inject: function(target) {
    var stream = this[_p].streamƒ();
    this.defineProperty(target, this.name, (function() {
      return stream;
    }));
    return ƒ.join(this[_p].wireƒ(target, stream), (function() {
      return stream.cancel();
    }));
  }}, {}, BaseProperty);
module.exports = {
  get StreamProperty() {
    return StreamProperty;
  },
  __esModule: true
};


},{"./base":42,"util/ƒ":69}],48:[function(require,module,exports){
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


},{"../valuestream":64,"streamy/value":24,"ui/dom":29}],49:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (undefined) {
buf.push("<input type=\"checkbox\"" + (jade.attr("checked", (true===false ? "checked" : undefined), true, false)) + " class=\"bool editor\"/>");}("undefined" in locals_for_with?locals_for_with.undefined:typeof undefined!=="undefined"?undefined:undefined));;return buf.join("");
};
},{"jade/runtime":20}],50:[function(require,module,exports){
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
          input = Html.parse(template({checked: value.value})),
          focusƒ = (function() {
            return editor.parent.focusStream.push(editor.parent);
          }),
          unfocusƒ = (function() {
            return editor.parent.focusStream.push(null);
          });
      content.appendChild(input);
      input.addEventListener("change", listenƒ, false);
      input.addEventListener("focus", focusƒ, false);
      input.addEventListener("blur", unfocusƒ, false);
      return function() {
        input.removeEventListener("focus", focusƒ, false);
        input.removeEventListener("blur", unfocusƒ, false);
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


},{"../behavior":43,"../container":44,"./booleditor.jade":49,"./value":62,"ui/dom":29}],51:[function(require,module,exports){
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


},{"../valuestream":64,"streamy/value":24,"ui/dom":29}],52:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/properties/types/click";
var PushStream = require('streamy/stream').PushStream;
var BoolValue = require('streamy/value').BoolValue;
var StreamProperty = require('../stream').StreamProperty;
var Dom = require('ui/dom').Dom;
var ClickProperty = function ClickProperty() {
  $traceurRuntime.superCall(this, $ClickProperty.prototype, "constructor", ["click", (function() {
    return new PushStream();
  }), (function(target, value) {
    return Dom.stream(value).on("click", target.el);
  })]);
};
var $ClickProperty = ClickProperty;
($traceurRuntime.createClass)(ClickProperty, {}, {}, StreamProperty);
module.exports = {
  get ClickProperty() {
    return ClickProperty;
  },
  __esModule: true
};


},{"../stream":47,"streamy/stream":23,"streamy/value":24,"ui/dom":29}],53:[function(require,module,exports){
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


},{"./booleditor":50,"./texteditor":61}],54:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/properties/types/enable";
var ValueStreamProperty = require('../valuestream').ValueStreamProperty;
var BoolValue = require('streamy/value').BoolValue;
var $__1 = require('ui/dom'),
    Dom = $__1.Dom,
    Query = $__1.Query;
var EnableProperty = function EnableProperty() {
  var defaultValue = arguments[0] !== (void 0) ? arguments[0] : true;
  $traceurRuntime.superCall(this, $EnableProperty.prototype, "constructor", ['enable', (function() {
    return new BoolValue(defaultValue);
  }), (function(target, value) {
    var negated = value.negate(),
        els = Query.all('input,select,textarea,button', target.el).concat([target.el]);
    var ƒ = els.map((function(el) {
      return Dom.stream(negated).applySwapAttribute('disabled', target.el);
    })).concat([Dom.stream(negated).applySwapClass(target.el, 'disabled')]);
    return (function() {
      negated.cancel();
      ƒ.map((function(ƒ) {
        return ƒ();
      }));
    });
  })]);
};
var $EnableProperty = EnableProperty;
($traceurRuntime.createClass)(EnableProperty, {}, {}, ValueStreamProperty);
module.exports = {
  get EnableProperty() {
    return EnableProperty;
  },
  __esModule: true
};


},{"../valuestream":64,"streamy/value":24,"ui/dom":29}],55:[function(require,module,exports){
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


},{"../valuestream":64,"streamy/value":24,"ui/dom":29}],56:[function(require,module,exports){
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


},{"./html":55,"streamy/value":24,"ui/dom":29}],57:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/properties/types/index";
var $__node_95_modules_47_ui_47_properties_47_types_47_attribute__ = require('./attribute');
var $__node_95_modules_47_ui_47_properties_47_types_47_booleditor__ = require('./booleditor');
var $__node_95_modules_47_ui_47_properties_47_types_47_classname__ = require('./classname');
var $__node_95_modules_47_ui_47_properties_47_types_47_click__ = require('./click');
var $__node_95_modules_47_ui_47_properties_47_types_47_editor__ = require('./editor');
var $__node_95_modules_47_ui_47_properties_47_types_47_enable__ = require('./enable');
var $__node_95_modules_47_ui_47_properties_47_types_47_html__ = require('./html');
var $__node_95_modules_47_ui_47_properties_47_types_47_icon__ = require('./icon');
var $__node_95_modules_47_ui_47_properties_47_types_47_texteditor__ = require('./texteditor');
var $__node_95_modules_47_ui_47_properties_47_types_47_numericformat__ = require('./numericformat');
var $__node_95_modules_47_ui_47_properties_47_types_47_link__ = require('./link');
var $__node_95_modules_47_ui_47_properties_47_types_47_text__ = require('./text');
var $__node_95_modules_47_ui_47_properties_47_types_47_value__ = require('./value');
var $__node_95_modules_47_ui_47_properties_47_types_47_visible__ = require('./visible');
module.exports = $traceurRuntime.exportStar({__esModule: true}, $__node_95_modules_47_ui_47_properties_47_types_47_attribute__, $__node_95_modules_47_ui_47_properties_47_types_47_booleditor__, $__node_95_modules_47_ui_47_properties_47_types_47_classname__, $__node_95_modules_47_ui_47_properties_47_types_47_click__, $__node_95_modules_47_ui_47_properties_47_types_47_editor__, $__node_95_modules_47_ui_47_properties_47_types_47_enable__, $__node_95_modules_47_ui_47_properties_47_types_47_html__, $__node_95_modules_47_ui_47_properties_47_types_47_icon__, $__node_95_modules_47_ui_47_properties_47_types_47_texteditor__, $__node_95_modules_47_ui_47_properties_47_types_47_numericformat__, $__node_95_modules_47_ui_47_properties_47_types_47_link__, $__node_95_modules_47_ui_47_properties_47_types_47_text__, $__node_95_modules_47_ui_47_properties_47_types_47_value__, $__node_95_modules_47_ui_47_properties_47_types_47_visible__);


},{"./attribute":48,"./booleditor":50,"./classname":51,"./click":52,"./editor":53,"./enable":54,"./html":55,"./icon":56,"./link":58,"./numericformat":59,"./text":60,"./texteditor":61,"./value":62,"./visible":63}],58:[function(require,module,exports){
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


},{"../valuestream":64,"streamy/value":24}],59:[function(require,module,exports){
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


},{"../valuestream":64,"numeral":22,"streamy/value":24}],60:[function(require,module,exports){
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


},{"../valuestream":64,"streamy/value":24,"ui/dom":29}],61:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/properties/types/texteditor";
var ContainerProperty = require('../container').ContainerProperty;
var BehaviorProperty = require('../behavior').BehaviorProperty;
var ValueProperty = require('./value').ValueProperty;
var $__1 = require('ui/dom'),
    Dom = $__1.Dom,
    Query = $__1.Query;
var PushStream = require('streamy/stream').PushStream;
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
        editor.parent.focusStream.push(editor.parent);
        editor.focus();
      }),
          unfocusƒ = (function() {
            editor.parent.focusStream.push(null);
            editor[_unbindƒ]();
          });
      content.setAttribute('tabindex', '0');
      content.addEventListener("focus", focusƒ, false);
      content.addEventListener("blur", unfocusƒ);
      return function() {
        cancelƒ();
        editor[_unbindƒ]();
        delete editor[_unbindƒ];
        delete editor[_bindƒ];
        delete editor[_bound];
        content.removeEventListener("blur", unfocusƒ, false);
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


},{"../behavior":43,"../container":44,"./value":62,"streamy/stream":23,"ui/dom":29}],62:[function(require,module,exports){
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


},{"../valuestream":64,"streamy/value":24}],63:[function(require,module,exports){
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


},{"../valuestream":64,"streamy/value":24,"ui/dom":29}],64:[function(require,module,exports){
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


},{"./base":42,"util/ƒ":69}],65:[function(require,module,exports){
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


},{"streamy/stream":23}],66:[function(require,module,exports){
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


},{"immediate":14}],67:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<header class=\"model-toolbar\"><div class=\"left\"></div><div class=\"middle\"></div><div class=\"right\"></div></header>");;return buf.join("");
};
},{"jade/runtime":20}],68:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/toolbar";
var Component = require('./component').Component;
var Query = require('ui/dom').Query;
var template = require('./toolbar.jade')(),
    _left = Symbol(),
    _middle = Symbol(),
    _right = Symbol(),
    _el = Symbol();
var ToolbarGroup = function ToolbarGroup(el) {
  this[_el] = el;
};
($traceurRuntime.createClass)(ToolbarGroup, {
  get el() {
    return this[_el];
  },
  add: function(comp) {
    comp.attachTo(this.el);
  }
}, {});
var Toolbar = function Toolbar() {
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  if (!('template' in options))
    options.template = template;
  $traceurRuntime.superCall(this, $Toolbar.prototype, "constructor", [options]);
  this[_left] = new ToolbarGroup(Query.first('.left', this.el));
  this[_middle] = new ToolbarGroup(Query.first('.middle', this.el));
  this[_right] = new ToolbarGroup(Query.first('.right', this.el));
};
var $Toolbar = Toolbar;
($traceurRuntime.createClass)(Toolbar, {
  get left() {
    return this[_left];
  },
  get middle() {
    return this[_middle];
  },
  get right() {
    return this[_right];
  }
}, {}, Component);
module.exports = {
  get ToolbarGroup() {
    return ToolbarGroup;
  },
  get Toolbar() {
    return Toolbar;
  },
  __esModule: true
};


},{"./component":28,"./toolbar.jade":67,"ui/dom":29}],69:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvY2xpZW50L21haW4uanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL25vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2NyeXB0by1icm93c2VyaWZ5L2hlbHBlcnMuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvY3J5cHRvLWJyb3dzZXJpZnkvaW5kZXguanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvY3J5cHRvLWJyb3dzZXJpZnkvbWQ1LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2NyeXB0by1icm93c2VyaWZ5L3JuZy5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9jcnlwdG8tYnJvd3NlcmlmeS9zaGEuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvY3J5cHRvLWJyb3dzZXJpZnkvc2hhMjU2LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2luc2VydC1tb2R1bGUtZ2xvYmFscy9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2VzNmlmeS9ub2RlX21vZHVsZXMvdHJhY2V1ci9iaW4vdHJhY2V1ci1ydW50aW1lLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2ltbWVkaWF0ZS9saWIvZmFrZU5leHRUaWNrLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2ltbWVkaWF0ZS9saWIvaW5kZXguanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvaW1tZWRpYXRlL2xpYi9tZXNzYWdlQ2hhbm5lbC5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9pbW1lZGlhdGUvbGliL211dGF0aW9uLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2ltbWVkaWF0ZS9saWIvcG9zdE1lc3NhZ2UuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvaW1tZWRpYXRlL2xpYi9zdGF0ZUNoYW5nZS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9pbW1lZGlhdGUvbGliL3RpbWVvdXQuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvamFkZS9ydW50aW1lLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL25vZGUtdXVpZC91dWlkLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL251bWVyYWwvbnVtZXJhbC5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9zdHJlYW15L3N0cmVhbS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9zdHJlYW15L3ZhbHVlLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL2Jsb2NrLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL2J1dHRvbi5qYWRlIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL2J1dHRvbi5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9jb21wb25lbnQuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvZG9tLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL2ZpZWxkLmphZGUiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvZmllbGQuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvZnJhZ21lbnQuamFkZSIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9mcmFnbWVudC5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9mcmFnbWVudGJsb2NrLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL21vZGVsLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL21vZGVsdWkuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvbW9kZWx2aWV3LmphZGUiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvbW9kZWx2aWV3LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL21vZGVsdmlld3Rvb2xiYXIuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvcGFyYWdyYXBoLmphZGUiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvcGFyYWdyYXBoLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3Byb3BlcnRpZXMvYmFzZS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9wcm9wZXJ0aWVzL2JlaGF2aW9yLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3Byb3BlcnRpZXMvY29udGFpbmVyLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3Byb3BlcnRpZXMvaW5kZXguanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvcHJvcGVydGllcy9wcm9wZXJ0aWVzLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3Byb3BlcnRpZXMvc3RyZWFtLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3Byb3BlcnRpZXMvdHlwZXMvYXR0cmlidXRlLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3Byb3BlcnRpZXMvdHlwZXMvYm9vbGVkaXRvci5qYWRlIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3Byb3BlcnRpZXMvdHlwZXMvYm9vbGVkaXRvci5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9wcm9wZXJ0aWVzL3R5cGVzL2NsYXNzbmFtZS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9wcm9wZXJ0aWVzL3R5cGVzL2NsaWNrLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3Byb3BlcnRpZXMvdHlwZXMvZWRpdG9yLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3Byb3BlcnRpZXMvdHlwZXMvZW5hYmxlLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3Byb3BlcnRpZXMvdHlwZXMvaHRtbC5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9wcm9wZXJ0aWVzL3R5cGVzL2ljb24uanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvcHJvcGVydGllcy90eXBlcy9pbmRleC5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9wcm9wZXJ0aWVzL3R5cGVzL2xpbmsuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvcHJvcGVydGllcy90eXBlcy9udW1lcmljZm9ybWF0LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3Byb3BlcnRpZXMvdHlwZXMvdGV4dC5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9wcm9wZXJ0aWVzL3R5cGVzL3RleHRlZGl0b3IuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvcHJvcGVydGllcy90eXBlcy92YWx1ZS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9wcm9wZXJ0aWVzL3R5cGVzL3Zpc2libGUuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvcHJvcGVydGllcy92YWx1ZXN0cmVhbS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9zY2hlbWEuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvdGltZXIuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvdG9vbGJhci5qYWRlIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3Rvb2xiYXIuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdXRpbC/Gki5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztxQkFBdUIsZ0JBQWdCO3VCQUNkLGFBQWE7bUJBQ1gsUUFBUTs7OzBCQUNQLGVBQWU7bUJBS3BDLHFCQUFxQjs7Ozs7Ozs7Ozs7Ozs7b0JBRU4sVUFBVTtxQkFDVCxXQUFXO3dCQUNSLGNBQWM7c0JBRWhCLFlBQVk7QUFFcEMsQ0FBQSxFQUFHLE1BQU07S0FDSixDQUFBLEtBQUssRUFBYyxDQUFBLEtBQUssTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUMxQyxDQUFBLFNBQUksRUFBZSxDQUFBLEtBQUssTUFBTSxDQUFDLE1BQU0sQ0FBRSxNQUFLLENBQUM7QUFDN0MsQ0FBQSxnQkFBVyxFQUFRLENBQUEsS0FBSyxNQUFNLENBQUMsUUFBUSxDQUFFLEtBQUksQ0FBQztBQUM5QyxDQUFBLGlCQUFZLEVBQU8sQ0FBQSxLQUFLLE1BQU0sQ0FBQyxTQUFTLENBQUUsS0FBSSxDQUFDO0FBQy9DLENBQUEsZ0JBQVcsRUFBUSxDQUFBLEtBQUssTUFBTSxDQUFDLFFBQVEsQ0FBRSxLQUFJLENBQUM7QUFDOUMsQ0FBQSxXQUFNLEVBQWEsQ0FBQSxLQUFLLE1BQU0sQ0FBQyxPQUFPLENBQUUsTUFBSyxDQUFDO0FBQzlDLENBQUEsYUFBUSxFQUFXLENBQUEsS0FBSyxNQUFNLENBQUMsVUFBVSxDQUFFLE9BQU0sQ0FBQztBQUNsRCxDQUFBLG9CQUFlLEVBQUksQ0FBQSxLQUFLLE1BQU0sQ0FBQyxRQUFRLENBQUUsU0FBUSxDQUFDO0FBQ2xELENBQUEscUJBQWdCLEVBQUcsQ0FBQSxLQUFLLE1BQU0sQ0FBQyxTQUFTLENBQUUsU0FBUSxDQUFDO0tBdUVoRCxDQUFBLE1BQU0sRUFBSSxJQUFJLE9BQU0sRUFBRTtBQUN6QixDQUFBLFVBQUssRUFBSyxJQUFJLE1BQUssRUFBRTtBQUNyQixDQUFBLFlBQU8sRUFBRyxJQUFJLFFBQU8sQ0FBQyxLQUFLLENBQUUsT0FBTSxDQUFDO0FBRXJDLENBQUEsUUFBTyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7R0F5QnhCLENBQUM7Q0FBQTs7O0FDN0hIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdmxDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzl6Q0E7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2cUJBOztHQUFPLE1BQUssV0FBTSxVQUFVO0dBRXhCLENBQUEsVUFBVSxFQUFHLENBQUEsTUFBTSxFQUFFO0FBQ3hCLENBQUEsVUFBTyxFQUFHLENBQUEsTUFBTSxFQUFFO1lBRW5CLFNBQU0sT0FBTSxDQUNDLFFBQVE7O0FBQ25CLENBQUEsS0FBSSxDQUFDLFVBQVUsQ0FBQyxFQUFHLEdBQUUsQ0FBQztLQUNsQixDQUFBLElBQUksYUFBSSxLQUFLO0FBQ2hCLENBQUEsUUFBSyxVQUFVO0FBQ2QsQ0FBQSxVQUFLLFVBQVUsQ0FBQyxJQUFJ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Q0Q7O0dBQVcsQ0FBQSxDQUFDLEVBQUc7Q0FDZCxRQUFPLENBQVAsVUFBUSxFQUFFLENBQUUsQ0FBQSxFQUFFLENBQUU7Q0FDZixTQUFPLFVBQVMsQ0FBRTtDQUNqQixXQUFPLENBQUEsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBRSxVQUFTLENBQUMsQ0FBQyxDQUFDO0tBQzFDLENBQUM7R0FDRjtDQUNELEtBQUksQ0FBSixVQUFLLEVBQUUsQ0FBRSxDQUFBLEVBQUUsQ0FBRTtDQUNaLFNBQU8sVUFBUyxDQUFFO0FBQ2pCLENBQUEsT0FBRSxNQUFNLENBQUMsU0FBUyxDQUFFLFVBQVMsQ0FBQyxDQUFDO0FBQy9CLENBQUEsT0FBRSxNQUFNLENBQUMsU0FBUyxDQUFFLFVBQVMsQ0FBQyxDQUFDO0tBQy9CLENBQUE7R0FDRDtDQUFBLEFBQ0Q7Ozs7Ozs7Q0FBQyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHsgU3RyZWFtIH0gZnJvbSAnc3RyZWFteS9zdHJlYW0nO1xuaW1wb3J0IHsgRnJhZ21lbnQgfSBmcm9tICd1aS9mcmFnbWVudCc7XG5pbXBvcnQgeyBEb20sIFF1ZXJ5IH0gZnJvbSAndWkvZG9tJztcbmltcG9ydCB7IFN0cmluZ1ZhbHVlIH0gZnJvbSAnc3RyZWFteS92YWx1ZSc7XG5pbXBvcnQge1xuXHRUZXh0UHJvcGVydHksIFZhbHVlUHJvcGVydHksIFZpc2libGVQcm9wZXJ0eSwgTGlua1Byb3BlcnR5LFxuXHRTdHJvbmdQcm9wZXJ0eSwgRW1waGFzaXNQcm9wZXJ0eSwgU3RyaWtlUHJvcGVydHksIE51bWVyaWNGb3JtYXRQcm9wZXJ0eSwgVG9vbHRpcFByb3BlcnR5LFxuXHRUZXh0RWRpdG9yUHJvcGVydHksIEJvb2xFZGl0b3JQcm9wZXJ0eSwgSHRtbFByb3BlcnR5LCBJY29uUHJvcGVydHlcbn0gZnJvbSAndWkvcHJvcGVydGllcy90eXBlcyc7XG5cbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAndWkvbW9kZWwnO1xuaW1wb3J0IHsgU2NoZW1hIH0gZnJvbSAndWkvc2NoZW1hJztcbmltcG9ydCB7IFBhcmFncmFwaCB9IGZyb20gJ3VpL3BhcmFncmFwaCc7XG5cbmltcG9ydCB7IE1vZGVsVUkgfSBmcm9tICd1aS9tb2RlbHVpJztcblxuRG9tLnJlYWR5KCgpID0+IHtcblx0bGV0ICRjYXJkICAgICAgICAgICAgPSBRdWVyeS5maXJzdCgnLmNhcmQnKSxcblx0XHQkZG9jICAgICAgICAgICAgID0gUXVlcnkuZmlyc3QoJy5kb2MnLCAkY2FyZCksXG5cdFx0JGRvY19oZWFkZXIgICAgICA9IFF1ZXJ5LmZpcnN0KCdoZWFkZXInLCAkZG9jKSxcblx0XHQkZG9jX2FydGljbGUgICAgID0gUXVlcnkuZmlyc3QoJ2FydGljbGUnLCAkZG9jKSxcblx0XHQkZG9jX2Zvb3RlciAgICAgID0gUXVlcnkuZmlyc3QoJ2Zvb3RlcicsICRkb2MpLFxuXHRcdCRhc2lkZSAgICAgICAgICAgPSBRdWVyeS5maXJzdCgnYXNpZGUnLCAkY2FyZCksXG5cdFx0JGNvbnRleHQgICAgICAgICA9IFF1ZXJ5LmZpcnN0KCcuY29udGV4dCcsICRhc2lkZSksXG5cdFx0JGNvbnRleHRfaGVhZGVyICA9IFF1ZXJ5LmZpcnN0KCdoZWFkZXInLCAkY29udGV4dCksXG5cdFx0JGNvbnRleHRfYXJ0aWNsZSA9IFF1ZXJ5LmZpcnN0KCdhcnRpY2xlJywgJGNvbnRleHQpO1xuXHRcdC8vcCAgICAgICAgICAgICAgICA9IG5ldyBQYXJhZ3JhcGgoKSxcblx0XHQvL2VkaXRvciAgICAgICAgICAgPSBwLmNyZWF0ZUZyYWdtZW50KCksXG5cdFx0Ly90ZXh0ICAgICAgICAgICAgID0gbmV3IFRleHRQcm9wZXJ0eSgpLFxuXHRcdC8vc3RyaW5nVmFsdWUgICAgICA9IG5ldyBWYWx1ZVByb3BlcnR5KFwiU3RyaW5nXCIpLFxuXHRcdC8vbnVtYmVyVmFsdWUgICAgICA9IG5ldyBWYWx1ZVByb3BlcnR5KFwiTnVtYmVyXCIpLFxuXHRcdC8vdmlzaWJsZSAgICAgICAgICA9IG5ldyBWaXNpYmxlUHJvcGVydHkoKSxcblx0XHQvL3N0cm9uZyAgICAgICAgICAgPSBuZXcgU3Ryb25nUHJvcGVydHkoKSxcblx0XHQvL2VtcGhhc2lzICAgICAgICAgPSBuZXcgRW1waGFzaXNQcm9wZXJ0eSgpLFxuXHRcdC8vc3RyaWtlICAgICAgICAgICA9IG5ldyBTdHJpa2VQcm9wZXJ0eSgpLFxuXHRcdC8vZm9ybWF0TnVtYmVyICAgICA9IG5ldyBOdW1lcmljRm9ybWF0UHJvcGVydHkoKSxcblx0XHQvL2xpbmsgICAgICAgICAgICAgPSBuZXcgTGlua1Byb3BlcnR5KCksXG5cdFx0Ly90b29sdGlwICAgICAgICAgID0gbmV3IFRvb2x0aXBQcm9wZXJ0eShcInRvb2x0aXAgdGV4dCBnb2VzIGhlcmVcIiksXG5cdFx0Ly90ZXh0RWRpdG9yICAgICAgID0gbmV3IFRleHRFZGl0b3JQcm9wZXJ0eSgpO1xuXG4vKlxuXHQvLyBhZGQgdGV4dCBwcm9wZXJ0eSBhbmQgcmVuZGVyaW5nXG5cdGVkaXRvci5wcm9wZXJ0aWVzLmFkZCh0ZXh0KTtcblx0ZWRpdG9yLnByb3BlcnRpZXMuYWRkKHN0cm9uZyk7XG5cdGVkaXRvci5wcm9wZXJ0aWVzLmFkZChlbXBoYXNpcyk7XG5cdGVkaXRvci5wcm9wZXJ0aWVzLmFkZChzdHJpa2UpO1xuXHQvL2VkaXRvci5wcm9wZXJ0aWVzLmFkZChsaW5rKTtcblxuXHQvLyBhZGQgdGV4dCBlZGl0b3Jcblx0ZWRpdG9yLnByb3BlcnRpZXMuYWRkKHRleHRFZGl0b3IpO1xuXHRlZGl0b3IuZWRpdG9yLnZhbHVlLmZlZWQoZWRpdG9yLnRleHQpO1xuXHRlZGl0b3IuZWRpdG9yID0gXCJzZWxlY3QgbWUuLi5cIjtcblx0ZWRpdG9yLmVkaXRvci5mb2N1cygpO1xuXG5cblxuXG5cdGxldCBmaWVsZCA9IG5ldyBGaWVsZCgpO1xuXHRmaWVsZC5hdHRhY2hUbygkY29udGV4dF9hcnRpY2xlKTtcblx0ZmllbGQua2V5LnByb3BlcnRpZXMuYWRkKG5ldyBUZXh0UHJvcGVydHkoJ3RleHQnKSk7XG5cdGZpZWxkLnZhbHVlLnByb3BlcnRpZXMuYWRkKG5ldyBUZXh0UHJvcGVydHkoKSk7XG5cdGZpZWxkLnZhbHVlLnByb3BlcnRpZXMuYWRkKG5ldyBUZXh0RWRpdG9yUHJvcGVydHkoKSk7XG5cdGZpZWxkLnZhbHVlLmVkaXRvci52YWx1ZS5mZWVkKGZpZWxkLnZhbHVlLnRleHQpO1xuXHRmaWVsZC52YWx1ZS5lZGl0b3IudmFsdWUgPSAnJC52YXJuYW1lJztcblxuXHRsZXQgZmllbGQgPSBuZXcgRmllbGQoKTtcblx0ZmllbGQuYXR0YWNoVG8oJGNvbnRleHRfYXJ0aWNsZSk7XG5cdGZpZWxkLmtleS5wcm9wZXJ0aWVzLmFkZChuZXcgVGV4dFByb3BlcnR5KCdsaW5rJykpO1xuXHRmaWVsZC52YWx1ZS5wcm9wZXJ0aWVzLmFkZChuZXcgVGV4dFByb3BlcnR5KCkpO1xuXHRmaWVsZC52YWx1ZS5wcm9wZXJ0aWVzLmFkZChuZXcgVGV4dEVkaXRvclByb3BlcnR5KCkpO1xuXHRmaWVsZC52YWx1ZS5lZGl0b3IudmFsdWUuZmVlZChmaWVsZC52YWx1ZS50ZXh0KTtcblx0Ly9maWVsZC52YWx1ZS5lZGl0b3IudmFsdWUuZmVlZChlZGl0b3IubGluayk7XG5cdGZpZWxkLnZhbHVlLmVkaXRvci52YWx1ZSA9ICdodHRwOi8vd3d3Lmdvb2dsZS5jb20nO1xuXG5cdGxldCBmaWVsZCA9IG5ldyBGaWVsZCgpO1xuXHRmaWVsZC5hdHRhY2hUbygkY29udGV4dF9hcnRpY2xlKTtcblx0ZmllbGQua2V5LnByb3BlcnRpZXMuYWRkKG5ldyBJY29uUHJvcGVydHkoJ2JvbGQnKSk7XG5cdGZpZWxkLnZhbHVlLnByb3BlcnRpZXMuYWRkKG5ldyBCb29sRWRpdG9yUHJvcGVydHkoKSk7XG5cdGZpZWxkLnZhbHVlLmVkaXRvci52YWx1ZS5mZWVkKGVkaXRvci5zdHJvbmcpO1xuXHRwLmF0dGFjaFRvKCRkb2NfYXJ0aWNsZSk7XG5cblx0bGV0IGZpZWxkID0gbmV3IEZpZWxkKCk7XG5cdGZpZWxkLmF0dGFjaFRvKCRjb250ZXh0X2FydGljbGUpO1xuXHRmaWVsZC5rZXkucHJvcGVydGllcy5hZGQobmV3IEljb25Qcm9wZXJ0eSgnaXRhbGljJykpO1xuXHRmaWVsZC52YWx1ZS5wcm9wZXJ0aWVzLmFkZChuZXcgQm9vbEVkaXRvclByb3BlcnR5KCkpO1xuXHRmaWVsZC52YWx1ZS5lZGl0b3IudmFsdWUuZmVlZChlZGl0b3IuZW1waGFzaXMpO1xuXHRwLmF0dGFjaFRvKCRkb2NfYXJ0aWNsZSk7XG5cblx0bGV0IGZpZWxkID0gbmV3IEZpZWxkKCk7XG5cdGZpZWxkLmF0dGFjaFRvKCRjb250ZXh0X2FydGljbGUpO1xuXHRmaWVsZC5rZXkucHJvcGVydGllcy5hZGQobmV3IEljb25Qcm9wZXJ0eSgnc3RyaWtldGhyb3VnaCcpKTtcblx0ZmllbGQudmFsdWUucHJvcGVydGllcy5hZGQobmV3IEJvb2xFZGl0b3JQcm9wZXJ0eSgpKTtcblx0ZmllbGQudmFsdWUuZWRpdG9yLnZhbHVlLmZlZWQoZWRpdG9yLnN0cmlrZSk7XG5cdHAuYXR0YWNoVG8oJGRvY19hcnRpY2xlKTtcbiovXG5cblx0bGV0IHNjaGVtYSAgPSBuZXcgU2NoZW1hKCksXG5cdFx0bW9kZWwgICA9IG5ldyBNb2RlbCgpLFxuXHRcdG1vZGVsdWkgPSBuZXcgTW9kZWxVSShtb2RlbCwgc2NoZW1hKTtcblxuXHRtb2RlbHVpLmF0dGFjaFRvKCRhc2lkZSk7XG5cblx0Lypcblx0bGV0IGZpZWxkID0gbmV3IEZpZWxkKCk7XG5cblx0ZmllbGQuYXR0YWNoVG8oJG1vZGVsX2FydGljbGUpO1xuXHRmaWVsZC5rZXkucHJvcGVydGllcy5hZGQobmV3IFRleHRQcm9wZXJ0eSgndmFybmFtZScpKTtcblx0ZmllbGQua2V5LnByb3BlcnRpZXMuYWRkKG5ldyBUZXh0RWRpdG9yUHJvcGVydHkoKSk7XG5cdGZpZWxkLnZhbHVlLnByb3BlcnRpZXMuYWRkKG5ldyBUZXh0UHJvcGVydHkoKSk7XG5cdGZpZWxkLnZhbHVlLnByb3BlcnRpZXMuYWRkKG5ldyBUZXh0RWRpdG9yUHJvcGVydHkoKSk7XG5cdGZpZWxkLnZhbHVlLmVkaXRvci52YWx1ZS5mZWVkKGZpZWxkLnZhbHVlLnRleHQpO1xuXHQqL1xuXG5cblxuXHQvL2xldCBjb3B5ID0gbmV3IEZyYWdtZW50KCk7XG5cdC8vZWRpdG9yLnByb3BlcnRpZXMuY29weVRvKGNvcHkpO1xuXHQvL2NvcHkuYXR0YWNoVG8oY29udGFpbmVyKTtcblxuXHQvLyB0ZXN0IGNhbmNlbFxuXHQvLyBsZXQgcyA9IFN0cmVhbS5zZXF1ZW5jZShbMSwyLDNdLCAyMDAsIHRydWUpLmNhbmNlbE9uKFN0cmVhbS5kZWxheSg1MDAwKSk7XG5cdC8vIHMubG9nKFwiU1wiKTtcblx0Ly8gbGV0IG0gPSBzLm1hcCgodikgPT4gLXYgKiA5KS5jYW5jZWxPbihTdHJlYW0uZGVsYXkoMjUwMCkpO1xuXHQvLyBtLmxvZyhcIk1cIik7XG5cbn0pOyIsIi8qKlxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQXV0aG9yOiAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBMaWNlbnNlOiAgTUlUXG4gKlxuICogYG5wbSBpbnN0YWxsIGJ1ZmZlcmBcbiAqL1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuQnVmZmVyLnBvb2xTaXplID0gODE5MlxuXG4vKipcbiAqIElmIGBCdWZmZXIuX3VzZVR5cGVkQXJyYXlzYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFVzZSBPYmplY3QgaW1wbGVtZW50YXRpb24gKGNvbXBhdGlibGUgZG93biB0byBJRTYpXG4gKi9cbkJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgPSAoZnVuY3Rpb24gKCkge1xuICAvLyBEZXRlY3QgaWYgYnJvd3NlciBzdXBwb3J0cyBUeXBlZCBBcnJheXMuIFN1cHBvcnRlZCBicm93c2VycyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLFxuICAvLyBDaHJvbWUgNyssIFNhZmFyaSA1LjErLCBPcGVyYSAxMS42KywgaU9TIDQuMisuIElmIHRoZSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgYWRkaW5nXG4gIC8vIHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcywgdGhlbiB0aGF0J3MgdGhlIHNhbWUgYXMgbm8gYFVpbnQ4QXJyYXlgIHN1cHBvcnRcbiAgLy8gYmVjYXVzZSB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gYWRkIGFsbCB0aGUgbm9kZSBCdWZmZXIgQVBJIG1ldGhvZHMuIFRoaXMgaXMgYW4gaXNzdWVcbiAgLy8gaW4gRmlyZWZveCA0LTI5LiBOb3cgZml4ZWQ6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOFxuICB0cnkge1xuICAgIHZhciBidWYgPSBuZXcgQXJyYXlCdWZmZXIoMClcbiAgICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICAgIGFyci5mb28gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gICAgcmV0dXJuIDQyID09PSBhcnIuZm9vKCkgJiZcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAvLyBDaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59KSgpXG5cbi8qKlxuICogQ2xhc3M6IEJ1ZmZlclxuICogPT09PT09PT09PT09PVxuICpcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgYXJlIGF1Z21lbnRlZFxuICogd2l0aCBmdW5jdGlvbiBwcm9wZXJ0aWVzIGZvciBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgQVBJIGZ1bmN0aW9ucy4gV2UgdXNlXG4gKiBgVWludDhBcnJheWAgc28gdGhhdCBzcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdCByZXR1cm5zXG4gKiBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBCeSBhdWdtZW50aW5nIHRoZSBpbnN0YW5jZXMsIHdlIGNhbiBhdm9pZCBtb2RpZnlpbmcgdGhlIGBVaW50OEFycmF5YFxuICogcHJvdG90eXBlLlxuICovXG5mdW5jdGlvbiBCdWZmZXIgKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpXG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybylcblxuICB2YXIgdHlwZSA9IHR5cGVvZiBzdWJqZWN0XG5cbiAgLy8gV29ya2Fyb3VuZDogbm9kZSdzIGJhc2U2NCBpbXBsZW1lbnRhdGlvbiBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgc3RyaW5nc1xuICAvLyB3aGlsZSBiYXNlNjQtanMgZG9lcyBub3QuXG4gIGlmIChlbmNvZGluZyA9PT0gJ2Jhc2U2NCcgJiYgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBzdWJqZWN0ID0gc3RyaW5ndHJpbShzdWJqZWN0KVxuICAgIHdoaWxlIChzdWJqZWN0Lmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICAgIHN1YmplY3QgPSBzdWJqZWN0ICsgJz0nXG4gICAgfVxuICB9XG5cbiAgLy8gRmluZCB0aGUgbGVuZ3RoXG4gIHZhciBsZW5ndGhcbiAgaWYgKHR5cGUgPT09ICdudW1iZXInKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0KVxuICBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJylcbiAgICBsZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aChzdWJqZWN0LCBlbmNvZGluZylcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QubGVuZ3RoKSAvLyBhc3N1bWUgdGhhdCBvYmplY3QgaXMgYXJyYXktbGlrZVxuICBlbHNlXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCBuZWVkcyB0byBiZSBhIG51bWJlciwgYXJyYXkgb3Igc3RyaW5nLicpXG5cbiAgdmFyIGJ1ZlxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIC8vIFByZWZlcnJlZDogUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICBidWYgPSBCdWZmZXIuX2F1Z21lbnQobmV3IFVpbnQ4QXJyYXkobGVuZ3RoKSlcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIFRISVMgaW5zdGFuY2Ugb2YgQnVmZmVyIChjcmVhdGVkIGJ5IGBuZXdgKVxuICAgIGJ1ZiA9IHRoaXNcbiAgICBidWYubGVuZ3RoID0gbGVuZ3RoXG4gICAgYnVmLl9pc0J1ZmZlciA9IHRydWVcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmIHR5cGVvZiBzdWJqZWN0LmJ5dGVMZW5ndGggPT09ICdudW1iZXInKSB7XG4gICAgLy8gU3BlZWQgb3B0aW1pemF0aW9uIC0tIHVzZSBzZXQgaWYgd2UncmUgY29weWluZyBmcm9tIGEgdHlwZWQgYXJyYXlcbiAgICBidWYuX3NldChzdWJqZWN0KVxuICB9IGVsc2UgaWYgKGlzQXJyYXlpc2goc3ViamVjdCkpIHtcbiAgICAvLyBUcmVhdCBhcnJheS1pc2ggb2JqZWN0cyBhcyBhIGJ5dGUgYXJyYXlcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkpXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3QucmVhZFVJbnQ4KGkpXG4gICAgICBlbHNlXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3RbaV1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBidWYud3JpdGUoc3ViamVjdCwgMCwgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgIW5vWmVybykge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgYnVmW2ldID0gMFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWZcbn1cblxuLy8gU1RBVElDIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICdyYXcnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiAoYikge1xuICByZXR1cm4gISEoYiAhPT0gbnVsbCAmJiBiICE9PSB1bmRlZmluZWQgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gZnVuY3Rpb24gKHN0ciwgZW5jb2RpbmcpIHtcbiAgdmFyIHJldFxuICBzdHIgPSBzdHIgKyAnJ1xuICBzd2l0Y2ggKGVuY29kaW5nIHx8ICd1dGY4Jykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoIC8gMlxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSB1dGY4VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdyYXcnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gYmFzZTY0VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAqIDJcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gKGxpc3QsIHRvdGFsTGVuZ3RoKSB7XG4gIGFzc2VydChpc0FycmF5KGxpc3QpLCAnVXNhZ2U6IEJ1ZmZlci5jb25jYXQobGlzdCwgW3RvdGFsTGVuZ3RoXSlcXG4nICtcbiAgICAgICdsaXN0IHNob3VsZCBiZSBhbiBBcnJheS4nKVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKDApXG4gIH0gZWxzZSBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gbGlzdFswXVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB0b3RhbExlbmd0aCAhPT0gJ251bWJlcicpIHtcbiAgICB0b3RhbExlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdG90YWxMZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmID0gbmV3IEJ1ZmZlcih0b3RhbExlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV1cbiAgICBpdGVtLmNvcHkoYnVmLCBwb3MpXG4gICAgcG9zICs9IGl0ZW0ubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBCVUZGRVIgSU5TVEFOQ0UgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gX2hleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgYXNzZXJ0KHN0ckxlbiAlIDIgPT09IDAsICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYnl0ZSA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBhc3NlcnQoIWlzTmFOKGJ5dGUpLCAnSW52YWxpZCBoZXggc3RyaW5nJylcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBieXRlXG4gIH1cbiAgQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSBpICogMlxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBfdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2FzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2JpbmFyeVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIF9hc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfdXRmMTZsZVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBTdXBwb3J0IGJvdGggKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKVxuICAvLyBhbmQgdGhlIGxlZ2FjeSAoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpXG4gIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgaWYgKCFpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICB9IGVsc2UgeyAgLy8gbGVnYWN5XG4gICAgdmFyIHN3YXAgPSBlbmNvZGluZ1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgb2Zmc2V0ID0gbGVuZ3RoXG4gICAgbGVuZ3RoID0gc3dhcFxuICB9XG5cbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgc2VsZiA9IHRoaXNcblxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcbiAgc3RhcnQgPSBOdW1iZXIoc3RhcnQpIHx8IDBcbiAgZW5kID0gKGVuZCAhPT0gdW5kZWZpbmVkKVxuICAgID8gTnVtYmVyKGVuZClcbiAgICA6IGVuZCA9IHNlbGYubGVuZ3RoXG5cbiAgLy8gRmFzdHBhdGggZW1wdHkgc3RyaW5nc1xuICBpZiAoZW5kID09PSBzdGFydClcbiAgICByZXR1cm4gJydcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKHRhcmdldCwgdGFyZ2V0X3N0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIHZhciBzb3VyY2UgPSB0aGlzXG5cbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKCF0YXJnZXRfc3RhcnQpIHRhcmdldF9zdGFydCA9IDBcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCBzb3VyY2UubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdzb3VyY2VFbmQgPCBzb3VyY2VTdGFydCcpXG4gIGFzc2VydCh0YXJnZXRfc3RhcnQgPj0gMCAmJiB0YXJnZXRfc3RhcnQgPCB0YXJnZXQubGVuZ3RoLFxuICAgICAgJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSBzb3VyY2UubGVuZ3RoLCAnc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aClcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCA8IGVuZCAtIHN0YXJ0KVxuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgKyBzdGFydFxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuXG4gIGlmIChsZW4gPCAxMDAgfHwgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRfc3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0Ll9zZXQodGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLCB0YXJnZXRfc3RhcnQpXG4gIH1cbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBfdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJlcyA9ICcnXG4gIHZhciB0bXAgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBpZiAoYnVmW2ldIDw9IDB4N0YpIHtcbiAgICAgIHJlcyArPSBkZWNvZGVVdGY4Q2hhcih0bXApICsgU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gICAgICB0bXAgPSAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICB0bXAgKz0gJyUnICsgYnVmW2ldLnRvU3RyaW5nKDE2KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXMgKyBkZWNvZGVVdGY4Q2hhcih0bXApXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKylcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gX2JpbmFyeVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIF9hc2NpaVNsaWNlKGJ1Ziwgc3RhcnQsIGVuZClcbn1cblxuZnVuY3Rpb24gX2hleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgYnl0ZXNbaSsxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSBjbGFtcChzdGFydCwgbGVuLCAwKVxuICBlbmQgPSBjbGFtcChlbmQsIGxlbiwgbGVuKVxuXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5fYXVnbWVudCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpKVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgdmFyIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZCwgdHJ1ZSlcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyBpKyspIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgICByZXR1cm4gbmV3QnVmXG4gIH1cbn1cblxuLy8gYGdldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLmdldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMucmVhZFVJbnQ4KG9mZnNldClcbn1cblxuLy8gYHNldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHYsIG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLnNldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMud3JpdGVVSW50OCh2LCBvZmZzZXQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgdmFsID0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICB9IGVsc2Uge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV1cbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDJdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgICB2YWwgfD0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0ICsgM10gPDwgMjQgPj4+IDApXG4gIH0gZWxzZSB7XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMV0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMl0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAzXVxuICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0XSA8PCAyNCA+Pj4gMClcbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICB2YXIgbmVnID0gdGhpc1tvZmZzZXRdICYgMHg4MFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQxNihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MzIoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMDAwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZmZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRmxvYXQgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWREb3VibGUgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aCkgcmV0dXJuXG5cbiAgdGhpc1tvZmZzZXRdID0gdmFsdWVcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCAyKTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAgICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZmZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgNCk7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2YsIC0weDgwKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICB0aGlzLndyaXRlVUludDgodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICB0aGlzLndyaXRlVUludDgoMHhmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmLCAtMHg4MDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQxNihidWYsIDB4ZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQzMihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MzIoYnVmLCAweGZmZmZmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBmaWxsKHZhbHVlLCBzdGFydD0wLCBlbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uICh2YWx1ZSwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXZhbHVlKSB2YWx1ZSA9IDBcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kKSBlbmQgPSB0aGlzLmxlbmd0aFxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS5jaGFyQ29kZUF0KDApXG4gIH1cblxuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiAhaXNOYU4odmFsdWUpLCAndmFsdWUgaXMgbm90IGEgbnVtYmVyJylcbiAgYXNzZXJ0KGVuZCA+PSBzdGFydCwgJ2VuZCA8IHN0YXJ0JylcblxuICAvLyBGaWxsIDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIGFzc2VydChzdGFydCA+PSAwICYmIHN0YXJ0IDwgdGhpcy5sZW5ndGgsICdzdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSB0aGlzLmxlbmd0aCwgJ2VuZCBvdXQgb2YgYm91bmRzJylcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHRoaXNbaV0gPSB2YWx1ZVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG91dCA9IFtdXG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgb3V0W2ldID0gdG9IZXgodGhpc1tpXSlcbiAgICBpZiAoaSA9PT0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUykge1xuICAgICAgb3V0W2kgKyAxXSA9ICcuLi4nXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIG91dC5qb2luKCcgJykgKyAnPidcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGBBcnJheUJ1ZmZlcmAgd2l0aCB0aGUgKmNvcGllZCogbWVtb3J5IG9mIHRoZSBidWZmZXIgaW5zdGFuY2UuXG4gKiBBZGRlZCBpbiBOb2RlIDAuMTIuIE9ubHkgYXZhaWxhYmxlIGluIGJyb3dzZXJzIHRoYXQgc3VwcG9ydCBBcnJheUJ1ZmZlci5cbiAqL1xuQnVmZmVyLnByb3RvdHlwZS50b0FycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAgIHJldHVybiAobmV3IEJ1ZmZlcih0aGlzKSkuYnVmZmVyXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBidWYgPSBuZXcgVWludDhBcnJheSh0aGlzLmxlbmd0aClcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBidWYubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpXG4gICAgICAgIGJ1ZltpXSA9IHRoaXNbaV1cbiAgICAgIHJldHVybiBidWYuYnVmZmVyXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignQnVmZmVyLnRvQXJyYXlCdWZmZXIgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXInKVxuICB9XG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxudmFyIEJQID0gQnVmZmVyLnByb3RvdHlwZVxuXG4vKipcbiAqIEF1Z21lbnQgYSBVaW50OEFycmF5ICppbnN0YW5jZSogKG5vdCB0aGUgVWludDhBcnJheSBjbGFzcyEpIHdpdGggQnVmZmVyIG1ldGhvZHNcbiAqL1xuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gKGFycikge1xuICBhcnIuX2lzQnVmZmVyID0gdHJ1ZVxuXG4gIC8vIHNhdmUgcmVmZXJlbmNlIHRvIG9yaWdpbmFsIFVpbnQ4QXJyYXkgZ2V0L3NldCBtZXRob2RzIGJlZm9yZSBvdmVyd3JpdGluZ1xuICBhcnIuX2dldCA9IGFyci5nZXRcbiAgYXJyLl9zZXQgPSBhcnIuc2V0XG5cbiAgLy8gZGVwcmVjYXRlZCwgd2lsbCBiZSByZW1vdmVkIGluIG5vZGUgMC4xMytcbiAgYXJyLmdldCA9IEJQLmdldFxuICBhcnIuc2V0ID0gQlAuc2V0XG5cbiAgYXJyLndyaXRlID0gQlAud3JpdGVcbiAgYXJyLnRvU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvTG9jYWxlU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvSlNPTiA9IEJQLnRvSlNPTlxuICBhcnIuY29weSA9IEJQLmNvcHlcbiAgYXJyLnNsaWNlID0gQlAuc2xpY2VcbiAgYXJyLnJlYWRVSW50OCA9IEJQLnJlYWRVSW50OFxuICBhcnIucmVhZFVJbnQxNkxFID0gQlAucmVhZFVJbnQxNkxFXG4gIGFyci5yZWFkVUludDE2QkUgPSBCUC5yZWFkVUludDE2QkVcbiAgYXJyLnJlYWRVSW50MzJMRSA9IEJQLnJlYWRVSW50MzJMRVxuICBhcnIucmVhZFVJbnQzMkJFID0gQlAucmVhZFVJbnQzMkJFXG4gIGFyci5yZWFkSW50OCA9IEJQLnJlYWRJbnQ4XG4gIGFyci5yZWFkSW50MTZMRSA9IEJQLnJlYWRJbnQxNkxFXG4gIGFyci5yZWFkSW50MTZCRSA9IEJQLnJlYWRJbnQxNkJFXG4gIGFyci5yZWFkSW50MzJMRSA9IEJQLnJlYWRJbnQzMkxFXG4gIGFyci5yZWFkSW50MzJCRSA9IEJQLnJlYWRJbnQzMkJFXG4gIGFyci5yZWFkRmxvYXRMRSA9IEJQLnJlYWRGbG9hdExFXG4gIGFyci5yZWFkRmxvYXRCRSA9IEJQLnJlYWRGbG9hdEJFXG4gIGFyci5yZWFkRG91YmxlTEUgPSBCUC5yZWFkRG91YmxlTEVcbiAgYXJyLnJlYWREb3VibGVCRSA9IEJQLnJlYWREb3VibGVCRVxuICBhcnIud3JpdGVVSW50OCA9IEJQLndyaXRlVUludDhcbiAgYXJyLndyaXRlVUludDE2TEUgPSBCUC53cml0ZVVJbnQxNkxFXG4gIGFyci53cml0ZVVJbnQxNkJFID0gQlAud3JpdGVVSW50MTZCRVxuICBhcnIud3JpdGVVSW50MzJMRSA9IEJQLndyaXRlVUludDMyTEVcbiAgYXJyLndyaXRlVUludDMyQkUgPSBCUC53cml0ZVVJbnQzMkJFXG4gIGFyci53cml0ZUludDggPSBCUC53cml0ZUludDhcbiAgYXJyLndyaXRlSW50MTZMRSA9IEJQLndyaXRlSW50MTZMRVxuICBhcnIud3JpdGVJbnQxNkJFID0gQlAud3JpdGVJbnQxNkJFXG4gIGFyci53cml0ZUludDMyTEUgPSBCUC53cml0ZUludDMyTEVcbiAgYXJyLndyaXRlSW50MzJCRSA9IEJQLndyaXRlSW50MzJCRVxuICBhcnIud3JpdGVGbG9hdExFID0gQlAud3JpdGVGbG9hdExFXG4gIGFyci53cml0ZUZsb2F0QkUgPSBCUC53cml0ZUZsb2F0QkVcbiAgYXJyLndyaXRlRG91YmxlTEUgPSBCUC53cml0ZURvdWJsZUxFXG4gIGFyci53cml0ZURvdWJsZUJFID0gQlAud3JpdGVEb3VibGVCRVxuICBhcnIuZmlsbCA9IEJQLmZpbGxcbiAgYXJyLmluc3BlY3QgPSBCUC5pbnNwZWN0XG4gIGFyci50b0FycmF5QnVmZmVyID0gQlAudG9BcnJheUJ1ZmZlclxuXG4gIHJldHVybiBhcnJcbn1cblxuLy8gc2xpY2Uoc3RhcnQsIGVuZClcbmZ1bmN0aW9uIGNsYW1wIChpbmRleCwgbGVuLCBkZWZhdWx0VmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHJldHVybiBkZWZhdWx0VmFsdWVcbiAgaW5kZXggPSB+fmluZGV4OyAgLy8gQ29lcmNlIHRvIGludGVnZXIuXG4gIGlmIChpbmRleCA+PSBsZW4pIHJldHVybiBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICBpbmRleCArPSBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBjb2VyY2UgKGxlbmd0aCkge1xuICAvLyBDb2VyY2UgbGVuZ3RoIHRvIGEgbnVtYmVyIChwb3NzaWJseSBOYU4pLCByb3VuZCB1cFxuICAvLyBpbiBjYXNlIGl0J3MgZnJhY3Rpb25hbCAoZS5nLiAxMjMuNDU2KSB0aGVuIGRvIGFcbiAgLy8gZG91YmxlIG5lZ2F0ZSB0byBjb2VyY2UgYSBOYU4gdG8gMC4gRWFzeSwgcmlnaHQ/XG4gIGxlbmd0aCA9IH5+TWF0aC5jZWlsKCtsZW5ndGgpXG4gIHJldHVybiBsZW5ndGggPCAwID8gMCA6IGxlbmd0aFxufVxuXG5mdW5jdGlvbiBpc0FycmF5IChzdWJqZWN0KSB7XG4gIHJldHVybiAoQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoc3ViamVjdCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3ViamVjdCkgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgfSkoc3ViamVjdClcbn1cblxuZnVuY3Rpb24gaXNBcnJheWlzaCAoc3ViamVjdCkge1xuICByZXR1cm4gaXNBcnJheShzdWJqZWN0KSB8fCBCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkgfHxcbiAgICAgIHN1YmplY3QgJiYgdHlwZW9mIHN1YmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICB0eXBlb2Ygc3ViamVjdC5sZW5ndGggPT09ICdudW1iZXInXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYiA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaWYgKGIgPD0gMHg3RilcbiAgICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpKVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHN0YXJ0ID0gaVxuICAgICAgaWYgKGIgPj0gMHhEODAwICYmIGIgPD0gMHhERkZGKSBpKytcbiAgICAgIHZhciBoID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5zbGljZShzdGFydCwgaSsxKSkuc3Vic3RyKDEpLnNwbGl0KCclJylcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaC5sZW5ndGg7IGorKylcbiAgICAgICAgYnl0ZUFycmF5LnB1c2gocGFyc2VJbnQoaFtqXSwgMTYpKVxuICAgIH1cbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShzdHIpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgcG9zXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpXG4gICAgICBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIGRlY29kZVV0ZjhDaGFyIChzdHIpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHN0cilcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoMHhGRkZEKSAvLyBVVEYgOCBpbnZhbGlkIGNoYXJcbiAgfVxufVxuXG4vKlxuICogV2UgaGF2ZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgdmFsdWUgaXMgYSB2YWxpZCBpbnRlZ2VyLiBUaGlzIG1lYW5zIHRoYXQgaXRcbiAqIGlzIG5vbi1uZWdhdGl2ZS4gSXQgaGFzIG5vIGZyYWN0aW9uYWwgY29tcG9uZW50IGFuZCB0aGF0IGl0IGRvZXMgbm90XG4gKiBleGNlZWQgdGhlIG1heGltdW0gYWxsb3dlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gdmVyaWZ1aW50ICh2YWx1ZSwgbWF4KSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA+PSAwLCAnc3BlY2lmaWVkIGEgbmVnYXRpdmUgdmFsdWUgZm9yIHdyaXRpbmcgYW4gdW5zaWduZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgaXMgbGFyZ2VyIHRoYW4gbWF4aW11bSB2YWx1ZSBmb3IgdHlwZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmc2ludCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmSUVFRTc1NCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG59XG5cbmZ1bmN0aW9uIGFzc2VydCAodGVzdCwgbWVzc2FnZSkge1xuICBpZiAoIXRlc3QpIHRocm93IG5ldyBFcnJvcihtZXNzYWdlIHx8ICdGYWlsZWQgYXNzZXJ0aW9uJylcbn1cbiIsInZhciBsb29rdXAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG5cbjsoZnVuY3Rpb24gKGV4cG9ydHMpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG4gIHZhciBBcnIgPSAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKVxuICAgID8gVWludDhBcnJheVxuICAgIDogQXJyYXlcblxuXHR2YXIgWkVSTyAgID0gJzAnLmNoYXJDb2RlQXQoMClcblx0dmFyIFBMVVMgICA9ICcrJy5jaGFyQ29kZUF0KDApXG5cdHZhciBTTEFTSCAgPSAnLycuY2hhckNvZGVBdCgwKVxuXHR2YXIgTlVNQkVSID0gJzAnLmNoYXJDb2RlQXQoMClcblx0dmFyIExPV0VSICA9ICdhJy5jaGFyQ29kZUF0KDApXG5cdHZhciBVUFBFUiAgPSAnQScuY2hhckNvZGVBdCgwKVxuXG5cdGZ1bmN0aW9uIGRlY29kZSAoZWx0KSB7XG5cdFx0dmFyIGNvZGUgPSBlbHQuY2hhckNvZGVBdCgwKVxuXHRcdGlmIChjb2RlID09PSBQTFVTKVxuXHRcdFx0cmV0dXJuIDYyIC8vICcrJ1xuXHRcdGlmIChjb2RlID09PSBTTEFTSClcblx0XHRcdHJldHVybiA2MyAvLyAnLydcblx0XHRpZiAoY29kZSA8IE5VTUJFUilcblx0XHRcdHJldHVybiAtMSAvL25vIG1hdGNoXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIgKyAxMClcblx0XHRcdHJldHVybiBjb2RlIC0gTlVNQkVSICsgMjYgKyAyNlxuXHRcdGlmIChjb2RlIDwgVVBQRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gVVBQRVJcblx0XHRpZiAoY29kZSA8IExPV0VSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIExPV0VSICsgMjZcblx0fVxuXG5cdGZ1bmN0aW9uIGI2NFRvQnl0ZUFycmF5IChiNjQpIHtcblx0XHR2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuXG5cdFx0aWYgKGI2NC5sZW5ndGggJSA0ID4gMCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0Jylcblx0XHR9XG5cblx0XHQvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuXHRcdC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcblx0XHQvLyByZXByZXNlbnQgb25lIGJ5dGVcblx0XHQvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcblx0XHQvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG5cdFx0dmFyIGxlbiA9IGI2NC5sZW5ndGhcblx0XHRwbGFjZUhvbGRlcnMgPSAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMikgPyAyIDogJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDEpID8gMSA6IDBcblxuXHRcdC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuXHRcdGFyciA9IG5ldyBBcnIoYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuXHRcdGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gYjY0Lmxlbmd0aCAtIDQgOiBiNjQubGVuZ3RoXG5cblx0XHR2YXIgTCA9IDBcblxuXHRcdGZ1bmN0aW9uIHB1c2ggKHYpIHtcblx0XHRcdGFycltMKytdID0gdlxuXHRcdH1cblxuXHRcdGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTgpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgMTIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPDwgNikgfCBkZWNvZGUoYjY0LmNoYXJBdChpICsgMykpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDAwMCkgPj4gMTYpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDApID4+IDgpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0aWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpID4+IDQpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTApIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgNCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA+PiAyKVxuXHRcdFx0cHVzaCgodG1wID4+IDgpICYgMHhGRilcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJyXG5cdH1cblxuXHRmdW5jdGlvbiB1aW50OFRvQmFzZTY0ICh1aW50OCkge1xuXHRcdHZhciBpLFxuXHRcdFx0ZXh0cmFCeXRlcyA9IHVpbnQ4Lmxlbmd0aCAlIDMsIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG5cdFx0XHRvdXRwdXQgPSBcIlwiLFxuXHRcdFx0dGVtcCwgbGVuZ3RoXG5cblx0XHRmdW5jdGlvbiBlbmNvZGUgKG51bSkge1xuXHRcdFx0cmV0dXJuIGxvb2t1cC5jaGFyQXQobnVtKVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG5cdFx0XHRyZXR1cm4gZW5jb2RlKG51bSA+PiAxOCAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiAxMiAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiA2ICYgMHgzRikgKyBlbmNvZGUobnVtICYgMHgzRilcblx0XHR9XG5cblx0XHQvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG5cdFx0Zm9yIChpID0gMCwgbGVuZ3RoID0gdWludDgubGVuZ3RoIC0gZXh0cmFCeXRlczsgaSA8IGxlbmd0aDsgaSArPSAzKSB7XG5cdFx0XHR0ZW1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuXHRcdFx0b3V0cHV0ICs9IHRyaXBsZXRUb0Jhc2U2NCh0ZW1wKVxuXHRcdH1cblxuXHRcdC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcblx0XHRzd2l0Y2ggKGV4dHJhQnl0ZXMpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dGVtcCA9IHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAyKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9PSdcblx0XHRcdFx0YnJlYWtcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0dGVtcCA9ICh1aW50OFt1aW50OC5sZW5ndGggLSAyXSA8PCA4KSArICh1aW50OFt1aW50OC5sZW5ndGggLSAxXSlcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDEwKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wID4+IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCAyKSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPSdcblx0XHRcdFx0YnJlYWtcblx0XHR9XG5cblx0XHRyZXR1cm4gb3V0cHV0XG5cdH1cblxuXHRtb2R1bGUuZXhwb3J0cy50b0J5dGVBcnJheSA9IGI2NFRvQnl0ZUFycmF5XG5cdG1vZHVsZS5leHBvcnRzLmZyb21CeXRlQXJyYXkgPSB1aW50OFRvQmFzZTY0XG59KCkpXG4iLCJleHBvcnRzLnJlYWQgPSBmdW5jdGlvbihidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLFxuICAgICAgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMSxcbiAgICAgIGVNYXggPSAoMSA8PCBlTGVuKSAtIDEsXG4gICAgICBlQmlhcyA9IGVNYXggPj4gMSxcbiAgICAgIG5CaXRzID0gLTcsXG4gICAgICBpID0gaXNMRSA/IChuQnl0ZXMgLSAxKSA6IDAsXG4gICAgICBkID0gaXNMRSA/IC0xIDogMSxcbiAgICAgIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV07XG5cbiAgaSArPSBkO1xuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpO1xuICBzID4+PSAoLW5CaXRzKTtcbiAgbkJpdHMgKz0gZUxlbjtcbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCk7XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSk7XG4gIGUgPj49ICgtbkJpdHMpO1xuICBuQml0cyArPSBtTGVuO1xuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KTtcblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXM7XG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KTtcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pO1xuICAgIGUgPSBlIC0gZUJpYXM7XG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbik7XG59O1xuXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24oYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGMsXG4gICAgICBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxLFxuICAgICAgZU1heCA9ICgxIDw8IGVMZW4pIC0gMSxcbiAgICAgIGVCaWFzID0gZU1heCA+PiAxLFxuICAgICAgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApLFxuICAgICAgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpLFxuICAgICAgZCA9IGlzTEUgPyAxIDogLTEsXG4gICAgICBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwO1xuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpO1xuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwO1xuICAgIGUgPSBlTWF4O1xuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKTtcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS07XG4gICAgICBjICo9IDI7XG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcyk7XG4gICAgfVxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xuICAgICAgZSsrO1xuICAgICAgYyAvPSAyO1xuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDA7XG4gICAgICBlID0gZU1heDtcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKHZhbHVlICogYyAtIDEpICogTWF0aC5wb3coMiwgbUxlbik7XG4gICAgICBlID0gZSArIGVCaWFzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbik7XG4gICAgICBlID0gMDtcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KTtcblxuICBlID0gKGUgPDwgbUxlbikgfCBtO1xuICBlTGVuICs9IG1MZW47XG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCk7XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4O1xufTtcbiIsInZhciBCdWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5CdWZmZXI7XG52YXIgaW50U2l6ZSA9IDQ7XG52YXIgemVyb0J1ZmZlciA9IG5ldyBCdWZmZXIoaW50U2l6ZSk7IHplcm9CdWZmZXIuZmlsbCgwKTtcbnZhciBjaHJzeiA9IDg7XG5cbmZ1bmN0aW9uIHRvQXJyYXkoYnVmLCBiaWdFbmRpYW4pIHtcbiAgaWYgKChidWYubGVuZ3RoICUgaW50U2l6ZSkgIT09IDApIHtcbiAgICB2YXIgbGVuID0gYnVmLmxlbmd0aCArIChpbnRTaXplIC0gKGJ1Zi5sZW5ndGggJSBpbnRTaXplKSk7XG4gICAgYnVmID0gQnVmZmVyLmNvbmNhdChbYnVmLCB6ZXJvQnVmZmVyXSwgbGVuKTtcbiAgfVxuXG4gIHZhciBhcnIgPSBbXTtcbiAgdmFyIGZuID0gYmlnRW5kaWFuID8gYnVmLnJlYWRJbnQzMkJFIDogYnVmLnJlYWRJbnQzMkxFO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ1Zi5sZW5ndGg7IGkgKz0gaW50U2l6ZSkge1xuICAgIGFyci5wdXNoKGZuLmNhbGwoYnVmLCBpKSk7XG4gIH1cbiAgcmV0dXJuIGFycjtcbn1cblxuZnVuY3Rpb24gdG9CdWZmZXIoYXJyLCBzaXplLCBiaWdFbmRpYW4pIHtcbiAgdmFyIGJ1ZiA9IG5ldyBCdWZmZXIoc2l6ZSk7XG4gIHZhciBmbiA9IGJpZ0VuZGlhbiA/IGJ1Zi53cml0ZUludDMyQkUgOiBidWYud3JpdGVJbnQzMkxFO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgIGZuLmNhbGwoYnVmLCBhcnJbaV0sIGkgKiA0LCB0cnVlKTtcbiAgfVxuICByZXR1cm4gYnVmO1xufVxuXG5mdW5jdGlvbiBoYXNoKGJ1ZiwgZm4sIGhhc2hTaXplLCBiaWdFbmRpYW4pIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkgYnVmID0gbmV3IEJ1ZmZlcihidWYpO1xuICB2YXIgYXJyID0gZm4odG9BcnJheShidWYsIGJpZ0VuZGlhbiksIGJ1Zi5sZW5ndGggKiBjaHJzeik7XG4gIHJldHVybiB0b0J1ZmZlcihhcnIsIGhhc2hTaXplLCBiaWdFbmRpYW4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgaGFzaDogaGFzaCB9O1xuIiwidmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlclxudmFyIHNoYSA9IHJlcXVpcmUoJy4vc2hhJylcbnZhciBzaGEyNTYgPSByZXF1aXJlKCcuL3NoYTI1NicpXG52YXIgcm5nID0gcmVxdWlyZSgnLi9ybmcnKVxudmFyIG1kNSA9IHJlcXVpcmUoJy4vbWQ1JylcblxudmFyIGFsZ29yaXRobXMgPSB7XG4gIHNoYTE6IHNoYSxcbiAgc2hhMjU2OiBzaGEyNTYsXG4gIG1kNTogbWQ1XG59XG5cbnZhciBibG9ja3NpemUgPSA2NFxudmFyIHplcm9CdWZmZXIgPSBuZXcgQnVmZmVyKGJsb2Nrc2l6ZSk7IHplcm9CdWZmZXIuZmlsbCgwKVxuZnVuY3Rpb24gaG1hYyhmbiwga2V5LCBkYXRhKSB7XG4gIGlmKCFCdWZmZXIuaXNCdWZmZXIoa2V5KSkga2V5ID0gbmV3IEJ1ZmZlcihrZXkpXG4gIGlmKCFCdWZmZXIuaXNCdWZmZXIoZGF0YSkpIGRhdGEgPSBuZXcgQnVmZmVyKGRhdGEpXG5cbiAgaWYoa2V5Lmxlbmd0aCA+IGJsb2Nrc2l6ZSkge1xuICAgIGtleSA9IGZuKGtleSlcbiAgfSBlbHNlIGlmKGtleS5sZW5ndGggPCBibG9ja3NpemUpIHtcbiAgICBrZXkgPSBCdWZmZXIuY29uY2F0KFtrZXksIHplcm9CdWZmZXJdLCBibG9ja3NpemUpXG4gIH1cblxuICB2YXIgaXBhZCA9IG5ldyBCdWZmZXIoYmxvY2tzaXplKSwgb3BhZCA9IG5ldyBCdWZmZXIoYmxvY2tzaXplKVxuICBmb3IodmFyIGkgPSAwOyBpIDwgYmxvY2tzaXplOyBpKyspIHtcbiAgICBpcGFkW2ldID0ga2V5W2ldIF4gMHgzNlxuICAgIG9wYWRbaV0gPSBrZXlbaV0gXiAweDVDXG4gIH1cblxuICB2YXIgaGFzaCA9IGZuKEJ1ZmZlci5jb25jYXQoW2lwYWQsIGRhdGFdKSlcbiAgcmV0dXJuIGZuKEJ1ZmZlci5jb25jYXQoW29wYWQsIGhhc2hdKSlcbn1cblxuZnVuY3Rpb24gaGFzaChhbGcsIGtleSkge1xuICBhbGcgPSBhbGcgfHwgJ3NoYTEnXG4gIHZhciBmbiA9IGFsZ29yaXRobXNbYWxnXVxuICB2YXIgYnVmcyA9IFtdXG4gIHZhciBsZW5ndGggPSAwXG4gIGlmKCFmbikgZXJyb3IoJ2FsZ29yaXRobTonLCBhbGcsICdpcyBub3QgeWV0IHN1cHBvcnRlZCcpXG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgaWYoIUJ1ZmZlci5pc0J1ZmZlcihkYXRhKSkgZGF0YSA9IG5ldyBCdWZmZXIoZGF0YSlcbiAgICAgICAgXG4gICAgICBidWZzLnB1c2goZGF0YSlcbiAgICAgIGxlbmd0aCArPSBkYXRhLmxlbmd0aFxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuICAgIGRpZ2VzdDogZnVuY3Rpb24gKGVuYykge1xuICAgICAgdmFyIGJ1ZiA9IEJ1ZmZlci5jb25jYXQoYnVmcylcbiAgICAgIHZhciByID0ga2V5ID8gaG1hYyhmbiwga2V5LCBidWYpIDogZm4oYnVmKVxuICAgICAgYnVmcyA9IG51bGxcbiAgICAgIHJldHVybiBlbmMgPyByLnRvU3RyaW5nKGVuYykgOiByXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGVycm9yICgpIHtcbiAgdmFyIG0gPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykuam9pbignICcpXG4gIHRocm93IG5ldyBFcnJvcihbXG4gICAgbSxcbiAgICAnd2UgYWNjZXB0IHB1bGwgcmVxdWVzdHMnLFxuICAgICdodHRwOi8vZ2l0aHViLmNvbS9kb21pbmljdGFyci9jcnlwdG8tYnJvd3NlcmlmeSdcbiAgICBdLmpvaW4oJ1xcbicpKVxufVxuXG5leHBvcnRzLmNyZWF0ZUhhc2ggPSBmdW5jdGlvbiAoYWxnKSB7IHJldHVybiBoYXNoKGFsZykgfVxuZXhwb3J0cy5jcmVhdGVIbWFjID0gZnVuY3Rpb24gKGFsZywga2V5KSB7IHJldHVybiBoYXNoKGFsZywga2V5KSB9XG5leHBvcnRzLnJhbmRvbUJ5dGVzID0gZnVuY3Rpb24oc2l6ZSwgY2FsbGJhY2spIHtcbiAgaWYgKGNhbGxiYWNrICYmIGNhbGxiYWNrLmNhbGwpIHtcbiAgICB0cnkge1xuICAgICAgY2FsbGJhY2suY2FsbCh0aGlzLCB1bmRlZmluZWQsIG5ldyBCdWZmZXIocm5nKHNpemUpKSlcbiAgICB9IGNhdGNoIChlcnIpIHsgY2FsbGJhY2soZXJyKSB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIocm5nKHNpemUpKVxuICB9XG59XG5cbmZ1bmN0aW9uIGVhY2goYSwgZikge1xuICBmb3IodmFyIGkgaW4gYSlcbiAgICBmKGFbaV0sIGkpXG59XG5cbi8vIHRoZSBsZWFzdCBJIGNhbiBkbyBpcyBtYWtlIGVycm9yIG1lc3NhZ2VzIGZvciB0aGUgcmVzdCBvZiB0aGUgbm9kZS5qcy9jcnlwdG8gYXBpLlxuZWFjaChbJ2NyZWF0ZUNyZWRlbnRpYWxzJ1xuLCAnY3JlYXRlQ2lwaGVyJ1xuLCAnY3JlYXRlQ2lwaGVyaXYnXG4sICdjcmVhdGVEZWNpcGhlcidcbiwgJ2NyZWF0ZURlY2lwaGVyaXYnXG4sICdjcmVhdGVTaWduJ1xuLCAnY3JlYXRlVmVyaWZ5J1xuLCAnY3JlYXRlRGlmZmllSGVsbG1hbidcbiwgJ3Bia2RmMiddLCBmdW5jdGlvbiAobmFtZSkge1xuICBleHBvcnRzW25hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgIGVycm9yKCdzb3JyeSwnLCBuYW1lLCAnaXMgbm90IGltcGxlbWVudGVkIHlldCcpXG4gIH1cbn0pXG4iLCIvKlxyXG4gKiBBIEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgdGhlIFJTQSBEYXRhIFNlY3VyaXR5LCBJbmMuIE1ENSBNZXNzYWdlXHJcbiAqIERpZ2VzdCBBbGdvcml0aG0sIGFzIGRlZmluZWQgaW4gUkZDIDEzMjEuXHJcbiAqIFZlcnNpb24gMi4xIENvcHlyaWdodCAoQykgUGF1bCBKb2huc3RvbiAxOTk5IC0gMjAwMi5cclxuICogT3RoZXIgY29udHJpYnV0b3JzOiBHcmVnIEhvbHQsIEFuZHJldyBLZXBlcnQsIFlkbmFyLCBMb3N0aW5ldFxyXG4gKiBEaXN0cmlidXRlZCB1bmRlciB0aGUgQlNEIExpY2Vuc2VcclxuICogU2VlIGh0dHA6Ly9wYWpob21lLm9yZy51ay9jcnlwdC9tZDUgZm9yIG1vcmUgaW5mby5cclxuICovXHJcblxyXG52YXIgaGVscGVycyA9IHJlcXVpcmUoJy4vaGVscGVycycpO1xyXG5cclxuLypcclxuICogUGVyZm9ybSBhIHNpbXBsZSBzZWxmLXRlc3QgdG8gc2VlIGlmIHRoZSBWTSBpcyB3b3JraW5nXHJcbiAqL1xyXG5mdW5jdGlvbiBtZDVfdm1fdGVzdCgpXHJcbntcclxuICByZXR1cm4gaGV4X21kNShcImFiY1wiKSA9PSBcIjkwMDE1MDk4M2NkMjRmYjBkNjk2M2Y3ZDI4ZTE3ZjcyXCI7XHJcbn1cclxuXHJcbi8qXHJcbiAqIENhbGN1bGF0ZSB0aGUgTUQ1IG9mIGFuIGFycmF5IG9mIGxpdHRsZS1lbmRpYW4gd29yZHMsIGFuZCBhIGJpdCBsZW5ndGhcclxuICovXHJcbmZ1bmN0aW9uIGNvcmVfbWQ1KHgsIGxlbilcclxue1xyXG4gIC8qIGFwcGVuZCBwYWRkaW5nICovXHJcbiAgeFtsZW4gPj4gNV0gfD0gMHg4MCA8PCAoKGxlbikgJSAzMik7XHJcbiAgeFsoKChsZW4gKyA2NCkgPj4+IDkpIDw8IDQpICsgMTRdID0gbGVuO1xyXG5cclxuICB2YXIgYSA9ICAxNzMyNTg0MTkzO1xyXG4gIHZhciBiID0gLTI3MTczMzg3OTtcclxuICB2YXIgYyA9IC0xNzMyNTg0MTk0O1xyXG4gIHZhciBkID0gIDI3MTczMzg3ODtcclxuXHJcbiAgZm9yKHZhciBpID0gMDsgaSA8IHgubGVuZ3RoOyBpICs9IDE2KVxyXG4gIHtcclxuICAgIHZhciBvbGRhID0gYTtcclxuICAgIHZhciBvbGRiID0gYjtcclxuICAgIHZhciBvbGRjID0gYztcclxuICAgIHZhciBvbGRkID0gZDtcclxuXHJcbiAgICBhID0gbWQ1X2ZmKGEsIGIsIGMsIGQsIHhbaSsgMF0sIDcgLCAtNjgwODc2OTM2KTtcclxuICAgIGQgPSBtZDVfZmYoZCwgYSwgYiwgYywgeFtpKyAxXSwgMTIsIC0zODk1NjQ1ODYpO1xyXG4gICAgYyA9IG1kNV9mZihjLCBkLCBhLCBiLCB4W2krIDJdLCAxNywgIDYwNjEwNTgxOSk7XHJcbiAgICBiID0gbWQ1X2ZmKGIsIGMsIGQsIGEsIHhbaSsgM10sIDIyLCAtMTA0NDUyNTMzMCk7XHJcbiAgICBhID0gbWQ1X2ZmKGEsIGIsIGMsIGQsIHhbaSsgNF0sIDcgLCAtMTc2NDE4ODk3KTtcclxuICAgIGQgPSBtZDVfZmYoZCwgYSwgYiwgYywgeFtpKyA1XSwgMTIsICAxMjAwMDgwNDI2KTtcclxuICAgIGMgPSBtZDVfZmYoYywgZCwgYSwgYiwgeFtpKyA2XSwgMTcsIC0xNDczMjMxMzQxKTtcclxuICAgIGIgPSBtZDVfZmYoYiwgYywgZCwgYSwgeFtpKyA3XSwgMjIsIC00NTcwNTk4Myk7XHJcbiAgICBhID0gbWQ1X2ZmKGEsIGIsIGMsIGQsIHhbaSsgOF0sIDcgLCAgMTc3MDAzNTQxNik7XHJcbiAgICBkID0gbWQ1X2ZmKGQsIGEsIGIsIGMsIHhbaSsgOV0sIDEyLCAtMTk1ODQxNDQxNyk7XHJcbiAgICBjID0gbWQ1X2ZmKGMsIGQsIGEsIGIsIHhbaSsxMF0sIDE3LCAtNDIwNjMpO1xyXG4gICAgYiA9IG1kNV9mZihiLCBjLCBkLCBhLCB4W2krMTFdLCAyMiwgLTE5OTA0MDQxNjIpO1xyXG4gICAgYSA9IG1kNV9mZihhLCBiLCBjLCBkLCB4W2krMTJdLCA3ICwgIDE4MDQ2MDM2ODIpO1xyXG4gICAgZCA9IG1kNV9mZihkLCBhLCBiLCBjLCB4W2krMTNdLCAxMiwgLTQwMzQxMTAxKTtcclxuICAgIGMgPSBtZDVfZmYoYywgZCwgYSwgYiwgeFtpKzE0XSwgMTcsIC0xNTAyMDAyMjkwKTtcclxuICAgIGIgPSBtZDVfZmYoYiwgYywgZCwgYSwgeFtpKzE1XSwgMjIsICAxMjM2NTM1MzI5KTtcclxuXHJcbiAgICBhID0gbWQ1X2dnKGEsIGIsIGMsIGQsIHhbaSsgMV0sIDUgLCAtMTY1Nzk2NTEwKTtcclxuICAgIGQgPSBtZDVfZ2coZCwgYSwgYiwgYywgeFtpKyA2XSwgOSAsIC0xMDY5NTAxNjMyKTtcclxuICAgIGMgPSBtZDVfZ2coYywgZCwgYSwgYiwgeFtpKzExXSwgMTQsICA2NDM3MTc3MTMpO1xyXG4gICAgYiA9IG1kNV9nZyhiLCBjLCBkLCBhLCB4W2krIDBdLCAyMCwgLTM3Mzg5NzMwMik7XHJcbiAgICBhID0gbWQ1X2dnKGEsIGIsIGMsIGQsIHhbaSsgNV0sIDUgLCAtNzAxNTU4NjkxKTtcclxuICAgIGQgPSBtZDVfZ2coZCwgYSwgYiwgYywgeFtpKzEwXSwgOSAsICAzODAxNjA4Myk7XHJcbiAgICBjID0gbWQ1X2dnKGMsIGQsIGEsIGIsIHhbaSsxNV0sIDE0LCAtNjYwNDc4MzM1KTtcclxuICAgIGIgPSBtZDVfZ2coYiwgYywgZCwgYSwgeFtpKyA0XSwgMjAsIC00MDU1Mzc4NDgpO1xyXG4gICAgYSA9IG1kNV9nZyhhLCBiLCBjLCBkLCB4W2krIDldLCA1ICwgIDU2ODQ0NjQzOCk7XHJcbiAgICBkID0gbWQ1X2dnKGQsIGEsIGIsIGMsIHhbaSsxNF0sIDkgLCAtMTAxOTgwMzY5MCk7XHJcbiAgICBjID0gbWQ1X2dnKGMsIGQsIGEsIGIsIHhbaSsgM10sIDE0LCAtMTg3MzYzOTYxKTtcclxuICAgIGIgPSBtZDVfZ2coYiwgYywgZCwgYSwgeFtpKyA4XSwgMjAsICAxMTYzNTMxNTAxKTtcclxuICAgIGEgPSBtZDVfZ2coYSwgYiwgYywgZCwgeFtpKzEzXSwgNSAsIC0xNDQ0NjgxNDY3KTtcclxuICAgIGQgPSBtZDVfZ2coZCwgYSwgYiwgYywgeFtpKyAyXSwgOSAsIC01MTQwMzc4NCk7XHJcbiAgICBjID0gbWQ1X2dnKGMsIGQsIGEsIGIsIHhbaSsgN10sIDE0LCAgMTczNTMyODQ3Myk7XHJcbiAgICBiID0gbWQ1X2dnKGIsIGMsIGQsIGEsIHhbaSsxMl0sIDIwLCAtMTkyNjYwNzczNCk7XHJcblxyXG4gICAgYSA9IG1kNV9oaChhLCBiLCBjLCBkLCB4W2krIDVdLCA0ICwgLTM3ODU1OCk7XHJcbiAgICBkID0gbWQ1X2hoKGQsIGEsIGIsIGMsIHhbaSsgOF0sIDExLCAtMjAyMjU3NDQ2Myk7XHJcbiAgICBjID0gbWQ1X2hoKGMsIGQsIGEsIGIsIHhbaSsxMV0sIDE2LCAgMTgzOTAzMDU2Mik7XHJcbiAgICBiID0gbWQ1X2hoKGIsIGMsIGQsIGEsIHhbaSsxNF0sIDIzLCAtMzUzMDk1NTYpO1xyXG4gICAgYSA9IG1kNV9oaChhLCBiLCBjLCBkLCB4W2krIDFdLCA0ICwgLTE1MzA5OTIwNjApO1xyXG4gICAgZCA9IG1kNV9oaChkLCBhLCBiLCBjLCB4W2krIDRdLCAxMSwgIDEyNzI4OTMzNTMpO1xyXG4gICAgYyA9IG1kNV9oaChjLCBkLCBhLCBiLCB4W2krIDddLCAxNiwgLTE1NTQ5NzYzMik7XHJcbiAgICBiID0gbWQ1X2hoKGIsIGMsIGQsIGEsIHhbaSsxMF0sIDIzLCAtMTA5NDczMDY0MCk7XHJcbiAgICBhID0gbWQ1X2hoKGEsIGIsIGMsIGQsIHhbaSsxM10sIDQgLCAgNjgxMjc5MTc0KTtcclxuICAgIGQgPSBtZDVfaGgoZCwgYSwgYiwgYywgeFtpKyAwXSwgMTEsIC0zNTg1MzcyMjIpO1xyXG4gICAgYyA9IG1kNV9oaChjLCBkLCBhLCBiLCB4W2krIDNdLCAxNiwgLTcyMjUyMTk3OSk7XHJcbiAgICBiID0gbWQ1X2hoKGIsIGMsIGQsIGEsIHhbaSsgNl0sIDIzLCAgNzYwMjkxODkpO1xyXG4gICAgYSA9IG1kNV9oaChhLCBiLCBjLCBkLCB4W2krIDldLCA0ICwgLTY0MDM2NDQ4Nyk7XHJcbiAgICBkID0gbWQ1X2hoKGQsIGEsIGIsIGMsIHhbaSsxMl0sIDExLCAtNDIxODE1ODM1KTtcclxuICAgIGMgPSBtZDVfaGgoYywgZCwgYSwgYiwgeFtpKzE1XSwgMTYsICA1MzA3NDI1MjApO1xyXG4gICAgYiA9IG1kNV9oaChiLCBjLCBkLCBhLCB4W2krIDJdLCAyMywgLTk5NTMzODY1MSk7XHJcblxyXG4gICAgYSA9IG1kNV9paShhLCBiLCBjLCBkLCB4W2krIDBdLCA2ICwgLTE5ODYzMDg0NCk7XHJcbiAgICBkID0gbWQ1X2lpKGQsIGEsIGIsIGMsIHhbaSsgN10sIDEwLCAgMTEyNjg5MTQxNSk7XHJcbiAgICBjID0gbWQ1X2lpKGMsIGQsIGEsIGIsIHhbaSsxNF0sIDE1LCAtMTQxNjM1NDkwNSk7XHJcbiAgICBiID0gbWQ1X2lpKGIsIGMsIGQsIGEsIHhbaSsgNV0sIDIxLCAtNTc0MzQwNTUpO1xyXG4gICAgYSA9IG1kNV9paShhLCBiLCBjLCBkLCB4W2krMTJdLCA2ICwgIDE3MDA0ODU1NzEpO1xyXG4gICAgZCA9IG1kNV9paShkLCBhLCBiLCBjLCB4W2krIDNdLCAxMCwgLTE4OTQ5ODY2MDYpO1xyXG4gICAgYyA9IG1kNV9paShjLCBkLCBhLCBiLCB4W2krMTBdLCAxNSwgLTEwNTE1MjMpO1xyXG4gICAgYiA9IG1kNV9paShiLCBjLCBkLCBhLCB4W2krIDFdLCAyMSwgLTIwNTQ5MjI3OTkpO1xyXG4gICAgYSA9IG1kNV9paShhLCBiLCBjLCBkLCB4W2krIDhdLCA2ICwgIDE4NzMzMTMzNTkpO1xyXG4gICAgZCA9IG1kNV9paShkLCBhLCBiLCBjLCB4W2krMTVdLCAxMCwgLTMwNjExNzQ0KTtcclxuICAgIGMgPSBtZDVfaWkoYywgZCwgYSwgYiwgeFtpKyA2XSwgMTUsIC0xNTYwMTk4MzgwKTtcclxuICAgIGIgPSBtZDVfaWkoYiwgYywgZCwgYSwgeFtpKzEzXSwgMjEsICAxMzA5MTUxNjQ5KTtcclxuICAgIGEgPSBtZDVfaWkoYSwgYiwgYywgZCwgeFtpKyA0XSwgNiAsIC0xNDU1MjMwNzApO1xyXG4gICAgZCA9IG1kNV9paShkLCBhLCBiLCBjLCB4W2krMTFdLCAxMCwgLTExMjAyMTAzNzkpO1xyXG4gICAgYyA9IG1kNV9paShjLCBkLCBhLCBiLCB4W2krIDJdLCAxNSwgIDcxODc4NzI1OSk7XHJcbiAgICBiID0gbWQ1X2lpKGIsIGMsIGQsIGEsIHhbaSsgOV0sIDIxLCAtMzQzNDg1NTUxKTtcclxuXHJcbiAgICBhID0gc2FmZV9hZGQoYSwgb2xkYSk7XHJcbiAgICBiID0gc2FmZV9hZGQoYiwgb2xkYik7XHJcbiAgICBjID0gc2FmZV9hZGQoYywgb2xkYyk7XHJcbiAgICBkID0gc2FmZV9hZGQoZCwgb2xkZCk7XHJcbiAgfVxyXG4gIHJldHVybiBBcnJheShhLCBiLCBjLCBkKTtcclxuXHJcbn1cclxuXHJcbi8qXHJcbiAqIFRoZXNlIGZ1bmN0aW9ucyBpbXBsZW1lbnQgdGhlIGZvdXIgYmFzaWMgb3BlcmF0aW9ucyB0aGUgYWxnb3JpdGhtIHVzZXMuXHJcbiAqL1xyXG5mdW5jdGlvbiBtZDVfY21uKHEsIGEsIGIsIHgsIHMsIHQpXHJcbntcclxuICByZXR1cm4gc2FmZV9hZGQoYml0X3JvbChzYWZlX2FkZChzYWZlX2FkZChhLCBxKSwgc2FmZV9hZGQoeCwgdCkpLCBzKSxiKTtcclxufVxyXG5mdW5jdGlvbiBtZDVfZmYoYSwgYiwgYywgZCwgeCwgcywgdClcclxue1xyXG4gIHJldHVybiBtZDVfY21uKChiICYgYykgfCAoKH5iKSAmIGQpLCBhLCBiLCB4LCBzLCB0KTtcclxufVxyXG5mdW5jdGlvbiBtZDVfZ2coYSwgYiwgYywgZCwgeCwgcywgdClcclxue1xyXG4gIHJldHVybiBtZDVfY21uKChiICYgZCkgfCAoYyAmICh+ZCkpLCBhLCBiLCB4LCBzLCB0KTtcclxufVxyXG5mdW5jdGlvbiBtZDVfaGgoYSwgYiwgYywgZCwgeCwgcywgdClcclxue1xyXG4gIHJldHVybiBtZDVfY21uKGIgXiBjIF4gZCwgYSwgYiwgeCwgcywgdCk7XHJcbn1cclxuZnVuY3Rpb24gbWQ1X2lpKGEsIGIsIGMsIGQsIHgsIHMsIHQpXHJcbntcclxuICByZXR1cm4gbWQ1X2NtbihjIF4gKGIgfCAofmQpKSwgYSwgYiwgeCwgcywgdCk7XHJcbn1cclxuXHJcbi8qXHJcbiAqIEFkZCBpbnRlZ2Vycywgd3JhcHBpbmcgYXQgMl4zMi4gVGhpcyB1c2VzIDE2LWJpdCBvcGVyYXRpb25zIGludGVybmFsbHlcclxuICogdG8gd29yayBhcm91bmQgYnVncyBpbiBzb21lIEpTIGludGVycHJldGVycy5cclxuICovXHJcbmZ1bmN0aW9uIHNhZmVfYWRkKHgsIHkpXHJcbntcclxuICB2YXIgbHN3ID0gKHggJiAweEZGRkYpICsgKHkgJiAweEZGRkYpO1xyXG4gIHZhciBtc3cgPSAoeCA+PiAxNikgKyAoeSA+PiAxNikgKyAobHN3ID4+IDE2KTtcclxuICByZXR1cm4gKG1zdyA8PCAxNikgfCAobHN3ICYgMHhGRkZGKTtcclxufVxyXG5cclxuLypcclxuICogQml0d2lzZSByb3RhdGUgYSAzMi1iaXQgbnVtYmVyIHRvIHRoZSBsZWZ0LlxyXG4gKi9cclxuZnVuY3Rpb24gYml0X3JvbChudW0sIGNudClcclxue1xyXG4gIHJldHVybiAobnVtIDw8IGNudCkgfCAobnVtID4+PiAoMzIgLSBjbnQpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtZDUoYnVmKSB7XHJcbiAgcmV0dXJuIGhlbHBlcnMuaGFzaChidWYsIGNvcmVfbWQ1LCAxNik7XHJcbn07XHJcbiIsIi8vIE9yaWdpbmFsIGNvZGUgYWRhcHRlZCBmcm9tIFJvYmVydCBLaWVmZmVyLlxuLy8gZGV0YWlscyBhdCBodHRwczovL2dpdGh1Yi5jb20vYnJvb2ZhL25vZGUtdXVpZFxuKGZ1bmN0aW9uKCkge1xuICB2YXIgX2dsb2JhbCA9IHRoaXM7XG5cbiAgdmFyIG1hdGhSTkcsIHdoYXR3Z1JORztcblxuICAvLyBOT1RFOiBNYXRoLnJhbmRvbSgpIGRvZXMgbm90IGd1YXJhbnRlZSBcImNyeXB0b2dyYXBoaWMgcXVhbGl0eVwiXG4gIG1hdGhSTkcgPSBmdW5jdGlvbihzaXplKSB7XG4gICAgdmFyIGJ5dGVzID0gbmV3IEFycmF5KHNpemUpO1xuICAgIHZhciByO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIHI7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGlmICgoaSAmIDB4MDMpID09IDApIHIgPSBNYXRoLnJhbmRvbSgpICogMHgxMDAwMDAwMDA7XG4gICAgICBieXRlc1tpXSA9IHIgPj4+ICgoaSAmIDB4MDMpIDw8IDMpICYgMHhmZjtcbiAgICB9XG5cbiAgICByZXR1cm4gYnl0ZXM7XG4gIH1cblxuICBpZiAoX2dsb2JhbC5jcnlwdG8gJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcykge1xuICAgIHdoYXR3Z1JORyA9IGZ1bmN0aW9uKHNpemUpIHtcbiAgICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KHNpemUpO1xuICAgICAgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhieXRlcyk7XG4gICAgICByZXR1cm4gYnl0ZXM7XG4gICAgfVxuICB9XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSB3aGF0d2dSTkcgfHwgbWF0aFJORztcblxufSgpKVxuIiwiLypcbiAqIEEgSmF2YVNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgU2VjdXJlIEhhc2ggQWxnb3JpdGhtLCBTSEEtMSwgYXMgZGVmaW5lZFxuICogaW4gRklQUyBQVUIgMTgwLTFcbiAqIFZlcnNpb24gMi4xYSBDb3B5cmlnaHQgUGF1bCBKb2huc3RvbiAyMDAwIC0gMjAwMi5cbiAqIE90aGVyIGNvbnRyaWJ1dG9yczogR3JlZyBIb2x0LCBBbmRyZXcgS2VwZXJ0LCBZZG5hciwgTG9zdGluZXRcbiAqIERpc3RyaWJ1dGVkIHVuZGVyIHRoZSBCU0QgTGljZW5zZVxuICogU2VlIGh0dHA6Ly9wYWpob21lLm9yZy51ay9jcnlwdC9tZDUgZm9yIGRldGFpbHMuXG4gKi9cblxudmFyIGhlbHBlcnMgPSByZXF1aXJlKCcuL2hlbHBlcnMnKTtcblxuLypcbiAqIENhbGN1bGF0ZSB0aGUgU0hBLTEgb2YgYW4gYXJyYXkgb2YgYmlnLWVuZGlhbiB3b3JkcywgYW5kIGEgYml0IGxlbmd0aFxuICovXG5mdW5jdGlvbiBjb3JlX3NoYTEoeCwgbGVuKVxue1xuICAvKiBhcHBlbmQgcGFkZGluZyAqL1xuICB4W2xlbiA+PiA1XSB8PSAweDgwIDw8ICgyNCAtIGxlbiAlIDMyKTtcbiAgeFsoKGxlbiArIDY0ID4+IDkpIDw8IDQpICsgMTVdID0gbGVuO1xuXG4gIHZhciB3ID0gQXJyYXkoODApO1xuICB2YXIgYSA9ICAxNzMyNTg0MTkzO1xuICB2YXIgYiA9IC0yNzE3MzM4Nzk7XG4gIHZhciBjID0gLTE3MzI1ODQxOTQ7XG4gIHZhciBkID0gIDI3MTczMzg3ODtcbiAgdmFyIGUgPSAtMTAwOTU4OTc3NjtcblxuICBmb3IodmFyIGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkgKz0gMTYpXG4gIHtcbiAgICB2YXIgb2xkYSA9IGE7XG4gICAgdmFyIG9sZGIgPSBiO1xuICAgIHZhciBvbGRjID0gYztcbiAgICB2YXIgb2xkZCA9IGQ7XG4gICAgdmFyIG9sZGUgPSBlO1xuXG4gICAgZm9yKHZhciBqID0gMDsgaiA8IDgwOyBqKyspXG4gICAge1xuICAgICAgaWYoaiA8IDE2KSB3W2pdID0geFtpICsgal07XG4gICAgICBlbHNlIHdbal0gPSByb2wod1tqLTNdIF4gd1tqLThdIF4gd1tqLTE0XSBeIHdbai0xNl0sIDEpO1xuICAgICAgdmFyIHQgPSBzYWZlX2FkZChzYWZlX2FkZChyb2woYSwgNSksIHNoYTFfZnQoaiwgYiwgYywgZCkpLFxuICAgICAgICAgICAgICAgICAgICAgICBzYWZlX2FkZChzYWZlX2FkZChlLCB3W2pdKSwgc2hhMV9rdChqKSkpO1xuICAgICAgZSA9IGQ7XG4gICAgICBkID0gYztcbiAgICAgIGMgPSByb2woYiwgMzApO1xuICAgICAgYiA9IGE7XG4gICAgICBhID0gdDtcbiAgICB9XG5cbiAgICBhID0gc2FmZV9hZGQoYSwgb2xkYSk7XG4gICAgYiA9IHNhZmVfYWRkKGIsIG9sZGIpO1xuICAgIGMgPSBzYWZlX2FkZChjLCBvbGRjKTtcbiAgICBkID0gc2FmZV9hZGQoZCwgb2xkZCk7XG4gICAgZSA9IHNhZmVfYWRkKGUsIG9sZGUpO1xuICB9XG4gIHJldHVybiBBcnJheShhLCBiLCBjLCBkLCBlKTtcblxufVxuXG4vKlxuICogUGVyZm9ybSB0aGUgYXBwcm9wcmlhdGUgdHJpcGxldCBjb21iaW5hdGlvbiBmdW5jdGlvbiBmb3IgdGhlIGN1cnJlbnRcbiAqIGl0ZXJhdGlvblxuICovXG5mdW5jdGlvbiBzaGExX2Z0KHQsIGIsIGMsIGQpXG57XG4gIGlmKHQgPCAyMCkgcmV0dXJuIChiICYgYykgfCAoKH5iKSAmIGQpO1xuICBpZih0IDwgNDApIHJldHVybiBiIF4gYyBeIGQ7XG4gIGlmKHQgPCA2MCkgcmV0dXJuIChiICYgYykgfCAoYiAmIGQpIHwgKGMgJiBkKTtcbiAgcmV0dXJuIGIgXiBjIF4gZDtcbn1cblxuLypcbiAqIERldGVybWluZSB0aGUgYXBwcm9wcmlhdGUgYWRkaXRpdmUgY29uc3RhbnQgZm9yIHRoZSBjdXJyZW50IGl0ZXJhdGlvblxuICovXG5mdW5jdGlvbiBzaGExX2t0KHQpXG57XG4gIHJldHVybiAodCA8IDIwKSA/ICAxNTE4NTAwMjQ5IDogKHQgPCA0MCkgPyAgMTg1OTc3NTM5MyA6XG4gICAgICAgICAodCA8IDYwKSA/IC0xODk0MDA3NTg4IDogLTg5OTQ5NzUxNDtcbn1cblxuLypcbiAqIEFkZCBpbnRlZ2Vycywgd3JhcHBpbmcgYXQgMl4zMi4gVGhpcyB1c2VzIDE2LWJpdCBvcGVyYXRpb25zIGludGVybmFsbHlcbiAqIHRvIHdvcmsgYXJvdW5kIGJ1Z3MgaW4gc29tZSBKUyBpbnRlcnByZXRlcnMuXG4gKi9cbmZ1bmN0aW9uIHNhZmVfYWRkKHgsIHkpXG57XG4gIHZhciBsc3cgPSAoeCAmIDB4RkZGRikgKyAoeSAmIDB4RkZGRik7XG4gIHZhciBtc3cgPSAoeCA+PiAxNikgKyAoeSA+PiAxNikgKyAobHN3ID4+IDE2KTtcbiAgcmV0dXJuIChtc3cgPDwgMTYpIHwgKGxzdyAmIDB4RkZGRik7XG59XG5cbi8qXG4gKiBCaXR3aXNlIHJvdGF0ZSBhIDMyLWJpdCBudW1iZXIgdG8gdGhlIGxlZnQuXG4gKi9cbmZ1bmN0aW9uIHJvbChudW0sIGNudClcbntcbiAgcmV0dXJuIChudW0gPDwgY250KSB8IChudW0gPj4+ICgzMiAtIGNudCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNoYTEoYnVmKSB7XG4gIHJldHVybiBoZWxwZXJzLmhhc2goYnVmLCBjb3JlX3NoYTEsIDIwLCB0cnVlKTtcbn07XG4iLCJcbi8qKlxuICogQSBKYXZhU2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHRoZSBTZWN1cmUgSGFzaCBBbGdvcml0aG0sIFNIQS0yNTYsIGFzIGRlZmluZWRcbiAqIGluIEZJUFMgMTgwLTJcbiAqIFZlcnNpb24gMi4yLWJldGEgQ29weXJpZ2h0IEFuZ2VsIE1hcmluLCBQYXVsIEpvaG5zdG9uIDIwMDAgLSAyMDA5LlxuICogT3RoZXIgY29udHJpYnV0b3JzOiBHcmVnIEhvbHQsIEFuZHJldyBLZXBlcnQsIFlkbmFyLCBMb3N0aW5ldFxuICpcbiAqL1xuXG52YXIgaGVscGVycyA9IHJlcXVpcmUoJy4vaGVscGVycycpO1xuXG52YXIgc2FmZV9hZGQgPSBmdW5jdGlvbih4LCB5KSB7XG4gIHZhciBsc3cgPSAoeCAmIDB4RkZGRikgKyAoeSAmIDB4RkZGRik7XG4gIHZhciBtc3cgPSAoeCA+PiAxNikgKyAoeSA+PiAxNikgKyAobHN3ID4+IDE2KTtcbiAgcmV0dXJuIChtc3cgPDwgMTYpIHwgKGxzdyAmIDB4RkZGRik7XG59O1xuXG52YXIgUyA9IGZ1bmN0aW9uKFgsIG4pIHtcbiAgcmV0dXJuIChYID4+PiBuKSB8IChYIDw8ICgzMiAtIG4pKTtcbn07XG5cbnZhciBSID0gZnVuY3Rpb24oWCwgbikge1xuICByZXR1cm4gKFggPj4+IG4pO1xufTtcblxudmFyIENoID0gZnVuY3Rpb24oeCwgeSwgeikge1xuICByZXR1cm4gKCh4ICYgeSkgXiAoKH54KSAmIHopKTtcbn07XG5cbnZhciBNYWogPSBmdW5jdGlvbih4LCB5LCB6KSB7XG4gIHJldHVybiAoKHggJiB5KSBeICh4ICYgeikgXiAoeSAmIHopKTtcbn07XG5cbnZhciBTaWdtYTAyNTYgPSBmdW5jdGlvbih4KSB7XG4gIHJldHVybiAoUyh4LCAyKSBeIFMoeCwgMTMpIF4gUyh4LCAyMikpO1xufTtcblxudmFyIFNpZ21hMTI1NiA9IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIChTKHgsIDYpIF4gUyh4LCAxMSkgXiBTKHgsIDI1KSk7XG59O1xuXG52YXIgR2FtbWEwMjU2ID0gZnVuY3Rpb24oeCkge1xuICByZXR1cm4gKFMoeCwgNykgXiBTKHgsIDE4KSBeIFIoeCwgMykpO1xufTtcblxudmFyIEdhbW1hMTI1NiA9IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIChTKHgsIDE3KSBeIFMoeCwgMTkpIF4gUih4LCAxMCkpO1xufTtcblxudmFyIGNvcmVfc2hhMjU2ID0gZnVuY3Rpb24obSwgbCkge1xuICB2YXIgSyA9IG5ldyBBcnJheSgweDQyOEEyRjk4LDB4NzEzNzQ0OTEsMHhCNUMwRkJDRiwweEU5QjVEQkE1LDB4Mzk1NkMyNUIsMHg1OUYxMTFGMSwweDkyM0Y4MkE0LDB4QUIxQzVFRDUsMHhEODA3QUE5OCwweDEyODM1QjAxLDB4MjQzMTg1QkUsMHg1NTBDN0RDMywweDcyQkU1RDc0LDB4ODBERUIxRkUsMHg5QkRDMDZBNywweEMxOUJGMTc0LDB4RTQ5QjY5QzEsMHhFRkJFNDc4NiwweEZDMTlEQzYsMHgyNDBDQTFDQywweDJERTkyQzZGLDB4NEE3NDg0QUEsMHg1Q0IwQTlEQywweDc2Rjk4OERBLDB4OTgzRTUxNTIsMHhBODMxQzY2RCwweEIwMDMyN0M4LDB4QkY1OTdGQzcsMHhDNkUwMEJGMywweEQ1QTc5MTQ3LDB4NkNBNjM1MSwweDE0MjkyOTY3LDB4MjdCNzBBODUsMHgyRTFCMjEzOCwweDREMkM2REZDLDB4NTMzODBEMTMsMHg2NTBBNzM1NCwweDc2NkEwQUJCLDB4ODFDMkM5MkUsMHg5MjcyMkM4NSwweEEyQkZFOEExLDB4QTgxQTY2NEIsMHhDMjRCOEI3MCwweEM3NkM1MUEzLDB4RDE5MkU4MTksMHhENjk5MDYyNCwweEY0MEUzNTg1LDB4MTA2QUEwNzAsMHgxOUE0QzExNiwweDFFMzc2QzA4LDB4Mjc0ODc3NEMsMHgzNEIwQkNCNSwweDM5MUMwQ0IzLDB4NEVEOEFBNEEsMHg1QjlDQ0E0RiwweDY4MkU2RkYzLDB4NzQ4RjgyRUUsMHg3OEE1NjM2RiwweDg0Qzg3ODE0LDB4OENDNzAyMDgsMHg5MEJFRkZGQSwweEE0NTA2Q0VCLDB4QkVGOUEzRjcsMHhDNjcxNzhGMik7XG4gIHZhciBIQVNIID0gbmV3IEFycmF5KDB4NkEwOUU2NjcsIDB4QkI2N0FFODUsIDB4M0M2RUYzNzIsIDB4QTU0RkY1M0EsIDB4NTEwRTUyN0YsIDB4OUIwNTY4OEMsIDB4MUY4M0Q5QUIsIDB4NUJFMENEMTkpO1xuICAgIHZhciBXID0gbmV3IEFycmF5KDY0KTtcbiAgICB2YXIgYSwgYiwgYywgZCwgZSwgZiwgZywgaCwgaSwgajtcbiAgICB2YXIgVDEsIFQyO1xuICAvKiBhcHBlbmQgcGFkZGluZyAqL1xuICBtW2wgPj4gNV0gfD0gMHg4MCA8PCAoMjQgLSBsICUgMzIpO1xuICBtWygobCArIDY0ID4+IDkpIDw8IDQpICsgMTVdID0gbDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBtLmxlbmd0aDsgaSArPSAxNikge1xuICAgIGEgPSBIQVNIWzBdOyBiID0gSEFTSFsxXTsgYyA9IEhBU0hbMl07IGQgPSBIQVNIWzNdOyBlID0gSEFTSFs0XTsgZiA9IEhBU0hbNV07IGcgPSBIQVNIWzZdOyBoID0gSEFTSFs3XTtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IDY0OyBqKyspIHtcbiAgICAgIGlmIChqIDwgMTYpIHtcbiAgICAgICAgV1tqXSA9IG1baiArIGldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgV1tqXSA9IHNhZmVfYWRkKHNhZmVfYWRkKHNhZmVfYWRkKEdhbW1hMTI1NihXW2ogLSAyXSksIFdbaiAtIDddKSwgR2FtbWEwMjU2KFdbaiAtIDE1XSkpLCBXW2ogLSAxNl0pO1xuICAgICAgfVxuICAgICAgVDEgPSBzYWZlX2FkZChzYWZlX2FkZChzYWZlX2FkZChzYWZlX2FkZChoLCBTaWdtYTEyNTYoZSkpLCBDaChlLCBmLCBnKSksIEtbal0pLCBXW2pdKTtcbiAgICAgIFQyID0gc2FmZV9hZGQoU2lnbWEwMjU2KGEpLCBNYWooYSwgYiwgYykpO1xuICAgICAgaCA9IGc7IGcgPSBmOyBmID0gZTsgZSA9IHNhZmVfYWRkKGQsIFQxKTsgZCA9IGM7IGMgPSBiOyBiID0gYTsgYSA9IHNhZmVfYWRkKFQxLCBUMik7XG4gICAgfVxuICAgIEhBU0hbMF0gPSBzYWZlX2FkZChhLCBIQVNIWzBdKTsgSEFTSFsxXSA9IHNhZmVfYWRkKGIsIEhBU0hbMV0pOyBIQVNIWzJdID0gc2FmZV9hZGQoYywgSEFTSFsyXSk7IEhBU0hbM10gPSBzYWZlX2FkZChkLCBIQVNIWzNdKTtcbiAgICBIQVNIWzRdID0gc2FmZV9hZGQoZSwgSEFTSFs0XSk7IEhBU0hbNV0gPSBzYWZlX2FkZChmLCBIQVNIWzVdKTsgSEFTSFs2XSA9IHNhZmVfYWRkKGcsIEhBU0hbNl0pOyBIQVNIWzddID0gc2FmZV9hZGQoaCwgSEFTSFs3XSk7XG4gIH1cbiAgcmV0dXJuIEhBU0g7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNoYTI1NihidWYpIHtcbiAgcmV0dXJuIGhlbHBlcnMuaGFzaChidWYsIGNvcmVfc2hhMjU2LCAzMiwgdHJ1ZSk7XG59O1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBldi5zb3VyY2U7XG4gICAgICAgICAgICBpZiAoKHNvdXJjZSA9PT0gd2luZG93IHx8IHNvdXJjZSA9PT0gbnVsbCkgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbiIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwpe1xuKGZ1bmN0aW9uKGdsb2JhbCkge1xuICAndXNlIHN0cmljdCc7XG4gIGlmIChnbG9iYWwuJHRyYWNldXJSdW50aW1lKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciAkT2JqZWN0ID0gT2JqZWN0O1xuICB2YXIgJFR5cGVFcnJvciA9IFR5cGVFcnJvcjtcbiAgdmFyICRjcmVhdGUgPSAkT2JqZWN0LmNyZWF0ZTtcbiAgdmFyICRkZWZpbmVQcm9wZXJ0aWVzID0gJE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzO1xuICB2YXIgJGRlZmluZVByb3BlcnR5ID0gJE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbiAgdmFyICRmcmVlemUgPSAkT2JqZWN0LmZyZWV6ZTtcbiAgdmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSAkT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgdmFyICRnZXRPd25Qcm9wZXJ0eU5hbWVzID0gJE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzO1xuICB2YXIgJGdldFByb3RvdHlwZU9mID0gJE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgdmFyICRoYXNPd25Qcm9wZXJ0eSA9ICRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICB2YXIgJHRvU3RyaW5nID0gJE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG4gIGZ1bmN0aW9uIG5vbkVudW0odmFsdWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH07XG4gIH1cbiAgdmFyIHR5cGVzID0ge1xuICAgIHZvaWQ6IGZ1bmN0aW9uIHZvaWRUeXBlKCkge30sXG4gICAgYW55OiBmdW5jdGlvbiBhbnkoKSB7fSxcbiAgICBzdHJpbmc6IGZ1bmN0aW9uIHN0cmluZygpIHt9LFxuICAgIG51bWJlcjogZnVuY3Rpb24gbnVtYmVyKCkge30sXG4gICAgYm9vbGVhbjogZnVuY3Rpb24gYm9vbGVhbigpIHt9XG4gIH07XG4gIHZhciBtZXRob2QgPSBub25FbnVtO1xuICB2YXIgY291bnRlciA9IDA7XG4gIGZ1bmN0aW9uIG5ld1VuaXF1ZVN0cmluZygpIHtcbiAgICByZXR1cm4gJ19fJCcgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxZTkpICsgJyQnICsgKytjb3VudGVyICsgJyRfXyc7XG4gIH1cbiAgdmFyIHN5bWJvbEludGVybmFsUHJvcGVydHkgPSBuZXdVbmlxdWVTdHJpbmcoKTtcbiAgdmFyIHN5bWJvbERlc2NyaXB0aW9uUHJvcGVydHkgPSBuZXdVbmlxdWVTdHJpbmcoKTtcbiAgdmFyIHN5bWJvbERhdGFQcm9wZXJ0eSA9IG5ld1VuaXF1ZVN0cmluZygpO1xuICB2YXIgc3ltYm9sVmFsdWVzID0gJGNyZWF0ZShudWxsKTtcbiAgZnVuY3Rpb24gaXNTeW1ib2woc3ltYm9sKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBzeW1ib2wgPT09ICdvYmplY3QnICYmIHN5bWJvbCBpbnN0YW5jZW9mIFN5bWJvbFZhbHVlO1xuICB9XG4gIGZ1bmN0aW9uIHR5cGVPZih2KSB7XG4gICAgaWYgKGlzU3ltYm9sKHYpKVxuICAgICAgcmV0dXJuICdzeW1ib2wnO1xuICAgIHJldHVybiB0eXBlb2YgdjtcbiAgfVxuICBmdW5jdGlvbiBTeW1ib2woZGVzY3JpcHRpb24pIHtcbiAgICB2YXIgdmFsdWUgPSBuZXcgU3ltYm9sVmFsdWUoZGVzY3JpcHRpb24pO1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTeW1ib2wpKVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1N5bWJvbCBjYW5ub3QgYmUgbmV3XFwnZWQnKTtcbiAgfVxuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sLnByb3RvdHlwZSwgJ2NvbnN0cnVjdG9yJywgbm9uRW51bShTeW1ib2wpKTtcbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbC5wcm90b3R5cGUsICd0b1N0cmluZycsIG1ldGhvZChmdW5jdGlvbigpIHtcbiAgICB2YXIgc3ltYm9sVmFsdWUgPSB0aGlzW3N5bWJvbERhdGFQcm9wZXJ0eV07XG4gICAgaWYgKCFnZXRPcHRpb24oJ3N5bWJvbHMnKSlcbiAgICAgIHJldHVybiBzeW1ib2xWYWx1ZVtzeW1ib2xJbnRlcm5hbFByb3BlcnR5XTtcbiAgICBpZiAoIXN5bWJvbFZhbHVlKVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdDb252ZXJzaW9uIGZyb20gc3ltYm9sIHRvIHN0cmluZycpO1xuICAgIHZhciBkZXNjID0gc3ltYm9sVmFsdWVbc3ltYm9sRGVzY3JpcHRpb25Qcm9wZXJ0eV07XG4gICAgaWYgKGRlc2MgPT09IHVuZGVmaW5lZClcbiAgICAgIGRlc2MgPSAnJztcbiAgICByZXR1cm4gJ1N5bWJvbCgnICsgZGVzYyArICcpJztcbiAgfSkpO1xuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sLnByb3RvdHlwZSwgJ3ZhbHVlT2YnLCBtZXRob2QoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN5bWJvbFZhbHVlID0gdGhpc1tzeW1ib2xEYXRhUHJvcGVydHldO1xuICAgIGlmICghc3ltYm9sVmFsdWUpXG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ0NvbnZlcnNpb24gZnJvbSBzeW1ib2wgdG8gc3RyaW5nJyk7XG4gICAgaWYgKCFnZXRPcHRpb24oJ3N5bWJvbHMnKSlcbiAgICAgIHJldHVybiBzeW1ib2xWYWx1ZVtzeW1ib2xJbnRlcm5hbFByb3BlcnR5XTtcbiAgICByZXR1cm4gc3ltYm9sVmFsdWU7XG4gIH0pKTtcbiAgZnVuY3Rpb24gU3ltYm9sVmFsdWUoZGVzY3JpcHRpb24pIHtcbiAgICB2YXIga2V5ID0gbmV3VW5pcXVlU3RyaW5nKCk7XG4gICAgJGRlZmluZVByb3BlcnR5KHRoaXMsIHN5bWJvbERhdGFQcm9wZXJ0eSwge3ZhbHVlOiB0aGlzfSk7XG4gICAgJGRlZmluZVByb3BlcnR5KHRoaXMsIHN5bWJvbEludGVybmFsUHJvcGVydHksIHt2YWx1ZToga2V5fSk7XG4gICAgJGRlZmluZVByb3BlcnR5KHRoaXMsIHN5bWJvbERlc2NyaXB0aW9uUHJvcGVydHksIHt2YWx1ZTogZGVzY3JpcHRpb259KTtcbiAgICAkZnJlZXplKHRoaXMpO1xuICAgIHN5bWJvbFZhbHVlc1trZXldID0gdGhpcztcbiAgfVxuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sVmFsdWUucHJvdG90eXBlLCAnY29uc3RydWN0b3InLCBub25FbnVtKFN5bWJvbCkpO1xuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sVmFsdWUucHJvdG90eXBlLCAndG9TdHJpbmcnLCB7XG4gICAgdmFsdWU6IFN5bWJvbC5wcm90b3R5cGUudG9TdHJpbmcsXG4gICAgZW51bWVyYWJsZTogZmFsc2VcbiAgfSk7XG4gICRkZWZpbmVQcm9wZXJ0eShTeW1ib2xWYWx1ZS5wcm90b3R5cGUsICd2YWx1ZU9mJywge1xuICAgIHZhbHVlOiBTeW1ib2wucHJvdG90eXBlLnZhbHVlT2YsXG4gICAgZW51bWVyYWJsZTogZmFsc2VcbiAgfSk7XG4gICRmcmVlemUoU3ltYm9sVmFsdWUucHJvdG90eXBlKTtcbiAgU3ltYm9sLml0ZXJhdG9yID0gU3ltYm9sKCk7XG4gIGZ1bmN0aW9uIHRvUHJvcGVydHkobmFtZSkge1xuICAgIGlmIChpc1N5bWJvbChuYW1lKSlcbiAgICAgIHJldHVybiBuYW1lW3N5bWJvbEludGVybmFsUHJvcGVydHldO1xuICAgIHJldHVybiBuYW1lO1xuICB9XG4gIGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMob2JqZWN0KSB7XG4gICAgdmFyIHJ2ID0gW107XG4gICAgdmFyIG5hbWVzID0gJGdldE93blByb3BlcnR5TmFtZXMob2JqZWN0KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbmFtZSA9IG5hbWVzW2ldO1xuICAgICAgaWYgKCFzeW1ib2xWYWx1ZXNbbmFtZV0pXG4gICAgICAgIHJ2LnB1c2gobmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBydjtcbiAgfVxuICBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBuYW1lKSB7XG4gICAgcmV0dXJuICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCB0b1Byb3BlcnR5KG5hbWUpKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqZWN0KSB7XG4gICAgdmFyIHJ2ID0gW107XG4gICAgdmFyIG5hbWVzID0gJGdldE93blByb3BlcnR5TmFtZXMob2JqZWN0KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc3ltYm9sID0gc3ltYm9sVmFsdWVzW25hbWVzW2ldXTtcbiAgICAgIGlmIChzeW1ib2wpXG4gICAgICAgIHJ2LnB1c2goc3ltYm9sKTtcbiAgICB9XG4gICAgcmV0dXJuIHJ2O1xuICB9XG4gIGZ1bmN0aW9uIGhhc093blByb3BlcnR5KG5hbWUpIHtcbiAgICByZXR1cm4gJGhhc093blByb3BlcnR5LmNhbGwodGhpcywgdG9Qcm9wZXJ0eShuYW1lKSk7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0T3B0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gZ2xvYmFsLnRyYWNldXIgJiYgZ2xvYmFsLnRyYWNldXIub3B0aW9uc1tuYW1lXTtcbiAgfVxuICBmdW5jdGlvbiBzZXRQcm9wZXJ0eShvYmplY3QsIG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIHN5bSxcbiAgICAgICAgZGVzYztcbiAgICBpZiAoaXNTeW1ib2wobmFtZSkpIHtcbiAgICAgIHN5bSA9IG5hbWU7XG4gICAgICBuYW1lID0gbmFtZVtzeW1ib2xJbnRlcm5hbFByb3BlcnR5XTtcbiAgICB9XG4gICAgb2JqZWN0W25hbWVdID0gdmFsdWU7XG4gICAgaWYgKHN5bSAmJiAoZGVzYyA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBuYW1lKSkpXG4gICAgICAkZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCB7ZW51bWVyYWJsZTogZmFsc2V9KTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCBkZXNjcmlwdG9yKSB7XG4gICAgaWYgKGlzU3ltYm9sKG5hbWUpKSB7XG4gICAgICBpZiAoZGVzY3JpcHRvci5lbnVtZXJhYmxlKSB7XG4gICAgICAgIGRlc2NyaXB0b3IgPSAkY3JlYXRlKGRlc2NyaXB0b3IsIHtlbnVtZXJhYmxlOiB7dmFsdWU6IGZhbHNlfX0pO1xuICAgICAgfVxuICAgICAgbmFtZSA9IG5hbWVbc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eV07XG4gICAgfVxuICAgICRkZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIGRlc2NyaXB0b3IpO1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cbiAgZnVuY3Rpb24gcG9seWZpbGxPYmplY3QoT2JqZWN0KSB7XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ2RlZmluZVByb3BlcnR5Jywge3ZhbHVlOiBkZWZpbmVQcm9wZXJ0eX0pO1xuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdnZXRPd25Qcm9wZXJ0eU5hbWVzJywge3ZhbHVlOiBnZXRPd25Qcm9wZXJ0eU5hbWVzfSk7XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ2dldE93blByb3BlcnR5RGVzY3JpcHRvcicsIHt2YWx1ZTogZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yfSk7XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdC5wcm90b3R5cGUsICdoYXNPd25Qcm9wZXJ0eScsIHt2YWx1ZTogaGFzT3duUHJvcGVydHl9KTtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuICAgIGZ1bmN0aW9uIGlzKGxlZnQsIHJpZ2h0KSB7XG4gICAgICBpZiAobGVmdCA9PT0gcmlnaHQpXG4gICAgICAgIHJldHVybiBsZWZ0ICE9PSAwIHx8IDEgLyBsZWZ0ID09PSAxIC8gcmlnaHQ7XG4gICAgICByZXR1cm4gbGVmdCAhPT0gbGVmdCAmJiByaWdodCAhPT0gcmlnaHQ7XG4gICAgfVxuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdpcycsIG1ldGhvZChpcykpO1xuICAgIGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSkge1xuICAgICAgdmFyIHByb3BzID0gJGdldE93blByb3BlcnR5TmFtZXMoc291cmNlKTtcbiAgICAgIHZhciBwLFxuICAgICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcbiAgICAgIGZvciAocCA9IDA7IHAgPCBsZW5ndGg7IHArKykge1xuICAgICAgICB0YXJnZXRbcHJvcHNbcF1dID0gc291cmNlW3Byb3BzW3BdXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdhc3NpZ24nLCBtZXRob2QoYXNzaWduKSk7XG4gICAgZnVuY3Rpb24gbWl4aW4odGFyZ2V0LCBzb3VyY2UpIHtcbiAgICAgIHZhciBwcm9wcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZSk7XG4gICAgICB2YXIgcCxcbiAgICAgICAgICBkZXNjcmlwdG9yLFxuICAgICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcbiAgICAgIGZvciAocCA9IDA7IHAgPCBsZW5ndGg7IHArKykge1xuICAgICAgICBkZXNjcmlwdG9yID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIHByb3BzW3BdKTtcbiAgICAgICAgJGRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcHNbcF0sIGRlc2NyaXB0b3IpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ21peGluJywgbWV0aG9kKG1peGluKSk7XG4gIH1cbiAgZnVuY3Rpb24gZXhwb3J0U3RhcihvYmplY3QpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5hbWVzID0gJGdldE93blByb3BlcnR5TmFtZXMoYXJndW1lbnRzW2ldKTtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbmFtZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgKGZ1bmN0aW9uKG1vZCwgbmFtZSkge1xuICAgICAgICAgICRkZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBtb2RbbmFtZV07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KShhcmd1bWVudHNbaV0sIG5hbWVzW2pdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuICBmdW5jdGlvbiB0b09iamVjdCh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgICAgdGhyb3cgJFR5cGVFcnJvcigpO1xuICAgIHJldHVybiAkT2JqZWN0KHZhbHVlKTtcbiAgfVxuICBmdW5jdGlvbiBzcHJlYWQoKSB7XG4gICAgdmFyIHJ2ID0gW10sXG4gICAgICAgIGsgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWVUb1NwcmVhZCA9IHRvT2JqZWN0KGFyZ3VtZW50c1tpXSk7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHZhbHVlVG9TcHJlYWQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgcnZbaysrXSA9IHZhbHVlVG9TcHJlYWRbal07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBydjtcbiAgfVxuICBmdW5jdGlvbiBnZXRQcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBuYW1lKSB7XG4gICAgd2hpbGUgKG9iamVjdCAhPT0gbnVsbCkge1xuICAgICAgdmFyIHJlc3VsdCA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBuYW1lKTtcbiAgICAgIGlmIChyZXN1bHQpXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICBvYmplY3QgPSAkZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBmdW5jdGlvbiBzdXBlckRlc2NyaXB0b3IoaG9tZU9iamVjdCwgbmFtZSkge1xuICAgIHZhciBwcm90byA9ICRnZXRQcm90b3R5cGVPZihob21lT2JqZWN0KTtcbiAgICBpZiAoIXByb3RvKVxuICAgICAgdGhyb3cgJFR5cGVFcnJvcignc3VwZXIgaXMgbnVsbCcpO1xuICAgIHJldHVybiBnZXRQcm9wZXJ0eURlc2NyaXB0b3IocHJvdG8sIG5hbWUpO1xuICB9XG4gIGZ1bmN0aW9uIHN1cGVyQ2FsbChzZWxmLCBob21lT2JqZWN0LCBuYW1lLCBhcmdzKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBzdXBlckRlc2NyaXB0b3IoaG9tZU9iamVjdCwgbmFtZSk7XG4gICAgaWYgKGRlc2NyaXB0b3IpIHtcbiAgICAgIGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpXG4gICAgICAgIHJldHVybiBkZXNjcmlwdG9yLnZhbHVlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgaWYgKGRlc2NyaXB0b3IuZ2V0KVxuICAgICAgICByZXR1cm4gZGVzY3JpcHRvci5nZXQuY2FsbChzZWxmKS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICB9XG4gICAgdGhyb3cgJFR5cGVFcnJvcihcInN1cGVyIGhhcyBubyBtZXRob2QgJ1wiICsgbmFtZSArIFwiJy5cIik7XG4gIH1cbiAgZnVuY3Rpb24gc3VwZXJHZXQoc2VsZiwgaG9tZU9iamVjdCwgbmFtZSkge1xuICAgIHZhciBkZXNjcmlwdG9yID0gc3VwZXJEZXNjcmlwdG9yKGhvbWVPYmplY3QsIG5hbWUpO1xuICAgIGlmIChkZXNjcmlwdG9yKSB7XG4gICAgICBpZiAoZGVzY3JpcHRvci5nZXQpXG4gICAgICAgIHJldHVybiBkZXNjcmlwdG9yLmdldC5jYWxsKHNlbGYpO1xuICAgICAgZWxzZSBpZiAoJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yKVxuICAgICAgICByZXR1cm4gZGVzY3JpcHRvci52YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBmdW5jdGlvbiBzdXBlclNldChzZWxmLCBob21lT2JqZWN0LCBuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBkZXNjcmlwdG9yID0gc3VwZXJEZXNjcmlwdG9yKGhvbWVPYmplY3QsIG5hbWUpO1xuICAgIGlmIChkZXNjcmlwdG9yICYmIGRlc2NyaXB0b3Iuc2V0KSB7XG4gICAgICBkZXNjcmlwdG9yLnNldC5jYWxsKHNlbGYsIHZhbHVlKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgdGhyb3cgJFR5cGVFcnJvcihcInN1cGVyIGhhcyBubyBzZXR0ZXIgJ1wiICsgbmFtZSArIFwiJy5cIik7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0RGVzY3JpcHRvcnMob2JqZWN0KSB7XG4gICAgdmFyIGRlc2NyaXB0b3JzID0ge30sXG4gICAgICAgIG5hbWUsXG4gICAgICAgIG5hbWVzID0gJGdldE93blByb3BlcnR5TmFtZXMob2JqZWN0KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbmFtZSA9IG5hbWVzW2ldO1xuICAgICAgZGVzY3JpcHRvcnNbbmFtZV0gPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgbmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBkZXNjcmlwdG9ycztcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGVDbGFzcyhjdG9yLCBvYmplY3QsIHN0YXRpY09iamVjdCwgc3VwZXJDbGFzcykge1xuICAgICRkZWZpbmVQcm9wZXJ0eShvYmplY3QsICdjb25zdHJ1Y3RvcicsIHtcbiAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMykge1xuICAgICAgaWYgKHR5cGVvZiBzdXBlckNsYXNzID09PSAnZnVuY3Rpb24nKVxuICAgICAgICBjdG9yLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG4gICAgICBjdG9yLnByb3RvdHlwZSA9ICRjcmVhdGUoZ2V0UHJvdG9QYXJlbnQoc3VwZXJDbGFzcyksIGdldERlc2NyaXB0b3JzKG9iamVjdCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdG9yLnByb3RvdHlwZSA9IG9iamVjdDtcbiAgICB9XG4gICAgJGRlZmluZVByb3BlcnR5KGN0b3IsICdwcm90b3R5cGUnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlXG4gICAgfSk7XG4gICAgcmV0dXJuICRkZWZpbmVQcm9wZXJ0aWVzKGN0b3IsIGdldERlc2NyaXB0b3JzKHN0YXRpY09iamVjdCkpO1xuICB9XG4gIGZ1bmN0aW9uIGdldFByb3RvUGFyZW50KHN1cGVyQ2xhc3MpIHtcbiAgICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHZhciBwcm90b3R5cGUgPSBzdXBlckNsYXNzLnByb3RvdHlwZTtcbiAgICAgIGlmICgkT2JqZWN0KHByb3RvdHlwZSkgPT09IHByb3RvdHlwZSB8fCBwcm90b3R5cGUgPT09IG51bGwpXG4gICAgICAgIHJldHVybiBzdXBlckNsYXNzLnByb3RvdHlwZTtcbiAgICB9XG4gICAgaWYgKHN1cGVyQ2xhc3MgPT09IG51bGwpXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gIH1cbiAgZnVuY3Rpb24gZGVmYXVsdFN1cGVyQ2FsbChzZWxmLCBob21lT2JqZWN0LCBhcmdzKSB7XG4gICAgaWYgKCRnZXRQcm90b3R5cGVPZihob21lT2JqZWN0KSAhPT0gbnVsbClcbiAgICAgIHN1cGVyQ2FsbChzZWxmLCBob21lT2JqZWN0LCAnY29uc3RydWN0b3InLCBhcmdzKTtcbiAgfVxuICB2YXIgU1RfTkVXQk9STiA9IDA7XG4gIHZhciBTVF9FWEVDVVRJTkcgPSAxO1xuICB2YXIgU1RfU1VTUEVOREVEID0gMjtcbiAgdmFyIFNUX0NMT1NFRCA9IDM7XG4gIHZhciBFTkRfU1RBVEUgPSAtMjtcbiAgdmFyIFJFVEhST1dfU1RBVEUgPSAtMztcbiAgZnVuY3Rpb24gYWRkSXRlcmF0b3Iob2JqZWN0KSB7XG4gICAgcmV0dXJuIGRlZmluZVByb3BlcnR5KG9iamVjdCwgU3ltYm9sLml0ZXJhdG9yLCBub25FbnVtKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSkpO1xuICB9XG4gIGZ1bmN0aW9uIGdldEludGVybmFsRXJyb3Ioc3RhdGUpIHtcbiAgICByZXR1cm4gbmV3IEVycm9yKCdUcmFjZXVyIGNvbXBpbGVyIGJ1ZzogaW52YWxpZCBzdGF0ZSBpbiBzdGF0ZSBtYWNoaW5lOiAnICsgc3RhdGUpO1xuICB9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckNvbnRleHQoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IDA7XG4gICAgdGhpcy5HU3RhdGUgPSBTVF9ORVdCT1JOO1xuICAgIHRoaXMuc3RvcmVkRXhjZXB0aW9uID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZmluYWxseUZhbGxUaHJvdWdoID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuc2VudF8gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5yZXR1cm5WYWx1ZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnRyeVN0YWNrXyA9IFtdO1xuICB9XG4gIEdlbmVyYXRvckNvbnRleHQucHJvdG90eXBlID0ge1xuICAgIHB1c2hUcnk6IGZ1bmN0aW9uKGNhdGNoU3RhdGUsIGZpbmFsbHlTdGF0ZSkge1xuICAgICAgaWYgKGZpbmFsbHlTdGF0ZSAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgZmluYWxseUZhbGxUaHJvdWdoID0gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5U3RhY2tfLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgaWYgKHRoaXMudHJ5U3RhY2tfW2ldLmNhdGNoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZpbmFsbHlGYWxsVGhyb3VnaCA9IHRoaXMudHJ5U3RhY2tfW2ldLmNhdGNoO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChmaW5hbGx5RmFsbFRocm91Z2ggPT09IG51bGwpXG4gICAgICAgICAgZmluYWxseUZhbGxUaHJvdWdoID0gUkVUSFJPV19TVEFURTtcbiAgICAgICAgdGhpcy50cnlTdGFja18ucHVzaCh7XG4gICAgICAgICAgZmluYWxseTogZmluYWxseVN0YXRlLFxuICAgICAgICAgIGZpbmFsbHlGYWxsVGhyb3VnaDogZmluYWxseUZhbGxUaHJvdWdoXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGNhdGNoU3RhdGUgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy50cnlTdGFja18ucHVzaCh7Y2F0Y2g6IGNhdGNoU3RhdGV9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHBvcFRyeTogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnRyeVN0YWNrXy5wb3AoKTtcbiAgICB9LFxuICAgIGdldCBzZW50KCkge1xuICAgICAgdGhpcy5tYXliZVRocm93KCk7XG4gICAgICByZXR1cm4gdGhpcy5zZW50XztcbiAgICB9LFxuICAgIHNldCBzZW50KHYpIHtcbiAgICAgIHRoaXMuc2VudF8gPSB2O1xuICAgIH0sXG4gICAgZ2V0IHNlbnRJZ25vcmVUaHJvdygpIHtcbiAgICAgIHJldHVybiB0aGlzLnNlbnRfO1xuICAgIH0sXG4gICAgbWF5YmVUaHJvdzogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5hY3Rpb24gPT09ICd0aHJvdycpIHtcbiAgICAgICAgdGhpcy5hY3Rpb24gPSAnbmV4dCc7XG4gICAgICAgIHRocm93IHRoaXMuc2VudF87XG4gICAgICB9XG4gICAgfSxcbiAgICBlbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgc3dpdGNoICh0aGlzLnN0YXRlKSB7XG4gICAgICAgIGNhc2UgRU5EX1NUQVRFOlxuICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICBjYXNlIFJFVEhST1dfU1RBVEU6XG4gICAgICAgICAgdGhyb3cgdGhpcy5zdG9yZWRFeGNlcHRpb247XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgZ2V0SW50ZXJuYWxFcnJvcih0aGlzLnN0YXRlKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGZ1bmN0aW9uIGdldE5leHRPclRocm93KGN0eCwgbW92ZU5leHQsIGFjdGlvbikge1xuICAgIHJldHVybiBmdW5jdGlvbih4KSB7XG4gICAgICBzd2l0Y2ggKGN0eC5HU3RhdGUpIHtcbiAgICAgICAgY2FzZSBTVF9FWEVDVVRJTkc6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKChcIlxcXCJcIiArIGFjdGlvbiArIFwiXFxcIiBvbiBleGVjdXRpbmcgZ2VuZXJhdG9yXCIpKTtcbiAgICAgICAgY2FzZSBTVF9DTE9TRUQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKChcIlxcXCJcIiArIGFjdGlvbiArIFwiXFxcIiBvbiBjbG9zZWQgZ2VuZXJhdG9yXCIpKTtcbiAgICAgICAgY2FzZSBTVF9ORVdCT1JOOlxuICAgICAgICAgIGlmIChhY3Rpb24gPT09ICd0aHJvdycpIHtcbiAgICAgICAgICAgIGN0eC5HU3RhdGUgPSBTVF9DTE9TRUQ7XG4gICAgICAgICAgICB0aHJvdyB4O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoeCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhyb3cgJFR5cGVFcnJvcignU2VudCB2YWx1ZSB0byBuZXdib3JuIGdlbmVyYXRvcicpO1xuICAgICAgICBjYXNlIFNUX1NVU1BFTkRFRDpcbiAgICAgICAgICBjdHguR1N0YXRlID0gU1RfRVhFQ1VUSU5HO1xuICAgICAgICAgIGN0eC5hY3Rpb24gPSBhY3Rpb247XG4gICAgICAgICAgY3R4LnNlbnQgPSB4O1xuICAgICAgICAgIHZhciB2YWx1ZSA9IG1vdmVOZXh0KGN0eCk7XG4gICAgICAgICAgdmFyIGRvbmUgPSB2YWx1ZSA9PT0gY3R4O1xuICAgICAgICAgIGlmIChkb25lKVxuICAgICAgICAgICAgdmFsdWUgPSBjdHgucmV0dXJuVmFsdWU7XG4gICAgICAgICAgY3R4LkdTdGF0ZSA9IGRvbmUgPyBTVF9DTE9TRUQgOiBTVF9TVVNQRU5ERUQ7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIGRvbmU6IGRvbmVcbiAgICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gZ2VuZXJhdG9yV3JhcChpbm5lckZ1bmN0aW9uLCBzZWxmKSB7XG4gICAgdmFyIG1vdmVOZXh0ID0gZ2V0TW92ZU5leHQoaW5uZXJGdW5jdGlvbiwgc2VsZik7XG4gICAgdmFyIGN0eCA9IG5ldyBHZW5lcmF0b3JDb250ZXh0KCk7XG4gICAgcmV0dXJuIGFkZEl0ZXJhdG9yKHtcbiAgICAgIG5leHQ6IGdldE5leHRPclRocm93KGN0eCwgbW92ZU5leHQsICduZXh0JyksXG4gICAgICB0aHJvdzogZ2V0TmV4dE9yVGhyb3coY3R4LCBtb3ZlTmV4dCwgJ3Rocm93JylcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBBc3luY0Z1bmN0aW9uQ29udGV4dCgpIHtcbiAgICBHZW5lcmF0b3JDb250ZXh0LmNhbGwodGhpcyk7XG4gICAgdGhpcy5lcnIgPSB1bmRlZmluZWQ7XG4gICAgdmFyIGN0eCA9IHRoaXM7XG4gICAgY3R4LnJlc3VsdCA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgY3R4LnJlc29sdmUgPSByZXNvbHZlO1xuICAgICAgY3R4LnJlamVjdCA9IHJlamVjdDtcbiAgICB9KTtcbiAgfVxuICBBc3luY0Z1bmN0aW9uQ29udGV4dC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdlbmVyYXRvckNvbnRleHQucHJvdG90eXBlKTtcbiAgQXN5bmNGdW5jdGlvbkNvbnRleHQucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHN3aXRjaCAodGhpcy5zdGF0ZSkge1xuICAgICAgY2FzZSBFTkRfU1RBVEU6XG4gICAgICAgIHJldHVybjtcbiAgICAgIGNhc2UgUkVUSFJPV19TVEFURTpcbiAgICAgICAgdGhpcy5yZWplY3QodGhpcy5zdG9yZWRFeGNlcHRpb24pO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5yZWplY3QoZ2V0SW50ZXJuYWxFcnJvcih0aGlzLnN0YXRlKSk7XG4gICAgfVxuICB9O1xuICBmdW5jdGlvbiBhc3luY1dyYXAoaW5uZXJGdW5jdGlvbiwgc2VsZikge1xuICAgIHZhciBtb3ZlTmV4dCA9IGdldE1vdmVOZXh0KGlubmVyRnVuY3Rpb24sIHNlbGYpO1xuICAgIHZhciBjdHggPSBuZXcgQXN5bmNGdW5jdGlvbkNvbnRleHQoKTtcbiAgICBjdHguY3JlYXRlQ2FsbGJhY2sgPSBmdW5jdGlvbihuZXdTdGF0ZSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGN0eC5zdGF0ZSA9IG5ld1N0YXRlO1xuICAgICAgICBjdHgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgbW92ZU5leHQoY3R4KTtcbiAgICAgIH07XG4gICAgfTtcbiAgICBjdHguY3JlYXRlRXJyYmFjayA9IGZ1bmN0aW9uKG5ld1N0YXRlKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIGN0eC5zdGF0ZSA9IG5ld1N0YXRlO1xuICAgICAgICBjdHguZXJyID0gZXJyO1xuICAgICAgICBtb3ZlTmV4dChjdHgpO1xuICAgICAgfTtcbiAgICB9O1xuICAgIG1vdmVOZXh0KGN0eCk7XG4gICAgcmV0dXJuIGN0eC5yZXN1bHQ7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0TW92ZU5leHQoaW5uZXJGdW5jdGlvbiwgc2VsZikge1xuICAgIHJldHVybiBmdW5jdGlvbihjdHgpIHtcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIGlubmVyRnVuY3Rpb24uY2FsbChzZWxmLCBjdHgpO1xuICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgIGN0eC5zdG9yZWRFeGNlcHRpb24gPSBleDtcbiAgICAgICAgICB2YXIgbGFzdCA9IGN0eC50cnlTdGFja19bY3R4LnRyeVN0YWNrXy5sZW5ndGggLSAxXTtcbiAgICAgICAgICBpZiAoIWxhc3QpIHtcbiAgICAgICAgICAgIGN0eC5HU3RhdGUgPSBTVF9DTE9TRUQ7XG4gICAgICAgICAgICBjdHguc3RhdGUgPSBFTkRfU1RBVEU7XG4gICAgICAgICAgICB0aHJvdyBleDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3R4LnN0YXRlID0gbGFzdC5jYXRjaCAhPT0gdW5kZWZpbmVkID8gbGFzdC5jYXRjaCA6IGxhc3QuZmluYWxseTtcbiAgICAgICAgICBpZiAobGFzdC5maW5hbGx5RmFsbFRocm91Z2ggIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIGN0eC5maW5hbGx5RmFsbFRocm91Z2ggPSBsYXN0LmZpbmFsbHlGYWxsVGhyb3VnaDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gc2V0dXBHbG9iYWxzKGdsb2JhbCkge1xuICAgIGdsb2JhbC5TeW1ib2wgPSBTeW1ib2w7XG4gICAgcG9seWZpbGxPYmplY3QoZ2xvYmFsLk9iamVjdCk7XG4gIH1cbiAgc2V0dXBHbG9iYWxzKGdsb2JhbCk7XG4gIGdsb2JhbC4kdHJhY2V1clJ1bnRpbWUgPSB7XG4gICAgYXN5bmNXcmFwOiBhc3luY1dyYXAsXG4gICAgY3JlYXRlQ2xhc3M6IGNyZWF0ZUNsYXNzLFxuICAgIGRlZmF1bHRTdXBlckNhbGw6IGRlZmF1bHRTdXBlckNhbGwsXG4gICAgZXhwb3J0U3RhcjogZXhwb3J0U3RhcixcbiAgICBnZW5lcmF0b3JXcmFwOiBnZW5lcmF0b3JXcmFwLFxuICAgIHNldFByb3BlcnR5OiBzZXRQcm9wZXJ0eSxcbiAgICBzZXR1cEdsb2JhbHM6IHNldHVwR2xvYmFscyxcbiAgICBzcHJlYWQ6IHNwcmVhZCxcbiAgICBzdXBlckNhbGw6IHN1cGVyQ2FsbCxcbiAgICBzdXBlckdldDogc3VwZXJHZXQsXG4gICAgc3VwZXJTZXQ6IHN1cGVyU2V0LFxuICAgIHRvT2JqZWN0OiB0b09iamVjdCxcbiAgICB0b1Byb3BlcnR5OiB0b1Byb3BlcnR5LFxuICAgIHR5cGU6IHR5cGVzLFxuICAgIHR5cGVvZjogdHlwZU9mXG4gIH07XG59KSh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHRoaXMpO1xuKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBidWlsZEZyb21FbmNvZGVkUGFydHMob3B0X3NjaGVtZSwgb3B0X3VzZXJJbmZvLCBvcHRfZG9tYWluLCBvcHRfcG9ydCwgb3B0X3BhdGgsIG9wdF9xdWVyeURhdGEsIG9wdF9mcmFnbWVudCkge1xuICAgIHZhciBvdXQgPSBbXTtcbiAgICBpZiAob3B0X3NjaGVtZSkge1xuICAgICAgb3V0LnB1c2gob3B0X3NjaGVtZSwgJzonKTtcbiAgICB9XG4gICAgaWYgKG9wdF9kb21haW4pIHtcbiAgICAgIG91dC5wdXNoKCcvLycpO1xuICAgICAgaWYgKG9wdF91c2VySW5mbykge1xuICAgICAgICBvdXQucHVzaChvcHRfdXNlckluZm8sICdAJyk7XG4gICAgICB9XG4gICAgICBvdXQucHVzaChvcHRfZG9tYWluKTtcbiAgICAgIGlmIChvcHRfcG9ydCkge1xuICAgICAgICBvdXQucHVzaCgnOicsIG9wdF9wb3J0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9wdF9wYXRoKSB7XG4gICAgICBvdXQucHVzaChvcHRfcGF0aCk7XG4gICAgfVxuICAgIGlmIChvcHRfcXVlcnlEYXRhKSB7XG4gICAgICBvdXQucHVzaCgnPycsIG9wdF9xdWVyeURhdGEpO1xuICAgIH1cbiAgICBpZiAob3B0X2ZyYWdtZW50KSB7XG4gICAgICBvdXQucHVzaCgnIycsIG9wdF9mcmFnbWVudCk7XG4gICAgfVxuICAgIHJldHVybiBvdXQuam9pbignJyk7XG4gIH1cbiAgO1xuICB2YXIgc3BsaXRSZSA9IG5ldyBSZWdFeHAoJ14nICsgJyg/OicgKyAnKFteOi8/Iy5dKyknICsgJzopPycgKyAnKD86Ly8nICsgJyg/OihbXi8/I10qKUApPycgKyAnKFtcXFxcd1xcXFxkXFxcXC1cXFxcdTAxMDAtXFxcXHVmZmZmLiVdKiknICsgJyg/OjooWzAtOV0rKSk/JyArICcpPycgKyAnKFtePyNdKyk/JyArICcoPzpcXFxcPyhbXiNdKikpPycgKyAnKD86IyguKikpPycgKyAnJCcpO1xuICB2YXIgQ29tcG9uZW50SW5kZXggPSB7XG4gICAgU0NIRU1FOiAxLFxuICAgIFVTRVJfSU5GTzogMixcbiAgICBET01BSU46IDMsXG4gICAgUE9SVDogNCxcbiAgICBQQVRIOiA1LFxuICAgIFFVRVJZX0RBVEE6IDYsXG4gICAgRlJBR01FTlQ6IDdcbiAgfTtcbiAgZnVuY3Rpb24gc3BsaXQodXJpKSB7XG4gICAgcmV0dXJuICh1cmkubWF0Y2goc3BsaXRSZSkpO1xuICB9XG4gIGZ1bmN0aW9uIHJlbW92ZURvdFNlZ21lbnRzKHBhdGgpIHtcbiAgICBpZiAocGF0aCA9PT0gJy8nKVxuICAgICAgcmV0dXJuICcvJztcbiAgICB2YXIgbGVhZGluZ1NsYXNoID0gcGF0aFswXSA9PT0gJy8nID8gJy8nIDogJyc7XG4gICAgdmFyIHRyYWlsaW5nU2xhc2ggPSBwYXRoLnNsaWNlKC0xKSA9PT0gJy8nID8gJy8nIDogJyc7XG4gICAgdmFyIHNlZ21lbnRzID0gcGF0aC5zcGxpdCgnLycpO1xuICAgIHZhciBvdXQgPSBbXTtcbiAgICB2YXIgdXAgPSAwO1xuICAgIGZvciAodmFyIHBvcyA9IDA7IHBvcyA8IHNlZ21lbnRzLmxlbmd0aDsgcG9zKyspIHtcbiAgICAgIHZhciBzZWdtZW50ID0gc2VnbWVudHNbcG9zXTtcbiAgICAgIHN3aXRjaCAoc2VnbWVudCkge1xuICAgICAgICBjYXNlICcnOlxuICAgICAgICBjYXNlICcuJzpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnLi4nOlxuICAgICAgICAgIGlmIChvdXQubGVuZ3RoKVxuICAgICAgICAgICAgb3V0LnBvcCgpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHVwKys7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgb3V0LnB1c2goc2VnbWVudCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghbGVhZGluZ1NsYXNoKSB7XG4gICAgICB3aGlsZSAodXAtLSA+IDApIHtcbiAgICAgICAgb3V0LnVuc2hpZnQoJy4uJyk7XG4gICAgICB9XG4gICAgICBpZiAob3V0Lmxlbmd0aCA9PT0gMClcbiAgICAgICAgb3V0LnB1c2goJy4nKTtcbiAgICB9XG4gICAgcmV0dXJuIGxlYWRpbmdTbGFzaCArIG91dC5qb2luKCcvJykgKyB0cmFpbGluZ1NsYXNoO1xuICB9XG4gIGZ1bmN0aW9uIGpvaW5BbmRDYW5vbmljYWxpemVQYXRoKHBhcnRzKSB7XG4gICAgdmFyIHBhdGggPSBwYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXSB8fCAnJztcbiAgICBwYXRoID0gcmVtb3ZlRG90U2VnbWVudHMocGF0aCk7XG4gICAgcGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF0gPSBwYXRoO1xuICAgIHJldHVybiBidWlsZEZyb21FbmNvZGVkUGFydHMocGFydHNbQ29tcG9uZW50SW5kZXguU0NIRU1FXSwgcGFydHNbQ29tcG9uZW50SW5kZXguVVNFUl9JTkZPXSwgcGFydHNbQ29tcG9uZW50SW5kZXguRE9NQUlOXSwgcGFydHNbQ29tcG9uZW50SW5kZXguUE9SVF0sIHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdLCBwYXJ0c1tDb21wb25lbnRJbmRleC5RVUVSWV9EQVRBXSwgcGFydHNbQ29tcG9uZW50SW5kZXguRlJBR01FTlRdKTtcbiAgfVxuICBmdW5jdGlvbiBjYW5vbmljYWxpemVVcmwodXJsKSB7XG4gICAgdmFyIHBhcnRzID0gc3BsaXQodXJsKTtcbiAgICByZXR1cm4gam9pbkFuZENhbm9uaWNhbGl6ZVBhdGgocGFydHMpO1xuICB9XG4gIGZ1bmN0aW9uIHJlc29sdmVVcmwoYmFzZSwgdXJsKSB7XG4gICAgdmFyIHBhcnRzID0gc3BsaXQodXJsKTtcbiAgICB2YXIgYmFzZVBhcnRzID0gc3BsaXQoYmFzZSk7XG4gICAgaWYgKHBhcnRzW0NvbXBvbmVudEluZGV4LlNDSEVNRV0pIHtcbiAgICAgIHJldHVybiBqb2luQW5kQ2Fub25pY2FsaXplUGF0aChwYXJ0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcnRzW0NvbXBvbmVudEluZGV4LlNDSEVNRV0gPSBiYXNlUGFydHNbQ29tcG9uZW50SW5kZXguU0NIRU1FXTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IENvbXBvbmVudEluZGV4LlNDSEVNRTsgaSA8PSBDb21wb25lbnRJbmRleC5QT1JUOyBpKyspIHtcbiAgICAgIGlmICghcGFydHNbaV0pIHtcbiAgICAgICAgcGFydHNbaV0gPSBiYXNlUGFydHNbaV07XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXVswXSA9PSAnLycpIHtcbiAgICAgIHJldHVybiBqb2luQW5kQ2Fub25pY2FsaXplUGF0aChwYXJ0cyk7XG4gICAgfVxuICAgIHZhciBwYXRoID0gYmFzZVBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdO1xuICAgIHZhciBpbmRleCA9IHBhdGgubGFzdEluZGV4T2YoJy8nKTtcbiAgICBwYXRoID0gcGF0aC5zbGljZSgwLCBpbmRleCArIDEpICsgcGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF07XG4gICAgcGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF0gPSBwYXRoO1xuICAgIHJldHVybiBqb2luQW5kQ2Fub25pY2FsaXplUGF0aChwYXJ0cyk7XG4gIH1cbiAgZnVuY3Rpb24gaXNBYnNvbHV0ZShuYW1lKSB7XG4gICAgaWYgKCFuYW1lKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChuYW1lWzBdID09PSAnLycpXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB2YXIgcGFydHMgPSBzcGxpdChuYW1lKTtcbiAgICBpZiAocGFydHNbQ29tcG9uZW50SW5kZXguU0NIRU1FXSlcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAkdHJhY2V1clJ1bnRpbWUuY2Fub25pY2FsaXplVXJsID0gY2Fub25pY2FsaXplVXJsO1xuICAkdHJhY2V1clJ1bnRpbWUuaXNBYnNvbHV0ZSA9IGlzQWJzb2x1dGU7XG4gICR0cmFjZXVyUnVudGltZS5yZW1vdmVEb3RTZWdtZW50cyA9IHJlbW92ZURvdFNlZ21lbnRzO1xuICAkdHJhY2V1clJ1bnRpbWUucmVzb2x2ZVVybCA9IHJlc29sdmVVcmw7XG59KSgpO1xuKGZ1bmN0aW9uKGdsb2JhbCkge1xuICAndXNlIHN0cmljdCc7XG4gIHZhciAkX18yID0gJHRyYWNldXJSdW50aW1lLFxuICAgICAgY2Fub25pY2FsaXplVXJsID0gJF9fMi5jYW5vbmljYWxpemVVcmwsXG4gICAgICByZXNvbHZlVXJsID0gJF9fMi5yZXNvbHZlVXJsLFxuICAgICAgaXNBYnNvbHV0ZSA9ICRfXzIuaXNBYnNvbHV0ZTtcbiAgdmFyIG1vZHVsZUluc3RhbnRpYXRvcnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB2YXIgYmFzZVVSTDtcbiAgaWYgKGdsb2JhbC5sb2NhdGlvbiAmJiBnbG9iYWwubG9jYXRpb24uaHJlZilcbiAgICBiYXNlVVJMID0gcmVzb2x2ZVVybChnbG9iYWwubG9jYXRpb24uaHJlZiwgJy4vJyk7XG4gIGVsc2VcbiAgICBiYXNlVVJMID0gJyc7XG4gIHZhciBVbmNvYXRlZE1vZHVsZUVudHJ5ID0gZnVuY3Rpb24gVW5jb2F0ZWRNb2R1bGVFbnRyeSh1cmwsIHVuY29hdGVkTW9kdWxlKSB7XG4gICAgdGhpcy51cmwgPSB1cmw7XG4gICAgdGhpcy52YWx1ZV8gPSB1bmNvYXRlZE1vZHVsZTtcbiAgfTtcbiAgKCR0cmFjZXVyUnVudGltZS5jcmVhdGVDbGFzcykoVW5jb2F0ZWRNb2R1bGVFbnRyeSwge30sIHt9KTtcbiAgdmFyIFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yID0gZnVuY3Rpb24gVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IodXJsLCBmdW5jKSB7XG4gICAgJHRyYWNldXJSdW50aW1lLnN1cGVyQ2FsbCh0aGlzLCAkVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IucHJvdG90eXBlLCBcImNvbnN0cnVjdG9yXCIsIFt1cmwsIG51bGxdKTtcbiAgICB0aGlzLmZ1bmMgPSBmdW5jO1xuICB9O1xuICB2YXIgJFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yID0gVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3I7XG4gICgkdHJhY2V1clJ1bnRpbWUuY3JlYXRlQ2xhc3MpKFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yLCB7Z2V0VW5jb2F0ZWRNb2R1bGU6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMudmFsdWVfKVxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZV87XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZV8gPSB0aGlzLmZ1bmMuY2FsbChnbG9iYWwpO1xuICAgIH19LCB7fSwgVW5jb2F0ZWRNb2R1bGVFbnRyeSk7XG4gIGZ1bmN0aW9uIGdldFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKG5hbWUpIHtcbiAgICBpZiAoIW5hbWUpXG4gICAgICByZXR1cm47XG4gICAgdmFyIHVybCA9IE1vZHVsZVN0b3JlLm5vcm1hbGl6ZShuYW1lKTtcbiAgICByZXR1cm4gbW9kdWxlSW5zdGFudGlhdG9yc1t1cmxdO1xuICB9XG4gIDtcbiAgdmFyIG1vZHVsZUluc3RhbmNlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHZhciBsaXZlTW9kdWxlU2VudGluZWwgPSB7fTtcbiAgZnVuY3Rpb24gTW9kdWxlKHVuY29hdGVkTW9kdWxlKSB7XG4gICAgdmFyIGlzTGl2ZSA9IGFyZ3VtZW50c1sxXTtcbiAgICB2YXIgY29hdGVkTW9kdWxlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh1bmNvYXRlZE1vZHVsZSkuZm9yRWFjaCgoZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyIGdldHRlcixcbiAgICAgICAgICB2YWx1ZTtcbiAgICAgIGlmIChpc0xpdmUgPT09IGxpdmVNb2R1bGVTZW50aW5lbCkge1xuICAgICAgICB2YXIgZGVzY3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHVuY29hdGVkTW9kdWxlLCBuYW1lKTtcbiAgICAgICAgaWYgKGRlc2NyLmdldClcbiAgICAgICAgICBnZXR0ZXIgPSBkZXNjci5nZXQ7XG4gICAgICB9XG4gICAgICBpZiAoIWdldHRlcikge1xuICAgICAgICB2YWx1ZSA9IHVuY29hdGVkTW9kdWxlW25hbWVdO1xuICAgICAgICBnZXR0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29hdGVkTW9kdWxlLCBuYW1lLCB7XG4gICAgICAgIGdldDogZ2V0dGVyLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9KSk7XG4gICAgT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKGNvYXRlZE1vZHVsZSk7XG4gICAgcmV0dXJuIGNvYXRlZE1vZHVsZTtcbiAgfVxuICB2YXIgTW9kdWxlU3RvcmUgPSB7XG4gICAgbm9ybWFsaXplOiBmdW5jdGlvbihuYW1lLCByZWZlcmVyTmFtZSwgcmVmZXJlckFkZHJlc3MpIHtcbiAgICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIilcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIm1vZHVsZSBuYW1lIG11c3QgYmUgYSBzdHJpbmcsIG5vdCBcIiArIHR5cGVvZiBuYW1lKTtcbiAgICAgIGlmIChpc0Fic29sdXRlKG5hbWUpKVxuICAgICAgICByZXR1cm4gY2Fub25pY2FsaXplVXJsKG5hbWUpO1xuICAgICAgaWYgKC9bXlxcLl1cXC9cXC5cXC5cXC8vLnRlc3QobmFtZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdtb2R1bGUgbmFtZSBlbWJlZHMgLy4uLzogJyArIG5hbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG5hbWVbMF0gPT09ICcuJyAmJiByZWZlcmVyTmFtZSlcbiAgICAgICAgcmV0dXJuIHJlc29sdmVVcmwocmVmZXJlck5hbWUsIG5hbWUpO1xuICAgICAgcmV0dXJuIGNhbm9uaWNhbGl6ZVVybChuYW1lKTtcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24obm9ybWFsaXplZE5hbWUpIHtcbiAgICAgIHZhciBtID0gZ2V0VW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3Iobm9ybWFsaXplZE5hbWUpO1xuICAgICAgaWYgKCFtKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgdmFyIG1vZHVsZUluc3RhbmNlID0gbW9kdWxlSW5zdGFuY2VzW20udXJsXTtcbiAgICAgIGlmIChtb2R1bGVJbnN0YW5jZSlcbiAgICAgICAgcmV0dXJuIG1vZHVsZUluc3RhbmNlO1xuICAgICAgbW9kdWxlSW5zdGFuY2UgPSBNb2R1bGUobS5nZXRVbmNvYXRlZE1vZHVsZSgpLCBsaXZlTW9kdWxlU2VudGluZWwpO1xuICAgICAgcmV0dXJuIG1vZHVsZUluc3RhbmNlc1ttLnVybF0gPSBtb2R1bGVJbnN0YW5jZTtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24obm9ybWFsaXplZE5hbWUsIG1vZHVsZSkge1xuICAgICAgbm9ybWFsaXplZE5hbWUgPSBTdHJpbmcobm9ybWFsaXplZE5hbWUpO1xuICAgICAgbW9kdWxlSW5zdGFudGlhdG9yc1tub3JtYWxpemVkTmFtZV0gPSBuZXcgVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3Iobm9ybWFsaXplZE5hbWUsIChmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICAgIH0pKTtcbiAgICAgIG1vZHVsZUluc3RhbmNlc1tub3JtYWxpemVkTmFtZV0gPSBtb2R1bGU7XG4gICAgfSxcbiAgICBnZXQgYmFzZVVSTCgpIHtcbiAgICAgIHJldHVybiBiYXNlVVJMO1xuICAgIH0sXG4gICAgc2V0IGJhc2VVUkwodikge1xuICAgICAgYmFzZVVSTCA9IFN0cmluZyh2KTtcbiAgICB9LFxuICAgIHJlZ2lzdGVyTW9kdWxlOiBmdW5jdGlvbihuYW1lLCBmdW5jKSB7XG4gICAgICB2YXIgbm9ybWFsaXplZE5hbWUgPSBNb2R1bGVTdG9yZS5ub3JtYWxpemUobmFtZSk7XG4gICAgICBpZiAobW9kdWxlSW5zdGFudGlhdG9yc1tub3JtYWxpemVkTmFtZV0pXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignZHVwbGljYXRlIG1vZHVsZSBuYW1lZCAnICsgbm9ybWFsaXplZE5hbWUpO1xuICAgICAgbW9kdWxlSW5zdGFudGlhdG9yc1tub3JtYWxpemVkTmFtZV0gPSBuZXcgVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3Iobm9ybWFsaXplZE5hbWUsIGZ1bmMpO1xuICAgIH0sXG4gICAgYnVuZGxlU3RvcmU6IE9iamVjdC5jcmVhdGUobnVsbCksXG4gICAgcmVnaXN0ZXI6IGZ1bmN0aW9uKG5hbWUsIGRlcHMsIGZ1bmMpIHtcbiAgICAgIGlmICghZGVwcyB8fCAhZGVwcy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5yZWdpc3Rlck1vZHVsZShuYW1lLCBmdW5jKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYnVuZGxlU3RvcmVbbmFtZV0gPSB7XG4gICAgICAgICAgZGVwczogZGVwcyxcbiAgICAgICAgICBleGVjdXRlOiBmdW5jXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXRBbm9ueW1vdXNNb2R1bGU6IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAgIHJldHVybiBuZXcgTW9kdWxlKGZ1bmMuY2FsbChnbG9iYWwpLCBsaXZlTW9kdWxlU2VudGluZWwpO1xuICAgIH0sXG4gICAgZ2V0Rm9yVGVzdGluZzogZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyICRfXzAgPSB0aGlzO1xuICAgICAgaWYgKCF0aGlzLnRlc3RpbmdQcmVmaXhfKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKG1vZHVsZUluc3RhbmNlcykuc29tZSgoZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgdmFyIG0gPSAvKHRyYWNldXJAW15cXC9dKlxcLykvLmV4ZWMoa2V5KTtcbiAgICAgICAgICBpZiAobSkge1xuICAgICAgICAgICAgJF9fMC50ZXN0aW5nUHJlZml4XyA9IG1bMV07XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmdldCh0aGlzLnRlc3RpbmdQcmVmaXhfICsgbmFtZSk7XG4gICAgfVxuICB9O1xuICBNb2R1bGVTdG9yZS5zZXQoJ0B0cmFjZXVyL3NyYy9ydW50aW1lL01vZHVsZVN0b3JlJywgbmV3IE1vZHVsZSh7TW9kdWxlU3RvcmU6IE1vZHVsZVN0b3JlfSkpO1xuICB2YXIgc2V0dXBHbG9iYWxzID0gJHRyYWNldXJSdW50aW1lLnNldHVwR2xvYmFscztcbiAgJHRyYWNldXJSdW50aW1lLnNldHVwR2xvYmFscyA9IGZ1bmN0aW9uKGdsb2JhbCkge1xuICAgIHNldHVwR2xvYmFscyhnbG9iYWwpO1xuICB9O1xuICAkdHJhY2V1clJ1bnRpbWUuTW9kdWxlU3RvcmUgPSBNb2R1bGVTdG9yZTtcbiAgZ2xvYmFsLlN5c3RlbSA9IHtcbiAgICByZWdpc3RlcjogTW9kdWxlU3RvcmUucmVnaXN0ZXIuYmluZChNb2R1bGVTdG9yZSksXG4gICAgZ2V0OiBNb2R1bGVTdG9yZS5nZXQsXG4gICAgc2V0OiBNb2R1bGVTdG9yZS5zZXQsXG4gICAgbm9ybWFsaXplOiBNb2R1bGVTdG9yZS5ub3JtYWxpemVcbiAgfTtcbiAgJHRyYWNldXJSdW50aW1lLmdldE1vZHVsZUltcGwgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGluc3RhbnRpYXRvciA9IGdldFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKG5hbWUpO1xuICAgIHJldHVybiBpbnN0YW50aWF0b3IgJiYgaW5zdGFudGlhdG9yLmdldFVuY29hdGVkTW9kdWxlKCk7XG4gIH07XG59KSh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHRoaXMpO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvdXRpbHNcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvdXRpbHNcIjtcbiAgdmFyIHRvT2JqZWN0ID0gJHRyYWNldXJSdW50aW1lLnRvT2JqZWN0O1xuICBmdW5jdGlvbiB0b1VpbnQzMih4KSB7XG4gICAgcmV0dXJuIHggfCAwO1xuICB9XG4gIHJldHVybiB7XG4gICAgZ2V0IHRvT2JqZWN0KCkge1xuICAgICAgcmV0dXJuIHRvT2JqZWN0O1xuICAgIH0sXG4gICAgZ2V0IHRvVWludDMyKCkge1xuICAgICAgcmV0dXJuIHRvVWludDMyO1xuICAgIH1cbiAgfTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvQXJyYXlJdGVyYXRvclwiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgJF9fNDtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvQXJyYXlJdGVyYXRvclwiO1xuICB2YXIgJF9fNSA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy91dGlsc1wiKSxcbiAgICAgIHRvT2JqZWN0ID0gJF9fNS50b09iamVjdCxcbiAgICAgIHRvVWludDMyID0gJF9fNS50b1VpbnQzMjtcbiAgdmFyIEFSUkFZX0lURVJBVE9SX0tJTkRfS0VZUyA9IDE7XG4gIHZhciBBUlJBWV9JVEVSQVRPUl9LSU5EX1ZBTFVFUyA9IDI7XG4gIHZhciBBUlJBWV9JVEVSQVRPUl9LSU5EX0VOVFJJRVMgPSAzO1xuICB2YXIgQXJyYXlJdGVyYXRvciA9IGZ1bmN0aW9uIEFycmF5SXRlcmF0b3IoKSB7fTtcbiAgKCR0cmFjZXVyUnVudGltZS5jcmVhdGVDbGFzcykoQXJyYXlJdGVyYXRvciwgKCRfXzQgPSB7fSwgT2JqZWN0LmRlZmluZVByb3BlcnR5KCRfXzQsIFwibmV4dFwiLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGl0ZXJhdG9yID0gdG9PYmplY3QodGhpcyk7XG4gICAgICB2YXIgYXJyYXkgPSBpdGVyYXRvci5pdGVyYXRvck9iamVjdF87XG4gICAgICBpZiAoIWFycmF5KSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdCBpcyBub3QgYW4gQXJyYXlJdGVyYXRvcicpO1xuICAgICAgfVxuICAgICAgdmFyIGluZGV4ID0gaXRlcmF0b3IuYXJyYXlJdGVyYXRvck5leHRJbmRleF87XG4gICAgICB2YXIgaXRlbUtpbmQgPSBpdGVyYXRvci5hcnJheUl0ZXJhdGlvbktpbmRfO1xuICAgICAgdmFyIGxlbmd0aCA9IHRvVWludDMyKGFycmF5Lmxlbmd0aCk7XG4gICAgICBpZiAoaW5kZXggPj0gbGVuZ3RoKSB7XG4gICAgICAgIGl0ZXJhdG9yLmFycmF5SXRlcmF0b3JOZXh0SW5kZXhfID0gSW5maW5pdHk7XG4gICAgICAgIHJldHVybiBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdCh1bmRlZmluZWQsIHRydWUpO1xuICAgICAgfVxuICAgICAgaXRlcmF0b3IuYXJyYXlJdGVyYXRvck5leHRJbmRleF8gPSBpbmRleCArIDE7XG4gICAgICBpZiAoaXRlbUtpbmQgPT0gQVJSQVlfSVRFUkFUT1JfS0lORF9WQUxVRVMpXG4gICAgICAgIHJldHVybiBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdChhcnJheVtpbmRleF0sIGZhbHNlKTtcbiAgICAgIGlmIChpdGVtS2luZCA9PSBBUlJBWV9JVEVSQVRPUl9LSU5EX0VOVFJJRVMpXG4gICAgICAgIHJldHVybiBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdChbaW5kZXgsIGFycmF5W2luZGV4XV0sIGZhbHNlKTtcbiAgICAgIHJldHVybiBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdChpbmRleCwgZmFsc2UpO1xuICAgIH0sXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWVcbiAgfSksIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSgkX180LCBTeW1ib2wuaXRlcmF0b3IsIHtcbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlXG4gIH0pLCAkX180KSwge30pO1xuICBmdW5jdGlvbiBjcmVhdGVBcnJheUl0ZXJhdG9yKGFycmF5LCBraW5kKSB7XG4gICAgdmFyIG9iamVjdCA9IHRvT2JqZWN0KGFycmF5KTtcbiAgICB2YXIgaXRlcmF0b3IgPSBuZXcgQXJyYXlJdGVyYXRvcjtcbiAgICBpdGVyYXRvci5pdGVyYXRvck9iamVjdF8gPSBvYmplY3Q7XG4gICAgaXRlcmF0b3IuYXJyYXlJdGVyYXRvck5leHRJbmRleF8gPSAwO1xuICAgIGl0ZXJhdG9yLmFycmF5SXRlcmF0aW9uS2luZF8gPSBraW5kO1xuICAgIHJldHVybiBpdGVyYXRvcjtcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdCh2YWx1ZSwgZG9uZSkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBkb25lOiBkb25lXG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBlbnRyaWVzKCkge1xuICAgIHJldHVybiBjcmVhdGVBcnJheUl0ZXJhdG9yKHRoaXMsIEFSUkFZX0lURVJBVE9SX0tJTkRfRU5UUklFUyk7XG4gIH1cbiAgZnVuY3Rpb24ga2V5cygpIHtcbiAgICByZXR1cm4gY3JlYXRlQXJyYXlJdGVyYXRvcih0aGlzLCBBUlJBWV9JVEVSQVRPUl9LSU5EX0tFWVMpO1xuICB9XG4gIGZ1bmN0aW9uIHZhbHVlcygpIHtcbiAgICByZXR1cm4gY3JlYXRlQXJyYXlJdGVyYXRvcih0aGlzLCBBUlJBWV9JVEVSQVRPUl9LSU5EX1ZBTFVFUyk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBnZXQgZW50cmllcygpIHtcbiAgICAgIHJldHVybiBlbnRyaWVzO1xuICAgIH0sXG4gICAgZ2V0IGtleXMoKSB7XG4gICAgICByZXR1cm4ga2V5cztcbiAgICB9LFxuICAgIGdldCB2YWx1ZXMoKSB7XG4gICAgICByZXR1cm4gdmFsdWVzO1xuICAgIH1cbiAgfTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9ub2RlX21vZHVsZXMvcnN2cC9saWIvcnN2cC9hc2FwXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuMzIvbm9kZV9tb2R1bGVzL3JzdnAvbGliL3JzdnAvYXNhcFwiO1xuICB2YXIgJF9fZGVmYXVsdCA9IGZ1bmN0aW9uIGFzYXAoY2FsbGJhY2ssIGFyZykge1xuICAgIHZhciBsZW5ndGggPSBxdWV1ZS5wdXNoKFtjYWxsYmFjaywgYXJnXSk7XG4gICAgaWYgKGxlbmd0aCA9PT0gMSkge1xuICAgICAgc2NoZWR1bGVGbHVzaCgpO1xuICAgIH1cbiAgfTtcbiAgdmFyIGJyb3dzZXJHbG9iYWwgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpID8gd2luZG93IDoge307XG4gIHZhciBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9IGJyb3dzZXJHbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBicm93c2VyR2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG4gIGZ1bmN0aW9uIHVzZU5leHRUaWNrKCkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gdXNlTXV0YXRpb25PYnNlcnZlcigpIHtcbiAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgdmFyIG9ic2VydmVyID0gbmV3IEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKGZsdXNoKTtcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICBvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHtjaGFyYWN0ZXJEYXRhOiB0cnVlfSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgbm9kZS5kYXRhID0gKGl0ZXJhdGlvbnMgPSArK2l0ZXJhdGlvbnMgJSAyKTtcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIHVzZVNldFRpbWVvdXQoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgc2V0VGltZW91dChmbHVzaCwgMSk7XG4gICAgfTtcbiAgfVxuICB2YXIgcXVldWUgPSBbXTtcbiAgZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHR1cGxlID0gcXVldWVbaV07XG4gICAgICB2YXIgY2FsbGJhY2sgPSB0dXBsZVswXSxcbiAgICAgICAgICBhcmcgPSB0dXBsZVsxXTtcbiAgICAgIGNhbGxiYWNrKGFyZyk7XG4gICAgfVxuICAgIHF1ZXVlID0gW107XG4gIH1cbiAgdmFyIHNjaGVkdWxlRmx1c2g7XG4gIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYge30udG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nKSB7XG4gICAgc2NoZWR1bGVGbHVzaCA9IHVzZU5leHRUaWNrKCk7XG4gIH0gZWxzZSBpZiAoQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIpIHtcbiAgICBzY2hlZHVsZUZsdXNoID0gdXNlTXV0YXRpb25PYnNlcnZlcigpO1xuICB9IGVsc2Uge1xuICAgIHNjaGVkdWxlRmx1c2ggPSB1c2VTZXRUaW1lb3V0KCk7XG4gIH1cbiAgcmV0dXJuIHtnZXQgZGVmYXVsdCgpIHtcbiAgICAgIHJldHVybiAkX19kZWZhdWx0O1xuICAgIH19O1xufSk7XG5TeXN0ZW0ucmVnaXN0ZXIoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9Qcm9taXNlXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1Byb21pc2VcIjtcbiAgdmFyIGFzeW5jID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuMzIvbm9kZV9tb2R1bGVzL3JzdnAvbGliL3JzdnAvYXNhcFwiKS5kZWZhdWx0O1xuICBmdW5jdGlvbiBpc1Byb21pc2UoeCkge1xuICAgIHJldHVybiB4ICYmIHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4LnN0YXR1c18gIT09IHVuZGVmaW5lZDtcbiAgfVxuICBmdW5jdGlvbiBjaGFpbihwcm9taXNlKSB7XG4gICAgdmFyIG9uUmVzb2x2ZSA9IGFyZ3VtZW50c1sxXSAhPT0gKHZvaWQgMCkgPyBhcmd1bWVudHNbMV0gOiAoZnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIHg7XG4gICAgfSk7XG4gICAgdmFyIG9uUmVqZWN0ID0gYXJndW1lbnRzWzJdICE9PSAodm9pZCAwKSA/IGFyZ3VtZW50c1syXSA6IChmdW5jdGlvbihlKSB7XG4gICAgICB0aHJvdyBlO1xuICAgIH0pO1xuICAgIHZhciBkZWZlcnJlZCA9IGdldERlZmVycmVkKHByb21pc2UuY29uc3RydWN0b3IpO1xuICAgIHN3aXRjaCAocHJvbWlzZS5zdGF0dXNfKSB7XG4gICAgICBjYXNlIHVuZGVmaW5lZDpcbiAgICAgICAgdGhyb3cgVHlwZUVycm9yO1xuICAgICAgY2FzZSAncGVuZGluZyc6XG4gICAgICAgIHByb21pc2Uub25SZXNvbHZlXy5wdXNoKFtkZWZlcnJlZCwgb25SZXNvbHZlXSk7XG4gICAgICAgIHByb21pc2Uub25SZWplY3RfLnB1c2goW2RlZmVycmVkLCBvblJlamVjdF0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3Jlc29sdmVkJzpcbiAgICAgICAgcHJvbWlzZVJlYWN0KGRlZmVycmVkLCBvblJlc29sdmUsIHByb21pc2UudmFsdWVfKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZWplY3RlZCc6XG4gICAgICAgIHByb21pc2VSZWFjdChkZWZlcnJlZCwgb25SZWplY3QsIHByb21pc2UudmFsdWVfKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9XG4gIGZ1bmN0aW9uIGdldERlZmVycmVkKEMpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgcmVzdWx0LnByb21pc2UgPSBuZXcgQygoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZXN1bHQucmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICByZXN1bHQucmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHZhciBQcm9taXNlID0gZnVuY3Rpb24gUHJvbWlzZShyZXNvbHZlcikge1xuICAgIHZhciAkX182ID0gdGhpcztcbiAgICB0aGlzLnN0YXR1c18gPSAncGVuZGluZyc7XG4gICAgdGhpcy5vblJlc29sdmVfID0gW107XG4gICAgdGhpcy5vblJlamVjdF8gPSBbXTtcbiAgICByZXNvbHZlcigoZnVuY3Rpb24oeCkge1xuICAgICAgcHJvbWlzZVJlc29sdmUoJF9fNiwgeCk7XG4gICAgfSksIChmdW5jdGlvbihyKSB7XG4gICAgICBwcm9taXNlUmVqZWN0KCRfXzYsIHIpO1xuICAgIH0pKTtcbiAgfTtcbiAgKCR0cmFjZXVyUnVudGltZS5jcmVhdGVDbGFzcykoUHJvbWlzZSwge1xuICAgIGNhdGNoOiBmdW5jdGlvbihvblJlamVjdCkge1xuICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0KTtcbiAgICB9LFxuICAgIHRoZW46IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9uUmVzb2x2ZSA9IGFyZ3VtZW50c1swXSAhPT0gKHZvaWQgMCkgPyBhcmd1bWVudHNbMF0gOiAoZnVuY3Rpb24oeCkge1xuICAgICAgICByZXR1cm4geDtcbiAgICAgIH0pO1xuICAgICAgdmFyIG9uUmVqZWN0ID0gYXJndW1lbnRzWzFdO1xuICAgICAgdmFyICRfXzYgPSB0aGlzO1xuICAgICAgdmFyIGNvbnN0cnVjdG9yID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgIHJldHVybiBjaGFpbih0aGlzLCAoZnVuY3Rpb24oeCkge1xuICAgICAgICB4ID0gcHJvbWlzZUNvZXJjZShjb25zdHJ1Y3RvciwgeCk7XG4gICAgICAgIHJldHVybiB4ID09PSAkX182ID8gb25SZWplY3QobmV3IFR5cGVFcnJvcikgOiBpc1Byb21pc2UoeCkgPyB4LnRoZW4ob25SZXNvbHZlLCBvblJlamVjdCkgOiBvblJlc29sdmUoeCk7XG4gICAgICB9KSwgb25SZWplY3QpO1xuICAgIH1cbiAgfSwge1xuICAgIHJlc29sdmU6IGZ1bmN0aW9uKHgpIHtcbiAgICAgIHJldHVybiBuZXcgdGhpcygoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJlc29sdmUoeCk7XG4gICAgICB9KSk7XG4gICAgfSxcbiAgICByZWplY3Q6IGZ1bmN0aW9uKHIpIHtcbiAgICAgIHJldHVybiBuZXcgdGhpcygoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJlamVjdChyKTtcbiAgICAgIH0pKTtcbiAgICB9LFxuICAgIGNhc3Q6IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICh4IGluc3RhbmNlb2YgdGhpcylcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgICBpZiAoaXNQcm9taXNlKHgpKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBnZXREZWZlcnJlZCh0aGlzKTtcbiAgICAgICAgY2hhaW4oeCwgcmVzdWx0LnJlc29sdmUsIHJlc3VsdC5yZWplY3QpO1xuICAgICAgICByZXR1cm4gcmVzdWx0LnByb21pc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5yZXNvbHZlKHgpO1xuICAgIH0sXG4gICAgYWxsOiBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9IGdldERlZmVycmVkKHRoaXMpO1xuICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAgIHZhciByZXNvbHV0aW9ucyA9IFtdO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICArK2NvdW50O1xuICAgICAgICAgIHRoaXMuY2FzdCh2YWx1ZXNbaV0pLnRoZW4oZnVuY3Rpb24oaSwgeCkge1xuICAgICAgICAgICAgcmVzb2x1dGlvbnNbaV0gPSB4O1xuICAgICAgICAgICAgaWYgKC0tY291bnQgPT09IDApXG4gICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzb2x1dGlvbnMpO1xuICAgICAgICAgIH0uYmluZCh1bmRlZmluZWQsIGkpLCAoZnVuY3Rpb24ocikge1xuICAgICAgICAgICAgaWYgKGNvdW50ID4gMClcbiAgICAgICAgICAgICAgY291bnQgPSAwO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHIpO1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY291bnQgPT09IDApXG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNvbHV0aW9ucyk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH0sXG4gICAgcmFjZTogZnVuY3Rpb24odmFsdWVzKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSBnZXREZWZlcnJlZCh0aGlzKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdGhpcy5jYXN0KHZhbHVlc1tpXSkudGhlbigoZnVuY3Rpb24oeCkge1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh4KTtcbiAgICAgICAgICB9KSwgKGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChyKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfVxuICB9KTtcbiAgZnVuY3Rpb24gcHJvbWlzZVJlc29sdmUocHJvbWlzZSwgeCkge1xuICAgIHByb21pc2VEb25lKHByb21pc2UsICdyZXNvbHZlZCcsIHgsIHByb21pc2Uub25SZXNvbHZlXyk7XG4gIH1cbiAgZnVuY3Rpb24gcHJvbWlzZVJlamVjdChwcm9taXNlLCByKSB7XG4gICAgcHJvbWlzZURvbmUocHJvbWlzZSwgJ3JlamVjdGVkJywgciwgcHJvbWlzZS5vblJlamVjdF8pO1xuICB9XG4gIGZ1bmN0aW9uIHByb21pc2VEb25lKHByb21pc2UsIHN0YXR1cywgdmFsdWUsIHJlYWN0aW9ucykge1xuICAgIGlmIChwcm9taXNlLnN0YXR1c18gIT09ICdwZW5kaW5nJylcbiAgICAgIHJldHVybjtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlYWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgcHJvbWlzZVJlYWN0KHJlYWN0aW9uc1tpXVswXSwgcmVhY3Rpb25zW2ldWzFdLCB2YWx1ZSk7XG4gICAgfVxuICAgIHByb21pc2Uuc3RhdHVzXyA9IHN0YXR1cztcbiAgICBwcm9taXNlLnZhbHVlXyA9IHZhbHVlO1xuICAgIHByb21pc2Uub25SZXNvbHZlXyA9IHByb21pc2Uub25SZWplY3RfID0gdW5kZWZpbmVkO1xuICB9XG4gIGZ1bmN0aW9uIHByb21pc2VSZWFjdChkZWZlcnJlZCwgaGFuZGxlciwgeCkge1xuICAgIGFzeW5jKChmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciB5ID0gaGFuZGxlcih4KTtcbiAgICAgICAgaWYgKHkgPT09IGRlZmVycmVkLnByb21pc2UpXG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcjtcbiAgICAgICAgZWxzZSBpZiAoaXNQcm9taXNlKHkpKVxuICAgICAgICAgIGNoYWluKHksIGRlZmVycmVkLnJlc29sdmUsIGRlZmVycmVkLnJlamVjdCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHkpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgICB9XG4gICAgfSkpO1xuICB9XG4gIHZhciB0aGVuYWJsZVN5bWJvbCA9ICdAQHRoZW5hYmxlJztcbiAgZnVuY3Rpb24gcHJvbWlzZUNvZXJjZShjb25zdHJ1Y3RvciwgeCkge1xuICAgIGlmIChpc1Byb21pc2UoeCkpIHtcbiAgICAgIHJldHVybiB4O1xuICAgIH0gZWxzZSBpZiAoeCAmJiB0eXBlb2YgeC50aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgcCA9IHhbdGhlbmFibGVTeW1ib2xdO1xuICAgICAgaWYgKHApIHtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZGVmZXJyZWQgPSBnZXREZWZlcnJlZChjb25zdHJ1Y3Rvcik7XG4gICAgICAgIHhbdGhlbmFibGVTeW1ib2xdID0gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB4LnRoZW4oZGVmZXJyZWQucmVzb2x2ZSwgZGVmZXJyZWQucmVqZWN0KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9XG4gIHJldHVybiB7Z2V0IFByb21pc2UoKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZTtcbiAgICB9fTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvU3RyaW5nXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1N0cmluZ1wiO1xuICB2YXIgJHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbiAgdmFyICRpbmRleE9mID0gU3RyaW5nLnByb3RvdHlwZS5pbmRleE9mO1xuICB2YXIgJGxhc3RJbmRleE9mID0gU3RyaW5nLnByb3RvdHlwZS5sYXN0SW5kZXhPZjtcbiAgZnVuY3Rpb24gc3RhcnRzV2l0aChzZWFyY2gpIHtcbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIGlmICh0aGlzID09IG51bGwgfHwgJHRvU3RyaW5nLmNhbGwoc2VhcmNoKSA9PSAnW29iamVjdCBSZWdFeHBdJykge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIHZhciBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuICAgIHZhciBzZWFyY2hTdHJpbmcgPSBTdHJpbmcoc2VhcmNoKTtcbiAgICB2YXIgc2VhcmNoTGVuZ3RoID0gc2VhcmNoU3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgcG9zaXRpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgcG9zID0gcG9zaXRpb24gPyBOdW1iZXIocG9zaXRpb24pIDogMDtcbiAgICBpZiAoaXNOYU4ocG9zKSkge1xuICAgICAgcG9zID0gMDtcbiAgICB9XG4gICAgdmFyIHN0YXJ0ID0gTWF0aC5taW4oTWF0aC5tYXgocG9zLCAwKSwgc3RyaW5nTGVuZ3RoKTtcbiAgICByZXR1cm4gJGluZGV4T2YuY2FsbChzdHJpbmcsIHNlYXJjaFN0cmluZywgcG9zKSA9PSBzdGFydDtcbiAgfVxuICBmdW5jdGlvbiBlbmRzV2l0aChzZWFyY2gpIHtcbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIGlmICh0aGlzID09IG51bGwgfHwgJHRvU3RyaW5nLmNhbGwoc2VhcmNoKSA9PSAnW29iamVjdCBSZWdFeHBdJykge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIHZhciBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuICAgIHZhciBzZWFyY2hTdHJpbmcgPSBTdHJpbmcoc2VhcmNoKTtcbiAgICB2YXIgc2VhcmNoTGVuZ3RoID0gc2VhcmNoU3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgcG9zID0gc3RyaW5nTGVuZ3RoO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgdmFyIHBvc2l0aW9uID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKHBvc2l0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcG9zID0gcG9zaXRpb24gPyBOdW1iZXIocG9zaXRpb24pIDogMDtcbiAgICAgICAgaWYgKGlzTmFOKHBvcykpIHtcbiAgICAgICAgICBwb3MgPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBlbmQgPSBNYXRoLm1pbihNYXRoLm1heChwb3MsIDApLCBzdHJpbmdMZW5ndGgpO1xuICAgIHZhciBzdGFydCA9IGVuZCAtIHNlYXJjaExlbmd0aDtcbiAgICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiAkbGFzdEluZGV4T2YuY2FsbChzdHJpbmcsIHNlYXJjaFN0cmluZywgc3RhcnQpID09IHN0YXJ0O1xuICB9XG4gIGZ1bmN0aW9uIGNvbnRhaW5zKHNlYXJjaCkge1xuICAgIGlmICh0aGlzID09IG51bGwpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIHZhciBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuICAgIHZhciBzZWFyY2hTdHJpbmcgPSBTdHJpbmcoc2VhcmNoKTtcbiAgICB2YXIgc2VhcmNoTGVuZ3RoID0gc2VhcmNoU3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgcG9zaXRpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgcG9zID0gcG9zaXRpb24gPyBOdW1iZXIocG9zaXRpb24pIDogMDtcbiAgICBpZiAoaXNOYU4ocG9zKSkge1xuICAgICAgcG9zID0gMDtcbiAgICB9XG4gICAgdmFyIHN0YXJ0ID0gTWF0aC5taW4oTWF0aC5tYXgocG9zLCAwKSwgc3RyaW5nTGVuZ3RoKTtcbiAgICByZXR1cm4gJGluZGV4T2YuY2FsbChzdHJpbmcsIHNlYXJjaFN0cmluZywgcG9zKSAhPSAtMTtcbiAgfVxuICBmdW5jdGlvbiByZXBlYXQoY291bnQpIHtcbiAgICBpZiAodGhpcyA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICB9XG4gICAgdmFyIHN0cmluZyA9IFN0cmluZyh0aGlzKTtcbiAgICB2YXIgbiA9IGNvdW50ID8gTnVtYmVyKGNvdW50KSA6IDA7XG4gICAgaWYgKGlzTmFOKG4pKSB7XG4gICAgICBuID0gMDtcbiAgICB9XG4gICAgaWYgKG4gPCAwIHx8IG4gPT0gSW5maW5pdHkpIHtcbiAgICAgIHRocm93IFJhbmdlRXJyb3IoKTtcbiAgICB9XG4gICAgaWYgKG4gPT0gMCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgd2hpbGUgKG4tLSkge1xuICAgICAgcmVzdWx0ICs9IHN0cmluZztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBmdW5jdGlvbiBjb2RlUG9pbnRBdChwb3NpdGlvbikge1xuICAgIGlmICh0aGlzID09IG51bGwpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIHZhciBzaXplID0gc3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgaW5kZXggPSBwb3NpdGlvbiA/IE51bWJlcihwb3NpdGlvbikgOiAwO1xuICAgIGlmIChpc05hTihpbmRleCkpIHtcbiAgICAgIGluZGV4ID0gMDtcbiAgICB9XG4gICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSBzaXplKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB2YXIgZmlyc3QgPSBzdHJpbmcuY2hhckNvZGVBdChpbmRleCk7XG4gICAgdmFyIHNlY29uZDtcbiAgICBpZiAoZmlyc3QgPj0gMHhEODAwICYmIGZpcnN0IDw9IDB4REJGRiAmJiBzaXplID4gaW5kZXggKyAxKSB7XG4gICAgICBzZWNvbmQgPSBzdHJpbmcuY2hhckNvZGVBdChpbmRleCArIDEpO1xuICAgICAgaWYgKHNlY29uZCA+PSAweERDMDAgJiYgc2Vjb25kIDw9IDB4REZGRikge1xuICAgICAgICByZXR1cm4gKGZpcnN0IC0gMHhEODAwKSAqIDB4NDAwICsgc2Vjb25kIC0gMHhEQzAwICsgMHgxMDAwMDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZpcnN0O1xuICB9XG4gIGZ1bmN0aW9uIHJhdyhjYWxsc2l0ZSkge1xuICAgIHZhciByYXcgPSBjYWxsc2l0ZS5yYXc7XG4gICAgdmFyIGxlbiA9IHJhdy5sZW5ndGggPj4+IDA7XG4gICAgaWYgKGxlbiA9PT0gMClcbiAgICAgIHJldHVybiAnJztcbiAgICB2YXIgcyA9ICcnO1xuICAgIHZhciBpID0gMDtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgcyArPSByYXdbaV07XG4gICAgICBpZiAoaSArIDEgPT09IGxlbilcbiAgICAgICAgcmV0dXJuIHM7XG4gICAgICBzICs9IGFyZ3VtZW50c1srK2ldO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBmcm9tQ29kZVBvaW50KCkge1xuICAgIHZhciBjb2RlVW5pdHMgPSBbXTtcbiAgICB2YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xuICAgIHZhciBoaWdoU3Vycm9nYXRlO1xuICAgIHZhciBsb3dTdXJyb2dhdGU7XG4gICAgdmFyIGluZGV4ID0gLTE7XG4gICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgaWYgKCFsZW5ndGgpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciBjb2RlUG9pbnQgPSBOdW1iZXIoYXJndW1lbnRzW2luZGV4XSk7XG4gICAgICBpZiAoIWlzRmluaXRlKGNvZGVQb2ludCkgfHwgY29kZVBvaW50IDwgMCB8fCBjb2RlUG9pbnQgPiAweDEwRkZGRiB8fCBmbG9vcihjb2RlUG9pbnQpICE9IGNvZGVQb2ludCkge1xuICAgICAgICB0aHJvdyBSYW5nZUVycm9yKCdJbnZhbGlkIGNvZGUgcG9pbnQ6ICcgKyBjb2RlUG9pbnQpO1xuICAgICAgfVxuICAgICAgaWYgKGNvZGVQb2ludCA8PSAweEZGRkYpIHtcbiAgICAgICAgY29kZVVuaXRzLnB1c2goY29kZVBvaW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwO1xuICAgICAgICBoaWdoU3Vycm9nYXRlID0gKGNvZGVQb2ludCA+PiAxMCkgKyAweEQ4MDA7XG4gICAgICAgIGxvd1N1cnJvZ2F0ZSA9IChjb2RlUG9pbnQgJSAweDQwMCkgKyAweERDMDA7XG4gICAgICAgIGNvZGVVbml0cy5wdXNoKGhpZ2hTdXJyb2dhdGUsIGxvd1N1cnJvZ2F0ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIGNvZGVVbml0cyk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBnZXQgc3RhcnRzV2l0aCgpIHtcbiAgICAgIHJldHVybiBzdGFydHNXaXRoO1xuICAgIH0sXG4gICAgZ2V0IGVuZHNXaXRoKCkge1xuICAgICAgcmV0dXJuIGVuZHNXaXRoO1xuICAgIH0sXG4gICAgZ2V0IGNvbnRhaW5zKCkge1xuICAgICAgcmV0dXJuIGNvbnRhaW5zO1xuICAgIH0sXG4gICAgZ2V0IHJlcGVhdCgpIHtcbiAgICAgIHJldHVybiByZXBlYXQ7XG4gICAgfSxcbiAgICBnZXQgY29kZVBvaW50QXQoKSB7XG4gICAgICByZXR1cm4gY29kZVBvaW50QXQ7XG4gICAgfSxcbiAgICBnZXQgcmF3KCkge1xuICAgICAgcmV0dXJuIHJhdztcbiAgICB9LFxuICAgIGdldCBmcm9tQ29kZVBvaW50KCkge1xuICAgICAgcmV0dXJuIGZyb21Db2RlUG9pbnQ7XG4gICAgfVxuICB9O1xufSk7XG5TeXN0ZW0ucmVnaXN0ZXIoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9wb2x5ZmlsbHNcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvcG9seWZpbGxzXCI7XG4gIHZhciBQcm9taXNlID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1Byb21pc2VcIikuUHJvbWlzZTtcbiAgdmFyICRfXzkgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvU3RyaW5nXCIpLFxuICAgICAgY29kZVBvaW50QXQgPSAkX185LmNvZGVQb2ludEF0LFxuICAgICAgY29udGFpbnMgPSAkX185LmNvbnRhaW5zLFxuICAgICAgZW5kc1dpdGggPSAkX185LmVuZHNXaXRoLFxuICAgICAgZnJvbUNvZGVQb2ludCA9ICRfXzkuZnJvbUNvZGVQb2ludCxcbiAgICAgIHJlcGVhdCA9ICRfXzkucmVwZWF0LFxuICAgICAgcmF3ID0gJF9fOS5yYXcsXG4gICAgICBzdGFydHNXaXRoID0gJF9fOS5zdGFydHNXaXRoO1xuICB2YXIgJF9fOSA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9BcnJheUl0ZXJhdG9yXCIpLFxuICAgICAgZW50cmllcyA9ICRfXzkuZW50cmllcyxcbiAgICAgIGtleXMgPSAkX185LmtleXMsXG4gICAgICB2YWx1ZXMgPSAkX185LnZhbHVlcztcbiAgZnVuY3Rpb24gbWF5YmVEZWZpbmVNZXRob2Qob2JqZWN0LCBuYW1lLCB2YWx1ZSkge1xuICAgIGlmICghKG5hbWUgaW4gb2JqZWN0KSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gbWF5YmVBZGRGdW5jdGlvbnMob2JqZWN0LCBmdW5jdGlvbnMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZ1bmN0aW9ucy5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgdmFyIG5hbWUgPSBmdW5jdGlvbnNbaV07XG4gICAgICB2YXIgdmFsdWUgPSBmdW5jdGlvbnNbaSArIDFdO1xuICAgICAgbWF5YmVEZWZpbmVNZXRob2Qob2JqZWN0LCBuYW1lLCB2YWx1ZSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHBvbHlmaWxsUHJvbWlzZShnbG9iYWwpIHtcbiAgICBpZiAoIWdsb2JhbC5Qcm9taXNlKVxuICAgICAgZ2xvYmFsLlByb21pc2UgPSBQcm9taXNlO1xuICB9XG4gIGZ1bmN0aW9uIHBvbHlmaWxsU3RyaW5nKFN0cmluZykge1xuICAgIG1heWJlQWRkRnVuY3Rpb25zKFN0cmluZy5wcm90b3R5cGUsIFsnY29kZVBvaW50QXQnLCBjb2RlUG9pbnRBdCwgJ2NvbnRhaW5zJywgY29udGFpbnMsICdlbmRzV2l0aCcsIGVuZHNXaXRoLCAnc3RhcnRzV2l0aCcsIHN0YXJ0c1dpdGgsICdyZXBlYXQnLCByZXBlYXRdKTtcbiAgICBtYXliZUFkZEZ1bmN0aW9ucyhTdHJpbmcsIFsnZnJvbUNvZGVQb2ludCcsIGZyb21Db2RlUG9pbnQsICdyYXcnLCByYXddKTtcbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbEFycmF5KEFycmF5LCBTeW1ib2wpIHtcbiAgICBtYXliZUFkZEZ1bmN0aW9ucyhBcnJheS5wcm90b3R5cGUsIFsnZW50cmllcycsIGVudHJpZXMsICdrZXlzJywga2V5cywgJ3ZhbHVlcycsIHZhbHVlc10pO1xuICAgIGlmIChTeW1ib2wgJiYgU3ltYm9sLml0ZXJhdG9yKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQXJyYXkucHJvdG90eXBlLCBTeW1ib2wuaXRlcmF0b3IsIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlcyxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbChnbG9iYWwpIHtcbiAgICBwb2x5ZmlsbFByb21pc2UoZ2xvYmFsKTtcbiAgICBwb2x5ZmlsbFN0cmluZyhnbG9iYWwuU3RyaW5nKTtcbiAgICBwb2x5ZmlsbEFycmF5KGdsb2JhbC5BcnJheSwgZ2xvYmFsLlN5bWJvbCk7XG4gIH1cbiAgcG9seWZpbGwodGhpcyk7XG4gIHZhciBzZXR1cEdsb2JhbHMgPSAkdHJhY2V1clJ1bnRpbWUuc2V0dXBHbG9iYWxzO1xuICAkdHJhY2V1clJ1bnRpbWUuc2V0dXBHbG9iYWxzID0gZnVuY3Rpb24oZ2xvYmFsKSB7XG4gICAgc2V0dXBHbG9iYWxzKGdsb2JhbCk7XG4gICAgcG9seWZpbGwoZ2xvYmFsKTtcbiAgfTtcbiAgcmV0dXJuIHt9O1xufSk7XG5TeXN0ZW0ucmVnaXN0ZXIoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxsLWltcG9ydFwiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxsLWltcG9ydFwiO1xuICB2YXIgJF9fMTEgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvcG9seWZpbGxzXCIpO1xuICByZXR1cm4ge307XG59KTtcblN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxsLWltcG9ydFwiICsgJycpO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pbnNlcnQtbW9kdWxlLWdsb2JhbHMvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qc1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLnRlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciB0eXBlcyA9IFtcbiAgICByZXF1aXJlKFwiLi9uZXh0VGlja1wiKSxcbiAgICByZXF1aXJlKFwiLi9tdXRhdGlvblwiKSxcbiAgICByZXF1aXJlKFwiLi9wb3N0TWVzc2FnZVwiKSxcbiAgICByZXF1aXJlKFwiLi9tZXNzYWdlQ2hhbm5lbFwiKSxcbiAgICByZXF1aXJlKFwiLi9zdGF0ZUNoYW5nZVwiKSxcbiAgICByZXF1aXJlKFwiLi90aW1lb3V0XCIpXG5dO1xudmFyIGhhbmRsZXJRdWV1ZSA9IFtdO1xuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIHRhc2ssXG4gICAgICAgIGlubmVyUXVldWUgPSBoYW5kbGVyUXVldWU7XG5cdGhhbmRsZXJRdWV1ZSA9IFtdO1xuXHQvKmpzbGludCBib3NzOiB0cnVlICovXG5cdHdoaWxlICh0YXNrID0gaW5uZXJRdWV1ZVtpKytdKSB7XG5cdFx0dGFzaygpO1xuXHR9XG59XG52YXIgbmV4dFRpY2s7XG52YXIgaSA9IC0xO1xudmFyIGxlbiA9IHR5cGVzLmxlbmd0aDtcbndoaWxlICgrKyBpIDwgbGVuKSB7XG4gICAgaWYgKHR5cGVzW2ldLnRlc3QoKSkge1xuICAgICAgICBuZXh0VGljayA9IHR5cGVzW2ldLmluc3RhbGwoZHJhaW5RdWV1ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRhc2spIHtcbiAgICB2YXIgbGVuLCBpLCBhcmdzO1xuICAgIHZhciBuVGFzayA9IHRhc2s7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIHR5cGVvZiB0YXNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICB3aGlsZSAoKytpIDwgYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICAgICAgblRhc2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0YXNrLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGlmICgobGVuID0gaGFuZGxlclF1ZXVlLnB1c2goblRhc2spKSA9PT0gMSkge1xuICAgICAgICBuZXh0VGljayhkcmFpblF1ZXVlKTtcbiAgICB9XG4gICAgcmV0dXJuIGxlbjtcbn07XG5tb2R1bGUuZXhwb3J0cy5jbGVhciA9IGZ1bmN0aW9uIChuKSB7XG4gICAgaWYgKG4gPD0gaGFuZGxlclF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBoYW5kbGVyUXVldWVbbiAtIDFdID0gZnVuY3Rpb24gKCkge307XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcblwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLnRlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBnbG9iYWwuTWVzc2FnZUNoYW5uZWwgIT09IFwidW5kZWZpbmVkXCI7XG59O1xuXG5leHBvcnRzLmluc3RhbGwgPSBmdW5jdGlvbiAoZnVuYykge1xuICAgIHZhciBjaGFubmVsID0gbmV3IGdsb2JhbC5NZXNzYWdlQ2hhbm5lbCgpO1xuICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZnVuYztcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKDApO1xuICAgIH07XG59O1xufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG5cInVzZSBzdHJpY3RcIjtcbi8vYmFzZWQgb2ZmIHJzdnBcbi8vaHR0cHM6Ly9naXRodWIuY29tL3RpbGRlaW8vcnN2cC5qcy9ibG9iL21hc3Rlci9saWIvcnN2cC9hc3luYy5qc1xuXG52YXIgTXV0YXRpb25PYnNlcnZlciA9IGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuXG5leHBvcnRzLnRlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIE11dGF0aW9uT2JzZXJ2ZXI7XG59O1xuXG5leHBvcnRzLmluc3RhbGwgPSBmdW5jdGlvbiAoaGFuZGxlKSB7XG4gICAgdmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoaGFuZGxlKTtcbiAgICB2YXIgZWxlbWVudCA9IGdsb2JhbC5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudCwgeyBhdHRyaWJ1dGVzOiB0cnVlIH0pO1xuXG4gICAgLy8gQ2hyb21lIE1lbW9yeSBMZWFrOiBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9OTM2NjFcbiAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcihcInVubG9hZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgb2JzZXJ2ZXIgPSBudWxsO1xuICAgIH0sIGZhbHNlKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImRyYWluUXVldWVcIiwgXCJkcmFpblF1ZXVlXCIpO1xuICAgIH07XG59O1xufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG5cInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMudGVzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBUaGUgdGVzdCBhZ2FpbnN0IGBpbXBvcnRTY3JpcHRzYCBwcmV2ZW50cyB0aGlzIGltcGxlbWVudGF0aW9uIGZyb20gYmVpbmcgaW5zdGFsbGVkIGluc2lkZSBhIHdlYiB3b3JrZXIsXG4gICAgLy8gd2hlcmUgYGdsb2JhbC5wb3N0TWVzc2FnZWAgbWVhbnMgc29tZXRoaW5nIGNvbXBsZXRlbHkgZGlmZmVyZW50IGFuZCBjYW5cInQgYmUgdXNlZCBmb3IgdGhpcyBwdXJwb3NlLlxuXG4gICAgaWYgKCFnbG9iYWwucG9zdE1lc3NhZ2UgfHwgZ2xvYmFsLmltcG9ydFNjcmlwdHMpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gdHJ1ZTtcbiAgICB2YXIgb2xkT25NZXNzYWdlID0gZ2xvYmFsLm9ubWVzc2FnZTtcbiAgICBnbG9iYWwub25tZXNzYWdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gZmFsc2U7XG4gICAgfTtcbiAgICBnbG9iYWwucG9zdE1lc3NhZ2UoXCJcIiwgXCIqXCIpO1xuICAgIGdsb2JhbC5vbm1lc3NhZ2UgPSBvbGRPbk1lc3NhZ2U7XG5cbiAgICByZXR1cm4gcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cztcbn07XG5cbmV4cG9ydHMuaW5zdGFsbCA9IGZ1bmN0aW9uIChmdW5jKSB7XG4gICAgdmFyIGNvZGVXb3JkID0gXCJjb20uY2FsdmlubWV0Y2FsZi5zZXRJbW1lZGlhdGVcIiArIE1hdGgucmFuZG9tKCk7XG4gICAgZnVuY3Rpb24gZ2xvYmFsTWVzc2FnZShldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQuc291cmNlID09PSBnbG9iYWwgJiYgZXZlbnQuZGF0YSA9PT0gY29kZVdvcmQpIHtcbiAgICAgICAgICAgIGZ1bmMoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGdsb2JhbE1lc3NhZ2UsIGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBnbG9iYWwuYXR0YWNoRXZlbnQoXCJvbm1lc3NhZ2VcIiwgZ2xvYmFsTWVzc2FnZSk7XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShjb2RlV29yZCwgXCIqXCIpO1xuICAgIH07XG59O1xufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG5cInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy50ZXN0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBcImRvY3VtZW50XCIgaW4gZ2xvYmFsICYmIFwib25yZWFkeXN0YXRlY2hhbmdlXCIgaW4gZ2xvYmFsLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG59O1xuXG5leHBvcnRzLmluc3RhbGwgPSBmdW5jdGlvbiAoaGFuZGxlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAvLyBDcmVhdGUgYSA8c2NyaXB0PiBlbGVtZW50OyBpdHMgcmVhZHlzdGF0ZWNoYW5nZSBldmVudCB3aWxsIGJlIGZpcmVkIGFzeW5jaHJvbm91c2x5IG9uY2UgaXQgaXMgaW5zZXJ0ZWRcbiAgICAgICAgLy8gaW50byB0aGUgZG9jdW1lbnQuIERvIHNvLCB0aHVzIHF1ZXVpbmcgdXAgdGhlIHRhc2suIFJlbWVtYmVyIHRvIGNsZWFuIHVwIG9uY2UgaXQncyBiZWVuIGNhbGxlZC5cbiAgICAgICAgdmFyIHNjcmlwdEVsID0gZ2xvYmFsLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgIHNjcmlwdEVsLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGhhbmRsZSgpO1xuXG4gICAgICAgICAgICBzY3JpcHRFbC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgICAgICAgICAgc2NyaXB0RWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHRFbCk7XG4gICAgICAgICAgICBzY3JpcHRFbCA9IG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIGdsb2JhbC5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoc2NyaXB0RWwpO1xuXG4gICAgICAgIHJldHVybiBoYW5kbGU7XG4gICAgfTtcbn07XG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy50ZXN0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0cnVlO1xufTtcblxuZXhwb3J0cy5pbnN0YWxsID0gZnVuY3Rpb24gKHQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBzZXRUaW1lb3V0KHQsIDApO1xuICAgIH07XG59OyIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbiFmdW5jdGlvbihlKXtpZihcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyltb2R1bGUuZXhwb3J0cz1lKCk7ZWxzZSBpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQpZGVmaW5lKGUpO2Vsc2V7dmFyIGY7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz9mPXdpbmRvdzpcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2Y9Z2xvYmFsOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmJiYoZj1zZWxmKSxmLmphZGU9ZSgpfX0oZnVuY3Rpb24oKXt2YXIgZGVmaW5lLG1vZHVsZSxleHBvcnRzO3JldHVybiAoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSh7MTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogTWVyZ2UgdHdvIGF0dHJpYnV0ZSBvYmplY3RzIGdpdmluZyBwcmVjZWRlbmNlXG4gKiB0byB2YWx1ZXMgaW4gb2JqZWN0IGBiYC4gQ2xhc3NlcyBhcmUgc3BlY2lhbC1jYXNlZFxuICogYWxsb3dpbmcgZm9yIGFycmF5cyBhbmQgbWVyZ2luZy9qb2luaW5nIGFwcHJvcHJpYXRlbHlcbiAqIHJlc3VsdGluZyBpbiBhIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYVxuICogQHBhcmFtIHtPYmplY3R9IGJcbiAqIEByZXR1cm4ge09iamVjdH0gYVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5tZXJnZSA9IGZ1bmN0aW9uIG1lcmdlKGEsIGIpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICB2YXIgYXR0cnMgPSBhWzBdO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgICAgYXR0cnMgPSBtZXJnZShhdHRycywgYVtpXSk7XG4gICAgfVxuICAgIHJldHVybiBhdHRycztcbiAgfVxuICB2YXIgYWMgPSBhWydjbGFzcyddO1xuICB2YXIgYmMgPSBiWydjbGFzcyddO1xuXG4gIGlmIChhYyB8fCBiYykge1xuICAgIGFjID0gYWMgfHwgW107XG4gICAgYmMgPSBiYyB8fCBbXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYWMpKSBhYyA9IFthY107XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGJjKSkgYmMgPSBbYmNdO1xuICAgIGFbJ2NsYXNzJ10gPSBhYy5jb25jYXQoYmMpLmZpbHRlcihudWxscyk7XG4gIH1cblxuICBmb3IgKHZhciBrZXkgaW4gYikge1xuICAgIGlmIChrZXkgIT0gJ2NsYXNzJykge1xuICAgICAgYVtrZXldID0gYltrZXldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhO1xufTtcblxuLyoqXG4gKiBGaWx0ZXIgbnVsbCBgdmFsYHMuXG4gKlxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBudWxscyh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPSBudWxsICYmIHZhbCAhPT0gJyc7XG59XG5cbi8qKlxuICogam9pbiBhcnJheSBhcyBjbGFzc2VzLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuam9pbkNsYXNzZXMgPSBqb2luQ2xhc3NlcztcbmZ1bmN0aW9uIGpvaW5DbGFzc2VzKHZhbCkge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWwpID8gdmFsLm1hcChqb2luQ2xhc3NlcykuZmlsdGVyKG51bGxzKS5qb2luKCcgJykgOiB2YWw7XG59XG5cbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBjbGFzc2VzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGNsYXNzZXNcbiAqIEBwYXJhbSB7QXJyYXkuPEJvb2xlYW4+fSBlc2NhcGVkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuY2xzID0gZnVuY3Rpb24gY2xzKGNsYXNzZXMsIGVzY2FwZWQpIHtcbiAgdmFyIGJ1ZiA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZXNjYXBlZCAmJiBlc2NhcGVkW2ldKSB7XG4gICAgICBidWYucHVzaChleHBvcnRzLmVzY2FwZShqb2luQ2xhc3NlcyhbY2xhc3Nlc1tpXV0pKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1Zi5wdXNoKGpvaW5DbGFzc2VzKGNsYXNzZXNbaV0pKTtcbiAgICB9XG4gIH1cbiAgdmFyIHRleHQgPSBqb2luQ2xhc3NlcyhidWYpO1xuICBpZiAodGV4dC5sZW5ndGgpIHtcbiAgICByZXR1cm4gJyBjbGFzcz1cIicgKyB0ZXh0ICsgJ1wiJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn07XG5cbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBhdHRyaWJ1dGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHBhcmFtIHtCb29sZWFufSBlc2NhcGVkXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHRlcnNlXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuYXR0ciA9IGZ1bmN0aW9uIGF0dHIoa2V5LCB2YWwsIGVzY2FwZWQsIHRlcnNlKSB7XG4gIGlmICgnYm9vbGVhbicgPT0gdHlwZW9mIHZhbCB8fCBudWxsID09IHZhbCkge1xuICAgIGlmICh2YWwpIHtcbiAgICAgIHJldHVybiAnICcgKyAodGVyc2UgPyBrZXkgOiBrZXkgKyAnPVwiJyArIGtleSArICdcIicpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9IGVsc2UgaWYgKDAgPT0ga2V5LmluZGV4T2YoJ2RhdGEnKSAmJiAnc3RyaW5nJyAhPSB0eXBlb2YgdmFsKSB7XG4gICAgcmV0dXJuICcgJyArIGtleSArIFwiPSdcIiArIEpTT04uc3RyaW5naWZ5KHZhbCkucmVwbGFjZSgvJy9nLCAnJmFwb3M7JykgKyBcIidcIjtcbiAgfSBlbHNlIGlmIChlc2NhcGVkKSB7XG4gICAgcmV0dXJuICcgJyArIGtleSArICc9XCInICsgZXhwb3J0cy5lc2NhcGUodmFsKSArICdcIic7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICcgJyArIGtleSArICc9XCInICsgdmFsICsgJ1wiJztcbiAgfVxufTtcblxuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGF0dHJpYnV0ZXMgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlc2NhcGVkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuYXR0cnMgPSBmdW5jdGlvbiBhdHRycyhvYmosIHRlcnNlKXtcbiAgdmFyIGJ1ZiA9IFtdO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcblxuICBpZiAoa2V5cy5sZW5ndGgpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldXG4gICAgICAgICwgdmFsID0gb2JqW2tleV07XG5cbiAgICAgIGlmICgnY2xhc3MnID09IGtleSkge1xuICAgICAgICBpZiAodmFsID0gam9pbkNsYXNzZXModmFsKSkge1xuICAgICAgICAgIGJ1Zi5wdXNoKCcgJyArIGtleSArICc9XCInICsgdmFsICsgJ1wiJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1Zi5wdXNoKGV4cG9ydHMuYXR0cihrZXksIHZhbCwgZmFsc2UsIHRlcnNlKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ1Zi5qb2luKCcnKTtcbn07XG5cbi8qKlxuICogRXNjYXBlIHRoZSBnaXZlbiBzdHJpbmcgb2YgYGh0bWxgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBodG1sXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLmVzY2FwZSA9IGZ1bmN0aW9uIGVzY2FwZShodG1sKXtcbiAgdmFyIHJlc3VsdCA9IFN0cmluZyhodG1sKVxuICAgIC5yZXBsYWNlKC8mL2csICcmYW1wOycpXG4gICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuICAgIC5yZXBsYWNlKC8+L2csICcmZ3Q7JylcbiAgICAucmVwbGFjZSgvXCIvZywgJyZxdW90OycpO1xuICBpZiAocmVzdWx0ID09PSAnJyArIGh0bWwpIHJldHVybiBodG1sO1xuICBlbHNlIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIFJlLXRocm93IHRoZSBnaXZlbiBgZXJyYCBpbiBjb250ZXh0IHRvIHRoZVxuICogdGhlIGphZGUgaW4gYGZpbGVuYW1lYCBhdCB0aGUgZ2l2ZW4gYGxpbmVub2AuXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyXG4gKiBAcGFyYW0ge1N0cmluZ30gZmlsZW5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSBsaW5lbm9cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMucmV0aHJvdyA9IGZ1bmN0aW9uIHJldGhyb3coZXJyLCBmaWxlbmFtZSwgbGluZW5vLCBzdHIpe1xuICBpZiAoIShlcnIgaW5zdGFuY2VvZiBFcnJvcikpIHRocm93IGVycjtcbiAgaWYgKCh0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnIHx8ICFmaWxlbmFtZSkgJiYgIXN0cikge1xuICAgIGVyci5tZXNzYWdlICs9ICcgb24gbGluZSAnICsgbGluZW5vO1xuICAgIHRocm93IGVycjtcbiAgfVxuICB0cnkge1xuICAgIHN0ciA9ICBzdHIgfHwgX2RlcmVxXygnZnMnKS5yZWFkRmlsZVN5bmMoZmlsZW5hbWUsICd1dGY4JylcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICByZXRocm93KGVyciwgbnVsbCwgbGluZW5vKVxuICB9XG4gIHZhciBjb250ZXh0ID0gM1xuICAgICwgbGluZXMgPSBzdHIuc3BsaXQoJ1xcbicpXG4gICAgLCBzdGFydCA9IE1hdGgubWF4KGxpbmVubyAtIGNvbnRleHQsIDApXG4gICAgLCBlbmQgPSBNYXRoLm1pbihsaW5lcy5sZW5ndGgsIGxpbmVubyArIGNvbnRleHQpO1xuXG4gIC8vIEVycm9yIGNvbnRleHRcbiAgdmFyIGNvbnRleHQgPSBsaW5lcy5zbGljZShzdGFydCwgZW5kKS5tYXAoZnVuY3Rpb24obGluZSwgaSl7XG4gICAgdmFyIGN1cnIgPSBpICsgc3RhcnQgKyAxO1xuICAgIHJldHVybiAoY3VyciA9PSBsaW5lbm8gPyAnICA+ICcgOiAnICAgICcpXG4gICAgICArIGN1cnJcbiAgICAgICsgJ3wgJ1xuICAgICAgKyBsaW5lO1xuICB9KS5qb2luKCdcXG4nKTtcblxuICAvLyBBbHRlciBleGNlcHRpb24gbWVzc2FnZVxuICBlcnIucGF0aCA9IGZpbGVuYW1lO1xuICBlcnIubWVzc2FnZSA9IChmaWxlbmFtZSB8fCAnSmFkZScpICsgJzonICsgbGluZW5vXG4gICAgKyAnXFxuJyArIGNvbnRleHQgKyAnXFxuXFxuJyArIGVyci5tZXNzYWdlO1xuICB0aHJvdyBlcnI7XG59O1xuXG59LHtcImZzXCI6Mn1dLDI6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuXG59LHt9XX0se30sWzFdKVxuKDEpXG59KTtcbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChCdWZmZXIpe1xuLy8gICAgIHV1aWQuanNcbi8vXG4vLyAgICAgQ29weXJpZ2h0IChjKSAyMDEwLTIwMTIgUm9iZXJ0IEtpZWZmZXJcbi8vICAgICBNSVQgTGljZW5zZSAtIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblxuKGZ1bmN0aW9uKCkge1xuICB2YXIgX2dsb2JhbCA9IHRoaXM7XG5cbiAgLy8gVW5pcXVlIElEIGNyZWF0aW9uIHJlcXVpcmVzIGEgaGlnaCBxdWFsaXR5IHJhbmRvbSAjIGdlbmVyYXRvci4gIFdlIGZlYXR1cmVcbiAgLy8gZGV0ZWN0IHRvIGRldGVybWluZSB0aGUgYmVzdCBSTkcgc291cmNlLCBub3JtYWxpemluZyB0byBhIGZ1bmN0aW9uIHRoYXRcbiAgLy8gcmV0dXJucyAxMjgtYml0cyBvZiByYW5kb21uZXNzLCBzaW5jZSB0aGF0J3Mgd2hhdCdzIHVzdWFsbHkgcmVxdWlyZWRcbiAgdmFyIF9ybmc7XG5cbiAgLy8gTm9kZS5qcyBjcnlwdG8tYmFzZWQgUk5HIC0gaHR0cDovL25vZGVqcy5vcmcvZG9jcy92MC42LjIvYXBpL2NyeXB0by5odG1sXG4gIC8vXG4gIC8vIE1vZGVyYXRlbHkgZmFzdCwgaGlnaCBxdWFsaXR5XG4gIGlmICh0eXBlb2YocmVxdWlyZSkgPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRyeSB7XG4gICAgICB2YXIgX3JiID0gcmVxdWlyZSgnY3J5cHRvJykucmFuZG9tQnl0ZXM7XG4gICAgICBfcm5nID0gX3JiICYmIGZ1bmN0aW9uKCkge3JldHVybiBfcmIoMTYpO307XG4gICAgfSBjYXRjaChlKSB7fVxuICB9XG5cbiAgaWYgKCFfcm5nICYmIF9nbG9iYWwuY3J5cHRvICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAvLyBXSEFUV0cgY3J5cHRvLWJhc2VkIFJORyAtIGh0dHA6Ly93aWtpLndoYXR3Zy5vcmcvd2lraS9DcnlwdG9cbiAgICAvL1xuICAgIC8vIE1vZGVyYXRlbHkgZmFzdCwgaGlnaCBxdWFsaXR5XG4gICAgdmFyIF9ybmRzOCA9IG5ldyBVaW50OEFycmF5KDE2KTtcbiAgICBfcm5nID0gZnVuY3Rpb24gd2hhdHdnUk5HKCkge1xuICAgICAgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhfcm5kczgpO1xuICAgICAgcmV0dXJuIF9ybmRzODtcbiAgICB9O1xuICB9XG5cbiAgaWYgKCFfcm5nKSB7XG4gICAgLy8gTWF0aC5yYW5kb20oKS1iYXNlZCAoUk5HKVxuICAgIC8vXG4gICAgLy8gSWYgYWxsIGVsc2UgZmFpbHMsIHVzZSBNYXRoLnJhbmRvbSgpLiAgSXQncyBmYXN0LCBidXQgaXMgb2YgdW5zcGVjaWZpZWRcbiAgICAvLyBxdWFsaXR5LlxuICAgIHZhciAgX3JuZHMgPSBuZXcgQXJyYXkoMTYpO1xuICAgIF9ybmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCByOyBpIDwgMTY7IGkrKykge1xuICAgICAgICBpZiAoKGkgJiAweDAzKSA9PT0gMCkgciA9IE1hdGgucmFuZG9tKCkgKiAweDEwMDAwMDAwMDtcbiAgICAgICAgX3JuZHNbaV0gPSByID4+PiAoKGkgJiAweDAzKSA8PCAzKSAmIDB4ZmY7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBfcm5kcztcbiAgICB9O1xuICB9XG5cbiAgLy8gQnVmZmVyIGNsYXNzIHRvIHVzZVxuICB2YXIgQnVmZmVyQ2xhc3MgPSB0eXBlb2YoQnVmZmVyKSA9PSAnZnVuY3Rpb24nID8gQnVmZmVyIDogQXJyYXk7XG5cbiAgLy8gTWFwcyBmb3IgbnVtYmVyIDwtPiBoZXggc3RyaW5nIGNvbnZlcnNpb25cbiAgdmFyIF9ieXRlVG9IZXggPSBbXTtcbiAgdmFyIF9oZXhUb0J5dGUgPSB7fTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7IGkrKykge1xuICAgIF9ieXRlVG9IZXhbaV0gPSAoaSArIDB4MTAwKS50b1N0cmluZygxNikuc3Vic3RyKDEpO1xuICAgIF9oZXhUb0J5dGVbX2J5dGVUb0hleFtpXV0gPSBpO1xuICB9XG5cbiAgLy8gKipgcGFyc2UoKWAgLSBQYXJzZSBhIFVVSUQgaW50byBpdCdzIGNvbXBvbmVudCBieXRlcyoqXG4gIGZ1bmN0aW9uIHBhcnNlKHMsIGJ1Ziwgb2Zmc2V0KSB7XG4gICAgdmFyIGkgPSAoYnVmICYmIG9mZnNldCkgfHwgMCwgaWkgPSAwO1xuXG4gICAgYnVmID0gYnVmIHx8IFtdO1xuICAgIHMudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bMC05YS1mXXsyfS9nLCBmdW5jdGlvbihvY3QpIHtcbiAgICAgIGlmIChpaSA8IDE2KSB7IC8vIERvbid0IG92ZXJmbG93IVxuICAgICAgICBidWZbaSArIGlpKytdID0gX2hleFRvQnl0ZVtvY3RdO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gWmVybyBvdXQgcmVtYWluaW5nIGJ5dGVzIGlmIHN0cmluZyB3YXMgc2hvcnRcbiAgICB3aGlsZSAoaWkgPCAxNikge1xuICAgICAgYnVmW2kgKyBpaSsrXSA9IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZjtcbiAgfVxuXG4gIC8vICoqYHVucGFyc2UoKWAgLSBDb252ZXJ0IFVVSUQgYnl0ZSBhcnJheSAoYWxhIHBhcnNlKCkpIGludG8gYSBzdHJpbmcqKlxuICBmdW5jdGlvbiB1bnBhcnNlKGJ1Ziwgb2Zmc2V0KSB7XG4gICAgdmFyIGkgPSBvZmZzZXQgfHwgMCwgYnRoID0gX2J5dGVUb0hleDtcbiAgICByZXR1cm4gIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICtcbiAgICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICtcbiAgICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICtcbiAgICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dO1xuICB9XG5cbiAgLy8gKipgdjEoKWAgLSBHZW5lcmF0ZSB0aW1lLWJhc2VkIFVVSUQqKlxuICAvL1xuICAvLyBJbnNwaXJlZCBieSBodHRwczovL2dpdGh1Yi5jb20vTGlvc0svVVVJRC5qc1xuICAvLyBhbmQgaHR0cDovL2RvY3MucHl0aG9uLm9yZy9saWJyYXJ5L3V1aWQuaHRtbFxuXG4gIC8vIHJhbmRvbSAjJ3Mgd2UgbmVlZCB0byBpbml0IG5vZGUgYW5kIGNsb2Nrc2VxXG4gIHZhciBfc2VlZEJ5dGVzID0gX3JuZygpO1xuXG4gIC8vIFBlciA0LjUsIGNyZWF0ZSBhbmQgNDgtYml0IG5vZGUgaWQsICg0NyByYW5kb20gYml0cyArIG11bHRpY2FzdCBiaXQgPSAxKVxuICB2YXIgX25vZGVJZCA9IFtcbiAgICBfc2VlZEJ5dGVzWzBdIHwgMHgwMSxcbiAgICBfc2VlZEJ5dGVzWzFdLCBfc2VlZEJ5dGVzWzJdLCBfc2VlZEJ5dGVzWzNdLCBfc2VlZEJ5dGVzWzRdLCBfc2VlZEJ5dGVzWzVdXG4gIF07XG5cbiAgLy8gUGVyIDQuMi4yLCByYW5kb21pemUgKDE0IGJpdCkgY2xvY2tzZXFcbiAgdmFyIF9jbG9ja3NlcSA9IChfc2VlZEJ5dGVzWzZdIDw8IDggfCBfc2VlZEJ5dGVzWzddKSAmIDB4M2ZmZjtcblxuICAvLyBQcmV2aW91cyB1dWlkIGNyZWF0aW9uIHRpbWVcbiAgdmFyIF9sYXN0TVNlY3MgPSAwLCBfbGFzdE5TZWNzID0gMDtcblxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2Jyb29mYS9ub2RlLXV1aWQgZm9yIEFQSSBkZXRhaWxzXG4gIGZ1bmN0aW9uIHYxKG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gICAgdmFyIGkgPSBidWYgJiYgb2Zmc2V0IHx8IDA7XG4gICAgdmFyIGIgPSBidWYgfHwgW107XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHZhciBjbG9ja3NlcSA9IG9wdGlvbnMuY2xvY2tzZXEgIT0gbnVsbCA/IG9wdGlvbnMuY2xvY2tzZXEgOiBfY2xvY2tzZXE7XG5cbiAgICAvLyBVVUlEIHRpbWVzdGFtcHMgYXJlIDEwMCBuYW5vLXNlY29uZCB1bml0cyBzaW5jZSB0aGUgR3JlZ29yaWFuIGVwb2NoLFxuICAgIC8vICgxNTgyLTEwLTE1IDAwOjAwKS4gIEpTTnVtYmVycyBhcmVuJ3QgcHJlY2lzZSBlbm91Z2ggZm9yIHRoaXMsIHNvXG4gICAgLy8gdGltZSBpcyBoYW5kbGVkIGludGVybmFsbHkgYXMgJ21zZWNzJyAoaW50ZWdlciBtaWxsaXNlY29uZHMpIGFuZCAnbnNlY3MnXG4gICAgLy8gKDEwMC1uYW5vc2Vjb25kcyBvZmZzZXQgZnJvbSBtc2Vjcykgc2luY2UgdW5peCBlcG9jaCwgMTk3MC0wMS0wMSAwMDowMC5cbiAgICB2YXIgbXNlY3MgPSBvcHRpb25zLm1zZWNzICE9IG51bGwgPyBvcHRpb25zLm1zZWNzIDogbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICAvLyBQZXIgNC4yLjEuMiwgdXNlIGNvdW50IG9mIHV1aWQncyBnZW5lcmF0ZWQgZHVyaW5nIHRoZSBjdXJyZW50IGNsb2NrXG4gICAgLy8gY3ljbGUgdG8gc2ltdWxhdGUgaGlnaGVyIHJlc29sdXRpb24gY2xvY2tcbiAgICB2YXIgbnNlY3MgPSBvcHRpb25zLm5zZWNzICE9IG51bGwgPyBvcHRpb25zLm5zZWNzIDogX2xhc3ROU2VjcyArIDE7XG5cbiAgICAvLyBUaW1lIHNpbmNlIGxhc3QgdXVpZCBjcmVhdGlvbiAoaW4gbXNlY3MpXG4gICAgdmFyIGR0ID0gKG1zZWNzIC0gX2xhc3RNU2VjcykgKyAobnNlY3MgLSBfbGFzdE5TZWNzKS8xMDAwMDtcblxuICAgIC8vIFBlciA0LjIuMS4yLCBCdW1wIGNsb2Nrc2VxIG9uIGNsb2NrIHJlZ3Jlc3Npb25cbiAgICBpZiAoZHQgPCAwICYmIG9wdGlvbnMuY2xvY2tzZXEgPT0gbnVsbCkge1xuICAgICAgY2xvY2tzZXEgPSBjbG9ja3NlcSArIDEgJiAweDNmZmY7XG4gICAgfVxuXG4gICAgLy8gUmVzZXQgbnNlY3MgaWYgY2xvY2sgcmVncmVzc2VzIChuZXcgY2xvY2tzZXEpIG9yIHdlJ3ZlIG1vdmVkIG9udG8gYSBuZXdcbiAgICAvLyB0aW1lIGludGVydmFsXG4gICAgaWYgKChkdCA8IDAgfHwgbXNlY3MgPiBfbGFzdE1TZWNzKSAmJiBvcHRpb25zLm5zZWNzID09IG51bGwpIHtcbiAgICAgIG5zZWNzID0gMDtcbiAgICB9XG5cbiAgICAvLyBQZXIgNC4yLjEuMiBUaHJvdyBlcnJvciBpZiB0b28gbWFueSB1dWlkcyBhcmUgcmVxdWVzdGVkXG4gICAgaWYgKG5zZWNzID49IDEwMDAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3V1aWQudjEoKTogQ2FuXFwndCBjcmVhdGUgbW9yZSB0aGFuIDEwTSB1dWlkcy9zZWMnKTtcbiAgICB9XG5cbiAgICBfbGFzdE1TZWNzID0gbXNlY3M7XG4gICAgX2xhc3ROU2VjcyA9IG5zZWNzO1xuICAgIF9jbG9ja3NlcSA9IGNsb2Nrc2VxO1xuXG4gICAgLy8gUGVyIDQuMS40IC0gQ29udmVydCBmcm9tIHVuaXggZXBvY2ggdG8gR3JlZ29yaWFuIGVwb2NoXG4gICAgbXNlY3MgKz0gMTIyMTkyOTI4MDAwMDA7XG5cbiAgICAvLyBgdGltZV9sb3dgXG4gICAgdmFyIHRsID0gKChtc2VjcyAmIDB4ZmZmZmZmZikgKiAxMDAwMCArIG5zZWNzKSAlIDB4MTAwMDAwMDAwO1xuICAgIGJbaSsrXSA9IHRsID4+PiAyNCAmIDB4ZmY7XG4gICAgYltpKytdID0gdGwgPj4+IDE2ICYgMHhmZjtcbiAgICBiW2krK10gPSB0bCA+Pj4gOCAmIDB4ZmY7XG4gICAgYltpKytdID0gdGwgJiAweGZmO1xuXG4gICAgLy8gYHRpbWVfbWlkYFxuICAgIHZhciB0bWggPSAobXNlY3MgLyAweDEwMDAwMDAwMCAqIDEwMDAwKSAmIDB4ZmZmZmZmZjtcbiAgICBiW2krK10gPSB0bWggPj4+IDggJiAweGZmO1xuICAgIGJbaSsrXSA9IHRtaCAmIDB4ZmY7XG5cbiAgICAvLyBgdGltZV9oaWdoX2FuZF92ZXJzaW9uYFxuICAgIGJbaSsrXSA9IHRtaCA+Pj4gMjQgJiAweGYgfCAweDEwOyAvLyBpbmNsdWRlIHZlcnNpb25cbiAgICBiW2krK10gPSB0bWggPj4+IDE2ICYgMHhmZjtcblxuICAgIC8vIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYCAoUGVyIDQuMi4yIC0gaW5jbHVkZSB2YXJpYW50KVxuICAgIGJbaSsrXSA9IGNsb2Nrc2VxID4+PiA4IHwgMHg4MDtcblxuICAgIC8vIGBjbG9ja19zZXFfbG93YFxuICAgIGJbaSsrXSA9IGNsb2Nrc2VxICYgMHhmZjtcblxuICAgIC8vIGBub2RlYFxuICAgIHZhciBub2RlID0gb3B0aW9ucy5ub2RlIHx8IF9ub2RlSWQ7XG4gICAgZm9yICh2YXIgbiA9IDA7IG4gPCA2OyBuKyspIHtcbiAgICAgIGJbaSArIG5dID0gbm9kZVtuXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnVmID8gYnVmIDogdW5wYXJzZShiKTtcbiAgfVxuXG4gIC8vICoqYHY0KClgIC0gR2VuZXJhdGUgcmFuZG9tIFVVSUQqKlxuXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYnJvb2ZhL25vZGUtdXVpZCBmb3IgQVBJIGRldGFpbHNcbiAgZnVuY3Rpb24gdjQob3B0aW9ucywgYnVmLCBvZmZzZXQpIHtcbiAgICAvLyBEZXByZWNhdGVkIC0gJ2Zvcm1hdCcgYXJndW1lbnQsIGFzIHN1cHBvcnRlZCBpbiB2MS4yXG4gICAgdmFyIGkgPSBidWYgJiYgb2Zmc2V0IHx8IDA7XG5cbiAgICBpZiAodHlwZW9mKG9wdGlvbnMpID09ICdzdHJpbmcnKSB7XG4gICAgICBidWYgPSBvcHRpb25zID09ICdiaW5hcnknID8gbmV3IEJ1ZmZlckNsYXNzKDE2KSA6IG51bGw7XG4gICAgICBvcHRpb25zID0gbnVsbDtcbiAgICB9XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICB2YXIgcm5kcyA9IG9wdGlvbnMucmFuZG9tIHx8IChvcHRpb25zLnJuZyB8fCBfcm5nKSgpO1xuXG4gICAgLy8gUGVyIDQuNCwgc2V0IGJpdHMgZm9yIHZlcnNpb24gYW5kIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYFxuICAgIHJuZHNbNl0gPSAocm5kc1s2XSAmIDB4MGYpIHwgMHg0MDtcbiAgICBybmRzWzhdID0gKHJuZHNbOF0gJiAweDNmKSB8IDB4ODA7XG5cbiAgICAvLyBDb3B5IGJ5dGVzIHRvIGJ1ZmZlciwgaWYgcHJvdmlkZWRcbiAgICBpZiAoYnVmKSB7XG4gICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgMTY7IGlpKyspIHtcbiAgICAgICAgYnVmW2kgKyBpaV0gPSBybmRzW2lpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYnVmIHx8IHVucGFyc2Uocm5kcyk7XG4gIH1cblxuICAvLyBFeHBvcnQgcHVibGljIEFQSVxuICB2YXIgdXVpZCA9IHY0O1xuICB1dWlkLnYxID0gdjE7XG4gIHV1aWQudjQgPSB2NDtcbiAgdXVpZC5wYXJzZSA9IHBhcnNlO1xuICB1dWlkLnVucGFyc2UgPSB1bnBhcnNlO1xuICB1dWlkLkJ1ZmZlckNsYXNzID0gQnVmZmVyQ2xhc3M7XG5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIFB1Ymxpc2ggYXMgQU1EIG1vZHVsZVxuICAgIGRlZmluZShmdW5jdGlvbigpIHtyZXR1cm4gdXVpZDt9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YobW9kdWxlKSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIC8vIFB1Ymxpc2ggYXMgbm9kZS5qcyBtb2R1bGVcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHV1aWQ7XG4gIH0gZWxzZSB7XG4gICAgLy8gUHVibGlzaCBhcyBnbG9iYWwgKGluIGJyb3dzZXJzKVxuICAgIHZhciBfcHJldmlvdXNSb290ID0gX2dsb2JhbC51dWlkO1xuXG4gICAgLy8gKipgbm9Db25mbGljdCgpYCAtIChicm93c2VyIG9ubHkpIHRvIHJlc2V0IGdsb2JhbCAndXVpZCcgdmFyKipcbiAgICB1dWlkLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICAgIF9nbG9iYWwudXVpZCA9IF9wcmV2aW91c1Jvb3Q7XG4gICAgICByZXR1cm4gdXVpZDtcbiAgICB9O1xuXG4gICAgX2dsb2JhbC51dWlkID0gdXVpZDtcbiAgfVxufSkuY2FsbCh0aGlzKTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyKSIsIi8qIVxuICogbnVtZXJhbC5qc1xuICogdmVyc2lvbiA6IDEuNS4zXG4gKiBhdXRob3IgOiBBZGFtIERyYXBlclxuICogbGljZW5zZSA6IE1JVFxuICogaHR0cDovL2FkYW13ZHJhcGVyLmdpdGh1Yi5jb20vTnVtZXJhbC1qcy9cbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBDb25zdGFudHNcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICB2YXIgbnVtZXJhbCxcbiAgICAgICAgVkVSU0lPTiA9ICcxLjUuMycsXG4gICAgICAgIC8vIGludGVybmFsIHN0b3JhZ2UgZm9yIGxhbmd1YWdlIGNvbmZpZyBmaWxlc1xuICAgICAgICBsYW5ndWFnZXMgPSB7fSxcbiAgICAgICAgY3VycmVudExhbmd1YWdlID0gJ2VuJyxcbiAgICAgICAgemVyb0Zvcm1hdCA9IG51bGwsXG4gICAgICAgIGRlZmF1bHRGb3JtYXQgPSAnMCwwJyxcbiAgICAgICAgLy8gY2hlY2sgZm9yIG5vZGVKU1xuICAgICAgICBoYXNNb2R1bGUgPSAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpO1xuXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIENvbnN0cnVjdG9yc1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4gICAgLy8gTnVtZXJhbCBwcm90b3R5cGUgb2JqZWN0XG4gICAgZnVuY3Rpb24gTnVtZXJhbCAobnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX3ZhbHVlID0gbnVtYmVyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEltcGxlbWVudGF0aW9uIG9mIHRvRml4ZWQoKSB0aGF0IHRyZWF0cyBmbG9hdHMgbW9yZSBsaWtlIGRlY2ltYWxzXG4gICAgICpcbiAgICAgKiBGaXhlcyBiaW5hcnkgcm91bmRpbmcgaXNzdWVzIChlZy4gKDAuNjE1KS50b0ZpeGVkKDIpID09PSAnMC42MScpIHRoYXQgcHJlc2VudFxuICAgICAqIHByb2JsZW1zIGZvciBhY2NvdW50aW5nLSBhbmQgZmluYW5jZS1yZWxhdGVkIHNvZnR3YXJlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRvRml4ZWQgKHZhbHVlLCBwcmVjaXNpb24sIHJvdW5kaW5nRnVuY3Rpb24sIG9wdGlvbmFscykge1xuICAgICAgICB2YXIgcG93ZXIgPSBNYXRoLnBvdygxMCwgcHJlY2lzaW9uKSxcbiAgICAgICAgICAgIG9wdGlvbmFsc1JlZ0V4cCxcbiAgICAgICAgICAgIG91dHB1dDtcbiAgICAgICAgICAgIFxuICAgICAgICAvL3JvdW5kaW5nRnVuY3Rpb24gPSAocm91bmRpbmdGdW5jdGlvbiAhPT0gdW5kZWZpbmVkID8gcm91bmRpbmdGdW5jdGlvbiA6IE1hdGgucm91bmQpO1xuICAgICAgICAvLyBNdWx0aXBseSB1cCBieSBwcmVjaXNpb24sIHJvdW5kIGFjY3VyYXRlbHksIHRoZW4gZGl2aWRlIGFuZCB1c2UgbmF0aXZlIHRvRml4ZWQoKTpcbiAgICAgICAgb3V0cHV0ID0gKHJvdW5kaW5nRnVuY3Rpb24odmFsdWUgKiBwb3dlcikgLyBwb3dlcikudG9GaXhlZChwcmVjaXNpb24pO1xuXG4gICAgICAgIGlmIChvcHRpb25hbHMpIHtcbiAgICAgICAgICAgIG9wdGlvbmFsc1JlZ0V4cCA9IG5ldyBSZWdFeHAoJzB7MSwnICsgb3B0aW9uYWxzICsgJ30kJyk7XG4gICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQucmVwbGFjZShvcHRpb25hbHNSZWdFeHAsICcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBGb3JtYXR0aW5nXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLy8gZGV0ZXJtaW5lIHdoYXQgdHlwZSBvZiBmb3JtYXR0aW5nIHdlIG5lZWQgdG8gZG9cbiAgICBmdW5jdGlvbiBmb3JtYXROdW1lcmFsIChuLCBmb3JtYXQsIHJvdW5kaW5nRnVuY3Rpb24pIHtcbiAgICAgICAgdmFyIG91dHB1dDtcblxuICAgICAgICAvLyBmaWd1cmUgb3V0IHdoYXQga2luZCBvZiBmb3JtYXQgd2UgYXJlIGRlYWxpbmcgd2l0aFxuICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJyQnKSA+IC0xKSB7IC8vIGN1cnJlbmN5ISEhISFcbiAgICAgICAgICAgIG91dHB1dCA9IGZvcm1hdEN1cnJlbmN5KG4sIGZvcm1hdCwgcm91bmRpbmdGdW5jdGlvbik7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0LmluZGV4T2YoJyUnKSA+IC0xKSB7IC8vIHBlcmNlbnRhZ2VcbiAgICAgICAgICAgIG91dHB1dCA9IGZvcm1hdFBlcmNlbnRhZ2UobiwgZm9ybWF0LCByb3VuZGluZ0Z1bmN0aW9uKTtcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtYXQuaW5kZXhPZignOicpID4gLTEpIHsgLy8gdGltZVxuICAgICAgICAgICAgb3V0cHV0ID0gZm9ybWF0VGltZShuLCBmb3JtYXQpO1xuICAgICAgICB9IGVsc2UgeyAvLyBwbGFpbiBvbCcgbnVtYmVycyBvciBieXRlc1xuICAgICAgICAgICAgb3V0cHV0ID0gZm9ybWF0TnVtYmVyKG4uX3ZhbHVlLCBmb3JtYXQsIHJvdW5kaW5nRnVuY3Rpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmV0dXJuIHN0cmluZ1xuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cblxuICAgIC8vIHJldmVydCB0byBudW1iZXJcbiAgICBmdW5jdGlvbiB1bmZvcm1hdE51bWVyYWwgKG4sIHN0cmluZykge1xuICAgICAgICB2YXIgc3RyaW5nT3JpZ2luYWwgPSBzdHJpbmcsXG4gICAgICAgICAgICB0aG91c2FuZFJlZ0V4cCxcbiAgICAgICAgICAgIG1pbGxpb25SZWdFeHAsXG4gICAgICAgICAgICBiaWxsaW9uUmVnRXhwLFxuICAgICAgICAgICAgdHJpbGxpb25SZWdFeHAsXG4gICAgICAgICAgICBzdWZmaXhlcyA9IFsnS0InLCAnTUInLCAnR0InLCAnVEInLCAnUEInLCAnRUInLCAnWkInLCAnWUInXSxcbiAgICAgICAgICAgIGJ5dGVzTXVsdGlwbGllciA9IGZhbHNlLFxuICAgICAgICAgICAgcG93ZXI7XG5cbiAgICAgICAgaWYgKHN0cmluZy5pbmRleE9mKCc6JykgPiAtMSkge1xuICAgICAgICAgICAgbi5fdmFsdWUgPSB1bmZvcm1hdFRpbWUoc3RyaW5nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzdHJpbmcgPT09IHplcm9Gb3JtYXQpIHtcbiAgICAgICAgICAgICAgICBuLl92YWx1ZSA9IDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5kZWxpbWl0ZXJzLmRlY2ltYWwgIT09ICcuJykge1xuICAgICAgICAgICAgICAgICAgICBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZSgvXFwuL2csJycpLnJlcGxhY2UobGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uZGVsaW1pdGVycy5kZWNpbWFsLCAnLicpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHNlZSBpZiBhYmJyZXZpYXRpb25zIGFyZSB0aGVyZSBzbyB0aGF0IHdlIGNhbiBtdWx0aXBseSB0byB0aGUgY29ycmVjdCBudW1iZXJcbiAgICAgICAgICAgICAgICB0aG91c2FuZFJlZ0V4cCA9IG5ldyBSZWdFeHAoJ1teYS16QS1aXScgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5hYmJyZXZpYXRpb25zLnRob3VzYW5kICsgJyg/OlxcXFwpfChcXFxcJyArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmN1cnJlbmN5LnN5bWJvbCArICcpPyg/OlxcXFwpKT8pPyQnKTtcbiAgICAgICAgICAgICAgICBtaWxsaW9uUmVnRXhwID0gbmV3IFJlZ0V4cCgnW15hLXpBLVpdJyArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmFiYnJldmlhdGlvbnMubWlsbGlvbiArICcoPzpcXFxcKXwoXFxcXCcgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5jdXJyZW5jeS5zeW1ib2wgKyAnKT8oPzpcXFxcKSk/KT8kJyk7XG4gICAgICAgICAgICAgICAgYmlsbGlvblJlZ0V4cCA9IG5ldyBSZWdFeHAoJ1teYS16QS1aXScgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5hYmJyZXZpYXRpb25zLmJpbGxpb24gKyAnKD86XFxcXCl8KFxcXFwnICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uY3VycmVuY3kuc3ltYm9sICsgJyk/KD86XFxcXCkpPyk/JCcpO1xuICAgICAgICAgICAgICAgIHRyaWxsaW9uUmVnRXhwID0gbmV3IFJlZ0V4cCgnW15hLXpBLVpdJyArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmFiYnJldmlhdGlvbnMudHJpbGxpb24gKyAnKD86XFxcXCl8KFxcXFwnICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uY3VycmVuY3kuc3ltYm9sICsgJyk/KD86XFxcXCkpPyk/JCcpO1xuXG4gICAgICAgICAgICAgICAgLy8gc2VlIGlmIGJ5dGVzIGFyZSB0aGVyZSBzbyB0aGF0IHdlIGNhbiBtdWx0aXBseSB0byB0aGUgY29ycmVjdCBudW1iZXJcbiAgICAgICAgICAgICAgICBmb3IgKHBvd2VyID0gMDsgcG93ZXIgPD0gc3VmZml4ZXMubGVuZ3RoOyBwb3dlcisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGJ5dGVzTXVsdGlwbGllciA9IChzdHJpbmcuaW5kZXhPZihzdWZmaXhlc1twb3dlcl0pID4gLTEpID8gTWF0aC5wb3coMTAyNCwgcG93ZXIgKyAxKSA6IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChieXRlc011bHRpcGxpZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gZG8gc29tZSBtYXRoIHRvIGNyZWF0ZSBvdXIgbnVtYmVyXG4gICAgICAgICAgICAgICAgbi5fdmFsdWUgPSAoKGJ5dGVzTXVsdGlwbGllcikgPyBieXRlc011bHRpcGxpZXIgOiAxKSAqICgoc3RyaW5nT3JpZ2luYWwubWF0Y2godGhvdXNhbmRSZWdFeHApKSA/IE1hdGgucG93KDEwLCAzKSA6IDEpICogKChzdHJpbmdPcmlnaW5hbC5tYXRjaChtaWxsaW9uUmVnRXhwKSkgPyBNYXRoLnBvdygxMCwgNikgOiAxKSAqICgoc3RyaW5nT3JpZ2luYWwubWF0Y2goYmlsbGlvblJlZ0V4cCkpID8gTWF0aC5wb3coMTAsIDkpIDogMSkgKiAoKHN0cmluZ09yaWdpbmFsLm1hdGNoKHRyaWxsaW9uUmVnRXhwKSkgPyBNYXRoLnBvdygxMCwgMTIpIDogMSkgKiAoKHN0cmluZy5pbmRleE9mKCclJykgPiAtMSkgPyAwLjAxIDogMSkgKiAoKChzdHJpbmcuc3BsaXQoJy0nKS5sZW5ndGggKyBNYXRoLm1pbihzdHJpbmcuc3BsaXQoJygnKS5sZW5ndGgtMSwgc3RyaW5nLnNwbGl0KCcpJykubGVuZ3RoLTEpKSAlIDIpPyAxOiAtMSkgKiBOdW1iZXIoc3RyaW5nLnJlcGxhY2UoL1teMC05XFwuXSsvZywgJycpKTtcblxuICAgICAgICAgICAgICAgIC8vIHJvdW5kIGlmIHdlIGFyZSB0YWxraW5nIGFib3V0IGJ5dGVzXG4gICAgICAgICAgICAgICAgbi5fdmFsdWUgPSAoYnl0ZXNNdWx0aXBsaWVyKSA/IE1hdGguY2VpbChuLl92YWx1ZSkgOiBuLl92YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbi5fdmFsdWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0Q3VycmVuY3kgKG4sIGZvcm1hdCwgcm91bmRpbmdGdW5jdGlvbikge1xuICAgICAgICB2YXIgc3ltYm9sSW5kZXggPSBmb3JtYXQuaW5kZXhPZignJCcpLFxuICAgICAgICAgICAgb3BlblBhcmVuSW5kZXggPSBmb3JtYXQuaW5kZXhPZignKCcpLFxuICAgICAgICAgICAgbWludXNTaWduSW5kZXggPSBmb3JtYXQuaW5kZXhPZignLScpLFxuICAgICAgICAgICAgc3BhY2UgPSAnJyxcbiAgICAgICAgICAgIHNwbGljZUluZGV4LFxuICAgICAgICAgICAgb3V0cHV0O1xuXG4gICAgICAgIC8vIGNoZWNrIGZvciBzcGFjZSBiZWZvcmUgb3IgYWZ0ZXIgY3VycmVuY3lcbiAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCcgJCcpID4gLTEpIHtcbiAgICAgICAgICAgIHNwYWNlID0gJyAnO1xuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJyAkJywgJycpO1xuICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdC5pbmRleE9mKCckICcpID4gLTEpIHtcbiAgICAgICAgICAgIHNwYWNlID0gJyAnO1xuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJyQgJywgJycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJyQnLCAnJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmb3JtYXQgdGhlIG51bWJlclxuICAgICAgICBvdXRwdXQgPSBmb3JtYXROdW1iZXIobi5fdmFsdWUsIGZvcm1hdCwgcm91bmRpbmdGdW5jdGlvbik7XG5cbiAgICAgICAgLy8gcG9zaXRpb24gdGhlIHN5bWJvbFxuICAgICAgICBpZiAoc3ltYm9sSW5kZXggPD0gMSkge1xuICAgICAgICAgICAgaWYgKG91dHB1dC5pbmRleE9mKCcoJykgPiAtMSB8fCBvdXRwdXQuaW5kZXhPZignLScpID4gLTEpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQuc3BsaXQoJycpO1xuICAgICAgICAgICAgICAgIHNwbGljZUluZGV4ID0gMTtcbiAgICAgICAgICAgICAgICBpZiAoc3ltYm9sSW5kZXggPCBvcGVuUGFyZW5JbmRleCB8fCBzeW1ib2xJbmRleCA8IG1pbnVzU2lnbkluZGV4KXtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIHN5bWJvbCBhcHBlYXJzIGJlZm9yZSB0aGUgXCIoXCIgb3IgXCItXCJcbiAgICAgICAgICAgICAgICAgICAgc3BsaWNlSW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvdXRwdXQuc3BsaWNlKHNwbGljZUluZGV4LCAwLCBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5jdXJyZW5jeS5zeW1ib2wgKyBzcGFjZSk7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0LmpvaW4oJycpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5jdXJyZW5jeS5zeW1ib2wgKyBzcGFjZSArIG91dHB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChvdXRwdXQuaW5kZXhPZignKScpID4gLTEpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQuc3BsaXQoJycpO1xuICAgICAgICAgICAgICAgIG91dHB1dC5zcGxpY2UoLTEsIDAsIHNwYWNlICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uY3VycmVuY3kuc3ltYm9sKTtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQuam9pbignJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dCArIHNwYWNlICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uY3VycmVuY3kuc3ltYm9sO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRQZXJjZW50YWdlIChuLCBmb3JtYXQsIHJvdW5kaW5nRnVuY3Rpb24pIHtcbiAgICAgICAgdmFyIHNwYWNlID0gJycsXG4gICAgICAgICAgICBvdXRwdXQsXG4gICAgICAgICAgICB2YWx1ZSA9IG4uX3ZhbHVlICogMTAwO1xuXG4gICAgICAgIC8vIGNoZWNrIGZvciBzcGFjZSBiZWZvcmUgJVxuICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJyAlJykgPiAtMSkge1xuICAgICAgICAgICAgc3BhY2UgPSAnICc7XG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnICUnLCAnJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnJScsICcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG91dHB1dCA9IGZvcm1hdE51bWJlcih2YWx1ZSwgZm9ybWF0LCByb3VuZGluZ0Z1bmN0aW9uKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChvdXRwdXQuaW5kZXhPZignKScpID4gLTEgKSB7XG4gICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQuc3BsaXQoJycpO1xuICAgICAgICAgICAgb3V0cHV0LnNwbGljZSgtMSwgMCwgc3BhY2UgKyAnJScpO1xuICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0LmpvaW4oJycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0ICsgc3BhY2UgKyAnJSc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdFRpbWUgKG4pIHtcbiAgICAgICAgdmFyIGhvdXJzID0gTWF0aC5mbG9vcihuLl92YWx1ZS82MC82MCksXG4gICAgICAgICAgICBtaW51dGVzID0gTWF0aC5mbG9vcigobi5fdmFsdWUgLSAoaG91cnMgKiA2MCAqIDYwKSkvNjApLFxuICAgICAgICAgICAgc2Vjb25kcyA9IE1hdGgucm91bmQobi5fdmFsdWUgLSAoaG91cnMgKiA2MCAqIDYwKSAtIChtaW51dGVzICogNjApKTtcbiAgICAgICAgcmV0dXJuIGhvdXJzICsgJzonICsgKChtaW51dGVzIDwgMTApID8gJzAnICsgbWludXRlcyA6IG1pbnV0ZXMpICsgJzonICsgKChzZWNvbmRzIDwgMTApID8gJzAnICsgc2Vjb25kcyA6IHNlY29uZHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVuZm9ybWF0VGltZSAoc3RyaW5nKSB7XG4gICAgICAgIHZhciB0aW1lQXJyYXkgPSBzdHJpbmcuc3BsaXQoJzonKSxcbiAgICAgICAgICAgIHNlY29uZHMgPSAwO1xuICAgICAgICAvLyB0dXJuIGhvdXJzIGFuZCBtaW51dGVzIGludG8gc2Vjb25kcyBhbmQgYWRkIHRoZW0gYWxsIHVwXG4gICAgICAgIGlmICh0aW1lQXJyYXkubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICAvLyBob3Vyc1xuICAgICAgICAgICAgc2Vjb25kcyA9IHNlY29uZHMgKyAoTnVtYmVyKHRpbWVBcnJheVswXSkgKiA2MCAqIDYwKTtcbiAgICAgICAgICAgIC8vIG1pbnV0ZXNcbiAgICAgICAgICAgIHNlY29uZHMgPSBzZWNvbmRzICsgKE51bWJlcih0aW1lQXJyYXlbMV0pICogNjApO1xuICAgICAgICAgICAgLy8gc2Vjb25kc1xuICAgICAgICAgICAgc2Vjb25kcyA9IHNlY29uZHMgKyBOdW1iZXIodGltZUFycmF5WzJdKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aW1lQXJyYXkubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAvLyBtaW51dGVzXG4gICAgICAgICAgICBzZWNvbmRzID0gc2Vjb25kcyArIChOdW1iZXIodGltZUFycmF5WzBdKSAqIDYwKTtcbiAgICAgICAgICAgIC8vIHNlY29uZHNcbiAgICAgICAgICAgIHNlY29uZHMgPSBzZWNvbmRzICsgTnVtYmVyKHRpbWVBcnJheVsxXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE51bWJlcihzZWNvbmRzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXROdW1iZXIgKHZhbHVlLCBmb3JtYXQsIHJvdW5kaW5nRnVuY3Rpb24pIHtcbiAgICAgICAgdmFyIG5lZ1AgPSBmYWxzZSxcbiAgICAgICAgICAgIHNpZ25lZCA9IGZhbHNlLFxuICAgICAgICAgICAgb3B0RGVjID0gZmFsc2UsXG4gICAgICAgICAgICBhYmJyID0gJycsXG4gICAgICAgICAgICBhYmJySyA9IGZhbHNlLCAvLyBmb3JjZSBhYmJyZXZpYXRpb24gdG8gdGhvdXNhbmRzXG4gICAgICAgICAgICBhYmJyTSA9IGZhbHNlLCAvLyBmb3JjZSBhYmJyZXZpYXRpb24gdG8gbWlsbGlvbnNcbiAgICAgICAgICAgIGFiYnJCID0gZmFsc2UsIC8vIGZvcmNlIGFiYnJldmlhdGlvbiB0byBiaWxsaW9uc1xuICAgICAgICAgICAgYWJiclQgPSBmYWxzZSwgLy8gZm9yY2UgYWJicmV2aWF0aW9uIHRvIHRyaWxsaW9uc1xuICAgICAgICAgICAgYWJickZvcmNlID0gZmFsc2UsIC8vIGZvcmNlIGFiYnJldmlhdGlvblxuICAgICAgICAgICAgYnl0ZXMgPSAnJyxcbiAgICAgICAgICAgIG9yZCA9ICcnLFxuICAgICAgICAgICAgYWJzID0gTWF0aC5hYnModmFsdWUpLFxuICAgICAgICAgICAgc3VmZml4ZXMgPSBbJ0InLCAnS0InLCAnTUInLCAnR0InLCAnVEInLCAnUEInLCAnRUInLCAnWkInLCAnWUInXSxcbiAgICAgICAgICAgIG1pbixcbiAgICAgICAgICAgIG1heCxcbiAgICAgICAgICAgIHBvd2VyLFxuICAgICAgICAgICAgdyxcbiAgICAgICAgICAgIHByZWNpc2lvbixcbiAgICAgICAgICAgIHRob3VzYW5kcyxcbiAgICAgICAgICAgIGQgPSAnJyxcbiAgICAgICAgICAgIG5lZyA9IGZhbHNlO1xuXG4gICAgICAgIC8vIGNoZWNrIGlmIG51bWJlciBpcyB6ZXJvIGFuZCBhIGN1c3RvbSB6ZXJvIGZvcm1hdCBoYXMgYmVlbiBzZXRcbiAgICAgICAgaWYgKHZhbHVlID09PSAwICYmIHplcm9Gb3JtYXQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB6ZXJvRm9ybWF0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gc2VlIGlmIHdlIHNob3VsZCB1c2UgcGFyZW50aGVzZXMgZm9yIG5lZ2F0aXZlIG51bWJlciBvciBpZiB3ZSBzaG91bGQgcHJlZml4IHdpdGggYSBzaWduXG4gICAgICAgICAgICAvLyBpZiBib3RoIGFyZSBwcmVzZW50IHdlIGRlZmF1bHQgdG8gcGFyZW50aGVzZXNcbiAgICAgICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignKCcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICBuZWdQID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQuc2xpY2UoMSwgLTEpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmb3JtYXQuaW5kZXhPZignKycpID4gLTEpIHtcbiAgICAgICAgICAgICAgICBzaWduZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKC9cXCsvZywgJycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzZWUgaWYgYWJicmV2aWF0aW9uIGlzIHdhbnRlZFxuICAgICAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCdhJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIGFiYnJldmlhdGlvbiBpcyBzcGVjaWZpZWRcbiAgICAgICAgICAgICAgICBhYmJySyA9IGZvcm1hdC5pbmRleE9mKCdhSycpID49IDA7XG4gICAgICAgICAgICAgICAgYWJick0gPSBmb3JtYXQuaW5kZXhPZignYU0nKSA+PSAwO1xuICAgICAgICAgICAgICAgIGFiYnJCID0gZm9ybWF0LmluZGV4T2YoJ2FCJykgPj0gMDtcbiAgICAgICAgICAgICAgICBhYmJyVCA9IGZvcm1hdC5pbmRleE9mKCdhVCcpID49IDA7XG4gICAgICAgICAgICAgICAgYWJickZvcmNlID0gYWJicksgfHwgYWJick0gfHwgYWJickIgfHwgYWJiclQ7XG5cbiAgICAgICAgICAgICAgICAvLyBjaGVjayBmb3Igc3BhY2UgYmVmb3JlIGFiYnJldmlhdGlvblxuICAgICAgICAgICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignIGEnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGFiYnIgPSAnICc7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCcgYScsICcnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnYScsICcnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoYWJzID49IE1hdGgucG93KDEwLCAxMikgJiYgIWFiYnJGb3JjZSB8fCBhYmJyVCkge1xuICAgICAgICAgICAgICAgICAgICAvLyB0cmlsbGlvblxuICAgICAgICAgICAgICAgICAgICBhYmJyID0gYWJiciArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmFiYnJldmlhdGlvbnMudHJpbGxpb247XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgLyBNYXRoLnBvdygxMCwgMTIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWJzIDwgTWF0aC5wb3coMTAsIDEyKSAmJiBhYnMgPj0gTWF0aC5wb3coMTAsIDkpICYmICFhYmJyRm9yY2UgfHwgYWJickIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYmlsbGlvblxuICAgICAgICAgICAgICAgICAgICBhYmJyID0gYWJiciArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmFiYnJldmlhdGlvbnMuYmlsbGlvbjtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSAvIE1hdGgucG93KDEwLCA5KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFicyA8IE1hdGgucG93KDEwLCA5KSAmJiBhYnMgPj0gTWF0aC5wb3coMTAsIDYpICYmICFhYmJyRm9yY2UgfHwgYWJick0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbWlsbGlvblxuICAgICAgICAgICAgICAgICAgICBhYmJyID0gYWJiciArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmFiYnJldmlhdGlvbnMubWlsbGlvbjtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSAvIE1hdGgucG93KDEwLCA2KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFicyA8IE1hdGgucG93KDEwLCA2KSAmJiBhYnMgPj0gTWF0aC5wb3coMTAsIDMpICYmICFhYmJyRm9yY2UgfHwgYWJickspIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhvdXNhbmRcbiAgICAgICAgICAgICAgICAgICAgYWJiciA9IGFiYnIgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5hYmJyZXZpYXRpb25zLnRob3VzYW5kO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlIC8gTWF0aC5wb3coMTAsIDMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2VlIGlmIHdlIGFyZSBmb3JtYXR0aW5nIGJ5dGVzXG4gICAgICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJ2InKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgZm9yIHNwYWNlIGJlZm9yZVxuICAgICAgICAgICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignIGInKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGJ5dGVzID0gJyAnO1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnIGInLCAnJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJ2InLCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yIChwb3dlciA9IDA7IHBvd2VyIDw9IHN1ZmZpeGVzLmxlbmd0aDsgcG93ZXIrKykge1xuICAgICAgICAgICAgICAgICAgICBtaW4gPSBNYXRoLnBvdygxMDI0LCBwb3dlcik7XG4gICAgICAgICAgICAgICAgICAgIG1heCA9IE1hdGgucG93KDEwMjQsIHBvd2VyKzEpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA+PSBtaW4gJiYgdmFsdWUgPCBtYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ5dGVzID0gYnl0ZXMgKyBzdWZmaXhlc1twb3dlcl07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWluID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgLyBtaW47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2VlIGlmIG9yZGluYWwgaXMgd2FudGVkXG4gICAgICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJ28nKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgZm9yIHNwYWNlIGJlZm9yZVxuICAgICAgICAgICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignIG8nKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIG9yZCA9ICcgJztcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJyBvJywgJycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCdvJywgJycpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG9yZCA9IG9yZCArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLm9yZGluYWwodmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJ1suXScpID4gLTEpIHtcbiAgICAgICAgICAgICAgICBvcHREZWMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCdbLl0nLCAnLicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3ID0gdmFsdWUudG9TdHJpbmcoKS5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgICAgcHJlY2lzaW9uID0gZm9ybWF0LnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICB0aG91c2FuZHMgPSBmb3JtYXQuaW5kZXhPZignLCcpO1xuXG4gICAgICAgICAgICBpZiAocHJlY2lzaW9uKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByZWNpc2lvbi5pbmRleE9mKCdbJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICBwcmVjaXNpb24gPSBwcmVjaXNpb24ucmVwbGFjZSgnXScsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgcHJlY2lzaW9uID0gcHJlY2lzaW9uLnNwbGl0KCdbJyk7XG4gICAgICAgICAgICAgICAgICAgIGQgPSB0b0ZpeGVkKHZhbHVlLCAocHJlY2lzaW9uWzBdLmxlbmd0aCArIHByZWNpc2lvblsxXS5sZW5ndGgpLCByb3VuZGluZ0Z1bmN0aW9uLCBwcmVjaXNpb25bMV0ubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkID0gdG9GaXhlZCh2YWx1ZSwgcHJlY2lzaW9uLmxlbmd0aCwgcm91bmRpbmdGdW5jdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdyA9IGQuc3BsaXQoJy4nKVswXTtcblxuICAgICAgICAgICAgICAgIGlmIChkLnNwbGl0KCcuJylbMV0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGQgPSBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5kZWxpbWl0ZXJzLmRlY2ltYWwgKyBkLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZCA9ICcnO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChvcHREZWMgJiYgTnVtYmVyKGQuc2xpY2UoMSkpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGQgPSAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHcgPSB0b0ZpeGVkKHZhbHVlLCBudWxsLCByb3VuZGluZ0Z1bmN0aW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZm9ybWF0IG51bWJlclxuICAgICAgICAgICAgaWYgKHcuaW5kZXhPZignLScpID4gLTEpIHtcbiAgICAgICAgICAgICAgICB3ID0gdy5zbGljZSgxKTtcbiAgICAgICAgICAgICAgICBuZWcgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhvdXNhbmRzID4gLTEpIHtcbiAgICAgICAgICAgICAgICB3ID0gdy50b1N0cmluZygpLnJlcGxhY2UoLyhcXGQpKD89KFxcZHszfSkrKD8hXFxkKSkvZywgJyQxJyArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmRlbGltaXRlcnMudGhvdXNhbmRzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCcuJykgPT09IDApIHtcbiAgICAgICAgICAgICAgICB3ID0gJyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAoKG5lZ1AgJiYgbmVnKSA/ICcoJyA6ICcnKSArICgoIW5lZ1AgJiYgbmVnKSA/ICctJyA6ICcnKSArICgoIW5lZyAmJiBzaWduZWQpID8gJysnIDogJycpICsgdyArIGQgKyAoKG9yZCkgPyBvcmQgOiAnJykgKyAoKGFiYnIpID8gYWJiciA6ICcnKSArICgoYnl0ZXMpID8gYnl0ZXMgOiAnJykgKyAoKG5lZ1AgJiYgbmVnKSA/ICcpJyA6ICcnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgVG9wIExldmVsIEZ1bmN0aW9uc1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIG51bWVyYWwgPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgaWYgKG51bWVyYWwuaXNOdW1lcmFsKGlucHV0KSkge1xuICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC52YWx1ZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKGlucHV0ID09PSAwIHx8IHR5cGVvZiBpbnB1dCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGlucHV0ID0gMDtcbiAgICAgICAgfSBlbHNlIGlmICghTnVtYmVyKGlucHV0KSkge1xuICAgICAgICAgICAgaW5wdXQgPSBudW1lcmFsLmZuLnVuZm9ybWF0KGlucHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgTnVtZXJhbChOdW1iZXIoaW5wdXQpKTtcbiAgICB9O1xuXG4gICAgLy8gdmVyc2lvbiBudW1iZXJcbiAgICBudW1lcmFsLnZlcnNpb24gPSBWRVJTSU9OO1xuXG4gICAgLy8gY29tcGFyZSBudW1lcmFsIG9iamVjdFxuICAgIG51bWVyYWwuaXNOdW1lcmFsID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgTnVtZXJhbDtcbiAgICB9O1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGxvYWQgbGFuZ3VhZ2VzIGFuZCB0aGVuIHNldCB0aGUgZ2xvYmFsIGxhbmd1YWdlLiAgSWZcbiAgICAvLyBubyBhcmd1bWVudHMgYXJlIHBhc3NlZCBpbiwgaXQgd2lsbCBzaW1wbHkgcmV0dXJuIHRoZSBjdXJyZW50IGdsb2JhbFxuICAgIC8vIGxhbmd1YWdlIGtleS5cbiAgICBudW1lcmFsLmxhbmd1YWdlID0gZnVuY3Rpb24gKGtleSwgdmFsdWVzKSB7XG4gICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudExhbmd1YWdlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGtleSAmJiAhdmFsdWVzKSB7XG4gICAgICAgICAgICBpZighbGFuZ3VhZ2VzW2tleV0pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gbGFuZ3VhZ2UgOiAnICsga2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN1cnJlbnRMYW5ndWFnZSA9IGtleTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YWx1ZXMgfHwgIWxhbmd1YWdlc1trZXldKSB7XG4gICAgICAgICAgICBsb2FkTGFuZ3VhZ2Uoa2V5LCB2YWx1ZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bWVyYWw7XG4gICAgfTtcbiAgICBcbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHByb3ZpZGVzIGFjY2VzcyB0byB0aGUgbG9hZGVkIGxhbmd1YWdlIGRhdGEuICBJZlxuICAgIC8vIG5vIGFyZ3VtZW50cyBhcmUgcGFzc2VkIGluLCBpdCB3aWxsIHNpbXBseSByZXR1cm4gdGhlIGN1cnJlbnRcbiAgICAvLyBnbG9iYWwgbGFuZ3VhZ2Ugb2JqZWN0LlxuICAgIG51bWVyYWwubGFuZ3VhZ2VEYXRhID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBpZiAoIWtleSkge1xuICAgICAgICAgICAgcmV0dXJuIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoIWxhbmd1YWdlc1trZXldKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gbGFuZ3VhZ2UgOiAnICsga2V5KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGxhbmd1YWdlc1trZXldO1xuICAgIH07XG5cbiAgICBudW1lcmFsLmxhbmd1YWdlKCdlbicsIHtcbiAgICAgICAgZGVsaW1pdGVyczoge1xuICAgICAgICAgICAgdGhvdXNhbmRzOiAnLCcsXG4gICAgICAgICAgICBkZWNpbWFsOiAnLidcbiAgICAgICAgfSxcbiAgICAgICAgYWJicmV2aWF0aW9uczoge1xuICAgICAgICAgICAgdGhvdXNhbmQ6ICdrJyxcbiAgICAgICAgICAgIG1pbGxpb246ICdtJyxcbiAgICAgICAgICAgIGJpbGxpb246ICdiJyxcbiAgICAgICAgICAgIHRyaWxsaW9uOiAndCdcbiAgICAgICAgfSxcbiAgICAgICAgb3JkaW5hbDogZnVuY3Rpb24gKG51bWJlcikge1xuICAgICAgICAgICAgdmFyIGIgPSBudW1iZXIgJSAxMDtcbiAgICAgICAgICAgIHJldHVybiAofn4gKG51bWJlciAlIDEwMCAvIDEwKSA9PT0gMSkgPyAndGgnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMSkgPyAnc3QnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMikgPyAnbmQnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMykgPyAncmQnIDogJ3RoJztcbiAgICAgICAgfSxcbiAgICAgICAgY3VycmVuY3k6IHtcbiAgICAgICAgICAgIHN5bWJvbDogJyQnXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIG51bWVyYWwuemVyb0Zvcm1hdCA9IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgemVyb0Zvcm1hdCA9IHR5cGVvZihmb3JtYXQpID09PSAnc3RyaW5nJyA/IGZvcm1hdCA6IG51bGw7XG4gICAgfTtcblxuICAgIG51bWVyYWwuZGVmYXVsdEZvcm1hdCA9IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgZGVmYXVsdEZvcm1hdCA9IHR5cGVvZihmb3JtYXQpID09PSAnc3RyaW5nJyA/IGZvcm1hdCA6ICcwLjAnO1xuICAgIH07XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIEhlbHBlcnNcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICBmdW5jdGlvbiBsb2FkTGFuZ3VhZ2Uoa2V5LCB2YWx1ZXMpIHtcbiAgICAgICAgbGFuZ3VhZ2VzW2tleV0gPSB2YWx1ZXM7XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBGbG9hdGluZy1wb2ludCBoZWxwZXJzXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLy8gVGhlIGZsb2F0aW5nLXBvaW50IGhlbHBlciBmdW5jdGlvbnMgYW5kIGltcGxlbWVudGF0aW9uXG4gICAgLy8gYm9ycm93cyBoZWF2aWx5IGZyb20gc2luZnVsLmpzOiBodHRwOi8vZ3VpcG4uZ2l0aHViLmlvL3NpbmZ1bC5qcy9cblxuICAgIC8qKlxuICAgICAqIEFycmF5LnByb3RvdHlwZS5yZWR1Y2UgZm9yIGJyb3dzZXJzIHRoYXQgZG9uJ3Qgc3VwcG9ydCBpdFxuICAgICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L1JlZHVjZSNDb21wYXRpYmlsaXR5XG4gICAgICovXG4gICAgaWYgKCdmdW5jdGlvbicgIT09IHR5cGVvZiBBcnJheS5wcm90b3R5cGUucmVkdWNlKSB7XG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5yZWR1Y2UgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIG9wdF9pbml0aWFsVmFsdWUpIHtcbiAgICAgICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKG51bGwgPT09IHRoaXMgfHwgJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiB0aGlzKSB7XG4gICAgICAgICAgICAgICAgLy8gQXQgdGhlIG1vbWVudCBhbGwgbW9kZXJuIGJyb3dzZXJzLCB0aGF0IHN1cHBvcnQgc3RyaWN0IG1vZGUsIGhhdmVcbiAgICAgICAgICAgICAgICAvLyBuYXRpdmUgaW1wbGVtZW50YXRpb24gb2YgQXJyYXkucHJvdG90eXBlLnJlZHVjZS4gRm9yIGluc3RhbmNlLCBJRThcbiAgICAgICAgICAgICAgICAvLyBkb2VzIG5vdCBzdXBwb3J0IHN0cmljdCBtb2RlLCBzbyB0aGlzIGNoZWNrIGlzIGFjdHVhbGx5IHVzZWxlc3MuXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJyYXkucHJvdG90eXBlLnJlZHVjZSBjYWxsZWQgb24gbnVsbCBvciB1bmRlZmluZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCdmdW5jdGlvbicgIT09IHR5cGVvZiBjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoY2FsbGJhY2sgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpbmRleCxcbiAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICBsZW5ndGggPSB0aGlzLmxlbmd0aCA+Pj4gMCxcbiAgICAgICAgICAgICAgICBpc1ZhbHVlU2V0ID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmICgxIDwgYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gb3B0X2luaXRpYWxWYWx1ZTtcbiAgICAgICAgICAgICAgICBpc1ZhbHVlU2V0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChpbmRleCA9IDA7IGxlbmd0aCA+IGluZGV4OyArK2luZGV4KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc1ZhbHVlU2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNhbGxiYWNrKHZhbHVlLCB0aGlzW2luZGV4XSwgaW5kZXgsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzVmFsdWVTZXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWlzVmFsdWVTZXQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdSZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBcbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyB0aGUgbXVsdGlwbGllciBuZWNlc3NhcnkgdG8gbWFrZSB4ID49IDEsXG4gICAgICogZWZmZWN0aXZlbHkgZWxpbWluYXRpbmcgbWlzY2FsY3VsYXRpb25zIGNhdXNlZCBieVxuICAgICAqIGZpbml0ZSBwcmVjaXNpb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gbXVsdGlwbGllcih4KSB7XG4gICAgICAgIHZhciBwYXJ0cyA9IHgudG9TdHJpbmcoKS5zcGxpdCgnLicpO1xuICAgICAgICBpZiAocGFydHMubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1hdGgucG93KDEwLCBwYXJ0c1sxXS5sZW5ndGgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdpdmVuIGEgdmFyaWFibGUgbnVtYmVyIG9mIGFyZ3VtZW50cywgcmV0dXJucyB0aGUgbWF4aW11bVxuICAgICAqIG11bHRpcGxpZXIgdGhhdCBtdXN0IGJlIHVzZWQgdG8gbm9ybWFsaXplIGFuIG9wZXJhdGlvbiBpbnZvbHZpbmdcbiAgICAgKiBhbGwgb2YgdGhlbS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjb3JyZWN0aW9uRmFjdG9yKCkge1xuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiBhcmdzLnJlZHVjZShmdW5jdGlvbiAocHJldiwgbmV4dCkge1xuICAgICAgICAgICAgdmFyIG1wID0gbXVsdGlwbGllcihwcmV2KSxcbiAgICAgICAgICAgICAgICBtbiA9IG11bHRpcGxpZXIobmV4dCk7XG4gICAgICAgIHJldHVybiBtcCA+IG1uID8gbXAgOiBtbjtcbiAgICAgICAgfSwgLUluZmluaXR5KTtcbiAgICB9ICAgICAgICBcblxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBOdW1lcmFsIFByb3RvdHlwZVxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4gICAgbnVtZXJhbC5mbiA9IE51bWVyYWwucHJvdG90eXBlID0ge1xuXG4gICAgICAgIGNsb25lIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bWVyYWwodGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZm9ybWF0IDogZnVuY3Rpb24gKGlucHV0U3RyaW5nLCByb3VuZGluZ0Z1bmN0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0TnVtZXJhbCh0aGlzLCBcbiAgICAgICAgICAgICAgICAgIGlucHV0U3RyaW5nID8gaW5wdXRTdHJpbmcgOiBkZWZhdWx0Rm9ybWF0LCBcbiAgICAgICAgICAgICAgICAgIChyb3VuZGluZ0Z1bmN0aW9uICE9PSB1bmRlZmluZWQpID8gcm91bmRpbmdGdW5jdGlvbiA6IE1hdGgucm91bmRcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgfSxcblxuICAgICAgICB1bmZvcm1hdCA6IGZ1bmN0aW9uIChpbnB1dFN0cmluZykge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dFN0cmluZykgPT09ICdbb2JqZWN0IE51bWJlcl0nKSB7IFxuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dFN0cmluZzsgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdW5mb3JtYXROdW1lcmFsKHRoaXMsIGlucHV0U3RyaW5nID8gaW5wdXRTdHJpbmcgOiBkZWZhdWx0Rm9ybWF0KTtcbiAgICAgICAgfSxcblxuICAgICAgICB2YWx1ZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICB2YWx1ZU9mIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldCA6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSBOdW1iZXIodmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRkIDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgY29yckZhY3RvciA9IGNvcnJlY3Rpb25GYWN0b3IuY2FsbChudWxsLCB0aGlzLl92YWx1ZSwgdmFsdWUpO1xuICAgICAgICAgICAgZnVuY3Rpb24gY2JhY2soYWNjdW0sIGN1cnIsIGN1cnJJLCBPKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjY3VtICsgY29yckZhY3RvciAqIGN1cnI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IFt0aGlzLl92YWx1ZSwgdmFsdWVdLnJlZHVjZShjYmFjaywgMCkgLyBjb3JyRmFjdG9yO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc3VidHJhY3QgOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBjb3JyRmFjdG9yID0gY29ycmVjdGlvbkZhY3Rvci5jYWxsKG51bGwsIHRoaXMuX3ZhbHVlLCB2YWx1ZSk7XG4gICAgICAgICAgICBmdW5jdGlvbiBjYmFjayhhY2N1bSwgY3VyciwgY3VyckksIE8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjdW0gLSBjb3JyRmFjdG9yICogY3VycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gW3ZhbHVlXS5yZWR1Y2UoY2JhY2ssIHRoaXMuX3ZhbHVlICogY29yckZhY3RvcikgLyBjb3JyRmFjdG9yOyAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbXVsdGlwbHkgOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNiYWNrKGFjY3VtLCBjdXJyLCBjdXJySSwgTykge1xuICAgICAgICAgICAgICAgIHZhciBjb3JyRmFjdG9yID0gY29ycmVjdGlvbkZhY3RvcihhY2N1bSwgY3Vycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChhY2N1bSAqIGNvcnJGYWN0b3IpICogKGN1cnIgKiBjb3JyRmFjdG9yKSAvXG4gICAgICAgICAgICAgICAgICAgIChjb3JyRmFjdG9yICogY29yckZhY3Rvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IFt0aGlzLl92YWx1ZSwgdmFsdWVdLnJlZHVjZShjYmFjaywgMSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBkaXZpZGUgOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNiYWNrKGFjY3VtLCBjdXJyLCBjdXJySSwgTykge1xuICAgICAgICAgICAgICAgIHZhciBjb3JyRmFjdG9yID0gY29ycmVjdGlvbkZhY3RvcihhY2N1bSwgY3Vycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChhY2N1bSAqIGNvcnJGYWN0b3IpIC8gKGN1cnIgKiBjb3JyRmFjdG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gW3RoaXMuX3ZhbHVlLCB2YWx1ZV0ucmVkdWNlKGNiYWNrKTsgICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRpZmZlcmVuY2UgOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmFicyhudW1lcmFsKHRoaXMuX3ZhbHVlKS5zdWJ0cmFjdCh2YWx1ZSkudmFsdWUoKSk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIEV4cG9zaW5nIE51bWVyYWxcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvLyBDb21tb25KUyBtb2R1bGUgaXMgZGVmaW5lZFxuICAgIGlmIChoYXNNb2R1bGUpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBudW1lcmFsO1xuICAgIH1cblxuICAgIC8qZ2xvYmFsIGVuZGVyOmZhbHNlICovXG4gICAgaWYgKHR5cGVvZiBlbmRlciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gaGVyZSwgYHRoaXNgIG1lYW5zIGB3aW5kb3dgIGluIHRoZSBicm93c2VyLCBvciBgZ2xvYmFsYCBvbiB0aGUgc2VydmVyXG4gICAgICAgIC8vIGFkZCBgbnVtZXJhbGAgYXMgYSBnbG9iYWwgb2JqZWN0IHZpYSBhIHN0cmluZyBpZGVudGlmaWVyLFxuICAgICAgICAvLyBmb3IgQ2xvc3VyZSBDb21waWxlciAnYWR2YW5jZWQnIG1vZGVcbiAgICAgICAgdGhpc1snbnVtZXJhbCddID0gbnVtZXJhbDtcbiAgICB9XG5cbiAgICAvKmdsb2JhbCBkZWZpbmU6ZmFsc2UgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbXSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bWVyYWw7XG4gICAgICAgIH0pO1xuICAgIH1cbn0pLmNhbGwodGhpcyk7XG4iLCJpbXBvcnQgVGltZXIgZnJvbSAndWkvdGltZXInO1xuXG5sZXQgX2xpc3RlbmVycyA9IFN5bWJvbCgpLFxuXHRfY2FuY2VsID0gU3ltYm9sKCk7XG5cbmNsYXNzIFN0cmVhbSB7XG5cdGNvbnN0cnVjdG9yKGNhbGxiYWNrKSB7XG5cdFx0dGhpc1tfbGlzdGVuZXJzXSA9IFtdO1xuXHRcdGxldCBzaW5rID0gKHZhbHVlKSA9PiB7XG5cdFx0XHRUaW1lci5pbW1lZGlhdGUoKCkgPT4ge1xuXHRcdFx0XHR0aGlzW19saXN0ZW5lcnNdLm1hcCjGkiA9PiDGkih2YWx1ZSkpO1xuXHRcdFx0fSk7XG5cdFx0fTtcblx0XHRjYWxsYmFjayhzaW5rKTtcblx0fVxuXHRjYW5jZWwoKSB7XG5cdFx0dGhpc1tfbGlzdGVuZXJzXSA9IFtdO1xuXHR9XG5cdGNhbmNlbE9uKHNvdXJjZSkge1xuXHRcdGxldCDGkjtcblx0XHTGkiA9ICgpID0+IHtcblx0XHRcdHNvdXJjZS51bnN1YnNjcmliZSjGkik7XG5cdFx0XHR0aGlzLmNhbmNlbCgpO1xuXHRcdH07XG5cdFx0c291cmNlLnN1YnNjcmliZSjGkik7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0c3Vic2NyaWJlKMaSKSB7XG5cdFx0dGhpc1tfbGlzdGVuZXJzXS5wdXNoKMaSKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHR1bnN1YnNjcmliZSjGkikge1xuXHRcdHRoaXNbX2xpc3RlbmVyc10uc3BsaWNlKHRoaXNbX2xpc3RlbmVyc10uaW5kZXhPZijGkiksIDEpO1xuXHR9XG5cdG1hcCjGkikge1xuXHRcdHJldHVybiBTdHJlYW0ubWFwKHRoaXMsIMaSKTtcblx0fVxuXHRmaWx0ZXIoxpIpIHtcblx0XHRyZXR1cm4gU3RyZWFtLmZpbHRlcih0aGlzLCDGkik7XG5cdH1cblx0dW5pcXVlKMaSKSB7XG5cdFx0cmV0dXJuIFN0cmVhbS51bmlxdWUodGhpcywgxpIpO1xuXHR9XG5cdGxvZyhwcmVmaXgpIHtcblx0XHRyZXR1cm4gU3RyZWFtLmxvZyh0aGlzLCBwcmVmaXgpO1xuXHR9XG5cdHRvQm9vbCgpIHtcblx0XHRyZXR1cm4gU3RyZWFtLnRvQm9vbCh0aGlzKTtcblx0fVxuXHRuZWdhdGUoKSB7XG5cdFx0cmV0dXJuIFN0cmVhbS5uZWdhdGUodGhpcyk7XG5cdH1cblx0emlwKC4uLm90aGVycykge1xuXHRcdHJldHVybiBTdHJlYW0uemlwKHRoaXMsIC4uLm90aGVycyk7XG5cdH1cblx0c3ByZWFkKMaSKSB7XG5cdFx0cmV0dXJuIFN0cmVhbS5zcHJlYWQodGhpcywgxpIpO1xuXHR9XG5cdGZsYXRNYXAoKSB7XG5cdFx0cmV0dXJuIFN0cmVhbS5mbGF0TWFwKHRoaXMpO1xuXHR9XG5cdG1lcmdlKC4uLm90aGVycykge1xuXHRcdHJldHVybiBTdHJlYW0ubWVyZ2UodGhpcywgLi4ub3RoZXJzKTtcblx0fVxuXHRyZWR1Y2UoYWNjLCDGkikge1xuXHRcdHJldHVybiBTdHJlYW0ucmVkdWNlKHRoaXMsIGFjYywgxpIpO1xuXHR9XG5cdGZlZWQoZGVzdFZhbHVlKSB7XG5cdFx0cmV0dXJuIFN0cmVhbS5mZWVkKHRoaXMsIGRlc3RWYWx1ZSk7XG5cdH1cblx0d3JhcCjGkikge1xuXHRcdMaSKHRoaXMpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cdGRlYm91bmNlKGRlbGF5KSB7XG5cdFx0cmV0dXJuIFN0cmVhbS5kZWJvdW5jZSh0aGlzLCBkZWxheSk7XG5cdH1cblx0c3luYyhzeW5jaHJvbml6ZXIpIHtcblx0XHRyZXR1cm4gU3RyZWFtLnN5bmModGhpcywgc3luY2hyb25pemVyKTtcblx0fVxufVxuXG5jbGFzcyBQdXNoU3RyZWFtIGV4dGVuZHMgU3RyZWFtIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKHNpbmspID0+IHRoaXMucHVzaCA9IHNpbmspO1xuXHR9XG59XG5cbmNsYXNzIENhbmNlbGFibGVTdHJlYW0gZXh0ZW5kcyBQdXNoU3RyZWFtIHtcblx0Y29uc3RydWN0b3IoY2FuY2VsxpIpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXNbX2NhbmNlbF0gPSBjYW5jZWzGki5iaW5kKHRoaXMpO1xuXHR9XG5cdGNhbmNlbCgpIHtcblx0XHR0aGlzW19jYW5jZWxdKCk7XG5cdFx0c3VwZXIoKTtcblx0fVxufVxuXG4vLyBzaG91bGQgSSBwcm9wYWdhdGUgdGhlIGNhbmNlbCBtZXRob2Q/XG5TdHJlYW0uc3Vic2NyaWJlID0gZnVuY3Rpb24oc291cmNlLCDGkikge1xuXHRsZXQgYsaSLFxuXHRcdHN0cmVhbSA9IG5ldyBDYW5jZWxhYmxlU3RyZWFtKGZ1bmN0aW9uKCkge1xuXHRcdFx0c291cmNlLnVuc3Vic2NyaWJlKGLGkik7XG5cdFx0fSk7XG5cdGLGkiA9IMaSLmJpbmQobnVsbCwgc3RyZWFtKTtcblx0c291cmNlLnN1YnNjcmliZShixpIpO1xuXHRyZXR1cm4gc3RyZWFtO1xufTtcblN0cmVhbS5tYXAgPSBmdW5jdGlvbihzb3VyY2UsIMaSKSB7XG5cdHJldHVybiB0aGlzLnN1YnNjcmliZShzb3VyY2UsIChzdHJlYW0sIHZhbHVlKSA9PiBzdHJlYW0ucHVzaCjGkih2YWx1ZSkpKTtcbn07XG5TdHJlYW0uZmlsdGVyID0gZnVuY3Rpb24oc291cmNlLCDGkikge1xuXHRyZXR1cm4gdGhpcy5zdWJzY3JpYmUoc291cmNlLCAoc3RyZWFtLCB2YWx1ZSkgPT4geyBpZijGkih2YWx1ZSkpIHN0cmVhbS5wdXNoKHZhbHVlKSB9KTtcbn07XG5TdHJlYW0udW5pcXVlID0gZnVuY3Rpb24oc291cmNlLCDGkiA9IGkgPT4ge2l9KSB7XG5cdHJldHVybiB0aGlzLmZpbHRlcihzb3VyY2UsIChmdW5jdGlvbigpIHtcblx0XHRsZXQgbGFzdCwgdDtcblx0XHRyZXR1cm4gZnVuY3Rpb24odikge1xuXHRcdFx0dCA9IMaSKHYpO1xuXHRcdFx0aWYobGFzdCAhPT0gdCkge1xuXHRcdFx0XHRsYXN0ID0gdDtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSkoKSk7XG59O1xuU3RyZWFtLnRvQm9vbCA9IGZ1bmN0aW9uKHNvdXJjZSkge1xuXHRyZXR1cm4gdGhpcy5tYXAoc291cmNlLCAodikgPT4gISF2KTtcbn07XG5TdHJlYW0ubmVnYXRlID0gZnVuY3Rpb24oc291cmNlKSB7XG5cdHJldHVybiB0aGlzLm1hcChzb3VyY2UsICh2KSA9PiAhdik7XG59O1xuU3RyZWFtLmxvZyA9IGZ1bmN0aW9uKHNvdXJjZSwgcHJlZml4KSB7XG5cdHJldHVybiB0aGlzLm1hcChzb3VyY2UsICh2KSA9PiB7XG5cdFx0aWYocHJlZml4KVxuXHRcdFx0Y29uc29sZS5sb2cocHJlZml4LCB2KTtcblx0XHRlbHNlXG5cdFx0XHRjb25zb2xlLmxvZyh2KTtcblx0XHRyZXR1cm4gdjtcblx0fSk7XG59O1xuU3RyZWFtLnppcCA9IGZ1bmN0aW9uKC4uLnNvdXJjZXMpIHtcblx0bGV0IGxlbmd0aCA9IHNvdXJjZXMubGVuZ3RoLFxuXHRcdHVuc3VicyA9IFtdLFxuXHRcdHN0cmVhbSA9IG5ldyBDYW5jZWxhYmxlU3RyZWFtKCgpID0+IHsgdW5zdWJzLm1hcCgoc291cmNlLCBpKSA9PiBzb3VyY2VzW2ldLnVuc3Vic2NyaWJlKHVuc3Vic1tpXSkpIH0pLFxuXHRcdHZhbHVlcyA9IG5ldyBBcnJheShsZW5ndGgpLFxuXHRcdGZsYWdzICA9IG5ldyBBcnJheShsZW5ndGgpLFxuXHRcdHVwZGF0ZSA9ICgpID0+IHtcblx0XHRcdGlmKGZsYWdzLmZpbHRlcigodikgPT4gdikubGVuZ3RoID09PSBsZW5ndGgpIHtcblx0XHRcdFx0dXBkYXRlID0gKCkgPT4gc3RyZWFtLnB1c2godmFsdWVzKTtcblx0XHRcdFx0dXBkYXRlKCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRmb3IodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcblx0XHQoKGkpID0+IHtcblx0XHRcdHNvdXJjZXNbaV0uc3Vic2NyaWJlKHVuc3Vic1tpXSA9ICh2KSA9PiB7XG5cdFx0XHRcdHZhbHVlc1tpXSA9IHY7XG5cdFx0XHRcdGZsYWdzW2ldID0gdHJ1ZTtcblx0XHRcdFx0dXBkYXRlKCk7XG5cdFx0XHR9KTtcblx0XHR9KShpKTtcblx0fVxuXHRyZXR1cm4gc3RyZWFtO1xufTtcblN0cmVhbS5zeW5jID0gZnVuY3Rpb24oc291cmNlLCBzeW5jaHJvbml6ZXIpIHtcblx0bGV0IHN0cmVhbSAgID0gbmV3IFB1c2hTdHJlYW0oKSxcblx0XHRoYXN2YWx1ZSA9IGZhbHNlLFxuXHRcdGhhc3B1bHNlID0gZmFsc2UsXG5cdFx0dmFsdWU7XG5cdHN5bmNocm9uaXplci5zdWJzY3JpYmUoKCkgPT4ge1xuXHRcdGlmKGhhc3ZhbHVlKSB7XG5cdFx0XHRoYXN2YWx1ZSA9IGZhbHNlO1xuXHRcdFx0c3RyZWFtLnB1c2godmFsdWUpO1xuXHRcdFx0dmFsdWUgPSB1bmRlZmluZWQ7XG5cdFx0fSBlbHNlIGlmKCFoYXNwdWxzZSkge1xuXHRcdFx0aGFzcHVsc2UgPSB0cnVlO1xuXHRcdH1cblx0fSk7XG5cdHNvdXJjZS5zdWJzY3JpYmUodiA9PiB7XG5cdFx0dmFsdWUgPSB2O1xuXHRcdGhhc3ZhbHVlID0gdHJ1ZTtcblx0XHRpZihoYXNwdWxzZSkge1xuXHRcdFx0aGFzcHVsc2UgPSBmYWxzZTtcblx0XHRcdHN0cmVhbS5wdXNoKHZhbHVlKTtcblx0XHRcdHZhbHVlID0gdW5kZWZpbmVkO1xuXHRcdFx0aGFzdmFsdWUgPSBmYWxzZTtcblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gc3RyZWFtO1xufTtcblN0cmVhbS5kZWJvdW5jZSA9IGZ1bmN0aW9uKHNvdXJjZSwgZGVsYXkpIHtcblx0bGV0IHN0cmVhbSAgID0gbmV3IFB1c2hTdHJlYW0oKSxcblx0XHRkZWxheWluZyA9IGZhbHNlLFxuXHRcdHQ7XG5cdHNvdXJjZS5zdWJzY3JpYmUodiA9PiB7XG5cdFx0dCA9IHY7XG5cdFx0aWYoZGVsYXlpbmcpXG5cdFx0XHRyZXR1cm47XG5cdFx0ZGVsYXlpbmcgPSB0cnVlO1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRkZWxheWluZyA9IGZhbHNlO1xuXHRcdFx0c3RyZWFtLnB1c2godCk7XG5cdFx0fSwgZGVsYXkpO1xuXHR9KTtcblx0cmV0dXJuIHN0cmVhbTtcbn07XG5TdHJlYW0uc3ByZWFkID0gZnVuY3Rpb24oc291cmNlLCDGkikge1xuXHRyZXR1cm4gdGhpcy5zdWJzY3JpYmUoc291cmNlLCAoc3RyZWFtLCBhcnIpID0+IHN0cmVhbS5wdXNoKMaSLmFwcGx5KG51bGwsIGFycikpKTtcbn07XG5TdHJlYW0uZmxhdE1hcCA9IGZ1bmN0aW9uKHNvdXJjZSkge1xuXHRyZXR1cm4gdGhpcy5zdWJzY3JpYmUoc291cmNlLCAoc3RyZWFtLCBhcnIpID0+IHtcblx0XHRmb3IobGV0IHYgaW4gYXJyKVxuXHRcdFx0c3RyZWFtLnB1c2godik7XG5cdH0pO1xufTtcblN0cmVhbS5tZXJnZSA9IGZ1bmN0aW9uKC4uLnNvdXJjZXMpIHtcblx0bGV0IHN0cmVhbSxcblx0XHTGkiA9ICh2KSA9PiBzdHJlYW0ucHVzaCh2KTtcblx0c3RyZWFtID0gbmV3IENhbmNlbGFibGVTdHJlYW0oKCkgPT4ge1xuXHRcdHNvdXJjZXMubWFwKChzb3VyY2UpID0+IHNvdXJjZS51bnN1YnNjcmliZSjGkikpO1xuXHR9KTtcblx0c291cmNlcy5tYXAoKHNvdXJjZSkgPT4gc291cmNlLnN1YnNjcmliZSjGkikpO1xuXHRyZXR1cm4gc3RyZWFtO1xufTtcblN0cmVhbS5pbnRlcnZhbCA9IGZ1bmN0aW9uKG1zLCB2YWx1ZSkge1xuXHRsZXQgaWQsXG5cdFx0c3RyZWFtID0gbmV3IENhbmNlbGFibGVTdHJlYW0oZnVuY3Rpb24oKSB7IGNsZWFySW50ZXJ2YWwoaWQpOyB9KTtcblx0aWQgPSBzZXRJbnRlcnZhbCgoKSA9PiBzdHJlYW0ucHVzaCh2YWx1ZSksIG1zKTtcblx0cmV0dXJuIHN0cmVhbTtcbn07XG5TdHJlYW0uZGVsYXkgPSBmdW5jdGlvbihtcywgdmFsdWUpIHtcblx0bGV0IGlkLFxuXHRcdHN0cmVhbSA9IG5ldyBDYW5jZWxhYmxlU3RyZWFtKGZ1bmN0aW9uKCkgeyBjbGVhclRpbWVvdXQoaWQpOyB9KTtcblx0aWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRzdHJlYW0ucHVzaCh2YWx1ZSk7XG5cdFx0Ly8gY2FuY2VsIG5lZWRzIHRvIGhhcHBlbiBhZnRlciB0aGUgcHVzaCBpcyByZWFsaXplZFxuXHRcdFRpbWVyLmltbWVkaWF0ZShzdHJlYW0uY2FuY2VsLmJpbmQoc3RyZWFtKSk7XG5cdH0sIG1zKTtcblx0cmV0dXJuIHN0cmVhbTtcbn07XG5TdHJlYW0ucmVkdWNlID0gZnVuY3Rpb24oc291cmNlLCBhY2MsIMaSKSB7XG5cdHJldHVybiB0aGlzLnN1YnNjcmliZShzb3VyY2UsIChzdHJlYW0sIHZhbHVlKSA9PiBzdHJlYW0ucHVzaChhY2MgPSDGkihhY2MsIHZhbHVlKSkpO1xufTtcblN0cmVhbS5mZWVkID0gZnVuY3Rpb24oc291cmNlLCBkZXN0KSB7XG5cdHJldHVybiB0aGlzLnN1YnNjcmliZShzb3VyY2UsIChzdHJlYW0sIHZhbHVlKSA9PiB7XG5cdFx0c3RyZWFtLnB1c2godmFsdWUpO1xuXHRcdGRlc3QucHVzaCh2YWx1ZSk7XG5cdH0pO1xufTtcblN0cmVhbS5mcm9tQXJyYXkgPSBmdW5jdGlvbih2YWx1ZXMpIHtcblx0bGV0IHN0cmVhbSA9IG5ldyBQdXNoU3RyZWFtKCk7XG5cdHZhbHVlcy5tYXAoKHYpID0+IHN0cmVhbS5wdXNoKHYpKTtcblx0cmV0dXJuIHN0cmVhbTtcbn07XG5TdHJlYW0uc2VxdWVuY2UgPSBmdW5jdGlvbih2YWx1ZXMsIGludGVydmFsLCByZXBlYXQgPSBmYWxzZSkge1xuXHRsZXQgaWQsXG5cdFx0c3RyZWFtID0gbmV3IENhbmNlbGFibGVTdHJlYW0oZnVuY3Rpb24oKSB7IGNsZWFySW50ZXJ2YWwoaWQpOyB9KSxcblx0XHRpbmRleCA9IDA7XG5cblx0aWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0aWYoaW5kZXggPT09IHZhbHVlcy5sZW5ndGgpIHtcblx0XHRcdGlmKHJlcGVhdCkge1xuXHRcdFx0XHRpbmRleCA9IDA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjbGVhckludGVydmFsKGlkKTtcblx0XHRcdFx0dGhpcy5jYW5jZWwoKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRzdHJlYW0ucHVzaCh2YWx1ZXNbaW5kZXgrK10pO1xuXHR9LCBpbnRlcnZhbCk7XG5cdHJldHVybiBzdHJlYW07XG59O1xuLy8gVE9ET1xuLy8gdW50aWwoxpIpXG4vLyB0YWtlKG4pXG4vLyBza2lwKG4pXG4vLyB0aHJvdHRsZVxuLy8gZmllbGQobmFtZSlcbi8vIG1ldGhvZChuYW1lLCAuLi5hcmdzKVxuXG5leHBvcnQgeyBTdHJlYW0sIFB1c2hTdHJlYW0gfTsiLCJpbXBvcnQgeyBTdHJlYW0gfSBmcm9tICcuL3N0cmVhbSdcblxudmFyIF92YWx1ZSA9IFN5bWJvbCgpLFxuXHRfZGVmYXVsdFZhbHVlID0gU3ltYm9sKCksXG5cdF91cGRhdGUgPSBTeW1ib2woKTtcblxuZXhwb3J0IGNsYXNzIFZhbHVlIGV4dGVuZHMgU3RyZWFtIHtcblx0Y29uc3RydWN0b3IodmFsdWUsIGRlZmF1bHRWYWx1ZSkge1xuXHRcdGxldCBjYWxsYmFjayA9IChzaW5rKSA9PiB7XG5cdFx0XHR0aGlzW191cGRhdGVdID0gc2luaztcblx0XHR9O1xuXHRcdHN1cGVyKGNhbGxiYWNrKTtcblx0XHR0aGlzW19kZWZhdWx0VmFsdWVdID0gZGVmYXVsdFZhbHVlO1xuXHRcdHRoaXNbX3ZhbHVlXSA9IHZhbHVlO1xuXHR9XG5cdHN1YnNjcmliZSjGkikge1xuXHRcdMaSKHRoaXNbX3ZhbHVlXSk7XG5cdFx0c3VwZXIuc3Vic2NyaWJlKMaSKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHRwdXNoKHZhbHVlKSB7XG5cdFx0aWYodmFsdWUgPT09IHRoaXNbX3ZhbHVlXSlcblx0XHRcdHJldHVybjtcblx0XHR0aGlzW192YWx1ZV0gPSB2YWx1ZTtcblx0XHR0aGlzW191cGRhdGVdKHZhbHVlKTtcblx0fVxuXHRnZXQgdmFsdWUoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3ZhbHVlXTtcblx0fVxuXHRzZXQgdmFsdWUodikge1xuXHRcdHRoaXMucHVzaCh2KTtcblx0fVxuXHRnZXQgaXNEZWZhdWx0KCkge1xuXHRcdHJldHVybiB0aGlzW192YWx1ZV0gPT09IHRoaXNbX2RlZmF1bHRWYWx1ZV07XG5cdH1cblx0cmVzZXQoKSB7XG5cdFx0dGhpcy52YWx1ZSA9IHRoaXNbX2RlZmF1bHRWYWx1ZV07XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIFN0cmluZ1ZhbHVlIGV4dGVuZHMgVmFsdWUge1xuXHRjb25zdHJ1Y3Rvcih2YWx1ZSA9IFwiXCIsIGRlZmF1bHRWYWx1ZSA9IHZhbHVlKSB7XG5cdFx0c3VwZXIodmFsdWUsIGRlZmF1bHRWYWx1ZSk7XG5cdH1cblx0cHVzaCh2YWx1ZSkge1xuXHRcdHN1cGVyLnB1c2goKHZhbHVlICYmIHZhbHVlLnRvU3RyaW5nICYmIHZhbHVlLnRvU3RyaW5nKCkpIHx8ICh2YWx1ZSAmJiAoXCJcIiArIHZhbHVlKSkgfHwgXCJcIik7XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIEJvb2xWYWx1ZSBleHRlbmRzIFZhbHVlIHtcblx0Y29uc3RydWN0b3IodmFsdWUgPSBmYWxzZSwgZGVmYXVsdFZhbHVlID0gdmFsdWUpIHtcblx0XHRzdXBlcih2YWx1ZSwgZGVmYXVsdFZhbHVlKTtcblx0fVxuXHRwdXNoKHZhbHVlKSB7XG5cdFx0c3VwZXIucHVzaCghIXZhbHVlKTtcblx0fVxuXHR0b2dnbGUoKSB7XG5cdFx0dGhpcy5wdXNoKCF0aGlzLnZhbHVlKTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgTnVtYmVyVmFsdWUgZXh0ZW5kcyBWYWx1ZSB7XG5cdGNvbnN0cnVjdG9yKHZhbHVlID0gMC4wLCBkZWZhdWx0VmFsdWUgPSB2YWx1ZSkge1xuXHRcdHN1cGVyKHZhbHVlLCBkZWZhdWx0VmFsdWUpO1xuXHR9XG5cdHB1c2godmFsdWUpIHtcblx0XHRzdXBlci5wdXNoKCtuZXcgTnVtYmVyKHZhbHVlKSk7XG5cdH1cbn1cblxudmFyIGRlZmF1bHREYXRlID0gbmV3IERhdGUobnVsbCk7XG5leHBvcnQgY2xhc3MgRGF0ZVZhbHVlIGV4dGVuZHMgVmFsdWUge1xuXHRjb25zdHJ1Y3Rvcih2YWx1ZSA9IGRlZmF1bHREYXRlLCBkZWZhdWx0VmFsdWUgPSB2YWx1ZSkge1xuXHRcdHN1cGVyKHZhbHVlLCBkZWZhdWx0VmFsdWUpO1xuXHR9XG5cdHB1c2godmFsdWUpIHtcblx0XHRzdXBlci5wdXNoKG5ldyBEYXRlKHZhbHVlKSk7XG5cdH1cbn0iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudCc7XG5cbmNsYXNzIEJsb2NrIGV4dGVuZHMgQ29tcG9uZW50IHtcblx0Y29uc3RydWN0b3Iob3B0aW9ucykge1xuXHRcdHN1cGVyKG9wdGlvbnMpO1xuXHR9XG59XG5cbmV4cG9ydCB7IEJsb2NrIH07IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG5cbmJ1Zi5wdXNoKFwiPGJ1dHRvbj48c3BhbiBjbGFzcz1cXFwiY29udGVudFxcXCI+PC9zcGFuPjwvYnV0dG9uPlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQgeyBQdXNoU3RyZWFtIH0gZnJvbSAnc3RyZWFteS9zdHJlYW0nO1xuaW1wb3J0IHsgSWNvblByb3BlcnR5LCBDbGlja1Byb3BlcnR5IH0gZnJvbSAnLi9wcm9wZXJ0aWVzL3R5cGVzJztcblxubGV0IHRlbXBsYXRlID0gcmVxdWlyZSgnLi9idXR0b24uamFkZScpKCksXG5cdF9jbGljayAgID0gU3ltYm9sKCk7XG5cbmNsYXNzIEJ1dHRvbiBleHRlbmRzIENvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuXHRcdGlmKCEoJ3RlbXBsYXRlJyBpbiBvcHRpb25zKSlcblx0XHRcdG9wdGlvbnMudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcblx0XHRzdXBlcihvcHRpb25zKTtcblx0XHR0aGlzLnByb3BlcnRpZXMuYWRkKG5ldyBDbGlja1Byb3BlcnR5KCkpO1xuXHR9XG59XG5cbkJ1dHRvbi5pY29uID0gZnVuY3Rpb24obmFtZSwgb3B0aW9ucykge1xuXHRsZXQgYnV0dG9uID0gbmV3IEJ1dHRvbihvcHRpb25zKTtcblx0YnV0dG9uLnByb3BlcnRpZXMuYWRkKG5ldyBJY29uUHJvcGVydHkobmFtZSkpO1xuXHRyZXR1cm4gYnV0dG9uO1xufTtcblxuZXhwb3J0IHsgQnV0dG9uIH07IiwiaW1wb3J0IHsgSHRtbCB9IGZyb20gJ3VpL2RvbSc7XG5pbXBvcnQgeyBQcm9wZXJ0aWVzIH0gZnJvbSAnLi9wcm9wZXJ0aWVzJztcbmltcG9ydCB7IFB1c2hTdHJlYW0gfSBmcm9tICdzdHJlYW15L3N0cmVhbSc7XG5cbmxldCBjcmVhdGVJZCA9IHJlcXVpcmUoJ25vZGUtdXVpZCcpLnY0O1xuXG5sZXQgX3AgPSBTeW1ib2woKTtcblxuY2xhc3MgQ29tcG9uZW50IHtcblx0Y29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG5cdFx0bmV3IFByb3BlcnRpZXModGhpcyk7XG5cdFx0dGhpc1tfcF0gPSB7XG5cdFx0XHRjaGlsZHJlbjogW10sXG5cdFx0XHRlbDogSHRtbC5wYXJzZShvcHRpb25zLnRlbXBsYXRlKSxcblx0XHRcdGF0dGFjaGVkOiBmYWxzZSxcblx0XHRcdHV1aWQ6IG9wdGlvbnMudXVpZCB8fCBjcmVhdGVJZCgpLFxuXHRcdFx0Zm9jdXNTdHJlYW06IG5ldyBQdXNoU3RyZWFtKClcblx0XHR9O1xuXHRcdGlmKG9wdGlvbnMuY2xhc3Nlcylcblx0XHRcdHRoaXNbX3BdLmVsLmNsYXNzTGlzdC5hZGQob3B0aW9ucy5jbGFzc2VzKTtcblx0XHRpZihvcHRpb25zLnBhcmVudClcblx0XHRcdG9wdGlvbnMucGFyZW50LmFkZCh0aGlzKTtcblx0fVxuXG5cdGF0dGFjaFRvKGNvbnRhaW5lcikge1xuXHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmVsKTtcblx0XHR0aGlzW19wXS5hdHRhY2hlZCA9IHRydWU7XG5cdH1cblxuXHRkZXRhY2goKSB7XG5cdFx0aWYoIXRoaXMuaXNBdHRhY2hlZClcblx0XHRcdHRocm93IG5ldyBFcnJvcignQ29tcG9uZW50IGlzIG5vdCBhdHRhY2hlZCcpO1xuXHRcdHRoaXMuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmVsKTtcblx0XHR0aGlzW19wXS5hdHRhY2hlZCA9IGZhbHNlO1xuXHR9XG5cblx0ZGVzdHJveSgpIHtcblx0XHRpZih0aGlzLnBhcmVudClcblx0XHRcdHRoaXMucGFyZW50LnJlbW92ZSh0aGlzKTtcblx0XHRpZih0aGlzLmlzQXR0YWNoZWQpXG5cdFx0XHR0aGlzLmRldGFjaCgpO1xuXHRcdHRoaXMucHJvcGVydGllcy5yZW1vdmVBbGwoKTtcblx0fVxuXG5cdGFkZChjaGlsZCkge1xuXHRcdGlmKGNoaWxkLnBhcmVudClcblx0XHRcdGNoaWxkLnBhcmVudC5yZW1vdmUoY2hpbGQpO1xuXHRcdHRoaXNbX3BdLmNoaWxkcmVuLnB1c2goY2hpbGQpO1xuXHRcdGNoaWxkW19wXS5wYXJlbnQgPSB0aGlzO1xuXHRcdGNoaWxkW19wXS5fX2NhbmNlbEZvY3VzU3RyZWFtID0gY2hpbGQuZm9jdXNTdHJlYW0uZmVlZCh0aGlzLmZvY3VzU3RyZWFtKTtcblx0fVxuXG5cdHJlbW92ZShjaGlsZCkge1xuXHRcdGxldCBpID0gdGhpc1tfcF0uY2hpbGRyZW4uaW5kZXhPZihjaGlsZCk7XG5cdFx0aWYoaSA8IDApXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYCcke2NoaWxkfSBpcyBub3QgY2hpbGQgb2YgdGhpcydgKTtcblx0XHRjaGlsZFtfcF0uX19jYW5jZWxGb2N1c1N0cmVhbS5jYW5jZWwoKTtcblx0XHR0aGlzW19wXS5jaGlsZHJlbi5zcGxpY2UoaSwgMSk7XG5cdFx0Y2hpbGRbX3BdLnBhcmVudCA9IG51bGw7XG5cdH1cblxuXHRnZXQgZWwoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3BdLmVsO1xuXHR9XG5cblx0Z2V0IHBhcmVudCgpIHtcblx0XHRyZXR1cm4gdGhpc1tfcF0ucGFyZW50O1xuXHR9XG5cblx0Z2V0IGZvY3VzU3RyZWFtKCkge1xuXHRcdHJldHVybiB0aGlzW19wXS5mb2N1c1N0cmVhbTtcblx0fVxuXG5cdGdldCB1dWlkKCkge1xuXHRcdHJldHVybiB0aGlzW19wXS51dWlkO1xuXHR9XG5cblx0Z2V0IGlzQXR0YWNoZWQoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3BdLmF0dGFjaGVkO1xuXHR9XG5cblx0dG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuIGBjb21wb25lbnQ6ICR7dGhpcy51dWlkfWA7XG5cdH1cbn1cblxuZXhwb3J0IHsgQ29tcG9uZW50IH07IiwibGV0IHAgPSBTeW1ib2woKSxcblx0SHRtbCA9IHtcblx0cGFyc2VBbGwoaHRtbCkge1xuXHRcdGxldCBlbCAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0ZWwuaW5uZXJIVE1MID0gaHRtbDtcblx0XHRyZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGVsLmNoaWxkTm9kZXMpO1xuXHR9LFxuXHRwYXJzZShodG1sKSB7XG5cdFx0cmV0dXJuIHRoaXMucGFyc2VBbGwoaHRtbClbMF07XG5cdH1cbn07XG5cbmNsYXNzIERvbVN0cmVhbSB7XG5cdGNvbnN0cnVjdG9yKHNvdXJjZSkge1xuXHRcdHRoaXNbcF0gPSBzb3VyY2U7XG5cdH1cblx0b24oZXZlbnQsIGVsKSB7XG5cdFx0bGV0IMaSID0gKGUpID0+IHRoaXNbcF0ucHVzaChlKTtcblx0XHRlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCDGkiwgZmFsc2UpO1xuXHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHRlbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCDGkiwgZmFsc2UpO1xuXHRcdH07XG5cdH1cblx0YXBwbHlEaXNwbGF5KGVsLCBkaXNwbGF5ID0gXCJcIikge1xuXHRcdGxldCBvbGQgPSBlbC5zdHlsZS5kaXNwbGF5LFxuXHRcdFx0xpIgPSAodikgPT4gZWwuc3R5bGUuZGlzcGxheSA9IHYgPyBkaXNwbGF5IDogXCJub25lXCI7XG5cdFx0dGhpc1twXS5zdWJzY3JpYmUoxpIpO1xuXHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHR0aGlzW3BdLnVuc3Vic2NyaWJlKMaSKTtcblx0XHRcdGVsLnN0eWxlLmRpc3BsYXkgPSBvbGQ7XG5cdFx0fTtcblx0fVxuXHRhcHBseVRleHQoZWwpIHtcblx0XHRsZXQgb2xkID0gZWwuaW5uZXJUZXh0LFxuXHRcdFx0xpIgPSAodikgPT4gZWwuaW5uZXJUZXh0ID0gdiB8fCBcIlwiO1xuXHRcdHRoaXNbcF0uc3Vic2NyaWJlKMaSKTtcblx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0dGhpc1twXS51bnN1YnNjcmliZSjGkik7XG5cdFx0XHTGkihvbGQpO1xuXHRcdH07XG5cdH1cblx0YXBwbHlIdG1sKGVsKSB7XG5cdFx0bGV0IG9sZCA9IGVsLmlubmVySFRNTCxcblx0XHRcdMaSID0gKHYpID0+IGVsLmlubmVySFRNTCA9IHYgfHwgXCJcIjtcblx0XHR0aGlzW3BdLnN1YnNjcmliZSjGkik7XG5cdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdHRoaXNbcF0udW5zdWJzY3JpYmUoxpIpO1xuXHRcdFx0xpIob2xkKTtcblx0XHR9O1xuXHR9XG5cdGFwcGx5QXR0cmlidXRlKG5hbWUsIGVsKSB7XG5cdFx0bGV0IG9sZCA9IGVsLmdldEF0dHJpYnV0ZShuYW1lKSxcblx0XHRcdMaSID0gKHYpID0+IHtcblx0XHRcdFx0diA9PSBudWxsID8gZWwucmVtb3ZlQXR0cmlidXRlKG5hbWUpIDogZWwuc2V0QXR0cmlidXRlKG5hbWUsIHYpO1xuXHRcdFx0fVxuXHRcdHRoaXNbcF0uc3Vic2NyaWJlKMaSKTtcblx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0dGhpc1twXS51bnN1YnNjcmliZSjGkik7XG5cdFx0XHTGkihvbGQpO1xuXHRcdH07XG5cdH1cblx0YXBwbHlTd2FwQXR0cmlidXRlKG5hbWUsIGVsKSB7XG5cdFx0bGV0IG9sZCA9IGVsLmhhc0F0dHJpYnV0ZShuYW1lKSxcblx0XHRcdMaSID0gKHYpID0+IHtcblx0XHRcdFx0ISF2ID8gZWwuc2V0QXR0cmlidXRlKG5hbWUsIG5hbWUpIDogZWwucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuXHRcdFx0fVxuXHRcdHRoaXNbcF0uc3Vic2NyaWJlKMaSKTtcblx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0dGhpc1twXS51bnN1YnNjcmliZSjGkik7XG5cdFx0XHTGkihvbGQpO1xuXHRcdH07XG5cdH1cblx0YXBwbHlTd2FwQ2xhc3MoZWwsIGNsYXNzTmFtZSkge1xuXHRcdGxldCBoYXMgPSBlbC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSxcblx0XHRcdMaSID0gKHYpID0+IHYgPyBlbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSkgOiBlbC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG5cdFx0dGhpc1twXS5zdWJzY3JpYmUoxpIpO1xuXHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHR0aGlzW3BdLnVuc3Vic2NyaWJlKMaSKTtcblx0XHRcdMaSKGhhcyk7XG5cdFx0fTtcblx0fVxufVxuXG5sZXQgRG9tID0ge1xuXHRzdHJlYW0oc291cmNlKSB7XG5cdFx0cmV0dXJuIG5ldyBEb21TdHJlYW0oc291cmNlKTtcblx0fSxcblx0cmVhZHkoxpIpIHtcblx0XHRpZijGkilcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIMaSLCBmYWxzZSk7XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCByZXNvbHZlLCBmYWxzZSkpO1xuXHR9XG59XG5cbmxldCBRdWVyeSA9IHtcblx0Zmlyc3Qoc2VsZWN0b3IsIGN0eCkge1xuXHRcdHJldHVybiAoY3R4IHx8IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcblx0fSxcblxuXHRhbGwoc2VsZWN0b3IsIGN0eCkge1xuXHRcdHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCgoY3R4IHx8IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSwgMCk7XG5cdH1cbn07XG5cbmV4cG9ydCB7IEh0bWwsIFF1ZXJ5LCBEb20gfTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcblxuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJmaWVsZC1jb250YWluZXJcXFwiPjxkaXYgY2xhc3M9XFxcImZpZWxkXFxcIj48ZGl2IGNsYXNzPVxcXCJrZXlcXFwiPjwvZGl2PjxkaXYgY2xhc3M9XFxcInZhbHVlXFxcIj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJjYWxjdWxhdGVkXFxcIj48L2Rpdj48aHIvPjwvZGl2PlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQgeyBGcmFnbWVudCB9IGZyb20gJy4vZnJhZ21lbnQnO1xuaW1wb3J0IHsgUXVlcnkgfSBmcm9tICd1aS9kb20nO1xuXG5sZXQgdGVtcGxhdGUgPSByZXF1aXJlKCcuL2ZpZWxkLmphZGUnKSgpLFxuXHRfcCA9IFN5bWJvbCgpO1xuXG5leHBvcnQgY2xhc3MgRmllbGQgZXh0ZW5kcyBDb21wb25lbnQge1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcblx0XHRpZighKCd0ZW1wbGF0ZScgaW4gb3B0aW9ucykpXG5cdFx0XHRvcHRpb25zLnRlbXBsYXRlID0gdGVtcGxhdGU7XG5cdFx0c3VwZXIob3B0aW9ucyk7XG5cblx0XHRsZXQga2V5ICAgPSBuZXcgRnJhZ21lbnQoeyBwYXJlbnQgOiB0aGlzIH0pLFxuXHRcdFx0dmFsdWUgPSBuZXcgRnJhZ21lbnQoeyBwYXJlbnQgOiB0aGlzIH0pO1xuXG5cdFx0a2V5LmF0dGFjaFRvKFF1ZXJ5LmZpcnN0KCcua2V5JywgdGhpcy5lbCkpO1xuXHRcdHZhbHVlLmF0dGFjaFRvKFF1ZXJ5LmZpcnN0KCcudmFsdWUnLCB0aGlzLmVsKSk7XG5cblx0XHR0aGlzW19wXSA9IHsga2V5LCB2YWx1ZSB9O1xuXHR9XG5cblx0Z2V0IGtleSgpIHtcblx0XHRyZXR1cm4gdGhpc1tfcF0ua2V5O1xuXHR9XG5cblx0Z2V0IHZhbHVlKCkge1xuXHRcdHJldHVybiB0aGlzW19wXS52YWx1ZTtcblx0fVxufSIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxzcGFuIGNsYXNzPVxcXCJmcmFnbWVudFxcXCI+PHNwYW4gY2xhc3M9XFxcImNvbnRlbnRcXFwiPjwvc3Bhbj48L3NwYW4+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50JztcblxubGV0IHRlbXBsYXRlID0gcmVxdWlyZSgnLi9mcmFnbWVudC5qYWRlJykoKTtcblxuY2xhc3MgRnJhZ21lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcblx0XHRpZighKCd0ZW1wbGF0ZScgaW4gb3B0aW9ucykpXG5cdFx0XHRvcHRpb25zLnRlbXBsYXRlID0gdGVtcGxhdGU7XG5cdFx0c3VwZXIob3B0aW9ucyk7XG5cdH1cbn1cblxuZXhwb3J0IHsgRnJhZ21lbnQgfTsiLCJpbXBvcnQgeyBCbG9jayB9IGZyb20gJy4vYmxvY2snO1xuaW1wb3J0IHsgRnJhZ21lbnQgfSBmcm9tICcuL2ZyYWdtZW50JztcblxubGV0IF9mcmFnbWVudHMgPSBTeW1ib2woKTtcblxuY2xhc3MgRnJhZ21lbnRCbG9jayBleHRlbmRzIEJsb2NrIHtcblx0Y29uc3RydWN0b3IoLi4uYXJncykge1xuXHRcdHN1cGVyKC4uLmFyZ3MpO1xuXHRcdHRoaXNbX2ZyYWdtZW50c10gPSBbXTtcblx0fVxuXG5cdGNyZWF0ZUZyYWdtZW50KCkge1xuXHRcdHZhciBmcmFnbWVudCA9IG5ldyBGcmFnbWVudCgpO1xuXHRcdHRoaXNbX2ZyYWdtZW50c10ucHVzaChmcmFnbWVudCk7XG5cdFx0ZnJhZ21lbnQuYXR0YWNoVG8odGhpcy5lbCk7XG5cdFx0cmV0dXJuIGZyYWdtZW50O1xuXHR9XG59XG5cbmV4cG9ydCB7IEZyYWdtZW50QmxvY2sgfTsiLCJpbXBvcnQgeyBQdXNoU3RyZWFtIH0gZnJvbSAnc3RyZWFteS9zdHJlYW0nO1xuXG5sZXQgX2RhdGEgICAgPSBTeW1ib2woKSxcblx0X3NjaGVtYSAgPSBTeW1ib2woKSxcblx0X3N0cmVhbSAgPSBTeW1ib2woKSxcblx0X28gICAgICAgPSBTeW1ib2woKSxcblx0aWRlbnRpdHkgPSAoKSA9PiBmYWxzZTtcblxuZnVuY3Rpb24gcmVzb2x2ZVNldHRlcih0YXJnZXQsIHBhdGgpIHtcblx0aWYocGF0aCBpbiB0YXJnZXQpIHtcblx0XHRyZXR1cm4gKHYpID0+IHtcblx0XHRcdHRhcmdldFtwYXRoXSA9IHY7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIGlkZW50aXR5O1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVJbml0aWFsaXplcih0YXJnZXQsIHBhdGgpIHtcblx0cmV0dXJuICh2KSA9PiB7XG5cdFx0dGFyZ2V0W3BhdGhdID0gdjtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZURlbGV0ZXIodGFyZ2V0LCBwYXRoKSB7XG5cdHJldHVybiAoKSA9PiB7XG5cdFx0ZGVsZXRlIHRhcmdldFtwYXRoXTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVJlbmFtZXIodGFyZ2V0LCBwYXRoKSB7XG5cdHJldHVybiAobmV3bmFtZSkgPT4ge1xuXHRcdGxldCBvbGQgPSB0YXJnZXRbcGF0aF07XG5cdFx0ZGVsZXRlIHRhcmdldFtwYXRoXTtcblx0XHR0YXJnZXRbbmV3bmFtZV0gPSBvbGQ7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH07XG59XG5cbmZ1bmN0aW9uIGd1ZXNzTmFtZShrZXlzLCBwcmVmaXggPSBcImZpZWxkIFwiKSB7XG5cdGxldCBtYXggPSAtMSxcblx0XHR2YWx1ZTtcblx0Zm9yKGxldCBrZXkgb2Yga2V5cykge1xuXHRcdGlmKGtleS5pbmRleE9mKHByZWZpeCkgPT09IDApIHtcblx0XHRcdHZhbHVlID0gcGFyc2VJbnQoa2V5LnN1YnN0cihwcmVmaXgubGVuZ3RoKSwgMTApO1xuXHRcdFx0aWYoaXNOYU4odmFsdWUpIHx8IHZhbHVlIDwgMClcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRpZih2YWx1ZSA+IG1heClcblx0XHRcdFx0bWF4ID0gdmFsdWU7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBwcmVmaXggKyAobWF4ICsgMSk7XG59XG5cbmV4cG9ydCBjbGFzcyBNb2RlbCB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdGxldCBkYXRhICAgID0gdGhpc1tfZGF0YV0gICA9IG5ldyBQdXNoU3RyZWFtKCksXG5cdFx0XHRzY2hlbWEgID0gdGhpc1tfc2NoZW1hXSA9IG5ldyBQdXNoU3RyZWFtKCksXG5cdFx0XHRzdHJlYW0gID0gbmV3IFB1c2hTdHJlYW0oKSxcblx0XHRcdG8gICAgICAgPSB0aGlzW19vXSAgICAgID0ge307XG5cblx0XHR0aGlzW19zdHJlYW1dID0gc3RyZWFtLmRlYm91bmNlKDEwMCkudW5pcXVlKEpTT04uc3RyaW5naWZ5KTtcblxuXHRcdGRhdGEuc3Vic2NyaWJlKGUgPT4ge1xuXHRcdFx0aWYocmVzb2x2ZVNldHRlcihvLCBlLnBhdGgpKGUudmFsdWUpKVxuXHRcdFx0XHRzdHJlYW0ucHVzaChvKTtcblx0XHR9KTtcblx0XHRzY2hlbWEuc3Vic2NyaWJlKGUgPT4ge1xuXHRcdFx0c3dpdGNoKGUuZXZlbnQpIHtcblx0XHRcdFx0Y2FzZSAnbGlzdCc6XG5cdFx0XHRcdFx0byA9IHRoaXNbX29dID0ge307XG5cdFx0XHRcdFx0bGV0IHJlcyA9IGUuZGF0YS5tYXAoKHBhaXIpID0+IHJlc29sdmVJbml0aWFsaXplcihvLCBwYWlyLm5hbWUpKG51bGwpKTtcblx0XHRcdFx0XHRpZihyZXMuZmlsdGVyKHIgPT4gcikubGVuZ3RoID09PSByZXMubGVuZ3RoKVxuXHRcdFx0XHRcdFx0c3RyZWFtLnB1c2gobyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ2FkZCc6XG5cdFx0XHRcdFx0aWYocmVzb2x2ZUluaXRpYWxpemVyKG8sIGUubmFtZSkobnVsbCkpXG5cdFx0XHRcdFx0XHRzdHJlYW0ucHVzaChvKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnZGVsZXRlJzpcblx0XHRcdFx0XHRpZihyZXNvbHZlRGVsZXRlcihvLCBlLm5hbWUpKCkpXG5cdFx0XHRcdFx0XHRzdHJlYW0ucHVzaChvKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAncmVuYW1lJzpcblx0XHRcdFx0XHRpZihyZXNvbHZlUmVuYW1lcihvLCBlLm9sZG5hbWUpKGUubmV3bmFtZSkpXG5cdFx0XHRcdFx0XHRzdHJlYW0ucHVzaChvKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGdldCBkYXRhKCkge1xuXHRcdHJldHVybiB0aGlzW19kYXRhXTtcblx0fVxuXG5cdGdldCBzY2hlbWEoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3NjaGVtYV07XG5cdH1cblxuXHRnZXQgc3RyZWFtKCkge1xuXHRcdHJldHVybiB0aGlzW19zdHJlYW1dO1xuXHR9XG5cblx0Z2V0IGtleXMoKSB7XG5cdFx0cmV0dXJuIE9iamVjdC5rZXlzKHRoaXNbX29dKTtcblx0fVxuXG5cdG5leHRGaWVsZE5hbWUoKSB7XG5cdFx0cmV0dXJuIGd1ZXNzTmFtZSh0aGlzLmtleXMpO1xuXHR9XG5cblx0dG9KU09OKCkge1xuXHRcdHJldHVybiB0aGlzW19vXTtcblx0fVxufSIsImxldCBfcCA9IFN5bWJvbCgpO1xuXG5pbXBvcnQgeyBNb2RlbFZpZXcsIFNjaGVtYVdyYXBwZXIgfSBmcm9tICcuL21vZGVsdmlldyc7XG5pbXBvcnQgeyBNb2RlbFZpZXdUb29sYmFyIH0gZnJvbSAnLi9tb2RlbHZpZXd0b29sYmFyJztcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50JztcblxuZXhwb3J0IGNsYXNzIE1vZGVsVUkgZXh0ZW5kcyBDb21wb25lbnQge1xuXG5cdGNvbnN0cnVjdG9yKG1vZGVsLCBzY2hlbWEpIHtcblx0XHRzdXBlcih7IHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cIm1vZGVsIG1vZGVsdWlcIj48L2Rpdj4nIH0pO1xuXHRcdGxldCBtb2RlbFZpZXcgPSBuZXcgTW9kZWxWaWV3KCksXG5cdFx0XHR3cmFwcGVyID0gbmV3IFNjaGVtYVdyYXBwZXIoc2NoZW1hLCBtb2RlbFZpZXcpLFxuXHRcdFx0dG9vbGJhciA9IG5ldyBNb2RlbFZpZXdUb29sYmFyKG1vZGVsVmlldywgbW9kZWwsIHNjaGVtYSk7XG5cdFx0dGhpc1tfcF0gPSB7XG5cdFx0XHRtb2RlbCxcblx0XHRcdHNjaGVtYSxcblx0XHRcdG1vZGVsVmlldyxcblx0XHRcdHRvb2xiYXJcblx0XHR9O1xuXG5cdFx0dG9vbGJhci5hdHRhY2hUbyh0aGlzLmVsKTtcblx0XHRtb2RlbFZpZXcuYXR0YWNoVG8odGhpcy5lbCk7XG5cblx0XHRzY2hlbWEuc3RyZWFtLmZlZWQobW9kZWwuc2NoZW1hKTtcblx0XHRtb2RlbFZpZXcuZGF0YS5mZWVkKG1vZGVsLmRhdGEpO1xuXHR9XG5cblx0Z2V0IG1vZGVsKCkge1xuXHRcdHJldHVybiB0aGlzW19wXS5tb2RlbDtcblx0fVxuXG5cdGdldCBzY2hlbWEoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3BdLnNjaGVtYTtcblx0fVxuXG5cdGdldCBtb2RlbFZpZXcoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3BdLm1vZGVsVmlldztcblx0fVxuXG5cdGdldCB0b29sYmFyKCkge1xuXHRcdHJldHVybiB0aGlzW19wXS50b29sYmFyO1xuXHR9XG59IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG5cbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwibW9kZWx2aWV3XFxcIj48L2Rpdj5cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnQnO1xuaW1wb3J0IHsgVGV4dFByb3BlcnR5LCBUZXh0RWRpdG9yUHJvcGVydHksIEVkaXRvclByb3BlcnR5IH0gZnJvbSAnLi9wcm9wZXJ0aWVzL3R5cGVzJ1xuaW1wb3J0IHsgRmllbGQgfSBmcm9tICcuL2ZpZWxkJztcbmltcG9ydCB7IFB1c2hTdHJlYW0gfSBmcm9tICdzdHJlYW15L3N0cmVhbSc7XG5cbmxldCB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4vbW9kZWx2aWV3LmphZGUnKSgpLFxuXHRfZmllbGRzICA9IFN5bWJvbCgpLFxuXHRfZGF0YSAgICA9IFN5bWJvbCgpLFxuXHRfc2NoZW1hICA9IFN5bWJvbCgpO1xuXG5leHBvcnQgY2xhc3MgTW9kZWxWaWV3IGV4dGVuZHMgQ29tcG9uZW50IHtcblx0Y29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG5cdFx0aWYoISgndGVtcGxhdGUnIGluIG9wdGlvbnMpKVxuXHRcdFx0b3B0aW9ucy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuXHRcdHN1cGVyKG9wdGlvbnMpO1xuXHRcdHRoaXNbX2ZpZWxkc10gPSB7fTtcblx0XHR0aGlzW19kYXRhXSAgID0gbmV3IFB1c2hTdHJlYW0oKTtcblx0XHR0aGlzW19zY2hlbWFdID0gbmV3IFB1c2hTdHJlYW0oKTtcblxuXHRcdHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBlID0+IGNvbnNvbGUubG9nKCdmb2N1cycsIGUpLCBmYWxzZSk7XG5cdH1cblx0cmVzZXQoKSB7XG5cdFx0dGhpcy5hcnJheS5tYXAoKGtleSkgPT4gdGhpcy5kZWxldGVGaWVsZChuYW1lKSk7XG5cdH1cblx0YWRkRmllbGQobmFtZSwgdHlwZSkge1xuXHRcdGxldCBmaWVsZCA9IG5ldyBGaWVsZCh7IHBhcmVudDogdGhpcyB9KTtcblx0XHRmaWVsZC5hdHRhY2hUbyh0aGlzLmVsKTtcblxuXHRcdGZpZWxkLmtleS5wcm9wZXJ0aWVzLmFkZChuZXcgVGV4dFByb3BlcnR5KCkpO1xuXHRcdGZpZWxkLmtleS5wcm9wZXJ0aWVzLmFkZChuZXcgVGV4dEVkaXRvclByb3BlcnR5KCkpO1xuXHRcdGZpZWxkLmtleS5lZGl0b3IudmFsdWUuZmVlZChmaWVsZC5rZXkudGV4dCk7XG5cdFx0bGV0IGxhc3Q7XG5cdFx0ZmllbGQua2V5LmVkaXRvci52YWx1ZS5tYXAodiA9PiB7XG5cdFx0XHR0aGlzW19zY2hlbWFdLnB1c2goeyBldmVudDoncmVuYW1lJywgb2xkbmFtZTpsYXN0LCBuZXduYW1lOiB2fSk7XG5cdFx0XHRsYXN0ID0gdjtcblx0XHR9KTtcblx0XHRmaWVsZC5rZXkuZWRpdG9yLnZhbHVlID0gbmFtZTtcblxuXHRcdGZpZWxkLnZhbHVlLnByb3BlcnRpZXMuYWRkKEVkaXRvclByb3BlcnR5LmNyZWF0ZSh0eXBlKSk7XG5cblx0XHRsZXQgc3RyZWFtID0gZmllbGQudmFsdWUuZWRpdG9yLnZhbHVlLm1hcCh2ID0+ICh7IHBhdGggOiBmaWVsZC5rZXkuZWRpdG9yLnZhbHVlLnZhbHVlLCB2YWx1ZSA6IHYgfSkpO1xuXHRcdHN0cmVhbS5mZWVkKHRoaXNbX2RhdGFdKTtcblxuXHRcdHRoaXNbX2ZpZWxkc11bbmFtZV0gPSB7IGZpZWxkLCBzdHJlYW0gfVxuXHR9XG5cdGRlbGV0ZUZpZWxkKG5hbWUpIHtcblx0XHRsZXQgcGFpciA9IHRoaXMuZ2V0UGFpcihuYW1lKTtcblx0XHRwYWlyLmZpZWxkLmRlc3Ryb3koKTtcblx0XHRwYWlyLnN0cmVhbS5jYW5jZWwoKTtcblx0XHRkZWxldGUgdGhpc1tfZmllbGRzXVtuYW1lXTtcblx0fVxuXHRyZW5hbWVGaWVsZChvbGRuYW1lLCBuZXduYW1lKSB7XG5cdFx0bGV0IHBhaXIgPSB0aGlzLmdldFBhaXIob2xkbmFtZSk7XG5cdFx0ZGVsZXRlIHRoaXNbX2ZpZWxkc11bb2xkbmFtZV07XG5cdFx0dGhpc1tfZmllbGRzXVtuZXduYW1lXSA9IHBhaXI7XG5cdFx0cGFpci5maWVsZC5rZXkuZWRpdG9yLnZhbHVlID0gbmV3bmFtZTtcblx0fVxuXHRyZXR5cGVGaWVsZChuYW1lLCB0eXBlKSB7XG5cdFx0bGV0IHBhaXIgPSB0aGlzLmdldFBhaXIobmFtZSk7XG5cdFx0cGFpci5zdHJlYW0uY2FuY2VsKCk7XG5cdFx0cGFpci5maWVsZC52YWx1ZS5wcm9wZXJ0aWVzLnJlbW92ZSgnZWRpdG9yJyk7XG5cdFx0cGFpci5maWVsZC52YWx1ZS5wcm9wZXJ0aWVzLmFkZChFZGl0b3JQcm9wZXJ0eS5jcmVhdGUodHlwZSkpO1xuXHRcdGxldCBzdHJlYW0gPSBwYWlyLmZpZWxkLnZhbHVlLmVkaXRvci52YWx1ZS5tYXAodiA9PiAoeyBwYXRoIDogbmFtZSwgdmFsdWUgOiB2IH0pKTtcblx0XHRzdHJlYW0uZmVlZCh0aGlzW19kYXRhXSk7XG5cdFx0cGFpci5maWVsZC52YWx1ZS5lZGl0b3IudmFsdWUuZmVlZChwYWlyLmZpZWxkLnZhbHVlLnRleHQpO1xuXHR9XG5cblx0dG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuIGBNb2RlbFZpZXc6ICR7dGhpcy51dWlkfWA7XG5cdH1cblxuXHRnZXRQYWlyKG5hbWUpIHtcblx0XHRsZXQgcGFpciA9IHRoaXNbX2ZpZWxkc11bbmFtZV07XG5cdFx0aWYoIXBhaXIpIHRocm93IG5ldyBFcnJvcihgZmllbGQgJyR7bmFtZX0gbm90IGZvdW5kIGluIE1vZGVsVmlldydgKTtcblx0XHRyZXR1cm4gcGFpcjtcblx0fVxuXG5cdGdldEZpZWxkKG5hbWUpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRQYWlyKG5hbWUpLmZpZWxkO1xuXHR9XG5cblx0W1N5bWJvbC5pdGVyYXRvcl0oKSB7XG5cdFx0cmV0dXJuIHRoaXMuYXJyYXk7XG5cdH1cblxuXHRnZXQgYXJyYXkoKSB7XG5cdFx0cmV0dXJuIE9iamVjdC5rZXlzKHRoaXNbX2ZpZWxkc10pO1xuXHR9XG5cblx0Z2V0IGRhdGEoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX2RhdGFdO1xuXHR9XG5cblx0Z2V0IHNjaGVtYSgpIHtcblx0XHRyZXR1cm4gdGhpc1tfc2NoZW1hXTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgU2NoZW1hV3JhcHBlciB7XG5cdGNvbnN0cnVjdG9yKHNjaGVtYSwgdmlldykge1xuXHRcdHRoaXMuc2NoZW1hID0gc2NoZW1hO1xuXHRcdHRoaXMudmlldyA9IHZpZXc7XG5cdFx0c2NoZW1hLnN0cmVhbS5zdWJzY3JpYmUodGhpcy5oYW5kbGVyLmJpbmQodGhpcykpO1xuXHRcdHZpZXcuc2NoZW1hLnN1YnNjcmliZShlID0+IHtcblx0XHRcdHN3aXRjaChlLmV2ZW50KSB7XG5cdFx0XHRcdGNhc2UgJ3JlbmFtZSc6XG5cdFx0XHRcdFx0aWYoZS5vbGRuYW1lKSB7XG5cdFx0XHRcdFx0XHRzY2hlbWEucmVuYW1lKGUub2xkbmFtZSwgZS5uZXduYW1lKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRoYW5kbGVyKG1lc3NhZ2UpIHtcblx0XHRzd2l0Y2gobWVzc2FnZS5ldmVudCkge1xuXHRcdFx0Y2FzZSAnbGlzdCc6XG5cdFx0XHRcdHJldHVybiB0aGlzLmhhbmRsZUxpc3QobWVzc2FnZS5kYXRhKTtcblx0XHRcdGNhc2UgJ2FkZCc6XG5cdFx0XHRcdHJldHVybiB0aGlzLmhhbmRsZUFkZChtZXNzYWdlLm5hbWUsIG1lc3NhZ2UudHlwZSk7XG5cdFx0XHRjYXNlICdkZWxldGUnOlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5oYW5kbGVEZWxldGUobWVzc2FnZS5uYW1lKTtcblx0XHRcdGNhc2UgJ3JlbmFtZSc6XG5cdFx0XHRcdHJldHVybiB0aGlzLmhhbmRsZVJlbmFtZShtZXNzYWdlLm9sZG5hbWUsIG1lc3NhZ2UubmV3bmFtZSk7XG5cdFx0XHRjYXNlICdyZXR5cGUnOlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5oYW5kbGVSZXR5cGUobWVzc2FnZS5uYW1lLCBtZXNzYWdlLnR5cGUpO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBpbnZhbGlkIG1lc3NhZ2UgJyR7bWVzc2FnZX0nYCk7XG5cdFx0fVxuXHR9XG5cblx0aGFuZGxlTGlzdChkYXRhKSB7XG5cdFx0dGhpcy52aWV3LnJlc2V0KCk7XG5cdFx0ZGF0YS5tYXAocGFpciA9PiB0aGlzLmhhbmRsZUFkZChwYWlyLm5hbWUsIHBhaXIudHlwZSkpO1xuXHR9XG5cdGhhbmRsZUFkZChuYW1lLCB0eXBlKSB7XG5cdFx0dGhpcy52aWV3LmFkZEZpZWxkKG5hbWUsIHR5cGUpO1xuXHR9XG5cdGhhbmRsZURlbGV0ZShuYW1lKSB7XG5cdFx0dGhpcy52aWV3LmRlbGV0ZUZpZWxkKG5hbWUpO1xuXHR9XG5cdGhhbmRsZVJlbmFtZShvbGRuYW1lLCBuZXduYW1lKSB7XG5cdFx0dGhpcy52aWV3LnJlbmFtZUZpZWxkKG9sZG5hbWUsIG5ld25hbWUpO1xuXHR9XG5cdGhhbmRsZVJldHlwZShuYW1lLCB0eXBlKSB7XG5cdFx0dGhpcy52aWV3LnJldHlwZUZpZWxkKG5hbWUsIHR5cGUpO1xuXHR9XG59IiwiaW1wb3J0IHsgRW5hYmxlUHJvcGVydHkgfSBmcm9tICcuL3Byb3BlcnRpZXMvdHlwZXMnXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICd1aS9idXR0b24nO1xuXG5pbXBvcnQgeyBUb29sYmFyIH0gZnJvbSAnLi90b29sYmFyJztcblxuZXhwb3J0IGNsYXNzIE1vZGVsVmlld1Rvb2xiYXIgZXh0ZW5kcyBUb29sYmFyIHtcblx0Y29uc3RydWN0b3IodmlldywgbW9kZWwsIHNjaGVtYSwgb3B0aW9ucykge1xuXHRcdHN1cGVyKG9wdGlvbnMpO1xuXG5cdFx0Ly8gUkVNT1ZFXG5cdFx0bGV0IHJlbW92ZSA9IEJ1dHRvbi5pY29uKCdiYW4nLCB7IHBhcmVudDogdGhpcywgY2xhc3NlczogJ2FsZXJ0JyB9KTtcblx0XHRyZW1vdmUucHJvcGVydGllcy5hZGQobmV3IEVuYWJsZVByb3BlcnR5KGZhbHNlKSk7XG5cdFx0dGhpcy5yaWdodC5hZGQocmVtb3ZlKTtcblx0XHR2aWV3LmZvY3VzU3RyZWFtLm1hcCgodikgPT4gISF2KS5kZWJvdW5jZSgyMDApLmZlZWQocmVtb3ZlLmVuYWJsZSk7XG5cblx0XHR2aWV3LmZvY3VzU3RyZWFtXG5cdFx0XHQuZmlsdGVyKCh2KSA9PiB2ICE9PSBudWxsKVxuXHRcdFx0LnN5bmMocmVtb3ZlLmNsaWNrKVxuXHRcdFx0Lm1hcChmcmFnbWVudCA9PiBmcmFnbWVudC5wYXJlbnQua2V5LmVkaXRvci52YWx1ZS52YWx1ZSlcblx0XHRcdC5zdWJzY3JpYmUoa2V5ID0+IHZpZXcuZGVsZXRlRmllbGQoa2V5KSk7XG5cblx0XHQvLyBJTlNFUlQgVEVYVFxuXHRcdGxldCBpbnNlcnRUZXh0ID0gQnV0dG9uLmljb24oJ2ZvbnQnLCB7IHBhcmVudDogdGhpcyB9KTtcblx0XHR0aGlzLmxlZnQuYWRkKGluc2VydFRleHQpO1xuXHRcdGluc2VydFRleHQuY2xpY2suc3Vic2NyaWJlKCgpID0+IHtcblx0XHRcdGxldCBrZXkgPSBtb2RlbC5uZXh0RmllbGROYW1lKCk7XG5cdFx0XHRzY2hlbWEuYWRkKGtleSwgXCJTdHJpbmdcIik7XG5cdFx0fSlcblxuXHRcdC8vIElOU0VSVCBCT09MRUFOXG5cdFx0bGV0IGluc2VydEJvb2wgPSBCdXR0b24uaWNvbignY2hlY2stc3F1YXJlLW8nLCB7IHBhcmVudDogdGhpcyB9KTtcblx0XHR0aGlzLmxlZnQuYWRkKGluc2VydEJvb2wpO1xuXHRcdGluc2VydEJvb2wuY2xpY2suc3Vic2NyaWJlKCgpID0+IHtcblx0XHRcdGxldCBrZXkgPSBtb2RlbC5uZXh0RmllbGROYW1lKCk7XG5cdFx0XHRzY2hlbWEuYWRkKGtleSwgXCJCb29sXCIpO1xuXHRcdH0pXG5cdH1cbn0iLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcblxuYnVmLnB1c2goXCI8cCBjbGFzcz1cXFwiYmxvY2tcXFwiPjwvcD5cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwiaW1wb3J0IHsgRnJhZ21lbnRCbG9jayB9IGZyb20gJy4vZnJhZ21lbnRibG9jayc7XG5cbmxldCB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4vcGFyYWdyYXBoLmphZGUnKSgpO1xuXG5jbGFzcyBQYXJhZ3JhcGggZXh0ZW5kcyBGcmFnbWVudEJsb2NrIHtcblx0Y29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG5cdFx0aWYoISgndGVtcGxhdGUnIGluIG9wdGlvbnMpKVxuXHRcdFx0b3B0aW9ucy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuXHRcdHN1cGVyKG9wdGlvbnMpO1xuXHR9XG59XG5cbmV4cG9ydCB7IFBhcmFncmFwaCB9OyIsImxldCBfbmFtZSA9IFN5bWJvbCgpO1xuXG5jbGFzcyBCYXNlSW5qZWN0b3Ige1xuXHRpbmplY3QodGFyZ2V0KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiYWJzdHJhY3QgbWV0aG9kOiBpbmplY3RcIik7XG5cdH1cblxuXHRkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIGdldHRlciwgc2V0dGVyKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwge1xuXHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdHdyaXRlYWJsZTogZmFsc2UsXG5cdFx0XHRnZXQ6IGdldHRlcixcblx0XHRcdHNldDogc2V0dGVyXG5cdFx0fSk7XG5cdH1cbn1cblxuY2xhc3MgQmFzZVByb3BlcnR5IGV4dGVuZHMgQmFzZUluamVjdG9yIHtcblx0Y29uc3RydWN0b3IobmFtZSkge1xuXHRcdHRoaXNbX25hbWVdID0gbmFtZTtcblx0fVxuXG5cdGdldCBuYW1lKCkge1xuXHRcdHJldHVybiB0aGlzW19uYW1lXTtcblx0fVxufVxuXG5leHBvcnQgeyBCYXNlUHJvcGVydHksIEJhc2VJbmplY3RvciB9OyIsImltcG9ydCB7IEJhc2VQcm9wZXJ0eSB9IGZyb20gJy4vYmFzZSc7XG5cbmxldCBfxpIgPSBTeW1ib2woKTtcblxuY2xhc3MgQmVoYXZpb3JQcm9wZXJ0eSBleHRlbmRzIEJhc2VQcm9wZXJ0eSB7XG5cdGNvbnN0cnVjdG9yKG5hbWUsIMaSKSB7XG5cdFx0c3VwZXIobmFtZSk7XG5cdFx0dGhpc1tfxpJdID0gxpI7XG5cdH1cblxuXHRpbmplY3QodGFyZ2V0KSB7XG5cdFx0bGV0IMaSID0gdGhpc1tfxpJdKHRhcmdldCkuYmluZCh0YXJnZXQpO1xuXHRcdHRoaXMuZGVmaW5lUHJvcGVydHkoXG5cdFx0XHR0YXJnZXQsXG5cdFx0XHR0aGlzLm5hbWUsXG5cdFx0XHQoKSA9PiDGklxuXHRcdCk7XG5cdFx0cmV0dXJuICgpID0+IHt9O1xuXHR9XG59XG5cbmV4cG9ydCB7IEJlaGF2aW9yUHJvcGVydHkgfTsiLCJpbXBvcnQgeyBCYXNlUHJvcGVydHkgfSBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0IHsgUHJvcGVydGllcyB9IGZyb20gJy4vcHJvcGVydGllcyc7XG5cbmxldCBfcCA9IFN5bWJvbCgpO1xuXG5jbGFzcyBQcm9wZXJ0eUNvbnRhaW5lciB7XG5cdGNvbnN0cnVjdG9yKHBhcmVudCkge1xuXHRcdHRoaXNbX3BdID0gcGFyZW50O1xuXHRcdG5ldyBQcm9wZXJ0aWVzKHRoaXMpO1xuXHR9XG5cblx0Z2V0IHBhcmVudCgpIHtcblx0XHRyZXR1cm4gdGhpc1tfcF07XG5cdH1cbn1cblxuY2xhc3MgQ29udGFpbmVyUHJvcGVydHkgZXh0ZW5kcyBCYXNlUHJvcGVydHkge1xuXHRjb25zdHJ1Y3RvcihuYW1lLCBkZWZhdWx0RmllbGQsIHdpcmXGkikge1xuXHRcdHN1cGVyKG5hbWUpO1xuXHRcdHdpcmXGkiA9IHdpcmXGkiB8fCAoKCkgPT4ge30pO1xuXHRcdHRoaXNbX3BdID0geyBkZWZhdWx0RmllbGQsIHdpcmXGkiB9O1xuXHR9XG5cblx0aW5qZWN0KHRhcmdldCkge1xuXHRcdGxldCBjb250YWluZXIgPSBuZXcgUHJvcGVydHlDb250YWluZXIodGFyZ2V0KSxcblx0XHRcdHNldHRlciA9ICh0aGlzW19wXS5kZWZhdWx0RmllbGQpID9cblx0XHRcdFx0KHYpID0+IGNvbnRhaW5lclt0aGlzW19wXS5kZWZhdWx0RmllbGRdLnB1c2godikgOlxuXHRcdFx0XHR1bmRlZmluZWQ7XG5cblx0XHR0aGlzLmRlZmluZVByb3BlcnR5KFxuXHRcdFx0dGFyZ2V0LFxuXHRcdFx0dGhpcy5uYW1lLFxuXHRcdFx0KCkgPT4gY29udGFpbmVyLFxuXHRcdFx0c2V0dGVyXG5cdFx0KTtcblxuXHRcdHJldHVybiB0aGlzW19wXS53aXJlxpIodGFyZ2V0KSB8fCAoKCkgPT4ge30pO1xuXHR9XG59XG5cbmV4cG9ydCB7IENvbnRhaW5lclByb3BlcnR5IH07XG5cbi8qXG5cdGFkZENvbnRhaW5lcihuYW1lLCBkZWZhdWx0RmllbGQsIHdpcmUpIHtcblx0XHRpZih0aGlzW3VdW25hbWVdKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBBIHByb3BlcnR5ICcke25hbWV9JyBhbHJlYWR5IGV4aXN0c2ApO1xuXHRcdGxldCBjb250YWluZXIgPSBuZXcgUHJvcGVydHlDb250YWluZXIodGhpc1skXSwgdGhpcyksXG5cdFx0XHRzZXR0ZXIgPSAoZGVmYXVsdEZpZWxkKSA/XG5cdFx0XHRcdGZ1bmN0aW9uKHYpIHsgY29udGFpbmVyW2RlZmF1bHRGaWVsZF0ucHVzaCh2KTsgfSA6XG5cdFx0XHRcdGZ1bmN0aW9uKCkgeyB0aHJvdyBuZXcgRXJyb3IoJ1Byb3BlcnR5IENvbnRhaW5lciBkb2VzblxcJ3QgaGF2ZSBhIGRlZmF1bHQgZmllbGQnKTsgfSxcblx0XHRcdHVud2lyZSA9IHdpcmUgJiYgd2lyZS5jYWxsKHRoaXMsIHRoaXNbJF0pIHx8IGZ1bmN0aW9uKCl7fTtcblx0XHR0aGlzW3VdW25hbWVdID0gKCkgPT4ge1xuXHRcdFx0dW53aXJlKCk7XG5cdFx0XHRjb250YWluZXIucmVtb3ZlQWxsLmNhbGwoY29udGFpbmVyKTtcblx0XHR9O1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBuYW1lLCB7XG5cdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0d3JpdGVhYmxlOiBmYWxzZSxcblx0XHRcdGdldDogKCkgPT4gY29udGFpbmVyLFxuXHRcdFx0c2V0OiBzZXR0ZXJcblx0XHR9KTtcblx0XHRyZXR1cm4gY29udGFpbmVyO1xuXHR9XG4qLyIsImV4cG9ydCAqIGZyb20gJy4vcHJvcGVydGllcyc7IiwidmFyIF9wID0gU3ltYm9sO1xuXG5jbGFzcyBQcm9wZXJ0aWVzIHtcblx0Y29uc3RydWN0b3IodGFyZ2V0KSB7XG5cdFx0dGhpc1tfcF0gPSB7XG5cdFx0XHR0YXJnZXQ6IHRhcmdldCxcblx0XHRcdHByb3BlcnRpZXM6IHt9LFxuXHRcdFx0ZGlzcG9zYWJsZXM6IHt9XG5cdFx0fTtcblxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIFwicHJvcGVydGllc1wiLCB7XG5cdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0d3JpdGVhYmxlOiBmYWxzZSxcblx0XHRcdGdldDogKCkgPT4gdGhpc1xuXHRcdH0pO1xuXHR9XG5cblx0YWRkKHByb3BlcnR5KSB7XG5cdFx0bGV0IG5hbWUgPSBwcm9wZXJ0eS5uYW1lO1xuXHRcdGlmKG5hbWUgaW4gdGhpc1tfcF0udGFyZ2V0KVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBwcm9wZXJ0eSAnbmFtZScgYWxyZWFkeSBleGlzdHNgKTtcblx0XHR0aGlzW19wXS5wcm9wZXJ0aWVzW25hbWVdID0gcHJvcGVydHk7XG5cdFx0dGhpc1tfcF0uZGlzcG9zYWJsZXNbbmFtZV0gPSBwcm9wZXJ0eS5pbmplY3QodGhpc1tfcF0udGFyZ2V0KTtcblx0fVxuXG5cdHJlbW92ZShwcm9wZXJ0eSkge1xuXHRcdGxldCBuYW1lID0gcHJvcGVydHkubmFtZSB8fCBwcm9wZXJ0eTtcblx0XHRpZighKG5hbWUgaW4gdGhpc1tfcF0ucHJvcGVydGllcykpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYHByb3BlcnR5ICduYW1lJyBkb2Vzbid0IGV4aXN0YCk7XG5cdFx0dGhpc1tfcF0uZGlzcG9zYWJsZXNbbmFtZV0oKTtcblx0XHRkZWxldGUgdGhpc1tfcF0uZGlzcG9zYWJsZXNbbmFtZV07XG5cdFx0ZGVsZXRlIHRoaXNbX3BdLnByb3BlcnRpZXNbbmFtZV07XG5cdH1cblxuXHRnZXQobmFtZSkge1xuXHRcdHJldHVybiB0aGlzW19wXS5wcm9wZXJ0aWVzW25hbWVdO1xuXHR9XG5cblx0cmVtb3ZlQWxsKCkge1xuXHRcdGZvcihsZXQgbmFtZSBvZiB0aGlzLmFycmF5KSB7XG5cdFx0XHR0aGlzLnJlbW92ZShuYW1lKTtcblx0XHR9XG5cdH1cblxuXHRbU3ltYm9sLml0ZXJhdG9yXSgpIHtcblx0XHRyZXR1cm4gdGhpcy5hcnJheTtcblx0fVxuXG5cdGdldCBhcnJheSgpIHtcblx0XHRyZXR1cm4gT2JqZWN0LmtleXModGhpc1tfcF0ucHJvcGVydGllcyk7XG5cdH1cblxuXHRjb3B5VG8odGFyZ2V0KSB7XG5cdFx0Zm9yKGxldCBrZXkgb2YgdGhpcy5hcnJheSkge1xuXHRcdFx0dGFyZ2V0LnByb3BlcnRpZXMuYWRkKHRoaXMuZ2V0KGtleSkpO1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgeyBQcm9wZXJ0aWVzIH07IiwiaW1wb3J0IHsgQmFzZVByb3BlcnR5IH0gZnJvbSAnLi9iYXNlJztcbmltcG9ydCB7IMaSIH0gZnJvbSAndXRpbC/Gkic7XG5cbmxldCBfcCA9IFN5bWJvbCgpO1xuXG5leHBvcnQgY2xhc3MgU3RyZWFtUHJvcGVydHkgZXh0ZW5kcyBCYXNlUHJvcGVydHkge1xuXHRjb25zdHJ1Y3RvcihuYW1lLCBzdHJlYW3Gkiwgd2lyZcaSKSB7XG5cdFx0c3VwZXIobmFtZSk7XG5cdFx0dGhpc1tfcF0gPSB7IHN0cmVhbcaSLCB3aXJlxpIgfTtcblx0fVxuXG5cdGluamVjdCh0YXJnZXQpIHtcblx0XHRsZXQgc3RyZWFtID0gdGhpc1tfcF0uc3RyZWFtxpIoKTtcblx0XHR0aGlzLmRlZmluZVByb3BlcnR5KHRhcmdldCwgdGhpcy5uYW1lLCAoKSA9PiBzdHJlYW0pO1xuXG5cdFx0cmV0dXJuIMaSLmpvaW4oXG5cdFx0XHR0aGlzW19wXS53aXJlxpIodGFyZ2V0LCBzdHJlYW0pLFxuXHRcdFx0KCkgPT4gc3RyZWFtLmNhbmNlbCgpXG5cdFx0KTtcblx0fVxufSIsImltcG9ydCB7IFN0cmluZ1ZhbHVlIH0gZnJvbSAnc3RyZWFteS92YWx1ZSc7XG5pbXBvcnQgeyBWYWx1ZVN0cmVhbVByb3BlcnR5IH0gZnJvbSAnLi4vdmFsdWVzdHJlYW0nO1xuaW1wb3J0IHsgRG9tIH0gZnJvbSAndWkvZG9tJztcblxuY2xhc3MgQXR0cmlidXRlUHJvcGVydHkgZXh0ZW5kcyBWYWx1ZVN0cmVhbVByb3BlcnR5IHtcblx0Y29uc3RydWN0b3IobmFtZSwgYXR0cmlidXRlLCB0ZXh0ID0gXCJcIikge1xuXHRcdHN1cGVyKFxuXHRcdFx0bmFtZSxcblx0XHRcdCgpID0+IG5ldyBTdHJpbmdWYWx1ZSh0ZXh0KSxcblx0XHRcdCh0YXJnZXQsIHZhbHVlKSAgPT5cblx0XHRcdFx0RG9tLnN0cmVhbSh2YWx1ZSkuYXBwbHlBdHRyaWJ1dGUoYXR0cmlidXRlLCB0YXJnZXQuZWwpXG5cdFx0KTtcblx0fVxufVxuXG5jbGFzcyBUb29sdGlwUHJvcGVydHkgZXh0ZW5kcyBBdHRyaWJ1dGVQcm9wZXJ0eSB7XG5cdGNvbnN0cnVjdG9yKGRlZmF1bHRWYWx1ZSA9IGZhbHNlKSB7XG5cdFx0c3VwZXIoXCJ0b29sdGlwXCIsIFwidGl0bGVcIiwgZGVmYXVsdFZhbHVlKTtcblx0fVxufVxuXG5leHBvcnQgeyBUb29sdGlwUHJvcGVydHksIEF0dHJpYnV0ZVByb3BlcnR5IH07IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAodW5kZWZpbmVkKSB7XG5idWYucHVzaChcIjxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCJcIiArIChqYWRlLmF0dHIoXCJjaGVja2VkXCIsICh0cnVlPT09ZmFsc2UgPyBcImNoZWNrZWRcIiA6IHVuZGVmaW5lZCksIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwiYm9vbCBlZGl0b3JcXFwiLz5cIik7fShcInVuZGVmaW5lZFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudW5kZWZpbmVkOnR5cGVvZiB1bmRlZmluZWQhPT1cInVuZGVmaW5lZFwiP3VuZGVmaW5lZDp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJpbXBvcnQgeyBDb250YWluZXJQcm9wZXJ0eSB9IGZyb20gJy4uL2NvbnRhaW5lcic7XG5pbXBvcnQgeyBCZWhhdmlvclByb3BlcnR5IH0gZnJvbSAnLi4vYmVoYXZpb3InO1xuaW1wb3J0IHsgVmFsdWVQcm9wZXJ0eSB9IGZyb20gJy4vdmFsdWUnO1xuaW1wb3J0IHsgRG9tLCBRdWVyeSwgSHRtbCB9IGZyb20gJ3VpL2RvbSc7XG5cbmxldCB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4vYm9vbGVkaXRvci5qYWRlJyk7XG5cbmxldCBfYm91bmQgPSBTeW1ib2woKSxcblx0X2JpbmTGkiA9IFN5bWJvbCgpLFxuXHRfdW5iaW5kxpIgPSBTeW1ib2woKSxcblx0dmFsdWVQcm9wZXJ0eSA9IG5ldyBWYWx1ZVByb3BlcnR5KCdCb29sJywgKGVkaXRvciwgdmFsdWUpID0+IHtcblx0XHRsZXQgZWwgICAgICAgPSBlZGl0b3IucGFyZW50LmVsLFxuXHRcdFx0Y29udGVudCAgPSBRdWVyeS5maXJzdCgnLmNvbnRlbnQnLCBlbCksXG5cdFx0XHRsaXN0ZW7GkiAgPSAoKSA9PiB7XG5cdFx0XHRcdHZhbHVlLnB1c2goaW5wdXQuY2hlY2tlZCk7XG5cdFx0XHR9LFxuXHRcdFx0aW5wdXQgICAgPSBIdG1sLnBhcnNlKHRlbXBsYXRlKHsgY2hlY2tlZCA6IHZhbHVlLnZhbHVlIH0pKSxcblx0XHRcdGZvY3VzxpIgICA9ICgpID0+IGVkaXRvci5wYXJlbnQuZm9jdXNTdHJlYW0ucHVzaChlZGl0b3IucGFyZW50KSxcblx0XHRcdHVuZm9jdXPGkiA9ICgpID0+IGVkaXRvci5wYXJlbnQuZm9jdXNTdHJlYW0ucHVzaChudWxsKTtcblxuXHRcdGNvbnRlbnQuYXBwZW5kQ2hpbGQoaW5wdXQpO1xuXG5cdFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBsaXN0ZW7GkiwgZmFsc2UpO1xuXHRcdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCBmb2N1c8aSLCBmYWxzZSk7XG5cdFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgdW5mb2N1c8aSLCBmYWxzZSk7XG5cblx0XHQvLyBjYW5jZWxcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRpbnB1dC5yZW1vdmVFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgZm9jdXPGkiwgZmFsc2UpO1xuXHRcdFx0aW5wdXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgdW5mb2N1c8aSLCBmYWxzZSk7XG5cdFx0XHRpbnB1dC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGxpc3RlbsaSLCBmYWxzZSk7XG5cdFx0fTtcblx0fSksXG5cdGZvY3VzUHJvcGVydHkgPSBuZXcgQmVoYXZpb3JQcm9wZXJ0eSgnZm9jdXMnLCAodGFyZ2V0KSA9PiB7XG5cdFx0bGV0IGNvbnRlbnQgPSBRdWVyeS5maXJzdCgnLmNvbnRlbnQnLCB0YXJnZXQucGFyZW50LmVsKTtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRjb250ZW50LmZvY3VzKCk7XG5cdFx0fTtcblx0fSk7XG5cbmNsYXNzIEJvb2xFZGl0b3JQcm9wZXJ0eSBleHRlbmRzIENvbnRhaW5lclByb3BlcnR5IHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoJ2VkaXRvcicsICd2YWx1ZScpO1xuXHR9XG5cblx0aW5qZWN0KHRhcmdldCkge1xuXHRcdGxldCDGkiA9IHN1cGVyLmluamVjdCh0YXJnZXQpLFxuXHRcdFx0ZWRpdG9yID0gdGFyZ2V0LmVkaXRvcjtcblxuXHRcdGVkaXRvci5wcm9wZXJ0aWVzLmFkZCh2YWx1ZVByb3BlcnR5KTtcblx0XHRlZGl0b3IucHJvcGVydGllcy5hZGQoZm9jdXNQcm9wZXJ0eSk7XG5cblx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0ZWRpdG9yLnByb3BlcnRpZXMucmVtb3ZlKGZvY3VzUHJvcGVydHkpO1xuXHRcdFx0xpIoKTtcblx0XHR9O1xuXHR9XG59XG5cbmV4cG9ydCB7IEJvb2xFZGl0b3JQcm9wZXJ0eSB9OyIsImltcG9ydCB7IFZhbHVlU3RyZWFtUHJvcGVydHkgfSBmcm9tICcuLi92YWx1ZXN0cmVhbSc7XG5pbXBvcnQgeyBCb29sVmFsdWUgfSBmcm9tICdzdHJlYW15L3ZhbHVlJztcbmltcG9ydCB7IERvbSB9IGZyb20gJ3VpL2RvbSc7XG5cbmNsYXNzIFN3YXBDbGFzc1Byb3BlcnR5IGV4dGVuZHMgVmFsdWVTdHJlYW1Qcm9wZXJ0eSB7XG5cdGNvbnN0cnVjdG9yKG5hbWUsIGNsYXNzTmFtZSA9IG5hbWUsIGRlZmF1bHRWYWx1ZSA9IGZhbHNlKSB7XG5cdFx0c3VwZXIoXG5cdFx0XHRuYW1lLFxuXHRcdFx0KCkgPT4gbmV3IEJvb2xWYWx1ZShkZWZhdWx0VmFsdWUpLFxuXHRcdFx0KHRhcmdldCwgdmFsdWUpICA9PlxuXHRcdFx0XHREb20uc3RyZWFtKHZhbHVlKS5hcHBseVN3YXBDbGFzcyh0YXJnZXQuZWwsIGNsYXNzTmFtZSlcblx0XHQpO1xuXHR9XG59XG5cbmNsYXNzIFN0cm9uZ1Byb3BlcnR5IGV4dGVuZHMgU3dhcENsYXNzUHJvcGVydHkge1xuXHRjb25zdHJ1Y3RvcihkZWZhdWx0VmFsdWUgPSBmYWxzZSkge1xuXHRcdHN1cGVyKFwic3Ryb25nXCIsIFwic3Ryb25nXCIsIGRlZmF1bHRWYWx1ZSk7XG5cdH1cbn1cblxuY2xhc3MgRW1waGFzaXNQcm9wZXJ0eSBleHRlbmRzIFN3YXBDbGFzc1Byb3BlcnR5IHtcblx0Y29uc3RydWN0b3IoZGVmYXVsdFZhbHVlID0gZmFsc2UpIHtcblx0XHRzdXBlcihcImVtcGhhc2lzXCIsIFwiZW1waGFzaXNcIiwgZGVmYXVsdFZhbHVlKTtcblx0fVxufVxuXG5jbGFzcyBTdHJpa2VQcm9wZXJ0eSBleHRlbmRzIFN3YXBDbGFzc1Byb3BlcnR5IHtcblx0Y29uc3RydWN0b3IoZGVmYXVsdFZhbHVlID0gZmFsc2UpIHtcblx0XHRzdXBlcihcInN0cmlrZVwiLCBcInN0cmlrZVwiLCBkZWZhdWx0VmFsdWUpO1xuXHR9XG59XG5cbmV4cG9ydCB7IFN0cm9uZ1Byb3BlcnR5LCBFbXBoYXNpc1Byb3BlcnR5LCBTdHJpa2VQcm9wZXJ0eSwgU3dhcENsYXNzUHJvcGVydHkgfTsiLCJpbXBvcnQgeyBQdXNoU3RyZWFtIH0gZnJvbSAnc3RyZWFteS9zdHJlYW0nO1xuaW1wb3J0IHsgQm9vbFZhbHVlIH0gZnJvbSAnc3RyZWFteS92YWx1ZSc7XG5pbXBvcnQgeyBTdHJlYW1Qcm9wZXJ0eSB9IGZyb20gJy4uL3N0cmVhbSc7XG5pbXBvcnQgeyBEb20gfSBmcm9tICd1aS9kb20nO1xuXG5leHBvcnQgY2xhc3MgQ2xpY2tQcm9wZXJ0eSBleHRlbmRzIFN0cmVhbVByb3BlcnR5IHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoXG5cdFx0XHRcImNsaWNrXCIsXG5cdFx0XHQoKSA9PiBuZXcgUHVzaFN0cmVhbSgpLFxuXHRcdFx0KHRhcmdldCwgdmFsdWUpICA9PlxuXHRcdFx0XHREb20uc3RyZWFtKHZhbHVlKS5vbihcImNsaWNrXCIsIHRhcmdldC5lbClcblx0XHQpO1xuXHR9XG59IiwiaW1wb3J0IHsgQm9vbEVkaXRvclByb3BlcnR5IH0gZnJvbSAnLi9ib29sZWRpdG9yJztcbmltcG9ydCB7IFRleHRFZGl0b3JQcm9wZXJ0eSB9IGZyb20gJy4vdGV4dGVkaXRvcic7XG5cbmV4cG9ydCBsZXQgRWRpdG9yUHJvcGVydHkgPSB7XG5cdGNyZWF0ZSh0eXBlLCAuLi5hcmdzKSB7XG5cdFx0c3dpdGNoKHR5cGUpIHtcblx0XHRcdGNhc2UgJ1N0cmluZyc6XG5cdFx0XHRcdHJldHVybiBuZXcgVGV4dEVkaXRvclByb3BlcnR5KC4uLmFyZ3MpO1xuXHRcdFx0Y2FzZSAnQm9vbCc6XG5cdFx0XHRcdHJldHVybiBuZXcgQm9vbEVkaXRvclByb3BlcnR5KC4uLmFyZ3MpO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGVkaXRvciB0eXBlICcke3R5cGV9J2ApO1xuXHRcdH1cblx0fVxufSIsImltcG9ydCB7IFZhbHVlU3RyZWFtUHJvcGVydHkgfSBmcm9tICcuLi92YWx1ZXN0cmVhbSc7XG5pbXBvcnQgeyBCb29sVmFsdWUgfSBmcm9tICdzdHJlYW15L3ZhbHVlJztcbmltcG9ydCB7IERvbSwgUXVlcnkgfSBmcm9tICd1aS9kb20nO1xuXG5leHBvcnQgY2xhc3MgRW5hYmxlUHJvcGVydHkgZXh0ZW5kcyBWYWx1ZVN0cmVhbVByb3BlcnR5IHtcblx0Y29uc3RydWN0b3IoZGVmYXVsdFZhbHVlID0gdHJ1ZSkge1xuXHRcdHN1cGVyKFxuXHRcdFx0J2VuYWJsZScsXG5cdFx0XHQoKSA9PiBuZXcgQm9vbFZhbHVlKGRlZmF1bHRWYWx1ZSksXG5cdFx0XHQodGFyZ2V0LCB2YWx1ZSkgID0+IHtcblx0XHRcdFx0bGV0IG5lZ2F0ZWQgPSB2YWx1ZS5uZWdhdGUoKSxcblx0XHRcdFx0XHRlbHMgPSBRdWVyeS5hbGwoJ2lucHV0LHNlbGVjdCx0ZXh0YXJlYSxidXR0b24nLCB0YXJnZXQuZWwpXG5cdFx0XHRcdFx0XHRcdC5jb25jYXQoW3RhcmdldC5lbF0pO1xuXHRcdFx0XHRsZXQgxpIgICA9IGVscy5tYXAoKGVsKSA9PiBEb20uc3RyZWFtKG5lZ2F0ZWQpLmFwcGx5U3dhcEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0YXJnZXQuZWwpKVxuXHRcdFx0XHRcdFx0XHQuY29uY2F0KFtcblx0XHRcdFx0XHRcdFx0XHREb20uc3RyZWFtKG5lZ2F0ZWQpLmFwcGx5U3dhcENsYXNzKHRhcmdldC5lbCwgJ2Rpc2FibGVkJylcblx0XHRcdFx0XHRcdFx0XSk7XG5cblx0XHRcdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdFx0XHRuZWdhdGVkLmNhbmNlbCgpO1xuXHRcdFx0XHRcdMaSLm1hcCgoxpIpID0+IMaSKCkpO1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdCk7XG5cdH1cbn0iLCJpbXBvcnQgeyBWYWx1ZVN0cmVhbVByb3BlcnR5IH0gZnJvbSAnLi4vdmFsdWVzdHJlYW0nO1xuaW1wb3J0IHsgU3RyaW5nVmFsdWUgfSBmcm9tICdzdHJlYW15L3ZhbHVlJztcbmltcG9ydCB7IERvbSwgUXVlcnkgfSBmcm9tICd1aS9kb20nO1xuXG5leHBvcnQgY2xhc3MgSHRtbFByb3BlcnR5IGV4dGVuZHMgVmFsdWVTdHJlYW1Qcm9wZXJ0eSB7XG5cdGNvbnN0cnVjdG9yKGh0bWwpIHtcblx0XHRzdXBlcihcblx0XHRcdFwiaHRtbFwiLFxuXHRcdFx0KCkgPT4gbmV3IFN0cmluZ1ZhbHVlKGh0bWwpLFxuXHRcdFx0dGhpcy5hc3NpZ25IdG1sXG5cdFx0KTtcblx0fVxuXG5cdGFzc2lnbkh0bWwodGFyZ2V0LCB2YWx1ZSkge1xuXHRcdERvbS5zdHJlYW0odmFsdWUpLmFwcGx5SHRtbChRdWVyeS5maXJzdCgnLmNvbnRlbnQnLCB0YXJnZXQuZWwpKVxuXHR9XG59IiwiaW1wb3J0IHsgSHRtbFByb3BlcnR5IH0gZnJvbSAnLi9odG1sJztcbmltcG9ydCB7IFN0cmluZ1ZhbHVlIH0gZnJvbSAnc3RyZWFteS92YWx1ZSc7XG5pbXBvcnQgeyBEb20sIFF1ZXJ5IH0gZnJvbSAndWkvZG9tJztcblxuZXhwb3J0IGNsYXNzIEljb25Qcm9wZXJ0eSBleHRlbmRzIEh0bWxQcm9wZXJ0eSB7XG5cdGFzc2lnbkh0bWwodGFyZ2V0LCB2YWx1ZSkge1xuXHRcdGxldCB0cmFuc2Zvcm0gPSB2YWx1ZS5tYXAoKGljb24pID0+IGA8aSBjbGFzcz1cImZhIGZhLSR7aWNvbn1cIj48L2k+YCksXG5cdFx0XHTGkiA9IHN1cGVyLmFzc2lnbkh0bWwodGFyZ2V0LCB0cmFuc2Zvcm0pO1xuXHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHR0cmFuc2Zvcm0uY2FuY2VsKCk7XG5cdFx0XHTGkigpO1xuXHRcdH07XG5cdH1cbn0iLCJleHBvcnQgKiBmcm9tICcuL2F0dHJpYnV0ZSc7XG5leHBvcnQgKiBmcm9tICcuL2Jvb2xlZGl0b3InO1xuZXhwb3J0ICogZnJvbSAnLi9jbGFzc25hbWUnO1xuZXhwb3J0ICogZnJvbSAnLi9jbGljayc7XG5leHBvcnQgKiBmcm9tICcuL2VkaXRvcic7XG5leHBvcnQgKiBmcm9tICcuL2VuYWJsZSc7XG5leHBvcnQgKiBmcm9tICcuL2h0bWwnO1xuZXhwb3J0ICogZnJvbSAnLi9pY29uJztcbmV4cG9ydCAqIGZyb20gJy4vdGV4dGVkaXRvcic7XG5leHBvcnQgKiBmcm9tICcuL251bWVyaWNmb3JtYXQnO1xuZXhwb3J0ICogZnJvbSAnLi9saW5rJztcbmV4cG9ydCAqIGZyb20gJy4vdGV4dCc7XG5leHBvcnQgKiBmcm9tICcuL3ZhbHVlJztcbmV4cG9ydCAqIGZyb20gJy4vdmlzaWJsZSc7IiwiaW1wb3J0IHsgVmFsdWVTdHJlYW1Qcm9wZXJ0eSB9IGZyb20gJy4uL3ZhbHVlc3RyZWFtJztcbmltcG9ydCB7IFN0cmluZ1ZhbHVlIH0gZnJvbSAnc3RyZWFteS92YWx1ZSc7XG5cbmNsYXNzIExpbmtQcm9wZXJ0eSBleHRlbmRzIFZhbHVlU3RyZWFtUHJvcGVydHkge1xuXHRjb25zdHJ1Y3Rvcih1cmwgPSBcIlwiKSB7XG5cdFx0c3VwZXIoXG5cdFx0XHRcImxpbmtcIixcblx0XHRcdCgpID0+IG5ldyBTdHJpbmdWYWx1ZSh1cmwpLFxuXHRcdFx0KHRhcmdldCwgdmFsdWUpICA9PiB7XG5cdFx0XHRcdGxldCBhICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKSxcblx0XHRcdFx0XHRlbCA9IHRhcmdldC5lbCxcblx0XHRcdFx0XHTGkiAgPSAodXJsKSA9PiBhLmhyZWYgPSB1cmw7XG5cdFx0XHRcdGEudGFyZ2V0ID0gXCJfYmxhbmtcIjtcblx0XHRcdFx0Zm9yKGxldCBpID0gMDsgaSA8IGVsLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRhLmFwcGVuZENoaWxkKGVsLmNoaWxkTm9kZXNbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsLmFwcGVuZENoaWxkKGEpO1xuXHRcdFx0XHR2YWx1ZS5zdWJzY3JpYmUoxpIpO1xuXHRcdFx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0XHRcdHZhbHVlLnVuc3Vic2NyaWJlKMaSKTtcblx0XHRcdFx0XHRlbC5yZW1vdmVDaGlsZChhKTtcblx0XHRcdFx0XHRmb3IobGV0IGkgPSAwOyBpIDwgYS5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRlbC5hcHBlbmRDaGlsZChhLmNoaWxkTm9kZXNbaV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHQpO1xuXHR9XG59XG5cbmV4cG9ydCB7IExpbmtQcm9wZXJ0eSB9OyIsImltcG9ydCB7IFN0cmluZ1ZhbHVlIH0gZnJvbSAnc3RyZWFteS92YWx1ZSc7XG5pbXBvcnQgeyBWYWx1ZVN0cmVhbVByb3BlcnR5IH0gZnJvbSAnLi4vdmFsdWVzdHJlYW0nO1xuXG5sZXQgbnVtZXJhbCA9IHJlcXVpcmUoJ251bWVyYWwnKTtcblxuY2xhc3MgTnVtZXJpY0Zvcm1hdFByb3BlcnR5IGV4dGVuZHMgVmFsdWVTdHJlYW1Qcm9wZXJ0eSB7XG5cdGNvbnN0cnVjdG9yKGRlZmF1bHRGb3JtYXQgPSBcIlwiKSB7XG5cdFx0c3VwZXIoXG5cdFx0XHRcImZvcm1hdFwiLFxuXHRcdFx0KCkgPT4gbmV3IFN0cmluZ1ZhbHVlKGRlZmF1bHRGb3JtYXQpLFxuXHRcdFx0KHRhcmdldCwgZm9ybWF0KSA9PiB7XG5cdFx0XHRcdGxldCB2YWx1ZSA9IHRhcmdldC52YWx1ZSxcblx0XHRcdFx0XHR0ZXh0ICA9IHRhcmdldC50ZXh0O1xuXHRcdFx0XHRpZighdmFsdWUpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCInZm9ybWF0JyByZXF1aXJlcyB0aGUgcHJvcGVydHkgJ3ZhbHVlJ1wiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZighdGV4dCkge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIidmb3JtYXQnIHJlcXVpcmVzIHRoZSBwcm9wZXJ0eSAndGV4dCdcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGV0IHN0cmVhbSA9IHZhbHVlLnppcChmb3JtYXQpO1xuXHRcdFx0XHRzdHJlYW0uc3ByZWFkKCh2YWx1ZSwgZm9ybWF0KSA9PiB7XG5cdFx0XHRcdFx0aWYoZm9ybWF0ID09PSBcIlwiKSB7XG5cdFx0XHRcdFx0XHRmb3JtYXQgPSBNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUgPyBcIjAsMFwiIDogXCIwLDAuMDAwXCI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRleHQudmFsdWUgPSBudW1lcmFsKHZhbHVlKS5mb3JtYXQoZm9ybWF0KTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybiBzdHJlYW0uY2FuY2VsLmJpbmQoc3RyZWFtKTtcblx0XHRcdH1cblx0XHQpO1xuXHR9XG59XG5cbmV4cG9ydCB7IE51bWVyaWNGb3JtYXRQcm9wZXJ0eSB9OyIsImltcG9ydCB7IFZhbHVlU3RyZWFtUHJvcGVydHkgfSBmcm9tICcuLi92YWx1ZXN0cmVhbSc7XG5pbXBvcnQgeyBTdHJpbmdWYWx1ZSB9IGZyb20gJ3N0cmVhbXkvdmFsdWUnO1xuaW1wb3J0IHsgRG9tLCBRdWVyeSB9IGZyb20gJ3VpL2RvbSc7XG5cbmNsYXNzIFRleHRQcm9wZXJ0eSBleHRlbmRzIFZhbHVlU3RyZWFtUHJvcGVydHkge1xuXHRjb25zdHJ1Y3Rvcih0ZXh0KSB7XG5cdFx0c3VwZXIoXG5cdFx0XHRcInRleHRcIixcblx0XHRcdCgpID0+IG5ldyBTdHJpbmdWYWx1ZSh0ZXh0KSxcblx0XHRcdCh0YXJnZXQsIHZhbHVlKSAgPT5cblx0XHRcdFx0RG9tLnN0cmVhbSh2YWx1ZSkuYXBwbHlUZXh0KFF1ZXJ5LmZpcnN0KCcuY29udGVudCcsIHRhcmdldC5lbCkpXG5cdFx0KTtcblx0fVxufVxuXG5leHBvcnQgeyBUZXh0UHJvcGVydHkgfTsiLCJpbXBvcnQgeyBDb250YWluZXJQcm9wZXJ0eSB9IGZyb20gJy4uL2NvbnRhaW5lcic7XG5pbXBvcnQgeyBCZWhhdmlvclByb3BlcnR5IH0gZnJvbSAnLi4vYmVoYXZpb3InO1xuaW1wb3J0IHsgVmFsdWVQcm9wZXJ0eSB9IGZyb20gJy4vdmFsdWUnO1xuaW1wb3J0IHsgRG9tLCBRdWVyeSB9IGZyb20gJ3VpL2RvbSc7XG5pbXBvcnQgeyBQdXNoU3RyZWFtIH0gZnJvbSAnc3RyZWFteS9zdHJlYW0nO1xuXG5sZXQgX2JvdW5kID0gU3ltYm9sKCksXG5cdF9iaW5kxpIgPSBTeW1ib2woKSxcblx0X3VuYmluZMaSID0gU3ltYm9sKCksXG5cdHZhbHVlUHJvcGVydHkgPSBuZXcgVmFsdWVQcm9wZXJ0eSgnU3RyaW5nJywgKGVkaXRvciwgdmFsdWUpID0+IHtcblx0XHRsZXQgZWwgICAgICA9IGVkaXRvci5wYXJlbnQuZWwsXG5cdFx0XHRjb250ZW50ID0gUXVlcnkuZmlyc3QoJy5jb250ZW50JywgZWwpLFxuXHRcdFx0c3RyZWFtICA9IHZhbHVlLm1hcCgocykgPT4gcy5sZW5ndGggPT09IDApLnVuaXF1ZSgpLFxuXHRcdFx0Y2FuY2VsxpIgPSBEb20uc3RyZWFtKHN0cmVhbSkuYXBwbHlTd2FwQ2xhc3MoY29udGVudCwgJ2VtcHR5JyksXG5cdFx0XHRsaXN0ZW7GkiA9IChlKSA9PiB7XG5cdFx0XHRcdHZhbHVlLnB1c2goZWwuaW5uZXJUZXh0KTtcblx0XHRcdH07XG5cblx0XHRlZGl0b3JbX2JvdW5kXSA9IGZhbHNlO1xuXHRcdGVkaXRvcltfYmluZMaSXSA9ICgpID0+IHtcblx0XHRcdGlmKGVkaXRvcltfYm91bmRdKSByZXR1cm47XG5cdFx0XHRjb250ZW50LnNldEF0dHJpYnV0ZShcImNvbnRlbnRlZGl0YWJsZVwiLCB0cnVlKTtcblx0XHRcdGNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGxpc3RlbsaSLCBmYWxzZSk7XG5cdFx0XHRlZGl0b3JbX2JvdW5kXSA9IHRydWU7XG5cdFx0fSxcblx0XHRlZGl0b3JbX3VuYmluZMaSXSA9ICgpID0+IHtcblx0XHRcdGlmKCFlZGl0b3JbX2JvdW5kXSkgcmV0dXJuO1xuXHRcdFx0Y29udGVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgbGlzdGVuxpIsIGZhbHNlKTtcblx0XHRcdGNvbnRlbnQucmVtb3ZlQXR0cmlidXRlKFwiY29udGVudGVkaXRhYmxlXCIpO1xuXHRcdFx0ZWRpdG9yW19ib3VuZF0gPSBmYWxzZTtcblx0XHR9O1xuXG5cdFx0bGV0IGZvY3VzxpIgPSAoKSA9PiB7XG5cdFx0XHRcdGVkaXRvci5wYXJlbnQuZm9jdXNTdHJlYW0ucHVzaChlZGl0b3IucGFyZW50KTtcblx0XHRcdFx0ZWRpdG9yLmZvY3VzKCk7XG5cdFx0XHR9LFxuXHRcdFx0dW5mb2N1c8aSID0gKCkgPT4ge1xuXHRcdFx0XHRlZGl0b3IucGFyZW50LmZvY3VzU3RyZWFtLnB1c2gobnVsbCk7XG5cdFx0XHRcdGVkaXRvcltfdW5iaW5kxpJdKCk7XG5cdFx0XHR9O1xuXG5cdFx0Y29udGVudC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJzAnKTtcblx0XHRjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCBmb2N1c8aSLCBmYWxzZSk7XG5cdFx0Y29udGVudC5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCB1bmZvY3VzxpIpO1xuXG5cdFx0Ly8gY2FuY2VsXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y2FuY2VsxpIoKTtcblx0XHRcdGVkaXRvcltfdW5iaW5kxpJdKCk7XG5cdFx0XHRkZWxldGUgZWRpdG9yW191bmJpbmTGkl07XG5cdFx0XHRkZWxldGUgZWRpdG9yW19iaW5kxpJdO1xuXHRcdFx0ZGVsZXRlIGVkaXRvcltfYm91bmRdO1xuXHRcdFx0Y29udGVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiYmx1clwiLCB1bmZvY3VzxpIsIGZhbHNlKTtcblx0XHRcdGNvbnRlbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIGZvY3VzxpIsIGZhbHNlKTtcblx0XHRcdGNvbnRlbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGxpc3RlbsaSLCBmYWxzZSk7XG5cdFx0XHRjb250ZW50LnJlbW92ZUF0dHJpYnV0ZShcImNvbnRlbnRlZGl0YWJsZVwiKTtcblx0XHR9O1xuXHR9KSxcblx0Zm9jdXNQcm9wZXJ0eSA9IG5ldyBCZWhhdmlvclByb3BlcnR5KCdmb2N1cycsICh0YXJnZXQpID0+IHtcblx0XHRsZXQgY29udGVudCA9IFF1ZXJ5LmZpcnN0KCcuY29udGVudCcsIHRhcmdldC5wYXJlbnQuZWwpO1xuXHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdHRhcmdldFtfYmluZMaSXSgpO1xuXHRcdFx0Y29udGVudC5mb2N1cygpO1xuXHRcdH07XG5cdH0pLFxuXHRnZXRTZWxlY3Rpb25Qcm9wZXJ0eSA9IG5ldyBCZWhhdmlvclByb3BlcnR5KCdnZXRTZWxlY3Rpb24nLCAodGFyZ2V0KSA9PiB7XG5cdFx0bGV0IGNvbnRlbnQgPSBRdWVyeS5maXJzdCgnLmNvbnRlbnQnLCB0YXJnZXQucGFyZW50LmVsKTtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRsZXQgc2VsZWN0aW9uID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuXHRcdFx0aWYoIXNlbGVjdGlvbi5iYXNlTm9kZSBpbiBjb250ZW50LmNoaWxkTm9kZXMpXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIm5vdCBmb3VuZCFcIik7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzdGFydDogc2VsZWN0aW9uLmFuY2hvck9mZnNldCxcblx0XHRcdFx0ZW5kOiBzZWxlY3Rpb24uZm9jdXNPZmZzZXQsXG5cdFx0XHRcdHRleHQ6IHNlbGVjdGlvbi50b1N0cmluZygpXG5cdFx0XHR9O1xuXHRcdH07XG5cdH0pLFxuXHRzZXRTZWxlY3Rpb25Qcm9wZXJ0eSA9IG5ldyBCZWhhdmlvclByb3BlcnR5KCdzZXRTZWxlY3Rpb24nLCAodGFyZ2V0KSA9PiB7XG5cdFx0bGV0IGNvbnRlbnQgPSBRdWVyeS5maXJzdCgnLmNvbnRlbnQnLCB0YXJnZXQucGFyZW50LmVsKTtcblx0XHRyZXR1cm4gZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuXHRcdFx0bGV0IG5vZGUgID0gY29udGVudC5maXJzdENoaWxkLFxuXHRcdFx0XHRyYW5nZSA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCksXG5cdFx0XHRcdHNlbCAgID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuXHRcdFx0dGFyZ2V0LmZvY3VzKCk7XG5cdFx0XHRpZighbm9kZSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRyYW5nZS5zZXRTdGFydChub2RlLCBNYXRoLm1heChzdGFydCwgMCkpO1xuXHRcdFx0cmFuZ2Uuc2V0RW5kKG5vZGUsIE1hdGgubWluKGVuZCwgbm9kZS53aG9sZVRleHQubGVuZ3RoKSk7XG5cdFx0XHRzZWwucmVtb3ZlQWxsUmFuZ2VzKCk7XG5cdFx0XHRzZWwuYWRkUmFuZ2UocmFuZ2UpO1xuXHRcdH07XG5cdH0pO1xuXG5jbGFzcyBUZXh0RWRpdG9yUHJvcGVydHkgZXh0ZW5kcyBDb250YWluZXJQcm9wZXJ0eSB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCdlZGl0b3InLCAndmFsdWUnKTtcblx0fVxuXG5cdGluamVjdCh0YXJnZXQpIHtcblx0XHRsZXQgxpIgPSBzdXBlci5pbmplY3QodGFyZ2V0KSxcblx0XHRcdGVkaXRvciA9IHRhcmdldC5lZGl0b3I7XG5cblx0XHRlZGl0b3IucHJvcGVydGllcy5hZGQodmFsdWVQcm9wZXJ0eSk7XG5cdFx0ZWRpdG9yLnByb3BlcnRpZXMuYWRkKGZvY3VzUHJvcGVydHkpO1xuXHRcdGVkaXRvci5wcm9wZXJ0aWVzLmFkZChnZXRTZWxlY3Rpb25Qcm9wZXJ0eSk7XG5cdFx0ZWRpdG9yLnByb3BlcnRpZXMuYWRkKHNldFNlbGVjdGlvblByb3BlcnR5KTtcblxuXHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHRlZGl0b3IucHJvcGVydGllcy5yZW1vdmUoZm9jdXNQcm9wZXJ0eSk7XG5cdFx0XHRlZGl0b3IucHJvcGVydGllcy5yZW1vdmUoZ2V0U2VsZWN0aW9uUHJvcGVydHkpO1xuXHRcdFx0ZWRpdG9yLnByb3BlcnRpZXMucmVtb3ZlKHNldFNlbGVjdGlvblByb3BlcnR5KTtcblx0XHRcdMaSKCk7XG5cdFx0fTtcblx0fVxufVxuXG5leHBvcnQgeyBUZXh0RWRpdG9yUHJvcGVydHkgfTsiLCJpbXBvcnQgeyBWYWx1ZVN0cmVhbVByb3BlcnR5IH0gZnJvbSAnLi4vdmFsdWVzdHJlYW0nO1xuaW1wb3J0IHsgU3RyaW5nVmFsdWUsIEJvb2xWYWx1ZSwgRmxvYXRWYWx1ZSwgRGF0ZVZhbHVlIH0gZnJvbSAnc3RyZWFteS92YWx1ZSc7XG5cbmZ1bmN0aW9uIHZhbHVlRnVuY3Rvcih0eXBlLCAuLi5hcmdzKSB7XG5cdHN3aXRjaCh0eXBlKSB7XG5cdFx0Y2FzZSBcIlN0cmluZ1wiOlxuXHRcdFx0cmV0dXJuIG5ldyBTdHJpbmdWYWx1ZSguLi5hcmdzKTtcblx0XHRjYXNlIFwiQm9vbFwiOlxuXHRcdFx0cmV0dXJuIG5ldyBCb29sVmFsdWUoLi4uYXJncyk7XG5cdFx0Y2FzZSBcIkZsb2F0XCI6XG5cdFx0XHRyZXR1cm4gbmV3IEZsb2F0VmFsdWUoLi4uYXJncyk7XG5cdFx0Y2FzZSBcIkRhdGVcIjpcblx0XHRcdHJldHVybiBuZXcgRGF0ZVZhbHVlKC4uLmFyZ3MpO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYHR5cGUgJyR7dHlwZX0nIG5vdCBmb3VuZGApO1xuXHR9XG59XG5cbmNsYXNzIFZhbHVlUHJvcGVydHkgZXh0ZW5kcyBWYWx1ZVN0cmVhbVByb3BlcnR5IHtcblx0Y29uc3RydWN0b3IodHlwZSwgd2lyZcaSLCAuLi5hcmdzKSB7XG5cdFx0c3VwZXIoXG5cdFx0XHRcInZhbHVlXCIsXG5cdFx0XHQoKSA9PiB0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycgPyB2YWx1ZUZ1bmN0b3IodHlwZSwgLi4uYXJncykgOiB0eXBlLFxuXHRcdFx0d2lyZcaSIHx8ICgoKSAgPT4gKCgpID0+IHt9KSlcblx0XHQpO1xuXHR9XG59XG5cbmV4cG9ydCB7IFZhbHVlUHJvcGVydHkgfTsiLCJpbXBvcnQgeyBWYWx1ZVN0cmVhbVByb3BlcnR5IH0gZnJvbSAnLi4vdmFsdWVzdHJlYW0nO1xuaW1wb3J0IHsgQm9vbFZhbHVlIH0gZnJvbSAnc3RyZWFteS92YWx1ZSc7XG5pbXBvcnQgeyBEb20gfSBmcm9tICd1aS9kb20nO1xuXG5jbGFzcyBWaXNpYmxlUHJvcGVydHkgZXh0ZW5kcyBWYWx1ZVN0cmVhbVByb3BlcnR5IHtcblx0Y29uc3RydWN0b3IoZGVmYXVsdFZhbHVlID0gdHJ1ZSkge1xuXHRcdHN1cGVyKFxuXHRcdFx0XCJ2aXNpYmxlXCIsXG5cdFx0XHQoKSA9PiBuZXcgQm9vbFZhbHVlKGRlZmF1bHRWYWx1ZSksXG5cdFx0XHQodGFyZ2V0LCB2YWx1ZSkgID0+XG5cdFx0XHRcdERvbS5zdHJlYW0odmFsdWUpLmFwcGx5RGlzcGxheSh0YXJnZXQuZWwpXG5cdFx0KTtcblx0fVxufVxuXG5leHBvcnQgeyBWaXNpYmxlUHJvcGVydHkgfTsiLCJpbXBvcnQgeyBCYXNlUHJvcGVydHkgfSBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0IHsgxpIgfSBmcm9tICd1dGlsL8aSJztcblxubGV0IF9wID0gU3ltYm9sKCk7XG5cbmNsYXNzIFZhbHVlU3RyZWFtUHJvcGVydHkgZXh0ZW5kcyBCYXNlUHJvcGVydHkge1xuXHRjb25zdHJ1Y3RvcihuYW1lLCB2YWx1ZcaSLCB3aXJlxpIpIHtcblx0XHRzdXBlcihuYW1lKTtcblx0XHR0aGlzW19wXSA9IHsgdmFsdWXGkiwgd2lyZcaSIH07XG5cdH1cblxuXHRpbmplY3QodGFyZ2V0KSB7XG5cdFx0bGV0IHZhbHVlID0gdGhpc1tfcF0udmFsdWXGkigpO1xuXHRcdHRoaXMuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCB0aGlzLm5hbWUsICgpID0+IHZhbHVlLCB2YWx1ZS5wdXNoLmJpbmQodmFsdWUpKTtcblxuXHRcdHJldHVybiDGki5qb2luKFxuXHRcdFx0dGhpc1tfcF0ud2lyZcaSKHRhcmdldCwgdmFsdWUpLFxuXHRcdFx0KCkgPT4gdmFsdWUuY2FuY2VsKClcblx0XHQpO1xuXHR9XG59XG5cbmV4cG9ydCB7IFZhbHVlU3RyZWFtUHJvcGVydHkgfTsiLCJpbXBvcnQgeyBQdXNoU3RyZWFtIH0gZnJvbSAnc3RyZWFteS9zdHJlYW0nO1xuXG5sZXQgX2ZpZWxkcyA9IFN5bWJvbCgpLFxuXHRfc3RyZWFtID0gU3ltYm9sKCk7XG5cbmV4cG9ydCBjbGFzcyBTY2hlbWEge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzW19maWVsZHNdID0ge307XG5cdFx0dGhpc1tfc3RyZWFtXSA9IG5ldyBQdXNoU3RyZWFtKCk7XG5cdFx0bGV0IHN1YnNjcmliZSA9IHRoaXNbX3N0cmVhbV0uc3Vic2NyaWJlLmJpbmQodGhpc1tfc3RyZWFtXSk7XG5cdFx0dGhpc1tfc3RyZWFtXS5zdWJzY3JpYmUgPSAoxpIpID0+IHtcblx0XHRcdHN1YnNjcmliZSjGkik7XG5cdFx0XHTGkih7ZXZlbnQ6J2xpc3QnLGRhdGE6dGhpcy5wYWlyc30pO1xuXHRcdH07XG5cdH1cblxuXHRhZGQobmFtZSwgdHlwZSkge1xuXHRcdGlmKG5hbWUgaW4gdGhpc1tfZmllbGRzXSlcblx0XHRcdHRocm93IG5ldyBFcnJvcihgU2NoZW1hIGFscmVhZHkgY29udGFpbnMgYSBmaWVsZCAnJHtuYW1lfSdgKTtcblx0XHR0aGlzW19maWVsZHNdW25hbWVdID0gdHlwZTtcblx0XHR0aGlzW19zdHJlYW1dLnB1c2goe1xuXHRcdFx0ZXZlbnQ6ICdhZGQnLFxuXHRcdFx0bmFtZTogIG5hbWUsXG5cdFx0XHR0eXBlOiAgdHlwZVxuXHRcdH0pO1xuXHR9XG5cblx0cmVzZXQobGlzdCA9IFtdKSB7XG5cdFx0dGhpc1tfZmllbGRzXSA9IHt9O1xuXHRcdGxpc3QubWFwKHYgPT4gdGhpc1tfZmllbGRzXVt2Lm5hbWVdID0gdi50eXBlKTtcblx0XHR0aGlzW19zdHJlYW1dLnB1c2goe1xuXHRcdFx0ZXZlbnQ6ICdsaXN0Jyxcblx0XHRcdGRhdGE6ICBsaXN0LnNsaWNlKDApXG5cdFx0fSk7XG5cdH1cblxuXHRkZWxldGUobmFtZSkge1xuXHRcdGlmKCEobmFtZSBpbiB0aGlzW19maWVsZHNdKSlcblx0XHRcdHRocm93IG5ldyBFcnJvcihgU2NoZW1hIGRvZXMgbm90IGNvbnRhaW4gYSBmaWVsZCAnJHtuYW1lfSdgKTtcblx0XHRkZWxldGUgdGhpc1tfZmllbGRzXVtuYW1lXTtcblx0XHR0aGlzW19zdHJlYW1dLnB1c2goe1xuXHRcdFx0ZXZlbnQ6ICdkZWxldGUnLFxuXHRcdFx0bmFtZTogIG5hbWVcblx0XHR9KTtcblx0fVxuXG5cdHJlbmFtZShvbGRuYW1lLCBuZXduYW1lKSB7XG5cdFx0aWYoIShvbGRuYW1lIGluIHRoaXNbX2ZpZWxkc10pKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBTY2hlbWEgZG9lcyBub3QgY29udGFpbiBhIGZpZWxkICcke29sZG5hbWV9J2ApO1xuXHRcdGxldCB0eXBlID0gdGhpc1tfZmllbGRzXVtvbGRuYW1lXTtcblx0XHRkZWxldGUgdGhpc1tfZmllbGRzXVtvbGRuYW1lXTtcblx0XHR0aGlzW19maWVsZHNdW25ld25hbWVdID0gdHlwZTtcblx0XHR0aGlzW19zdHJlYW1dLnB1c2goe1xuXHRcdFx0ZXZlbnQ6ICAgJ3JlbmFtZScsXG5cdFx0XHRvbGRuYW1lOiBvbGRuYW1lLFxuXHRcdFx0bmV3bmFtZTogbmV3bmFtZVxuXHRcdH0pO1xuXHR9XG5cblx0cmV0eXBlKG5hbWUsIHR5cGUpIHtcblx0XHRpZighKG5hbWUgaW4gdGhpc1tfZmllbGRzXSkpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFNjaGVtYSBkb2Vzbid0IGNvbnRhaW5lciBmaWVsZCAnJHtuYW1lfScgZm9yIHJldHlwZSgpYCk7XG5cdFx0dGhpc1tfZmllbGRzXVtuYW1lXTtcblx0XHR0aGlzW19maWVsZHNdW25hbWVdID0gdHlwZTtcblx0XHR0aGlzW19zdHJlYW1dLnB1c2goe1xuXHRcdFx0ZXZlbnQ6J3JldHlwZScsXG5cdFx0XHRuYW1lOm5hbWUsXG5cdFx0XHR0eXBlOnR5cGVcblx0XHR9KTtcblx0fVxuXG5cdGdldChuYW1lKSB7XG5cdFx0cmV0dXJuIHRoaXNbX2ZpZWxkc11bbmFtZV07XG5cdH1cblxuXHRoYXMobmFtZSkge1xuXHRcdHJldHVybiBuYW1lIGluIHRoaXNbX2ZpZWxkc107XG5cdH1cblxuXHRbU3ltYm9sLml0ZXJhdG9yXSgpIHtcblx0XHRyZXR1cm4gdGhpcy5hcnJheTtcblx0fVxuXG5cdGdldCBhcnJheSgpIHtcblx0XHRyZXR1cm4gT2JqZWN0LmtleXModGhpc1tfZmllbGRzXSk7XG5cdH1cblxuXHRnZXQgcGFpcnMoKSB7XG5cdFx0cmV0dXJuIE9iamVjdC5rZXlzKHRoaXNbX2ZpZWxkc10pLm1hcChmdW5jdGlvbihrKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRrZXk6IGssXG5cdFx0XHRcdHZhbHVlOiB0aGlzW19maWVsZHNdW2tleV1cblx0XHRcdH07XG5cdFx0fSk7XG5cdH1cblxuXHRnZXQgc3RyZWFtKCkge1xuXHRcdHJldHVybiB0aGlzW19zdHJlYW1dO1xuXHR9XG5cblx0dG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXNbX2ZpZWxkc10pO1xuXHR9XG59IiwibGV0IGltbWVkaWF0ZSA9IHJlcXVpcmUoJ2ltbWVkaWF0ZScpLFxuXHRUaW1lciA9IHtcblx0ZGVsYXkobXMsIMaSKSB7XG5cdFx0aWYoxpIpXG5cdFx0XHRyZXR1cm4gc2V0VGltZW91dCjGkiwgbXMpO1xuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xuXHR9LFxuXHRpbW1lZGlhdGUoxpIpIHtcblx0XHRpZijGkilcblx0XHRcdHJldHVybiBpbW1lZGlhdGUoxpIpO1xuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gaW1tZWRpYXRlKHJlc29sdmUpKTtcblx0fSxcblx0ZGVib3VuY2UoxpIsIG1zID0gMCkge1xuXHRcdGxldCB0aWQsIGNvbnRleHQsIGFyZ3MsIGxhdGVyxpI7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29udGV4dCA9IHRoaXM7XG5cdFx0XHRhcmdzID0gYXJndW1lbnRzO1xuXHRcdFx0bGF0ZXLGkiA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoIWltbWVkaWF0ZSkgxpIuYXBwbHkoY29udGV4dCwgYXJncyk7XG5cdFx0XHR9O1xuXHRcdFx0Y2xlYXJUaW1lb3V0KHRpZCk7XG5cdFx0XHR0aWQgPSBzZXRUaW1lb3V0KGxhdGVyxpIsIG1zKTtcblx0XHR9O1xuXHR9LFxuXHRyZWR1Y2UoxpIsIG1zID0gMCkge1xuXHRcdGxldCB0aWQsIGNvbnRleHQsIGFyZ3M7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29udGV4dCA9IHRoaXM7XG5cdFx0XHRhcmdzID0gYXJndW1lbnRzO1xuXHRcdFx0aWYodGlkKSByZXR1cm47XG5cdFx0XHR0aWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aWQgPSBudWxsO1xuXHRcdFx0XHTGki5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0XHRcdH0sIG1zKTtcblx0XHR9O1xuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBUaW1lcjsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcblxuYnVmLnB1c2goXCI8aGVhZGVyIGNsYXNzPVxcXCJtb2RlbC10b29sYmFyXFxcIj48ZGl2IGNsYXNzPVxcXCJsZWZ0XFxcIj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJtaWRkbGVcXFwiPjwvZGl2PjxkaXYgY2xhc3M9XFxcInJpZ2h0XFxcIj48L2Rpdj48L2hlYWRlcj5cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnQnO1xuaW1wb3J0IHsgUXVlcnkgfSBmcm9tICd1aS9kb20nO1xuXG5sZXQgdGVtcGxhdGUgPSByZXF1aXJlKCcuL3Rvb2xiYXIuamFkZScpKCksXG5cdF9sZWZ0ICAgID0gU3ltYm9sKCksXG5cdF9taWRkbGUgID0gU3ltYm9sKCksXG5cdF9yaWdodCAgID0gU3ltYm9sKCksXG5cdF9lbCAgICAgID0gU3ltYm9sKCk7XG5cbmV4cG9ydCBjbGFzcyBUb29sYmFyR3JvdXAge1xuXHRjb25zdHJ1Y3RvcihlbCkge1xuXHRcdHRoaXNbX2VsXSA9IGVsO1xuXHR9XG5cblx0Z2V0IGVsKCkge1xuXHRcdHJldHVybiB0aGlzW19lbF07XG5cdH1cblxuXHRhZGQoY29tcCkge1xuXHRcdGNvbXAuYXR0YWNoVG8odGhpcy5lbCk7XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIFRvb2xiYXIgZXh0ZW5kcyBDb21wb25lbnQge1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcblx0XHRpZighKCd0ZW1wbGF0ZScgaW4gb3B0aW9ucykpXG5cdFx0XHRvcHRpb25zLnRlbXBsYXRlID0gdGVtcGxhdGU7XG5cdFx0c3VwZXIob3B0aW9ucyk7XG5cdFx0dGhpc1tfbGVmdF0gICA9IG5ldyBUb29sYmFyR3JvdXAoUXVlcnkuZmlyc3QoJy5sZWZ0JywgdGhpcy5lbCkpO1xuXHRcdHRoaXNbX21pZGRsZV0gPSBuZXcgVG9vbGJhckdyb3VwKFF1ZXJ5LmZpcnN0KCcubWlkZGxlJywgdGhpcy5lbCkpO1xuXHRcdHRoaXNbX3JpZ2h0XSAgPSBuZXcgVG9vbGJhckdyb3VwKFF1ZXJ5LmZpcnN0KCcucmlnaHQnLCB0aGlzLmVsKSk7XG5cdH1cblxuXHRnZXQgbGVmdCgpIHtcblx0XHRyZXR1cm4gdGhpc1tfbGVmdF07XG5cdH1cblxuXHRnZXQgbWlkZGxlKCkge1xuXHRcdHJldHVybiB0aGlzW19taWRkbGVdO1xuXHR9XG5cblx0Z2V0IHJpZ2h0KCkge1xuXHRcdHJldHVybiB0aGlzW19yaWdodF07XG5cdH1cbn0iLCJleHBvcnQgbGV0IMaSID0ge1xuXHRjb21wb3NlKMaSMSwgxpIyKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIMaSMSjGkjIuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpKTtcblx0XHR9O1xuXHR9LFxuXHRqb2luKMaSMSwgxpIyKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0xpIxLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcblx0XHRcdMaSMi5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG5cdFx0fVxuXHR9XG59OyJdfQ==
