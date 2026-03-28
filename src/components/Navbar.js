 
const Navbar = ({ page, setPage }) => {
  return (
    <nav className="nav">
      <a className="nav-brand" href="#">DermaSkin</a>
 
      <ul className="nav-links">
        {["analyzer", "history"].map((p) => (
          <li key={p}>
            <a
              href="#"
              className={page === p ? "active" : ""}
              onClick={(e) => { e.preventDefault(); setPage(p); }}
            >
              {p === "analyzer" ? "Product Analyzer" : "History"}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
 
export default Navbar;