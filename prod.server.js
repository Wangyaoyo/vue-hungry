var express = require('express');
var config = require('./config/index');
/* 全局变量process : 无需引入 */
var port = process.env.PORT || config.build.port;

var app = express();

var router = express.Router();

router.get('/', function (req, res ,next) {
  req.url = 'index.html';
  /* 前往下一个中间件（路由）*/
  next();
})

app.use(router);

var appData = require('./data.json')
var seller = appData.seller;
var goods = appData.goods;
var ratings = appData.ratings;

//**********加载mock数据**********
var apiRoutes = express.Router();

apiRoutes.get('/seller', function (req,res) {
  res.json({
    errno: 0,
    data: seller
  });
});
apiRoutes.get('/goods', function (req,res) {
  res.json({
    errno: 0,
    data: goods
  });
});
apiRoutes.get('/ratings', function (req,res) {
  res.json({
    errno: 0,
    data: ratings
  });
});

app.use('/api', apiRoutes);

/* Express框架 提供了static中间件来设置静态文件的资源 */
app.use(express.static('./dist'));

/* module.export用来暴露本文件的变量和函数 */
/* 和exports的区别：exports是它的引用，可以用exports.foo来添加属性，但不能
直接改变，否则就是改变了它的引用，module.export仍然为空对象 */
module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
});
