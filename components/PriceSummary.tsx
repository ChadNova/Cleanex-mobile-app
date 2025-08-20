// components/PriceSummary.tsx
import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface ServiceItem {
  label: string;
  quantity: number;
  pricePerUnit: number;
  unit: string;
  isBatchPrice?: boolean; // Add this new prop
}

interface PriceSummaryProps {
  services: ServiceItem[];
  includeIroning?: boolean;
  ironingPrice?: number;
}

export default function PriceSummary({
  services,
  includeIroning = false,
  ironingPrice = 0,
}: PriceSummaryProps) {
  const { isDarkMode } = useTheme();

  // Calculate totals
  const washingTotal = services.reduce((sum, svc) => {
    if (svc.label.toLowerCase() === "clothes") {
      return sum + svc.pricePerUnit; // Use batch price directly for clothes
    }
    return sum + (svc.pricePerUnit * svc.quantity); // Multiply for per-unit items
  }, 0);

  const total = washingTotal + (includeIroning ? ironingPrice : 0);

  return (
    <View className={`rounded-2xl p-6 mb-6 ${isDarkMode ? "bg-primary/20" : "bg-primary/10"}`}>
      <View>
        {services.map(({ label, quantity, pricePerUnit, unit }) => {
          const isClothes = label.toLowerCase() === "clothes";
          const displayPrice = isClothes 
            ? pricePerUnit // Show batch price directly for clothes
            : quantity * pricePerUnit; // Multiply for other items

          return (
            <View key={label} className="flex-row justify-between items-center mb-2">
              <Text className="text-primary font-inter">
                 {quantity} {unit} {isClothes ? "" : `× ${pricePerUnit} RWF`}
              </Text>
              <Text className="text-primary font-inter">
                {displayPrice} RWF
              </Text>
            </View>
          );
        })}

        {includeIroning && (
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-primary font-inter">
              Ironing Service
            </Text>
            <Text className="text-primary font-inter">
              {ironingPrice} RWF
            </Text>
          </View>
        )}

        <View className={`border-t pt-2 mt-2 ${isDarkMode ? "border-primary/30" : "border-primary/20"}`}>
          <View className="flex-row justify-between items-center">
            <Text className="text-primary font-inter-bold text-lg">
              Total Price
            </Text>
            <Text className="text-primary font-inter-bold text-2xl">
              {total} RWF
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}