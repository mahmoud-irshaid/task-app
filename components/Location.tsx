import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

export default function App(): JSX.Element {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);

    // grant location permission and get user location
    const grantLocationPermission = async (): Promise<void> => {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            alert("You've refused to allow this app to access your photos!");
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
    };

    useEffect(() => {
        grantLocationPermission();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>
                {location ? (
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: location?.coords?.latitude || 0,
                            longitude: location?.coords?.longitude || 0,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    >
                        <Marker
                            key={1}
                            coordinate={{
                                latitude: location?.coords?.latitude || 0,
                                longitude: location?.coords?.longitude || 0,
                            }}
                        />
                    </MapView>
                ) : (
                    <Text style={styles.text}>Your current Physical Location is not available</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    paragraph: {
        fontSize: 18,
        textAlign: 'center',
    },
    mapContainer: {
        width: Dimensions.get('window').width,
        height: 250,
    },
    map: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    text: {
        textAlign: 'center',
        paddingTop: 50,
    },
});
