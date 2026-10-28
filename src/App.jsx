import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Banner from "./components/Banner";
import About from "./components/About";
import Projects from "./components/Projects";
import FeaturedArticles from "./components/FeaturedArticles";
import FeaturedTutorials from "./components/FeaturedTutorials";
import Gallery from "./components/Gallery";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import NewPost from "./components/NewPost";
import Pricing from "./pricing/Pricing";
import { D1AuthProvider } from "./context/D1AuthContext";

function AppContent() {
  const getPage = () => {
    const hash = window.location.hash.replace("#", "");
    return ["login", "signup", "newpost", "pricing"].includes(hash) ? hash : "home";
  };

  const [page, setPage] = useState(getPage);

  useEffect(() => {
    const fn = () => setPage(getPage());
    window.addEventListener("hashchange", fn);
    return () => window.removeEventListener("hashchange", fn);
  }, []);

  const goTo = (nextPage) => {
    window.location.hash = nextPage === "home" ? "" : nextPage;
    setPage(nextPage);
    window.scrollTo(0, 0);
  };

  if (page === "login") return <Login goTo={goTo} />;
  if (page === "signup") return <Signup goTo={goTo} />;

  return (
    <>
      <Header goTo={goTo} />
      {page === "newpost" && <NewPost goTo={goTo} />}
      {page === "pricing" && <Pricing goTo={goTo} />}
      {page === "home" && (
        <>
          <Banner />
          <About />
          <Projects />
          <FeaturedArticles />
          <FeaturedTutorials />
          <Gallery />
          <Newsletter />
          <Footer />
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <D1AuthProvider>
      <AppContent />
    </D1AuthProvider>
  );
}
