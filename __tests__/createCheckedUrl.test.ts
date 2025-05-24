import { assertEquals } from "@std/assert"
import createCheckedUrl from "../src/createCheckedUrl.ts"

Deno.test({
  name: "createCheckedUrl - basic URL with default port (secure)",
  fn() {
    const result = createCheckedUrl("example.com", false)
    assertEquals(result, "https://example.com:443")
  },
})

Deno.test({
  name: "createCheckedUrl - basic URL with default port (insecure)",
  fn() {
    const result = createCheckedUrl("example.com", true)
    assertEquals(result, "http://example.com:443")
  },
})

Deno.test({
  name: "createCheckedUrl - URL with custom port (secure)",
  fn() {
    const result = createCheckedUrl("example.com:8080", false)
    assertEquals(result, "https://example.com:8080")
  },
})

Deno.test({
  name: "createCheckedUrl - URL with custom port (insecure)",
  fn() {
    const result = createCheckedUrl("example.com:8080", true)
    assertEquals(result, "http://example.com:8080")
  },
})

Deno.test({
  name: "createCheckedUrl - removes http:// protocol",
  fn() {
    const result = createCheckedUrl("http://example.com", false)
    assertEquals(result, "https://example.com:443")
  },
})

Deno.test({
  name: "createCheckedUrl - removes https:// protocol",
  fn() {
    const result = createCheckedUrl("https://example.com", false)
    assertEquals(result, "https://example.com:443")
  },
})

Deno.test({
  name: "createCheckedUrl - removes grpc:// protocol",
  fn() {
    const result = createCheckedUrl("grpc://example.com", false)
    assertEquals(result, "https://example.com:443")
  },
})

Deno.test({
  name: "createCheckedUrl - removes protocol and preserves port",
  fn() {
    const result = createCheckedUrl("http://example.com:9090", false)
    assertEquals(result, "https://example.com:9090")
  },
})

Deno.test({
  name: "createCheckedUrl - localhost with port",
  fn() {
    const result = createCheckedUrl("localhost:50051", false)
    assertEquals(result, "https://localhost:50051")
  },
})

Deno.test({
  name: "createCheckedUrl - localhost with port (insecure)",
  fn() {
    const result = createCheckedUrl("localhost:50051", true)
    assertEquals(result, "http://localhost:50051")
  },
})

Deno.test({
  name: "createCheckedUrl - IP address with port",
  fn() {
    const result = createCheckedUrl("192.168.1.100:8080", false)
    assertEquals(result, "https://192.168.1.100:8080")
  },
})

Deno.test({
  name: "createCheckedUrl - IP address with default port",
  fn() {
    const result = createCheckedUrl("192.168.1.100", true)
    assertEquals(result, "http://192.168.1.100:443")
  },
})
