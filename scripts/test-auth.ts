import fs from "fs";
import path from "path";
import { isAuthorizedAdminUser } from "../src/lib/auth";

export async function runAuthSecuritySuite() {
  console.log("\n=======================================================");
  console.log("SHIVSASTRA // ADMIN AUTH & AUTHORIZATION SECURITY SUITE");
  console.log("=======================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${message}`);
      failed++;
    }
  }

  const MOCK_ADMIN_UUID = "d8b3c0e1-4567-4890-a123-fe4567890abc";
  const MOCK_ATTACKER_UUID = "e9c4d1f2-7890-4123-b456-cf7890123def";

  // -------------------------------------------------------------
  // TEST A: NO AUTHENTICATED USER
  // -------------------------------------------------------------
  assert(
    isAuthorizedAdminUser(null, MOCK_ADMIN_UUID) === false,
    "A.1 Null user ID is strictly rejected as unauthorized"
  );
  assert(
    isAuthorizedAdminUser(undefined, MOCK_ADMIN_UUID) === false,
    "A.2 Undefined user ID is strictly rejected as unauthorized"
  );
  assert(
    isAuthorizedAdminUser("", MOCK_ADMIN_UUID) === false,
    "A.3 Empty string user ID is strictly rejected as unauthorized"
  );
  assert(
    isAuthorizedAdminUser("   ", MOCK_ADMIN_UUID) === false,
    "A.4 Whitespace-only user ID is strictly rejected as unauthorized"
  );

  // -------------------------------------------------------------
  // TEST B: AUTHENTICATED USER WITH ID DIFFERENT FROM ADMIN UUID
  // -------------------------------------------------------------
  assert(
    isAuthorizedAdminUser(MOCK_ATTACKER_UUID, MOCK_ADMIN_UUID) === false,
    "B.1 Authenticated user with different UUID is strictly unauthorized"
  );
  assert(
    isAuthorizedAdminUser(
      MOCK_ADMIN_UUID + "-tampered",
      MOCK_ADMIN_UUID
    ) === false,
    "B.2 Tampered UUID suffix is strictly unauthorized"
  );
  assert(
    isAuthorizedAdminUser(
      "admin",
      MOCK_ADMIN_UUID
    ) === false,
    "B.3 Arbitrary string 'admin' is strictly unauthorized"
  );

  // -------------------------------------------------------------
  // TEST C: AUTHENTICATED USER WHOSE ID EQUALS SHIVSASTRA_ADMIN_USER_ID
  // -------------------------------------------------------------
  assert(
    isAuthorizedAdminUser(MOCK_ADMIN_UUID, MOCK_ADMIN_UUID) === true,
    "C.1 Authenticated user matching SHIVSASTRA_ADMIN_USER_ID is authorized"
  );
  assert(
    isAuthorizedAdminUser(` ${MOCK_ADMIN_UUID} `, MOCK_ADMIN_UUID) === true,
    "C.2 Trimmed UUID matching configured admin is authorized"
  );

  // -------------------------------------------------------------
  // TEST D: MISSING SHIVSASTRA_ADMIN_USER_ID (FAIL CLOSED)
  // -------------------------------------------------------------
  assert(
    isAuthorizedAdminUser(MOCK_ADMIN_UUID, null) === false,
    "D.1 Null SHIVSASTRA_ADMIN_USER_ID configuration fails closed"
  );
  assert(
    isAuthorizedAdminUser(MOCK_ADMIN_UUID, undefined) === false,
    "D.2 Undefined SHIVSASTRA_ADMIN_USER_ID configuration fails closed"
  );
  assert(
    isAuthorizedAdminUser(MOCK_ADMIN_UUID, "") === false,
    "D.3 Empty string SHIVSASTRA_ADMIN_USER_ID configuration fails closed"
  );
  assert(
    isAuthorizedAdminUser(MOCK_ADMIN_UUID, "   ") === false,
    "D.4 Whitespace-only SHIVSASTRA_ADMIN_USER_ID configuration fails closed"
  );

  // -------------------------------------------------------------
  // TEST E: CLIENT CANNOT INFLUENCE AUTHORIZATION
  // -------------------------------------------------------------
  // Testing with client-style mock spoof attempts
  const spoofedPayloads = [
    { role: "admin", id: MOCK_ATTACKER_UUID },
    { user_id: MOCK_ADMIN_UUID, id: MOCK_ATTACKER_UUID },
    { isAdmin: true, id: MOCK_ATTACKER_UUID },
  ];

  for (const spoof of spoofedPayloads) {
    // Only the verified authenticated subject ID is passed to authorizer
    assert(
      isAuthorizedAdminUser(spoof.id, MOCK_ADMIN_UUID) === false,
      `E. Spoofed client payload with actual user ${spoof.id ? spoof.id.slice(0, 8) : "unknown"}... cannot elevate privilege`
    );
  }

  // -------------------------------------------------------------
  // TEST F: ZERO SERVICE-ROLE KEY IMPORT IN CLIENT COMPONENTS
  // -------------------------------------------------------------
  const srcDir = path.resolve(__dirname, "../src");
  let clientFilesChecked = 0;
  let clientViolations = 0;

  function scanDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (/\.(tsx|jsx|ts|js)$/.test(entry.name)) {
        const content = fs.readFileSync(fullPath, "utf8");
        if (content.includes('"use client"') || content.includes("'use client'")) {
          clientFilesChecked++;
          if (
            content.includes("SUPABASE_SERVICE_ROLE_KEY") ||
            content.includes("getSupabaseServerClient")
          ) {
            console.error(`✗ Security violation in client file: ${fullPath}`);
            clientViolations++;
          }
        }
      }
    }
  }

  scanDir(srcDir);

  assert(
    clientFilesChecked >= 4 && clientViolations === 0,
    `F.1 Verified ${clientFilesChecked} client components; zero service-role keys or admin server clients imported`
  );

  console.log(`\nResults: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runAuthSecuritySuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
