import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { AppDispatch } from "@/app/store";
import { keysSelector, loadKeys } from "@/app/store/keys";

import Loader from "./Loader";

export default function KeysLoader() {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { loaded } = useSelector(keysSelector);

  useEffect(() => {
    const onLoadKeys = async () => {
      // Load any saved key information
      await dispatch(loadKeys());
      setLoading(false);
    };
    if (!loaded) {
      onLoadKeys();
    }
  }, []);

  if (loading) {
    return <Loader text="Loading key shares..." />;
  }
  return null;
}
