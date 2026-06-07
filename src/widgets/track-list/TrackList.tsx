import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { NeumorphicCard } from '../../shared/ui';
import type { Track } from '../../shared/types';
import { useTheme } from '../../shared/providers';
import { formatTime } from '../../shared/lib';

interface TrackListProps {
  tracks: Track[];
  onTrackPress: (track: Track, index: number) => void;
  currentTrackId?: string;
}

export const TrackList: React.FC<TrackListProps> = ({
  tracks,
  onTrackPress,
  currentTrackId,
}) => {
  const { theme } = useTheme();

  const renderTrack = ({ item, index }: { item: Track; index: number }) => {
    const isPlaying = item.id === currentTrackId;

    return (
      <TouchableOpacity
        onPress={() => onTrackPress(item, index)}
        style={styles.trackButton}
      >
        <NeumorphicCard
          pressed={isPlaying}
          variant={isPlaying ? 'concave' : 'flat'}
          radius={theme.borderRadius.md}
          style={styles.trackCard}
        >
          {/* Обложка */}
          <View style={styles.coverContainer}>
            {item.coverArt ? (
              <Image
                source={{ uri: item.coverArt }}
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
              style={[
                styles.title,
                {
                  color: isPlaying ? theme.colors.primary : theme.colors.text,
                },
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text
              style={[styles.artist, { color: theme.colors.textSecondary }]}
              numberOfLines={1}
            >
              {item.artist}
            </Text>
          </View>

          {/* Длительность */}
          <Text style={[styles.duration, { color: theme.colors.textSecondary }]}>
            {formatTime(item.duration)}
          </Text>

          {/* Индикатор воспроизведения */}
          {isPlaying && (
            <Text style={[styles.playingIcon, { color: theme.colors.primary }]}>
              ▶
            </Text>
          )}
        </NeumorphicCard>
      </TouchableOpacity>
    );
  };

  return (
    <FlashList
      data={tracks}
      renderItem={renderTrack}
      estimatedItemSize={80}
      contentContainerStyle={styles.listContent}
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  trackButton: {
    marginBottom: 12,
  },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    minHeight: 80,
  },
  coverContainer: {
    width: 56,
    height: 56,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
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
    fontSize: 24,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  artist: {
    fontSize: 14,
    fontWeight: '400',
  },
  duration: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  playingIcon: {
    fontSize: 16,
  },
});
