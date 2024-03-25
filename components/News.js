import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native';
import { Cell} from 'react-native-tableview-simple';
import TimeAgo from './TimeAgo';
import { WebView } from 'react-native-webview';
import * as WebBrowser from 'expo-web-browser';

function NewsCell() {
  const [news, setNews] = useState([]);

const openWebBrowser = async (url) => {
    try {
    await WebBrowser.openBrowserAsync(url);
  } catch (error) {
    console.error('Error opening web browser:', error);
  }
};
  console.log('News:');
  const url =
    'https://yh-finance.p.rapidapi.com/news/v2/list?region=US&snippetCount=10';
  const options = {
    method: 'POST',
    headers: {
      'X-RapidAPI-Key': '13467ca8d5msh135e51ecf8d6972p1f5560jsn5993926b718d',
      'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com',
    },
    body: '"Pass in the value of uuids field returned right in this endpoint to load the next page, or leave empty to load first page"',
  };
  const fetchData = async () => {
    try {
      await fetch(url, options)
        .then((res) => res.json())
        .then((data) => setNews(data.data?.main?.stream));
    } catch (error) {
      console.error(error);
    }
  };
  console.log(news);
  useEffect(() => {
    fetchData();
  },[]);

  return (
    <>
      <Cell backgroundColor="transparent" highlightColor="#ccc">
        <Text style={styles.cellTitle}>News</Text>
        {news?.length > 0 &&
          news.map((el) => {
            return (
              <View>
              <TouchableOpacity style={styles.newContainer} onPress={() => openWebBrowser(el.content?.clickThroughUrl ? el.content?.clickThroughUrl.url: el.content?.previewUrl ? el.content?.previewUrl : '')}>
                <View style={styles.titleContainer}>
                  <Text style={styles.newTitle}>
                    {el.content.provider.displayName}
                  </Text>
                  <Text style={styles.titleText}>{el.content.title}</Text>
                </View>
                <View style={styles.timeContainer}>
                  <TimeAgo
                    style={styles.timeText}
                    timestamp={el.content.pubDate}
                  />
                </View>
                <Image
                  source={{ uri: el.content.thumbnail?.resolutions[0].url }}
                  style={styles.cellImage}
                />
                </TouchableOpacity>
              </View>
            );
          })}
      </Cell>
    </>
  );
}

const styles = StyleSheet.create({
  newContainer: {
    color: '#fff',
    height: 180,
    borderRadius: 10,
    backgroundColor: '#3A3B3C',
    position: 'relative',
    marginBottom: 10,
  },
  cellTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 5,
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#eeeeee50',
  },
  cellImage: {
    position: 'absolute',
    top: '10%',
    right: 10,
    width: '40%',
    height: 140,
    borderRadius: 10,
  },
  titleContainer: {
    position: 'absolute',
    top: '5%',
    left: 10,
    width: '50%',
    height: 150,
    paddingVertical: 5,
  },
  newTitle: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  titleText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 10
  },
  timeContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: '100%',
    paddingVertical: 5,
  },
  timeText: {
    color: 'gray',
    fontSize: 12,
  },
});

export default NewsCell;
