// Import necessary modules
import Link from "next/link";

export default function Home() {
  // Conditional rendering based on user authentication
  const currentUser = false;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between bg-cover bg-center bg-no-repeat text-white text-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
      url('https://images.unsplash.com/photo-1559521783-1d1599583485?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80')`,
      }}
    >
      
        <header className="container w-2/3">
          <div className="flex justify-between items-center p-4">
            <h3 className="text-3xl font-bold">SummerCamp</h3>
            <nav className="flex space-x-4">
              <Link
                className="text-white font-bold py-1 ml-4 border-b-4 border-transparent border-white"
                href="#"
              >
                Home
              </Link>
              <Link
                className="text-white text-opacity-50  font-bold py-1 ml-4 border-b-4 border-transparent hover:border-white"
                href="/campgrounds"
              >
                Campgrounds
              </Link>
              {/* Conditional rendering based on user authentication */}
              {currentUser ? (
                <Link
                  className="text-white text-opacity-50  font-bold py-1 ml-4 border-b-4 border-transparent hover:border-white"
                  href="/logout"
                >
                  Logout
                </Link>
              ) : (
                <>
                  <Link
                    className="text-white text-opacity-50  font-bold py-1 ml-4 border-b-4 border-transparent hover:border-white"
                    href="/login"
                  >
                    Login
                  </Link>
                  <Link
                    className="text-white text-opacity-50 font-bold py-1 ml-4 border-b-4 border-transparent hover:border-white"
                    href="/register"
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main className="flex flex-col items-center px-3">
          <h1 className="text-4xl font-bold mb-4">SummerCamp</h1>
          <p className="text-lg mb-4">
            Welcome to SummerCamp! <br />
            Jump right in and explore our many campgrounds. <br />
            Feel free to share some of your own and comment on others!
          </p>
          <a
            href="/campgrounds"
            className="btn bg-white text-gray-800 font-bold py-2 px-4 rounded shadow"
          >
            View Campgrounds
          </a>
        </main>
        <footer className="text-gray-500 mb-4">
          <p>&copy; 2024</p>
        </footer>
      </div>
    
  );
}
