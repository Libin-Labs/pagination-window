import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paginationWindow } from '../dist/esm/index.js';

test('small exhaustive windows cover every page exactly once with correct omissions', () => {
  for (let total = 0; total <= 20; total++) {
    for (let current = 1; current <= total + 2; current++) {
      for (let siblings = 0; siblings <= 2; siblings++) {
        for (let boundary = 0; boundary <= 2; boundary++) {
          const window = paginationWindow({
            totalItems: total,
            pageSize: 1,
            currentPage: current,
            siblingCount: siblings,
            boundaryCount: boundary,
          });
          const covered = [];
          for (const item of window.items) {
            if (item.type === 'page') covered.push(item.page);
            else {
              assert.equal(item.count, item.to - item.from + 1);
              assert.ok(item.count >= 2);
              for (let page = item.from; page <= item.to; page++) covered.push(page);
            }
          }
          assert.deepEqual(
            covered,
            Array.from({ length: total }, (_, i) => i + 1),
          );
          assert.equal(
            window.items.filter((item) => item.type === 'page' && item.current).length,
            total === 0 ? 0 : 1,
          );
        }
      }
    }
  }
});
