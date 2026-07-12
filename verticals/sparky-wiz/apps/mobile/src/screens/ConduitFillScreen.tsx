// ConduitFillScreen.tsx
// Input for Conduit Fill calculation per NEC Chapter 9

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { calculateConduitFill } from '@wiringcode/calculators';
import { WIRE_DATA, CONDUIT_DATA } from '@wiringcode/nec-engine';

interface WireEntry {
  size: string;
  quantity: number;
}

const CONDUIT_TYPES = [...new Set(CONDUIT_DATA.map(c => c.conduitType))];
const ALL_WIRE_SIZES = [...new Set(WIRE_DATA.map(w => w.wireSize))];

export default function ConduitFillScreen({ navigation }: any) {
  const [conduitType, setConduitType] = useState<string>('EMT');
  const [conduitSize, setConduitSize] = useState<string>('1/2');
  const [wires, setWires] = useState<WireEntry[]>([{ size: '#12', quantity: 1 }]);

  const availableSizes = CONDUIT_DATA
    .filter(c => c.conduitType === conduitType)
    .map(c => c.tradeSize);

  const handleAddWire = () => {
    setWires(prev => [...prev, { size: '#12', quantity: 1 }]);
  };

  const handleRemoveWire = (index: number) => {
    setWires(prev => prev.filter((_, i) => i !== index));
  };

  const handleWireChange = (index: number, field: 'size' | 'quantity', value: string | number) => {
    const updated = [...wires];
    updated[index] = { ...updated[index], [field]: value };
    setWires(updated);
  };

  const handleWireSizeChange = (index: number) => {
    const currentSize = wires[index].size;
    const currentIdx = ALL_WIRE_SIZES.indexOf(currentSize);
    const nextIdx = (currentIdx + 1) % ALL_WIRE_SIZES.length;
    const nextSize = ALL_WIRE_SIZES[nextIdx];
    handleWireChange(index, 'size', nextSize);
  };

  const handleCalculate = () => {
    const conduitProp = CONDUIT_DATA.find(c => c.conduitType === conduitType && c.tradeSize === conduitSize);
    if (!conduitProp) return;

    const wireAreas: Record<string, number> = {};
    WIRE_DATA.forEach(w => {
      wireAreas[w.wireSize] = w.thhnAreaSqIn;
    });

    const result = calculateConduitFill(
      { conduitType, conduitSize, wires },
      wireAreas,
      conduitProp.internalAreaSqIn
    );

    navigation.navigate('ConduitFillResult', {
      input: { conduitType, conduitSize, wires },
      result,
    });
  };

  const renderWireItem = (entry: WireEntry, index: number) => (
    <View key={index} style={s.wireRow}>
      <View style={s.wireInfo}>
        <TouchableOpacity style={s.picker} onPress={() => handleWireSizeChange(index)}>
          <Text style={s.pickerText}>{entry.size}</Text>
        </TouchableOpacity>
      </View>
      <View style={s.stepperRow}>
        <TouchableOpacity
          style={s.stepperBtn}
          onPress={() => handleWireChange(index, 'quantity', Math.max(1, entry.quantity - 1))}
        >
          <Text style={s.stepperBtnText}>-</Text>
        </TouchableOpacity>
        <Text style={s.stepperCount}>{entry.quantity}</Text>
        <TouchableOpacity
          style={s.stepperBtn}
          onPress={() => handleWireChange(index, 'quantity', entry.quantity + 1)}
        >
          <Text style={s.stepperBtnText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.removeBtn} onPress={() => handleRemoveWire(index)}>
          <Text style={s.removeBtnText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>Conduit Fill</Text>

      {/* Conduit Type */}
      <Text style={s.sectionTitle}>Conduit Type</Text>
      <View style={s.row}>
        {CONDUIT_TYPES.map(t => (
          <TouchableOpacity
            key={t}
            style={[s.pill, conduitType === t && s.pillActive]}
            onPress={() => {
              setConduitType(t);
              const sizes = CONDUIT_DATA.filter(c => c.conduitType === t).map(c => c.tradeSize);
              setConduitSize(sizes[0]);
            }}
          >
            <Text style={[s.pillText, conduitType === t && s.pillTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conduit Size */}
      <Text style={s.sectionTitle}>Conduit Size</Text>
      <View style={s.row}>
        {availableSizes.map(size => (
          <TouchableOpacity
            key={size}
            style={[s.pill, conduitSize === size && s.pillActive]}
            onPress={() => setConduitSize(size)}
          >
            <Text style={[s.pillText, conduitSize === size && s.pillTextActive]}>{size}"</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Wires */}
      <Text style={s.sectionTitle}>Wires</Text>
      {wires.map(renderWireItem)}
      <TouchableOpacity style={s.addWireBtn} onPress={handleAddWire}>
        <Text style={s.addWireBtnText}>+ Add Wire</Text>
      </TouchableOpacity>

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
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { borderWidth: 1, borderColor: '#333', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14, marginBottom: 8 },
  pillActive: { borderColor: '#4fc3f7', backgroundColor: '#0d2836' },
  pillText: { color: '#aaa', fontSize: 14 },
  pillTextActive: { color: '#4fc3f7', fontWeight: '700' },
  wireRow: { backgroundColor: '#111', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#222' },
  wireInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  picker: { backgroundColor: '#1a1a2e', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14, borderWidth: 1, borderColor: '#333' },
  pickerText: { color: '#fff', fontSize: 14 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepperBtn: { backgroundColor: '#1a1a2e', borderRadius: 8, width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#333' },
  stepperBtnText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  stepperCount: { color: '#fff', fontSize: 16, fontWeight: '700', minWidth: 28, textAlign: 'center' },
  removeBtn: { marginLeft: 'auto' },
  removeBtnText: { color: '#ef5350', fontSize: 14 },
  addWireBtn: { borderWidth: 1, borderColor: '#333', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  addWireBtnText: { color: '#aaa', fontSize: 14, fontWeight: '700' },
  calcBtn: { backgroundColor: '#4fc3f7', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 20 },
  calcBtnText: { color: '#000', fontSize: 16, fontWeight: '700' },
});
