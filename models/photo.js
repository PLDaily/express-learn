var mongodb = require('./db.js');

function Photo(photo) {
	this.name = [];
	this.path = [];
	this.init(photo);
}

module.exports = Photo;
Photo.prototype.init = function(photo) {
	if(typeof photo == 'object' && photo.length > 0) {//数组对象
		for(var i = 0; i < photo.length; i++) {
			this.name.push(photo[i]['name']);
			this.path.push(photo[i]['path']);
		}
	}else {//单个对象
		this.name.push(photo.name);
		this.path.push(photo.path);
	}
}
Photo.prototype.save = function(callback) {
	var photos = [];
	for(var i = 0 ; i < this.name.length; i++) {
		var photo = {
			name: this.name[i],
			path: this.path[i]
		};
		photos.push(photo);
	}
	
	mongodb.open(function(err, db) {
		if(err) {
			return callback(err);
		}
		db.collection('photos', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			collection.insert(photos, {save: true}, function(err, photo) {
				mongodb.close();
				if(err) {
					return callback(err);
				}
				callback(err, photo);
			})
		})
	})
}

Photo.getAll = function(callback) {
	mongodb.open(function(err, db) {
		if(err) {
			return callback(err);
		}
		db.collection('photos', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			collection.find({}).toArray(function(err, photos) {
				mongodb.close();
				if(err) {
					return callback(err);
				}
				callback(err, photos);
			})
		})
	})
}
