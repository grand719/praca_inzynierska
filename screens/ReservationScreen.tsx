import React, { useCallback, useEffect, useState } from "react";
import ScreenGradient from "../components/ScreenGradient";
import ReservationScreenContent from "../components/ReservationScreenContent";

const ReservationScreen = () => {
  const [shouldResetScreenContent, setShouldResetScreenContent] =
    useState(false);

  useEffect(() => {
    if (shouldResetScreenContent) {
      setShouldResetScreenContent(false);
    }
  }, [shouldResetScreenContent]);

  const resetScreenContent = useCallback(() => {
    setShouldResetScreenContent(true);
  }, []);

  return (
    <ScreenGradient>
      {!shouldResetScreenContent && (
        <ReservationScreenContent resetScreenContent={resetScreenContent} />
      )}
    </ScreenGradient>
  );
};

export default ReservationScreen;
