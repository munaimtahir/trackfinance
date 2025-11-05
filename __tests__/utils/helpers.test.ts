/**
 * Tests for utility helpers
 * Simple unit tests for Stage 1 scaffolding verification
 */

import { formatDate, formatCurrency, truncateText } from '../../app/utils/helpers';

describe('Utility Helpers', () => {
  describe('formatDate', () => {
    it('should format a Date object correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toContain('Jan');
      expect(formatted).toContain('2024');
    });

    it('should format an ISO string correctly', () => {
      const formatted = formatDate('2024-01-15T00:00:00.000Z');
      expect(formatted).toContain('Jan');
      expect(formatted).toContain('2024');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency with default USD', () => {
      const formatted = formatCurrency(123.45);
      expect(formatted).toContain('$');
      expect(formatted).toContain('123');
    });

    it('should handle zero amount', () => {
      const formatted = formatCurrency(0);
      expect(formatted).toContain('$0');
    });

    it('should handle large numbers', () => {
      const formatted = formatCurrency(1000000);
      expect(formatted).toContain('1,000,000');
    });
  });

  describe('truncateText', () => {
    it('should not truncate text shorter than max length', () => {
      const text = 'Short text';
      expect(truncateText(text, 20)).toBe('Short text');
    });

    it('should truncate long text and add ellipsis', () => {
      const text = 'This is a very long text that needs truncation';
      const truncated = truncateText(text, 20);
      expect(truncated).toHaveLength(20);
      expect(truncated).toContain('...');
    });

    it('should handle exact length', () => {
      const text = 'Exact length';
      expect(truncateText(text, 12)).toBe('Exact length');
    });
  });
});
