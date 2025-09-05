import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MainNavigationProps, MainRouteProps } from '@/src/types/allRoutes';
import { ANNOUNCEMENTS_STRINGS } from './strings';
import { Header } from '@/src/components';
import { Colors } from '@/src/configs/CustomTheme';

const Announcements = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const route = useRoute<MainRouteProps<'Announcements'>>();
  const { tripId, tripName, startDate, endDate } = route.params;
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessage('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <VStack className="flex-1 bg-white">
        {/* Header */}
        <Header
          title={ANNOUNCEMENTS_STRINGS.TITLE}
          onBackPress={() => navigation.goBack()}
        />

        {/* Trip Info */}
        <HStack className="justify-between items-center px-4 pb-4">
          <Text className="text-lg font-heading text-gray-900">{tripName}</Text>
          <Text className="text-sm font-body text-gray-500">
            {startDate} - {endDate}
          </Text>
        </HStack>

        {/* Empty State */}
        <VStack className="flex-1 justify-center items-center px-8">
          <Ionicons name={'megaphone-outline'} size={24} color="#51B1C0" />
          <Text className="text-lg font-heading text-gray-900 mt-6 text-center">
            {ANNOUNCEMENTS_STRINGS.NO_ANNOUNCEMENT_YET}
          </Text>
          <Text className="text-sm font-body text-gray-500 mt-2 text-center leading-5">
            {ANNOUNCEMENTS_STRINGS.SHARE_ANNOUNCEMENTS}
          </Text>
        </VStack>

        {/* Message Input */}
        <HStack className="items-center px-4 py-3 border-t border-gray-200">
          <TextInput
            style={styles.messageInput}
            placeholder={ANNOUNCEMENTS_STRINGS.MESSAGE_PLACEHOLDER}
            value={message}
            onChangeText={setMessage}
            multiline
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            style={[
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled,
            ]}
            disabled={!message.trim()}
          >
            <Ionicons
              name="send"
              size={20}
              color={message.trim() ? Colors.white : '#9CA3AF'}
            />
          </TouchableOpacity>
        </HStack>
      </VStack>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
});

export default Announcements;
