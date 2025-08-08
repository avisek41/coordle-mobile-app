import React from 'react';
import { Header } from '@/src/components';
import { profileOtherInfoStrings } from '@/src/screens/Main/Profile/ProfileOtherInfo/strings';

const ProfileOtherInfoHeader: React.FC = () => {
  return <Header title={profileOtherInfoStrings.title} showBackButton={true} />;
};

export default ProfileOtherInfoHeader;
