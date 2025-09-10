import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text as GluestackText } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GradientAvatar } from '@/src/components';
import { homeStrings } from './strings';
import { MainNavigationProps } from '@/src/types';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  userName: string;
  userImage: string;
}

const Header: React.FC<HeaderProps> = ({ userName, userImage }) => {
  const navigation = useNavigation<MainNavigationProps>();

  return (
    <Box className="px-5 py-4">
      <HStack className="justify-between items-center" space="md">
        {/* User Avatar */}
        <GradientAvatar
          userName={userName}
          userImage={userImage}
          size="medium"
        />

        {/* User Greeting */}
        <VStack className="flex-1 ml-3">
          <GluestackText className="text-lg font-heading text-gray-800">
            {userName}
          </GluestackText>
          <GluestackText className="text-sm text-gray-600">
            {homeStrings.welcomeMessage}
          </GluestackText>
        </VStack>

        {/* Notifications Icon */}
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate('AppNotifications')}
        >
          <Ionicons name="notifications-outline" size={21} color="#333" />
        </TouchableOpacity>
      </HStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  notificationButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
    borderRadius: 30,
    padding: 10,
    backgroundColor: 'white',
  },
});

export default Header;
