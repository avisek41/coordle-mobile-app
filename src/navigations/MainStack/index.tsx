import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Main } from '../../screens';
import { ProfileOtherInfo } from '../../screens/Main/Profile/ProfileOtherInfo';
import EditProfile from '../../screens/Main/Profile/EditProfile';
import {
  Settings,
  ChangePassword,
  Notifications,
} from '../../screens/Main/Settings';
import Documents from '../../screens/Main/Documents';
import FileInformation from '../../screens/Main/Documents/FileInformation';
import { CreateTrip } from '../../screens/Main/CreateTrip';
import TripDetails from '../../screens/Main/TripDetails';
import TripDocuments from '../../screens/Main/TripDocuments';
import { AddTripMembers } from '../../screens/Main/AddTripMembers';

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
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Documents"
        component={Documents}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FileInformation"
        component={FileInformation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateTrip"
        component={CreateTrip}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TripDetails"
        component={TripDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TripDocuments"
        component={TripDocuments}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddTripMembers"
        component={AddTripMembers}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
