import React, { useState, useEffect, FC } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface LoggerProps {
	customMessageCallback?: () => string;
}

const Logger: FC<LoggerProps> = ({ customMessageCallback }) => {
	const [logs, setLogs] = useState<{ id: string; message: string }[]>([]);

	const logMessage = (message: string) => {
		const timestamp = new Date().toLocaleString();
		const newLog = { id: uuidv4(), message: `${timestamp}: ${message}` };

		// Vérifier si un message avec le même contenu existe déjà dans les logs
		const existingMessage = logs.find(log => log.message === newLog.message);
		if (!existingMessage) {
			setLogs((prevLogs) => [...prevLogs, newLog]);
		}
	};

	useEffect(() => {
		if (customMessageCallback) {
			const customMessage = customMessageCallback();
			logMessage(customMessage);
		}
	}, [customMessageCallback, logs]);

	return (
		<div>
			<div>
				<ul>
					{logs.map((log) => (
						<li key={log.id}>{log.message}</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default Logger;
