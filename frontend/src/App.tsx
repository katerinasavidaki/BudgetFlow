import {BrowserRouter, Route, Routes} from "react-router-dom"
import { AuthProvider } from "./context/AuthProvider.tsx"
import { Layout } from "./components/Layout"
import {ProtectedRoute} from "@/components/ProtectedRoute.tsx";
import {Toaster} from "sonner";
import RegisterPage from "@/pages/RegisterPage.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import PublicRoute from "@/components/PublicRoute.tsx";
import HomePage from "@/pages/HomePage.tsx";
import {NewTransactionPage} from "@/pages/NewTransactionPage.tsx";
import DashboardPage from "@/pages/DashboardPage.tsx";
import ProfilePage from "@/pages/ProfilePage.tsx";
import ChangePasswordPage from "@/pages/ChangePasswordPage.tsx";
import TransactionsPage from "@/pages/TransactionsPage.tsx";
import EditTransactionPage from "@/pages/EditTransactionPage.tsx";
import NotFoundPage from "@/pages/NotFoundPage.tsx";
import StatisticsPage from "@/pages/StatisticsPage.tsx";

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

                {/* Private Routes */}
              <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
              />
              <Route path="/transactions/new" element={
                  <ProtectedRoute>
                      <NewTransactionPage/>
                  </ProtectedRoute>
                }
              />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <ProfilePage/>
                    </ProtectedRoute>
                }
                />
                <Route path="/change-password" element={
                    <ProtectedRoute>
                        <ChangePasswordPage/>
                    </ProtectedRoute>
                    }
                />

                <Route path="/transactions" element={
                    <ProtectedRoute>
                        <TransactionsPage/>
                    </ProtectedRoute>
                } />
                <Route path="/transactions/:id/edit" element={
                    <ProtectedRoute>
                        <EditTransactionPage/>
                    </ProtectedRoute>
                }
                />
                <Route path="/transactions/statistics" element={
                    <ProtectedRoute>
                        <StatisticsPage/>
                    </ProtectedRoute>
                }
                />

                <Route path="*" element={<NotFoundPage />}/>
            </Route>
          </Routes>
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

