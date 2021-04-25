const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/'){
        console.log(url)
        res.setHeader('Content-Type', 'text');
        res.write('<html>');
        res.write('<head><title>Greeting</title></head>');
        res.write('<body><form action="/create-user" method="POST"><label>Username: </label><input type="text" name="username"></input><button type="submit">Send</button></form></body>');
        res.write('</html>');
        return res.end();
    } 
    if (url === '/users'){
        const newUsername = res.dataProcessed;
        res.setHeader('Content-Type', 'text');
        res.write('<html>');
        res.write('<head><title>Greeting</title></head>');
        res.write('<body><h1>Registered Users</h1></body>');
        res.write('<ul>');
        // read file and split into array by new line
        var usernameList = fs.readFileSync('users.txt', 'utf8').split('\n');
        li = '';
        for (let u_name of usernameList) {
            console.group(u_name);
            li += '<li>' + u_name + '</li>';
        };
        res.write(li);
        res.write('</ul>');
        res.write('</html>');
        return res.end();
    }
    if (url === '/create-user' && method === 'POST'){
        const body = []
        req.on('data', (chunk) => {
            body.push(chunk)
        });
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const username = '\n' + parsedBody.split('=')[1];
            fs.appendFile('users.txt', username, 'utf8', function (err) {
                if (err) throw err;
              });
            res.statusCode = 302;
            res.setHeader('Location', '/users');
            return res.end();
        });
    }
};

exports.handler = requestHandler;

