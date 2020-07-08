const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy;

const app = express();

// Init middleware
// app.use(logger);

//Cookies Configure
app.use(cookieParser('secretidforacookies'));

//Sesion Configure
app.use(session({
    secret: 'secretidforasession',
    resave: true,
    saveUninitialized: true,
}));

//Passport config
app.use(passport.initialize());
app.use(passport.session());

passport.use(new PassportLocal(function(username, password, done) {
    //busco en la tabla si existe el usuario. Si existe verifico que
    //la clave sean las mismas
    if (username === 'c00angelne' && password === 'prueba2020') {
        return done(null, { name: 'c00angelne', name: 'Nicolas' });
    }
    return done(null, false);
}));
//serialize
passport.serializeUser(function(user, done) {
    done(null, user.name);
});
//Deserialize
passport.deserializeUser(function(name, done) {
    //busco en la tabla por el nombre de usuario
    //y lo devuelvo en un objeto
    done(null, { name: 'c00angelne', name: 'Nicolas' });
});

app.get('/login', (req, res) => {
    res.render('login')
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

app.get('/', (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}, (req, res) => {
    res.render('landing-page')
});

// Handlebars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Homepage Route
const peopleRoutes = require('./routes/people');
app.use('/personas', peopleRoutes);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor correindo en el puerto ${PORT}`));