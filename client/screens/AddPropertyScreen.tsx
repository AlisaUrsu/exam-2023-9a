import React, { useContext, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from "react-native";
import { PropertyContext } from "../context/PropertyContext";
import { Property } from "../model/Property";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

const AddPropertyScreen = () => {
    const context = useContext(PropertyContext);
    const navigation = useNavigation();

    if (!context) {
        throw new Error("PropertyContext must be used within a PropertyProvider");
    }

    const { addProperty } = context;

    // Get today's date
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD format

    // State for form inputs
    const [address, setAddress] = useState("");
    const [type, setType] = useState("");
    const [bedrooms, setBedrooms] = useState("");
    const [bathrooms, setBathrooms] = useState("");
    const [price, setPrice] = useState("");
    const [area, setArea] = useState("");
    const [notes, setNotes] = useState("");

    const handleSubmit = async () => {
        if (!address || !type || !bedrooms || !bathrooms || !price || !area) {
            Alert.alert("Validation Error", "Please fill in all required fields.");
            return;
        }

        const newProperty: Property = {
            id: Math.floor(Math.random() * 10000), // Temporary ID (API should assign real ID)
            address,
            type,
            bedrooms: parseInt(bedrooms, 10),
            bathrooms: parseInt(bathrooms, 10),
            price: parseFloat(price),
            area: parseFloat(area),
            notes,
            date: formattedDate, // Fixed to today's date
        };

        await addProperty(newProperty);

        // Navigate back to property list after adding
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Add New Property</Text>

            <Text style={styles.label}>Address</Text>
            <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Enter address" />

            <Text style={styles.label}>Type</Text>
            <TextInput style={styles.input} value={type} onChangeText={setType} placeholder="Enter property type" />

            <Text style={styles.label}>Bedrooms</Text>
            <TextInput style={styles.input} value={bedrooms} onChangeText={setBedrooms} placeholder="Enter bedrooms" keyboardType="numeric" />

            <Text style={styles.label}>Bathrooms</Text>
            <TextInput style={styles.input} value={bathrooms} onChangeText={setBathrooms} placeholder="Enter bathrooms" keyboardType="numeric" />

            <Text style={styles.label}>Price ($)</Text>
            <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="Enter price" keyboardType="numeric" />

            <Text style={styles.label}>Area (m²)</Text>
            <TextInput style={styles.input} value={area} onChangeText={setArea} placeholder="Enter area" keyboardType="numeric" />

            <Text style={styles.label}>Notes</Text>
            <TextInput style={styles.input} value={notes} onChangeText={setNotes} placeholder="Enter notes" multiline />

            <Text style={styles.fixedDate}>Date: {formattedDate} (Auto-filled)</Text>

            <Button title="Add Property" onPress={handleSubmit} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 5,
    },
    input: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    fixedDate: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 10,
    },
});

export default AddPropertyScreen;
