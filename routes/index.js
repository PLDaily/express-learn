var express = require('express');
var User = require('../models/user.js');
var crypto = require('crypto');
var router = express.Router();

/* GET home page. */
router.get('/', checkLogin);
router.get('/', function(req, res, next) {
	res.render('index', { 
		title: 'Express' ,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});

router.get('/reg', function(req, res, next) {
	res.render('reg', { 
		title: '注册',
		success: req.flash('success').toString(),
  		error: req.flash('error').toString()
	} );
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
			req.flash('error', err.toString());
			return res.redirect('/reg');
		}
		if(user) {
			req.flash('error', '该用户已存在')
			return res.redirect('/reg');
		}
		newUser.save(function(err, user) {
			if(err) {
				req.flash('error', err.toString());
				return res.redirect('/reg');
			}
			if(user) {
				req.flash('success', '注册成功');
				return res.redirect('/login');
			}
		})
	})
})

router.get('/login', function(req, res, next) {
	res.render('login', { 
		title: '登录',
		success: req.flash('success').toString(),
  		error: req.flash('error').toString()
	});
})

router.post('/login', function(req, res, next) {
	var name = req.body.name;
	var password = req.body.password;
	
	var md5 = crypto.createHash('md5');
	password = md5.update(password).digest('hex');

	User.get(name, function(err, user) {
		if(!user) {
			req.flash('error', '该用户不存在');
			return res.redirect('/login');
		}
		if(user.password != password) {
			req.flash('error', '密码错误');
			return res.redirect('/login');
		}
		req.session.user = user;
		res.redirect('/');
	})
})

function checkLogin(req, res, next) {
	if(!req.session.user) {
		req.flash('error', '未登录');
		return res.redirect('/login');
	}
	next();//使用之后才会执行下一段
}
module.exports = router;
