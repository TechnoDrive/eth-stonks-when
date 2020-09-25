console.clear();

const prompt = require('prompt-sync')({
    input: process.stdin,
    output: process.stdout
});
const {
    Kraken
} = require('node-crypto-api');

const kraken = new Kraken();
const notifier = require('node-notifier');
const chalk = require('chalk');

let targetPrice = Number(prompt(`${chalk.bold.white('What base price would you like to be alerted on (in USD)?')} ${chalk.bold.gray('(350, 200, 500, etc.)')} `));
let checkerInterval = prompt(`${chalk.bold.white('Time between intervals to check ETH\'s price ')} ${chalk.bold.gray('(500 milliseconds, 5 seconds, 1 minute, 2 hours, etc.)')} `);
// let exit = Boolean(prompt(`${chalk.bold.white('Would you like to repeat notifications?')} ${chalk.bold.gray('(More than notification after ETH hits the desired price, true or false, case sensitive)')} `))

// a huge ass time table cause why not
let timeConversionTable = {
    plural: {
        hours: 60 * 60 * 1000,
        minutes: 60 * 1000,
        seconds: 1000,
        milliseconds: 1,
    },
    singular: {
        hour: 60 * 60 * 1000,
        minute: 60 * 1000,
        second: 1000,
        millisecond: 1
    }
}

let time = checkerInterval.split(' ');
time[1] = timeConversionTable.plural[time[1]] || timeConversionTable.singular[time[1]];
time = time[0] * time[1];

if (Number.isNaN(time)) {
    console.log(chalk.red.bold('ERROR: Please enter a valid unit of time (hours, minutes, seconds, milliseconds)!')); // gives you an error bc haha noob
    process.exit(0)
}

setInterval(() => {
    kraken.ticker('ETH', 'USD')
        .then(result => {
            let currentPrice = result.result.XETHZUSD.o // gets the price of the coin, in this case ETH

            if (Math.round(currentPrice) >= targetPrice - 1) {
                notifier.notify({
                        title: `EthStonksWhen`,
                        message: `ETH has reached ${targetPrice}!`,
                        sound: true, // Only Notification Center or Windows Toasters
                        wait: true, // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
                        timeout: 10,
                        appID: 'Created by Hextanium#5890!'
                    },
                    function (err, response) {
                        err ? console.log(err) : true; // err go brrrr (windows notif related)
                    }
                );
            }
        })
        .catch(console.error); // another error go brrr (api related)
}, time)