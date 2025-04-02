import "./App.css";
import React, { useEffect, useReducer } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";

const initialState = {
  users: [],
  loading: true,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return { ...state, users: action.payload, loading: false };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: "Failed to load data" };
    default:
      return state;
  }
}

const Navbar = () => (
  <nav>
    <Link to="/">Home</Link> | <Link to="/about">About</Link> | <Link to="/users">Users</Link> | <Link to="/contacts">Contacts</Link>
  </nav>
);

const Home = () => <h1>Welcome to the website</h1>;
const About = () => <h1>About Lab Work 4</h1>;
const Contacts = () => (
  <div>
    <h1>Contacts</h1>
    <form>
      <input type="text" placeholder="Your name" /><br />
      <input type="email" placeholder="Your email" /><br />
      <button type="submit">Submit</button>
    </form>
  </div>
);
const NotFound = () => <h1>404 - Page not found</h1>;

const Users = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch("https://reqres.in/api/users")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "FETCH_SUCCESS", payload: data.data }))
      .catch(() => dispatch({ type: "FETCH_ERROR" }));
  }, []);

  return (
    <div>
      <h1>Users</h1>
      {state.loading && <p>Loading...</p>}
      {state.error && <p>{state.error}</p>}
      <ul>
        {state.users.map((user) => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.first_name} {user.last_name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = React.useState(null);

  useEffect(() => {
    fetch(`https://reqres.in/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data.data))
      .catch(() => setUser(null));
  }, [id]);

  return (
    <div>
      {user ? (
        <>
          <h1>{user.first_name} {user.last_name}</h1>
          <p>Email: {user.email}</p>
          <img src={user.avatar} alt={user.first_name} />
        </>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/users" element={<Users />} />
      <Route path="/users/:id" element={<UserDetails />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

export default App;
