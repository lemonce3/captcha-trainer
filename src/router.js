const Router = require('koa-router');
const db = require('./db');
const axios = require('axios');
const router = module.exports = new Router();

const httpAgent = axios.create({
	baseURL: 'https://ebank.eximbank.gov.cn/eweb'
});

router.post('/sample', async ctx => {
	const { value, captcha, session } = ctx.request.body;
	const addCaptcha = [value, Buffer.from(captcha.split(',')[1], 'base64')];

	const { data: result } = await httpAgent.post('/CheckTokenBeforeLogin.do', `_vTokenName=${value}`, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Cookie': `JSESSIONID=${session}`,
			'PE-AJAX': true,
			'PE-ENCODING': 'UTF-8'
		}
	});
	
	if (result !== 1) {
		return ctx.status = 400;
	}

	const sql = 'INSERT TRAINING (VALUE, CAPTCHA) VALUES (?,?)';
	db.DBConnection.query(sql, addCaptcha, err => {
		if (err) {
			ctx.body = err;
			return;
		}	
	});

	ctx.body = "add success";
})

router.get('/captcha', async ctx => {
	const { data, headers } = await httpAgent.get('/GenTokenImg.do', {
		params: {
			random: Math.random()
		},
		responseType: 'arraybuffer'
	});

	ctx.body = {
		captcha: data.toString('base64'),
		session: headers['set-cookie'][0].match(/=(\S*); /)[1]
	};
});

