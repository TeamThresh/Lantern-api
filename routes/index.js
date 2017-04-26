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

  router.get('/deviceByOS/:packageName', api.package.getDeviceStatus);
  router.get('/location/:packageName', api.network.getLocation);
  router.get('/topError/:packageName', api.crash.getTopCrash);

  // catch 404 and forward to error handler
  router.all('/*', function(req, res, next) {
    next(404);
  });

  return router;
};

