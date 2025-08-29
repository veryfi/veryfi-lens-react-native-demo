import VeryfiLens from '@veryfi/react-native-veryfi-lens';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const HelpView = () => {
  
  const closeHelpScreen = () => {
    VeryfiLens.closeHelpScreen();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>HelpView</Text>
      <Text style={styles.instructions}>Edit HelpView.tsx</Text>
      <Button title="Close" onPress={closeHelpScreen} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default HelpView;