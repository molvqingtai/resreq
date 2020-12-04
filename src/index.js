import fetch from "node-fetch";
import FormData from "form-data";
import Yici from "./Yici.js";

const yici = new Yici({
  fetch: fetch,
  timeout: 10000,
});

yici.use((next) => async (req) => {
  console.log(1);
  const res = await next(req);
  console.log(2);
  return res;
});

(async () => {
  try {
    const formData = new FormData();
    formData.append("test", "message post");
    // const getRes = await ressage.get("http://127.0.0.1:3000/");
    const postRes = await yici.post("http://127.0.0.1:3000/", formData);
    console.log("postRes", postRes);
    debugger;
  } catch (error) {
    console.log("🚀 ~ file: index.js ~ line 20 ~ error", error.message);
    debugger;
  }
})();
