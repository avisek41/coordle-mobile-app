import React from 'react';
import {
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Text as GluestackText } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { globalStyles } from '@/src/styles';
import { profileStrings } from '@/src/screens/Main/Profile/strings';
import { images } from '@/src/assets';
import Header from '@/src/screens/Main/Profile/Header';
import ProfileCard from '@/src/screens/Main/Profile/ProfileCard';
import ProfileSettings from '@/src/screens/Main/Profile/ProfileSettings';

const Profile = () => {
  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Image with Curve */}
        <Box className="relative">
          <Image
            source={images.cover}
            style={{
              width: '100%',
              height: 170,
              resizeMode: 'cover',
              borderBottomLeftRadius: 40,
              borderBottomRightRadius: 40,
            }}
          />
          <Box />

          {/* Header Overlay */}
          <Box className="absolute top-0 left-0 right-0">
            <Header />
          </Box>
          <Box className="px-4 pt-2">
            <ProfileCard />
          </Box>
        </Box>
        {/* Profile Settings */}
        <Box className=" px-2 pt-8">
          <ProfileSettings />
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#51B1C0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#51B1C0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  editIcon: {
    fontSize: 12,
  },
});

export default Profile;
