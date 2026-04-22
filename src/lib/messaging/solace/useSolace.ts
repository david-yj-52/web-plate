// src/lib/messaging/solace/useSolace.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SOLACE_CONFIG } from "./solaceConfig";

// ✅ 최상단 import/init 코드 완전 제거

export interface SolaceMessage {
  id: string;
  topic: string;
  payload: string;
  timestamp: Date;
  direction: "sent" | "received";
}

export function useSolace() {
  const sessionRef = useRef<any>(null);
  const solaceRef = useRef<any>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<SolaceMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadSolace = useCallback(async () => {
    if (solaceRef.current) return solaceRef.current;
    if (typeof window === "undefined") return null;

    const solace = await import("solclientjs");

    const factoryProps = new solace.SolclientFactoryProperties();
    factoryProps.profile = solace.SolclientFactoryProfiles.version10;
    (factoryProps as any).logger = new (solace as any).ConsoleLogImpl();

    solace.SolclientFactory.init(factoryProps);
    solace.SolclientFactory.setLogLevel(solace.LogLevel.WARN);

    solaceRef.current = solace;
    return solace;
  }, []);

  const connect = useCallback(
    async (responseTopic: string) => {
      try {
        setIsConnecting(true);
        setError(null);

        const solace = await loadSolace();

        const session = solace.SolclientFactory.createSession({
          url: SOLACE_CONFIG.host,
          vpnName: SOLACE_CONFIG.vpnName,
          userName: SOLACE_CONFIG.username,
          password: SOLACE_CONFIG.password,
          clientName: SOLACE_CONFIG.clientName,
          connectTimeoutInMsecs: 10000,
          reconnectRetries: 3,
        });

        // Session 이벤트 핸들러
        session.on(solace.SessionEventCode.UP_NOTICE, () => {
          console.log("✅ Solace 연결 성공");
          setIsConnected(true);
          setIsConnecting(false);
          subscribeToTopic(session, solace, responseTopic);
        });

        session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, (e: any) => {
          console.error("❌ 연결 실패:", e);
          setError(`연결 실패: ${e.message}`);
          setIsConnecting(false);
        });

        session.on(solace.SessionEventCode.DISCONNECTED, (e: any) => {
          console.log("연결 해제:", e);
          setIsConnected(false);
          setIsConnecting(false); // ✅ 이것도 추가
        });

        session.connect();
        sessionRef.current = session;
      } catch (e: any) {
        setError(`초기화 실패: ${e.message}`);
        setIsConnecting(false);
      }
    },
    [loadSolace],
  );

  const subscribeToTopic = useCallback(
    (session: any, solace: any, topic: string) => {
      try {
        // ✅ 메시지 수신 핸들러
        session.on(solace.SessionEventCode.MESSAGE, (message: any) => {
          const payload = message.getBinaryAttachment()
            ? new TextDecoder().decode(message.getBinaryAttachment())
            : (message.getSdtContainer()?.getValue() ?? "");

          const destination = message.getDestination()?.getName() ?? "";

          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              topic: destination,
              payload,
              timestamp: new Date(),
              direction: "received",
            },
          ]);
        });

        session.subscribe(
          solace.SolclientFactory.createTopicDestination(topic),
          true, // requestConfirmation
          topic, // correlationKey
          10000, // timeout
        );
      } catch (e: any) {
        setError(`구독 실패: ${e.message}`);
      }
    },
    [],
  );

  const publish = useCallback((topic: string, payload: string) => {
    if (!sessionRef.current || !solaceRef.current) {
      setError("연결되지 않았습니다.");
      return;
    }

    try {
      const solace = solaceRef.current;
      const message = solace.SolclientFactory.createMessage();

      message.setDestination(
        solace.SolclientFactory.createTopicDestination(topic),
      );
      message.setBinaryAttachment(new TextEncoder().encode(payload));
      message.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);

      sessionRef.current.send(message);

      // ✅ 발송 메시지도 화면에 표시
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          topic,
          payload,
          timestamp: new Date(),
          direction: "sent",
        },
      ]);
    } catch (e: any) {
      setError(`발송 실패: ${e.message}`);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.disconnect();
      sessionRef.current = null;
      setIsConnected(false);
      setMessages([]);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // 컴포넌트 unmount 시 자동 해제
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isConnecting,
    messages,
    error,
    connect,
    publish,
    disconnect,
    clearMessages,
  };
}
