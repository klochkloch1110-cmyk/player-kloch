import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import type { Track } from '../types';
import { metadataService } from './metadataService';

/**
 * Сервис для сканирования аудио-файлов на устройстве
 */
class MediaLibraryService {
  private supportedFormats = ['mp3', 'flac', 'aac', 'wav', 'ogg', 'm4a'];

  /**
   * Получить список директорий для сканирования
   */
  private getMusicDirectories(): string[] {
    if (Platform.OS === 'android') {
      return [
        RNFS.ExternalStorageDirectoryPath + '/Music',
        RNFS.ExternalStorageDirectoryPath + '/Download',
        RNFS.DownloadDirectoryPath,
      ];
    } else if (Platform.OS === 'ios') {
      return [
        RNFS.DocumentDirectoryPath,
        RNFS.MainBundlePath + '/Music',
      ];
    }
    return [];
  }

  /**
   * Проверка расширения файла
   */
  private isSupportedAudioFile(filename: string): boolean {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension ? this.supportedFormats.includes(extension) : false;
  }

  /**
   * Рекурсивное сканирование директории
   */
  private async scanDirectory(directory: string): Promise<string[]> {
    const audioFiles: string[] = [];

    try {
      const exists = await RNFS.exists(directory);
      if (!exists) {
        return audioFiles;
      }

      const items = await RNFS.readDir(directory);

      for (const item of items) {
        if (item.isDirectory()) {
          // Рекурсивно сканируем поддиректории
          const subFiles = await this.scanDirectory(item.path);
          audioFiles.push(...subFiles);
        } else if (item.isFile() && this.isSupportedAudioFile(item.name)) {
          audioFiles.push(item.path);
        }
      }
    } catch (error) {
      console.error(`Failed to scan directory ${directory}:`, error);
    }

    return audioFiles;
  }

  /**
   * Извлечение метаданных из имени файла (fallback)
   * Примитивный парсер: "Artist - Title.mp3" или "Title.mp3"
   */
  private parseFilename(filepath: string): { title: string; artist: string; album: string } {
    const filename = filepath.split('/').pop() || '';
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');

    // Попытка разобрать формат "Artist - Title"
    const parts = nameWithoutExt.split(' - ');
    if (parts.length >= 2) {
      return {
        title: parts[1].trim(),
        artist: parts[0].trim(),
        album: 'Неизвестный альбом',
      };
    }

    return {
      title: nameWithoutExt,
      artist: 'Неизвестный исполнитель',
      album: 'Неизвестный альбом',
    };
  }

  /**
   * Получить информацию о файле
   */
  /**
   * Конвертация файла в Track объект с чтением ID3 метаданных
   */
  private async createTrack(filepath: string, index: number): Promise<Track> {
    // Пытаемся прочитать ID3 метаданные
    const metadata = await metadataService.readMetadata(filepath);
    
    // Если метаданные не найдены, используем fallback из имени файла
    const fallback = this.parseFilename(filepath);

    return {
      id: `track_${index}_${Date.now()}`,
      title: metadata.title || fallback.title,
      artist: metadata.artist || fallback.artist,
      album: metadata.album || fallback.album,
      year: metadata.year,
      genre: metadata.genre,
      trackNumber: metadata.trackNumber,
      duration: metadata.duration || 0, // Будет обновлено при загрузке в плеер
      filePath: Platform.OS === 'android' ? `file://${filepath}` : filepath,
      coverArt: metadata.coverArt, // Embedded обложка из ID3
    };
  }

  /**
   * Сканирование медиатеки
   */
  async scanMediaLibrary(): Promise<Track[]> {
    const directories = this.getMusicDirectories();
    const allAudioFiles: string[] = [];

    // Сканируем все директории
    for (const dir of directories) {
      const files = await this.scanDirectory(dir);
      allAudioFiles.push(...files);
    }

    // Удаляем дубликаты
    const uniqueFiles = Array.from(new Set(allAudioFiles));

    // Конвертируем в треки
    const tracks = await Promise.all(
      uniqueFiles.map((file, index) => this.createTrack(file, index))
    );

    console.log(`Found ${tracks.length} audio files`);
    return tracks;
  }

  /**
   * Поиск треков по запросу
   */
  searchTracks(tracks: Track[], query: string): Track[] {
    const lowerQuery = query.toLowerCase();
    return tracks.filter(
      (track) =>
        track.title.toLowerCase().includes(lowerQuery) ||
        track.artist.toLowerCase().includes(lowerQuery) ||
        track.album.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Группировка треков по альбомам
   */
  groupByAlbum(tracks: Track[]): Map<string, Track[]> {
    const albumMap = new Map<string, Track[]>();

    tracks.forEach((track) => {
      const album = track.album || 'Неизвестный альбом';
      if (!albumMap.has(album)) {
        albumMap.set(album, []);
      }
      albumMap.get(album)!.push(track);
    });

    return albumMap;
  }

  /**
   * Группировка треков по исполнителям
   */
  groupByArtist(tracks: Track[]): Map<string, Track[]> {
    const artistMap = new Map<string, Track[]>();

    tracks.forEach((track) => {
      const artist = track.artist || 'Неизвестный исполнитель';
      if (!artistMap.has(artist)) {
        artistMap.set(artist, []);
      }
      artistMap.get(artist)!.push(track);
    });

    return artistMap;
  }
}

export const mediaLibraryService = new MediaLibraryService();
