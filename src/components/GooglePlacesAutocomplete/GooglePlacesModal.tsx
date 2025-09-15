import React, { useState } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GOOGLE_MAPS_API = 'AIzaSyBxfVswQ9hBsjelJqKtoYjR4PefccGxky0';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface GooglePlacesModalProps {
  visible: boolean;
  onClose: () => void;
  onLocationSelect: (coordinates: Coordinates, details: any) => void;
  placeholder?: string;
  mapRef?: React.RefObject<any>;
  countryCode?: string;
  language?: string;
  type?: 'airport' | 'location';
}

const GooglePlacesModal: React.FC<GooglePlacesModalProps> = ({
  visible,
  onClose,
  onLocationSelect,
  placeholder = 'Search...',
  mapRef,
  countryCode = 'in',
  language = 'en',
  type = 'location',
}) => {
  const [hasError, setHasError] = useState(false);

  const handlePress = (data: any, details: any = null) => {
    try {
      if (details?.geometry?.location) {
        const coordinates = {
          latitude: +details.geometry.location.lat,
          longitude: +details.geometry.location.lng,
        };
        onLocationSelect(coordinates, details);

        if (mapRef?.current) {
          mapRef.current.animateToRegion({
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }
        onClose();
      }
    } catch (error) {
      console.error('Error in handlePress:', error);
    }
  };

  if (hasError) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.errorContainer}>
          <Box style={styles.errorBox}>
            <Text style={styles.errorText}>
              Error loading location search. Please try again.
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>Close</Text>
            </TouchableOpacity>
          </Box>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <GooglePlacesAutocomplete
            fetchDetails
            enablePoweredByContainer={false}
            minLength={2}
            debounce={200}
            placeholder={placeholder}
            onPress={handlePress}
            predefinedPlaces={[]}
            onFail={error => {
              console.error('GooglePlacesAutocomplete Error:', error);
              setHasError(true);
            }}
            onNotFound={() => console.log('No results found')}
            query={{
              key: GOOGLE_MAPS_API,
              language,
              components: `country:in`,
              types: type === 'airport' ? 'airport' : null,
            }}
            textInputProps={{
              autoFocus: true,
              returnKeyType: 'search',
            }}
            renderLeftButton={() => (
              <TouchableOpacity onPress={onClose} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            )}
            styles={autoCompleteStyles}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: SCREEN_WIDTH,
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 10,
    flex: 1,
  },
  backButton: {
    justifyContent: 'center',
    marginLeft: 10,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  closeBtn: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

// Styles passed to RNGooglePlacesAutocomplete
const autoCompleteStyles = {
  container: {
    flex: 1,
    width: SCREEN_WIDTH - 20,
    alignSelf: 'center',
    marginTop: 50,
  },
  textInputContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  textInput: {
    height: 45,
    color: '#333',
    fontSize: 16,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  listView: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 5,
  },
  row: {
    backgroundColor: '#fff',
    padding: 13,
    minHeight: 44,
    flexDirection: 'row',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#c8c7cc',
  },
  description: {
    fontSize: 16,
    color: '#000',
  },
  predefinedPlacesDescription: {
    color: '#3caf50',
  },
};

export default GooglePlacesModal;
