import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('@/src/assets/Images/splash.png')}
        style={styles.splashImage}
        resizeMode="cover"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  splashImage: {
    width: '100%',
    height: '100%',
  },
});

export default SplashScreen;
