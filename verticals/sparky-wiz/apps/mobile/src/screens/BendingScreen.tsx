// BendingScreen.tsx
// Input for Conduit Bending calculation

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import * as Haptics from '../utils/haptics';
import { calculateBending } from '@wiringcode/calculators';

const BEND_ANGLES = [30, 45, 60];
const CONDUIT_SIZES = ['1/2', '3/4', '1', '1-1/4', '1-1/2', '2', '2-1/2', '3', '3-1/2', '4'];

type BendingMode = 'stub' | 'offset';

export default function BendingScreen({ navigation }: any) {
  const [mode, setMode] = useState<BendingMode>('stub');
  const [bendAngle, setBendAngle] = useState<number>(30);
  const [conduitSize, setConduitSize] = useState<string>('1/2');
  const [stubLength, setStubLength] = useState<string>('');
  const [offsetHeight, setOffsetHeight] = useState<string>('');

  const handleCalculate = () => {
    if (mode === 'stub' && (!stubLength || parseFloat(stubLength) <= 0)) {
      Haptics.error();
      Alert.alert('Invalid Input', 'Please enter a valid stub length');
      return;
    }
    if (mode === 'offset' && (!offsetHeight || parseFloat(offsetHeight) <= 0)) {
      Haptics.error();
      Alert.alert('Invalid Input', 'Please enter a valid offset height');
      return;
    }
    Haptics.medium();
    const input: any = {
      conduitType: 'EMT',
      conduitSize,
      bendAngle,
    };

    if (mode === 'stub' && stubLength) {
      input.stubLength = parseFloat(stubLength);
    } else if (mode === 'offset' && offsetHeight) {
      input.offsetHeight = parseFloat(offsetHeight);
    }

    const result = calculateBending(input);
    navigation.navigate('BendingResult', { input: { mode, conduitSize, bendAngle, ...input }, result });
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>Conduit Bending</Text>

      {/* Mode Selector */}
      <Text style={s.sectionTitle}>Mode</Text>
      <View style={s.row}>
        <TouchableOpacity style={[s.pill, mode === 'stub' && s.pillActive]} onPress={() => setMode('stub')}>
          <Text style={[s.pillText, mode === 'stub' && s.pillTextActive]}>Stub</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.pill, mode === 'offset' && s.pillActive]} onPress={() => setMode('offset')}>
          <Text style={[s.pillText, mode === 'offset' && s.pillTextActive]}>Offset</Text>
        </TouchableOpacity>
      </View>

      {/* Bend Angle */}
      <Text style={s.sectionTitle}>Bend Angle</Text>
      <View style={s.row}>
        {BEND_ANGLES.map(angle => (
          <TouchableOpacity key={angle} style={[s.pill, bendAngle === angle && s.pillActive]} onPress={() => setBendAngle(angle)}>
            <Text style={[s.pillText, bendAngle === angle && s.pillTextActive]}>{angle}°</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conduit Size */}
      <Text style={s.sectionTitle}>Conduit Size</Text>
      <View style={s.row}>
        {CONDUIT_SIZES.map(size => (
          <TouchableOpacity key={size} style={[s.pill, conduitSize === size && s.pillActive]} onPress={() => setConduitSize(size)}>
            <Text style={[s.pillText, conduitSize === size && s.pillTextActive]}>{size}"</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Mode-specific input */}
      {mode === 'stub' ? (
        <>
          <Text style={s.sectionTitle}>Stub Length (inches)</Text>
          <TextInput
            style={s.input}
            keyboardType="numeric"
            value={stubLength}
            onChangeText={setStubLength}
            placeholder="e.g., 12"
            placeholderTextColor="#555"
          />
        </>
      ) : (
        <>
          <Text style={s.sectionTitle}>Offset Height (inches)</Text>
          <TextInput
            style={s.input}
            keyboardType="numeric"
            value={offsetHeight}
            onChangeText={setOffsetHeight}
            placeholder="e.g., 4"
            placeholderTextColor="#555"
          />
        </>
      )}

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
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { borderWidth: 1, borderColor: '#333', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14, marginBottom: 8 },
  pillActive: { borderColor: '#4fc3f7', backgroundColor: '#0d2836' },
  pillText: { color: '#aaa', fontSize: 14 },
  pillTextActive: { color: '#4fc3f7', fontWeight: '700' },
  input: { backgroundColor: '#111', borderRadius: 12, padding: 16, color: '#fff', fontSize: 16, borderWidth: 1, borderColor: '#222', marginBottom: 12 },
  calcBtn: { backgroundColor: '#4fc3f7', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 20 },
  calcBtnText: { color: '#000', fontSize: 16, fontWeight: '700' },
});
