/**
 * Created by YS on 2017-05-16.
 */

var credentials = require('../credentials');
var mysqlSetting = require('../models/mysqlSetting');
var AuthModel = require('../models/authModel');
var VersionModel = require('../models/versionModel');

var jwt = require('jsonwebtoken');
var crypto = require('crypto');

const SESSION_NAME = 'LANTERNSESSIONID';

var auth = {
	regist : function(req, res, next) {
		const data = { 
			username : req.body.username, 
			nickname : req.body.nickname, 
			password : crypto.createHmac('sha256', 
					new Buffer(credentials.jwtsecret))
				.update(req.body.password)
				.digest('base64')
		}

		// check username duplication
		mysqlSetting.getReadPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
            	return AuthModel.checkUserName(context, data);
	    	})
            .then(mysqlSetting.commitTransaction)
	    	.then(mysqlSetting.getWritePool)
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
		    .then((context) => {
    		    // create a new user if does not exist
	            return AuthModel.createUser(context, data);
		    })
            .then(mysqlSetting.commitTransaction)
            .then(function(data) {
                res.statusCode = 200;
                return res.json({
                    msg : 'success'
                });
            })
		    .catch(function(err) {
                if (err.context) {
                    mysqlSetting.rollbackTransaction(err.context)
                        .then(mysqlSetting.releaseConnection)
                        .then(function() {
                            return next(err.error);
                        });
                } else {
                    next(err);
                    throw err;
                }
            })
	    
	},

	login : function(req, res, next) {
		const data = {
			username : req.params.username,
			password : crypto.createHmac('sha256', 
					new Buffer(credentials.jwtsecret))
				.update(req.body.password)
				.digest('base64')
		}

	    const secret = req.app.get('jwt-secret');

	    // check the user info & generate the jwt
		mysqlSetting.getReadPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
            	// TODO 확인해서 토큰만료가 남았으면 현재 토큰만 반환할 것
            	return AuthModel.checkUser(context, data);
	    	})
	    	.then(function(context) {
	    		// user exists, check the password
	    		return AuthModel.verify(context, data.user.password, data.password);
	    	})
	    	.then(function(context) {
	    		// get User access token
	    		return AuthModel.getToken(context, data);
	    	})
	    	.then(function(context) {
                // create a promise that generates jwt asynchronously
                return new Promise((resolved, rejected) => {
                	if (data.isExpired) {
                		let expired = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7days
	                    jwt.sign(
	                        {
	                        	exp: Math.floor(expired / 1000),
	                            user_id: data.user.user_id,
	                            username: data.user.username,
	                            nickname: data.user.nickname
	                        }, 
	                        secret, 
	                        {
	                        	// TODO 확인할것
	                            issuer: credentials.jwt.issuer,
	                            subject: credentials.jwt.subject
	                        }, (err, token) => {
	                            if (err) return rejected({ context : context, error : err });
	                        	data.token = token;
	                        	data.expired = expired;
	                            return resolved(context); 
	                        });
	                } else {
                		context.result = data.token;
                		return resolved(context);
                	}
                });
            })
            .then(mysqlSetting.commitTransaction)
	    	.then(mysqlSetting.getWritePool)
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
	    	.then(function(context) {
	    		return AuthModel.login(context, data);
	    	})
	    	.then((context) => {
	    		return new Promise((resolved) => {
	    			context.result = data.token;
	    			return resolved(context);
	    		})
	    	})
            .then(mysqlSetting.commitTransaction)
            .then(function(data) {
            	// TODO Expire는 client-side 에서 유효기간을 잡는건 무의미하다.
            	// 서버랑 맞추면 좋긴한데 어차피 보안상 서버에서의 유효기간이 중요하기 때문
            	// 나중에 혹시 유효한 쿠키였던 경우 re-issue 갱신해줄 수 있으므로 
            	// 클라이언트 사이드 쿠키는 유효기간을 무한으로 두어도 된다.
                res.cookie(SESSION_NAME, data);
                return res.json({
                    msg : 'login complete'
                });
            })
		    .catch(function(err) {
                if (err.context) {
                    mysqlSetting.rollbackTransaction(err.context)
                        .then(mysqlSetting.releaseConnection)
                        .then(function() {
                            return next(err.error);
                        });
                } else {
                    next(err);
                    throw err;
                }
            })
	},

	check : function(req, res, next) {
		// read the token from cookie
	    const token = req.cookies[SESSION_NAME]
		// token does not exist
	    if( ! token ) {
	    	var error = new Error('not logged in');
	    	error.status = 401;
	    	return next(error);
	    }

	    let decodedToken;
	    // create a promise that decodes the token
	    mysqlSetting.getReadPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
            	return new Promise(function(resolved, rejected) {

				    jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
		                if(err) {	
					    	var error = new Error(err);
					    	error.status = 9401;
					    	return rejected({ context : context, error : error });
		                } 
		                decodedToken = decoded;
		                return resolved(context);
		            })
            	});
	    	})
	    	.then(function(context) {
	    		// user exists, check the password
	    		return AuthModel.verifyToken(context, decodedToken, token);
	    	})
	    	.then(mysqlSetting.commitTransaction)
		    .then(function(decoded) {
		    	req.token = decodedToken;
		    	return next();
		    })
		    .catch(function(err) {
                if (err.context) {
                    mysqlSetting.rollbackTransaction(err.context)
                        .then(mysqlSetting.releaseConnection)
                        .then(function() {
                            return next(err.error);
                        });
                } else {
                    next(err);
                    throw err;
                }
            })
	},

	checkProject : function(req, res, next) {
		const data = {
			user_id : req.token.user_id,
			package_name : req.params.packageName
		}

        mysqlSetting.getReadPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
            	return AuthModel.checkProject(context, data);
	    	})
	    	.then((context) => {
	    		context.result = data.project_level;
	    		return new Promise((resolved) => {
	    			return resolved(context);
	    		});
	    	})
			.then(mysqlSetting.commitTransaction)
			.then(function(data) {
				req.token.user_level = data;
				return next();
			})
			.catch(function(err) {
                if (err.context) {
                    mysqlSetting.rollbackTransaction(err.context)
                        .then(mysqlSetting.releaseConnection)
                        .then(function() {
                            return next(err.error);
                        });
                } else {
                    next(err);
                    throw err;
                }
            })
	},

	editMember : function(req, res, next) {
		const data = { 
			user_id : req.token.user_id,
			username : req.token.username,
			user_level : req.token.user_level,
			package_name : req.params.packageName,
			member_name : req.params.membername,
			level : req.body.level
		}

		if (data.username == data.member_name) {
			let err = new Error();
			err.status = 406;
			return next(err);
		}

		// check username duplication
		mysqlSetting.getReadPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then((context) => {
            	return new Promise((resolved, rejected) => {
            		if (data.user_level == 'admin'
        			|| data.level != 'member') {
	            		let err = new Error();
						err.status = 403;
						return rejected({ context : context, error : err });
					} else if (data.user_level == 'owner'
					|| data.level == 'owner') {
						let err = new Error();
						err.status = 403;
						return rejected({ context : context, error : err });
            		} else if (data.user_level == 'member') {
	            		let err = new Error();
						err.status = 403;
						return rejected({ context : context, error : err });
	            	}

        			return resolved(context);
            	});
            })
            .then((context) => {
            	return AuthModel.checkLevel(context, data);
            })
            .then(mysqlSetting.commitTransaction)
	    	.then(mysqlSetting.getWritePool)
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then((context) => {
            	data.checked_user.package_name = data.package_name;
            	return AuthModel.addAuthToProject(context, data.checked_user);
	    	})
            .then(mysqlSetting.commitTransaction)
            .then(function(data) {
                res.statusCode = 200;
                return res.json({
                    msg : 'member edited'
                });
            })
		    .catch(function(err) {
                if (err.context) {
                    mysqlSetting.rollbackTransaction(err.context)
                        .then(mysqlSetting.releaseConnection)
                        .then(function() {
                            return next(err.error);
                        });
                } else {
                    next(err);
                    throw err;
                }
            })
	},

	rmMember : function(req, res, next) {
		const data = { 
			user_id : req.token.user_id,
			user_level : req.token.user_level,
			package_name : req.params.packageName,
			member_name : req.params.membername
		}

		// check username duplication
		mysqlSetting.getReadPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then((context) => {
            	return AuthModel.checkLevel(context, data);
            })
            .then((context) => {
            	return new Promise((resolved, rejected) => {
            		if (data.checked_user.level != 'owner'
        			&& data.project_level == 'admin'
        			|| data.project_level == 'owner') {
	            		return resolved(context);
					} else {
						let err = new Error();
						err.status = 403;
						return rejected({ context : context, error : err });
            		}
            	});
            })
            .then(mysqlSetting.commitTransaction)
	    	.then(mysqlSetting.getWritePool)
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then((context) => {
            	return AuthModel.removeMember(context, data.checked_user);
	    	})
            .then(mysqlSetting.commitTransaction)
            .then(function(data) {
                res.statusCode = 200;
                return res.json({
                    msg : 'member deleted'
                });
            })
		    .catch(function(err) {
                if (err.context) {
                    mysqlSetting.rollbackTransaction(err.context)
                        .then(mysqlSetting.releaseConnection)
                        .then(function() {
                            return next(err.error);
                        });
                } else {
                    next(err);
                    throw err;
                }
            })
	},
}

module.exports = auth;