// AmpacityScreen.tsx
// Input for Ampacity calculation per NEC tables

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { calculateAmpacity } from '@wiringcode/calculators';

const WIRE_SIZES = ['14', '12', '10', '8', '6', '4', '3', '2', '1', '1/0', '2/0', '3/0', '4/0', '250', '300', '350', '400', '500'];
const TEMP_RATINGS = [60, 75, 90];

export default function AmpacityScreen({ navigation }: any) {
  const [wireSize, setWireSize] = useState<string>('12');
  const [tempRating, setTempRating] = useState<number>(75);
  const [ambientTemp, setAmbientTemp] = useState<string>('30');
  const [conduitCount, setConduitCount] = useState<string>('3');
  const [isUnderground, setIsUnderground] = useState<boolean>(false);

  const handleCalculate = () => {
    const input = {
      wireSize,
      insulationType: 'THHN',
      temperatureRating: tempRating,
      ambientTemp: parseInt(ambientTemp, 10) || 30,
      conduitFillCount: parseInt(conduitCount, 10) || 3,
      isUnderground,
    };

    const result = calculateAmpacity(input);
    navigation.navigate('AmpacityResult', { input, result });
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>Ampacity</Text>

      {/* Wire Size */}
      <Text style={s.sectionTitle}>Wire Size (AWG / kcmil)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.scrollRow}>
        {WIRE_SIZES.map(size => (
          <TouchableOpacity
            key={size}
            style={[s.pill, wireSize === size && s.pillActive]}
            onPress={() => setWireSize(size)}
          >
            <Text style={[s.pillText, wireSize === size && s.pillTextActive]}>{size}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Temperature Rating */}
      <Text style={s.sectionTitle}>Temperature Rating</Text>
      <View style={s.row}>
        {TEMP_RATINGS.map(t => (
          <TouchableOpacity
            key={t}
            style={[s.pill, tempRating === t && s.pillActive]}
            onPress={() => setTempRating(t)}
          >
            <Text style={[s.pillText, tempRating === t && s.pillTextActive]}>{t}°C</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Ambient Temperature */}
      <Text style={s.sectionTitle}>Ambient Temperature (°C)</Text>
      <TextInput
        style={s.input}
        keyboardType="numeric"
        value={ambientTemp}
        onChangeText={setAmbientTemp}
        placeholder="30"
        placeholderTextColor="#555"
      />

      {/* Conductor Count */}
      <Text style={s.sectionTitle}>Current-Carrying Conductors in Conduit</Text>
      <TextInput
        style={s.input}
        keyboardType="numeric"
        value={conduitCount}
        onChangeText={setConduitCount}
        placeholder="3"
        placeholderTextColor="#555"
      />

      {/* Underground Toggle */}
      <Text style={s.sectionTitle}>Installation</Text>
      <View style={s.row}>
        <TouchableOpacity style={[s.pill, !isUnderground && s.pillActive]} onPress={() => setIsUnderground(false)}>
          <Text style={[s.pillText, !isUnderground && s.pillTextActive]}>Aboveground</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.pill, isUnderground && s.pillActive]} onPress={() => setIsUnderground(true)}>
          <Text style={[s.pillText, isUnderground && s.pillTextActive]}>Underground</Text>
        </TouchableOpacity>
      </View>

      {/* Calculate */}
      <TouchableOpacity style={s.calcBtn} onPress={handleCalculate}>
        <Text style={s.calcBtnText}>Calculate</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  content: { padding: 20, paddingTop: 40, paddingBottom: 40 },
  title: { color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 20 },
  sectionTitle: { color: '#888', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 },
  scrollRow: { flexDirection: 'row', marginBottom: 12 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { borderWidth: 1, borderColor: '#333', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14, marginBottom: 8 },
  pillActive: { borderColor: '#4fc3f7', backgroundColor: '#0d2836' },
  pillText: { color: '#aaa', fontSize: 14 },
  pillTextActive: { color: '#4fc3f7', fontWeight: '700' },
  input: { backgroundColor: '#111', borderRadius: 12, padding: 16, color: '#fff', fontSize: 16, borderWidth: 1, borderColor: '#222', marginBottom: 12 },
  calcBtn: { backgroundColor: '#4fc3f7', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 20 },
  calcBtnText: { color: '#000', fontSize: 16, fontWeight: '700' },
});
