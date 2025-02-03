import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import { PropertyContext } from "../context/PropertyContext";
import { Property } from "../model/Property";

const SearchPropertiesScreen = ({ navigation }: { navigation: any }) => {
    const context = useContext(PropertyContext);
    
    if (!context) {
        throw new Error('PropertyContext must be used within a PropertyProvider');
    }

    const {properties, loadSearchResults} = context;
    const [type, setType] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [bedrooms, setBedrooms] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
    useEffect(() => {
        setFilteredProperties(properties);
    }, [properties]);

    useEffect(() => {
        loadSearchResults();
    }, []);

    const applyFilters = () => {
        let results = properties;

        if (type) {
            results = results.filter(property => property.type.toLowerCase().includes(type.toLowerCase()));
        }
        if (minPrice) {
            results = results.filter(property => property.price >= parseFloat(minPrice));
        }
        if (maxPrice) {
            results = results.filter(property => property.price <= parseFloat(maxPrice));
        }
        if (bedrooms) {
            results = results.filter(property => property.bedrooms === parseInt(bedrooms, 10));
        }

        // Sort results: descending by date, ascending by price
        results.sort((a, b) => {
            const dateA = new Date(a.date); // Ensure a.date is a Date object
            const dateB = new Date(b.date); // Ensure b.date is a Date object
        
            if (dateB.getTime() !== dateA.getTime()) {
                return dateB.getTime() - dateA.getTime();
            }
        
            // If the dates are the same, sort by price ascending (lowest first)
            return a.price - b.price;
        });

        setFilteredProperties(results);
    };

    const renderProperty = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.propertyItem}
            onPress={() => navigation.navigate("PropertyDetailsScreen", { id: item.id })}
        >
            <Text style={styles.propertyTitle}>{item.address}</Text>
            <Text>{`Price: $${item.price}, Bedrooms: ${item.bedrooms}, Date: ${item.date}`}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder="Property Type" value={type} onChangeText={setType} />
            <TextInput style={styles.input} placeholder="Min Price" keyboardType="numeric" value={minPrice} onChangeText={setMinPrice} />
            <TextInput style={styles.input} placeholder="Max Price" keyboardType="numeric" value={maxPrice} onChangeText={setMaxPrice} />
            <TextInput style={styles.input} placeholder="Bedrooms" keyboardType="numeric" value={bedrooms} onChangeText={setBedrooms} />
            
            <TouchableOpacity style={styles.searchButton} onPress={applyFilters}>
                <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
            
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList data={filteredProperties} keyExtractor={(item) => item.id.toString()} renderItem={renderProperty} />
            )}
            
            <Toast />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    searchButton: {
        backgroundColor: "#007AFF",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 20,
    },
    searchButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    propertyItem: {
        backgroundColor: "#ffffff",
        padding: 15,
        marginVertical: 6,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    propertyTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default SearchPropertiesScreen;
