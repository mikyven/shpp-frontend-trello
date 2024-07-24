import { ReactElement } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Board } from './pages/Board/Board';
import { Home } from './pages/Home/Home';
import { CardModal } from './pages/Board/components/CardModal/CardModal';
import { Interceptors } from './components/Interceptors/Interceptors';
import { ProtectedRoute } from './utils/ProtectedRoute';
import { LoginPage } from './pages/Auth/components/LoginPage/LoginPage';
import { Auth } from './pages/Auth/Auth';
import { RegisterPage } from './pages/Auth/components/RegistrationForm/RegisterPage';

function App(): ReactElement {
  return (
    <>
      <Interceptors />
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/board/:boardId/*" element={<Board />}>
              <Route path="card/:cardId" element={<CardModal />} />
            </Route>
          </Route>
          <Route element={<Auth />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
