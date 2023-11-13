import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { KeyringAccount } from "@metamask/keyring-api";

export type AccountState = {
  accounts: KeyringAccount[];
  loaded: boolean;
};

const initialState: AccountState = {
  accounts: [],
  loaded: false,
};

const accountSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    setAccounts: (state, { payload }: PayloadAction<KeyringAccount[]>) => {
      // @ts-expect-error Type instantiation is excessively
      // deep and possibly infinite.
      //
      // Seems like a bug in the compiler to me.
      state.accounts = payload;
      state.loaded = true;
    },
  },
});

export const { setAccounts } = accountSlice.actions;
export const accountsSelector = (state: { accounts: AccountState }) =>
  state.accounts;
export default accountSlice.reducer;
