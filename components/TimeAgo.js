import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';

const TimeAgo = ({ timestamp, style }) => {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateTimeAgo = () => {
      const currentTime = new Date();
      const previousTime = new Date(timestamp);

      const timeDifference = currentTime - previousTime;

      const hour = 60 * 60 * 1000;
      const day = 24 * 60 * 60 * 1000;

      if (timeDifference < hour) {
        const minutesAgo = Math.round(timeDifference / (60 * 1000));
        setTimeAgo(`${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`);
      } else if (timeDifference < day) {
        const hoursAgo = Math.round(timeDifference / hour);
        setTimeAgo(`${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`);
      } else {
        const daysAgo = Math.round(timeDifference / day);
        setTimeAgo(`${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`);
      }
    };

    updateTimeAgo();

    const interval = setInterval(updateTimeAgo, 60000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return <Text style={style}>{timeAgo}</Text>;
};

export default TimeAgo;