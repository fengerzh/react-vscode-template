import { BrowserRouter } from 'react-router-dom';
// import LayoutComponent from './layout';
import router from './routes';

function App() {
  return (
    <BrowserRouter>
      {router}
    </BrowserRouter>
  );
}

export default App;
