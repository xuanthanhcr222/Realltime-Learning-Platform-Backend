const express = require('express')
const bodyParser = require('body-parser')
cookieParser = require('cookie-parser')
const cors = require('cors')
const morgan = require('morgan')


const authRouter = require ('./components/auth/auth.router')
const userinfoRouter = require ('./components/userinfo/userinfo.router')
const groupRouter = require('./components/group/group.router')
const app = express()


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('common'));

app.use(cookieParser());

require("dotenv").config();
require('./config/database')

app.use(cors());

app.use('/api/auth', authRouter);
app.use('/user', userinfoRouter);
app.use('/group', groupRouter);

const port = process.env.PORT

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})