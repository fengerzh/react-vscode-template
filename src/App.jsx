import { BrowserRouter } from 'react-router-dom';
import LayoutComponent from './layout';
import router from './routes';

function App() {
  return (
    <BrowserRouter>
      <LayoutComponent>{router}</LayoutComponent>
    </BrowserRouter>
  );
}

export default App;
