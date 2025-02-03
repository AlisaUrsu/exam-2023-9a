import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { initializeDatabase } from './database/database';
import { PropertyProvider } from './context/PropertyContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PropertiesListScreen from './screens/PropertiesListScreen';
import PropertyDetailsScreen from './screens/PropertyDetailsScreen';
import Toast from 'react-native-toast-message';
import AddPropertyScreen from './screens/AddPropertyScreen';
import SearchPropertiesScreen from './screens/SearchPropertiesScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isDatabaseReady, setDatabaseReady] = useState(false);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initializeDatabase(); 
        setDatabaseReady(true); 
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };
  
    setupDatabase();
  }, []);
  
  if (!isDatabaseReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#362D52" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (

      <PropertyProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="PropertiesListScreen"
            screenOptions={{
              headerStyle: { backgroundColor: '#362D52' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          >
            <Stack.Screen
              name="PropertiesListScreen"
              component={PropertiesListScreen}
              options={{ title: 'Properties' }}
            />
          <Stack.Screen
            name="PropertyDetailsScreen"
            component={PropertyDetailsScreen}
            options={{ title: 'Property Details' }}
          />
          <Stack.Screen
            name="AddPropertyScreen"
            component={AddPropertyScreen}
            options={{ title: 'New Property' }}
          />
          <Stack.Screen
            name="SearchPropertiesScreen"
            component={SearchPropertiesScreen}
            options={{ title: 'Search Properties' }}
          />
          </Stack.Navigator>
          <Toast/>
        </NavigationContainer>
      </PropertyProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#362D52',
  },
});

