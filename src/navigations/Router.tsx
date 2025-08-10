// External Packages import
import React, { useEffect, useState } from 'react';
// Internal file import
import AuthNavigations from './AuthStack';
import MainNavigation from './MainStack';
import { useAppContext } from '../Context';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getItem } from '../utils';
import { logIn } from '../features';

const Routes = () => {
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useAppSelector(state => state?.auth);
  const authCheck = getItem('Login');
  console.log('authCheck', authCheck);
  React.useEffect(() => {
    if (authCheck) {
      dispatch(logIn());
    } else {
    }
  }, [authCheck]);

  return <>{isLoggedIn ? <MainNavigation /> : <AuthNavigations />}</>;
};

export default Routes;
