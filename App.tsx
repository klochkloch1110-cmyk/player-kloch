import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/app/navigation/RootNavigator';
import { ThemeProvider, useTheme } from './src/shared/providers';
import { audioPlayerService } from './src/shared/services/audioPlayer';
import { useTrackPlayer } from './src/shared/hooks/useTrackPlayer';
import { useEqualizerSync } from './src/shared/hooks/useEqualizerSync';

function AppContent(): React.JSX.Element {
  const { theme } = useTheme();
  
  // Синхронизация TrackPlayer со store
  useTrackPlayer();
  
  // Синхронизация эквалайзера с аудио-движком
  useEqualizerSync();

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />
      <RootNavigator />
    </>
  );
}

function App(): React.JSX.Element {
  useEffect(() => {
    // Инициализация аудио-плеера при запуске приложения
    audioPlayerService.initialize().catch((error) => {
      console.error('Failed to initialize audio player:', error);
    });

    return () => {
      // Очистка при размонтировании
      audioPlayerService.destroy().catch((error) => {
        console.error('Failed to destroy audio player:', error);
      });
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider initialMode="light">
          <AppContent />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
