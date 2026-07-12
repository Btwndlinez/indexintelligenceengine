// AmpacityResultScreen.tsx
// Displays the Ampacity calculation results

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Haptics from '../utils/haptics';
import { calculationRepository } from '../repositories/calculation-repository';

export default function AmpacityResultScreen({ route, navigation }: any) {
  const { input, result } = route.params;
  const { baseAmpacity, tempDeratingFactor, conduitFillDeratingFactor, adjustedAmpacity, recommendedBreakerSize } = result;
  const isPass = adjustedAmpacity > 0;

  const handleSave = async () => {
    await calculationRepository.save(input, result, 'ampacity');
    Haptics.success();
    Alert.alert('Saved', 'Calculation saved to history');
  };

  return (
    <View style={s.container}>
      <View style={[s.card, isPass ? s.passCard : s.failCard]}>
        <Text style={s.cardLabel}>Adjusted Ampacity</Text>
        <Text style={s.cardValue}>{adjustedAmpacity.toFixed(1)} A</Text>
      </View>

      <View style={s.metricCard}>
        <Text style={s.metricLabel}>Base Ampacity (with temp derating)</Text>
        <Text style={s.metricValue}>{baseAmpacity.toFixed(1)} A</Text>
      </View>

      <View style={s.metricRow}>
        <View style={s.metricCard}>
          <Text style={s.metricLabel}>Temp Derating</Text>
          <Text style={s.metricValue}>{tempDeratingFactor.toFixed(2)}x</Text>
        </View>
        <View style={s.metricCard}>
          <Text style={s.metricLabel}>Conduit Fill Derating</Text>
          <Text style={s.metricValue}>{conduitFillDeratingFactor.toFixed(2)}x</Text>
        </View>
      </View>

      <View style={s.metricCard}>
        <Text style={s.metricLabel}>Recommended Breaker</Text>
        <Text style={[s.metricValue, s.breakerText]}>{recommendedBreakerSize} A</Text>
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
  breakerText: { color: '#4fc3f7' },
  secondaryButton: { borderWidth: 1, borderColor: '#444', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  secondaryButtonText: { color: '#aaa', fontSize: 14 },
  actionButton: { backgroundColor: '#4fc3f7', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  actionButtonText: { color: '#000', fontSize: 16, fontWeight: '700' },
});
