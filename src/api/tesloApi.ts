import { env } from "@/lib/utils/env";
import axios from "axios";

const tesloApi = axios.create({
  baseURL: env.VITE_TESLO_API_URL,
});

export { tesloApi };
