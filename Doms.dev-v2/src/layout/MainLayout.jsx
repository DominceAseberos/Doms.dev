const MainLayout = ({children }) => {
return (

<main   
  style={{
  border: `1px solid  rgb(var(--theme-rgb))`,
      background: `linear-gradient(
          to bottom,
          #8986DF,
          #7572C4
      )`
      }}
      
className="h-auto md:h-screen w-full md:overflow-hidden p-4 md:p-8">
   <div className="grid h-full w-full grid-cols-2 grid-rows-15 gap-4 "> 
     {children}
    </div>
</main>
)
}
export default MainLayout;