const DEFAULT_PORT = "443"

const createCheckedUrl = (url: string, insecure: boolean) => {
  const deletedProtocolUrl = url.replace("http://", "").replace("https://", "").replace("grpc://", "")
  const [host, port] = deletedProtocolUrl.split(":")
  const protocol = insecure ? "http" : "https"

  return `${protocol}://${host}:${port || DEFAULT_PORT}`
}

export default createCheckedUrl
