(() => {
 'use strict';
 const course=document.getElementById('l14-course');
 const sections={intro:course.querySelector('[data-course-intro]'),lab:course.querySelector('[data-course-lab]'),conclusion:course.querySelector('[data-course-conclusion]')};
 function show(mode){
  for(const [name,section] of Object.entries(sections))section.hidden=name!==mode;
  window.dispatchEvent(new Event(mode==='lab'?'simon:l14-lab-visible':'simon:l14-intro-visible'));
  course.scrollIntoView({block:'start',behavior:'instant'});
 }
 for(const button of course.querySelectorAll('[data-course-action]'))button.addEventListener('click',()=>{
  const action=button.dataset.courseAction;
  show(action==='enter'?'lab':action==='finish'?'conclusion':'intro');
 });
})();
