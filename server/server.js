// .env 로딩 위해 
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
//
const express = require("express");
const app = express();
const port = 3001; // react의 기본값은 3000이니까 3000이 아닌 아무 수
const cors = require("cors");
const bodyParser = require("body-parser");
const route = require("./routes/index");
const mysql = require("mysql");
// const env = require("dotenv");
let moment = require("moment");
// env.config();

//db연동 위해
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASS, //.env 파일 만들어서 DB_PASS = 디비비밀번호 추가
  database: "nodejs",
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/", route);

app.get("/", (req, res) => {
  res.send("코딩 중!");
});

// data가 0. 맑음
app.post("/database0", (req, res) => {
  console.log("/database0 접속완료");
  console.log("DBPASS : ", process.env);
  let month = moment().month() + 1;
  console.log("현재 월 : ", month);
  if (3 <= month && month <= 5) {
    // 맑고 봄
    connection.query(
      'SELECT * FROM (SELECT IFNULL(rain.menu, seasons.menu) AS menu, -rain.percent + IFNULL(seasons.percent, 0) as sum_percent FROM rain LEFT JOIN (SELECT menu, percent FROM seasons WHERE season="봄") seasons ON rain.menu = seasons.menu UNION SELECT IFNULL(rain.menu, seasons.menu) AS menu, IFNULL(-rain.percent, 0)+seasons.percent FROM rain RIGHT JOIN (SELECT menu, percent FROM seasons WHERE season="봄") seasons ON rain.menu = seasons.menu ORDER BY sum_percent DESC LIMIT 12) subtable ORDER BY rand() limit 5;',
      (error, results, field) => {
        if (error) throw error;
        res.send(results);
        console.log("맑고 봄이네요 : ", results);
      }
    );
  } else if (6 <= month && month <= 8) {
    connection.query(
      'SELECT * FROM (SELECT IFNULL(rain.menu, seasons.menu) AS menu, -rain.percent + IFNULL(seasons.percent, 0) as sum_percent FROM rain LEFT JOIN (SELECT menu, percent FROM seasons WHERE season="여름") seasons ON rain.menu = seasons.menu UNION SELECT IFNULL(rain.menu, seasons.menu) AS menu, IFNULL(-rain.percent, 0)+seasons.percent FROM rain RIGHT JOIN (SELECT menu, percent FROM seasons WHERE season="여름") seasons ON rain.menu = seasons.menu ORDER BY sum_percent DESC LIMIT 12) subtable ORDER BY rand() limit 5;',
      (error, results, field) => {
        if (error) throw error;
        res.send(results);
        console.log("맑고 여름이네요 : ", results);
      }
    );
  } else if (9 <= month && month <= 11) {
    connection.query(
      'SELECT * FROM (SELECT IFNULL(rain.menu, seasons.menu) AS menu, -rain.percent + IFNULL(seasons.percent, 0) as sum_percent FROM rain LEFT JOIN (SELECT menu, percent FROM seasons WHERE season="가을") seasons ON rain.menu = seasons.menu UNION SELECT IFNULL(rain.menu, seasons.menu) AS menu, IFNULL(-rain.percent, 0)+seasons.percent FROM rain RIGHT JOIN (SELECT menu, percent FROM seasons WHERE season="가을") seasons ON rain.menu = seasons.menu ORDER BY sum_percent DESC LIMIT 12) subtable ORDER BY rand() limit 5;',
      (error, results, field) => {
        if (error) throw error;
        res.send(results);
        console.log("맑고 가을이네요 : ", results);
      }
    );
  } else {
    connection.query(
      'SELECT * FROM (SELECT IFNULL(rain.menu, seasons.menu) AS menu, -rain.percent + IFNULL(seasons.percent, 0) as sum_percent FROM rain LEFT JOIN (SELECT menu, percent FROM seasons WHERE season="겨울") seasons ON rain.menu = seasons.menu UNION SELECT IFNULL(rain.menu, seasons.menu) AS menu, IFNULL(-rain.percent, 0)+seasons.percent FROM rain RIGHT JOIN (SELECT menu, percent FROM seasons WHERE season="겨울") seasons ON rain.menu = seasons.menu ORDER BY sum_percent DESC LIMIT 12) subtable ORDER BY rand() limit 5;',
      (error, results, field) => {
        if (error) throw error;
        res.send(results);
        console.log("맑고 겨울이네요 : ", results);
      }
    );
  }
});

