const Router = require('koa-router');
const db = require('./db');
const axios = require('axios');
const urlPrefix = "https://ebank.eximbank.gov.cn/eweb/GenTokenImg.do"
const router = module.exports = new Router();

router.post('/sample', ctx => {
	const { value, captcha } = ctx.request.body;
	const addCaptcha = [value, Buffer.from(captcha.split(',')[1], 'base64')]
	const sql = 'INSERT TRAINING (VALUE, CAPTCHA) VALUES (?,?)';
	db.DBConnection.query(sql, addCaptcha, err => {
		if (err) {
			ctx.body = err;
			return;
		}	
	});
	ctx.body = "add success";
})

router.get('/captcha',async ctx => {
	const { data } = await axios.get(urlPrefix, {
		params: {
			random: Math.random()
		},
		responseType: 'arraybuffer'
	});
	ctx.type = 'image/jpeg';
	ctx.body = data;
});

