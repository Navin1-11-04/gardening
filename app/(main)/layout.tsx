import { CartProvider } from "./_context/CartContext";

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <CartProvider>
      <div className="w-full h-full">
        {children}
      </div>
    </CartProvider>
  );
};

export default MainLayout;