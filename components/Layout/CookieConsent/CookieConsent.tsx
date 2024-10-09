import '@/components/Layout/CookieConsent/styles/window-cookie.scss';
import '@/components/Layout/CookieConsent/styles/button-cookie.scss';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // localStorage.clear(); //開発中のみ
    const checkConsent = () => {
      try {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
          setShowConsent(true);
        }
      } catch (err) {
        try {
          const consent = sessionStorage.getItem('cookieConsent');
          console.warn(err);

          if (!consent) {
            setShowConsent(true);
          }
        } catch (err) {
          setShowConsent(true);
          console.warn(err);
        }
      }
    };
    checkConsent();
  }, []);

  const acceptCookies = () => {
    try {
      localStorage.setItem('cookieConsent', 'true');
    } catch (err) {
      console.warn(err);
      try {
        sessionStorage.setItem('cookieConsent', 'true');
      } catch (err) {
        console.warn('Unable to store cookie consent.', err);
      }
    }
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div role="alert" aria-live="polite" className="window-cookie">
      <div className="window-cookie__inner">
        <p className="window-cookie__text">
          このサイトでは、ユーザー体験の向上とサービスの提供のためにCookieを使用しています。
          <br />
          サイトを利用することで、Cookieの使用に同意したことになります。
        </p>
        <Link href="/privacypolicy" className="window-cookie__link">
          プライバシーポリシーを読む
        </Link>
        <div className="window-cookie__buttons">
          <button onClick={acceptCookies} className="button-cookie">
            同意する
          </button>
          <button
            onClick={() => setShowConsent(false)}
            className="button-cookie button-cookie--close"
            aria-label="Close cookie consent"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
