# Multi-Factor Accounts Snap

Snap for MetaMask that uses threshold signatures to add multi-factor account support by sharding the key across multiple distinct MetaMask accounts.

Keys can be sharded for one person across multiple devices or split for different people so organizations can require multiple authorities to sign off on transactions.

Unlike contract-based solutions using threshold signatures avoids additional gas fees.

Currently supports the GG20 protocol with a CGGMP protocol expected to be integrated soon.

## Prerequisites

This repository contains submodules so you should clone it recursively.

* Stable [Rust toolchain](https://www.rust-lang.org/tools/install)
* Node >= 18
* `wasm-pack` (`cargo install wasm-pack`)
* `cargo-make` (`cargo install cargo-make`)

### Server Keypair

Generate a keypair for the backend server:

```
(cd sdk && cargo make gen-server-key)
```

### Webassembly

Compile the webassembly bindings:

```
(cd sdk && cargo make bindings)
```

To debug the webassembly compile with the `tracing` feature flag:

```
(cd sdk && cargo make bindings-debug)
```

Which will enable `tracing` output to the browser console.

## Relay Server

A backend relay server must be running for meeting points and relaying messages, to start a server using the default config (you must have already generated a keypair for the server):

```
cd sdk
cargo run -- start config.toml
```

Note that CORS configuration is in the `sdk/config.toml` file so if you change the port for the development server you would need to update the CORS configuration.

## Dev Build

To start a development server using [parcel](https://parceljs.org/) run:

```
yarn install
yarn start
```

Note if you re-compile the webassembly bindings you should also restart the development server to clear the parcel cache.

## Production Build

The production build uses [webpack](https://webpack.js.org/) as it creates a smaller bundle:

```
yarn build
```

## Snap

The snap code is compiled into the `bundle` folder, this task is automatically run before creating a dev or production build.

```
yarn build:snap
```

## Tasks

Some more useful tasks:

```
yarn types    # type check
yarn lint     # lint
yarn fmt      # format
```

## License

MIT
