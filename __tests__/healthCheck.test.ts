import { healthCheck } from "../src/healthCheck"

const mockCheck = vi.fn()
const mockClose = vi.fn()

vi.mock("@grpc/grpc-js", () => {
  const actual = vi.importActual("@grpc/grpc-js")
  return {
    ...actual,
    credentials: {
      createInsecure: vi.fn(() => ({})),
      createSsl: vi.fn(() => ({})),
    },
    loadPackageDefinition: vi.fn(() => ({
      grpc: {
        health: {
          v1: {
            Health: vi.fn().mockImplementation(() => {
              return {
                check: mockCheck,
                close: mockClose,
              }
            }),
          },
        },
      },
    })),
  }
})

describe("healthCheck", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("should return success when service is SERVING", async () => {
    mockCheck.mockImplementation((_, callback) => {
      callback(null, { status: "SERVING" })
    })

    const result = await healthCheck("localhost:50051", true)

    expect(result).toEqual({ success: true })
    expect(mockCheck).toHaveBeenCalledTimes(1)
    expect(mockClose).toHaveBeenCalledTimes(1)
  })

  it("should return error when service is not SERVING", async () => {
    mockCheck.mockImplementation((_, callback) => {
      callback(null, { status: "NOT_SERVING" })
    })

    const result = await healthCheck("localhost:50051", true)

    expect(result).toEqual({ success: false, error: "NOT_SERVING" })
    expect(mockCheck).toHaveBeenCalledTimes(1)
    expect(mockClose).toHaveBeenCalledTimes(1)
  })

  it("should handle errors thrown by the gRPC client", async () => {
    mockCheck.mockImplementation((_, callback) => {
      callback(new Error("Connection failed"), null)
    })

    const result = await healthCheck("localhost:50051", true)

    expect(result).toEqual({ success: false, error: "Connection failed" })
    expect(mockCheck).toHaveBeenCalledTimes(1)
    expect(mockClose).toHaveBeenCalledTimes(1)
  })

  it("should use the default port when none is provided", async () => {
    mockCheck.mockImplementation((_, callback) => {
      callback(null, { status: "SERVING" })
    })

    const result = await healthCheck("localhost", true)

    expect(result).toEqual({ success: true })
    expect(mockCheck).toHaveBeenCalledTimes(1)
    expect(mockClose).toHaveBeenCalledTimes(1)
  })
})
