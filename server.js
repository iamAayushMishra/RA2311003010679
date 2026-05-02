import app from "./app.js";
import logger from "./src/utils/logger.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`POST http://localhost:${PORT}/schedule — trigger scheduling`);
});
