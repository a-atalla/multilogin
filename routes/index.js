var bcrypt = require('bcrypt');
var mailer = require('nodemailer');
var express = require('express');
var router = express.Router();
var User = require('../models/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MultiLogin Demo' });
});

// Register 
function sendVerificationEmail(email, verificationCode){
	var transporter = mailer.createTransport('smtps://your_email%40gmail.com:your_pass@smtp.gmail.com');

	var mailOptions = {
	    from: '"Sender Name" <sender@example.com>', // sender address
	    to: email, // list of receivers
	    subject: 'Email verification', // Subject line
	    text: 'click the following link to verifiy your email address\n  http://127.0.0.1:3000/verify/'+verificationCode, // plaintext body
	};

	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);
	});
}

router.route('/register')
	.get(function(req, res, next){
		res.locals.title = 'MultiLogin Demo | Register';
		res.locals.errMessage = false;
		res.render('register')
	})
	.post(function(req, res, next){
		if(req.body.password == req.body.repassword){

			var randString = bcrypt.genSaltSync(); // generate random string to be used for verification
			var pass_hash = bcrypt.hashSync(req.body.password, 10);

			var newUser = new User({
				role: req.body.role,
				orchestraName: req.body.orcname,
				firstname: req.body.firstname,
				surname: req.body.surname,
				gender: req.body.gender,
				email: req.body.email,
				password: pass_hash,
				isActive: false,
				verificationCode: randString
			});

			newUser.save(function(err){
				if(err){
					console.log(err.errmsg);
					if(err.code === 11000){
						res.locals.errMessage = 'Duplicate key error index (email, role)';
					} else{
						res.locals.errMessage = 'Somthing went wrong, please try again!';
					}
					res.locals.title = 'MultiLogin Demo | Register';
					res.render('register');
				} else{
					res.locals.errMessage = false;
					sendVerificationEmail(req.body.email, randString);
					res.redirect('/');
				}
			});
		} else{
			res.locals.errMessage = 'retyped password doesn\'t match';
			res.locals.title = 'MultiLogin Demo | Register';
			res.render('register');
		}
	})
router.get("/verify/:code", function(req, res){
	res.send(req.params.code);
})

// Login
// bcrypt.compareSync(myPlaintextPassword, hash);
router.route('/login')
	.get(function(req, res){
		res.locals.title = 'MultiLogin Demo | Login';
		res.locals.errMessage = false;
		res.render('login')
	})
module.exports = router;
