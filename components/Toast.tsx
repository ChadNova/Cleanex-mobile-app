import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  Easing,
} from 'react-native';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info,
  Sparkles
} from 'lucide-react-native';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

const { width: screenWidth } = Dimensions.get('window');

export default function Toast({ 
  message, 
  type, 
  visible, 
  onHide, 
  duration = 4000 
}: ToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // Pulsing animation for icon
  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(0);
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      // Entry animation
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 10,
        }),
        Animated.spring(opacity, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 10,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 10,
        }),
      ]).start();

      // Progress bar animation
      Animated.timing(progress, {
        toValue: 1,
        duration,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start();

      // Auto-hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      hideToast();
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: -100,
        useNativeDriver: true,
        tension: 100,
        friction: 10,
      }),
      Animated.spring(opacity, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 10,
      }),
      Animated.spring(scale, {
        toValue: 0.9,
        useNativeDriver: true,
        tension: 100,
        friction: 10,
      }),
    ]).start(onHide);
  };

  const getToastConfig = () => {
    const configs = {
      success: {
        icon: CheckCircle,
        bgColor: 'rgba(16, 185, 129, 0.95)',
        borderColor: '#10b981',
        progressColor: '#059669',
        iconColor: '#ffffff',
        iconGlow: 'rgba(16, 185, 129, 0.5)',
      },
      error: {
        icon: XCircle,
        bgColor: 'rgba(239, 68, 68, 0.95)',
        borderColor: '#ef4444',
        progressColor: '#dc2626',
        iconColor: '#ffffff',
        iconGlow: 'rgba(239, 68, 68, 0.5)',
      },
      warning: {
        icon: AlertCircle,
        bgColor: 'rgba(245, 158, 11, 0.95)',
        borderColor: '#f59e0b',
        progressColor: '#d97706',
        iconColor: '#ffffff',
        iconGlow: 'rgba(245, 158, 11, 0.5)',
      },
      info: {
        icon: Info,
        bgColor: 'rgba(59, 130, 246, 0.95)',
        borderColor: '#3b82f6',
        progressColor: '#2563eb',
        iconColor: '#ffffff',
        iconGlow: 'rgba(59, 130, 246, 0.5)',
      },
    };
    return configs[type];
  };

  const config = getToastConfig();
  const IconComponent = config.icon;
  const iconScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.toast,
          {
            backgroundColor: config.bgColor,
            borderColor: config.borderColor,
            transform: [
              { translateY },
              { scale },
            ],
            opacity,
          },
        ]}
      >
        {/* Glowing icon background */}
        <Animated.View
          style={[
            styles.iconGlow,
            {
              backgroundColor: config.iconGlow,
              transform: [{ scale: iconScale }],
            },
          ]}
        />
        
        {/* Main content */}
        <View style={styles.content}>
          <Animated.View style={{ transform: [{ scale: iconScale }] }}>
            <IconComponent 
              size={24} 
              color={config.iconColor} 
              strokeWidth={2} 
              style={styles.icon}
            />
          </Animated.View>
          
          <Text style={styles.message} numberOfLines={2}>
            {message}
          </Text>
          
          {/* Sparkle effect for success messages */}
          {type === 'success' && (
            <View style={styles.sparkles}>
              <Sparkles size={16} color="#ffffff" style={styles.sparkle1} />
              <Sparkles size={12} color="#ffffff" style={styles.sparkle2} />
            </View>
          )}
        </View>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                backgroundColor: config.progressColor,
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 16,
    right: 16,
    zIndex: 9999,
    alignItems: 'center',
    elevation: 9999,
  },
  toast: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  iconGlow: {
    position: 'absolute',
    top: -20,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    position: 'relative',
  },
  icon: {
    marginRight: 15,
    zIndex: 1,
  },
  message: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 22,
    fontFamily: 'Inter-Regular',
  },
  progressContainer: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressBar: {
    height: '100%',
  },
  sparkles: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingRight: 15,
  },
  sparkle1: {
    position: 'absolute',
    top: 15,
    right: 10,
    opacity: 0.8,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 15,
    right: 20,
    opacity: 0.6,
  },
});