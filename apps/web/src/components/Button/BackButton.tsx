"use client";

import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => router.back()}
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded mb-4"
      >
        ← 前の画面に戻る
      </button>
    </>
  );
};

export default BackButton;
