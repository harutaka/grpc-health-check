# @harutakax/grpc-health-check

A simple and efficient TypeScript package for performing gRPC health checks using the standard "GRPC Health Checking Protocol".

## Features

- Easy-to-use API for gRPC health checks
- Supports both secure and insecure connections
- Implements the standard gRPC health checking protocol
- Written in TypeScript for better type safety and developer experience

## Installation

```bash
npm install @harutakax/grpc-health-check
```

## Usage
```typescript
import { healthCheck } from '@harutakax/grpc-health-check';

async function checkServerHealth() {
  const result = await healthCheck('localhost:50051');
  if (result.success) {
    console.log("");
  } else {
    console.log(`error: ${result.message}`)
  }
}

checkServerHealth();
```

Health checks are performed by calling the healthCheck function with a URL.
The response includes success information, and an error message if the check fails.

## API Reference
### healthCheck(url: string, insecure: boolean = false)
Performs a health check on the specified gRPC server.

* url: The address and port number of the gRPC server. The port number is optional; if omitted, 443 is used by default (e.g., 'localhost:50051').
* insecure: (Optional) Set to true to use an insecure connection. Default is false.

Returns a Promise that resolves to a Result object indicating the success or failure of the health check.

```typescript
type Result = {
  success: boolean;
  message?: string;
};
```

* success: Indicates whether the health check was successful.
* message: Error message (only present when success is false).

## Requirements
Node.js >= 22.x

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
This package uses the standard gRPC health checking protocol as defined in the gRPC Health Checking Protocol.
