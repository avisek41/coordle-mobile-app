import React, { useEffect } from 'react';
import AuthNavigations from './AuthStack';
import MainNavigation from './MainStack';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getItem } from '../utils';
import { logIn, setCredentials } from '../features'; // make sure setCredentials updates token in Redux

const Routes = () => {
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useAppSelector(state => state?.auth);

  useEffect(() => {
    const restoreAuth = async () => {
      const loginFlag = await getItem('isLoggedIn');
      const token = await getItem('accessToken'); // already parsed

      if (loginFlag === 'true' && token) {
        dispatch(setCredentials({ token })); // no JSON.parse needed
        dispatch(logIn());
      }
    };

    restoreAuth();
  }, []);

  return <>{isLoggedIn ? <MainNavigation /> : <AuthNavigations />}</>;
};

export default Routes;
