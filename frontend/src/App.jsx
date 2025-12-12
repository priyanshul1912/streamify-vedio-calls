import { Navigate, Route, Routes } from "react-router"
import LoginPage from "./Pages/LoginPage"
import HomePage from "./Pages/HomePage"
import SignUpPage from "./Pages/SignUpPage"
import NotificationsPage from "./Pages/NotificationsPage"
import OnboardingPage from "./Pages/OnboardingPage"
import ChatPage from "./Pages/ChatPage"
import CallPage from "./Pages/CallPage"
import  { Toaster } from "react-hot-toast"

import PageLoader from "./componenets/PageLoader.jsx"

import useAuthUsers from "./hooks/useAuthUsers.js"
import Layout from "./componenets/Layout.jsx"
import { useThemeStore } from "./store/useThemeStore.js"


const App = () => {

// tanstack query
 const {isLoading,authUser} = useAuthUsers()

 const {theme} = useThemeStore()

 const isAuthenticated = Boolean(authUser)
 const isOnboarded = authUser?.isOnboarded

if (isLoading) return <PageLoader/>
  return (
    <div className=" h-screen" data-theme ={theme}>
   
      <Routes>
        <Route path="/" element={isAuthenticated &&  isOnboarded ?(
          <Layout  showSidebar={true}>
             <HomePage />
          </Layout>
         
        ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
        ) }/>
       
        <Route path="/signup" element={!isAuthenticated ? <SignUpPage/> : <Navigate to={ isOnboarded ? "/" : "/onboarding"}/>} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage/> : <Navigate to={ isOnboarded ? "/" : "/onboarding"}/> }/>
        <Route path="/notifications" element={isAuthenticated && isOnboarded ? ( <Layout showSidebar={true}>
          <NotificationsPage  />
        </Layout>
          
        ) : (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>)} />
     
        <Route path="/call/:id" element={isAuthenticated && isOnboarded ?(<CallPage/>)  : ( <Navigate to= {!isAuthenticated ? "/login" : "/onboarding"}/>
      )
      
      } />
        <Route path="/chat/:id" element={isAuthenticated && isOnboarded ? ( <Layout showSidebar={false}>
          <ChatPage  />
        </Layout>
          
        ) : (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>)} />
        <Route path="/Onboarding" element={isAuthenticated ? (
          !isOnboarded ?(
            <OnboardingPage />
          ) : (
             <Navigate to= "/"/>
          )
        ) : (
           <Navigate to= "/login"/>
        )}/>
       
      </Routes>
      <Toaster />
    </div>
  )
}

export default App