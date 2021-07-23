const app = require('express')();

app.get('/', (req, res) => res.send('Le bot est up!'));

module.exports = () => {
  app.listen(3000);
}