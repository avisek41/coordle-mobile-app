import React, { useEffect, useState } from 'react';
import AuthNavigations from './AuthStack';
import MainNavigation from './MainStack';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getItem } from '../utils';
import { logIn, setCredentials } from '../features'; // make sure setCredentials updates token in Redux
import { SplashScreen } from '../screens';

const Routes = () => {
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useAppSelector(state => state?.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreAuth = async () => {
      const loginFlag = await getItem('isLoggedIn');
      const token = await getItem('accessToken'); // already parsed
      const userId = await getItem('userId'); // already parsed
      const userRole = await getItem('userRole');

      if (loginFlag === 'true' && token) {
        dispatch(setCredentials({ token, userId, userRole })); // no JSON.parse needed
        dispatch(logIn());
      }

      // Add a minimum splash screen duration
      setTimeout(() => {
        setIsLoading(false);
      }, 2000); // Show splash for 2 seconds minimum
    };

    restoreAuth();
  }, []);

  if (isLoading) {
    return <SplashScreen.SplashScreen />;
  }

  return <>{isLoggedIn ? <MainNavigation /> : <AuthNavigations />}</>;
};

export default Routes;
