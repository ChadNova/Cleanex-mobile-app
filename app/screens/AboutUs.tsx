import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Shield, FileText, ExternalLink, Heart, Star, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function AboutUsScreen() {
  const { isDarkMode } = useTheme();

  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open link:', error);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-background'}`}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className={`px-6 pt-6 pb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4
        }}>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mb-4 active:scale-95"
          >
            <ArrowLeft color={isDarkMode ? '#FFFFFF' : '#4F46E5'} size={24} />
          </TouchableOpacity>

          <View>
            <Text className={`text-3xl font-inter-bold ${isDarkMode ? 'text-white' : 'text-text'}`}>
              About Us
            </Text>
            <Text className={`text-sm font-inter mt-1 ${isDarkMode ? 'text-gray-400' : 'text-text-secondary'}`}>
              Learn more about CleanEx
            </Text>
          </View>
        </View>

        <View className="px-6 pt-6">
          {/* Logo Section */}
          <View className={`rounded-3xl p-8 mb-6 items-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 6
          }}>
            <Image 
              source={require('@/assets/images/logo.png')} 
              style={styles.aboutLogo}
            />
            <Text className={`font-inter text-center leading-6 ${isDarkMode ? 'text-gray-300' : 'text-text-secondary'}`}>
              We wash it all: Clothes, Shoes, Dishes, and Home!
            </Text>
          </View>

          {/* Mission Section */}
          <View className={`rounded-3xl p-6 mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 6
          }}>
            <View className="flex-row items-center mb-4">
              <View className="bg-primary/10 rounded-full p-3 mr-4">
                <Heart color="#4F46E5" size={24} />
              </View>
              <Text className={`text-xl font-inter-bold ${isDarkMode ? 'text-white' : 'text-text'}`}>
                Our Mission
              </Text>
            </View>
            <Text className={`font-inter leading-7 ${isDarkMode ? 'text-gray-300' : 'text-text-secondary'}`}>
              To provide exceptional cleaning services that save you time and give you peace of mind. 
              We believe everyone deserves a clean, comfortable living space without the hassle.
            </Text>
          </View>

          {/* Features */}
          <View className={`rounded-3xl p-6 mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 6
          }}>
            <Text className={`text-xl font-inter-bold mb-6 ${isDarkMode ? 'text-white' : 'text-text'}`}>
              Why Choose Us?
            </Text>
            
            {[
              { icon: '⚡', title: 'Fast Service', desc: '24-hour maximum turnaround' },
              { icon: '🛡️', title: 'Trusted & Verified', desc: 'Professional cleaning staff' },
              { icon: '💎', title: 'Premium Quality', desc: 'High-quality cleaning products' },
              { icon: '📱', title: 'Easy Booking', desc: 'Simple app-based ordering' },
            ].map((feature, index) => (
              <View key={index} className="flex-row items-center mb-4">
                <Text className="text-2xl mr-4">{feature.icon}</Text>
                <View className="flex-1">
                  <Text className={`font-inter-bold ${isDarkMode ? 'text-white' : 'text-text'}`}>
                    {feature.title}
                  </Text>
                  <Text className={`font-inter text-sm ${isDarkMode ? 'text-gray-400' : 'text-text-secondary'}`}>
                    {feature.desc}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Legal Links */}
          <View className={`rounded-3xl p-6 mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 6
          }}>
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-100 rounded-full p-3 mr-4">
                <Shield color="#3B82F6" size={24} />
              </View>
              <Text className={`text-xl font-inter-bold ${isDarkMode ? 'text-white' : 'text-text'}`}>
                Legal Information
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => openLink('https://moussassoss.github.io/CleanEx-Privacy/')}
              className={`flex-row items-center justify-between p-4 rounded-2xl mb-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
            >
              <View className="flex-row items-center">
                <FileText color={isDarkMode ? '#FFFFFF' : '#4F46E5'} size={20} />
                <Text className={`font-inter-bold ml-3 ${isDarkMode ? 'text-white' : 'text-text'}`}>
                  Privacy Policy
                </Text>
              </View>
              <ExternalLink color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={16} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => openLink('https://moussassoss.github.io/CleanEx-Privacy/terms.html')}
              className={`flex-row items-center justify-between p-4 rounded-2xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
            >
              <View className="flex-row items-center">
                <FileText color={isDarkMode ? '#FFFFFF' : '#4F46E5'} size={20} />
                <Text className={`font-inter-bold ml-3 ${isDarkMode ? 'text-white' : 'text-text'}`}>
                  Terms & Conditions
                </Text>
              </View>
              <ExternalLink color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={16} />
            </TouchableOpacity>
          </View>

          {/* Developer Credit */}
          <View className={`rounded-3xl p-6 mb-8 items-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 6
          }}>
            <Text className={`font-inter mb-4 ${isDarkMode ? 'text-gray-400' : 'text-text-secondary'}`}>
              Developed by
            </Text>
            <Image 
              source={require('@/assets/images/ChadNova.png')} 
              style={styles.developerLogo}
            />
            <TouchableOpacity
              onPress={() => openLink('https://chadnova.com')}
              className={`flex-row items-center justify-between p-4 rounded-2xl mb-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
            >
              <View className="flex-row items-center">
                <FileText color={isDarkMode ? '#FFFFFF' : '#4F46E5'} size={20} />
                <Text className={`font-inter-bold ml-3 ${isDarkMode ? 'text-white' : 'text-text'}`}>
                  ChadNova Ltd
                </Text>
              </View>
              <ExternalLink color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={16} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  aboutLogo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  developerLogo: {
    width: 100,
    height: 100,
  },
});
