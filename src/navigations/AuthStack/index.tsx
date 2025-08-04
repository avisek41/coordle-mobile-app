import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { Auth } from '../../screens';
import { Routes } from '../NavigationUtilis';
import { AuthStackParams } from '@/src/types/allRoutes';

const Stack = createNativeStackNavigator<AuthStackParams>();
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={Routes.Welcome}
    >
      <Stack.Screen name={Routes.Welcome} component={Auth.Welcome} />
      <Stack.Screen name={Routes.Login} component={Auth.Login} />
      <Stack.Screen
        name={Routes.EmailVerifications}
        component={Auth.EmailVerifications}
      />
      <Stack.Screen
        name={Routes.CreatePassword}
        component={Auth.CreatePassword}
      />
      <Stack.Screen
        name={Routes.AccountCreated}
        component={Auth.AccountCreated}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
