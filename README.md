# @lp-labs/pagination-window

Pure one-based visible page windows with explicit omitted ranges.

## Install

```sh
npm install @lp-labs/pagination-window
```

Zero runtime, peer, or sibling dependencies. Node 18+; strict TypeScript declarations and independent ESM/CommonJS builds. Version 0.1.0, MIT.

## Quickstart

```js
import { paginationWindow } from '@lp-labs/pagination-window';
const window = paginationWindow({ totalItems: 97, pageSize: 10, currentPage: 5 });
console.log(window.totalPages, window.startItem, window.endItem); // 10 41 50
console.log(window.items);
```

## API and contracts

paginationWindow takes totalItems (nonnegative), pageSize/currentPage (positive), siblingCount/boundaryCount (nonnegative, default 1), all safe integers. Counts over 10000 throw RangeError to bound allocations. currentPage clamps down to the last page; empty totals yield currentPage/startItem/endItem 0 and no items. Nonempty item positions are one-based inclusive. PageItem is page or ellipsis with inclusive omitted from/to/count; a single omitted page is shown directly, including at edges when boundaryCount is zero. Result and nested items are frozen. No UI/DOM, fetching, cursor pagination, or total estimation. Runtime and memory O(window size), sorting O(window size log window size), independent of totalItems; callers can format ellipses and links themselves.

## Full declarations

The complete public declarations below are generated from the package's strict source. All runtime exports, interfaces, options, return types and readonly state are listed here.

<!-- declarations -->

```ts
export type PageItem =
  | Readonly<{
      type: 'page';
      page: number;
      current: boolean;
    }>
  | Readonly<{
      type: 'ellipsis';
      from: number;
      to: number;
      count: number;
    }>;
export interface PaginationOptions {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  siblingCount?: number;
  boundaryCount?: number;
}
export interface PaginationWindow {
  readonly totalPages: number;
  readonly currentPage: number;
  readonly startItem: number;
  readonly endItem: number;
  readonly hasPrevious: boolean;
  readonly hasNext: boolean;
  readonly items: readonly PageItem[];
}
export declare function paginationWindow(options: PaginationOptions): PaginationWindow;
```

<!-- end declarations -->

## Development

```sh
npm ci --offline
npm run build
npm run typecheck
npm test
npm run format:check
```

All tests use deterministic clocks, immediate injected sleeps, or explicit promise gates rather than timing guesses. Package exports select ESM for import and CommonJS for require, with separate declaration trees. No runtime configuration files or global hooks.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
