import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/Loader";
import { AppDispatch } from "@/app/store";
import { accountsSelector, setAccounts } from "@/app/store/accounts";
import { listAccounts } from "@/lib/keyring";
import guard from '@/lib/guard';

export default function AccountsLoader() {
  const { toast } = useToast();
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { loaded } = useSelector(accountsSelector);

  useEffect(() => {
    const onLoadKeys = async () => {
      await guard(async () => {
        const accounts = await listAccounts();
        await dispatch(setAccounts(accounts));
        // Load any saved key information
        setLoading(false);
      }, toast );
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
