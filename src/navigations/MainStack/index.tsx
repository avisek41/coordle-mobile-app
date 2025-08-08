import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Main } from '../../screens';
import { ProfileOtherInfo } from '../../screens/Main/Profile/ProfileOtherInfo';

import { Routes } from '../NavigationUtilis';
import { MainStackParams } from '@/src/types/allRoutes';
import BottomTabs from '@/src/layouts/BottomTabs';

const Stack = createNativeStackNavigator<MainStackParams>();
const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="BottomTabs"
        component={BottomTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileOtherInfo"
        component={ProfileOtherInfo}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
