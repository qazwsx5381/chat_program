const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const app = express();
const server = http.createServer(app);
const path = require("path");

// let PORT =8080
// app.listen(PORT, () => {
//   console.log("server on",PORT);
// });

app.use("/", express.static(path.join(__dirname, "../frontend/dist")));
// 이 부분이 없으면 아래코드에서 index.html을 로드하지 못한다.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:8001","http://192.168.0.91:8001"],
  },
});

let messages = [];
let usernameList = [];
const chatBotHello = ["안녕", "ㅎㅇ", "반가워", "hello", "반갑습니다", "hi"];
const chatBotDate = ["현재 시간", "며칠", "시각", "date", "clock"];
const chatBotWeather = ["날씨"];
const chatBotLaugh = ["zzz", "ㅋㅋ", "ㅋㅋㅋㅋㅋㅋㅋ", "ㅎㅎㅎㅎ", "ㅎ"];
const chatBotNo = ["아니", "거절", "귓속말", "부족함"];
const chatBotYes = ["잘했네", "좋네", "?"];
let count = 0;

let roomName = "";

io.on("connection", (socket) => {
  socket.on("loginInfo", (username) => {
    if (username) {
      usernameList.push({ username, id: socket.id });
    } else {
      usernameList.push({ username: "익명", id: socket.id });
    }
    console.log("유저이름:", usernameList);
    io.to(roomName).emit("userList", usernameList);
    messages.push({
      message: `${username ? username : "익명"}님 반갑습니다.`,
      id: "SYSTEM",
    });
    io.to(roomName).emit("messages", messages);
    setTimeout(() => {
      messages.push({
        message: `${
          username ? username : "익명"
        }님이 접속 후 30초이 경과하였습니다.`,
        id: "SYSTEM",
      });
      io.to(roomName).emit("messages", messages);
    }, 30 * 1000);
    setTimeout(() => {
      messages.push({
        message: `${
          username ? username : "익명"
        }님이 접속 후 1분이 경과하였습니다.`,
        id: "SYSTEM",
      });
      io.to(roomName).emit("messages", messages);
    }, 60 * 1000);
  });

  // 방 가입
  socket.on("roomJoin", (data) => {
    roomName = data.room;
    socket.join(data.room);
    console.log("들어간 후 방목록:", socket.rooms);
  });

  // 방 나가기
  socket.on("leaveRoom", (data) => {
    data = data.room;
    socket.leave(data.room);
    console.log("나간 후 방목록:", socket.rooms);
    usernameList.forEach((v, i) => {
      if (v.id === socket.id) {
        usernameList.splice(i, 1);
        io.to(roomName).emit("userList", usernameList);
      }
    });
  });
  // 방 나갈 때 유저 리스트 제거
  socket.on("leaveList", (data) => {
    data = data.room;
    socket.leave(data.room);
    console.log("나간 후 방목록:", socket.rooms);
  });
  // 클라이언트로 부터 메시지 수신 받음
  socket.on("sendMessage", (data) => {
    console.log("유저한테 받음:", data);

    console.log("방이름", roomName);
    usernameList.forEach((v) => {
      if (v.id === socket.id) {
        messages.push({
          message: data.message,
          id: data.username,
          ghost: data.ghost,
          user_data: data.id,
        });
      }
    });

    // 특정 조건 만족시 트리거 발동
    let regexp = "";
    if (data.message === "?" || data.message === "$") {
      io.to(roomName).emit("messages", messages);
      return;
    } else {
      regexp = new RegExp(data.message, "gi");
    }

    try {
      for (let i = 0; i < chatBotHello.length; i++) {
        /* 봇이 현재 시간 알려줌*/

        console.log("현재 시간:", data.message);
        if (regexp.test(chatBotDate[i])) {
          io.to(roomName).emit(
            "messages",
            messages.push({
              message: `현재 시간은 ${new Date().toLocaleString()} 입니다.`,
              id: "🤖(bot)",
            })
          );
        }

        /* 봇이 현재 날씨 확인 가능한 사이트 알려줌 */
        if (regexp.test(chatBotWeather[i])) {
          io.to(roomName).emit(
            "messages",
            messages.push({
              message: `날씨가 궁금하군요? https://www.google.com/search?q=%EC%98%A4%EB%8A%98+%EB%82%A0%EC%94%A8 여기 방문해보세요`,
              id: "🤖(bot)",
            })
          );
        }

        /* 봇이 유저가 웃으면 그에 대한 반응을 보여줌 */
        if (regexp.test(chatBotLaugh[i])) {
          io.to(roomName).emit(
            "messages",
            messages.push({
              message: `뭐가 그리 재밌어요?! 재밌는 이야기 해드릴까요?`,
              id: "🤖(bot)",
            })
          );

          /* 유저가 그래 혹은 어 라고 말하면 부정적으로 답변해줌 */
        } else if (data.message === "그래" || data.message === "어") {
          io.to(roomName).emit(
            "messages",
            messages.push({
              message: `시른데`,
              id: "🤖(bot)",
            })
          );
          break;
        }

        /* 유저가 부정적으로 말하면 봇이 실망한 듯이 말해줌 */
        if (regexp.test(chatBotNo[i])) {
          io.to(roomName).emit(
            "messages",
            messages.push({
              message: `아.. 그렇군요.`,
              id: "🤖(bot)",
            })
          );
        }

        /* 유저가 긍정적으로 말하면 긍정적으로 답변 해줌 */
        if (regexp.test(chatBotYes[i])) {
          io.to(roomName).emit(
            "messages",
            messages.push({
              message: `고마워요! 보는 눈이 있으시네요.`,
              id: "🤖(bot)",
            })
          );
        }

        /* 유조가 인사하면 인사해줌 */
        if (regexp.test(chatBotHello[i])) {
          if (count < 4) {
            io.to(roomName).emit(
              "messages",
              messages.push({
                message: `안녕하세요.${data.username}님 반가워요(😁). 좋은 날 입니다.`,
                id: "🤖(bot)",
              })
            );
            ++count;
          }
          /* 인사를 3번 받으면 갑자기 급변하여 대충 인사 해줌 */
          if (count === 3) {
            io.to(roomName).emit(
              "messages",
              messages.push({
                message: `${count}번 이나 말했는데..끝이 없네.. 대충하자`,
                id: "🤖(bot)",
              })
            );
          } else if (count === 4) {
            io.to(roomName).emit(
              "messages",
              messages.push({
                message: `${data.username}, ㅎㅇ🥱`,
                id: "🤖(bot)",
              })
            );
          }
        }
      }
    } catch (error) {
      console.log(error);
    }

    // 수신 받은 메시지의 목록을 클라이언트에게 돌려줌
    io.to(roomName).emit("messages", messages);
    // ===============================

    //개인 메세지 방 가입
    let user_id = "";
    socket.on("user_message", (data) => {
      user_id = data;
      console.log(data);
      // socket.join("room");
      // io.to("room").emit("user_messages", {
      //   username: "환영봇",
      //   message: "환영합니다",
      // });
      // // socket.join("room").emit("user_messages", "환영합니다");
      // console.log("개인방1:", socket.rooms);
    });

    socket.on("send_user", (data) => {
      console.log(data);
      // user_msg.push(data);
      // io.to("room").emit("user_messages", user_msg);
      // console.log("개인방2:", socket.rooms);
    });
  });

  socket.on("disconnect", () => {
    socket.emit("leave", "55");
    console.log(`${socket.id}님이 방을 나가셨습니다.`);
    usernameList.forEach((v, i) => {
      if (socket.id === v.id) {
        usernameList.splice(i, 1);
        io.to(roomName).emit("userList", usernameList);
      }
    });
  });
});

let port = 8001;
server.listen(port, () => {
  console.log("----서버 정상 오픈----",port);
});
