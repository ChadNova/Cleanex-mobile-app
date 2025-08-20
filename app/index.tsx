import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated, Image, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles, Zap, Heart, ArrowRight, Star, Shield, Clock } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Pulsing animation for CTA
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleGetStarted = () => {
    router.push('/auth/login');
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Floating Background Elements */}
        <View style={styles.backgroundElements}>
          <View style={[styles.floatingIcon, { top: height * 0.15, left: width * 0.1 }]}>
            <Sparkles color="#FFFFFF" size={24} />
          </View>
          <View style={[styles.floatingIcon, { top: height * 0.2, right: width * 0.15 }]}>
            <Star color="#FFFFFF" size={20} />
          </View>
          <View style={[styles.floatingIcon, { top: height * 0.3, right: width * 0.1 }]}>
            <Zap color="#FFFFFF" size={18} />
          </View>
          <View style={[styles.floatingIcon, { bottom: height * 0.3, left: width * 0.15 }]}>
            <Heart color="#FFFFFF" size={16} />
          </View>
          <View style={[styles.floatingIcon, { bottom: height * 0.4, right: width * 0.25 }]}>
            <Shield color="#FFFFFF" size={18} />
          </View>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
          {/* Hero Section */}
          <Animated.View 
            style={[styles.heroContainer, { transform: [{ scale: scaleAnim }] }]}
          >
            <Image 
              source={require('@/assets/images/logo.png')} 
              style={styles.logoImage}
            />
            <Text style={styles.taglineText}>
              We wash it all: Clothes, Shoes, Dishes & Home
            </Text>
          </Animated.View>

          {/* Features Grid */}
          <View style={styles.featuresContainer}>
            {[
              { icon: Zap, title: 'Fast', subtitle: '24h max', color: '#FFD700' },
              { icon: Shield, title: 'Trusted', subtitle: 'Verified', color: '#10B981' },
              { icon: Heart, title: 'Quality', subtitle: 'Premium', color: '#EF4444' },
            ].map((feature, index) => (
              <Animated.View
                key={feature.title}
                style={[
                  styles.featureItem,
                  {
                    opacity: fadeAnim,
                    transform: [{
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 50],
                        outputRange: [0, 50 + (index * 10)],
                      })
                    }]
                  }
                ]}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)']}
                  style={[
                    styles.featureIconContainer,
                    { shadowColor: feature.color }
                  ]}
                >
                  <feature.icon color={feature.color} size={32} />
                </LinearGradient>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
              </Animated.View>
            ))}
          </View>

          {/* CTA Button */}
          <Animated.View 
            style={[
              styles.ctaContainer,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <TouchableOpacity
              onPress={handleGetStarted}
              activeOpacity={0.8}
              style={styles.ctaButton}
            >
              <LinearGradient
                colors={['#FFFFFF', '#F8FAFC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ctaGradient}
              >
                <Text style={styles.ctaText}>Get Started</Text>
                <View style={styles.ctaIconContainer}>
                  <ArrowRight color="#4F46E5" size={20} />
                </View>
              </LinearGradient>
              <View style={styles.ctaShadow} />
            </TouchableOpacity>
            
            <View style={styles.signupHint}>
              <Clock color="#FFFFFF" size={16} style={styles.clockIcon} />
              <Text style={styles.signupText}>Quick sign-up in under 2 minutes</Text>
            </View>
          </Animated.View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  backgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingIcon: {
    position: 'absolute',
    opacity: 0.15,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    minHeight: height,
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },

  logoImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },

  taglineText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  trustContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  starContainer: {
    flexDirection: 'row',
    marginRight: 16,
  },
  trustText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  trustDivider: {
    width: 4,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 2,
    marginHorizontal: 12,
  },
  trustCount: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontFamily: 'Inter',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 48,
    width: '100%',
    maxWidth: 400,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIconContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  featureTitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  featureSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontFamily: 'Inter',
  },
  ctaContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 24,
  },
  ctaButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 20,
  },
  ctaGradient: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaText: {
    color: '#4F46E5',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.5,
  },
  ctaIconContainer: {
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    borderRadius: 20,
    padding: 8,
  },
  ctaShadow: {
    position: 'absolute',
    bottom: -2,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
  },
  signupHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  clockIcon: {
    marginRight: 8,
  },
  signupText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontFamily: 'Inter',
  },
  bottomAccent: {
    position: 'absolute',
    bottom: 32,
    alignItems: 'center',
  },
  bottomAccentText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontFamily: 'Inter',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
});