# Oversized Packet Fix

This project is a solution to the "Internal Exception: io.netty.handler.codec.DecoderException: Badly compressed packet" error. Informally known as chunk/book banning.

## Explanation

For years now, this error has been cropping up in a seemingly random manner.  Back when modding was more popular, someone linked this error to loading chunks with excessive amounts of NBT data. This was usually in the form of infinite chests or something comperable.  At the core of it, that's what causes this error.  Packets being sent to the client with a large amount of NBT data, namely just over 2 mb.

It wasn't until more recently that this error was weaponized against players.  People began giving items with large amounts of NBT data to a user, until they were kicked and unable to rejoin.  Some time later, the chunk overloading bug was rediscovered, and used to kick players every time the chunk was loaded.  Both of these methods effectively "banned" a user from a server.

When a user was kicked for this invalid packet, the message displayed was something along the lines of "Internal Exception: io.netty.handler.codec.DecoderException: Badly compressed packet - size of X is larger than protocol maximum."  Due to mentions of compression, I had a feeling this was an error with the decompression function and not an issue of bandwidth.  After all, 2 mb of data is actually a relatively small size.

By patching the decompressor function and having it return an empty buffer for packets over a certain size, the client is not kicked from the server.

## Installation and usage

Just clone this repository, open the run.bat file, and change the server address and version as needed. Afterwards, run the .bat file.  From there you'll need to connect to **localhost:25566** from either the direct connect tab or from your server menu.  If you've followed these steps correctly, you should be forwarded on to the server you entered in the run.bat file.

## Notes

Servers with anti-bot plugins will likely flag this program as a bot, and prevent you from connecting.  To combat this, I will be releasing a Forge mod later this month that does the same thing as this program.

It's important not to update any of the files with the "node_modules" directory.  This only works because of changes made to those core modules.  If you copy the index.js file to your machine, and reinstall minecraft-protocol, this program will not work.

This project is built upon [a similar proxy](https://github.com/PrismarineJS/node-minecraft-protocol/tree/master/examples/proxy) that I did not design.
