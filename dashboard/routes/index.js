const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.render('index');
});
router.get('/support', async (req, res) => {
    res.redirect('https://discord.gg/invite/5Rsytp3');
});
router.get('/test/:user', async (req, res) => {
  const memberDetails = {
		member: req.params.user,
	}
    res.render('test');
});
router.get('/bot', async (req, res) => {
    res.redirect('https://discord.com/oauth2/authorize?client_id=677135764626210856&scope=bot&permissions=67456065');
});
module.exports = router;