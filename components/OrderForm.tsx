import React from "react";
import { View, Text, TextInput } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface OrderFormProps {
  orderForm: {
    full_name: string;
    email: string;
    phone_number: string;
    address: string;
  };
  setOrderForm: React.Dispatch<React.SetStateAction<{
    full_name: string;
    email: string;
    phone_number: string;
    address: string;
  }>>;
}

export default function OrderForm({ orderForm, setOrderForm }: OrderFormProps) {
  const { isDarkMode } = useTheme();

  return (
    <View className={`rounded-2xl p-6 shadow-sm border mb-6 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-surface border-gray-100"}`}>
      <Text className={`text-lg font-inter-bold mb-4 ${isDarkMode ? "text-white" : "text-text"}`}>
        Order Details
      </Text>

      <View className="space-y-4">
        {["full_name", "email", "phone_number", "address"].map((field) => {
          const label = {
            full_name: "Full Name",
            email: "Email",
            phone_number: "Phone Number",
            address: "Address",
          }[field] ?? field;  // <-- fallback here

          const keyboardType = field === "email" ? "email-address" : field === "phone_number" ? "phone-pad" : "default";
          const multiline = field === "address";
          const numberOfLines = field === "address" ? 3: undefined;

          return (
            <View key={field}>
              <Text className={`font-inter mb-2 ${isDarkMode ? "text-gray-300" : "text-text-secondary"}`}>
                {label}
              </Text>
              <TextInput
                className={`rounded-xl px-4 py-3 font-inter ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-50 text-text"}`}
                value={orderForm[field as keyof typeof orderForm]}
                onChangeText={(text) => setOrderForm(prev => ({ ...prev, [field]: text }))}
                placeholder={`Enter your ${label.toLowerCase()}`}
                placeholderTextColor={isDarkMode? "#9CA3AF" : "#6B7280"}
                keyboardType={keyboardType}
                multiline={multiline}
                numberOfLines={numberOfLines}
              />
            </View>
          );
        })}

      </View>
    </View>
  );
}
