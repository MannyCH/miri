import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import Pusher from 'pusher-js';
import { dataClient } from '../lib/dataClient';
import { useAuth } from './AuthContext';

const PusherContext = createContext(null);

/**
 * PusherProvider — Initializes a single pusher-js client, handles auth,
 * exposes subscribe/unsubscribe helpers and the current socketId.
 *
 * Nests inside AuthContext (needs token), outside AppContext (provides Pusher).
 */
export function PusherProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const pusherRef = useRef(null);
  const [socketId, setSocketId] = useState(null);
  const [connectionState, setConnectionState] = useState('disconnected');

  // Initialize Pusher when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      // Disconnect on logout
      if (pusherRef.current) {
        pusherRef.current.disconnect();
        pusherRef.current = null;
        setSocketId(null);
        setConnectionState('disconnected');
      }
      return;
    }

    const key = import.meta.env.VITE_PUSHER_KEY;
    const cluster = import.meta.env.VITE_PUSHER_CLUSTER;

    if (!key || !cluster) {
      console.warn('Missing VITE_PUSHER_KEY or VITE_PUSHER_CLUSTER — real-time sync disabled.');
      return;
    }

    const pusher = new Pusher(key, {
      cluster,
      forceTLS: true,
      channelAuthorization: {
        customHandler: async ({ channelName, socketId }, callback) => {
          try {
            const { data: sessionData } = await dataClient.auth.getSession();
            const token = sessionData?.session?.token;
            if (!token) throw new Error('No auth token for Pusher');

            const res = await fetch('/api/pusher-auth', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ socket_id: socketId, channel_name: channelName }),
            });

            if (!res.ok) throw new Error(`Auth failed: ${res.status}`);
            const data = await res.json();
            callback(null, data);
          } catch (err) {
            callback(err, null);
          }
        },
      },
    });

    pusher.connection.bind('state_change', ({ current }) => {
      setConnectionState(current);
      if (current === 'connected') {
        setSocketId(pusher.connection.socket_id);
      }
    });

    // Set initial socket ID if already connected
    if (pusher.connection.state === 'connected') {
      setSocketId(pusher.connection.socket_id);
      setConnectionState('connected');
    }

    pusherRef.current = pusher;

    return () => {
      pusher.disconnect();
      pusherRef.current = null;
      setSocketId(null);
      setConnectionState('disconnected');
    };
  }, [isAuthenticated]);

  const subscribe = useCallback((channelName) => {
    if (!pusherRef.current) return null;
    return pusherRef.current.subscribe(channelName);
  }, []);

  const unsubscribe = useCallback((channelName) => {
    if (!pusherRef.current) return;
    pusherRef.current.unsubscribe(channelName);
  }, []);

  const getSocketId = useCallback(() => {
    return pusherRef.current?.connection?.socket_id || socketId;
  }, [socketId]);

  const value = React.useMemo(() => ({
    subscribe,
    unsubscribe,
    getSocketId,
    connectionState,
  }), [subscribe, unsubscribe, getSocketId, connectionState]);

  return <PusherContext.Provider value={value}>{children}</PusherContext.Provider>;
}

export function usePusher() {
  const context = useContext(PusherContext);
  if (!context) {
    throw new Error('usePusher must be used within PusherProvider');
  }
  return context;
}
