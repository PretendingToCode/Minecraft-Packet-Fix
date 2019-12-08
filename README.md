# Minecraft Packet Fix

This project is a solution to the fragile nature of a Minecraft client's connection to a server.  This was created in an attempt to prevent in-game DoS attacks such as chunk-banning and chat-kicking.

## Features

This proxy boasts a few neat features

- Oversized packet handling
- Robust connections

The **oversized packet handler** replaces packets over 2mb in size with empty buffers.  This is because the packet decompressor cannot handle packets over that size.

**Robust connections** is the name I've given to a better error handling system for Minecraft's network protocol.  Instead of ending a connection when the client recieves a malformed or invalid packet, the client will log the packet in chat and silently ignore it.

## Installation and usage

This program requires you to have [Node JS](https://nodejs.org/en/) installed on your system, and in your environment variables.  There are plenty of tutorials on how to do this for your specific system.

Within your project directory, run ``` npm install minecraft-protocol ``` to install the latest version of minecraft-protocol.

After that, just clone this repository, open the run.bat file, and change the server address and version as needed. Then, run the .bat file.  If it is your first time running the program, the program will kill itself and you'll need to relaunch it.  From there you'll need to connect to **localhost:25566** from either the direct connect tab or from your server menu within your Minecraft application.  If you've followed these steps correctly, you should be forwarded on to the server you entered in the run.bat file.

## Notes

~~Servers with anti-bot plugins will likely flag this program as a bot, and prevent you from connecting.  To combat this, I will be releasing a Forge mod later this month that does the same thing as this program.~~

~~It's important not to update any of the files with the "node_modules" directory.  This only works because of changes made to those core modules.  If you copy the index.js file to your machine, and reinstall minecraft-protocol, this program will not work.~~

Bungeecord was refusing connections because the proxy used the client's preexisting Minecraft session. See [the function at line 430](https://github.com/SpigotMC/BungeeCord/blob/master/proxy/src/main/java/net/md_5/bungee/connection/InitialHandler.java) for more information.  A username and password are now required to connect to a server from the proxy (Located in login.json.)  Still working on other forms of proxy detection from servers.

Minecraft-protocol can now be installed and updated as needed, but modifications will be made to the module files.  It's advised that you only use these module files with this project.

This project is built upon [a similar proxy](https://github.com/PrismarineJS/node-minecraft-protocol/tree/master/examples/proxy) that I did not design.

## Issues

- [ ] Bungeecord servers still kick players for malformed packets due to a server-side exception.  Spigot logs error, but doesn't throw an exception
- [ ] Bungeecord servers require proxy to authenticate with Mojang to connect.  Solved, but not fond of using login credentials to auth
