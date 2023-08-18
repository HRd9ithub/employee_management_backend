const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJSDocs = YAML.load(__dirname + "/api.yaml");

// const options = {
//     customCss: `img {content:url(\'../logo.svg\'); height:auto;} `,
//     customfavIcon: "../favicon.ico",
//     customSiteTitle: "Code Improve API Doc",

// };
// var options = {
//     explorer: true,
//     swaggerOptions: {
//       urls: [
//         {
//           url: 'http://petstore.swagger.io/v2/swagger.json',
//           name: 'Spec1'
//         },
//         {
//           url: 'http://petstore.swagger.io/v2/swagger.json',
//           name: 'Spec2'
//         }
//       ]
//     },
//   }

//   module.exports = { swaggerServe: swaggerUI.serve, swaggerSetup: swaggerUI.setup(swaggerJSDocs) };

 module.exports = { swaggerServe: swaggerUI.serve, swaggerSetup: swaggerUI.setup(swaggerJSDocs) };