import { Rule } from "eslint";
import { MemberExpression, Expression, Super, Identifier, PrivateIdentifier } from "estree";

const isMemberExpression = (
  object: Expression | Super
): object is MemberExpression & {
  parent: Rule.Node;
} => {
  return object.type === "MemberExpression";
};

const isIdentifier = (expression: Expression | Super | PrivateIdentifier): expression is Identifier => {
  return expression.type === "Identifier";
};

const rule = {
  meta: {
    type: "problem",
    fixable: "code",
    hasSuggestions: true,
    docs: {
      description: "許可のされていないprocess.env.NODE_ENV",
    },
    messages: {
      unexpectedProcessEnvNodeEnv: "process.env.NODE_ENVは許可されていません。myNodeEnv() を利用してください。",
      replaceToNodeEnv: "myNodeEnv() に置き換える。",
    },
  },
  create(context: Rule.RuleContext) {
    return {
      MemberExpression(node: MemberExpression & Rule.NodeParentExtension) {
        const sourceNode = node.object;

        if (!isMemberExpression(sourceNode)) {
          return;
        }

        const sourceObject = sourceNode.object;
        const sourceProperty = sourceNode.property;
        const targetProperty = node.property;

        if (!isIdentifier(sourceObject)) {
          return;
        }
        if (!isIdentifier(sourceProperty)) {
          return;
        }
        if (!isIdentifier(targetProperty)) {
          return;
        }

        if (
          !node.computed &&
          sourceObject.name === "process" &&
          sourceProperty.name === "env" &&
          targetProperty.name === "NODE_ENV"
        ) {
          context.report({
            node,
            messageId: "unexpectedProcessEnvNodeEnv",
            suggest: [
              {
                messageId: "replaceToNodeEnv",
                fix(fixer) {
                  return fixer.replaceText(node, "myNodeEnv()");
                },
              },
            ],
          });
        }
      },
    };
  },
} as Rule.RuleModule;

module.exports = rule;