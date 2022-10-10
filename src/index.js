const express = require('express')
const route = require("./routes/route")
const mongoose = require('mongoose')
const app = express()


app.use(express.json());

mongoose.connect("sagar:NR489Xvqr9MVCuEZ@cluster0.qks1ndl.mongodb.net/group66Database",{
    useNewUrlParser:true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


app.use("/", route)



app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
