import type { Dispatch, ReactNode, Reducer } from 'react';
import React, { createContext, useEffect, useReducer } from 'react';

import { getSnap, Snap } from '@/lib/snap';

export type MetaMaskState = {
  hasMetaMask: boolean;
  installedSnap?: Snap;
  error?: Error;
};

const initialState: MetaMaskState = {
  hasMetaMask: false,
};

/* eslint-disable @typescript-eslint/no-explicit-any */
type MetaMaskDispatch = { type: MetaMaskActions; payload: any };

export const MetaMaskContext = createContext<
  [MetaMaskState, Dispatch<MetaMaskDispatch>]
>([
  initialState,
  () => {
    /* no op */
  },
]);

export enum MetaMaskActions {
  SetInstalled = 'SetInstalled',
  SetMetaMaskDetected = 'SetMetaMaskDetected',
  SetError = 'SetError',
}

const reducer: Reducer<MetaMaskState, MetaMaskDispatch> = (state, action) => {
  switch (action.type) {
    case MetaMaskActions.SetMetaMaskDetected:
      return {
        ...state,
        hasMetaMask: action.payload,
      };
    case MetaMaskActions.SetInstalled:
      return {
        ...state,
        installedSnap: action.payload,
      };
    case MetaMaskActions.SetError:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

/**
 * MetaMask context provider to handle MetaMask and snap status.
 *
 * @param props - React Props.
 * @param props.children - React component to be wrapped by the Provider.
 * @returns JSX.
 */
export default function MetaMaskProvider({ children }: { children: ReactNode }) {
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const detectInstallation = async () => {
      /**
       * Detect if MetaMask is installed.
       */
      async function detectMetaMask() {
        const isMetaMaskDetected = typeof ethereum !== 'undefined';

        dispatch({
          type: MetaMaskActions.SetMetaMaskDetected,
          payload: isMetaMaskDetected,
        });
      }

      /**
       * Detect if the snap is installed.
       */
      async function detectSnapInstalled() {
        const installedSnap = await getSnap();
        dispatch({
          type: MetaMaskActions.SetInstalled,
          payload: installedSnap,
        });
      }

      await detectMetaMask();

      if (state.hasMetaMask) {
        await detectSnapInstalled();
      }
    };

    detectInstallation().catch(console.error);
  }, [state.hasMetaMask, ethereum]);

  useEffect(() => {
    let timeoutId: number;

    if (state.error) {
      timeoutId = window.setTimeout(() => {
        dispatch({
          type: MetaMaskActions.SetError,
          payload: undefined,
        });
      }, 10000);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [state.error]);

  return (
    <MetaMaskContext.Provider value={[state, dispatch]}>
      {children}
    </MetaMaskContext.Provider>
  );
}
