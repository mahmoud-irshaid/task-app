import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import * as ImagePicker from 'expo-image-picker';
import ProfileImg from '../assets/profile.png';
import Location from '../components/Location';
import { User, setUser } from '../store/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Updates from 'expo-updates';

const UserProfileScreen: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    // const [updateInfo, setUpdateInfo] = useState<any>(null);
    const user = useSelector((state: RootState) => state.user.user);
    const dispatch = useDispatch();

    // Note: this function to check for updates (OTA) but it is not working in the development mode yet
    // useEffect(() => { 
    //     const fetchUpdateInfo = async () => {
    //         try {
    //             const update = await Updates.checkForUpdateAsync();
    //             if (update.isAvailable) {
    //                 setUpdateInfo(update);
    //             }
    //         } catch (error) {
    //             console.log('Error checking for updates:', error);
    //         }
    //     };

    //     fetchUpdateInfo();
    // }, []);

    // Grant permissions for Gallery and Camera
    useEffect(() => {
        const grantImagePickerPermission = async () => {
            const galleryPermissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            const cameraPermissionResult = await ImagePicker.requestCameraPermissionsAsync();

            if (galleryPermissionResult.granted === false) {
                alert("You've refused to allow this app to access your photos!");
                return;
            }

            if (cameraPermissionResult.granted === false) {
                alert("You've refused to allow this app to access your camera!");
                return;
            }
        };
        grantImagePickerPermission();
    }, []);

    // handle picking image from gallery
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            await AsyncStorage.setItem("user", JSON.stringify({ ...user, picture: result.assets[0].uri }));
            const newUser: User = { ...user, picture: result.assets[0].uri } as User
            dispatch(setUser(newUser));
        }
    };

    // handle taking image by Camera
    const openCamera = async () => {
        const result = await ImagePicker.launchCameraAsync();

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            await AsyncStorage.setItem("user", JSON.stringify({ ...user, picture: result.assets[0].uri }));
            const newUser: User = { ...user, picture: result.assets[0].uri } as User
            dispatch(setUser(newUser));

        }
    };

    return (
        <ScrollView>
            {/* {updateInfo && */}
            <View style={styles.container}>
                {user?.picture || image ? (
                    <Image source={{ uri: image || user?.picture }} style={styles.image} />
                ) : (
                    <Image source={ProfileImg} style={styles.image} />
                )}
                <View style={styles.horizontalContainer}>
                    <Text onPress={pickImage} style={styles.subText}>Change Photo</Text>
                    <Text onPress={openCamera} style={styles.subText}>Take Photo</Text>
                </View>
                <Text style={styles.text}>Name: {user?.name}</Text>
                <Text style={styles.text}>Email: {user?.email}</Text>
                <Location />
            </View>
            {/* } */}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        gap: 30,
        paddingTop: 30,
    },
    horizontalContainer: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    subText: {
        fontSize: 18,
        color: '#0081f1'
    },
    text: {
        fontSize: 20,
        fontWeight: '500',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
    },
});

export default UserProfileScreen;
