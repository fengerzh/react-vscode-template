import { BrowserRouter } from 'react-router-dom';
import router from './routes';

function App() {
  return (
    <BrowserRouter>
      {router}
    </BrowserRouter>
  );
}

export default App;
