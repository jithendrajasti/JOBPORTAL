// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://9a0d598491bb2ea97c0a289796d75077@o4509656656314368.ingest.de.sentry.io/4509656664375376",

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  integrations:[
    Sentry.mongoIntegration(),
  ]
});