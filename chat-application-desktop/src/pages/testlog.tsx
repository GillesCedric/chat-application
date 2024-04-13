import React from 'react';
import Logger from '../components/logfront';

const LoggingPage = () => {
	return (
		<div>
			<h1>Logs Page</h1>
			<Logger customMessageCallback={() => "Message personnalisé 1 depuis LoggingPage."} />
			<Logger customMessageCallback={() => "Message personnalisé 2 depuis LoggingPage."} />
			<Logger customMessageCallback={() => "Message personnalisé 3 depuis LoggingPage."} />
		</div>
	);
};

export default LoggingPage;
