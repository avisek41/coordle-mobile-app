import React, { useState } from 'react';
import { SafeAreaView, Alert, Linking } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import {
  GradientButton,
  Header,
  Loader,
  CustomAlert,
  CustomActionSheet,
} from '@/src/components';
import { useNavigation } from '@react-navigation/native';
import { MainNavigationProps } from '@/src/types/allRoutes';
import { globalStyles } from '@/src/styles';
import { documentsStrings } from './strings';
import SearchField from './SearchField';
import FilterButton from './FilterButton';
import DocumentList from './DocumentList';
import DocumentActionSheet from './DocumentActionSheet';
import RenameModal from './RenameModal';
import { Box } from '@/components/ui/box';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {
  useUploadDocumentMutation,
  useGetDocumentsQuery,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  Document,
} from '@/src/services';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import UploadDoc from './UploadDoc';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [documentToRename, setDocumentToRename] = useState<Document | null>(
    null,
  );
  const [isSortActionSheetOpen, setIsSortActionSheetOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [uploadDocument, { isLoading: isUploading, reset }] =
    useUploadDocumentMutation();
  const [updateDocument, { isLoading: isUpdating }] =
    useUpdateDocumentMutation();
  const [deleteDocument, { isLoading: isDeleting, reset: resetDelete }] =
    useDeleteDocumentMutation();
  const { showToast, ToastComponent } = useSimpleToast();

  // Get documents data to check if list is empty
  const {
    data: documentsData,
    refetch: refetchDocuments,
    error,
    isLoading,
  } = useGetDocumentsQuery({ page: 1, limit: 10 }, { skip: false });

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
    setIsSortActionSheetOpen(true);
  };

  const handleSortByDate = () => {
    setSortBy('date');
    setSortOrder('desc'); // Newest first
    setIsSortActionSheetOpen(false);
  };

  const handleSortByName = () => {
    setSortBy('name');
    setSortOrder('asc'); // A-Z
    setIsSortActionSheetOpen(false);
  };

  const handleCloseSortActionSheet = () => {
    setIsSortActionSheetOpen(false);
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
    try {
      Linking.openURL(document.fileUrl);
      showToast({
        type: 'success',
        title: documentsStrings.downloadSuccess,
        message: documentsStrings.downloadSuccessMessage,
        duration: 3000,
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: documentsStrings.downloadFailed,
        message: documentsStrings.downloadFailedMessage,
        duration: 3000,
      });
    }
  };

  const handleRename = (document: Document) => {
    setDocumentToRename(document);
    setShowRenameModal(true);
    setIsActionSheetOpen(false);
  };

  const handleRenameSubmit = async (documentId: string, newTitle: string) => {
    try {
      const response = await updateDocument({
        documentId,
        fileName: newTitle,
      }).unwrap();

      showToast({
        type: 'success',
        title: 'Document Renamed',
        message: response.message || 'Document renamed successfully',
        duration: 3000,
      });

      setShowRenameModal(false);
      setDocumentToRename(null);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        'Failed to rename document. Please try again.';

      showToast({
        type: 'error',
        title: 'Rename Failed',
        message: errorMessage,
        duration: 3000,
      });
    }
  };

  const handleRenameCancel = () => {
    setShowRenameModal(false);
    setDocumentToRename(null);
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

  const handleDeleteConfirm = async () => {
    if (documentToDelete) {
      try {
        const response = await deleteDocument({
          documentId: documentToDelete._id,
        }).unwrap();

        showToast({
          type: 'success',
          title: documentsStrings.deleteSuccess,
          message: response.message || documentsStrings.deleteSuccessMessage,
          duration: 3000,
        });
      } catch (error: any) {
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          documentsStrings.deleteFailedMessage;

        showToast({
          type: 'error',
          title: documentsStrings.deleteFailed,
          message: errorMessage,
          duration: 3000,
        });
      } finally {
        // Reset the mutation state
        resetDelete();
      }
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

  if (isUploading || isLoading || isDeleting) {
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
        <FilterButton
          onPress={handleDateFilter}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      </HStack>

      {/* Content */}
      {!searchText.trim() && !hasDocuments ? (
        <UploadDoc onUploadPress={handleUploadDocument} />
      ) : (
        <VStack className="flex-1">
          <DocumentList
            searchText={searchText}
            onDocumentPress={handleDocumentPress}
            onRefetch={handleRefetch}
            onUploadPress={handleUploadDocument}
            sortBy={sortBy}
            sortOrder={sortOrder}
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

      {/* Rename Modal */}
      <RenameModal
        isVisible={showRenameModal}
        onClose={handleRenameCancel}
        document={documentToRename}
        onRename={handleRenameSubmit}
        isLoading={isUpdating}
      />

      {/* Sort Action Sheet */}
      <CustomActionSheet
        isOpen={isSortActionSheetOpen}
        onClose={handleCloseSortActionSheet}
        title="Sort by"
        actions={[
          {
            id: 'date',
            title: 'Date',
            onPress: handleSortByDate,
            icon: (
              <Ionicons name="calendar-outline" size={20} color="#374151" />
            ),
          },
          {
            id: 'name',
            title: 'Name',
            onPress: handleSortByName,
            icon: <Ionicons name="text-outline" size={20} color="#374151" />,
          },
        ]}
        showCancelButton={true}
        cancelButtonText="Cancel"
        onCancelPress={handleCloseSortActionSheet}
      />
    </SafeAreaView>
  );
};

export default Documents;
