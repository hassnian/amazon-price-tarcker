const express = require('express');
const app = express();
const router = express.Router();

/***** EXAMPLE ROUTERS *****/

const exampleRouterNameSpace = '/';

router.get('/example', async (req, res, next) => {
	res.json({hi:"world"});
});

app.use(exampleRouterNameSpace, router);

module.exports = router;
