import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../providers';

interface NeumorphicCardProps {
  children?: React.ReactNode;
  pressed?: boolean;
  variant?: 'flat' | 'concave' | 'convex';
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

export const NeumorphicCard: React.FC<NeumorphicCardProps> = ({
  children,
  pressed = false,
  variant = 'flat',
  radius,
  style,
}) => {
  const { theme } = useTheme();
  const borderRadius = radius ?? theme.borderRadius.md;

  const getVariantStyle = (): ViewStyle => {
    const { shadowDark, shadowLight, surface } = theme.colors;
    const { distance, intensity, blur } = theme.shadows.neumorphic;

    if (pressed || variant === 'concave') {
      // Вдавленный эффект (внутренние тени)
      return {
        shadowColor: shadowDark,
        shadowOffset: { width: -distance / 2, height: -distance / 2 },
        shadowOpacity: intensity,
        shadowRadius: blur / 2,
        elevation: 0,
      };
    }

    if (variant === 'convex') {
      // Выпуклый эффект (усиленные тени)
      return {
        shadowColor: shadowDark,
        shadowOffset: { width: distance * 1.5, height: distance * 1.5 },
        shadowOpacity: intensity * 1.2,
        shadowRadius: blur * 1.2,
        elevation: 8,
      };
    }

    // Плоский эффект (стандартные тени)
    return {
      shadowColor: shadowDark,
      shadowOffset: { width: distance, height: distance },
      shadowOpacity: intensity,
      shadowRadius: blur,
      elevation: 4,
    };
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: borderRadius,
        },
        getVariantStyle(),
        style,
      ]}
    >
      {/* Светлая тень (противоположная сторона) */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: borderRadius,
            shadowColor: theme.colors.shadowLight,
            shadowOffset: { width: -theme.shadows.neumorphic.distance, height: -theme.shadows.neumorphic.distance },
            shadowOpacity: pressed ? 0 : theme.shadows.neumorphic.intensity,
            shadowRadius: theme.shadows.neumorphic.blur,
          },
        ]}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
