import jsmediatags from 'jsmediatags/build2/jsmediatags';
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';
import type { Track, TrackMetadata } from '../types';

/**
 * Сервис для чтения ID3 метаданных из аудио-файлов
 * 
 * Поддерживает:
 * - ID3v1, ID3v2 (MP3)
 * - MP4 (M4A, AAC)
 * - FLAC
 * 
 * Извлекает:
 * - Название трека (title)
 * - Исполнитель (artist)
 * - Альбом (album)
 * - Год (year)
 * - Жанр (genre)
 * - Номер трека (track)
 * - Обложка (picture)
 * - Длительность (duration) - через дополнительную обработку
 */
class MetadataService {
  /**
   * Чтение метаданных из файла
   * @param filePath - путь к аудио-файлу
   * @returns Promise с метаданными
   */
  async readMetadata(filePath: string): Promise<TrackMetadata> {
    return new Promise((resolve, reject) => {
      jsmediatags.read(filePath, {
        onSuccess: (tag: any) => {
          const tags = tag.tags;
          
          const metadata: TrackMetadata = {
            title: tags.title || this.getFilenameWithoutExtension(filePath),
            artist: tags.artist || 'Unknown Artist',
            album: tags.album || 'Unknown Album',
            year: tags.year ? parseInt(tags.year, 10) : undefined,
            genre: tags.genre || undefined,
            trackNumber: this.parseTrackNumber(tags.track),
            coverArt: this.extractCoverArt(tags.picture),
            duration: 0, // Будет заполнено позже из react-native-track-player
          };

          resolve(metadata);
        },
        onError: (error: any) => {
          console.warn(`[MetadataService] Failed to read tags from ${filePath}:`, error.type);
          
          // Возвращаем базовые метаданные из имени файла
          resolve(this.getFallbackMetadata(filePath));
        },
      });
    });
  }

  /**
   * Массовое чтение метаданных из списка файлов
   * @param filePaths - массив путей к файлам
   * @returns Promise с массивом метаданных
   */
  async readBulkMetadata(filePaths: string[]): Promise<TrackMetadata[]> {
    const promises = filePaths.map((path) => this.readMetadata(path));
    return Promise.all(promises);
  }

  /**
   * Обновление метаданных существующего трека
   * @param track - трек для обновления
   * @returns Promise с обновленным треком
   */
  async enhanceTrack(track: Track): Promise<Track> {
    try {
      const metadata = await this.readMetadata(track.filePath);
      
      return {
        ...track,
        title: metadata.title || track.title,
        artist: metadata.artist || track.artist,
        album: metadata.album || track.album,
        year: metadata.year,
        genre: metadata.genre,
        trackNumber: metadata.trackNumber,
        coverArt: metadata.coverArt || track.coverArt,
      };
    } catch (error) {
      console.warn(`[MetadataService] Failed to enhance track ${track.id}:`, error);
      return track;
    }
  }

  /**
   * Массовое обновление метаданных треков
   * @param tracks - массив треков
   * @returns Promise с обновленными треками
   */
  async enhanceTracks(tracks: Track[]): Promise<Track[]> {
    const promises = tracks.map((track) => this.enhanceTrack(track));
    return Promise.all(promises);
  }

  /**
   * Извлечение обложки из метаданных
   * @param picture - объект с данными картинки из jsmediatags
   * @returns base64 строка или undefined
   */
  private extractCoverArt(picture: any): string | undefined {
    if (!picture) {
      return undefined;
    }

    try {
      const { data, format } = picture;
      
      // Конвертируем массив байтов в Buffer, затем в base64
      const buffer = Buffer.from(data);
      const base64 = buffer.toString('base64');
      
      return `data:${format};base64,${base64}`;
    } catch (error) {
      console.warn('[MetadataService] Failed to extract cover art:', error);
      return undefined;
    }
  }

  /**
   * Парсинг номера трека
   * @param track - строка или число с номером трека (может быть "3/12" формат)
   * @returns номер трека или undefined
   */
  private parseTrackNumber(track: string | number | undefined): number | undefined {
    if (!track) {
      return undefined;
    }

    if (typeof track === 'number') {
      return track;
    }

    // Парсим формат "3/12" или "3"
    const match = track.match(/^(\d+)/);
    if (match) {
      return parseInt(match[1], 10);
    }

    return undefined;
  }

  /**
   * Получение имени файла без расширения
   * @param filePath - путь к файлу
   * @returns имя файла без расширения
   */
  private getFilenameWithoutExtension(filePath: string): string {
    const filename = filePath.split('/').pop() || filePath;
    return filename.replace(/\.[^/.]+$/, '');
  }

  /**
   * Получение базовых метаданных из имени файла (fallback)
   * @param filePath - путь к файлу
   * @returns базовые метаданные
   */
  private getFallbackMetadata(filePath: string): TrackMetadata {
    const filename = this.getFilenameWithoutExtension(filePath);
    
    // Попытка распарсить формат "Artist - Title" или "Title"
    const parts = filename.split(' - ');
    
    return {
      title: parts.length > 1 ? parts[1].trim() : filename,
      artist: parts.length > 1 ? parts[0].trim() : 'Unknown Artist',
      album: 'Unknown Album',
      duration: 0,
    };
  }

  /**
   * Проверка, поддерживается ли формат файла
   * @param filePath - путь к файлу
   * @returns true если формат поддерживается
   */
  isFormatSupported(filePath: string): boolean {
    const supportedExtensions = ['.mp3', '.m4a', '.aac', '.flac', '.wav'];
    const extension = filePath.toLowerCase().substring(filePath.lastIndexOf('.'));
    return supportedExtensions.includes(extension);
  }

  /**
   * Получение размера файла
   * @param filePath - путь к файлу
   * @returns размер в байтах
   */
  async getFileSize(filePath: string): Promise<number> {
    try {
      const stat = await RNFS.stat(filePath);
      return stat.size;
    } catch (error) {
      console.warn(`[MetadataService] Failed to get file size for ${filePath}:`, error);
      return 0;
    }
  }
}

export const metadataService = new MetadataService();
