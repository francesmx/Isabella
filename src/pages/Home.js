import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { colourWheel } from '../utils/ColorWheel';
import { Audio } from 'expo-av';
import ShakeImage from '../utils/ShakeImage';

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

  const [colourIndexChanged, setColourIndexChanged] = useState(false);
  const [animalIndexChanged, setAnimalIndexChanged] = useState(false);

  const [isImageTouched, setIsImageTouched] = useState(false);

  const [sound, setSound] = useState();

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/sounds/boing.mp3')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const cycleColourArrayIndex = (increment) => {
    const nextIndex =
      (colourIndex + increment + colourWheel.length) % colourWheel.length;
    setColourIndex(nextIndex);
    setColourIndexChanged(true);
  };

  const cycleAnimalArrayIndex = (increment) => {
    const nextIndex =
      (animalIndex + increment + animalArray.length) % animalArray.length;
    setAnimalIndex(nextIndex);
    setAnimalIndexChanged(true);
  };

  const handleImageTouch = () => {
    setIsImageTouched(true);
    playSound();

    setTimeout(() => {
      setIsImageTouched(false);
    }, 150);
  };

  const onGestureEvent = (event) => {
    const { translationX, translationY } = event.nativeEvent;

    if (translationX > 50 && !colourIndexChanged) {
      cycleColourArrayIndex(-1);
    } else if (translationX < -50 && !colourIndexChanged) {
      cycleColourArrayIndex(1);
    }

    if (translationY > 50 && !animalIndexChanged) {
      cycleAnimalArrayIndex(1);
    } else if (translationY < -50 && !animalIndexChanged) {
      cycleAnimalArrayIndex(-1);
    }
  };

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      // Reset the flags for the next swipe
      setColourIndexChanged(false);
      setAnimalIndexChanged(false);
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
        <TouchableWithoutFeedback onPress={handleImageTouch}>
          <Image
            source={animalArray[animalIndex]}
            style={[
              styles.image,
              isImageTouched && { transform: [{ scale: 1.3 }] },
            ]}
          />
        </TouchableWithoutFeedback>
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
  image: {
    width: 200,
    height: 250,
  },
});
