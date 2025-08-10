import React from 'react';
import { SafeAreaView } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import { Header } from '@/src/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MainNavigationProps, MainRouteProps } from '@/src/types/allRoutes';
import { globalStyles } from '@/src/styles';
import { fileInformationStrings } from './strings';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/src/configs/CustomTheme';

type FileInformationRouteProps = MainRouteProps<'FileInformation'>;

const FileInformation: React.FC = () => {
  const { goBack } = useNavigation<MainNavigationProps>();
  const route = useRoute<FileInformationRouteProps>();
  const { document } = route.params;

  const handleBack = () => {
    goBack();
  };

  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(0)} KB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const getFileExtension = (fileName: string): string => {
    return fileName.split('.').pop()?.toLowerCase() || '';
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      {/* Header */}
      <Header
        title={fileInformationStrings.title}
        onBackPress={handleBack}
        showBackButton={true}
        titleStyle={{
          color: '#000',
        }}
        iconColor="#000"
      />

      {/* Content */}
      <VStack className="px-5 items-center justify-center  pt-6">
        {/* File Icon and Name */}

        <Box className="w-14 h-14 bg-primary-100 rounded-full items-center justify-center mr-4 border border-primary-500">
          <Ionicon name="document-text" size={24} color={Colors.primary} />
        </Box>
        <Text className="font-body text-lg mt-2 text-black">
          {document?.fileName || 'Document.pdf'}
        </Text>
        {/* Divider */}
        <Box className="h-px w-full bg-gray-200 mb-6 mt-4" />
      </VStack>

      {/* File Details */}
      <VStack className="px-5 ">
        <Text className="font-body text-gray-500 text-base">
          {fileInformationStrings.type}
        </Text>
        <Text className="font-body text-black text-base mt-1">
          .{getFileExtension(document?.fileName || 'Document.pdf')}
        </Text>

        <Text className="font-body text-gray-500 text-base mt-2">
          {fileInformationStrings.size}
        </Text>
        <Text className="font-body text-black text-base mt-1">
          {document?.fileSize ? formatFileSize(document.fileSize) : '345 KB'}
        </Text>

        <Text className="font-body text-gray-500 text-base mt-2">
          {fileInformationStrings.modified}
        </Text>
        <Text className="font-body text-black text-base">
          {document?.updatedAt ? formatDate(document.updatedAt) : '04/22/2023'}
        </Text>
      </VStack>
    </SafeAreaView>
  );
};

export default FileInformation;
