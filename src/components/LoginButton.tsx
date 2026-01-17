import { signIn } from "@/auth";

export default function LoginButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <button type="submit">Google로 로그인하기</button>
    </form>
  );
}
