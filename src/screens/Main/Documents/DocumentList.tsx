import React, { useState, useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import { useGetDocumentsQuery, Document } from '@/src/services';
import DocumentCard from './DocumentCard';
import { Loader } from '@/src/components';
import { documentsStrings } from './strings';
import UploadDoc from './UploadDoc';

interface DocumentListProps {
  searchText?: string;
  onDocumentPress?: (document: Document) => void;
  onRefetch?: () => void;
  onUploadPress?: () => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  searchText = '',
  onDocumentPress,
  onRefetch,
  onUploadPress,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allDocuments, setAllDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

  const {
    data: documentsData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetDocumentsQuery(
    {
      page: currentPage,
      limit: 10,
    },
    {
      skip: false,
    },
  );

  // Update documents when data changes
  React.useEffect(() => {
    if (documentsData?.data?.documents) {
      if (currentPage === 1) {
        // Reset list for first page
        setAllDocuments(documentsData.data.documents);
      } else {
        // Append for pagination
        setAllDocuments(prev => [
          ...prev,
          ...documentsData.data.documents.filter(
            doc => !prev.some(existingDoc => existingDoc._id === doc._id),
          ),
        ]);
      }
      setHasLoadedInitial(true);
    }
  }, [documentsData, currentPage]);

  // Filter documents based on search text
  React.useEffect(() => {
    if (searchText.trim()) {
      const filtered = allDocuments.filter(doc =>
        doc.fileName.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredDocuments(filtered);
    } else {
      setFilteredDocuments(allDocuments);
    }
  }, [searchText, allDocuments]);

  const handleRefresh = useCallback(() => {
    setCurrentPage(1);
    setAllDocuments([]);
    refetch();
    if (onRefetch) {
      onRefetch();
    }
  }, [refetch, onRefetch]);

  const handleLoadMore = useCallback(() => {
    if (documentsData?.data?.pagination?.hasNext && !isFetching && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  }, [documentsData?.data?.pagination?.hasNext, isFetching, isLoading]);

  const renderDocument = useCallback(
    ({ item }: { item: Document }) => (
      <DocumentCard document={item} onPress={onDocumentPress} />
    ),
    [onDocumentPress],
  );

  const renderFooter = useCallback(() => {
    if (!isFetching || currentPage === 1) return null;

    return (
      <Box className="py-4 items-center">
        <Loader />
      </Box>
    );
  }, [isFetching, currentPage]);

  const renderEmpty = useCallback(() => {
    if (isLoading && !hasLoadedInitial) {
      return (
        <Box className="flex-1 items-center justify-center py-20">
          <Loader />
        </Box>
      );
    }

    if (error) {
      return (
        <Box className="flex-1 items-center justify-center py-20">
          <Text className="font-body text-base text-red-500 text-center">
            {documentsStrings.loadError}
          </Text>
          <Text className="font-body text-sm text-gray-500 text-center mt-2">
            {documentsStrings.loadErrorMessage}
          </Text>
        </Box>
      );
    }

    if (searchText.trim() && filteredDocuments.length === 0) {
      return (
        <Box className="flex-1">
          <UploadDoc onUploadPress={onUploadPress || (() => {})} />
        </Box>
      );
    }

    return null;
  }, [
    isLoading,
    hasLoadedInitial,
    error,
    searchText,
    filteredDocuments.length,
  ]);

  const keyExtractor = useCallback((item: Document) => item._id, []);

  if (!hasLoadedInitial && isLoading) {
    return (
      <Box className="flex-1 items-center justify-center">
        <Loader />
      </Box>
    );
  }

  return (
    <VStack className="flex-1">
      <FlatList
        data={filteredDocuments}
        renderItem={renderDocument}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && currentPage === 1}
            onRefresh={handleRefresh}
            tintColor="#007AFF"
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={10}
      />
    </VStack>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    flexGrow: 1,
  },
});

export default DocumentList;
