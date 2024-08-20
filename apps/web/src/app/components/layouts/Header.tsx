"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  ShoppingCart,
  Heart,
  Clock,
  User,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/app/components/icons/Logo";
import { cartAtom } from "@/store/cartAtom";
import { useAtomValue } from "jotai";

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const cart = useAtomValue(cartAtom);

  const navItems = [
    { icon: Home, label: "ホーム", href: "/" },
    { icon: ShoppingCart, label: "買い物かご", href: "/cart" },
    { icon: Heart, label: "お気に入り", href: "/favorites" },
    { icon: Clock, label: "購入履歴", href: "/orders" },
  ];

  const handleNavItemClick = (href: string) => {
    if (!session && href !== "/" && href !== "/cart") {
      router.push("/signin");
    } else {
      router.push(href);
    }
    setIsDrawerOpen(false);
  };

  const handleLinkClick = () => {
    setIsAccountDropdownOpen(false);
  };

  const renderNavItems = () => (
    <>
      {navItems.map((item) => (
        <button
          key={item.label}
          onClick={() => handleNavItemClick(item.href)}
          className="relative flex items-center text-gray-600 hover:text-purple-600 md:flex-col md:items-center w-full md:w-auto py-2 md:py-0"
        >
          {cart.length > 0 && item.label === "買い物かご" && (
            <span className="absolute -top-1 left-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
          <item.icon className="w-6 h-6 mr-3 md:mr-0" />
          <span className="text-sm md:text-xs md:mt-1">{item.label}</span>
        </button>
      ))}
      {!session && status !== "loading" && (
        <button
          onClick={() => signIn()}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full md:w-auto mt-4 md:mt-0"
        >
          ログイン
        </button>
      )}
      {session && (
        <div className="relative group">
          <button
            onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
            className="flex items-center text-gray-600 hover:text-purple-600 md:flex-col md:items-center"
          >
            <User className="w-6 h-6" />
            <span className="text-sm md:text-xs md:mt-1 ml-2 md:ml-0">
              アカウント情報
            </span>
            <ChevronDown className="w-4 h-4 ml-1 md:hidden" />
          </button>
          <div
            className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ${isAccountDropdownOpen ? "block" : "hidden"} `}
          >
            <Link
              href="/profile"
              onClick={handleLinkClick}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              プロフィール設定
            </Link>
            <button
              onClick={() => signOut()}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              ログアウト
            </button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-red-600 w-[100px]">
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            {renderNavItems()}
          </nav>
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="md:hidden text-gray-600"
          >
            {isDrawerOpen ? "" : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      <div
        className={`fixed inset-0 bg-gray-600 bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className={`fixed right-0 top-0 bottom-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="p-4">
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="mb-4 text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            <nav className="flex flex-col space-y-4">{renderNavItems()}</nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
