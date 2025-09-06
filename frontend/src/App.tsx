//client-side routing and mounts 2 pages.
//(/) - GetConfigPage(fetch and display config)
//(/update) - UpdateRemarkPage(update remark via PUT).

import type { JSX } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";

//pages
import GetConfigPage from "./pages/GetConfigPage";
import UpdateRemarkPage from "./pages/UpdateRemarkPage";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <div className="min-h-screen min-w-3xl bg-slate-50 p-6">
        <header className="max-w-4xl mx-auto mb-6">
          <nav className="flex justify-between">
            <Link to="/" className="underline">
              1. Fetch Config
            </Link>
            <Link to="/update" className="underline">
              2. Update Remark
            </Link>
          </nav>
        </header>

        <main className="max-w-4xl mx-auto">
          <Routes>
            <Route path="/" element={<GetConfigPage />}></Route>
            <Route path="/update" element={<UpdateRemarkPage />}></Route>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
