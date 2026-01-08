import app from "./app.ts";
import pool, { initDB } from "./db/schema.ts";

const PORT = process.env.PORT || 8000;

await initDB();

app.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}`);
});