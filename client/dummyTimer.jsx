const [cooldown, setCooldown] = useState(() => {
  const saved = localStorage.getItem("cooldownExpiry");
  if (saved) {
    const remaining = Math.floor((+saved - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  }
  return 0;
});

useEffect(() => {
  if (cooldown > 0) {
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          localStorage.removeItem("cooldownExpiry");
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }
}, [cooldown]);


const onSubmitHandler = async (e) => {
  e.preventDefault();

  if (loginState === "Sign up" && !isDataSubmitted) {
    setIsDataSubmitted(true);
    return;
  }

  const payload = {
    fullName,
    email,
    password,
    bio,
  };

  try {
    const url = loginState === "Sign up" ? "/api/auth/signup" : "/api/auth/login";
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.status === 429) {
      const retryAfter = parseInt(res.headers.get("Retry-After")) || 600;
      const expiry = Date.now() + retryAfter * 1000;
      localStorage.setItem("cooldownExpiry", expiry);
      setCooldown(retryAfter);
      return;
    }

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Something went wrong");
      return;
    }

    console.log("Success", data);
    // navigate("/home") or do whatever
  } catch (error) {
    console.error("Login error", error);
  }
};


<input disabled={cooldown > 0} ... />
...
<button
  type="submit"
  disabled={cooldown > 0}
  className={`py-3 ${
    cooldown > 0
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-gradient-to-r from-purple-400 to-violet-600 hover:opacity-90 cursor-pointer"
  } text-white rounded-md`}
>
  {loginState === "Sign up" ? "Create Account" : "Login"}
</button>


{cooldown > 0 && (
  <p className="text-sm text-red-500 text-center mt-2">
    Too many attempts. Try again in{" "}
    {String(Math.floor(cooldown / 60)).padStart(2, "0")}:
    {String(cooldown % 60).padStart(2, "0")}
  </p>
)}


// Optional UX Enhancements
// Use a toast instead of alert: react-toastify

// Animate the timer countdown using Framer Motion

// Persist cooldown in context/global state if needed across pages