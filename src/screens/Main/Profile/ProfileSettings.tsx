import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text as GluestackText } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/src/configs/CustomTheme';

const ProfileSettings: React.FC = () => {
  return (
    <VStack space="lg" className="px-5">
      {/* Your Documents Section */}
      <TouchableOpacity>
        <Box className="bg-gray-100 rounded-xl p-4">
          <HStack className="items-center" space="md">
            <Box className="w-10 h-10 rounded-full bg-gray-200 justify-center items-center">
              <Ionicons name="folder-outline" size={20} color="#6B7280" />
            </Box>
            <VStack className="flex-1" space="xs">
              <GluestackText className="text-lg font-heading text-gray-800">
                Your documents
              </GluestackText>
              <GluestackText className="text-sm text-gray-500">
                Keep everything organized for your trip
              </GluestackText>
            </VStack>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </HStack>
        </Box>
      </TouchableOpacity>

      {/* Settings Section */}
      <TouchableOpacity>
        <Box className="bg-gray-100 rounded-xl p-4">
          <HStack className="items-center" space="md">
            <Box className="w-10 h-10 rounded-full bg-gray-200 justify-center items-center">
              <Ionicons name="settings-outline" size={20} color="#6B7280" />
            </Box>
            <VStack className="flex-1" space="xs">
              <GluestackText className="text-lg font-heading text-gray-800">
                Settings
              </GluestackText>
              <GluestackText className="text-sm text-gray-500">
                Manage notifications, Change password
              </GluestackText>
            </VStack>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </HStack>
        </Box>
      </TouchableOpacity>

      {/* Coordle Section Header */}
      <Box className="mt-6">
        <GluestackText
          className="text-2xl font-heading"
          style={{ color: Colors.secondary }}
        >
          Coordle
        </GluestackText>
      </Box>

      {/* Account Management Options */}
      <VStack space="md">
        <TouchableOpacity>
          <HStack className="items-center" space="md">
            <Box className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center">
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#6B7280"
              />
            </Box>
            <GluestackText className="flex-1 text-lg font-body text-gray-800">
              About
            </GluestackText>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </HStack>
        </TouchableOpacity>

        <TouchableOpacity>
          <HStack className="items-center" space="md">
            <Box className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center">
              <Ionicons name="log-out-outline" size={20} color="#6B7280" />
            </Box>
            <GluestackText className="flex-1 text-lg font-body text-gray-800">
              Sign Out
            </GluestackText>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </HStack>
        </TouchableOpacity>

        <TouchableOpacity>
          <HStack className="items-center" space="md">
            <Box className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center">
              <Ionicons
                name="person-remove-outline"
                size={20}
                color="#6B7280"
              />
            </Box>
            <GluestackText className="flex-1 text-lg font-body text-gray-800">
              Delete Account
            </GluestackText>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </HStack>
        </TouchableOpacity>
      </VStack>
    </VStack>
  );
};

export default ProfileSettings;
