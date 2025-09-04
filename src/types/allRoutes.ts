import { RouteProp } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Document } from '@/src/services';

export type AuthStackParams = {
  Welcome: undefined;
  Login: undefined;
  OnBoarding: undefined;
  EmailVerifications: {
    email: string;
  };
  CreatePassword: undefined;
  AccountCreated: undefined;
  PhoneVerification: {
    phoneNumber: string;
    isExistingUser?: boolean;
  };
  ProfileSetup: undefined;
  ForgotPassword: undefined;
};

export type MainStackParams = {
  BottomTabs: undefined;
  ProfileOtherInfo: undefined;
  EditProfile: undefined;
  Settings: undefined;
  ChangePassword: undefined;
  Notifications: undefined;
  Documents: undefined;
  FileInformation: {
    document: Document;
  };
  CreateTrip: {
    isEditMode: boolean;
    tripId?: string;
  };
  TripDetails: {
    tripId: string;
    isPastTrip?: boolean;
  };
  TripDocuments: {
    tripId: string;
    tripTitle?: string;
  };
  AddTripMembers: {
    tripId?: string;
    ownerId: string;
  };
  InviteTripMember: {
    tripId: string;
    inviteType: 'email' | 'phone';
    ownerId: string;
  };
  TripMembers: {
    tripId: string;
    start: string;
    end: string;
    inviteType?: 'email' | 'phone';
    isOwner?: boolean;
  };
  MemberProfile: {
    userId: string;
  };
};

export type MainNavigationProps = NativeStackNavigationProp<MainStackParams>;

export type AuthNavigationProps = NativeStackNavigationProp<AuthStackParams>;

export type RootRouteProps<RouteName extends keyof AuthStackParams> = RouteProp<
  AuthStackParams,
  RouteName
>;
export type MainRouteProps<RouteName extends keyof MainStackParams> = RouteProp<
  MainStackParams,
  RouteName
>;
