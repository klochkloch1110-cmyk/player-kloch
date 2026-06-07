import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { request, check, PERMISSIONS, RESULTS, Permission } from 'react-native-permissions';

/**
 * Хук для работы с разрешениями на чтение медиатеки
 */
export function useMediaPermissions() {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  // Определяем нужное разрешение в зависимости от платформы
  const getPermission = (): Permission | null => {
    if (Platform.OS === 'android') {
      // Android 13+ использует READ_MEDIA_AUDIO
      if (Platform.Version >= 33) {
        return PERMISSIONS.ANDROID.READ_MEDIA_AUDIO;
      }
      // Android < 13 использует READ_EXTERNAL_STORAGE
      return PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    } else if (Platform.OS === 'ios') {
      return PERMISSIONS.IOS.MEDIA_LIBRARY;
    }
    return null;
  };

  // Проверка разрешения
  const checkPermission = async (): Promise<boolean> => {
    const permission = getPermission();
    if (!permission) {
      setHasPermission(true); // На неподдерживаемых платформах считаем, что разрешение есть
      return true;
    }

    try {
      const result = await check(permission);
      const granted = result === RESULTS.GRANTED;
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error('Failed to check permission:', error);
      setHasPermission(false);
      return false;
    }
  };

  // Запрос разрешения
  const requestPermission = async (): Promise<boolean> => {
    const permission = getPermission();
    if (!permission) {
      return true;
    }

    try {
      const result = await request(permission);
      const granted = result === RESULTS.GRANTED;
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error('Failed to request permission:', error);
      setHasPermission(false);
      return false;
    }
  };

  // Проверка при монтировании
  useEffect(() => {
    const init = async () => {
      setIsChecking(true);
      await checkPermission();
      setIsChecking(false);
    };

    init();
  }, []);

  return {
    hasPermission,
    isChecking,
    checkPermission,
    requestPermission,
  };
}
