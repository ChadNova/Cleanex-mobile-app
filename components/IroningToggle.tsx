import React from "react";
import { View, Text, Switch } from "react-native";
import { BusFront as Iron } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface IroningToggleProps {
  includeIroning: boolean;
  setIncludeIroning: (val: boolean) => void;
  ironingPrice: number;
  unit: string;
}

export default function IroningToggle({ includeIroning, setIncludeIroning, ironingPrice, unit }: IroningToggleProps) {
  const { isDarkMode } = useTheme();

  return (
    <View className={`rounded-2xl p-6 shadow-sm border mb-6 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-surface border-gray-100"}`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className={`rounded-full p-3 mr-4 ${isDarkMode ? "bg-gray-700" : "bg-amber-100"}`}>
            <Iron color="#F59E0B" size={20} />
          </View>
          <View className="flex-1">
            <Text className={`text-lg font-inter-bold ${isDarkMode ? "text-white" : "text-text"}`}>
              Include Ironing
            </Text>
            <Text className={`font-inter ${isDarkMode ? "text-gray-300" : "text-text-secondary"}`}>
              +{ironingPrice} RWF per {unit.slice(0, -1)} (75% of washing price)
            </Text>
          </View>
        </View>
        <Switch
          value={includeIroning}
          onValueChange={setIncludeIroning}
          trackColor={{ false: isDarkMode ? "#374151" : "#E5E7EB", true: "#4F46E5" }}
          thumbColor={includeIroning ? "#FFFFFF" : "#FFFFFF"}
        />
      </View>
    </View>
  );
}
