var isMemberExpression = function (object) {
    return object.type === "MemberExpression";
};
var isIdentifier = function (expression) {
    return expression.type === "Identifier";
};
var rule = {
    meta: {
        type: "problem",
        hasSuggestions: true,
        docs: {
            description: "許可のされていないprocess.env.NODE_ENV",
        },
        messages: {
            unexpectedProcessEnvNodeEnv: "process.env.NODE_ENVは許可されていません。myNodeEnv() を利用してください。",
            replaceToNodeEnv: "myNodeEnv() に置き換える。",
        },
    },
    create: function (context) {
        return {
            MemberExpression: function (node) {
                var sourceNode = node.object;
                if (!isMemberExpression(sourceNode)) {
                    return;
                }
                var sourceObject = sourceNode.object;
                var sourceProperty = sourceNode.property;
                var targetProperty = node.property;
                if (!isIdentifier(sourceObject)) {
                    return;
                }
                if (!isIdentifier(sourceProperty)) {
                    return;
                }
                if (!isIdentifier(targetProperty)) {
                    return;
                }
                if (!node.computed &&
                    sourceObject.name === "process" &&
                    sourceProperty.name === "env" &&
                    targetProperty.name === "NODE_ENV") {
                    context.report({
                        node: node,
                        messageId: "unexpectedProcessEnvNodeEnv",
                        suggest: [
                            {
                                messageId: "replaceToNodeEnv",
                                fix: function (fixer) {
                                    return fixer.replaceText(node, "myNodeEnv()");
                                },
                            },
                        ],
                    });
                }
            },
        };
    },
};
module.exports = rule;
export {};
