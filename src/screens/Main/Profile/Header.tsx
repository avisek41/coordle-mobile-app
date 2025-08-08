import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text as GluestackText } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { profileStrings } from './strings';
import { Colors } from '@/src/configs/CustomTheme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParams } from '@/src/types/allRoutes';

const Header: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParams>>();

  return (
    <Box className="px-5 py-4">
      <HStack className=" items-center">
        {/* Back Button */}
        {/* <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="chevron-back-outline" size={24} color="white" />
        </TouchableOpacity> */}

        {/* Title */}
        <GluestackText className="text-xl font-heading text-white flex-1 ml-4">
          {profileStrings.title}
        </GluestackText>

        {/* Edit Button */}
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Ionicons name="pencil-sharp" size={20} color="white" />
        </TouchableOpacity>
      </HStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    width: 35,
    height: 35,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Header;
