import React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Text as GluestackText } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { homeStrings } from './strings';

interface HeaderProps {
  userName: string;
  userImage: string;
}

const Header: React.FC<HeaderProps> = ({ userName, userImage }) => {
  return (
    <Box className="px-5 py-4">
      <HStack className="justify-between items-center" space="md">
        {/* User Avatar */}
        {userImage ? (
          <Image
            source={{ uri: userImage }}
            style={styles.avatarGradient}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <LinearGradient
            colors={['#2E6F9E', '#51B1C0']}
            style={styles.avatarGradient}
          >
            <GluestackText size="lg" className="text-white font-heading">
              {userName.charAt(0).toUpperCase()}
            </GluestackText>
          </LinearGradient>
        )}

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
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={21} color="#333" />
        </TouchableOpacity>
      </HStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  avatarGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
