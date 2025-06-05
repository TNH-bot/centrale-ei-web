import './Layout.css';
import Header from '../Header/Header';
import SubHeader from '../Header/SubHeader';

const Layout = ({ children }) => {
  return (
    <div className="Layout-container">
      <Header />
      <SubHeader />
      <div className="Layout-content">{children}</div>
    </div>
  );
};

export default Layout;
