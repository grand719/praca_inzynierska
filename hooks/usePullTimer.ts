import { useCallback, useRef } from "react";
import Log from "../logs/Log";

const TAG = "usePullTimer";

export const usePullTimer = (
  pullFunction: () => Promise<void>,
  delay: number,
) => {
  const allowPulling = useRef(false);

  const timeout = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const allowStartPulling = useCallback(() => {
    allowPulling.current = true;
  }, []);

  const stopPulling = useCallback(() => {
    allowPulling.current = false;
  }, []);

  const startPulling = () => {
    if (!allowPulling.current) return;
    Log.info(TAG, "Start pulling notifications", allowPulling);
    timeout(delay)
      .then(() => pullFunction())
      .catch(e => {
        stopPulling();
        Log.error(TAG, "Failed to pull data", e);
      })
      .finally(() => {
        if (allowPulling.current) startPulling();
      });
  };

  return {
    startPulling,
    stopPulling,
    allowStartPulling,
  };
};
