import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/index';
import BottomTabNavigator from '../navigation/BottomTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from '../store/userSlice';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const Login: React.FC = () => {
    const [loader, setLoader] = useState<boolean>(false);
    const user = useSelector((state: RootState) => state.user.user);
    const dispatch = useDispatch();

    useEffect(() => {
        checkLoginStatus();
    }, []);

    // check if user found in AsyncStorage then place it in Store
    const checkLoginStatus = useCallback(
        async () => {
            try {
                setLoader(true);
                let isUser = await AsyncStorage.getItem('user');
                if (isUser) dispatch(setUser(JSON.parse(isUser)));
                setLoader(false);
            } catch (error) {
                console.log('AsyncStorage error:', error);
                setLoader(false);
            }
        }, []
    );

    return (
        <>
            {loader ? (
                <View style={styles.container}>
                    <ActivityIndicator size='large' color='#0081f1' />
                </View>
            ) : (
                <>
                    {user ? <BottomTabNavigator /> : <LoginScreen />}
                </>
            )}
        </>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});
