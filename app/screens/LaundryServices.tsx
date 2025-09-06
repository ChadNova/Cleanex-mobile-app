import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/contexts/ThemeContext";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import QuantitySelector from "@/components/QuantitySelector";
import IroningToggle from "@/components/IroningToggle";
import PriceSummary from "@/components/PriceSummary";
import OrderForm from "@/components/OrderForm";
import OrderConfirmation from "@/components/OrderConfirmation";
import { useToast } from "@/components/ToastProvider";
import { API_CONFIG } from '@/config/config';


const services = {
  shoes: { name: "Washing Shoes", price: 300, unit: "pairs" },
};

// Function to get clothes price per unit based on quantity ranges
function getClothesPricePerUnit(quantity: number): number {
  if (quantity >= 101) return 10000;
  if (quantity >= 76) return 7000;
  if (quantity >= 51) return 5500;
  if (quantity >= 21) return 4000;
  if (quantity > 0) return 2000;
  return 0;
}



export default function LaundryServices() {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();

  // Quantities
  const [clothesQuantity, setClothesQuantity] = useState(0);
  const [shoeQuantity, setQuantity] = useState(0);
  const [includeIroning, setIncludeIroning] = useState(false);

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
    return `*182*1*1*${randomNumber}#`;
  };

 const handleSubmitOrder = async () => {
  if (!orderForm.full_name || !orderForm.email || !orderForm.phone_number || !orderForm.address) {
      showToast({
      message: 'Please fill in all fields in the order form.',
      type: 'info'
    });
    return;
  }

  if (clothesQuantity + shoeQuantity <= 0) {
        showToast({
        message: 'Please enter a valid quantity for clothes or shoes.',
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
          message: 'You are not logged in. Please log in to submit an order.',
          type: 'error'
        });
      setIsSubmitting(false);
      return;
    }

    const clothesPrice = getClothesPricePerUnit(clothesQuantity);
    const shoesPrice = services.shoes.price;
    const ironingTotal = includeIroning
      ? Math.round(clothesPrice * 0.75) // Calculate as 75% of clothes TOTAL price
      : 0;
    
    const washingTotal = clothesPrice + (shoeQuantity * shoesPrice);
    const total = washingTotal + ironingTotal;
    const ussdCode = generateUSSDCode();

    const payload = {
      service_id: "washing_clothes",
      quantity: clothesQuantity,
      shoe_count: shoeQuantity,
      ironing: includeIroning,
    };
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // ✅ Include token
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Server responded with:", errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

      const responseData = await response.json();

          // Optionally attach confirmation
     setOrderConfirmation({
      serviceName: "Clothes Laundry",
      services: [
        {
          label: "Clothes",
          quantity: clothesQuantity,
          pricePerUnit: clothesPrice,
          unit: "items",
        },
        {
          label: "Shoes",
          quantity: shoeQuantity,
          pricePerUnit: shoesPrice,
          unit: "pairs",
        }
      ],
      includeIroning,
      ironingPrice: ironingTotal, // Pass the total ironing price
      total,
      ussdCode,
      whatsappNumber: "cleanex.chadnova@gmail.com",
    });


      } catch (error) {
        console.error("Failed to submit order:", error);
            showToast({
            message: 'Failed to submit order. Please try again later.',
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            className="flex-1"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
          >
            <View className="px-6 py-8">
          <TouchableOpacity onPress={() => router.back()} className="mb-8 active:scale-95">
            <ArrowLeft color={isDarkMode ? "#FFFFFF" : "#4F46E5"} size={24} />
          </TouchableOpacity>

          <Text
            className={`text-3xl font-inter-bold mb-2 ${
              isDarkMode ? "text-white" : "text-text"
            }`}
          >
            Laundry Services
          </Text>
          <Text
            className={`font-inter mb-8 ${
              isDarkMode ? "text-gray-300" : "text-text-secondary"
            }`}
          >
            Select quantity of clothes and shoes to wash, and whether to include ironing.
          </Text>

          {/* Clothes Quantity */}
          <QuantitySelector
            quantity={clothesQuantity}
            setQuantity={setClothesQuantity}
            label={`Clothes (items)`}
          />

          {/* Shoes Quantity */}
          <QuantitySelector
            quantity={shoeQuantity}
            setQuantity={setQuantity}
            label={`Shoes (pairs)`}
          />

          {/* Ironing Toggle */}
          <IroningToggle
            includeIroning={includeIroning}
            setIncludeIroning={setIncludeIroning}
            ironingPrice={Math.round(getClothesPricePerUnit(clothesQuantity) * 0.75)}
            unit="items"
          />

          {/* Combined Price Summary */}
      <PriceSummary
  services={[
    { 
      label: "Clothes", 
      quantity: clothesQuantity, 
      pricePerUnit: getClothesPricePerUnit(clothesQuantity), // This is the batch price
      unit: "items",
      isBatchPrice: true // Mark as batch price
    },
    { 
      label: "Shoes", 
      quantity: shoeQuantity, 
      pricePerUnit: services.shoes.price, // Per-unit price
      unit: "pairs" 
    }
  ]}
  includeIroning={includeIroning}
  ironingPrice={includeIroning ? Math.round(getClothesPricePerUnit(clothesQuantity) * 0.75) : 0}
/>

          {/* Order Form */}
          <OrderForm orderForm={orderForm} setOrderForm={setOrderForm} />

          <TouchableOpacity
            onPress={handleSubmitOrder}
            disabled={isSubmitting || clothesQuantity + shoeQuantity <= 0}
            className="bg-primary rounded-xl py-4 shadow-lg active:scale-95"
          >
            <Text className="text-white font-inter-bold text-center text-lg">
              {isSubmitting
                ? "Submitting Order..."
                : clothesQuantity + shoeQuantity <= 0
                ? "Enter Valid Quantity"
                : "Submit Order"}
            </Text>
          </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
