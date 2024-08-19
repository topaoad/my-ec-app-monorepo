"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle, Check } from "lucide-react";

export const SendMail: React.FC = () => {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/sendmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "John Doe", // この値は必要に応じて動的に設定してください
          recipientEmail: recipientEmail,
        }),
      });

      if (response.ok) {
        toast({
          title: "メールを送信しました",
          description:
            (
              < div className="flex items-center" >
                <Check className="w-4 h-4 mr-2 text-green-500" />
                <span>
                  ユーザー名に向けてメールを送信しました
                </span>
              </div >
            ),
          duration: 3000,
        });
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "メールの送信に失敗しました",
        description:
          (
            < div className="flex items-center" >
              <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
              <span>
                メールの送信に失敗しました。もう一度お試しください。
              </span>
            </div >
          ),
        duration: 3000,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <Input
        type="email"
        value={recipientEmail}
        onChange={(e) => setRecipientEmail(e.target.value)}
        placeholder="Recipient Email"
      />
      <Button onClick={handleSendEmail} disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Email"}
      </Button>
    </div>
  );
};
