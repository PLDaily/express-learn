var express = require('express');
var User = require('../models/user.js');
var crypto = require('crypto');
var router = express.Router();

/* GET home page. */
router.get('/', checkLogin);
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/reg', function(req, res, next) {
	res.render('reg', { title: '注册'} );
});

router.post('/reg', function(req, res, next) {
	var name = req.body.name;
	var password = req.body.password;
	var password_repeat = req.body['password-repeat'];
	var email = req.body.email;

	var md5 = crypto.createHash('md5');
	password = md5.update(password).digest('hex');
	var user = {
		name: name,
		password: password,
		email: email
	}

	var newUser = new User(user);
	
	User.get(newUser.name, function(err, user) {
		if(err) {
			return;
		}
		if(user) {
			console.log('该用户已存在');
			return;
		}
		newUser.save(function(err, user) {
			if(err) {
				return;
			}
			if(user) {
				console.log('保存成功');
				res.redirect('/login');
			}
		})
	})
})

router.get('/login', function(req, res, next) {
	res.render('login', { title: '登录'});
})

router.post('/login', function(req, res, next) {
	console.log(req.body.name);
	console.log(req.body.password);
	var name = req.body.name;
	var password = req.body.password;
	
	var md5 = crypto.createHash('md5');
	password = md5.update(password).digest('hex');
	
	User.get(name, function(err, user) {
		if(!user) {
			console.log('该用户不存在');
			res.redirect('/login');
		}
		if(user.password != password) {
			console.log('密码错误');
			res.redirect('/login');
		}
		req.session.user = user;
		res.redirect('/');
	})
})


function checkLogin(req, res, next) {
	if(!req.session.user) {
		console.log('未登录');
		res.redirect('/login');
	}
	next();//使用之后才会执行下一段
}
module.exports = router;
