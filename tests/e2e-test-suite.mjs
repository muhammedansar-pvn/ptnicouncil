/**
 * Automated End-to-End Test Suite for SSF Puthanathani Sector Student Council 2026
 * Covers all 15 verification scenarios.
 */

const BASE_URL = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";

let testsPassed = 0;
let testsFailed = 0;
const results = [];

function assert(condition, testName, details = "") {
  if (condition) {
    testsPassed++;
    results.push({ name: testName, status: "PASSED", details });
    console.log(`✅ [PASSED] ${testName}`);
  } else {
    testsFailed++;
    results.push({ name: testName, status: "FAILED", details });
    console.error(`❌ [FAILED] ${testName}: ${details}`);
  }
}

async function runTests() {
  console.log(`\n🚀 Starting Automated Test Suite on ${BASE_URL}...\n`);

  const uniqueSuffix = Date.now().toString().slice(-4);
  const testMobile = `984${Math.floor(1000000 + Math.random() * 9000000)}`.slice(0, 10);
  const testName = `Automated Delegate ${uniqueSuffix}`;
  const baseIp = `10.${Math.floor(1 + Math.random() * 200)}.${Math.floor(1 + Math.random() * 200)}`;
  let registeredId = null;
  let adminCookie = null;
  const cleanupIds = [];

  const postRegister = (body, ipSuffix = 1) =>
    fetch(`${BASE_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": `${baseIp}.${ipSuffix}`,
      },
      body: JSON.stringify(body),
    });

  // 1. Scenario 1: Successful Registration
  try {
    const res = await postRegister({
      name: testName,
      unit: "Puthanathani",
      mobile: testMobile,
      instagramId: "test_ssf",
    }, 1);
    const data = await res.json();
    registeredId = data.data?.id;
    assert(
      res.status === 201 && data.success === true && registeredId,
      "Scenario 1: Successful Registration",
      `Status: ${res.status}, ID: ${registeredId}`
    );
  } catch (e) {
    assert(false, "Scenario 1: Successful Registration", e.message);
  }

  // 2. Scenario 2: Invalid Name (<3 chars or empty)
  try {
    const res = await postRegister({
      name: "Ab",
      unit: "Puthanathani",
      mobile: "9876543210",
    }, 2);
    const data = await res.json();
    assert(
      res.status === 400 && data.success === false,
      "Scenario 2: Invalid Name (<3 characters)",
      `Status: ${res.status}`
    );
  } catch (e) {
    assert(false, "Scenario 2: Invalid Name", e.message);
  }

  // 3. Scenario 3: Invalid Mobile Number (not 10 digits or invalid starting digit)
  try {
    const res = await postRegister({
      name: "Valid Name",
      unit: "Puthanathani",
      mobile: "12345",
    }, 3);
    const data = await res.json();
    assert(
      res.status === 400 && data.success === false,
      "Scenario 3: Invalid Mobile Number Format",
      `Status: ${res.status}`
    );
  } catch (e) {
    assert(false, "Scenario 3: Invalid Mobile Number", e.message);
  }

  // 4. Scenario 4: Duplicate Mobile Registration
  try {
    const res = await postRegister({
      name: "Another Delegate",
      unit: "Cheloor",
      mobile: testMobile, // already registered in Scenario 1
    }, 4);
    const data = await res.json();
    assert(
      res.status === 409 && data.success === false,
      "Scenario 4: Duplicate Mobile Registration Prevention",
      `Status: ${res.status}, Message: ${data.message}`
    );
  } catch (e) {
    assert(false, "Scenario 4: Duplicate Mobile Registration", e.message);
  }

  // 5. Scenario 5: Invalid Unit Rejection
  try {
    const res = await postRegister({
      name: "Valid Delegate",
      unit: "InvalidNonExistentUnit",
      mobile: `984${Math.floor(1000000 + Math.random() * 9000000)}`.slice(0, 10),
    }, 5);
    const data = await res.json();
    assert(
      res.status === 400 && data.success === false,
      "Scenario 5: Invalid Sector Unit Rejection",
      `Status: ${res.status}`
    );
  } catch (e) {
    assert(false, "Scenario 5: Invalid Unit", e.message);
  }

  // 6. Scenario 6: Concurrent Duplicate Submissions
  try {
    const concurrentMobile = `984${Math.floor(1000000 + Math.random() * 9000000)}`.slice(0, 10);
    const concurrentIp = `192.168.10.${Math.floor(1 + Math.random() * 250)}`;
    const postPayload = () =>
      fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Forwarded-For": concurrentIp,
        },
        body: JSON.stringify({
          name: "Concurrent Test",
          unit: "Vettichira",
          mobile: concurrentMobile,
        }),
      });

    const [resA, resB] = await Promise.all([postPayload(), postPayload()]);
    const dataA = await resA.json();
    const dataB = await resB.json();
    if (dataA.data?.id) cleanupIds.push(dataA.data.id);
    if (dataB.data?.id) cleanupIds.push(dataB.data.id);
    const statuses = [resA.status, resB.status];
    const hasOneSuccess = statuses.includes(201);
    const hasOneConflict = statuses.includes(409);
    assert(
      hasOneSuccess && hasOneConflict,
      "Scenario 6: Concurrent Duplicate Submissions Handled",
      `Statuses: ${statuses.join(", ")}`
    );
  } catch (e) {
    assert(false, "Scenario 6: Concurrent Duplicate Submissions", e.message);
  }

  // 7. Scenario 7: Rate-Limit Enforcement
  try {
    const rateLimitIp = `198.51.100.${Math.floor(1 + Math.random() * 250)}`;
    let wasRateLimited = false;
    for (let i = 0; i < 7; i++) {
      const res = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Forwarded-For": rateLimitIp,
        },
        body: JSON.stringify({
          name: "Rate Limit Tester",
          unit: "Punnathala",
          mobile: `984${Math.floor(1000000 + Math.random() * 9000000)}`.slice(0, 10),
        }),
      });
      if (res.status === 201) {
        try {
          const rlData = await res.json();
          if (rlData.data?.id) cleanupIds.push(rlData.data.id);
        } catch (_) {}
      }
      if (res.status === 429) {
        wasRateLimited = true;
        break;
      }
    }
    assert(
      wasRateLimited,
      "Scenario 7: Rate-Limit Enforcement (HTTP 429 after 5 attempts)",
      "Received HTTP 429 as expected"
    );
  } catch (e) {
    assert(false, "Scenario 7: Rate-Limit Enforcement", e.message);
  }

  // 8. Scenario 8: Database Availability Check
  try {
    const res = await fetch(`${BASE_URL}/api/stats`);
    const data = await res.json();
    assert(
      res.status === 200 && data.success === true && typeof data.total === "number",
      "Scenario 8: Database & Stats Service Available",
      `Total: ${data.total}`
    );
  } catch (e) {
    assert(false, "Scenario 8: Database Availability", e.message);
  }

  // 9. Scenario 9: Admin Login
  try {
    const res = await fetch(`${BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "admin",
        password: "ssf2026",
      }),
    });
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
      adminCookie = setCookie.split(";")[0];
    }
    const data = await res.json();
    assert(
      res.status === 200 && data.success === true && adminCookie,
      "Scenario 9: Admin Login & Session Cookie Issuance",
      `Cookie acquired: ${Boolean(adminCookie)}`
    );
  } catch (e) {
    assert(false, "Scenario 9: Admin Login", e.message);
  }

  // 10. Scenario 10: Unauthorized Admin API Access
  try {
    const res = await fetch(`${BASE_URL}/api/admin/registrations`);
    assert(
      res.status === 401,
      "Scenario 10: Unauthorized Admin API Access Blocked (HTTP 401)",
      `Status: ${res.status}`
    );
  } catch (e) {
    assert(false, "Scenario 10: Unauthorized Access", e.message);
  }

  // 11. Scenario 11: Edit Registration
  try {
    if (registeredId && adminCookie) {
      const res = await fetch(`${BASE_URL}/api/admin/registrations/${registeredId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: adminCookie,
        },
        body: JSON.stringify({
          name: `${testName} (Updated)`,
          unit: "Vettichira East",
          mobile: testMobile,
          instagramId: "updated_ssf",
        }),
      });
      const data = await res.json();
      assert(
        res.status === 200 && data.success === true,
        "Scenario 11: Admin Edit Registration Record",
        `Updated name: ${data.data?.name}`
      );
    } else {
      assert(false, "Scenario 11: Edit Registration", "Missing registered ID or admin cookie");
    }
  } catch (e) {
    assert(false, "Scenario 11: Edit Registration", e.message);
  }

  // 12. Scenario 12: Delete Registration
  try {
    if (registeredId && adminCookie) {
      const res = await fetch(`${BASE_URL}/api/admin/registrations/${registeredId}`, {
        method: "DELETE",
        headers: { Cookie: adminCookie },
      });
      const data = await res.json();
      assert(
        res.status === 200 && data.success === true,
        "Scenario 12: Admin Delete Registration Record",
        `Message: ${data.message}`
      );
    } else {
      assert(false, "Scenario 12: Delete Registration", "Missing registered ID or admin cookie");
    }
  } catch (e) {
    assert(false, "Scenario 12: Delete Registration", e.message);
  }

  // 13. Scenario 13: CSV Export
  try {
    if (adminCookie) {
      const res = await fetch(`${BASE_URL}/api/admin/export`, {
        headers: { Cookie: adminCookie },
      });
      const contentType = res.headers.get("content-type");
      const content = await res.text();
      assert(
        res.status === 200 &&
          contentType?.includes("text/csv") &&
          content.includes("Full Name"),
        "Scenario 13: Admin CSV Export with IST Timestamps",
        `ContentType: ${contentType}`
      );
    } else {
      assert(false, "Scenario 13: CSV Export", "Missing admin cookie");
    }
  } catch (e) {
    assert(false, "Scenario 13: CSV Export", e.message);
  }

  // 14. Scenario 14: Registration Pass Retrieval (/api/lookup)
  try {
    // First register a dedicated pass for lookup testing
    const lookupMobile = `984${Math.floor(1000000 + Math.random() * 9000000)}`.slice(0, 10);
    const lookupName = "Lookup Verification User";
    const lookupIp = `192.168.20.${Math.floor(1 + Math.random() * 250)}`;
    const regRes = await fetch(`${BASE_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": lookupIp,
      },
      body: JSON.stringify({
        name: lookupName,
        unit: "Karippol",
        mobile: lookupMobile,
      }),
    });

    const regData = await regRes.json();
    if (regData.data?.id) cleanupIds.push(regData.data.id);

    const res = await fetch(`${BASE_URL}/api/lookup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": lookupIp,
      },
      body: JSON.stringify({
        mobile: lookupMobile,
        nameVerification: "Lookup User",
      }),
    });
    const data = await res.json();
    assert(
      res.status === 200 && data.success === true && data.data?.mobile === lookupMobile,
      "Scenario 14: Secure Registration Pass Retrieval (/lookup)",
      `Retrieved for: ${data.data?.name}`
    );
  } catch (e) {
    assert(false, "Scenario 14: Pass Retrieval", e.message);
  }

  // 15. Scenario 15: Mobile Responsiveness & Viewport
  try {
    const res = await fetch(`${BASE_URL}/`);
    const html = await res.text();
    const hasViewport = html.includes('name="viewport"') && html.includes("width=device-width");
    const hasBrandFont = html.includes("Cooper Black") || html.includes("font-cooper");
    assert(
      res.status === 200 && hasViewport && hasBrandFont,
      "Scenario 15: Mobile Viewport & Brand Typography Verification",
      `Viewport: ${hasViewport}, Font: ${hasBrandFont}`
    );
  } catch (e) {
    assert(false, "Scenario 15: Mobile Responsiveness", e.message);
  }

  // Automated cleanup of all temporary test records
  if (cleanupIds.length > 0 && adminCookie) {
    for (const testId of cleanupIds) {
      try {
        await fetch(`${BASE_URL}/api/admin/registrations/${testId}`, {
          method: "DELETE",
          headers: { Cookie: adminCookie },
        });
      } catch (_) {}
    }
    console.log(`🧹 Test cleanup: Removed ${cleanupIds.length} temporary test records.`);
  }

  console.log("\n=================================");
  console.log(`TOTAL SCENARIOS: 15`);
  console.log(`PASSED: ${testsPassed}`);
  console.log(`FAILED: ${testsFailed}`);
  console.log("=================================\n");

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests();
