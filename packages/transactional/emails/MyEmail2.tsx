import { Button, Html, Text, Preview } from "@react-email/components";
import * as React from "react";

interface MyEmail2Props {
  username?: string;
}

export const MyEmail2: React.FC<MyEmail2Props> = ({ username }) => {
  return (
    <Html>
      <Button
        href="https://example.com"
        style={{ background: "#000", color: "#fff", padding: "12px 20px" }}
      >
        Click me
      </Button>
      <Text>Welcome, {username}!</Text>
      
    </Html>
  );
}

export default MyEmail2;
