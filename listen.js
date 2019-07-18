const app = require("./app");
const { PORT = 9090 } = process.env;
// const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});