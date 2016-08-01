const ipc = require('electron').ipcRenderer
const os = require('os')
var spawn = require('child_process').exec;
const config = require('electron-json-config')

let serverdata

ipc.on('set-install-contents', function (event, arg) {
  serverdata = arg
  console.log("Received server parameters")
  document.getElementById('servername').innerHTML = arg.serverName
  let serverInstallStdout = document.getElementById('server-install-output')
  let steamcmdLocation = config.get('steamcmdloc')
  let steamcmdExec
  if (os.platform() == "win32"){ steamcmdExec = "steamcmd.exe" } else { steamcmdExec = "steamcmd.sh" }
  let steamcmd = `${steamcmdLocation + steamcmdExec} +login anonymous +force_install_dir ${arg.serverInstallDir} +app_update ${arg.serverAppId} validate +quit`
  console.log(`Running SteamCMD installation command: ${steamcmd}`)
  let installprocess = spawn(steamcmd, [])

  installprocess.stdout.on('data', function(chunk) {
    serverInstallStdout.innerHTML += chunk
    console.log(chunk)
  })

  installprocess.on('close', function(exitCode) {
    console.log("Server installation process has finished with exit code " + exitCode)
    serverInstallStdout.innerHTML += "Server installation complete! You may now close this window."
    document.getElementById("loading-spinner").style.display = "none"
    document.getElementById("server-install-complete-text").innerHTML = "Server installation complete! You may now close this window."

    ipc.send('add-server-to-list', serverdata)
  })
})