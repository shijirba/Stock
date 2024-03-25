import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { format } from 'date-fns';
import { Section, TableView } from 'react-native-tableview-simple';
import NewsCell from './News.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StockInfoAnimate from './StockInfoAnimate';

const StockChart = ({ route }) => {
  const navigation = useNavigation();
  const [stockChartData, setStockChartData] = useState([]);
  const { data, title, favQuotes, setFavQuotes, quotes } = route.params;
  const [isRunning, setIsRunning] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const animatedValue = new Animated.Value(0);

  const goToHomeScreen = () => {
    navigation.navigate('Home', { fetch: true });
  };

  console.log(title);

  const minusFavorite = async (value) => {
    console.log(value, 'list 1');
    try {
      const asyncFavQuotes = await AsyncStorage.getItem('favQuotes');
      console.log(asyncFavQuotes, 'list 2');
      const arrayFavQuotes = asyncFavQuotes ? JSON.parse(asyncFavQuotes) : [];

      const index = arrayFavQuotes.indexOf(value);
      if (index > -1) {
        arrayFavQuotes.splice(index, 1);
      }
      console.log(arrayFavQuotes, 44);
      await AsyncStorage.setItem('favQuotes', JSON.stringify(arrayFavQuotes));

      const newArray = favQuotes.filter((element) => element !== value);
      setFavQuotes(newArray);
      goToHomeScreen();
    } catch (e) {
      console.error(e);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://yh-finance.p.rapidapi.com/stock/v3/get-chart?interval=1mo&symbol=${title}&range=1y&region=US&includePrePost=false&useYfid=true&includeAdjustedClose=true&events=capitalGain%2Cdiv%2Csplit`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': '13467ca8d5msh135e51ecf8d6972p1f5560jsn5993926b718d',
            'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com',
          },
        }
      );

      const result = await response.json();
      console.log('Timestamps:', result.chart.result[0].timestamp);
      console.log(
        'Close Prices:',
        result.chart.result[0].indicators.quote[0].close
      );

      const timestamps = result.chart.result[0].timestamp || [];
      const closePrices =
        result.chart.result[0].indicators.quote[0].close || [];

      if (
        timestamps.length === 0 ||
        closePrices.length === 0 ||
        closePrices.some(isNaN)
      ) {
        throw new Error('Invalid data or NaN values');
      }

      const formattedChartData = timestamps.map((timestamp, index) => ({
        x: format(new Date(timestamp * 1000), 'MMM'),
        y: closePrices[index],
      }));

      setStockChartData(formattedChartData);
      console.log(stockChartData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const startAnimation = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: favQuotes.length * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
      isInteraction: false,
    }).start(() => {
      if (isRunning) {
        animatedValue.setValue(0);
        startAnimation();
      }
    });
  };

  useEffect(() => {
  if (isRunning) {
    startAnimation();
  }
    if (!stockChartData.length) {
      fetchData();
    }
  },[isRunning, stockChartData]);

  useEffect(() => {
  if (isRunning) {
    startAnimation();
  }
  })

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={{ height: '100%' }}>
        <TableView style={styles.tableView}>
          <Section>
          <ScrollView horizontal={true}>
            <View style={styles.animateContainer}>
              <Animated.View
                style={{
                  transform: [
                    {
                      translateX: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, -favQuotes.length * 100],
                      }),
                    },
                  ],
                }}>
                <View
                  style={{
                    flexDirection: 'row', 
                    alignItems: 'center',
                  }}>
                  {quotes?.length > 0 &&
                    quotes.map((el) => {
                      return (
                        <StockInfoAnimate
                          symbols={el.symbol}
                          price={el.regularMarketPrice.toFixed(2)}
                          companyName={el.shortName}
                          changedPercent={el.regularMarketChange.toFixed(3)}
                          action={() =>
                            navigation.navigate('Chart', {
                              title: el.symbol,
                              data: el,
                              setFavQuotes,
                              favQuotes,
                              quotes,
                            })
                          }
                        />
                      );
                    })}
                </View>
              </Animated.View>
            </View>
            </ScrollView>
            <View style={styles.stockContainer}>
              <Text style={styles.companyTitle}>{data.shortName}</Text>
              <View style={styles.priceContainer}>
                <View style={styles.addContainer}>
                  <TouchableOpacity
                    style={styles.trashIcon}
                    onPress={() => minusFavorite(title)}>
                    <Icon name="trash" size={20} color="white" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.priceText}>
                  {data.regularMarketPrice.toFixed(2)}
                </Text>
                <Text
                  style={
                    data.regularMarketChange > 0
                      ? styles.changedPlusPriceContainer
                      : styles.changedMinusPriceContainer
                  }>
                  {data.regularMarketChange.toFixed(2)}
                </Text>
              </View>
              <View style={styles.chartContainer}>
                {/*<Button
                  title="Fetch Data"
                  onPress={fetchData}
                  disabled={isLoading}
                />*/}
                {isLoading ? (
                  <Text style={styles.text}>Loading...</Text>
                ) : stockChartData.length > 0 ? (
                  <LineChart
                    data={{
                      labels: stockChartData.map((dataPoint) => dataPoint.x),
                      datasets: [
                        {
                          data: stockChartData.map((dataPoint) => dataPoint.y),
                          color: (opacity = 1) =>
                            `rgba(255, 255, 255, ${opacity})`,
                          strokeWidth: 2,
                        },
                      ],
                    }}
                    width={Dimensions.get('window').width * 0.95}
                    height={220}
                    chartConfig={{
                      backgroundColor: '#000',
                      backgroundGradientFrom: '#000',
                      backgroundGradientTo: '#000',
                      decimalPlaces: 1,
                      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      style: {
                        borderRadius: 16,
                      },
                    }}
                    style={{
                      marginTop: 20,
                      marginLeft: -20,
                    }}
                  />
                ) : (
                  <Text style={styles.text}>No valid data available.</Text>
                )}
              </View>
              <NewsCell />
            </View>
          </Section>
        </TableView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  tableView: {
    flex: 1,
  },
  text: {
    color: '#fff',
  },
  animateContainer: {
    width: '100%',
  },
  stockContainer: {
    padding: 15,
    paddingBottom: 100,
    borderBottomColor: '#eeeeee05',
    borderBottomWidth: 1,
  },
  chartContainer: {
    flex: 1,
  },
  priceContainer: {
    flex: 1,
    position: 'relative',
    height: 80,
    textAlign: 'center',
    color: '#fff',
  },
  changedPlusPriceContainer: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    fontSize: 14,
    fontWeight: 'bold',
    color: 'green',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  changedMinusPriceContainer: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    fontSize: 14,
    fontWeight: 'bold',
    color: 'red',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  priceText: {
    position: 'absolute',
    top: '20%',
    left: '40%',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  companyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addContainer: {
    position: 'absolute',
    left: 15,
    top: '15%',
    width: 30,
    height: 30,
    backgroundColor: '#ff0000',
    borderRadius: 10,
    flex: 1,
    resizeMode: 'cover',
    textAlign: 'center',
    justifyContent: 'center',
  },
  trashIcon: {
    position: 'absolute',
    top: '18%',
    left: '22%',
  },
});

export default StockChart;
