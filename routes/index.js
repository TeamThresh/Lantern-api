/**
 * Created by YS on 2017-02-11.
 */
var express = require('express');
var api = require('../controllers');
var auth = require('../controllers/authController');
var router = express.Router();

module.exports = function(){

  // Authentication
  router.post('/user', auth.regist);
  router.post('/user/:username', auth.login);
  router.put('/project/:packageName/:membername', auth.check, auth.checkProject, auth.editMember);
  router.delete('/project/:packageName/:membername', auth.check, auth.checkProject, auth.rmMember);

  // Dashboard
  router.get('/packageNames', auth.check, api.package.getPackageNames);
  router.get('/nodesAndLinks/:packageName', auth.check, auth.checkProject, api.link.getNodesAndLinks);
  router.get('/deviceByOS/:packageName', auth.check, auth.checkProject, api.package.getDeviceByOS);
  router.get('/location/:packageName', auth.check, auth.checkProject, api.network.getLocation);
  router.get('/crashCount/:packageName', auth.check, auth.checkProject, api.crash.getTopCrash);
  router.get('/userCount/:packageName', auth.check, auth.checkProject, api.package.getUserUsage);

  // Package Version
  router.get('/allVersions/:packageName', auth.check, auth.checkProject, api.package.getAllVersionStatus);
  router.post('/project/:packageName', auth.check, auth.checkProject, api.package.addProject);
  router.put('/project/:packageName', auth.check, auth.checkProject, api.package.editProject);
  router.delete('/project/:packageName', auth.check, auth.checkProject, api.package.rmProject);

  // Filter
  router.get('/statusOfLocation/:packageName', auth.check, auth.checkProject, api.package.getStatusOfLocation); // TODO /location 과 똑같은데..?
  router.get('/statusOfDevice/:packageName', auth.check, auth.checkProject, api.package.getStatusOfDevice); 
  router.get('/statusOfOs/:packageName', auth.check, auth.checkProject, api.package.getStatusOfOs);
  router.get('/statusOfActivity/:packageName', auth.check, auth.checkProject, api.package.getStatusOfActivity);
  router.get('/group/:packageName', auth.check, auth.checkProject, api.package.getGroupList);
  router.get('/group/:packageName/:groupName', auth.check, auth.checkProject, api.package.getStatusByGroup);
  router.post('/group/:packageName/:groupName', auth.check, auth.checkProject, api.package.setStatusByGroup);

  // Summary View
  router.get('/one-depth-userflow/:packageName/:activityName', auth.check, auth.checkProject, api.link.getUserflow);
  router.get('/crash/:packageName/:activityName', auth.check, auth.checkProject, api.crash.getCrash);
  router.get('/rendering/:packageName/:activityName', auth.check, auth.checkProject, api.render.getRendering);
  router.get('/cpu/:packageName/:activityName', auth.check, auth.checkProject, api.cpu.getCPU);
  router.get('/memory/:packageName/:activityName', auth.check, auth.checkProject, api.memory.getMemory);
  router.get('/network/:packageName/:activityName', auth.check, auth.checkProject, api.network.getNetwork);

  // Detail View
  router.get('/reverseStack/:packageName/:activityName', auth.check, auth.checkProject, api.stack.getCallstack);
  router.get('/userList/:packageName/:activityName', auth.check, auth.checkProject, api.package.getSelectVersionList);

  router.get('/detail/:packageName', auth.check, auth.checkProject, api.detailRes.getResourceByUuid);

  // Crash Dashboard
  router.get('/crashUsage/:packageName', auth.check, auth.checkProject, api.crash.getCrashUsage);
  router.get('/crashDetail/:packageName/:crashId', auth.check, auth.checkProject, api.crash.getVersionsByCrash);
  router.get('/crashReverseStack/:packageName/:crashId', auth.check, auth.checkProject, api.stack.getCrashStack);
  router.get('/crashEventPath/:packageName/:crashId', auth.check, auth.checkProject, api.crash.getCrashEventPath);

  // catch 404 and forward to error handler
  router.all('/*', function(req, res, next) {
    let error = new Error();
    error.status = 404;
    next(error);
  });

  return router;
};

