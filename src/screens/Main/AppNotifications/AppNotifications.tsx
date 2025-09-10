import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { globalStyles } from '@/src/styles';
import { Header, NoData } from '@/src/components';

const AppNotifications = () => {
  return (
    <SafeAreaView style={globalStyles.container}>
      <Header title="Notifications" />
      <NoData />
    </SafeAreaView>
  );
};

export default AppNotifications;

const styles = StyleSheet.create({});
