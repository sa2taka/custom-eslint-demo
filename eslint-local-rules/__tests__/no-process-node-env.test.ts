import { RuleTester } from "eslint";

const rule = require("../src/no-process-node-env");

const ruleTester = new RuleTester();
ruleTester.run("no-process-node-env", rule, {
  valid: ["process.env.hoge", "process.env"],
  invalid: [
    {
      code: "process.env.NODE_ENV",
      errors: [
        {
          messageId: "unexpectedProcessEnvNodeEnv",
          type: "MemberExpression",
        },
      ],
    },
  ],
});