
const requestHandler = (req, res) => {

    // Handle two routes: '/' and '/users'
    // . Returnsome greeting text on '/'
    // . Return a list of dummay users (e,g <ul><li>User1</li></ul>)

    // Add a form with a 'username' <input> to the '/' page and submit a post
    // request to '/create-user' upon a button click

    // Add the '/create-user' route and parse the incoming data (i.e. the
    // username) and simply log it to the console

    const url = req.url;
    const method = req.method;
    console.log(url, method);

    if (url === '/'){
        res.write('<html>');
        res.write('<head><title>Assignment 01</title></head>');
        res.write('<body>');
        res.write('<H3>Welcome to Assignment 01...</h3><hr>');

        res.write('<form action="/create-user" method="POST">');
        res.write('<input type="text" name="username"><button type="submit">Send</button>');
        res.write('</form>');

        res.write('</body>');
        res.write('</html>');
        return res.end();
    }
    else if (url === '/users') {
        res.write('<html>');
        res.write('<head><title>Assignment 01</title></head>');
        res.write('<body><H3>List of Users</h3><ul><li>User 1</li><li>User 2</li><li>User 3</li><li>User 4</li></ul></body>');
        res.write('<?html>');
        return res.end();
    }
    else if (url === '/create-user' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });

        return req.on('end', () => {

            const parsedBody = Buffer.concat(body).toString();
            console.log(parsedBody);
            const username = parsedBody.split('=')[1];
            console.log(username);
            res.statusCode = 302;
            res.setHeader('Location', '/');
            return res.end();
        });
    }
    else {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Assignment 01</title></head>');
        res.write('<body><h3>Hello from my node js server!</h3></body>');
        res.write('</html>');
        res.end();
    }

};

exports.handler = requestHandler; 