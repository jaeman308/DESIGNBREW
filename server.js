//-------------imports-------------//
const dotenv = require('dotenv');
dotenv.config()
const express = require('express');
const app = express();
const mongoose = require('mongoose'); 
const methodOverride = require('method-override')
const morgan = require('morgan'); 
const path = require('path');
const session = require('express-session'); 
const multer = require('multer')
const upload = multer({dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype) && (file.fieldname === 'image'|| file.fieldname === 'profilePicture')) {
            cb(null, true);
        } else {
            cb(new multer.MulterError('Unexpected field or file type'), false);
        }
    }
});


const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

const authController = require('./controllers/auth.js');
const boardController = require('./controllers/boards.js');
const allusersController =require('./controllers/alluser.js')


const port = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on ('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name},`);
});

//-------middleware----------//

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, "public")))
app.use('/uploads', express.static('uploads')); 

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);


//---------Routes------------//
app.use(passUserToView);

app.get('/', (req,res) => {
    res.render('index.ejs');
});

app.use('/auth', authController);
app.use(isSignedIn);
app.use('/allusers', allusersController);
app.use('/users', boardController);




app.listen(port, ()=> {
    console.log(`The express app is ready on port ${port}!`);
});