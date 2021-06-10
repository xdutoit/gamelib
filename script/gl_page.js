window.onload = function () {
  // générer menu
  let nav_html = '';
  document.querySelectorAll('section>h1').forEach((e, i) => {
    let e_id = e.id;
    if (!e_id) {
      e_id = 'a_' + i;
      e.id = e_id;
    }
    nav_html += '<a href="#' + e_id + '">' + e.textContent + '</a>';
  });
  document.querySelector('#nav_auto').innerHTML = nav_html;

  hljs.highlightAll();

};
