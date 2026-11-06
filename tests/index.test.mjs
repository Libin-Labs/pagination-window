import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as library from '../dist/esm/index.js';
const { paginationWindow } = library;

test('middle window reports exact omitted ranges', () => {
  const w = paginationWindow({ totalItems: 100, pageSize: 10, currentPage: 5 });
  assert.deepEqual(
    w.items.map((x) => (x.type === 'page' ? x.page : [x.from, x.to, x.count])),
    [1, [2, 3, 2], 4, 5, 6, [7, 9, 3], 10],
  );
  assert.equal(w.startItem, 41);
  assert.equal(w.endItem, 50);
  assert.equal(w.hasPrevious, true);
  assert.equal(w.hasNext, true);
});
test('empty total has zero state and no pages', () => {
  const w = paginationWindow({ totalItems: 0, pageSize: 5, currentPage: 1 });
  assert.equal(w.totalPages, 0);
  assert.equal(w.currentPage, 0);
  assert.equal(w.startItem, 0);
  assert.equal(w.endItem, 0);
  assert.deepEqual(w.items, []);
});
test('current clamps at final partial page', () => {
  const w = paginationWindow({ totalItems: 21, pageSize: 10, currentPage: 99 });
  assert.equal(w.currentPage, 3);
  assert.equal(w.startItem, 21);
  assert.equal(w.endItem, 21);
  assert.equal(w.hasNext, false);
  assert.deepEqual(
    w.items.map((x) => x.page),
    [1, 2, 3],
  );
});
test('single omitted page becomes explicit page', () => {
  const w = paginationWindow({ totalItems: 50, pageSize: 10, currentPage: 3, siblingCount: 0 });
  assert.deepEqual(
    w.items.map((x) => x.page),
    [1, 2, 3, 4, 5],
  );
  assert.equal(w.items[2].current, true);
});
test('zero boundaries include edge omissions without duplicates', () => {
  const w = paginationWindow({
    totalItems: 100,
    pageSize: 1,
    currentPage: 50,
    siblingCount: 0,
    boundaryCount: 0,
  });
  assert.deepEqual(w.items, [
    { type: 'ellipsis', from: 1, to: 49, count: 49 },
    { type: 'page', page: 50, current: true },
    { type: 'ellipsis', from: 51, to: 100, count: 50 },
  ]);
  assert.equal(Object.isFrozen(w.items), true);
});
test('unsafe and excessive counts rejected; huge totals stay bounded', () => {
  for (const totalItems of [-1, NaN, Infinity, 1.5])
    assert.throws(() => paginationWindow({ totalItems, pageSize: 1, currentPage: 1 }), RangeError);
  assert.throws(() => paginationWindow({ totalItems: 1, pageSize: 0, currentPage: 1 }), RangeError);
  assert.throws(
    () => paginationWindow({ totalItems: 1, pageSize: 1, currentPage: 1, siblingCount: 10001 }),
    RangeError,
  );
  const w = paginationWindow({
    totalItems: Number.MAX_SAFE_INTEGER,
    pageSize: 1,
    currentPage: Number.MAX_SAFE_INTEGER,
  });
  assert.equal(w.endItem, Number.MAX_SAFE_INTEGER);
  assert.ok(w.items.length < 10);
});
