const {spawn} = require('child_process')
const globalConfigs = require('../../config/GlobalConfigs')

const pycam = spawn('python', [globalConfigs.mpath1.condaScriptPath+'opencvcam.py'])

pycam.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

pycam.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
});

pycam.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});

setTimeout(()=>{
    pycam.kill()
},10000)