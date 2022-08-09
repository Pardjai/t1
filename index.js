'use strict'

const readline = require('readline');
const { stdin: input, stdout: output } = require('process')
const cmdServices = require('./services/cmd-services')
const dbServices = require('./services/db-services')
const cmdList = require('./consts/command-list')

const rl = readline.createInterface({ input, output });
rl.prompt(1)

rl.on('line', async (line) => {
    if (line === 'stop') {
        rl.close()
    } else if (line.startsWith('{')) { // в этом блоке обрабатываются входящие JSON
        try {
            await dbServices.writeNote(line)   
        } catch (err) {
            console.log(err);
        }
        rl.prompt(1)
    } else { // в этом блоке обрабатываются команды
        const [command, ...params] = line.split(' ')
        switch (command) {
            case 'stats':
                const email = params[0]
                const statsData = await cmdServices.calculateDaysCount(email)
                const hoursData = await cmdServices.calculateAllWorkingHours(email)
                console.log(statsData, `\nAll working hours: ${hoursData}`);
                break;

            case 'help':
                console.log(cmdList)
                break;

            default:
                console.log('Unknown command. Enter "help" to see the list of available commands');
                break;
        }

        rl.prompt(1)
    }
})

