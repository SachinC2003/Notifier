-- Keep the newest key for each user before enforcing one-to-one ownership.
WITH ranked_keys AS (
    SELECT
        "id",
        ROW_NUMBER() OVER (
            PARTITION BY "userId"
            ORDER BY "created_at" DESC, "id" DESC
        ) AS row_number
    FROM "api_keys"
)
DELETE FROM "api_keys" AS api_key
USING ranked_keys
WHERE api_key."id" = ranked_keys."id"
  AND ranked_keys.row_number > 1;

-- A user can own exactly one API key.
CREATE UNIQUE INDEX "api_keys_userId_key" ON "api_keys"("userId");
