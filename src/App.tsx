import { ReactElement } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Board } from './pages/Board/Board';
import { Home } from './pages/Home/Home';
import { CardModal } from './pages/Board/components/CardModal/CardModal';
import { Auth } from './pages/Auth/Auth';
import { Interceptors } from './components/Interceptors/Interceptors';

function App(): ReactElement {
  return (
    <>
      <Interceptors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/board/:boardId/*" element={<Board />}>
            <Route path="card/:cardId" element={<CardModal />} />
          </Route>
          <Route path="/login" element={<Auth />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
