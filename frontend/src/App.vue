<template>
  <div>
    <div class="example-modal-window" v-if="!state">
      <p>버튼을 누르면 로그인 창이 열립니다.</p>
      <button @click="openModal">로그인</button>

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
              @keyup.enter="[login(), doSend(), handleClick()]"
            />
            <button
              @click="[doSend(), login(), handleClick()]"
              :disabled="!username"
            >
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
      <hr />
    </div>
    <div class="connect_server">
      <span>연결상태</span>
      <span>{{ state }}</span>
    </div>
    <!-- <div class="login_main">
      <h2>로그인</h2>
      <div class="login" v-if="!state">
        <input
          type="text"
          v-model="username"
          :disabled="state"
          placeholder="입력이 없으면 익명으로 로그인 됩니다."
        />
        <button @click="login" :disabled="state">로그인</button>
      </div>
    </div> -->
    <div v-if="state">
      <h2>메시지 전송</h2>
      <div v-if="state">
        <!-- 개인메세지 -->
        <template v-if="user_id">
          <label for="ghost">익명</label>
          <input type="checkbox" @click="ghost()" id="ghost" />
          <input
            type="text"
            v-model="user_msg"
            @keyup.enter="[send_user_msg, handleClick()]"
          />
          <button @click="[send_user_msg, handleClick()]">전송</button>
          <button @click="leaveChat">나가기</button>
        </template>
        <!-- 전체메세지 -->
        <template v-else>
          <label for="ghost">익명</label>
          <input type="checkbox" @click="ghost()" id="ghost" />
          <input
            type="text"
            v-model="message"
            @keyup.enter="[sendChat, handleClick()]"
          />
          <button @click="[sendChat, handleClick()]">전송</button>
          <button @click="leaveChat">나가기</button>
        </template>

        <div>테스트: {{ message }}</div>
      </div>
      <br /><br />
      <hr />
      <h2>대화</h2>
      <ul>
        <template v-for="v in messages" :key="v">
          <template
            v-if="
              v.ghost === false && v.user_data === login_id && v.id === username
            "
          >
            <li style="color: red">{{ v.id }} : {{ v.message }}</li>
          </template>
          <template
            v-else-if="
              v.ghost === true && v.user_data === login_id && v.id === username
            "
          >
            <li style="color: rgb(0, 163, 82)">익명 : {{ v.message }}</li>
          </template>
          <template v-else-if="v.ghost === true">
            <li style="color: blue">익명 : {{ v.message }}</li>
          </template>
          <template v-else>
            <li style="color: black">{{ v.id }} : {{ v.message }}</li>
          </template>
        </template>
      </ul>
      <hr />
      <h2>개인메세지 {{ user_id }}</h2>
      <ul>
        <template v-for="v in msg" :key="v">
          <li style="color: black">{{ v.username }} : {{ v.message }}</li>
        </template>
      </ul>
      <button @click="user_id = ''">나가기</button>
      <hr />
      <h2>유저 리스트</h2>
      <ul>
        <template v-for="v in userList" :key="v">
          <li @click="user_message(v.id)" v-if="v.id == login_id">
            <b>{{ v.username }} : {{ v.id }}</b>
          </li>
          <li @click="user_message(v.id)" v-else>
            {{ v.username }} : {{ v.id }}
          </li>
        </template>
      </ul>
    </div>
    <span ref="targetRef"></span>
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
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    handleClick() {
      this.$refs.targetRef.scrollIntoView({ behavior: "smooth" });
    },
    ghost() {
      this.ghost_user = !this.ghost_user;
      console.log(this.ghost_user);
    },
    sendChat() {
      console.log("sendChat() :서버로 데이터 보냄");
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
  },
};
</script>

<style>
div.connect_server {
  background-color: yellow;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100px;
  position: fixed;
  top: 10px;
  right: 10px;
  padding: 10px;
}
div.login_main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
div.login_main h2 {
  margin: 0;
}
div.login {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
li {
  list-style: none;
}
</style>
