(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var __moduleName = "client/main";
var $__0 = require('ui/dom'),
    Dom = $__0.Dom,
    Query = $__0.Query;
var Model = require('ui/model').Model;
var Schema = require('ui/schema').Schema;
var CardUI = require('ui/cardui').CardUI;
Dom.ready((function() {
  var $container = Query.first('.container'),
      schema = new Schema(),
      model = new Model(),
      cardui = new CardUI(model, schema);
  cardui.attachTo($container);
}));


},{"ui/cardui":27,"ui/dom":38,"ui/model":45,"ui/schema":73}],2:[function(require,module,exports){
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


},{"ui/timer":74}],24:[function(require,module,exports){
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
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<button><span class=\"content\"></span></button>");;return buf.join("");
};
},{"jade/runtime":20}],26:[function(require,module,exports){
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


},{"./button.jade":25,"./component":28,"./properties/types":65,"streamy/stream":23}],27:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/cardui";
var Component = require('./component').Component;
var DocUI = require('./docui').DocUI;
var ContextUI = require('./contextui').ContextUI;
var ModelUI = require('./modelui').ModelUI;
var _p = Symbol();
var CardUI = function CardUI(schema, model) {
  $traceurRuntime.superCall(this, $CardUI.prototype, "constructor", [{template: '<div class="card"></div>'}]);
  var docui = new DocUI(),
      contextui = new ContextUI(),
      modelui = new ModelUI(model, schema);
  this[_p] = {
    docui: docui,
    contextui: contextui,
    modelui: modelui,
    schema: schema,
    model: model
  };
  docui.attachTo(this.el);
  var aside = document.createElement('aside');
  this.el.appendChild(aside);
  contextui.attachTo(aside);
  modelui.attachTo(aside);
};
var $CardUI = CardUI;
($traceurRuntime.createClass)(CardUI, {
  get docui() {
    return this[_p].docui;
  },
  get contextui() {
    return this[_p].contextui;
  },
  get modelui() {
    return this[_p].modelui;
  },
  get schema() {
    return this[_p].schema;
  },
  get model() {
    return this[_p].model;
  }
}, {}, Component);
module.exports = {
  get CardUI() {
    return CardUI;
  },
  __esModule: true
};


},{"./component":28,"./contextui":30,"./docui":35,"./modelui":46}],28:[function(require,module,exports){
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


},{"./properties":53,"node-uuid":21,"streamy/stream":23,"ui/dom":38}],29:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/contexttoolbar";
var Button = require('ui/button').Button;
var Toolbar = require('./toolbar').Toolbar;
var ContextToolbar = function ContextToolbar(options) {
  $traceurRuntime.superCall(this, $ContextToolbar.prototype, "constructor", [options]);
  this.left.add(Button.icon('star'));
};
var $ContextToolbar = ContextToolbar;
($traceurRuntime.createClass)(ContextToolbar, {}, {}, Toolbar);
module.exports = {
  get ContextToolbar() {
    return ContextToolbar;
  },
  __esModule: true
};


},{"./toolbar":76,"ui/button":26}],30:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/contextui";
var ContextToolbar = require('./contexttoolbar').ContextToolbar;
var ContextView = require('./contextview').ContextView;
var Component = require('./component').Component;
var _p = Symbol();
var ContextUI = function ContextUI() {
  $traceurRuntime.superCall(this, $ContextUI.prototype, "constructor", [{template: '<div class="context"></div>'}]);
  var toolbar = new ContextToolbar(),
      view = new ContextView();
  this[_p] = {
    toolbar: toolbar,
    view: view
  };
  toolbar.attachTo(this.el);
  view.attachTo(this.el);
};
var $ContextUI = ContextUI;
($traceurRuntime.createClass)(ContextUI, {
  get toolbar() {
    return this[_p].toolbar;
  },
  get view() {
    return this[_p].view;
  }
}, {}, Component);
module.exports = {
  get ContextUI() {
    return ContextUI;
  },
  __esModule: true
};


},{"./component":28,"./contexttoolbar":29,"./contextview":32}],31:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"contextview\"></div>");;return buf.join("");
};
},{"jade/runtime":20}],32:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/contextview";
var Component = require('./component').Component;
var Field = require('./field').Field;
var template = require('./contextview.jade')();
var ContextView = function ContextView() {
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  if (!('template' in options))
    options.template = template;
  $traceurRuntime.superCall(this, $ContextView.prototype, "constructor", [options]);
};
var $ContextView = ContextView;
($traceurRuntime.createClass)(ContextView, {}, {}, Component);
module.exports = {
  get ContextView() {
    return ContextView;
  },
  __esModule: true
};


},{"./component":28,"./contextview.jade":31,"./field":40}],33:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/docfooter";
var Button = require('ui/button').Button;
var Footer = require('./footer').Footer;
var DocFooter = function DocFooter(options) {
  $traceurRuntime.superCall(this, $DocFooter.prototype, "constructor", [options]);
  this.add(Button.icon('star'));
};
var $DocFooter = DocFooter;
($traceurRuntime.createClass)(DocFooter, {}, {}, Footer);
module.exports = {
  get DocFooter() {
    return DocFooter;
  },
  __esModule: true
};


},{"./footer":42,"ui/button":26}],34:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/doctoolbar";
var Button = require('ui/button').Button;
var Toolbar = require('./toolbar').Toolbar;
var DocToolbar = function DocToolbar(options) {
  $traceurRuntime.superCall(this, $DocToolbar.prototype, "constructor", [options]);
  this.left.add(Button.icon('star'));
};
var $DocToolbar = DocToolbar;
($traceurRuntime.createClass)(DocToolbar, {}, {}, Toolbar);
module.exports = {
  get DocToolbar() {
    return DocToolbar;
  },
  __esModule: true
};


},{"./toolbar":76,"ui/button":26}],35:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/docui";
var DocToolbar = require('./doctoolbar').DocToolbar;
var DocFooter = require('./docfooter').DocFooter;
var DocView = require('./docview').DocView;
var Component = require('./component').Component;
var _p = Symbol();
var DocUI = function DocUI() {
  $traceurRuntime.superCall(this, $DocUI.prototype, "constructor", [{template: '<div class="doc"></div>'}]);
  var toolbar = new DocToolbar(),
      view = new DocView(),
      footer = new DocFooter();
  this[_p] = {
    toolbar: toolbar,
    view: view,
    footer: footer
  };
  toolbar.attachTo(this.el);
  view.attachTo(this.el);
  footer.attachTo(this.el);
};
var $DocUI = DocUI;
($traceurRuntime.createClass)(DocUI, {
  get toolbar() {
    return this[_p].toolbar;
  },
  get footer() {
    return this[_p].footer;
  },
  get view() {
    return this[_p].view;
  }
}, {}, Component);
module.exports = {
  get DocUI() {
    return DocUI;
  },
  __esModule: true
};


},{"./component":28,"./docfooter":33,"./doctoolbar":34,"./docview":37}],36:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<article class=\"docview\"></article>");;return buf.join("");
};
},{"jade/runtime":20}],37:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/docview";
var Component = require('./component').Component;
var template = require('./docview.jade')();
var DocView = function DocView() {
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  if (!('template' in options))
    options.template = template;
  $traceurRuntime.superCall(this, $DocView.prototype, "constructor", [options]);
};
var $DocView = DocView;
($traceurRuntime.createClass)(DocView, {}, {}, Component);
module.exports = {
  get DocView() {
    return DocView;
  },
  __esModule: true
};


},{"./component":28,"./docview.jade":36}],38:[function(require,module,exports){
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


},{}],39:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"field-container\"><div class=\"field\"><div class=\"key\"></div><div class=\"value\"></div></div><div class=\"calculated\"></div><hr/></div>");;return buf.join("");
};
},{"jade/runtime":20}],40:[function(require,module,exports){
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


},{"./component":28,"./field.jade":39,"./fragment":44,"ui/dom":38}],41:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<footer></footer>");;return buf.join("");
};
},{"jade/runtime":20}],42:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/footer";
var Component = require('./component').Component;
var template = require('./footer.jade')(),
    _el = Symbol();
var Footer = function Footer() {
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  if (!('template' in options))
    options.template = template;
  $traceurRuntime.superCall(this, $Footer.prototype, "constructor", [options]);
};
var $Footer = Footer;
($traceurRuntime.createClass)(Footer, {add: function(comp) {
    comp.attachTo(this.el);
  }}, {}, Component);
module.exports = {
  get Footer() {
    return Footer;
  },
  __esModule: true
};


},{"./component":28,"./footer.jade":41}],43:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<span class=\"fragment\"><span class=\"content\"></span></span>");;return buf.join("");
};
},{"jade/runtime":20}],44:[function(require,module,exports){
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


},{"./component":28,"./fragment.jade":43}],45:[function(require,module,exports){
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


},{"streamy/stream":23}],46:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/modelui";
var $__1 = require('./modelview'),
    ModelView = $__1.ModelView,
    SchemaWrapper = $__1.SchemaWrapper;
var ModelViewToolbar = require('./modelviewtoolbar').ModelViewToolbar;
var Component = require('./component').Component;
var _p = Symbol();
var ModelUI = function ModelUI(model, schema) {
  $traceurRuntime.superCall(this, $ModelUI.prototype, "constructor", [{template: '<div class="model"></div>'}]);
  var view = new ModelView(),
      wrapper = new SchemaWrapper(schema, view),
      toolbar = new ModelViewToolbar(view, model, schema);
  this[_p] = {
    model: model,
    schema: schema,
    view: view,
    toolbar: toolbar
  };
  toolbar.attachTo(this.el);
  view.attachTo(this.el);
  schema.stream.feed(model.schema);
  view.data.feed(model.data);
};
var $ModelUI = ModelUI;
($traceurRuntime.createClass)(ModelUI, {
  get model() {
    return this[_p].model;
  },
  get schema() {
    return this[_p].schema;
  },
  get view() {
    return this[_p].view;
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


},{"./component":28,"./modelview":48,"./modelviewtoolbar":49}],47:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"modelview\"></div>");;return buf.join("");
};
},{"jade/runtime":20}],48:[function(require,module,exports){
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


},{"./component":28,"./field":40,"./modelview.jade":47,"./properties/types":65,"streamy/stream":23}],49:[function(require,module,exports){
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


},{"./properties/types":65,"./toolbar":76,"ui/button":26}],50:[function(require,module,exports){
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


},{}],51:[function(require,module,exports){
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


},{"./base":50}],52:[function(require,module,exports){
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


},{"./base":50,"./properties":54}],53:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/properties/index";
var $__node_95_modules_47_ui_47_properties_47_properties__ = require('./properties');
module.exports = $traceurRuntime.exportStar({__esModule: true}, $__node_95_modules_47_ui_47_properties_47_properties__);


},{"./properties":54}],54:[function(require,module,exports){
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


},{}],55:[function(require,module,exports){
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


},{"./base":50,"util/ƒ":77}],56:[function(require,module,exports){
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


},{"../valuestream":72,"streamy/value":24,"ui/dom":38}],57:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (undefined) {
buf.push("<input type=\"checkbox\"" + (jade.attr("checked", (true===false ? "checked" : undefined), true, false)) + " class=\"bool editor\"/>");}("undefined" in locals_for_with?locals_for_with.undefined:typeof undefined!=="undefined"?undefined:undefined));;return buf.join("");
};
},{"jade/runtime":20}],58:[function(require,module,exports){
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


},{"../behavior":51,"../container":52,"./booleditor.jade":57,"./value":70,"ui/dom":38}],59:[function(require,module,exports){
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


},{"../valuestream":72,"streamy/value":24,"ui/dom":38}],60:[function(require,module,exports){
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


},{"../stream":55,"streamy/stream":23,"streamy/value":24,"ui/dom":38}],61:[function(require,module,exports){
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


},{"./booleditor":58,"./texteditor":69}],62:[function(require,module,exports){
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


},{"../valuestream":72,"streamy/value":24,"ui/dom":38}],63:[function(require,module,exports){
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


},{"../valuestream":72,"streamy/value":24,"ui/dom":38}],64:[function(require,module,exports){
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


},{"./html":63,"streamy/value":24,"ui/dom":38}],65:[function(require,module,exports){
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


},{"./attribute":56,"./booleditor":58,"./classname":59,"./click":60,"./editor":61,"./enable":62,"./html":63,"./icon":64,"./link":66,"./numericformat":67,"./text":68,"./texteditor":69,"./value":70,"./visible":71}],66:[function(require,module,exports){
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


},{"../valuestream":72,"streamy/value":24}],67:[function(require,module,exports){
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


},{"../valuestream":72,"numeral":22,"streamy/value":24}],68:[function(require,module,exports){
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


},{"../valuestream":72,"streamy/value":24,"ui/dom":38}],69:[function(require,module,exports){
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


},{"../behavior":51,"../container":52,"./value":70,"streamy/stream":23,"ui/dom":38}],70:[function(require,module,exports){
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


},{"../valuestream":72,"streamy/value":24}],71:[function(require,module,exports){
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


},{"../valuestream":72,"streamy/value":24,"ui/dom":38}],72:[function(require,module,exports){
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


},{"./base":50,"util/ƒ":77}],73:[function(require,module,exports){
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


},{"streamy/stream":23}],74:[function(require,module,exports){
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


},{"immediate":14}],75:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<header class=\"toolbar\"><div class=\"left\"></div><div class=\"middle\"></div><div class=\"right\"></div></header>");;return buf.join("");
};
},{"jade/runtime":20}],76:[function(require,module,exports){
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


},{"./component":28,"./toolbar.jade":75,"ui/dom":38}],77:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvY2xpZW50L21haW4uanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL25vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2NyeXB0by1icm93c2VyaWZ5L2hlbHBlcnMuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvY3J5cHRvLWJyb3dzZXJpZnkvaW5kZXguanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvY3J5cHRvLWJyb3dzZXJpZnkvbWQ1LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2NyeXB0by1icm93c2VyaWZ5L3JuZy5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9jcnlwdG8tYnJvd3NlcmlmeS9zaGEuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvY3J5cHRvLWJyb3dzZXJpZnkvc2hhMjU2LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2luc2VydC1tb2R1bGUtZ2xvYmFscy9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2VzNmlmeS9ub2RlX21vZHVsZXMvdHJhY2V1ci9iaW4vdHJhY2V1ci1ydW50aW1lLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2ltbWVkaWF0ZS9saWIvZmFrZU5leHRUaWNrLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2ltbWVkaWF0ZS9saWIvaW5kZXguanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvaW1tZWRpYXRlL2xpYi9tZXNzYWdlQ2hhbm5lbC5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9pbW1lZGlhdGUvbGliL211dGF0aW9uLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2ltbWVkaWF0ZS9saWIvcG9zdE1lc3NhZ2UuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvaW1tZWRpYXRlL2xpYi9zdGF0ZUNoYW5nZS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9pbW1lZGlhdGUvbGliL3RpbWVvdXQuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvamFkZS9ydW50aW1lLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL25vZGUtdXVpZC91dWlkLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL251bWVyYWwvbnVtZXJhbC5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9zdHJlYW15L3N0cmVhbS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9zdHJlYW15L3ZhbHVlLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL2J1dHRvbi5qYWRlIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL2J1dHRvbi5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9jYXJkdWkuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvY29tcG9uZW50LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL2NvbnRleHR0b29sYmFyLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL2NvbnRleHR1aS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9jb250ZXh0dmlldy5qYWRlIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL2NvbnRleHR2aWV3LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL2RvY2Zvb3Rlci5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9kb2N0b29sYmFyLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL2RvY3VpLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL2RvY3ZpZXcuamFkZSIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9kb2N2aWV3LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL2RvbS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9maWVsZC5qYWRlIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL2ZpZWxkLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL2Zvb3Rlci5qYWRlIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL2Zvb3Rlci5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9mcmFnbWVudC5qYWRlIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL2ZyYWdtZW50LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL21vZGVsLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL21vZGVsdWkuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvbW9kZWx2aWV3LmphZGUiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvbW9kZWx2aWV3LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL21vZGVsdmlld3Rvb2xiYXIuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvcHJvcGVydGllcy9iYXNlLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3Byb3BlcnRpZXMvYmVoYXZpb3IuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvcHJvcGVydGllcy9jb250YWluZXIuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvcHJvcGVydGllcy9pbmRleC5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9wcm9wZXJ0aWVzL3Byb3BlcnRpZXMuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvcHJvcGVydGllcy9zdHJlYW0uanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvcHJvcGVydGllcy90eXBlcy9hdHRyaWJ1dGUuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvcHJvcGVydGllcy90eXBlcy9ib29sZWRpdG9yLmphZGUiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvcHJvcGVydGllcy90eXBlcy9ib29sZWRpdG9yLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3Byb3BlcnRpZXMvdHlwZXMvY2xhc3NuYW1lLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3Byb3BlcnRpZXMvdHlwZXMvY2xpY2suanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvcHJvcGVydGllcy90eXBlcy9lZGl0b3IuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvcHJvcGVydGllcy90eXBlcy9lbmFibGUuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvcHJvcGVydGllcy90eXBlcy9odG1sLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3Byb3BlcnRpZXMvdHlwZXMvaWNvbi5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9wcm9wZXJ0aWVzL3R5cGVzL2luZGV4LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3Byb3BlcnRpZXMvdHlwZXMvbGluay5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9wcm9wZXJ0aWVzL3R5cGVzL251bWVyaWNmb3JtYXQuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvcHJvcGVydGllcy90eXBlcy90ZXh0LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3Byb3BlcnRpZXMvdHlwZXMvdGV4dGVkaXRvci5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9wcm9wZXJ0aWVzL3R5cGVzL3ZhbHVlLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3Byb3BlcnRpZXMvdHlwZXMvdmlzaWJsZS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS9wcm9wZXJ0aWVzL3ZhbHVlc3RyZWFtLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3NjaGVtYS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS90aW1lci5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS90b29sYmFyLmphZGUiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvdG9vbGJhci5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91dGlsL8aSLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O21CQUEyQixRQUFROzs7b0JBQ2IsVUFBVTtxQkFDVCxXQUFXO3FCQUNYLFdBQVc7QUFFbEMsQ0FBQSxFQUFHLE1BQU07S0FDSixDQUFBLFVBQVUsRUFBRyxDQUFBLEtBQUssTUFBTSxDQUFDLFlBQVksQ0FBQztBQUN6QyxDQUFBLFdBQU0sRUFBTyxJQUFJLE9BQU0sRUFBRTtBQUN6QixDQUFBLFVBQUssRUFBUSxJQUFJLE1BQUssRUFBRTtBQUN4QixDQUFBLFdBQU0sRUFBTyxJQUFJLE9BQU0sQ0FBQyxLQUFLLENBQUUsT0FBTSxDQUFDO0FBRXZDLENBQUEsT0FBTSxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7R0FDM0IsQ0FBQztDQUFBOzs7QUNaSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5ekNBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbk5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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b250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHsgRG9tLCBRdWVyeSB9IGZyb20gJ3VpL2RvbSc7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gJ3VpL21vZGVsJztcbmltcG9ydCB7IFNjaGVtYSB9IGZyb20gJ3VpL3NjaGVtYSc7XG5pbXBvcnQgeyBDYXJkVUkgfSBmcm9tICd1aS9jYXJkdWknO1xuXG5Eb20ucmVhZHkoKCkgPT4ge1xuXHRsZXQgJGNvbnRhaW5lciA9IFF1ZXJ5LmZpcnN0KCcuY29udGFpbmVyJyksXG5cdFx0c2NoZW1hICAgICA9IG5ldyBTY2hlbWEoKSxcblx0XHRtb2RlbCAgICAgID0gbmV3IE1vZGVsKCksXG5cdFx0Y2FyZHVpICAgICA9IG5ldyBDYXJkVUkobW9kZWwsIHNjaGVtYSk7XG5cblx0Y2FyZHVpLmF0dGFjaFRvKCRjb250YWluZXIpO1xufSk7IiwiLyoqXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBBdXRob3I6ICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIExpY2Vuc2U6ICBNSVRcbiAqXG4gKiBgbnBtIGluc3RhbGwgYnVmZmVyYFxuICovXG5cbnZhciBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxudmFyIGllZWU3NTQgPSByZXF1aXJlKCdpZWVlNzU0JylcblxuZXhwb3J0cy5CdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuU2xvd0J1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyXG5cbi8qKlxuICogSWYgYEJ1ZmZlci5fdXNlVHlwZWRBcnJheXNgOlxuICogICA9PT0gdHJ1ZSAgICBVc2UgVWludDhBcnJheSBpbXBsZW1lbnRhdGlvbiAoZmFzdGVzdClcbiAqICAgPT09IGZhbHNlICAgVXNlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiAoY29tcGF0aWJsZSBkb3duIHRvIElFNilcbiAqL1xuQnVmZmVyLl91c2VUeXBlZEFycmF5cyA9IChmdW5jdGlvbiAoKSB7XG4gIC8vIERldGVjdCBpZiBicm93c2VyIHN1cHBvcnRzIFR5cGVkIEFycmF5cy4gU3VwcG9ydGVkIGJyb3dzZXJzIGFyZSBJRSAxMCssIEZpcmVmb3ggNCssXG4gIC8vIENocm9tZSA3KywgU2FmYXJpIDUuMSssIE9wZXJhIDExLjYrLCBpT1MgNC4yKy4gSWYgdGhlIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBhZGRpbmdcbiAgLy8gcHJvcGVydGllcyB0byBgVWludDhBcnJheWAgaW5zdGFuY2VzLCB0aGVuIHRoYXQncyB0aGUgc2FtZSBhcyBubyBgVWludDhBcnJheWAgc3VwcG9ydFxuICAvLyBiZWNhdXNlIHdlIG5lZWQgdG8gYmUgYWJsZSB0byBhZGQgYWxsIHRoZSBub2RlIEJ1ZmZlciBBUEkgbWV0aG9kcy4gVGhpcyBpcyBhbiBpc3N1ZVxuICAvLyBpbiBGaXJlZm94IDQtMjkuIE5vdyBmaXhlZDogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njk1NDM4XG4gIHRyeSB7XG4gICAgdmFyIGJ1ZiA9IG5ldyBBcnJheUJ1ZmZlcigwKVxuICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheShidWYpXG4gICAgYXJyLmZvbyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDQyIH1cbiAgICByZXR1cm4gNDIgPT09IGFyci5mb28oKSAmJlxuICAgICAgICB0eXBlb2YgYXJyLnN1YmFycmF5ID09PSAnZnVuY3Rpb24nIC8vIENocm9tZSA5LTEwIGxhY2sgYHN1YmFycmF5YFxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn0pKClcblxuLyoqXG4gKiBDbGFzczogQnVmZmVyXG4gKiA9PT09PT09PT09PT09XG4gKlxuICogVGhlIEJ1ZmZlciBjb25zdHJ1Y3RvciByZXR1cm5zIGluc3RhbmNlcyBvZiBgVWludDhBcnJheWAgdGhhdCBhcmUgYXVnbWVudGVkXG4gKiB3aXRoIGZ1bmN0aW9uIHByb3BlcnRpZXMgZm9yIGFsbCB0aGUgbm9kZSBgQnVmZmVyYCBBUEkgZnVuY3Rpb25zLiBXZSB1c2VcbiAqIGBVaW50OEFycmF5YCBzbyB0aGF0IHNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0IHJldHVybnNcbiAqIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIEJ5IGF1Z21lbnRpbmcgdGhlIGluc3RhbmNlcywgd2UgY2FuIGF2b2lkIG1vZGlmeWluZyB0aGUgYFVpbnQ4QXJyYXlgXG4gKiBwcm90b3R5cGUuXG4gKi9cbmZ1bmN0aW9uIEJ1ZmZlciAoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSlcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcihzdWJqZWN0LCBlbmNvZGluZywgbm9aZXJvKVxuXG4gIHZhciB0eXBlID0gdHlwZW9mIHN1YmplY3RcblxuICAvLyBXb3JrYXJvdW5kOiBub2RlJ3MgYmFzZTY0IGltcGxlbWVudGF0aW9uIGFsbG93cyBmb3Igbm9uLXBhZGRlZCBzdHJpbmdzXG4gIC8vIHdoaWxlIGJhc2U2NC1qcyBkb2VzIG5vdC5cbiAgaWYgKGVuY29kaW5nID09PSAnYmFzZTY0JyAmJiB0eXBlID09PSAnc3RyaW5nJykge1xuICAgIHN1YmplY3QgPSBzdHJpbmd0cmltKHN1YmplY3QpXG4gICAgd2hpbGUgKHN1YmplY3QubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgICAgc3ViamVjdCA9IHN1YmplY3QgKyAnPSdcbiAgICB9XG4gIH1cblxuICAvLyBGaW5kIHRoZSBsZW5ndGhcbiAgdmFyIGxlbmd0aFxuICBpZiAodHlwZSA9PT0gJ251bWJlcicpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QpXG4gIGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKVxuICAgIGxlbmd0aCA9IEJ1ZmZlci5ieXRlTGVuZ3RoKHN1YmplY3QsIGVuY29kaW5nKVxuICBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0JylcbiAgICBsZW5ndGggPSBjb2VyY2Uoc3ViamVjdC5sZW5ndGgpIC8vIGFzc3VtZSB0aGF0IG9iamVjdCBpcyBhcnJheS1saWtlXG4gIGVsc2VcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG5lZWRzIHRvIGJlIGEgbnVtYmVyLCBhcnJheSBvciBzdHJpbmcuJylcblxuICB2YXIgYnVmXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgLy8gUHJlZmVycmVkOiBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIGJ1ZiA9IEJ1ZmZlci5fYXVnbWVudChuZXcgVWludDhBcnJheShsZW5ndGgpKVxuICB9IGVsc2Uge1xuICAgIC8vIEZhbGxiYWNrOiBSZXR1cm4gVEhJUyBpbnN0YW5jZSBvZiBCdWZmZXIgKGNyZWF0ZWQgYnkgYG5ld2ApXG4gICAgYnVmID0gdGhpc1xuICAgIGJ1Zi5sZW5ndGggPSBsZW5ndGhcbiAgICBidWYuX2lzQnVmZmVyID0gdHJ1ZVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgdHlwZW9mIHN1YmplY3QuYnl0ZUxlbmd0aCA9PT0gJ251bWJlcicpIHtcbiAgICAvLyBTcGVlZCBvcHRpbWl6YXRpb24gLS0gdXNlIHNldCBpZiB3ZSdyZSBjb3B5aW5nIGZyb20gYSB0eXBlZCBhcnJheVxuICAgIGJ1Zi5fc2V0KHN1YmplY3QpXG4gIH0gZWxzZSBpZiAoaXNBcnJheWlzaChzdWJqZWN0KSkge1xuICAgIC8vIFRyZWF0IGFycmF5LWlzaCBvYmplY3RzIGFzIGEgYnl0ZSBhcnJheVxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihzdWJqZWN0KSlcbiAgICAgICAgYnVmW2ldID0gc3ViamVjdC5yZWFkVUludDgoaSlcbiAgICAgIGVsc2VcbiAgICAgICAgYnVmW2ldID0gc3ViamVjdFtpXVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgIGJ1Zi53cml0ZShzdWJqZWN0LCAwLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnbnVtYmVyJyAmJiAhQnVmZmVyLl91c2VUeXBlZEFycmF5cyAmJiAhbm9aZXJvKSB7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBidWZbaV0gPSAwXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBTVEFUSUMgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbiAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgIGNhc2UgJ3Jhdyc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIChiKSB7XG4gIHJldHVybiAhIShiICE9PSBudWxsICYmIGIgIT09IHVuZGVmaW5lZCAmJiBiLl9pc0J1ZmZlcilcbn1cblxuQnVmZmVyLmJ5dGVMZW5ndGggPSBmdW5jdGlvbiAoc3RyLCBlbmNvZGluZykge1xuICB2YXIgcmV0XG4gIHN0ciA9IHN0ciArICcnXG4gIHN3aXRjaCAoZW5jb2RpbmcgfHwgJ3V0ZjgnKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGggLyAyXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IHV0ZjhUb0J5dGVzKHN0cikubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ3Jhdyc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBiYXNlNjRUb0J5dGVzKHN0cikubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoICogMlxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiAobGlzdCwgdG90YWxMZW5ndGgpIHtcbiAgYXNzZXJ0KGlzQXJyYXkobGlzdCksICdVc2FnZTogQnVmZmVyLmNvbmNhdChsaXN0LCBbdG90YWxMZW5ndGhdKVxcbicgK1xuICAgICAgJ2xpc3Qgc2hvdWxkIGJlIGFuIEFycmF5LicpXG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoMClcbiAgfSBlbHNlIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBsaXN0WzBdXG4gIH1cblxuICB2YXIgaVxuICBpZiAodHlwZW9mIHRvdGFsTGVuZ3RoICE9PSAnbnVtYmVyJykge1xuICAgIHRvdGFsTGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB0b3RhbExlbmd0aCArPSBsaXN0W2ldLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIHZhciBidWYgPSBuZXcgQnVmZmVyKHRvdGFsTGVuZ3RoKVxuICB2YXIgcG9zID0gMFxuICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXVxuICAgIGl0ZW0uY29weShidWYsIHBvcylcbiAgICBwb3MgKz0gaXRlbS5sZW5ndGhcbiAgfVxuICByZXR1cm4gYnVmXG59XG5cbi8vIEJVRkZFUiBJTlNUQU5DRSBNRVRIT0RTXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBfaGV4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSBidWYubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cblxuICAvLyBtdXN0IGJlIGFuIGV2ZW4gbnVtYmVyIG9mIGRpZ2l0c1xuICB2YXIgc3RyTGVuID0gc3RyaW5nLmxlbmd0aFxuICBhc3NlcnQoc3RyTGVuICUgMiA9PT0gMCwgJ0ludmFsaWQgaGV4IHN0cmluZycpXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBieXRlID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KVxuICAgIGFzc2VydCghaXNOYU4oYnl0ZSksICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuICAgIGJ1ZltvZmZzZXQgKyBpXSA9IGJ5dGVcbiAgfVxuICBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9IGkgKiAyXG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIF91dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcihhc2NpaVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfYmluYXJ5V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gX2FzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBfYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF91dGYxNmxlV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIFN1cHBvcnQgYm90aCAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpXG4gIC8vIGFuZCB0aGUgbGVnYWN5IChzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBpZiAoIWlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIH0gZWxzZSB7ICAvLyBsZWdhY3lcbiAgICB2YXIgc3dhcCA9IGVuY29kaW5nXG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBvZmZzZXQgPSBsZW5ndGhcbiAgICBsZW5ndGggPSBzd2FwXG4gIH1cblxuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKVxuXG4gIHZhciByZXRcbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBfaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gX3V0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXQgPSBfYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0ID0gX2JpbmFyeVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBfYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IF91dGYxNmxlV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuXG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKVxuICBzdGFydCA9IE51bWJlcihzdGFydCkgfHwgMFxuICBlbmQgPSAoZW5kICE9PSB1bmRlZmluZWQpXG4gICAgPyBOdW1iZXIoZW5kKVxuICAgIDogZW5kID0gc2VsZi5sZW5ndGhcblxuICAvLyBGYXN0cGF0aCBlbXB0eSBzdHJpbmdzXG4gIGlmIChlbmQgPT09IHN0YXJ0KVxuICAgIHJldHVybiAnJ1xuXG4gIHZhciByZXRcbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBfaGV4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gX3V0ZjhTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXQgPSBfYXNjaWlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0ID0gX2JpbmFyeVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBfYmFzZTY0U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IF91dGYxNmxlU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnQnVmZmVyJyxcbiAgICBkYXRhOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLl9hcnIgfHwgdGhpcywgMClcbiAgfVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiAodGFyZ2V0LCB0YXJnZXRfc3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNvdXJjZSA9IHRoaXNcblxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAoIXRhcmdldF9zdGFydCkgdGFyZ2V0X3N0YXJ0ID0gMFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuXG4gIGlmICh0YXJnZXQubGVuZ3RoID09PSAwIHx8IHNvdXJjZS5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIC8vIEZhdGFsIGVycm9yIGNvbmRpdGlvbnNcbiAgYXNzZXJ0KGVuZCA+PSBzdGFydCwgJ3NvdXJjZUVuZCA8IHNvdXJjZVN0YXJ0JylcbiAgYXNzZXJ0KHRhcmdldF9zdGFydCA+PSAwICYmIHRhcmdldF9zdGFydCA8IHRhcmdldC5sZW5ndGgsXG4gICAgICAndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChzdGFydCA+PSAwICYmIHN0YXJ0IDwgc291cmNlLmxlbmd0aCwgJ3NvdXJjZVN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoZW5kID49IDAgJiYgZW5kIDw9IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKVxuICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0IDwgZW5kIC0gc3RhcnQpXG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCArIHN0YXJ0XG5cbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0XG5cbiAgaWYgKGxlbiA8IDEwMCB8fCAhQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICB0YXJnZXRbaSArIHRhcmdldF9zdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQuX3NldCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIGxlbiksIHRhcmdldF9zdGFydClcbiAgfVxufVxuXG5mdW5jdGlvbiBfYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID09PSBidWYubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1ZilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LCBlbmQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIF91dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmVzID0gJydcbiAgdmFyIHRtcCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIGlmIChidWZbaV0gPD0gMHg3Rikge1xuICAgICAgcmVzICs9IGRlY29kZVV0ZjhDaGFyKHRtcCkgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgICAgIHRtcCA9ICcnXG4gICAgfSBlbHNlIHtcbiAgICAgIHRtcCArPSAnJScgKyBidWZbaV0udG9TdHJpbmcoMTYpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlcyArIGRlY29kZVV0ZjhDaGFyKHRtcClcbn1cblxuZnVuY3Rpb24gX2FzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKVxuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBfYmluYXJ5U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICByZXR1cm4gX2FzY2lpU2xpY2UoYnVmLCBzdGFydCwgZW5kKVxufVxuXG5mdW5jdGlvbiBfaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIHZhciBvdXQgPSAnJ1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIG91dCArPSB0b0hleChidWZbaV0pXG4gIH1cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiBfdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyBieXRlc1tpKzFdICogMjU2KVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIChzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBzdGFydCA9IGNsYW1wKHN0YXJ0LCBsZW4sIDApXG4gIGVuZCA9IGNsYW1wKGVuZCwgbGVuLCBsZW4pXG5cbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICByZXR1cm4gQnVmZmVyLl9hdWdtZW50KHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZCkpXG4gIH0gZWxzZSB7XG4gICAgdmFyIHNsaWNlTGVuID0gZW5kIC0gc3RhcnRcbiAgICB2YXIgbmV3QnVmID0gbmV3IEJ1ZmZlcihzbGljZUxlbiwgdW5kZWZpbmVkLCB0cnVlKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2VMZW47IGkrKykge1xuICAgICAgbmV3QnVmW2ldID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICAgIHJldHVybiBuZXdCdWZcbiAgfVxufVxuXG4vLyBgZ2V0YCB3aWxsIGJlIHJlbW92ZWQgaW4gTm9kZSAwLjEzK1xuQnVmZmVyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAob2Zmc2V0KSB7XG4gIGNvbnNvbGUubG9nKCcuZ2V0KCkgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHVzaW5nIGFycmF5IGluZGV4ZXMgaW5zdGVhZC4nKVxuICByZXR1cm4gdGhpcy5yZWFkVUludDgob2Zmc2V0KVxufVxuXG4vLyBgc2V0YCB3aWxsIGJlIHJlbW92ZWQgaW4gTm9kZSAwLjEzK1xuQnVmZmVyLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAodiwgb2Zmc2V0KSB7XG4gIGNvbnNvbGUubG9nKCcuc2V0KCkgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHVzaW5nIGFycmF5IGluZGV4ZXMgaW5zdGVhZC4nKVxuICByZXR1cm4gdGhpcy53cml0ZVVJbnQ4KHYsIG9mZnNldClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRVSW50MTYgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsXG4gIGlmIChsaXR0bGVFbmRpYW4pIHtcbiAgICB2YWwgPSBidWZbb2Zmc2V0XVxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXSA8PCA4XG4gIH0gZWxzZSB7XG4gICAgdmFsID0gYnVmW29mZnNldF0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXVxuICB9XG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDMyIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgaWYgKG9mZnNldCArIDIgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMl0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICAgIHZhbCB8PSBidWZbb2Zmc2V0XVxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsID0gdmFsICsgKGJ1ZltvZmZzZXQgKyAzXSA8PCAyNCA+Pj4gMClcbiAgfSBlbHNlIHtcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCA9IGJ1ZltvZmZzZXQgKyAxXSA8PCAxNlxuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAyXSA8PCA4XG4gICAgaWYgKG9mZnNldCArIDMgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDNdXG4gICAgdmFsID0gdmFsICsgKGJ1ZltvZmZzZXRdIDw8IDI0ID4+PiAwKVxuICB9XG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIHZhciBuZWcgPSB0aGlzW29mZnNldF0gJiAweDgwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmIC0gdGhpc1tvZmZzZXRdICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5mdW5jdGlvbiBfcmVhZEludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbCA9IF9yZWFkVUludDE2KGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIHRydWUpXG4gIHZhciBuZWcgPSB2YWwgJiAweDgwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZiAtIHZhbCArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQzMihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwMDAwMFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZmZmZmZmZiAtIHZhbCArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRGbG9hdCAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICByZXR1cm4gaWVlZTc1NC5yZWFkKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRmxvYXQodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZERvdWJsZSAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICsgNyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICByZXR1cm4gaWVlZTc1NC5yZWFkKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmYpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKSByZXR1cm5cblxuICB0aGlzW29mZnNldF0gPSB2YWx1ZVxufVxuXG5mdW5jdGlvbiBfd3JpdGVVSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihsZW4gLSBvZmZzZXQsIDIpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID1cbiAgICAgICAgKHZhbHVlICYgKDB4ZmYgPDwgKDggKiAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSkpKSA+Pj5cbiAgICAgICAgICAgIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpICogOFxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVVSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCA0KTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSA+Pj4gKGxpdHRsZUVuZGlhbiA/IGkgOiAzIC0gaSkgKiA4KSAmIDB4ZmZcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZiwgLTB4ODApXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIHRoaXMud3JpdGVVSW50OCh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydClcbiAgZWxzZVxuICAgIHRoaXMud3JpdGVVSW50OCgweGZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmYsIC0weDgwMDApXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICBfd3JpdGVVSW50MTYoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgMHhmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDMyKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQzMihidWYsIDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGZpbGwodmFsdWUsIHN0YXJ0PTAsIGVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gKHZhbHVlLCBzdGFydCwgZW5kKSB7XG4gIGlmICghdmFsdWUpIHZhbHVlID0gMFxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQpIGVuZCA9IHRoaXMubGVuZ3RoXG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWx1ZSA9IHZhbHVlLmNoYXJDb2RlQXQoMClcbiAgfVxuXG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICFpc05hTih2YWx1ZSksICd2YWx1ZSBpcyBub3QgYSBudW1iZXInKVxuICBhc3NlcnQoZW5kID49IHN0YXJ0LCAnZW5kIDwgc3RhcnQnKVxuXG4gIC8vIEZpbGwgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuXG4gIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgYXNzZXJ0KHN0YXJ0ID49IDAgJiYgc3RhcnQgPCB0aGlzLmxlbmd0aCwgJ3N0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoZW5kID49IDAgJiYgZW5kIDw9IHRoaXMubGVuZ3RoLCAnZW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgdGhpc1tpXSA9IHZhbHVlXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgb3V0ID0gW11cbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBvdXRbaV0gPSB0b0hleCh0aGlzW2ldKVxuICAgIGlmIChpID09PSBleHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTKSB7XG4gICAgICBvdXRbaSArIDFdID0gJy4uLidcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHJldHVybiAnPEJ1ZmZlciAnICsgb3V0LmpvaW4oJyAnKSArICc+J1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgYEFycmF5QnVmZmVyYCB3aXRoIHRoZSAqY29waWVkKiBtZW1vcnkgb2YgdGhlIGJ1ZmZlciBpbnN0YW5jZS5cbiAqIEFkZGVkIGluIE5vZGUgMC4xMi4gT25seSBhdmFpbGFibGUgaW4gYnJvd3NlcnMgdGhhdCBzdXBwb3J0IEFycmF5QnVmZmVyLlxuICovXG5CdWZmZXIucHJvdG90eXBlLnRvQXJyYXlCdWZmZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgICAgcmV0dXJuIChuZXcgQnVmZmVyKHRoaXMpKS5idWZmZXJcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGJ1ZiA9IG5ldyBVaW50OEFycmF5KHRoaXMubGVuZ3RoKVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGJ1Zi5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSlcbiAgICAgICAgYnVmW2ldID0gdGhpc1tpXVxuICAgICAgcmV0dXJuIGJ1Zi5idWZmZXJcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdCdWZmZXIudG9BcnJheUJ1ZmZlciBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlcicpXG4gIH1cbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBzdHJpbmd0cmltIChzdHIpIHtcbiAgaWYgKHN0ci50cmltKSByZXR1cm4gc3RyLnRyaW0oKVxuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKVxufVxuXG52YXIgQlAgPSBCdWZmZXIucHJvdG90eXBlXG5cbi8qKlxuICogQXVnbWVudCBhIFVpbnQ4QXJyYXkgKmluc3RhbmNlKiAobm90IHRoZSBVaW50OEFycmF5IGNsYXNzISkgd2l0aCBCdWZmZXIgbWV0aG9kc1xuICovXG5CdWZmZXIuX2F1Z21lbnQgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGFyci5faXNCdWZmZXIgPSB0cnVlXG5cbiAgLy8gc2F2ZSByZWZlcmVuY2UgdG8gb3JpZ2luYWwgVWludDhBcnJheSBnZXQvc2V0IG1ldGhvZHMgYmVmb3JlIG92ZXJ3cml0aW5nXG4gIGFyci5fZ2V0ID0gYXJyLmdldFxuICBhcnIuX3NldCA9IGFyci5zZXRcblxuICAvLyBkZXByZWNhdGVkLCB3aWxsIGJlIHJlbW92ZWQgaW4gbm9kZSAwLjEzK1xuICBhcnIuZ2V0ID0gQlAuZ2V0XG4gIGFyci5zZXQgPSBCUC5zZXRcblxuICBhcnIud3JpdGUgPSBCUC53cml0ZVxuICBhcnIudG9TdHJpbmcgPSBCUC50b1N0cmluZ1xuICBhcnIudG9Mb2NhbGVTdHJpbmcgPSBCUC50b1N0cmluZ1xuICBhcnIudG9KU09OID0gQlAudG9KU09OXG4gIGFyci5jb3B5ID0gQlAuY29weVxuICBhcnIuc2xpY2UgPSBCUC5zbGljZVxuICBhcnIucmVhZFVJbnQ4ID0gQlAucmVhZFVJbnQ4XG4gIGFyci5yZWFkVUludDE2TEUgPSBCUC5yZWFkVUludDE2TEVcbiAgYXJyLnJlYWRVSW50MTZCRSA9IEJQLnJlYWRVSW50MTZCRVxuICBhcnIucmVhZFVJbnQzMkxFID0gQlAucmVhZFVJbnQzMkxFXG4gIGFyci5yZWFkVUludDMyQkUgPSBCUC5yZWFkVUludDMyQkVcbiAgYXJyLnJlYWRJbnQ4ID0gQlAucmVhZEludDhcbiAgYXJyLnJlYWRJbnQxNkxFID0gQlAucmVhZEludDE2TEVcbiAgYXJyLnJlYWRJbnQxNkJFID0gQlAucmVhZEludDE2QkVcbiAgYXJyLnJlYWRJbnQzMkxFID0gQlAucmVhZEludDMyTEVcbiAgYXJyLnJlYWRJbnQzMkJFID0gQlAucmVhZEludDMyQkVcbiAgYXJyLnJlYWRGbG9hdExFID0gQlAucmVhZEZsb2F0TEVcbiAgYXJyLnJlYWRGbG9hdEJFID0gQlAucmVhZEZsb2F0QkVcbiAgYXJyLnJlYWREb3VibGVMRSA9IEJQLnJlYWREb3VibGVMRVxuICBhcnIucmVhZERvdWJsZUJFID0gQlAucmVhZERvdWJsZUJFXG4gIGFyci53cml0ZVVJbnQ4ID0gQlAud3JpdGVVSW50OFxuICBhcnIud3JpdGVVSW50MTZMRSA9IEJQLndyaXRlVUludDE2TEVcbiAgYXJyLndyaXRlVUludDE2QkUgPSBCUC53cml0ZVVJbnQxNkJFXG4gIGFyci53cml0ZVVJbnQzMkxFID0gQlAud3JpdGVVSW50MzJMRVxuICBhcnIud3JpdGVVSW50MzJCRSA9IEJQLndyaXRlVUludDMyQkVcbiAgYXJyLndyaXRlSW50OCA9IEJQLndyaXRlSW50OFxuICBhcnIud3JpdGVJbnQxNkxFID0gQlAud3JpdGVJbnQxNkxFXG4gIGFyci53cml0ZUludDE2QkUgPSBCUC53cml0ZUludDE2QkVcbiAgYXJyLndyaXRlSW50MzJMRSA9IEJQLndyaXRlSW50MzJMRVxuICBhcnIud3JpdGVJbnQzMkJFID0gQlAud3JpdGVJbnQzMkJFXG4gIGFyci53cml0ZUZsb2F0TEUgPSBCUC53cml0ZUZsb2F0TEVcbiAgYXJyLndyaXRlRmxvYXRCRSA9IEJQLndyaXRlRmxvYXRCRVxuICBhcnIud3JpdGVEb3VibGVMRSA9IEJQLndyaXRlRG91YmxlTEVcbiAgYXJyLndyaXRlRG91YmxlQkUgPSBCUC53cml0ZURvdWJsZUJFXG4gIGFyci5maWxsID0gQlAuZmlsbFxuICBhcnIuaW5zcGVjdCA9IEJQLmluc3BlY3RcbiAgYXJyLnRvQXJyYXlCdWZmZXIgPSBCUC50b0FycmF5QnVmZmVyXG5cbiAgcmV0dXJuIGFyclxufVxuXG4vLyBzbGljZShzdGFydCwgZW5kKVxuZnVuY3Rpb24gY2xhbXAgKGluZGV4LCBsZW4sIGRlZmF1bHRWYWx1ZSkge1xuICBpZiAodHlwZW9mIGluZGV4ICE9PSAnbnVtYmVyJykgcmV0dXJuIGRlZmF1bHRWYWx1ZVxuICBpbmRleCA9IH5+aW5kZXg7ICAvLyBDb2VyY2UgdG8gaW50ZWdlci5cbiAgaWYgKGluZGV4ID49IGxlbikgcmV0dXJuIGxlblxuICBpZiAoaW5kZXggPj0gMCkgcmV0dXJuIGluZGV4XG4gIGluZGV4ICs9IGxlblxuICBpZiAoaW5kZXggPj0gMCkgcmV0dXJuIGluZGV4XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGNvZXJjZSAobGVuZ3RoKSB7XG4gIC8vIENvZXJjZSBsZW5ndGggdG8gYSBudW1iZXIgKHBvc3NpYmx5IE5hTiksIHJvdW5kIHVwXG4gIC8vIGluIGNhc2UgaXQncyBmcmFjdGlvbmFsIChlLmcuIDEyMy40NTYpIHRoZW4gZG8gYVxuICAvLyBkb3VibGUgbmVnYXRlIHRvIGNvZXJjZSBhIE5hTiB0byAwLiBFYXN5LCByaWdodD9cbiAgbGVuZ3RoID0gfn5NYXRoLmNlaWwoK2xlbmd0aClcbiAgcmV0dXJuIGxlbmd0aCA8IDAgPyAwIDogbGVuZ3RoXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXkgKHN1YmplY3QpIHtcbiAgcmV0dXJuIChBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChzdWJqZWN0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzdWJqZWN0KSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xuICB9KShzdWJqZWN0KVxufVxuXG5mdW5jdGlvbiBpc0FycmF5aXNoIChzdWJqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5KHN1YmplY3QpIHx8IEJ1ZmZlci5pc0J1ZmZlcihzdWJqZWN0KSB8fFxuICAgICAgc3ViamVjdCAmJiB0eXBlb2Ygc3ViamVjdCA9PT0gJ29iamVjdCcgJiZcbiAgICAgIHR5cGVvZiBzdWJqZWN0Lmxlbmd0aCA9PT0gJ251bWJlcidcbn1cblxuZnVuY3Rpb24gdG9IZXggKG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpXG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KVxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIHZhciBiID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBpZiAoYiA8PSAweDdGKVxuICAgICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkpXG4gICAgZWxzZSB7XG4gICAgICB2YXIgc3RhcnQgPSBpXG4gICAgICBpZiAoYiA+PSAweEQ4MDAgJiYgYiA8PSAweERGRkYpIGkrK1xuICAgICAgdmFyIGggPSBlbmNvZGVVUklDb21wb25lbnQoc3RyLnNsaWNlKHN0YXJ0LCBpKzEpKS5zdWJzdHIoMSkuc3BsaXQoJyUnKVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBoLmxlbmd0aDsgaisrKVxuICAgICAgICBieXRlQXJyYXkucHVzaChwYXJzZUludChoW2pdLCAxNikpXG4gICAgfVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYXNjaWlUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gTm9kZSdzIGNvZGUgc2VlbXMgdG8gYmUgZG9pbmcgdGhpcyBhbmQgbm90ICYgMHg3Ri4uXG4gICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGhpID0gYyA+PiA4XG4gICAgbG8gPSBjICUgMjU2XG4gICAgYnl0ZUFycmF5LnB1c2gobG8pXG4gICAgYnl0ZUFycmF5LnB1c2goaGkpXG4gIH1cblxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFRvQnl0ZXMgKHN0cikge1xuICByZXR1cm4gYmFzZTY0LnRvQnl0ZUFycmF5KHN0cilcbn1cblxuZnVuY3Rpb24gYmxpdEJ1ZmZlciAoc3JjLCBkc3QsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBwb3NcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSlcbiAgICAgIGJyZWFrXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gZGVjb2RlVXRmOENoYXIgKHN0cikge1xuICB0cnkge1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoc3RyKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSgweEZGRkQpIC8vIFVURiA4IGludmFsaWQgY2hhclxuICB9XG59XG5cbi8qXG4gKiBXZSBoYXZlIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSB2YWx1ZSBpcyBhIHZhbGlkIGludGVnZXIuIFRoaXMgbWVhbnMgdGhhdCBpdFxuICogaXMgbm9uLW5lZ2F0aXZlLiBJdCBoYXMgbm8gZnJhY3Rpb25hbCBjb21wb25lbnQgYW5kIHRoYXQgaXQgZG9lcyBub3RcbiAqIGV4Y2VlZCB0aGUgbWF4aW11bSBhbGxvd2VkIHZhbHVlLlxuICovXG5mdW5jdGlvbiB2ZXJpZnVpbnQgKHZhbHVlLCBtYXgpIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlID49IDAsICdzcGVjaWZpZWQgYSBuZWdhdGl2ZSB2YWx1ZSBmb3Igd3JpdGluZyBhbiB1bnNpZ25lZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBpcyBsYXJnZXIgdGhhbiBtYXhpbXVtIHZhbHVlIGZvciB0eXBlJylcbiAgYXNzZXJ0KE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSwgJ3ZhbHVlIGhhcyBhIGZyYWN0aW9uYWwgY29tcG9uZW50Jylcbn1cblxuZnVuY3Rpb24gdmVyaWZzaW50ICh2YWx1ZSwgbWF4LCBtaW4pIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGxhcmdlciB0aGFuIG1heGltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA+PSBtaW4sICd2YWx1ZSBzbWFsbGVyIHRoYW4gbWluaW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSwgJ3ZhbHVlIGhhcyBhIGZyYWN0aW9uYWwgY29tcG9uZW50Jylcbn1cblxuZnVuY3Rpb24gdmVyaWZJRUVFNzU0ICh2YWx1ZSwgbWF4LCBtaW4pIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGxhcmdlciB0aGFuIG1heGltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA+PSBtaW4sICd2YWx1ZSBzbWFsbGVyIHRoYW4gbWluaW11bSBhbGxvd2VkIHZhbHVlJylcbn1cblxuZnVuY3Rpb24gYXNzZXJ0ICh0ZXN0LCBtZXNzYWdlKSB7XG4gIGlmICghdGVzdCkgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UgfHwgJ0ZhaWxlZCBhc3NlcnRpb24nKVxufVxuIiwidmFyIGxvb2t1cCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJztcblxuOyhmdW5jdGlvbiAoZXhwb3J0cykge1xuXHQndXNlIHN0cmljdCc7XG5cbiAgdmFyIEFyciA9ICh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgPyBVaW50OEFycmF5XG4gICAgOiBBcnJheVxuXG5cdHZhciBaRVJPICAgPSAnMCcuY2hhckNvZGVBdCgwKVxuXHR2YXIgUExVUyAgID0gJysnLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIICA9ICcvJy5jaGFyQ29kZUF0KDApXG5cdHZhciBOVU1CRVIgPSAnMCcuY2hhckNvZGVBdCgwKVxuXHR2YXIgTE9XRVIgID0gJ2EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFVQUEVSICA9ICdBJy5jaGFyQ29kZUF0KDApXG5cblx0ZnVuY3Rpb24gZGVjb2RlIChlbHQpIHtcblx0XHR2YXIgY29kZSA9IGVsdC5jaGFyQ29kZUF0KDApXG5cdFx0aWYgKGNvZGUgPT09IFBMVVMpXG5cdFx0XHRyZXR1cm4gNjIgLy8gJysnXG5cdFx0aWYgKGNvZGUgPT09IFNMQVNIKVxuXHRcdFx0cmV0dXJuIDYzIC8vICcvJ1xuXHRcdGlmIChjb2RlIDwgTlVNQkVSKVxuXHRcdFx0cmV0dXJuIC0xIC8vbm8gbWF0Y2hcblx0XHRpZiAoY29kZSA8IE5VTUJFUiArIDEwKVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBOVU1CRVIgKyAyNiArIDI2XG5cdFx0aWYgKGNvZGUgPCBVUFBFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBVUFBFUlxuXHRcdGlmIChjb2RlIDwgTE9XRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gTE9XRVIgKyAyNlxuXHR9XG5cblx0ZnVuY3Rpb24gYjY0VG9CeXRlQXJyYXkgKGI2NCkge1xuXHRcdHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyXG5cblx0XHRpZiAoYjY0Lmxlbmd0aCAlIDQgPiAwKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuXHRcdH1cblxuXHRcdC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuXHRcdC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuXHRcdC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xuXHRcdC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2Vcblx0XHR2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXHRcdHBsYWNlSG9sZGVycyA9ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAyKSA/IDIgOiAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMSkgPyAxIDogMFxuXG5cdFx0Ly8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG5cdFx0YXJyID0gbmV3IEFycihiNjQubGVuZ3RoICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXG5cblx0XHQvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG5cdFx0bCA9IHBsYWNlSG9sZGVycyA+IDAgPyBiNjQubGVuZ3RoIC0gNCA6IGI2NC5sZW5ndGhcblxuXHRcdHZhciBMID0gMFxuXG5cdFx0ZnVuY3Rpb24gcHVzaCAodikge1xuXHRcdFx0YXJyW0wrK10gPSB2XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxOCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCAxMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA8PCA2KSB8IGRlY29kZShiNjQuY2hhckF0KGkgKyAzKSlcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMDAwKSA+PiAxNilcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMCkgPj4gOClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPj4gNClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9IGVsc2UgaWYgKHBsYWNlSG9sZGVycyA9PT0gMSkge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxMCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCA0KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpID4+IDIpXG5cdFx0XHRwdXNoKCh0bXAgPj4gOCkgJiAweEZGKVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdHJldHVybiBhcnJcblx0fVxuXG5cdGZ1bmN0aW9uIHVpbnQ4VG9CYXNlNjQgKHVpbnQ4KSB7XG5cdFx0dmFyIGksXG5cdFx0XHRleHRyYUJ5dGVzID0gdWludDgubGVuZ3RoICUgMywgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcblx0XHRcdG91dHB1dCA9IFwiXCIsXG5cdFx0XHR0ZW1wLCBsZW5ndGhcblxuXHRcdGZ1bmN0aW9uIGVuY29kZSAobnVtKSB7XG5cdFx0XHRyZXR1cm4gbG9va3VwLmNoYXJBdChudW0pXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcblx0XHRcdHJldHVybiBlbmNvZGUobnVtID4+IDE4ICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDEyICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDYgJiAweDNGKSArIGVuY29kZShudW0gJiAweDNGKVxuXHRcdH1cblxuXHRcdC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcblx0XHRmb3IgKGkgPSAwLCBsZW5ndGggPSB1aW50OC5sZW5ndGggLSBleHRyYUJ5dGVzOyBpIDwgbGVuZ3RoOyBpICs9IDMpIHtcblx0XHRcdHRlbXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXG5cdFx0XHRvdXRwdXQgKz0gdHJpcGxldFRvQmFzZTY0KHRlbXApXG5cdFx0fVxuXG5cdFx0Ly8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuXHRcdHN3aXRjaCAoZXh0cmFCeXRlcykge1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHR0ZW1wID0gdWludDhbdWludDgubGVuZ3RoIC0gMV1cblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDIpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz09J1xuXHRcdFx0XHRicmVha1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR0ZW1wID0gKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDJdIDw8IDgpICsgKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMTApXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPj4gNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDIpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9J1xuXHRcdFx0XHRicmVha1xuXHRcdH1cblxuXHRcdHJldHVybiBvdXRwdXRcblx0fVxuXG5cdG1vZHVsZS5leHBvcnRzLnRvQnl0ZUFycmF5ID0gYjY0VG9CeXRlQXJyYXlcblx0bW9kdWxlLmV4cG9ydHMuZnJvbUJ5dGVBcnJheSA9IHVpbnQ4VG9CYXNlNjRcbn0oKSlcbiIsImV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sXG4gICAgICBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxLFxuICAgICAgZU1heCA9ICgxIDw8IGVMZW4pIC0gMSxcbiAgICAgIGVCaWFzID0gZU1heCA+PiAxLFxuICAgICAgbkJpdHMgPSAtNyxcbiAgICAgIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMCxcbiAgICAgIGQgPSBpc0xFID8gLTEgOiAxLFxuICAgICAgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXTtcblxuICBpICs9IGQ7XG5cbiAgZSA9IHMgJiAoKDEgPDwgKC1uQml0cykpIC0gMSk7XG4gIHMgPj49ICgtbkJpdHMpO1xuICBuQml0cyArPSBlTGVuO1xuICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gZSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KTtcblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKTtcbiAgZSA+Pj0gKC1uQml0cyk7XG4gIG5CaXRzICs9IG1MZW47XG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSBtICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpO1xuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhcztcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpO1xuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbik7XG4gICAgZSA9IGUgLSBlQmlhcztcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKTtcbn07XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbihidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgYyxcbiAgICAgIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDEsXG4gICAgICBlTWF4ID0gKDEgPDwgZUxlbikgLSAxLFxuICAgICAgZUJpYXMgPSBlTWF4ID4+IDEsXG4gICAgICBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMCksXG4gICAgICBpID0gaXNMRSA/IDAgOiAobkJ5dGVzIC0gMSksXG4gICAgICBkID0gaXNMRSA/IDEgOiAtMSxcbiAgICAgIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDA7XG5cbiAgdmFsdWUgPSBNYXRoLmFicyh2YWx1ZSk7XG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDA7XG4gICAgZSA9IGVNYXg7XG4gIH0gZWxzZSB7XG4gICAgZSA9IE1hdGguZmxvb3IoTWF0aC5sb2codmFsdWUpIC8gTWF0aC5MTjIpO1xuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLTtcbiAgICAgIGMgKj0gMjtcbiAgICB9XG4gICAgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICB2YWx1ZSArPSBydCAvIGM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKTtcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKys7XG4gICAgICBjIC89IDI7XG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMDtcbiAgICAgIGUgPSBlTWF4O1xuICAgIH0gZWxzZSBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIG0gPSAodmFsdWUgKiBjIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKTtcbiAgICAgIGUgPSBlICsgZUJpYXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKTtcbiAgICAgIGUgPSAwO1xuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpO1xuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG07XG4gIGVMZW4gKz0gbUxlbjtcbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KTtcblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjg7XG59O1xuIiwidmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcbnZhciBpbnRTaXplID0gNDtcbnZhciB6ZXJvQnVmZmVyID0gbmV3IEJ1ZmZlcihpbnRTaXplKTsgemVyb0J1ZmZlci5maWxsKDApO1xudmFyIGNocnN6ID0gODtcblxuZnVuY3Rpb24gdG9BcnJheShidWYsIGJpZ0VuZGlhbikge1xuICBpZiAoKGJ1Zi5sZW5ndGggJSBpbnRTaXplKSAhPT0gMCkge1xuICAgIHZhciBsZW4gPSBidWYubGVuZ3RoICsgKGludFNpemUgLSAoYnVmLmxlbmd0aCAlIGludFNpemUpKTtcbiAgICBidWYgPSBCdWZmZXIuY29uY2F0KFtidWYsIHplcm9CdWZmZXJdLCBsZW4pO1xuICB9XG5cbiAgdmFyIGFyciA9IFtdO1xuICB2YXIgZm4gPSBiaWdFbmRpYW4gPyBidWYucmVhZEludDMyQkUgOiBidWYucmVhZEludDMyTEU7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnVmLmxlbmd0aDsgaSArPSBpbnRTaXplKSB7XG4gICAgYXJyLnB1c2goZm4uY2FsbChidWYsIGkpKTtcbiAgfVxuICByZXR1cm4gYXJyO1xufVxuXG5mdW5jdGlvbiB0b0J1ZmZlcihhcnIsIHNpemUsIGJpZ0VuZGlhbikge1xuICB2YXIgYnVmID0gbmV3IEJ1ZmZlcihzaXplKTtcbiAgdmFyIGZuID0gYmlnRW5kaWFuID8gYnVmLndyaXRlSW50MzJCRSA6IGJ1Zi53cml0ZUludDMyTEU7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgZm4uY2FsbChidWYsIGFycltpXSwgaSAqIDQsIHRydWUpO1xuICB9XG4gIHJldHVybiBidWY7XG59XG5cbmZ1bmN0aW9uIGhhc2goYnVmLCBmbiwgaGFzaFNpemUsIGJpZ0VuZGlhbikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSBidWYgPSBuZXcgQnVmZmVyKGJ1Zik7XG4gIHZhciBhcnIgPSBmbih0b0FycmF5KGJ1ZiwgYmlnRW5kaWFuKSwgYnVmLmxlbmd0aCAqIGNocnN6KTtcbiAgcmV0dXJuIHRvQnVmZmVyKGFyciwgaGFzaFNpemUsIGJpZ0VuZGlhbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBoYXNoOiBoYXNoIH07XG4iLCJ2YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyXG52YXIgc2hhID0gcmVxdWlyZSgnLi9zaGEnKVxudmFyIHNoYTI1NiA9IHJlcXVpcmUoJy4vc2hhMjU2JylcbnZhciBybmcgPSByZXF1aXJlKCcuL3JuZycpXG52YXIgbWQ1ID0gcmVxdWlyZSgnLi9tZDUnKVxuXG52YXIgYWxnb3JpdGhtcyA9IHtcbiAgc2hhMTogc2hhLFxuICBzaGEyNTY6IHNoYTI1NixcbiAgbWQ1OiBtZDVcbn1cblxudmFyIGJsb2Nrc2l6ZSA9IDY0XG52YXIgemVyb0J1ZmZlciA9IG5ldyBCdWZmZXIoYmxvY2tzaXplKTsgemVyb0J1ZmZlci5maWxsKDApXG5mdW5jdGlvbiBobWFjKGZuLCBrZXksIGRhdGEpIHtcbiAgaWYoIUJ1ZmZlci5pc0J1ZmZlcihrZXkpKSBrZXkgPSBuZXcgQnVmZmVyKGtleSlcbiAgaWYoIUJ1ZmZlci5pc0J1ZmZlcihkYXRhKSkgZGF0YSA9IG5ldyBCdWZmZXIoZGF0YSlcblxuICBpZihrZXkubGVuZ3RoID4gYmxvY2tzaXplKSB7XG4gICAga2V5ID0gZm4oa2V5KVxuICB9IGVsc2UgaWYoa2V5Lmxlbmd0aCA8IGJsb2Nrc2l6ZSkge1xuICAgIGtleSA9IEJ1ZmZlci5jb25jYXQoW2tleSwgemVyb0J1ZmZlcl0sIGJsb2Nrc2l6ZSlcbiAgfVxuXG4gIHZhciBpcGFkID0gbmV3IEJ1ZmZlcihibG9ja3NpemUpLCBvcGFkID0gbmV3IEJ1ZmZlcihibG9ja3NpemUpXG4gIGZvcih2YXIgaSA9IDA7IGkgPCBibG9ja3NpemU7IGkrKykge1xuICAgIGlwYWRbaV0gPSBrZXlbaV0gXiAweDM2XG4gICAgb3BhZFtpXSA9IGtleVtpXSBeIDB4NUNcbiAgfVxuXG4gIHZhciBoYXNoID0gZm4oQnVmZmVyLmNvbmNhdChbaXBhZCwgZGF0YV0pKVxuICByZXR1cm4gZm4oQnVmZmVyLmNvbmNhdChbb3BhZCwgaGFzaF0pKVxufVxuXG5mdW5jdGlvbiBoYXNoKGFsZywga2V5KSB7XG4gIGFsZyA9IGFsZyB8fCAnc2hhMSdcbiAgdmFyIGZuID0gYWxnb3JpdGhtc1thbGddXG4gIHZhciBidWZzID0gW11cbiAgdmFyIGxlbmd0aCA9IDBcbiAgaWYoIWZuKSBlcnJvcignYWxnb3JpdGhtOicsIGFsZywgJ2lzIG5vdCB5ZXQgc3VwcG9ydGVkJylcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICBpZighQnVmZmVyLmlzQnVmZmVyKGRhdGEpKSBkYXRhID0gbmV3IEJ1ZmZlcihkYXRhKVxuICAgICAgICBcbiAgICAgIGJ1ZnMucHVzaChkYXRhKVxuICAgICAgbGVuZ3RoICs9IGRhdGEubGVuZ3RoXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG4gICAgZGlnZXN0OiBmdW5jdGlvbiAoZW5jKSB7XG4gICAgICB2YXIgYnVmID0gQnVmZmVyLmNvbmNhdChidWZzKVxuICAgICAgdmFyIHIgPSBrZXkgPyBobWFjKGZuLCBrZXksIGJ1ZikgOiBmbihidWYpXG4gICAgICBidWZzID0gbnVsbFxuICAgICAgcmV0dXJuIGVuYyA/IHIudG9TdHJpbmcoZW5jKSA6IHJcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZXJyb3IgKCkge1xuICB2YXIgbSA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5qb2luKCcgJylcbiAgdGhyb3cgbmV3IEVycm9yKFtcbiAgICBtLFxuICAgICd3ZSBhY2NlcHQgcHVsbCByZXF1ZXN0cycsXG4gICAgJ2h0dHA6Ly9naXRodWIuY29tL2RvbWluaWN0YXJyL2NyeXB0by1icm93c2VyaWZ5J1xuICAgIF0uam9pbignXFxuJykpXG59XG5cbmV4cG9ydHMuY3JlYXRlSGFzaCA9IGZ1bmN0aW9uIChhbGcpIHsgcmV0dXJuIGhhc2goYWxnKSB9XG5leHBvcnRzLmNyZWF0ZUhtYWMgPSBmdW5jdGlvbiAoYWxnLCBrZXkpIHsgcmV0dXJuIGhhc2goYWxnLCBrZXkpIH1cbmV4cG9ydHMucmFuZG9tQnl0ZXMgPSBmdW5jdGlvbihzaXplLCBjYWxsYmFjaykge1xuICBpZiAoY2FsbGJhY2sgJiYgY2FsbGJhY2suY2FsbCkge1xuICAgIHRyeSB7XG4gICAgICBjYWxsYmFjay5jYWxsKHRoaXMsIHVuZGVmaW5lZCwgbmV3IEJ1ZmZlcihybmcoc2l6ZSkpKVxuICAgIH0gY2F0Y2ggKGVycikgeyBjYWxsYmFjayhlcnIpIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcihybmcoc2l6ZSkpXG4gIH1cbn1cblxuZnVuY3Rpb24gZWFjaChhLCBmKSB7XG4gIGZvcih2YXIgaSBpbiBhKVxuICAgIGYoYVtpXSwgaSlcbn1cblxuLy8gdGhlIGxlYXN0IEkgY2FuIGRvIGlzIG1ha2UgZXJyb3IgbWVzc2FnZXMgZm9yIHRoZSByZXN0IG9mIHRoZSBub2RlLmpzL2NyeXB0byBhcGkuXG5lYWNoKFsnY3JlYXRlQ3JlZGVudGlhbHMnXG4sICdjcmVhdGVDaXBoZXInXG4sICdjcmVhdGVDaXBoZXJpdidcbiwgJ2NyZWF0ZURlY2lwaGVyJ1xuLCAnY3JlYXRlRGVjaXBoZXJpdidcbiwgJ2NyZWF0ZVNpZ24nXG4sICdjcmVhdGVWZXJpZnknXG4sICdjcmVhdGVEaWZmaWVIZWxsbWFuJ1xuLCAncGJrZGYyJ10sIGZ1bmN0aW9uIChuYW1lKSB7XG4gIGV4cG9ydHNbbmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgZXJyb3IoJ3NvcnJ5LCcsIG5hbWUsICdpcyBub3QgaW1wbGVtZW50ZWQgeWV0JylcbiAgfVxufSlcbiIsIi8qXHJcbiAqIEEgSmF2YVNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgUlNBIERhdGEgU2VjdXJpdHksIEluYy4gTUQ1IE1lc3NhZ2VcclxuICogRGlnZXN0IEFsZ29yaXRobSwgYXMgZGVmaW5lZCBpbiBSRkMgMTMyMS5cclxuICogVmVyc2lvbiAyLjEgQ29weXJpZ2h0IChDKSBQYXVsIEpvaG5zdG9uIDE5OTkgLSAyMDAyLlxyXG4gKiBPdGhlciBjb250cmlidXRvcnM6IEdyZWcgSG9sdCwgQW5kcmV3IEtlcGVydCwgWWRuYXIsIExvc3RpbmV0XHJcbiAqIERpc3RyaWJ1dGVkIHVuZGVyIHRoZSBCU0QgTGljZW5zZVxyXG4gKiBTZWUgaHR0cDovL3BhamhvbWUub3JnLnVrL2NyeXB0L21kNSBmb3IgbW9yZSBpbmZvLlxyXG4gKi9cclxuXHJcbnZhciBoZWxwZXJzID0gcmVxdWlyZSgnLi9oZWxwZXJzJyk7XHJcblxyXG4vKlxyXG4gKiBQZXJmb3JtIGEgc2ltcGxlIHNlbGYtdGVzdCB0byBzZWUgaWYgdGhlIFZNIGlzIHdvcmtpbmdcclxuICovXHJcbmZ1bmN0aW9uIG1kNV92bV90ZXN0KClcclxue1xyXG4gIHJldHVybiBoZXhfbWQ1KFwiYWJjXCIpID09IFwiOTAwMTUwOTgzY2QyNGZiMGQ2OTYzZjdkMjhlMTdmNzJcIjtcclxufVxyXG5cclxuLypcclxuICogQ2FsY3VsYXRlIHRoZSBNRDUgb2YgYW4gYXJyYXkgb2YgbGl0dGxlLWVuZGlhbiB3b3JkcywgYW5kIGEgYml0IGxlbmd0aFxyXG4gKi9cclxuZnVuY3Rpb24gY29yZV9tZDUoeCwgbGVuKVxyXG57XHJcbiAgLyogYXBwZW5kIHBhZGRpbmcgKi9cclxuICB4W2xlbiA+PiA1XSB8PSAweDgwIDw8ICgobGVuKSAlIDMyKTtcclxuICB4WygoKGxlbiArIDY0KSA+Pj4gOSkgPDwgNCkgKyAxNF0gPSBsZW47XHJcblxyXG4gIHZhciBhID0gIDE3MzI1ODQxOTM7XHJcbiAgdmFyIGIgPSAtMjcxNzMzODc5O1xyXG4gIHZhciBjID0gLTE3MzI1ODQxOTQ7XHJcbiAgdmFyIGQgPSAgMjcxNzMzODc4O1xyXG5cclxuICBmb3IodmFyIGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkgKz0gMTYpXHJcbiAge1xyXG4gICAgdmFyIG9sZGEgPSBhO1xyXG4gICAgdmFyIG9sZGIgPSBiO1xyXG4gICAgdmFyIG9sZGMgPSBjO1xyXG4gICAgdmFyIG9sZGQgPSBkO1xyXG5cclxuICAgIGEgPSBtZDVfZmYoYSwgYiwgYywgZCwgeFtpKyAwXSwgNyAsIC02ODA4NzY5MzYpO1xyXG4gICAgZCA9IG1kNV9mZihkLCBhLCBiLCBjLCB4W2krIDFdLCAxMiwgLTM4OTU2NDU4Nik7XHJcbiAgICBjID0gbWQ1X2ZmKGMsIGQsIGEsIGIsIHhbaSsgMl0sIDE3LCAgNjA2MTA1ODE5KTtcclxuICAgIGIgPSBtZDVfZmYoYiwgYywgZCwgYSwgeFtpKyAzXSwgMjIsIC0xMDQ0NTI1MzMwKTtcclxuICAgIGEgPSBtZDVfZmYoYSwgYiwgYywgZCwgeFtpKyA0XSwgNyAsIC0xNzY0MTg4OTcpO1xyXG4gICAgZCA9IG1kNV9mZihkLCBhLCBiLCBjLCB4W2krIDVdLCAxMiwgIDEyMDAwODA0MjYpO1xyXG4gICAgYyA9IG1kNV9mZihjLCBkLCBhLCBiLCB4W2krIDZdLCAxNywgLTE0NzMyMzEzNDEpO1xyXG4gICAgYiA9IG1kNV9mZihiLCBjLCBkLCBhLCB4W2krIDddLCAyMiwgLTQ1NzA1OTgzKTtcclxuICAgIGEgPSBtZDVfZmYoYSwgYiwgYywgZCwgeFtpKyA4XSwgNyAsICAxNzcwMDM1NDE2KTtcclxuICAgIGQgPSBtZDVfZmYoZCwgYSwgYiwgYywgeFtpKyA5XSwgMTIsIC0xOTU4NDE0NDE3KTtcclxuICAgIGMgPSBtZDVfZmYoYywgZCwgYSwgYiwgeFtpKzEwXSwgMTcsIC00MjA2Myk7XHJcbiAgICBiID0gbWQ1X2ZmKGIsIGMsIGQsIGEsIHhbaSsxMV0sIDIyLCAtMTk5MDQwNDE2Mik7XHJcbiAgICBhID0gbWQ1X2ZmKGEsIGIsIGMsIGQsIHhbaSsxMl0sIDcgLCAgMTgwNDYwMzY4Mik7XHJcbiAgICBkID0gbWQ1X2ZmKGQsIGEsIGIsIGMsIHhbaSsxM10sIDEyLCAtNDAzNDExMDEpO1xyXG4gICAgYyA9IG1kNV9mZihjLCBkLCBhLCBiLCB4W2krMTRdLCAxNywgLTE1MDIwMDIyOTApO1xyXG4gICAgYiA9IG1kNV9mZihiLCBjLCBkLCBhLCB4W2krMTVdLCAyMiwgIDEyMzY1MzUzMjkpO1xyXG5cclxuICAgIGEgPSBtZDVfZ2coYSwgYiwgYywgZCwgeFtpKyAxXSwgNSAsIC0xNjU3OTY1MTApO1xyXG4gICAgZCA9IG1kNV9nZyhkLCBhLCBiLCBjLCB4W2krIDZdLCA5ICwgLTEwNjk1MDE2MzIpO1xyXG4gICAgYyA9IG1kNV9nZyhjLCBkLCBhLCBiLCB4W2krMTFdLCAxNCwgIDY0MzcxNzcxMyk7XHJcbiAgICBiID0gbWQ1X2dnKGIsIGMsIGQsIGEsIHhbaSsgMF0sIDIwLCAtMzczODk3MzAyKTtcclxuICAgIGEgPSBtZDVfZ2coYSwgYiwgYywgZCwgeFtpKyA1XSwgNSAsIC03MDE1NTg2OTEpO1xyXG4gICAgZCA9IG1kNV9nZyhkLCBhLCBiLCBjLCB4W2krMTBdLCA5ICwgIDM4MDE2MDgzKTtcclxuICAgIGMgPSBtZDVfZ2coYywgZCwgYSwgYiwgeFtpKzE1XSwgMTQsIC02NjA0NzgzMzUpO1xyXG4gICAgYiA9IG1kNV9nZyhiLCBjLCBkLCBhLCB4W2krIDRdLCAyMCwgLTQwNTUzNzg0OCk7XHJcbiAgICBhID0gbWQ1X2dnKGEsIGIsIGMsIGQsIHhbaSsgOV0sIDUgLCAgNTY4NDQ2NDM4KTtcclxuICAgIGQgPSBtZDVfZ2coZCwgYSwgYiwgYywgeFtpKzE0XSwgOSAsIC0xMDE5ODAzNjkwKTtcclxuICAgIGMgPSBtZDVfZ2coYywgZCwgYSwgYiwgeFtpKyAzXSwgMTQsIC0xODczNjM5NjEpO1xyXG4gICAgYiA9IG1kNV9nZyhiLCBjLCBkLCBhLCB4W2krIDhdLCAyMCwgIDExNjM1MzE1MDEpO1xyXG4gICAgYSA9IG1kNV9nZyhhLCBiLCBjLCBkLCB4W2krMTNdLCA1ICwgLTE0NDQ2ODE0NjcpO1xyXG4gICAgZCA9IG1kNV9nZyhkLCBhLCBiLCBjLCB4W2krIDJdLCA5ICwgLTUxNDAzNzg0KTtcclxuICAgIGMgPSBtZDVfZ2coYywgZCwgYSwgYiwgeFtpKyA3XSwgMTQsICAxNzM1MzI4NDczKTtcclxuICAgIGIgPSBtZDVfZ2coYiwgYywgZCwgYSwgeFtpKzEyXSwgMjAsIC0xOTI2NjA3NzM0KTtcclxuXHJcbiAgICBhID0gbWQ1X2hoKGEsIGIsIGMsIGQsIHhbaSsgNV0sIDQgLCAtMzc4NTU4KTtcclxuICAgIGQgPSBtZDVfaGgoZCwgYSwgYiwgYywgeFtpKyA4XSwgMTEsIC0yMDIyNTc0NDYzKTtcclxuICAgIGMgPSBtZDVfaGgoYywgZCwgYSwgYiwgeFtpKzExXSwgMTYsICAxODM5MDMwNTYyKTtcclxuICAgIGIgPSBtZDVfaGgoYiwgYywgZCwgYSwgeFtpKzE0XSwgMjMsIC0zNTMwOTU1Nik7XHJcbiAgICBhID0gbWQ1X2hoKGEsIGIsIGMsIGQsIHhbaSsgMV0sIDQgLCAtMTUzMDk5MjA2MCk7XHJcbiAgICBkID0gbWQ1X2hoKGQsIGEsIGIsIGMsIHhbaSsgNF0sIDExLCAgMTI3Mjg5MzM1Myk7XHJcbiAgICBjID0gbWQ1X2hoKGMsIGQsIGEsIGIsIHhbaSsgN10sIDE2LCAtMTU1NDk3NjMyKTtcclxuICAgIGIgPSBtZDVfaGgoYiwgYywgZCwgYSwgeFtpKzEwXSwgMjMsIC0xMDk0NzMwNjQwKTtcclxuICAgIGEgPSBtZDVfaGgoYSwgYiwgYywgZCwgeFtpKzEzXSwgNCAsICA2ODEyNzkxNzQpO1xyXG4gICAgZCA9IG1kNV9oaChkLCBhLCBiLCBjLCB4W2krIDBdLCAxMSwgLTM1ODUzNzIyMik7XHJcbiAgICBjID0gbWQ1X2hoKGMsIGQsIGEsIGIsIHhbaSsgM10sIDE2LCAtNzIyNTIxOTc5KTtcclxuICAgIGIgPSBtZDVfaGgoYiwgYywgZCwgYSwgeFtpKyA2XSwgMjMsICA3NjAyOTE4OSk7XHJcbiAgICBhID0gbWQ1X2hoKGEsIGIsIGMsIGQsIHhbaSsgOV0sIDQgLCAtNjQwMzY0NDg3KTtcclxuICAgIGQgPSBtZDVfaGgoZCwgYSwgYiwgYywgeFtpKzEyXSwgMTEsIC00MjE4MTU4MzUpO1xyXG4gICAgYyA9IG1kNV9oaChjLCBkLCBhLCBiLCB4W2krMTVdLCAxNiwgIDUzMDc0MjUyMCk7XHJcbiAgICBiID0gbWQ1X2hoKGIsIGMsIGQsIGEsIHhbaSsgMl0sIDIzLCAtOTk1MzM4NjUxKTtcclxuXHJcbiAgICBhID0gbWQ1X2lpKGEsIGIsIGMsIGQsIHhbaSsgMF0sIDYgLCAtMTk4NjMwODQ0KTtcclxuICAgIGQgPSBtZDVfaWkoZCwgYSwgYiwgYywgeFtpKyA3XSwgMTAsICAxMTI2ODkxNDE1KTtcclxuICAgIGMgPSBtZDVfaWkoYywgZCwgYSwgYiwgeFtpKzE0XSwgMTUsIC0xNDE2MzU0OTA1KTtcclxuICAgIGIgPSBtZDVfaWkoYiwgYywgZCwgYSwgeFtpKyA1XSwgMjEsIC01NzQzNDA1NSk7XHJcbiAgICBhID0gbWQ1X2lpKGEsIGIsIGMsIGQsIHhbaSsxMl0sIDYgLCAgMTcwMDQ4NTU3MSk7XHJcbiAgICBkID0gbWQ1X2lpKGQsIGEsIGIsIGMsIHhbaSsgM10sIDEwLCAtMTg5NDk4NjYwNik7XHJcbiAgICBjID0gbWQ1X2lpKGMsIGQsIGEsIGIsIHhbaSsxMF0sIDE1LCAtMTA1MTUyMyk7XHJcbiAgICBiID0gbWQ1X2lpKGIsIGMsIGQsIGEsIHhbaSsgMV0sIDIxLCAtMjA1NDkyMjc5OSk7XHJcbiAgICBhID0gbWQ1X2lpKGEsIGIsIGMsIGQsIHhbaSsgOF0sIDYgLCAgMTg3MzMxMzM1OSk7XHJcbiAgICBkID0gbWQ1X2lpKGQsIGEsIGIsIGMsIHhbaSsxNV0sIDEwLCAtMzA2MTE3NDQpO1xyXG4gICAgYyA9IG1kNV9paShjLCBkLCBhLCBiLCB4W2krIDZdLCAxNSwgLTE1NjAxOTgzODApO1xyXG4gICAgYiA9IG1kNV9paShiLCBjLCBkLCBhLCB4W2krMTNdLCAyMSwgIDEzMDkxNTE2NDkpO1xyXG4gICAgYSA9IG1kNV9paShhLCBiLCBjLCBkLCB4W2krIDRdLCA2ICwgLTE0NTUyMzA3MCk7XHJcbiAgICBkID0gbWQ1X2lpKGQsIGEsIGIsIGMsIHhbaSsxMV0sIDEwLCAtMTEyMDIxMDM3OSk7XHJcbiAgICBjID0gbWQ1X2lpKGMsIGQsIGEsIGIsIHhbaSsgMl0sIDE1LCAgNzE4Nzg3MjU5KTtcclxuICAgIGIgPSBtZDVfaWkoYiwgYywgZCwgYSwgeFtpKyA5XSwgMjEsIC0zNDM0ODU1NTEpO1xyXG5cclxuICAgIGEgPSBzYWZlX2FkZChhLCBvbGRhKTtcclxuICAgIGIgPSBzYWZlX2FkZChiLCBvbGRiKTtcclxuICAgIGMgPSBzYWZlX2FkZChjLCBvbGRjKTtcclxuICAgIGQgPSBzYWZlX2FkZChkLCBvbGRkKTtcclxuICB9XHJcbiAgcmV0dXJuIEFycmF5KGEsIGIsIGMsIGQpO1xyXG5cclxufVxyXG5cclxuLypcclxuICogVGhlc2UgZnVuY3Rpb25zIGltcGxlbWVudCB0aGUgZm91ciBiYXNpYyBvcGVyYXRpb25zIHRoZSBhbGdvcml0aG0gdXNlcy5cclxuICovXHJcbmZ1bmN0aW9uIG1kNV9jbW4ocSwgYSwgYiwgeCwgcywgdClcclxue1xyXG4gIHJldHVybiBzYWZlX2FkZChiaXRfcm9sKHNhZmVfYWRkKHNhZmVfYWRkKGEsIHEpLCBzYWZlX2FkZCh4LCB0KSksIHMpLGIpO1xyXG59XHJcbmZ1bmN0aW9uIG1kNV9mZihhLCBiLCBjLCBkLCB4LCBzLCB0KVxyXG57XHJcbiAgcmV0dXJuIG1kNV9jbW4oKGIgJiBjKSB8ICgofmIpICYgZCksIGEsIGIsIHgsIHMsIHQpO1xyXG59XHJcbmZ1bmN0aW9uIG1kNV9nZyhhLCBiLCBjLCBkLCB4LCBzLCB0KVxyXG57XHJcbiAgcmV0dXJuIG1kNV9jbW4oKGIgJiBkKSB8IChjICYgKH5kKSksIGEsIGIsIHgsIHMsIHQpO1xyXG59XHJcbmZ1bmN0aW9uIG1kNV9oaChhLCBiLCBjLCBkLCB4LCBzLCB0KVxyXG57XHJcbiAgcmV0dXJuIG1kNV9jbW4oYiBeIGMgXiBkLCBhLCBiLCB4LCBzLCB0KTtcclxufVxyXG5mdW5jdGlvbiBtZDVfaWkoYSwgYiwgYywgZCwgeCwgcywgdClcclxue1xyXG4gIHJldHVybiBtZDVfY21uKGMgXiAoYiB8ICh+ZCkpLCBhLCBiLCB4LCBzLCB0KTtcclxufVxyXG5cclxuLypcclxuICogQWRkIGludGVnZXJzLCB3cmFwcGluZyBhdCAyXjMyLiBUaGlzIHVzZXMgMTYtYml0IG9wZXJhdGlvbnMgaW50ZXJuYWxseVxyXG4gKiB0byB3b3JrIGFyb3VuZCBidWdzIGluIHNvbWUgSlMgaW50ZXJwcmV0ZXJzLlxyXG4gKi9cclxuZnVuY3Rpb24gc2FmZV9hZGQoeCwgeSlcclxue1xyXG4gIHZhciBsc3cgPSAoeCAmIDB4RkZGRikgKyAoeSAmIDB4RkZGRik7XHJcbiAgdmFyIG1zdyA9ICh4ID4+IDE2KSArICh5ID4+IDE2KSArIChsc3cgPj4gMTYpO1xyXG4gIHJldHVybiAobXN3IDw8IDE2KSB8IChsc3cgJiAweEZGRkYpO1xyXG59XHJcblxyXG4vKlxyXG4gKiBCaXR3aXNlIHJvdGF0ZSBhIDMyLWJpdCBudW1iZXIgdG8gdGhlIGxlZnQuXHJcbiAqL1xyXG5mdW5jdGlvbiBiaXRfcm9sKG51bSwgY250KVxyXG57XHJcbiAgcmV0dXJuIChudW0gPDwgY250KSB8IChudW0gPj4+ICgzMiAtIGNudCkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1kNShidWYpIHtcclxuICByZXR1cm4gaGVscGVycy5oYXNoKGJ1ZiwgY29yZV9tZDUsIDE2KTtcclxufTtcclxuIiwiLy8gT3JpZ2luYWwgY29kZSBhZGFwdGVkIGZyb20gUm9iZXJ0IEtpZWZmZXIuXG4vLyBkZXRhaWxzIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9icm9vZmEvbm9kZS11dWlkXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBfZ2xvYmFsID0gdGhpcztcblxuICB2YXIgbWF0aFJORywgd2hhdHdnUk5HO1xuXG4gIC8vIE5PVEU6IE1hdGgucmFuZG9tKCkgZG9lcyBub3QgZ3VhcmFudGVlIFwiY3J5cHRvZ3JhcGhpYyBxdWFsaXR5XCJcbiAgbWF0aFJORyA9IGZ1bmN0aW9uKHNpemUpIHtcbiAgICB2YXIgYnl0ZXMgPSBuZXcgQXJyYXkoc2l6ZSk7XG4gICAgdmFyIHI7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgcjsgaSA8IHNpemU7IGkrKykge1xuICAgICAgaWYgKChpICYgMHgwMykgPT0gMCkgciA9IE1hdGgucmFuZG9tKCkgKiAweDEwMDAwMDAwMDtcbiAgICAgIGJ5dGVzW2ldID0gciA+Pj4gKChpICYgMHgwMykgPDwgMykgJiAweGZmO1xuICAgIH1cblxuICAgIHJldHVybiBieXRlcztcbiAgfVxuXG4gIGlmIChfZ2xvYmFsLmNyeXB0byAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgd2hhdHdnUk5HID0gZnVuY3Rpb24oc2l6ZSkge1xuICAgICAgdmFyIGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoc2l6ZSk7XG4gICAgICBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGJ5dGVzKTtcbiAgICAgIHJldHVybiBieXRlcztcbiAgICB9XG4gIH1cblxuICBtb2R1bGUuZXhwb3J0cyA9IHdoYXR3Z1JORyB8fCBtYXRoUk5HO1xuXG59KCkpXG4iLCIvKlxuICogQSBKYXZhU2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHRoZSBTZWN1cmUgSGFzaCBBbGdvcml0aG0sIFNIQS0xLCBhcyBkZWZpbmVkXG4gKiBpbiBGSVBTIFBVQiAxODAtMVxuICogVmVyc2lvbiAyLjFhIENvcHlyaWdodCBQYXVsIEpvaG5zdG9uIDIwMDAgLSAyMDAyLlxuICogT3RoZXIgY29udHJpYnV0b3JzOiBHcmVnIEhvbHQsIEFuZHJldyBLZXBlcnQsIFlkbmFyLCBMb3N0aW5ldFxuICogRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIEJTRCBMaWNlbnNlXG4gKiBTZWUgaHR0cDovL3BhamhvbWUub3JnLnVrL2NyeXB0L21kNSBmb3IgZGV0YWlscy5cbiAqL1xuXG52YXIgaGVscGVycyA9IHJlcXVpcmUoJy4vaGVscGVycycpO1xuXG4vKlxuICogQ2FsY3VsYXRlIHRoZSBTSEEtMSBvZiBhbiBhcnJheSBvZiBiaWctZW5kaWFuIHdvcmRzLCBhbmQgYSBiaXQgbGVuZ3RoXG4gKi9cbmZ1bmN0aW9uIGNvcmVfc2hhMSh4LCBsZW4pXG57XG4gIC8qIGFwcGVuZCBwYWRkaW5nICovXG4gIHhbbGVuID4+IDVdIHw9IDB4ODAgPDwgKDI0IC0gbGVuICUgMzIpO1xuICB4WygobGVuICsgNjQgPj4gOSkgPDwgNCkgKyAxNV0gPSBsZW47XG5cbiAgdmFyIHcgPSBBcnJheSg4MCk7XG4gIHZhciBhID0gIDE3MzI1ODQxOTM7XG4gIHZhciBiID0gLTI3MTczMzg3OTtcbiAgdmFyIGMgPSAtMTczMjU4NDE5NDtcbiAgdmFyIGQgPSAgMjcxNzMzODc4O1xuICB2YXIgZSA9IC0xMDA5NTg5Nzc2O1xuXG4gIGZvcih2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSArPSAxNilcbiAge1xuICAgIHZhciBvbGRhID0gYTtcbiAgICB2YXIgb2xkYiA9IGI7XG4gICAgdmFyIG9sZGMgPSBjO1xuICAgIHZhciBvbGRkID0gZDtcbiAgICB2YXIgb2xkZSA9IGU7XG5cbiAgICBmb3IodmFyIGogPSAwOyBqIDwgODA7IGorKylcbiAgICB7XG4gICAgICBpZihqIDwgMTYpIHdbal0gPSB4W2kgKyBqXTtcbiAgICAgIGVsc2Ugd1tqXSA9IHJvbCh3W2otM10gXiB3W2otOF0gXiB3W2otMTRdIF4gd1tqLTE2XSwgMSk7XG4gICAgICB2YXIgdCA9IHNhZmVfYWRkKHNhZmVfYWRkKHJvbChhLCA1KSwgc2hhMV9mdChqLCBiLCBjLCBkKSksXG4gICAgICAgICAgICAgICAgICAgICAgIHNhZmVfYWRkKHNhZmVfYWRkKGUsIHdbal0pLCBzaGExX2t0KGopKSk7XG4gICAgICBlID0gZDtcbiAgICAgIGQgPSBjO1xuICAgICAgYyA9IHJvbChiLCAzMCk7XG4gICAgICBiID0gYTtcbiAgICAgIGEgPSB0O1xuICAgIH1cblxuICAgIGEgPSBzYWZlX2FkZChhLCBvbGRhKTtcbiAgICBiID0gc2FmZV9hZGQoYiwgb2xkYik7XG4gICAgYyA9IHNhZmVfYWRkKGMsIG9sZGMpO1xuICAgIGQgPSBzYWZlX2FkZChkLCBvbGRkKTtcbiAgICBlID0gc2FmZV9hZGQoZSwgb2xkZSk7XG4gIH1cbiAgcmV0dXJuIEFycmF5KGEsIGIsIGMsIGQsIGUpO1xuXG59XG5cbi8qXG4gKiBQZXJmb3JtIHRoZSBhcHByb3ByaWF0ZSB0cmlwbGV0IGNvbWJpbmF0aW9uIGZ1bmN0aW9uIGZvciB0aGUgY3VycmVudFxuICogaXRlcmF0aW9uXG4gKi9cbmZ1bmN0aW9uIHNoYTFfZnQodCwgYiwgYywgZClcbntcbiAgaWYodCA8IDIwKSByZXR1cm4gKGIgJiBjKSB8ICgofmIpICYgZCk7XG4gIGlmKHQgPCA0MCkgcmV0dXJuIGIgXiBjIF4gZDtcbiAgaWYodCA8IDYwKSByZXR1cm4gKGIgJiBjKSB8IChiICYgZCkgfCAoYyAmIGQpO1xuICByZXR1cm4gYiBeIGMgXiBkO1xufVxuXG4vKlxuICogRGV0ZXJtaW5lIHRoZSBhcHByb3ByaWF0ZSBhZGRpdGl2ZSBjb25zdGFudCBmb3IgdGhlIGN1cnJlbnQgaXRlcmF0aW9uXG4gKi9cbmZ1bmN0aW9uIHNoYTFfa3QodClcbntcbiAgcmV0dXJuICh0IDwgMjApID8gIDE1MTg1MDAyNDkgOiAodCA8IDQwKSA/ICAxODU5Nzc1MzkzIDpcbiAgICAgICAgICh0IDwgNjApID8gLTE4OTQwMDc1ODggOiAtODk5NDk3NTE0O1xufVxuXG4vKlxuICogQWRkIGludGVnZXJzLCB3cmFwcGluZyBhdCAyXjMyLiBUaGlzIHVzZXMgMTYtYml0IG9wZXJhdGlvbnMgaW50ZXJuYWxseVxuICogdG8gd29yayBhcm91bmQgYnVncyBpbiBzb21lIEpTIGludGVycHJldGVycy5cbiAqL1xuZnVuY3Rpb24gc2FmZV9hZGQoeCwgeSlcbntcbiAgdmFyIGxzdyA9ICh4ICYgMHhGRkZGKSArICh5ICYgMHhGRkZGKTtcbiAgdmFyIG1zdyA9ICh4ID4+IDE2KSArICh5ID4+IDE2KSArIChsc3cgPj4gMTYpO1xuICByZXR1cm4gKG1zdyA8PCAxNikgfCAobHN3ICYgMHhGRkZGKTtcbn1cblxuLypcbiAqIEJpdHdpc2Ugcm90YXRlIGEgMzItYml0IG51bWJlciB0byB0aGUgbGVmdC5cbiAqL1xuZnVuY3Rpb24gcm9sKG51bSwgY250KVxue1xuICByZXR1cm4gKG51bSA8PCBjbnQpIHwgKG51bSA+Pj4gKDMyIC0gY250KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2hhMShidWYpIHtcbiAgcmV0dXJuIGhlbHBlcnMuaGFzaChidWYsIGNvcmVfc2hhMSwgMjAsIHRydWUpO1xufTtcbiIsIlxuLyoqXG4gKiBBIEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgdGhlIFNlY3VyZSBIYXNoIEFsZ29yaXRobSwgU0hBLTI1NiwgYXMgZGVmaW5lZFxuICogaW4gRklQUyAxODAtMlxuICogVmVyc2lvbiAyLjItYmV0YSBDb3B5cmlnaHQgQW5nZWwgTWFyaW4sIFBhdWwgSm9obnN0b24gMjAwMCAtIDIwMDkuXG4gKiBPdGhlciBjb250cmlidXRvcnM6IEdyZWcgSG9sdCwgQW5kcmV3IEtlcGVydCwgWWRuYXIsIExvc3RpbmV0XG4gKlxuICovXG5cbnZhciBoZWxwZXJzID0gcmVxdWlyZSgnLi9oZWxwZXJzJyk7XG5cbnZhciBzYWZlX2FkZCA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgdmFyIGxzdyA9ICh4ICYgMHhGRkZGKSArICh5ICYgMHhGRkZGKTtcbiAgdmFyIG1zdyA9ICh4ID4+IDE2KSArICh5ID4+IDE2KSArIChsc3cgPj4gMTYpO1xuICByZXR1cm4gKG1zdyA8PCAxNikgfCAobHN3ICYgMHhGRkZGKTtcbn07XG5cbnZhciBTID0gZnVuY3Rpb24oWCwgbikge1xuICByZXR1cm4gKFggPj4+IG4pIHwgKFggPDwgKDMyIC0gbikpO1xufTtcblxudmFyIFIgPSBmdW5jdGlvbihYLCBuKSB7XG4gIHJldHVybiAoWCA+Pj4gbik7XG59O1xuXG52YXIgQ2ggPSBmdW5jdGlvbih4LCB5LCB6KSB7XG4gIHJldHVybiAoKHggJiB5KSBeICgofngpICYgeikpO1xufTtcblxudmFyIE1haiA9IGZ1bmN0aW9uKHgsIHksIHopIHtcbiAgcmV0dXJuICgoeCAmIHkpIF4gKHggJiB6KSBeICh5ICYgeikpO1xufTtcblxudmFyIFNpZ21hMDI1NiA9IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIChTKHgsIDIpIF4gUyh4LCAxMykgXiBTKHgsIDIyKSk7XG59O1xuXG52YXIgU2lnbWExMjU2ID0gZnVuY3Rpb24oeCkge1xuICByZXR1cm4gKFMoeCwgNikgXiBTKHgsIDExKSBeIFMoeCwgMjUpKTtcbn07XG5cbnZhciBHYW1tYTAyNTYgPSBmdW5jdGlvbih4KSB7XG4gIHJldHVybiAoUyh4LCA3KSBeIFMoeCwgMTgpIF4gUih4LCAzKSk7XG59O1xuXG52YXIgR2FtbWExMjU2ID0gZnVuY3Rpb24oeCkge1xuICByZXR1cm4gKFMoeCwgMTcpIF4gUyh4LCAxOSkgXiBSKHgsIDEwKSk7XG59O1xuXG52YXIgY29yZV9zaGEyNTYgPSBmdW5jdGlvbihtLCBsKSB7XG4gIHZhciBLID0gbmV3IEFycmF5KDB4NDI4QTJGOTgsMHg3MTM3NDQ5MSwweEI1QzBGQkNGLDB4RTlCNURCQTUsMHgzOTU2QzI1QiwweDU5RjExMUYxLDB4OTIzRjgyQTQsMHhBQjFDNUVENSwweEQ4MDdBQTk4LDB4MTI4MzVCMDEsMHgyNDMxODVCRSwweDU1MEM3REMzLDB4NzJCRTVENzQsMHg4MERFQjFGRSwweDlCREMwNkE3LDB4QzE5QkYxNzQsMHhFNDlCNjlDMSwweEVGQkU0Nzg2LDB4RkMxOURDNiwweDI0MENBMUNDLDB4MkRFOTJDNkYsMHg0QTc0ODRBQSwweDVDQjBBOURDLDB4NzZGOTg4REEsMHg5ODNFNTE1MiwweEE4MzFDNjZELDB4QjAwMzI3QzgsMHhCRjU5N0ZDNywweEM2RTAwQkYzLDB4RDVBNzkxNDcsMHg2Q0E2MzUxLDB4MTQyOTI5NjcsMHgyN0I3MEE4NSwweDJFMUIyMTM4LDB4NEQyQzZERkMsMHg1MzM4MEQxMywweDY1MEE3MzU0LDB4NzY2QTBBQkIsMHg4MUMyQzkyRSwweDkyNzIyQzg1LDB4QTJCRkU4QTEsMHhBODFBNjY0QiwweEMyNEI4QjcwLDB4Qzc2QzUxQTMsMHhEMTkyRTgxOSwweEQ2OTkwNjI0LDB4RjQwRTM1ODUsMHgxMDZBQTA3MCwweDE5QTRDMTE2LDB4MUUzNzZDMDgsMHgyNzQ4Nzc0QywweDM0QjBCQ0I1LDB4MzkxQzBDQjMsMHg0RUQ4QUE0QSwweDVCOUNDQTRGLDB4NjgyRTZGRjMsMHg3NDhGODJFRSwweDc4QTU2MzZGLDB4ODRDODc4MTQsMHg4Q0M3MDIwOCwweDkwQkVGRkZBLDB4QTQ1MDZDRUIsMHhCRUY5QTNGNywweEM2NzE3OEYyKTtcbiAgdmFyIEhBU0ggPSBuZXcgQXJyYXkoMHg2QTA5RTY2NywgMHhCQjY3QUU4NSwgMHgzQzZFRjM3MiwgMHhBNTRGRjUzQSwgMHg1MTBFNTI3RiwgMHg5QjA1Njg4QywgMHgxRjgzRDlBQiwgMHg1QkUwQ0QxOSk7XG4gICAgdmFyIFcgPSBuZXcgQXJyYXkoNjQpO1xuICAgIHZhciBhLCBiLCBjLCBkLCBlLCBmLCBnLCBoLCBpLCBqO1xuICAgIHZhciBUMSwgVDI7XG4gIC8qIGFwcGVuZCBwYWRkaW5nICovXG4gIG1bbCA+PiA1XSB8PSAweDgwIDw8ICgyNCAtIGwgJSAzMik7XG4gIG1bKChsICsgNjQgPj4gOSkgPDwgNCkgKyAxNV0gPSBsO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG0ubGVuZ3RoOyBpICs9IDE2KSB7XG4gICAgYSA9IEhBU0hbMF07IGIgPSBIQVNIWzFdOyBjID0gSEFTSFsyXTsgZCA9IEhBU0hbM107IGUgPSBIQVNIWzRdOyBmID0gSEFTSFs1XTsgZyA9IEhBU0hbNl07IGggPSBIQVNIWzddO1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgNjQ7IGorKykge1xuICAgICAgaWYgKGogPCAxNikge1xuICAgICAgICBXW2pdID0gbVtqICsgaV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBXW2pdID0gc2FmZV9hZGQoc2FmZV9hZGQoc2FmZV9hZGQoR2FtbWExMjU2KFdbaiAtIDJdKSwgV1tqIC0gN10pLCBHYW1tYTAyNTYoV1tqIC0gMTVdKSksIFdbaiAtIDE2XSk7XG4gICAgICB9XG4gICAgICBUMSA9IHNhZmVfYWRkKHNhZmVfYWRkKHNhZmVfYWRkKHNhZmVfYWRkKGgsIFNpZ21hMTI1NihlKSksIENoKGUsIGYsIGcpKSwgS1tqXSksIFdbal0pO1xuICAgICAgVDIgPSBzYWZlX2FkZChTaWdtYTAyNTYoYSksIE1haihhLCBiLCBjKSk7XG4gICAgICBoID0gZzsgZyA9IGY7IGYgPSBlOyBlID0gc2FmZV9hZGQoZCwgVDEpOyBkID0gYzsgYyA9IGI7IGIgPSBhOyBhID0gc2FmZV9hZGQoVDEsIFQyKTtcbiAgICB9XG4gICAgSEFTSFswXSA9IHNhZmVfYWRkKGEsIEhBU0hbMF0pOyBIQVNIWzFdID0gc2FmZV9hZGQoYiwgSEFTSFsxXSk7IEhBU0hbMl0gPSBzYWZlX2FkZChjLCBIQVNIWzJdKTsgSEFTSFszXSA9IHNhZmVfYWRkKGQsIEhBU0hbM10pO1xuICAgIEhBU0hbNF0gPSBzYWZlX2FkZChlLCBIQVNIWzRdKTsgSEFTSFs1XSA9IHNhZmVfYWRkKGYsIEhBU0hbNV0pOyBIQVNIWzZdID0gc2FmZV9hZGQoZywgSEFTSFs2XSk7IEhBU0hbN10gPSBzYWZlX2FkZChoLCBIQVNIWzddKTtcbiAgfVxuICByZXR1cm4gSEFTSDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2hhMjU2KGJ1Zikge1xuICByZXR1cm4gaGVscGVycy5oYXNoKGJ1ZiwgY29yZV9zaGEyNTYsIDMyLCB0cnVlKTtcbn07XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGV2LnNvdXJjZTtcbiAgICAgICAgICAgIGlmICgoc291cmNlID09PSB3aW5kb3cgfHwgc291cmNlID09PSBudWxsKSAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCl7XG4oZnVuY3Rpb24oZ2xvYmFsKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgaWYgKGdsb2JhbC4kdHJhY2V1clJ1bnRpbWUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyICRPYmplY3QgPSBPYmplY3Q7XG4gIHZhciAkVHlwZUVycm9yID0gVHlwZUVycm9yO1xuICB2YXIgJGNyZWF0ZSA9ICRPYmplY3QuY3JlYXRlO1xuICB2YXIgJGRlZmluZVByb3BlcnRpZXMgPSAkT2JqZWN0LmRlZmluZVByb3BlcnRpZXM7XG4gIHZhciAkZGVmaW5lUHJvcGVydHkgPSAkT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuICB2YXIgJGZyZWV6ZSA9ICRPYmplY3QuZnJlZXplO1xuICB2YXIgJGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9ICRPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICB2YXIgJGdldE93blByb3BlcnR5TmFtZXMgPSAkT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG4gIHZhciAkZ2V0UHJvdG90eXBlT2YgPSAkT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICB2YXIgJGhhc093blByb3BlcnR5ID0gJE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gIHZhciAkdG9TdHJpbmcgPSAkT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbiAgZnVuY3Rpb24gbm9uRW51bSh2YWx1ZSkge1xuICAgIHJldHVybiB7XG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfTtcbiAgfVxuICB2YXIgdHlwZXMgPSB7XG4gICAgdm9pZDogZnVuY3Rpb24gdm9pZFR5cGUoKSB7fSxcbiAgICBhbnk6IGZ1bmN0aW9uIGFueSgpIHt9LFxuICAgIHN0cmluZzogZnVuY3Rpb24gc3RyaW5nKCkge30sXG4gICAgbnVtYmVyOiBmdW5jdGlvbiBudW1iZXIoKSB7fSxcbiAgICBib29sZWFuOiBmdW5jdGlvbiBib29sZWFuKCkge31cbiAgfTtcbiAgdmFyIG1ldGhvZCA9IG5vbkVudW07XG4gIHZhciBjb3VudGVyID0gMDtcbiAgZnVuY3Rpb24gbmV3VW5pcXVlU3RyaW5nKCkge1xuICAgIHJldHVybiAnX18kJyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDFlOSkgKyAnJCcgKyArK2NvdW50ZXIgKyAnJF9fJztcbiAgfVxuICB2YXIgc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eSA9IG5ld1VuaXF1ZVN0cmluZygpO1xuICB2YXIgc3ltYm9sRGVzY3JpcHRpb25Qcm9wZXJ0eSA9IG5ld1VuaXF1ZVN0cmluZygpO1xuICB2YXIgc3ltYm9sRGF0YVByb3BlcnR5ID0gbmV3VW5pcXVlU3RyaW5nKCk7XG4gIHZhciBzeW1ib2xWYWx1ZXMgPSAkY3JlYXRlKG51bGwpO1xuICBmdW5jdGlvbiBpc1N5bWJvbChzeW1ib2wpIHtcbiAgICByZXR1cm4gdHlwZW9mIHN5bWJvbCA9PT0gJ29iamVjdCcgJiYgc3ltYm9sIGluc3RhbmNlb2YgU3ltYm9sVmFsdWU7XG4gIH1cbiAgZnVuY3Rpb24gdHlwZU9mKHYpIHtcbiAgICBpZiAoaXNTeW1ib2wodikpXG4gICAgICByZXR1cm4gJ3N5bWJvbCc7XG4gICAgcmV0dXJuIHR5cGVvZiB2O1xuICB9XG4gIGZ1bmN0aW9uIFN5bWJvbChkZXNjcmlwdGlvbikge1xuICAgIHZhciB2YWx1ZSA9IG5ldyBTeW1ib2xWYWx1ZShkZXNjcmlwdGlvbik7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFN5bWJvbCkpXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignU3ltYm9sIGNhbm5vdCBiZSBuZXdcXCdlZCcpO1xuICB9XG4gICRkZWZpbmVQcm9wZXJ0eShTeW1ib2wucHJvdG90eXBlLCAnY29uc3RydWN0b3InLCBub25FbnVtKFN5bWJvbCkpO1xuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sLnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgbWV0aG9kKGZ1bmN0aW9uKCkge1xuICAgIHZhciBzeW1ib2xWYWx1ZSA9IHRoaXNbc3ltYm9sRGF0YVByb3BlcnR5XTtcbiAgICBpZiAoIWdldE9wdGlvbignc3ltYm9scycpKVxuICAgICAgcmV0dXJuIHN5bWJvbFZhbHVlW3N5bWJvbEludGVybmFsUHJvcGVydHldO1xuICAgIGlmICghc3ltYm9sVmFsdWUpXG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ0NvbnZlcnNpb24gZnJvbSBzeW1ib2wgdG8gc3RyaW5nJyk7XG4gICAgdmFyIGRlc2MgPSBzeW1ib2xWYWx1ZVtzeW1ib2xEZXNjcmlwdGlvblByb3BlcnR5XTtcbiAgICBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKVxuICAgICAgZGVzYyA9ICcnO1xuICAgIHJldHVybiAnU3ltYm9sKCcgKyBkZXNjICsgJyknO1xuICB9KSk7XG4gICRkZWZpbmVQcm9wZXJ0eShTeW1ib2wucHJvdG90eXBlLCAndmFsdWVPZicsIG1ldGhvZChmdW5jdGlvbigpIHtcbiAgICB2YXIgc3ltYm9sVmFsdWUgPSB0aGlzW3N5bWJvbERhdGFQcm9wZXJ0eV07XG4gICAgaWYgKCFzeW1ib2xWYWx1ZSlcbiAgICAgIHRocm93IFR5cGVFcnJvcignQ29udmVyc2lvbiBmcm9tIHN5bWJvbCB0byBzdHJpbmcnKTtcbiAgICBpZiAoIWdldE9wdGlvbignc3ltYm9scycpKVxuICAgICAgcmV0dXJuIHN5bWJvbFZhbHVlW3N5bWJvbEludGVybmFsUHJvcGVydHldO1xuICAgIHJldHVybiBzeW1ib2xWYWx1ZTtcbiAgfSkpO1xuICBmdW5jdGlvbiBTeW1ib2xWYWx1ZShkZXNjcmlwdGlvbikge1xuICAgIHZhciBrZXkgPSBuZXdVbmlxdWVTdHJpbmcoKTtcbiAgICAkZGVmaW5lUHJvcGVydHkodGhpcywgc3ltYm9sRGF0YVByb3BlcnR5LCB7dmFsdWU6IHRoaXN9KTtcbiAgICAkZGVmaW5lUHJvcGVydHkodGhpcywgc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eSwge3ZhbHVlOiBrZXl9KTtcbiAgICAkZGVmaW5lUHJvcGVydHkodGhpcywgc3ltYm9sRGVzY3JpcHRpb25Qcm9wZXJ0eSwge3ZhbHVlOiBkZXNjcmlwdGlvbn0pO1xuICAgICRmcmVlemUodGhpcyk7XG4gICAgc3ltYm9sVmFsdWVzW2tleV0gPSB0aGlzO1xuICB9XG4gICRkZWZpbmVQcm9wZXJ0eShTeW1ib2xWYWx1ZS5wcm90b3R5cGUsICdjb25zdHJ1Y3RvcicsIG5vbkVudW0oU3ltYm9sKSk7XG4gICRkZWZpbmVQcm9wZXJ0eShTeW1ib2xWYWx1ZS5wcm90b3R5cGUsICd0b1N0cmluZycsIHtcbiAgICB2YWx1ZTogU3ltYm9sLnByb3RvdHlwZS50b1N0cmluZyxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICB9KTtcbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbFZhbHVlLnByb3RvdHlwZSwgJ3ZhbHVlT2YnLCB7XG4gICAgdmFsdWU6IFN5bWJvbC5wcm90b3R5cGUudmFsdWVPZixcbiAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICB9KTtcbiAgJGZyZWV6ZShTeW1ib2xWYWx1ZS5wcm90b3R5cGUpO1xuICBTeW1ib2wuaXRlcmF0b3IgPSBTeW1ib2woKTtcbiAgZnVuY3Rpb24gdG9Qcm9wZXJ0eShuYW1lKSB7XG4gICAgaWYgKGlzU3ltYm9sKG5hbWUpKVxuICAgICAgcmV0dXJuIG5hbWVbc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eV07XG4gICAgcmV0dXJuIG5hbWU7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhvYmplY3QpIHtcbiAgICB2YXIgcnYgPSBbXTtcbiAgICB2YXIgbmFtZXMgPSAkZ2V0T3duUHJvcGVydHlOYW1lcyhvYmplY3QpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBuYW1lID0gbmFtZXNbaV07XG4gICAgICBpZiAoIXN5bWJvbFZhbHVlc1tuYW1lXSlcbiAgICAgICAgcnYucHVzaChuYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIHJ2O1xuICB9XG4gIGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIG5hbWUpIHtcbiAgICByZXR1cm4gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHRvUHJvcGVydHkobmFtZSkpO1xuICB9XG4gIGZ1bmN0aW9uIGdldE93blByb3BlcnR5U3ltYm9scyhvYmplY3QpIHtcbiAgICB2YXIgcnYgPSBbXTtcbiAgICB2YXIgbmFtZXMgPSAkZ2V0T3duUHJvcGVydHlOYW1lcyhvYmplY3QpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzeW1ib2wgPSBzeW1ib2xWYWx1ZXNbbmFtZXNbaV1dO1xuICAgICAgaWYgKHN5bWJvbClcbiAgICAgICAgcnYucHVzaChzeW1ib2wpO1xuICAgIH1cbiAgICByZXR1cm4gcnY7XG4gIH1cbiAgZnVuY3Rpb24gaGFzT3duUHJvcGVydHkobmFtZSkge1xuICAgIHJldHVybiAkaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLCB0b1Byb3BlcnR5KG5hbWUpKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRPcHRpb24obmFtZSkge1xuICAgIHJldHVybiBnbG9iYWwudHJhY2V1ciAmJiBnbG9iYWwudHJhY2V1ci5vcHRpb25zW25hbWVdO1xuICB9XG4gIGZ1bmN0aW9uIHNldFByb3BlcnR5KG9iamVjdCwgbmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgc3ltLFxuICAgICAgICBkZXNjO1xuICAgIGlmIChpc1N5bWJvbChuYW1lKSkge1xuICAgICAgc3ltID0gbmFtZTtcbiAgICAgIG5hbWUgPSBuYW1lW3N5bWJvbEludGVybmFsUHJvcGVydHldO1xuICAgIH1cbiAgICBvYmplY3RbbmFtZV0gPSB2YWx1ZTtcbiAgICBpZiAoc3ltICYmIChkZXNjID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIG5hbWUpKSlcbiAgICAgICRkZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIHtlbnVtZXJhYmxlOiBmYWxzZX0pO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIGRlc2NyaXB0b3IpIHtcbiAgICBpZiAoaXNTeW1ib2wobmFtZSkpIHtcbiAgICAgIGlmIChkZXNjcmlwdG9yLmVudW1lcmFibGUpIHtcbiAgICAgICAgZGVzY3JpcHRvciA9ICRjcmVhdGUoZGVzY3JpcHRvciwge2VudW1lcmFibGU6IHt2YWx1ZTogZmFsc2V9fSk7XG4gICAgICB9XG4gICAgICBuYW1lID0gbmFtZVtzeW1ib2xJbnRlcm5hbFByb3BlcnR5XTtcbiAgICB9XG4gICAgJGRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwgZGVzY3JpcHRvcik7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbE9iamVjdChPYmplY3QpIHtcbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnZGVmaW5lUHJvcGVydHknLCB7dmFsdWU6IGRlZmluZVByb3BlcnR5fSk7XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ2dldE93blByb3BlcnR5TmFtZXMnLCB7dmFsdWU6IGdldE93blByb3BlcnR5TmFtZXN9KTtcbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yJywge3ZhbHVlOiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3J9KTtcbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LnByb3RvdHlwZSwgJ2hhc093blByb3BlcnR5Jywge3ZhbHVlOiBoYXNPd25Qcm9wZXJ0eX0pO1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG4gICAgZnVuY3Rpb24gaXMobGVmdCwgcmlnaHQpIHtcbiAgICAgIGlmIChsZWZ0ID09PSByaWdodClcbiAgICAgICAgcmV0dXJuIGxlZnQgIT09IDAgfHwgMSAvIGxlZnQgPT09IDEgLyByaWdodDtcbiAgICAgIHJldHVybiBsZWZ0ICE9PSBsZWZ0ICYmIHJpZ2h0ICE9PSByaWdodDtcbiAgICB9XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ2lzJywgbWV0aG9kKGlzKSk7XG4gICAgZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKSB7XG4gICAgICB2YXIgcHJvcHMgPSAkZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2UpO1xuICAgICAgdmFyIHAsXG4gICAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuICAgICAgZm9yIChwID0gMDsgcCA8IGxlbmd0aDsgcCsrKSB7XG4gICAgICAgIHRhcmdldFtwcm9wc1twXV0gPSBzb3VyY2VbcHJvcHNbcF1dO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ2Fzc2lnbicsIG1ldGhvZChhc3NpZ24pKTtcbiAgICBmdW5jdGlvbiBtaXhpbih0YXJnZXQsIHNvdXJjZSkge1xuICAgICAgdmFyIHByb3BzID0gJGdldE93blByb3BlcnR5TmFtZXMoc291cmNlKTtcbiAgICAgIHZhciBwLFxuICAgICAgICAgIGRlc2NyaXB0b3IsXG4gICAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuICAgICAgZm9yIChwID0gMDsgcCA8IGxlbmd0aDsgcCsrKSB7XG4gICAgICAgIGRlc2NyaXB0b3IgPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwgcHJvcHNbcF0pO1xuICAgICAgICAkZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wc1twXSwgZGVzY3JpcHRvcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnbWl4aW4nLCBtZXRob2QobWl4aW4pKTtcbiAgfVxuICBmdW5jdGlvbiBleHBvcnRTdGFyKG9iamVjdCkge1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbmFtZXMgPSAkZ2V0T3duUHJvcGVydHlOYW1lcyhhcmd1bWVudHNbaV0pO1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBuYW1lcy5sZW5ndGg7IGorKykge1xuICAgICAgICAoZnVuY3Rpb24obW9kLCBuYW1lKSB7XG4gICAgICAgICAgJGRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG1vZFtuYW1lXTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pKGFyZ3VtZW50c1tpXSwgbmFtZXNbal0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG4gIGZ1bmN0aW9uIHRvT2JqZWN0KHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICB0aHJvdyAkVHlwZUVycm9yKCk7XG4gICAgcmV0dXJuICRPYmplY3QodmFsdWUpO1xuICB9XG4gIGZ1bmN0aW9uIHNwcmVhZCgpIHtcbiAgICB2YXIgcnYgPSBbXSxcbiAgICAgICAgayA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB2YWx1ZVRvU3ByZWFkID0gdG9PYmplY3QoYXJndW1lbnRzW2ldKTtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdmFsdWVUb1NwcmVhZC5sZW5ndGg7IGorKykge1xuICAgICAgICBydltrKytdID0gdmFsdWVUb1NwcmVhZFtqXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJ2O1xuICB9XG4gIGZ1bmN0aW9uIGdldFByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIG5hbWUpIHtcbiAgICB3aGlsZSAob2JqZWN0ICE9PSBudWxsKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIG5hbWUpO1xuICAgICAgaWYgKHJlc3VsdClcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIG9iamVjdCA9ICRnZXRQcm90b3R5cGVPZihvYmplY3QpO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGZ1bmN0aW9uIHN1cGVyRGVzY3JpcHRvcihob21lT2JqZWN0LCBuYW1lKSB7XG4gICAgdmFyIHByb3RvID0gJGdldFByb3RvdHlwZU9mKGhvbWVPYmplY3QpO1xuICAgIGlmICghcHJvdG8pXG4gICAgICB0aHJvdyAkVHlwZUVycm9yKCdzdXBlciBpcyBudWxsJyk7XG4gICAgcmV0dXJuIGdldFByb3BlcnR5RGVzY3JpcHRvcihwcm90bywgbmFtZSk7XG4gIH1cbiAgZnVuY3Rpb24gc3VwZXJDYWxsKHNlbGYsIGhvbWVPYmplY3QsIG5hbWUsIGFyZ3MpIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHN1cGVyRGVzY3JpcHRvcihob21lT2JqZWN0LCBuYW1lKTtcbiAgICBpZiAoZGVzY3JpcHRvcikge1xuICAgICAgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcilcbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3IudmFsdWUuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICBpZiAoZGVzY3JpcHRvci5nZXQpXG4gICAgICAgIHJldHVybiBkZXNjcmlwdG9yLmdldC5jYWxsKHNlbGYpLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgIH1cbiAgICB0aHJvdyAkVHlwZUVycm9yKFwic3VwZXIgaGFzIG5vIG1ldGhvZCAnXCIgKyBuYW1lICsgXCInLlwiKTtcbiAgfVxuICBmdW5jdGlvbiBzdXBlckdldChzZWxmLCBob21lT2JqZWN0LCBuYW1lKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBzdXBlckRlc2NyaXB0b3IoaG9tZU9iamVjdCwgbmFtZSk7XG4gICAgaWYgKGRlc2NyaXB0b3IpIHtcbiAgICAgIGlmIChkZXNjcmlwdG9yLmdldClcbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3IuZ2V0LmNhbGwoc2VsZik7XG4gICAgICBlbHNlIGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpXG4gICAgICAgIHJldHVybiBkZXNjcmlwdG9yLnZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGZ1bmN0aW9uIHN1cGVyU2V0KHNlbGYsIGhvbWVPYmplY3QsIG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBzdXBlckRlc2NyaXB0b3IoaG9tZU9iamVjdCwgbmFtZSk7XG4gICAgaWYgKGRlc2NyaXB0b3IgJiYgZGVzY3JpcHRvci5zZXQpIHtcbiAgICAgIGRlc2NyaXB0b3Iuc2V0LmNhbGwoc2VsZiwgdmFsdWUpO1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICB0aHJvdyAkVHlwZUVycm9yKFwic3VwZXIgaGFzIG5vIHNldHRlciAnXCIgKyBuYW1lICsgXCInLlwiKTtcbiAgfVxuICBmdW5jdGlvbiBnZXREZXNjcmlwdG9ycyhvYmplY3QpIHtcbiAgICB2YXIgZGVzY3JpcHRvcnMgPSB7fSxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgbmFtZXMgPSAkZ2V0T3duUHJvcGVydHlOYW1lcyhvYmplY3QpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBuYW1lID0gbmFtZXNbaV07XG4gICAgICBkZXNjcmlwdG9yc1tuYW1lXSA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBuYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlc2NyaXB0b3JzO1xuICB9XG4gIGZ1bmN0aW9uIGNyZWF0ZUNsYXNzKGN0b3IsIG9iamVjdCwgc3RhdGljT2JqZWN0LCBzdXBlckNsYXNzKSB7XG4gICAgJGRlZmluZVByb3BlcnR5KG9iamVjdCwgJ2NvbnN0cnVjdG9yJywge1xuICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAzKSB7XG4gICAgICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIGN0b3IuX19wcm90b19fID0gc3VwZXJDbGFzcztcbiAgICAgIGN0b3IucHJvdG90eXBlID0gJGNyZWF0ZShnZXRQcm90b1BhcmVudChzdXBlckNsYXNzKSwgZ2V0RGVzY3JpcHRvcnMob2JqZWN0KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0b3IucHJvdG90eXBlID0gb2JqZWN0O1xuICAgIH1cbiAgICAkZGVmaW5lUHJvcGVydHkoY3RvciwgJ3Byb3RvdHlwZScsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2VcbiAgICB9KTtcbiAgICByZXR1cm4gJGRlZmluZVByb3BlcnRpZXMoY3RvciwgZ2V0RGVzY3JpcHRvcnMoc3RhdGljT2JqZWN0KSk7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0UHJvdG9QYXJlbnQoc3VwZXJDbGFzcykge1xuICAgIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFyIHByb3RvdHlwZSA9IHN1cGVyQ2xhc3MucHJvdG90eXBlO1xuICAgICAgaWYgKCRPYmplY3QocHJvdG90eXBlKSA9PT0gcHJvdG90eXBlIHx8IHByb3RvdHlwZSA9PT0gbnVsbClcbiAgICAgICAgcmV0dXJuIHN1cGVyQ2xhc3MucHJvdG90eXBlO1xuICAgIH1cbiAgICBpZiAoc3VwZXJDbGFzcyA9PT0gbnVsbClcbiAgICAgIHJldHVybiBudWxsO1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgfVxuICBmdW5jdGlvbiBkZWZhdWx0U3VwZXJDYWxsKHNlbGYsIGhvbWVPYmplY3QsIGFyZ3MpIHtcbiAgICBpZiAoJGdldFByb3RvdHlwZU9mKGhvbWVPYmplY3QpICE9PSBudWxsKVxuICAgICAgc3VwZXJDYWxsKHNlbGYsIGhvbWVPYmplY3QsICdjb25zdHJ1Y3RvcicsIGFyZ3MpO1xuICB9XG4gIHZhciBTVF9ORVdCT1JOID0gMDtcbiAgdmFyIFNUX0VYRUNVVElORyA9IDE7XG4gIHZhciBTVF9TVVNQRU5ERUQgPSAyO1xuICB2YXIgU1RfQ0xPU0VEID0gMztcbiAgdmFyIEVORF9TVEFURSA9IC0yO1xuICB2YXIgUkVUSFJPV19TVEFURSA9IC0zO1xuICBmdW5jdGlvbiBhZGRJdGVyYXRvcihvYmplY3QpIHtcbiAgICByZXR1cm4gZGVmaW5lUHJvcGVydHkob2JqZWN0LCBTeW1ib2wuaXRlcmF0b3IsIG5vbkVudW0oZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9KSk7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0SW50ZXJuYWxFcnJvcihzdGF0ZSkge1xuICAgIHJldHVybiBuZXcgRXJyb3IoJ1RyYWNldXIgY29tcGlsZXIgYnVnOiBpbnZhbGlkIHN0YXRlIGluIHN0YXRlIG1hY2hpbmU6ICcgKyBzdGF0ZSk7XG4gIH1cbiAgZnVuY3Rpb24gR2VuZXJhdG9yQ29udGV4dCgpIHtcbiAgICB0aGlzLnN0YXRlID0gMDtcbiAgICB0aGlzLkdTdGF0ZSA9IFNUX05FV0JPUk47XG4gICAgdGhpcy5zdG9yZWRFeGNlcHRpb24gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5maW5hbGx5RmFsbFRocm91Z2ggPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5zZW50XyA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnJldHVyblZhbHVlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMudHJ5U3RhY2tfID0gW107XG4gIH1cbiAgR2VuZXJhdG9yQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgcHVzaFRyeTogZnVuY3Rpb24oY2F0Y2hTdGF0ZSwgZmluYWxseVN0YXRlKSB7XG4gICAgICBpZiAoZmluYWxseVN0YXRlICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBmaW5hbGx5RmFsbFRocm91Z2ggPSBudWxsO1xuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlTdGFja18ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICBpZiAodGhpcy50cnlTdGFja19baV0uY2F0Y2ggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZmluYWxseUZhbGxUaHJvdWdoID0gdGhpcy50cnlTdGFja19baV0uY2F0Y2g7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbmFsbHlGYWxsVGhyb3VnaCA9PT0gbnVsbClcbiAgICAgICAgICBmaW5hbGx5RmFsbFRocm91Z2ggPSBSRVRIUk9XX1NUQVRFO1xuICAgICAgICB0aGlzLnRyeVN0YWNrXy5wdXNoKHtcbiAgICAgICAgICBmaW5hbGx5OiBmaW5hbGx5U3RhdGUsXG4gICAgICAgICAgZmluYWxseUZhbGxUaHJvdWdoOiBmaW5hbGx5RmFsbFRocm91Z2hcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoY2F0Y2hTdGF0ZSAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLnRyeVN0YWNrXy5wdXNoKHtjYXRjaDogY2F0Y2hTdGF0ZX0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgcG9wVHJ5OiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMudHJ5U3RhY2tfLnBvcCgpO1xuICAgIH0sXG4gICAgZ2V0IHNlbnQoKSB7XG4gICAgICB0aGlzLm1heWJlVGhyb3coKTtcbiAgICAgIHJldHVybiB0aGlzLnNlbnRfO1xuICAgIH0sXG4gICAgc2V0IHNlbnQodikge1xuICAgICAgdGhpcy5zZW50XyA9IHY7XG4gICAgfSxcbiAgICBnZXQgc2VudElnbm9yZVRocm93KCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2VudF87XG4gICAgfSxcbiAgICBtYXliZVRocm93OiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLmFjdGlvbiA9PT0gJ3Rocm93Jykge1xuICAgICAgICB0aGlzLmFjdGlvbiA9ICduZXh0JztcbiAgICAgICAgdGhyb3cgdGhpcy5zZW50XztcbiAgICAgIH1cbiAgICB9LFxuICAgIGVuZDogZnVuY3Rpb24oKSB7XG4gICAgICBzd2l0Y2ggKHRoaXMuc3RhdGUpIHtcbiAgICAgICAgY2FzZSBFTkRfU1RBVEU6XG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIGNhc2UgUkVUSFJPV19TVEFURTpcbiAgICAgICAgICB0aHJvdyB0aGlzLnN0b3JlZEV4Y2VwdGlvbjtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBnZXRJbnRlcm5hbEVycm9yKHRoaXMuc3RhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgZnVuY3Rpb24gZ2V0TmV4dE9yVGhyb3coY3R4LCBtb3ZlTmV4dCwgYWN0aW9uKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHgpIHtcbiAgICAgIHN3aXRjaCAoY3R4LkdTdGF0ZSkge1xuICAgICAgICBjYXNlIFNUX0VYRUNVVElORzpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKFwiXFxcIlwiICsgYWN0aW9uICsgXCJcXFwiIG9uIGV4ZWN1dGluZyBnZW5lcmF0b3JcIikpO1xuICAgICAgICBjYXNlIFNUX0NMT1NFRDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKFwiXFxcIlwiICsgYWN0aW9uICsgXCJcXFwiIG9uIGNsb3NlZCBnZW5lcmF0b3JcIikpO1xuICAgICAgICBjYXNlIFNUX05FV0JPUk46XG4gICAgICAgICAgaWYgKGFjdGlvbiA9PT0gJ3Rocm93Jykge1xuICAgICAgICAgICAgY3R4LkdTdGF0ZSA9IFNUX0NMT1NFRDtcbiAgICAgICAgICAgIHRocm93IHg7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh4ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aHJvdyAkVHlwZUVycm9yKCdTZW50IHZhbHVlIHRvIG5ld2Jvcm4gZ2VuZXJhdG9yJyk7XG4gICAgICAgIGNhc2UgU1RfU1VTUEVOREVEOlxuICAgICAgICAgIGN0eC5HU3RhdGUgPSBTVF9FWEVDVVRJTkc7XG4gICAgICAgICAgY3R4LmFjdGlvbiA9IGFjdGlvbjtcbiAgICAgICAgICBjdHguc2VudCA9IHg7XG4gICAgICAgICAgdmFyIHZhbHVlID0gbW92ZU5leHQoY3R4KTtcbiAgICAgICAgICB2YXIgZG9uZSA9IHZhbHVlID09PSBjdHg7XG4gICAgICAgICAgaWYgKGRvbmUpXG4gICAgICAgICAgICB2YWx1ZSA9IGN0eC5yZXR1cm5WYWx1ZTtcbiAgICAgICAgICBjdHguR1N0YXRlID0gZG9uZSA/IFNUX0NMT1NFRCA6IFNUX1NVU1BFTkRFRDtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgZG9uZTogZG9uZVxuICAgICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBnZW5lcmF0b3JXcmFwKGlubmVyRnVuY3Rpb24sIHNlbGYpIHtcbiAgICB2YXIgbW92ZU5leHQgPSBnZXRNb3ZlTmV4dChpbm5lckZ1bmN0aW9uLCBzZWxmKTtcbiAgICB2YXIgY3R4ID0gbmV3IEdlbmVyYXRvckNvbnRleHQoKTtcbiAgICByZXR1cm4gYWRkSXRlcmF0b3Ioe1xuICAgICAgbmV4dDogZ2V0TmV4dE9yVGhyb3coY3R4LCBtb3ZlTmV4dCwgJ25leHQnKSxcbiAgICAgIHRocm93OiBnZXROZXh0T3JUaHJvdyhjdHgsIG1vdmVOZXh0LCAndGhyb3cnKVxuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIEFzeW5jRnVuY3Rpb25Db250ZXh0KCkge1xuICAgIEdlbmVyYXRvckNvbnRleHQuY2FsbCh0aGlzKTtcbiAgICB0aGlzLmVyciA9IHVuZGVmaW5lZDtcbiAgICB2YXIgY3R4ID0gdGhpcztcbiAgICBjdHgucmVzdWx0ID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBjdHgucmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICBjdHgucmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuICB9XG4gIEFzeW5jRnVuY3Rpb25Db250ZXh0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR2VuZXJhdG9yQ29udGV4dC5wcm90b3R5cGUpO1xuICBBc3luY0Z1bmN0aW9uQ29udGV4dC5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oKSB7XG4gICAgc3dpdGNoICh0aGlzLnN0YXRlKSB7XG4gICAgICBjYXNlIEVORF9TVEFURTpcbiAgICAgICAgcmV0dXJuO1xuICAgICAgY2FzZSBSRVRIUk9XX1NUQVRFOlxuICAgICAgICB0aGlzLnJlamVjdCh0aGlzLnN0b3JlZEV4Y2VwdGlvbik7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLnJlamVjdChnZXRJbnRlcm5hbEVycm9yKHRoaXMuc3RhdGUpKTtcbiAgICB9XG4gIH07XG4gIGZ1bmN0aW9uIGFzeW5jV3JhcChpbm5lckZ1bmN0aW9uLCBzZWxmKSB7XG4gICAgdmFyIG1vdmVOZXh0ID0gZ2V0TW92ZU5leHQoaW5uZXJGdW5jdGlvbiwgc2VsZik7XG4gICAgdmFyIGN0eCA9IG5ldyBBc3luY0Z1bmN0aW9uQ29udGV4dCgpO1xuICAgIGN0eC5jcmVhdGVDYWxsYmFjayA9IGZ1bmN0aW9uKG5ld1N0YXRlKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgY3R4LnN0YXRlID0gbmV3U3RhdGU7XG4gICAgICAgIGN0eC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICBtb3ZlTmV4dChjdHgpO1xuICAgICAgfTtcbiAgICB9O1xuICAgIGN0eC5jcmVhdGVFcnJiYWNrID0gZnVuY3Rpb24obmV3U3RhdGUpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgY3R4LnN0YXRlID0gbmV3U3RhdGU7XG4gICAgICAgIGN0eC5lcnIgPSBlcnI7XG4gICAgICAgIG1vdmVOZXh0KGN0eCk7XG4gICAgICB9O1xuICAgIH07XG4gICAgbW92ZU5leHQoY3R4KTtcbiAgICByZXR1cm4gY3R4LnJlc3VsdDtcbiAgfVxuICBmdW5jdGlvbiBnZXRNb3ZlTmV4dChpbm5lckZ1bmN0aW9uLCBzZWxmKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGN0eCkge1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gaW5uZXJGdW5jdGlvbi5jYWxsKHNlbGYsIGN0eCk7XG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgY3R4LnN0b3JlZEV4Y2VwdGlvbiA9IGV4O1xuICAgICAgICAgIHZhciBsYXN0ID0gY3R4LnRyeVN0YWNrX1tjdHgudHJ5U3RhY2tfLmxlbmd0aCAtIDFdO1xuICAgICAgICAgIGlmICghbGFzdCkge1xuICAgICAgICAgICAgY3R4LkdTdGF0ZSA9IFNUX0NMT1NFRDtcbiAgICAgICAgICAgIGN0eC5zdGF0ZSA9IEVORF9TVEFURTtcbiAgICAgICAgICAgIHRocm93IGV4O1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdHguc3RhdGUgPSBsYXN0LmNhdGNoICE9PSB1bmRlZmluZWQgPyBsYXN0LmNhdGNoIDogbGFzdC5maW5hbGx5O1xuICAgICAgICAgIGlmIChsYXN0LmZpbmFsbHlGYWxsVGhyb3VnaCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgY3R4LmZpbmFsbHlGYWxsVGhyb3VnaCA9IGxhc3QuZmluYWxseUZhbGxUaHJvdWdoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBzZXR1cEdsb2JhbHMoZ2xvYmFsKSB7XG4gICAgZ2xvYmFsLlN5bWJvbCA9IFN5bWJvbDtcbiAgICBwb2x5ZmlsbE9iamVjdChnbG9iYWwuT2JqZWN0KTtcbiAgfVxuICBzZXR1cEdsb2JhbHMoZ2xvYmFsKTtcbiAgZ2xvYmFsLiR0cmFjZXVyUnVudGltZSA9IHtcbiAgICBhc3luY1dyYXA6IGFzeW5jV3JhcCxcbiAgICBjcmVhdGVDbGFzczogY3JlYXRlQ2xhc3MsXG4gICAgZGVmYXVsdFN1cGVyQ2FsbDogZGVmYXVsdFN1cGVyQ2FsbCxcbiAgICBleHBvcnRTdGFyOiBleHBvcnRTdGFyLFxuICAgIGdlbmVyYXRvcldyYXA6IGdlbmVyYXRvcldyYXAsXG4gICAgc2V0UHJvcGVydHk6IHNldFByb3BlcnR5LFxuICAgIHNldHVwR2xvYmFsczogc2V0dXBHbG9iYWxzLFxuICAgIHNwcmVhZDogc3ByZWFkLFxuICAgIHN1cGVyQ2FsbDogc3VwZXJDYWxsLFxuICAgIHN1cGVyR2V0OiBzdXBlckdldCxcbiAgICBzdXBlclNldDogc3VwZXJTZXQsXG4gICAgdG9PYmplY3Q6IHRvT2JqZWN0LFxuICAgIHRvUHJvcGVydHk6IHRvUHJvcGVydHksXG4gICAgdHlwZTogdHlwZXMsXG4gICAgdHlwZW9mOiB0eXBlT2ZcbiAgfTtcbn0pKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogdGhpcyk7XG4oZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIGJ1aWxkRnJvbUVuY29kZWRQYXJ0cyhvcHRfc2NoZW1lLCBvcHRfdXNlckluZm8sIG9wdF9kb21haW4sIG9wdF9wb3J0LCBvcHRfcGF0aCwgb3B0X3F1ZXJ5RGF0YSwgb3B0X2ZyYWdtZW50KSB7XG4gICAgdmFyIG91dCA9IFtdO1xuICAgIGlmIChvcHRfc2NoZW1lKSB7XG4gICAgICBvdXQucHVzaChvcHRfc2NoZW1lLCAnOicpO1xuICAgIH1cbiAgICBpZiAob3B0X2RvbWFpbikge1xuICAgICAgb3V0LnB1c2goJy8vJyk7XG4gICAgICBpZiAob3B0X3VzZXJJbmZvKSB7XG4gICAgICAgIG91dC5wdXNoKG9wdF91c2VySW5mbywgJ0AnKTtcbiAgICAgIH1cbiAgICAgIG91dC5wdXNoKG9wdF9kb21haW4pO1xuICAgICAgaWYgKG9wdF9wb3J0KSB7XG4gICAgICAgIG91dC5wdXNoKCc6Jywgb3B0X3BvcnQpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAob3B0X3BhdGgpIHtcbiAgICAgIG91dC5wdXNoKG9wdF9wYXRoKTtcbiAgICB9XG4gICAgaWYgKG9wdF9xdWVyeURhdGEpIHtcbiAgICAgIG91dC5wdXNoKCc/Jywgb3B0X3F1ZXJ5RGF0YSk7XG4gICAgfVxuICAgIGlmIChvcHRfZnJhZ21lbnQpIHtcbiAgICAgIG91dC5wdXNoKCcjJywgb3B0X2ZyYWdtZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIG91dC5qb2luKCcnKTtcbiAgfVxuICA7XG4gIHZhciBzcGxpdFJlID0gbmV3IFJlZ0V4cCgnXicgKyAnKD86JyArICcoW146Lz8jLl0rKScgKyAnOik/JyArICcoPzovLycgKyAnKD86KFteLz8jXSopQCk/JyArICcoW1xcXFx3XFxcXGRcXFxcLVxcXFx1MDEwMC1cXFxcdWZmZmYuJV0qKScgKyAnKD86OihbMC05XSspKT8nICsgJyk/JyArICcoW14/I10rKT8nICsgJyg/OlxcXFw/KFteI10qKSk/JyArICcoPzojKC4qKSk/JyArICckJyk7XG4gIHZhciBDb21wb25lbnRJbmRleCA9IHtcbiAgICBTQ0hFTUU6IDEsXG4gICAgVVNFUl9JTkZPOiAyLFxuICAgIERPTUFJTjogMyxcbiAgICBQT1JUOiA0LFxuICAgIFBBVEg6IDUsXG4gICAgUVVFUllfREFUQTogNixcbiAgICBGUkFHTUVOVDogN1xuICB9O1xuICBmdW5jdGlvbiBzcGxpdCh1cmkpIHtcbiAgICByZXR1cm4gKHVyaS5tYXRjaChzcGxpdFJlKSk7XG4gIH1cbiAgZnVuY3Rpb24gcmVtb3ZlRG90U2VnbWVudHMocGF0aCkge1xuICAgIGlmIChwYXRoID09PSAnLycpXG4gICAgICByZXR1cm4gJy8nO1xuICAgIHZhciBsZWFkaW5nU2xhc2ggPSBwYXRoWzBdID09PSAnLycgPyAnLycgOiAnJztcbiAgICB2YXIgdHJhaWxpbmdTbGFzaCA9IHBhdGguc2xpY2UoLTEpID09PSAnLycgPyAnLycgOiAnJztcbiAgICB2YXIgc2VnbWVudHMgPSBwYXRoLnNwbGl0KCcvJyk7XG4gICAgdmFyIG91dCA9IFtdO1xuICAgIHZhciB1cCA9IDA7XG4gICAgZm9yICh2YXIgcG9zID0gMDsgcG9zIDwgc2VnbWVudHMubGVuZ3RoOyBwb3MrKykge1xuICAgICAgdmFyIHNlZ21lbnQgPSBzZWdtZW50c1twb3NdO1xuICAgICAgc3dpdGNoIChzZWdtZW50KSB7XG4gICAgICAgIGNhc2UgJyc6XG4gICAgICAgIGNhc2UgJy4nOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICcuLic6XG4gICAgICAgICAgaWYgKG91dC5sZW5ndGgpXG4gICAgICAgICAgICBvdXQucG9wKCk7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgdXArKztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBvdXQucHVzaChzZWdtZW50KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFsZWFkaW5nU2xhc2gpIHtcbiAgICAgIHdoaWxlICh1cC0tID4gMCkge1xuICAgICAgICBvdXQudW5zaGlmdCgnLi4nKTtcbiAgICAgIH1cbiAgICAgIGlmIChvdXQubGVuZ3RoID09PSAwKVxuICAgICAgICBvdXQucHVzaCgnLicpO1xuICAgIH1cbiAgICByZXR1cm4gbGVhZGluZ1NsYXNoICsgb3V0LmpvaW4oJy8nKSArIHRyYWlsaW5nU2xhc2g7XG4gIH1cbiAgZnVuY3Rpb24gam9pbkFuZENhbm9uaWNhbGl6ZVBhdGgocGFydHMpIHtcbiAgICB2YXIgcGF0aCA9IHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdIHx8ICcnO1xuICAgIHBhdGggPSByZW1vdmVEb3RTZWdtZW50cyhwYXRoKTtcbiAgICBwYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXSA9IHBhdGg7XG4gICAgcmV0dXJuIGJ1aWxkRnJvbUVuY29kZWRQYXJ0cyhwYXJ0c1tDb21wb25lbnRJbmRleC5TQ0hFTUVdLCBwYXJ0c1tDb21wb25lbnRJbmRleC5VU0VSX0lORk9dLCBwYXJ0c1tDb21wb25lbnRJbmRleC5ET01BSU5dLCBwYXJ0c1tDb21wb25lbnRJbmRleC5QT1JUXSwgcGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF0sIHBhcnRzW0NvbXBvbmVudEluZGV4LlFVRVJZX0RBVEFdLCBwYXJ0c1tDb21wb25lbnRJbmRleC5GUkFHTUVOVF0pO1xuICB9XG4gIGZ1bmN0aW9uIGNhbm9uaWNhbGl6ZVVybCh1cmwpIHtcbiAgICB2YXIgcGFydHMgPSBzcGxpdCh1cmwpO1xuICAgIHJldHVybiBqb2luQW5kQ2Fub25pY2FsaXplUGF0aChwYXJ0cyk7XG4gIH1cbiAgZnVuY3Rpb24gcmVzb2x2ZVVybChiYXNlLCB1cmwpIHtcbiAgICB2YXIgcGFydHMgPSBzcGxpdCh1cmwpO1xuICAgIHZhciBiYXNlUGFydHMgPSBzcGxpdChiYXNlKTtcbiAgICBpZiAocGFydHNbQ29tcG9uZW50SW5kZXguU0NIRU1FXSkge1xuICAgICAgcmV0dXJuIGpvaW5BbmRDYW5vbmljYWxpemVQYXRoKHBhcnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFydHNbQ29tcG9uZW50SW5kZXguU0NIRU1FXSA9IGJhc2VQYXJ0c1tDb21wb25lbnRJbmRleC5TQ0hFTUVdO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gQ29tcG9uZW50SW5kZXguU0NIRU1FOyBpIDw9IENvbXBvbmVudEluZGV4LlBPUlQ7IGkrKykge1xuICAgICAgaWYgKCFwYXJ0c1tpXSkge1xuICAgICAgICBwYXJ0c1tpXSA9IGJhc2VQYXJ0c1tpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdWzBdID09ICcvJykge1xuICAgICAgcmV0dXJuIGpvaW5BbmRDYW5vbmljYWxpemVQYXRoKHBhcnRzKTtcbiAgICB9XG4gICAgdmFyIHBhdGggPSBiYXNlUGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF07XG4gICAgdmFyIGluZGV4ID0gcGF0aC5sYXN0SW5kZXhPZignLycpO1xuICAgIHBhdGggPSBwYXRoLnNsaWNlKDAsIGluZGV4ICsgMSkgKyBwYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXTtcbiAgICBwYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXSA9IHBhdGg7XG4gICAgcmV0dXJuIGpvaW5BbmRDYW5vbmljYWxpemVQYXRoKHBhcnRzKTtcbiAgfVxuICBmdW5jdGlvbiBpc0Fic29sdXRlKG5hbWUpIHtcbiAgICBpZiAoIW5hbWUpXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgaWYgKG5hbWVbMF0gPT09ICcvJylcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIHZhciBwYXJ0cyA9IHNwbGl0KG5hbWUpO1xuICAgIGlmIChwYXJ0c1tDb21wb25lbnRJbmRleC5TQ0hFTUVdKVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gICR0cmFjZXVyUnVudGltZS5jYW5vbmljYWxpemVVcmwgPSBjYW5vbmljYWxpemVVcmw7XG4gICR0cmFjZXVyUnVudGltZS5pc0Fic29sdXRlID0gaXNBYnNvbHV0ZTtcbiAgJHRyYWNldXJSdW50aW1lLnJlbW92ZURvdFNlZ21lbnRzID0gcmVtb3ZlRG90U2VnbWVudHM7XG4gICR0cmFjZXVyUnVudGltZS5yZXNvbHZlVXJsID0gcmVzb2x2ZVVybDtcbn0pKCk7XG4oZnVuY3Rpb24oZ2xvYmFsKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgdmFyICRfXzIgPSAkdHJhY2V1clJ1bnRpbWUsXG4gICAgICBjYW5vbmljYWxpemVVcmwgPSAkX18yLmNhbm9uaWNhbGl6ZVVybCxcbiAgICAgIHJlc29sdmVVcmwgPSAkX18yLnJlc29sdmVVcmwsXG4gICAgICBpc0Fic29sdXRlID0gJF9fMi5pc0Fic29sdXRlO1xuICB2YXIgbW9kdWxlSW5zdGFudGlhdG9ycyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHZhciBiYXNlVVJMO1xuICBpZiAoZ2xvYmFsLmxvY2F0aW9uICYmIGdsb2JhbC5sb2NhdGlvbi5ocmVmKVxuICAgIGJhc2VVUkwgPSByZXNvbHZlVXJsKGdsb2JhbC5sb2NhdGlvbi5ocmVmLCAnLi8nKTtcbiAgZWxzZVxuICAgIGJhc2VVUkwgPSAnJztcbiAgdmFyIFVuY29hdGVkTW9kdWxlRW50cnkgPSBmdW5jdGlvbiBVbmNvYXRlZE1vZHVsZUVudHJ5KHVybCwgdW5jb2F0ZWRNb2R1bGUpIHtcbiAgICB0aGlzLnVybCA9IHVybDtcbiAgICB0aGlzLnZhbHVlXyA9IHVuY29hdGVkTW9kdWxlO1xuICB9O1xuICAoJHRyYWNldXJSdW50aW1lLmNyZWF0ZUNsYXNzKShVbmNvYXRlZE1vZHVsZUVudHJ5LCB7fSwge30pO1xuICB2YXIgVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IgPSBmdW5jdGlvbiBVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcih1cmwsIGZ1bmMpIHtcbiAgICAkdHJhY2V1clJ1bnRpbWUuc3VwZXJDYWxsKHRoaXMsICRVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvci5wcm90b3R5cGUsIFwiY29uc3RydWN0b3JcIiwgW3VybCwgbnVsbF0pO1xuICAgIHRoaXMuZnVuYyA9IGZ1bmM7XG4gIH07XG4gIHZhciAkVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IgPSBVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcjtcbiAgKCR0cmFjZXVyUnVudGltZS5jcmVhdGVDbGFzcykoVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IsIHtnZXRVbmNvYXRlZE1vZHVsZTogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy52YWx1ZV8pXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlXztcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlXyA9IHRoaXMuZnVuYy5jYWxsKGdsb2JhbCk7XG4gICAgfX0sIHt9LCBVbmNvYXRlZE1vZHVsZUVudHJ5KTtcbiAgZnVuY3Rpb24gZ2V0VW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IobmFtZSkge1xuICAgIGlmICghbmFtZSlcbiAgICAgIHJldHVybjtcbiAgICB2YXIgdXJsID0gTW9kdWxlU3RvcmUubm9ybWFsaXplKG5hbWUpO1xuICAgIHJldHVybiBtb2R1bGVJbnN0YW50aWF0b3JzW3VybF07XG4gIH1cbiAgO1xuICB2YXIgbW9kdWxlSW5zdGFuY2VzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgdmFyIGxpdmVNb2R1bGVTZW50aW5lbCA9IHt9O1xuICBmdW5jdGlvbiBNb2R1bGUodW5jb2F0ZWRNb2R1bGUpIHtcbiAgICB2YXIgaXNMaXZlID0gYXJndW1lbnRzWzFdO1xuICAgIHZhciBjb2F0ZWRNb2R1bGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHVuY29hdGVkTW9kdWxlKS5mb3JFYWNoKChmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgZ2V0dGVyLFxuICAgICAgICAgIHZhbHVlO1xuICAgICAgaWYgKGlzTGl2ZSA9PT0gbGl2ZU1vZHVsZVNlbnRpbmVsKSB7XG4gICAgICAgIHZhciBkZXNjciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodW5jb2F0ZWRNb2R1bGUsIG5hbWUpO1xuICAgICAgICBpZiAoZGVzY3IuZ2V0KVxuICAgICAgICAgIGdldHRlciA9IGRlc2NyLmdldDtcbiAgICAgIH1cbiAgICAgIGlmICghZ2V0dGVyKSB7XG4gICAgICAgIHZhbHVlID0gdW5jb2F0ZWRNb2R1bGVbbmFtZV07XG4gICAgICAgIGdldHRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb2F0ZWRNb2R1bGUsIG5hbWUsIHtcbiAgICAgICAgZ2V0OiBnZXR0ZXIsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIH0pO1xuICAgIH0pKTtcbiAgICBPYmplY3QucHJldmVudEV4dGVuc2lvbnMoY29hdGVkTW9kdWxlKTtcbiAgICByZXR1cm4gY29hdGVkTW9kdWxlO1xuICB9XG4gIHZhciBNb2R1bGVTdG9yZSA9IHtcbiAgICBub3JtYWxpemU6IGZ1bmN0aW9uKG5hbWUsIHJlZmVyZXJOYW1lLCByZWZlcmVyQWRkcmVzcykge1xuICAgICAgaWYgKHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiKVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwibW9kdWxlIG5hbWUgbXVzdCBiZSBhIHN0cmluZywgbm90IFwiICsgdHlwZW9mIG5hbWUpO1xuICAgICAgaWYgKGlzQWJzb2x1dGUobmFtZSkpXG4gICAgICAgIHJldHVybiBjYW5vbmljYWxpemVVcmwobmFtZSk7XG4gICAgICBpZiAoL1teXFwuXVxcL1xcLlxcLlxcLy8udGVzdChuYW1lKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21vZHVsZSBuYW1lIGVtYmVkcyAvLi4vOiAnICsgbmFtZSk7XG4gICAgICB9XG4gICAgICBpZiAobmFtZVswXSA9PT0gJy4nICYmIHJlZmVyZXJOYW1lKVxuICAgICAgICByZXR1cm4gcmVzb2x2ZVVybChyZWZlcmVyTmFtZSwgbmFtZSk7XG4gICAgICByZXR1cm4gY2Fub25pY2FsaXplVXJsKG5hbWUpO1xuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbihub3JtYWxpemVkTmFtZSkge1xuICAgICAgdmFyIG0gPSBnZXRVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcihub3JtYWxpemVkTmFtZSk7XG4gICAgICBpZiAoIW0pXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB2YXIgbW9kdWxlSW5zdGFuY2UgPSBtb2R1bGVJbnN0YW5jZXNbbS51cmxdO1xuICAgICAgaWYgKG1vZHVsZUluc3RhbmNlKVxuICAgICAgICByZXR1cm4gbW9kdWxlSW5zdGFuY2U7XG4gICAgICBtb2R1bGVJbnN0YW5jZSA9IE1vZHVsZShtLmdldFVuY29hdGVkTW9kdWxlKCksIGxpdmVNb2R1bGVTZW50aW5lbCk7XG4gICAgICByZXR1cm4gbW9kdWxlSW5zdGFuY2VzW20udXJsXSA9IG1vZHVsZUluc3RhbmNlO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbihub3JtYWxpemVkTmFtZSwgbW9kdWxlKSB7XG4gICAgICBub3JtYWxpemVkTmFtZSA9IFN0cmluZyhub3JtYWxpemVkTmFtZSk7XG4gICAgICBtb2R1bGVJbnN0YW50aWF0b3JzW25vcm1hbGl6ZWROYW1lXSA9IG5ldyBVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcihub3JtYWxpemVkTmFtZSwgKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgICAgfSkpO1xuICAgICAgbW9kdWxlSW5zdGFuY2VzW25vcm1hbGl6ZWROYW1lXSA9IG1vZHVsZTtcbiAgICB9LFxuICAgIGdldCBiYXNlVVJMKCkge1xuICAgICAgcmV0dXJuIGJhc2VVUkw7XG4gICAgfSxcbiAgICBzZXQgYmFzZVVSTCh2KSB7XG4gICAgICBiYXNlVVJMID0gU3RyaW5nKHYpO1xuICAgIH0sXG4gICAgcmVnaXN0ZXJNb2R1bGU6IGZ1bmN0aW9uKG5hbWUsIGZ1bmMpIHtcbiAgICAgIHZhciBub3JtYWxpemVkTmFtZSA9IE1vZHVsZVN0b3JlLm5vcm1hbGl6ZShuYW1lKTtcbiAgICAgIGlmIChtb2R1bGVJbnN0YW50aWF0b3JzW25vcm1hbGl6ZWROYW1lXSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdkdXBsaWNhdGUgbW9kdWxlIG5hbWVkICcgKyBub3JtYWxpemVkTmFtZSk7XG4gICAgICBtb2R1bGVJbnN0YW50aWF0b3JzW25vcm1hbGl6ZWROYW1lXSA9IG5ldyBVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcihub3JtYWxpemVkTmFtZSwgZnVuYyk7XG4gICAgfSxcbiAgICBidW5kbGVTdG9yZTogT2JqZWN0LmNyZWF0ZShudWxsKSxcbiAgICByZWdpc3RlcjogZnVuY3Rpb24obmFtZSwgZGVwcywgZnVuYykge1xuICAgICAgaWYgKCFkZXBzIHx8ICFkZXBzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLnJlZ2lzdGVyTW9kdWxlKG5hbWUsIGZ1bmMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5idW5kbGVTdG9yZVtuYW1lXSA9IHtcbiAgICAgICAgICBkZXBzOiBkZXBzLFxuICAgICAgICAgIGV4ZWN1dGU6IGZ1bmNcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGdldEFub255bW91c01vZHVsZTogZnVuY3Rpb24oZnVuYykge1xuICAgICAgcmV0dXJuIG5ldyBNb2R1bGUoZnVuYy5jYWxsKGdsb2JhbCksIGxpdmVNb2R1bGVTZW50aW5lbCk7XG4gICAgfSxcbiAgICBnZXRGb3JUZXN0aW5nOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgJF9fMCA9IHRoaXM7XG4gICAgICBpZiAoIXRoaXMudGVzdGluZ1ByZWZpeF8pIHtcbiAgICAgICAgT2JqZWN0LmtleXMobW9kdWxlSW5zdGFuY2VzKS5zb21lKChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICB2YXIgbSA9IC8odHJhY2V1ckBbXlxcL10qXFwvKS8uZXhlYyhrZXkpO1xuICAgICAgICAgIGlmIChtKSB7XG4gICAgICAgICAgICAkX18wLnRlc3RpbmdQcmVmaXhfID0gbVsxXTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZ2V0KHRoaXMudGVzdGluZ1ByZWZpeF8gKyBuYW1lKTtcbiAgICB9XG4gIH07XG4gIE1vZHVsZVN0b3JlLnNldCgnQHRyYWNldXIvc3JjL3J1bnRpbWUvTW9kdWxlU3RvcmUnLCBuZXcgTW9kdWxlKHtNb2R1bGVTdG9yZTogTW9kdWxlU3RvcmV9KSk7XG4gIHZhciBzZXR1cEdsb2JhbHMgPSAkdHJhY2V1clJ1bnRpbWUuc2V0dXBHbG9iYWxzO1xuICAkdHJhY2V1clJ1bnRpbWUuc2V0dXBHbG9iYWxzID0gZnVuY3Rpb24oZ2xvYmFsKSB7XG4gICAgc2V0dXBHbG9iYWxzKGdsb2JhbCk7XG4gIH07XG4gICR0cmFjZXVyUnVudGltZS5Nb2R1bGVTdG9yZSA9IE1vZHVsZVN0b3JlO1xuICBnbG9iYWwuU3lzdGVtID0ge1xuICAgIHJlZ2lzdGVyOiBNb2R1bGVTdG9yZS5yZWdpc3Rlci5iaW5kKE1vZHVsZVN0b3JlKSxcbiAgICBnZXQ6IE1vZHVsZVN0b3JlLmdldCxcbiAgICBzZXQ6IE1vZHVsZVN0b3JlLnNldCxcbiAgICBub3JtYWxpemU6IE1vZHVsZVN0b3JlLm5vcm1hbGl6ZVxuICB9O1xuICAkdHJhY2V1clJ1bnRpbWUuZ2V0TW9kdWxlSW1wbCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgaW5zdGFudGlhdG9yID0gZ2V0VW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IobmFtZSk7XG4gICAgcmV0dXJuIGluc3RhbnRpYXRvciAmJiBpbnN0YW50aWF0b3IuZ2V0VW5jb2F0ZWRNb2R1bGUoKTtcbiAgfTtcbn0pKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogdGhpcyk7XG5TeXN0ZW0ucmVnaXN0ZXIoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy91dGlsc1wiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy91dGlsc1wiO1xuICB2YXIgdG9PYmplY3QgPSAkdHJhY2V1clJ1bnRpbWUudG9PYmplY3Q7XG4gIGZ1bmN0aW9uIHRvVWludDMyKHgpIHtcbiAgICByZXR1cm4geCB8IDA7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBnZXQgdG9PYmplY3QoKSB7XG4gICAgICByZXR1cm4gdG9PYmplY3Q7XG4gICAgfSxcbiAgICBnZXQgdG9VaW50MzIoKSB7XG4gICAgICByZXR1cm4gdG9VaW50MzI7XG4gICAgfVxuICB9O1xufSk7XG5TeXN0ZW0ucmVnaXN0ZXIoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9BcnJheUl0ZXJhdG9yXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciAkX180O1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9BcnJheUl0ZXJhdG9yXCI7XG4gIHZhciAkX181ID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3V0aWxzXCIpLFxuICAgICAgdG9PYmplY3QgPSAkX181LnRvT2JqZWN0LFxuICAgICAgdG9VaW50MzIgPSAkX181LnRvVWludDMyO1xuICB2YXIgQVJSQVlfSVRFUkFUT1JfS0lORF9LRVlTID0gMTtcbiAgdmFyIEFSUkFZX0lURVJBVE9SX0tJTkRfVkFMVUVTID0gMjtcbiAgdmFyIEFSUkFZX0lURVJBVE9SX0tJTkRfRU5UUklFUyA9IDM7XG4gIHZhciBBcnJheUl0ZXJhdG9yID0gZnVuY3Rpb24gQXJyYXlJdGVyYXRvcigpIHt9O1xuICAoJHRyYWNldXJSdW50aW1lLmNyZWF0ZUNsYXNzKShBcnJheUl0ZXJhdG9yLCAoJF9fNCA9IHt9LCBPYmplY3QuZGVmaW5lUHJvcGVydHkoJF9fNCwgXCJuZXh0XCIsIHtcbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaXRlcmF0b3IgPSB0b09iamVjdCh0aGlzKTtcbiAgICAgIHZhciBhcnJheSA9IGl0ZXJhdG9yLml0ZXJhdG9yT2JqZWN0XztcbiAgICAgIGlmICghYXJyYXkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0IGlzIG5vdCBhbiBBcnJheUl0ZXJhdG9yJyk7XG4gICAgICB9XG4gICAgICB2YXIgaW5kZXggPSBpdGVyYXRvci5hcnJheUl0ZXJhdG9yTmV4dEluZGV4XztcbiAgICAgIHZhciBpdGVtS2luZCA9IGl0ZXJhdG9yLmFycmF5SXRlcmF0aW9uS2luZF87XG4gICAgICB2YXIgbGVuZ3RoID0gdG9VaW50MzIoYXJyYXkubGVuZ3RoKTtcbiAgICAgIGlmIChpbmRleCA+PSBsZW5ndGgpIHtcbiAgICAgICAgaXRlcmF0b3IuYXJyYXlJdGVyYXRvck5leHRJbmRleF8gPSBJbmZpbml0eTtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0KHVuZGVmaW5lZCwgdHJ1ZSk7XG4gICAgICB9XG4gICAgICBpdGVyYXRvci5hcnJheUl0ZXJhdG9yTmV4dEluZGV4XyA9IGluZGV4ICsgMTtcbiAgICAgIGlmIChpdGVtS2luZCA9PSBBUlJBWV9JVEVSQVRPUl9LSU5EX1ZBTFVFUylcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0KGFycmF5W2luZGV4XSwgZmFsc2UpO1xuICAgICAgaWYgKGl0ZW1LaW5kID09IEFSUkFZX0lURVJBVE9SX0tJTkRfRU5UUklFUylcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0KFtpbmRleCwgYXJyYXlbaW5kZXhdXSwgZmFsc2UpO1xuICAgICAgcmV0dXJuIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0KGluZGV4LCBmYWxzZSk7XG4gICAgfSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZVxuICB9KSwgT2JqZWN0LmRlZmluZVByb3BlcnR5KCRfXzQsIFN5bWJvbC5pdGVyYXRvciwge1xuICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWVcbiAgfSksICRfXzQpLCB7fSk7XG4gIGZ1bmN0aW9uIGNyZWF0ZUFycmF5SXRlcmF0b3IoYXJyYXksIGtpbmQpIHtcbiAgICB2YXIgb2JqZWN0ID0gdG9PYmplY3QoYXJyYXkpO1xuICAgIHZhciBpdGVyYXRvciA9IG5ldyBBcnJheUl0ZXJhdG9yO1xuICAgIGl0ZXJhdG9yLml0ZXJhdG9yT2JqZWN0XyA9IG9iamVjdDtcbiAgICBpdGVyYXRvci5hcnJheUl0ZXJhdG9yTmV4dEluZGV4XyA9IDA7XG4gICAgaXRlcmF0b3IuYXJyYXlJdGVyYXRpb25LaW5kXyA9IGtpbmQ7XG4gICAgcmV0dXJuIGl0ZXJhdG9yO1xuICB9XG4gIGZ1bmN0aW9uIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0KHZhbHVlLCBkb25lKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGRvbmU6IGRvbmVcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIGVudHJpZXMoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUFycmF5SXRlcmF0b3IodGhpcywgQVJSQVlfSVRFUkFUT1JfS0lORF9FTlRSSUVTKTtcbiAgfVxuICBmdW5jdGlvbiBrZXlzKCkge1xuICAgIHJldHVybiBjcmVhdGVBcnJheUl0ZXJhdG9yKHRoaXMsIEFSUkFZX0lURVJBVE9SX0tJTkRfS0VZUyk7XG4gIH1cbiAgZnVuY3Rpb24gdmFsdWVzKCkge1xuICAgIHJldHVybiBjcmVhdGVBcnJheUl0ZXJhdG9yKHRoaXMsIEFSUkFZX0lURVJBVE9SX0tJTkRfVkFMVUVTKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGdldCBlbnRyaWVzKCkge1xuICAgICAgcmV0dXJuIGVudHJpZXM7XG4gICAgfSxcbiAgICBnZXQga2V5cygpIHtcbiAgICAgIHJldHVybiBrZXlzO1xuICAgIH0sXG4gICAgZ2V0IHZhbHVlcygpIHtcbiAgICAgIHJldHVybiB2YWx1ZXM7XG4gICAgfVxuICB9O1xufSk7XG5TeXN0ZW0ucmVnaXN0ZXIoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL25vZGVfbW9kdWxlcy9yc3ZwL2xpYi9yc3ZwL2FzYXBcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9ub2RlX21vZHVsZXMvcnN2cC9saWIvcnN2cC9hc2FwXCI7XG4gIHZhciAkX19kZWZhdWx0ID0gZnVuY3Rpb24gYXNhcChjYWxsYmFjaywgYXJnKSB7XG4gICAgdmFyIGxlbmd0aCA9IHF1ZXVlLnB1c2goW2NhbGxiYWNrLCBhcmddKTtcbiAgICBpZiAobGVuZ3RoID09PSAxKSB7XG4gICAgICBzY2hlZHVsZUZsdXNoKCk7XG4gICAgfVxuICB9O1xuICB2YXIgYnJvd3Nlckdsb2JhbCA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgPyB3aW5kb3cgOiB7fTtcbiAgdmFyIEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyID0gYnJvd3Nlckdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGJyb3dzZXJHbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcbiAgZnVuY3Rpb24gdXNlTmV4dFRpY2soKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhmbHVzaCk7XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiB1c2VNdXRhdGlvbk9ic2VydmVyKCkge1xuICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIoZmx1c2gpO1xuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICAgIG9ic2VydmVyLm9ic2VydmUobm9kZSwge2NoYXJhY3RlckRhdGE6IHRydWV9KTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBub2RlLmRhdGEgPSAoaXRlcmF0aW9ucyA9ICsraXRlcmF0aW9ucyAlIDIpO1xuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gdXNlU2V0VGltZW91dCgpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBzZXRUaW1lb3V0KGZsdXNoLCAxKTtcbiAgICB9O1xuICB9XG4gIHZhciBxdWV1ZSA9IFtdO1xuICBmdW5jdGlvbiBmbHVzaCgpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdHVwbGUgPSBxdWV1ZVtpXTtcbiAgICAgIHZhciBjYWxsYmFjayA9IHR1cGxlWzBdLFxuICAgICAgICAgIGFyZyA9IHR1cGxlWzFdO1xuICAgICAgY2FsbGJhY2soYXJnKTtcbiAgICB9XG4gICAgcXVldWUgPSBbXTtcbiAgfVxuICB2YXIgc2NoZWR1bGVGbHVzaDtcbiAgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiB7fS50b1N0cmluZy5jYWxsKHByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXScpIHtcbiAgICBzY2hlZHVsZUZsdXNoID0gdXNlTmV4dFRpY2soKTtcbiAgfSBlbHNlIGlmIChCcm93c2VyTXV0YXRpb25PYnNlcnZlcikge1xuICAgIHNjaGVkdWxlRmx1c2ggPSB1c2VNdXRhdGlvbk9ic2VydmVyKCk7XG4gIH0gZWxzZSB7XG4gICAgc2NoZWR1bGVGbHVzaCA9IHVzZVNldFRpbWVvdXQoKTtcbiAgfVxuICByZXR1cm4ge2dldCBkZWZhdWx0KCkge1xuICAgICAgcmV0dXJuICRfX2RlZmF1bHQ7XG4gICAgfX07XG59KTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1Byb21pc2VcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvUHJvbWlzZVwiO1xuICB2YXIgYXN5bmMgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9ub2RlX21vZHVsZXMvcnN2cC9saWIvcnN2cC9hc2FwXCIpLmRlZmF1bHQ7XG4gIGZ1bmN0aW9uIGlzUHJvbWlzZSh4KSB7XG4gICAgcmV0dXJuIHggJiYgdHlwZW9mIHggPT09ICdvYmplY3QnICYmIHguc3RhdHVzXyAhPT0gdW5kZWZpbmVkO1xuICB9XG4gIGZ1bmN0aW9uIGNoYWluKHByb21pc2UpIHtcbiAgICB2YXIgb25SZXNvbHZlID0gYXJndW1lbnRzWzFdICE9PSAodm9pZCAwKSA/IGFyZ3VtZW50c1sxXSA6IChmdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4geDtcbiAgICB9KTtcbiAgICB2YXIgb25SZWplY3QgPSBhcmd1bWVudHNbMl0gIT09ICh2b2lkIDApID8gYXJndW1lbnRzWzJdIDogKGZ1bmN0aW9uKGUpIHtcbiAgICAgIHRocm93IGU7XG4gICAgfSk7XG4gICAgdmFyIGRlZmVycmVkID0gZ2V0RGVmZXJyZWQocHJvbWlzZS5jb25zdHJ1Y3Rvcik7XG4gICAgc3dpdGNoIChwcm9taXNlLnN0YXR1c18pIHtcbiAgICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgICB0aHJvdyBUeXBlRXJyb3I7XG4gICAgICBjYXNlICdwZW5kaW5nJzpcbiAgICAgICAgcHJvbWlzZS5vblJlc29sdmVfLnB1c2goW2RlZmVycmVkLCBvblJlc29sdmVdKTtcbiAgICAgICAgcHJvbWlzZS5vblJlamVjdF8ucHVzaChbZGVmZXJyZWQsIG9uUmVqZWN0XSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVzb2x2ZWQnOlxuICAgICAgICBwcm9taXNlUmVhY3QoZGVmZXJyZWQsIG9uUmVzb2x2ZSwgcHJvbWlzZS52YWx1ZV8pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3JlamVjdGVkJzpcbiAgICAgICAgcHJvbWlzZVJlYWN0KGRlZmVycmVkLCBvblJlamVjdCwgcHJvbWlzZS52YWx1ZV8pO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0RGVmZXJyZWQoQykge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICByZXN1bHQucHJvbWlzZSA9IG5ldyBDKChmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJlc3VsdC5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIHJlc3VsdC5yZWplY3QgPSByZWplY3Q7XG4gICAgfSkpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgdmFyIFByb21pc2UgPSBmdW5jdGlvbiBQcm9taXNlKHJlc29sdmVyKSB7XG4gICAgdmFyICRfXzYgPSB0aGlzO1xuICAgIHRoaXMuc3RhdHVzXyA9ICdwZW5kaW5nJztcbiAgICB0aGlzLm9uUmVzb2x2ZV8gPSBbXTtcbiAgICB0aGlzLm9uUmVqZWN0XyA9IFtdO1xuICAgIHJlc29sdmVyKChmdW5jdGlvbih4KSB7XG4gICAgICBwcm9taXNlUmVzb2x2ZSgkX182LCB4KTtcbiAgICB9KSwgKGZ1bmN0aW9uKHIpIHtcbiAgICAgIHByb21pc2VSZWplY3QoJF9fNiwgcik7XG4gICAgfSkpO1xuICB9O1xuICAoJHRyYWNldXJSdW50aW1lLmNyZWF0ZUNsYXNzKShQcm9taXNlLCB7XG4gICAgY2F0Y2g6IGZ1bmN0aW9uKG9uUmVqZWN0KSB7XG4gICAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3QpO1xuICAgIH0sXG4gICAgdGhlbjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb25SZXNvbHZlID0gYXJndW1lbnRzWzBdICE9PSAodm9pZCAwKSA/IGFyZ3VtZW50c1swXSA6IChmdW5jdGlvbih4KSB7XG4gICAgICAgIHJldHVybiB4O1xuICAgICAgfSk7XG4gICAgICB2YXIgb25SZWplY3QgPSBhcmd1bWVudHNbMV07XG4gICAgICB2YXIgJF9fNiA9IHRoaXM7XG4gICAgICB2YXIgY29uc3RydWN0b3IgPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgcmV0dXJuIGNoYWluKHRoaXMsIChmdW5jdGlvbih4KSB7XG4gICAgICAgIHggPSBwcm9taXNlQ29lcmNlKGNvbnN0cnVjdG9yLCB4KTtcbiAgICAgICAgcmV0dXJuIHggPT09ICRfXzYgPyBvblJlamVjdChuZXcgVHlwZUVycm9yKSA6IGlzUHJvbWlzZSh4KSA/IHgudGhlbihvblJlc29sdmUsIG9uUmVqZWN0KSA6IG9uUmVzb2x2ZSh4KTtcbiAgICAgIH0pLCBvblJlamVjdCk7XG4gICAgfVxuICB9LCB7XG4gICAgcmVzb2x2ZTogZnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIG5ldyB0aGlzKChmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgcmVzb2x2ZSh4KTtcbiAgICAgIH0pKTtcbiAgICB9LFxuICAgIHJlamVjdDogZnVuY3Rpb24ocikge1xuICAgICAgcmV0dXJuIG5ldyB0aGlzKChmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgcmVqZWN0KHIpO1xuICAgICAgfSkpO1xuICAgIH0sXG4gICAgY2FzdDogZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKHggaW5zdGFuY2VvZiB0aGlzKVxuICAgICAgICByZXR1cm4geDtcbiAgICAgIGlmIChpc1Byb21pc2UoeCkpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGdldERlZmVycmVkKHRoaXMpO1xuICAgICAgICBjaGFpbih4LCByZXN1bHQucmVzb2x2ZSwgcmVzdWx0LnJlamVjdCk7XG4gICAgICAgIHJldHVybiByZXN1bHQucHJvbWlzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnJlc29sdmUoeCk7XG4gICAgfSxcbiAgICBhbGw6IGZ1bmN0aW9uKHZhbHVlcykge1xuICAgICAgdmFyIGRlZmVycmVkID0gZ2V0RGVmZXJyZWQodGhpcyk7XG4gICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgdmFyIHJlc29sdXRpb25zID0gW107XG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICsrY291bnQ7XG4gICAgICAgICAgdGhpcy5jYXN0KHZhbHVlc1tpXSkudGhlbihmdW5jdGlvbihpLCB4KSB7XG4gICAgICAgICAgICByZXNvbHV0aW9uc1tpXSA9IHg7XG4gICAgICAgICAgICBpZiAoLS1jb3VudCA9PT0gMClcbiAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNvbHV0aW9ucyk7XG4gICAgICAgICAgfS5iaW5kKHVuZGVmaW5lZCwgaSksIChmdW5jdGlvbihyKSB7XG4gICAgICAgICAgICBpZiAoY291bnQgPiAwKVxuICAgICAgICAgICAgICBjb3VudCA9IDA7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3Qocik7XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb3VudCA9PT0gMClcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc29sdXRpb25zKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfSxcbiAgICByYWNlOiBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9IGdldERlZmVycmVkKHRoaXMpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB0aGlzLmNhc3QodmFsdWVzW2ldKS50aGVuKChmdW5jdGlvbih4KSB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHgpO1xuICAgICAgICAgIH0pLCAoZnVuY3Rpb24ocikge1xuICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHIpO1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9XG4gIH0pO1xuICBmdW5jdGlvbiBwcm9taXNlUmVzb2x2ZShwcm9taXNlLCB4KSB7XG4gICAgcHJvbWlzZURvbmUocHJvbWlzZSwgJ3Jlc29sdmVkJywgeCwgcHJvbWlzZS5vblJlc29sdmVfKTtcbiAgfVxuICBmdW5jdGlvbiBwcm9taXNlUmVqZWN0KHByb21pc2UsIHIpIHtcbiAgICBwcm9taXNlRG9uZShwcm9taXNlLCAncmVqZWN0ZWQnLCByLCBwcm9taXNlLm9uUmVqZWN0Xyk7XG4gIH1cbiAgZnVuY3Rpb24gcHJvbWlzZURvbmUocHJvbWlzZSwgc3RhdHVzLCB2YWx1ZSwgcmVhY3Rpb25zKSB7XG4gICAgaWYgKHByb21pc2Uuc3RhdHVzXyAhPT0gJ3BlbmRpbmcnKVxuICAgICAgcmV0dXJuO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVhY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBwcm9taXNlUmVhY3QocmVhY3Rpb25zW2ldWzBdLCByZWFjdGlvbnNbaV1bMV0sIHZhbHVlKTtcbiAgICB9XG4gICAgcHJvbWlzZS5zdGF0dXNfID0gc3RhdHVzO1xuICAgIHByb21pc2UudmFsdWVfID0gdmFsdWU7XG4gICAgcHJvbWlzZS5vblJlc29sdmVfID0gcHJvbWlzZS5vblJlamVjdF8gPSB1bmRlZmluZWQ7XG4gIH1cbiAgZnVuY3Rpb24gcHJvbWlzZVJlYWN0KGRlZmVycmVkLCBoYW5kbGVyLCB4KSB7XG4gICAgYXN5bmMoKGZ1bmN0aW9uKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIHkgPSBoYW5kbGVyKHgpO1xuICAgICAgICBpZiAoeSA9PT0gZGVmZXJyZWQucHJvbWlzZSlcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yO1xuICAgICAgICBlbHNlIGlmIChpc1Byb21pc2UoeSkpXG4gICAgICAgICAgY2hhaW4oeSwgZGVmZXJyZWQucmVzb2x2ZSwgZGVmZXJyZWQucmVqZWN0KTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoeSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAgIH1cbiAgICB9KSk7XG4gIH1cbiAgdmFyIHRoZW5hYmxlU3ltYm9sID0gJ0BAdGhlbmFibGUnO1xuICBmdW5jdGlvbiBwcm9taXNlQ29lcmNlKGNvbnN0cnVjdG9yLCB4KSB7XG4gICAgaWYgKGlzUHJvbWlzZSh4KSkge1xuICAgICAgcmV0dXJuIHg7XG4gICAgfSBlbHNlIGlmICh4ICYmIHR5cGVvZiB4LnRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHZhciBwID0geFt0aGVuYWJsZVN5bWJvbF07XG4gICAgICBpZiAocCkge1xuICAgICAgICByZXR1cm4gcDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9IGdldERlZmVycmVkKGNvbnN0cnVjdG9yKTtcbiAgICAgICAgeFt0aGVuYWJsZVN5bWJvbF0gPSBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHgudGhlbihkZWZlcnJlZC5yZXNvbHZlLCBkZWZlcnJlZC5yZWplY3QpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4geDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtnZXQgUHJvbWlzZSgpIHtcbiAgICAgIHJldHVybiBQcm9taXNlO1xuICAgIH19O1xufSk7XG5TeXN0ZW0ucmVnaXN0ZXIoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9TdHJpbmdcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvU3RyaW5nXCI7XG4gIHZhciAkdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuICB2YXIgJGluZGV4T2YgPSBTdHJpbmcucHJvdG90eXBlLmluZGV4T2Y7XG4gIHZhciAkbGFzdEluZGV4T2YgPSBTdHJpbmcucHJvdG90eXBlLmxhc3RJbmRleE9mO1xuICBmdW5jdGlvbiBzdGFydHNXaXRoKHNlYXJjaCkge1xuICAgIHZhciBzdHJpbmcgPSBTdHJpbmcodGhpcyk7XG4gICAgaWYgKHRoaXMgPT0gbnVsbCB8fCAkdG9TdHJpbmcuY2FsbChzZWFyY2gpID09ICdbb2JqZWN0IFJlZ0V4cF0nKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICB9XG4gICAgdmFyIHN0cmluZ0xlbmd0aCA9IHN0cmluZy5sZW5ndGg7XG4gICAgdmFyIHNlYXJjaFN0cmluZyA9IFN0cmluZyhzZWFyY2gpO1xuICAgIHZhciBzZWFyY2hMZW5ndGggPSBzZWFyY2hTdHJpbmcubGVuZ3RoO1xuICAgIHZhciBwb3NpdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkO1xuICAgIHZhciBwb3MgPSBwb3NpdGlvbiA/IE51bWJlcihwb3NpdGlvbikgOiAwO1xuICAgIGlmIChpc05hTihwb3MpKSB7XG4gICAgICBwb3MgPSAwO1xuICAgIH1cbiAgICB2YXIgc3RhcnQgPSBNYXRoLm1pbihNYXRoLm1heChwb3MsIDApLCBzdHJpbmdMZW5ndGgpO1xuICAgIHJldHVybiAkaW5kZXhPZi5jYWxsKHN0cmluZywgc2VhcmNoU3RyaW5nLCBwb3MpID09IHN0YXJ0O1xuICB9XG4gIGZ1bmN0aW9uIGVuZHNXaXRoKHNlYXJjaCkge1xuICAgIHZhciBzdHJpbmcgPSBTdHJpbmcodGhpcyk7XG4gICAgaWYgKHRoaXMgPT0gbnVsbCB8fCAkdG9TdHJpbmcuY2FsbChzZWFyY2gpID09ICdbb2JqZWN0IFJlZ0V4cF0nKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICB9XG4gICAgdmFyIHN0cmluZ0xlbmd0aCA9IHN0cmluZy5sZW5ndGg7XG4gICAgdmFyIHNlYXJjaFN0cmluZyA9IFN0cmluZyhzZWFyY2gpO1xuICAgIHZhciBzZWFyY2hMZW5ndGggPSBzZWFyY2hTdHJpbmcubGVuZ3RoO1xuICAgIHZhciBwb3MgPSBzdHJpbmdMZW5ndGg7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICB2YXIgcG9zaXRpb24gPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAocG9zaXRpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwb3MgPSBwb3NpdGlvbiA/IE51bWJlcihwb3NpdGlvbikgOiAwO1xuICAgICAgICBpZiAoaXNOYU4ocG9zKSkge1xuICAgICAgICAgIHBvcyA9IDA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGVuZCA9IE1hdGgubWluKE1hdGgubWF4KHBvcywgMCksIHN0cmluZ0xlbmd0aCk7XG4gICAgdmFyIHN0YXJ0ID0gZW5kIC0gc2VhcmNoTGVuZ3RoO1xuICAgIGlmIChzdGFydCA8IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuICRsYXN0SW5kZXhPZi5jYWxsKHN0cmluZywgc2VhcmNoU3RyaW5nLCBzdGFydCkgPT0gc3RhcnQ7XG4gIH1cbiAgZnVuY3Rpb24gY29udGFpbnMoc2VhcmNoKSB7XG4gICAgaWYgKHRoaXMgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIHZhciBzdHJpbmcgPSBTdHJpbmcodGhpcyk7XG4gICAgdmFyIHN0cmluZ0xlbmd0aCA9IHN0cmluZy5sZW5ndGg7XG4gICAgdmFyIHNlYXJjaFN0cmluZyA9IFN0cmluZyhzZWFyY2gpO1xuICAgIHZhciBzZWFyY2hMZW5ndGggPSBzZWFyY2hTdHJpbmcubGVuZ3RoO1xuICAgIHZhciBwb3NpdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkO1xuICAgIHZhciBwb3MgPSBwb3NpdGlvbiA/IE51bWJlcihwb3NpdGlvbikgOiAwO1xuICAgIGlmIChpc05hTihwb3MpKSB7XG4gICAgICBwb3MgPSAwO1xuICAgIH1cbiAgICB2YXIgc3RhcnQgPSBNYXRoLm1pbihNYXRoLm1heChwb3MsIDApLCBzdHJpbmdMZW5ndGgpO1xuICAgIHJldHVybiAkaW5kZXhPZi5jYWxsKHN0cmluZywgc2VhcmNoU3RyaW5nLCBwb3MpICE9IC0xO1xuICB9XG4gIGZ1bmN0aW9uIHJlcGVhdChjb3VudCkge1xuICAgIGlmICh0aGlzID09IG51bGwpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIHZhciBuID0gY291bnQgPyBOdW1iZXIoY291bnQpIDogMDtcbiAgICBpZiAoaXNOYU4obikpIHtcbiAgICAgIG4gPSAwO1xuICAgIH1cbiAgICBpZiAobiA8IDAgfHwgbiA9PSBJbmZpbml0eSkge1xuICAgICAgdGhyb3cgUmFuZ2VFcnJvcigpO1xuICAgIH1cbiAgICBpZiAobiA9PSAwKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSAnJztcbiAgICB3aGlsZSAobi0tKSB7XG4gICAgICByZXN1bHQgKz0gc3RyaW5nO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGZ1bmN0aW9uIGNvZGVQb2ludEF0KHBvc2l0aW9uKSB7XG4gICAgaWYgKHRoaXMgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIHZhciBzdHJpbmcgPSBTdHJpbmcodGhpcyk7XG4gICAgdmFyIHNpemUgPSBzdHJpbmcubGVuZ3RoO1xuICAgIHZhciBpbmRleCA9IHBvc2l0aW9uID8gTnVtYmVyKHBvc2l0aW9uKSA6IDA7XG4gICAgaWYgKGlzTmFOKGluZGV4KSkge1xuICAgICAgaW5kZXggPSAwO1xuICAgIH1cbiAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHNpemUpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHZhciBmaXJzdCA9IHN0cmluZy5jaGFyQ29kZUF0KGluZGV4KTtcbiAgICB2YXIgc2Vjb25kO1xuICAgIGlmIChmaXJzdCA+PSAweEQ4MDAgJiYgZmlyc3QgPD0gMHhEQkZGICYmIHNpemUgPiBpbmRleCArIDEpIHtcbiAgICAgIHNlY29uZCA9IHN0cmluZy5jaGFyQ29kZUF0KGluZGV4ICsgMSk7XG4gICAgICBpZiAoc2Vjb25kID49IDB4REMwMCAmJiBzZWNvbmQgPD0gMHhERkZGKSB7XG4gICAgICAgIHJldHVybiAoZmlyc3QgLSAweEQ4MDApICogMHg0MDAgKyBzZWNvbmQgLSAweERDMDAgKyAweDEwMDAwO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmlyc3Q7XG4gIH1cbiAgZnVuY3Rpb24gcmF3KGNhbGxzaXRlKSB7XG4gICAgdmFyIHJhdyA9IGNhbGxzaXRlLnJhdztcbiAgICB2YXIgbGVuID0gcmF3Lmxlbmd0aCA+Pj4gMDtcbiAgICBpZiAobGVuID09PSAwKVxuICAgICAgcmV0dXJuICcnO1xuICAgIHZhciBzID0gJyc7XG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBzICs9IHJhd1tpXTtcbiAgICAgIGlmIChpICsgMSA9PT0gbGVuKVxuICAgICAgICByZXR1cm4gcztcbiAgICAgIHMgKz0gYXJndW1lbnRzWysraV07XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGZyb21Db2RlUG9pbnQoKSB7XG4gICAgdmFyIGNvZGVVbml0cyA9IFtdO1xuICAgIHZhciBmbG9vciA9IE1hdGguZmxvb3I7XG4gICAgdmFyIGhpZ2hTdXJyb2dhdGU7XG4gICAgdmFyIGxvd1N1cnJvZ2F0ZTtcbiAgICB2YXIgaW5kZXggPSAtMTtcbiAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBpZiAoIWxlbmd0aCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgdmFyIGNvZGVQb2ludCA9IE51bWJlcihhcmd1bWVudHNbaW5kZXhdKTtcbiAgICAgIGlmICghaXNGaW5pdGUoY29kZVBvaW50KSB8fCBjb2RlUG9pbnQgPCAwIHx8IGNvZGVQb2ludCA+IDB4MTBGRkZGIHx8IGZsb29yKGNvZGVQb2ludCkgIT0gY29kZVBvaW50KSB7XG4gICAgICAgIHRocm93IFJhbmdlRXJyb3IoJ0ludmFsaWQgY29kZSBwb2ludDogJyArIGNvZGVQb2ludCk7XG4gICAgICB9XG4gICAgICBpZiAoY29kZVBvaW50IDw9IDB4RkZGRikge1xuICAgICAgICBjb2RlVW5pdHMucHVzaChjb2RlUG9pbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29kZVBvaW50IC09IDB4MTAwMDA7XG4gICAgICAgIGhpZ2hTdXJyb2dhdGUgPSAoY29kZVBvaW50ID4+IDEwKSArIDB4RDgwMDtcbiAgICAgICAgbG93U3Vycm9nYXRlID0gKGNvZGVQb2ludCAlIDB4NDAwKSArIDB4REMwMDtcbiAgICAgICAgY29kZVVuaXRzLnB1c2goaGlnaFN1cnJvZ2F0ZSwgbG93U3Vycm9nYXRlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgY29kZVVuaXRzKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGdldCBzdGFydHNXaXRoKCkge1xuICAgICAgcmV0dXJuIHN0YXJ0c1dpdGg7XG4gICAgfSxcbiAgICBnZXQgZW5kc1dpdGgoKSB7XG4gICAgICByZXR1cm4gZW5kc1dpdGg7XG4gICAgfSxcbiAgICBnZXQgY29udGFpbnMoKSB7XG4gICAgICByZXR1cm4gY29udGFpbnM7XG4gICAgfSxcbiAgICBnZXQgcmVwZWF0KCkge1xuICAgICAgcmV0dXJuIHJlcGVhdDtcbiAgICB9LFxuICAgIGdldCBjb2RlUG9pbnRBdCgpIHtcbiAgICAgIHJldHVybiBjb2RlUG9pbnRBdDtcbiAgICB9LFxuICAgIGdldCByYXcoKSB7XG4gICAgICByZXR1cm4gcmF3O1xuICAgIH0sXG4gICAgZ2V0IGZyb21Db2RlUG9pbnQoKSB7XG4gICAgICByZXR1cm4gZnJvbUNvZGVQb2ludDtcbiAgICB9XG4gIH07XG59KTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3BvbHlmaWxsc1wiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9wb2x5ZmlsbHNcIjtcbiAgdmFyIFByb21pc2UgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvUHJvbWlzZVwiKS5Qcm9taXNlO1xuICB2YXIgJF9fOSA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9TdHJpbmdcIiksXG4gICAgICBjb2RlUG9pbnRBdCA9ICRfXzkuY29kZVBvaW50QXQsXG4gICAgICBjb250YWlucyA9ICRfXzkuY29udGFpbnMsXG4gICAgICBlbmRzV2l0aCA9ICRfXzkuZW5kc1dpdGgsXG4gICAgICBmcm9tQ29kZVBvaW50ID0gJF9fOS5mcm9tQ29kZVBvaW50LFxuICAgICAgcmVwZWF0ID0gJF9fOS5yZXBlYXQsXG4gICAgICByYXcgPSAkX185LnJhdyxcbiAgICAgIHN0YXJ0c1dpdGggPSAkX185LnN0YXJ0c1dpdGg7XG4gIHZhciAkX185ID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL0FycmF5SXRlcmF0b3JcIiksXG4gICAgICBlbnRyaWVzID0gJF9fOS5lbnRyaWVzLFxuICAgICAga2V5cyA9ICRfXzkua2V5cyxcbiAgICAgIHZhbHVlcyA9ICRfXzkudmFsdWVzO1xuICBmdW5jdGlvbiBtYXliZURlZmluZU1ldGhvZChvYmplY3QsIG5hbWUsIHZhbHVlKSB7XG4gICAgaWYgKCEobmFtZSBpbiBvYmplY3QpKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBtYXliZUFkZEZ1bmN0aW9ucyhvYmplY3QsIGZ1bmN0aW9ucykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZnVuY3Rpb25zLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICB2YXIgbmFtZSA9IGZ1bmN0aW9uc1tpXTtcbiAgICAgIHZhciB2YWx1ZSA9IGZ1bmN0aW9uc1tpICsgMV07XG4gICAgICBtYXliZURlZmluZU1ldGhvZChvYmplY3QsIG5hbWUsIHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gcG9seWZpbGxQcm9taXNlKGdsb2JhbCkge1xuICAgIGlmICghZ2xvYmFsLlByb21pc2UpXG4gICAgICBnbG9iYWwuUHJvbWlzZSA9IFByb21pc2U7XG4gIH1cbiAgZnVuY3Rpb24gcG9seWZpbGxTdHJpbmcoU3RyaW5nKSB7XG4gICAgbWF5YmVBZGRGdW5jdGlvbnMoU3RyaW5nLnByb3RvdHlwZSwgWydjb2RlUG9pbnRBdCcsIGNvZGVQb2ludEF0LCAnY29udGFpbnMnLCBjb250YWlucywgJ2VuZHNXaXRoJywgZW5kc1dpdGgsICdzdGFydHNXaXRoJywgc3RhcnRzV2l0aCwgJ3JlcGVhdCcsIHJlcGVhdF0pO1xuICAgIG1heWJlQWRkRnVuY3Rpb25zKFN0cmluZywgWydmcm9tQ29kZVBvaW50JywgZnJvbUNvZGVQb2ludCwgJ3JhdycsIHJhd10pO1xuICB9XG4gIGZ1bmN0aW9uIHBvbHlmaWxsQXJyYXkoQXJyYXksIFN5bWJvbCkge1xuICAgIG1heWJlQWRkRnVuY3Rpb25zKEFycmF5LnByb3RvdHlwZSwgWydlbnRyaWVzJywgZW50cmllcywgJ2tleXMnLCBrZXlzLCAndmFsdWVzJywgdmFsdWVzXSk7XG4gICAgaWYgKFN5bWJvbCAmJiBTeW1ib2wuaXRlcmF0b3IpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcnJheS5wcm90b3R5cGUsIFN5bWJvbC5pdGVyYXRvciwge1xuICAgICAgICB2YWx1ZTogdmFsdWVzLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHBvbHlmaWxsKGdsb2JhbCkge1xuICAgIHBvbHlmaWxsUHJvbWlzZShnbG9iYWwpO1xuICAgIHBvbHlmaWxsU3RyaW5nKGdsb2JhbC5TdHJpbmcpO1xuICAgIHBvbHlmaWxsQXJyYXkoZ2xvYmFsLkFycmF5LCBnbG9iYWwuU3ltYm9sKTtcbiAgfVxuICBwb2x5ZmlsbCh0aGlzKTtcbiAgdmFyIHNldHVwR2xvYmFscyA9ICR0cmFjZXVyUnVudGltZS5zZXR1cEdsb2JhbHM7XG4gICR0cmFjZXVyUnVudGltZS5zZXR1cEdsb2JhbHMgPSBmdW5jdGlvbihnbG9iYWwpIHtcbiAgICBzZXR1cEdsb2JhbHMoZ2xvYmFsKTtcbiAgICBwb2x5ZmlsbChnbG9iYWwpO1xuICB9O1xuICByZXR1cm4ge307XG59KTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGwtaW1wb3J0XCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGwtaW1wb3J0XCI7XG4gIHZhciAkX18xMSA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9wb2x5ZmlsbHNcIik7XG4gIHJldHVybiB7fTtcbn0pO1xuU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGwtaW1wb3J0XCIgKyAnJyk7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2luc2VydC1tb2R1bGUtZ2xvYmFscy9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMudGVzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG59OyIsIlwidXNlIHN0cmljdFwiO1xudmFyIHR5cGVzID0gW1xuICAgIHJlcXVpcmUoXCIuL25leHRUaWNrXCIpLFxuICAgIHJlcXVpcmUoXCIuL211dGF0aW9uXCIpLFxuICAgIHJlcXVpcmUoXCIuL3Bvc3RNZXNzYWdlXCIpLFxuICAgIHJlcXVpcmUoXCIuL21lc3NhZ2VDaGFubmVsXCIpLFxuICAgIHJlcXVpcmUoXCIuL3N0YXRlQ2hhbmdlXCIpLFxuICAgIHJlcXVpcmUoXCIuL3RpbWVvdXRcIilcbl07XG52YXIgaGFuZGxlclF1ZXVlID0gW107XG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgdGFzayxcbiAgICAgICAgaW5uZXJRdWV1ZSA9IGhhbmRsZXJRdWV1ZTtcblx0aGFuZGxlclF1ZXVlID0gW107XG5cdC8qanNsaW50IGJvc3M6IHRydWUgKi9cblx0d2hpbGUgKHRhc2sgPSBpbm5lclF1ZXVlW2krK10pIHtcblx0XHR0YXNrKCk7XG5cdH1cbn1cbnZhciBuZXh0VGljaztcbnZhciBpID0gLTE7XG52YXIgbGVuID0gdHlwZXMubGVuZ3RoO1xud2hpbGUgKCsrIGkgPCBsZW4pIHtcbiAgICBpZiAodHlwZXNbaV0udGVzdCgpKSB7XG4gICAgICAgIG5leHRUaWNrID0gdHlwZXNbaV0uaW5zdGFsbChkcmFpblF1ZXVlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGFzaykge1xuICAgIHZhciBsZW4sIGksIGFyZ3M7XG4gICAgdmFyIG5UYXNrID0gdGFzaztcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgdHlwZW9mIHRhc2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIHdoaWxlICgrK2kgPCBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgICAgICBuVGFzayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRhc2suYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgaWYgKChsZW4gPSBoYW5kbGVyUXVldWUucHVzaChuVGFzaykpID09PSAxKSB7XG4gICAgICAgIG5leHRUaWNrKGRyYWluUXVldWUpO1xuICAgIH1cbiAgICByZXR1cm4gbGVuO1xufTtcbm1vZHVsZS5leHBvcnRzLmNsZWFyID0gZnVuY3Rpb24gKG4pIHtcbiAgICBpZiAobiA8PSBoYW5kbGVyUXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGhhbmRsZXJRdWV1ZVtuIC0gMV0gPSBmdW5jdGlvbiAoKSB7fTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMudGVzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdHlwZW9mIGdsb2JhbC5NZXNzYWdlQ2hhbm5lbCAhPT0gXCJ1bmRlZmluZWRcIjtcbn07XG5cbmV4cG9ydHMuaW5zdGFsbCA9IGZ1bmN0aW9uIChmdW5jKSB7XG4gICAgdmFyIGNoYW5uZWwgPSBuZXcgZ2xvYmFsLk1lc3NhZ2VDaGFubmVsKCk7XG4gICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBmdW5jO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoMCk7XG4gICAgfTtcbn07XG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcblwidXNlIHN0cmljdFwiO1xuLy9iYXNlZCBvZmYgcnN2cFxuLy9odHRwczovL2dpdGh1Yi5jb20vdGlsZGVpby9yc3ZwLmpzL2Jsb2IvbWFzdGVyL2xpYi9yc3ZwL2FzeW5jLmpzXG5cbnZhciBNdXRhdGlvbk9ic2VydmVyID0gZ2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgZ2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG5cbmV4cG9ydHMudGVzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gTXV0YXRpb25PYnNlcnZlcjtcbn07XG5cbmV4cG9ydHMuaW5zdGFsbCA9IGZ1bmN0aW9uIChoYW5kbGUpIHtcbiAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihoYW5kbGUpO1xuICAgIHZhciBlbGVtZW50ID0gZ2xvYmFsLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShlbGVtZW50LCB7IGF0dHJpYnV0ZXM6IHRydWUgfSk7XG5cbiAgICAvLyBDaHJvbWUgTWVtb3J5IExlYWs6IGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD05MzY2MVxuICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKFwidW5sb2FkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICBvYnNlcnZlciA9IG51bGw7XG4gICAgfSwgZmFsc2UpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZHJhaW5RdWV1ZVwiLCBcImRyYWluUXVldWVcIik7XG4gICAgfTtcbn07XG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcblwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy50ZXN0ID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIFRoZSB0ZXN0IGFnYWluc3QgYGltcG9ydFNjcmlwdHNgIHByZXZlbnRzIHRoaXMgaW1wbGVtZW50YXRpb24gZnJvbSBiZWluZyBpbnN0YWxsZWQgaW5zaWRlIGEgd2ViIHdvcmtlcixcbiAgICAvLyB3aGVyZSBgZ2xvYmFsLnBvc3RNZXNzYWdlYCBtZWFucyBzb21ldGhpbmcgY29tcGxldGVseSBkaWZmZXJlbnQgYW5kIGNhblwidCBiZSB1c2VkIGZvciB0aGlzIHB1cnBvc2UuXG5cbiAgICBpZiAoIWdsb2JhbC5wb3N0TWVzc2FnZSB8fCBnbG9iYWwuaW1wb3J0U2NyaXB0cykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSB0cnVlO1xuICAgIHZhciBvbGRPbk1lc3NhZ2UgPSBnbG9iYWwub25tZXNzYWdlO1xuICAgIGdsb2JhbC5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSBmYWxzZTtcbiAgICB9O1xuICAgIGdsb2JhbC5wb3N0TWVzc2FnZShcIlwiLCBcIipcIik7XG4gICAgZ2xvYmFsLm9ubWVzc2FnZSA9IG9sZE9uTWVzc2FnZTtcblxuICAgIHJldHVybiBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzO1xufTtcblxuZXhwb3J0cy5pbnN0YWxsID0gZnVuY3Rpb24gKGZ1bmMpIHtcbiAgICB2YXIgY29kZVdvcmQgPSBcImNvbS5jYWx2aW5tZXRjYWxmLnNldEltbWVkaWF0ZVwiICsgTWF0aC5yYW5kb20oKTtcbiAgICBmdW5jdGlvbiBnbG9iYWxNZXNzYWdlKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5zb3VyY2UgPT09IGdsb2JhbCAmJiBldmVudC5kYXRhID09PSBjb2RlV29yZCkge1xuICAgICAgICAgICAgZnVuYygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgZ2xvYmFsTWVzc2FnZSwgZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGdsb2JhbC5hdHRhY2hFdmVudChcIm9ubWVzc2FnZVwiLCBnbG9iYWxNZXNzYWdlKTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKGNvZGVXb3JkLCBcIipcIik7XG4gICAgfTtcbn07XG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcblwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLnRlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFwiZG9jdW1lbnRcIiBpbiBnbG9iYWwgJiYgXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIiBpbiBnbG9iYWwuZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbn07XG5cbmV4cG9ydHMuaW5zdGFsbCA9IGZ1bmN0aW9uIChoYW5kbGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIC8vIENyZWF0ZSBhIDxzY3JpcHQ+IGVsZW1lbnQ7IGl0cyByZWFkeXN0YXRlY2hhbmdlIGV2ZW50IHdpbGwgYmUgZmlyZWQgYXN5bmNocm9ub3VzbHkgb25jZSBpdCBpcyBpbnNlcnRlZFxuICAgICAgICAvLyBpbnRvIHRoZSBkb2N1bWVudC4gRG8gc28sIHRodXMgcXVldWluZyB1cCB0aGUgdGFzay4gUmVtZW1iZXIgdG8gY2xlYW4gdXAgb25jZSBpdCdzIGJlZW4gY2FsbGVkLlxuICAgICAgICB2YXIgc2NyaXB0RWwgPSBnbG9iYWwuZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgc2NyaXB0RWwub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaGFuZGxlKCk7XG5cbiAgICAgICAgICAgIHNjcmlwdEVsLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgICAgICAgICBzY3JpcHRFbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdEVsKTtcbiAgICAgICAgICAgIHNjcmlwdEVsID0gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgZ2xvYmFsLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hcHBlbmRDaGlsZChzY3JpcHRFbCk7XG5cbiAgICAgICAgcmV0dXJuIGhhbmRsZTtcbiAgICB9O1xufTtcbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLnRlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRydWU7XG59O1xuXG5leHBvcnRzLmluc3RhbGwgPSBmdW5jdGlvbiAodCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNldFRpbWVvdXQodCwgMCk7XG4gICAgfTtcbn07IiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuIWZ1bmN0aW9uKGUpe2lmKFwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzKW1vZHVsZS5leHBvcnRzPWUoKTtlbHNlIGlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZClkZWZpbmUoZSk7ZWxzZXt2YXIgZjtcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P2Y9d2luZG93OlwidW5kZWZpbmVkXCIhPXR5cGVvZiBnbG9iYWw/Zj1nbG9iYWw6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGYmJihmPXNlbGYpLGYuamFkZT1lKCl9fShmdW5jdGlvbigpe3ZhciBkZWZpbmUsbW9kdWxlLGV4cG9ydHM7cmV0dXJuIChmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pKHsxOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBNZXJnZSB0d28gYXR0cmlidXRlIG9iamVjdHMgZ2l2aW5nIHByZWNlZGVuY2VcbiAqIHRvIHZhbHVlcyBpbiBvYmplY3QgYGJgLiBDbGFzc2VzIGFyZSBzcGVjaWFsLWNhc2VkXG4gKiBhbGxvd2luZyBmb3IgYXJyYXlzIGFuZCBtZXJnaW5nL2pvaW5pbmcgYXBwcm9wcmlhdGVseVxuICogcmVzdWx0aW5nIGluIGEgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhXG4gKiBAcGFyYW0ge09iamVjdH0gYlxuICogQHJldHVybiB7T2JqZWN0fSBhXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLm1lcmdlID0gZnVuY3Rpb24gbWVyZ2UoYSwgYikge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHZhciBhdHRycyA9IGFbMF07XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhdHRycyA9IG1lcmdlKGF0dHJzLCBhW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIGF0dHJzO1xuICB9XG4gIHZhciBhYyA9IGFbJ2NsYXNzJ107XG4gIHZhciBiYyA9IGJbJ2NsYXNzJ107XG5cbiAgaWYgKGFjIHx8IGJjKSB7XG4gICAgYWMgPSBhYyB8fCBbXTtcbiAgICBiYyA9IGJjIHx8IFtdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShhYykpIGFjID0gW2FjXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYmMpKSBiYyA9IFtiY107XG4gICAgYVsnY2xhc3MnXSA9IGFjLmNvbmNhdChiYykuZmlsdGVyKG51bGxzKTtcbiAgfVxuXG4gIGZvciAodmFyIGtleSBpbiBiKSB7XG4gICAgaWYgKGtleSAhPSAnY2xhc3MnKSB7XG4gICAgICBhW2tleV0gPSBiW2tleV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGE7XG59O1xuXG4vKipcbiAqIEZpbHRlciBudWxsIGB2YWxgcy5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG51bGxzKHZhbCkge1xuICByZXR1cm4gdmFsICE9IG51bGwgJiYgdmFsICE9PSAnJztcbn1cblxuLyoqXG4gKiBqb2luIGFycmF5IGFzIGNsYXNzZXMuXG4gKlxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5qb2luQ2xhc3NlcyA9IGpvaW5DbGFzc2VzO1xuZnVuY3Rpb24gam9pbkNsYXNzZXModmFsKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KHZhbCkgPyB2YWwubWFwKGpvaW5DbGFzc2VzKS5maWx0ZXIobnVsbHMpLmpvaW4oJyAnKSA6IHZhbDtcbn1cblxuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGNsYXNzZXMuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gY2xhc3Nlc1xuICogQHBhcmFtIHtBcnJheS48Qm9vbGVhbj59IGVzY2FwZWRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5jbHMgPSBmdW5jdGlvbiBjbHMoY2xhc3NlcywgZXNjYXBlZCkge1xuICB2YXIgYnVmID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChlc2NhcGVkICYmIGVzY2FwZWRbaV0pIHtcbiAgICAgIGJ1Zi5wdXNoKGV4cG9ydHMuZXNjYXBlKGpvaW5DbGFzc2VzKFtjbGFzc2VzW2ldXSkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnVmLnB1c2goam9pbkNsYXNzZXMoY2xhc3Nlc1tpXSkpO1xuICAgIH1cbiAgfVxuICB2YXIgdGV4dCA9IGpvaW5DbGFzc2VzKGJ1Zik7XG4gIGlmICh0ZXh0Lmxlbmd0aCkge1xuICAgIHJldHVybiAnIGNsYXNzPVwiJyArIHRleHQgKyAnXCInO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnJztcbiAgfVxufTtcblxuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGF0dHJpYnV0ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGVzY2FwZWRcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdGVyc2VcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5hdHRyID0gZnVuY3Rpb24gYXR0cihrZXksIHZhbCwgZXNjYXBlZCwgdGVyc2UpIHtcbiAgaWYgKCdib29sZWFuJyA9PSB0eXBlb2YgdmFsIHx8IG51bGwgPT0gdmFsKSB7XG4gICAgaWYgKHZhbCkge1xuICAgICAgcmV0dXJuICcgJyArICh0ZXJzZSA/IGtleSA6IGtleSArICc9XCInICsga2V5ICsgJ1wiJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH0gZWxzZSBpZiAoMCA9PSBrZXkuaW5kZXhPZignZGF0YScpICYmICdzdHJpbmcnICE9IHR5cGVvZiB2YWwpIHtcbiAgICByZXR1cm4gJyAnICsga2V5ICsgXCI9J1wiICsgSlNPTi5zdHJpbmdpZnkodmFsKS5yZXBsYWNlKC8nL2csICcmYXBvczsnKSArIFwiJ1wiO1xuICB9IGVsc2UgaWYgKGVzY2FwZWQpIHtcbiAgICByZXR1cm4gJyAnICsga2V5ICsgJz1cIicgKyBleHBvcnRzLmVzY2FwZSh2YWwpICsgJ1wiJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJyAnICsga2V5ICsgJz1cIicgKyB2YWwgKyAnXCInO1xuICB9XG59O1xuXG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gYXR0cmlidXRlcyBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtPYmplY3R9IGVzY2FwZWRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5hdHRycyA9IGZ1bmN0aW9uIGF0dHJzKG9iaiwgdGVyc2Upe1xuICB2YXIgYnVmID0gW107XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuXG4gIGlmIChrZXlzLmxlbmd0aCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV1cbiAgICAgICAgLCB2YWwgPSBvYmpba2V5XTtcblxuICAgICAgaWYgKCdjbGFzcycgPT0ga2V5KSB7XG4gICAgICAgIGlmICh2YWwgPSBqb2luQ2xhc3Nlcyh2YWwpKSB7XG4gICAgICAgICAgYnVmLnB1c2goJyAnICsga2V5ICsgJz1cIicgKyB2YWwgKyAnXCInKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnVmLnB1c2goZXhwb3J0cy5hdHRyKGtleSwgdmFsLCBmYWxzZSwgdGVyc2UpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmLmpvaW4oJycpO1xufTtcblxuLyoqXG4gKiBFc2NhcGUgdGhlIGdpdmVuIHN0cmluZyBvZiBgaHRtbGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGh0bWxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMuZXNjYXBlID0gZnVuY3Rpb24gZXNjYXBlKGh0bWwpe1xuICB2YXIgcmVzdWx0ID0gU3RyaW5nKGh0bWwpXG4gICAgLnJlcGxhY2UoLyYvZywgJyZhbXA7JylcbiAgICAucmVwbGFjZSgvPC9nLCAnJmx0OycpXG4gICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKVxuICAgIC5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyk7XG4gIGlmIChyZXN1bHQgPT09ICcnICsgaHRtbCkgcmV0dXJuIGh0bWw7XG4gIGVsc2UgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogUmUtdGhyb3cgdGhlIGdpdmVuIGBlcnJgIGluIGNvbnRleHQgdG8gdGhlXG4gKiB0aGUgamFkZSBpbiBgZmlsZW5hbWVgIGF0IHRoZSBnaXZlbiBgbGluZW5vYC5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlbmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IGxpbmVub1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5yZXRocm93ID0gZnVuY3Rpb24gcmV0aHJvdyhlcnIsIGZpbGVuYW1lLCBsaW5lbm8sIHN0cil7XG4gIGlmICghKGVyciBpbnN0YW5jZW9mIEVycm9yKSkgdGhyb3cgZXJyO1xuICBpZiAoKHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgfHwgIWZpbGVuYW1lKSAmJiAhc3RyKSB7XG4gICAgZXJyLm1lc3NhZ2UgKz0gJyBvbiBsaW5lICcgKyBsaW5lbm87XG4gICAgdGhyb3cgZXJyO1xuICB9XG4gIHRyeSB7XG4gICAgc3RyID0gIHN0ciB8fCBfZGVyZXFfKCdmcycpLnJlYWRGaWxlU3luYyhmaWxlbmFtZSwgJ3V0ZjgnKVxuICB9IGNhdGNoIChleCkge1xuICAgIHJldGhyb3coZXJyLCBudWxsLCBsaW5lbm8pXG4gIH1cbiAgdmFyIGNvbnRleHQgPSAzXG4gICAgLCBsaW5lcyA9IHN0ci5zcGxpdCgnXFxuJylcbiAgICAsIHN0YXJ0ID0gTWF0aC5tYXgobGluZW5vIC0gY29udGV4dCwgMClcbiAgICAsIGVuZCA9IE1hdGgubWluKGxpbmVzLmxlbmd0aCwgbGluZW5vICsgY29udGV4dCk7XG5cbiAgLy8gRXJyb3IgY29udGV4dFxuICB2YXIgY29udGV4dCA9IGxpbmVzLnNsaWNlKHN0YXJ0LCBlbmQpLm1hcChmdW5jdGlvbihsaW5lLCBpKXtcbiAgICB2YXIgY3VyciA9IGkgKyBzdGFydCArIDE7XG4gICAgcmV0dXJuIChjdXJyID09IGxpbmVubyA/ICcgID4gJyA6ICcgICAgJylcbiAgICAgICsgY3VyclxuICAgICAgKyAnfCAnXG4gICAgICArIGxpbmU7XG4gIH0pLmpvaW4oJ1xcbicpO1xuXG4gIC8vIEFsdGVyIGV4Y2VwdGlvbiBtZXNzYWdlXG4gIGVyci5wYXRoID0gZmlsZW5hbWU7XG4gIGVyci5tZXNzYWdlID0gKGZpbGVuYW1lIHx8ICdKYWRlJykgKyAnOicgKyBsaW5lbm9cbiAgICArICdcXG4nICsgY29udGV4dCArICdcXG5cXG4nICsgZXJyLm1lc3NhZ2U7XG4gIHRocm93IGVycjtcbn07XG5cbn0se1wiZnNcIjoyfV0sMjpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG5cbn0se31dfSx7fSxbMV0pXG4oMSlcbn0pO1xufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKEJ1ZmZlcil7XG4vLyAgICAgdXVpZC5qc1xuLy9cbi8vICAgICBDb3B5cmlnaHQgKGMpIDIwMTAtMjAxMiBSb2JlcnQgS2llZmZlclxuLy8gICAgIE1JVCBMaWNlbnNlIC0gaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBfZ2xvYmFsID0gdGhpcztcblxuICAvLyBVbmlxdWUgSUQgY3JlYXRpb24gcmVxdWlyZXMgYSBoaWdoIHF1YWxpdHkgcmFuZG9tICMgZ2VuZXJhdG9yLiAgV2UgZmVhdHVyZVxuICAvLyBkZXRlY3QgdG8gZGV0ZXJtaW5lIHRoZSBiZXN0IFJORyBzb3VyY2UsIG5vcm1hbGl6aW5nIHRvIGEgZnVuY3Rpb24gdGhhdFxuICAvLyByZXR1cm5zIDEyOC1iaXRzIG9mIHJhbmRvbW5lc3MsIHNpbmNlIHRoYXQncyB3aGF0J3MgdXN1YWxseSByZXF1aXJlZFxuICB2YXIgX3JuZztcblxuICAvLyBOb2RlLmpzIGNyeXB0by1iYXNlZCBSTkcgLSBodHRwOi8vbm9kZWpzLm9yZy9kb2NzL3YwLjYuMi9hcGkvY3J5cHRvLmh0bWxcbiAgLy9cbiAgLy8gTW9kZXJhdGVseSBmYXN0LCBoaWdoIHF1YWxpdHlcbiAgaWYgKHR5cGVvZihyZXF1aXJlKSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBfcmIgPSByZXF1aXJlKCdjcnlwdG8nKS5yYW5kb21CeXRlcztcbiAgICAgIF9ybmcgPSBfcmIgJiYgZnVuY3Rpb24oKSB7cmV0dXJuIF9yYigxNik7fTtcbiAgICB9IGNhdGNoKGUpIHt9XG4gIH1cblxuICBpZiAoIV9ybmcgJiYgX2dsb2JhbC5jcnlwdG8gJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcykge1xuICAgIC8vIFdIQVRXRyBjcnlwdG8tYmFzZWQgUk5HIC0gaHR0cDovL3dpa2kud2hhdHdnLm9yZy93aWtpL0NyeXB0b1xuICAgIC8vXG4gICAgLy8gTW9kZXJhdGVseSBmYXN0LCBoaWdoIHF1YWxpdHlcbiAgICB2YXIgX3JuZHM4ID0gbmV3IFVpbnQ4QXJyYXkoMTYpO1xuICAgIF9ybmcgPSBmdW5jdGlvbiB3aGF0d2dSTkcoKSB7XG4gICAgICBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKF9ybmRzOCk7XG4gICAgICByZXR1cm4gX3JuZHM4O1xuICAgIH07XG4gIH1cblxuICBpZiAoIV9ybmcpIHtcbiAgICAvLyBNYXRoLnJhbmRvbSgpLWJhc2VkIChSTkcpXG4gICAgLy9cbiAgICAvLyBJZiBhbGwgZWxzZSBmYWlscywgdXNlIE1hdGgucmFuZG9tKCkuICBJdCdzIGZhc3QsIGJ1dCBpcyBvZiB1bnNwZWNpZmllZFxuICAgIC8vIHF1YWxpdHkuXG4gICAgdmFyICBfcm5kcyA9IG5ldyBBcnJheSgxNik7XG4gICAgX3JuZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIHI7IGkgPCAxNjsgaSsrKSB7XG4gICAgICAgIGlmICgoaSAmIDB4MDMpID09PSAwKSByID0gTWF0aC5yYW5kb20oKSAqIDB4MTAwMDAwMDAwO1xuICAgICAgICBfcm5kc1tpXSA9IHIgPj4+ICgoaSAmIDB4MDMpIDw8IDMpICYgMHhmZjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF9ybmRzO1xuICAgIH07XG4gIH1cblxuICAvLyBCdWZmZXIgY2xhc3MgdG8gdXNlXG4gIHZhciBCdWZmZXJDbGFzcyA9IHR5cGVvZihCdWZmZXIpID09ICdmdW5jdGlvbicgPyBCdWZmZXIgOiBBcnJheTtcblxuICAvLyBNYXBzIGZvciBudW1iZXIgPC0+IGhleCBzdHJpbmcgY29udmVyc2lvblxuICB2YXIgX2J5dGVUb0hleCA9IFtdO1xuICB2YXIgX2hleFRvQnl0ZSA9IHt9O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgaSsrKSB7XG4gICAgX2J5dGVUb0hleFtpXSA9IChpICsgMHgxMDApLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSk7XG4gICAgX2hleFRvQnl0ZVtfYnl0ZVRvSGV4W2ldXSA9IGk7XG4gIH1cblxuICAvLyAqKmBwYXJzZSgpYCAtIFBhcnNlIGEgVVVJRCBpbnRvIGl0J3MgY29tcG9uZW50IGJ5dGVzKipcbiAgZnVuY3Rpb24gcGFyc2UocywgYnVmLCBvZmZzZXQpIHtcbiAgICB2YXIgaSA9IChidWYgJiYgb2Zmc2V0KSB8fCAwLCBpaSA9IDA7XG5cbiAgICBidWYgPSBidWYgfHwgW107XG4gICAgcy50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1swLTlhLWZdezJ9L2csIGZ1bmN0aW9uKG9jdCkge1xuICAgICAgaWYgKGlpIDwgMTYpIHsgLy8gRG9uJ3Qgb3ZlcmZsb3chXG4gICAgICAgIGJ1ZltpICsgaWkrK10gPSBfaGV4VG9CeXRlW29jdF07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBaZXJvIG91dCByZW1haW5pbmcgYnl0ZXMgaWYgc3RyaW5nIHdhcyBzaG9ydFxuICAgIHdoaWxlIChpaSA8IDE2KSB7XG4gICAgICBidWZbaSArIGlpKytdID0gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gYnVmO1xuICB9XG5cbiAgLy8gKipgdW5wYXJzZSgpYCAtIENvbnZlcnQgVVVJRCBieXRlIGFycmF5IChhbGEgcGFyc2UoKSkgaW50byBhIHN0cmluZyoqXG4gIGZ1bmN0aW9uIHVucGFyc2UoYnVmLCBvZmZzZXQpIHtcbiAgICB2YXIgaSA9IG9mZnNldCB8fCAwLCBidGggPSBfYnl0ZVRvSGV4O1xuICAgIHJldHVybiAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gK1xuICAgICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gKyAnLScgK1xuICAgICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gKyAnLScgK1xuICAgICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gKyAnLScgK1xuICAgICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gKyAnLScgK1xuICAgICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gK1xuICAgICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gK1xuICAgICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV07XG4gIH1cblxuICAvLyAqKmB2MSgpYCAtIEdlbmVyYXRlIHRpbWUtYmFzZWQgVVVJRCoqXG4gIC8vXG4gIC8vIEluc3BpcmVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9MaW9zSy9VVUlELmpzXG4gIC8vIGFuZCBodHRwOi8vZG9jcy5weXRob24ub3JnL2xpYnJhcnkvdXVpZC5odG1sXG5cbiAgLy8gcmFuZG9tICMncyB3ZSBuZWVkIHRvIGluaXQgbm9kZSBhbmQgY2xvY2tzZXFcbiAgdmFyIF9zZWVkQnl0ZXMgPSBfcm5nKCk7XG5cbiAgLy8gUGVyIDQuNSwgY3JlYXRlIGFuZCA0OC1iaXQgbm9kZSBpZCwgKDQ3IHJhbmRvbSBiaXRzICsgbXVsdGljYXN0IGJpdCA9IDEpXG4gIHZhciBfbm9kZUlkID0gW1xuICAgIF9zZWVkQnl0ZXNbMF0gfCAweDAxLFxuICAgIF9zZWVkQnl0ZXNbMV0sIF9zZWVkQnl0ZXNbMl0sIF9zZWVkQnl0ZXNbM10sIF9zZWVkQnl0ZXNbNF0sIF9zZWVkQnl0ZXNbNV1cbiAgXTtcblxuICAvLyBQZXIgNC4yLjIsIHJhbmRvbWl6ZSAoMTQgYml0KSBjbG9ja3NlcVxuICB2YXIgX2Nsb2Nrc2VxID0gKF9zZWVkQnl0ZXNbNl0gPDwgOCB8IF9zZWVkQnl0ZXNbN10pICYgMHgzZmZmO1xuXG4gIC8vIFByZXZpb3VzIHV1aWQgY3JlYXRpb24gdGltZVxuICB2YXIgX2xhc3RNU2VjcyA9IDAsIF9sYXN0TlNlY3MgPSAwO1xuXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYnJvb2ZhL25vZGUtdXVpZCBmb3IgQVBJIGRldGFpbHNcbiAgZnVuY3Rpb24gdjEob3B0aW9ucywgYnVmLCBvZmZzZXQpIHtcbiAgICB2YXIgaSA9IGJ1ZiAmJiBvZmZzZXQgfHwgMDtcbiAgICB2YXIgYiA9IGJ1ZiB8fCBbXTtcblxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgdmFyIGNsb2Nrc2VxID0gb3B0aW9ucy5jbG9ja3NlcSAhPSBudWxsID8gb3B0aW9ucy5jbG9ja3NlcSA6IF9jbG9ja3NlcTtcblxuICAgIC8vIFVVSUQgdGltZXN0YW1wcyBhcmUgMTAwIG5hbm8tc2Vjb25kIHVuaXRzIHNpbmNlIHRoZSBHcmVnb3JpYW4gZXBvY2gsXG4gICAgLy8gKDE1ODItMTAtMTUgMDA6MDApLiAgSlNOdW1iZXJzIGFyZW4ndCBwcmVjaXNlIGVub3VnaCBmb3IgdGhpcywgc29cbiAgICAvLyB0aW1lIGlzIGhhbmRsZWQgaW50ZXJuYWxseSBhcyAnbXNlY3MnIChpbnRlZ2VyIG1pbGxpc2Vjb25kcykgYW5kICduc2VjcydcbiAgICAvLyAoMTAwLW5hbm9zZWNvbmRzIG9mZnNldCBmcm9tIG1zZWNzKSBzaW5jZSB1bml4IGVwb2NoLCAxOTcwLTAxLTAxIDAwOjAwLlxuICAgIHZhciBtc2VjcyA9IG9wdGlvbnMubXNlY3MgIT0gbnVsbCA/IG9wdGlvbnMubXNlY3MgOiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgIC8vIFBlciA0LjIuMS4yLCB1c2UgY291bnQgb2YgdXVpZCdzIGdlbmVyYXRlZCBkdXJpbmcgdGhlIGN1cnJlbnQgY2xvY2tcbiAgICAvLyBjeWNsZSB0byBzaW11bGF0ZSBoaWdoZXIgcmVzb2x1dGlvbiBjbG9ja1xuICAgIHZhciBuc2VjcyA9IG9wdGlvbnMubnNlY3MgIT0gbnVsbCA/IG9wdGlvbnMubnNlY3MgOiBfbGFzdE5TZWNzICsgMTtcblxuICAgIC8vIFRpbWUgc2luY2UgbGFzdCB1dWlkIGNyZWF0aW9uIChpbiBtc2VjcylcbiAgICB2YXIgZHQgPSAobXNlY3MgLSBfbGFzdE1TZWNzKSArIChuc2VjcyAtIF9sYXN0TlNlY3MpLzEwMDAwO1xuXG4gICAgLy8gUGVyIDQuMi4xLjIsIEJ1bXAgY2xvY2tzZXEgb24gY2xvY2sgcmVncmVzc2lvblxuICAgIGlmIChkdCA8IDAgJiYgb3B0aW9ucy5jbG9ja3NlcSA9PSBudWxsKSB7XG4gICAgICBjbG9ja3NlcSA9IGNsb2Nrc2VxICsgMSAmIDB4M2ZmZjtcbiAgICB9XG5cbiAgICAvLyBSZXNldCBuc2VjcyBpZiBjbG9jayByZWdyZXNzZXMgKG5ldyBjbG9ja3NlcSkgb3Igd2UndmUgbW92ZWQgb250byBhIG5ld1xuICAgIC8vIHRpbWUgaW50ZXJ2YWxcbiAgICBpZiAoKGR0IDwgMCB8fCBtc2VjcyA+IF9sYXN0TVNlY3MpICYmIG9wdGlvbnMubnNlY3MgPT0gbnVsbCkge1xuICAgICAgbnNlY3MgPSAwO1xuICAgIH1cblxuICAgIC8vIFBlciA0LjIuMS4yIFRocm93IGVycm9yIGlmIHRvbyBtYW55IHV1aWRzIGFyZSByZXF1ZXN0ZWRcbiAgICBpZiAobnNlY3MgPj0gMTAwMDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigndXVpZC52MSgpOiBDYW5cXCd0IGNyZWF0ZSBtb3JlIHRoYW4gMTBNIHV1aWRzL3NlYycpO1xuICAgIH1cblxuICAgIF9sYXN0TVNlY3MgPSBtc2VjcztcbiAgICBfbGFzdE5TZWNzID0gbnNlY3M7XG4gICAgX2Nsb2Nrc2VxID0gY2xvY2tzZXE7XG5cbiAgICAvLyBQZXIgNC4xLjQgLSBDb252ZXJ0IGZyb20gdW5peCBlcG9jaCB0byBHcmVnb3JpYW4gZXBvY2hcbiAgICBtc2VjcyArPSAxMjIxOTI5MjgwMDAwMDtcblxuICAgIC8vIGB0aW1lX2xvd2BcbiAgICB2YXIgdGwgPSAoKG1zZWNzICYgMHhmZmZmZmZmKSAqIDEwMDAwICsgbnNlY3MpICUgMHgxMDAwMDAwMDA7XG4gICAgYltpKytdID0gdGwgPj4+IDI0ICYgMHhmZjtcbiAgICBiW2krK10gPSB0bCA+Pj4gMTYgJiAweGZmO1xuICAgIGJbaSsrXSA9IHRsID4+PiA4ICYgMHhmZjtcbiAgICBiW2krK10gPSB0bCAmIDB4ZmY7XG5cbiAgICAvLyBgdGltZV9taWRgXG4gICAgdmFyIHRtaCA9IChtc2VjcyAvIDB4MTAwMDAwMDAwICogMTAwMDApICYgMHhmZmZmZmZmO1xuICAgIGJbaSsrXSA9IHRtaCA+Pj4gOCAmIDB4ZmY7XG4gICAgYltpKytdID0gdG1oICYgMHhmZjtcblxuICAgIC8vIGB0aW1lX2hpZ2hfYW5kX3ZlcnNpb25gXG4gICAgYltpKytdID0gdG1oID4+PiAyNCAmIDB4ZiB8IDB4MTA7IC8vIGluY2x1ZGUgdmVyc2lvblxuICAgIGJbaSsrXSA9IHRtaCA+Pj4gMTYgJiAweGZmO1xuXG4gICAgLy8gYGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWRgIChQZXIgNC4yLjIgLSBpbmNsdWRlIHZhcmlhbnQpXG4gICAgYltpKytdID0gY2xvY2tzZXEgPj4+IDggfCAweDgwO1xuXG4gICAgLy8gYGNsb2NrX3NlcV9sb3dgXG4gICAgYltpKytdID0gY2xvY2tzZXEgJiAweGZmO1xuXG4gICAgLy8gYG5vZGVgXG4gICAgdmFyIG5vZGUgPSBvcHRpb25zLm5vZGUgfHwgX25vZGVJZDtcbiAgICBmb3IgKHZhciBuID0gMDsgbiA8IDY7IG4rKykge1xuICAgICAgYltpICsgbl0gPSBub2RlW25dO1xuICAgIH1cblxuICAgIHJldHVybiBidWYgPyBidWYgOiB1bnBhcnNlKGIpO1xuICB9XG5cbiAgLy8gKipgdjQoKWAgLSBHZW5lcmF0ZSByYW5kb20gVVVJRCoqXG5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9icm9vZmEvbm9kZS11dWlkIGZvciBBUEkgZGV0YWlsc1xuICBmdW5jdGlvbiB2NChvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICAgIC8vIERlcHJlY2F0ZWQgLSAnZm9ybWF0JyBhcmd1bWVudCwgYXMgc3VwcG9ydGVkIGluIHYxLjJcbiAgICB2YXIgaSA9IGJ1ZiAmJiBvZmZzZXQgfHwgMDtcblxuICAgIGlmICh0eXBlb2Yob3B0aW9ucykgPT0gJ3N0cmluZycpIHtcbiAgICAgIGJ1ZiA9IG9wdGlvbnMgPT0gJ2JpbmFyeScgPyBuZXcgQnVmZmVyQ2xhc3MoMTYpIDogbnVsbDtcbiAgICAgIG9wdGlvbnMgPSBudWxsO1xuICAgIH1cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHZhciBybmRzID0gb3B0aW9ucy5yYW5kb20gfHwgKG9wdGlvbnMucm5nIHx8IF9ybmcpKCk7XG5cbiAgICAvLyBQZXIgNC40LCBzZXQgYml0cyBmb3IgdmVyc2lvbiBhbmQgYGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWRgXG4gICAgcm5kc1s2XSA9IChybmRzWzZdICYgMHgwZikgfCAweDQwO1xuICAgIHJuZHNbOF0gPSAocm5kc1s4XSAmIDB4M2YpIHwgMHg4MDtcblxuICAgIC8vIENvcHkgYnl0ZXMgdG8gYnVmZmVyLCBpZiBwcm92aWRlZFxuICAgIGlmIChidWYpIHtcbiAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCAxNjsgaWkrKykge1xuICAgICAgICBidWZbaSArIGlpXSA9IHJuZHNbaWldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBidWYgfHwgdW5wYXJzZShybmRzKTtcbiAgfVxuXG4gIC8vIEV4cG9ydCBwdWJsaWMgQVBJXG4gIHZhciB1dWlkID0gdjQ7XG4gIHV1aWQudjEgPSB2MTtcbiAgdXVpZC52NCA9IHY0O1xuICB1dWlkLnBhcnNlID0gcGFyc2U7XG4gIHV1aWQudW5wYXJzZSA9IHVucGFyc2U7XG4gIHV1aWQuQnVmZmVyQ2xhc3MgPSBCdWZmZXJDbGFzcztcblxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gUHVibGlzaCBhcyBBTUQgbW9kdWxlXG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkge3JldHVybiB1dWlkO30pO1xuICB9IGVsc2UgaWYgKHR5cGVvZihtb2R1bGUpICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgLy8gUHVibGlzaCBhcyBub2RlLmpzIG1vZHVsZVxuICAgIG1vZHVsZS5leHBvcnRzID0gdXVpZDtcbiAgfSBlbHNlIHtcbiAgICAvLyBQdWJsaXNoIGFzIGdsb2JhbCAoaW4gYnJvd3NlcnMpXG4gICAgdmFyIF9wcmV2aW91c1Jvb3QgPSBfZ2xvYmFsLnV1aWQ7XG5cbiAgICAvLyAqKmBub0NvbmZsaWN0KClgIC0gKGJyb3dzZXIgb25seSkgdG8gcmVzZXQgZ2xvYmFsICd1dWlkJyB2YXIqKlxuICAgIHV1aWQubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgX2dsb2JhbC51dWlkID0gX3ByZXZpb3VzUm9vdDtcbiAgICAgIHJldHVybiB1dWlkO1xuICAgIH07XG5cbiAgICBfZ2xvYmFsLnV1aWQgPSB1dWlkO1xuICB9XG59KS5jYWxsKHRoaXMpO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIpIiwiLyohXG4gKiBudW1lcmFsLmpzXG4gKiB2ZXJzaW9uIDogMS41LjNcbiAqIGF1dGhvciA6IEFkYW0gRHJhcGVyXG4gKiBsaWNlbnNlIDogTUlUXG4gKiBodHRwOi8vYWRhbXdkcmFwZXIuZ2l0aHViLmNvbS9OdW1lcmFsLWpzL1xuICovXG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIENvbnN0YW50c1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIHZhciBudW1lcmFsLFxuICAgICAgICBWRVJTSU9OID0gJzEuNS4zJyxcbiAgICAgICAgLy8gaW50ZXJuYWwgc3RvcmFnZSBmb3IgbGFuZ3VhZ2UgY29uZmlnIGZpbGVzXG4gICAgICAgIGxhbmd1YWdlcyA9IHt9LFxuICAgICAgICBjdXJyZW50TGFuZ3VhZ2UgPSAnZW4nLFxuICAgICAgICB6ZXJvRm9ybWF0ID0gbnVsbCxcbiAgICAgICAgZGVmYXVsdEZvcm1hdCA9ICcwLDAnLFxuICAgICAgICAvLyBjaGVjayBmb3Igbm9kZUpTXG4gICAgICAgIGhhc01vZHVsZSA9ICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyk7XG5cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgQ29uc3RydWN0b3JzXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICAvLyBOdW1lcmFsIHByb3RvdHlwZSBvYmplY3RcbiAgICBmdW5jdGlvbiBOdW1lcmFsIChudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSBudW1iZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW1wbGVtZW50YXRpb24gb2YgdG9GaXhlZCgpIHRoYXQgdHJlYXRzIGZsb2F0cyBtb3JlIGxpa2UgZGVjaW1hbHNcbiAgICAgKlxuICAgICAqIEZpeGVzIGJpbmFyeSByb3VuZGluZyBpc3N1ZXMgKGVnLiAoMC42MTUpLnRvRml4ZWQoMikgPT09ICcwLjYxJykgdGhhdCBwcmVzZW50XG4gICAgICogcHJvYmxlbXMgZm9yIGFjY291bnRpbmctIGFuZCBmaW5hbmNlLXJlbGF0ZWQgc29mdHdhcmUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gdG9GaXhlZCAodmFsdWUsIHByZWNpc2lvbiwgcm91bmRpbmdGdW5jdGlvbiwgb3B0aW9uYWxzKSB7XG4gICAgICAgIHZhciBwb3dlciA9IE1hdGgucG93KDEwLCBwcmVjaXNpb24pLFxuICAgICAgICAgICAgb3B0aW9uYWxzUmVnRXhwLFxuICAgICAgICAgICAgb3V0cHV0O1xuICAgICAgICAgICAgXG4gICAgICAgIC8vcm91bmRpbmdGdW5jdGlvbiA9IChyb3VuZGluZ0Z1bmN0aW9uICE9PSB1bmRlZmluZWQgPyByb3VuZGluZ0Z1bmN0aW9uIDogTWF0aC5yb3VuZCk7XG4gICAgICAgIC8vIE11bHRpcGx5IHVwIGJ5IHByZWNpc2lvbiwgcm91bmQgYWNjdXJhdGVseSwgdGhlbiBkaXZpZGUgYW5kIHVzZSBuYXRpdmUgdG9GaXhlZCgpOlxuICAgICAgICBvdXRwdXQgPSAocm91bmRpbmdGdW5jdGlvbih2YWx1ZSAqIHBvd2VyKSAvIHBvd2VyKS50b0ZpeGVkKHByZWNpc2lvbik7XG5cbiAgICAgICAgaWYgKG9wdGlvbmFscykge1xuICAgICAgICAgICAgb3B0aW9uYWxzUmVnRXhwID0gbmV3IFJlZ0V4cCgnMHsxLCcgKyBvcHRpb25hbHMgKyAnfSQnKTtcbiAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKG9wdGlvbmFsc1JlZ0V4cCwgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIEZvcm1hdHRpbmdcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvLyBkZXRlcm1pbmUgd2hhdCB0eXBlIG9mIGZvcm1hdHRpbmcgd2UgbmVlZCB0byBkb1xuICAgIGZ1bmN0aW9uIGZvcm1hdE51bWVyYWwgKG4sIGZvcm1hdCwgcm91bmRpbmdGdW5jdGlvbikge1xuICAgICAgICB2YXIgb3V0cHV0O1xuXG4gICAgICAgIC8vIGZpZ3VyZSBvdXQgd2hhdCBraW5kIG9mIGZvcm1hdCB3ZSBhcmUgZGVhbGluZyB3aXRoXG4gICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignJCcpID4gLTEpIHsgLy8gY3VycmVuY3khISEhIVxuICAgICAgICAgICAgb3V0cHV0ID0gZm9ybWF0Q3VycmVuY3kobiwgZm9ybWF0LCByb3VuZGluZ0Z1bmN0aW9uKTtcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtYXQuaW5kZXhPZignJScpID4gLTEpIHsgLy8gcGVyY2VudGFnZVxuICAgICAgICAgICAgb3V0cHV0ID0gZm9ybWF0UGVyY2VudGFnZShuLCBmb3JtYXQsIHJvdW5kaW5nRnVuY3Rpb24pO1xuICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdC5pbmRleE9mKCc6JykgPiAtMSkgeyAvLyB0aW1lXG4gICAgICAgICAgICBvdXRwdXQgPSBmb3JtYXRUaW1lKG4sIGZvcm1hdCk7XG4gICAgICAgIH0gZWxzZSB7IC8vIHBsYWluIG9sJyBudW1iZXJzIG9yIGJ5dGVzXG4gICAgICAgICAgICBvdXRwdXQgPSBmb3JtYXROdW1iZXIobi5fdmFsdWUsIGZvcm1hdCwgcm91bmRpbmdGdW5jdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZXR1cm4gc3RyaW5nXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuXG4gICAgLy8gcmV2ZXJ0IHRvIG51bWJlclxuICAgIGZ1bmN0aW9uIHVuZm9ybWF0TnVtZXJhbCAobiwgc3RyaW5nKSB7XG4gICAgICAgIHZhciBzdHJpbmdPcmlnaW5hbCA9IHN0cmluZyxcbiAgICAgICAgICAgIHRob3VzYW5kUmVnRXhwLFxuICAgICAgICAgICAgbWlsbGlvblJlZ0V4cCxcbiAgICAgICAgICAgIGJpbGxpb25SZWdFeHAsXG4gICAgICAgICAgICB0cmlsbGlvblJlZ0V4cCxcbiAgICAgICAgICAgIHN1ZmZpeGVzID0gWydLQicsICdNQicsICdHQicsICdUQicsICdQQicsICdFQicsICdaQicsICdZQiddLFxuICAgICAgICAgICAgYnl0ZXNNdWx0aXBsaWVyID0gZmFsc2UsXG4gICAgICAgICAgICBwb3dlcjtcblxuICAgICAgICBpZiAoc3RyaW5nLmluZGV4T2YoJzonKSA+IC0xKSB7XG4gICAgICAgICAgICBuLl92YWx1ZSA9IHVuZm9ybWF0VGltZShzdHJpbmcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHN0cmluZyA9PT0gemVyb0Zvcm1hdCkge1xuICAgICAgICAgICAgICAgIG4uX3ZhbHVlID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmRlbGltaXRlcnMuZGVjaW1hbCAhPT0gJy4nKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKC9cXC4vZywnJykucmVwbGFjZShsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5kZWxpbWl0ZXJzLmRlY2ltYWwsICcuJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gc2VlIGlmIGFiYnJldmlhdGlvbnMgYXJlIHRoZXJlIHNvIHRoYXQgd2UgY2FuIG11bHRpcGx5IHRvIHRoZSBjb3JyZWN0IG51bWJlclxuICAgICAgICAgICAgICAgIHRob3VzYW5kUmVnRXhwID0gbmV3IFJlZ0V4cCgnW15hLXpBLVpdJyArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmFiYnJldmlhdGlvbnMudGhvdXNhbmQgKyAnKD86XFxcXCl8KFxcXFwnICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uY3VycmVuY3kuc3ltYm9sICsgJyk/KD86XFxcXCkpPyk/JCcpO1xuICAgICAgICAgICAgICAgIG1pbGxpb25SZWdFeHAgPSBuZXcgUmVnRXhwKCdbXmEtekEtWl0nICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uYWJicmV2aWF0aW9ucy5taWxsaW9uICsgJyg/OlxcXFwpfChcXFxcJyArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmN1cnJlbmN5LnN5bWJvbCArICcpPyg/OlxcXFwpKT8pPyQnKTtcbiAgICAgICAgICAgICAgICBiaWxsaW9uUmVnRXhwID0gbmV3IFJlZ0V4cCgnW15hLXpBLVpdJyArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmFiYnJldmlhdGlvbnMuYmlsbGlvbiArICcoPzpcXFxcKXwoXFxcXCcgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5jdXJyZW5jeS5zeW1ib2wgKyAnKT8oPzpcXFxcKSk/KT8kJyk7XG4gICAgICAgICAgICAgICAgdHJpbGxpb25SZWdFeHAgPSBuZXcgUmVnRXhwKCdbXmEtekEtWl0nICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uYWJicmV2aWF0aW9ucy50cmlsbGlvbiArICcoPzpcXFxcKXwoXFxcXCcgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5jdXJyZW5jeS5zeW1ib2wgKyAnKT8oPzpcXFxcKSk/KT8kJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBzZWUgaWYgYnl0ZXMgYXJlIHRoZXJlIHNvIHRoYXQgd2UgY2FuIG11bHRpcGx5IHRvIHRoZSBjb3JyZWN0IG51bWJlclxuICAgICAgICAgICAgICAgIGZvciAocG93ZXIgPSAwOyBwb3dlciA8PSBzdWZmaXhlcy5sZW5ndGg7IHBvd2VyKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYnl0ZXNNdWx0aXBsaWVyID0gKHN0cmluZy5pbmRleE9mKHN1ZmZpeGVzW3Bvd2VyXSkgPiAtMSkgPyBNYXRoLnBvdygxMDI0LCBwb3dlciArIDEpIDogZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGJ5dGVzTXVsdGlwbGllcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBkbyBzb21lIG1hdGggdG8gY3JlYXRlIG91ciBudW1iZXJcbiAgICAgICAgICAgICAgICBuLl92YWx1ZSA9ICgoYnl0ZXNNdWx0aXBsaWVyKSA/IGJ5dGVzTXVsdGlwbGllciA6IDEpICogKChzdHJpbmdPcmlnaW5hbC5tYXRjaCh0aG91c2FuZFJlZ0V4cCkpID8gTWF0aC5wb3coMTAsIDMpIDogMSkgKiAoKHN0cmluZ09yaWdpbmFsLm1hdGNoKG1pbGxpb25SZWdFeHApKSA/IE1hdGgucG93KDEwLCA2KSA6IDEpICogKChzdHJpbmdPcmlnaW5hbC5tYXRjaChiaWxsaW9uUmVnRXhwKSkgPyBNYXRoLnBvdygxMCwgOSkgOiAxKSAqICgoc3RyaW5nT3JpZ2luYWwubWF0Y2godHJpbGxpb25SZWdFeHApKSA/IE1hdGgucG93KDEwLCAxMikgOiAxKSAqICgoc3RyaW5nLmluZGV4T2YoJyUnKSA+IC0xKSA/IDAuMDEgOiAxKSAqICgoKHN0cmluZy5zcGxpdCgnLScpLmxlbmd0aCArIE1hdGgubWluKHN0cmluZy5zcGxpdCgnKCcpLmxlbmd0aC0xLCBzdHJpbmcuc3BsaXQoJyknKS5sZW5ndGgtMSkpICUgMik/IDE6IC0xKSAqIE51bWJlcihzdHJpbmcucmVwbGFjZSgvW14wLTlcXC5dKy9nLCAnJykpO1xuXG4gICAgICAgICAgICAgICAgLy8gcm91bmQgaWYgd2UgYXJlIHRhbGtpbmcgYWJvdXQgYnl0ZXNcbiAgICAgICAgICAgICAgICBuLl92YWx1ZSA9IChieXRlc011bHRpcGxpZXIpID8gTWF0aC5jZWlsKG4uX3ZhbHVlKSA6IG4uX3ZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuLl92YWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRDdXJyZW5jeSAobiwgZm9ybWF0LCByb3VuZGluZ0Z1bmN0aW9uKSB7XG4gICAgICAgIHZhciBzeW1ib2xJbmRleCA9IGZvcm1hdC5pbmRleE9mKCckJyksXG4gICAgICAgICAgICBvcGVuUGFyZW5JbmRleCA9IGZvcm1hdC5pbmRleE9mKCcoJyksXG4gICAgICAgICAgICBtaW51c1NpZ25JbmRleCA9IGZvcm1hdC5pbmRleE9mKCctJyksXG4gICAgICAgICAgICBzcGFjZSA9ICcnLFxuICAgICAgICAgICAgc3BsaWNlSW5kZXgsXG4gICAgICAgICAgICBvdXRwdXQ7XG5cbiAgICAgICAgLy8gY2hlY2sgZm9yIHNwYWNlIGJlZm9yZSBvciBhZnRlciBjdXJyZW5jeVxuICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJyAkJykgPiAtMSkge1xuICAgICAgICAgICAgc3BhY2UgPSAnICc7XG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnICQnLCAnJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0LmluZGV4T2YoJyQgJykgPiAtMSkge1xuICAgICAgICAgICAgc3BhY2UgPSAnICc7XG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnJCAnLCAnJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnJCcsICcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZvcm1hdCB0aGUgbnVtYmVyXG4gICAgICAgIG91dHB1dCA9IGZvcm1hdE51bWJlcihuLl92YWx1ZSwgZm9ybWF0LCByb3VuZGluZ0Z1bmN0aW9uKTtcblxuICAgICAgICAvLyBwb3NpdGlvbiB0aGUgc3ltYm9sXG4gICAgICAgIGlmIChzeW1ib2xJbmRleCA8PSAxKSB7XG4gICAgICAgICAgICBpZiAob3V0cHV0LmluZGV4T2YoJygnKSA+IC0xIHx8IG91dHB1dC5pbmRleE9mKCctJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5zcGxpdCgnJyk7XG4gICAgICAgICAgICAgICAgc3BsaWNlSW5kZXggPSAxO1xuICAgICAgICAgICAgICAgIGlmIChzeW1ib2xJbmRleCA8IG9wZW5QYXJlbkluZGV4IHx8IHN5bWJvbEluZGV4IDwgbWludXNTaWduSW5kZXgpe1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgc3ltYm9sIGFwcGVhcnMgYmVmb3JlIHRoZSBcIihcIiBvciBcIi1cIlxuICAgICAgICAgICAgICAgICAgICBzcGxpY2VJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG91dHB1dC5zcGxpY2Uoc3BsaWNlSW5kZXgsIDAsIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmN1cnJlbmN5LnN5bWJvbCArIHNwYWNlKTtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQuam9pbignJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmN1cnJlbmN5LnN5bWJvbCArIHNwYWNlICsgb3V0cHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG91dHB1dC5pbmRleE9mKCcpJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5zcGxpdCgnJyk7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnNwbGljZSgtMSwgMCwgc3BhY2UgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5jdXJyZW5jeS5zeW1ib2wpO1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5qb2luKCcnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0ICsgc3BhY2UgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5jdXJyZW5jeS5zeW1ib2w7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdFBlcmNlbnRhZ2UgKG4sIGZvcm1hdCwgcm91bmRpbmdGdW5jdGlvbikge1xuICAgICAgICB2YXIgc3BhY2UgPSAnJyxcbiAgICAgICAgICAgIG91dHB1dCxcbiAgICAgICAgICAgIHZhbHVlID0gbi5fdmFsdWUgKiAxMDA7XG5cbiAgICAgICAgLy8gY2hlY2sgZm9yIHNwYWNlIGJlZm9yZSAlXG4gICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignICUnKSA+IC0xKSB7XG4gICAgICAgICAgICBzcGFjZSA9ICcgJztcbiAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCcgJScsICcnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCclJywgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgb3V0cHV0ID0gZm9ybWF0TnVtYmVyKHZhbHVlLCBmb3JtYXQsIHJvdW5kaW5nRnVuY3Rpb24pO1xuICAgICAgICBcbiAgICAgICAgaWYgKG91dHB1dC5pbmRleE9mKCcpJykgPiAtMSApIHtcbiAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5zcGxpdCgnJyk7XG4gICAgICAgICAgICBvdXRwdXQuc3BsaWNlKC0xLCAwLCBzcGFjZSArICclJyk7XG4gICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQuam9pbignJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQgKyBzcGFjZSArICclJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0VGltZSAobikge1xuICAgICAgICB2YXIgaG91cnMgPSBNYXRoLmZsb29yKG4uX3ZhbHVlLzYwLzYwKSxcbiAgICAgICAgICAgIG1pbnV0ZXMgPSBNYXRoLmZsb29yKChuLl92YWx1ZSAtIChob3VycyAqIDYwICogNjApKS82MCksXG4gICAgICAgICAgICBzZWNvbmRzID0gTWF0aC5yb3VuZChuLl92YWx1ZSAtIChob3VycyAqIDYwICogNjApIC0gKG1pbnV0ZXMgKiA2MCkpO1xuICAgICAgICByZXR1cm4gaG91cnMgKyAnOicgKyAoKG1pbnV0ZXMgPCAxMCkgPyAnMCcgKyBtaW51dGVzIDogbWludXRlcykgKyAnOicgKyAoKHNlY29uZHMgPCAxMCkgPyAnMCcgKyBzZWNvbmRzIDogc2Vjb25kcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdW5mb3JtYXRUaW1lIChzdHJpbmcpIHtcbiAgICAgICAgdmFyIHRpbWVBcnJheSA9IHN0cmluZy5zcGxpdCgnOicpLFxuICAgICAgICAgICAgc2Vjb25kcyA9IDA7XG4gICAgICAgIC8vIHR1cm4gaG91cnMgYW5kIG1pbnV0ZXMgaW50byBzZWNvbmRzIGFuZCBhZGQgdGhlbSBhbGwgdXBcbiAgICAgICAgaWYgKHRpbWVBcnJheS5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgIC8vIGhvdXJzXG4gICAgICAgICAgICBzZWNvbmRzID0gc2Vjb25kcyArIChOdW1iZXIodGltZUFycmF5WzBdKSAqIDYwICogNjApO1xuICAgICAgICAgICAgLy8gbWludXRlc1xuICAgICAgICAgICAgc2Vjb25kcyA9IHNlY29uZHMgKyAoTnVtYmVyKHRpbWVBcnJheVsxXSkgKiA2MCk7XG4gICAgICAgICAgICAvLyBzZWNvbmRzXG4gICAgICAgICAgICBzZWNvbmRzID0gc2Vjb25kcyArIE51bWJlcih0aW1lQXJyYXlbMl0pO1xuICAgICAgICB9IGVsc2UgaWYgKHRpbWVBcnJheS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIC8vIG1pbnV0ZXNcbiAgICAgICAgICAgIHNlY29uZHMgPSBzZWNvbmRzICsgKE51bWJlcih0aW1lQXJyYXlbMF0pICogNjApO1xuICAgICAgICAgICAgLy8gc2Vjb25kc1xuICAgICAgICAgICAgc2Vjb25kcyA9IHNlY29uZHMgKyBOdW1iZXIodGltZUFycmF5WzFdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTnVtYmVyKHNlY29uZHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdE51bWJlciAodmFsdWUsIGZvcm1hdCwgcm91bmRpbmdGdW5jdGlvbikge1xuICAgICAgICB2YXIgbmVnUCA9IGZhbHNlLFxuICAgICAgICAgICAgc2lnbmVkID0gZmFsc2UsXG4gICAgICAgICAgICBvcHREZWMgPSBmYWxzZSxcbiAgICAgICAgICAgIGFiYnIgPSAnJyxcbiAgICAgICAgICAgIGFiYnJLID0gZmFsc2UsIC8vIGZvcmNlIGFiYnJldmlhdGlvbiB0byB0aG91c2FuZHNcbiAgICAgICAgICAgIGFiYnJNID0gZmFsc2UsIC8vIGZvcmNlIGFiYnJldmlhdGlvbiB0byBtaWxsaW9uc1xuICAgICAgICAgICAgYWJickIgPSBmYWxzZSwgLy8gZm9yY2UgYWJicmV2aWF0aW9uIHRvIGJpbGxpb25zXG4gICAgICAgICAgICBhYmJyVCA9IGZhbHNlLCAvLyBmb3JjZSBhYmJyZXZpYXRpb24gdG8gdHJpbGxpb25zXG4gICAgICAgICAgICBhYmJyRm9yY2UgPSBmYWxzZSwgLy8gZm9yY2UgYWJicmV2aWF0aW9uXG4gICAgICAgICAgICBieXRlcyA9ICcnLFxuICAgICAgICAgICAgb3JkID0gJycsXG4gICAgICAgICAgICBhYnMgPSBNYXRoLmFicyh2YWx1ZSksXG4gICAgICAgICAgICBzdWZmaXhlcyA9IFsnQicsICdLQicsICdNQicsICdHQicsICdUQicsICdQQicsICdFQicsICdaQicsICdZQiddLFxuICAgICAgICAgICAgbWluLFxuICAgICAgICAgICAgbWF4LFxuICAgICAgICAgICAgcG93ZXIsXG4gICAgICAgICAgICB3LFxuICAgICAgICAgICAgcHJlY2lzaW9uLFxuICAgICAgICAgICAgdGhvdXNhbmRzLFxuICAgICAgICAgICAgZCA9ICcnLFxuICAgICAgICAgICAgbmVnID0gZmFsc2U7XG5cbiAgICAgICAgLy8gY2hlY2sgaWYgbnVtYmVyIGlzIHplcm8gYW5kIGEgY3VzdG9tIHplcm8gZm9ybWF0IGhhcyBiZWVuIHNldFxuICAgICAgICBpZiAodmFsdWUgPT09IDAgJiYgemVyb0Zvcm1hdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHplcm9Gb3JtYXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBzZWUgaWYgd2Ugc2hvdWxkIHVzZSBwYXJlbnRoZXNlcyBmb3IgbmVnYXRpdmUgbnVtYmVyIG9yIGlmIHdlIHNob3VsZCBwcmVmaXggd2l0aCBhIHNpZ25cbiAgICAgICAgICAgIC8vIGlmIGJvdGggYXJlIHByZXNlbnQgd2UgZGVmYXVsdCB0byBwYXJlbnRoZXNlc1xuICAgICAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCcoJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIG5lZ1AgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5zbGljZSgxLCAtMSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdC5pbmRleE9mKCcrJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIHNpZ25lZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoL1xcKy9nLCAnJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlZSBpZiBhYmJyZXZpYXRpb24gaXMgd2FudGVkXG4gICAgICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJ2EnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgYWJicmV2aWF0aW9uIGlzIHNwZWNpZmllZFxuICAgICAgICAgICAgICAgIGFiYnJLID0gZm9ybWF0LmluZGV4T2YoJ2FLJykgPj0gMDtcbiAgICAgICAgICAgICAgICBhYmJyTSA9IGZvcm1hdC5pbmRleE9mKCdhTScpID49IDA7XG4gICAgICAgICAgICAgICAgYWJickIgPSBmb3JtYXQuaW5kZXhPZignYUInKSA+PSAwO1xuICAgICAgICAgICAgICAgIGFiYnJUID0gZm9ybWF0LmluZGV4T2YoJ2FUJykgPj0gMDtcbiAgICAgICAgICAgICAgICBhYmJyRm9yY2UgPSBhYmJySyB8fCBhYmJyTSB8fCBhYmJyQiB8fCBhYmJyVDtcblxuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGZvciBzcGFjZSBiZWZvcmUgYWJicmV2aWF0aW9uXG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCcgYScpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgYWJiciA9ICcgJztcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJyBhJywgJycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCdhJywgJycpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChhYnMgPj0gTWF0aC5wb3coMTAsIDEyKSAmJiAhYWJickZvcmNlIHx8IGFiYnJUKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRyaWxsaW9uXG4gICAgICAgICAgICAgICAgICAgIGFiYnIgPSBhYmJyICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uYWJicmV2aWF0aW9ucy50cmlsbGlvbjtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSAvIE1hdGgucG93KDEwLCAxMik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhYnMgPCBNYXRoLnBvdygxMCwgMTIpICYmIGFicyA+PSBNYXRoLnBvdygxMCwgOSkgJiYgIWFiYnJGb3JjZSB8fCBhYmJyQikge1xuICAgICAgICAgICAgICAgICAgICAvLyBiaWxsaW9uXG4gICAgICAgICAgICAgICAgICAgIGFiYnIgPSBhYmJyICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uYWJicmV2aWF0aW9ucy5iaWxsaW9uO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlIC8gTWF0aC5wb3coMTAsIDkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWJzIDwgTWF0aC5wb3coMTAsIDkpICYmIGFicyA+PSBNYXRoLnBvdygxMCwgNikgJiYgIWFiYnJGb3JjZSB8fCBhYmJyTSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBtaWxsaW9uXG4gICAgICAgICAgICAgICAgICAgIGFiYnIgPSBhYmJyICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uYWJicmV2aWF0aW9ucy5taWxsaW9uO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlIC8gTWF0aC5wb3coMTAsIDYpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWJzIDwgTWF0aC5wb3coMTAsIDYpICYmIGFicyA+PSBNYXRoLnBvdygxMCwgMykgJiYgIWFiYnJGb3JjZSB8fCBhYmJySykge1xuICAgICAgICAgICAgICAgICAgICAvLyB0aG91c2FuZFxuICAgICAgICAgICAgICAgICAgICBhYmJyID0gYWJiciArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmFiYnJldmlhdGlvbnMudGhvdXNhbmQ7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgLyBNYXRoLnBvdygxMCwgMyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzZWUgaWYgd2UgYXJlIGZvcm1hdHRpbmcgYnl0ZXNcbiAgICAgICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignYicpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBmb3Igc3BhY2UgYmVmb3JlXG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCcgYicpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgYnl0ZXMgPSAnICc7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCcgYicsICcnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnYicsICcnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKHBvd2VyID0gMDsgcG93ZXIgPD0gc3VmZml4ZXMubGVuZ3RoOyBwb3dlcisrKSB7XG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IE1hdGgucG93KDEwMjQsIHBvd2VyKTtcbiAgICAgICAgICAgICAgICAgICAgbWF4ID0gTWF0aC5wb3coMTAyNCwgcG93ZXIrMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlID49IG1pbiAmJiB2YWx1ZSA8IG1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnl0ZXMgPSBieXRlcyArIHN1ZmZpeGVzW3Bvd2VyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtaW4gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSAvIG1pbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzZWUgaWYgb3JkaW5hbCBpcyB3YW50ZWRcbiAgICAgICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignbycpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBmb3Igc3BhY2UgYmVmb3JlXG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCcgbycpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgb3JkID0gJyAnO1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnIG8nLCAnJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJ28nLCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgb3JkID0gb3JkICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0ub3JkaW5hbCh2YWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignWy5dJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIG9wdERlYyA9IHRydWU7XG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJ1suXScsICcuJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHcgPSB2YWx1ZS50b1N0cmluZygpLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgICBwcmVjaXNpb24gPSBmb3JtYXQuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIHRob3VzYW5kcyA9IGZvcm1hdC5pbmRleE9mKCcsJyk7XG5cbiAgICAgICAgICAgIGlmIChwcmVjaXNpb24pIHtcbiAgICAgICAgICAgICAgICBpZiAocHJlY2lzaW9uLmluZGV4T2YoJ1snKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZWNpc2lvbiA9IHByZWNpc2lvbi5yZXBsYWNlKCddJywgJycpO1xuICAgICAgICAgICAgICAgICAgICBwcmVjaXNpb24gPSBwcmVjaXNpb24uc3BsaXQoJ1snKTtcbiAgICAgICAgICAgICAgICAgICAgZCA9IHRvRml4ZWQodmFsdWUsIChwcmVjaXNpb25bMF0ubGVuZ3RoICsgcHJlY2lzaW9uWzFdLmxlbmd0aCksIHJvdW5kaW5nRnVuY3Rpb24sIHByZWNpc2lvblsxXS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGQgPSB0b0ZpeGVkKHZhbHVlLCBwcmVjaXNpb24ubGVuZ3RoLCByb3VuZGluZ0Z1bmN0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB3ID0gZC5zcGxpdCgnLicpWzBdO1xuXG4gICAgICAgICAgICAgICAgaWYgKGQuc3BsaXQoJy4nKVsxXS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgZCA9IGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmRlbGltaXRlcnMuZGVjaW1hbCArIGQuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG9wdERlYyAmJiBOdW1iZXIoZC5zbGljZSgxKSkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZCA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdyA9IHRvRml4ZWQodmFsdWUsIG51bGwsIHJvdW5kaW5nRnVuY3Rpb24pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBmb3JtYXQgbnVtYmVyXG4gICAgICAgICAgICBpZiAody5pbmRleE9mKCctJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIHcgPSB3LnNsaWNlKDEpO1xuICAgICAgICAgICAgICAgIG5lZyA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aG91c2FuZHMgPiAtMSkge1xuICAgICAgICAgICAgICAgIHcgPSB3LnRvU3RyaW5nKCkucmVwbGFjZSgvKFxcZCkoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCAnJDEnICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uZGVsaW1pdGVycy50aG91c2FuZHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJy4nKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHcgPSAnJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICgobmVnUCAmJiBuZWcpID8gJygnIDogJycpICsgKCghbmVnUCAmJiBuZWcpID8gJy0nIDogJycpICsgKCghbmVnICYmIHNpZ25lZCkgPyAnKycgOiAnJykgKyB3ICsgZCArICgob3JkKSA/IG9yZCA6ICcnKSArICgoYWJicikgPyBhYmJyIDogJycpICsgKChieXRlcykgPyBieXRlcyA6ICcnKSArICgobmVnUCAmJiBuZWcpID8gJyknIDogJycpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBUb3AgTGV2ZWwgRnVuY3Rpb25zXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgbnVtZXJhbCA9IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICBpZiAobnVtZXJhbC5pc051bWVyYWwoaW5wdXQpKSB7XG4gICAgICAgICAgICBpbnB1dCA9IGlucHV0LnZhbHVlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5wdXQgPT09IDAgfHwgdHlwZW9mIGlucHV0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaW5wdXQgPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKCFOdW1iZXIoaW5wdXQpKSB7XG4gICAgICAgICAgICBpbnB1dCA9IG51bWVyYWwuZm4udW5mb3JtYXQoaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBOdW1lcmFsKE51bWJlcihpbnB1dCkpO1xuICAgIH07XG5cbiAgICAvLyB2ZXJzaW9uIG51bWJlclxuICAgIG51bWVyYWwudmVyc2lvbiA9IFZFUlNJT047XG5cbiAgICAvLyBjb21wYXJlIG51bWVyYWwgb2JqZWN0XG4gICAgbnVtZXJhbC5pc051bWVyYWwgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBOdW1lcmFsO1xuICAgIH07XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgbG9hZCBsYW5ndWFnZXMgYW5kIHRoZW4gc2V0IHRoZSBnbG9iYWwgbGFuZ3VhZ2UuICBJZlxuICAgIC8vIG5vIGFyZ3VtZW50cyBhcmUgcGFzc2VkIGluLCBpdCB3aWxsIHNpbXBseSByZXR1cm4gdGhlIGN1cnJlbnQgZ2xvYmFsXG4gICAgLy8gbGFuZ3VhZ2Uga2V5LlxuICAgIG51bWVyYWwubGFuZ3VhZ2UgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZXMpIHtcbiAgICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50TGFuZ3VhZ2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoa2V5ICYmICF2YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmKCFsYW5ndWFnZXNba2V5XSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBsYW5ndWFnZSA6ICcgKyBrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VycmVudExhbmd1YWdlID0ga2V5O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbHVlcyB8fCAhbGFuZ3VhZ2VzW2tleV0pIHtcbiAgICAgICAgICAgIGxvYWRMYW5ndWFnZShrZXksIHZhbHVlcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVtZXJhbDtcbiAgICB9O1xuICAgIFxuICAgIC8vIFRoaXMgZnVuY3Rpb24gcHJvdmlkZXMgYWNjZXNzIHRvIHRoZSBsb2FkZWQgbGFuZ3VhZ2UgZGF0YS4gIElmXG4gICAgLy8gbm8gYXJndW1lbnRzIGFyZSBwYXNzZWQgaW4sIGl0IHdpbGwgc2ltcGx5IHJldHVybiB0aGUgY3VycmVudFxuICAgIC8vIGdsb2JhbCBsYW5ndWFnZSBvYmplY3QuXG4gICAgbnVtZXJhbC5sYW5ndWFnZURhdGEgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV07XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmICghbGFuZ3VhZ2VzW2tleV0pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBsYW5ndWFnZSA6ICcgKyBrZXkpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gbGFuZ3VhZ2VzW2tleV07XG4gICAgfTtcblxuICAgIG51bWVyYWwubGFuZ3VhZ2UoJ2VuJywge1xuICAgICAgICBkZWxpbWl0ZXJzOiB7XG4gICAgICAgICAgICB0aG91c2FuZHM6ICcsJyxcbiAgICAgICAgICAgIGRlY2ltYWw6ICcuJ1xuICAgICAgICB9LFxuICAgICAgICBhYmJyZXZpYXRpb25zOiB7XG4gICAgICAgICAgICB0aG91c2FuZDogJ2snLFxuICAgICAgICAgICAgbWlsbGlvbjogJ20nLFxuICAgICAgICAgICAgYmlsbGlvbjogJ2InLFxuICAgICAgICAgICAgdHJpbGxpb246ICd0J1xuICAgICAgICB9LFxuICAgICAgICBvcmRpbmFsOiBmdW5jdGlvbiAobnVtYmVyKSB7XG4gICAgICAgICAgICB2YXIgYiA9IG51bWJlciAlIDEwO1xuICAgICAgICAgICAgcmV0dXJuICh+fiAobnVtYmVyICUgMTAwIC8gMTApID09PSAxKSA/ICd0aCcgOlxuICAgICAgICAgICAgICAgIChiID09PSAxKSA/ICdzdCcgOlxuICAgICAgICAgICAgICAgIChiID09PSAyKSA/ICduZCcgOlxuICAgICAgICAgICAgICAgIChiID09PSAzKSA/ICdyZCcgOiAndGgnO1xuICAgICAgICB9LFxuICAgICAgICBjdXJyZW5jeToge1xuICAgICAgICAgICAgc3ltYm9sOiAnJCdcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgbnVtZXJhbC56ZXJvRm9ybWF0ID0gZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICB6ZXJvRm9ybWF0ID0gdHlwZW9mKGZvcm1hdCkgPT09ICdzdHJpbmcnID8gZm9ybWF0IDogbnVsbDtcbiAgICB9O1xuXG4gICAgbnVtZXJhbC5kZWZhdWx0Rm9ybWF0ID0gZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICBkZWZhdWx0Rm9ybWF0ID0gdHlwZW9mKGZvcm1hdCkgPT09ICdzdHJpbmcnID8gZm9ybWF0IDogJzAuMCc7XG4gICAgfTtcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgSGVscGVyc1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIGZ1bmN0aW9uIGxvYWRMYW5ndWFnZShrZXksIHZhbHVlcykge1xuICAgICAgICBsYW5ndWFnZXNba2V5XSA9IHZhbHVlcztcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIEZsb2F0aW5nLXBvaW50IGhlbHBlcnNcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvLyBUaGUgZmxvYXRpbmctcG9pbnQgaGVscGVyIGZ1bmN0aW9ucyBhbmQgaW1wbGVtZW50YXRpb25cbiAgICAvLyBib3Jyb3dzIGhlYXZpbHkgZnJvbSBzaW5mdWwuanM6IGh0dHA6Ly9ndWlwbi5naXRodWIuaW8vc2luZnVsLmpzL1xuXG4gICAgLyoqXG4gICAgICogQXJyYXkucHJvdG90eXBlLnJlZHVjZSBmb3IgYnJvd3NlcnMgdGhhdCBkb24ndCBzdXBwb3J0IGl0XG4gICAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvUmVkdWNlI0NvbXBhdGliaWxpdHlcbiAgICAgKi9cbiAgICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIEFycmF5LnByb3RvdHlwZS5yZWR1Y2UpIHtcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnJlZHVjZSA9IGZ1bmN0aW9uIChjYWxsYmFjaywgb3B0X2luaXRpYWxWYWx1ZSkge1xuICAgICAgICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAobnVsbCA9PT0gdGhpcyB8fCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIHRoaXMpIHtcbiAgICAgICAgICAgICAgICAvLyBBdCB0aGUgbW9tZW50IGFsbCBtb2Rlcm4gYnJvd3NlcnMsIHRoYXQgc3VwcG9ydCBzdHJpY3QgbW9kZSwgaGF2ZVxuICAgICAgICAgICAgICAgIC8vIG5hdGl2ZSBpbXBsZW1lbnRhdGlvbiBvZiBBcnJheS5wcm90b3R5cGUucmVkdWNlLiBGb3IgaW5zdGFuY2UsIElFOFxuICAgICAgICAgICAgICAgIC8vIGRvZXMgbm90IHN1cHBvcnQgc3RyaWN0IG1vZGUsIHNvIHRoaXMgY2hlY2sgaXMgYWN0dWFsbHkgdXNlbGVzcy5cbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcnJheS5wcm90b3R5cGUucmVkdWNlIGNhbGxlZCBvbiBudWxsIG9yIHVuZGVmaW5lZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihjYWxsYmFjayArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGluZGV4LFxuICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoID4+PiAwLFxuICAgICAgICAgICAgICAgIGlzVmFsdWVTZXQgPSBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKDEgPCBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBvcHRfaW5pdGlhbFZhbHVlO1xuICAgICAgICAgICAgICAgIGlzVmFsdWVTZXQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGluZGV4ID0gMDsgbGVuZ3RoID4gaW5kZXg7ICsraW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShpbmRleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzVmFsdWVTZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gY2FsbGJhY2sodmFsdWUsIHRoaXNbaW5kZXhdLCBpbmRleCwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXNbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNWYWx1ZVNldCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaXNWYWx1ZVNldCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1JlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIFxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBtdWx0aXBsaWVyIG5lY2Vzc2FyeSB0byBtYWtlIHggPj0gMSxcbiAgICAgKiBlZmZlY3RpdmVseSBlbGltaW5hdGluZyBtaXNjYWxjdWxhdGlvbnMgY2F1c2VkIGJ5XG4gICAgICogZmluaXRlIHByZWNpc2lvbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtdWx0aXBsaWVyKHgpIHtcbiAgICAgICAgdmFyIHBhcnRzID0geC50b1N0cmluZygpLnNwbGl0KCcuJyk7XG4gICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWF0aC5wb3coMTAsIHBhcnRzWzFdLmxlbmd0aCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2l2ZW4gYSB2YXJpYWJsZSBudW1iZXIgb2YgYXJndW1lbnRzLCByZXR1cm5zIHRoZSBtYXhpbXVtXG4gICAgICogbXVsdGlwbGllciB0aGF0IG11c3QgYmUgdXNlZCB0byBub3JtYWxpemUgYW4gb3BlcmF0aW9uIGludm9sdmluZ1xuICAgICAqIGFsbCBvZiB0aGVtLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvcnJlY3Rpb25GYWN0b3IoKSB7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIGFyZ3MucmVkdWNlKGZ1bmN0aW9uIChwcmV2LCBuZXh0KSB7XG4gICAgICAgICAgICB2YXIgbXAgPSBtdWx0aXBsaWVyKHByZXYpLFxuICAgICAgICAgICAgICAgIG1uID0gbXVsdGlwbGllcihuZXh0KTtcbiAgICAgICAgcmV0dXJuIG1wID4gbW4gPyBtcCA6IG1uO1xuICAgICAgICB9LCAtSW5maW5pdHkpO1xuICAgIH0gICAgICAgIFxuXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIE51bWVyYWwgUHJvdG90eXBlXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICBudW1lcmFsLmZuID0gTnVtZXJhbC5wcm90b3R5cGUgPSB7XG5cbiAgICAgICAgY2xvbmUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVtZXJhbCh0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBmb3JtYXQgOiBmdW5jdGlvbiAoaW5wdXRTdHJpbmcsIHJvdW5kaW5nRnVuY3Rpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBmb3JtYXROdW1lcmFsKHRoaXMsIFxuICAgICAgICAgICAgICAgICAgaW5wdXRTdHJpbmcgPyBpbnB1dFN0cmluZyA6IGRlZmF1bHRGb3JtYXQsIFxuICAgICAgICAgICAgICAgICAgKHJvdW5kaW5nRnVuY3Rpb24gIT09IHVuZGVmaW5lZCkgPyByb3VuZGluZ0Z1bmN0aW9uIDogTWF0aC5yb3VuZFxuICAgICAgICAgICAgICApO1xuICAgICAgICB9LFxuXG4gICAgICAgIHVuZm9ybWF0IDogZnVuY3Rpb24gKGlucHV0U3RyaW5nKSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlucHV0U3RyaW5nKSA9PT0gJ1tvYmplY3QgTnVtYmVyXScpIHsgXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0U3RyaW5nOyBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB1bmZvcm1hdE51bWVyYWwodGhpcywgaW5wdXRTdHJpbmcgPyBpbnB1dFN0cmluZyA6IGRlZmF1bHRGb3JtYXQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHZhbHVlIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHZhbHVlT2YgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0IDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IE51bWJlcih2YWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBhZGQgOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBjb3JyRmFjdG9yID0gY29ycmVjdGlvbkZhY3Rvci5jYWxsKG51bGwsIHRoaXMuX3ZhbHVlLCB2YWx1ZSk7XG4gICAgICAgICAgICBmdW5jdGlvbiBjYmFjayhhY2N1bSwgY3VyciwgY3VyckksIE8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjdW0gKyBjb3JyRmFjdG9yICogY3VycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gW3RoaXMuX3ZhbHVlLCB2YWx1ZV0ucmVkdWNlKGNiYWNrLCAwKSAvIGNvcnJGYWN0b3I7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBzdWJ0cmFjdCA6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIGNvcnJGYWN0b3IgPSBjb3JyZWN0aW9uRmFjdG9yLmNhbGwobnVsbCwgdGhpcy5fdmFsdWUsIHZhbHVlKTtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNiYWNrKGFjY3VtLCBjdXJyLCBjdXJySSwgTykge1xuICAgICAgICAgICAgICAgIHJldHVybiBhY2N1bSAtIGNvcnJGYWN0b3IgKiBjdXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSBbdmFsdWVdLnJlZHVjZShjYmFjaywgdGhpcy5fdmFsdWUgKiBjb3JyRmFjdG9yKSAvIGNvcnJGYWN0b3I7ICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBtdWx0aXBseSA6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgZnVuY3Rpb24gY2JhY2soYWNjdW0sIGN1cnIsIGN1cnJJLCBPKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvcnJGYWN0b3IgPSBjb3JyZWN0aW9uRmFjdG9yKGFjY3VtLCBjdXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGFjY3VtICogY29yckZhY3RvcikgKiAoY3VyciAqIGNvcnJGYWN0b3IpIC9cbiAgICAgICAgICAgICAgICAgICAgKGNvcnJGYWN0b3IgKiBjb3JyRmFjdG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gW3RoaXMuX3ZhbHVlLCB2YWx1ZV0ucmVkdWNlKGNiYWNrLCAxKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRpdmlkZSA6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgZnVuY3Rpb24gY2JhY2soYWNjdW0sIGN1cnIsIGN1cnJJLCBPKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvcnJGYWN0b3IgPSBjb3JyZWN0aW9uRmFjdG9yKGFjY3VtLCBjdXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGFjY3VtICogY29yckZhY3RvcikgLyAoY3VyciAqIGNvcnJGYWN0b3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSBbdGhpcy5fdmFsdWUsIHZhbHVlXS5yZWR1Y2UoY2JhY2spOyAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGlmZmVyZW5jZSA6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguYWJzKG51bWVyYWwodGhpcy5fdmFsdWUpLnN1YnRyYWN0KHZhbHVlKS52YWx1ZSgpKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgRXhwb3NpbmcgTnVtZXJhbFxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8vIENvbW1vbkpTIG1vZHVsZSBpcyBkZWZpbmVkXG4gICAgaWYgKGhhc01vZHVsZSkge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IG51bWVyYWw7XG4gICAgfVxuXG4gICAgLypnbG9iYWwgZW5kZXI6ZmFsc2UgKi9cbiAgICBpZiAodHlwZW9mIGVuZGVyID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvLyBoZXJlLCBgdGhpc2AgbWVhbnMgYHdpbmRvd2AgaW4gdGhlIGJyb3dzZXIsIG9yIGBnbG9iYWxgIG9uIHRoZSBzZXJ2ZXJcbiAgICAgICAgLy8gYWRkIGBudW1lcmFsYCBhcyBhIGdsb2JhbCBvYmplY3QgdmlhIGEgc3RyaW5nIGlkZW50aWZpZXIsXG4gICAgICAgIC8vIGZvciBDbG9zdXJlIENvbXBpbGVyICdhZHZhbmNlZCcgbW9kZVxuICAgICAgICB0aGlzWydudW1lcmFsJ10gPSBudW1lcmFsO1xuICAgIH1cblxuICAgIC8qZ2xvYmFsIGRlZmluZTpmYWxzZSAqL1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKFtdLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVtZXJhbDtcbiAgICAgICAgfSk7XG4gICAgfVxufSkuY2FsbCh0aGlzKTtcbiIsImltcG9ydCBUaW1lciBmcm9tICd1aS90aW1lcic7XG5cbmxldCBfbGlzdGVuZXJzID0gU3ltYm9sKCksXG5cdF9jYW5jZWwgPSBTeW1ib2woKTtcblxuY2xhc3MgU3RyZWFtIHtcblx0Y29uc3RydWN0b3IoY2FsbGJhY2spIHtcblx0XHR0aGlzW19saXN0ZW5lcnNdID0gW107XG5cdFx0bGV0IHNpbmsgPSAodmFsdWUpID0+IHtcblx0XHRcdFRpbWVyLmltbWVkaWF0ZSgoKSA9PiB7XG5cdFx0XHRcdHRoaXNbX2xpc3RlbmVyc10ubWFwKMaSID0+IMaSKHZhbHVlKSk7XG5cdFx0XHR9KTtcblx0XHR9O1xuXHRcdGNhbGxiYWNrKHNpbmspO1xuXHR9XG5cdGNhbmNlbCgpIHtcblx0XHR0aGlzW19saXN0ZW5lcnNdID0gW107XG5cdH1cblx0Y2FuY2VsT24oc291cmNlKSB7XG5cdFx0bGV0IMaSO1xuXHRcdMaSID0gKCkgPT4ge1xuXHRcdFx0c291cmNlLnVuc3Vic2NyaWJlKMaSKTtcblx0XHRcdHRoaXMuY2FuY2VsKCk7XG5cdFx0fTtcblx0XHRzb3VyY2Uuc3Vic2NyaWJlKMaSKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHRzdWJzY3JpYmUoxpIpIHtcblx0XHR0aGlzW19saXN0ZW5lcnNdLnB1c2goxpIpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cdHVuc3Vic2NyaWJlKMaSKSB7XG5cdFx0dGhpc1tfbGlzdGVuZXJzXS5zcGxpY2UodGhpc1tfbGlzdGVuZXJzXS5pbmRleE9mKMaSKSwgMSk7XG5cdH1cblx0bWFwKMaSKSB7XG5cdFx0cmV0dXJuIFN0cmVhbS5tYXAodGhpcywgxpIpO1xuXHR9XG5cdGZpbHRlcijGkikge1xuXHRcdHJldHVybiBTdHJlYW0uZmlsdGVyKHRoaXMsIMaSKTtcblx0fVxuXHR1bmlxdWUoxpIpIHtcblx0XHRyZXR1cm4gU3RyZWFtLnVuaXF1ZSh0aGlzLCDGkik7XG5cdH1cblx0bG9nKHByZWZpeCkge1xuXHRcdHJldHVybiBTdHJlYW0ubG9nKHRoaXMsIHByZWZpeCk7XG5cdH1cblx0dG9Cb29sKCkge1xuXHRcdHJldHVybiBTdHJlYW0udG9Cb29sKHRoaXMpO1xuXHR9XG5cdG5lZ2F0ZSgpIHtcblx0XHRyZXR1cm4gU3RyZWFtLm5lZ2F0ZSh0aGlzKTtcblx0fVxuXHR6aXAoLi4ub3RoZXJzKSB7XG5cdFx0cmV0dXJuIFN0cmVhbS56aXAodGhpcywgLi4ub3RoZXJzKTtcblx0fVxuXHRzcHJlYWQoxpIpIHtcblx0XHRyZXR1cm4gU3RyZWFtLnNwcmVhZCh0aGlzLCDGkik7XG5cdH1cblx0ZmxhdE1hcCgpIHtcblx0XHRyZXR1cm4gU3RyZWFtLmZsYXRNYXAodGhpcyk7XG5cdH1cblx0bWVyZ2UoLi4ub3RoZXJzKSB7XG5cdFx0cmV0dXJuIFN0cmVhbS5tZXJnZSh0aGlzLCAuLi5vdGhlcnMpO1xuXHR9XG5cdHJlZHVjZShhY2MsIMaSKSB7XG5cdFx0cmV0dXJuIFN0cmVhbS5yZWR1Y2UodGhpcywgYWNjLCDGkik7XG5cdH1cblx0ZmVlZChkZXN0VmFsdWUpIHtcblx0XHRyZXR1cm4gU3RyZWFtLmZlZWQodGhpcywgZGVzdFZhbHVlKTtcblx0fVxuXHR3cmFwKMaSKSB7XG5cdFx0xpIodGhpcyk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0ZGVib3VuY2UoZGVsYXkpIHtcblx0XHRyZXR1cm4gU3RyZWFtLmRlYm91bmNlKHRoaXMsIGRlbGF5KTtcblx0fVxuXHRzeW5jKHN5bmNocm9uaXplcikge1xuXHRcdHJldHVybiBTdHJlYW0uc3luYyh0aGlzLCBzeW5jaHJvbml6ZXIpO1xuXHR9XG59XG5cbmNsYXNzIFB1c2hTdHJlYW0gZXh0ZW5kcyBTdHJlYW0ge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigoc2luaykgPT4gdGhpcy5wdXNoID0gc2luayk7XG5cdH1cbn1cblxuY2xhc3MgQ2FuY2VsYWJsZVN0cmVhbSBleHRlbmRzIFB1c2hTdHJlYW0ge1xuXHRjb25zdHJ1Y3RvcihjYW5jZWzGkikge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpc1tfY2FuY2VsXSA9IGNhbmNlbMaSLmJpbmQodGhpcyk7XG5cdH1cblx0Y2FuY2VsKCkge1xuXHRcdHRoaXNbX2NhbmNlbF0oKTtcblx0XHRzdXBlcigpO1xuXHR9XG59XG5cbi8vIHNob3VsZCBJIHByb3BhZ2F0ZSB0aGUgY2FuY2VsIG1ldGhvZD9cblN0cmVhbS5zdWJzY3JpYmUgPSBmdW5jdGlvbihzb3VyY2UsIMaSKSB7XG5cdGxldCBixpIsXG5cdFx0c3RyZWFtID0gbmV3IENhbmNlbGFibGVTdHJlYW0oZnVuY3Rpb24oKSB7XG5cdFx0XHRzb3VyY2UudW5zdWJzY3JpYmUoYsaSKTtcblx0XHR9KTtcblx0YsaSID0gxpIuYmluZChudWxsLCBzdHJlYW0pO1xuXHRzb3VyY2Uuc3Vic2NyaWJlKGLGkik7XG5cdHJldHVybiBzdHJlYW07XG59O1xuU3RyZWFtLm1hcCA9IGZ1bmN0aW9uKHNvdXJjZSwgxpIpIHtcblx0cmV0dXJuIHRoaXMuc3Vic2NyaWJlKHNvdXJjZSwgKHN0cmVhbSwgdmFsdWUpID0+IHN0cmVhbS5wdXNoKMaSKHZhbHVlKSkpO1xufTtcblN0cmVhbS5maWx0ZXIgPSBmdW5jdGlvbihzb3VyY2UsIMaSKSB7XG5cdHJldHVybiB0aGlzLnN1YnNjcmliZShzb3VyY2UsIChzdHJlYW0sIHZhbHVlKSA9PiB7IGlmKMaSKHZhbHVlKSkgc3RyZWFtLnB1c2godmFsdWUpIH0pO1xufTtcblN0cmVhbS51bmlxdWUgPSBmdW5jdGlvbihzb3VyY2UsIMaSID0gaSA9PiB7aX0pIHtcblx0cmV0dXJuIHRoaXMuZmlsdGVyKHNvdXJjZSwgKGZ1bmN0aW9uKCkge1xuXHRcdGxldCBsYXN0LCB0O1xuXHRcdHJldHVybiBmdW5jdGlvbih2KSB7XG5cdFx0XHR0ID0gxpIodik7XG5cdFx0XHRpZihsYXN0ICE9PSB0KSB7XG5cdFx0XHRcdGxhc3QgPSB0O1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KSgpKTtcbn07XG5TdHJlYW0udG9Cb29sID0gZnVuY3Rpb24oc291cmNlKSB7XG5cdHJldHVybiB0aGlzLm1hcChzb3VyY2UsICh2KSA9PiAhIXYpO1xufTtcblN0cmVhbS5uZWdhdGUgPSBmdW5jdGlvbihzb3VyY2UpIHtcblx0cmV0dXJuIHRoaXMubWFwKHNvdXJjZSwgKHYpID0+ICF2KTtcbn07XG5TdHJlYW0ubG9nID0gZnVuY3Rpb24oc291cmNlLCBwcmVmaXgpIHtcblx0cmV0dXJuIHRoaXMubWFwKHNvdXJjZSwgKHYpID0+IHtcblx0XHRpZihwcmVmaXgpXG5cdFx0XHRjb25zb2xlLmxvZyhwcmVmaXgsIHYpO1xuXHRcdGVsc2Vcblx0XHRcdGNvbnNvbGUubG9nKHYpO1xuXHRcdHJldHVybiB2O1xuXHR9KTtcbn07XG5TdHJlYW0uemlwID0gZnVuY3Rpb24oLi4uc291cmNlcykge1xuXHRsZXQgbGVuZ3RoID0gc291cmNlcy5sZW5ndGgsXG5cdFx0dW5zdWJzID0gW10sXG5cdFx0c3RyZWFtID0gbmV3IENhbmNlbGFibGVTdHJlYW0oKCkgPT4geyB1bnN1YnMubWFwKChzb3VyY2UsIGkpID0+IHNvdXJjZXNbaV0udW5zdWJzY3JpYmUodW5zdWJzW2ldKSkgfSksXG5cdFx0dmFsdWVzID0gbmV3IEFycmF5KGxlbmd0aCksXG5cdFx0ZmxhZ3MgID0gbmV3IEFycmF5KGxlbmd0aCksXG5cdFx0dXBkYXRlID0gKCkgPT4ge1xuXHRcdFx0aWYoZmxhZ3MuZmlsdGVyKCh2KSA9PiB2KS5sZW5ndGggPT09IGxlbmd0aCkge1xuXHRcdFx0XHR1cGRhdGUgPSAoKSA9PiBzdHJlYW0ucHVzaCh2YWx1ZXMpO1xuXHRcdFx0XHR1cGRhdGUoKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuXHRcdCgoaSkgPT4ge1xuXHRcdFx0c291cmNlc1tpXS5zdWJzY3JpYmUodW5zdWJzW2ldID0gKHYpID0+IHtcblx0XHRcdFx0dmFsdWVzW2ldID0gdjtcblx0XHRcdFx0ZmxhZ3NbaV0gPSB0cnVlO1xuXHRcdFx0XHR1cGRhdGUoKTtcblx0XHRcdH0pO1xuXHRcdH0pKGkpO1xuXHR9XG5cdHJldHVybiBzdHJlYW07XG59O1xuU3RyZWFtLnN5bmMgPSBmdW5jdGlvbihzb3VyY2UsIHN5bmNocm9uaXplcikge1xuXHRsZXQgc3RyZWFtICAgPSBuZXcgUHVzaFN0cmVhbSgpLFxuXHRcdGhhc3ZhbHVlID0gZmFsc2UsXG5cdFx0aGFzcHVsc2UgPSBmYWxzZSxcblx0XHR2YWx1ZTtcblx0c3luY2hyb25pemVyLnN1YnNjcmliZSgoKSA9PiB7XG5cdFx0aWYoaGFzdmFsdWUpIHtcblx0XHRcdGhhc3ZhbHVlID0gZmFsc2U7XG5cdFx0XHRzdHJlYW0ucHVzaCh2YWx1ZSk7XG5cdFx0XHR2YWx1ZSA9IHVuZGVmaW5lZDtcblx0XHR9IGVsc2UgaWYoIWhhc3B1bHNlKSB7XG5cdFx0XHRoYXNwdWxzZSA9IHRydWU7XG5cdFx0fVxuXHR9KTtcblx0c291cmNlLnN1YnNjcmliZSh2ID0+IHtcblx0XHR2YWx1ZSA9IHY7XG5cdFx0aGFzdmFsdWUgPSB0cnVlO1xuXHRcdGlmKGhhc3B1bHNlKSB7XG5cdFx0XHRoYXNwdWxzZSA9IGZhbHNlO1xuXHRcdFx0c3RyZWFtLnB1c2godmFsdWUpO1xuXHRcdFx0dmFsdWUgPSB1bmRlZmluZWQ7XG5cdFx0XHRoYXN2YWx1ZSA9IGZhbHNlO1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiBzdHJlYW07XG59O1xuU3RyZWFtLmRlYm91bmNlID0gZnVuY3Rpb24oc291cmNlLCBkZWxheSkge1xuXHRsZXQgc3RyZWFtICAgPSBuZXcgUHVzaFN0cmVhbSgpLFxuXHRcdGRlbGF5aW5nID0gZmFsc2UsXG5cdFx0dDtcblx0c291cmNlLnN1YnNjcmliZSh2ID0+IHtcblx0XHR0ID0gdjtcblx0XHRpZihkZWxheWluZylcblx0XHRcdHJldHVybjtcblx0XHRkZWxheWluZyA9IHRydWU7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdGRlbGF5aW5nID0gZmFsc2U7XG5cdFx0XHRzdHJlYW0ucHVzaCh0KTtcblx0XHR9LCBkZWxheSk7XG5cdH0pO1xuXHRyZXR1cm4gc3RyZWFtO1xufTtcblN0cmVhbS5zcHJlYWQgPSBmdW5jdGlvbihzb3VyY2UsIMaSKSB7XG5cdHJldHVybiB0aGlzLnN1YnNjcmliZShzb3VyY2UsIChzdHJlYW0sIGFycikgPT4gc3RyZWFtLnB1c2goxpIuYXBwbHkobnVsbCwgYXJyKSkpO1xufTtcblN0cmVhbS5mbGF0TWFwID0gZnVuY3Rpb24oc291cmNlKSB7XG5cdHJldHVybiB0aGlzLnN1YnNjcmliZShzb3VyY2UsIChzdHJlYW0sIGFycikgPT4ge1xuXHRcdGZvcihsZXQgdiBpbiBhcnIpXG5cdFx0XHRzdHJlYW0ucHVzaCh2KTtcblx0fSk7XG59O1xuU3RyZWFtLm1lcmdlID0gZnVuY3Rpb24oLi4uc291cmNlcykge1xuXHRsZXQgc3RyZWFtLFxuXHRcdMaSID0gKHYpID0+IHN0cmVhbS5wdXNoKHYpO1xuXHRzdHJlYW0gPSBuZXcgQ2FuY2VsYWJsZVN0cmVhbSgoKSA9PiB7XG5cdFx0c291cmNlcy5tYXAoKHNvdXJjZSkgPT4gc291cmNlLnVuc3Vic2NyaWJlKMaSKSk7XG5cdH0pO1xuXHRzb3VyY2VzLm1hcCgoc291cmNlKSA9PiBzb3VyY2Uuc3Vic2NyaWJlKMaSKSk7XG5cdHJldHVybiBzdHJlYW07XG59O1xuU3RyZWFtLmludGVydmFsID0gZnVuY3Rpb24obXMsIHZhbHVlKSB7XG5cdGxldCBpZCxcblx0XHRzdHJlYW0gPSBuZXcgQ2FuY2VsYWJsZVN0cmVhbShmdW5jdGlvbigpIHsgY2xlYXJJbnRlcnZhbChpZCk7IH0pO1xuXHRpZCA9IHNldEludGVydmFsKCgpID0+IHN0cmVhbS5wdXNoKHZhbHVlKSwgbXMpO1xuXHRyZXR1cm4gc3RyZWFtO1xufTtcblN0cmVhbS5kZWxheSA9IGZ1bmN0aW9uKG1zLCB2YWx1ZSkge1xuXHRsZXQgaWQsXG5cdFx0c3RyZWFtID0gbmV3IENhbmNlbGFibGVTdHJlYW0oZnVuY3Rpb24oKSB7IGNsZWFyVGltZW91dChpZCk7IH0pO1xuXHRpZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdHN0cmVhbS5wdXNoKHZhbHVlKTtcblx0XHQvLyBjYW5jZWwgbmVlZHMgdG8gaGFwcGVuIGFmdGVyIHRoZSBwdXNoIGlzIHJlYWxpemVkXG5cdFx0VGltZXIuaW1tZWRpYXRlKHN0cmVhbS5jYW5jZWwuYmluZChzdHJlYW0pKTtcblx0fSwgbXMpO1xuXHRyZXR1cm4gc3RyZWFtO1xufTtcblN0cmVhbS5yZWR1Y2UgPSBmdW5jdGlvbihzb3VyY2UsIGFjYywgxpIpIHtcblx0cmV0dXJuIHRoaXMuc3Vic2NyaWJlKHNvdXJjZSwgKHN0cmVhbSwgdmFsdWUpID0+IHN0cmVhbS5wdXNoKGFjYyA9IMaSKGFjYywgdmFsdWUpKSk7XG59O1xuU3RyZWFtLmZlZWQgPSBmdW5jdGlvbihzb3VyY2UsIGRlc3QpIHtcblx0cmV0dXJuIHRoaXMuc3Vic2NyaWJlKHNvdXJjZSwgKHN0cmVhbSwgdmFsdWUpID0+IHtcblx0XHRzdHJlYW0ucHVzaCh2YWx1ZSk7XG5cdFx0ZGVzdC5wdXNoKHZhbHVlKTtcblx0fSk7XG59O1xuU3RyZWFtLmZyb21BcnJheSA9IGZ1bmN0aW9uKHZhbHVlcykge1xuXHRsZXQgc3RyZWFtID0gbmV3IFB1c2hTdHJlYW0oKTtcblx0dmFsdWVzLm1hcCgodikgPT4gc3RyZWFtLnB1c2godikpO1xuXHRyZXR1cm4gc3RyZWFtO1xufTtcblN0cmVhbS5zZXF1ZW5jZSA9IGZ1bmN0aW9uKHZhbHVlcywgaW50ZXJ2YWwsIHJlcGVhdCA9IGZhbHNlKSB7XG5cdGxldCBpZCxcblx0XHRzdHJlYW0gPSBuZXcgQ2FuY2VsYWJsZVN0cmVhbShmdW5jdGlvbigpIHsgY2xlYXJJbnRlcnZhbChpZCk7IH0pLFxuXHRcdGluZGV4ID0gMDtcblxuXHRpZCA9IHNldEludGVydmFsKCgpID0+IHtcblx0XHRpZihpbmRleCA9PT0gdmFsdWVzLmxlbmd0aCkge1xuXHRcdFx0aWYocmVwZWF0KSB7XG5cdFx0XHRcdGluZGV4ID0gMDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNsZWFySW50ZXJ2YWwoaWQpO1xuXHRcdFx0XHR0aGlzLmNhbmNlbCgpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHN0cmVhbS5wdXNoKHZhbHVlc1tpbmRleCsrXSk7XG5cdH0sIGludGVydmFsKTtcblx0cmV0dXJuIHN0cmVhbTtcbn07XG4vLyBUT0RPXG4vLyB1bnRpbCjGkilcbi8vIHRha2Uobilcbi8vIHNraXAobilcbi8vIHRocm90dGxlXG4vLyBmaWVsZChuYW1lKVxuLy8gbWV0aG9kKG5hbWUsIC4uLmFyZ3MpXG5cbmV4cG9ydCB7IFN0cmVhbSwgUHVzaFN0cmVhbSB9OyIsImltcG9ydCB7IFN0cmVhbSB9IGZyb20gJy4vc3RyZWFtJ1xuXG52YXIgX3ZhbHVlID0gU3ltYm9sKCksXG5cdF9kZWZhdWx0VmFsdWUgPSBTeW1ib2woKSxcblx0X3VwZGF0ZSA9IFN5bWJvbCgpO1xuXG5leHBvcnQgY2xhc3MgVmFsdWUgZXh0ZW5kcyBTdHJlYW0ge1xuXHRjb25zdHJ1Y3Rvcih2YWx1ZSwgZGVmYXVsdFZhbHVlKSB7XG5cdFx0bGV0IGNhbGxiYWNrID0gKHNpbmspID0+IHtcblx0XHRcdHRoaXNbX3VwZGF0ZV0gPSBzaW5rO1xuXHRcdH07XG5cdFx0c3VwZXIoY2FsbGJhY2spO1xuXHRcdHRoaXNbX2RlZmF1bHRWYWx1ZV0gPSBkZWZhdWx0VmFsdWU7XG5cdFx0dGhpc1tfdmFsdWVdID0gdmFsdWU7XG5cdH1cblx0c3Vic2NyaWJlKMaSKSB7XG5cdFx0xpIodGhpc1tfdmFsdWVdKTtcblx0XHRzdXBlci5zdWJzY3JpYmUoxpIpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cdHB1c2godmFsdWUpIHtcblx0XHRpZih2YWx1ZSA9PT0gdGhpc1tfdmFsdWVdKVxuXHRcdFx0cmV0dXJuO1xuXHRcdHRoaXNbX3ZhbHVlXSA9IHZhbHVlO1xuXHRcdHRoaXNbX3VwZGF0ZV0odmFsdWUpO1xuXHR9XG5cdGdldCB2YWx1ZSgpIHtcblx0XHRyZXR1cm4gdGhpc1tfdmFsdWVdO1xuXHR9XG5cdHNldCB2YWx1ZSh2KSB7XG5cdFx0dGhpcy5wdXNoKHYpO1xuXHR9XG5cdGdldCBpc0RlZmF1bHQoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3ZhbHVlXSA9PT0gdGhpc1tfZGVmYXVsdFZhbHVlXTtcblx0fVxuXHRyZXNldCgpIHtcblx0XHR0aGlzLnZhbHVlID0gdGhpc1tfZGVmYXVsdFZhbHVlXTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgU3RyaW5nVmFsdWUgZXh0ZW5kcyBWYWx1ZSB7XG5cdGNvbnN0cnVjdG9yKHZhbHVlID0gXCJcIiwgZGVmYXVsdFZhbHVlID0gdmFsdWUpIHtcblx0XHRzdXBlcih2YWx1ZSwgZGVmYXVsdFZhbHVlKTtcblx0fVxuXHRwdXNoKHZhbHVlKSB7XG5cdFx0c3VwZXIucHVzaCgodmFsdWUgJiYgdmFsdWUudG9TdHJpbmcgJiYgdmFsdWUudG9TdHJpbmcoKSkgfHwgKHZhbHVlICYmIChcIlwiICsgdmFsdWUpKSB8fCBcIlwiKTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgQm9vbFZhbHVlIGV4dGVuZHMgVmFsdWUge1xuXHRjb25zdHJ1Y3Rvcih2YWx1ZSA9IGZhbHNlLCBkZWZhdWx0VmFsdWUgPSB2YWx1ZSkge1xuXHRcdHN1cGVyKHZhbHVlLCBkZWZhdWx0VmFsdWUpO1xuXHR9XG5cdHB1c2godmFsdWUpIHtcblx0XHRzdXBlci5wdXNoKCEhdmFsdWUpO1xuXHR9XG5cdHRvZ2dsZSgpIHtcblx0XHR0aGlzLnB1c2goIXRoaXMudmFsdWUpO1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBOdW1iZXJWYWx1ZSBleHRlbmRzIFZhbHVlIHtcblx0Y29uc3RydWN0b3IodmFsdWUgPSAwLjAsIGRlZmF1bHRWYWx1ZSA9IHZhbHVlKSB7XG5cdFx0c3VwZXIodmFsdWUsIGRlZmF1bHRWYWx1ZSk7XG5cdH1cblx0cHVzaCh2YWx1ZSkge1xuXHRcdHN1cGVyLnB1c2goK25ldyBOdW1iZXIodmFsdWUpKTtcblx0fVxufVxuXG52YXIgZGVmYXVsdERhdGUgPSBuZXcgRGF0ZShudWxsKTtcbmV4cG9ydCBjbGFzcyBEYXRlVmFsdWUgZXh0ZW5kcyBWYWx1ZSB7XG5cdGNvbnN0cnVjdG9yKHZhbHVlID0gZGVmYXVsdERhdGUsIGRlZmF1bHRWYWx1ZSA9IHZhbHVlKSB7XG5cdFx0c3VwZXIodmFsdWUsIGRlZmF1bHRWYWx1ZSk7XG5cdH1cblx0cHVzaCh2YWx1ZSkge1xuXHRcdHN1cGVyLnB1c2gobmV3IERhdGUodmFsdWUpKTtcblx0fVxufSIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxidXR0b24+PHNwYW4gY2xhc3M9XFxcImNvbnRlbnRcXFwiPjwvc3Bhbj48L2J1dHRvbj5cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnQnO1xuaW1wb3J0IHsgUHVzaFN0cmVhbSB9IGZyb20gJ3N0cmVhbXkvc3RyZWFtJztcbmltcG9ydCB7IEljb25Qcm9wZXJ0eSwgQ2xpY2tQcm9wZXJ0eSB9IGZyb20gJy4vcHJvcGVydGllcy90eXBlcyc7XG5cbmxldCB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4vYnV0dG9uLmphZGUnKSgpLFxuXHRfY2xpY2sgICA9IFN5bWJvbCgpO1xuXG5jbGFzcyBCdXR0b24gZXh0ZW5kcyBDb21wb25lbnQge1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcblx0XHRpZighKCd0ZW1wbGF0ZScgaW4gb3B0aW9ucykpXG5cdFx0XHRvcHRpb25zLnRlbXBsYXRlID0gdGVtcGxhdGU7XG5cdFx0c3VwZXIob3B0aW9ucyk7XG5cdFx0dGhpcy5wcm9wZXJ0aWVzLmFkZChuZXcgQ2xpY2tQcm9wZXJ0eSgpKTtcblx0fVxufVxuXG5CdXR0b24uaWNvbiA9IGZ1bmN0aW9uKG5hbWUsIG9wdGlvbnMpIHtcblx0bGV0IGJ1dHRvbiA9IG5ldyBCdXR0b24ob3B0aW9ucyk7XG5cdGJ1dHRvbi5wcm9wZXJ0aWVzLmFkZChuZXcgSWNvblByb3BlcnR5KG5hbWUpKTtcblx0cmV0dXJuIGJ1dHRvbjtcbn07XG5cbmV4cG9ydCB7IEJ1dHRvbiB9OyIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7IERvY1VJIH0gZnJvbSAnLi9kb2N1aSc7XG5pbXBvcnQgeyBDb250ZXh0VUkgfSBmcm9tICcuL2NvbnRleHR1aSc7XG5pbXBvcnQgeyBNb2RlbFVJIH0gZnJvbSAnLi9tb2RlbHVpJztcblxubGV0IF9wID0gU3ltYm9sKCk7XG5cbmV4cG9ydCBjbGFzcyBDYXJkVUkgZXh0ZW5kcyBDb21wb25lbnQge1xuXHRjb25zdHJ1Y3RvcihzY2hlbWEsIG1vZGVsKSB7XG5cdFx0c3VwZXIoeyB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJjYXJkXCI+PC9kaXY+JyB9KTtcblx0XHRsZXQgZG9jdWkgPSBuZXcgRG9jVUkoKSxcblx0XHRcdGNvbnRleHR1aSA9IG5ldyBDb250ZXh0VUkoKSxcblx0XHRcdG1vZGVsdWkgPSBuZXcgTW9kZWxVSShtb2RlbCwgc2NoZW1hKTtcblxuXHRcdHRoaXNbX3BdID0ge1xuXHRcdFx0ZG9jdWksXG5cdFx0XHRjb250ZXh0dWksXG5cdFx0XHRtb2RlbHVpLFxuXHRcdFx0c2NoZW1hLFxuXHRcdFx0bW9kZWxcblx0XHR9O1xuXG5cdFx0ZG9jdWkuYXR0YWNoVG8odGhpcy5lbCk7XG5cblx0XHRsZXQgYXNpZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhc2lkZScpO1xuXHRcdHRoaXMuZWwuYXBwZW5kQ2hpbGQoYXNpZGUpO1xuXG5cdFx0Y29udGV4dHVpLmF0dGFjaFRvKGFzaWRlKTtcblxuXHRcdG1vZGVsdWkuYXR0YWNoVG8oYXNpZGUpO1xuXHR9XG5cblx0Z2V0IGRvY3VpKCkge1xuXHRcdHJldHVybiB0aGlzW19wXS5kb2N1aTtcblx0fVxuXG5cdGdldCBjb250ZXh0dWkoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3BdLmNvbnRleHR1aTtcblx0fVxuXG5cdGdldCBtb2RlbHVpKCkge1xuXHRcdHJldHVybiB0aGlzW19wXS5tb2RlbHVpO1xuXHR9XG5cblx0Z2V0IHNjaGVtYSgpIHtcblx0XHRyZXR1cm4gdGhpc1tfcF0uc2NoZW1hO1xuXHR9XG5cblx0Z2V0IG1vZGVsKCkge1xuXHRcdHJldHVybiB0aGlzW19wXS5tb2RlbDtcblx0fVxufSIsImltcG9ydCB7IEh0bWwgfSBmcm9tICd1aS9kb20nO1xuaW1wb3J0IHsgUHJvcGVydGllcyB9IGZyb20gJy4vcHJvcGVydGllcyc7XG5pbXBvcnQgeyBQdXNoU3RyZWFtIH0gZnJvbSAnc3RyZWFteS9zdHJlYW0nO1xuXG5sZXQgY3JlYXRlSWQgPSByZXF1aXJlKCdub2RlLXV1aWQnKS52NDtcblxubGV0IF9wID0gU3ltYm9sKCk7XG5cbmNsYXNzIENvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuXHRcdG5ldyBQcm9wZXJ0aWVzKHRoaXMpO1xuXHRcdHRoaXNbX3BdID0ge1xuXHRcdFx0Y2hpbGRyZW46IFtdLFxuXHRcdFx0ZWw6IEh0bWwucGFyc2Uob3B0aW9ucy50ZW1wbGF0ZSksXG5cdFx0XHRhdHRhY2hlZDogZmFsc2UsXG5cdFx0XHR1dWlkOiBvcHRpb25zLnV1aWQgfHwgY3JlYXRlSWQoKSxcblx0XHRcdGZvY3VzU3RyZWFtOiBuZXcgUHVzaFN0cmVhbSgpXG5cdFx0fTtcblx0XHRpZihvcHRpb25zLmNsYXNzZXMpXG5cdFx0XHR0aGlzW19wXS5lbC5jbGFzc0xpc3QuYWRkKG9wdGlvbnMuY2xhc3Nlcyk7XG5cdFx0aWYob3B0aW9ucy5wYXJlbnQpXG5cdFx0XHRvcHRpb25zLnBhcmVudC5hZGQodGhpcyk7XG5cdH1cblxuXHRhdHRhY2hUbyhjb250YWluZXIpIHtcblx0XHRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5lbCk7XG5cdFx0dGhpc1tfcF0uYXR0YWNoZWQgPSB0cnVlO1xuXHR9XG5cblx0ZGV0YWNoKCkge1xuXHRcdGlmKCF0aGlzLmlzQXR0YWNoZWQpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NvbXBvbmVudCBpcyBub3QgYXR0YWNoZWQnKTtcblx0XHR0aGlzLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5lbCk7XG5cdFx0dGhpc1tfcF0uYXR0YWNoZWQgPSBmYWxzZTtcblx0fVxuXG5cdGRlc3Ryb3koKSB7XG5cdFx0aWYodGhpcy5wYXJlbnQpXG5cdFx0XHR0aGlzLnBhcmVudC5yZW1vdmUodGhpcyk7XG5cdFx0aWYodGhpcy5pc0F0dGFjaGVkKVxuXHRcdFx0dGhpcy5kZXRhY2goKTtcblx0XHR0aGlzLnByb3BlcnRpZXMucmVtb3ZlQWxsKCk7XG5cdH1cblxuXHRhZGQoY2hpbGQpIHtcblx0XHRpZihjaGlsZC5wYXJlbnQpXG5cdFx0XHRjaGlsZC5wYXJlbnQucmVtb3ZlKGNoaWxkKTtcblx0XHR0aGlzW19wXS5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcblx0XHRjaGlsZFtfcF0ucGFyZW50ID0gdGhpcztcblx0XHRjaGlsZFtfcF0uX19jYW5jZWxGb2N1c1N0cmVhbSA9IGNoaWxkLmZvY3VzU3RyZWFtLmZlZWQodGhpcy5mb2N1c1N0cmVhbSk7XG5cdH1cblxuXHRyZW1vdmUoY2hpbGQpIHtcblx0XHRsZXQgaSA9IHRoaXNbX3BdLmNoaWxkcmVuLmluZGV4T2YoY2hpbGQpO1xuXHRcdGlmKGkgPCAwKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGAnJHtjaGlsZH0gaXMgbm90IGNoaWxkIG9mIHRoaXMnYCk7XG5cdFx0Y2hpbGRbX3BdLl9fY2FuY2VsRm9jdXNTdHJlYW0uY2FuY2VsKCk7XG5cdFx0dGhpc1tfcF0uY2hpbGRyZW4uc3BsaWNlKGksIDEpO1xuXHRcdGNoaWxkW19wXS5wYXJlbnQgPSBudWxsO1xuXHR9XG5cblx0Z2V0IGVsKCkge1xuXHRcdHJldHVybiB0aGlzW19wXS5lbDtcblx0fVxuXG5cdGdldCBwYXJlbnQoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3BdLnBhcmVudDtcblx0fVxuXG5cdGdldCBmb2N1c1N0cmVhbSgpIHtcblx0XHRyZXR1cm4gdGhpc1tfcF0uZm9jdXNTdHJlYW07XG5cdH1cblxuXHRnZXQgdXVpZCgpIHtcblx0XHRyZXR1cm4gdGhpc1tfcF0udXVpZDtcblx0fVxuXG5cdGdldCBpc0F0dGFjaGVkKCkge1xuXHRcdHJldHVybiB0aGlzW19wXS5hdHRhY2hlZDtcblx0fVxuXG5cdHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiBgY29tcG9uZW50OiAke3RoaXMudXVpZH1gO1xuXHR9XG59XG5cbmV4cG9ydCB7IENvbXBvbmVudCB9OyIsImltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJ3VpL2J1dHRvbic7XG5pbXBvcnQgeyBUb29sYmFyIH0gZnJvbSAnLi90b29sYmFyJztcblxuZXhwb3J0IGNsYXNzIENvbnRleHRUb29sYmFyIGV4dGVuZHMgVG9vbGJhciB7XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblx0XHRzdXBlcihvcHRpb25zKTtcblxuXHRcdHRoaXMubGVmdC5hZGQoQnV0dG9uLmljb24oJ3N0YXInKSk7XG5cdH1cbn0iLCJpbXBvcnQgeyBDb250ZXh0VG9vbGJhciB9IGZyb20gJy4vY29udGV4dHRvb2xiYXInO1xuaW1wb3J0IHsgQ29udGV4dFZpZXcgfSBmcm9tICcuL2NvbnRleHR2aWV3JztcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50JztcblxubGV0IF9wID0gU3ltYm9sKCk7XG5cbmV4cG9ydCBjbGFzcyBDb250ZXh0VUkgZXh0ZW5kcyBDb21wb25lbnQge1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKHsgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwiY29udGV4dFwiPjwvZGl2PicgfSk7XG5cdFx0bGV0IHRvb2xiYXIgPSBuZXcgQ29udGV4dFRvb2xiYXIoKSxcblx0XHRcdHZpZXcgICAgPSBuZXcgQ29udGV4dFZpZXcoKTtcblxuXHRcdHRoaXNbX3BdID0ge1xuXHRcdFx0dG9vbGJhcixcblx0XHRcdHZpZXdcblx0XHR9O1xuXG5cdFx0dG9vbGJhci5hdHRhY2hUbyh0aGlzLmVsKTtcblx0XHR2aWV3LmF0dGFjaFRvKHRoaXMuZWwpO1xuXHR9XG5cblx0Z2V0IHRvb2xiYXIoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3BdLnRvb2xiYXI7XG5cdH1cblxuXHRnZXQgdmlldygpIHtcblx0XHRyZXR1cm4gdGhpc1tfcF0udmlldztcblx0fVxufSIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcImNvbnRleHR2aWV3XFxcIj48L2Rpdj5cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnQnO1xuaW1wb3J0IHsgRmllbGQgfSBmcm9tICcuL2ZpZWxkJztcblxubGV0IHRlbXBsYXRlID0gcmVxdWlyZSgnLi9jb250ZXh0dmlldy5qYWRlJykoKTtcblxuZXhwb3J0IGNsYXNzIENvbnRleHRWaWV3IGV4dGVuZHMgQ29tcG9uZW50IHtcblx0Y29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG5cdFx0aWYoISgndGVtcGxhdGUnIGluIG9wdGlvbnMpKVxuXHRcdFx0b3B0aW9ucy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuXHRcdHN1cGVyKG9wdGlvbnMpO1xuXHR9XG59IiwiaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAndWkvYnV0dG9uJztcbmltcG9ydCB7IEZvb3RlciB9IGZyb20gJy4vZm9vdGVyJztcblxuZXhwb3J0IGNsYXNzIERvY0Zvb3RlciBleHRlbmRzIEZvb3RlciB7XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblx0XHRzdXBlcihvcHRpb25zKTtcblxuXHRcdHRoaXMuYWRkKEJ1dHRvbi5pY29uKCdzdGFyJykpO1xuXHR9XG59IiwiaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAndWkvYnV0dG9uJztcbmltcG9ydCB7IFRvb2xiYXIgfSBmcm9tICcuL3Rvb2xiYXInO1xuXG5leHBvcnQgY2xhc3MgRG9jVG9vbGJhciBleHRlbmRzIFRvb2xiYXIge1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG5cdFx0c3VwZXIob3B0aW9ucyk7XG5cblx0XHR0aGlzLmxlZnQuYWRkKEJ1dHRvbi5pY29uKCdzdGFyJykpO1xuXHR9XG59IiwiaW1wb3J0IHsgRG9jVG9vbGJhciB9IGZyb20gJy4vZG9jdG9vbGJhcic7XG5pbXBvcnQgeyBEb2NGb290ZXIgfSBmcm9tICcuL2RvY2Zvb3Rlcic7XG5pbXBvcnQgeyBEb2NWaWV3IH0gZnJvbSAnLi9kb2N2aWV3JztcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50JztcblxubGV0IF9wID0gU3ltYm9sKCk7XG5cbmV4cG9ydCBjbGFzcyBEb2NVSSBleHRlbmRzIENvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKHsgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwiZG9jXCI+PC9kaXY+JyB9KTtcblx0XHRsZXQgdG9vbGJhciA9IG5ldyBEb2NUb29sYmFyKCksXG5cdFx0XHR2aWV3ICAgID0gbmV3IERvY1ZpZXcoKSxcblx0XHRcdGZvb3RlciAgPSBuZXcgRG9jRm9vdGVyKCk7XG5cblx0XHR0aGlzW19wXSA9IHtcblx0XHRcdHRvb2xiYXIsXG5cdFx0XHR2aWV3LFxuXHRcdFx0Zm9vdGVyXG5cdFx0fTtcblxuXHRcdHRvb2xiYXIuYXR0YWNoVG8odGhpcy5lbCk7XG5cdFx0dmlldy5hdHRhY2hUbyh0aGlzLmVsKTtcblx0XHRmb290ZXIuYXR0YWNoVG8odGhpcy5lbCk7XG5cdH1cblxuXHRnZXQgdG9vbGJhcigpIHtcblx0XHRyZXR1cm4gdGhpc1tfcF0udG9vbGJhcjtcblx0fVxuXG5cdGdldCBmb290ZXIoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3BdLmZvb3Rlcjtcblx0fVxuXG5cdGdldCB2aWV3KCkge1xuXHRcdHJldHVybiB0aGlzW19wXS52aWV3O1xuXHR9XG59IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG5cbmJ1Zi5wdXNoKFwiPGFydGljbGUgY2xhc3M9XFxcImRvY3ZpZXdcXFwiPjwvYXJ0aWNsZT5cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnQnO1xuXG5sZXQgdGVtcGxhdGUgPSByZXF1aXJlKCcuL2RvY3ZpZXcuamFkZScpKCk7XG5cbmV4cG9ydCBjbGFzcyBEb2NWaWV3IGV4dGVuZHMgQ29tcG9uZW50IHtcblx0Y29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG5cdFx0aWYoISgndGVtcGxhdGUnIGluIG9wdGlvbnMpKVxuXHRcdFx0b3B0aW9ucy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuXHRcdHN1cGVyKG9wdGlvbnMpO1xuXHR9XG59IiwibGV0IHAgPSBTeW1ib2woKSxcblx0SHRtbCA9IHtcblx0cGFyc2VBbGwoaHRtbCkge1xuXHRcdGxldCBlbCAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0ZWwuaW5uZXJIVE1MID0gaHRtbDtcblx0XHRyZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGVsLmNoaWxkTm9kZXMpO1xuXHR9LFxuXHRwYXJzZShodG1sKSB7XG5cdFx0cmV0dXJuIHRoaXMucGFyc2VBbGwoaHRtbClbMF07XG5cdH1cbn07XG5cbmNsYXNzIERvbVN0cmVhbSB7XG5cdGNvbnN0cnVjdG9yKHNvdXJjZSkge1xuXHRcdHRoaXNbcF0gPSBzb3VyY2U7XG5cdH1cblx0b24oZXZlbnQsIGVsKSB7XG5cdFx0bGV0IMaSID0gKGUpID0+IHRoaXNbcF0ucHVzaChlKTtcblx0XHRlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCDGkiwgZmFsc2UpO1xuXHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHRlbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCDGkiwgZmFsc2UpO1xuXHRcdH07XG5cdH1cblx0YXBwbHlEaXNwbGF5KGVsLCBkaXNwbGF5ID0gXCJcIikge1xuXHRcdGxldCBvbGQgPSBlbC5zdHlsZS5kaXNwbGF5LFxuXHRcdFx0xpIgPSAodikgPT4gZWwuc3R5bGUuZGlzcGxheSA9IHYgPyBkaXNwbGF5IDogXCJub25lXCI7XG5cdFx0dGhpc1twXS5zdWJzY3JpYmUoxpIpO1xuXHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHR0aGlzW3BdLnVuc3Vic2NyaWJlKMaSKTtcblx0XHRcdGVsLnN0eWxlLmRpc3BsYXkgPSBvbGQ7XG5cdFx0fTtcblx0fVxuXHRhcHBseVRleHQoZWwpIHtcblx0XHRsZXQgb2xkID0gZWwuaW5uZXJUZXh0LFxuXHRcdFx0xpIgPSAodikgPT4gZWwuaW5uZXJUZXh0ID0gdiB8fCBcIlwiO1xuXHRcdHRoaXNbcF0uc3Vic2NyaWJlKMaSKTtcblx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0dGhpc1twXS51bnN1YnNjcmliZSjGkik7XG5cdFx0XHTGkihvbGQpO1xuXHRcdH07XG5cdH1cblx0YXBwbHlIdG1sKGVsKSB7XG5cdFx0bGV0IG9sZCA9IGVsLmlubmVySFRNTCxcblx0XHRcdMaSID0gKHYpID0+IGVsLmlubmVySFRNTCA9IHYgfHwgXCJcIjtcblx0XHR0aGlzW3BdLnN1YnNjcmliZSjGkik7XG5cdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdHRoaXNbcF0udW5zdWJzY3JpYmUoxpIpO1xuXHRcdFx0xpIob2xkKTtcblx0XHR9O1xuXHR9XG5cdGFwcGx5QXR0cmlidXRlKG5hbWUsIGVsKSB7XG5cdFx0bGV0IG9sZCA9IGVsLmdldEF0dHJpYnV0ZShuYW1lKSxcblx0XHRcdMaSID0gKHYpID0+IHtcblx0XHRcdFx0diA9PSBudWxsID8gZWwucmVtb3ZlQXR0cmlidXRlKG5hbWUpIDogZWwuc2V0QXR0cmlidXRlKG5hbWUsIHYpO1xuXHRcdFx0fVxuXHRcdHRoaXNbcF0uc3Vic2NyaWJlKMaSKTtcblx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0dGhpc1twXS51bnN1YnNjcmliZSjGkik7XG5cdFx0XHTGkihvbGQpO1xuXHRcdH07XG5cdH1cblx0YXBwbHlTd2FwQXR0cmlidXRlKG5hbWUsIGVsKSB7XG5cdFx0bGV0IG9sZCA9IGVsLmhhc0F0dHJpYnV0ZShuYW1lKSxcblx0XHRcdMaSID0gKHYpID0+IHtcblx0XHRcdFx0ISF2ID8gZWwuc2V0QXR0cmlidXRlKG5hbWUsIG5hbWUpIDogZWwucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuXHRcdFx0fVxuXHRcdHRoaXNbcF0uc3Vic2NyaWJlKMaSKTtcblx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0dGhpc1twXS51bnN1YnNjcmliZSjGkik7XG5cdFx0XHTGkihvbGQpO1xuXHRcdH07XG5cdH1cblx0YXBwbHlTd2FwQ2xhc3MoZWwsIGNsYXNzTmFtZSkge1xuXHRcdGxldCBoYXMgPSBlbC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSxcblx0XHRcdMaSID0gKHYpID0+IHYgPyBlbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSkgOiBlbC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG5cdFx0dGhpc1twXS5zdWJzY3JpYmUoxpIpO1xuXHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHR0aGlzW3BdLnVuc3Vic2NyaWJlKMaSKTtcblx0XHRcdMaSKGhhcyk7XG5cdFx0fTtcblx0fVxufVxuXG5sZXQgRG9tID0ge1xuXHRzdHJlYW0oc291cmNlKSB7XG5cdFx0cmV0dXJuIG5ldyBEb21TdHJlYW0oc291cmNlKTtcblx0fSxcblx0cmVhZHkoxpIpIHtcblx0XHRpZijGkilcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIMaSLCBmYWxzZSk7XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCByZXNvbHZlLCBmYWxzZSkpO1xuXHR9XG59XG5cbmxldCBRdWVyeSA9IHtcblx0Zmlyc3Qoc2VsZWN0b3IsIGN0eCkge1xuXHRcdHJldHVybiAoY3R4IHx8IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcblx0fSxcblxuXHRhbGwoc2VsZWN0b3IsIGN0eCkge1xuXHRcdHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCgoY3R4IHx8IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSwgMCk7XG5cdH1cbn07XG5cbmV4cG9ydCB7IEh0bWwsIFF1ZXJ5LCBEb20gfTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcblxuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJmaWVsZC1jb250YWluZXJcXFwiPjxkaXYgY2xhc3M9XFxcImZpZWxkXFxcIj48ZGl2IGNsYXNzPVxcXCJrZXlcXFwiPjwvZGl2PjxkaXYgY2xhc3M9XFxcInZhbHVlXFxcIj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJjYWxjdWxhdGVkXFxcIj48L2Rpdj48aHIvPjwvZGl2PlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQgeyBGcmFnbWVudCB9IGZyb20gJy4vZnJhZ21lbnQnO1xuaW1wb3J0IHsgUXVlcnkgfSBmcm9tICd1aS9kb20nO1xuXG5sZXQgdGVtcGxhdGUgPSByZXF1aXJlKCcuL2ZpZWxkLmphZGUnKSgpLFxuXHRfcCA9IFN5bWJvbCgpO1xuXG5leHBvcnQgY2xhc3MgRmllbGQgZXh0ZW5kcyBDb21wb25lbnQge1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcblx0XHRpZighKCd0ZW1wbGF0ZScgaW4gb3B0aW9ucykpXG5cdFx0XHRvcHRpb25zLnRlbXBsYXRlID0gdGVtcGxhdGU7XG5cdFx0c3VwZXIob3B0aW9ucyk7XG5cblx0XHRsZXQga2V5ICAgPSBuZXcgRnJhZ21lbnQoeyBwYXJlbnQgOiB0aGlzIH0pLFxuXHRcdFx0dmFsdWUgPSBuZXcgRnJhZ21lbnQoeyBwYXJlbnQgOiB0aGlzIH0pO1xuXG5cdFx0a2V5LmF0dGFjaFRvKFF1ZXJ5LmZpcnN0KCcua2V5JywgdGhpcy5lbCkpO1xuXHRcdHZhbHVlLmF0dGFjaFRvKFF1ZXJ5LmZpcnN0KCcudmFsdWUnLCB0aGlzLmVsKSk7XG5cblx0XHR0aGlzW19wXSA9IHsga2V5LCB2YWx1ZSB9O1xuXHR9XG5cblx0Z2V0IGtleSgpIHtcblx0XHRyZXR1cm4gdGhpc1tfcF0ua2V5O1xuXHR9XG5cblx0Z2V0IHZhbHVlKCkge1xuXHRcdHJldHVybiB0aGlzW19wXS52YWx1ZTtcblx0fVxufSIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxmb290ZXI+PC9mb290ZXI+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50JztcblxubGV0IHRlbXBsYXRlID0gcmVxdWlyZSgnLi9mb290ZXIuamFkZScpKCksXG5cdF9lbCAgICAgID0gU3ltYm9sKCk7XG5cbmV4cG9ydCBjbGFzcyBGb290ZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcblx0XHRpZighKCd0ZW1wbGF0ZScgaW4gb3B0aW9ucykpXG5cdFx0XHRvcHRpb25zLnRlbXBsYXRlID0gdGVtcGxhdGU7XG5cdFx0c3VwZXIob3B0aW9ucyk7XG5cdH1cblxuXHRhZGQoY29tcCkge1xuXHRcdGNvbXAuYXR0YWNoVG8odGhpcy5lbCk7XG5cdH1cbn0iLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcblxuYnVmLnB1c2goXCI8c3BhbiBjbGFzcz1cXFwiZnJhZ21lbnRcXFwiPjxzcGFuIGNsYXNzPVxcXCJjb250ZW50XFxcIj48L3NwYW4+PC9zcGFuPlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudCc7XG5cbmxldCB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4vZnJhZ21lbnQuamFkZScpKCk7XG5cbmNsYXNzIEZyYWdtZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcblx0Y29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG5cdFx0aWYoISgndGVtcGxhdGUnIGluIG9wdGlvbnMpKVxuXHRcdFx0b3B0aW9ucy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuXHRcdHN1cGVyKG9wdGlvbnMpO1xuXHR9XG59XG5cbmV4cG9ydCB7IEZyYWdtZW50IH07IiwiaW1wb3J0IHsgUHVzaFN0cmVhbSB9IGZyb20gJ3N0cmVhbXkvc3RyZWFtJztcblxubGV0IF9kYXRhICAgID0gU3ltYm9sKCksXG5cdF9zY2hlbWEgID0gU3ltYm9sKCksXG5cdF9zdHJlYW0gID0gU3ltYm9sKCksXG5cdF9vICAgICAgID0gU3ltYm9sKCksXG5cdGlkZW50aXR5ID0gKCkgPT4gZmFsc2U7XG5cbmZ1bmN0aW9uIHJlc29sdmVTZXR0ZXIodGFyZ2V0LCBwYXRoKSB7XG5cdGlmKHBhdGggaW4gdGFyZ2V0KSB7XG5cdFx0cmV0dXJuICh2KSA9PiB7XG5cdFx0XHR0YXJnZXRbcGF0aF0gPSB2O1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBpZGVudGl0eTtcblx0fVxufVxuXG5mdW5jdGlvbiByZXNvbHZlSW5pdGlhbGl6ZXIodGFyZ2V0LCBwYXRoKSB7XG5cdHJldHVybiAodikgPT4ge1xuXHRcdHRhcmdldFtwYXRoXSA9IHY7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH07XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVEZWxldGVyKHRhcmdldCwgcGF0aCkge1xuXHRyZXR1cm4gKCkgPT4ge1xuXHRcdGRlbGV0ZSB0YXJnZXRbcGF0aF07XG5cdFx0cmV0dXJuIHRydWU7XG5cdH07XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVSZW5hbWVyKHRhcmdldCwgcGF0aCkge1xuXHRyZXR1cm4gKG5ld25hbWUpID0+IHtcblx0XHRsZXQgb2xkID0gdGFyZ2V0W3BhdGhdO1xuXHRcdGRlbGV0ZSB0YXJnZXRbcGF0aF07XG5cdFx0dGFyZ2V0W25ld25hbWVdID0gb2xkO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9O1xufVxuXG5mdW5jdGlvbiBndWVzc05hbWUoa2V5cywgcHJlZml4ID0gXCJmaWVsZCBcIikge1xuXHRsZXQgbWF4ID0gLTEsXG5cdFx0dmFsdWU7XG5cdGZvcihsZXQga2V5IG9mIGtleXMpIHtcblx0XHRpZihrZXkuaW5kZXhPZihwcmVmaXgpID09PSAwKSB7XG5cdFx0XHR2YWx1ZSA9IHBhcnNlSW50KGtleS5zdWJzdHIocHJlZml4Lmxlbmd0aCksIDEwKTtcblx0XHRcdGlmKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA8IDApXG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0aWYodmFsdWUgPiBtYXgpXG5cdFx0XHRcdG1heCA9IHZhbHVlO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcHJlZml4ICsgKG1heCArIDEpO1xufVxuXG5leHBvcnQgY2xhc3MgTW9kZWwge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRsZXQgZGF0YSAgICA9IHRoaXNbX2RhdGFdICAgPSBuZXcgUHVzaFN0cmVhbSgpLFxuXHRcdFx0c2NoZW1hICA9IHRoaXNbX3NjaGVtYV0gPSBuZXcgUHVzaFN0cmVhbSgpLFxuXHRcdFx0c3RyZWFtICA9IG5ldyBQdXNoU3RyZWFtKCksXG5cdFx0XHRvICAgICAgID0gdGhpc1tfb10gICAgICA9IHt9O1xuXG5cdFx0dGhpc1tfc3RyZWFtXSA9IHN0cmVhbS5kZWJvdW5jZSgxMDApLnVuaXF1ZShKU09OLnN0cmluZ2lmeSk7XG5cblx0XHRkYXRhLnN1YnNjcmliZShlID0+IHtcblx0XHRcdGlmKHJlc29sdmVTZXR0ZXIobywgZS5wYXRoKShlLnZhbHVlKSlcblx0XHRcdFx0c3RyZWFtLnB1c2gobyk7XG5cdFx0fSk7XG5cdFx0c2NoZW1hLnN1YnNjcmliZShlID0+IHtcblx0XHRcdHN3aXRjaChlLmV2ZW50KSB7XG5cdFx0XHRcdGNhc2UgJ2xpc3QnOlxuXHRcdFx0XHRcdG8gPSB0aGlzW19vXSA9IHt9O1xuXHRcdFx0XHRcdGxldCByZXMgPSBlLmRhdGEubWFwKChwYWlyKSA9PiByZXNvbHZlSW5pdGlhbGl6ZXIobywgcGFpci5uYW1lKShudWxsKSk7XG5cdFx0XHRcdFx0aWYocmVzLmZpbHRlcihyID0+IHIpLmxlbmd0aCA9PT0gcmVzLmxlbmd0aClcblx0XHRcdFx0XHRcdHN0cmVhbS5wdXNoKG8pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdhZGQnOlxuXHRcdFx0XHRcdGlmKHJlc29sdmVJbml0aWFsaXplcihvLCBlLm5hbWUpKG51bGwpKVxuXHRcdFx0XHRcdFx0c3RyZWFtLnB1c2gobyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ2RlbGV0ZSc6XG5cdFx0XHRcdFx0aWYocmVzb2x2ZURlbGV0ZXIobywgZS5uYW1lKSgpKVxuXHRcdFx0XHRcdFx0c3RyZWFtLnB1c2gobyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ3JlbmFtZSc6XG5cdFx0XHRcdFx0aWYocmVzb2x2ZVJlbmFtZXIobywgZS5vbGRuYW1lKShlLm5ld25hbWUpKVxuXHRcdFx0XHRcdFx0c3RyZWFtLnB1c2gobyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRnZXQgZGF0YSgpIHtcblx0XHRyZXR1cm4gdGhpc1tfZGF0YV07XG5cdH1cblxuXHRnZXQgc2NoZW1hKCkge1xuXHRcdHJldHVybiB0aGlzW19zY2hlbWFdO1xuXHR9XG5cblx0Z2V0IHN0cmVhbSgpIHtcblx0XHRyZXR1cm4gdGhpc1tfc3RyZWFtXTtcblx0fVxuXG5cdGdldCBrZXlzKCkge1xuXHRcdHJldHVybiBPYmplY3Qua2V5cyh0aGlzW19vXSk7XG5cdH1cblxuXHRuZXh0RmllbGROYW1lKCkge1xuXHRcdHJldHVybiBndWVzc05hbWUodGhpcy5rZXlzKTtcblx0fVxuXG5cdHRvSlNPTigpIHtcblx0XHRyZXR1cm4gdGhpc1tfb107XG5cdH1cbn0iLCJpbXBvcnQgeyBNb2RlbFZpZXcsIFNjaGVtYVdyYXBwZXIgfSBmcm9tICcuL21vZGVsdmlldyc7XG5pbXBvcnQgeyBNb2RlbFZpZXdUb29sYmFyIH0gZnJvbSAnLi9tb2RlbHZpZXd0b29sYmFyJztcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50JztcblxubGV0IF9wID0gU3ltYm9sKCk7XG5cbmV4cG9ydCBjbGFzcyBNb2RlbFVJIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuXHRjb25zdHJ1Y3Rvcihtb2RlbCwgc2NoZW1hKSB7XG5cdFx0c3VwZXIoeyB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJtb2RlbFwiPjwvZGl2PicgfSk7XG5cdFx0bGV0IHZpZXcgPSBuZXcgTW9kZWxWaWV3KCksXG5cdFx0XHR3cmFwcGVyID0gbmV3IFNjaGVtYVdyYXBwZXIoc2NoZW1hLCB2aWV3KSxcblx0XHRcdHRvb2xiYXIgPSBuZXcgTW9kZWxWaWV3VG9vbGJhcih2aWV3LCBtb2RlbCwgc2NoZW1hKTtcblx0XHR0aGlzW19wXSA9IHtcblx0XHRcdG1vZGVsLFxuXHRcdFx0c2NoZW1hLFxuXHRcdFx0dmlldyxcblx0XHRcdHRvb2xiYXJcblx0XHR9O1xuXG5cdFx0dG9vbGJhci5hdHRhY2hUbyh0aGlzLmVsKTtcblx0XHR2aWV3LmF0dGFjaFRvKHRoaXMuZWwpO1xuXG5cdFx0c2NoZW1hLnN0cmVhbS5mZWVkKG1vZGVsLnNjaGVtYSk7XG5cdFx0dmlldy5kYXRhLmZlZWQobW9kZWwuZGF0YSk7XG5cdH1cblxuXHRnZXQgbW9kZWwoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3BdLm1vZGVsO1xuXHR9XG5cblx0Z2V0IHNjaGVtYSgpIHtcblx0XHRyZXR1cm4gdGhpc1tfcF0uc2NoZW1hO1xuXHR9XG5cblx0Z2V0IHZpZXcoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3BdLnZpZXc7XG5cdH1cblxuXHRnZXQgdG9vbGJhcigpIHtcblx0XHRyZXR1cm4gdGhpc1tfcF0udG9vbGJhcjtcblx0fVxufSIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcIm1vZGVsdmlld1xcXCI+PC9kaXY+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7IFRleHRQcm9wZXJ0eSwgVGV4dEVkaXRvclByb3BlcnR5LCBFZGl0b3JQcm9wZXJ0eSB9IGZyb20gJy4vcHJvcGVydGllcy90eXBlcydcbmltcG9ydCB7IEZpZWxkIH0gZnJvbSAnLi9maWVsZCc7XG5pbXBvcnQgeyBQdXNoU3RyZWFtIH0gZnJvbSAnc3RyZWFteS9zdHJlYW0nO1xuXG5sZXQgdGVtcGxhdGUgPSByZXF1aXJlKCcuL21vZGVsdmlldy5qYWRlJykoKSxcblx0X2ZpZWxkcyAgPSBTeW1ib2woKSxcblx0X2RhdGEgICAgPSBTeW1ib2woKSxcblx0X3NjaGVtYSAgPSBTeW1ib2woKTtcblxuZXhwb3J0IGNsYXNzIE1vZGVsVmlldyBleHRlbmRzIENvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuXHRcdGlmKCEoJ3RlbXBsYXRlJyBpbiBvcHRpb25zKSlcblx0XHRcdG9wdGlvbnMudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcblx0XHRzdXBlcihvcHRpb25zKTtcblx0XHR0aGlzW19maWVsZHNdID0ge307XG5cdFx0dGhpc1tfZGF0YV0gICA9IG5ldyBQdXNoU3RyZWFtKCk7XG5cdFx0dGhpc1tfc2NoZW1hXSA9IG5ldyBQdXNoU3RyZWFtKCk7XG5cblx0XHR0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgZSA9PiBjb25zb2xlLmxvZygnZm9jdXMnLCBlKSwgZmFsc2UpO1xuXHR9XG5cdHJlc2V0KCkge1xuXHRcdHRoaXMuYXJyYXkubWFwKChrZXkpID0+IHRoaXMuZGVsZXRlRmllbGQobmFtZSkpO1xuXHR9XG5cdGFkZEZpZWxkKG5hbWUsIHR5cGUpIHtcblx0XHRsZXQgZmllbGQgPSBuZXcgRmllbGQoeyBwYXJlbnQ6IHRoaXMgfSk7XG5cdFx0ZmllbGQuYXR0YWNoVG8odGhpcy5lbCk7XG5cblx0XHRmaWVsZC5rZXkucHJvcGVydGllcy5hZGQobmV3IFRleHRQcm9wZXJ0eSgpKTtcblx0XHRmaWVsZC5rZXkucHJvcGVydGllcy5hZGQobmV3IFRleHRFZGl0b3JQcm9wZXJ0eSgpKTtcblx0XHRmaWVsZC5rZXkuZWRpdG9yLnZhbHVlLmZlZWQoZmllbGQua2V5LnRleHQpO1xuXHRcdGxldCBsYXN0O1xuXHRcdGZpZWxkLmtleS5lZGl0b3IudmFsdWUubWFwKHYgPT4ge1xuXHRcdFx0dGhpc1tfc2NoZW1hXS5wdXNoKHsgZXZlbnQ6J3JlbmFtZScsIG9sZG5hbWU6bGFzdCwgbmV3bmFtZTogdn0pO1xuXHRcdFx0bGFzdCA9IHY7XG5cdFx0fSk7XG5cdFx0ZmllbGQua2V5LmVkaXRvci52YWx1ZSA9IG5hbWU7XG5cblx0XHRmaWVsZC52YWx1ZS5wcm9wZXJ0aWVzLmFkZChFZGl0b3JQcm9wZXJ0eS5jcmVhdGUodHlwZSkpO1xuXG5cdFx0bGV0IHN0cmVhbSA9IGZpZWxkLnZhbHVlLmVkaXRvci52YWx1ZS5tYXAodiA9PiAoeyBwYXRoIDogZmllbGQua2V5LmVkaXRvci52YWx1ZS52YWx1ZSwgdmFsdWUgOiB2IH0pKTtcblx0XHRzdHJlYW0uZmVlZCh0aGlzW19kYXRhXSk7XG5cblx0XHR0aGlzW19maWVsZHNdW25hbWVdID0geyBmaWVsZCwgc3RyZWFtIH1cblx0fVxuXHRkZWxldGVGaWVsZChuYW1lKSB7XG5cdFx0bGV0IHBhaXIgPSB0aGlzLmdldFBhaXIobmFtZSk7XG5cdFx0cGFpci5maWVsZC5kZXN0cm95KCk7XG5cdFx0cGFpci5zdHJlYW0uY2FuY2VsKCk7XG5cdFx0ZGVsZXRlIHRoaXNbX2ZpZWxkc11bbmFtZV07XG5cdH1cblx0cmVuYW1lRmllbGQob2xkbmFtZSwgbmV3bmFtZSkge1xuXHRcdGxldCBwYWlyID0gdGhpcy5nZXRQYWlyKG9sZG5hbWUpO1xuXHRcdGRlbGV0ZSB0aGlzW19maWVsZHNdW29sZG5hbWVdO1xuXHRcdHRoaXNbX2ZpZWxkc11bbmV3bmFtZV0gPSBwYWlyO1xuXHRcdHBhaXIuZmllbGQua2V5LmVkaXRvci52YWx1ZSA9IG5ld25hbWU7XG5cdH1cblx0cmV0eXBlRmllbGQobmFtZSwgdHlwZSkge1xuXHRcdGxldCBwYWlyID0gdGhpcy5nZXRQYWlyKG5hbWUpO1xuXHRcdHBhaXIuc3RyZWFtLmNhbmNlbCgpO1xuXHRcdHBhaXIuZmllbGQudmFsdWUucHJvcGVydGllcy5yZW1vdmUoJ2VkaXRvcicpO1xuXHRcdHBhaXIuZmllbGQudmFsdWUucHJvcGVydGllcy5hZGQoRWRpdG9yUHJvcGVydHkuY3JlYXRlKHR5cGUpKTtcblx0XHRsZXQgc3RyZWFtID0gcGFpci5maWVsZC52YWx1ZS5lZGl0b3IudmFsdWUubWFwKHYgPT4gKHsgcGF0aCA6IG5hbWUsIHZhbHVlIDogdiB9KSk7XG5cdFx0c3RyZWFtLmZlZWQodGhpc1tfZGF0YV0pO1xuXHRcdHBhaXIuZmllbGQudmFsdWUuZWRpdG9yLnZhbHVlLmZlZWQocGFpci5maWVsZC52YWx1ZS50ZXh0KTtcblx0fVxuXG5cdHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiBgTW9kZWxWaWV3OiAke3RoaXMudXVpZH1gO1xuXHR9XG5cblx0Z2V0UGFpcihuYW1lKSB7XG5cdFx0bGV0IHBhaXIgPSB0aGlzW19maWVsZHNdW25hbWVdO1xuXHRcdGlmKCFwYWlyKSB0aHJvdyBuZXcgRXJyb3IoYGZpZWxkICcke25hbWV9IG5vdCBmb3VuZCBpbiBNb2RlbFZpZXcnYCk7XG5cdFx0cmV0dXJuIHBhaXI7XG5cdH1cblxuXHRnZXRGaWVsZChuYW1lKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0UGFpcihuYW1lKS5maWVsZDtcblx0fVxuXG5cdFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuXHRcdHJldHVybiB0aGlzLmFycmF5O1xuXHR9XG5cblx0Z2V0IGFycmF5KCkge1xuXHRcdHJldHVybiBPYmplY3Qua2V5cyh0aGlzW19maWVsZHNdKTtcblx0fVxuXG5cdGdldCBkYXRhKCkge1xuXHRcdHJldHVybiB0aGlzW19kYXRhXTtcblx0fVxuXG5cdGdldCBzY2hlbWEoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3NjaGVtYV07XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIFNjaGVtYVdyYXBwZXIge1xuXHRjb25zdHJ1Y3RvcihzY2hlbWEsIHZpZXcpIHtcblx0XHR0aGlzLnNjaGVtYSA9IHNjaGVtYTtcblx0XHR0aGlzLnZpZXcgPSB2aWV3O1xuXHRcdHNjaGVtYS5zdHJlYW0uc3Vic2NyaWJlKHRoaXMuaGFuZGxlci5iaW5kKHRoaXMpKTtcblx0XHR2aWV3LnNjaGVtYS5zdWJzY3JpYmUoZSA9PiB7XG5cdFx0XHRzd2l0Y2goZS5ldmVudCkge1xuXHRcdFx0XHRjYXNlICdyZW5hbWUnOlxuXHRcdFx0XHRcdGlmKGUub2xkbmFtZSkge1xuXHRcdFx0XHRcdFx0c2NoZW1hLnJlbmFtZShlLm9sZG5hbWUsIGUubmV3bmFtZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0aGFuZGxlcihtZXNzYWdlKSB7XG5cdFx0c3dpdGNoKG1lc3NhZ2UuZXZlbnQpIHtcblx0XHRcdGNhc2UgJ2xpc3QnOlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5oYW5kbGVMaXN0KG1lc3NhZ2UuZGF0YSk7XG5cdFx0XHRjYXNlICdhZGQnOlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5oYW5kbGVBZGQobWVzc2FnZS5uYW1lLCBtZXNzYWdlLnR5cGUpO1xuXHRcdFx0Y2FzZSAnZGVsZXRlJzpcblx0XHRcdFx0cmV0dXJuIHRoaXMuaGFuZGxlRGVsZXRlKG1lc3NhZ2UubmFtZSk7XG5cdFx0XHRjYXNlICdyZW5hbWUnOlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5oYW5kbGVSZW5hbWUobWVzc2FnZS5vbGRuYW1lLCBtZXNzYWdlLm5ld25hbWUpO1xuXHRcdFx0Y2FzZSAncmV0eXBlJzpcblx0XHRcdFx0cmV0dXJuIHRoaXMuaGFuZGxlUmV0eXBlKG1lc3NhZ2UubmFtZSwgbWVzc2FnZS50eXBlKTtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgaW52YWxpZCBtZXNzYWdlICcke21lc3NhZ2V9J2ApO1xuXHRcdH1cblx0fVxuXG5cdGhhbmRsZUxpc3QoZGF0YSkge1xuXHRcdHRoaXMudmlldy5yZXNldCgpO1xuXHRcdGRhdGEubWFwKHBhaXIgPT4gdGhpcy5oYW5kbGVBZGQocGFpci5uYW1lLCBwYWlyLnR5cGUpKTtcblx0fVxuXHRoYW5kbGVBZGQobmFtZSwgdHlwZSkge1xuXHRcdHRoaXMudmlldy5hZGRGaWVsZChuYW1lLCB0eXBlKTtcblx0fVxuXHRoYW5kbGVEZWxldGUobmFtZSkge1xuXHRcdHRoaXMudmlldy5kZWxldGVGaWVsZChuYW1lKTtcblx0fVxuXHRoYW5kbGVSZW5hbWUob2xkbmFtZSwgbmV3bmFtZSkge1xuXHRcdHRoaXMudmlldy5yZW5hbWVGaWVsZChvbGRuYW1lLCBuZXduYW1lKTtcblx0fVxuXHRoYW5kbGVSZXR5cGUobmFtZSwgdHlwZSkge1xuXHRcdHRoaXMudmlldy5yZXR5cGVGaWVsZChuYW1lLCB0eXBlKTtcblx0fVxufSIsImltcG9ydCB7IEVuYWJsZVByb3BlcnR5IH0gZnJvbSAnLi9wcm9wZXJ0aWVzL3R5cGVzJ1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAndWkvYnV0dG9uJztcblxuaW1wb3J0IHsgVG9vbGJhciB9IGZyb20gJy4vdG9vbGJhcic7XG5cbmV4cG9ydCBjbGFzcyBNb2RlbFZpZXdUb29sYmFyIGV4dGVuZHMgVG9vbGJhciB7XG5cdGNvbnN0cnVjdG9yKHZpZXcsIG1vZGVsLCBzY2hlbWEsIG9wdGlvbnMpIHtcblx0XHRzdXBlcihvcHRpb25zKTtcblxuXHRcdC8vIFJFTU9WRVxuXHRcdGxldCByZW1vdmUgPSBCdXR0b24uaWNvbignYmFuJywgeyBwYXJlbnQ6IHRoaXMsIGNsYXNzZXM6ICdhbGVydCcgfSk7XG5cdFx0cmVtb3ZlLnByb3BlcnRpZXMuYWRkKG5ldyBFbmFibGVQcm9wZXJ0eShmYWxzZSkpO1xuXHRcdHRoaXMucmlnaHQuYWRkKHJlbW92ZSk7XG5cdFx0dmlldy5mb2N1c1N0cmVhbS5tYXAoKHYpID0+ICEhdikuZGVib3VuY2UoMjAwKS5mZWVkKHJlbW92ZS5lbmFibGUpO1xuXG5cdFx0dmlldy5mb2N1c1N0cmVhbVxuXHRcdFx0LmZpbHRlcigodikgPT4gdiAhPT0gbnVsbClcblx0XHRcdC5zeW5jKHJlbW92ZS5jbGljaylcblx0XHRcdC5tYXAoZnJhZ21lbnQgPT4gZnJhZ21lbnQucGFyZW50LmtleS5lZGl0b3IudmFsdWUudmFsdWUpXG5cdFx0XHQuc3Vic2NyaWJlKGtleSA9PiB2aWV3LmRlbGV0ZUZpZWxkKGtleSkpO1xuXG5cdFx0Ly8gSU5TRVJUIFRFWFRcblx0XHRsZXQgaW5zZXJ0VGV4dCA9IEJ1dHRvbi5pY29uKCdmb250JywgeyBwYXJlbnQ6IHRoaXMgfSk7XG5cdFx0dGhpcy5sZWZ0LmFkZChpbnNlcnRUZXh0KTtcblx0XHRpbnNlcnRUZXh0LmNsaWNrLnN1YnNjcmliZSgoKSA9PiB7XG5cdFx0XHRsZXQga2V5ID0gbW9kZWwubmV4dEZpZWxkTmFtZSgpO1xuXHRcdFx0c2NoZW1hLmFkZChrZXksIFwiU3RyaW5nXCIpO1xuXHRcdH0pXG5cblx0XHQvLyBJTlNFUlQgQk9PTEVBTlxuXHRcdGxldCBpbnNlcnRCb29sID0gQnV0dG9uLmljb24oJ2NoZWNrLXNxdWFyZS1vJywgeyBwYXJlbnQ6IHRoaXMgfSk7XG5cdFx0dGhpcy5sZWZ0LmFkZChpbnNlcnRCb29sKTtcblx0XHRpbnNlcnRCb29sLmNsaWNrLnN1YnNjcmliZSgoKSA9PiB7XG5cdFx0XHRsZXQga2V5ID0gbW9kZWwubmV4dEZpZWxkTmFtZSgpO1xuXHRcdFx0c2NoZW1hLmFkZChrZXksIFwiQm9vbFwiKTtcblx0XHR9KVxuXHR9XG59IiwibGV0IF9uYW1lID0gU3ltYm9sKCk7XG5cbmNsYXNzIEJhc2VJbmplY3RvciB7XG5cdGluamVjdCh0YXJnZXQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJhYnN0cmFjdCBtZXRob2Q6IGluamVjdFwiKTtcblx0fVxuXG5cdGRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwgZ2V0dGVyLCBzZXR0ZXIpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCB7XG5cdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0d3JpdGVhYmxlOiBmYWxzZSxcblx0XHRcdGdldDogZ2V0dGVyLFxuXHRcdFx0c2V0OiBzZXR0ZXJcblx0XHR9KTtcblx0fVxufVxuXG5jbGFzcyBCYXNlUHJvcGVydHkgZXh0ZW5kcyBCYXNlSW5qZWN0b3Ige1xuXHRjb25zdHJ1Y3RvcihuYW1lKSB7XG5cdFx0dGhpc1tfbmFtZV0gPSBuYW1lO1xuXHR9XG5cblx0Z2V0IG5hbWUoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX25hbWVdO1xuXHR9XG59XG5cbmV4cG9ydCB7IEJhc2VQcm9wZXJ0eSwgQmFzZUluamVjdG9yIH07IiwiaW1wb3J0IHsgQmFzZVByb3BlcnR5IH0gZnJvbSAnLi9iYXNlJztcblxubGV0IF/GkiA9IFN5bWJvbCgpO1xuXG5jbGFzcyBCZWhhdmlvclByb3BlcnR5IGV4dGVuZHMgQmFzZVByb3BlcnR5IHtcblx0Y29uc3RydWN0b3IobmFtZSwgxpIpIHtcblx0XHRzdXBlcihuYW1lKTtcblx0XHR0aGlzW1/Gkl0gPSDGkjtcblx0fVxuXG5cdGluamVjdCh0YXJnZXQpIHtcblx0XHRsZXQgxpIgPSB0aGlzW1/Gkl0odGFyZ2V0KS5iaW5kKHRhcmdldCk7XG5cdFx0dGhpcy5kZWZpbmVQcm9wZXJ0eShcblx0XHRcdHRhcmdldCxcblx0XHRcdHRoaXMubmFtZSxcblx0XHRcdCgpID0+IMaSXG5cdFx0KTtcblx0XHRyZXR1cm4gKCkgPT4ge307XG5cdH1cbn1cblxuZXhwb3J0IHsgQmVoYXZpb3JQcm9wZXJ0eSB9OyIsImltcG9ydCB7IEJhc2VQcm9wZXJ0eSB9IGZyb20gJy4vYmFzZSc7XG5pbXBvcnQgeyBQcm9wZXJ0aWVzIH0gZnJvbSAnLi9wcm9wZXJ0aWVzJztcblxubGV0IF9wID0gU3ltYm9sKCk7XG5cbmNsYXNzIFByb3BlcnR5Q29udGFpbmVyIHtcblx0Y29uc3RydWN0b3IocGFyZW50KSB7XG5cdFx0dGhpc1tfcF0gPSBwYXJlbnQ7XG5cdFx0bmV3IFByb3BlcnRpZXModGhpcyk7XG5cdH1cblxuXHRnZXQgcGFyZW50KCkge1xuXHRcdHJldHVybiB0aGlzW19wXTtcblx0fVxufVxuXG5jbGFzcyBDb250YWluZXJQcm9wZXJ0eSBleHRlbmRzIEJhc2VQcm9wZXJ0eSB7XG5cdGNvbnN0cnVjdG9yKG5hbWUsIGRlZmF1bHRGaWVsZCwgd2lyZcaSKSB7XG5cdFx0c3VwZXIobmFtZSk7XG5cdFx0d2lyZcaSID0gd2lyZcaSIHx8ICgoKSA9PiB7fSk7XG5cdFx0dGhpc1tfcF0gPSB7IGRlZmF1bHRGaWVsZCwgd2lyZcaSIH07XG5cdH1cblxuXHRpbmplY3QodGFyZ2V0KSB7XG5cdFx0bGV0IGNvbnRhaW5lciA9IG5ldyBQcm9wZXJ0eUNvbnRhaW5lcih0YXJnZXQpLFxuXHRcdFx0c2V0dGVyID0gKHRoaXNbX3BdLmRlZmF1bHRGaWVsZCkgP1xuXHRcdFx0XHQodikgPT4gY29udGFpbmVyW3RoaXNbX3BdLmRlZmF1bHRGaWVsZF0ucHVzaCh2KSA6XG5cdFx0XHRcdHVuZGVmaW5lZDtcblxuXHRcdHRoaXMuZGVmaW5lUHJvcGVydHkoXG5cdFx0XHR0YXJnZXQsXG5cdFx0XHR0aGlzLm5hbWUsXG5cdFx0XHQoKSA9PiBjb250YWluZXIsXG5cdFx0XHRzZXR0ZXJcblx0XHQpO1xuXG5cdFx0cmV0dXJuIHRoaXNbX3BdLndpcmXGkih0YXJnZXQpIHx8ICgoKSA9PiB7fSk7XG5cdH1cbn1cblxuZXhwb3J0IHsgQ29udGFpbmVyUHJvcGVydHkgfTtcblxuLypcblx0YWRkQ29udGFpbmVyKG5hbWUsIGRlZmF1bHRGaWVsZCwgd2lyZSkge1xuXHRcdGlmKHRoaXNbdV1bbmFtZV0pXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEEgcHJvcGVydHkgJyR7bmFtZX0nIGFscmVhZHkgZXhpc3RzYCk7XG5cdFx0bGV0IGNvbnRhaW5lciA9IG5ldyBQcm9wZXJ0eUNvbnRhaW5lcih0aGlzWyRdLCB0aGlzKSxcblx0XHRcdHNldHRlciA9IChkZWZhdWx0RmllbGQpID9cblx0XHRcdFx0ZnVuY3Rpb24odikgeyBjb250YWluZXJbZGVmYXVsdEZpZWxkXS5wdXNoKHYpOyB9IDpcblx0XHRcdFx0ZnVuY3Rpb24oKSB7IHRocm93IG5ldyBFcnJvcignUHJvcGVydHkgQ29udGFpbmVyIGRvZXNuXFwndCBoYXZlIGEgZGVmYXVsdCBmaWVsZCcpOyB9LFxuXHRcdFx0dW53aXJlID0gd2lyZSAmJiB3aXJlLmNhbGwodGhpcywgdGhpc1skXSkgfHwgZnVuY3Rpb24oKXt9O1xuXHRcdHRoaXNbdV1bbmFtZV0gPSAoKSA9PiB7XG5cdFx0XHR1bndpcmUoKTtcblx0XHRcdGNvbnRhaW5lci5yZW1vdmVBbGwuY2FsbChjb250YWluZXIpO1xuXHRcdH07XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIG5hbWUsIHtcblx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHR3cml0ZWFibGU6IGZhbHNlLFxuXHRcdFx0Z2V0OiAoKSA9PiBjb250YWluZXIsXG5cdFx0XHRzZXQ6IHNldHRlclxuXHRcdH0pO1xuXHRcdHJldHVybiBjb250YWluZXI7XG5cdH1cbiovIiwiZXhwb3J0ICogZnJvbSAnLi9wcm9wZXJ0aWVzJzsiLCJ2YXIgX3AgPSBTeW1ib2w7XG5cbmNsYXNzIFByb3BlcnRpZXMge1xuXHRjb25zdHJ1Y3Rvcih0YXJnZXQpIHtcblx0XHR0aGlzW19wXSA9IHtcblx0XHRcdHRhcmdldDogdGFyZ2V0LFxuXHRcdFx0cHJvcGVydGllczoge30sXG5cdFx0XHRkaXNwb3NhYmxlczoge31cblx0XHR9O1xuXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgXCJwcm9wZXJ0aWVzXCIsIHtcblx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHR3cml0ZWFibGU6IGZhbHNlLFxuXHRcdFx0Z2V0OiAoKSA9PiB0aGlzXG5cdFx0fSk7XG5cdH1cblxuXHRhZGQocHJvcGVydHkpIHtcblx0XHRsZXQgbmFtZSA9IHByb3BlcnR5Lm5hbWU7XG5cdFx0aWYobmFtZSBpbiB0aGlzW19wXS50YXJnZXQpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYHByb3BlcnR5ICduYW1lJyBhbHJlYWR5IGV4aXN0c2ApO1xuXHRcdHRoaXNbX3BdLnByb3BlcnRpZXNbbmFtZV0gPSBwcm9wZXJ0eTtcblx0XHR0aGlzW19wXS5kaXNwb3NhYmxlc1tuYW1lXSA9IHByb3BlcnR5LmluamVjdCh0aGlzW19wXS50YXJnZXQpO1xuXHR9XG5cblx0cmVtb3ZlKHByb3BlcnR5KSB7XG5cdFx0bGV0IG5hbWUgPSBwcm9wZXJ0eS5uYW1lIHx8IHByb3BlcnR5O1xuXHRcdGlmKCEobmFtZSBpbiB0aGlzW19wXS5wcm9wZXJ0aWVzKSlcblx0XHRcdHRocm93IG5ldyBFcnJvcihgcHJvcGVydHkgJ25hbWUnIGRvZXNuJ3QgZXhpc3RgKTtcblx0XHR0aGlzW19wXS5kaXNwb3NhYmxlc1tuYW1lXSgpO1xuXHRcdGRlbGV0ZSB0aGlzW19wXS5kaXNwb3NhYmxlc1tuYW1lXTtcblx0XHRkZWxldGUgdGhpc1tfcF0ucHJvcGVydGllc1tuYW1lXTtcblx0fVxuXG5cdGdldChuYW1lKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3BdLnByb3BlcnRpZXNbbmFtZV07XG5cdH1cblxuXHRyZW1vdmVBbGwoKSB7XG5cdFx0Zm9yKGxldCBuYW1lIG9mIHRoaXMuYXJyYXkpIHtcblx0XHRcdHRoaXMucmVtb3ZlKG5hbWUpO1xuXHRcdH1cblx0fVxuXG5cdFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuXHRcdHJldHVybiB0aGlzLmFycmF5O1xuXHR9XG5cblx0Z2V0IGFycmF5KCkge1xuXHRcdHJldHVybiBPYmplY3Qua2V5cyh0aGlzW19wXS5wcm9wZXJ0aWVzKTtcblx0fVxuXG5cdGNvcHlUbyh0YXJnZXQpIHtcblx0XHRmb3IobGV0IGtleSBvZiB0aGlzLmFycmF5KSB7XG5cdFx0XHR0YXJnZXQucHJvcGVydGllcy5hZGQodGhpcy5nZXQoa2V5KSk7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCB7IFByb3BlcnRpZXMgfTsiLCJpbXBvcnQgeyBCYXNlUHJvcGVydHkgfSBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0IHsgxpIgfSBmcm9tICd1dGlsL8aSJztcblxubGV0IF9wID0gU3ltYm9sKCk7XG5cbmV4cG9ydCBjbGFzcyBTdHJlYW1Qcm9wZXJ0eSBleHRlbmRzIEJhc2VQcm9wZXJ0eSB7XG5cdGNvbnN0cnVjdG9yKG5hbWUsIHN0cmVhbcaSLCB3aXJlxpIpIHtcblx0XHRzdXBlcihuYW1lKTtcblx0XHR0aGlzW19wXSA9IHsgc3RyZWFtxpIsIHdpcmXGkiB9O1xuXHR9XG5cblx0aW5qZWN0KHRhcmdldCkge1xuXHRcdGxldCBzdHJlYW0gPSB0aGlzW19wXS5zdHJlYW3GkigpO1xuXHRcdHRoaXMuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCB0aGlzLm5hbWUsICgpID0+IHN0cmVhbSk7XG5cblx0XHRyZXR1cm4gxpIuam9pbihcblx0XHRcdHRoaXNbX3BdLndpcmXGkih0YXJnZXQsIHN0cmVhbSksXG5cdFx0XHQoKSA9PiBzdHJlYW0uY2FuY2VsKClcblx0XHQpO1xuXHR9XG59IiwiaW1wb3J0IHsgU3RyaW5nVmFsdWUgfSBmcm9tICdzdHJlYW15L3ZhbHVlJztcbmltcG9ydCB7IFZhbHVlU3RyZWFtUHJvcGVydHkgfSBmcm9tICcuLi92YWx1ZXN0cmVhbSc7XG5pbXBvcnQgeyBEb20gfSBmcm9tICd1aS9kb20nO1xuXG5jbGFzcyBBdHRyaWJ1dGVQcm9wZXJ0eSBleHRlbmRzIFZhbHVlU3RyZWFtUHJvcGVydHkge1xuXHRjb25zdHJ1Y3RvcihuYW1lLCBhdHRyaWJ1dGUsIHRleHQgPSBcIlwiKSB7XG5cdFx0c3VwZXIoXG5cdFx0XHRuYW1lLFxuXHRcdFx0KCkgPT4gbmV3IFN0cmluZ1ZhbHVlKHRleHQpLFxuXHRcdFx0KHRhcmdldCwgdmFsdWUpICA9PlxuXHRcdFx0XHREb20uc3RyZWFtKHZhbHVlKS5hcHBseUF0dHJpYnV0ZShhdHRyaWJ1dGUsIHRhcmdldC5lbClcblx0XHQpO1xuXHR9XG59XG5cbmNsYXNzIFRvb2x0aXBQcm9wZXJ0eSBleHRlbmRzIEF0dHJpYnV0ZVByb3BlcnR5IHtcblx0Y29uc3RydWN0b3IoZGVmYXVsdFZhbHVlID0gZmFsc2UpIHtcblx0XHRzdXBlcihcInRvb2x0aXBcIiwgXCJ0aXRsZVwiLCBkZWZhdWx0VmFsdWUpO1xuXHR9XG59XG5cbmV4cG9ydCB7IFRvb2x0aXBQcm9wZXJ0eSwgQXR0cmlidXRlUHJvcGVydHkgfTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uICh1bmRlZmluZWQpIHtcbmJ1Zi5wdXNoKFwiPGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIlwiICsgKGphZGUuYXR0cihcImNoZWNrZWRcIiwgKHRydWU9PT1mYWxzZSA/IFwiY2hlY2tlZFwiIDogdW5kZWZpbmVkKSwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJib29sIGVkaXRvclxcXCIvPlwiKTt9KFwidW5kZWZpbmVkXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC51bmRlZmluZWQ6dHlwZW9mIHVuZGVmaW5lZCE9PVwidW5kZWZpbmVkXCI/dW5kZWZpbmVkOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsImltcG9ydCB7IENvbnRhaW5lclByb3BlcnR5IH0gZnJvbSAnLi4vY29udGFpbmVyJztcbmltcG9ydCB7IEJlaGF2aW9yUHJvcGVydHkgfSBmcm9tICcuLi9iZWhhdmlvcic7XG5pbXBvcnQgeyBWYWx1ZVByb3BlcnR5IH0gZnJvbSAnLi92YWx1ZSc7XG5pbXBvcnQgeyBEb20sIFF1ZXJ5LCBIdG1sIH0gZnJvbSAndWkvZG9tJztcblxubGV0IHRlbXBsYXRlID0gcmVxdWlyZSgnLi9ib29sZWRpdG9yLmphZGUnKTtcblxubGV0IF9ib3VuZCA9IFN5bWJvbCgpLFxuXHRfYmluZMaSID0gU3ltYm9sKCksXG5cdF91bmJpbmTGkiA9IFN5bWJvbCgpLFxuXHR2YWx1ZVByb3BlcnR5ID0gbmV3IFZhbHVlUHJvcGVydHkoJ0Jvb2wnLCAoZWRpdG9yLCB2YWx1ZSkgPT4ge1xuXHRcdGxldCBlbCAgICAgICA9IGVkaXRvci5wYXJlbnQuZWwsXG5cdFx0XHRjb250ZW50ICA9IFF1ZXJ5LmZpcnN0KCcuY29udGVudCcsIGVsKSxcblx0XHRcdGxpc3RlbsaSICA9ICgpID0+IHtcblx0XHRcdFx0dmFsdWUucHVzaChpbnB1dC5jaGVja2VkKTtcblx0XHRcdH0sXG5cdFx0XHRpbnB1dCAgICA9IEh0bWwucGFyc2UodGVtcGxhdGUoeyBjaGVja2VkIDogdmFsdWUudmFsdWUgfSkpLFxuXHRcdFx0Zm9jdXPGkiAgID0gKCkgPT4gZWRpdG9yLnBhcmVudC5mb2N1c1N0cmVhbS5wdXNoKGVkaXRvci5wYXJlbnQpLFxuXHRcdFx0dW5mb2N1c8aSID0gKCkgPT4gZWRpdG9yLnBhcmVudC5mb2N1c1N0cmVhbS5wdXNoKG51bGwpO1xuXG5cdFx0Y29udGVudC5hcHBlbmRDaGlsZChpbnB1dCk7XG5cblx0XHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGxpc3RlbsaSLCBmYWxzZSk7XG5cdFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIGZvY3VzxpIsIGZhbHNlKTtcblx0XHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCB1bmZvY3VzxpIsIGZhbHNlKTtcblxuXHRcdC8vIGNhbmNlbFxuXHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdGlucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCBmb2N1c8aSLCBmYWxzZSk7XG5cdFx0XHRpbnB1dC5yZW1vdmVFdmVudExpc3RlbmVyKFwiYmx1clwiLCB1bmZvY3VzxpIsIGZhbHNlKTtcblx0XHRcdGlucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgbGlzdGVuxpIsIGZhbHNlKTtcblx0XHR9O1xuXHR9KSxcblx0Zm9jdXNQcm9wZXJ0eSA9IG5ldyBCZWhhdmlvclByb3BlcnR5KCdmb2N1cycsICh0YXJnZXQpID0+IHtcblx0XHRsZXQgY29udGVudCA9IFF1ZXJ5LmZpcnN0KCcuY29udGVudCcsIHRhcmdldC5wYXJlbnQuZWwpO1xuXHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnRlbnQuZm9jdXMoKTtcblx0XHR9O1xuXHR9KTtcblxuY2xhc3MgQm9vbEVkaXRvclByb3BlcnR5IGV4dGVuZHMgQ29udGFpbmVyUHJvcGVydHkge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcignZWRpdG9yJywgJ3ZhbHVlJyk7XG5cdH1cblxuXHRpbmplY3QodGFyZ2V0KSB7XG5cdFx0bGV0IMaSID0gc3VwZXIuaW5qZWN0KHRhcmdldCksXG5cdFx0XHRlZGl0b3IgPSB0YXJnZXQuZWRpdG9yO1xuXG5cdFx0ZWRpdG9yLnByb3BlcnRpZXMuYWRkKHZhbHVlUHJvcGVydHkpO1xuXHRcdGVkaXRvci5wcm9wZXJ0aWVzLmFkZChmb2N1c1Byb3BlcnR5KTtcblxuXHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHRlZGl0b3IucHJvcGVydGllcy5yZW1vdmUoZm9jdXNQcm9wZXJ0eSk7XG5cdFx0XHTGkigpO1xuXHRcdH07XG5cdH1cbn1cblxuZXhwb3J0IHsgQm9vbEVkaXRvclByb3BlcnR5IH07IiwiaW1wb3J0IHsgVmFsdWVTdHJlYW1Qcm9wZXJ0eSB9IGZyb20gJy4uL3ZhbHVlc3RyZWFtJztcbmltcG9ydCB7IEJvb2xWYWx1ZSB9IGZyb20gJ3N0cmVhbXkvdmFsdWUnO1xuaW1wb3J0IHsgRG9tIH0gZnJvbSAndWkvZG9tJztcblxuY2xhc3MgU3dhcENsYXNzUHJvcGVydHkgZXh0ZW5kcyBWYWx1ZVN0cmVhbVByb3BlcnR5IHtcblx0Y29uc3RydWN0b3IobmFtZSwgY2xhc3NOYW1lID0gbmFtZSwgZGVmYXVsdFZhbHVlID0gZmFsc2UpIHtcblx0XHRzdXBlcihcblx0XHRcdG5hbWUsXG5cdFx0XHQoKSA9PiBuZXcgQm9vbFZhbHVlKGRlZmF1bHRWYWx1ZSksXG5cdFx0XHQodGFyZ2V0LCB2YWx1ZSkgID0+XG5cdFx0XHRcdERvbS5zdHJlYW0odmFsdWUpLmFwcGx5U3dhcENsYXNzKHRhcmdldC5lbCwgY2xhc3NOYW1lKVxuXHRcdCk7XG5cdH1cbn1cblxuY2xhc3MgU3Ryb25nUHJvcGVydHkgZXh0ZW5kcyBTd2FwQ2xhc3NQcm9wZXJ0eSB7XG5cdGNvbnN0cnVjdG9yKGRlZmF1bHRWYWx1ZSA9IGZhbHNlKSB7XG5cdFx0c3VwZXIoXCJzdHJvbmdcIiwgXCJzdHJvbmdcIiwgZGVmYXVsdFZhbHVlKTtcblx0fVxufVxuXG5jbGFzcyBFbXBoYXNpc1Byb3BlcnR5IGV4dGVuZHMgU3dhcENsYXNzUHJvcGVydHkge1xuXHRjb25zdHJ1Y3RvcihkZWZhdWx0VmFsdWUgPSBmYWxzZSkge1xuXHRcdHN1cGVyKFwiZW1waGFzaXNcIiwgXCJlbXBoYXNpc1wiLCBkZWZhdWx0VmFsdWUpO1xuXHR9XG59XG5cbmNsYXNzIFN0cmlrZVByb3BlcnR5IGV4dGVuZHMgU3dhcENsYXNzUHJvcGVydHkge1xuXHRjb25zdHJ1Y3RvcihkZWZhdWx0VmFsdWUgPSBmYWxzZSkge1xuXHRcdHN1cGVyKFwic3RyaWtlXCIsIFwic3RyaWtlXCIsIGRlZmF1bHRWYWx1ZSk7XG5cdH1cbn1cblxuZXhwb3J0IHsgU3Ryb25nUHJvcGVydHksIEVtcGhhc2lzUHJvcGVydHksIFN0cmlrZVByb3BlcnR5LCBTd2FwQ2xhc3NQcm9wZXJ0eSB9OyIsImltcG9ydCB7IFB1c2hTdHJlYW0gfSBmcm9tICdzdHJlYW15L3N0cmVhbSc7XG5pbXBvcnQgeyBCb29sVmFsdWUgfSBmcm9tICdzdHJlYW15L3ZhbHVlJztcbmltcG9ydCB7IFN0cmVhbVByb3BlcnR5IH0gZnJvbSAnLi4vc3RyZWFtJztcbmltcG9ydCB7IERvbSB9IGZyb20gJ3VpL2RvbSc7XG5cbmV4cG9ydCBjbGFzcyBDbGlja1Byb3BlcnR5IGV4dGVuZHMgU3RyZWFtUHJvcGVydHkge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcihcblx0XHRcdFwiY2xpY2tcIixcblx0XHRcdCgpID0+IG5ldyBQdXNoU3RyZWFtKCksXG5cdFx0XHQodGFyZ2V0LCB2YWx1ZSkgID0+XG5cdFx0XHRcdERvbS5zdHJlYW0odmFsdWUpLm9uKFwiY2xpY2tcIiwgdGFyZ2V0LmVsKVxuXHRcdCk7XG5cdH1cbn0iLCJpbXBvcnQgeyBCb29sRWRpdG9yUHJvcGVydHkgfSBmcm9tICcuL2Jvb2xlZGl0b3InO1xuaW1wb3J0IHsgVGV4dEVkaXRvclByb3BlcnR5IH0gZnJvbSAnLi90ZXh0ZWRpdG9yJztcblxuZXhwb3J0IGxldCBFZGl0b3JQcm9wZXJ0eSA9IHtcblx0Y3JlYXRlKHR5cGUsIC4uLmFyZ3MpIHtcblx0XHRzd2l0Y2godHlwZSkge1xuXHRcdFx0Y2FzZSAnU3RyaW5nJzpcblx0XHRcdFx0cmV0dXJuIG5ldyBUZXh0RWRpdG9yUHJvcGVydHkoLi4uYXJncyk7XG5cdFx0XHRjYXNlICdCb29sJzpcblx0XHRcdFx0cmV0dXJuIG5ldyBCb29sRWRpdG9yUHJvcGVydHkoLi4uYXJncyk7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgZWRpdG9yIHR5cGUgJyR7dHlwZX0nYCk7XG5cdFx0fVxuXHR9XG59IiwiaW1wb3J0IHsgVmFsdWVTdHJlYW1Qcm9wZXJ0eSB9IGZyb20gJy4uL3ZhbHVlc3RyZWFtJztcbmltcG9ydCB7IEJvb2xWYWx1ZSB9IGZyb20gJ3N0cmVhbXkvdmFsdWUnO1xuaW1wb3J0IHsgRG9tLCBRdWVyeSB9IGZyb20gJ3VpL2RvbSc7XG5cbmV4cG9ydCBjbGFzcyBFbmFibGVQcm9wZXJ0eSBleHRlbmRzIFZhbHVlU3RyZWFtUHJvcGVydHkge1xuXHRjb25zdHJ1Y3RvcihkZWZhdWx0VmFsdWUgPSB0cnVlKSB7XG5cdFx0c3VwZXIoXG5cdFx0XHQnZW5hYmxlJyxcblx0XHRcdCgpID0+IG5ldyBCb29sVmFsdWUoZGVmYXVsdFZhbHVlKSxcblx0XHRcdCh0YXJnZXQsIHZhbHVlKSAgPT4ge1xuXHRcdFx0XHRsZXQgbmVnYXRlZCA9IHZhbHVlLm5lZ2F0ZSgpLFxuXHRcdFx0XHRcdGVscyA9IFF1ZXJ5LmFsbCgnaW5wdXQsc2VsZWN0LHRleHRhcmVhLGJ1dHRvbicsIHRhcmdldC5lbClcblx0XHRcdFx0XHRcdFx0LmNvbmNhdChbdGFyZ2V0LmVsXSk7XG5cdFx0XHRcdGxldCDGkiAgID0gZWxzLm1hcCgoZWwpID0+IERvbS5zdHJlYW0obmVnYXRlZCkuYXBwbHlTd2FwQXR0cmlidXRlKCdkaXNhYmxlZCcsIHRhcmdldC5lbCkpXG5cdFx0XHRcdFx0XHRcdC5jb25jYXQoW1xuXHRcdFx0XHRcdFx0XHRcdERvbS5zdHJlYW0obmVnYXRlZCkuYXBwbHlTd2FwQ2xhc3ModGFyZ2V0LmVsLCAnZGlzYWJsZWQnKVxuXHRcdFx0XHRcdFx0XHRdKTtcblxuXHRcdFx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0XHRcdG5lZ2F0ZWQuY2FuY2VsKCk7XG5cdFx0XHRcdFx0xpIubWFwKCjGkikgPT4gxpIoKSk7XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0KTtcblx0fVxufSIsImltcG9ydCB7IFZhbHVlU3RyZWFtUHJvcGVydHkgfSBmcm9tICcuLi92YWx1ZXN0cmVhbSc7XG5pbXBvcnQgeyBTdHJpbmdWYWx1ZSB9IGZyb20gJ3N0cmVhbXkvdmFsdWUnO1xuaW1wb3J0IHsgRG9tLCBRdWVyeSB9IGZyb20gJ3VpL2RvbSc7XG5cbmV4cG9ydCBjbGFzcyBIdG1sUHJvcGVydHkgZXh0ZW5kcyBWYWx1ZVN0cmVhbVByb3BlcnR5IHtcblx0Y29uc3RydWN0b3IoaHRtbCkge1xuXHRcdHN1cGVyKFxuXHRcdFx0XCJodG1sXCIsXG5cdFx0XHQoKSA9PiBuZXcgU3RyaW5nVmFsdWUoaHRtbCksXG5cdFx0XHR0aGlzLmFzc2lnbkh0bWxcblx0XHQpO1xuXHR9XG5cblx0YXNzaWduSHRtbCh0YXJnZXQsIHZhbHVlKSB7XG5cdFx0RG9tLnN0cmVhbSh2YWx1ZSkuYXBwbHlIdG1sKFF1ZXJ5LmZpcnN0KCcuY29udGVudCcsIHRhcmdldC5lbCkpXG5cdH1cbn0iLCJpbXBvcnQgeyBIdG1sUHJvcGVydHkgfSBmcm9tICcuL2h0bWwnO1xuaW1wb3J0IHsgU3RyaW5nVmFsdWUgfSBmcm9tICdzdHJlYW15L3ZhbHVlJztcbmltcG9ydCB7IERvbSwgUXVlcnkgfSBmcm9tICd1aS9kb20nO1xuXG5leHBvcnQgY2xhc3MgSWNvblByb3BlcnR5IGV4dGVuZHMgSHRtbFByb3BlcnR5IHtcblx0YXNzaWduSHRtbCh0YXJnZXQsIHZhbHVlKSB7XG5cdFx0bGV0IHRyYW5zZm9ybSA9IHZhbHVlLm1hcCgoaWNvbikgPT4gYDxpIGNsYXNzPVwiZmEgZmEtJHtpY29ufVwiPjwvaT5gKSxcblx0XHRcdMaSID0gc3VwZXIuYXNzaWduSHRtbCh0YXJnZXQsIHRyYW5zZm9ybSk7XG5cdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdHRyYW5zZm9ybS5jYW5jZWwoKTtcblx0XHRcdMaSKCk7XG5cdFx0fTtcblx0fVxufSIsImV4cG9ydCAqIGZyb20gJy4vYXR0cmlidXRlJztcbmV4cG9ydCAqIGZyb20gJy4vYm9vbGVkaXRvcic7XG5leHBvcnQgKiBmcm9tICcuL2NsYXNzbmFtZSc7XG5leHBvcnQgKiBmcm9tICcuL2NsaWNrJztcbmV4cG9ydCAqIGZyb20gJy4vZWRpdG9yJztcbmV4cG9ydCAqIGZyb20gJy4vZW5hYmxlJztcbmV4cG9ydCAqIGZyb20gJy4vaHRtbCc7XG5leHBvcnQgKiBmcm9tICcuL2ljb24nO1xuZXhwb3J0ICogZnJvbSAnLi90ZXh0ZWRpdG9yJztcbmV4cG9ydCAqIGZyb20gJy4vbnVtZXJpY2Zvcm1hdCc7XG5leHBvcnQgKiBmcm9tICcuL2xpbmsnO1xuZXhwb3J0ICogZnJvbSAnLi90ZXh0JztcbmV4cG9ydCAqIGZyb20gJy4vdmFsdWUnO1xuZXhwb3J0ICogZnJvbSAnLi92aXNpYmxlJzsiLCJpbXBvcnQgeyBWYWx1ZVN0cmVhbVByb3BlcnR5IH0gZnJvbSAnLi4vdmFsdWVzdHJlYW0nO1xuaW1wb3J0IHsgU3RyaW5nVmFsdWUgfSBmcm9tICdzdHJlYW15L3ZhbHVlJztcblxuY2xhc3MgTGlua1Byb3BlcnR5IGV4dGVuZHMgVmFsdWVTdHJlYW1Qcm9wZXJ0eSB7XG5cdGNvbnN0cnVjdG9yKHVybCA9IFwiXCIpIHtcblx0XHRzdXBlcihcblx0XHRcdFwibGlua1wiLFxuXHRcdFx0KCkgPT4gbmV3IFN0cmluZ1ZhbHVlKHVybCksXG5cdFx0XHQodGFyZ2V0LCB2YWx1ZSkgID0+IHtcblx0XHRcdFx0bGV0IGEgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpLFxuXHRcdFx0XHRcdGVsID0gdGFyZ2V0LmVsLFxuXHRcdFx0XHRcdMaSICA9ICh1cmwpID0+IGEuaHJlZiA9IHVybDtcblx0XHRcdFx0YS50YXJnZXQgPSBcIl9ibGFua1wiO1xuXHRcdFx0XHRmb3IobGV0IGkgPSAwOyBpIDwgZWwuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGEuYXBwZW5kQ2hpbGQoZWwuY2hpbGROb2Rlc1tpXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWwuYXBwZW5kQ2hpbGQoYSk7XG5cdFx0XHRcdHZhbHVlLnN1YnNjcmliZSjGkik7XG5cdFx0XHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHRcdFx0dmFsdWUudW5zdWJzY3JpYmUoxpIpO1xuXHRcdFx0XHRcdGVsLnJlbW92ZUNoaWxkKGEpO1xuXHRcdFx0XHRcdGZvcihsZXQgaSA9IDA7IGkgPCBhLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdGVsLmFwcGVuZENoaWxkKGEuY2hpbGROb2Rlc1tpXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdCk7XG5cdH1cbn1cblxuZXhwb3J0IHsgTGlua1Byb3BlcnR5IH07IiwiaW1wb3J0IHsgU3RyaW5nVmFsdWUgfSBmcm9tICdzdHJlYW15L3ZhbHVlJztcbmltcG9ydCB7IFZhbHVlU3RyZWFtUHJvcGVydHkgfSBmcm9tICcuLi92YWx1ZXN0cmVhbSc7XG5cbmxldCBudW1lcmFsID0gcmVxdWlyZSgnbnVtZXJhbCcpO1xuXG5jbGFzcyBOdW1lcmljRm9ybWF0UHJvcGVydHkgZXh0ZW5kcyBWYWx1ZVN0cmVhbVByb3BlcnR5IHtcblx0Y29uc3RydWN0b3IoZGVmYXVsdEZvcm1hdCA9IFwiXCIpIHtcblx0XHRzdXBlcihcblx0XHRcdFwiZm9ybWF0XCIsXG5cdFx0XHQoKSA9PiBuZXcgU3RyaW5nVmFsdWUoZGVmYXVsdEZvcm1hdCksXG5cdFx0XHQodGFyZ2V0LCBmb3JtYXQpID0+IHtcblx0XHRcdFx0bGV0IHZhbHVlID0gdGFyZ2V0LnZhbHVlLFxuXHRcdFx0XHRcdHRleHQgID0gdGFyZ2V0LnRleHQ7XG5cdFx0XHRcdGlmKCF2YWx1ZSkge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIidmb3JtYXQnIHJlcXVpcmVzIHRoZSBwcm9wZXJ0eSAndmFsdWUnXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKCF0ZXh0KSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiJ2Zvcm1hdCcgcmVxdWlyZXMgdGhlIHByb3BlcnR5ICd0ZXh0J1wiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRsZXQgc3RyZWFtID0gdmFsdWUuemlwKGZvcm1hdCk7XG5cdFx0XHRcdHN0cmVhbS5zcHJlYWQoKHZhbHVlLCBmb3JtYXQpID0+IHtcblx0XHRcdFx0XHRpZihmb3JtYXQgPT09IFwiXCIpIHtcblx0XHRcdFx0XHRcdGZvcm1hdCA9IE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSA/IFwiMCwwXCIgOiBcIjAsMC4wMDBcIjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGV4dC52YWx1ZSA9IG51bWVyYWwodmFsdWUpLmZvcm1hdChmb3JtYXQpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuIHN0cmVhbS5jYW5jZWwuYmluZChzdHJlYW0pO1xuXHRcdFx0fVxuXHRcdCk7XG5cdH1cbn1cblxuZXhwb3J0IHsgTnVtZXJpY0Zvcm1hdFByb3BlcnR5IH07IiwiaW1wb3J0IHsgVmFsdWVTdHJlYW1Qcm9wZXJ0eSB9IGZyb20gJy4uL3ZhbHVlc3RyZWFtJztcbmltcG9ydCB7IFN0cmluZ1ZhbHVlIH0gZnJvbSAnc3RyZWFteS92YWx1ZSc7XG5pbXBvcnQgeyBEb20sIFF1ZXJ5IH0gZnJvbSAndWkvZG9tJztcblxuY2xhc3MgVGV4dFByb3BlcnR5IGV4dGVuZHMgVmFsdWVTdHJlYW1Qcm9wZXJ0eSB7XG5cdGNvbnN0cnVjdG9yKHRleHQpIHtcblx0XHRzdXBlcihcblx0XHRcdFwidGV4dFwiLFxuXHRcdFx0KCkgPT4gbmV3IFN0cmluZ1ZhbHVlKHRleHQpLFxuXHRcdFx0KHRhcmdldCwgdmFsdWUpICA9PlxuXHRcdFx0XHREb20uc3RyZWFtKHZhbHVlKS5hcHBseVRleHQoUXVlcnkuZmlyc3QoJy5jb250ZW50JywgdGFyZ2V0LmVsKSlcblx0XHQpO1xuXHR9XG59XG5cbmV4cG9ydCB7IFRleHRQcm9wZXJ0eSB9OyIsImltcG9ydCB7IENvbnRhaW5lclByb3BlcnR5IH0gZnJvbSAnLi4vY29udGFpbmVyJztcbmltcG9ydCB7IEJlaGF2aW9yUHJvcGVydHkgfSBmcm9tICcuLi9iZWhhdmlvcic7XG5pbXBvcnQgeyBWYWx1ZVByb3BlcnR5IH0gZnJvbSAnLi92YWx1ZSc7XG5pbXBvcnQgeyBEb20sIFF1ZXJ5IH0gZnJvbSAndWkvZG9tJztcbmltcG9ydCB7IFB1c2hTdHJlYW0gfSBmcm9tICdzdHJlYW15L3N0cmVhbSc7XG5cbmxldCBfYm91bmQgPSBTeW1ib2woKSxcblx0X2JpbmTGkiA9IFN5bWJvbCgpLFxuXHRfdW5iaW5kxpIgPSBTeW1ib2woKSxcblx0dmFsdWVQcm9wZXJ0eSA9IG5ldyBWYWx1ZVByb3BlcnR5KCdTdHJpbmcnLCAoZWRpdG9yLCB2YWx1ZSkgPT4ge1xuXHRcdGxldCBlbCAgICAgID0gZWRpdG9yLnBhcmVudC5lbCxcblx0XHRcdGNvbnRlbnQgPSBRdWVyeS5maXJzdCgnLmNvbnRlbnQnLCBlbCksXG5cdFx0XHRzdHJlYW0gID0gdmFsdWUubWFwKChzKSA9PiBzLmxlbmd0aCA9PT0gMCkudW5pcXVlKCksXG5cdFx0XHRjYW5jZWzGkiA9IERvbS5zdHJlYW0oc3RyZWFtKS5hcHBseVN3YXBDbGFzcyhjb250ZW50LCAnZW1wdHknKSxcblx0XHRcdGxpc3RlbsaSID0gKGUpID0+IHtcblx0XHRcdFx0dmFsdWUucHVzaChlbC5pbm5lclRleHQpO1xuXHRcdFx0fTtcblxuXHRcdGVkaXRvcltfYm91bmRdID0gZmFsc2U7XG5cdFx0ZWRpdG9yW19iaW5kxpJdID0gKCkgPT4ge1xuXHRcdFx0aWYoZWRpdG9yW19ib3VuZF0pIHJldHVybjtcblx0XHRcdGNvbnRlbnQuc2V0QXR0cmlidXRlKFwiY29udGVudGVkaXRhYmxlXCIsIHRydWUpO1xuXHRcdFx0Y29udGVudC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgbGlzdGVuxpIsIGZhbHNlKTtcblx0XHRcdGVkaXRvcltfYm91bmRdID0gdHJ1ZTtcblx0XHR9LFxuXHRcdGVkaXRvcltfdW5iaW5kxpJdID0gKCkgPT4ge1xuXHRcdFx0aWYoIWVkaXRvcltfYm91bmRdKSByZXR1cm47XG5cdFx0XHRjb250ZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBsaXN0ZW7GkiwgZmFsc2UpO1xuXHRcdFx0Y29udGVudC5yZW1vdmVBdHRyaWJ1dGUoXCJjb250ZW50ZWRpdGFibGVcIik7XG5cdFx0XHRlZGl0b3JbX2JvdW5kXSA9IGZhbHNlO1xuXHRcdH07XG5cblx0XHRsZXQgZm9jdXPGkiA9ICgpID0+IHtcblx0XHRcdFx0ZWRpdG9yLnBhcmVudC5mb2N1c1N0cmVhbS5wdXNoKGVkaXRvci5wYXJlbnQpO1xuXHRcdFx0XHRlZGl0b3IuZm9jdXMoKTtcblx0XHRcdH0sXG5cdFx0XHR1bmZvY3VzxpIgPSAoKSA9PiB7XG5cdFx0XHRcdGVkaXRvci5wYXJlbnQuZm9jdXNTdHJlYW0ucHVzaChudWxsKTtcblx0XHRcdFx0ZWRpdG9yW191bmJpbmTGkl0oKTtcblx0XHRcdH07XG5cblx0XHRjb250ZW50LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuXHRcdGNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIGZvY3VzxpIsIGZhbHNlKTtcblx0XHRjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIHVuZm9jdXPGkik7XG5cblx0XHQvLyBjYW5jZWxcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRjYW5jZWzGkigpO1xuXHRcdFx0ZWRpdG9yW191bmJpbmTGkl0oKTtcblx0XHRcdGRlbGV0ZSBlZGl0b3JbX3VuYmluZMaSXTtcblx0XHRcdGRlbGV0ZSBlZGl0b3JbX2JpbmTGkl07XG5cdFx0XHRkZWxldGUgZWRpdG9yW19ib3VuZF07XG5cdFx0XHRjb250ZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIHVuZm9jdXPGkiwgZmFsc2UpO1xuXHRcdFx0Y29udGVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgZm9jdXPGkiwgZmFsc2UpO1xuXHRcdFx0Y29udGVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgbGlzdGVuxpIsIGZhbHNlKTtcblx0XHRcdGNvbnRlbnQucmVtb3ZlQXR0cmlidXRlKFwiY29udGVudGVkaXRhYmxlXCIpO1xuXHRcdH07XG5cdH0pLFxuXHRmb2N1c1Byb3BlcnR5ID0gbmV3IEJlaGF2aW9yUHJvcGVydHkoJ2ZvY3VzJywgKHRhcmdldCkgPT4ge1xuXHRcdGxldCBjb250ZW50ID0gUXVlcnkuZmlyc3QoJy5jb250ZW50JywgdGFyZ2V0LnBhcmVudC5lbCk7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0dGFyZ2V0W19iaW5kxpJdKCk7XG5cdFx0XHRjb250ZW50LmZvY3VzKCk7XG5cdFx0fTtcblx0fSksXG5cdGdldFNlbGVjdGlvblByb3BlcnR5ID0gbmV3IEJlaGF2aW9yUHJvcGVydHkoJ2dldFNlbGVjdGlvbicsICh0YXJnZXQpID0+IHtcblx0XHRsZXQgY29udGVudCA9IFF1ZXJ5LmZpcnN0KCcuY29udGVudCcsIHRhcmdldC5wYXJlbnQuZWwpO1xuXHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdGxldCBzZWxlY3Rpb24gPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG5cdFx0XHRpZighc2VsZWN0aW9uLmJhc2VOb2RlIGluIGNvbnRlbnQuY2hpbGROb2Rlcylcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwibm90IGZvdW5kIVwiKTtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHN0YXJ0OiBzZWxlY3Rpb24uYW5jaG9yT2Zmc2V0LFxuXHRcdFx0XHRlbmQ6IHNlbGVjdGlvbi5mb2N1c09mZnNldCxcblx0XHRcdFx0dGV4dDogc2VsZWN0aW9uLnRvU3RyaW5nKClcblx0XHRcdH07XG5cdFx0fTtcblx0fSksXG5cdHNldFNlbGVjdGlvblByb3BlcnR5ID0gbmV3IEJlaGF2aW9yUHJvcGVydHkoJ3NldFNlbGVjdGlvbicsICh0YXJnZXQpID0+IHtcblx0XHRsZXQgY29udGVudCA9IFF1ZXJ5LmZpcnN0KCcuY29udGVudCcsIHRhcmdldC5wYXJlbnQuZWwpO1xuXHRcdHJldHVybiBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG5cdFx0XHRsZXQgbm9kZSAgPSBjb250ZW50LmZpcnN0Q2hpbGQsXG5cdFx0XHRcdHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKSxcblx0XHRcdFx0c2VsICAgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG5cdFx0XHR0YXJnZXQuZm9jdXMoKTtcblx0XHRcdGlmKCFub2RlKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHJhbmdlLnNldFN0YXJ0KG5vZGUsIE1hdGgubWF4KHN0YXJ0LCAwKSk7XG5cdFx0XHRyYW5nZS5zZXRFbmQobm9kZSwgTWF0aC5taW4oZW5kLCBub2RlLndob2xlVGV4dC5sZW5ndGgpKTtcblx0XHRcdHNlbC5yZW1vdmVBbGxSYW5nZXMoKTtcblx0XHRcdHNlbC5hZGRSYW5nZShyYW5nZSk7XG5cdFx0fTtcblx0fSk7XG5cbmNsYXNzIFRleHRFZGl0b3JQcm9wZXJ0eSBleHRlbmRzIENvbnRhaW5lclByb3BlcnR5IHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoJ2VkaXRvcicsICd2YWx1ZScpO1xuXHR9XG5cblx0aW5qZWN0KHRhcmdldCkge1xuXHRcdGxldCDGkiA9IHN1cGVyLmluamVjdCh0YXJnZXQpLFxuXHRcdFx0ZWRpdG9yID0gdGFyZ2V0LmVkaXRvcjtcblxuXHRcdGVkaXRvci5wcm9wZXJ0aWVzLmFkZCh2YWx1ZVByb3BlcnR5KTtcblx0XHRlZGl0b3IucHJvcGVydGllcy5hZGQoZm9jdXNQcm9wZXJ0eSk7XG5cdFx0ZWRpdG9yLnByb3BlcnRpZXMuYWRkKGdldFNlbGVjdGlvblByb3BlcnR5KTtcblx0XHRlZGl0b3IucHJvcGVydGllcy5hZGQoc2V0U2VsZWN0aW9uUHJvcGVydHkpO1xuXG5cdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdGVkaXRvci5wcm9wZXJ0aWVzLnJlbW92ZShmb2N1c1Byb3BlcnR5KTtcblx0XHRcdGVkaXRvci5wcm9wZXJ0aWVzLnJlbW92ZShnZXRTZWxlY3Rpb25Qcm9wZXJ0eSk7XG5cdFx0XHRlZGl0b3IucHJvcGVydGllcy5yZW1vdmUoc2V0U2VsZWN0aW9uUHJvcGVydHkpO1xuXHRcdFx0xpIoKTtcblx0XHR9O1xuXHR9XG59XG5cbmV4cG9ydCB7IFRleHRFZGl0b3JQcm9wZXJ0eSB9OyIsImltcG9ydCB7IFZhbHVlU3RyZWFtUHJvcGVydHkgfSBmcm9tICcuLi92YWx1ZXN0cmVhbSc7XG5pbXBvcnQgeyBTdHJpbmdWYWx1ZSwgQm9vbFZhbHVlLCBGbG9hdFZhbHVlLCBEYXRlVmFsdWUgfSBmcm9tICdzdHJlYW15L3ZhbHVlJztcblxuZnVuY3Rpb24gdmFsdWVGdW5jdG9yKHR5cGUsIC4uLmFyZ3MpIHtcblx0c3dpdGNoKHR5cGUpIHtcblx0XHRjYXNlIFwiU3RyaW5nXCI6XG5cdFx0XHRyZXR1cm4gbmV3IFN0cmluZ1ZhbHVlKC4uLmFyZ3MpO1xuXHRcdGNhc2UgXCJCb29sXCI6XG5cdFx0XHRyZXR1cm4gbmV3IEJvb2xWYWx1ZSguLi5hcmdzKTtcblx0XHRjYXNlIFwiRmxvYXRcIjpcblx0XHRcdHJldHVybiBuZXcgRmxvYXRWYWx1ZSguLi5hcmdzKTtcblx0XHRjYXNlIFwiRGF0ZVwiOlxuXHRcdFx0cmV0dXJuIG5ldyBEYXRlVmFsdWUoLi4uYXJncyk7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdHRocm93IG5ldyBFcnJvcihgdHlwZSAnJHt0eXBlfScgbm90IGZvdW5kYCk7XG5cdH1cbn1cblxuY2xhc3MgVmFsdWVQcm9wZXJ0eSBleHRlbmRzIFZhbHVlU3RyZWFtUHJvcGVydHkge1xuXHRjb25zdHJ1Y3Rvcih0eXBlLCB3aXJlxpIsIC4uLmFyZ3MpIHtcblx0XHRzdXBlcihcblx0XHRcdFwidmFsdWVcIixcblx0XHRcdCgpID0+IHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJyA/IHZhbHVlRnVuY3Rvcih0eXBlLCAuLi5hcmdzKSA6IHR5cGUsXG5cdFx0XHR3aXJlxpIgfHwgKCgpICA9PiAoKCkgPT4ge30pKVxuXHRcdCk7XG5cdH1cbn1cblxuZXhwb3J0IHsgVmFsdWVQcm9wZXJ0eSB9OyIsImltcG9ydCB7IFZhbHVlU3RyZWFtUHJvcGVydHkgfSBmcm9tICcuLi92YWx1ZXN0cmVhbSc7XG5pbXBvcnQgeyBCb29sVmFsdWUgfSBmcm9tICdzdHJlYW15L3ZhbHVlJztcbmltcG9ydCB7IERvbSB9IGZyb20gJ3VpL2RvbSc7XG5cbmNsYXNzIFZpc2libGVQcm9wZXJ0eSBleHRlbmRzIFZhbHVlU3RyZWFtUHJvcGVydHkge1xuXHRjb25zdHJ1Y3RvcihkZWZhdWx0VmFsdWUgPSB0cnVlKSB7XG5cdFx0c3VwZXIoXG5cdFx0XHRcInZpc2libGVcIixcblx0XHRcdCgpID0+IG5ldyBCb29sVmFsdWUoZGVmYXVsdFZhbHVlKSxcblx0XHRcdCh0YXJnZXQsIHZhbHVlKSAgPT5cblx0XHRcdFx0RG9tLnN0cmVhbSh2YWx1ZSkuYXBwbHlEaXNwbGF5KHRhcmdldC5lbClcblx0XHQpO1xuXHR9XG59XG5cbmV4cG9ydCB7IFZpc2libGVQcm9wZXJ0eSB9OyIsImltcG9ydCB7IEJhc2VQcm9wZXJ0eSB9IGZyb20gJy4vYmFzZSc7XG5pbXBvcnQgeyDGkiB9IGZyb20gJ3V0aWwvxpInO1xuXG5sZXQgX3AgPSBTeW1ib2woKTtcblxuY2xhc3MgVmFsdWVTdHJlYW1Qcm9wZXJ0eSBleHRlbmRzIEJhc2VQcm9wZXJ0eSB7XG5cdGNvbnN0cnVjdG9yKG5hbWUsIHZhbHVlxpIsIHdpcmXGkikge1xuXHRcdHN1cGVyKG5hbWUpO1xuXHRcdHRoaXNbX3BdID0geyB2YWx1ZcaSLCB3aXJlxpIgfTtcblx0fVxuXG5cdGluamVjdCh0YXJnZXQpIHtcblx0XHRsZXQgdmFsdWUgPSB0aGlzW19wXS52YWx1ZcaSKCk7XG5cdFx0dGhpcy5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHRoaXMubmFtZSwgKCkgPT4gdmFsdWUsIHZhbHVlLnB1c2guYmluZCh2YWx1ZSkpO1xuXG5cdFx0cmV0dXJuIMaSLmpvaW4oXG5cdFx0XHR0aGlzW19wXS53aXJlxpIodGFyZ2V0LCB2YWx1ZSksXG5cdFx0XHQoKSA9PiB2YWx1ZS5jYW5jZWwoKVxuXHRcdCk7XG5cdH1cbn1cblxuZXhwb3J0IHsgVmFsdWVTdHJlYW1Qcm9wZXJ0eSB9OyIsImltcG9ydCB7IFB1c2hTdHJlYW0gfSBmcm9tICdzdHJlYW15L3N0cmVhbSc7XG5cbmxldCBfZmllbGRzID0gU3ltYm9sKCksXG5cdF9zdHJlYW0gPSBTeW1ib2woKTtcblxuZXhwb3J0IGNsYXNzIFNjaGVtYSB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXNbX2ZpZWxkc10gPSB7fTtcblx0XHR0aGlzW19zdHJlYW1dID0gbmV3IFB1c2hTdHJlYW0oKTtcblx0XHRsZXQgc3Vic2NyaWJlID0gdGhpc1tfc3RyZWFtXS5zdWJzY3JpYmUuYmluZCh0aGlzW19zdHJlYW1dKTtcblx0XHR0aGlzW19zdHJlYW1dLnN1YnNjcmliZSA9ICjGkikgPT4ge1xuXHRcdFx0c3Vic2NyaWJlKMaSKTtcblx0XHRcdMaSKHtldmVudDonbGlzdCcsZGF0YTp0aGlzLnBhaXJzfSk7XG5cdFx0fTtcblx0fVxuXG5cdGFkZChuYW1lLCB0eXBlKSB7XG5cdFx0aWYobmFtZSBpbiB0aGlzW19maWVsZHNdKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBTY2hlbWEgYWxyZWFkeSBjb250YWlucyBhIGZpZWxkICcke25hbWV9J2ApO1xuXHRcdHRoaXNbX2ZpZWxkc11bbmFtZV0gPSB0eXBlO1xuXHRcdHRoaXNbX3N0cmVhbV0ucHVzaCh7XG5cdFx0XHRldmVudDogJ2FkZCcsXG5cdFx0XHRuYW1lOiAgbmFtZSxcblx0XHRcdHR5cGU6ICB0eXBlXG5cdFx0fSk7XG5cdH1cblxuXHRyZXNldChsaXN0ID0gW10pIHtcblx0XHR0aGlzW19maWVsZHNdID0ge307XG5cdFx0bGlzdC5tYXAodiA9PiB0aGlzW19maWVsZHNdW3YubmFtZV0gPSB2LnR5cGUpO1xuXHRcdHRoaXNbX3N0cmVhbV0ucHVzaCh7XG5cdFx0XHRldmVudDogJ2xpc3QnLFxuXHRcdFx0ZGF0YTogIGxpc3Quc2xpY2UoMClcblx0XHR9KTtcblx0fVxuXG5cdGRlbGV0ZShuYW1lKSB7XG5cdFx0aWYoIShuYW1lIGluIHRoaXNbX2ZpZWxkc10pKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBTY2hlbWEgZG9lcyBub3QgY29udGFpbiBhIGZpZWxkICcke25hbWV9J2ApO1xuXHRcdGRlbGV0ZSB0aGlzW19maWVsZHNdW25hbWVdO1xuXHRcdHRoaXNbX3N0cmVhbV0ucHVzaCh7XG5cdFx0XHRldmVudDogJ2RlbGV0ZScsXG5cdFx0XHRuYW1lOiAgbmFtZVxuXHRcdH0pO1xuXHR9XG5cblx0cmVuYW1lKG9sZG5hbWUsIG5ld25hbWUpIHtcblx0XHRpZighKG9sZG5hbWUgaW4gdGhpc1tfZmllbGRzXSkpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFNjaGVtYSBkb2VzIG5vdCBjb250YWluIGEgZmllbGQgJyR7b2xkbmFtZX0nYCk7XG5cdFx0bGV0IHR5cGUgPSB0aGlzW19maWVsZHNdW29sZG5hbWVdO1xuXHRcdGRlbGV0ZSB0aGlzW19maWVsZHNdW29sZG5hbWVdO1xuXHRcdHRoaXNbX2ZpZWxkc11bbmV3bmFtZV0gPSB0eXBlO1xuXHRcdHRoaXNbX3N0cmVhbV0ucHVzaCh7XG5cdFx0XHRldmVudDogICAncmVuYW1lJyxcblx0XHRcdG9sZG5hbWU6IG9sZG5hbWUsXG5cdFx0XHRuZXduYW1lOiBuZXduYW1lXG5cdFx0fSk7XG5cdH1cblxuXHRyZXR5cGUobmFtZSwgdHlwZSkge1xuXHRcdGlmKCEobmFtZSBpbiB0aGlzW19maWVsZHNdKSlcblx0XHRcdHRocm93IG5ldyBFcnJvcihgU2NoZW1hIGRvZXNuJ3QgY29udGFpbmVyIGZpZWxkICcke25hbWV9JyBmb3IgcmV0eXBlKClgKTtcblx0XHR0aGlzW19maWVsZHNdW25hbWVdO1xuXHRcdHRoaXNbX2ZpZWxkc11bbmFtZV0gPSB0eXBlO1xuXHRcdHRoaXNbX3N0cmVhbV0ucHVzaCh7XG5cdFx0XHRldmVudDoncmV0eXBlJyxcblx0XHRcdG5hbWU6bmFtZSxcblx0XHRcdHR5cGU6dHlwZVxuXHRcdH0pO1xuXHR9XG5cblx0Z2V0KG5hbWUpIHtcblx0XHRyZXR1cm4gdGhpc1tfZmllbGRzXVtuYW1lXTtcblx0fVxuXG5cdGhhcyhuYW1lKSB7XG5cdFx0cmV0dXJuIG5hbWUgaW4gdGhpc1tfZmllbGRzXTtcblx0fVxuXG5cdFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuXHRcdHJldHVybiB0aGlzLmFycmF5O1xuXHR9XG5cblx0Z2V0IGFycmF5KCkge1xuXHRcdHJldHVybiBPYmplY3Qua2V5cyh0aGlzW19maWVsZHNdKTtcblx0fVxuXG5cdGdldCBwYWlycygpIHtcblx0XHRyZXR1cm4gT2JqZWN0LmtleXModGhpc1tfZmllbGRzXSkubWFwKGZ1bmN0aW9uKGspIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGtleTogayxcblx0XHRcdFx0dmFsdWU6IHRoaXNbX2ZpZWxkc11ba2V5XVxuXHRcdFx0fTtcblx0XHR9KTtcblx0fVxuXG5cdGdldCBzdHJlYW0oKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3N0cmVhbV07XG5cdH1cblxuXHR0b1N0cmluZygpIHtcblx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpc1tfZmllbGRzXSk7XG5cdH1cbn0iLCJsZXQgaW1tZWRpYXRlID0gcmVxdWlyZSgnaW1tZWRpYXRlJyksXG5cdFRpbWVyID0ge1xuXHRkZWxheShtcywgxpIpIHtcblx0XHRpZijGkilcblx0XHRcdHJldHVybiBzZXRUaW1lb3V0KMaSLCBtcyk7XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG5cdH0sXG5cdGltbWVkaWF0ZSjGkikge1xuXHRcdGlmKMaSKVxuXHRcdFx0cmV0dXJuIGltbWVkaWF0ZSjGkik7XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBpbW1lZGlhdGUocmVzb2x2ZSkpO1xuXHR9LFxuXHRkZWJvdW5jZSjGkiwgbXMgPSAwKSB7XG5cdFx0bGV0IHRpZCwgY29udGV4dCwgYXJncywgbGF0ZXLGkjtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRjb250ZXh0ID0gdGhpcztcblx0XHRcdGFyZ3MgPSBhcmd1bWVudHM7XG5cdFx0XHRsYXRlcsaSID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICghaW1tZWRpYXRlKSDGki5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0XHRcdH07XG5cdFx0XHRjbGVhclRpbWVvdXQodGlkKTtcblx0XHRcdHRpZCA9IHNldFRpbWVvdXQobGF0ZXLGkiwgbXMpO1xuXHRcdH07XG5cdH0sXG5cdHJlZHVjZSjGkiwgbXMgPSAwKSB7XG5cdFx0bGV0IHRpZCwgY29udGV4dCwgYXJncztcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRjb250ZXh0ID0gdGhpcztcblx0XHRcdGFyZ3MgPSBhcmd1bWVudHM7XG5cdFx0XHRpZih0aWQpIHJldHVybjtcblx0XHRcdHRpZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRpZCA9IG51bGw7XG5cdFx0XHRcdMaSLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHRcdFx0fSwgbXMpO1xuXHRcdH07XG5cdH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFRpbWVyOyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxoZWFkZXIgY2xhc3M9XFxcInRvb2xiYXJcXFwiPjxkaXYgY2xhc3M9XFxcImxlZnRcXFwiPjwvZGl2PjxkaXYgY2xhc3M9XFxcIm1pZGRsZVxcXCI+PC9kaXY+PGRpdiBjbGFzcz1cXFwicmlnaHRcXFwiPjwvZGl2PjwvaGVhZGVyPlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQgeyBRdWVyeSB9IGZyb20gJ3VpL2RvbSc7XG5cbmxldCB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4vdG9vbGJhci5qYWRlJykoKSxcblx0X2xlZnQgICAgPSBTeW1ib2woKSxcblx0X21pZGRsZSAgPSBTeW1ib2woKSxcblx0X3JpZ2h0ICAgPSBTeW1ib2woKSxcblx0X2VsICAgICAgPSBTeW1ib2woKTtcblxuZXhwb3J0IGNsYXNzIFRvb2xiYXJHcm91cCB7XG5cdGNvbnN0cnVjdG9yKGVsKSB7XG5cdFx0dGhpc1tfZWxdID0gZWw7XG5cdH1cblxuXHRnZXQgZWwoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX2VsXTtcblx0fVxuXG5cdGFkZChjb21wKSB7XG5cdFx0Y29tcC5hdHRhY2hUbyh0aGlzLmVsKTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgVG9vbGJhciBleHRlbmRzIENvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuXHRcdGlmKCEoJ3RlbXBsYXRlJyBpbiBvcHRpb25zKSlcblx0XHRcdG9wdGlvbnMudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcblx0XHRzdXBlcihvcHRpb25zKTtcblx0XHR0aGlzW19sZWZ0XSAgID0gbmV3IFRvb2xiYXJHcm91cChRdWVyeS5maXJzdCgnLmxlZnQnLCB0aGlzLmVsKSk7XG5cdFx0dGhpc1tfbWlkZGxlXSA9IG5ldyBUb29sYmFyR3JvdXAoUXVlcnkuZmlyc3QoJy5taWRkbGUnLCB0aGlzLmVsKSk7XG5cdFx0dGhpc1tfcmlnaHRdICA9IG5ldyBUb29sYmFyR3JvdXAoUXVlcnkuZmlyc3QoJy5yaWdodCcsIHRoaXMuZWwpKTtcblx0fVxuXG5cdGdldCBsZWZ0KCkge1xuXHRcdHJldHVybiB0aGlzW19sZWZ0XTtcblx0fVxuXG5cdGdldCBtaWRkbGUoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX21pZGRsZV07XG5cdH1cblxuXHRnZXQgcmlnaHQoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3JpZ2h0XTtcblx0fVxufSIsImV4cG9ydCBsZXQgxpIgPSB7XG5cdGNvbXBvc2UoxpIxLCDGkjIpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gxpIxKMaSMi5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cykpO1xuXHRcdH07XG5cdH0sXG5cdGpvaW4oxpIxLCDGkjIpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHTGkjEuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuXHRcdFx0xpIyLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcblx0XHR9XG5cdH1cbn07Il19
