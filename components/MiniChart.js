import React, { useEffect, useState } from 'react';
import { LineChart, Grid } from 'react-native-svg-charts';

export default function LineChartExample({ percent, quote}) {

  const [stockChartData, setStockChartData] = useState([]);

const url = `https://yh-finance.p.rapidapi.com/stock/v3/get-chart?interval=1d&symbol=${quote}&range=1mo&region=US&includePrePost=false&useYfid=true&includeAdjustedClose=true&events=capitalGain%2Cdiv%2Csplit`;
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '13467ca8d5msh135e51ecf8d6972p1f5560jsn5993926b718d',
    'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
  }
};
  const fetchData = async () => {
    try {
      await fetch(url, options)
        .then((res) => res.json())
        .then((data) => 
          setStockChartData(data.chart.result[0].indicators.adjclose[0].adjclose)
        );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  },[]);

  const data = [
    50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80, 10, 40, 95,
    -4, -24, 85, 91, 35, 53, -53, 24, 50,
  ];
  let color = percent >= 0 ? 'green': 'red'
  return (
    <LineChart
      style={{ height: 50, width: 60, backgroundColor: 'black' }}
      data={stockChartData.length > 0 ? stockChartData : data}
      svg={{ stroke: color , elevation: 5 }}
      contentInset={{ top: 0, bottom: 20 }}>
      <Grid />
    </LineChart>
  );
}
