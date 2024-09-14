'use client';

import '@/components/Layout/Header/styles/header.scss';
import '@/components/Layout/Header/styles/icon-user.scss';
import '@/components/Layout/Header/styles/icon-setting.scss';

import Image from 'next/image';
import Link from 'next/link';

export const Header = () => {
  return (
    <header className="header">
      <div className="header__inner">
        <Link href="/" className="header__title-logo">
          <div className="header__title _en">Color Training</div>
          <div className="header__logo">
            <Logo />
          </div>
        </Link>
        <div className="header__buttons">
          <UserIcon />
          <SettingIcon />
        </div>
      </div>
    </header>
  );
};

const Logo = () => {
  return <Image src="/images/header/logo.svg" alt="to be muscle" width={72} height={72} />;
};

const UserIcon = () => {
  return (
    <svg
      className="icon-user"
      width="72"
      height="80"
      viewBox="0 0 72 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* <rect x="0.5" y="0.5" width="71" height="79" stroke="#0D0D0D" /> */}
      <path
        d="M48 29C48 35.6274 42.6273 41 36 41C29.3726 41 24 35.6274 24 29C24 22.3726 29.3726 17 36 17C42.6273 17 48 22.3726 48 29Z"
        fill="#A2A2A2"
        stroke="#0D0D0D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36 47C26.0589 47 18 54.1634 18 63H54C54 54.1634 45.9411 47 36 47Z"
        fill="#A2A2A2"
        stroke="#0D0D0D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const SettingIcon = () => {
  return (
    <>
      <div className="icon-setting">
        <Image
          className="icon-setting__icon"
          src="/images/header/icon-vector-gear.svg"
          alt="setting"
          width={40}
          height={40}
        />
        <div className="icon-setting__text _en">setting</div>
      </div>
    </>
  );
};
