import React, { useState } from 'react';
import { SafeAreaView, Alert } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { GradientButton, Header, Loader, CustomAlert } from '@/src/components';
import { useNavigation } from '@react-navigation/native';
import { MainNavigationProps } from '@/src/types/allRoutes';
import { globalStyles } from '@/src/styles';
import { documentsStrings } from './strings';
import NoData from './NoData';
import SearchField from './SearchField';
import FilterButton from './FilterButton';
import DocumentList from './DocumentList';
import DocumentActionSheet from './DocumentActionSheet';
import { Box } from '@/components/ui/box';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {
  useUploadDocumentMutation,
  useGetDocumentsQuery,
  Document,
} from '@/src/services';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';

const Documents: React.FC = () => {
  const { goBack, navigate } = useNavigation<MainNavigationProps>();
  const [searchText, setSearchText] = useState('');
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentPickerResponse | null>(null);
  const [selectedDocumentForAction, setSelectedDocumentForAction] =
    useState<Document | null>(null);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null,
  );
  const [uploadDocument, { isLoading: isUploading, reset }] =
    useUploadDocumentMutation();
  const { showToast, ToastComponent } = useSimpleToast();

  // Get documents data to check if list is empty
  const {
    data: documentsData,
    refetch: refetchDocuments,
    error,
    isLoading,
  } = useGetDocumentsQuery({ page: 1, limit: 10 }, { skip: false });

  console.log('error', error);

  const hasDocuments =
    documentsData?.data?.documents && documentsData.data.documents.length > 0;

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
    } finally {
      reset();
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

      // Documents list will be automatically updated via cache invalidation
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

  const handleDocumentPress = (document: Document) => {
    setSelectedDocumentForAction(document);
    setIsActionSheetOpen(true);
  };

  const handleActionSheetClose = () => {
    setIsActionSheetOpen(false);
    setSelectedDocumentForAction(null);
  };

  const handleDownload = (document: Document) => {
    // TODO: Implement download functionality
    console.log('Download document:', document.fileName);
    showToast({
      type: 'success',
      title: 'Download Started',
      message: `Downloading ${document.fileName}`,
      duration: 3000,
    });
  };

  const handleRename = (document: Document) => {
    // TODO: Implement rename functionality
    console.log('Rename document:', document.fileName);
    showToast({
      type: 'info',
      title: 'Rename',
      message: `Rename functionality for ${document.fileName} will be implemented soon`,
      duration: 3000,
    });
  };

  const handleFileInfo = (document: Document) => {
    navigate('FileInformation', { document });
    setIsActionSheetOpen(false);
  };

  const handleDelete = (document: Document) => {
    setDocumentToDelete(document);
    setShowDeleteAlert(true);
    setIsActionSheetOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (documentToDelete) {
      // TODO: Implement actual delete functionality
      console.log('Delete document:', documentToDelete.fileName);
      showToast({
        type: 'success',
        title: 'Document Deleted',
        message: `${documentToDelete.fileName} has been deleted`,
        duration: 3000,
      });
    }
    setShowDeleteAlert(false);
    setDocumentToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteAlert(false);
    setDocumentToDelete(null);
  };

  const handleRefetch = () => {
    // Called when pull-to-refresh is triggered
    refetchDocuments();
  };

  if (isUploading || isLoading) {
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
      {!hasDocuments ? (
        <NoData onUploadPress={handleUploadDocument} />
      ) : (
        <VStack className="flex-1">
          <DocumentList
            searchText={searchText}
            onDocumentPress={handleDocumentPress}
            onRefetch={handleRefetch}
          />
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

      {/* Document Action Sheet */}
      <DocumentActionSheet
        isOpen={isActionSheetOpen}
        onClose={handleActionSheetClose}
        document={selectedDocumentForAction}
        onDownload={handleDownload}
        onRename={handleRename}
        onFileInfo={handleFileInfo}
        onDelete={handleDelete}
      />

      {/* Delete Confirmation Alert */}
      <CustomAlert
        isOpen={showDeleteAlert}
        title={documentsStrings.deleteConfirmation}
        message={
          documentToDelete
            ? `${documentToDelete.fileName} will be deleted forever. Do you really want to delete?`
            : ''
        }
        cancelText={documentsStrings.cancel}
        confirmText={documentsStrings.delete}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isDestructive={true}
      />
    </SafeAreaView>
  );
};

export default Documents;
