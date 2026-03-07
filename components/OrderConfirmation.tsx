// components/OrderConfirmation.tsx
import React from "react";
import {ScrollView, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Copy, CircleCheck as CheckCircle, Sparkles, Star, Heart } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { useToast } from "@/components/ToastProvider";
import { LinearGradient } from 'expo-linear-gradient';

interface ServiceDetail {
  label: string;
  quantity: number;
  pricePerUnit: number;
  unit: string;
}

interface OrderConfirmationProps {
  order: {
    serviceName: string;
    services: ServiceDetail[];
    includeIroning?: boolean;
    ironingPricePerUnit?: number;
    total: number;
    ussdCode: string;
    whatsappNumber: string;
    date?: string;
  };
  onBack: () => void;
}

export default function OrderConfirmation({ order, onBack }: OrderConfirmationProps) {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  
  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    showToast({
      message: 'Copied to clipboard!',
      type: 'success',
      duration: 2000
    });
  };

  const renderServiceDetails = () => {
    if (order.serviceName.toLowerCase().includes("laundry")) {
      const clothes = order.services.find(s => s.label.toLowerCase() === "clothes");
      const shoes = order.services.find(s => s.label.toLowerCase() === "shoes");

      const shoesTotal = shoes ? shoes.quantity * shoes.pricePerUnit : 0;
      const clothesTotal = clothes ? clothes.pricePerUnit : 0;
      const ironingTotal = order.includeIroning ? order.ironingPrice : 0;

      return (
        <View className="space-y-3">
          {shoes && shoes.quantity > 0 && (
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                <Text className={`font-inter ${isDarkMode ? "text-gray-300" : "text-text-secondary"}`}>
                  {shoes.label}: {shoes.quantity} {shoes.unit}
                </Text>
              </View>
              <Text className={`font-inter-bold ${isDarkMode ? "text-white" : "text-text"}`}>
                {shoesTotal} RWF
              </Text>
            </View>
          )}

          {clothes && clothes.quantity > 0 && (
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                <Text className={`font-inter ${isDarkMode ? "text-gray-300" : "text-text-secondary"}`}>
                  {clothes.label}: {clothes.quantity} {clothes.unit}
                </Text>
              </View>
              <Text className={`font-inter-bold ${isDarkMode ? "text-white" : "text-text"}`}>
                {clothesTotal} RWF
              </Text>
            </View>
          )}

          {order.includeIroning && (
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-amber-500 rounded-full mr-3" />
                <Text className={`font-inter ${isDarkMode ? "text-gray-300" : "text-text-secondary"}`}>
                  Ironing Service
                </Text>
              </View>
              <Text className={`font-inter-bold ${isDarkMode ? "text-white" : "text-text"}`}>
                {ironingTotal} RWF
              </Text>
            </View>
          )}
        </View>
      );
    }

    // Generic fallback for all other services
    return (
      <View className="space-y-3">
        {order.services.map((s, index) => {
          if (s.quantity === 0) return null;
          const total = s.quantity * s.pricePerUnit;
          const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500'];
          return (
            <View key={index} className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <View className={`w-2 h-2 ${colors[index % colors.length]} rounded-full mr-3`} />
                <Text className={`font-inter ${isDarkMode ? "text-gray-300" : "text-text-secondary"}`}>
                  {s.label}: {s.quantity} × {s.pricePerUnit} RWF
                </Text>
              </View>
              <Text className={`font-inter-bold ${isDarkMode ? "text-white" : "text-text"}`}>
                {total} RWF
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Floating decorative elements */}
      <View className="absolute top-20 right-8 opacity-20">
        <Sparkles color={isDarkMode ? "#FFFFFF" : "#4F46E5"} size={24} />
      </View>
      <View className="absolute top-32 left-8 opacity-15">
        <Star color={isDarkMode ? "#FFFFFF" : "#4F46E5"} size={20} />
      </View>
      <View className="absolute bottom-40 right-12 opacity-10">
        <Heart color={isDarkMode ? "#FFFFFF" : "#4F46E5"} size={18} />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-8 pb-4">
          <TouchableOpacity 
            onPress={onBack} 
            className="mb-8 active:scale-95"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <View className={`w-12 h-12 rounded-full items-center justify-center ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
              <ArrowLeft color={isDarkMode ? "#FFFFFF" : "#4F46E5"} size={24} />
            </View>
          </TouchableOpacity>
        </View>

        <View className="px-6">
          {/* Success Animation Container */}
          <View className={`rounded-3xl p-8 mb-8 ${isDarkMode ? "bg-gray-800" : "bg-white"}`} style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.15,
            shadowRadius: 24,
            elevation: 12
          }}>
            {/* Success Icon with Gradient Background */}
            <View className="items-center mb-8">
              <LinearGradient
                colors={['#10B981', '#059669']}
                className="w-24 h-24 rounded-full items-center justify-center mb-6"
                style={{
                  shadowColor: '#10B981',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                }}
              >
                <CheckCircle color="#FFFFFF" size={48} strokeWidth={2} />
              </LinearGradient>
              
              <Text className={`text-3xl font-inter-bold mb-3 ${isDarkMode ? "text-white" : "text-text"}`}>
                Order Confirmed! 🎉
              </Text>
              <Text className={`font-inter text-center text-lg leading-7 ${isDarkMode ? "text-gray-300" : "text-text-secondary"}`}>
                Your order has been submitted successfully. {"\n"}We'll get started right away!
              </Text>
            </View>

            {/* Order Summary Card */}
            <View className={`rounded-2xl p-6 mb-6 ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
              <View className="flex-row items-center mb-4">
                <View className="bg-primary/10 rounded-full p-2 mr-3">
                  <Text className="text-primary text-lg">📋</Text>
                </View>
                <Text className={`font-inter-bold text-lg ${isDarkMode ? "text-white" : "text-text"}`}>
                  Order Summary
                </Text>
              </View>
              
              <Text className={`text-xl font-inter-bold mb-4 ${isDarkMode ? "text-white" : "text-text"}`}>
                {order.serviceName}
              </Text>

              {renderServiceDetails()}

              {/* Total with gradient background */}
              <View className="mt-6 pt-4 border-t border-gray-200/30">
                <LinearGradient
                  colors={isDarkMode ? ['#4F46E5', '#7C3AED'] : ['#4F46E5', '#6366F1']}
                  className="rounded-xl p-4"
                >
                  <View className="flex-row justify-between rounded-full items-center">
                    <Text className="text-white font-inter-bold text-lg">
                      Total Amount
                    </Text>
                    <Text className="text-white font-inter-bold text-2xl">
                      {order.total} RWF
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Payment Information */}
          <View className="space-y-6 mb-6">
            {/* USSD Code Card */}
            <View className={`rounded-2xl mb-4 overflow-hidden ${isDarkMode ? "bg-gray-800" : "bg-white"}`} style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.1,
              shadowRadius: 16,
              elevation: 8
            }}>
              <LinearGradient
                colors={['#4F46E5', '#6366F1']}
                className="p-4"
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <View className="bg-white/20 rounded-full p-2 mr-3">
                      <Text className="text-white text-lg">💳</Text>
                    </View>
                    <Text className="text-white font-inter-bold text-lg">
                      USSD Payment Code
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(order.ussdCode)}
                    className="bg-white/20 rounded-full p-2 active:scale-95"
                  >
                    <Copy color="#FFFFFF" size={18} />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
              
              <View className="p-4">
                <Text className="text-primary font-inter-bold text-2xl text-center tracking-wider">
                  {order.ussdCode}
                </Text>
                <Text className={`font-inter text-center text-sm mt-2 ${isDarkMode ? "text-gray-400" : "text-text-secondary"}`}>
                  Dial this code on your phone to pay
                </Text>
              </View>
            </View>

            {/* Payment Proof Card */}
            <View className={`rounded-2xl overflow-hidden ${isDarkMode ? "bg-gray-800" : "bg-white"}`} style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.1,
              shadowRadius: 16,
              elevation: 8
            }}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                className="p-4"
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <View className="bg-white/20 rounded-full p-2 mr-3">
                      <Text className="text-white text-lg">📧</Text>
                    </View>
                    <Text className="text-white font-inter-bold text-lg">
                      Send Payment Proof
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(order.whatsappNumber)}
                    className="bg-white/20 rounded-full p-2 active:scale-95"
                  >
                    <Copy color="#FFFFFF" size={18} />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
              
              <View className="p-4">
                <Text className="text-secondary font-inter-bold text-lg text-center">
                  {order.whatsappNumber}
                </Text>
                <Text className={`font-inter text-center text-sm mt-2 ${isDarkMode ? "text-gray-400" : "text-text-secondary"}`}>
                  Send your payment screenshot to this email
                </Text>
              </View>
            </View>
          </View>

          {/* Beautiful Action Button */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/orders")}
            className="mb-8 active:scale-95 rounded-3xl overflow-hidden"
            style={{
              shadowColor: '#4F46E5',
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.4,
              shadowRadius: 20,
              elevation: 15
            }}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2', '#667eea']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="px-8 py-6 flex-row items-center justify-center"
            >
              <View className="items-center rounded-full p-3">
                <Text className="text-white font-inter-bold text-xl tracking-wide">
                  📋 View My Orders ✨
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Thank You Message */}
          <View className={`rounded-2xl p-6 mb-8 ${isDarkMode ? "bg-gray-800/50" : "bg-blue-50"}`}>
            <Text className={`font-inter text-center text-lg leading-7 ${isDarkMode ? "text-gray-300" : "text-blue-800"}`}>
              Thank you for choosing our service! 💙{"\n"}
              We'll take great care of your items and have them ready within 24 hours.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
