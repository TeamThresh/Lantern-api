/**
 * Created by YS on 2017-02-11.
 */
var express = require('express');
var api = require('../controllers');
var router = express.Router();

module.exports = function(){

  // api
  router.get('/packageNames', api.package.getPackageNames);
  router.get('/nodesAndLinks/:packageName', api.link.getNodesAndLinks);
  router.get('/one-depth-userflow/:packageName/:activityName', api.link.getUserflow);
  router.get('/crash/:packageName/:activityName', api.crash.getCrash);
  router.get('/rendering/:packageName/:activityName', api.render.getRendering);
  router.get('/cpu/:packageName/:activityName', api.cpu.getCPU);
  router.get('/memory/:packageName/:activityName', api.memory.getMemory);
  router.get('/network/:packageName/:activityName', api.network.getNetwork);

  router.get('/deviceByOS/:packageName', api.package.getDeviceByOS);
  router.get('/location/:packageName', api.network.getLocation);
  router.get('/topError/:packageName', api.crash.getTopCrash);

  router.get('/allVersions/:packageName', api.package.getAllVersionStatus);
  router.get('/statusOfLocation/:packageName', api.package.getStatusOfLocation);
  router.get('/statusOfDevice/:packageName', api.package.getStatusOfDevice);
  router.get('/statusOfOs/:packageName', api.package.getStatusOfOs);
  router.get('/statusOfActivity/:packageName', api.package.getStatusOfActivity);

  // catch 404 and forward to error handler
  router.all('/*', function(req, res, next) {
    next(404);
  });

  return router;
};

