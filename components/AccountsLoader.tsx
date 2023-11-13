import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { AppDispatch } from "@/app/store";
import { accountsSelector, setAccounts } from "@/app/store/accounts";
import { listAccounts } from "@/lib/keyring";

import Loader from "./Loader";

export default function AccountsLoader() {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { loaded } = useSelector(accountsSelector);

  useEffect(() => {
    const onLoadKeys = async () => {
      const accounts = await listAccounts();
      await dispatch(setAccounts(accounts));
      // Load any saved key information
      setLoading(false);
    };
    if (!loaded) {
      onLoadKeys();
    }
  }, []);

  if (loading) {
    return <Loader text="Loading accounts..." />;
  }

  return null;
}
