import { Router } from "express";
import { getFakerProducts } from "../controllers/mocking.controllers.js";

const mockingRouter = Router()

mockingRouter.get('/', getFakerProducts)

export default mockingRouter