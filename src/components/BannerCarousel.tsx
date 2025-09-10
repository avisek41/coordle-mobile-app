import React, { useState, useRef, useEffect } from 'react';
import {
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Banner {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface BannerCarouselProps {
  banners: Banner[];
  height?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  onBannerPress?: (banner: Banner) => void;
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({
  banners,

  autoPlay = true,
  autoPlayInterval = 3000,
  onBannerPress,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && banners.length > 1) {
      autoPlayTimerRef.current = setInterval(() => {
        const nextIndex = (currentIndex + 1) % banners.length;
        setCurrentIndex(nextIndex);
        scrollViewRef.current?.scrollTo({
          x: nextIndex * screenWidth,
          animated: true,
        });
      }, autoPlayInterval);

      return () => {
        if (autoPlayTimerRef.current) {
          clearInterval(autoPlayTimerRef.current);
        }
      };
    }
  }, [currentIndex, autoPlay, autoPlayInterval, banners.length]);

  // Handle scroll events
  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / screenWidth);
    setCurrentIndex(index);
  };

  // Handle manual dot press
  const handleDotPress = (index: number) => {
    setCurrentIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * screenWidth,
      animated: true,
    });
  };

  // Handle banner press
  const handleBannerPress = (banner: Banner) => {
    onBannerPress?.(banner);
  };

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <Box>
      {/* Carousel */}

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {banners.map((banner, index) => (
          <TouchableOpacity
            key={banner._id}
            onPress={() => handleBannerPress(banner)}
            activeOpacity={0.9}
          >
            {/* Banner Image */}
            <Image
              source={{ uri: banner.imageUrl }}
              style={[styles.bannerImage, { height: index === 0 ? 120 : 280 }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Dot Indicators */}
      {banners.length > 1 && (
        <Box className="mt-10">
          <HStack className="justify-center items-center" space="sm">
            {banners.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleDotPress(index)}
                activeOpacity={0.7}
              >
                <Box
                  className={`w-2 h-2 rounded-full ${
                    index === currentIndex
                      ? 'bg-green-600'
                      : 'bg-gray-500 bg-opacity-50'
                  }`}
                />
              </TouchableOpacity>
            ))}
          </HStack>
        </Box>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  bannerImage: {
    width: screenWidth,
    height: 120,
  },
});

export default BannerCarousel;
