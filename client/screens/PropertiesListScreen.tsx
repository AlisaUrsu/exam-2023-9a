import { useContext, useEffect } from "react";
import { PropertyContext } from "../context/PropertyContext";
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

const PropertiesListScreen = ({ navigation }: { navigation: any }) => {
    const context = useContext(PropertyContext);

    if (!context) {
      throw new Error('PropertyContext must be used within a PropertyProvider');
    }

    const {propertyParts, isOffline, isLoading, loadProperties, deleteProperty} = context;


    const renderProperty = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate('PropertyDetailsScreen', { id: item.id })}
        >
            <Text style={styles.addressText}>{item.address}</Text>
            <TouchableOpacity
                style={[styles.deleteButton, isOffline && styles.disabledButton]}
                onPress={() => deleteProperty(item.id)}
                disabled={isOffline}
            >
                <Text style={[styles.deleteButtonText, isOffline && styles.disabledButtonText]}>Delete</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const handleRetry = () => {
        loadProperties();  // Trigger the function to retry loading properties
    };

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
        {isOffline? (
            <View style={styles.offlineContainer}>
                <Text style={styles.offlineText}>You are offline</Text>
                <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        ) : (
            <>
                <TouchableOpacity
                    style={[styles.searchButton, isOffline && styles.disabledButton]}
                    onPress={() => navigation.navigate('SearchPropertiesScreen')}
                    disabled={isOffline}
                >
                    <Text style={[styles.searchButtonText, isOffline && styles.disabledButtonText]}>Search Properties</Text>
                </TouchableOpacity>

                <FlatList
                    data={propertyParts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderProperty}
                    contentContainerStyle={styles.listContainer}
                />

                <TouchableOpacity
                    style={[styles.addButton, isOffline && styles.disabledButton]}
                    onPress={() => navigation.navigate('AddPropertyScreen')}
                    disabled={isOffline}
                >
                    <Text style={[styles.addButtonText, isOffline && styles.disabledButtonText]}>Add New Property</Text>
                </TouchableOpacity>
                <Toast />
            </>
        )}
    </View>
);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    itemContainer: {
        backgroundColor: '#ffffff',
        padding: 15,
        marginVertical: 6,
        marginHorizontal: 16,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    addressText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    offlineContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    offlineText: {
        fontSize: 18,
        marginBottom: 10,
    },
    retryButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    listContainer: {
        paddingBottom: 20,
    },
    addButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        margin: 16,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    deleteButton: {
        backgroundColor: 'red',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginTop: 10,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#999',
        opacity: 0.7,
    },
    disabledButtonText: {
        color: '#666',
    },
    searchButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        margin: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
});

export default PropertiesListScreen;
