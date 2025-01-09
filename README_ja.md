# @harutakax/grpc-health-check

標準の「gRPCヘルスチェックプロトコル」を使用してgRPCのヘルスチェックを行うための、シンプルかつ効率的なTypeScriptパッケージです。

## Features

- gRPCヘルスチェック用の使いやすいAPI
- セキュア接続および非セキュア接続の両方に対応
- 標準のgRPCヘルスチェックプロトコルを実装
- 型安全性と開発者体験を向上させるTypeScriptで記述

## Installation

```bash
npm install @harutakax/grpc-health-check
```

## Usage

```typescript
import { healthCheck } from "@harutakax/grpc-health-check"

async function checkServerHealth() {
  const result = await healthCheck("localhost:50051")
  if (result.success) {
    console.log("suceess")
  } else {
    console.log(`error: ${result.message}`)
  }
}

checkServerHealth()
```

ヘルスチェックは、healthCheck関数にURLを渡して呼び出します。
レスポンスとして、成否情報と、失敗した場合はエラーメッセージを返します。

## API Reference

### healthCheck(url: string, insecure: boolean = false)

指定されたgRPCサーバーのヘルスチェックを実行します。

- url: gRPCサーバーのアドレスとポート番号。ポート番号は省略可能。省略した場合は443が使われる（例: 'localhost:50051'）
- insecure(optional): 非セキュア接続を使用する場合はtrueを指定（デフォルトはfalse）

Promiseを返し、ヘルスチェックの成功または失敗を示すResultオブジェクトを渡します。

```typescript
type Result = {
  success: boolean
  message?: string
}
```

- success: 成否情報
- message: エラーメッセージ(successがfalseの時のみ)

## Requirements

Node.js >= 22.x

## License

このプロジェクトはMITライセンスの下でライセンスされています。詳細はLICENSEファイルをご確認ください。

## Acknowledgements

このパッケージは、gRPCヘルスチェックプロトコルで定義された標準のgRPCヘルスチェックプロトコルを使用しています。
