// CalculatorScreen.tsx
// Main calculator input with presets + searchable wire picker

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { calculateVoltageDrop } from '@wiringcode/calculators';
import { getWireProperty } from '@wiringcode/nec-engine';
import { DEFAULT_PRESETS } from '../services/presets';
import * as Haptics from '../utils/haptics';

export default function CalculatorScreen({ navigation }: any) {
  const [phase, setPhase] = useState<1 | 3>(1);
  const [voltage, setVoltage] = useState('120');
  const [material, setMaterial] = useState('Copper');
  const [wireSize, setWireSize] = useState('#12');
  const [distance, setDistance] = useState('100');
  const [current, setCurrent] = useState('20');
  const [wireSearch, setWireSearch] = useState('');

  const WIRE_SIZES = ['#14', '#12', '#10', '#8', '#6', '#4', '#3', '#2', '#1', '1/0', '2/0', '3/0', '4/0'];

  const filteredWireSizes = WIRE_SIZES.filter((size) =>
    size.toLowerCase().includes(wireSearch.toLowerCase().replace('#', ''))
  );

  const applyPreset = (preset: any) => {
    setPhase(preset.phase);
    setVoltage(String(preset.voltage));
    setMaterial(preset.material);
    setWireSize(preset.wireSize);
  };

  const handleCalculate = () => {
    const distanceNum = parseFloat(distance);
    const currentNum = parseFloat(current);
    if (isNaN(distanceNum) || distanceNum <= 0) {
      Haptics.error();
      Alert.alert('Invalid Input', 'Distance must be greater than 0');
      return;
    }
    if (isNaN(currentNum) || currentNum <= 0) {
      Haptics.error();
      Alert.alert('Invalid Input', 'Current must be greater than 0');
      return;
    }
    Haptics.medium();
    const wireProp = getWireProperty(wireSize, material as any);
    if (!wireProp) return;

    const input = {
      phase,
      voltage: parseFloat(voltage),
      material,
      wireSize,
      distance: parseFloat(distance),
      current: parseFloat(current),
    };

    const result = calculateVoltageDrop({
      voltage: input.voltage,
      amperage: input.current,
      oneWayLength: input.distance,
      phase,
      resistancePerKFT: wireProp.resistancePerKFT,
    });

    navigation.navigate('Result', { input, result });
  };

  const canCalculate = !!voltage && !!wireSize && !!distance && !!current;
  const VOLTAGES = [120, 208, 240, 277, 480];

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>Calculator</Text>

      {/* Presets */}
      <Text style={s.label}>Quick Presets</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.pillRow}>
        {DEFAULT_PRESETS.map((preset: any) => (
          <TouchableOpacity key={preset.id} style={s.presetPill} onPress={() => applyPreset(preset)}>
            <Text style={s.presetText}>{preset.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Phase */}
      <Text style={s.label}>Phase</Text>
      <View style={s.row}>
        {[{ label: '1-Phase', value: 1 }, { label: '3-Phase', value: 3 }].map((p) => (
          <TouchableOpacity
            key={p.value}
            style={[s.bigButton, phase === p.value && s.bigButtonActive]}
            onPress={() => setPhase(p.value as 1 | 3)}
          >
            <Text style={[s.bigButtonText, phase === p.value && s.bigButtonTextActive]}>
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Voltage */}
      <Text style={s.label}>Voltage (V)</Text>
      <View style={s.row}>
        {VOLTAGES.map((v) => (
          <TouchableOpacity
            key={v}
            style={[s.pill, voltage === String(v) && s.pillActive]}
            onPress={() => setVoltage(String(v))}
          >
            <Text style={[s.pillText, voltage === String(v) && s.pillTextActive]}>
              {v}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={s.input}
        value={voltage}
        onChangeText={setVoltage}
        keyboardType="numeric"
        placeholder="Other voltage..."
        placeholderTextColor="#888"
      />

      {/* Material */}
      <Text style={s.label}>Material</Text>
      <View style={s.row}>
        {['Copper', 'Aluminum'].map((m) => (
          <TouchableOpacity
            key={m}
            style={[s.bigButton, material === m && s.bigButtonActive]}
            onPress={() => setMaterial(m)}
          >
            <Text style={[s.bigButtonText, material === m && s.bigButtonTextActive]}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Wire Size with Search */}
      <Text style={s.label}>Wire Size</Text>
      <TextInput
        style={s.input}
        value={wireSearch}
        onChangeText={setWireSearch}
        placeholder="Search wire size (e.g., 12, 500)..."
        placeholderTextColor="#888"
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.pillRow}>
        {(wireSearch ? filteredWireSizes : WIRE_SIZES).map((size) => (
          <TouchableOpacity
            key={size}
            style={[s.pill, wireSize === size && s.pillActive]}
            onPress={() => setWireSize(size)}
          >
            <Text style={[s.pillText, wireSize === size && s.pillTextActive]}>{size}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Distance */}
      <Text style={s.label}>One-Way Distance (ft)</Text>
      <TextInput
        style={s.bigInput}
        value={distance}
        onChangeText={setDistance}
        keyboardType="numeric"
        placeholder="e.g. 150"
      />

      {/* Current */}
      <Text style={s.label}>Current (A)</Text>
      <TextInput
        style={s.bigInput}
        value={current}
        onChangeText={setCurrent}
        keyboardType="numeric"
        placeholder="e.g. 20"
      />

      {/* Calculate */}
      <TouchableOpacity style={[s.calculateButton, !canCalculate && s.calculateButtonDisabled]} onPress={handleCalculate} disabled={!canCalculate}>
        <Text style={s.calculateButtonText}>CALCULATE</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  content: { padding: 20, paddingBottom: 40 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 16 },
  label: { color: '#888', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  pillRow: { flexDirection: 'row', marginBottom: 12 },
  pill: { borderWidth: 1, borderColor: '#333', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14, marginRight: 8, marginBottom: 8 },
  pillActive: { borderColor: '#4fc3f7', backgroundColor: '#0d2836' },
  pillText: { color: '#aaa', fontSize: 14 },
  pillTextActive: { color: '#4fc3f7', fontWeight: '700' },
  presetPill: { backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: '#333', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14, marginRight: 8 },
  presetText: { color: '#fff', fontSize: 13 },
  bigButton: { flex: 1, borderWidth: 1, borderColor: '#333', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 8 },
  bigButtonActive: { borderColor: '#66bb6a', backgroundColor: '#1b3a1b' },
  bigButtonText: { color: '#aaa', fontSize: 16, fontWeight: '600' },
  bigButtonTextActive: { color: '#66bb6a' },
  input: { borderWidth: 1, borderColor: '#333', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, color: '#fff', fontSize: 16, marginBottom: 8 },
  bigInput: { borderWidth: 1, borderColor: '#333', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 16, color: '#fff', fontSize: 18, marginBottom: 8 },
  calculateButton: { backgroundColor: '#4fc3f7', borderRadius: 12, paddingVertical: 18, alignItems: 'center', marginTop: 24 },
  calculateButtonDisabled: { backgroundColor: '#1a3a4a' },
  calculateButtonText: { color: '#000', fontSize: 18, fontWeight: '800' },
});
