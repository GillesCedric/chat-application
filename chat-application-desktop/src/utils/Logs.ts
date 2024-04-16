enum LogLevel {
	INFO,
	WARNING,
	ERROR
}

class Logger {
	logLevel: LogLevel;

	constructor(logLevel: LogLevel = LogLevel.INFO) {
		this.logLevel = logLevel;
	}

	log(message: string, logLevel: LogLevel = LogLevel.INFO) {
		if (logLevel >= this.logLevel) {
			const timestamp = new Date().toISOString();
			let logText = `[${timestamp}] `;
			switch (logLevel) {
				case LogLevel.INFO:
					logText += `[INFO] ${message}`;
					break;
				case LogLevel.WARNING:
					logText += `[WARNING] ${message}`;
					break;
				case LogLevel.ERROR:
					logText += `[ERROR] ${message}`;
					break;
				default:
					logText += message;
			}
			this.addToStorage(logText);
		}
	}

	addToStorage(logText: string) {
		const logs = JSON.parse(localStorage.getItem('logs') || '[]');
		logs.push(logText);
		localStorage.setItem('logs', JSON.stringify(logs));
	}

	getLogs(): string[] {
		return JSON.parse(localStorage.getItem('logs') || '[]');
	}

	clearLogs() {
		const logs = this.getLogs().filter(log => {
			const logTimestamp = new Date(log.slice(1, 25)); // Extract timestamp from log text
			const currentTime = new Date();
			const timeDifference = currentTime.getTime() - logTimestamp.getTime();
			const oneMinuteInMillis = 60000; // One minute in milliseconds
			return timeDifference <= oneMinuteInMillis;
		});
		localStorage.setItem('logs', JSON.stringify(logs));
	}
}

export { Logger, LogLevel };
