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
import { InviteTripMember } from '../../screens/Main/InviteTripMember';
import { TripMembers } from '../../screens/Main/TripMembers';
import { MemberProfile } from '../../screens/Main/MemberProfile';
import { Announcements } from '../../screens/Main/Announcements';
import { MainStackParams } from '@/src/types/allRoutes';
import BottomTabs from '@/src/layouts/BottomTabs';
import EditAnnouncement from '@/src/screens/Main/EditAnnouncement';
import { AppNotifications } from '@/src/screens/Main/AppNotifications';
import { Poll } from '@/src/screens/Main/Poll';
import CreatePoll from '@/src/screens/Main/Poll/CreatePoll';
import ManageFoodOrder from '@/src/screens/Main/ManageFoodOrder';

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
      <Stack.Screen
        name="InviteTripMember"
        component={InviteTripMember}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TripMembers"
        component={TripMembers}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MemberProfile"
        component={MemberProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Announcements"
        component={Announcements}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditAnnouncement"
        component={EditAnnouncement}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AppNotifications"
        component={AppNotifications}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Poll"
        component={Poll}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreatePoll"
        component={CreatePoll}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManageFoodOrder"
        component={ManageFoodOrder}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
