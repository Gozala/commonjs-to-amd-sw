"use strict";

importScripts("./task.js");

const onFetch = function(event) {
  console.log(event.request.url);
  if (event.request.url.endsWith("module=commonjs")) {
    event.respondWith(onModule(event));
  }
}

const onModule = async(function*(event) {
  var content = yield fetch(event.request.url);
  var body = yield content.blob();
  var transpiled = new Blob([
    "define(function(require, exports, module){ ",
    body,
    "\n/**/});"], {type: body.type});
  return new Response(transpiled);
});

this.addEventListener("fetch", onFetch);
