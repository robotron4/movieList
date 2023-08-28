/* eslint-disable react/prop-types */

export default function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <div className="logo">
        <span role="img">🍿</span>
        <h1>movieList</h1>
      </div>
      {children}
    </nav>
  );
}
