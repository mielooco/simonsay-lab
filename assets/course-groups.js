(() => {
  const links = [...document.querySelectorAll('[data-course]')];
  const groups = [...document.querySelectorAll('[data-course-section], .course-section')];
  function showGroup() {
    const requested = location.hash.slice(1);
    const group = ['form-labs', 'rhino-basics', 'grasshopper-basics'].includes(requested) ? requested : 'form-labs';
    for (const section of groups) section.hidden = section.id !== group;
    for (const link of links) {
      if (link.dataset.course === group) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  }
  // Hash links remain useful without JavaScript, and browser Back restores the group.
  window.addEventListener('hashchange', showGroup);
  showGroup();
})();
