import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { GradientButton, Header } from '@/src/components';
import { useNavigation } from '@react-navigation/native';
import { MainNavigationProps } from '@/src/types/allRoutes';
import { globalStyles } from '@/src/styles';
import { documentsStrings } from './strings';
import NoData from './NoData';
import SearchField from './SearchField';
import FilterButton from './FilterButton';
import { Box } from '@/components/ui/box';

const Documents: React.FC = () => {
  const { goBack } = useNavigation<MainNavigationProps>();
  const [searchText, setSearchText] = useState('');
  const [documents, setDocuments] = useState<any[]>([]); // Empty array means no documents

  const handleBack = () => {
    goBack();
  };

  const handleUploadDocument = () => {
    // TODO: Implement document upload functionality
    console.log('Upload document pressed');
  };

  const handleDateFilter = () => {
    // TODO: Implement date filter functionality
    console.log('Date filter pressed');
  };

  return (
    <SafeAreaView style={globalStyles.container}>
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
      {/* Add Gradient Button with name  Save */}
      <Box className="px-6">
        <GradientButton title="Save" onPress={() => {}} />
      </Box>
    </SafeAreaView>
  );
};

export default Documents;
