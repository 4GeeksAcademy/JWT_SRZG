import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { RegisterForm } from "./pages/RegisterForm";
import { LoginForm } from "./components/LoginForm";
import { PrivateRoute } from './components/PrivateRoute';
import { Profile } from './pages/Profile';
import { EditProfile } from "./components/EditProfile";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      <Route index element={<Home />} />
      <Route path="single/:theId" element={<Single />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/private" element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      } />


    </Route>
  ),
  {
    future: {
      v7_relativeSplatPath: true,
      v7_startTransition: true,
    },
  }
);