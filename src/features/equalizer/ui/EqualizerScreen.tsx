import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NeumorphicCard, NeumorphicSlider, NeumorphicButton } from '../../../shared/ui';
import { useEqualizerStore } from '../store/equalizerStore';
import { useTheme } from '../../../shared/providers';
import { CONSTANTS } from '../../../shared/config/constants';

export const EqualizerScreen: React.FC = () => {
  const { theme } = useTheme();
  
  const {
    enabled,
    bands,
    currentPreset,
    presets,
    toggleEqualizer,
    setBandGain,
    applyPreset,
    resetToFlat,
  } = useEqualizerStore();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Эквалайзер
        </Text>
        
        {/* Переключатель вкл/выкл */}
        <TouchableOpacity onPress={toggleEqualizer}>
          <NeumorphicCard
            pressed={enabled}
            variant={enabled ? 'convex' : 'flat'}
            radius={theme.borderRadius.lg}
            style={styles.toggleButton}
          >
            <Text style={[styles.toggleText, { color: enabled ? theme.colors.primary : theme.colors.textSecondary }]}>
              {enabled ? 'ВКЛ' : 'ВЫКЛ'}
            </Text>
          </NeumorphicCard>
        </TouchableOpacity>
      </View>

      {/* Пресеты */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.presetsContainer}
        contentContainerStyle={styles.presetsContent}
      >
        {presets.map((preset) => (
          <TouchableOpacity
            key={preset.id}
            onPress={() => applyPreset(preset.id)}
            style={styles.presetButton}
          >
            <NeumorphicCard
              pressed={currentPreset === preset.id}
              variant={currentPreset === preset.id ? 'concave' : 'flat'}
              radius={theme.borderRadius.md}
              style={styles.presetCard}
            >
              <Text
                style={[
                  styles.presetText,
                  {
                    color: currentPreset === preset.id
                      ? theme.colors.primary
                      : theme.colors.text,
                  },
                ]}
              >
                {preset.name}
              </Text>
            </NeumorphicCard>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Слайдеры частот */}
      <View style={styles.bandsContainer}>
        {CONSTANTS.EQUALIZER.BANDS.map((freq, index) => (
          <View key={freq} style={styles.bandColumn}>
            {/* Слайдер */}
            <NeumorphicSlider
              value={bands[index] || 0}
              min={CONSTANTS.EQUALIZER.MIN_GAIN}
              max={CONSTANTS.EQUALIZER.MAX_GAIN}
              onChange={(value) => setBandGain(index, value)}
              orientation="vertical"
              style={styles.slider}
            />
            
            {/* Значение */}
            <Text style={[styles.gainValue, { color: theme.colors.textSecondary }]}>
              {bands[index] > 0 ? '+' : ''}{bands[index].toFixed(1)}
            </Text>
            
            {/* Частота */}
            <Text style={[styles.freqLabel, { color: theme.colors.textSecondary }]}>
              {freq >= 1000 ? `${freq / 1000}k` : freq}
            </Text>
          </View>
        ))}
      </View>

      {/* Кнопка сброса */}
      <TouchableOpacity onPress={resetToFlat} style={styles.resetButton}>
        <NeumorphicCard radius={theme.borderRadius.md} style={styles.resetCard}>
          <Text style={[styles.resetText, { color: theme.colors.text }]}>
            Сбросить
          </Text>
        </NeumorphicCard>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  toggleButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  presetsContainer: {
    marginBottom: 32,
  },
  presetsContent: {
    paddingRight: 16,
  },
  presetButton: {
    marginRight: 12,
  },
  presetCard: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  presetText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bandsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginBottom: 24,
  },
  bandColumn: {
    alignItems: 'center',
    flex: 1,
  },
  slider: {
    flex: 1,
    marginBottom: 12,
  },
  gainValue: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  freqLabel: {
    fontSize: 11,
    fontWeight: '400',
  },
  resetButton: {
    alignSelf: 'center',
  },
  resetCard: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  resetText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
