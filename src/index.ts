export type PageItem =
  | Readonly<{ type: 'page'; page: number; current: boolean }>
  | Readonly<{ type: 'ellipsis'; from: number; to: number; count: number }>;
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
function integer(value: number, minimum: number, name: string): void {
  if (!Number.isSafeInteger(value) || value < minimum) throw new RangeError(name + ' is invalid');
}
export function paginationWindow(options: PaginationOptions): PaginationWindow {
  const { totalItems, pageSize, currentPage, siblingCount = 1, boundaryCount = 1 } = options;
  integer(totalItems, 0, 'totalItems');
  integer(pageSize, 1, 'pageSize');
  integer(currentPage, 1, 'currentPage');
  integer(siblingCount, 0, 'siblingCount');
  integer(boundaryCount, 0, 'boundaryCount');
  if (siblingCount > 10000 || boundaryCount > 10000)
    throw new RangeError('Window counts exceed 10000');
  const totalPages = Math.ceil(totalItems / pageSize);
  const current = totalPages === 0 ? 0 : Math.min(currentPage, totalPages);
  const pages = new Set<number>();
  const addRange = (from: number, to: number) => {
    for (let page = Math.max(1, from); page <= Math.min(totalPages, to); page++) pages.add(page);
  };
  if (totalPages > 0) {
    addRange(1, boundaryCount);
    addRange(totalPages - boundaryCount + 1, totalPages);
    addRange(current - siblingCount, current + siblingCount);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const items: PageItem[] = [];
  let previous = 0;
  const gap = (from: number, to: number) => {
    if (from > to) return;
    if (from === to)
      items.push(Object.freeze({ type: 'page', page: from, current: from === current }));
    else items.push(Object.freeze({ type: 'ellipsis', from, to, count: to - from + 1 }));
  };
  for (const page of sorted) {
    gap(previous + 1, page - 1);
    items.push(Object.freeze({ type: 'page', page, current: page === current }));
    previous = page;
  }
  gap(previous + 1, totalPages);
  const startItem = current === 0 ? 0 : (current - 1) * pageSize + 1;
  const endItem = current === 0 ? 0 : startItem + Math.min(pageSize - 1, totalItems - startItem);
  return Object.freeze({
    totalPages,
    currentPage: current,
    startItem,
    endItem,
    hasPrevious: current > 1,
    hasNext: current > 0 && current < totalPages,
    items: Object.freeze(items),
  });
}
