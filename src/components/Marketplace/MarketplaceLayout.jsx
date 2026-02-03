import { Outlet } from "react-router-dom";
import MarketplaceHeader from "./MarketplaceHeader";
import "../../pages/Marketplace/Marketplace.css";

const MarketplaceLayout = () => {
  return (
    <div className="marketplace-ecosystem">
      <MarketplaceHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MarketplaceLayout;
