import DOMPurify from 'dompurify';

const COLOR = 'black';
const BACKGROUND_COLOR = 'yellow';

const highlight = (el, binding) => {
  const {
    text,
    color = COLOR,
    backgroundColor = BACKGROUND_COLOR,
  } = typeof binding.value === 'object' ? binding.value : { text: binding.value };

  const originalText = el.textContent;

  if (!text || !text.trim()) {
    el.innerHTML = originalText;
    return;
  }

  const safeKeyword = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const regex = new RegExp(`(${safeKeyword})`, 'gi');

  const newHtml = originalText.replace(
    regex,
    `<span style="background-color: ${backgroundColor}; color: ${color}">$1</span>`,
  );

  el.innerHTML = DOMPurify.sanitize(newHtml);
};

export default {
  updated: highlight,
  mounted: highlight,
};
