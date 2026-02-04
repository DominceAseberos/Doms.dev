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
      className="min-h-screen w-full p-4 md:p-4"
    >
      <div>
        {children}
      </div>



    </main>
  );
};
export default MainLayout;