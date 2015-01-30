"use strict";

const Step = function(task, handler) {
  handler = handler || "next";
  return function(result) {
    try {
      return task[handler](result);
    } catch (error) {
      return {error}
    }
  }
}


const spawn = function(routine) {
  const params = Array.prototype.slice.call(arguments, 1);
  return new Promise(function(resolve, reject) {
    const task = routine.apply(this, params);
    const raise = Step(task, "throw")
    const next = Step(task, "next");

    const resume = function(step) {
      if (step.error) {
        reject(step.error);
      }
      else if (step.done) {
        resolve(step.value);
      }
      else {
        Promise.
          resolve(step.value).
          then(next, raise).
          then(resume);
      }
    };

    resume(next());
  });
};

const async = function(routine) {
  return function() {
    var params = [].slice.call(arguments);
    return spawn.apply(this, [routine].concat(params));
  }
};
