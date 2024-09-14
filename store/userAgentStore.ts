import { proxy } from "valtio";

export interface UserAgentData {
  browser: string;
  os: string;
  device: string;
  iphone: string;
}

export const userAgentStore = proxy<UserAgentData>({
  browser: "",
  os: "",
  device: "",
  iphone: "",
});
