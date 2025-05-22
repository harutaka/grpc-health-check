import { healthCheck } from "./healthCheck.ts"

async function checkServerHealth() {
  const result = await healthCheck("sampleserv-eks-dev-osaka.onestopapp.cloud")
  if (result.success) {
    console.log("success")
  } else {
    console.log(`error: ${result.message}`)
  }
}

checkServerHealth()