/**
 * Created by YS on 2017-02-11.
 */
var express = require('express');
var api = require('../controllers');
var router = express.Router();

module.exports = function(){

  // 사용자 카테고리
  router.get('/users/userflow', api.users.getUserflow);
  router.get('/users/summary', api.users.getSummary);
  router.get('/users/detail', api.users.getDetail);
  
  // 기기정보 카테고리
  router.get('/devstats/location', api.devstats.getLocation);
  router.get('/devstats/list', api.devstats.getList);
  router.get('/devstats/list/:uuid', api.devstats.selectListItem);
  router.get('/devstats/ver/:version', api.devstats.getVersion);
  
  // 크래시 카테고리
  router.get('/crash/summary', api.crash.getSummary);
  router.get('/crash/list', api.crash.getList);
  router.get('/crash/decrease', api.crash.getDecrease);
  router.get('/crash/eclipse', api.crash.getEclipse);
  
  // 성능 카테고리
  router.get('/res/dashboard', api.res.getDashboard);
  router.get('/res/dashboard/zview', api.res.getZview);
  router.get('/res/network/summary', api.res.getNetworkSummary);
  router.get('/res/network/speed', api.res.getNetworkSummary);
  router.get('/res/rendering/distribution', api.res.getRendering);
  router.get('/res/perf/summary', api.res.getPerformance);
  router.get('/res/perf/list', api.res.getPerformanceList);

  // catch 404 and forward to error handler
  router.all('/*', function(req, res, next) {
    next(404);
  });

  return router;
};

