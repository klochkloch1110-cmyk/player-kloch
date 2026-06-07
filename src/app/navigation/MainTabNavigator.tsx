import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { LibraryScreen } from '../../features/library/ui/LibraryScreen';
import { MiniPlayer } from '../../widgets/mini-player/MiniPlayer';
import { MainTabsParamList } from './types';
import { useTheme } from '../../shared/providers';

const Tab = createBottomTabNavigator<MainTabsParamList>();

// Временные заглушки для экранов
const PlaylistsScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.placeholder, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.placeholderText, { color: theme.colors.text }]}>Плейлисты</Text>
      <Text style={[styles.placeholderSubtext, { color: theme.colors.textSecondary }]}>В разработке</Text>
    </View>
  );
};

const AlbumsScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.placeholder, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.placeholderText, { color: theme.colors.text }]}>Альбомы</Text>
      <Text style={[styles.placeholderSubtext, { color: theme.colors.textSecondary }]}>В разработке</Text>
    </View>
  );
};

const ArtistsScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.placeholder, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.placeholderText, { color: theme.colors.text }]}>Исполнители</Text>
      <Text style={[styles.placeholderSubtext, { color: theme.colors.textSecondary }]}>В разработке</Text>
    </View>
  );
};

export const MainTabNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopWidth: 0,
            elevation: 20,
            shadowColor: theme.colors.shadowDark,
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen
          name="Library"
          component={LibraryScreen}
          options={{
            tabBarLabel: 'Библиотека',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24, color }}>📚</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Playlists"
          component={PlaylistsScreen}
          options={{
            tabBarLabel: 'Плейлисты',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24, color }}>🎵</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Albums"
          component={AlbumsScreen}
          options={{
            tabBarLabel: 'Альбомы',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24, color }}>💿</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Artists"
          component={ArtistsScreen}
          options={{
            tabBarLabel: 'Исполнители',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24, color }}>🎤</Text>
            ),
          }}
        />
      </Tab.Navigator>
      
      {/* Мини-плеер */}
      <MiniPlayer />
    </>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 16,
  },
});
