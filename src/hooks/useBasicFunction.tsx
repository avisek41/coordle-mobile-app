import { logIn, logOut } from '../features';
import { setItem, removeItem } from '../utils';
import { useAppDispatch } from './index';

const useBasicFunctions = () => {
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    setItem('Login', true);
    dispatch(logIn());
  };

  const handleLogout = () => {
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
