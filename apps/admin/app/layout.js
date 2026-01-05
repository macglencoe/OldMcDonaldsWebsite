import { Navbar } from "@oldmc/ui"
import "./globals.css"


export const metadata = {
  title: 'Admin Dashboard',
  description: 'Site management for Old McDonald\'s website',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar 
          titleText={"OMPP Admin"}
          items={[
            
          ]}
        />
        <div className="max-w-5xl mx-auto px-1 shadow-2xl bg-background" style={{
          boxShadow: "0px 0px 100px rgba(0, 0, 0, 0.2)",
          minHeight: "calc(100vh - 64px)",
        }}>
          {children}
        </div>
      </body>
    </html>
  )
}
