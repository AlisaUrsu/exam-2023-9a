const appendLog = (message: string): void => {
    try {
        const timestamp: string = new Date().toISOString();
        const log: string = `${timestamp}: ${message}`;

        console.log(log);
    } catch (e) {
        console.error("Failed to log message", e);
    }
};

export {appendLog};