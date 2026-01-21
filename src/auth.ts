import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // 1. 구글 로그인이 일어날 때 account 객체에서 id_token을 꺼내 token에 넣습니다.
      if (account) {
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      // 2. token에 저장된 id_token을 실제 클라이언트 세션에 할당합니다.
      if (session.user) {
        session.idToken = token.idToken as string;
      }
      return session;
    },
  },
});
