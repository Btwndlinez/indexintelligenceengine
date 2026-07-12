// ConduitFillResultScreen.tsx
// Displays the Conduit Fill calculation results

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Haptics from '../utils/haptics';
import { calculationRepository } from '../repositories/calculation-repository';

export default function ConduitFillResultScreen({ route, navigation }: any) {
  const { input, result } = route.params;
  const isPass = result.isCompliant;

  const handleSave = async () => {
    await calculationRepository.save(input, result, 'conduitFill');
    Haptics.success();
    Alert.alert('Saved', 'Calculation saved to history');
  };

  const explanation = isPass
    ? 'Conduit fill is within NEC limit.'
    : 'WARNING: Conduit fill exceeds NEC limit. Use larger conduit or reduce wire count.';

  return (
    <View style={s.container}>
      <View style={[s.card, isPass ? s.passCard : s.failCard]}>
        <Text style={s.cardLabel}>NEC Standard</Text>
        <Text style={s.cardValue}>{isPass ? 'PASS' : 'FAIL'}</Text>
      </View>

      <View style={s.metricRow}>
        <View style={s.metricCard}>
          <Text style={s.metricLabel}>Fill %</Text>
          <Text style={[s.metricValue, isPass ? s.passText : s.failText]}>
            {result.fillPercentage.toFixed(2)}%
          </Text>
        </View>
        <View style={s.metricCard}>
          <Text style={s.metricLabel}>Max Allowed</Text>
          <Text style={s.metricValue}>{(result.maxFillPercentage * 100).toFixed(0)}%</Text>
        </View>
      </View>

      <View style={s.metricCard}>
        <Text style={s.metricLabel}>Wire Area</Text>
        <Text style={s.metricValue}>{result.totalWireArea.toFixed(4)} sq in</Text>
      </View>

      <View style={s.metricCard}>
        <Text style={s.metricLabel}>Max Allowed Area</Text>
        <Text style={s.metricValue}>{result.maxAllowedArea.toFixed(4)} sq in</Text>
      </View>

      <View style={s.explanationCard}>
        <Text style={s.explanationTitle}>NEC Check</Text>
        <Text style={s.explanationText}>{explanation}</Text>
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
  card: { borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 16 },
  passCard: { backgroundColor: '#1b3a1b', borderWidth: 2, borderColor: '#66bb6a' },
  failCard: { backgroundColor: '#3a1b1b', borderWidth: 2, borderColor: '#ef5350' },
  cardLabel: { color: '#aaa', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  cardValue: { color: '#fff', fontSize: 32, fontWeight: '800', marginTop: 4 },
  metricRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  metricCard: { flex: 1, backgroundColor: '#111', borderRadius: 12, padding: 16 },
  metricLabel: { color: '#888', fontSize: 11, textTransform: 'uppercase', marginBottom: 4 },
  metricValue: { color: '#fff', fontSize: 20, fontWeight: '700' },
  passText: { color: '#66bb6a' },
  failText: { color: '#ef5350' },
  explanationCard: { backgroundColor: '#111', borderRadius: 12, padding: 16, marginBottom: 12 },
  explanationTitle: { color: '#fff', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  explanationText: { color: '#aaa', fontSize: 13, lineHeight: 20 },
  secondaryButton: { borderWidth: 1, borderColor: '#444', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  secondaryButtonText: { color: '#aaa', fontSize: 14 },
  actionButton: { backgroundColor: '#4fc3f7', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  actionButtonText: { color: '#000', fontSize: 16, fontWeight: '700' },
});
