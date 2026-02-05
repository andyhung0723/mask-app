import DOMPurify from 'dompurify';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import highlightDirective from './highlight';

describe('highlight directive', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    el.textContent = '健康藥局位於台北市大安區';
    vi.clearAllMocks();
  });

  describe('text highlighting', () => {
    it('should highlight matching text with default colors', () => {
      const binding = { value: '健康' };
      highlightDirective.mounted(el, binding);

      expect(el.innerHTML).toContain(
        '<span style="background-color: yellow; color: black">健康</span>',
      );
      expect(el.innerHTML).toContain('藥局位於台北市大安區');
    });

    it('should highlight with custom colors', () => {
      const binding = {
        value: { text: '藥局', color: 'white', backgroundColor: 'blue' },
      };
      highlightDirective.mounted(el, binding);

      expect(el.innerHTML).toContain(
        '<span style="background-color: blue; color: white">藥局</span>',
      );
    });

    it('should highlight case-insensitively', () => {
      el.textContent = 'Pharmacy and PHARMACY';
      const binding = { value: 'pharmacy' };
      highlightDirective.mounted(el, binding);

      expect(el.innerHTML).toContain(
        '<span style="background-color: yellow; color: black">Pharmacy</span>',
      );
      expect(el.innerHTML).toContain(
        '<span style="background-color: yellow; color: black">PHARMACY</span>',
      );
    });

    it('should highlight all occurrences', () => {
      el.textContent = '健康藥局和健康診所';
      const binding = { value: '健康' };
      highlightDirective.mounted(el, binding);

      const matches = el.innerHTML.match(/健康/g);
      expect(matches).toHaveLength(2);
    });
  });

  describe('edge cases', () => {
    it('should not highlight when text is empty', () => {
      const binding = { value: '' };
      highlightDirective.mounted(el, binding);

      expect(el.innerHTML).toBe('健康藥局位於台北市大安區');
    });

    it('should not highlight when text is whitespace only', () => {
      const binding = { value: '   ' };
      highlightDirective.mounted(el, binding);

      expect(el.innerHTML).toBe('健康藥局位於台北市大安區');
    });

    it('should handle text not found in content', () => {
      const binding = { value: '不存在' };
      highlightDirective.mounted(el, binding);

      expect(el.innerHTML).not.toContain('<span');
    });
  });

  describe('regex special characters escaping', () => {
    it('should escape dot character', () => {
      el.textContent = 'example.com';
      const binding = { value: '.' };
      highlightDirective.mounted(el, binding);

      expect(el.innerHTML).toContain('<span');
    });

    it('should escape asterisk character', () => {
      el.textContent = 'test*value';
      const binding = { value: '*' };
      highlightDirective.mounted(el, binding);

      expect(el.innerHTML).toContain('<span');
    });

    it('should escape parentheses', () => {
      el.textContent = 'test(value)';
      const binding = { value: '(value)' };
      highlightDirective.mounted(el, binding);

      expect(el.innerHTML).toContain('<span');
    });

    it('should escape square brackets', () => {
      el.textContent = 'test[value]';
      const binding = { value: '[value]' };
      highlightDirective.mounted(el, binding);

      expect(el.innerHTML).toContain('<span');
    });
  });

  describe('XSS protection', () => {
    it('should call DOMPurify.sanitize', () => {
      const sanitizeSpy = vi.spyOn(DOMPurify, 'sanitize');
      const binding = { value: '健康' };

      highlightDirective.mounted(el, binding);

      expect(sanitizeSpy).toHaveBeenCalled();
      sanitizeSpy.mockRestore();
    });

    it('should sanitize malicious HTML in keyword', () => {
      el.textContent = 'test content';
      const binding = { value: '<script>alert("xss")</script>' };

      highlightDirective.mounted(el, binding);

      expect(el.innerHTML).not.toContain('<script>');
    });
  });

  describe('directive hooks', () => {
    it('should work in mounted hook', () => {
      const binding = { value: '健康' };
      highlightDirective.mounted(el, binding);

      expect(el.innerHTML).toContain('<span');
    });

    it('should work in updated hook', () => {
      const binding = { value: '健康' };
      highlightDirective.updated(el, binding);

      expect(el.innerHTML).toContain('<span');
    });
  });
});
