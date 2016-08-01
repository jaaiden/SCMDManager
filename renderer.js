const ipc = require('electron').ipcRenderer
const os = require('os')
const http = require('https')
const fs = require('fs')
const decompress = require('decompress')
const decompressTargz = require('decompress-targz')
const config = require('electron-json-config')

// Dedicated Servers List
const serverIds = [
  [ "7 Days to Die", "294420" ],
  [ "ARK: Survival Evolved", "376030" ],
  [ "Arma 3", "233780" ],
  [ "Black Mesa: Deathmatch", "346680" ],
  [ "Counter-Strike: Global Offensive", "740" ],
  [ "Counter-Strike: Source", "232330" ],
  [ "Chivalry Medieval Warfare", "220070" ],
  [ "Day of Defeat: Source", "232290" ],
  [ "Dota 2", "570" ],
  [ "Don't Starve Together", "343050" ],
  [ "Fistful of Frags", "295230" ],
  [ "Garry's Mod", "4020" ],
  [ "Half-Life Deathmatch: Source", "255470" ],
  [ "Half-Life 2: Deathmatch", "232370" ],
  [ "Insurgency", "237410" ],
  [ "Just Cause 2: Multiplayer", "261140" ],
  [ "Left 4 Dead", "222840" ],
  [ "Left 4 Dead 2", "222860" ],
  [ "Natural Selection 2", "4940" ],
  [ "Rust", "258550" ],
  [ "Serious Sam 3", "41080" ],
  [ "Team Fortress 2", "232250" ],
  [ "The Ship", "2403" ],
  [ "Terraria", "105600" ],
  [ "Unturned", "304930" ],
  [ "Zombie Panic Source", "17505" ]
]

const serverTable = document.getElementById("server-list-body")






function displayAlert(title, msg, type) {
  let alertDiv = document.getElementById("alerts").innerHTML += '<div class="alert alert-' + type + '"><strong>' + title + '</strong> ' + msg + '</div>'
}

if (config.has('steamcmdloc')) {
  document.getElementById("steamcmdloc").value = config.get('steamcmdloc')
  console.log("SteamCMD location set successfully from config file!")
}
else {
  console.log("There is no configuration file present!")
  console.log("Please open the settings view and set your options there to create a new configuration file.")
  displayAlert("Warning!", 'You must set the location of SteamCMD under <a href="#" class="alert-link" data-toggle="modal" data-target="#settingsModal">Settings</a> before you use SCMDManager!', 'warning')
}


// humanFileSize function - Source: http://stackoverflow.com/a/14919494
function humanFileSize(B,i){var e=i?1e3:1024;if(Math.abs(B)<e)return B+" B";var a=i?["kB","MB","GB","TB","PB","EB","ZB","YB"]:["KiB","MiB","GiB","TiB","PiB","Ei‌​B","ZiB","YiB"],t=-1;do B/=e,++t;while(Math.abs(B)>=e&&t<a.length-1);return B.toFixed(1)+" "+a[t]}
// sec2str function - Source: http://stackoverflow.com/a/28510323
function sec2str(t){var d = Math.floor(t/86400), h = ('0'+Math.floor(t/3600) % 24).slice(-2), m = ('0'+Math.floor(t/60)%60).slice(-2), s = ('0' + t % 60).slice(-2); return (d>0?d+' d, ':'')+(h>0?h+' hr, ':'')+(m>0?m+' min, ':'')+(t>60?s:s+'s');}

let sysInfo = `${os.hostname()} (${os.platform()})`
document.getElementById("sysinfo").innerHTML = sysInfo
document.getElementById("system-info-hostname").innerHTML = sysInfo

function updateSysInfo() {
  let sysUptime = `${sec2str(os.uptime())}`
  let sysMemory = `${humanFileSize(os.freemem())} free of ${humanFileSize(os.totalmem())}`
  document.getElementById("system-info-uptime").innerHTML = sysUptime
  document.getElementById("system-info-memory").innerHTML = sysMemory
}

let downloadFile = function(url, dest, filename, cb) {

  if (!fs.exists(dest)) {
    fs.mkdir(dest)
  }

  let file = fs.createWriteStream(dest + filename)
  let request = http.get(url, function(response) {
    response.pipe(file)
    file.on('finish', function(response) {
      file.close(cb(response))
    })
  }).on('error', function(err) {
    fs.unlink(dest)
    if (cb) { cb(err.message) }
  })
}

function setSteamCMDDir(dir) {
  document.getElementById("steamcmdloc").value = dir
  console.log("Set SteamCMD directory to " + dir)
}

setInterval(updateSysInfo, 1000);
updateSysInfo();



const addServerBtn = document.getElementById("add-server-btn")
addServerBtn.addEventListener('click', function() {
  const serverAppIDList = document.getElementById("server-appid")
  for(i = 0; i < serverIds.length; i++) {
    serverAppIDList.innerHTML += '<option value="' + serverIds[i][1] + '">' + serverIds[i][0] + '</option>'
  }
})

