import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Home } from '../screens/Main';
import { TabLabel } from '../components';

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
        tabBarActiveTintColor: '#ec7500',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, focused }) => <></>,
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
          tabBarIcon: ({ color, focused }) => <></>,
          tabBarLabel: ({ color, focused }) => (
            <TabLabel color={color} focused={focused} text="My Trips" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Team"
        component={Home}
        options={{
          tabBarIcon: ({ color, focused }) => <></>,
          tabBarLabel: ({ color, focused }) => (
            <TabLabel color={color} focused={focused} text="Team" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Chat"
        component={Home}
        options={{
          tabBarIcon: ({ color, focused }) => <></>,
          tabBarLabel: ({ color, focused }) => (
            <TabLabel color={color} focused={focused} text="Chat" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={Home}
        options={{
          tabBarIcon: ({ color, focused }) => <></>,
          tabBarLabel: ({ color, focused }) => (
            <TabLabel color={color} focused={focused} text="Profile" />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};
