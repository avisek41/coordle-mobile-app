/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import './global.css';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { Box } from './components/ui/box';
import { Text } from './components/ui/text';
import Routes from './src/navigations/Router';
import { NavigationContainer } from '@react-navigation/native';
import { AppContextProvider } from './src/Context';
import { ToastProvider } from '@/src/components';
import { Provider } from 'react-redux';
import { store } from './src/redux/Store';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppContextProvider>
          <GluestackUIProvider mode="light">
            <ToastProvider>
              <View style={styles.container}>
                <StatusBar
                  barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                />
                <Routes />
              </View>
            </ToastProvider>
          </GluestackUIProvider>
        </AppContextProvider>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
