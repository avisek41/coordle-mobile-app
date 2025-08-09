import React, { useState } from 'react';
import { SafeAreaView, Alert } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { GradientButton, Header, Loader } from '@/src/components';
import { useNavigation } from '@react-navigation/native';
import { MainNavigationProps } from '@/src/types/allRoutes';
import { globalStyles } from '@/src/styles';
import { documentsStrings } from './strings';
import NoData from './NoData';
import SearchField from './SearchField';
import FilterButton from './FilterButton';
import { Box } from '@/components/ui/box';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import { useUploadDocumentMutation } from '@/src/services';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';

const Documents: React.FC = () => {
  const { goBack } = useNavigation<MainNavigationProps>();
  const [searchText, setSearchText] = useState('');
  const [documents, setDocuments] = useState<any[]>([]); // Empty array means no documents
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentPickerResponse | null>(null);
  const [uploadDocument, { isLoading: isUploading }] =
    useUploadDocumentMutation();
  const { showToast, ToastComponent } = useSimpleToast();

  const handleBack = () => {
    goBack();
  };

  const handleUploadDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.images,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
        ],
        allowMultiSelection: false,
      });

      if (result && result.length > 0) {
        const document = result[0];

        // Check file size (3MB limit)
        const maxSizeInBytes = 3 * 1024 * 1024; // 3MB
        if (document.size && document.size > maxSizeInBytes) {
          showToast({
            type: 'error',
            title: documentsStrings.fileTooLarge,
            message: documentsStrings.fileTooLargeMessage,
            duration: 3000,
          });
          return;
        }

        setSelectedDocument(document);

        // Automatically upload the selected document
        await uploadSelectedDocument(document);
      }
    } catch (error: any) {
      if (DocumentPicker.isCancel(error)) {
        // User cancelled the picker
        console.log('User cancelled document picker');
      } else {
        showToast({
          type: 'error',
          title: documentsStrings.uploadError,
          message: documentsStrings.uploadErrorMessage,
          duration: 3000,
        });
      }
    }
  };

  const uploadSelectedDocument = async (document: DocumentPickerResponse) => {
    try {
      const formData = new FormData();
      formData.append('document', {
        uri: document.uri,
        type: document.type,
        name: document.name,
      } as any);

      const response = await uploadDocument(formData).unwrap();

      showToast({
        type: 'success',
        title: documentsStrings.uploadSuccessful,
        message: response.message || documentsStrings.uploadSuccessfulMessage,
        duration: 3000,
      });

      // Add uploaded document to the list
      setDocuments(prev => [...prev, response.data]);
      setSelectedDocument(null);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        documentsStrings.uploadFailedMessage;

      showToast({
        type: 'error',
        title: documentsStrings.uploadFailed,
        message: errorMessage,
        duration: 3000,
      });
    }
  };

  const handleDateFilter = () => {
    // TODO: Implement date filter functionality
    console.log('Date filter pressed');
  };

  if (isUploading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <ToastComponent />
      {/* Header */}
      <Header
        title={documentsStrings.title}
        onBackPress={handleBack}
        showBackButton={true}
        titleStyle={{
          color: '#000',
        }}
        iconColor="#000"
      />

      {/* Search and Filter Bar */}
      <HStack className="px-5 py-4 justify-between">
        <SearchField value={searchText} onChangeText={setSearchText} />
        <FilterButton onPress={handleDateFilter} />
      </HStack>

      {/* Content */}
      {documents.length === 0 ? (
        <NoData onUploadPress={handleUploadDocument} />
      ) : (
        <VStack className="flex-1 px-6 py-4">
          {/* Document List will go here when documents exist */}
          <Text className="text-center text-lg font-body text-gray-600 mt-8">
            Document list will be implemented here
          </Text>
        </VStack>
      )}

      {/* Upload Document Button */}
      <Box className="px-6 pb-6">
        <GradientButton
          title={documentsStrings.uploadDocument}
          onPress={handleUploadDocument}
          loading={isUploading}
        />
      </Box>
    </SafeAreaView>
  );
};

export default Documents;
