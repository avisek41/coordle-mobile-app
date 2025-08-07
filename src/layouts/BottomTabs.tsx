import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import { Home } from '../screens/Main';
import { TabLabel } from '../components';
import { Colors } from '../configs/CustomTheme';

export type BottomTabParams = {
  Home: undefined;
  MyTrips: undefined;
  Team: undefined;
  Chat: undefined;
  Profile: undefined;
};

const BottomTab = createBottomTabNavigator<BottomTabParams>();

export default () => {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#ddd',
          paddingBottom: 6,
          height: 60,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#666',
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon name="home" color={color} size={24} />
          ),
          tabBarLabel: ({ color, focused }) => (
            <TabLabel color={color} focused={focused} text="Home" />
          ),

          tabBarStyle: {
            height: 60,
            marginTop: 20,
          },
          // tabBarActiveBackgroundColor: 'rgba(236, 117, 0, 0.1)',
        }}
      />
      <BottomTab.Screen
        name="MyTrips"
        component={Home}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon name="bag-sharp" color={color} size={24} />
          ),
          tabBarLabel: ({ color, focused }) => (
            <TabLabel color={color} focused={focused} text="My Trips" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Team"
        component={Home}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <>
              <MIcon name="group" color={color} size={30} />
            </>
          ),
          tabBarLabel: ({ color, focused }) => (
            <TabLabel color={color} focused={focused} text="Team" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Chat"
        component={Home}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon name="chatbox-ellipses" color={color} size={24} />
          ),
          tabBarLabel: ({ color, focused }) => (
            <TabLabel color={color} focused={focused} text="Chat" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={Home}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon name="person" color={color} size={24} />
          ),
          tabBarLabel: ({ color, focused }) => (
            <TabLabel color={color} focused={focused} text="Profile" />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};
