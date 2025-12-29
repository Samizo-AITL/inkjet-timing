import { params } from "./params.js";
import { computeStack } from "./model.js";
import { drawStack } from "./draw.js";

console.log("BOOT OK");

const data = computeStack(params);
drawStack(data);
