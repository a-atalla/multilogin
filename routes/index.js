var bcrypt = require('bcrypt');
var mailer = require('nodemailer');
var express = require('express');
var router = express.Router();
var User = require('../models/users');


// Middleware

router.use(function(req, res, next){
	res.locals.title = "MultiLogin";
	res.locals.errMessage =undefined;
	if(req.session.currentUser){
		delete req.session.currentUser.password;
		res.locals.currentUser = req.session.currentUser
	} else {
		res.locals.currentUser = undefined;
	}
	next();
})
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
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
	.get(function(req, res){
		res.locals.title += ' - Register';
		res.render('register')
	})
	.post(function(req, res){
		if(req.body.password == req.body.repassword){

			// generate random string to be used for verification
			// TODO: use MATH.random to generate the code
			var randString = bcrypt.genSaltSync(); 
			
			var pass_hash;
			// The next code will check igf this email is in the database 
			// it will use the same password for the second role of the same email
			User.findOne({email: req.body.email}, function(err, user){
				if(!err){
					if(!user){
						pass_hash = bcrypt.hashSync(req.body.password, 10);
					}else{
						pass_hash = user.password;
					}
				console.log(pass_hash);
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
						console.log("####", err);
						if(err.code === 11000){
							res.locals.errMessage = 'Duplicate key error index (email, role)';
						} else{
							res.locals.errMessage = err.errmsg;
						}
						res.locals.title += ' - Register';
						res.render('register');
					} else{
						sendVerificationEmail(req.body.email, randString);
						res.redirect('/');
					}
				});
				}else{
					console.log(err)
				}
			})
		} else{
			res.locals.errMessage = 'retyped password doesn\'t match';
			res.locals.title += ' - Register';
			res.render('register');
		}
	})

router.get("/verify/:code", function(req, res){
	User.find({verificationCode: req.params.code}, function(err, user){
		if (!err) {
			user = user[0];
			user["isActive"] = true;
			user["verificationCode"] = "";
			User.update({_id: user._id}, user, function(err){
				if(!err){
					res.redirect('/login');
				} else{
					console.log(err)
				}
			});
		} else {
			console(err);
		}
	})
})

// Login
router.route('/login')
	.get(function(req, res){
		res.locals.title += ' - Login';
		res.render('login')
	})
	.post(function(req, res){
		User.findOne({email: req.body.email, role: req.body.role}, function(err, user){
			if(!err){
				if(user && user.isActive){
					console.log("user is active")
					if(bcrypt.compareSync(req.body.password, user.password)){
						req.session.currentUser = user;
						res.redirect("/")
					} else{
						res.locals.errMessage = "Wrong Password";
					}
				} else{
					
					res.locals.errMessage = "User not found or inactive user, please check your email box";
				}
			} else{
				console.log(err);
				res.locals.errMessage = err.errmsg;
				res.locals.title += ' - Login';
				res.render('login');
			}
			
		})
	})

// Logout
router.get('/logout', function(req, res){
	delete req.session.currentUser;
	res.redirect('/');
})

// register member
router.route('/members/add')
	.get(function(req, res){
		res.locals.title +=' - register member';
		res.render('member');
	})
module.exports = router;
