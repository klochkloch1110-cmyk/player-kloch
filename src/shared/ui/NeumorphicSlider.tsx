import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
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

  // Преобразование значения в позицию
  const valueToPosition = (val: number) => {
    return ((val - min) / (max - min)) * (sliderLength - thumbSize);
  };

  const position = useSharedValue(valueToPosition(value));

  // Обновление позиции при изменении value извне
  React.useEffect(() => {
    position.value = withSpring(valueToPosition(value));
  }, [value]);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startPosition = position.value;
    },
    onActive: (event, ctx: any) => {
      const translation = isVertical ? -event.translationY : event.translationX;
      let newPosition = ctx.startPosition + translation;
      
      // Ограничение движения
      newPosition = Math.max(0, Math.min(sliderLength - thumbSize, newPosition));
      position.value = newPosition;

      // Преобразование позиции в значение
      const newValue = min + (newPosition / (sliderLength - thumbSize)) * (max - min);
      runOnJS(onChange)(Math.round(newValue * 10) / 10);
    },
  });

  const animatedThumbStyle = useAnimatedStyle(() => {
    return isVertical
      ? { bottom: position.value }
      : { left: position.value };
  });

  const trackFillStyle = useAnimatedStyle(() => {
    return isVertical
      ? { height: position.value + thumbSize / 2 }
      : { width: position.value + thumbSize / 2 };
  });

  return (
    <GestureHandlerRootView>
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
          <Animated.View
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
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              styles.thumb,
              {
                width: thumbSize,
                height: thumbSize,
              },
              animatedThumbStyle,
            ]}
          >
            <NeumorphicCard
              variant="convex"
              radius={theme.borderRadius.round}
              style={styles.thumbInner}
            />
          </Animated.View>
        </PanGestureHandler>
      </View>
    </GestureHandlerRootView>
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
