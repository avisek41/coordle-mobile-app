import { logIn, logOut } from '../features';
import { apiSlice } from '../services';
import { setItem, removeItem } from '../utils';
import { useAppDispatch } from './index';

const useBasicFunctions = () => {
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    setItem('Login', true);
    dispatch(logIn());
  };

  const handleLogout = () => {
    dispatch(apiSlice.util.resetApiState());
    setItem('Login', false);
    removeItem('userId');
    dispatch(logOut());
  };
  return {
    handleLogin,
    handleLogout,
  };
};

export default useBasicFunctions;
