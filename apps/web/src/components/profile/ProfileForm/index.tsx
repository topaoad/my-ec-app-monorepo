"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
// import { Camera } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z.instanceof(File).optional().or(z.string().optional()),
});

type FormData = z.infer<typeof schema>;

type ProfileFormProps = {
  user: User;
};

export default function ProfileForm({ user }: ProfileFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.nickname ?? user.name ?? "",
      image: user.image ?? undefined,
    },
  });

  const { formState } = form;
  const { isSubmitting, errors } = formState;

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("id", user.id);
    formData.append("name", data.name);
    // data.imageはファイル名+拡張子
    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,
        {
          method: "PUT",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      // 更新後はホームページにリダイレクト
      router.push("/");
    } catch (error) {
      console.error("Error updating profile:", error);
      // エラーをフォームに設定し、FormMessageで表示する
      form.setError("root", {
        type: "manual",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  const imageValue = form.watch("image");
  useEffect(() => {
    // imageValue の値を監視し、アンマウント時にURLを解放する
    let objectUrl: string | undefined;

    if (imageValue instanceof File) {
      objectUrl = URL.createObjectURL(imageValue);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imageValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>プロフィール設定</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ユーザー名</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ユーザー名" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>プロフィール画像</FormLabel>
                  {/* アップロードした画像が反映するように */}
                  {(() => {
                    const imageSource =
                      value instanceof File
                        ? URL.createObjectURL(value)
                        : value;
                    return (
                      imageSource && (
                        <Image
                          src={imageSource}
                          alt="Profile preview"
                          width={100}
                          height={100}
                          className="rounded-full"
                        />
                      )
                    );
                  })()}
                  {/* S3は課金されるので、実装はできたが一旦コメントアウトとする。 */}
                  {/* <FormControl>
                    <div className="flex items-center justify-end space-x-2 w-28 !mt-[-8px]">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="h-5 w-5" />
                      </Button>
                      <Input
                        {...field}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
                        className="hidden"
                        ref={fileInputRef}
                      />
                    </div>
                  </FormControl> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            {errors.root && (
              <Alert variant="destructive">
                <AlertDescription>{errors.root.message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="custom" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "更新中..." : "更新"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
