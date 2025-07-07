import axios from "@/lib/axios";

class AuthApis {
//   POST
  async signIn({ email, password }: { email: string, password: string }) {
    const res = await axios.post ('/auth/login', { email, password })
    return res.data
  }
}

export const authApis = new AuthApis ();
