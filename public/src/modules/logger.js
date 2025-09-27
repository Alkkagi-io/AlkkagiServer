const EColors = {
    ERROR: '\x1b[31m', // red
    WARN: '\x1b[33m',  // yellow
    INFO: '\x1b[36m',  // turquoise
    DEBUG: '\x1b[90m', // gray
    RESET: '\x1b[0m'   // reset
};

const ELogLevel = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
};

const ELogMode = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    MASTER: 'master',
}

const ELevelOfMode = {
    [ELogMode.DEVELOPMENT]: ELogLevel.DEBUG,
    [ELogMode.PRODUCTION]: ELogLevel.INFO,
    [ELogMode.MASTER]: ELogLevel.ERROR,
}

class Logger {
    constructor() {
        this.currentLevel = ELevelOfMode[ELogMode.DEVELOPMENT];
    }

    setMode(mode) {
        if (ELevelOfMode.hasOwnProperty(mode) === false)
            return;

        this.currentLevel = ELevelOfMode[mode];
    }

    getTimestamp() {
        return new Date().toISOString();
    }

    formatMessage(level, category, message) {
        const timestamp = this.getTimestamp();
        const color = EColors[level] || '';
        const reset = EColors.RESET;
        
        let formattedMessage = `${color}[${timestamp}] [${level}] [${category}] ${message}${reset}`;
        return formattedMessage;
    }

    log(level, category, message) {
        if (ELogLevel[level] > this.currentLevel) 
            return;
    
        console.log(this.formatMessage(level, category, message));
    }

    error(category, message) {
        this.log('ERROR', category, message);
    }

    warn(category, message) {
        this.log('WARN', category, message);
    }

    info(category, message) {
        this.log('INFO', category, message);
    }

    debug(category, message) {
        this.log('DEBUG', category, message);
    }
}

// singleton
const logger = new Logger();
export { ELogLevel, ELogMode, logger };
