// BoxFillScreen.tsx
// Input for Box Fill calculation per NEC

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { calculateBoxFill } from '@wiringcode/calculators';

const BOX_SIZES = ['4x4x1.5', '4x4x2.125', '4x4x2.25', '4-11/16x1.5', '4-11/16x2.125', '3x2x1.5', '3x2x2', '3x2x2.25', '3x2x2.5', '3x2x3', '4x2x1.5', 'onegang', 'twogang', 'threegang', 'fourgang'];

export default function BoxFillScreen({ navigation }: any) {
  const [boxSize, setBoxSize] = useState<string>('4x4x1.5');
  const [conductorCount, setConductorCount] = useState<number>(4);
  const [clampCount, setClampCount] = useState<number>(0);
  const [supportFittings, setSupportFittings] = useState<number>(0);
  const [deviceCount, setDeviceCount] = useState<number>(0);
  const [equipmentGrounds, setEquipmentGrounds] = useState<number>(1);

  const Stepper = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
    <View style={step.row}>
      <Text style={step.label}>{label}</Text>
      <View style={step.controls}>
        <TouchableOpacity style={step.btn} onPress={() => onChange(Math.max(0, value - 1))}>
          <Text style={step.btnText}>-</Text>
        </TouchableOpacity>
        <Text style={step.value}>{value}</Text>
        <TouchableOpacity style={step.btn} onPress={() => onChange(value + 1)}>
          <Text style={step.btnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleCalculate = () => {
    const input = {
      boxType: 'standard',
      boxSize,
      conductorCount,
      clampCount,
      supportFittings,
      deviceCount,
      equipmentGrounds,
    };

    const result = calculateBoxFill(input);
    navigation.navigate('BoxFillResult', { input, result });
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>Box Fill</Text>

      <Text style={s.sectionTitle}>Box Size</Text>
      <View style={s.row}>
        {BOX_SIZES.map(size => (
          <TouchableOpacity
            key={size}
            style={[s.pill, boxSize === size && s.pillActive]}
            onPress={() => setBoxSize(size)}
          >
            <Text style={[s.pillText, boxSize === size && s.pillTextActive]}>{size}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Stepper label="Conductors" value={conductorCount} onChange={setConductorCount} />
      <Stepper label="Clamps" value={clampCount} onChange={setClampCount} />
      <Stepper label="Support Fittings" value={supportFittings} onChange={setSupportFittings} />
      <Stepper label="Devices (switch/receptacle)" value={deviceCount} onChange={setDeviceCount} />
      <Stepper label="Equipment Grounds" value={equipmentGrounds} onChange={setEquipmentGrounds} />

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
  calcBtn: { backgroundColor: '#4fc3f7', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 20 },
  calcBtnText: { color: '#000', fontSize: 16, fontWeight: '700' },
});

const step = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#222' },
  label: { color: '#fff', fontSize: 15 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  btn: { backgroundColor: '#1a1a2e', borderRadius: 8, width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#333' },
  btnText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  value: { color: '#fff', fontSize: 16, fontWeight: '700', minWidth: 28, textAlign: 'center' },
});
