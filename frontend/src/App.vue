<template>
  <div>
    <article class="connect_server">
      <span>연결상태 <br> {{ state }}</span>
    </article>
    <!-- 로그인 -->
    <section class="chat_login">
      <h2>로그인</h2>
      <div v-if="!state">
        <input type="text" v-model="username" :disabled="state" />
        <button @click="login" :disabled="state">로그인</button>
      </div>
    </section>

    <!-- 채팅방 -->
    <section class="chat_room">
      <div class="chat_room_msg_container">
        <ul class="chat_room_ul">
          <template v-for="v in messages" :key="v">
            <!-- 본인 -->
            <template v-if="v.id === username">
              <li class="chat_room_myorBot_msg msg_common">
                <span class="chat_room_common_name my_name">{{ v.id }} {{ currnetTime }}</span>
                <p class="chat_room_common_message my_message">{{ v.message }}</p>
              </li>
            </template>
            <!-- 익명 유저 -->
            <template v-else-if="v.id === '익명' && username === ''">
              <li class="chat_room_myorBot_msg msg_common" style="color: red"> <span class="chat_room_common_name">{{ v.id
              }}<span v-if="v.id === 'chat_bot'">🤖</span></span>
                <p class="chat_room_common_message">{{ v.message }}</p>
              </li>
            </template>
            <!-- 기명 유저 -->
            <template v-else>
              <li class="chat_room_other_msg msg_common" style="color: black"> <span class="chat_room_common_name">{{ v.id
              }}</span>
                <p class="chat_room_common_message">{{ v.message }}</p>
              </li>
            </template>
          </template>
        </ul>
      </div>
      <div v-if="state">
        <template v-if="user_id">
          <div class="chat_room_form">
            <input class="chat_room_input" type="text" v-model="user_msg" :disabled="!state" />
            <button @click="send_user_msg">전송</button>
            <button @click="leaveChat">나가기</button>
          </div>
        </template>
        <template v-else>
          <div class="chat_room_form">
            <input class="chat_room_input" type="text" v-model="message" :disabled="!state" />
            <button @click="sendChat">전송</button>
            <button @click="leaveChat">나가기</button>
          </div>
        </template>
        <div>테스트: {{ message }}</div>
      </div>
    </section>

    <!-- 개인 메시지 -->
    <section class="chat_user_message">
      <h2>개인메세지 {{ user_id }}</h2>
      <ul>
        <template v-for="v in msg" :key="v">
          <li style="color: black">{{ v.username }} : {{ v.message }}</li>
        </template>
      </ul>
      <button @click="user_id = ''">나가기</button>
    </section>


    <article class="menu_icon" @click="isOpen = !isOpen">{{ userList.length }}명 <br>접속중</article>
    <section class="chat_user_list" v-show="isOpen">
      <h2 class="user_list_title">유저 리스트</h2>
      <hr>
      <ul>
        <template v-for="v in userList" :key="v">
          <!-- 본인 -->
          <li class="list_item" @click="user_message(v.id)" v-if="v.username == username">
            <b>{{ v.username }}({{ v.id }})</b>
          </li>
          <!-- 다른 유저 -->
          <li class="list_item" @click="user_message(v.id)" v-else>
            {{ v.username }}({{ v.id }})
          </li>
        </template>
      </ul>
    </section>

  </div>
</template>

<script>
import { io } from "socket.io-client";

export default {
  name: "App",
  data() {
    return {
      message: "",
      user_msg: "",
      username: JSON.parse(sessionStorage.getItem("userID"))?.username || "",
      socket: null,
      messages: [],
      userList: [],
      msg: [],
      guideMsg: "",
      user_id: "",
      isOpen: false,
      state: JSON.parse(sessionStorage.getItem("userID"))?.state || false,
    };
  },

  async created() {
    // 소켓 서버와 연결, 서버에서 지정해둔 io.on('connection') 이벤트 발생
    this.socket = io("http://localhost:8001/");
    this.socket.on("connection", () => { });

    // 서버에서 메시지를 전달 받음
    this.socket.on("messages", (messages) => {
      console.log("서버에서 받음:", messages);
      this.messages = messages;
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
  },

  mounted() {
    try {
      const getUserInfo = JSON.parse(sessionStorage.getItem("userID")) || "";
      console.log("login(): 로그인 유저정보를 서버로 보냄");

      // 로그인 상태가 true 라면 welcome 방에 계속 상주한다.
      if (getUserInfo.state)
        this.socket.emit("roomJoin", { room: "welcome", userID: getUserInfo });
    } catch (error) {
      console.log(error);
    }
  },

  /* 메소드 */
  methods: {
    sendChat() {
      console.log("sendChat() :서버로 데이터 보냄");
      this.socket.emit("sendMessage", {
        message: this.message,
        username: this.username,
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
      setTimeout(() => {
        this.guideMsg = this.username + "님이 방을 나가셨습니다.";
        console.log(this.guideMsg);
        this.username = "";
      }, 1000);
    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR&family=Noto+Sans+KR:wght@300&family=Orbit&display=swap');


body {
  font-family: 'Orbit', sans-serif;
}

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

/* 로그인 상태 표시 */
.connect_server {
  background-color: rgb(255, 255, 255);
  display: flex;
  border-radius: 10px;
  box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.263);
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 60px;
  font-size: 14px;
  position: fixed;
  padding: 3px 3px;
  top: 3%;
  right: 15px;
}

.connect_server span {
  text-align: center;
}

li {
  list-style: none;
}


/* 로그인 */
.chat_login {}


/* 채팅방 */
.chat_room {
  border-radius: 10px;
  background-color: #313338;
  border: 1px solid black;
  min-height: 100vh;
  height: 100%;
}

.chat_room_form {
  display: flex;
  position: relative;
  left: 50%;
  transform: translate(-50%);
  max-width: 70%;
  margin-top: 15px;
  width: 100%;
  bottom: 0;
}

.chat_room_msg_container {
  max-width: 800px;
  margin: 0 auto;
}

.chat_room_form .chat_room_input {
  padding: 10px;
  width: 100%;
  min-width: 200px;
  border-radius: 20px;
  background-color: #5a5b63;
  color: white;
  border: none;
  margin-right: 10px;
}

.chat_room_form button {
  border: none;
  min-width: 70px;
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
  top: -8px;
  left: 5px;
  font-weight: 700;
  color: white;
}

.my_name::after {
  content: '(me)';
  color: gold
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

/* 유저 목록 */

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
  top: 10%;

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
  text-align: center;
}

.chat_user_list ul {
  padding: 10px !important;
}

.chat_user_list .list_item {
  background-color: white;
  margin: 5px 0;

}
</style>
