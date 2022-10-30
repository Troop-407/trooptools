const express = require('express');
const expstate = require('express-state');
const app = express();
const env = require('dotenv');
const mysql = require('mysql');
const {Utilities} = require('./utilities/utilities')
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser')
const path = require('path')
app.use(cookieParser());
// set view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/src/views/'));
// get routers
const userRouter = require('./routes/user')
const postRouter = require('./routes/test')
const loginRouter = require('./routes/auth')
const memberRouters = require('./routes/member/member')
const APIrouter = require('./routes/api/router')
// generates Token for all pages
// DEV PURPOSE: a token is generated to authenticate all internal 
// requests inorder to restrict routes
// this token allows a form to post to the route (IT IS CRITICAL)
app.all('*', generateToken);
function generateToken(req, res, next) {
    const utils = new Utilities()
    const webJWTToken = utils.createWebJWT()
    const testToken = utils.createHttpOnlyCookie("web_token", res, webJWTToken)
    next();
}
// create and expose state 
expstate.extend(app);
// .env Config and set JSON body parser
env.config()
app.use(express.json())
app.use(bodyparser.urlencoded({
    extended: true
}))
app.use(bodyparser.json())

// Router middlewares 
// app.use('/api/user/', userRouter)
// app.use('/api/posts/', postRouter)
app.use(APIrouter)
app.use('/', loginRouter)
app.use('/', memberRouters)
// static files
app.use('/static', express.static('./src/assets'))
app.listen(3000, () => console.log("Server Running"))