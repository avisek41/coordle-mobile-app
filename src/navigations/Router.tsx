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
      const userId = await getItem('userId'); // already parsed
      const userRole = await getItem('userRole');

      console.log('loginFlag>>>', loginFlag);
      console.log('token>>>', token);
      console.log('userId>>>', userId);
      console.log('userRole>>>', userRole);

      if (loginFlag === 'true' && token) {
        dispatch(setCredentials({ token, userId, userRole })); // no JSON.parse needed
        dispatch(logIn());
      }
    };

    restoreAuth();
  }, []);

  return <>{isLoggedIn ? <MainNavigation /> : <AuthNavigations />}</>;
};

export default Routes;
