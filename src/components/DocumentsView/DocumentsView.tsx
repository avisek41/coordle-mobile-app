import React, { useState } from 'react';
import {
  SafeAreaView,
  Alert,
  Linking,
  Platform,
  PermissionsAndroid,
} from 'react-native';
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
import { documentsStrings } from '@/src/screens/Main/Documents/strings';
import SearchField from '@/src/screens/Main/Documents/SearchField';
import FilterButton from '@/src/screens/Main/Documents/FilterButton';
import DocumentList from '@/src/screens/Main/Documents/DocumentList';
import DocumentActionSheet from '@/src/screens/Main/Documents/DocumentActionSheet';
import RenameModal from '@/src/screens/Main/Documents/RenameModal';
import { Box } from '@/components/ui/box';
import { pick } from '@react-native-documents/picker';
import {
  useUploadDocumentMutation,
  useGetDocumentsQuery,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  Document,
  useUploadTripDocumentMutation,
  useGetTripDocumentsQuery,
  useUpdateTripDocumentMutation,
  useDeleteTripDocumentMutation,
  TripDocument,
} from '@/src/services';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import UploadDoc from '@/src/screens/Main/Documents/UploadDoc';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface DocumentsViewProps {
  title?: string;
  tripId?: string;
  isTripDocuments?: boolean;
  onBackPress?: () => void;
}

