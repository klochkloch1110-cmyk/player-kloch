import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NeumorphicCard, NeumorphicButton } from '../../shared/ui';
import { PlayerControls } from '../player-controls';
import { usePlayerStore } from '../../features/player/store';
import { useTheme } from '../../shared/providers';
import { formatTime } from '../../shared/lib';
import type { RootStackParamList } from '../../app/navigation/types';

const { width } = Dimensions.get('window');
const COVER_SIZE = width - 80;

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const NowPlayingScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  
  const {
    currentTrack,
    position,
    duration,
    seek,
  } = usePlayerStore();

  if (!currentTrack) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          Выберите трек для воспроизведения
        </Text>
      </View>
    );
  }

  const progress = duration > 0 ? position / duration : 0;

  const handleOpenEqualizer = () => {
    navigation.navigate('Equalizer');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Кнопка закрытия */}
      <NeumorphicButton
        size="sm"
        onPress={() => navigation.goBack()}
        style={styles.closeButton}
      >
        <Text style={[styles.icon, { color: theme.colors.text }]}>×</Text>
      </NeumorphicButton>

      {/* Обложка альбома */}
      <NeumorphicCard
        variant="convex"
        radius={theme.borderRadius.lg}
        style={styles.coverContainer}
      >
        {currentTrack.coverArt ? (
          <Image
            source={{ uri: currentTrack.coverArt }}
            style={styles.coverImage}
          />
        ) : (
          <View style={[styles.coverPlaceholder, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.coverPlaceholderText}>🎵</Text>
          </View>
        )}
      </NeumorphicCard>

      {/* Информация о треке */}
      <View style={styles.trackInfo}>
        <Text
          style={[styles.trackTitle, { color: theme.colors.text }]}
          numberOfLines={1}
        >
          {currentTrack.title}
        </Text>
        <Text
          style={[styles.trackArtist, { color: theme.colors.textSecondary }]}
          numberOfLines={1}
        >
          {currentTrack.artist}
        </Text>
      </View>

      {/* Прогресс-бар */}
      <View style={styles.progressContainer}>
        <NeumorphicCard
          variant="concave"
          radius={theme.borderRadius.sm}
          style={styles.progressTrack}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress * 100}%`,
                backgroundColor: theme.colors.primary,
              },
            ]}
          />
        </NeumorphicCard>

        {/* Временные метки */}
        <View style={styles.timeLabels}>
          <Text style={[styles.timeText, { color: theme.colors.textSecondary }]}>
            {formatTime(position)}
          </Text>
          <Text style={[styles.timeText, { color: theme.colors.textSecondary }]}>
            {formatTime(duration)}
          </Text>
        </View>
      </View>

      {/* Управление */}
      <PlayerControls />

      {/* Кнопка эквалайзера */}
      <NeumorphicButton
        size="md"
        onPress={handleOpenEqualizer}
        style={styles.equalizerButton}
      >
        <Text style={[styles.icon, { color: theme.colors.text }]}>🎚️</Text>
      </NeumorphicButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 24,
    zIndex: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  coverContainer: {
    width: COVER_SIZE,
    height: COVER_SIZE,
    marginBottom: 32,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverPlaceholderText: {
    fontSize: 80,
  },
  trackInfo: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  trackTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  trackArtist: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 32,
  },
  progressTrack: {
    height: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  equalizerButton: {
    marginTop: 24,
  },
  icon: {
    fontSize: 24,
  },
});
