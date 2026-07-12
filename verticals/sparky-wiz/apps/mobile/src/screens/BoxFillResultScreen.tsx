// BoxFillResultScreen.tsx
// Displays the Box Fill calculation results

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Haptics from '../utils/haptics';
import { calculationRepository } from '../repositories/calculation-repository';

export default function BoxFillResultScreen({ route, navigation }: any) {
  const { input, result } = route.params;
  const { totalVolumeAllowance, availableVolume, remainingVolume, isOverfilled } = result;
  const isPass = !isOverfilled;

  const handleSave = async () => {
    await calculationRepository.save(input, result, 'boxFill');
    Haptics.success();
    Alert.alert('Saved', 'Calculation saved to history');
  };

  return (
    <View style={s.container}>
      <View style={[s.card, isPass ? s.passCard : s.failCard]}>
        <Text style={s.cardLabel}>NEC Box Fill</Text>
        <Text style={s.cardValue}>{isPass ? 'PASS' : 'FAIL'}</Text>
      </View>

      <View style={s.metricCard}>
        <Text style={s.metricLabel}>Total Volume Used</Text>
        <Text style={s.metricValue}>{totalVolumeAllowance.toFixed(1)} in³</Text>
      </View>

      <View style={s.metricCard}>
        <Text style={s.metricLabel}>Available Volume</Text>
        <Text style={s.metricValue}>{availableVolume.toFixed(1)} in³</Text>
      </View>

      <View style={s.metricCard}>
        <Text style={s.metricLabel}>Remaining</Text>
        <Text style={[s.metricValue, isPass ? s.passText : s.failText]}>
          {remainingVolume.toFixed(1)} in³
        </Text>
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
  metricCard: { backgroundColor: '#111', borderRadius: 12, padding: 16, marginBottom: 12 },
  metricLabel: { color: '#888', fontSize: 11, textTransform: 'uppercase', marginBottom: 4 },
  metricValue: { color: '#fff', fontSize: 20, fontWeight: '700' },
  passText: { color: '#66bb6a' },
  failText: { color: '#ef5350' },
  secondaryButton: { borderWidth: 1, borderColor: '#444', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  secondaryButtonText: { color: '#aaa', fontSize: 14 },
  actionButton: { backgroundColor: '#4fc3f7', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  actionButtonText: { color: '#000', fontSize: 16, fontWeight: '700' },
});
