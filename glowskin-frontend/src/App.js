import React from 'react';
import HeroSection from "./components/HeroSection/HeroSection";
import UploadPage from "./pages/UploadPage";
//import Navbar from "./components/Navbar/Navbar";


export default function App() {
  return (
    <div style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
      {/* <Navbar /> */}
      <HeroSection />
      <UploadPage />
    </div>
  );
}