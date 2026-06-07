/**
 * @format
 */

import { AppRegistry } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import App from './App';
import { name as appName } from './app.json';
import { trackPlayerService } from './src/shared/services/trackPlayerService';

AppRegistry.registerComponent(appName, () => App);

// Регистрация сервиса TrackPlayer для работы в фоновом режиме
TrackPlayer.registerPlaybackService(() => trackPlayerService);
