// HistoryScreen.tsx
// SQLite-backed calculation history, reloads on tab focus

import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { calculationRepository, type CalculationRecord } from '../repositories/calculation-repository';

function getDetailText(type: string, result: any): string {
  switch (type) {
    case 'voltageDrop':
      return `Drop: ${result.voltageDrop?.toFixed(2)}V (${result.dropPercentage?.toFixed(2)}%)`;
    case 'conduitFill':
      return `Fill: ${(result.fillPercentage * 100)?.toFixed(1)}% (${result.totalWireArea?.toFixed(2)} sq in)`;
    case 'ampacity':
      return `Ampacity: ${result.adjustedAmpacity?.toFixed(1)}A | Breaker: ${result.recommendedBreakerSize}A`;
    case 'boxFill':
      return `Used: ${result.totalVolumeAllowance?.toFixed(1)}/${result.availableVolume?.toFixed(1)} in³`;
    case 'bending':
      return `Total: ${result.totalLength?.toFixed(2)} in`;
    default:
      return 'Unknown calculation';
  }
}

export default function HistoryScreen({ navigation }: any) {
  const [items, setItems] = useState<CalculationRecord[]>([]);

  const load = useCallback(async () => {
    try {
      const data = await calculationRepository.getAll();
      setItems(data);
    } catch (e) {
      console.error('Failed to load history', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleClear = () => {
    Alert.alert('Clear History', 'Delete all saved calculations?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete All',
        style: 'destructive',
        onPress: async () => {
          await calculationRepository.clearAll();
          setItems([]);
        }
      }
    ]);
  };

  const renderItem = ({ item }: { item: CalculationRecord }) => {
    const parsedResult = JSON.parse(item.result_json);
    const isPass = parsedResult.meetsNEC ?? parsedResult.isCompliant ?? true;
    const titleCase = (str: string) => str.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());

    return (
      <View style={s.card}>
        <View style={s.header}>
          <Text style={s.type}>{titleCase(item.type)}</Text>
          <Text style={[s.status, isPass ? s.pass : s.fail]}>{isPass ? 'PASS' : 'FAIL'}</Text>
        </View>
        <Text style={s.detail}>{getDetailText(item.type, parsedResult)}</Text>
        <Text style={s.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
      </View>
    );
  };

  return (
    <View style={s.container}>
      <View style={s.headerRow}>
        <Text style={s.title}>History</Text>
        <TouchableOpacity onPress={handleClear}>
          <Text style={s.clear}>Clear All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={<Text style={s.empty}>No saved calculations</Text>}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a', padding: 20, paddingTop: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { color: '#fff', fontSize: 28, fontWeight: '800' },
  clear: { color: '#ef5350', fontSize: 14 },
  card: { backgroundColor: '#111', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#222' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  type: { color: '#888', fontSize: 12, textTransform: 'uppercase' },
  status: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  pass: { color: '#66bb6a' },
  fail: { color: '#ef5350' },
  detail: { color: '#fff', fontSize: 14, marginBottom: 4 },
  date: { color: '#555', fontSize: 12 },
  empty: { color: '#555', textAlign: 'center', marginTop: 40 },
});