const DocumentsView: React.FC<DocumentsViewProps> = ({
  title = documentsStrings.title,
  tripId,
  isTripDocuments = false,
  onBackPress,
}) => {
  const { goBack, navigate } = useNavigation<MainNavigationProps>();
  const [searchText, setSearchText] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [selectedDocumentForAction, setSelectedDocumentForAction] = useState<
    (Document | TripDocument) | null
  >(null);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<
    (Document | TripDocument) | null
  >(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [documentToRename, setDocumentToRename] = useState<
    (Document | TripDocument) | null
  >(null);
  const [isSortActionSheetOpen, setIsSortActionSheetOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Regular documents mutations
  const [uploadDocument, { isLoading: isUploading, reset }] =
    useUploadDocumentMutation();
  const [updateDocument, { isLoading: isUpdating }] =
    useUpdateDocumentMutation();
  const [deleteDocument, { isLoading: isDeleting, reset: resetDelete }] =
    useDeleteDocumentMutation();

  // Trip documents mutations
  const [
    uploadTripDocument,
    {
      isLoading: isUploadingTrip,
      reset: resetTripUpload,
      error: uploadTripDocumentError,
    },
  ] = useUploadTripDocumentMutation();

  const [updateTripDocument, { isLoading: isUpdatingTrip }] =
    useUpdateTripDocumentMutation();
  const [
    deleteTripDocument,
    {
      isLoading: isDeletingTrip,
      reset: resetTripDelete,
      error: deleteTripDocumentError,
    },
  ] = useDeleteTripDocumentMutation();

  console.log('deleteTripDocumentError', deleteTripDocumentError);

  const { showToast, ToastComponent } = useSimpleToast();

  // Request Android permissions
  const requestAndroidPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        // Check Android API level for different permission requirements
        const androidVersion = Platform.Version;
        let permissions = [];

        if (androidVersion >= 33) {
          // Android 13+ uses granular media permissions
          permissions = [
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
          ];
        } else {
          // Android 12 and below use storage permissions
          permissions = [
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          ];
        }

        const granted = await PermissionsAndroid.requestMultiple(permissions);

        const allGranted = Object.values(granted).every(
          permission => permission === PermissionsAndroid.RESULTS.GRANTED,
        );

        if (!allGranted) {
          showToast({
            type: 'error',
            title: 'Permission Required',
            message: 'Storage permission is required to select documents.',
            duration: 3000,
          });
          return false;
        }
        return true;
      } catch (err) {
        console.log('Permission request error:', err);
        return false;
      }
    }
    return true; // iOS handles permissions differently
  };

  // Get documents data based on type
  const {
    data: documentsData,
    refetch: refetchDocuments,
    error,
    isLoading,
  } = isTripDocuments && tripId
    ? useGetTripDocumentsQuery({ tripId, page: 1, limit: 10 }, { skip: false })
    : useGetDocumentsQuery({ page: 1, limit: 10 }, { skip: false });

  const hasDocuments =
    documentsData?.data?.documents && documentsData.data.documents.length > 0;

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      goBack();
    }
  };

  const handleUploadDocument = async () => {
    try {
      console.log('Starting document picker...');

      // Request permissions first
      const hasPermissions = await requestAndroidPermissions();
      if (!hasPermissions) {
        return;
      }

      // Try to pick document
      let result;
      try {
        result = await pick();
      } catch (pickerError) {
        console.log('Document picker error:', pickerError);
        throw pickerError;
      }

      console.log('Document picker result:', result);

      if (result && result.length > 0) {
        const document = result[0];
        console.log('Selected document:', document);

        // Validate document object
        if (!document.uri || !document.name || !document.type) {
          console.log('Invalid document object:', document);
          showToast({
            type: 'error',
            title: documentsStrings.uploadError,
            message: 'Invalid document selected. Please try again.',
            duration: 3000,
          });
          return;
        }

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
      } else {
        console.log('No document selected');
      }
    } catch (error: any) {
      console.log('Document picker error:', error);
      if (error?.code === 'OPERATION_CANCELED') {
        // User cancelled the picker
        console.log('User cancelled document picker');
      } else {
        console.log('Document picker failed:', error);
        let errorMessage = 'Please try again or check your file permissions.';

        if (Platform.OS === 'android') {
          errorMessage =
            'Please grant storage permissions in Settings and try again.';
        }

        showToast({
          type: 'error',
          title: 'Failed to select document',
          message: errorMessage,
          duration: 3000,
        });
      }
    } finally {
      if (isTripDocuments) {
        resetTripUpload();
      } else {
        reset();
      }
    }
  };

  const uploadSelectedDocument = async (document: any) => {
    try {
      console.log('Uploading document:', document);

      const formData = new FormData();

      formData.append('document', {
        uri: document.uri,
        type: document.type,
        name: document.name,
      } as any);

      console.log('FormData created:', formData);

      let response;
      if (isTripDocuments && tripId) {
        response = await uploadTripDocument({ tripId, formData }).unwrap();
      } else {
        response = await uploadDocument(formData).unwrap();
      }

      showToast({
        type: 'success',
        title: documentsStrings.uploadSuccessful,
        message: response.message || documentsStrings.uploadSuccessfulMessage,
        duration: 3000,
      });

      // Documents list will be automatically updated via cache invalidation
      setSelectedDocument(null);
    } catch (error: any) {
      console.log('Upload error:', error);
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

  const handleDocumentPress = (document: Document | TripDocument) => {
    setSelectedDocumentForAction(document);
    setIsActionSheetOpen(true);
  };

  const handleActionSheetClose = () => {
    setIsActionSheetOpen(false);
    setSelectedDocumentForAction(null);
  };

  const handleDownload = (document: Document | TripDocument) => {
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

  const handleRename = (document: Document | TripDocument) => {
    setDocumentToRename(document);
    setShowRenameModal(true);
    setIsActionSheetOpen(false);
  };

  const handleRenameSubmit = async (documentId: string, newTitle: string) => {
    try {
      let response;
      if (isTripDocuments && tripId) {
        response = await updateTripDocument({
          tripId,
          documentId,
          originalFileName: newTitle,
        }).unwrap();
      } else {
        response = await updateDocument({
          documentId,
          originalFileName: newTitle,
        }).unwrap();
      }

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

  const handleFileInfo = (document: Document | TripDocument) => {
    navigate('FileInformation', { document });
    setIsActionSheetOpen(false);
  };

  const handleDelete = (document: Document | TripDocument) => {
    setDocumentToDelete(document);
    setShowDeleteAlert(true);
    setIsActionSheetOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (documentToDelete) {
      try {
        let response;
        if (isTripDocuments && tripId) {
          response = await deleteTripDocument({
            tripId,
            documentId: documentToDelete._id,
          }).unwrap();
        } else {
          response = await deleteDocument({
            documentId: documentToDelete._id,
          }).unwrap();
        }

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
        if (isTripDocuments) {
          resetTripDelete();
        } else {
          resetDelete();
        }
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

  const isLoadingState =
    isUploading || isUploadingTrip || isLoading || isDeleting || isDeletingTrip;

  if (isLoadingState) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <ToastComponent />
      {/* Header */}
      <Header
        title={title}
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
            isTripDocuments={isTripDocuments}
            tripId={tripId}
          />
        </VStack>
      )}

      {/* Upload Document Button */}
      <Box className="px-6 pb-6">
        <GradientButton
          title={documentsStrings.uploadDocument}
          onPress={handleUploadDocument}
          loading={isUploading || isUploadingTrip}
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
            ? `${documentToDelete.originalFileName} will be deleted forever. Do you really want to delete?`
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
        isLoading={isUpdating || isUpdatingTrip}
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

export default DocumentsView;
