// External Packages import
import React, { useEffect, useState } from 'react';
// Internal file import
import AuthNavigations from './AuthStack';
import MainNavigation from './MainStack';
import { useAppContext } from '../Context';

const Routes = () => {
  const { isLoggedIn } = useAppContext();
  console.log('isLoggedIn', isLoggedIn);
  return <>{isLoggedIn ? <MainNavigation /> : <AuthNavigations />}</>;
};

export default Routes;
