import { TouchableOpacity, Text, View, StyleSheet, Button } from 'react-native';
import MiniChart from './MiniChart';

function StockInfo(props) {
  return (
    <>
      <TouchableOpacity
        key={props.id}
        style={styles.stockContainer}
        onPress={props.action}>
        <View style={styles.titleContainer}>
          <Text style={styles.menuTitle}>{props.symbols}</Text>
          <Text style={styles.cellTagline}>{props.companyName}</Text>
        </View>
        <View style={styles.chartContainer}>
          <MiniChart percent={props.changedPercent} quote={props.symbols}/>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>$ {props.price}</Text>
          <Text
            style={
              props.changedPercent >= 0
                ? styles.changedPlusPriceContainer
                : styles.changedMinusPriceContainer
            }>
            {props.changedPercent >= 0 ? '+' : ''}
            {props.changedPercent}
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  stockContainer: {
    height: 80,
    paddingBottom: 40,
    borderBottomColor: '#eeeeee05',
    borderBottomWidth: 1,
  },
  titleContainer: {
    position: 'absolute',
    top: '18%',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 30,
  },
  chartContainer: {
    position: 'absolute',
    left: '45%',
    top: '20%',
    width: 60,
    height: 60,
    flex: 1,
    padding: 15,
    resizeMode: 'cover',
  },
  priceContainer: {
    position: 'absolute',
    top: '30%',
    right: 10,
    width: 70,
    textAlign: 'right',
  },
  changedPlusPriceContainer: {
    fontSize: 14,
    color: 'white',
    backgroundColor: 'green',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  changedMinusPriceContainer: {
    fontSize: 14,
    color: 'white',
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  priceText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  cellTagline: {
    fontSize: 14,
    color: '#888',
    width: 150,
  },
});

export default StockInfo;
