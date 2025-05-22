import { assertEquals, assertObjectMatch } from "jsr:@std/assert";
import { afterEach, beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { healthCheck } from "../src/healthCheck.ts";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { fromFileUrl, dirname, join } from "jsr:@std/path";

// モックgRPCヘルスチェックサーバーの設定
const projectDir = dirname(fromFileUrl(import.meta.url));
const PROTO_PATH = join(projectDir, "..", "health.proto");
const TEST_PORT = "50051";
const TEST_ADDRESS = `localhost:${TEST_PORT}`;


// 型定義を追加
interface HealthPackageDefinition {
  grpc: {
    health: {
      v1: {
        Health: {
          service: grpc.ServiceDefinition<any>;
          new (address: string, credentials: grpc.ChannelCredentials): any;
        };
      };
    };
  };
}

// モックサーバーの作成用関数
function createMockServer(status = "SERVING") {
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  const healthPackage = grpc.loadPackageDefinition(packageDefinition) as unknown as HealthPackageDefinition;
  const server = new grpc.Server();

  // ヘルスチェックサービスの実装
  server.addService(healthPackage.grpc.health.v1.Health.service, {
    check: (_: any, callback: (error: Error | null, response: any) => void) => {
      callback(null, { status });
    },
  });

  return server;
}

describe("healthCheck", () => {
  let server: grpc.Server;

  beforeEach(() => {
    // 各テスト前にモックサーバーを起動
    server = createMockServer();
    server.bindAsync(
      TEST_ADDRESS,
      grpc.ServerCredentials.createInsecure(),
      (err: Error | null) => {
        if (err) {
          console.error("Server start failed:", err);
          Deno.exit(1);
        }
        server.start();
        console.log(`Mock gRPC health server started on \${TEST_ADDRESS}`);
      }
    );
  });

  afterEach(() => {
    // 各テスト後にサーバーをシャットダウン
    server.forceShutdown();
    console.log("Mock gRPC health server shut down");
  });

  it("should return success when service is serving", async () => {
    const result = await healthCheck(TEST_ADDRESS, true);
    
    assertObjectMatch(result, {
      success: true,
    });
  });

  it("should return failure when service is not serving", async () => {
    // サーバーを停止して再起動(別のステータスで)
    server.forceShutdown();
    server = createMockServer("NOT_SERVING");
    server.bindAsync(
      TEST_ADDRESS,
      grpc.ServerCredentials.createInsecure(),
      () => {
        server.start();
      }
    );

    // ステータスが変わるのを少し待つ
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    const result = await healthCheck(TEST_ADDRESS, true);
    
    assertObjectMatch(result, {
      success: false,
      message: "NOT_SERVING",
    });
  });

  it("should handle connection errors", async () => {
    // サーバーをシャットダウン
    server.forceShutdown();
    
    // シャットダウンしたサーバーにアクセスを試みる
    const result = await healthCheck(TEST_ADDRESS, true);
    
    assertEquals(result.success, false);
    // エラーメッセージの完全一致ではなく、含まれているかチェック
    // 実際のエラーメッセージはプラットフォームやgrpcのバージョンによって異なる可能性がある
    assertTrue(result.message?.includes("Error") || result.message?.includes("error"));
  });

  it("should use default port when not specified", async () => {
    // エラーが発生することを期待 (デフォルトポート443に接続しようとする)
    const result = await healthCheck("localhost", true);
    
    assertEquals(result.success, false);
  });
});

// テストヘルパー関数
function assertTrue(condition?: boolean): void {
  assertEquals(condition, true);
}