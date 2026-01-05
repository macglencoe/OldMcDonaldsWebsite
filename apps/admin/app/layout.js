import { Navbar } from "@oldmc/ui"


export const metadata = {
  title: 'Admin Dashboard',
  description: 'Site management for Old McDonald\'s website',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <h1>Navbar here</h1>
        <Navbar 
          titleText={"OMPP Admin"}
          items={[
            
          ]}
        />
        {children}
      </body>
    </html>
  )
}
