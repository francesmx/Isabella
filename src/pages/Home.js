import React, { useState } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { colourWheel } from '../utils/ColorWheel';

const animalArray = [
  require('../../assets/animals/bunny.png'),
  require('../../assets/animals/tiger.png'),
  require('../../assets/animals/frog.png'),
  require('../../assets/animals/pig.png'),
  require('../../assets/animals/giraffe.png'),
];

export default function Home() {
  const [colourIndex, setColourIndex] = useState(0);
  const [animalIndex, setAnimalIndex] = useState(0);

  const cycleColourArrayIndex = (increment) => {
    const nextIndex =
      (colourIndex + increment + colourWheel.length) % colourWheel.length;
    setColourIndex(nextIndex);
  };

  const cycleAnimalArrayIndex = (increment) => {
    const nextIndex =
      (animalIndex + increment + animalArray.length) % animalArray.length;
    setAnimalIndex(nextIndex);
  };

  const onGestureEvent = (event) => {
    const { translationX, translationY } = event.nativeEvent;

    if (translationX > 50) {
      // Right swipe
      cycleColourArrayIndex(1);
    } else if (translationX < -50) {
      // Left swipe
      cycleColourArrayIndex(-1);
    }

    if (translationY > 20) {
      // Up swipe
      cycleAnimalArrayIndex(1);
    } else if (translationY < -20) {
      // Down swipe
      cycleAnimalArrayIndex(-1);
    }
  };

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      // Reset any state related to the gesture
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: colourWheel[colourIndex] },
        ]}
      >
        <Image source={animalArray[animalIndex]} />
      </View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
