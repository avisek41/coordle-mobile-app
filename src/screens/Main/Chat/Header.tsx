import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text as GluestackText } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { chatStrings } from './strings';

const Header: React.FC = () => {
  return (
    <Box className="px-5 py-4">
      <HStack className="justify-between items-center">
        {/* Main Title */}
        <GluestackText className="text-2xl font-heading text-gray-800">
          {chatStrings.title}
        </GluestackText>

        {/* Search Button */}
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={20} color="#333" />
        </TouchableOpacity>
      </HStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});

export default Header;
