// SettingsScreen.tsx
// NEC version, tier, units, support, restore purchases

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

interface SettingsState {
  necVersion: '2023' | '2020'; // Future: '2026'
  tier: 'free' | 'pro' | 'contractor';
  units: 'imperial' | 'metric';
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState<SettingsState>({
    necVersion: '2023',
    tier: 'free',
    units: 'imperial',
  });

  const upgradeTo = (tier: 'pro' | 'contractor') => {
    Alert.alert('Upgrade', `Upgrade to ${tier.toUpperCase()}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Upgrade', onPress: () => setSettings((s) => ({ ...s, tier })) },
    ]);
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>Settings</Text>

      {/* Tier Section */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Tier</Text>
        <View style={s.card}>
          <Text style={s.currentTier}>{settings.tier.toUpperCase()}</Text>
          <Text style={s.tierDescription}>
            {settings.tier === 'free'
              ? 'Voltage Drop and Conduit Fill only. 10 saved calculations.'
              : settings.tier === 'pro'
              ? 'All 5 calculators. Unlimited saves. Cloud sync.'
              : 'Projects, teams, shared calculations, permits.'}
          </Text>
        </View>
        {settings.tier === 'free' && (
          <TouchableOpacity style={s.upgradeButton} onPress={() => upgradeTo('pro')}>
            <Text style={s.upgradeButtonText}>Upgrade to Pro</Text>
          </TouchableOpacity>
        )}
        {settings.tier === 'pro' && (
          <TouchableOpacity style={s.upgradeButton} onPress={() => upgradeTo('contractor')}>
            <Text style={s.upgradeButtonText}>Upgrade to Contractor</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* NEC Code Version */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>NEC Code Version</Text>
        <View style={s.row}>
          {(['2020', '2023'] as const).map((v) => (
            <TouchableOpacity
              key={v}
              style={[s.pill, settings.necVersion === v && s.pillActive]}
              onPress={() => setSettings((s) => ({ ...s, necVersion: v }))}
            >
              <Text style={[s.pillText, settings.necVersion === v && s.pillTextActive]}>
                NEC {v}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={s.note}>NEC 2026 support coming in 2026.</Text>
      </View>

      {/* Unit Preferences */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Unit Preferences</Text>
        <View style={s.row}>
          {(['imperial', 'metric'] as const).map((u) => (
            <TouchableOpacity
              key={u}
              style={[s.pill, settings.units === u && s.pillActive]}
              onPress={() => setSettings((s) => ({ ...s, units: u }))}
            >
              <Text style={[s.pillText, settings.units === u && s.pillTextActive]}>
                {u === 'imperial' ? 'Imperial (ft, in)' : 'Metric (m, mm)'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Support */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Support</Text>
        <TouchableOpacity style={s.linkButton} onPress={() => Alert.alert('Contact Support', 'Email: support@sparkywiz.app')}>
          <Text style={s.linkButtonText}>Contact Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.linkButton} onPress={() => Alert.alert('Restore Purchases', 'Checking App Store...')}>
          <Text style={s.linkButtonText}>Restore Purchases</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.linkButton} onPress={() => Alert.alert('About', 'SparkyWiz v1.0.0')}>
          <Text style={s.linkButtonText}>About</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  content: { padding: 20, paddingTop: 40, paddingBottom: 40 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 24 },
  section: { marginBottom: 28 },
  sectionTitle: { color: '#888', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1 },
  card: { backgroundColor: '#111', borderRadius: 12, padding: 16, marginBottom: 12 },
  currentTier: { color: '#fff', fontSize: 24, fontWeight: '800', textTransform: 'uppercase' },
  tierDescription: { color: '#aaa', fontSize: 13, marginTop: 8, lineHeight: 20 },
  upgradeButton: { backgroundColor: '#66bb6a', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 12 },
  upgradeButtonText: { color: '#000', fontSize: 16, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  pill: { borderWidth: 1, borderColor: '#333', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14, marginBottom: 8 },
  pillActive: { borderColor: '#4fc3f7', backgroundColor: '#0d2836' },
  pillText: { color: '#aaa', fontSize: 14 },
  pillTextActive: { color: '#4fc3f7', fontWeight: '700' },
  note: { color: '#888', fontSize: 12, marginTop: 8 },
  linkButton: { borderWidth: 1, borderColor: '#333', borderRadius: 10, paddingVertical: 14, paddingHorizontal: 16, marginBottom: 8 },
  linkButtonText: { color: '#fff', fontSize: 15 },
});
