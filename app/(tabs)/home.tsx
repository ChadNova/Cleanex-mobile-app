import { supabase } from '@/lib/supabase';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/contexts/ThemeContext';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Shirt, House as HomeIcon, Bell, TrendingUp, Clock, Star, ArrowRight, Sparkles } from 'lucide-react-native';
import { useToast } from '@/components/ToastProvider';
import { API_CONFIG } from '@/config/config';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const services = [
  {
    id: 'laundry',
    name: 'Laundry Services',
    icon: Shirt,
    color: '#4F46E5',
    bgColor: '#EEF2FF',
    description: 'Professional washing & ironing',
    gradient: ['#4F46E5', '#7C3AED'],
  },
  {
    id: 'house_cleaning',
    name: 'House Cleaning',
    icon: HomeIcon,
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    description: 'Complete home cleaning service',
    gradient: ['#F59E0B', '#EF4444'],
  },
];

export default function HomeScreen() {
  const { showToast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userObj = session.user;
        setUser(userObj);
        await AsyncStorage.setItem('user', JSON.stringify(userObj));

        const token = session.access_token;
        if (token && userObj.id) {
          loadRecentOrders(userObj.id, token);
        }
      }
    };
    
    init();
  }, []);

  const loadRecentOrders = async (userId: string, accessToken: string) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/orders/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && Array.isArray(result.orders)) {
        setRecentOrders(
          result.orders
            .sort((a: { created_at: string }, b: { created_at: string }) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )
            .slice(0, 2)
        );
      } else {
        console.error('Failed to fetch recent orders:', result?.error);
      }
    } catch (err) {
      console.error('Error fetching recent orders:', err);
    }
  };

  const handleServicePress = (service: any) => {
    if (service.id === 'laundry') {
      router.push('/screens/LaundryServices');
    } else if (service.id === 'house_cleaning') {
      router.push('/screens/HouseCleaningServices');
    } else {
      showToast({
        message: 'Service not available',
        type: 'error',
        duration: 3000
      });
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header with Gradient */}
        <View className={`px-6 pt-8 pb-8 mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Subtle floating elements */}
          <View className="absolute top-4 right-4 opacity-10">
            <Sparkles color={isDarkMode ? '#FFFFFF' : '#4F46E5'} size={24} />
          </View>
          <View className="absolute top-12 right-12 opacity-8">
            <Star color={isDarkMode ? '#FFFFFF' : '#4F46E5'} size={16} />
          </View>
          
          {/* User Greeting */}
          <View className="mb-8">
            <Text className={`text-sm font-inter tracking-wide uppercase mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {getGreeting()}
            </Text>
            <Text className={`text-4xl font-inter-bold tracking-tight mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Hey {user?.user_metadata?.full_name?.split(' ')[0] || 'Student'}! 👋
            </Text>
            <View className="flex-row items-center">
              <View className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse" />
              <Text className={`text-lg font-inter ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Ready to make your day easier
              </Text>
            </View>
          </View>

          {/* Modern Service Card */}
          <View className={`rounded-3xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
            <View className="flex-row items-start justify-between mb-4">
              <View className="flex-1">
                <Text className={`text-2xl font-inter-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  What needs cleaning today?
                </Text>
                <Text className={`text-lg font-inter leading-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Professional services at your fingertips
                </Text>
              </View>
              <View className={`rounded-2xl p-3 ${isDarkMode ? 'bg-primary/20' : 'bg-primary/10'}`}>
                <Sparkles color="#4F46E5" size={24} />
              </View>
            </View>
            
            {/* Stats Row */}
            <View className="flex-row items-center justify-between pt-4">
              <View className="flex-row items-center">
                <View className="flex-row items-center">
                  <Clock color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={14} />
                  <Text className={`text-sm font-inter ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    24h max
                  </Text>
                </View>
              </View>
              <View className={`rounded-full px-4 py-2 ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
                <Text className={`font-inter-bold text-sm ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                  Available Now
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="px-6 mb-8">
          <View className="flex-row justify-between">
            <View className={`flex-1 rounded-2xl p-4 mr-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 }}>
              <View className="flex-row items-center mb-2">
                <TrendingUp color="#10B981" size={20} />
                <Text className={`ml-2 font-inter-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Orders</Text>
              </View>
              <Text className="text-2xl font-inter-bold text-primary">{recentOrders.length}</Text>
              <Text className={`text-sm font-inter ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>This month</Text>
            </View>

            <View className={`flex-1 rounded-2xl p-4 ml-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 }}>
              <View className="flex-row items-center mb-2">
                <Star color="#F59E0B" size={20} />
                <Text className={`ml-2 font-inter-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Rating</Text>
              </View>
              <Text className="text-2xl font-inter-bold text-accent">4.9</Text>
              <Text className={`text-sm font-inter ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Average</Text>
            </View>
          </View>
        </View>

        {/* Services */}
        <View className="px-6 mb-8">
          <View className="flex-row justify-between items-center mb-6">
            <Text className={`text-2xl font-inter-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Our Services
            </Text>
          </View>

          <View className="space-y-4">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <TouchableOpacity
                  key={service.id}
                  className={`rounded-3xl overflow-hidden active:scale-98 mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                  onPress={() => handleServicePress(service)}
                  style={{ 
                    shadowColor: '#000', 
                    shadowOffset: { width: 0, height: 4 }, 
                    shadowOpacity: 0.1, 
                    shadowRadius: 12, 
                    elevation: 5 
                  }}
                >  
                  <View className="p-6">
                    <View className="flex-row items-center">
                      <View
                        className="w-16 h-16 rounded-2xl items-center justify-center mr-4">
                        <IconComponent color={service.color} size={28} />
                      </View>

                      <View className="flex-1">
                        <Text className={`text-xl font-inter-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {service.name}
                        </Text>
                        <Text className={`font-inter mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {service.description}
                        </Text>
                        
                        <View className="flex-row items-center">
                          <View className="bg-primary/10 rounded-full px-4 py-2 mr-3">
                            <Text className="text-primary font-inter-bold text-sm">
                              Book Now
                            </Text>
                          </View>
                          <View className="flex-row items-center">
                            <Clock color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={14} />
                            <Text className={`ml-1 text-sm font-inter ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              24h max
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Recent Orders */}
        <View className="px-6 pb-8">
          <Text className={`text-2xl font-inter-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent Orders
          </Text>

          {recentOrders.length === 0 ? (
            <View className={`rounded-3xl p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 }}>
              <View className="items-center">
                <View className="bg-primary/10 rounded-full p-6 mb-4">
                  <Shirt color="#4F46E5" size={32} />
                </View>
                <Text className={`font-inter-bold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  No orders yet
                </Text>
                <Text className={`font-inter text-center mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Start your first cleaning service today!
                </Text>
                
                <View className="flex-row space-x-3">
                  <TouchableOpacity
                    onPress={() => router.push('/screens/LaundryServices')}
                    className="bg-primary px-6 py-3 mr-2 rounded-xl flex-1"
                  >
                    <Text className="text-white text-center font-inter-bold">Laundry</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => router.push('/screens/HouseCleaningServices')}
                    className="bg-accent px-6 py-3 rounded-xl flex-1"
                  >
                    <Text className="text-white text-center font-inter-bold">Cleaning</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View>
              {recentOrders.map((order) => (
                <TouchableOpacity
                  key={order.id}
                  onPress={() => router.push('/(tabs)/orders')}
                  className={`rounded-2xl p-5 mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                  style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 }}
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <Text className={`font-inter-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {order.services?.name || order.service_id}
                    </Text>
                    <View className="bg-green-100 rounded-full px-3 py-1">
                      <Text className="text-green-800 font-inter-bold text-xs">Completed</Text>
                    </View>
                  </View>
                  
                  <View className="flex-row justify-between items-center">
                    <Text className={`font-inter ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {order.total_price} RWF
                    </Text>
                    <Text className={`font-inter text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Intl.DateTimeFormat('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      }).format(new Date(order.created_at))}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}