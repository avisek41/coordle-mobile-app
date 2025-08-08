import React from 'react';
import { SafeAreaView } from 'react-native';
import { Box } from '@/components/ui/box';
import { globalStyles } from '@/src/styles';

import Header from './Header';
import FloatingActionButton from './FloatingActionButton';

const Chat = () => {
  return (
    <SafeAreaView style={globalStyles.container}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <Box className="flex-1 px-5 pt-3">
        {/* Empty Chat Area */}
        <Box className="flex-1 bg-white rounded-xl">
          {/* Content will be added here when there are chats */}
        </Box>
      </Box>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </SafeAreaView>
  );
};

export default Chat;
