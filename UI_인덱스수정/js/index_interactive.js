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

  //비디오변수
  const article = document.querySelector("#article_text");
  const aside_video = document.querySelector("#aside_video");
  const video = document.querySelector("#video");
  //메인-마우스 호버 동영상 재생
  article.addEventListener("mouseenter", () => {
    video.play();
  });
  article.addEventListener("mouseleave", () => {
    video.pause();
  });

  article_login.addEventListener("click", (e) => {
    aside_login.classList.add("on");
    aside_table.classList.remove("on");
    aside_text.classList.remove("on");
    aside_etc.classList.remove("on");
  });
  article_table.addEventListener("click", (e) => {
    aside_table.classList.add("on");
    aside_login.classList.remove("on");
    aside_text.classList.remove("on");
    aside_etc.classList.remove("on");
  });
  article_text.addEventListener("click", (e) => {
    aside_text.classList.add("on");
    aside_table.classList.remove("on");
    aside_login.classList.remove("on");
    aside_etc.classList.remove("on");

    aside_video.play();
  });
  article_etc.addEventListener("click", (e) => {
    aside_etc.classList.add("on");
    aside_table.classList.remove("on");
    aside_text.classList.remove("on");
    aside_login.classList.remove("on");
  });

  header_login.addEventListener("click", (e) => {
    aside_login.classList.add("on");
    aside_table.classList.remove("on");
    aside_text.classList.remove("on");
    aside_etc.classList.remove("on");
  });
  header_table.addEventListener("click", (e) => {
    aside_table.classList.add("on");
    aside_login.classList.remove("on");
    aside_text.classList.remove("on");
    aside_etc.classList.remove("on");
  });
  header_text.addEventListener("click", (e) => {
    aside_text.classList.add("on");
    aside_login.classList.remove("on");
    aside_table.classList.remove("on");
    aside_etc.classList.remove("on");

    aside_video.play();
  });
  header_etc.addEventListener("click", (e) => {
    aside_etc.classList.add("on");
    aside_login.classList.remove("on");
    aside_text.classList.remove("on");
    aside_table.classList.remove("on");
  });

  close_login.addEventListener("click", (e) => {
    aside_login.classList.remove("on");
  });

  close_table.addEventListener("click", (e) => {
    aside_table.classList.remove("on");
  });
  close_text.addEventListener("click", (e) => {
    aside_text.classList.remove("on");
  });
  close_etc.addEventListener("click", (e) => {
    aside_etc.classList.remove("on");
  });
});

const login2 = document.querySelector("#aside_login2");

login2.addEventListener("click", (e) => {
  aside_login.classList.remove("on");
});
