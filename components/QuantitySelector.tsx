// components/QuantitySelector.tsx
import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Minus, Plus } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface QuantitySelectorProps {
  label: string;
  quantity: number;
  setQuantity: (qty: number) => void;
  unit?: string; // optional, if not passed will use label pluralized
}

export default function QuantitySelector({ label, quantity, setQuantity, unit }: QuantitySelectorProps) {
  const { isDarkMode } = useTheme();

  const displayUnit = unit || (label.toLowerCase());

  return (
    <View className={`rounded-2xl p-6 shadow-sm border mb-6 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-surface border-gray-100"}`}>
      <Text className={`text-lg font-inter-bold mb-4 ${isDarkMode ? "text-white" : "text-text"}`}>
        {label}
      </Text>
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => setQuantity(Math.max(0, quantity - 1))}
          className="bg-primary/10 rounded-full p-3"
        >
          <Minus color="#4F46E5" size={20} />
        </TouchableOpacity>

        <View className="flex-1 mx-4">
          <TextInput
            className={`rounded-xl px-4 py-3 text-center text-2xl font-inter-bold ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-50 text-text"}`}
            value={quantity.toString()}
            onChangeText={(text) => {
              const num = parseInt(text) || 0;
              setQuantity(num);
            }}
            keyboardType="numeric"
            placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
            selectTextOnFocus={true}
          />
        </View>

        <TouchableOpacity
          onPress={() => setQuantity(quantity + 1)}
          className="bg-primary/10 rounded-full p-3"
        >
          <Plus color="#4F46E5" size={20} />
        </TouchableOpacity>
      </View>
      <Text className={`font-inter text-center mt-4 ${isDarkMode ? "text-gray-300" : "text-text-secondary"}`}>
        {quantity} {displayUnit}
      </Text>
    </View>
  );
}
