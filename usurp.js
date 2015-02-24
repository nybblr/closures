var acorn = require("acorn");
var escodegen = require("escodegen");
var estraverse = require("estraverse");

var usurp = (function() {

  var createSet = function (identifier, body) {
    return {
      "expression": {
        "arguments": [
          {
            "raw": "'"+identifier+"'",
            "type": "Literal",
            "value": identifier
          }, body
        ],
        "callee": {
          "name": "s",
          "type": "Identifier"
        },
        "type": "CallExpression"
      },
      "type": "ExpressionStatement"
    };
  };

  var createGet = function (identifier) {
    return {
      "arguments": [
        {
          "raw": "'"+identifier+"'",
          "type": "Literal",
          "value": identifier
        }
      ],
      "callee": {
        "name": "g",
        "type": "Identifier"
      },
      "type": "CallExpression"
    };
  };

  var createFunction = function (identifier, params, body) {
    var paramLiterals = params.map(function (p) {
      return {
        raw: "'"+p+"'",
        type: "Literal",
        value: p
      };
    });

    var paramArray = {
      "elements": paramLiterals,
      "type": "ArrayExpression"
    };

    var wrappedBody = {
      body: body,
      expression: false,
      id: null,
      params: [],
      type: "FunctionExpression"
    };

    return {
      "expression": {
        "arguments": [
          {
            "raw": "'"+identifier+"'",
            "type": "Literal",
            "value": identifier
          },
          paramArray,
          wrappedBody
        ],
        "callee": {
          "name": "f",
          "type": "Identifier"
        },
        "type": "CallExpression"
      },
      "type": "ExpressionStatement"
    };
  };

  var usurp = function (input) {

    var ast = acorn.parse(input);

    var newAst = estraverse.replace(ast, {
      leave: function (node, parent) {
        // Replace all var declarations
        if (node.type === 'VariableDeclaration') {
          var dec = node.declarations[0];

          // Check for function expression
          if (dec.init.type === 'FunctionExpression') {
            var params = dec.init.params.map(function (p) { return p.name; });
            return createFunction(dec.id.name, params, dec.init.body);
          } else {
            return createSet(dec.id.name, dec.init);
          }
        }

        // Replace all var lookups
        if (
          node.type === 'Identifier' &&
          !(parent.type === 'MemberExpression' && parent.property === node) &&
          !(parent.type === 'AssignmentExpression' && parent.left === node) &&
          !(parent.type === 'VariableDeclarator' && parent.id === node) &&
          (parent.type !== 'FunctionExpression')
        ) {
          return createGet(node.name);
        }
      }
    });

    var code = escodegen.generate(newAst);
    return code;

  };

  return usurp;

}());

module.exports = usurp;
global.usurp = usurp;
