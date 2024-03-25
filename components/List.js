import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const List = ({ searchPhrase, setClicked, data, setFavQuotes, favQuotesR }) => {
  const renderItem = ({ item }) => {
    const addFavorite = async (value) => {
      console.log(value, 'list 1');
      try {
        const favQuotes = await AsyncStorage.getItem('favQuotes');
        console.log(favQuotes, 'list 2');
        const arrayFavQuotes = favQuotes ? JSON.parse(favQuotes) : [];

        arrayFavQuotes.push(value);
        await AsyncStorage.setItem('favQuotes', JSON.stringify(arrayFavQuotes));

        setFavQuotes([...favQuotesR, value]);
        setClicked(false)
      } catch (e) {
        console.error(e);
      }
    };
    
    if (searchPhrase === '') {
      return (
        <View style={styles.stockContainer}>
          <View style={styles.addContainer}>
            <Pressable
              style={styles.addButton}
              onPress={() => addFavorite(item.symbol)}>
              <Text>+</Text>
            </Pressable>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.menuTitle}>{item.symbol}</Text>
            <Text style={styles.cellTagline}>{item.shortName}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>
              $ {item.regularMarketPrice.raw.toFixed(2)}
            </Text>
            <Text
              style={
                item.regularMarketChangePercent.raw >= 0
                  ? styles.changedPlusPriceContainer
                  : styles.changedMinusPriceContainer
              }>
              {item.regularMarketChangePercent.raw >= 0 ? '+' : ''}
              {item.regularMarketChangePercent.raw.toFixed(3)}
            </Text>
          </View>
        </View>
      );
    }
    
    if (
      item.symbol
        .toUpperCase()
        .includes(searchPhrase.toUpperCase().trim().replace(/\s/g, ''))
    ) {
      return (
        <View style={styles.stockContainer}>
          <View style={styles.addContainer}>
            <Pressable
              style={styles.addButton}
              onPress={() => addFavorite(item.symbol)}>
              <Text>+</Text>
            </Pressable>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.menuTitle}>{item.symbol}</Text>
            <Text style={styles.cellTagline}>{item.shortName}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>
              $ {item.regularMarketPrice.raw.toFixed(2)}
            </Text>
            <Text
              style={
                item.regularMarketChangePercent.raw >= 0
                  ? styles.changedPlusPriceContainer
                  : styles.changedMinusPriceContainer
              }>
              {item.regularMarketChangePercent.raw >= 0 ? '+' : ''}
              {item.regularMarketChangePercent.raw.toFixed(3)}
            </Text>
          </View>
        </View>
      );
    }
    
    if (
      item.shortName
        .toUpperCase()
        .includes(searchPhrase.toUpperCase().trim().replace(/\s/g, ''))
    ) {
      return (
        <View style={styles.stockContainer}>
          <View style={styles.addContainer}>
            <Pressable
              style={styles.addButton}
              onPress={() => addFavorite(item.symbol)}>
              <Text>+</Text>
            </Pressable>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.menuTitle}>{item.symbol}</Text>
            <Text style={styles.cellTagline}>{item.shortName}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>
              $ {item.regularMarketPrice.raw.toFixed(2)}
            </Text>
            <Text
              style={
                item.regularMarketChangePercent.raw >= 0
                  ? styles.changedPlusPriceContainer
                  : styles.changedMinusPriceContainer
              }>
              {item.regularMarketChangePercent.raw >= 0 ? '+' : ''}
              {item.regularMarketChangePercent.raw.toFixed(3)}
            </Text>
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.list__container}>
      <View>{data.length > 0 && data.map((item) => renderItem({ item }))}</View>
    </SafeAreaView>
  );
};

export default List;

const styles = StyleSheet.create({
  list__container: {
    height: '100%',
    width: '100%',
    color: '#fff',
  },
  stockContainer: {
    height: 80,
    paddingBottom: 40,
    borderBottomColor: '#eeeeee05',
    borderBottomWidth: 1,
  },
  titleContainer: {
    position: 'absolute',
    top: '30%',
    left: '12%',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addContainer: {
    position: 'absolute',
    left: 15,
    top: '48%',
    width: 20,
    height: 20,
    backgroundColor: '#eee',
    borderRadius: 30,
    flex: 1,
    resizeMode: 'cover',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    top: '8%',
    left: '28%',
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
