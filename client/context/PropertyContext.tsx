import { createContext, ReactNode, useEffect, useState } from "react";
import { Property } from "../model/Property";
import { fetchPropertiesFromDatabase, fetchPropertyById, initializeDatabase, syncPartsWithDatabase, syncPropertiesWithDatabase, syncPropertyByIdWithDatabase } from "../database/database";
import WebSocketClient from "../utils/WebSocketClient";
import NetInfo from '@react-native-community/netinfo';
import { appendLog } from "../utils/Logger";
import Toast from "react-native-toast-message";
import { fetchProperties, PropertyFetchProps, fetchProperty, addPropertyApi, deletePropertyApi, fetchSearch } from "../network/api";


interface PropertyContextProps {
    properties: Property[];
    propertyParts: PropertyFetchProps[];
    propertyById: Property | null;
    isOffline: boolean;
    isLoading: boolean;
    loadProperties: () => Promise<void>;
    getPropertyById: (id: number) => Promise<void>;
    addProperty: (property: Property) => Promise<void>;
    deleteProperty: (id: number) => Promise<void>;
    loadSearchResults: () => Promise<void>;
}

export const PropertyContext = createContext<PropertyContextProps | undefined>(undefined);

export const PropertyProvider = ({ children }: { children: ReactNode }) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [propertyParts, setPropertyParts] = useState<PropertyFetchProps[]>([]);
    const [propertyById, setPropertyById] = useState<Property | null>(null);
    const [isOffline, setIsOffline] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleWebSocketMessage = (data: string) => {
        try {
            const property: Property = JSON.parse(data);

            Toast.show({
            type: 'info',
            text1: 'New Property Added',
            text2: `Property: ${property.address}`,
            visibilityTime: 5000,
            });

            setProperties(prev => [...prev, property]);
            syncPropertiesWithDatabase([...properties, property]);
        } catch (error) {
            appendLog('Error parsing WebSocket message');
        }
    };

    WebSocketClient({ onMessageReceived: handleWebSocketMessage });

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsOffline(!state.isConnected);
            });
        initializeDatabase();
        loadProperties();
        console.log(propertyParts)
        return () => unsubscribe();
    }, [properties, isOffline]);
    



    

    const loadProperties = async() => {
        setIsLoading(true);

        if (isOffline) {
            appendLog('Fetching properties from SQLite (offline mode)');
            const storedProperties = await fetchPropertiesFromDatabase();
            setProperties(storedProperties);
            setIsLoading(false);
            return;
        }

        try {
            appendLog('Fetching properties from API...');
            const data = await fetchProperties();
            setPropertyParts(data);
            console.log(data);
            await syncPartsWithDatabase(data);
            appendLog('Properties synced with SQLite.');
            setIsOffline(false);
        } catch (error) {
            appendLog('Error fetching properties from API, falling back to SQLite');
            Toast.show({
                type: 'error',
                text1: 'Error Fetching Properties',
                text2: error instanceof Error ? error.message : 'Unknown error occurred',
                visibilityTime: 5000,
            });
            const storedProperties = await fetchPropertiesFromDatabase();
            setProperties(storedProperties);
            setIsOffline(true);
        } finally {
            setIsLoading(false);
        }
    }

    const getPropertyById = async (id: number) => {
        if (isOffline) {
            appendLog(`Fetching property with id ${id} from SQLite (offline mode)`);
            const storedProperty = await fetchPropertyById(id);
            if (storedProperty){
                setPropertyById(storedProperty);
                setIsLoading(false);
                return;
            }
            appendLog(`Property with id ${id} not found`);
            setIsLoading(false);
            return;
        }

        try {
            appendLog(`Fetching property with id ${id} from API...`);
            const data = await fetchProperty(id);
            setPropertyById(data);
            syncPropertyByIdWithDatabase(data);
            appendLog('Property synced with SQLite.');
        } catch (error) {
            appendLog('Error fetching property from API, falling back to SQLite');
            Toast.show({
                type: 'error',
                text1: 'Error Fetching Property Details',
                text2: error instanceof Error ? error.message : 'Unknown error occurred',
                visibilityTime: 5000,
            });
            const storedProperty = await fetchPropertyById(id);
            if (storedProperty)
                setPropertyById(storedProperty);
        } finally {
            setIsLoading(false);
        }

    }

    const addProperty = async (property: Property) => {
        if (isOffline) {
            Toast.show({
                type: 'error',
                text1: 'Offline Mode',
                text2: 'You cannot add properties while offline.',
                visibilityTime: 5000,
            });
            return;
        }
    
        setIsLoading(true);
    
        try {
            appendLog('Adding property to API...');
            const newProperty = await addPropertyApi(property);
            appendLog('Property added and synced.');
            
            
        } catch (error) {
            appendLog('Error adding property');
            Toast.show({
                type: 'error',
                text1: 'Error Adding Property',
                text2: error instanceof Error ? error.message : 'Unknown error occurred',
                visibilityTime: 5000,
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const deleteProperty = async (id: number) => {
        if (isOffline) {
            Toast.show({
                type: 'error',
                text1: 'Offline Mode',
                text2: 'You cannot delete properties while offline.',
                visibilityTime: 5000,
            });
            return;
        }
    
        setIsLoading(true);
    
        try {
            appendLog(`Deleting property with id ${id} from API...`);
            await deletePropertyApi(id);
            setProperties(prev => prev.filter(prop => prop.id !== id));
            appendLog('Property deleted and removed from local state.');
            
            Toast.show({
                type: 'success',
                text1: 'Property Deleted',
                text2: `Property has been deleted successfully.`,
                visibilityTime: 5000,
            });
        } catch (error) {
            appendLog('Error deleting property');
            Toast.show({
                type: 'error',
                text1: 'Error Deleting Property',
                text2: error instanceof Error ? error.message : 'Unknown error occurred',
                visibilityTime: 5000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const loadSearchResults = async () => {
        setIsLoading(true);
        try {
            appendLog('Fetching properties for searching from API...');
            const data = await fetchSearch();
            setProperties(data);
            setIsLoading(false);
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Search Error",
                text2: error instanceof Error ? error.message : "Unable to fetch search results",
                visibilityTime: 5000,
            });
        } finally {
            setIsLoading(false);
        }
    }
    

    return (
        <PropertyContext.Provider
        value={{ properties, propertyParts, propertyById , isOffline, isLoading, loadProperties, getPropertyById, addProperty, deleteProperty, loadSearchResults }}
        >
        {children}
        </PropertyContext.Provider>
    );
}