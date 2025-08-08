import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/src/configs/CustomTheme';

const FloatingActionButton: React.FC = () => {
  return (
    <Box className="absolute bottom-6 right-6">
      <TouchableOpacity style={styles.fab}>
        <VStack className="items-center" space="xs">
          {/* Chat Bubble Icon */}
          <Ionicons
            name="chatbubble-ellipses"
            size={28}
            color={Colors.primary}
          />
        </VStack>
      </TouchableOpacity>
    </Box>
  );
};

const styles = StyleSheet.create({
  fab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default FloatingActionButton;
