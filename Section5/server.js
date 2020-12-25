const express = require("express");
const redis = require("redis");

//레디스 클라이언트 생성
const client = redis.createClient({
    host:"redis-server",
    port:6379
})

const app = express();

//0부터 숫자 시작
client.set("number",0);

app.get("/",(req,res) => {
    client.get("number",(err,number) =>{
        //숫자를 1씩 증가시킴
        client.set("number", parseInt(number)+1)
        res.send("숫자가 1씩 올라갑니다. 숫자:"+number)
    })
})

app.listen(8080);
console.log("Server is running");