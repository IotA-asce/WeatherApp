const http = require("http");
const fs = require("fs");
let requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

let replaceVal = (tempVal, orgVal) => {
    let temp = tempVal.replace("{%tempVal%}", orgVal.main.temp);
    temp = temp.replace("{%location%}", orgVal.name);
    temp = temp.replace("{%country%}", orgVal.sys.country);
    temp = temp.replace("{%tempMin%}", orgVal.main.temp_min);
    temp = temp.replace("{%tempMax%}", orgVal.main.temp_max);
    // temp = temp.replace("{%%}", orgVal.main.)
    return temp;
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests(
            "https://api.openweathermap.org/data/2.5/weather?q=Kolkata&units=metric&appid=84c8ed5c32b3aad6c4a8e66c92c5dd61"
        )
            .on("data", (chunk) => {
                const dataJSON = JSON.parse(chunk);
                const arrData = [dataJSON];
                let realTimeData = (arrData
                .map((val) => replaceVal(homeFile, val))
                .join(""));
                // console.log(typeof(realTimeData));
                // console.log(realTimeData);
                res.write(realTimeData);
            })
            .on("end", (err) => {
                if (err) return console.log("connection interrupted by error", err);
                res.end();
            });
    }

});

server.listen(3000, "localhost");