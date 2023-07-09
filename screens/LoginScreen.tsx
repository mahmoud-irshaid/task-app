import React, { useEffect } from "react";
import { StyleSheet, View, Button, Image } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import AppLogo from '../assets/splash.png'
import { FontAwesome } from "@expo/vector-icons";

WebBrowser.maybeCompleteAuthSession();

export default function App(): JSX.Element {
    const dispatch = useDispatch();

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: "",     // missing android token
        iosClientId: "",        // missing ios token
        expoClientId: "182184500201-ks5tg0vu8rqdaimnjv9b8ii7h0059ldo.apps.googleusercontent.com",
    });

    useEffect(() => {
        handleEffect();
    }, [response]);

    // set user data in store
    async function handleEffect() {
        const user = await getLocalUser();
        if (!user) {
            if (response?.type === "success") {
                getUserInfo(response?.authentication?.accessToken);
            }
        } else {
            dispatch(setUser(user));
        }
    }

    // get local user from AsyncStorage
    const getLocalUser = async (): Promise<any | null> => {
        const data = await AsyncStorage.getItem("user");
        if (!data) return null;
        return JSON.parse(data);
    };

    // Extract user info's and set user data in store
    const getUserInfo = async (token: string | undefined) => {
        if (!token) return;
        try {
            const response = await fetch(
                "https://www.googleapis.com/userinfo/v2/me",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const user = await response.json();
            await AsyncStorage.setItem("user", JSON.stringify(user));
            dispatch(setUser(user));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={AppLogo} style={styles.logo} />
            <FontAwesome.Button name="google" size={30} borderRadius={50} disabled={!request} style={styles.button}
                onPress={() => {
                    promptAsync();
                }}>
                Sign in with Google
            </FontAwesome.Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        gap: 100,
    },
    logo: {
        width: '30%',
        height: '20%',
        marginTop: '-25%'
    },
    button: {
        paddingHorizontal: 40,
    }
});
