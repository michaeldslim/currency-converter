import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { getTodayIso } from '../utils/rateCalendar';

const CHECK_INTERVAL_MS = 60_000;

export function useLocalToday(): string {
  const [today, setToday] = useState(getTodayIso);

  useEffect(() => {
    const syncToday = () => {
      setToday(getTodayIso());
    };

    const intervalId = setInterval(syncToday, CHECK_INTERVAL_MS);
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        syncToday();
      }
    });

    return () => {
      clearInterval(intervalId);
      subscription.remove();
    };
  }, []);

  return today;
}
