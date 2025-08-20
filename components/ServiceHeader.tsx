// ServiceHeader.tsx
import { View, Text } from "react-native";
import React from "react";

interface Props {
  title: string;
  description: string;
}

const ServiceHeader: React.FC<Props> = ({ title, description }) => {
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 16, color: "#4B5563" }}>
        {description}
      </Text>
    </View>
  );
};

export default ServiceHeader;
