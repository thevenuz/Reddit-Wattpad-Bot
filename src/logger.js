const {createLogger, transports, transport, format} = require('winston')
require('winston-daily-rotate-file');
var path = require('path');

try{
    const logger = createLogger({
        format: format.combine(
            format.timestamp(),
            format.json()
        ),
        level: 'debug',
        transports: [
            new transports.DailyRotateFile({
                filename: path.join(__dirname, '../logs/log-%DATE%.log.txt'),
                datePattern: 'YYYY-MM-DD-HH',
                zippedArchive: true,
                maxSize: '200kb',
                maxFiles: '14d'
            })
        ]
    });
    
    module.exports = logger;
}
catch(ex){
    throw new Error(ex);
}
