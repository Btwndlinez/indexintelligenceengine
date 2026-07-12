// CalculatorListScreen.tsx
// Entry point to choose between available calculators

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CalculatorItem {
  key: string;
  label: string;
  description: string;
}

const calculators: CalculatorItem[] = [
  {
    key: 'voltageDrop',
    label: 'Voltage Drop',
    description: 'Calculate voltage drop for a given circuit',
  },
  {
    key: 'conduitFill',
    label: 'Conduit Fill',
    description: 'Check if wires fit inside a conduit per NEC',
  },
  {
    key: 'ampacity',
    label: 'Ampacity',
    description: 'Calculate wire ampacity with derating factors',
  },
  {
    key: 'boxFill',
    label: 'Box Fill',
    description: 'Check if a box is overfilled per NEC',
  },
  {
    key: 'bending',
    label: 'Bending',
    description: 'Calculate conduit bend measurements',
  },
];

export default function CalculatorListScreen({ navigation }: any) {
  const handlePress = (key: string) => {
    if (key === 'voltageDrop') {
      navigation.navigate('Calculator');
    } else if (key === 'conduitFill') {
      navigation.navigate('ConduitFill');
    } else if (key === 'ampacity') {
      navigation.navigate('Ampacity');
    } else if (key === 'boxFill') {
      navigation.navigate('BoxFill');
    } else if (key === 'bending') {
      navigation.navigate('Bending');
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Select Calculator</Text>
      {calculators.map((calc) => (
        <TouchableOpacity key={calc.key} style={s.card} onPress={() => handlePress(calc.key)}>
          <Text style={s.label}>{calc.label}</Text>
          <Text style={s.desc}>{calc.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a', padding: 20, paddingTop: 40 },
  title: { color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 20 },
  card: { backgroundColor: '#111', borderRadius: 12, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#222' },
  label: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 6 },
  desc: { color: '#888', fontSize: 13 },
});