// data가 0이 아님. 비/눈
app.post("/database1", (req, res) => {
  console.log("/database1 접속완료");
  let month = moment().month() + 1;
  console.log("현재 월 : ", month);
  if (3 <= month && month <= 5) {
    // 비오고 봄
    connection.query(
      'SELECT * FROM (SELECT IFNULL(rain.menu, seasons.menu) AS menu, rain.percent + IFNULL(seasons.percent, 0) as sum_percent FROM rain LEFT JOIN (SELECT menu, percent FROM seasons WHERE season="봄") seasons ON rain.menu = seasons.menu UNION SELECT IFNULL(rain.menu, seasons.menu) AS menu, IFNULL(rain.percent, 0)+seasons.percent FROM rain RIGHT JOIN (SELECT menu, percent FROM seasons WHERE season="봄") seasons ON rain.menu = seasons.menu ORDER BY sum_percent DESC LIMIT 12) subtable ORDER BY rand() limit 5;',
      (error, results, field) => {
        if (error) throw error;
        res.send(results);
        console.log("비/눈오고 봄이네요 : ", results);
      }
    );
  } else if (6 <= month && month <= 8) {
    connection.query(
      'SELECT * FROM (SELECT IFNULL(rain.menu, seasons.menu) AS menu, rain.percent + IFNULL(seasons.percent, 0) as sum_percent FROM rain LEFT JOIN (SELECT menu, percent FROM seasons WHERE season="여름") seasons ON rain.menu = seasons.menu UNION SELECT IFNULL(rain.menu, seasons.menu) AS menu, IFNULL(rain.percent, 0)+seasons.percent FROM rain RIGHT JOIN (SELECT menu, percent FROM seasons WHERE season="여름") seasons ON rain.menu = seasons.menu ORDER BY sum_percent DESC LIMIT 12) subtable ORDER BY rand() limit 5;',
      (error, results, field) => {
        if (error) throw error;
        res.send(results);
        console.log("비/눈오고 여름이네요 : ", results);
      }
    );
  } else if (9 <= month && month <= 11) {
    connection.query(
      'SELECT * FROM (SELECT IFNULL(rain.menu, seasons.menu) AS menu, rain.percent + IFNULL(seasons.percent, 0) as sum_percent FROM rain LEFT JOIN (SELECT menu, percent FROM seasons WHERE season="가을") seasons ON rain.menu = seasons.menu UNION SELECT IFNULL(rain.menu, seasons.menu) AS menu, IFNULL(rain.percent, 0)+seasons.percent FROM rain RIGHT JOIN (SELECT menu, percent FROM seasons WHERE season="가을") seasons ON rain.menu = seasons.menu ORDER BY sum_percent DESC LIMIT 12) subtable ORDER BY rand() limit 5;',
      (error, results, field) => {
        if (error) throw error;
        res.send(results);
        console.log("비/눈오고 가을이네요 : ", results);
      }
    );
  } else {
    connection.query(
      'SELECT * FROM (SELECT IFNULL(rain.menu, seasons.menu) AS menu, rain.percent + IFNULL(seasons.percent, 0) as sum_percent FROM rain LEFT JOIN (SELECT menu, percent FROM seasons WHERE season="겨울") seasons ON rain.menu = seasons.menu UNION SELECT IFNULL(rain.menu, seasons.menu) AS menu, IFNULL(rain.percent, 0)+seasons.percent FROM rain RIGHT JOIN (SELECT menu, percent FROM seasons WHERE season="겨울") seasons ON rain.menu = seasons.menu ORDER BY sum_percent DESC LIMIT 12) subtable ORDER BY rand() limit 5;',
      (error, results, field) => {
        if (error) throw error;
        res.send(results);
        console.log("비/눈오고 겨울이네요 : ", results);
      }
    );
  }
});
app.listen(port, () => {
  console.log(`Connect at http://localhost:${port}`); // '가 아닌 좌측상단의 esc버튼 밑의 `다.
});
