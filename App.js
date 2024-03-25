import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Button,
  SafeAreaView,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Section, TableView } from 'react-native-tableview-simple';
import Chart from './components/Chart';
import StockInfo from './components/StockInfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

import List from './components/List';
import SearchBar from './components/SearchBar';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Stocks', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="Chart"
          component={Chart}
          options={({ route }) => ({
            title: route.params.title,
            data: route.params.data,
            headerTitleAlign: 'center',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen({ navigation }) {
  const [favQuotes, setFavQuotes] = useState(['AMD', 'IBM', 'AAPL']);
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [searchPhrase, setSearchPhrase] = useState('');
  const [clicked, setClicked] = useState(false);
  const [searchQuotes, setSearchQuotes] = useState([]);

  const url =
    'https://yh-finance.p.rapidapi.com/market/v2/get-quotes?region=US&symbols=' +
    favQuotes.toString();
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '13467ca8d5msh135e51ecf8d6972p1f5560jsn5993926b718d',
      'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com',
    },
  };

  const asyncData = async () => {
    try {
      await AsyncStorage.setItem('favQuotes', JSON.stringify(arrayFavQuotes));
      const asyncFavQuotes = await AsyncStorage.getItem('favQuotes');
      if (asyncFavQuotes) {
        
        const parsedData = JSON.parse(asyncFavQuotes);
        
        setFavQuotes(parsedData);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const fetchData = async () => {
    setIsLoading(true);
    try {
      await fetch(url, options)
        .then((res) => res.json())
        .then(
          (data) => setQuotes(data.quoteResponse.result)
          // AsyncStorage.setItem('quotes', JSON.stringify(data.quoteResponse.result))
        );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      getData();
    }
  };

  const urlSearchQuotes =
    'https://yh-finance.p.rapidapi.com/screeners/get-symbols-by-predefined?scrIds=MOST_ACTIVES&start=0&count=100';
  const optionsSearchQuotes = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '13467ca8d5msh135e51ecf8d6972p1f5560jsn5993926b718d',
      'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com',
    },
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      await fetch(urlSearchQuotes, optionsSearchQuotes)
        .then((res) => res.json())
        .then(
          (data) => setSearchQuotes(data.finance.result[0].quotes)
          // AsyncStorage.setItem('searchQuotes', JSON.stringify(data.finance.result[0].quotes))
        );
    } catch (error) {
      console.error(error, 5);
    } finally {
      setIsLoading(false);
    }
  };

  const useData = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.setItem('favQuotes', JSON.stringify(favQuotes));
      // const value1 = await AsyncStorage.getItem('quotes');
      // const value2 = await AsyncStorage.getItem('searchQuotes');
      const value3 = await AsyncStorage.getItem('favQuotes');
      console.log(value3);
      // setQuotes(JSON.parse(value1));
      // setSearchQuotes(JSON.parse(value2));
      // setFavQuotes(JSON.parse(value3));

      // console.log(favQuotes, 1);
      // console.log(quotes, 2);
      // console.log(searchQuotes, 3);
    } catch (error) {
      console.error(error, 4);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [favQuotes]);

  useEffect(() => {
    asyncData();
    fetchData();
    // getData();
    // useData();
  }, []);
  return (
    <>
      <SafeAreaView style={styles.root}>
        <SearchBar
          searchPhrase={searchPhrase}
          setSearchPhrase={setSearchPhrase}
          clicked={clicked}
          setClicked={setClicked}
        />
        {clicked && (
          <List
            searchPhrase={searchPhrase}
            data={searchQuotes}
            setClicked={setClicked}
            setFavQuotes={setFavQuotes}
            favQuotesR={favQuotes}
          />
        )}
      </SafeAreaView>
      {!clicked && (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <TableView style={styles.tableView}>
              {/*<Button
                title="Fetch Data"
                onPress={fetchData}
                disabled={isLoading}
              />
              <Button title="Use Data" onPress={useData} disabled={isLoading} />*/}
              <Section
                separatorTintColor="#ccc"
                style={{ paddingTop: 15 }}
                hideSeparator={true}>
                {quotes?.length > 0 &&
                  quotes.map((el) => {
                    return (
                      <StockInfo
                        symbols={el.symbol}
                        price={el.regularMarketPrice.toFixed(2)}
                        companyName={el.shortName}
                        changedPercent={el.regularMarketChange.toFixed(3)}
                        setFavQuotes={setFavQuotes}
                        favQuotesR={favQuotes}
                        action={() =>
                          navigation.navigate('Chart', {
                            title: el.symbol,
                            data: el,
                            setFavQuotes,
                            favQuotes,
                            quotes
                          })
                        }
                      />
                    );
                  })}
              </Section>
            </TableView>
          </ScrollView>
        </View>
      )}
    </>
  );
}

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
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingTop: 15,
  },
});
