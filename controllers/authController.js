/**
 * Created by YS on 2017-05-16.
 */

var credentials = require('../credentials');
var mysqlSetting = require('../models/mysqlSetting');
var authModel = require('../models/authModel');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');

var auth = {
	regist : function(req, res, next) {
		const data = { 
			username : req.body.username, 
			password : crypto.createHmac('sha256', 
					new Buffer(credentials.mongoSecret))
				.update(req.body.password)
				.digest('base64')
		}

		// check username duplication
		mysqlSetting.getPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
            	return authModel.checkUserName(context, data);
	    	})
		    .then((context) => {
    		    // create a new user if does not exist
	            return authModel.createUser(context, data);
		    })
            .then(mysqlSetting.commitTransaction)
            .then(function(data) {
                res.statusCode = 200;
                return res.json({
                    msg : 'success'
                });
            })
		    .catch(function(err) {
		    	next(err);
		    })
	    
	},

	addProject : function(req, res, next) {
		const data = { 
			user_id : req.token.user_id,
			package_name : req.params.packageName,
			level : req.body.level
		}

		// check username duplication
		mysqlSetting.getPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then((context) => {
            	return authModel.addAuthToProject(context, data);
	    	})
            .then(mysqlSetting.commitTransaction)
            .then(function(data) {
                res.statusCode = 200;
                return res.json({
                    msg : 'regist complete'
                });
            })
		    .catch(function(err) {
		    	next(err);
		    })
	},

	login : function(req, res, next) {
		const data = {
			username : req.params.username,
			password : crypto.createHmac('sha256', 
					new Buffer(credentials.mongoSecret))
				.update(req.body.password)
				.digest('base64')
		}

	    const secret = req.app.get('jwt-secret');

	    // check the user info & generate the jwt
		mysqlSetting.getPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
            	return authModel.checkUser(context, data);
	    	})
	    	.then(function(context) {
	    		// user exists, check the password
	    		return authModel.verify(context, context.user.password, data.password);
	    	})
	    	.then(function(context) {
                // create a promise that generates jwt asynchronously
                return new Promise((resolved, rejected) => {
                    jwt.sign(
                        {
                            user_id: context.user.user_id,
                            username: context.user.username
                        }, 
                        secret, 
                        {
                        	// TODO 확인할것
                            expiresIn: '7d',
                            issuer: credentials.jwt.issuer,
                            subject: credentials.jwt.subject
                        }, (err, token) => {
                            if (err) return rejected(err);
                        	context.result = token;
                            return resolved(context); 
                        });
                });
            })
	    	.then(function(context) {
	    		return authModel.login(context, context.user);
	    	})
            .then(mysqlSetting.commitTransaction)
            .then(function(data) {
                res.statusCode = 200;
                return res.json({
                    msg : 'login complete',
                    token : data
                });
            })
		    .catch(function(err) {
		    	next(err);
		    })
	},

	check : function(req, res, next) {
		// read the token from header or url 
	    const token = req.headers['x-access-token'] || req.query.token

	    let decodedToken;
	    // create a promise that decodes the token
	    mysqlSetting.getPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
            	return new Promise(function(resolved, rejected) {
            		// token does not exist
				    if(!token) {
				    	var error = new Error(err);
				    	error.status = 401;
				    	return rejected('not logged in');
				    }

				    jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
		                if(err) {	
					    	var error = new Error(err);
					    	error.status = 401;
					    	return rejected(err);
		                } 
		                decodedToken = decoded;
		                return resolved(context);
		            })
            	});
	    	})
	    	.then(function(context) {
	    		// user exists, check the password
	    		return authModel.verifyToken(context, decodedToken, token);
	    	})
	    	.then(mysqlSetting.commitTransaction)
		    .then(function(decoded) {
		    	req.token = decodedToken;
		    	return next();
		    })
		    .catch(function(err) {
		    	return next(err);
		    });
	},

	checkProject : function(req, res, next) {
		const data = {
			user_id : req.token.user_id,
			package_name : req.params.package_name
		}

        mysqlSetting.getPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
            	return authModel.checkProject(context, data);
	    	})
			.then(mysqlSetting.commitTransaction)
			.then(function(data) {
				req.token.user_level = data;
				return next();
			})
			.catch(function(err) {
				return next(err);
			})
	}
}

module.exports = auth;