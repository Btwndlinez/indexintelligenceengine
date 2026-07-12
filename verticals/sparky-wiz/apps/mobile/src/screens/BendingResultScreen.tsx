// BendingResultScreen.tsx
// Displays the Conduit Bending calculation results

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Haptics from '../utils/haptics';
import { calculationRepository } from '../repositories/calculation-repository';

export default function BendingResultScreen({ route, navigation }: any) {
  const { result, input } = route.params;
  const { shrink, bendMark, takeUp, totalLength } = result;
  const isStub = input.mode === 'stub';

  const handleSave = async () => {
    await calculationRepository.save(input, result, 'bending');
    Haptics.success();
    Alert.alert('Saved', 'Calculation saved to history');
  };

  return (
    <View style={s.container}>
      <View style={s.card}>
        <Text style={s.cardLabel}>{isStub ? 'Stub Bend' : 'Offset Bend'}</Text>
        <Text style={s.cardValue}>{isStub ? bendMark.toFixed(2) : totalLength.toFixed(2)} in</Text>
      </View>

      <View style={s.metricRow}>
        <View style={s.metricCard}>
          <Text style={s.metricLabel}>Take-Up</Text>
          <Text style={s.metricValue}>{takeUp} in</Text>
        </View>
        <View style={s.metricCard}>
          <Text style={s.metricLabel}>Shrink</Text>
          <Text style={s.metricValue}>{shrink.toFixed(2)} in</Text>
        </View>
      </View>

      {isStub && (
        <View style={s.metricCard}>
          <Text style={s.metricLabel}>Bend Mark</Text>
          <Text style={s.metricValue}>{bendMark.toFixed(2)} in</Text>
        </View>
      )}

      <View style={s.metricCard}>
        <Text style={s.metricLabel}>Total Length</Text>
        <Text style={s.metricValue}>{totalLength.toFixed(2)} in</Text>
      </View>

      <TouchableOpacity style={s.actionButton} onPress={handleSave}>
        <Text style={s.actionButtonText}>Save to History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.secondaryButton} onPress={() => navigation.goBack()}>
        <Text style={s.secondaryButtonText}>New Calculation</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a', padding: 20, paddingTop: 40 },
  card: { backgroundColor: '#111', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#222' },
  cardLabel: { color: '#aaa', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  cardValue: { color: '#fff', fontSize: 32, fontWeight: '800', marginTop: 4 },
  metricRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  metricCard: { flex: 1, backgroundColor: '#111', borderRadius: 12, padding: 16 },
  metricLabel: { color: '#888', fontSize: 11, textTransform: 'uppercase', marginBottom: 4 },
  metricValue: { color: '#fff', fontSize: 20, fontWeight: '700' },
  secondaryButton: { borderWidth: 1, borderColor: '#444', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  secondaryButtonText: { color: '#aaa', fontSize: 14 },
  actionButton: { backgroundColor: '#4fc3f7', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  actionButtonText: { color: '#000', fontSize: 16, fontWeight: '700' },
});
