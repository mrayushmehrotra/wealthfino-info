import React from 'react';
import { StatusBar, Text, View, Platform, Pressable, Linking, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import Toast from 'react-native-toast-message';

import ComplaintsScreen from './src/screens/ComplaintsScreen';
import ConsentScreen from './src/screens/ConsentScreen';
import ContactScreen from './src/screens/ContactScreen';
import TradeCardsScreen from './src/screens/TradeCardsScreen';
import { Colors } from './src/theme/colors';

// Enable native screens on iOS/Android only — web doesn't support react-native-screens
enableScreens(Platform.OS !== 'web');

const Tab = createBottomTabNavigator();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 1000 * 60 * 5 },
  },
});

/** Minimal tab badge that keeps the UI restrained and readable. */
function TabIcon({ label, focused }) {
  return (
    <View
      style={{
        width: 36,
        height: 28,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: focused ? Colors.primaryGlow : 'transparent',
        borderWidth: focused ? 1 : 0,
        borderColor: Colors.primaryDim,
      }}
    >
      <Text style={{ fontSize: 11, fontWeight: '800', color: focused ? Colors.primary : Colors.tabInactive, letterSpacing: 0.6 }}>
        {label}
      </Text>
    </View>
  );
}

function WhatsAppButton() {
  const handlePress = async () => {
    const url = 'https://wa.me/919883455700';
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Contact us on WhatsApp"
      onPress={handlePress}
      style={styles.whatsappButton}
    >
      <Text style={styles.whatsappIcon}>WA</Text>
    </Pressable>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer
            theme={{
              dark: true,
              colors: {
                primary: Colors.primary,
                background: Colors.bg,
                card: Colors.bgCard,
                text: Colors.textPrimary,
                border: Colors.border,
                notification: Colors.primary,
              },
              fonts: {
                regular: { fontFamily: 'System', fontWeight: '400' },
                medium:  { fontFamily: 'System', fontWeight: '500' },
                bold:    { fontFamily: 'System', fontWeight: '700' },
                heavy:   { fontFamily: 'System', fontWeight: '900' },
              },
            }}
          >
            {Platform.OS !== 'web' && (
              <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
            )}

            <Tab.Navigator
              screenOptions={{
                headerShown: false,
                tabBarStyle: {
                  backgroundColor: Colors.bgCard,
                  borderTopColor: Colors.border,
                  borderTopWidth: 1,
                  height: 68,
                  paddingBottom: 10,
                  paddingTop: 8,
                },
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.tabInactive,
                tabBarLabelStyle: {
                  fontSize: 11,
                  fontWeight: '700',
                  letterSpacing: 0.4,
                },
              }}
            >
              <Tab.Screen
                name="Complaints"
                component={ComplaintsScreen}
                options={{
                  tabBarLabel: 'Complaints',
                  tabBarIcon: ({ focused }) => (
                    <TabIcon label="CR" focused={focused} />
                  ),
                }}
              />
              <Tab.Screen
                name="TradeCards"
                component={TradeCardsScreen}
                options={{
                  tabBarLabel: 'Trade Cards',
                  tabBarIcon: ({ focused }) => (
                    <TabIcon label="TC" focused={focused} />
                  ),
                }}
              />
              <Tab.Screen
                name="Consent"
                component={ConsentScreen}
                options={{
                  tabBarLabel: 'Client Consent',
                  tabBarIcon: ({ focused }) => (
                    <TabIcon label="CC" focused={focused} />
                  ),
                }}
              />
              <Tab.Screen
                name="Contact"
                component={ContactScreen}
                options={{
                  tabBarLabel: 'Contact',
                  tabBarIcon: ({ focused }) => (
                    <TabIcon label="CT" focused={focused} />
                  ),
                }}
              />
            </Tab.Navigator>
          </NavigationContainer>

          {/* Global toast notifications */}
          <Toast />

          <WhatsAppButton />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  whatsappButton: {
    position: 'absolute',
    right: 16,
    bottom: 86,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    zIndex: 50,
  },
  whatsappIcon: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
});
