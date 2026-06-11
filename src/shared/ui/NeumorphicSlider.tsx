import React from 'react';
import { PanResponder, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { NeumorphicCard } from './NeumorphicCard';
import { useTheme } from '../providers';

interface NeumorphicSliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  orientation?: 'horizontal' | 'vertical';
  style?: StyleProp<ViewStyle>;
}

export const NeumorphicSlider: React.FC<NeumorphicSliderProps> = ({
  value,
  min,
  max,
  onChange,
  orientation = 'horizontal',
  style,
}) => {
  const { theme } = useTheme();
  
  const isVertical = orientation === 'vertical';
  const sliderLength = isVertical ? 200 : 300;
  const thumbSize = 24;
  const maxPosition = sliderLength - thumbSize;

  // Преобразование значения в позицию
  const valueToPosition = React.useCallback(
    (val: number) => ((val - min) / (max - min)) * maxPosition,
    [max, maxPosition, min],
  );

  const [position, setPosition] = React.useState(valueToPosition(value));
  const startPositionRef = React.useRef(position);

  // Обновление позиции при изменении value извне
  React.useEffect(() => {
    setPosition(valueToPosition(value));
  }, [value, valueToPosition]);

  const updatePosition = React.useCallback(
    (newPosition: number) => {
      const clampedPosition = Math.max(0, Math.min(maxPosition, newPosition));
      setPosition(clampedPosition);

      const newValue = min + (clampedPosition / maxPosition) * (max - min);
      onChange(Math.round(newValue * 10) / 10);
    },
    [max, maxPosition, min, onChange],
  );

  const panResponder = React.useMemo(
    () => PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startPositionRef.current = position;
      },
      onPanResponderMove: (_, gestureState) => {
        const translation = isVertical ? -gestureState.dy : gestureState.dx;
        updatePosition(startPositionRef.current + translation);
      },
    }),
    [isVertical, position, updatePosition],
  );

  const thumbStyle = isVertical ? { bottom: position } : { left: position };
  const trackFillStyle = isVertical
    ? { height: position + thumbSize / 2 }
    : { width: position + thumbSize / 2 };

  return (
    <>
      <View
        style={[
          styles.container,
          isVertical ? styles.containerVertical : styles.containerHorizontal,
          { [isVertical ? 'height' : 'width']: sliderLength },
          style,
        ]}
      >
        {/* Трек */}
        <NeumorphicCard
          variant="concave"
          radius={theme.borderRadius.sm}
          style={[
            styles.track,
            isVertical ? styles.trackVertical : styles.trackHorizontal,
          ]}
        >
          {/* Заполненная часть */}
          <View
            style={[
              styles.trackFill,
              {
                backgroundColor: theme.colors.primary,
                borderRadius: theme.borderRadius.sm,
              },
              isVertical ? styles.trackFillVertical : styles.trackFillHorizontal,
              trackFillStyle,
            ]}
          />
        </NeumorphicCard>

        {/* Ползунок */}
        <View
          {...panResponder.panHandlers}
            style={[
              styles.thumb,
              {
                width: thumbSize,
                height: thumbSize,
              },
              thumbStyle,
            ]}
          >
            <NeumorphicCard
              variant="convex"
              radius={theme.borderRadius.round}
              style={styles.thumbInner}
            />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerHorizontal: {
    flexDirection: 'row',
  },
  containerVertical: {
    flexDirection: 'column',
  },
  track: {
    overflow: 'hidden',
  },
  trackHorizontal: {
    width: '100%',
    height: 8,
  },
  trackVertical: {
    height: '100%',
    width: 8,
  },
  trackFill: {
    position: 'absolute',
  },
  trackFillHorizontal: {
    left: 0,
    top: 0,
    bottom: 0,
  },
  trackFillVertical: {
    bottom: 0,
    left: 0,
    right: 0,
  },
  thumb: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbInner: {
    width: '100%',
    height: '100%',
  },
});
