import '@/components/Editor/ButtonFooter/styles/button-footer.scss';

import Image from 'next/image';
import Link from 'next/link';

export const ButtonFooter = () => {
  return (
    <Link href="/archive" className="button-footer">
      <div className="button-footer__text _en">Archive</div>
      <div className="button-footer__icon">
        <Image src="/images/editor/arrow-down.svg" alt="" width={24} height={24} />
      </div>
    </Link>
  );
};
