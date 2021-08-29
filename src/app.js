const logger = require('./utils/logger');
const bodyParser = require('body-parser');
const retJSON = require('./utils/func/retJSON');
const cors = require('cors');
const process = require('./utils/processData');
const config = require('./utils/config')();

module.exports = (app) => {
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(cors());

  app.get('/', (req, res) => {
    res.send(`欢迎来到${config['class-name']}API`);
  });

  app.get('/homework', async (req, res) => {
    if (Object.keys(req.query).length === 0) {
      res.status(400);
      return res.send(retJSON(req.path, 0, {}, 'Bad Request'));
    }

    let data = await process.load();
    let ret = {};

    for (let q in req.query) {
      ret[q] = data.homework[q];
    }

    res.send(retJSON(req.path, 1, ret));
  });

  app.post('/homework', async (req, res) => {
    const ret = await process.write({homework: {...req.body}});
    res.send(retJSON(req.path, 1, ret))
  });

  app.get('/schedule', async (req, res) => {
    let data = await process.load();
    let ret = data.schedule;
    res.send(retJSON(req.path, 1, ret));
  });

  app.get('/gaokao', (req, res) => {
    let date = new Date();
    let gaokao_date = Date.parse(config['gaokao-date']);
    let date_span = gaokao_date - date;
    let ret_span = Math.floor(date_span / (60 * 60 * 24 * 1000));

    res.send(retJSON(req.path, 1, {
      date: config['gaokao-date'],
      span: ret_span,
    }));
  });

  app.get('/weather', (req, res) => {
    // 调用和风天气API
    // 城市列表：https://github.com/qwd/LocationList
    res.send(retJSON(req.path, 1, {
      city: config.weather['city'],
      key: config.weather['key'],
    }));
  });

  app.get('/settings', (req, res) => {
    res.send(retJSON(req.path, 1, config));
  })

  app.listen(config.port, () => {
    logger.success(`端口监听在：${config.port}`);
    require('./init')();
  });
};