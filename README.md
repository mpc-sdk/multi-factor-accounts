# TSS Snap

Threshold signatures snap for MetaMask.

## Prerequisites

This repository contains submodules so you should clone it recursively.

* Stable [Rust toolchain](https://www.rust-lang.org/tools/install)
* Node >= 18
* `wasm-pack` (`cargo install wasm-pack`)
* `cargo-make` (`cargo install cargo-make`)

## Webassembly

To compile the webassembly bindings:

```
(cd sdk && cargo make bindings)
```

## Dev Build

To start a development server using [parcel](https://parceljs.org/) run:

```
yarn install
yarn start
```

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
