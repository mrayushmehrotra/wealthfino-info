import React from 'react';
import { StatusBar, Text, View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import Toast from 'react-native-toast-message';

import ComplaintsScreen from './src/screens/ComplaintsScreen';
import ConsentScreen from './src/screens/ConsentScreen';
import { Colors } from './src/theme/colors';

// Enable native screens on iOS/Android only — web doesn't support react-native-screens
enableScreens(Platform.OS !== 'web');

const Tab = createBottomTabNavigator();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 1000 * 60 * 5 },
  },
});

/** Pill-shaped tab icon with emoji + active highlight */
function TabIcon({ emoji, focused }) {
  return (
    <View
      style={{
        width: 36,
        height: 28,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: focused ? Colors.primaryGlow : 'transparent',
        borderWidth: focused ? 1 : 0,
        borderColor: Colors.primaryDim,
      }}
    >
      <Text style={{ fontSize: 16 }}>{emoji}</Text>
    </View>
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
                  height: 64,
                  paddingBottom: 10,
                  paddingTop: 6,
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
                    <TabIcon emoji="📋" focused={focused} />
                  ),
                }}
              />
              <Tab.Screen
                name="Consent"
                component={ConsentScreen}
                options={{
                  tabBarLabel: 'Client Consent',
                  tabBarIcon: ({ focused }) => (
                    <TabIcon emoji="📄" focused={focused} />
                  ),
                }}
              />
            </Tab.Navigator>
          </NavigationContainer>

          {/* Global toast notifications */}
          <Toast />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
