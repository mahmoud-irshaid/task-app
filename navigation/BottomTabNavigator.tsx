import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Entypo, FontAwesome, Ionicons } from '@expo/vector-icons';
import RepoListScreen from '../screens/RepoListScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';

const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC = () => {
    const dispatch = useDispatch();

    const handleLogout = async () => {
        await AsyncStorage.removeItem('user');
        dispatch(setUser(null));
    }

    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName: any;

                        if (route.name === 'Repositories') {
                            iconName = 'list-outline';
                        } else if (route.name === 'User Profile') {
                            iconName = 'person-outline';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    headerRight: () => (
                        <Entypo.Button name='log-out' onPress={handleLogout}>
                            logout
                        </Entypo.Button>
                    ),
                    headerRightContainerStyle: { marginRight: 16 },
                })}
                backBehavior='history'
            >
                <Tab.Screen name="Repositories" component={RepoListScreen} />
                <Tab.Screen name="User Profile" component={UserProfileScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default BottomTabNavigator;
