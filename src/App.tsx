import { ReactElement } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Board } from './pages/Board/Board';
import { Home } from './pages/Home/Home';
import { CardModal } from './pages/Board/components/CardModal/CardModal';

function App(): ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/board/:boardId/*" element={<Board />}>
          <Route path="card/:cardId" element={<CardModal />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
