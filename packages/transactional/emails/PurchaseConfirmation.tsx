import * as React from 'react';
import { Html, Body, Head, Heading, Hr, Container, Preview, Section, Text, Tailwind } from '@react-email/components';
import { CartItem } from '../../../apps/web/src/store/cartAtom';

interface PurchaseConfirmationProps {
  email: string;
  cart: CartItem[];
  totalAmount: number;
}

export const PurchaseConfirmation: React.FC<PurchaseConfirmationProps> = ({
  email,
  cart,
  totalAmount,
}) => (
  <Html>
    <Head />
    <Preview>ご購入ありがとうございます</Preview>
    <Tailwind>
      <Body className="bg-gray-100 font-sans">
        <Container className="mx-auto p-4 max-w-xl">
          <Heading className="text-2xl font-bold text-center text-gray-800 my-8">購入完了のお知らせ</Heading>
          <Text className="text-gray-700 mb-4">
            {email} 様
          </Text>
          <Text className="text-gray-700 mb-6">
            ご購入ありがとうございます。以下が注文の詳細です：
          </Text>
          <Section className="bg-white rounded-lg shadow-md p-6 mb-6">
            {cart.map((item) => (
              <Text key={item.id} className="text-gray-800 mb-2">
                <span className="font-semibold">{item.title}</span>:
                <span className="ml-2">{item.price.toLocaleString()}円 × {item.quantity}</span>
              </Text>
            ))}
          </Section>
          <Hr className="border-t border-gray-300 my-6" />
          <Text className="text-lg font-bold text-gray-800 text-right">
            合計金額: {totalAmount.toLocaleString()}円
          </Text>
          <Text className="text-sm text-gray-600 mt-8 text-center">
            ご不明な点がございましたら、お気軽にお問い合わせください。
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

// スタイルの定義（省略）

export default PurchaseConfirmation;