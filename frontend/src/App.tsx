import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Blog } from "./pages/Blog";
import { Blogs } from "./pages/Blogs";
import Publish from "./pages/Publish";
import Profile from "./pages/Profile";
import Edit from "./pages/Edit";
import Bookmark from "./pages/Bookmark";
import AuthorProfile from "./pages/AuthorProfile";
import HomePage from "./pages/HomePage";
import Topic from "./pages/Topic";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/publish" element={<Publish />} />
          <Route path="/profile/:penName" element={<Profile />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/bookmark" element={<Bookmark />} />
          <Route path="/authorProfile/:penName" element={<AuthorProfile />} />
          <Route path="/topics" element={<Topic />} />

          {/* <Route path="/Tabs" element={<Tabs />} />
          <Route path="/Tab1" element={<Tabs />} />
          <Route path="/Tab2" element={<Tabs />} />
          <Route path="/Tab3" element={<Tabs />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
