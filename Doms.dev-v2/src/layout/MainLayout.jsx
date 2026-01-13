const MainLayout = ({children }) => {
return (

<main className="h-auto md:h-screen w-full md:overflow-hidden p-4 md:p-8 bg-[#020617]">
   <div className="grid h-full w-full grid-cols-2 grid-rows-15 gap-4 ">
     {children}
    </div>
</main>
)
}
export default MainLayout;