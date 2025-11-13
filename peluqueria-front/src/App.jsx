import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import BarberView from "./pages/BarbersView";
import Register from "./pages/Register";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminView from "./pages/AdminView";
import CustomerView from "./pages/CustomerView";
import AdminRoute from "./components/routes/AdminRoute";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import LoggedRoute from "./components/routes/LoggedRoute";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import WorkWithUs from "./pages/WorkWithUs";
import Reviews from "./pages/Reviews";
import BarberRoute from "./components/routes/BarberRoute";
import BranchesView from "./pages/BranchesView";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <BrowserRouter>
        <NavBar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register></Register>} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/aboutus" element={<About />} />
            <Route path="/services" element={<Services />}></Route>
            <Route path="/appointments" element={<CustomerView />} />
            <Route
              path="/profile"
              element={
                <LoggedRoute>
                  <Profile />
                </LoggedRoute>
              }
            ></Route>
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminView />
                </AdminRoute>
              }
            />
            <Route
              path="/barbersView"
              element={
                <BarberRoute>
                  <BarberView />
                </BarberRoute>
              }
            />
            <Route
              path="/branches"
              element={
                <LoggedRoute>
                  <BranchesView />
                </LoggedRoute>
              }
            />

            <Route
              path="/workWithUs"
              element={<WorkWithUs />}
            />

            <Route path="/reviews" element={<Reviews />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <ToastContainer />
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
