import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { Input, InputField } from '@/components/ui/input';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MainNavigationProps, MainRouteProps } from '@/src/types/allRoutes';
import { ANNOUNCEMENTS_STRINGS } from '../Announcements/strings';
import { Header, GradientButton } from '@/src/components';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import { useUpdateAnnouncementMutation } from '@/src/services/announcementsApi';
import { Colors } from '@/src/configs/CustomTheme';

const EditAnnouncement = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const route = useRoute<MainRouteProps<'EditAnnouncement'>>();
  const { announcementId, message, startDate, endDate } = route.params;

  const [editedMessage, setEditedMessage] = useState(message);
  const { showToast, ToastComponent } = useSimpleToast();

  const [updateAnnouncement, { isLoading }] = useUpdateAnnouncementMutation();

  const handleSave = async () => {
    if (!editedMessage.trim()) {
      showToast({
        type: 'error',
        message: 'Please enter a message',
      });
      return;
    }

    try {
      await updateAnnouncement({
        announcementId,
        message: editedMessage.trim(),
      }).unwrap();

      showToast({
        type: 'success',
        message: ANNOUNCEMENTS_STRINGS.UPDATE_SUCCESS,
      });

      navigation.goBack();
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error?.data?.message || ANNOUNCEMENTS_STRINGS.UPDATE_ERROR,
      });
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ToastComponent />
      <VStack className="flex-1 bg-white">
        <Header
          title={ANNOUNCEMENTS_STRINGS.EDIT_ANNOUNCEMENT_TITLE}
          onBackPress={() => navigation.goBack()}
        />

        <HStack className="justify-between items-center px-4 pb-4">
          <Text className="text-sm font-body text-gray-500">
            {startDate} - {endDate}
          </Text>
        </HStack>

        <VStack className="flex-1 px-4">
          <Text className="text-lg font-heading text-gray-900 mb-3">
            {ANNOUNCEMENTS_STRINGS.ANNOUNCEMENT_MESSAGE_LABEL}
          </Text>

          <Box className="flex-1 ">
            <Input className="h-32 rounded-lg bg-gray-50">
              <InputField
                value={editedMessage}
                className="p-2"
                onChangeText={setEditedMessage}
                placeholder={ANNOUNCEMENTS_STRINGS.MESSAGE_PLACEHOLDER}
                multiline
                textAlignVertical="top"
              />
            </Input>
          </Box>
        </VStack>

        <HStack className="justify-between items-center px-4 pb-6 pt-4">
          <TouchableOpacity
            onPress={handleCancel}
            style={styles.cancelButton}
            activeOpacity={0.8}
          >
            <Text className="text-primary-500 font-heading text-base">
              {ANNOUNCEMENTS_STRINGS.CANCEL}
            </Text>
          </TouchableOpacity>

          <GradientButton
            title={ANNOUNCEMENTS_STRINGS.SAVE}
            onPress={handleSave}
            loading={isLoading}
            style={styles.saveButton}
          />
        </HStack>
      </VStack>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  cancelButton: {
    height: 48,
    width: '45%',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginTop: 20,
  },
  saveButton: {
    height: 48,
    width: '45%',
  },
});

export default EditAnnouncement;
