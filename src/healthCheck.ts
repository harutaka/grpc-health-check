import { createClient } from "@connectrpc/connect"
import { Health, HealthCheckResponse_ServingStatus as Status } from "../gen/health_pb.ts"
import { createGrpcTransport, Http2SessionManager } from "@connectrpc/connect-node"
import createCheckedUrl from "./createCheckedUrl.ts"

type Result = {
  success: boolean
  message?: string
}

export async function healthCheck(url: string, insecure: boolean = false): Promise<Result> {
  const checkedUrl = createCheckedUrl(url, insecure)

  const sessionManager = new Http2SessionManager(checkedUrl)
  const transport = createGrpcTransport({
    baseUrl: checkedUrl,
    sessionManager,
  })
  const client = createClient(Health, transport)

  try {
    const res = await client.check({}, { timeoutMs: 5000 })
    return res.status === Status.SERVING ? { success: true } : { success: false, message: Status[res.status] }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    }
  } finally {
    if (sessionManager.state() !== "closed") {
      sessionManager.abort()
    }
  }
}
