// components/OrderConfirmation.tsx
import React from "react";
import {SafeAreaView, ScrollView, View, Text, TouchableOpacity } from "react-native";
import { ArrowLeft, Copy } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { useToast } from "@/components/ToastProvider";

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
        duration: 2000 // 2 seconds
      });
  };

const renderServiceDetails = () => {
  if (order.serviceName.toLowerCase().includes("laundry")) {
    const clothes = order.services.find(s => s.label.toLowerCase() === "clothes");
    const shoes = order.services.find(s => s.label.toLowerCase() === "shoes");

    const shoesTotal = shoes ? shoes.quantity * shoes.pricePerUnit : 0;
    const clothesTotal = clothes ? clothes.pricePerUnit : 0;
    const ironingTotal = order.includeIroning ? order.ironingPrice : 0; // Use the passed ironingPrice

    return (
      <>
        {shoes && (
          <Text className={`font-inter ${isDarkMode ? "text-gray-300" : "text-text-secondary"}`}>
            {shoes.label}: {shoes.quantity} {shoes.unit} × {shoes.pricePerUnit} RWF = {shoesTotal} RWF
          </Text>
        )}

        {clothes && (
          <Text className={`font-inter ${isDarkMode ? "text-gray-300" : "text-text-secondary"}`}>
            {clothes.label}: {clothes.quantity} {clothes.unit} = {clothesTotal} RWF
          </Text>
        )}

        {order.includeIroning && (
          <Text className={`font-inter ${isDarkMode ? "text-gray-300" : "text-text-secondary"}`}>
            Ironing: {ironingTotal} RWF
          </Text>
        )}
      </>
    );
  }

    // Generic fallback for all other services (e.g., House Cleaning)
    return order.services.map((s, index) => {
      const total = s.quantity * s.pricePerUnit;
      return (
        <Text
          key={index}
          className={`font-inter ${isDarkMode ? "text-gray-300" : "text-text-secondary"}`}
        >
          {s.label}: {s.quantity} × {s.pricePerUnit} RWF = {total} RWF
        </Text>
      );
    });
  };

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-background"}`}>
    <ScrollView className="flex-1 px-6 py-8">
      <TouchableOpacity onPress={onBack} className="mb-8 active:scale-95">
        <ArrowLeft color={isDarkMode ? "#FFFFFF" : "#4F46E5"} size={24} />
      </TouchableOpacity>

      <View className={`rounded-2xl p-6 shadow-sm border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-surface border-gray-100"}`}>
        <View className="items-center mb-6">
          <View className={`rounded-full p-6 mb-4 ${isDarkMode ? "bg-green-900/30" : "bg-green-100"}`}>
            <Text className="text-4xl">✅</Text>
          </View>
          <Text className={`text-2xl font-inter-bold mb-2 ${isDarkMode ? "text-white" : "text-text"}`}>
            Order Confirmed!
          </Text>
          <Text className={`font-inter text-center ${isDarkMode ? "text-gray-300" : "text-text-secondary"}`}>
            Your order has been submitted successfully
          </Text>
        </View>

        <View className={`rounded-xl p-4 mb-6 ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
          <Text className={`font-inter mb-2 ${isDarkMode ? "text-gray-300" : "text-text-secondary"}`}>
            Order Summary
          </Text>
          <Text className={`text-lg font-inter-bold ${isDarkMode ? "text-white" : "text-text"}`}>
            {order.serviceName}
          </Text>

          {renderServiceDetails()}

          <Text className="text-xl font-inter-bold text-primary mt-2">
            Total: {order.total} RWF
          </Text>
        </View>

        <View className={`rounded-xl p-4 mb-4 ${isDarkMode ? "bg-primary/20" : "bg-primary/10"}`}>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-primary font-inter-bold">USSD Payment Code</Text>
            <TouchableOpacity onPress={() => copyToClipboard(order.ussdCode)} className="flex-row items-center">
              <Copy color="#4F46E5" size={16} />
              <Text className="text-primary font-inter ml-1">Copy</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-primary font-inter-bold text-xl">{order.ussdCode}</Text>
        </View>

        <View className={`rounded-xl p-4 mb-6 ${isDarkMode ? "bg-secondary/20" : "bg-secondary/10"}`}>
          <Text className="text-secondary font-inter-bold mb-2">Payment proof</Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-secondary font-inter-bold text-lg">{order.whatsappNumber}</Text>
            <TouchableOpacity onPress={() => copyToClipboard(order.whatsappNumber)} className="flex-row items-center">
              <Copy color="#10B981" size={16} />
              <Text className="text-secondary font-inter ml-1">Copy</Text>
            </TouchableOpacity>
          </View>
          <Text className={`font-inter text-sm mt-2 ${isDarkMode ? "text-secondary/60" : "text-secondary/80"}`}>
            Send payment proof to this email
          </Text>
        </View>

        <TouchableOpacity onPress={() => router.push("/(tabs)/orders")} className="bg-primary rounded-xl py-4">
          <Text className="text-white font-inter-bold text-center">View My Orders</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
