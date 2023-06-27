const text_input = document.querySelector("#text_input");
const text_textarea = document.querySelector("#text_textarea");
const text_name = document.querySelector("#text_name");
const sendBtn = document.querySelector("#send");
const table = document.querySelector("table");

let today = new Date();
let year = today.getFullYear();
let month = today.getMonth() + 1;
let date = today.getDate();

//문서가 열리면 table에 뿌리기
document.addEventListener("DOMContentLoaded", getLocal_table);

function getLocal_table() {
  let arrs;
  if (localStorage.getItem("arr") === null) {
    arrs = [];
  } else {
    arrs = JSON.parse(localStorage.getItem("arr"));
  }

  console.log(arrs);

  arrs.forEach((v, i) => {
    const tr = document.createElement("tr");
    const no = document.createElement("td");
    const title = document.createElement("td");
    const name = document.createElement("td");
    const count = document.createElement("td");
    const date = document.createElement("td");
    table.appendChild(tr).append(no, title, name, count, date);
    no.textContent = i + 1;
    title.textContent = arrs[i].제목;
    name.textContent = arrs[i].작성자;
    count.textContent = 0;
    date.textContent = arrs[i].작성일자;
  });

  //_.once(window.location.reloade());
}

//글쓰기,추가하기
//let arrs;
sendBtn.addEventListener("click", () => {
  let arrs;
  if (localStorage.getItem("arr") === null) {
    arrs = [];
  } else {
    arrs = JSON.parse(localStorage.getItem("arr"));
  }

  arrs.push({
    제목: text_input.value,
    내용: text_textarea.value,
    작성자: text_name.value,
    작성일자: year + "/" + month + "/" + date,
  });

  console.log(arrs);

  /*arrs.forEach((v, i) => {
    const tr = document.createElement("tr");
    const no = document.createElement("td");
    const title = document.createElement("td");
    const name = document.createElement("td");
    const count = document.createElement("td");
    const date = document.createElement("td");
    table.appendChild(tr).append(no, title, name, count, date);
    no.textContent = i + 1;
    title.textContent = arrs[i].제목;
    name.textContent = arrs[i].작성자;
    date.textContent = arrs[i].작성일자;
  });*/

  localStorage.setItem("arr", JSON.stringify(arrs));

  text_input.value = "";
  text_textarea.value = "";
  text_name.value = "";
});

/*// table에 뿌리기
let localData2 = JSON.parse(localStorage.getItem("arr"));
console.log(localData2);

for (let i = 0; i < localData2.length; i++) {
  let tr = document.createElement("tr");
  let no = document.createElement("td");
  let title = document.createElement("td");
  let name = document.createElement("td");
  let count = document.createElement("td");
  let date = document.createElement("td");
  table.appendChild(tr).append(no, title, name, count, date);
  no.textContent = i + 1;
  title.textContent = localData2[i].제목;
  name.textContent = localData2[i].작성자;
  count.textContent = 0;
  date.textContent = localData2[i].작성일자;
}*/
