const readline = require('readline');
const { stdin, stdout } = require('process');
const path = require('path');
const CmdServices = require('./services/cmdServices');
const DbServices = require('./services/dbServices');
const cmdList = require('./consts/commandList');

const dbPath = path.join('db.json');
const dbServices = new DbServices(dbPath);

const cmdServices = new CmdServices(dbPath, dbServices);

const rl = readline.createInterface({ input: stdin, output: stdout });
rl.prompt();

rl.on('line', async (input) => {
  if (input === 'stop') {
    rl.close();
  } else if (input.startsWith('add')) {
    try {
      const data = input.slice(4);
      await dbServices.writeNote(data);
    } catch (err) {
      console.log(err);
    }
  } else { // в этом блоке обрабатываются команды
    const [command, ...params] = input.split(' ');
    switch (command) {
      case 'stats':
      {
        const email = params[0];
        const { stats: statsData, allWorkingHours: hoursData } = await cmdServices.stats(email);
        console.log(statsData, `\nAll working hours: ${hoursData}`);
        break;
      }

      case 'help':
        console.log(cmdList);
        break;

      default:
        console.log('Unknown command. Enter "help" to see the list of available commands');
        break;
    }
  }

  rl.prompt();
});
