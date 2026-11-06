import { paginationWindow, type PaginationWindow } from '@lp-labs/pagination-window';
const window: PaginationWindow = paginationWindow({ totalItems: 10, pageSize: 2, currentPage: 1 });
// @ts-expect-error immutable result
window.currentPage = 2;
// @ts-expect-error explicit pageSize required
paginationWindow({ totalItems: 10, currentPage: 1 });
