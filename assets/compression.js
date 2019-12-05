'use strict'

const [readVarInt, writeVarInt, sizeOfVarInt] = require('protodef').types.varint
const zlib = require('zlib')
const Transform = require('readable-stream').Transform

//Maximum tolerated packet size in vanilla MC (Just over 2mb)
const vanillaMaxSize = 2097152

module.exports.createCompressor = function (threshold) {
  return new Compressor(threshold)
}

module.exports.createDecompressor = function (threshold, hideErrors) {
  return new Decompressor(threshold, hideErrors)
}

module.exports.supportsOversizedPackets = true

class Compressor extends Transform {
  constructor (compressionThreshold = -1) {
    super()
    this.compressionThreshold = compressionThreshold
  }

  _transform (chunk, enc, cb) {
    if (chunk.length >= this.compressionThreshold) {
      zlib.deflate(chunk, (err, newChunk) => {
        if (err) { return cb(err) }
        const buf = Buffer.alloc(sizeOfVarInt(chunk.length) + newChunk.length)
        const offset = writeVarInt(chunk.length, buf, 0)
        newChunk.copy(buf, offset)
        this.push(buf)
        return cb()
      })
    } else {
      const buf = Buffer.alloc(sizeOfVarInt(0) + chunk.length)
      const offset = writeVarInt(0, buf, 0)
      chunk.copy(buf, offset)
      this.push(buf)
      return cb()
    }
  }
}

class Decompressor extends Transform {
  constructor (compressionThreshold = -1, hideErrors = false) {
    super()
    this.compressionThreshold = compressionThreshold
    this.hideErrors = hideErrors
  }

  _transform (chunk, enc, cb) {
    const { size, value, error } = readVarInt(chunk, 0)
    if (error) { return cb(error) }
    if (value === 0) {
      this.push(chunk.slice(size))
      return cb()
    } else {
      zlib.unzip(chunk.slice(size), { finishFlush: zlib.constants.Z_SYNC_FLUSH }, (err, newBuf) => { /** Fix by lefela4. */
        if (err) {
          if (!this.hideErrors) {
            console.error('problem inflating chunk')
            console.error('uncompressed length ' + value)
            console.error('compressed length ' + chunk.length)
            console.error('hex ' + chunk.toString('hex'))
            console.log(err)
          }
          return cb()
        }

        if (newBuf.length !== value && !this.hideErrors) {
          console.error('uncompressed length should be ' + value + ' but is ' + newBuf.length)
        }
        //Subtract a few bytes for good measure
        if(value < vanillaMaxSize - 90000){
          this.push(newBuf)
        } else {
          //Log disgustingly large packet
          console.log("Oversized packet: " + chunk.toString('hex'))

          //Allocate new buffer with id 0x50 and push
          //In protocol.json, created empty packet named "oversized_packet" with no params and id 0x50
          //This is an unsafe practice, in future try to learn to use customPackets field
          var oversizedData = Buffer.alloc(1, 0x50)
          this.push(oversizedData)
        }
        return cb()
      })
    }
  }
}
