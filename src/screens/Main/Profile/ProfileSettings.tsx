import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text as GluestackText } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { CustomAlert } from '@/src/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/src/configs/CustomTheme';
import { profileStrings } from './strings';
import { useNavigation } from '@react-navigation/native';
import { MainNavigationProps } from '@/src/types/allRoutes';
import useBasicFunctions from '@/src/hooks/useBasicFunction';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import { removeItem } from '@/src/utils';

const ProfileSettings: React.FC = () => {
  const { navigate } = useNavigation<MainNavigationProps>();
  const { handleLogout } = useBasicFunctions();
  const { showToast, ToastComponent } = useSimpleToast();
  const [showSignOutAlert, setShowSignOutAlert] = useState(false);

  const handleSettingsPress = () => {
    navigate('Settings');
  };

  const handleDocumentsPress = () => {
    navigate('Documents');
  };

  const handleSignOut = () => {
    setShowSignOutAlert(true);
  };

  const handleSignOutConfirm = () => {
    try {
      // Clear additional storage items
      removeItem('accessToken');
      removeItem('isLoggedIn');
      removeItem('refreshToken');

      // Call logout from hook
      handleLogout();

      // Show success toast
      showToast({
        type: 'success',
        title: profileStrings.signOutSuccess,
        message: profileStrings.signOutSuccessMessage,
        duration: 2000,
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: profileStrings.signOutError,
        message: profileStrings.signOutErrorMessage,
        duration: 3000,
      });
    }
    setShowSignOutAlert(false);
  };

  const handleSignOutCancel = () => {
    setShowSignOutAlert(false);
  };

  return (
    <>
      <VStack space="lg" className="px-5">
        {/* Your Documents Section */}
        <TouchableOpacity onPress={handleDocumentsPress}>
          <Box className="bg-gray-100 rounded-xl p-4">
            <HStack className="items-center" space="md">
              <Box className="w-10 h-10 rounded-full bg-gray-200 justify-center items-center">
                <Ionicons name="folder-outline" size={20} color="#6B7280" />
              </Box>
              <VStack className="flex-1">
                <GluestackText className="text-lg font-body text-gray-800">
                  {profileStrings.yourDocuments}
                </GluestackText>
                <GluestackText className="text-sm text-gray-500">
                  {profileStrings.documentsSubtitle}
                </GluestackText>
              </VStack>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </HStack>
          </Box>
        </TouchableOpacity>

        {/* Settings Section */}
        <TouchableOpacity onPress={handleSettingsPress}>
          <Box className="bg-gray-100 rounded-xl p-4">
            <HStack className="items-center" space="md">
              <Box className="w-10 h-10 rounded-full bg-gray-200 justify-center items-center">
                <Ionicons name="settings-outline" size={20} color="#6B7280" />
              </Box>
              <VStack className="flex-1">
                <GluestackText className="text-lg font-body text-gray-800">
                  {profileStrings.settings}
                </GluestackText>
                <GluestackText className="text-sm text-gray-500">
                  {profileStrings.settingsSubtitle}
                </GluestackText>
              </VStack>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </HStack>
          </Box>
        </TouchableOpacity>

        {/* Coordle Section Header */}
        <Box className="mt-6">
          <GluestackText
            className="text-2xl font-heading"
            style={{ color: Colors.secondary }}
          >
            {profileStrings.coordle}
          </GluestackText>
        </Box>

        {/* Account Management Options */}
        <VStack space="md">
          <TouchableOpacity>
            <HStack className="items-center" space="md">
              <Box className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center">
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#6B7280"
                />
              </Box>
              <GluestackText className="flex-1 text-lg font-body text-gray-800">
                {profileStrings.about}
              </GluestackText>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </HStack>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSignOut}>
            <HStack className="items-center" space="md">
              <Box className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center">
                <Ionicons name="log-out-outline" size={20} color="#6B7280" />
              </Box>
              <GluestackText className="flex-1 text-lg font-body text-gray-800">
                {profileStrings.signOut}
              </GluestackText>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </HStack>
          </TouchableOpacity>

          <TouchableOpacity>
            <HStack className="items-center" space="md">
              <Box className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center">
                <Ionicons
                  name="person-remove-outline"
                  size={20}
                  color="#6B7280"
                />
              </Box>
              <GluestackText className="flex-1 text-lg font-body text-gray-800">
                {profileStrings.deleteAccount}
              </GluestackText>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </HStack>
          </TouchableOpacity>
        </VStack>
      </VStack>
      <ToastComponent />
      
      <CustomAlert
        isOpen={showSignOutAlert}
        title={profileStrings.signOutConfirmTitle}
        message={profileStrings.signOutConfirmMessage}
        cancelText={profileStrings.cancel}
        confirmText={profileStrings.signOut}
        onCancel={handleSignOutCancel}
        onConfirm={handleSignOutConfirm}
        isDestructive={true}
      />
    </>
  );
};

export default ProfileSettings;
