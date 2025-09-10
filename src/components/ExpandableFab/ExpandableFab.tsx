import React, { useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  View,
  Modal,
  Pressable,
} from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';

import Ionicons from 'react-native-vector-icons/Ionicons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface FabAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

interface ExpandableFabProps {
  actions: FabAction[];
  isVisible?: boolean;
}

const ExpandableFab: React.FC<ExpandableFabProps> = ({
  actions,
  isVisible = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleExpanded = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);

    Animated.spring(animation, {
      toValue: newExpanded ? 1 : 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleActionPress = (action: FabAction) => {
    action.onPress();
    toggleExpanded();
  };

  const handleClose = () => {
    if (isExpanded) {
      toggleExpanded();
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Blurred Background Modal */}
      <Modal
        visible={isExpanded}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <Pressable style={styles.modalOverlay} onPress={handleClose}>
          <View style={styles.modalBackground}>
            <View style={styles.actionsContainer}>
              {actions.map((action, index) => (
                <Animated.View
                  key={action.id}
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: action.color,
                      transform: [
                        {
                          translateY: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [50, 0],
                          }),
                        },
                        {
                          scale: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.8, 1],
                          }),
                        },
                      ],
                      opacity: animation,
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => handleActionPress(action)}
                    style={styles.actionTouchable}
                    activeOpacity={0.8}
                  >
                    <HStack space="sm" className="items-center">
                      <Ionicons
                        name={action.icon as any}
                        size={20}
                        color="white"
                      />
                      <Text className="text-white font-body text-sm">
                        {action.title}
                      </Text>
                    </HStack>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>
          {isExpanded && (
            <TouchableOpacity
              onPress={toggleExpanded}
              style={[styles.fab]}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isExpanded ? 'close' : 'add'}
                size={28}
                color="#FF6B6B"
              />
            </TouchableOpacity>
          )}
        </Pressable>
      </Modal>

      {/* Main FAB Button */}
      <TouchableOpacity
        onPress={toggleExpanded}
        style={[styles.fab]}
        activeOpacity={0.8}
      >
        <Ionicons
          name={isExpanded ? 'close' : 'add'}
          size={28}
          color="#FF6B6B"
        />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  modalBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    alignItems: 'flex-end',
    zIndex: 1000,
  },
  actionButton: {
    marginBottom: 16,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    width: '100%',
    height: 40,
  },
  actionTouchable: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 23,
    right: 24,
    backgroundColor: '#fff',
    borderRadius: 28,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
});

export default ExpandableFab;
