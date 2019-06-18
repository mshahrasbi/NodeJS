
// 1. create a npm project and install Express.js (Nodemon if you want)

// 2. Create an Express.js app which serves two HTML files (of you choice/with your content) for '/' and '/users'.

// 3. Add some static (.js or .css) files to your project that should be required by at least one of your HTML files.

const path = require('path');
const express = require('express');

const PORT = 3000;
const mainRoute = require('./routes/index');
const userRoute = require('./routes/user');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(mainRoute);
app.use(userRoute);

app.listen(PORT);


