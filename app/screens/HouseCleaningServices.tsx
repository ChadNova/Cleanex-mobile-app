// screens/HouseCleaningServices.tsx
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/contexts/ThemeContext";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import QuantitySelector from "@/components/QuantitySelector";
import PriceSummary from "@/components/PriceSummary";
import OrderForm from "@/components/OrderForm";
import OrderConfirmation from "@/components/OrderConfirmation";
import {useToast} from "@/components/ToastProvider";
import { API_CONFIG } from '@/config/config';
const services = {
  rooms: { name: "Rooms", price: 500, unit: "rooms" },
  livingRooms: { name: "Living Rooms", price: 1000, unit: "Living rooms" },
  toilets: { name: "Toilets", price: 500, unit: "toilets" },
  kitchen: { name: "Kitchen", price: 1500, unit: "kitchen" },
};

function getRoomsPricePerunit(): number {
  return services.rooms.price;
}

function getLivingRoomsPricePerunit(): number {
  return services.livingRooms.price;
}

function getToiletsPricePerunit(): number {
  return services.toilets.price;
}

function getKitchenPricePerunit(): number {
  return services.kitchen.price;
}

export default function HouseCleaningServices() {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  const [roomsQuantity, setRoomsQuantity] = useState(0);
  const [livingRoomsQuantity, setLivingRoomsQuantity] = useState(0);
  const [toiletsQuantity, setToiletsQuantity] = useState(0);
  const [kitchenQuantity, setKitchenQuantity] = useState(0);

  const [user, setUser] = useState<any>(null);
  const [orderForm, setOrderForm] = useState({ full_name: "", email: "", phone_number: "", address: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        const metadata = parsedUser.user_metadata || {};
        setUser(parsedUser);
        setOrderForm({
          full_name: metadata.full_name || "",
          email: parsedUser.email || "",
          phone_number: metadata.phone_number || "",
          address: metadata.address || "",
        });
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const generateUSSDCode = () => {
    const randomNumber = "001203";
    return `*182*8*1*${randomNumber}#`;
  };

  const handleSubmitOrder = async () => {
    if (!orderForm.full_name || !orderForm.email || !orderForm.phone_number || !orderForm.address) {
          showToast({
          message: 'Please fill in all fields in the order form.',
          type: 'info'
        });
      return;
    }

    if (roomsQuantity + livingRoomsQuantity + toiletsQuantity + kitchenQuantity <= 0) {
          showToast({
          message: 'Please enter a valid quantity greater than 0.',
          type: 'info'
        });
      return;
    }

    setIsSubmitting(true);
    try {
        // 🔐 Get Supabase session token
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData?.session?.access_token;
    
        if (!accessToken) {
              showToast({
              message: 'Unauthorized: You must be logged in to place an order.',
              type: 'error'
            });
          setIsSubmitting(false);
          return;
      }
      
        const  roomsPrice = roomsQuantity * services.rooms.price;
        const livingRoomsPrice = livingRoomsQuantity * services.livingRooms.price;   
        const toiletsPrice = services.toilets.price * toiletsQuantity;
        const kitchenPrice = services.kitchen.price * kitchenQuantity;
        const total = roomsPrice + livingRoomsPrice + toiletsPrice + kitchenPrice;
        const ussdCode = generateUSSDCode();


        const payload = {
          service_id: "house_cleaning",
          rooms: roomsQuantity,
          living_rooms: livingRoomsQuantity,
          toilets: toiletsQuantity,
          kitchens: kitchenQuantity,
          total_price: total,
        }

      const response = await fetch(`${API_CONFIG.BASE_URL}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.error("❌ Server responded with:", errorData);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();

        setOrderConfirmation({
          serviceName: "House Cleaning",
            services: [
              { label: "Rooms", quantity: roomsQuantity, pricePerUnit: services.rooms.price, unit: services.rooms.unit },
              { label: "Living Rooms", quantity: livingRoomsQuantity, pricePerUnit: services.livingRooms.price, unit: services.livingRooms.unit },
              { label: "Toilets", quantity: toiletsQuantity, pricePerUnit: services.toilets.price, unit: services.toilets.unit },
              { label: "Kitchen + dishes", quantity: kitchenQuantity, pricePerUnit: services.kitchen.price, unit: services.kitchen.unit },
            ],
            total,
            ussdCode,
            whatsappNumber: "cleanex.chadnova@gmail.com",
            date: new Date().toISOString()
            });
              } catch (error) {
                console.error("Failed to submit order:", error);
                    showToast({
                    message: 'Failed to submit order. Please try again.',
                    type: 'error'
                  });
              } finally {
                setIsSubmitting(false);
              }
      };

  if (orderConfirmation) {
    return (
      <SafeAreaView className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-background"}`}>
        <OrderConfirmation
          order={orderConfirmation}
          onBack={() => setOrderConfirmation(null)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-background"}`}>
      <ScrollView className="flex-1">
        <View className="px-6 py-8">
          <TouchableOpacity onPress={() => router.back()} className="mb-8 active:scale-95">
            <ArrowLeft color={isDarkMode ? "#FFFFFF" : "#4F46E5"} size={24} />
          </TouchableOpacity>

          <Text
            className={`text-3xl font-inter-bold mb-2 ${
              isDarkMode ? "text-white" : "text-text"
            }`}
          >
            House Cleaning Services
          </Text>
          <Text
            className={`font-inter mb-8 ${
              isDarkMode ? "text-gray-300" : "text-text-secondary"
            }`}
          >
            Select quantity of rooms, living rooms, toilets, and kitchen + dishes to clean.
          </Text>

          {/* Quantity selectors */}
          <QuantitySelector
            quantity={roomsQuantity}
            setQuantity={setRoomsQuantity}
            label={`Rooms`}
          />
          <QuantitySelector
            quantity={livingRoomsQuantity}
            setQuantity={setLivingRoomsQuantity}
            label={`Living Rooms`}
          />
          <QuantitySelector
            quantity={toiletsQuantity}
            setQuantity={setToiletsQuantity}
            label={`Toilets`}
          />
          <QuantitySelector
            quantity={kitchenQuantity}
            setQuantity={setKitchenQuantity}
            label={`Kitchen + dishes`}
          />

          {/* Price summary */}
          <PriceSummary
            services={[
              { label: "Rooms", quantity: roomsQuantity, pricePerUnit: getRoomsPricePerunit(), unit: services.rooms.unit},
              { label: "Living Rooms", quantity: livingRoomsQuantity, pricePerUnit: getLivingRoomsPricePerunit(), unit: services.livingRooms.unit },
              { label: "Toilets", quantity: toiletsQuantity, pricePerUnit: getToiletsPricePerunit(), unit: services.toilets.unit },
              { label: "Kitchen + dishes", quantity: kitchenQuantity, pricePerUnit: getKitchenPricePerunit(), unit: services.kitchen.unit },
            ]}
          />

          {/* Order form */}
          <OrderForm orderForm={orderForm} setOrderForm={setOrderForm} />

          <TouchableOpacity
            onPress={handleSubmitOrder}
            disabled={isSubmitting || roomsQuantity + livingRoomsQuantity + toiletsQuantity + kitchenQuantity <= 0}
            className="bg-primary rounded-xl py-4 shadow-lg active:scale-95"
          >
            <Text className="text-white font-inter-bold text-center text-lg">
              {isSubmitting
                ? "Submitting Order..."
                : roomsQuantity + livingRoomsQuantity + toiletsQuantity + kitchenQuantity <= 0
                ? "Enter Valid Quantity"
                : "Submit Order"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
