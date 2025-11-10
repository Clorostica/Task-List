import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "@/routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (_, res) => {
  res.send("Healthcheck");
});

app.use("/", routes);

// For Vercel serverless functions, export the app
export default app;

// For local development, start the server
if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
}
