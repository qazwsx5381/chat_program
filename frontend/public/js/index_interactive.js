document.addEventListener("DOMContentLoaded", () => {
  const article_login = document.querySelector("#article_login");
  const article_table = document.querySelector("#article_table");
  const article_text = document.querySelector("#article_text");
  const article_etc = document.querySelector("#article_etc");

  const header_login = document.querySelector("#header_login");
  const header_table = document.querySelector("#header_table");
  const header_text = document.querySelector("#header_text");
  const header_etc = document.querySelector("#header_etc");

  const aside_login = document.querySelector("#aside_login");
  const aside_table = document.querySelector("#aside_table");
  const aside_text = document.querySelector("#aside_text");
  const aside_etc = document.querySelector("#aside_etc");

  const close_login = document.querySelector("#close_login");
  const close_table = document.querySelector("#close_table");
  const close_text = document.querySelector("#close_text");
  const close_etc = document.querySelector("#close_etc");

  article_login.addEventListener("click", (e) => {
    aside_login.classList.add("on");
  });
  article_table.addEventListener("click", (e) => {
    aside_table.classList.add("on");
  });
  article_text.addEventListener("click", (e) => {
    aside_text.classList.add("on");
  });
  article_etc.addEventListener("click", (e) => {
    aside_etc.classList.add("on");
  });

  header_login.addEventListener("click", (e) => {
    aside_login.classList.add("on");
  });
  header_table.addEventListener("click", (e) => {
    aside_table.classList.add("on");
  });
  header_text.addEventListener("click", (e) => {
    aside_text.classList.add("on");
  });
  header_etc.addEventListener("click", (e) => {
    aside_etc.classList.add("on");
  });

  close_login.addEventListener("click", (e) => {
    aside_login.classList.remove("on");
  });

  close_table.addEventListener("click", (e) => {
    aside_table.classList.remove("on");
  });
  close_text.addEventListener("click", (e) => {
    aside_text.classList.remove("on");
    //window.location.reloade();
    location.href = "./index.html";
  });
  close_etc.addEventListener("click", (e) => {
    aside_etc.classList.remove("on");
  });
});
