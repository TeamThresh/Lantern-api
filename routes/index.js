/**
 * Created by YS on 2017-02-11.
 */
var express = require('express');
var api = require('../controllers');
var router = express.Router();

module.exports = function(){

  // Dashboard
  router.get('/packageNames', api.package.getPackageNames);
  router.get('/nodesAndLinks/:packageName', api.link.getNodesAndLinks);
  router.get('/deviceByOS/:packageName', api.package.getDeviceByOS);
  router.get('/location/:packageName', api.network.getLocation);
  router.get('/topError/:packageName', api.crash.getTopCrash);
  router.get('/userCount/:packageName', api.package.getUserUsage);

  // Package Version
  router.get('/allVersions/:packageName', api.package.getAllVersionStatus);

  // Filter
  router.get('/statusOfLocation/:packageName', api.package.getStatusOfLocation); // TODO /location 과 똑같은데..?
  router.get('/statusOfDevice/:packageName', api.package.getStatusOfDevice); 
  router.get('/statusOfOs/:packageName', api.package.getStatusOfOs);
  router.get('/statusOfActivity/:packageName', api.package.getStatusOfActivity);
  router.get('/group/:packageName', api.package.getGroupList);
  router.get('/group/:packageName/:groupName', api.package.getStatusByGroup);
  router.post('/group/:packageName/:groupName', api.package.setStatusByGroup);

  // Summary View
  router.get('/one-depth-userflow/:packageName/:activityName', api.link.getUserflow);
  router.get('/crash/:packageName/:activityName', api.crash.getCrash);
  router.get('/rendering/:packageName/:activityName', api.render.getRendering);
  router.get('/cpu/:packageName/:activityName', api.cpu.getCPU);
  router.get('/memory/:packageName/:activityName', api.memory.getMemory);
  router.get('/network/:packageName/:activityName', api.network.getNetwork);

  // Detail View
  router.get('/reverseStack/:packageName/:activityName', api.stack.getCallstack);
  router.get('/userList/:packageName/:activityName', api.package.getSelectVersionList);

  router.get('/detail/:packageName', api.detailRes.getResourceByUuid);

  // Crash Dashboard
  router.get('/crashUsage/:packageName', api.crash.getCrashUsage);
  router.get('/crashDetail/:packageName/:crashId', api.crash.getVersionsByCrash);
  router.get('/crashReverseStack/:packageName/:crashId', api.crash.getCrashStack);

  // catch 404 and forward to error handler
  router.all('/*', function(req, res, next) {
    let error = new Error();
    error.status = 404;
    next(error);
  });

  return router;
};

