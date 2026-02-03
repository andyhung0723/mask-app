const highlight = (el, binding) => {
  const { value: keyword } = binding;
  const originalText = el.textContent;

  if (!keyword || !keyword.trim()) {
    el.innerHTML = originalText;
    return;
  }

  const safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const regex = new RegExp(`(${safeKeyword})`, 'gi');

  const newHtml = originalText.replace(
    regex,
    `<mark style="background-color: yellow; color: black; padding: 0 2px;">$1</mark>`,
  );

  el.innerHTML = newHtml;
};

export default {
  updated(el, binding) {
    highlight(el, binding);
  },

  mounted(el, binding) {
    highlight(el, binding);
  },
};
