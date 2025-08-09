import { RouteProp } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
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
