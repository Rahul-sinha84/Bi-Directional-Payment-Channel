import express from "express";
import controllers from "../controller/signature.controller.js";

const route = express.Router();

const routes = (app) => {
  route.post("/", controllers.createSignature);
  route.get("/:contractAddress", controllers.getSignatures);
  route.put("/", controllers.signSignature);
  route.put("/decline", controllers.declineSignature);
  route.put("/contractSuccess", controllers.contractIntractionSuccess);

  app.use("/api/sign", route);
};

export default routes;
