import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

let userIsAuthorised = false;
// make a variable global
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let date = new Date();


function passwordCheck(req, res, next) {
    const password = req.body["password"];
    if (password == 1234) {
        userIsAuthorised = true;
    }

    next();
}
app.use(passwordCheck);

app.get('/', (req, res) => {

    if (userIsAuthorised === true) {
        res.render('index.ejs')
    } else {
        res.redirect('/login');
    }
});


app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.post('/login', (req, res) => {
    app.locals.username = req.body.username;
    // app.locals.userIsAuthorised = true;
    if (userIsAuthorised === true) {
        res.redirect('/');
    } else {
        res.render('login.ejs');
    }
});

app.post('/post', (req, res) => {
    let id = 0;
    if (typeof app.locals.posts === 'undefined') {
        app.locals.posts = [];

    } else {
        let lastItem = app.locals.posts.slice().pop();
        id = lastItem.id;
    }
    id++;
    const newPost = {
        id: id,
        mood: req.body.mood,
        content: req.body.content
    }
    app.locals.posts.push(newPost);
    // if (app.locals.posts.length < 1) {
    //     id = 0
    // }
    res.redirect('/');
})


app.post('/postUpdate', (req, res) => {
    const id = parseInt(req.params.id);
    let newContent = req.body.modContent;
    let postId = req.body.id;

    res.redirect('/');
    app.locals.posts[postId - 1].content = newContent;
})

app.delete('/post/:id', (req, res) => {
    const id = parseInt(req.params.id);
    app.locals.posts = app.locals.posts.filter(post => post.id !== id);
})


app.listen(port, () => {
    console.log(`Listening on port ${port}`);

});
