const mongoose = require("mongoose");
var ProgressBar = require('progress');

mongoose.connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    var bar = new ProgressBar('Connecting [:bar] :rate/bps :percent', {
        total: 10
    });
    var timer = setInterval(function () {
        bar.tick();
        if (bar.complete) {
            clearInterval(timer);
            console.log("Database connect successfully.")
        }
    }, 100);
}).catch((err) => {
    console.log('err', err)
})