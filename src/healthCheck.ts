import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import { promisify } from "node:util"
import { fromFileUrl, dirname, join } from "@std/path"

const projectDir = dirname(fromFileUrl(import.meta.url))
const PROTO_PATH = join(projectDir, "..", "health.proto")
const DEFAULT_PORT = "443"
const SERVING_STATUS = "SERVING"

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

interface HealthPackageDefinition {
  grpc: {
    health: {
      v1: {
        Health: new (address: string, credentials: grpc.ChannelCredentials) => HealthClient
      }
    }
  }
}

const healthPackage = grpc.loadPackageDefinition(packageDefinition) as unknown as HealthPackageDefinition
const healthProto = healthPackage.grpc.health.v1

interface HealthClient extends grpc.Client {
  check: (request: any, callback: (error: Error | null, response: any) => void) => void
}

type Result = {
  success: boolean
  message?: string
}

const createCredentials = (insecure: boolean): grpc.ChannelCredentials => {
  return insecure ? grpc.credentials.createInsecure() : grpc.credentials.createSsl()
}

interface HealthResponse {
  status: string
}

const checkHealth = async (client: HealthClient): Promise<HealthResponse> => {
  const checkPromise = promisify(client.check).bind(client)
  return await checkPromise({})
}

export async function healthCheck(url: string, insecure: boolean = false): Promise<Result> {
  const [host, port] = url.split(":")
  const address = `${host}:${port || DEFAULT_PORT}`

  const credentials = createCredentials(insecure)
  const client = new healthProto.Health(address, credentials)
  console.log(address, insecure)

  try {
    const response = await checkHealth(client)

    return response.status === SERVING_STATUS ? { success: true } : { success: false, message: response.status }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    }
  } finally {
    client.close()
  }
}
