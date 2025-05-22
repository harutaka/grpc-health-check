import { healthCheck } from "./healthCheck.ts"

async function checkServerHealth() {
  const result = await healthCheck("localhost:8081", true)
  if (result.success) {
    console.log("success")
  } else {
    console.log(`error: ${result.message}`)
  }
}

checkServerHealth()