/* eslint-disable @typescript-eslint/unbound-method */
import { useCallback, useEffect } from "react";
import Log from "../logs/Log";
import { Emitter } from "../utils/Emitter";

export function useEventListener<T>(
  event: T,
  emitter: Emitter<T>,
  callback: (params: any) => void,
) {
  const listener = useCallback(callback, []);

  useEffect(() => {
    if (!emitter) {
      Log.error("useEventListener", "Emitter object is not defined");
      return;
    }

    const addListener = emitter.on;
    const removeListener = emitter.off;

    if (!addListener && !removeListener) {
      Log.error("useEventListener", "listeners are not defined");
      return;
    }
    addListener.call(emitter, event, listener);

    return () => {
      removeListener.call(emitter, event, listener);
    };
  }, [emitter, event, listener]);
}

export default useEventListener;
