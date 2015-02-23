var printToTree = (function () {
  var printToTree = function (print) {
    var locals = Object.keys(print);

    var index = locals.indexOf('_parent');
    var node = {};

    if (index > -1) {
      var parent = locals.splice(index, 1)[0];
      node.contents = printToTree(parent);
    }

    var count = locals.length;
    var localsObject = {};
    for (var i = 0; i < count; i++) {
      var local = locals[i];
      localsObject[local] = print[local];
    }
    node.locals = localsObject;

    return node;
  }

  return printToTree;
})();

var parentScope = new Scope();
parentScope.set('c', 3);

var scope = parentScope.fork();
scope.set('a', 1);
scope.set('b', 2);

var treeData = printToTree(scope.print());

// var treeData = {
//     name: "/",
//     contents: [
//         {
//             name: "Applications",
//             contents: [
//                 { name: "Mail.app" },
//                 { name: "iPhoto.app" },
//                 { name: "Keynote.app" },
//                 { name: "iTunes.app" },
//                 { name: "XCode.app" },
//                 { name: "Numbers.app" },
//                 { name: "Pages.app" }
//             ]
//         },
//         {
//             name: "System",
//             contents: []
//         },
//         {
//             name: "Library",
//             contents: [
//                 {
//                     name: "Application Support",
//                     contents: [
//                         { name: "Adobe" },
//                         { name: "Apple" },
//                         { name: "Google" },
//                         { name: "Microsoft" }
//                     ]
//                 },
//                 {
//                     name: "Languages",
//                     contents: [
//                         { name: "Ruby" },
//                         { name: "Python" },
//                         { name: "Javascript" },
//                         { name: "C#" }
//                     ]
//                 },
//                 {
//                     name: "Developer",
//                     contents: [
//                         { name: "4.2" },
//                         { name: "4.3" },
//                         { name: "5.0" },
//                         { name: "Documentation" }
//                     ]
//                 }
//             ]
//         },
//         {
//             name: "opt",
//             contents: []
//         },
//         {
//             name: "Users",
//             contents: [
//                 { name: "pavanpodila" },
//                 { name: "admin" },
//                 { name: "test-user" }
//             ]
//         }
//     ]
// };

var size = {
  width: 1000,
  height: 500
};

var maxLabelLength = 20;
var options = {
  fontSize: 14,
  nodeRadius: 5
}

var tree = d3.layout.tree()
    .sort(null)
    .size([size.height, size.width - maxLabelLength*options.fontSize])
    .children(function(d)
    {
        return (!d.contents || d.contents.length === 0) ? null : d.contents;
    });

var nodes = tree.nodes(treeData);
var links = tree.links(nodes);

var containerName = "#tree";

/*
     <svg>
         <g class="container" />
     </svg>
  */
 var layoutRoot = d3.select(containerName)
     .append("svg:svg").attr("width", size.width).attr("height", size.height)
     .append("svg:g")
     .attr("class", "container")
     .attr("transform", "translate(" + maxLabelLength + ",0)");


 // Edges between nodes as a <path class="link" />
 var link = d3.svg.diagonal()
     .projection(function(d)
     {
         return [d.y, d.x];
     });

 layoutRoot.selectAll("path.link")
     .data(links)
     .enter()
     .append("svg:path")
     .attr("class", "link")
     .attr("d", link);


 /*
     Nodes as
     <g class="node">
         <circle class="node-dot" />
         <text />
     </g>
  */
 var nodeGroup = layoutRoot.selectAll("g.node")
     .data(nodes)
     .enter()
     .append("svg:g")
     .attr("class", "node")
     .attr("transform", function(d)
     {
         return "translate(" + d.y + "," + d.x + ")";
     });

 nodeGroup.append("svg:circle")
     .attr("class", "node-dot")
     .attr("r", options.nodeRadius);

 nodeGroup.append("svg:text")
     .attr("text-anchor", function(d)
     {
         return d.children ? "end" : "start";
     })
     .attr("dx", function(d)
     {
         var gap = 2 * options.nodeRadius;
         return d.children ? -gap : gap;
     })
     .attr("dy", 3)
     .text(function(d)
     {
         return d.name;
     });
