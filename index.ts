import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import MarkiBot from "./structures/MarkiBot";
const managerClient = new MarkiBot({});

managerClient.login();
