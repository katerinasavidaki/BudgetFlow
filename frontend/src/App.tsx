import {BrowserRouter, Route, Routes} from "react-router-dom"
import { AuthProvider } from "./context/AuthProvider.tsx"
import { Layout } from "./components/Layout"
import {ProtectedRoute} from "@/components/ProtectedRoute.tsx";
import {Toaster} from "sonner";
import RegisterPage from "@/pages/RegisterPage.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import PublicRoute from "@/components/PublicRoute.tsx";
import HomePage from "@/pages/HomePage.tsx";
import {TransactionPage} from "@/pages/TransactionPage.tsx";

export default function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              {/* Public Routes */}
              <Route index element={
                  <PublicRoute>
                      <HomePage />
                  </PublicRoute>
                  } />
              <Route path="/login" element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
              } />
              <Route path="/register" element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
              } />

               Private Routes
              <Route path="/dashboard" element={
                    <ProtectedRoute>
                      {/*<DashboardPage />*/}
                    </ProtectedRoute>
                  }
              />
              <Route path="/add" element={
                  <ProtectedRoute>
                      <TransactionPage/>
                  </ProtectedRoute>
              } />
            </Route>
          </Routes>
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

