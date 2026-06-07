import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { NeumorphicCard } from './NeumorphicCard';
import { useTheme } from '../providers';

interface NeumorphicButtonProps {
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'rounded';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const NeumorphicButton: React.FC<NeumorphicButtonProps> = ({
  icon,
  children,
  onPress,
  size = 'md',
  shape = 'circle',
  disabled = false,
  style,
}) => {
  const [pressed, setPressed] = React.useState(false);
  const { theme } = useTheme();

  const sizeMap = {
    sm: 40,
    md: 56,
    lg: 72,
  };

  const buttonSize = sizeMap[size];
  const borderRadius = shape === 'circle' ? theme.borderRadius.round : theme.borderRadius.md;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
      disabled={disabled}
      style={style}
    >
      <NeumorphicCard
        pressed={pressed}
        variant={pressed ? 'concave' : 'flat'}
        radius={borderRadius}
        style={[
          styles.button,
          {
            width: buttonSize,
            height: buttonSize,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        {icon || children}
      </NeumorphicCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
