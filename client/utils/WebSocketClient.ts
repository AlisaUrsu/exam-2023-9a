import { useEffect, useState } from "react";
import { WS_URL } from "../endpoints";

interface WebSocketClientProps {
    onMessageReceived?: (message: string) => void;
}

const WebSocketClient = ({ onMessageReceived }: WebSocketClientProps) => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        const newWs = new WebSocket(WS_URL);

        newWs.onopen = () => {
            setIsConnected(true);
        };

        newWs.onmessage = (e: MessageEvent) => {
            if (onMessageReceived) {
                onMessageReceived(e.data);
            }
        };

        newWs.onclose = () => {
            setIsConnected(false);
        };

        newWs.onerror = (error: Event) => {
            console.error('WebSocket error:', error);
        };

        setWs(newWs);

        return () => {
            if (newWs) {
                newWs.close();
            }
        };
    }, []);
    
    return { isConnected };
}

export default WebSocketClient;