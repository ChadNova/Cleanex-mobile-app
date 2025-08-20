import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Copy } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '@/contexts/ThemeContext';

interface USSDPaymentDisplayProps {
  ussdCode: string;
}

export default function USSDPaymentDisplay({ ussdCode }: USSDPaymentDisplayProps) {
  const { isDarkMode } = useTheme();

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Success', 'Copied to clipboard!');
  };

  return (
    <View className={`rounded-xl p-4 mb-4 ${isDarkMode ? 'bg-primary/20' : 'bg-primary/10'}`}>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-primary font-inter-bold">USSD Payment Code</Text>
        <TouchableOpacity
          onPress={() => copyToClipboard(ussdCode)}
          className="flex-row items-center"
        >
          <Copy color="#4F46E5" size={16} />
          <Text className="text-primary font-inter ml-1">Copy</Text>
        </TouchableOpacity>
      </View>
      <Text className="text-primary font-inter-bold text-xl">{ussdCode}</Text>
    </View>
  );
}
