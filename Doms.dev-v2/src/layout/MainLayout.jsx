// src/layouts/MainLayout.jsx
const MainLayout = ({ children }) => {
  return (
    <main
      style={{
        border: `1px solid rgb(var(--theme-rgb))`,
        background: `linear-gradient(
           to bottom,
           rgba(var(--body-Linear-1-rgb)),
           rgba(var(--body-Linear-2-rgb))
        )`,
      }}
      className="h-auto md:h-screen w-full md:overflow-hidden p-4 md:p-8"
    >
    <div className="flex flex-col h-auto w-full gap-8 md:grid md:h-full md:grid-cols-1 md:grid-rows-7 z-50">
        {children}
      </div>
    </main>
  );
};
export default MainLayout;