const saveConfigBtn = document.getElementById("save-config-btn")
saveConfigBtn.addEventListener('click', function() {
  let steamcmddir = document.getElementById("steamcmdloc").value
  config.set('steamcmdloc', steamcmddir)
  console.log("SteamCMD Location set to " + steamcmdloc)
})

ipc.on('updateSteamCMDLocation', function (event, arg) {
  document.getElementById('steamcmdloc').innerHTML = `${arg}`
})



// Download platform-specific SteamCMD if needed
const downloadSteamCMDBtn = document.getElementById("download-steamcmd-link")
downloadSteamCMDBtn.addEventListener('click', function() {
  let downloadLoc = `${os.homedir()}/steamcmd/`
  if (os.platform() == "linux") {
    console.log("Downloading Linux version of SteamCMD to " + downloadLoc)
    downloadFile("https://steamcdn-a.akamaihd.net/client/installer/steamcmd_linux.tar.gz", downloadLoc, "steamcmd_linux.tar.gz", function(msg) {
      if (msg == null) {
        console.log("Download complete!")
        decompress(`${os.homedir()}/steamcmd/steamcmd_linux.tar.gz`, `${os.homedir()}/steamcmd/`, {plugins: [ decompressTargz() ]}).then(files => {
          console.log('Extracted!');
        })
        setSteamCMDDir(downloadLoc)
      }
      else {
        console.log(msg)
      }
    })
  }
  else if (os.platform() == "darwin") {
    console.log("Downloading OS X version of SteamCMD to " + downloadLoc)
    downloadFile("https://steamcdn-a.akamaihd.net/client/installer/steamcmd_osx.tar.gz", downloadLoc, "steamcmd_osx.tar.gz", function(msg) {
      if (msg == null) {
        console.log("Download complete!")
        decompress(`${os.homedir()}/steamcmd/steamcmd_osx.tar.gz`, `${os.homedir()}/steamcmd/`, {plugins: [ decompressTargz() ]}).then(files => {
          console.log('Extracted!');
        })
        setSteamCMDDir(downloadLoc)
      }
      else {
        console.log(msg)
      }
    })
  }
  else if (os.platform() == "win32") {
    console.log("Downloading Windows version of SteamCMD to " + downloadLoc)
    downloadFile("https://steamcdn-a.akamaihd.net/client/installer/steamcmd.zip", downloadLoc, "steamcmd.zip", function(msg) {
      if (msg == null) {
        console.log("Download complete!")
        decompress(`${os.homedir()}/steamcmd/steamcmd.zip`, `${os.homedir()}/steamcmd/`).then(files => {
          console.log('Extracted!');
        })
        setSteamCMDDir(downloadLoc)
      }
      else {
        console.log(msg)
      }
    })
  }
  else {
    console.log("This operating system (" + os.platform() + ") does not have a version of SteamCMD to download. Please use a compatible operating system, such as Ubuntu, Windows, or OS X, to use this tool.")
  }
})

const createServerBtn = document.getElementById("create-server-btn")
createServerBtn.addEventListener('click', function() {
  let randomServerID = Math.floor((Math.random() * 1000) +1)
  let serverName = document.getElementById("server-name").value
  let serverInstallDir = document.getElementById("server-installdir").value
  let serverAppId = document.getElementById("server-appid").value
  let serverPort = document.getElementById("server-port").value

  if(config.has('server.' + randomServerID) == false) {
    config.set('server.' + randomServerID + '.name', serverName)
    config.set('server.' + randomServerID + '.dir', serverInstallDir)
    config.set('server.' + randomServerID + '.appid', serverAppId)
    config.set('server.' + randomServerID + '.port', serverPort)

    console.log("Sending server contents to main...")

    ipc.send('create-server-window', {
      serverId: randomServerID,
      serverName: serverName,
      serverInstallDir: serverInstallDir,
      serverAppId: serverAppId,
      serverPort: serverPort
    })

    console.log("Sent!")
  }
  else {
    console.log("Error: Unable to create server with given ID. Please try again.")
  }
})

const clearSettingsBtn = document.getElementById('clear-settings-btn')
clearSettingsBtn.addEventListener('click', function() {
  config.purge()
  document.getElementById('clear-settings-text').innerHTML = "Your settings have been cleared. Please restart SCMDManager!"
})

// Load server list
if (config.has('server')) {
  let serverList = config.get('server')
  for (var srv in serverList) {
    serverTable.innerHTML += `<tr id="${srv}"><td id="${srv}-name">${srv.name}</td><td id="${srv}-appid">${srv.appid}</td><td id="${srv}-port">${srv.port}</td></tr>`
  }
}

ipc.on('add-server', function(event, arg) {
  let serverentry = `<tr id="${arg.serverId}"><td id="${arg.serverId}-name">${arg.serverName}</td><td id="${arg.serverId}-appid">${arg.serverAppId}</td><td id="${arg.serverId}-port">${arg.serverPort}</td></tr>`
  serverlist.innerHTML += serverentry
})







