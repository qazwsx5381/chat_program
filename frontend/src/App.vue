<template>
  <div>
    <div class="example-modal-window" v-if="!state">
      <div class="main_login">
        <p class="main_title">버튼을 누르면 로그인 창이 열립니다.</p>
        <button @click="openModal" class="main_btn">로그인</button>
      </div>

      <!-- 컴포넌트 MyModal -->
      <MyModal @close="closeModal" v-if="modal">
        <!-- default 슬롯 콘텐츠 -->
        <div class="login_main">
          <h2>로그인</h2>
          <div class="login" v-if="!state">
            <input
              type="text"
              v-model="username"
              :disabled="state"
              required
              @keyup.enter="[login(), doSend()]"
            />
            <button @click="[doSend(), login()]" :disabled="!username">
              로그인
            </button>
          </div>
        </div>
        <!-- /default -->
        <!-- footer 슬롯 콘텐츠 -->
        <template slot="footer">
          <button @click="doSend">닫기</button>
        </template>
        <!-- /footer -->
      </MyModal>
    </div>
    <div class="connect_server">
      <span>연결상태</span>
      <span v-if="state" class="connect_state_true">{{ state }}</span>
      <span v-if="!state" class="connect_state_false">{{ state }}</span>
    </div>
    <article class="chat_login">
      <h2 v-show="state">
        <span class="name_under_line">{{ username }}</span> 님! 환영합니다.
      </h2>
    </article>

    <!-- 챗 룸 -->
    <div v-if="state">
      <section class="chat_room">
        <!-- 채팅 리스트 -->
        <div class="chat_room_msg_container">
          <ul class="chat_room_ul">
            <template v-for="v in messages" :key="v">
              <template
                v-if="
                  v.ghost === false &&
                  v.user_data === login_id &&
                  v.id === username
                "
              >
                <li class="msg_common chat_room_myorBot_msg">
                  <span class="chat_room_common_name my_name">{{ v.id }}</span>
                  <p class="chat_room_common_message my_message">
                    {{ v.message }}
                  </p>
                </li>
              </template>
              <template
                v-else-if="
                  v.ghost === true &&
                  v.user_data === login_id &&
                  v.id === username
                "
              >
                <li class="msg_common chat_room_myorBot_msg">
                  <span class="chat_room_common_name my_name">'익명'</span>
                  <p class="chat_room_common_message my_message">
                    {{ v.message }}
                  </p>
                </li>
              </template>
              <template v-else-if="v.ghost === true">
                <li class="msg_common">
                  <span class="chat_room_common_name chat_room_myorBot_msg">
                    익명
                  </span>
                  <p class="chat_room_common_message chat_room_other_msg">
                    {{ v.message }}
                  </p>
                </li>
              </template>
              <template v-else>
                <li class="msg_common">
                  <span class="chat_room_common_name chat_room_myorBot_msg">
                    {{ v.id }}
                  </span>
                  <p class="chat_room_common_message chat_room_other_msg">
                    {{ v.message }}
                  </p>
                </li>
              </template>
            </template>
            <div ref="targetRef"></div>
          </ul>
        </div>
        <!-- 메시지 전송 -->
        <div class="chat_room_form" v-if="state">
          <template v-if="user_id">
            <label
              for="ghost"
              style="
                color: white;
                margin-right: 10px;
                width: 45px;
                display: flex;
                align-items: center;
              "
              >익명</label
            >
            <input
              type="checkbox"
              @click="ghost()"
              id="ghost"
              style="margin-right: 15px"
            />
            <input
              class="chat_room_input"
              type="text"
              v-model="user_msg"
              :disabled="!state"
              @keyup.enter="[send_user_msg(), handleClick()]"
            />
            <button @click="[send_user_msg(), handleClick()]">전송</button>
            <button @click="leaveChat">나가기</button>
          </template>
          <template v-else>
            <label
              for="ghost"
              style="
                color: white;
                margin-right: 10px;
                width: 45px;
                display: flex;
                align-items: center;
              "
              >익명</label
            >
            <input
              type="checkbox"
              @click="ghost()"
              id="ghost"
              style="margin-right: 15px"
            />
            <input
              class="chat_room_input"
              type="text"
              v-model="message"
              :disabled="!state"
              @keyup.enter="[sendChat(), handleClick()]"
            />
            <button @click="[sendChat(), handleClick()]">전송</button>
            <button @click="leaveChat">나가기</button>
          </template>
        </div>
      </section>

      <!-- 개인메시지 -->
      <section class="chat_user_message">
        <h2>개인메세지 {{ user_id }}</h2>
        <ul>
          <template >
            <li v-for="(v,i) in msg" style="color: black" :key="i">{{ v.username }} : {{ v.message }}</li>
          </template>
        </ul>
        <button @click="user_id = ''">나가기</button>
      </section>

      <article class="menu_icon" @click="isOpen = !isOpen">
        {{ userList.length }}명<br />접속중
      </article>
      <section class="chat_user_list" v-show="isOpen">
        <h2>유저 리스트</h2>
        <hr />
        <ul class="chat_user_list_ul">
          <template v-for="v in userList" :key="v">
            <li
              class="list_item"
              @click="user_message(v.id)"
              v-if="v.username == username"
            >
              <b>{{ v.username }}({{ v.id }})</b>
            </li>
            <li class="list_item" @click="user_message(v.id)" v-else>
              {{ v.username }}({{ v.id }})
            </li>
          </template>
        </ul>
      </section>
      <span style="display: none" scrollIntoView></span>
      <article class="shift_btn_container">
        <span @click="top()">top</span>
        <span @click="bot()">bot</span>
      </article>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import MyModal from "./components/MyModal.vue";

