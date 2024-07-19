"use client";

import { signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

export default function SessionTip({ session }: { session: Session | null }) {
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-5 mt-5 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">ようこそ</h2>
          <p className="text-center text-gray-600 mb-6">
            サービスをご利用いただくには、ログインが必要です。
          </p>
          <button
            onClick={() => signIn("google")}
            className="bg-purple-600 hover:bg-purple-700 text-white w-full flex items-center justify-center  font-semibold py-3 px-4  rounded-lg shadow transition duration-300 ease-in-out mb-4"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Googleでログイン
          </button>
          <div className="relative my-6">
            <hr className="border-gray-300" />
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-gray-500 text-sm">
              または
            </span>
          </div>
          <button
            onClick={() => signIn()}
            className="w-full bg-white hover:bg-gray-100 text-gray-800 border border-gray-400 font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            他の方法でログイン
          </button>
        </div>
      </div>
    );
  }
  // ログイン中の場合だが、画面表示を想定していないのでコメントアウト
  // return (
  //   <div className="flex items-center justify-center min-h-screen bg-gray-100">
  //     <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
  //       <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">ログイン中</h2>
  //       <p className="text-center text-gray-600 mb-6">
  //         {session.user?.name || "ユーザー"}さん、ようこそ！
  //       </p>
  //       <button
  //         onClick={() => signOut()}
  //         className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
  //       >
  //         ログアウト
  //       </button>
  //     </div>
  //   </div>
  // );
}