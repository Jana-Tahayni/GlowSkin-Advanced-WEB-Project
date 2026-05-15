import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import PendingCases from "./pages/PendingCases";
import CaseReview from "./pages/CaseReview";
import RoutineBuilder from "./pages/RoutineBuilder";
import RoutineDisplay from "./pages/RoutineDisplay";
import "./index.css";

function App() {
  return (
    <Router>
      <div style={styles.app}>
        <Navbar />
        <div style={styles.content}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cases" element={<PendingCases />} />
            <Route path="/review" element={<CaseReview />} />
            <Route path="/routine" element={<RoutineBuilder />} />
            <Route path="/routine/display" element={<RoutineDisplay />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

const styles = {
  app: {
    display: "flex",
    minHeight: "100vh",
  },
  content: {
    marginLeft: "230px",
    flex: 1,
    padding: "32px 36px",
    minHeight: "100vh",
    background: "var(--light)",
  },
};

export default App;