import React, { useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  View,
} from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/src/configs/CustomTheme';

const { width: screenWidth } = Dimensions.get('window');

interface FabAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

interface GradientFabButtonProps {
  actions: FabAction[];
  isExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
}

const GradientFabButton: React.FC<GradientFabButtonProps> = ({
  actions,
  isExpanded = false,
  onToggle,
}) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const [animation] = useState(new Animated.Value(0));

  const toggleExpanded = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    onToggle?.(newExpanded);

    Animated.spring(animation, {
      toValue: newExpanded ? 1 : 0,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleActionPress = (action: FabAction) => {
    action.onPress();
    // Optionally close the FAB after action
    if (expanded) {
      toggleExpanded();
    }
  };

  return (
    <View style={styles.container}>
      {/* Action Buttons */}
      {expanded && (
        <Animated.View
          style={[
            styles.actionsContainer,
            {
              opacity: animation,
              transform: [
                {
                  translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
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
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => handleActionPress(action)}
                style={styles.actionTouchable}
                activeOpacity={0.8}
              >
                <HStack space="sm" className="items-center">
                  <Ionicons name={action.icon as any} size={20} color="white" />
                  <Text className="text-white font-body text-sm">
                    {action.title}
                  </Text>
                </HStack>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>
      )}

      {/* Main FAB Button */}
      <TouchableOpacity
        onPress={toggleExpanded}
        style={[
          styles.fab,
          {
            transform: [
              {
                rotate: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '45deg'],
                }),
              },
            ],
          },
        ]}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    alignItems: 'flex-end',
  },
  actionsContainer: {
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 140,
  },
  actionTouchable: {
    flex: 1,
  },
  fab: {
    backgroundColor: '#FF6B6B',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default GradientFabButton;
