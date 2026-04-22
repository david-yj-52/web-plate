const SOLACE_USER_NAME = process.env.SOLACE_USER_NAME;
const SOLACE_USER_PWD = process.env.SOLACE_USER_PWD;

export const SOLACE_CONFIG = {
  host: "ws://localhost:8008", // WebSocket Plain Text Port
  vpnName: "TSH",
  //   username: SOLACE_USER_NAME,
  //   password: SOLACE_USER_PWD,
  username: "admin",
  password: "admin",
  clientName: "tsh-web-client",
} as const;

// 발송 Topic
export const TOPICS = {
  REQUEST: "TET/H01",
  RESPONSE: "befw/response", // 수신할 Topic
} as const;
