
const Login = () => {
      useEffect(() => {
        // Redirect to Spotify OAuth URL
         window.location.href = 'http://localhost:3000/api/auth/login';
    }, []);

  return (
        <div>
            <p>Redirecting...</p>
        </div>
    );


    //return redirect('http://localhost:3000/api/auth/login');
}

export default Login;
