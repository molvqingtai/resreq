import Koa from "koa";

const app = new Koa();

app.use(async (ctx, next) => {
  return new Promise((resolve) => {
    setTimeout(resolve, 2147483647);
  }).then(() => {
    ctx.body = {
      message: "I am a teapot.",
    };
    return next();
  });
});

app.listen(3000);
