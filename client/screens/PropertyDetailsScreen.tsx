import React, { useEffect, useContext } from "react";
import { PropertyContext } from "../context/PropertyContext";
import { View, Text, StyleSheet, ActivityIndicator, Button, ScrollView } from "react-native";

const PropertyDetailsScreen = ({ route }: { route: any }) => {
    const { id } = route.params;
    const context = useContext(PropertyContext);

    if (!context) {
        throw new Error('PropertyContext must be used within a PropertyProvider');
    }

    const { propertyById, isLoading, getPropertyById } = context;

    useEffect(() => {
        // Fetch property details based on the ID passed via the route
        getPropertyById(id);
    }, []);

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading Property Details...</Text>
            </View>
        );
    }

    if (!propertyById) {
        return (
            <View style={styles.centered}>
                <Text>Property not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.propertyDetails}>
                <Text style={styles.propertyTitle}>{propertyById.address}</Text>
                <Text style={styles.propertyText}>Date: {propertyById.date}</Text>
                <Text style={styles.propertyText}>Type: {propertyById.type}</Text>
                <Text style={styles.propertyText}>Bedrooms: {propertyById.bedrooms}</Text>
                <Text style={styles.propertyText}>Bathrooms: {propertyById.bathrooms}</Text>
                <Text style={styles.propertyText}>Price: ${propertyById.price}</Text>
                <Text style={styles.propertyText}>Area: {propertyById.area} m^2</Text>
                <Text style={styles.propertyText}>Notes: {propertyById.notes}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    centered: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    propertyDetails: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    propertyTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    propertyText: {
        fontSize: 18,
        marginBottom: 8,
    },
});

export default PropertyDetailsScreen;
