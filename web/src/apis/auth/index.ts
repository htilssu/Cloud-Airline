import axios from "@/lib/axios";
import Cookies from "js-cookie";
import { useAuthStore } from "@/stores/auth-store";
import { SignUpSchema } from "@/lib/validators/auth";

const setAuthenticated = useAuthStore.getState ().setIsAuthenticated

class AuthApis {
//   POST
  async signUp({ email, password, name, phone }: SignUpSchema) {
    try {
      const res = await axios.post ('/auth/register', { email, password, full_name : name, phone_number : phone });
      Cookies.set ("authToken", res.data.accessToken, { expires : 7 })
      setAuthenticated (true)
      return res.data
    } catch (error: any) {
      console.error (error.message);
      throw error;
    }
  }

  async signIn({ email, password }: { email: string, password: string }) {
    try {
      const res = await axios.post ('/auth/login', { email, password })
      Cookies.set ("authToken", res.data.accessToken, { expires : 7 })
      setAuthenticated (true)
      return res.data
    } catch (error: any) {
      console.error (error)
      throw error;
    }
  }
}

export const authApis = new AuthApis ();
