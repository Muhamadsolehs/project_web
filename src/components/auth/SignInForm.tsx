import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { supabase } from "../../lib/supabaseclient";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const loginUser = async (table: string) => {
    console.log(`🔍 Mencoba login ke tabel: ${table}`);
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("username", username.trim())
      .eq("password", password)
      .single();

    console.log(`📡 Response ${table}:`, { data, error });
    return { data, error };
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("🚀 Fungsi handleLogin terpanggil");

    try {
      // Jalankan pencarian di tabel admin dan pengajar
      const [adminRes, pengajarRes] = await Promise.all([
        loginUser("admin"),
        loginUser("pengajar"),
      ]);

      if (adminRes.data) {
        console.log("✅ Login sebagai Admin");
        localStorage.setItem("user_role", "admin");
        localStorage.setItem("username", adminRes.data.username);
        window.location.href = "/Admin/Home"; // ⬅️ redirect manual
        return;
      }

      if (pengajarRes.data) {
        console.log("✅ Login sebagai Pengajar");
        localStorage.setItem("user_role", "pengajar");
        localStorage.setItem("username", pengajarRes.data.username);
        window.location.href = "/pengajar/dashboard"; // ⬅️ redirect manual
        return;
      }

      console.warn("❌ Username atau password salah");
      alert("Username atau password salah.");
    } catch (err) {
      console.error("🔥 Login error:", err);
      alert("Terjadi kesalahan saat login. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your username and password to sign in!
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="space-y-6">
              {/* Username */}
              <div>
                <Label>
                  Username <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>

              {/* Keep me logged in */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                    Keep me logged in
                  </span>
                </div>
                <a
                  href="/reset-password"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Forgot password?
                </a>
              </div>

              {/* Button Login */}
              <div>
                <Button
                  type="submit" // ✅ inilah kunci utama
                  className="w-full"
                  size="sm"
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Don&apos;t have an account?{" "}
              <a
                href="/signup"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Hubungi Admin
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
