import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

interface UseNetworkStatusResult {
  isConnected: boolean;
  networkReady: boolean;
}

export function useNetworkStatus(): UseNetworkStatusResult {
  const [isConnected, setIsConnected] = useState(true);
  const [networkReady, setNetworkReady] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false);
      setNetworkReady(true);
    });

    void NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected ?? false);
      setNetworkReady(true);
    });

    return unsubscribe;
  }, []);

  return { isConnected, networkReady };
}
