```javascript
/**
 * Load environment variables from .env file.
 */
require('dotenv').config();

/**
 * Importing required modules.
 */
const express = require('express');
const basicAuth = require('express-basic-auth');
const path = require('path');

/**
 * Creating an express application.
 */
const app = express();

/**
 * Setting up the port from environment variables or default to 3000.
 */
const PORT = process.env.PORT || 3000;

/**
 * Using basic authentication middleware.
 * The users are set from environment variables.
 */
app.use(basicAuth({
  users: { [process.env.DOCS_USER]: process.env.DOCS_PASS },
  challenge: true
}));

/**
 * Serving static files from the 'docs/jsdocs' directory.
 */
app.use('/jsdocs', express.static(path.join(__dirname, 'docs/jsdocs')));

/**
 * Starting the server and listening on the specified port.
 * Logs the URL where the docs are available.
 */
app.listen(PORT, () => {
  console.log(` Docs available at http://localhost:${PORT}/jsdocs`);
});
```