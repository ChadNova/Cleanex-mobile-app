import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToast } from '@/components/ToastProvider';
import { Clock, CircleCheck as CheckCircle, Circle as XCircle, Copy } from 'lucide-react-native';
import { Shirt } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '@/contexts/ThemeContext';
import { API_CONFIG } from '@/config/config';
import { router } from 'expo-router';
export default function OrdersScreen() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const { isDarkMode } = useTheme();

  // Load user and token from AsyncStorage on mount
  useEffect(() => {
    async function loadUserAndToken() {
      try {
        const userJson = await AsyncStorage.getItem('user');
        const tokenStored = await AsyncStorage.getItem('token');

        if (userJson) {
          setUser(JSON.parse(userJson));
        }
        if (tokenStored) {
          setToken(tokenStored);
        }
      } catch (error) {
        console.error('Error loading user/token:', error);
      }
    }
    loadUserAndToken();
  }, []);

  // Reload orders whenever user and token are set
  useEffect(() => {
    if (user && token) {
      loadOrders();
    }
  }, [user, token]);

  const loadOrders = async () => {
    try {
      if (!token) throw new Error("User not logged in");
      if (!user?.id) throw new Error("User ID not found");

      // If your backend expects userId in URL:
      const response = await fetch(`${API_CONFIG.BASE_URL}/orders/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const text = await response.text();

      // Try to parse JSON response
      const result = JSON.parse(text);

      if (!response.ok) throw new Error(result.error || "Failed to fetch orders");

      setOrders(result.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
      showToast({
      message: 'Copied to clipboard!',
      type: 'info'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock color="#F59E0B" size={20} />;
      case 'completed':
        return <CheckCircle color="#10B981" size={20} />;
      case 'cancelled':
        return <XCircle color="#EF4444" size={20} />;
      default:
        return <Clock color="#F59E0B" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-amber-600';
      case 'completed':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-amber-600';
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-background'}`}>
      <View className="flex-1">
        {/* Modern Header */}
        <View className={`px-6 pt-4 pb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4
        }}>
          <Text className={`text-3xl font-inter-bold ${isDarkMode ? 'text-white' : 'text-text'}`}>
            My Orders
          </Text>
          <Text className={`text-sm font-inter mt-1 ${isDarkMode ? 'text-gray-400' : 'text-text-secondary'}`}>
            Track your cleaning services
          </Text>
        </View>
        
        <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
          {orders.length === 0 ? (
            <View className={`rounded-3xl p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 6
            }}>
              <View className="items-center">
                <View className="bg-primary/10 rounded-full p-8 mb-6">
                  <Shirt color="#4F46E5" size={48} />
                </View>
                <Text className={`font-inter-bold text-xl mb-3 ${isDarkMode ? 'text-white' : 'text-text'}`}>
                  No orders yet
                </Text>
                <Text className={`font-inter text-center mb-8 leading-6 ${isDarkMode ? 'text-gray-400' : 'text-text-secondary'}`}>
                  Ready to get your first cleaning service? Start with our most popular options below.
                </Text>
                
                <View className="flex-row space-x-4 w-full">
                  <TouchableOpacity
                    onPress={() => router.push('/screens/LaundryServices')}
                    className="bg-primary px-6 py-4 mr-2 rounded-2xl flex-1 active:scale-95"
                    style={{
                      shadowColor: '#4F46E5',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                    }}
                  >
                    <Text className="text-white text-center font-inter-bold">Laundry</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => router.push('/screens/HouseCleaningServices')}
                    className="bg-accent px-6 py-4 rounded-2xl flex-1 active:scale-95"
                    style={{
                      shadowColor: '#F59E0B',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                    }}
                  >
                    <Text className="text-white text-center font-inter-bold">Cleaning</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View className="space-y-4">
              {orders.map((order) => (
                <View
                  key={order.id}
                  className={`rounded-3xl p-6 mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 6
                  }}
                >
                  <View className="flex-row justify-between items-start mb-4">
                    <View className="flex-1">
                      <Text className={`text-xl font-inter-bold mb-2 ${isDarkMode ? 'text-white' : 'text-text'}`}>
                        {order.services.name}
                      </Text>
                      {order.service_id === 'washing_clothes' ? (
                        <>
                          <Text className={`font-inter ${isDarkMode ? 'text-gray-300' : 'text-text-secondary'}`}>
                            {order.quantity} clothes
                          </Text>
                          {order.ironing && (
                            <Text className={`font-inter ${isDarkMode ? 'text-gray-300' : 'text-text-secondary'}`}>
                              + Ironing included
                            </Text>
                          )}
                          {order.shoe_count > 0 && (
                            <Text className={`font-inter ${isDarkMode ? 'text-gray-300' : 'text-text-secondary'}`}>
                              {order.shoe_count} shoes
                            </Text>
                          )}
                        </>
                      ) : order.service_id === 'house_cleaning' ? (
                        <>
                          {order.rooms > 0 && (
                            <Text className={`font-inter ${isDarkMode ? 'text-gray-300' : 'text-text-secondary'}`}>
                              {order.rooms} Room(s)
                            </Text>
                          )}
                          {order.living_rooms > 0 && (
                            <Text className={`font-inter ${isDarkMode ? 'text-gray-300' : 'text-text-secondary'}`}>
                              {order.living_rooms} Living Room(s)
                            </Text>
                          )}
                          {order.kitchens > 0 && (
                            <Text className={`font-inter ${isDarkMode ? 'text-gray-300' : 'text-text-secondary'}`}>
                              {order.kitchens} Kitchen(s)
                            </Text>
                          )}
                          {order.toilets > 0 && (
                            <Text className={`font-inter ${isDarkMode ? 'text-gray-300' : 'text-text-secondary'}`}>
                              {order.toilets} Toilet(s)
                            </Text>
                          )}
                        </>
                      ) : (
                        <Text className={`font-inter ${isDarkMode ? 'text-gray-300' : 'text-text-secondary'}`}>
                          Unknown service details
                        </Text>
                      )}
                    </View>
                    
                    <View className="flex-row items-center bg-yellow-100 px-3 py-2 rounded-full">
                      {getStatusIcon(order.status)}
                      <Text className={`ml-2 font-inter-bold capitalize text-sm ${getStatusColor(order.status)}`}>
                        {order.status}
                      </Text>
                    </View>
                  </View>
                  
                  <View className={`border-t pt-4 mb-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className={`font-inter ${isDarkMode ? 'text-gray-300' : 'text-text-secondary'}`}>Total</Text>
                      <Text className={`text-xl font-inter-bold ${isDarkMode ? 'text-white' : 'text-text'}`}>
                        {order.total_price} RWF
                      </Text>
                    </View>
                    
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className={`font-inter ${isDarkMode ? 'text-gray-300' : 'text-text-secondary'}`}>Order Date</Text>
                      <Text className={`font-inter ${isDarkMode ? 'text-white' : 'text-text'}`}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </Text>
                    </View>
                    
                    <View className="flex-row items-center mb-6">
                      <Clock color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={16} />
                      <Text className={`font-inter ml-2 ${isDarkMode ? 'text-gray-300' : 'text-text-secondary'}`}>
                        Estimated time: 24 hours max
                      </Text>
                    </View>
                  </View>
                  
                  <View className={`rounded-2xl p-4 mb-4 ${isDarkMode ? "bg-secondary/20" : "bg-secondary/10"}`}>
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-secondary font-inter-bold">USSD Payment Code</Text>
                      <TouchableOpacity onPress={() => copyToClipboard("*182*1*1*001203#")} className="flex-row items-center">
                        <Copy color="#10B981" size={16} />
                        <Text className="text-secondary font-inter ml-1">Copy</Text>
                      </TouchableOpacity>
                    </View>
                    <Text className="text-secondary font-inter-bold text-xl">{"*182*1*1*001203#"}</Text>
                  </View>
                  
                  <View className={`rounded-2xl p-4 ${isDarkMode ? "bg-accent/20" : "bg-accent/10"}`}>
                    <Text className="text-accent font-inter-bold mb-2">Payment proof</Text>
                    <View className="flex-row justify-between items-center">
                      <Text className="text-accent font-inter-bold text-lg">{"cleanex.chadnova@gmail.com"}</Text>
                      <TouchableOpacity onPress={() => copyToClipboard("cleanex.chadnova@gmail.com")} className="flex-row items-center">
                        <Copy color="#F59E0B" size={16} />
                        <Text className="text-accent font-inter ml-1">Copy</Text>
                      </TouchableOpacity>
                    </View>
                    <Text className={`font-inter text-sm mt-2 ${isDarkMode ? "text-accent/60" : "text-accent/80"}`}>
                      Send payment proof to this email
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
