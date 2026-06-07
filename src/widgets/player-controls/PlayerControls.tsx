import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { NeumorphicButton } from '../../shared/ui';
import { usePlayerStore } from '../../features/player/store';
import { useTheme } from '../../shared/providers';

export const PlayerControls: React.FC = () => {
  const { theme } = useTheme();
  
  const {
    isPlaying,
    repeatMode,
    shuffleEnabled,
    togglePlay,
    next,
    previous,
    toggleShuffle,
    setRepeatMode,
  } = usePlayerStore();

  const handleRepeatPress = () => {
    const modes: Array<'off' | 'one' | 'all'> = ['off', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one':
        return '🔂';
      case 'all':
        return '🔁';
      default:
        return '↻';
    }
  };

  return (
    <View style={styles.container}>
      {/* Верхний ряд: Shuffle и Repeat */}
      <View style={styles.secondaryRow}>
        <NeumorphicButton
          size="sm"
          onPress={toggleShuffle}
          style={styles.button}
        >
          <Text
            style={[
              styles.icon,
              { color: shuffleEnabled ? theme.colors.primary : theme.colors.textSecondary },
            ]}
          >
            🔀
          </Text>
        </NeumorphicButton>

        <NeumorphicButton
          size="sm"
          onPress={handleRepeatPress}
          style={styles.button}
        >
          <Text
            style={[
              styles.icon,
              { color: repeatMode !== 'off' ? theme.colors.primary : theme.colors.textSecondary },
            ]}
          >
            {getRepeatIcon()}
          </Text>
        </NeumorphicButton>
      </View>

      {/* Основной ряд: Previous, Play/Pause, Next */}
      <View style={styles.mainRow}>
        <NeumorphicButton
          size="md"
          onPress={previous}
          style={styles.button}
        >
          <Text style={[styles.icon, { color: theme.colors.text }]}>⏮</Text>
        </NeumorphicButton>

        <NeumorphicButton
          size="lg"
          onPress={togglePlay}
          style={styles.playButton}
        >
          <Text style={[styles.playIcon, { color: theme.colors.primary }]}>
            {isPlaying ? '⏸' : '▶'}
          </Text>
        </NeumorphicButton>

        <NeumorphicButton
          size="md"
          onPress={next}
          style={styles.button}
        >
          <Text style={[styles.icon, { color: theme.colors.text }]}>⏭</Text>
        </NeumorphicButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 20,
  },
  secondaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginBottom: 8,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  button: {
    // Дополнительные стили
  },
  playButton: {
    // Дополнительные стили для главной кнопки
  },
  icon: {
    fontSize: 24,
  },
  playIcon: {
    fontSize: 32,
  },
});
