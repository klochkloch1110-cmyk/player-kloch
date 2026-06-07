import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { TrackList } from '../../../widgets/track-list/TrackList';
import { usePlayerStore } from '../../player/store';
import { useTheme } from '../../../shared/providers';
import type { Track } from '../../../shared/types';
import { mediaLibraryService } from '../../../shared/services/mediaLibrary';
import { useMediaPermissions } from '../../../shared/hooks/useMediaPermissions';

export const LibraryScreen: React.FC = () => {
  const { theme } = useTheme();
  
  const { setQueue, currentTrack } = usePlayerStore();
  const { hasPermission, isChecking, requestPermission } = useMediaPermissions();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Сканирование медиатеки
  const scanLibrary = async () => {
    setIsScanning(true);
    setError(null);

    try {
      const scannedTracks = await mediaLibraryService.scanMediaLibrary();
      setTracks(scannedTracks);
      
      if (scannedTracks.length === 0) {
        setError('Аудиофайлы не найдены. Убедитесь, что они находятся в папке Music.');
      }
    } catch (err) {
      console.error('Failed to scan library:', err);
      setError('Ошибка при сканировании медиатеки');
    } finally {
      setIsScanning(false);
    }
  };

  // Загрузка треков при монтировании
  useEffect(() => {
    if (hasPermission && !isChecking) {
      scanLibrary();
    }
  }, [hasPermission, isChecking]);

  const handleTrackPress = (track: Track, index: number) => {
    setQueue(tracks, index);
  };

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      scanLibrary();
    }
  };

  // Состояние загрузки
  if (isChecking) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Проверка разрешений...
        </Text>
      </View>
    );
  }

  // Нет разрешения
  if (!hasPermission) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Доступ к медиатеке
        </Text>
        <Text style={[styles.permissionText, { color: theme.colors.textSecondary }]}>
          Для загрузки музыки необходимо предоставить доступ к медиатеке устройства
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleRequestPermission}
        >
          <Text style={styles.buttonText}>Предоставить доступ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Сканирование
  if (isScanning) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Сканирование медиатеки...
        </Text>
      </View>
    );
  }

  // Ошибка
  if (error) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>
          {error}
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={scanLibrary}
        >
          <Text style={styles.buttonText}>Повторить сканирование</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Список треков
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Библиотека
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {tracks.length} {tracks.length === 1 ? 'трек' : 'треков'}
        </Text>
      </View>

      {tracks.length > 0 ? (
        <TrackList
          tracks={tracks}
          onTrackPress={handleTrackPress}
          currentTrackId={currentTrack?.id}
        />
      ) : (
        <View style={styles.centerContent}>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            Библиотека пуста
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={scanLibrary}
          >
            <Text style={styles.buttonText}>Сканировать снова</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    padding: 24,
    paddingBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
