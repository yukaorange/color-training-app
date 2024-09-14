"use client";

import { useEffect } from "react";
import { userAgentStore } from "@/store/userAgentStore";

export const useUserAgent = () => {
  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();

    // ブラウザのチェック
    if (ua.includes("edge") || ua.includes("edga") || ua.includes("edgios")) {
      userAgentStore.browser = "edge";
    } else if (ua.includes("opera") || ua.includes("opr")) {
      userAgentStore.browser = "opera";
    } else if (ua.includes("samsungbrowser")) {
      userAgentStore.browser = "samsung";
    } else if (ua.includes("ucbrowser")) {
      userAgentStore.browser = "uc";
    } else if (ua.includes("chrome") || ua.includes("crios")) {
      userAgentStore.browser = "chrome";
    } else if (ua.includes("firefox") || ua.includes("fxios")) {
      userAgentStore.browser = "firefox";
    } else if (ua.includes("safari")) {
      userAgentStore.browser = "safari";
    } else if (ua.includes("msie") || ua.includes("trident")) {
      userAgentStore.browser = "ie";
      alert("このブラウザは現在サポートされておりません。");
    }

    // OSのチェック
    if (ua.includes("windows nt")) {
      userAgentStore.os = "windows";
    } else if (ua.includes("android")) {
      userAgentStore.os = "android";
    } else if (ua.includes("iphone") || ua.includes("ipad")) {
      userAgentStore.os = "ios";
    } else if (ua.includes("mac os x")) {
      userAgentStore.os = "macos";
    }

    // デバイスのチェック
    if (
      ua.includes("iphone") ||
      (ua.includes("android") && ua.includes("mobile"))
    ) {
      userAgentStore.device = "mobile";
    } else if (ua.includes("ipad") || ua.includes("android")) {
      userAgentStore.device = "tablet";
    } else if (
      ua.includes("ipad") ||
      (ua.includes("macintosh") && "ontouchend" in document)
    ) {
      userAgentStore.device = "tablet";
    } else {
      userAgentStore.device = "pc";
    }

    // iPhoneのチェック
    if (ua.includes("iphone")) {
      userAgentStore.iphone = "iphone";
    }

    // bodyにクラスを追加
    Object.values(userAgentStore).forEach((value) => {
      if (value) document.body.classList.add(value);
    });
  }, []);
};
