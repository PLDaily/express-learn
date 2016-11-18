var express = require('express');
var User = require('../models/user.js');
var router = express.Router();

/* GET home page. */
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
			}
		})
	})
})

router.get('/login', function(req, res, next) {
	res.render('login', { title: '登录'});
})
module.exports = router;
