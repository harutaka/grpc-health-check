import { assertEquals } from "@std/assert"
import { healthCheck } from "../src/healthCheck.ts"
import { HealthCheckResponse_ServingStatus as Status } from "../gen/health_pb.ts"

Deno.test({
  name: "healthCheck - function exists and has correct signature",
  fn() {
    // Test that the function exists and is callable
    assertEquals(typeof healthCheck, "function")
    assertEquals(healthCheck.length, 1)
  },
})

Deno.test({
  name: "healthCheck - returns Promise with correct structure for invalid URL",
  async fn() {
    const result = await healthCheck("invalid-url-that-does-not-exist.local")

    assertEquals(typeof result, "object")
    assertEquals(typeof result.success, "boolean")
    assertEquals(result.success, false)
    assertEquals(typeof result.message, "string")
  },
})

Deno.test({
  name: "healthCheck - handles insecure parameter",
  async fn() {
    const result = await healthCheck("invalid-url-that-does-not-exist.local", true)

    assertEquals(typeof result, "object")
    assertEquals(typeof result.success, "boolean")
    assertEquals(result.success, false)
    assertEquals(typeof result.message, "string")
  },
})

Deno.test({
  name: "healthCheck - handles default insecure parameter",
  async fn() {
    const result = await healthCheck("invalid-url-that-does-not-exist.local")

    // Should return a proper Result object
    assertEquals(typeof result, "object")
    assertEquals(typeof result.success, "boolean")
    assertEquals(result.success, false)
    assertEquals(typeof result.message, "string")
  },
})

// Test helper function to verify Status enum values
Deno.test({
  name: "HealthCheckResponse_ServingStatus - enum values are correct",
  fn() {
    assertEquals(Status.UNKNOWN, 0)
    assertEquals(Status.SERVING, 1)
    assertEquals(Status.NOT_SERVING, 2)
    assertEquals(Status.SERVICE_UNKNOWN, 3)
  },
})

// Test for URL validation through createCheckedUrl integration
Deno.test({
  name: "healthCheck - processes different URL formats",
  async fn() {
    // Test various URL formats - they should all fail but not throw errors
    const testUrls = [
      "example.com",
      "http://example.com",
      "https://example.com",
      "grpc://example.com",
      "example.com:8080",
      "localhost:50051",
    ]

    for (const url of testUrls) {
      const result = await healthCheck(url)

      // All should return valid Result objects (even if they fail to connect)
      assertEquals(typeof result, "object")
      assertEquals(typeof result.success, "boolean")

      if (!result.success) {
        assertEquals(typeof result.message, "string")
      }
    }
  },
})
