const {createLogger, transports, transport} = require('winston');
var path = require('path');

const logger = createLogger({
    level: 'info',
    transports: [
        new transports.File({
            filename: path.join(__dirname, '../logs/log.txt'),
            maxsize: '900kb'
        })
    ]
});

module.exports = logger;