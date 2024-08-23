import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Define the type of the props if you have any (optional)
type InfoViewProps = {
  // Add any props here if needed
};

// Use React.forwardRef and specify the type of the ref
const InfoView = forwardRef<View, InfoViewProps>((props, ref) => {
  return (
    <View ref={ref} style={styles.container}>
      <Text style={styles.text}>InfoView Content Here</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
  },
});

export default InfoView;
