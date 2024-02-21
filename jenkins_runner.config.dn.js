const { tryLoadConfigFile } = require('jenkins-runner');
let jenkinsConfig = {
  user: process.env.J_RUNNER_USER,
  password: process.env.J_RUNNER_PWD,
  apiToken: process.env.J_RUNNER_APITOKEN,
};
if (!jenkinsConfig.user) {
  jenkinsConfig = tryLoadConfigFile(
    'local.private.config.js',
    '../'
  ).jenkinsConfig;
}
module.exports = {
  jenkinsConfig: {
    ...jenkinsConfig,
    host: '10.88.0.125:9090',
    schema: 'http',
  },
  dingtalkList: [],
  gitLogConfig: {
    // ignoreAuthor: true,
    includeTags: ['feat', 'fix', 'build', 'revert', 'perf', 'ci', 'docs'],
  },
  runnerSchemas: [
    {
      runnerName: 'deployDN',
      runnerDisplayName: 'DN-DEPLOY',
      onlyRemindOk: true,
      jobList: [
        {
          jobName: 'DN1.CON.XX.XX-DN', //  dn
          jobDisplayName: 'Deploy landing dn',
          parameters: {
            DO_WHAT: 'publish',
            GIT_URL: 'git@xxxx:frontend/xxx-h5.git',
            GIT_BRANCH: 'vfeat_next',
            DEPLOY_HOST: ['xxx.xxx.xxx.xxx'].join(','),
          },
        },
      ], //
      reminderSuffix: [],
    },
  ],
};
