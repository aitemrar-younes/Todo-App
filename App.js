import { StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import ToDo from './components/ToDo';

export default function App() {
  return (
    <View style={styles.container}>
      <ToDo />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
