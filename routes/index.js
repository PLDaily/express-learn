var express = require('express');
var User = require('../models/user.js');
var Photo = require('../models/photo.js');
var crypto = require('crypto');
var multer = require('multer');
var path = require('path');

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, path.join(__dirname, "../public/uploads"));
    },
    filename: function(req, file, callback) {
        //callback(null, Date.now().toString() + file.originalname);
        callback(null, file.originalname);
    }
});
var muilter = multer({ storage: storage});

var router = express.Router();

/* GET home page. */
router.get('/', checkLogin);
router.get('/', function(req, res, next) {
	res.render('index', { 
		title: 'Express' ,
        user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});

router.get('/reg', function(req, res, next) {
	res.render('reg', { 
		title: '注册',
        user: req.session.user,
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
        user: req.session.user,
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
		req.flash('success', '登录成功');
		res.redirect('/');
	})
})

//router.get('/upload', checkLogin);
router.get('/upload', function(req, res, next) {
	Photo.getAll(function(err, photos) {
		if(err) {
			req.flash('error', err.toString());
			return res.redirect('/upload');
		}
		res.render('upload', {
			title: '文件上传',
			user: req.session.user,
			photos: photos,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		})
	})
})

router.post('/uploadSingle', function(req, res, next) {
	var upload = muilter.single('uploadInput');
	/*console.log(upload);
	console.log(req.body.uploadInput);
	console.log(req.body.file);
	console.log(req.body.file.name);
	console.log(1111);*/
	upload(req, res, function(err) {
		if(err) {
			req.flash('error', err.toString());
			return res.redirect('/upload');
		}

		var photo = {
			name: req.file.originalname,
			path: req.file.originalname
		};

		var newPhoto = new Photo(photo);
		newPhoto.save(function(err, photo) {
			if(err) {
				req.flash('error', err.toString());
				return res.redirect('/upload');
			}
			req.flash('success', '上传成功');
			res.redirect('/upload');
		});
	})
})

router.post('/uploadArray', function(req, res, next) {
	var upload = muilter.array('uploadInput', 3);
	var photos = [];
    upload(req, res, function(err) {
    	if(err) {
    		req.flash('error', err.toString());
    		return res.redirect('/upload');
    	}
    	for(var i = 0; i < req.files.length; i++) {
    		var photo = {
				name: req.files[i]['originalname'],
				path: req.files[i]['originalname']
			};
			photos.push(photo);
    	}
    	var newPhoto = new Photo(photos);
		newPhoto.save(function(err, photo) {
			if(err) {
				req.flash('error', err.toString());
				return res.redirect('/upload');
			}
		});	
    	req.flash('success', '上传成功');
    	res.redirect('/upload');
    })
})

router.get('/uploads/:id/download', checkLogin);
router.get('/uploads/:id/download', function(req, res, next) {
	var id = req.params.id;
	Photo.findById(id, function(err, photo){
		var photoObj = photo[0];
		if (err) return next(err);
		var imgPath = path.join(__dirname, "../public/uploads/" + photoObj.path);
		res.download(imgPath, photoObj.name);
    });
})

router.get('/logout', checkLogin);
router.get('/logout', function(req, res, next) {
	req.session.user = null;
	req.flash('success', '登出成功');
	res.redirect('/login');
})

function checkLogin(req, res, next) {
	if(!req.session.user) {
		req.flash('error', '未登录');
		return res.redirect('/login');
	}
	next();//使用之后才会执行下一段
}
module.exports = router;
