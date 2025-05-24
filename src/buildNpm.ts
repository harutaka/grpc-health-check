import { build, emptyDir } from "@deno/dnt"

await emptyDir("./npm")

await build({
  entryPoints: ["./src/index.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "@harutakax/grpc-health-check",
    version: Deno.args[0],
    description: "A simple and efficient TypeScript package for performing gRPC health checks",
    license: "MIT",
    repository: {
      type: "git",
      url: "https://github.com/harutaka/grpc-health-check.git",
    },
  },
  typeCheck: false,
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE")
    Deno.copyFileSync("README.md", "npm/README.md")
    Deno.copyFileSync("README_ja.md", "npm/README_ja.md")
  },
})
