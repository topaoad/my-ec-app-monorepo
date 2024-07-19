"use client";

import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useAtom } from "jotai";
import { userAtom } from "@/store/userAtom";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  CopyButton,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// ログイン、ログアウト機能用の仮コンポーネント
export default function UserProfile() {
  const router = useRouter();
  // クライアントセッション
  const { data: session, status } = useSession();
  // セッションユーザーのemailを使用してユーザー情報を取得
  const [user, setUser] = useAtom(userAtom);
  // if (session != null) {
  //   setUser(session.user?.email ?? null);
  // }

  // セッションが変わったときにユーザー情報を更新
  useEffect(() => {
    if (session) {
      setUser(session.user?.email ?? null);
    } else {
      setUser(null);
    }
  }, [session, setUser]);

  // ローカル側でリダイレクトさせる処理　ただし、middlewareでリダイレクトされるので不要
  // status !== "authenticated")にすると、status===loading時にリダイレクトされてしまうのでNG
  // useEffect(() => {
  //   const redirectSignin = () => {
  //     if (status === "unauthenticated") {
  //       return router.push('/signin')
  //     }
  //   }
  //   redirectSignin()
  // }, [status, router]);

  // TanStackのuseQueryを使用してデータを取得
  const fetchUsers = async () => {
    const res = await fetch(session ? "/api/user" : "");
    return res.json();
  };

  const {
    data: users,
    isError,
    isLoading,
    ...others
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
  // ローカルでどのようなユーザー情報を持たせるかは要検討

  console.log("session", session);
  console.log("user", user);
  console.log("users", users);

  if (session && session.user) {
    return (
      <div>
        <p>Welcome, {session.user.name}</p>
        <p>Email: {session.user.email}</p>
        {/* tanstackで取得したユーザー情報サンプル */}
        {users &&
          users.users.map((user: any) => {
            return (
              <div key={user.id}>
                <p>{user.name}</p>
                <p>
                  {"email:"}
                  {user.email}
                </p>
              </div>
            );
          })}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section>
            <Image
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
              height={160}
              alt="Norway"
            />
          </Card.Section>

          <Group justify="space-between" mt="md" mb="xs">
            <Text fw={500}>Norway Fjord Adventures</Text>
            <Badge color="pink">On Sale</Badge>
          </Group>

          <Text size="sm" c="dimmed">
            With Fjord Tours you can explore more of the magical fjord
            landscapes with tours and activities on and around the fjords of
            Norway
          </Text>

          <Button color="blue" fullWidth mt="md" radius="md">
            Book classic tour now
          </Button>
        </Card>
        <CopyButton value="https://mantine.dev">
          {({ copied, copy }) => (
            <Button color={copied ? "teal" : "blue"} onClick={copy}>
              {copied ? "Copied url" : "Copy url"}
            </Button>
          )}
        </CopyButton>
      </div>
    );
  }

  return <p>Not signed in</p>;
}