export default {
  name: "App",
  components: { MyModal },
  data() {
    return {
      modal: false,
      modal_msg: "",
      message: "",
      user_msg: "",
      username: JSON.parse(sessionStorage.getItem("userID"))?.username || "",
      socket: null,
      messages: [],
      userList: [],
      ghost_user: false,
      guideMsg: "",
      user_id: "",
      isOpen: false,
      login_id: "",
      state: JSON.parse(sessionStorage.getItem("userID"))?.state || false,
    };
  },

  async created() {
    // 소켓 서버와 연결, 서버에서 지정해둔 io.on('connection') 이벤트 발생
    this.socket = io("http://localhost:8001/");
    this.socket.on("connection", () => {});

    // 서버에서 메시지를 전달 받음
    this.socket.on("messages", (messages) => {
      console.log("서버에서 받음:", messages);
      this.messages = messages;
      console.log(messages);
      this.handleClick();
    });
    this.socket.on("userList", (userList) => {
      console.log("서버에서 유저 정보를 받음:", userList);
      this.userList = userList;
      console.log(this.userList);
    });
    this.socket.on("user_messages", (msg) => {
      console.log("개인:", msg);
      this.msg = msg;
    });
    this.socket.on("connect", () => {
      this.login_id = this.socket.id;
    });
  },

  mounted() {
    try {
      const getUserInfo = JSON.parse(sessionStorage.getItem("userID")) || "";
      console.log("login(): 로그인 유저정보를 서버로 보냄");
      // 로그인 상태가 true 라면 welcome 방에 계속 상주한다.
      if (getUserInfo.state) {
        this.socket.emit("roomJoin", {
          room: "welcome",
          userID: getUserInfo,
        });
      }
      if (getUserInfo.state) {
        this.socket.emit("roomJoin", {
          room: "welcome",
          userID: getUserInfo,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  /* 메소드 */
  methods: {
    handleClick() {
      this.$refs.targetRef.scrollIntoView();
    },
    ghost() {
      this.ghost_user = !this.ghost_user;
      console.log(this.ghost_user);
    },
    sendChat() {
      console.log("sendChat() :서버로 데이터 보냄");
      console.log(this.ghost_user);
      console.log(this.ghost_user);
      this.socket.emit("sendMessage", {
        message: this.message,
        username: this.username,
        ghost: this.ghost_user,
        id: this.login_id,
      });
      console.log(this.message);
      this.message = "";
    },

    send_user_msg() {
      console.log("sendChat() :서버로 데이터 보냄");
      this.socket.emit("send_user", {
        message: this.user_msg,
        username: this.username,
      });
      console.log(this.message);
      this.user_msg = "";
    },

    /* 로그인 기능을 구현 */
    login() {
      // 로그인 상태를 true 로
      this.state = true;
      // 유저의 로그인 정보를 JSON 으로 변환
      const userInfo = JSON.stringify({
        state: this.state,
        username: this.username,
      });
      // 유저 정보를 sessionStorage 에 저장
      sessionStorage.setItem("userID", userInfo);

      // 세션에 저장된 유저 정보를 불러와서 getUserInfo 변수에 할당
      const getUserInfo = JSON.parse(sessionStorage.getItem("userID"));

      // 해당 유저 정보를 서버에 보내는 동시에 welcome 방에 입장
      console.log("login(): 로그인 유저정보를 서버로 보냄");
      this.socket.emit("roomJoin", { room: "welcome", userID: getUserInfo });
      this.socket.emit("loginInfo", this.username);
    },

    // 개인 메세지
    user_message(id) {
      // 해당 유저 정보를 서버에 보내는 동시에 welcome 방에 입장
      this.user_id = id;
      console.log(id);
      this.socket.emit("user_message", id);
    },

    /* 로그아웃 기능을 구현 */
    leaveChat() {
      this.state = false;
      this.socket.emit("leaveRoom", { room: "welcome" });
      sessionStorage.clear();
      this.guideMsg = this.username + "님이 방을 나가셨습니다.";
      console.log(this.guideMsg);
      this.username = "";
    },
    openModal() {
      this.modal = true;
    },
    closeModal() {
      this.modal = false;
    },
    doSend() {
      if (this.username === "") {
        alert("익명님 반가워요.!");
      } else {
        alert(this.username + "님 반가워요.!");
      }
      this.closeModal();
    },

    top() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    bot() {
      window.scrollTo({ top: 30000, behavior: "smooth" });
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR&family=Noto+Sans+KR:wght@300&family=Orbit&display=swap");

body {
  margin: 0;
  font-family: "Orbit", sans-serif;
}

/* 스크롤 바 */
body::-webkit-scrollbar {
  width: 5px;
  background-color: white;
}

body::-webkit-scrollbar-thumb {
  margin: 2px;
  border-radius: 10px;
  background-color: gray;
}

body::-webkit-scrollbar-button {
  width: 3px;
  margin: 2px;
}

/* 모달 전 로그인 버튼 화면 */
div.main_login {
  margin: 0;
  display: flex;
  align-items: center;
  filter: opacity(1.5);
  justify-content: center;
  position: fixed;
  flex-direction: column;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  min-width: 350px;
  animation: appear 1s 1;
  height: 100%;
  background-image: url(../../UI_인덱스수정/이미지/img1.jpg);
  background-size: cover;
}

@keyframes appear {
  from {
    opacity: 0;
    transform: scale(1.2);
  }
}
div.main_login p {
  text-shadow: 5px 5px 2px rgba(0, 0, 0, 0.759);
  color: white;
  font-size: 2rem;
  margin-bottom: 60px;
  animation: ani1 1s 1;
}

@keyframes ani1 {
  from {
    transform: scale(0.6) translateY(-100px);
  }
}
div.main_login button {
  font-size: 2rem;
  color: white;
  width: 300px;
  height: 100px;
  background-color: rgba(255, 255, 255, 0.301);
  border: 0;
  box-shadow: inset 0 0 0 0, 15px 15px 5px 2px rgba(0, 0, 0, 0.296);
  border-radius: 20px;
  transition: 0.5s;
  animation: ani2 1s 1;
}
div.main_login button:hover {
  color: black;
  background: rgba(255, 255, 255, 0.736);
  cursor: pointer;
}

@keyframes ani2 {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.5);
  }
}
/* 로그인 창 css */
.login_main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.login_main h2 {
  margin-top: -45px;
}
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.login input{
  margin-top: 0.5rem;
  background: black;
  border-radius:5px ;
  padding: 10px !important;
  color:white
}

.login button {
  border: none;
  background: black;
  padding: 10px;
  border-radius: 10px;
  color: white;
  transition: 0.7s;
  cursor: pointer;
}

.login button:disabled {
  color: white;
  background: white;
}
.login input {
  padding: 5px;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid black;
  text-align: center;
}
.login input:focus {
  outline-style: none;
}

.modal-footer button {
  border: none;
  background: black;
  padding: 10px;
  border-radius: 10px;
  color: white;
  transition: 0.7s;
}

.modal-footer button:hover {
  background: rgb(197, 10, 47);
  cursor: pointer;
}

/* 로그인한 유저의 이름 밑줄 */
.name_under_line {
  text-decoration: underline wavy rgb(251, 47, 135);
  color: rgb(0, 0, 0);
}
/* 로그인 상태 표시 */
.connect_server {
  background-color: rgb(255, 255, 255);
  display: flex;
  border-radius: 10px;
  box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.263);
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 48px;
  font-size: 13px;
  position: fixed;
  top: 25px;
  right: 14px;
  padding: 10px;
}

.connect_server .connect_state_true {
  color: blue;
  font-weight: 600;
}

.connect_server .connect_state_false {
  color: red;
  font-weight: 600;
}

.chat_login .login_main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.chat_login .login_main h2 {
  margin: 0;
}

.chat_login {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
li {
  list-style: none;
}

/* 채팅방 */
.chat_room {
  box-shadow: 0 0 5px 3px inset rgba(0, 0, 0, 0.637);
  border-radius: 10px;
  background-color: #313338;
  border: 1px solid black;
  min-height: 100vh;
  height: 100%;
  padding: 10px;
}

.chat_room_form {
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  position: sticky;
  min-width: 350px;
  max-width: 70%;
  padding: 10px 40px;
  border-radius: 5px;
  margin: 15px auto;
  width: 100%;
  bottom: 0;
}

.chat_room_msg_container {
  max-width: 800px;
  margin: 0 auto;
}

.chat_room_form .chat_room_input {
  padding: 15px;
  width: 100%;
  min-width: 200px;
  border-radius: 20px;
  background-color: #8a8b8f;
  color: rgb(0, 0, 0);
  border: none;
  margin-right: 15px;
}

.chat_room_form .chat_room_input::placeholder {
  color: rgb(178, 176, 176);
}

.chat_room_form button {
  border: none;
  min-width: 65px;
  margin: 2px;
  border-radius: 15px;
  transition: 0.5s;
}

.chat_room_form button:hover {
  background-color: gray;
  color: white;
  cursor: pointer;
  border: 1px solid white;
}

/* 메시지 리스트 공통 */

.chat_room_ul {
  display: flex;
  flex-direction: column;
  position: relative;
}

.msg_common {
  margin: 5px 0;
}

.chat_room_common_name {
  position: absolute;
  top: 5px;
  left: -5px;
  font-weight: 700;
  color: white;
}

.my_name {
  top: -5px;
  left: 5px;
}

.my_name::after {
  content: "(me)";
  color: gold;
}

.my_message {
  background-color: rgb(255, 227, 67) !important;
}

.chat_room_common_message {
  background-color: white;
  padding: 15px 5px;
  border-radius: 5px;
  box-shadow: 5px 5px 5px 1px rgba(0, 0, 0, 0.441);
}

/* 나의 메시지 */
.chat_room_myorBot_msg {
  padding: 5px;
  max-width: 60%;
  position: relative;
  right: -35%;
}

/* 상대방 메시지 */
.chat_room_other_msg {
  position: relative;
  max-width: 60%;
  color: black !important;
}

/* 개인 메시지 */
.chat_user_message {
  display: none;
}
.chat_room_ul div {
  display: flex;
  width: 100%;
  height: 60px;
}

/*============== 유저 목록 */
/* 메뉴 아이콘 */
.menu_icon {
  cursor: pointer;
  position: fixed;
  background-color: white;
  padding: 3px 3px;
  box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.496);
  border-radius: 10px;
  font-size: 14px;
  width: 60px;
  right: 15px;
  text-align: center;
  top: 11%;
}

.chat_user_list {
  box-shadow: 3px 3px 5px 2px rgba(0, 0, 0, 0.52);
  transition: 1s;
  background-color: white;
  border: 1px solid black;
  left: 50%;
  transform: translate(-50%);
  border-radius: 20px;
  position: fixed;
  max-width: 300px;
  width: 100%;
  top: 30%;
  /* display: none; */
}

.chat_user_list h2 {
  background: gray;
  text-align: center;
  margin: 0;
  padding: 13px;
  border-top-left-radius: 19px;
  border-top-right-radius: 19px;
}

hr{
  margin: 0;
}

.chat_user_list ul {
  padding: 10px !important;
}

.chat_user_list .list_item {
  background-color: white;
  border: none;
  margin: 5px 0;
}

/* 이동 버튼 컨테이너 */
.shift_btn_container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  position: fixed;
  border-radius: 20px;
  right: 20px;
  bottom: 30px;
}

.shift_btn_container span {
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.505);
  width: 100%;
  margin: 5px;
  border: 1px solid white;
  color: white;
  padding: 3px 0;
  border-radius: 20px;
  text-align: center;
  cursor: pointer;
}

.shift_btn_container span:hover {
  background-color: goldenrod;
}
</style>
