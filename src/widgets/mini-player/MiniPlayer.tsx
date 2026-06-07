import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NeumorphicCard, NeumorphicButton } from '../../shared/ui';
import { usePlayerStore } from '../../features/player/store';
import { useTheme } from '../../shared/providers';
import type { RootStackParamList } from '../../app/navigation/types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const MiniPlayer: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    next,
  } = usePlayerStore();

  if (!currentTrack) {
    return null;
  }

  const handleOpenFullPlayer = () => {
    navigation.navigate('NowPlaying');
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handleOpenFullPlayer}
      style={styles.container}
    >
      <NeumorphicCard
        variant="convex"
        radius={theme.borderRadius.md}
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
      >
        {/* Обложка */}
        <View style={styles.coverContainer}>
          {currentTrack.coverArt ? (
            <Image
              source={{ uri: currentTrack.coverArt }}
              style={styles.cover}
            />
          ) : (
            <View style={[styles.coverPlaceholder, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.coverIcon}>🎵</Text>
            </View>
          )}
        </View>

        {/* Информация */}
        <View style={styles.info}>
          <Text
            style={[styles.title, { color: theme.colors.text }]}
            numberOfLines={1}
          >
            {currentTrack.title}
          </Text>
          <Text
            style={[styles.artist, { color: theme.colors.textSecondary }]}
            numberOfLines={1}
          >
            {currentTrack.artist}
          </Text>
        </View>

        {/* Управление */}
        <View style={styles.controls}>
          <NeumorphicButton
            size="sm"
            onPress={togglePlay}
          >
            <Text style={[styles.controlIcon, { color: theme.colors.primary }]}>
              {isPlaying ? '⏸' : '▶'}
            </Text>
          </NeumorphicButton>

          <NeumorphicButton
            size="sm"
            onPress={next}
            style={styles.nextButton}
          >
            <Text style={[styles.controlIcon, { color: theme.colors.text }]}>
              ⏭
            </Text>
          </NeumorphicButton>
        </View>
      </NeumorphicCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 70, // Над нижней навигацией
    left: 16,
    right: 16,
    zIndex: 100,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    minHeight: 72,
  },
  coverContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  cover: {
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
  coverIcon: {
    fontSize: 20,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  artist: {
    fontSize: 12,
    fontWeight: '400',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nextButton: {
    marginLeft: 4,
  },
  controlIcon: {
    fontSize: 18,
  },
});
