(function() {
  var myAudio = new Audio();

  var lastJobs = {
    aborted:   Number.MAX_SAFE_INTEGER,
    errored:   Number.MAX_SAFE_INTEGER,
    failed:    Number.MAX_SAFE_INTEGER,
    started:   Number.MAX_SAFE_INTEGER,
    succeeded: Number.MAX_SAFE_INTEGER,
  }

  var cooldowns = {
    aborted:   0, // beginning of time
    errored:   0,
    failed:    0,
    started:   0,
    succeeded: 0,
  }
  var COOLDOWN = 60 * 1000;

  function countJobsByStatus() {
    var jobs = {
      aborted: $('.node.job.aborted:not(.started)').length,
      errored: $('.node.job.errored:not(.started)').length,
      failed: $('.node.job.failed:not(.started)').length,
      succeeded: $('.node.job.succeeded:not(.started)').length,
      pending: $('.node.job.pending').length,
      started: $('.node.job.started').length,
    }

    return jobs;
  }

  function getIncreasedJobStates(oldJobs, newJobs) {
    var increasedJobStates = [];

    for (var state in newJobs) {
      if (newJobs[state] > oldJobs[state]) {
        increasedJobStates.push(state);
      }
    }

    return increasedJobStates;
  }

  function playSound(states) {
    var state = getHighestPriority(states);
    if (state) {
      if (Date.now() - cooldowns[state] > COOLDOWN) {
        myAudio.src = chrome.extension.getURL(`audio/${state}.mp3`);
        myAudio.play();
        cooldowns[state] = Date.now();
      }
    }
  }

  function getHighestPriority(states) {
    var priorities = [
      'failed',
      'errored',
      'succeeded',
      'started',
      'pending',
      'aborted',
    ];

    for (var priority of priorities) {
      for (var state of states) {
        if (priority === state) {
          return priority;
        }
      }
    }

    return '';
  }

  function update() {
    var jobs = countJobsByStatus();
    var increasedJobStates = getIncreasedJobStates(lastJobs, jobs);
    playSound(increasedJobStates);

    lastJobs = jobs;
  }

  setInterval(update, 1500);

}());

console.log('1');
