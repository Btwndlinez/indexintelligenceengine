import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { bootApp } from './src/services/boot';
import CalculatorListScreen from './src/screens/CalculatorListScreen';
import CalculatorScreen from './src/screens/CalculatorScreen';
import ResultScreen from './src/screens/ResultScreen';
import ConduitFillScreen from './src/screens/ConduitFillScreen';
import ConduitFillResultScreen from './src/screens/ConduitFillResultScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AmpacityScreen from './src/screens/AmpacityScreen';
import AmpacityResultScreen from './src/screens/AmpacityResultScreen';
import BoxFillScreen from './src/screens/BoxFillScreen';
import BoxFillResultScreen from './src/screens/BoxFillResultScreen';
import BendingScreen from './src/screens/BendingScreen';
import BendingResultScreen from './src/screens/BendingResultScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CalculatorStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CalculatorList" component={CalculatorListScreen} />
      <Stack.Screen name="Calculator" component={CalculatorScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
      <Stack.Screen name="ConduitFill" component={ConduitFillScreen} />
      <Stack.Screen name="ConduitFillResult" component={ConduitFillResultScreen} />
      <Stack.Screen name="Ampacity" component={AmpacityScreen} />
      <Stack.Screen name="AmpacityResult" component={AmpacityResultScreen} />
      <Stack.Screen name="BoxFill" component={BoxFillScreen} />
      <Stack.Screen name="BoxFillResult" component={BoxFillResultScreen} />
      <Stack.Screen name="Bending" component={BendingScreen} />
      <Stack.Screen name="BendingResult" component={BendingResultScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    bootApp().then(() => setBooted(true)).catch(console.error);
  }, []);

  if (!booted) {
    return <View style={{ flex: 1, backgroundColor: '#0a0a1a' }} />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: '#111', borderTopColor: '#222' },
          tabBarActiveTintColor: '#4fc3f7',
          tabBarInactiveTintColor: '#555',
        }}
      >
        <Tab.Screen
          name="CalcTab"
          component={CalculatorStack}
          options={{ title: 'Calculator' }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: 'History' }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
